"""Install Omeka S in the ddev test environment and copy a small sample of app.toyobunko-lab.jp.

Usage: python3 scripts/dev/seed.py <local base URL>   (called by setup.zsh)

The live site is only read through its public API. Locally, a temporary API key is inserted
into the database for the import and deleted at the end; nothing is written to disk.
Item-set/item counts are kept small (see LIMIT_*) and each item gets at most MEDIA_PER_ITEM
IIIF media, which is enough to check the theme's pages.
"""
import json
import re
import secrets
import subprocess
import sys
from pathlib import Path

import requests

LIVE = "https://app.toyobunko-lab.jp"
SITES = {"main": 1, "manuscript_kanjur": 4}
THEME = "omeka-s-theme-bs5"
LIMIT_ITEMS = 12
MEDIA_PER_ITEM = 3
FOOTER = "Toyo Bunko"
# Block layouts provided by Omeka S core; others come from modules not installed here.
CORE_BLOCKS = {
    "asset", "blockGroup", "browsePreview", "html", "itemShowcase", "itemWithMetadata",
    "lineBreak", "listOfPages", "listOfSites", "media", "oembed", "pageDateTime",
    "pageTitle", "tableOfContents", "heading",
}

ROOT = Path(__file__).resolve().parents[2]
BASE = sys.argv[1].rstrip("/")
CA = subprocess.run(["mkcert", "-CAROOT"], capture_output=True, text=True).stdout.strip() + "/rootCA.pem"

local = requests.Session()
local.verify = CA
live = requests.Session()


def sql(query):
    return subprocess.run(["ddev", "mysql", "-N", "-e", query], cwd=ROOT, check=True,
                          capture_output=True, text=True).stdout.strip()


def php_hash(secret):
    # Pass the secret on stdin so it never appears in a process list.
    return subprocess.run(["ddev", "exec", "php", "-r", "echo password_hash(trim(fgets(STDIN)), PASSWORD_DEFAULT);"],
                          cwd=ROOT, check=True, capture_output=True, text=True,
                          input=secret + "\n").stdout.strip()


def live_get(path, **params):
    r = live.get(f"{LIVE}/api/{path}", params=params, timeout=60)
    r.raise_for_status()
    return r.json()


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
        "settings[installation_title]": "omeka-s-theme-bs5 dev",
        "settings[time_zone]": "Asia/Tokyo", "settings[locale]": "ja",
    })
    del pw
    if "/install" in r.url:
        errors = re.findall(r'<li class="error">(.*?)</li>', r.text, re.S)
        sys.exit("install failed: " + "; ".join(errors))
    print("installed")

if sql("SELECT COUNT(*) FROM site") != "0":
    print("sites already exist; skipping import")
    sys.exit(0)

# 2. Temporary API key for the admin user.
identity, credential = secrets.token_hex(16), secrets.token_urlsafe(24)
sql(f"INSERT INTO api_key (id, owner_id, label, credential_hash, created) "
    f"VALUES ('{identity}', 1, 'seed', '{php_hash(credential)}', NOW())")
KEY = {"key_identity": identity, "key_credential": credential}

try:
    props = {p["o:term"]: p["o:id"] for p in api("GET", "properties", params={"per_page": 1000})}
    classes = {c["o:term"]: c["o:id"] for c in api("GET", "resource_classes", params={"per_page": 1000})}
    skipped_terms = set()

    def values(resource):
        out = {}
        for term, vals in resource.items():
            if ":" not in term or term.startswith("o:") or not isinstance(vals, list):
                continue
            if term not in props:
                skipped_terms.add(term)
                continue
            new = []
            for v in vals:
                base = {"property_id": props[term], "is_public": v.get("is_public", True)}
                if v.get("@id") and v.get("type") == "uri":
                    new.append(base | {"type": "uri", "@id": v["@id"], "o:label": v.get("o:label")})
                elif v.get("@value") is not None:
                    new.append(base | {"type": "literal", "@value": str(v["@value"]),
                                       "@language": v.get("@language")})
                elif v.get("display_title"):  # resource links: keep the title as text
                    new.append(base | {"type": "literal", "@value": v["display_title"]})
            if new:
                out[term] = new
        cls = (resource.get("o:resource_class") or {}).get("@id")
        if cls:
            term = live.get(cls, timeout=60).json().get("o:term")
            if term in classes:
                out["o:resource_class"] = {"o:id": classes[term]}
        return out

    # Top image asset (the live hero background).
    top_image = None
    html = live.get(f"{LIVE}/s/main", timeout=60).text
    m = re.search(r'url\("([^"]+/files/asset/[^"]+)"\)', html)
    if m:
        img = live.get(m.group(1), timeout=60).content
        asset = api("POST", "assets", files={
            "data": (None, json.dumps({"o:name": "top_image"}), "application/json"),
            "file": ("top.jpg", img, "image/jpeg"),
        })
        top_image = asset["o:id"]

    item_set_map = {}
    for slug, live_id in SITES.items():
        live_site = live_get(f"sites/{live_id}")
        site = api("POST", "sites", json={
            "o:slug": slug, "o:title": live_site["o:title"], "o:summary": live_site.get("o:summary"),
            "o:theme": THEME, "o:is_public": True,
        })
        sid = site["o:id"]
        # Production sets a footer (and top image) on main only; kanjur shows the default.
        settings = {"footer": FOOTER if slug == "main" else None, "top_image": top_image if slug == "main" else None}
        sql("INSERT INTO site_setting (id, site_id, value) VALUES "
            f"('theme_settings_{THEME}', {sid}, '{json.dumps(settings)}')")
        # Production has page prev/next links turned off (no .site-page-pagination in its HTML).
        sql(f"INSERT INTO site_setting (id, site_id, value) VALUES ('show_page_pagination', {sid}, 'false')")

        for item in live_get("items", site_id=live_id, per_page=LIMIT_ITEMS):
            sets = []
            for ref in item.get("o:item_set", []):
                lid = ref["o:id"]
                if lid not in item_set_map:
                    live_set = live_get(f"item_sets/{lid}")
                    item_set_map[lid] = api("POST", "item_sets", json=values(live_set) | {"o:is_public": True})["o:id"]
                sets.append({"o:id": item_set_map[lid]})
            media = []
            for ref in item.get("o:media", [])[:MEDIA_PER_ITEM]:
                m = live.get(ref["@id"], timeout=60).json()
                if m.get("o:ingester") == "iiif":
                    media.append({"o:ingester": "iiif", "o:source": m["o:source"]})
            api("POST", "items", json=values(item) | {
                "o:is_public": True, "o:item_set": sets, "o:site": [{"o:id": sid}], "o:media": media,
            })
        print(f"{slug}: items imported")

        # Pages, with module blocks replaced by a placeholder.
        page_map = {}
        for page in live_get("site_pages", site_id=live_id):
            blocks = []
            for b in page.get("o:block", []):
                if b["o:layout"] in CORE_BLOCKS:
                    blocks.append({k: b[k] for k in ("o:layout", "o:data", "o:layout_data") if k in b})
                else:
                    blocks.append({"o:layout": "html", "o:data": {
                        "html": f"<p class=\"text-muted\">[{b['o:layout']}: module not installed in dev]</p>"}})
            new = api("POST", "site_pages", json={
                "o:site": {"o:id": sid}, "o:slug": page["o:slug"], "o:title": page["o:title"],
                "o:is_public": True, "o:block": blocks,
            })
            page_map[page["o:id"]] = new["o:id"]

        nav = []
        for link in live_site.get("o:navigation", []):
            if link["type"] == "page":
                if link["data"]["id"] not in page_map:
                    continue
                link = link | {"data": link["data"] | {"id": page_map[link["data"]["id"]]}}
            nav.append(link | {"links": []})
        home = (live_site.get("o:homepage") or {}).get("o:id")
        api("PATCH", f"sites/{sid}", json={
            "o:navigation": nav, "o:homepage": {"o:id": page_map[home]} if home in page_map else None,
        })
        print(f"{slug}: {len(page_map)} pages")

    if skipped_terms:
        print("properties not in this install (skipped):", ", ".join(sorted(skipped_terms)))
finally:
    sql(f"DELETE FROM api_key WHERE id = '{identity}'")
