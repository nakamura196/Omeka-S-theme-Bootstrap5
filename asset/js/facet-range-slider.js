/**
 * Modern Date Range Slider JavaScript for Bootstrap 5 Theme
 */

document.addEventListener('DOMContentLoaded', function() {
    // 既存のsearch.jsとの競合を避けるため、初期化を遅延
    setTimeout(function() {
        // すべての範囲スライダーを初期化（facetとadvanced search両方に対応）
        const rangeContainers = document.querySelectorAll('.facet-range-double, .range-doubleform-control');
        
        rangeContainers.forEach(container => {
            // 既に初期化されている場合はスキップ
            if (!container.hasAttribute('data-initialized')) {
                initializeRangeSlider(container);
                container.setAttribute('data-initialized', 'true');
            }
        });
    }, 100);
    
    function initializeRangeSlider(container) {
        // 要素の存在確認を強化
        const fromSlider = container.querySelector('.range-slider-from');
        const toSlider = container.querySelector('.range-slider-to');
        const fromInput = container.querySelector('.range-numeric-from');
        const toInput = container.querySelector('.range-numeric-to');
        
        // いずれかの要素が見つからない場合は処理をスキップ
        if (!fromSlider || !toSlider || !fromInput || !toInput) {
            console.warn('Range slider elements not found in container:', container);
            return;
        }
        
        // 既存のイベントリスナーをクリア（重複防止）
        const newFromSlider = fromSlider.cloneNode(true);
        const newToSlider = toSlider.cloneNode(true);
        fromSlider.parentNode.replaceChild(newFromSlider, fromSlider);
        toSlider.parentNode.replaceChild(newToSlider, toSlider);
        
        // 新しい要素を参照
        const fromSliderEl = newFromSlider;
        const toSliderEl = newToSlider;
        
        const min = parseFloat(fromSliderEl.min);
        const max = parseFloat(fromSliderEl.max);
        
        // スライダーの背景グラデーションを更新
        function updateSliderBackground() {
            const fromValue = parseFloat(fromSliderEl.value);
            const toValue = parseFloat(toSliderEl.value);
            
            const fromPercent = ((fromValue - min) / (max - min)) * 100;
            const toPercent = ((toValue - min) / (max - min)) * 100;
            
            // アクティブ範囲を視覚化
            const gradient = `linear-gradient(to right, 
                #e9ecef 0%, 
                #e9ecef ${fromPercent}%, 
                #0d6efd ${fromPercent}%, 
                #0d6efd ${toPercent}%, 
                #e9ecef ${toPercent}%, 
                #e9ecef 100%)`;
            
            toSliderEl.style.background = gradient;
        }
        
        // 値の検証と調整
        function validateRange() {
            let fromValue = parseFloat(fromSliderEl.value);
            let toValue = parseFloat(toSliderEl.value);
            
            // fromがtoより大きい場合は入れ替え
            if (fromValue > toValue) {
                [fromValue, toValue] = [toValue, fromValue];
                fromSliderEl.value = fromValue;
                toSliderEl.value = toValue;
                fromInput.value = fromValue;
                toInput.value = toValue;
            }
            
            updateSliderBackground();
            updateRangeDisplay(container, fromValue, toValue);
        }
        
        // 範囲表示を更新
        function updateRangeDisplay(container, fromValue, toValue) {
            // 年の範囲を表示（オプション）
            container.setAttribute('data-range', `${Math.round(fromValue)} - ${Math.round(toValue)}`);
            
            // アクセシビリティ用のaria-label更新
            fromSliderEl.setAttribute('aria-valuemin', min);
            fromSliderEl.setAttribute('aria-valuemax', max);
            fromSliderEl.setAttribute('aria-valuenow', fromValue);
            toSliderEl.setAttribute('aria-valuemin', min);
            toSliderEl.setAttribute('aria-valuemax', max);
            toSliderEl.setAttribute('aria-valuenow', toValue);
        }
        
        // スライダーイベント
        fromSliderEl.addEventListener('input', function() {
            fromInput.value = this.value;
            validateRange();
        });
        
        toSliderEl.addEventListener('input', function() {
            toInput.value = this.value;
            validateRange();
        });
        
        // 数値入力イベント
        fromInput.addEventListener('change', function() {
            let value = parseFloat(this.value);
            value = Math.max(min, Math.min(max, value));
            this.value = value;
            fromSliderEl.value = value;
            validateRange();
        });
        
        toInput.addEventListener('change', function() {
            let value = parseFloat(this.value);
            value = Math.max(min, Math.min(max, value));
            this.value = value;
            toSliderEl.value = value;
            validateRange();
        });
        
        // Enterキーでフォーム送信
        [fromInput, toInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const submitBtn = container.querySelector('.range-double-submit');
                    if (submitBtn) {
                        submitBtn.click();
                    } else {
                        // フォームを送信
                        const form = this.closest('form');
                        if (form) form.submit();
                    }
                }
            });
        });
        
        // 初期化
        updateSliderBackground();
        updateRangeDisplay(container, parseFloat(fromSliderEl.value), parseFloat(toSliderEl.value));
        
        // アニメーション効果を追加
        addSliderAnimations(fromSliderEl, toSliderEl);
    }
    
    // スライダーのアニメーション効果
    function addSliderAnimations(fromSlider, toSlider) {
        [fromSlider, toSlider].forEach(slider => {
            slider.addEventListener('mousedown', function() {
                this.classList.add('active');
            });
            
            slider.addEventListener('mouseup', function() {
                this.classList.remove('active');
            });
            
            slider.addEventListener('touchstart', function() {
                this.classList.add('active');
            });
            
            slider.addEventListener('touchend', function() {
                this.classList.remove('active');
            });
        });
    }
    
    // リセット機能（オプション）
    const resetButtons = document.querySelectorAll('.facet-range-reset');
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.facet-range-double');
            if (!container) return;
            
            const fromSlider = container.querySelector('.range-slider-from');
            const toSlider = container.querySelector('.range-slider-to');
            const fromInput = container.querySelector('.range-numeric-from');
            const toInput = container.querySelector('.range-numeric-to');
            
            if (fromSlider && toSlider && fromInput && toInput) {
                fromSlider.value = fromSlider.min;
                toSlider.value = toSlider.max;
                fromInput.value = fromSlider.min;
                toInput.value = toSlider.max;
                
                // 背景を更新
                const event = new Event('input');
                fromSlider.dispatchEvent(event);
            }
        });
    });
});

// スムーズなトランジション用のCSS追加
const style = document.createElement('style');
style.textContent = `
    .range-sliders input[type="range"].active::-webkit-slider-thumb {
        transform: scale(1.2);
    }
    .range-sliders input[type="range"].active::-moz-range-thumb {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);