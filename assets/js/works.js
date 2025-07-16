document.addEventListener('DOMContentLoaded', () => {
    const worksGrid = document.getElementById('works-grid');
    if (!worksGrid) return;

    // プロジェクト情報を定義
    const projects = [
        {
            image: 'assets/images/shard-01.png',
            title: 'NinjaDAO',
            link: 'work-ninjadao.html'
        },
        {
            image: 'assets/images/shard-02.png',
            title: 'SWC Project',
            link: 'work-swc.html'
        },
        {
            image: 'assets/images/shard-03.png',
            title: 'Kisekae App',
            link: 'work-kisekae.html'
        },
        {
            image: 'assets/images/shard-04.png',
            title: 'Crystal UI',
            link: '#work-4' // まだページがないのでハッシュリンク
        },
        {
            image: 'assets/images/shard-05.png',
            title: 'Portfolio',
            link: '#work-5' // まだページがないのでハッシュリンク
        }
    ];

    projects.forEach((project, index) => {
        // 各作品へのリンク（aタグ）を作成
        const link = document.createElement('a');
        link.href = project.link;
        link.classList.add('shard-item');
        link.setAttribute('title', project.title);

        // クリスタルの画像（imgタグ）を作成
        const shardImage = document.createElement('img');
        shardImage.src = project.image;
        shardImage.alt = project.title;
        shardImage.classList.add('shard-image');

        // リンクの中に画像を入れる
        link.appendChild(shardImage);

        // コンテナにリンクを追加
        worksGrid.appendChild(link);
    });
});