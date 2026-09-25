# omeka-s-theme-bs5

Omeka S 4.2 用の Bootstrap 5 テーマ。
app.toyobunko-lab.jp（main / manuscript_kanjur）で使っていた
[Omeka-S-theme-Bootstrap5](https://github.com/ldasjp8/Omeka-S-theme-Bootstrap5)（4.0.2）の見た目を保ったまま、
Omeka S 4.2.1 の本体テンプレートを土台に作り直したもの。

## 作り方の約束

- `view/` の本体由来のファイルは、最初のコミットで **Omeka S 4.2.1 の原本をそのまま** 入れてある。
  以後の変更は `git log -p -- view/<path>` で「本体から何を変えたか」が読める
- Bootstrap は CSS だけを `asset/vendor/bootstrap/` に同梱する（CDN から読まない）。
  Bootstrap の JavaScript は使わない（ダイアログは `<dialog>`、メニュー開閉は `asset/js/theme.js`）
- テーマ設定の項目名は旧テーマと同じ。ただし保存先の名前はテーマのフォルダ名で決まるため、
  旧テーマ（`theme_settings_omeka-s-theme-bootstrap5`）の値は移行時に写す必要がある

## 必要なもの

- Omeka S ^4.1（4.2.1 で確認）

## ライセンス

GPLv3（Omeka S の本体テンプレートを含むため）。
同梱物: Bootstrap（MIT）、Font Awesome Free（アイコン CC BY 4.0 / フォント SIL OFL 1.1 / コード MIT）。
