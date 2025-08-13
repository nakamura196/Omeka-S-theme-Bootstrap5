/**
 * Search View Toggle (Grid/List) JavaScript
 */

// 動的に挿入されるスタイル要素を管理するための変数
let dynamicStyleElement = null;

// 即座に実行：ページロード前にCSSとボタン状態を設定してちらつきを防ぐ
(function() {
    const savedView = localStorage.getItem('searchViewMode') || 'grid';
    
    // CSSを即座に適用
    if (savedView === 'list') {
        dynamicStyleElement = document.createElement('style');
        dynamicStyleElement.id = 'search-view-dynamic-style';
        dynamicStyleElement.textContent = `
            .search-results-list .row.g-4 { display: none !important; }
            .search-results-list .list-group { display: block !important; }
        `;
        document.head.appendChild(dynamicStyleElement);
    }
    
    // ボタンの状態も即座に設定するCSSを追加
    const buttonStyleElement = document.createElement('style');
    buttonStyleElement.id = 'search-button-dynamic-style';
    buttonStyleElement.textContent = `
        [data-view="${savedView}"] {
            background-color: var(--bs-primary) !important;
            border-color: var(--bs-primary) !important;
            color: var(--bs-white) !important;
        }
        [data-view="${savedView === 'grid' ? 'list' : 'grid'}"] {
            background-color: transparent !important;
            border-color: var(--bs-secondary) !important;
            color: var(--bs-secondary) !important;
        }
    `;
    document.head.appendChild(buttonStyleElement);
})();

document.addEventListener('DOMContentLoaded', function() {
    // ボタンとコンテナの要素を取得
    const gridButton = document.querySelector('[data-view="grid"]');
    const listButton = document.querySelector('[data-view="list"]');
    const searchResultsContainer = document.querySelector('.search-results-list');
    
    if (!gridButton || !listButton || !searchResultsContainer) {
        return; // 必要な要素がない場合は終了
    }
    
    // 現在のビューモードを取得（デフォルトはgrid）
    let currentView = localStorage.getItem('searchViewMode') || 'grid';
    
    // 初期状態を設定（クラスベースで）
    setViewModeImmediate(currentView);
    
    // グリッドボタンのクリックイベント
    gridButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentView !== 'grid') {
            currentView = 'grid';
            setViewMode('grid');
            localStorage.setItem('searchViewMode', 'grid');
        }
    });
    
    // リストボタンのクリックイベント
    listButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentView !== 'list') {
            currentView = 'list';
            setViewMode('list');
            localStorage.setItem('searchViewMode', 'list');
        }
    });
    
    /**
     * 動的CSSを更新する関数
     * @param {string} mode - 'grid' または 'list'
     */
    function updateDynamicCSS(mode) {
        // 既存の動的スタイルを削除
        if (dynamicStyleElement) {
            dynamicStyleElement.remove();
            dynamicStyleElement = null;
        }
        
        // 新しい動的スタイルを作成（必要な場合のみ）
        if (mode === 'list') {
            dynamicStyleElement = document.createElement('style');
            dynamicStyleElement.id = 'search-view-dynamic-style';
            dynamicStyleElement.textContent = `
                .resource-list.search-results-list .row.g-4 { display: none !important; }
                .resource-list.search-results-list .list-group { display: block !important; }
            `;
            document.head.appendChild(dynamicStyleElement);
        }
        
        // ボタンの状態も更新
        const buttonStyleElement = document.getElementById('search-button-dynamic-style');
        if (buttonStyleElement) {
            buttonStyleElement.textContent = `
                [data-view="${mode}"] {
                    background-color: var(--bs-primary) !important;
                    border-color: var(--bs-primary) !important;
                    color: var(--bs-white) !important;
                }
                [data-view="${mode === 'grid' ? 'list' : 'grid'}"] {
                    background-color: transparent !important;
                    border-color: var(--bs-secondary) !important;
                    color: var(--bs-secondary) !important;
                }
            `;
        }
    }
    
    /**
     * ビューモードを即座に設定する関数（初期化用、アニメーションなし）
     * @param {string} mode - 'grid' または 'list'
     */
    function setViewModeImmediate(mode) {
        // 動的CSSを更新
        updateDynamicCSS(mode);
        
        // クラスをリセット
        searchResultsContainer.classList.remove('view-grid', 'view-list');
        
        // 新しいクラスを追加
        searchResultsContainer.classList.add('view-' + mode);
        
        // ボタンのアクティブ状態を更新
        gridButton.classList.toggle('active', mode === 'grid');
        listButton.classList.toggle('active', mode === 'list');
    }
    
    /**
     * ビューモードを設定する関数（アニメーション付き）
     * @param {string} mode - 'grid' または 'list'
     */
    function setViewMode(mode) {
        // アニメーション開始
        searchResultsContainer.classList.add('transitioning');
        
        setTimeout(function() {
            // 動的CSSを更新
            updateDynamicCSS(mode);
            
            // クラスをリセット
            searchResultsContainer.classList.remove('view-grid', 'view-list');
            
            // 新しいクラスを追加
            searchResultsContainer.classList.add('view-' + mode);
            
            // ボタンのアクティブ状態を更新
            gridButton.classList.toggle('active', mode === 'grid');
            listButton.classList.toggle('active', mode === 'list');
            
            // アニメーション終了
            searchResultsContainer.classList.remove('transitioning');
        }, 100);
    }
});
