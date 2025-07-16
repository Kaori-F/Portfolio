/**
 * 星屑アニメーション
 * キラキラと浮遊する星屑のアニメーションとパララックス効果を実装
 */
document.addEventListener('DOMContentLoaded', function() {
    // 星屑のコンテナ要素を取得
    const stardustContainer = document.getElementById('stardust');
    if (!stardustContainer) return;
    
    // 星の数を設定
    const starCount = 100;
    
    // 星を生成してコンテナに追加
    for (let i = 0; i < starCount; i++) {
        createStar(stardustContainer, i);
    }
    
    // パララックス効果のためのマウス移動イベントリスナー
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // すべての星に対してパララックス効果を適用
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            // 各星の深度（z-index）に基づいて移動量を調整
            const depth = parseFloat(star.getAttribute('data-depth'));
            const moveX = (mouseX - 0.5) * depth * -20;
            const moveY = (mouseY - 0.5) * depth * -20;
            
            // 星の位置を更新
            star.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});

/**
 * 星を生成する関数
 * @param {HTMLElement} container - 星を追加するコンテナ要素
 * @param {number} index - 星のインデックス
 */
function createStar(container, index) {
    // 星要素を作成
    const star = document.createElement('div');
    star.classList.add('star');
    
    // ランダムな位置を設定
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    
    // ランダムなサイズを設定（1px〜3px）
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // ランダムな透明度を設定
    const opacity = Math.random() * 0.6 + 0.4;
    star.style.opacity = opacity;
    
    // ランダムなアニメーション遅延を設定
    const delay = Math.random() * 5;
    star.style.animationDelay = `${delay}s`;
    
    // ランダムなアニメーション時間を設定
    const duration = Math.random() * 3 + 2;
    star.style.animationDuration = `${duration}s`;
    
    // パララックス効果のための深度値（0.1〜1.0）
    const depth = Math.random() * 0.9 + 0.1;
    star.setAttribute('data-depth', depth);
    
    // 星の明るさに応じてz-indexを設定
    star.style.zIndex = Math.floor(depth * 10);
    
    // コンテナに星を追加
    container.appendChild(star);
}
