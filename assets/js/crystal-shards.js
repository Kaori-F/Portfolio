// Crystal Shard Portfolio - 3Dクリスタルシャード
// 添付画像のような虹色に輝くクリスタルシャードを実装

class CrystalShards {
    constructor(container) {
        this.container = container;
        this.shards = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.init();
    }
    
    init() {
        // シーンの作成
        this.scene = new THREE.Scene();
        
        // カメラの設定
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // レンダラーの設定
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        // レンダラーのモードをフルレンダリングに設定
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // コンテナに追加
        this.container.appendChild(this.renderer.domElement);
        
        // 環境マップの読み込み（クリスタルの反射に使用）
        const envMapUrls = [
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/posx.jpg',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/negx.jpg',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/posy.jpg',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/negy.jpg',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/posz.jpg',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park2/negz.jpg'
        ];
        
        const loader = new THREE.CubeTextureLoader();
        const envMap = loader.load(envMapUrls);
        this.scene.environment = envMap;
        
        // 光源の追加
        this.addLights();
        
        // イベントリスナーの設定
        window.addEventListener('resize', this.onResize.bind(this));
        
        // アニメーションの開始
        this.animate();
    }
    
    // 光源の追加
    addLights() {
        // アンビエントライト
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // ディレクショナルライト
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // カラフルなポイントライト
        const colors = [0xff1493, 0x00ffff, 0xffff00, 0xff4500];
        
        colors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 2.5, 100);
            const angle = (index / colors.length) * Math.PI * 2;
            const radius = 10;
            
            light.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                5
            );
            
            this.scene.add(light);
            
            // ライトのアニメーション
            gsap.to(light.position, {
                x: Math.cos(angle + Math.PI) * radius,
                y: Math.sin(angle + Math.PI) * radius,
                duration: 10 + index * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    }
    
    // シャードの作成
    createShard(options = {}) {
        const defaults = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: 0xffffff,
            geometryType: Math.floor(Math.random() * 5)
        };
        
        const config = { ...defaults, ...options };
        
        // ジオメトリの選択
        let geometry;
        switch (config.geometryType) {
            case 0:
                // 四面体
                geometry = new THREE.TetrahedronGeometry(1, 0);
                break;
            case 1:
                // 八面体
                geometry = new THREE.OctahedronGeometry(1, 0);
                break;
            case 2:
                // 十二面体
                geometry = new THREE.DodecahedronGeometry(1, 0);
                break;
            case 3:
                // 二十面体
                geometry = new THREE.IcosahedronGeometry(1, 0);
                break;
            case 4:
                // カスタムの結晶形状
                geometry = this.createCustomCrystalGeometry();
                break;
            default:
                geometry = new THREE.TetrahedronGeometry(1, 0);
        }
        
        // ジオメトリのバッファ属性を確認し、必要なら再計算
        if (!geometry.attributes.normal) {
            geometry.computeVertexNormals();
        }
        
        // ジオメトリの変形（より自然なクリスタル形状に）
        const positionAttribute = geometry.getAttribute('position');
        const vertex = new THREE.Vector3();
        
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            
            // 頂点を少しランダムに変位
            vertex.x += (Math.random() - 0.5) * 0.2;
            vertex.y += (Math.random() - 0.5) * 0.2;
            vertex.z += (Math.random() - 0.5) * 0.2;
            
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        geometry.computeVertexNormals();
        
    
        // マテリアルの作成（透明感のあるホログラム・クリスタル質感）
        const material = new THREE.MeshPhysicalMaterial({
            color: config.color, // works.jsから渡された色を使用
            metalness: 0.2,
            roughness: 0.05,
            transmission: 0.9,
            thickness: 0.3, 
            envMapIntensity: 2.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            ior: 2.5,
            specularIntensity: 1.5,
            specularColor: 0xffffff,
            iridescence: 1.5,
            iridescenceIOR: 1.5,
            iridescenceThicknessRange: [50, 500],
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
            emissive: config.color, // 自己発光の色も同じ色に設定
            emissiveIntensity: 0.2,
            wireframe: false
        });
        
        // メッシュの作成
        const shard = new THREE.Mesh(geometry, material);
        
        // 位置、回転、スケールの設定
        shard.position.set(config.position.x, config.position.y, config.position.z);
        shard.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
        shard.scale.set(config.scale.x, config.scale.y, config.scale.z);
        
        // カスタムプロパティ
        shard.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        
        // シーンに追加
        this.scene.add(shard);
        this.shards.push(shard);
        
        return shard;
    }
    
    // カスタムの結晶形状を作成するメソッド
    createCustomCrystalGeometry() {
        // 基本の形状としてプリズムを使用
        const baseGeometry = new THREE.CylinderGeometry(0, 1, 2, 6, 1, false);
        
        // 頂点をランダムに変形して結晶らしい形状に
        const positionAttribute = baseGeometry.getAttribute('position');
        const vertex = new THREE.Vector3();
        
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            
            // 底面の頂点はそのままにして、上面の頂点を変形
            if (vertex.y > 0) {
                // 上部の頂点をより尖らせる
                vertex.y += (Math.random() * 0.5) + 0.5;
                // XZ平面上でも少しランダムに動かす
                vertex.x += (Math.random() - 0.5) * 0.3;
                vertex.z += (Math.random() - 0.5) * 0.3;
            } else if (vertex.y < 0) {
                // 底面の頂点も少し変形
                vertex.x += (Math.random() - 0.5) * 0.2;
                vertex.z += (Math.random() - 0.5) * 0.2;
            }
            
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        // 別の結晶片を追加
        const additionalParts = Math.floor(Math.random() * 3) + 1; // 1～3個の追加パーツ
        
        for (let i = 0; i < additionalParts; i++) {
            const smallPrism = new THREE.CylinderGeometry(
                0, 0.5, 1, 5, 1, false
            );
            
            // 小さい結晶の頂点を変形
            const smallPrismPos = smallPrism.getAttribute('position');
            for (let j = 0; j < smallPrismPos.count; j++) {
                vertex.fromBufferAttribute(smallPrismPos, j);
                
                // 全ての頂点を少しランダムに
                vertex.x += (Math.random() - 0.5) * 0.2;
                vertex.y += (Math.random() - 0.5) * 0.2;
                vertex.z += (Math.random() - 0.5) * 0.2;
                
                smallPrismPos.setXYZ(j, vertex.x, vertex.y, vertex.z);
            }
            
            // 小さい結晶の位置と回転を設定
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.3 + Math.random() * 0.5;
            const height = -0.5 + Math.random() * 1.5;
            
            const tempMatrix = new THREE.Matrix4();
            tempMatrix.makeRotationFromEuler(
                new THREE.Euler(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                )
            );
            tempMatrix.setPosition(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            // 変換したジオメトリを結合
            smallPrism.applyMatrix4(tempMatrix);
            baseGeometry.merge(smallPrism);
        }
        
        baseGeometry.computeVertexNormals();
        return baseGeometry;
    }
    
    // ウィンドウリサイズ処理
    onResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    // アニメーション
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // シャードの回転
        this.shards.forEach(shard => {
            shard.rotation.x += shard.userData.rotationSpeed.x;
            shard.rotation.y += shard.userData.rotationSpeed.y;
            shard.rotation.z += shard.userData.rotationSpeed.z;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // シャードの削除
    removeShard(shard) {
        this.scene.remove(shard);
        this.shards = this.shards.filter(s => s !== shard);
    }
    
    // すべてのシャードの削除
    removeAllShards() {
        this.shards.forEach(shard => {
            this.scene.remove(shard);
        });
        this.shards = [];
    }
}

// グローバルに利用可能にする
window.CrystalShards = CrystalShards;
