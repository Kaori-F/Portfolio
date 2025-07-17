document.addEventListener('DOMContentLoaded', () => {
    const worksGrid = document.getElementById('works-grid');
    if (!worksGrid) return;

    // 各クリスタル（シャード）と、そのリンク先、表示するタイトルを定義
    const worksData = [
        { 
            image: 'assets/images/shard-01.png', 
            link: 'work-ninjadao.html', 
            title: 'NinjaDAO' 
        },
        { 
            image: 'assets/images/shard-02.png', 
            link: 'work-swc.html', 
            title: 'SWC' 
        },
        { 
            image: 'assets/images/shard-03.png', 
            link: 'work-kisekae.html', 
            title: 'Kisekae' 
        },
        // 作品カテゴリーが増えたら、ここに追加していきます
        // { image: 'assets/images/shard-04.png', link: '...', title: '...' },
        // { image: 'assets/images/shard-05.png', link: '...', title: '...' }
    ];

    worksData.forEach(work => {
        // 各作品へのリンク（aタグ）を作成
        const link = document.createElement('a');
        link.href = work.link; // 定義したリンク先を設定
        link.classList.add('shard-item');
        link.setAttribute('data-title', work.title); // タイトルをデータとして保持

        // クリスタルの画像（imgタグ）を作成
        const shardImage = document.createElement('img');
        shardImage.src = work.image;
        shardImage.alt = work.title;
        shardImage.classList.add('shard-image');

        // リンクの中に画像を入れる
        link.appendChild(shardImage);

        // コンテナにリンクを追加
        worksGrid.appendChild(link);
    });
});