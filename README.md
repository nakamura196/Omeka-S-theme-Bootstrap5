# Bootstrap5 Modernized Theme for Omeka S

## About

This repository is the successor to [ldasjp8/Omeka-S-theme-Bootstrap5](https://github.com/ldasjp8/Omeka-S-theme-Bootstrap5).

A modern, responsive theme for Omeka S built with Bootstrap 5, featuring enhanced search capabilities, improved user interface, and mobile-first design.

<img width="1483" height="1299" alt="image" src="https://github.com/user-attachments/assets/3f246a17-6fc5-456e-beaf-ccade065001d" />

## Features

### 🎨 Modern Design
- **Bootstrap 5** integration with responsive grid system
- **Mobile-first** approach with responsive breakpoints
- **Clean typography** and consistent visual hierarchy
- **Card-based layouts** for improved content organization

### 🔍 Enhanced Search Interface
- **Advanced search form** with Bootstrap 5 styling
- **Grid/List view toggle** with localStorage persistence
- **Improved pagination** with compact controls
- **Faceted search** with collapsible filter panels
- **Search results** with modern card and list layouts

### 📱 Responsive Components
- **Navigation bar** with Bootstrap 5 navbar
- **Hero carousel** for homepage banners
- **Modular header/footer** components
- **Breadcrumb navigation** with Bootstrap styling

### 📄 Item Display Improvements
- **Enhanced item details** with sidebar layout
- **Metadata presentation** with Bootstrap cards
- **Media attachments** with thumbnails and download links
- **Resource links** with appropriate icons and styling

### 🎛️ Theme Customization
- **Color picker** for accent colors
- **Logo upload** support
- **Banner configuration** with positioning options
- **Footer content** customization
- **Hero carousel** configuration for multiple slides

## Installation

1. Copy the theme to your Omeka S themes directory:
   ```
   /themes/bootstrap5/
   ```

2. Activate the theme in your Omeka S admin panel:
   - Go to **Sites** → **[Your Site]** → **Theme**
   - Select "Bootstrap5 Modernized"
   - Configure theme settings as needed

## Technical Implementation

### File Structure
```
themes/bootstrap5/
├── asset/
│   ├── css/
│   │   └── search-view-toggle.css     # Grid/List toggle functionality
│   └── js/
│       └── search-view-toggle.js      # View switching logic
├── config/
│   └── theme.ini                      # Theme configuration
├── view/
│   ├── layout/
│   │   └── layout.phtml              # Main layout template
│   ├── common/
│   │   ├── header.phtml              # Bootstrap navbar
│   │   ├── footer.phtml              # Footer component
│   │   ├── hero.phtml                # Hero carousel
│   │   ├── breadcrumbs.phtml         # Breadcrumb navigation
│   │   ├── search-form.phtml         # Search form component
│   │   ├── pagination.phtml          # Bootstrap pagination
│   │   ├── form-row.phtml            # Form styling
│   │   ├── resource-values.phtml     # Metadata display
│   │   └── search-filters-links.phtml # Filter badges
│   ├── search/
│   │   ├── search.phtml              # Search results page
│   │   ├── results.phtml             # Results grid/list layouts
│   │   ├── results-header-footer.phtml # Search controls
│   │   ├── search-form-main.phtml    # Advanced search form
│   │   ├── sort-selector.phtml       # Sort dropdown
│   │   ├── pagination-per-page-selector.phtml # Items per page
│   │   ├── facets-list.phtml         # Faceted search filters
│   │   ├── facet-checkboxes.phtml    # Checkbox facets
│   │   └── facet-actives.phtml       # Active filter badges
│   └── omeka/site/item/
│       └── show.phtml                # Item detail page
└── README.md                         # This file
```

### Key Technologies
- **Bootstrap 5.3.3** - CSS framework and components
- **Font Awesome 6** - Icons and visual elements
- **JavaScript ES6** - Modern browser features
- **CSS Custom Properties** - Bootstrap variable system
- **Responsive Design** - Mobile-first approach

### Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Customization

### Theme Settings
Configure the theme through Omeka S admin panel:

1. **Accent Color**: Primary brand color for links and buttons
2. **Logo**: Upload your organization's logo
3. **Banner**: Homepage hero image
4. **Navigation Depth**: Control menu hierarchy levels
5. **Footer Content**: Custom HTML content for footer
6. **Hero Slides**: Configure carousel titles and descriptions

### CSS Customization
The theme uses Bootstrap 5 CSS custom properties for easy customization:

```css
:root {
  --bs-primary: #your-color;
  --bs-secondary: #your-secondary-color;
}
```

### Advanced Customization
- Override template files by copying to your theme
- Modify CSS variables for color schemes
- Extend JavaScript functionality for custom interactions

## Features in Detail

### Search Interface
- **Grid View**: Card-based layout with large thumbnails
- **List View**: Compact horizontal layout
- **View Persistence**: User preference saved in localStorage
- **Responsive**: Automatic layout adjustment for mobile devices

### Pagination
- **Compact Design**: Page input with navigation buttons
- **Bootstrap Styled**: Consistent with framework design
- **Accessible**: Proper ARIA labels and keyboard navigation

### Faceted Search
- **Bootstrap Cards**: Organized filter groups
- **Collapsible Sections**: Space-efficient interface
- **Active Filter Badges**: Clear indication of applied filters
- **Responsive**: Mobile-friendly accordion layout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## License

This theme is released under the same license as Omeka S.

## Support

For issues and feature requests, please use the GitHub issue tracker.

---

# 日本語ドキュメント

## このプロジェクトについて

このリポジトリは [ldasjp8/Omeka-S-theme-Bootstrap5](https://github.com/ldasjp8/Omeka-S-theme-Bootstrap5) の後継プロジェクトです。

<img width="1483" height="1299" alt="image" src="https://github.com/user-attachments/assets/22781dbc-cae1-4c8e-b6be-76e8c34bdcee" />

## 主な機能

### 🎨 モダンなデザイン
- **Bootstrap 5** レスポンシブグリッドシステムの統合
- **モバイルファースト** レスポンシブブレークポイントによるアプローチ
- **洗練されたタイポグラフィ** 一貫性のあるビジュアル階層
- **カードベースレイアウト** コンテンツの整理が改善

### 🔍 強化された検索インターフェース
- **高度な検索フォーム** Bootstrap 5スタイリング適用
- **グリッド/リスト表示切り替え** localStorageによる設定保持
- **改善されたページネーション** コンパクトなコントロール
- **ファセット検索** 折りたたみ可能なフィルターパネル
- **検索結果** モダンなカードとリストレイアウト

### 📱 レスポンシブコンポーネント
- **ナビゲーションバー** Bootstrap 5ナビバー採用
- **ヒーローカルーセル** ホームページバナー用
- **モジュラー式ヘッダー/フッター** コンポーネント
- **パンくずナビゲーション** Bootstrapスタイリング

### 📄 アイテム表示の改善
- **強化されたアイテム詳細** サイドバーレイアウト
- **メタデータ表示** Bootstrapカードによる表示
- **メディア添付** サムネイルとダウンロードリンク付き
- **リソースリンク** 適切なアイコンとスタイリング

### 🎛️ テーマカスタマイズ
- **カラーピッカー** アクセントカラー設定
- **ロゴアップロード** サポート
- **バナー設定** 位置調整オプション付き
- **フッターコンテンツ** カスタマイズ可能
- **ヒーローカルーセル** 複数スライド設定

## インストール方法

1. テーマをOmeka Sのテーマディレクトリにコピー：
   ```
   /themes/bootstrap5/
   ```

2. Omeka S管理パネルでテーマを有効化：
   - **サイト** → **[あなたのサイト]** → **テーマ** へ移動
   - 「Bootstrap5 Modernized」を選択
   - 必要に応じてテーマ設定を構成

## 技術仕様

### 使用技術
- **Bootstrap 5.3.3** - CSSフレームワークとコンポーネント
- **Font Awesome 6** - アイコンとビジュアル要素
- **JavaScript ES6** - モダンブラウザ機能
- **CSSカスタムプロパティ** - Bootstrap変数システム
- **レスポンシブデザイン** - モバイルファーストアプローチ

### ブラウザサポート
- Chrome/Edge 88以上
- Firefox 85以上
- Safari 14以上
- iOS Safari 14以上
- Android Chrome 88以上

## カスタマイズ

### テーマ設定
Omeka S管理パネルから設定可能：

1. **アクセントカラー**: リンクとボタンのプライマリブランドカラー
2. **ロゴ**: 組織のロゴをアップロード
3. **バナー**: ホームページヒーロー画像
4. **ナビゲーション階層**: メニュー階層レベルの制御
5. **フッターコンテンツ**: フッター用カスタムHTMLコンテンツ
6. **ヒーロースライド**: カルーセルのタイトルと説明を設定

### CSSカスタマイズ
Bootstrap 5のCSSカスタムプロパティを使用した簡単なカスタマイズ：

```css
:root {
  --bs-primary: #あなたの色;
  --bs-secondary: #あなたのセカンダリ色;
}
```

### 高度なカスタマイズ
- テンプレートファイルをコピーしてオーバーライド
- カラースキーム用のCSS変数を修正
- カスタムインタラクション用のJavaScript機能を拡張

## 詳細機能

### 検索インターフェース
- **グリッドビュー**: 大きなサムネイル付きカードベースレイアウト
- **リストビュー**: コンパクトな水平レイアウト
- **表示設定の保持**: ユーザー設定をlocalStorageに保存
- **レスポンシブ**: モバイルデバイス用の自動レイアウト調整

### ページネーション
- **コンパクトデザイン**: ナビゲーションボタン付きページ入力
- **Bootstrapスタイル**: フレームワークデザインとの一貫性
- **アクセシビリティ**: 適切なARIAラベルとキーボードナビゲーション

### ファセット検索
- **Bootstrapカード**: 整理されたフィルターグループ
- **折りたたみ可能セクション**: スペース効率的なインターフェース
- **アクティブフィルターバッジ**: 適用されたフィルターの明確な表示
- **レスポンシブ**: モバイルフレンドリーなアコーディオンレイアウト

## 貢献方法

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を実装
4. 異なるブラウザとデバイスでテスト
5. プルリクエストを送信

## ライセンス

このテーマはOmeka Sと同じライセンスでリリースされています。

## サポート

問題や機能リクエストについては、GitHubのイシュートラッカーをご利用ください。
