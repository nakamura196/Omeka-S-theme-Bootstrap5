/**
 * Modern Date Range Slider JavaScript for Bootstrap 5 Theme
 */

document.addEventListener('DOMContentLoaded', function() {
    // すべての範囲スライダーを初期化
    const rangeContainers = document.querySelectorAll('.facet-range-double');
    
    rangeContainers.forEach(container => {
        initializeRangeSlider(container);
    });
    
    function initializeRangeSlider(container) {
        const fromSlider = container.querySelector('.range-slider-from');
        const toSlider = container.querySelector('.range-slider-to');
        const fromInput = container.querySelector('.range-numeric-from');
        const toInput = container.querySelector('.range-numeric-to');
        
        if (!fromSlider || !toSlider || !fromInput || !toInput) return;
        
        const min = parseFloat(fromSlider.min);
        const max = parseFloat(fromSlider.max);
        
        // スライダーの背景グラデーションを更新
        function updateSliderBackground() {
            const fromValue = parseFloat(fromSlider.value);
            const toValue = parseFloat(toSlider.value);
            
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
            
            toSlider.style.background = gradient;
        }
        
        // 値の検証と調整
        function validateRange() {
            let fromValue = parseFloat(fromSlider.value);
            let toValue = parseFloat(toSlider.value);
            
            // fromがtoより大きい場合は入れ替え
            if (fromValue > toValue) {
                [fromValue, toValue] = [toValue, fromValue];
                fromSlider.value = fromValue;
                toSlider.value = toValue;
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
            fromSlider.setAttribute('aria-valuemin', min);
            fromSlider.setAttribute('aria-valuemax', max);
            fromSlider.setAttribute('aria-valuenow', fromValue);
            toSlider.setAttribute('aria-valuemin', min);
            toSlider.setAttribute('aria-valuemax', max);
            toSlider.setAttribute('aria-valuenow', toValue);
        }
        
        // スライダーイベント
        fromSlider.addEventListener('input', function() {
            fromInput.value = this.value;
            validateRange();
        });
        
        toSlider.addEventListener('input', function() {
            toInput.value = this.value;
            validateRange();
        });
        
        // 数値入力イベント
        fromInput.addEventListener('change', function() {
            let value = parseFloat(this.value);
            value = Math.max(min, Math.min(max, value));
            this.value = value;
            fromSlider.value = value;
            validateRange();
        });
        
        toInput.addEventListener('change', function() {
            let value = parseFloat(this.value);
            value = Math.max(min, Math.min(max, value));
            this.value = value;
            toSlider.value = value;
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
        updateRangeDisplay(container, parseFloat(fromSlider.value), parseFloat(toSlider.value));
        
        // アニメーション効果を追加
        addSliderAnimations(fromSlider, toSlider);
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