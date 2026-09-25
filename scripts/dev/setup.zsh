#!/usr/bin/env zsh
# テーマ確認用の Omeka S 4.2.1 を ddev で立ち上げる。
#
# 前提: ddev と Docker が動いていること。python3 に requests と playwright があること。
# 使い方: zsh scripts/dev/setup.zsh
# 何をするか:
#   1. Omeka S 4.2.1 の公式 zip を .dev/ に取得し、GitHub が公開しているハッシュと照合して展開
#   2. .dev/omeka-s/themes/omeka-s-theme-bs5 をこのリポジトリへのリンクにする（編集がそのまま反映される）
#      あわせて、画像ビューアの代役モジュール（scripts/dev/modules/DevIiifViewers）をつなぐ
#   3. ddev（プロジェクト名 toyotheme）を起動
#   4. scripts/dev/seed.py で、インストールと本番（app.toyobunko-lab.jp）からの少量のデータ取り込みを行う
#      本番へは公開 API の読み取りだけで、書き込みはしない
# 2 回目以降は、済んでいる段階を飛ばす。やり直すときは `ddev delete -Oy toyotheme && rm -rf .dev`。
set -euo pipefail

ROOT=${0:A:h:h:h}
DEV=$ROOT/.dev
VERSION=4.2.1
ZIP_SHA256=cc27d1c7aca0209523d19aa285f4a08e29e34950dcc446951a7c1311de348e82

mkdir -p $DEV
if [[ ! -d $DEV/omeka-s ]]; then
  curl -sSL -o $DEV/omeka-s.zip https://github.com/omeka/omeka-s/releases/download/v$VERSION/omeka-s-$VERSION.zip
  echo "$ZIP_SHA256  $DEV/omeka-s.zip" | shasum -a 256 -c -
  unzip -q $DEV/omeka-s.zip -d $DEV
  rm $DEV/omeka-s.zip
fi

# Relative link so it also resolves inside the ddev container (the repo root is mounted).
ln -sfn ../../.. $DEV/omeka-s/themes/omeka-s-theme-bs5
# Stand-in for the IIIF viewer modules (see its Module.php).
ln -sfn ../../../scripts/dev/modules/DevIiifViewers $DEV/omeka-s/modules/DevIiifViewers

cat > $DEV/omeka-s/config/database.ini <<'INI'
user     = "db"
password = "db"
dbname   = "db"
host     = "db"
INI

cd $ROOT
if [[ ! -f .ddev/config.yaml ]]; then
  ddev config --project-name=toyotheme --project-type=php --docroot=.dev/omeka-s --php-version=8.3 --database=mariadb:11.8 --webserver-type=apache-fpm
fi
ddev start

URL=$(ddev describe -j | jq -r .raw.primary_url)
python3 $ROOT/scripts/dev/seed.py $URL
ddev mysql -e "INSERT IGNORE INTO module (id, is_active, version) VALUES ('DevIiifViewers', 1, '1.0.0')"

echo "サイト: $URL/s/main"
