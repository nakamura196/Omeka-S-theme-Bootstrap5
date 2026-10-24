"""Install Omeka S and add a small CC BY 4.0 sample for the theme screenshot (theme.jpg).

Usage: python3 scripts/dev/seed_sample.py <local base URL>

The sample is twelve books and maps from the University of Tokyo Agricultural and Life
Sciences Library, published under CC BY 4.0 on the UTokyo Digital Archives Portal.
Each item gets one IIIF image (the page shown in the screenshot); the image itself stays
on the library's IIIF server. A temporary API key is inserted for the import and deleted
at the end.
"""
import json
import re
import secrets
import subprocess
import sys
from pathlib import Path

import requests

THEME = "omeka-s-theme-bs5"
IIIF = "https://iiif.dl.itc.u-tokyo.ac.jp/iiif/"
PORTAL = "https://da.dl.itc.u-tokyo.ac.jp/portal/repo/iiif/"
LIBRARY = "The University of Tokyo Agricultural and Life Sciences Library"
LICENSE = "http://creativecommons.org/licenses/by/4.0/"
CREDIT = (f'Images: {LIBRARY}, '
          f'<a href="{LICENSE}">CC BY 4.0</a>, via the UTokyo Digital Archives Portal.')

# (title, creator, date, IIIF image path, portal manifest id)
ITEMS = [
    ("群芳圖譜 第1輯第1編", "和田英作, 佐藤醇吉", "1919-1920", "agri_waso20201006_re/05_gunbozuhu_01/005.tif", "a2af6812-7fd8-2cf2-759d-11fff8990e95"),
    ("有用植物圖説 圖畫卷1", "田中芳男, 小野職愨", "1891", "agri_waso_re/F_yuuyoushokubutsu_05/012.tif", "5bfde8bf-0b54-7848-97d6-1ee30cf9a645"),
    ("日本菌類圖譜", "農商務省山林局", "1912-1925", "agri_waso20201006_re/04_nihonkinruizuhu_01-04/023.tif", "f9dbea50-3d74-5d6e-03f2-b5bf339b5a2b"),
    ("國牛十圖", "河東牧童甯直麿", "1778", "agriculture_re/kokugyujuzu/kokugyu0012.tif", "d9115c2c-6c49-1f2b-515e-c67ea4332ab9"),
    ("彩色寫生輸出百合花集", "池田次郎吉", "1895", "agri_waso_re/D_yushutsuyuri/006.tif", "627f6b5d-4e4c-81e1-7954-bd451f567a45"),
    ("群芳圖譜 第1輯第4編", "和田英作, 佐藤醇吉", "1919-1920", "agri_waso20201006_re/08_gunbozuhu_04/004.tif", "8d83cc45-79ff-0188-659b-7ca5fd48849e"),
    ("日本森林樹木図譜 第一秩", "白澤保美", "1900-1908", "agri_waso20201006_re/02_nihonshinrinjumokuzuhu_01/026.tif", "2c310bb0-6cb1-4f7b-2b7d-7d6255cf680e"),
    ("東京帝國大學本部構内及農學部建物鳥瞰圖", "東京帝國大學", "1937", "agriculture_re/nou_tatemonochokanzu/0002.tif", "187cc82d-11e6-9912-9dd4-b4cca9b10970"),
    ("禾本科植物彩色圖", "", "Meiji era", "agri_waso_re/C_kahonka/004.tif", "df8094b2-597f-5dcf-6c06-28af31a74c49"),
    ("群芳圖譜 第1輯第7編", "和田英作, 佐藤醇吉", "1919-1920", "agri_waso20201006_re/11_gunbozuhu_07/004.tif", "0717b584-7f27-70c4-70e9-0dfc7ed28f77"),
    ("日本竹類圖譜", "農商務省山林局", "1912", "agri_waso20201006_re/01_nihonchikuruizuhu/004.tif", "c2466a42-0add-7f2b-7d11-58aaebea953f"),
    ("莎草類彩色圖", "東京山林學校", "Meiji era", "agri_waso_re/B_sasouruisaishiki/004.tif", "7a3e0c92-234b-1295-947b-d697d0d6955f"),
]

ROOT = Path(__file__).resolve().parents[2]
BASE = sys.argv[1].rstrip("/")
CA = subprocess.run(["mkcert", "-CAROOT"], capture_output=True, text=True).stdout.strip() + "/rootCA.pem"

local = requests.Session()
local.verify = CA


def sql(query):
    return subprocess.run(["ddev", "mysql", "-N", "-e", query], cwd=ROOT, check=True,
                          capture_output=True, text=True).stdout.strip()


def php_hash(secret):
    # Pass the secret on stdin so it never appears in a process list.
    return subprocess.run(["ddev", "exec", "php", "-r", "echo password_hash(trim(fgets(STDIN)), PASSWORD_DEFAULT);"],
                          cwd=ROOT, check=True, capture_output=True, text=True,
                          input=secret + "\n").stdout.strip()


def api(method, path, **kw):
    r = local.request(method, f"{BASE}/api/{path}", params={**KEY, **kw.pop("params", {})}, timeout=300, **kw)
    if not r.ok:
        raise RuntimeError(f"{method} {path}: {r.status_code} {r.text[:300]}")
    return r.json()


# 1. Install (skipped when already installed).
if sql("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user'") == "0":
    pw = secrets.token_urlsafe(24)
    r = local.post(BASE + "/install", data={
        "user[email]": "dev@example.com", "user[email-confirm]": "dev@example.com",
        "user[name]": "dev",
        "user[password-confirm][password]": pw,
        "user[password-confirm][password-confirm]": pw,
        "settings[installation_title]": "omeka-s-theme-bs5 sample",
        "settings[time_zone]": "UTC", "settings[locale]": "",
    })
    del pw
    if "/install" in r.url:
        errors = re.findall(r'<li class="error">(.*?)</li>', r.text, re.S)
        sys.exit("install failed: " + "; ".join(errors))
    print("installed")

if sql("SELECT COUNT(*) FROM site") != "0":
    print("site already exists; skipping import")
    sys.exit(0)

# 2. Temporary API key for the admin user.
identity, credential = secrets.token_hex(16), secrets.token_urlsafe(24)
sql(f"INSERT INTO api_key (id, owner_id, label, credential_hash, created) "
    f"VALUES ('{identity}', 1, 'seed', '{php_hash(credential)}', NOW())")
KEY = {"key_identity": identity, "key_credential": credential}

try:
    props = {p["o:term"]: p["o:id"] for p in api("GET", "properties", params={"per_page": 1000})}

    def lit(term, value):
        return {term: [{"property_id": props[term], "type": "literal", "@value": value}]} if value else {}

    def uri(term, value, label):
        return {term: [{"property_id": props[term], "type": "uri", "@id": value, "o:label": label}]}

    site = api("POST", "sites", json={
        "o:slug": "main", "o:title": "Botanical Illustrations",
        "o:summary": f"A sample collection for the Bootstrap 5 theme. {CREDIT}",
        "o:theme": THEME, "o:is_public": True,
    })
    sid = site["o:id"]
    # The footer HTML has quotes, which json.dumps escapes with backslashes; MySQL would eat them.
    settings = json.dumps({"footer": CREDIT}).replace("\\", "\\\\")
    sql(f"INSERT INTO site_setting (id, site_id, value) VALUES ('theme_settings_{THEME}', {sid}, '{settings}')")

    item_set = api("POST", "item_sets", json=lit("dcterms:title", "Botanical illustrations") | {"o:is_public": True})
    sql(f"INSERT INTO site_item_set (site_id, item_set_id, position) VALUES ({sid}, {item_set['o:id']}, 1)")

    # Add in reverse so the newest-first browse page shows ITEMS in the listed order.
    for title, creator, date, path, pid in reversed(ITEMS):
        api("POST", "items", json=(
            lit("dcterms:title", title) | lit("dcterms:creator", creator) | lit("dcterms:date", date)
            | lit("dcterms:publisher", LIBRARY) | uri("dcterms:rights", LICENSE, "CC BY 4.0")
            | uri("dcterms:source", f"{PORTAL}{pid}/manifest", "UTokyo Digital Archives Portal")
        ) | {
            "o:is_public": True, "o:item_set": [{"o:id": item_set["o:id"]}], "o:site": [{"o:id": sid}],
            "o:media": [{"o:ingester": "iiif", "o:source": f"{IIIF}{path}/info.json"}],
        })
    print(f"{len(ITEMS)} items imported")

    api("PATCH", f"sites/{sid}", json={"o:navigation": [
        {"type": "browse", "data": {"label": "Items", "query": ""}, "links": []},
        {"type": "browseItemSets", "data": {"label": "Collections", "query": ""}, "links": []},
    ]})
finally:
    sql(f"DELETE FROM api_key WHERE id = '{identity}'")
