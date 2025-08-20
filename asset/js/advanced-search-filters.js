/**
 * Advanced Search Filters - Enhanced JavaScript for Bootstrap 5
 */

document.addEventListener('DOMContentLoaded', function() {
    // 翻訳関数（Omeka Sのグローバル翻訳関数を使用）
    const translate = window.Omeka && window.Omeka.jsTranslate ? window.Omeka.jsTranslate : function(str) { return str; };
    // フィルター追加・削除機能
    const filterSections = document.querySelectorAll('.filter-fieldset-section');
    
    filterSections.forEach(section => {
        const addBtn = section.querySelector('.add-filter-btn');
        const container = section.querySelector('.filter-fields-container');
        
        if (addBtn && container) {
            // フィルター追加
            addBtn.addEventListener('click', function() {
                const existingRows = container.querySelectorAll('.filter-field-row');
                const lastRow = existingRows[existingRows.length - 1];
                
                if (lastRow) {
                    const newRow = lastRow.cloneNode(true);
                    const input = newRow.querySelector('input[type="text"]');
                    
                    // 入力値をクリア
                    if (input) {
                        input.value = '';
                        // name属性を更新（インデックスをインクリメント）
                        const currentName = input.getAttribute('name');
                        if (currentName) {
                            const match = currentName.match(/\[(\d+)\]/);
                            if (match) {
                                const newIndex = parseInt(match[1]) + 1;
                                const newName = currentName.replace(/\[\d+\]/, '[' + newIndex + ']');
                                input.setAttribute('name', newName);
                            }
                        }
                    }
                    
                    // 削除ボタンを追加（まだない場合）
                    let removeBtn = newRow.querySelector('.remove-filter-btn');
                    if (!removeBtn) {
                        const btnCol = document.createElement('div');
                        btnCol.className = 'col-md-2';
                        btnCol.innerHTML = `
                            <button type="button" class="btn btn-sm btn-outline-danger remove-filter-btn w-100" title="Remove filter">
                                <i class="bi bi-trash"></i>
                            </button>
                        `;
                        newRow.querySelector('.row').appendChild(btnCol);
                    }
                    
                    // アニメーションクラスを追加
                    newRow.classList.add('adding');
                    container.appendChild(newRow);
                    
                    // アニメーション後にクラスを削除
                    setTimeout(() => {
                        newRow.classList.remove('adding');
                    }, 300);
                    
                    // フォーカスを新しい入力フィールドに設定
                    if (input) {
                        input.focus();
                    }
                }
            });
            
            // フィルター削除（イベント委譲）
            container.addEventListener('click', function(e) {
                if (e.target.closest('.remove-filter-btn')) {
                    const row = e.target.closest('.filter-field-row');
                    if (row) {
                        // 最低1つは残す
                        const remainingRows = container.querySelectorAll('.filter-field-row');
                        if (remainingRows.length > 1) {
                            row.classList.add('removing');
                            setTimeout(() => {
                                row.remove();
                            }, 300);
                        }
                    }
                }
            });
        }
    });
    
    // 入力フィールドのプレースホルダー改善
    document.querySelectorAll('.filter-fieldset-section input[type="text"]').forEach(input => {
        if (!input.placeholder || input.placeholder === '') {
            // nameが"filter[x]"の場合は適切なプレースホルダーを設定
            if (input.name && input.name.startsWith('filter[')) {
                input.placeholder = translate('Enter filter keyword...');
            } else {
                const label = input.closest('.filter-field-row')?.querySelector('.form-label');
                const labelText = label ? label.textContent.trim() : 'search term';
                input.placeholder = translate('Enter') + ' ' + labelText.toLowerCase() + '...';
            }
        }
    });
    
    // エンターキーでの送信サポート
    document.querySelectorAll('.filter-fieldset-section input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const form = this.closest('form');
                if (form) {
                    // フォームの送信ボタンをクリック
                    const submitBtn = form.querySelector('[type="submit"]') || 
                                     document.querySelector('[form="' + form.id + '"][type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }
            }
        });
    });
    
    // 複数選択セレクトボックスの改善
    document.querySelectorAll('.multiselect-wrapper select[multiple]').forEach(select => {
        // 選択された項目数を表示
        function updateSelectionCount() {
            const selectedCount = select.selectedOptions.length;
            let countDisplay = select.parentElement.querySelector('.selection-count');
            
            if (!countDisplay) {
                countDisplay = document.createElement('div');
                countDisplay.className = 'selection-count badge bg-primary mt-2';
                select.parentElement.appendChild(countDisplay);
            }
            
            if (selectedCount > 0) {
                countDisplay.textContent = selectedCount + ' ' + translate('selected');
                countDisplay.style.display = 'inline-block';
            } else {
                countDisplay.style.display = 'none';
            }
        }
        
        select.addEventListener('change', updateSelectionCount);
        updateSelectionCount();
        
        // Ctrl+Aで全選択、Ctrl+Shift+Aで全解除
        select.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    const selectAll = !e.shiftKey;
                    
                    Array.from(select.options).forEach(option => {
                        option.selected = selectAll;
                    });
                    
                    updateSelectionCount();
                    select.dispatchEvent(new Event('change'));
                }
            }
        });
        
        // クリア/全選択ボタンを追加
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group btn-group-sm mt-2 w-100';
        buttonGroup.innerHTML = `
            <button type="button" class="btn btn-outline-secondary select-all-btn">
                <i class="bi bi-check-all"></i> ${translate('Select All')}
            </button>
            <button type="button" class="btn btn-outline-secondary clear-all-btn">
                <i class="bi bi-x-circle"></i> ${translate('Clear All')}
            </button>
        `;
        
        // selectの後に配置
        select.parentElement.appendChild(buttonGroup);
        
        buttonGroup.querySelector('.select-all-btn').addEventListener('click', function() {
            Array.from(select.options).forEach(option => option.selected = true);
            updateSelectionCount();
        });
        
        buttonGroup.querySelector('.clear-all-btn').addEventListener('click', function() {
            Array.from(select.options).forEach(option => option.selected = false);
            updateSelectionCount();
        });
    });
    
    // ラジオボタングループの改善
    document.querySelectorAll('.radio-group-section').forEach(section => {
        const radios = section.querySelectorAll('input[type="radio"]');
        
        // ラジオボタンにキーボードナビゲーション追加
        radios.forEach((radio, index) => {
            radio.addEventListener('keydown', function(e) {
                let targetIndex = index;
                
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    targetIndex = (index + 1) % radios.length;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    targetIndex = (index - 1 + radios.length) % radios.length;
                }
                
                if (targetIndex !== index) {
                    radios[targetIndex].focus();
                    radios[targetIndex].checked = true;
                }
            });
        });
    });
});