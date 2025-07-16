// Crystal Shard Portfolio - 高度な3Dバックグラウンド
// Three.jsを使用した未来的な3D空間の実装

class Background3D {
    constructor() {
        this.container = document.querySelector('.scene');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = this.width / 2;
        this.windowHalfY = this.height / 2;
        
        // カメラパラメータ
        this.cameraParams = {
            fov: 75,
            near: 1,
            far: 5000,
            position: { x: 0, y: 0, z: 1000 },
            lookAt: { x: 0, y: 0, z: 0 }
        };
        
        // パーティクルパラメータ
        this.particleParams = {
            count: 1500,
            size: { min: 2, max: 5 },
            color: 0xffffff,
            opacity: { min: 0.1, max: 0.8 },
            speed: { min: 0.05, max: 0.2 }
        };
        
        // クリスタルシャードパラメータ
        this.shardParams = {
            count: 20,
            size: { min: 30, max: 80 },
            opacity: { min: 0.05, max: 0.2 },
            rotationSpeed: { min: 0.001, max: 0.003 }
        };
        
        this.init();
    }
    
    init() {
        // シーン作成
        this.scene = new THREE.Scene();
        
        // カメラ設定
        this.camera = new THREE.PerspectiveCamera(
            this.cameraParams.fov,
            this.width / this.height,
            this.cameraParams.near,
            this.cameraParams.far
        );
        this.camera.position.set(
            this.cameraParams.position.x,
            this.cameraParams.position.y,
            this.cameraParams.position.z
        );
        this.camera.lookAt(
            this.cameraParams.lookAt.x,
            this.cameraParams.lookAt.y,
            this.cameraParams.lookAt.z
        );
        
        // レンダラー設定
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        
        // コンテナに追加
        this.container.appendChild(this.renderer.domElement);
        
        // 光源追加
        this.addLights();
        
        // パーティクル追加
        this.addParticles();
        
        // クリスタルシャード追加
        this.addCrystalShards();
        
        // イベントリスナー追加
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // アニメーション開始
        this.animate();
    }
    
    // 光源追加
    addLights() {
        // アンビエントライト
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // ディレクショナルライト
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // ポイントライト（複数）
        const colors = [0xff00ff, 0x00ffff, 0xffff00];
        
        colors.forEach((color, index) => {
            const pointLight = new THREE.PointLight(color, 0.5, 1000);
            pointLight.position.set(
                Math.sin(index * Math.PI * 2 / 3) * 300,
                Math.cos(index * Math.PI * 2 / 3) * 300,
                200
            );
            this.scene.add(pointLight);
            
            // ライトアニメーション
            gsap.to(pointLight.position, {
                x: Math.sin((index + 1) * Math.PI * 2 / 3) * 300,
                y: Math.cos((index + 1) * Math.PI * 2 / 3) * 300,
                duration: 20 + index * 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    }
    
    // パーティクル追加
    addParticles() {
        // ジオメトリ作成
        this.particleGeometry = new THREE.BufferGeometry();
        
        // 頂点配列
        const positions = new Float32Array(this.particleParams.count * 3);
        const colors = new Float32Array(this.particleParams.count * 3);
        const sizes = new Float32Array(this.particleParams.count);
        const speeds = new Float32Array(this.particleParams.count);
        
        // カラーパレット
        const colorPalette = [
            new THREE.Color(0xff9ff3), // ピンク
            new THREE.Color(0xa5f1e9), // ライトブルー
            new THREE.Color(0xe2f6ca), // ライトグリーン
            new THREE.Color(0xffcbcb)  // ライトレッド
        ];
        
        // パーティクルデータ設定
        for (let i = 0; i < this.particleParams.count; i++) {
            // ランダム位置
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // ランダムカラー
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // ランダムサイズ
            sizes[i] = this.particleParams.size.min + 
                      Math.random() * (this.particleParams.size.max - this.particleParams.size.min);
            
            // ランダムスピード
            speeds[i] = this.particleParams.speed.min + 
                       Math.random() * (this.particleParams.speed.max - this.particleParams.speed.min);
        }
        
        // 属性設定
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // カスタム属性
        this.particleGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
        
        // シェーダーマテリアル
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute float speed;
                attribute vec3 color;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    // 時間に基づく位置の更新
                    vec3 pos = position;
                    pos.y += sin(time * speed + position.x * 0.01) * 10.0;
                    pos.x += cos(time * speed + position.y * 0.01) * 10.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    
                    // サイズは距離に応じて変化
                    float distanceFactor = 1.0 / (-mvPosition.z * 0.1 + 1.0);
                    gl_PointSize = size * pixelRatio * distanceFactor;
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // 円形のパーティクル
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) {
                        discard;
                    }
                    
                    // 外側に向かって透明に
                    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                    
                    // グロー効果
                    vec3 glow = vColor * (1.0 - dist * 2.0);
                    
                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        // パーティクルシステム作成
        this.particles = new THREE.Points(this.particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    // クリスタルシャード追加
    addCrystalShards() {
        this.shards = new THREE.Group();
        
        // 複数のシャード作成
        for (let i = 0; i < this.shardParams.count; i++) {
            // ランダムなジオメトリ選択
            let geometry;
            const geometryType = Math.floor(Math.random() * 3);
            
            switch (geometryType) {
                case 0:
                    // 四面体
                    geometry = new THREE.TetrahedronGeometry(
                        this.shardParams.size.min + Math.random() * 
                        (this.shardParams.size.max - this.shardParams.size.min)
                    );
                    break;
                case 1:
                    // 八面体
                    geometry = new THREE.OctahedronGeometry(
                        this.shardParams.size.min + Math.random() * 
                        (this.shardParams.size.max - this.shardParams.size.min)
                    );
                    break;
                case 2:
                    // カスタム多面体
                    geometry = new THREE.IcosahedronGeometry(
                        this.shardParams.size.min + Math.random() * 
                        (this.shardParams.size.max - this.shardParams.size.min),
                        0
                    );
                    
                    // ジオメトリを少し変形
                    const positionAttribute = geometry.getAttribute('position');
                    const vertex = new THREE.Vector3();
                    
                    for (let v = 0; v < positionAttribute.count; v++) {
                        vertex.fromBufferAttribute(positionAttribute, v);
                        
                        // 頂点を少しランダムに変位
                        vertex.x += (Math.random() - 0.5) * 10;
                        vertex.y += (Math.random() - 0.5) * 10;
                        vertex.z += (Math.random() - 0.5) * 10;
                        
                        positionAttribute.setXYZ(v, vertex.x, vertex.y, vertex.z);
                    }
                    
                    geometry.computeVertexNormals();
                    break;
            }
            
            // マテリアル作成
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: this.shardParams.opacity.min + Math.random() * 
                         (this.shardParams.opacity.max - this.shardParams.opacity.min),
                metalness: 0.2,
                roughness: 0.1,
                transmission: 0.9,
                thickness: 0.5,
                envMapIntensity: 1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide
            });
            
            // メッシュ作成
            const shard = new THREE.Mesh(geometry, material);
            
            // ランダム位置
            shard.position.set(
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000
            );
            
            // ランダム回転
            shard.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            
            // ランダムスケール
            const scale = 0.5 + Math.random() * 1.5;
            shard.scale.set(scale, scale, scale);
            
            // カスタムプロパティ
            shard.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * this.shardParams.rotationSpeed.max,
                y: (Math.random() - 0.5) * this.shardParams.rotationSpeed.max,
                z: (Math.random() - 0.5) * this.shardParams.rotationSpeed.max
            };
            
            // 浮遊アニメーション
            gsap.to(shard.position, {
                x: shard.position.x + (Math.random() - 0.5) * 100,
                y: shard.position.y + (Math.random() - 0.5) * 100,
                z: shard.position.z + (Math.random() - 0.5) * 100,
                duration: 10 + Math.random() * 20,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            this.shards.add(shard);
        }
        
        this.scene.add(this.shards);
    }
    
    // ウィンドウリサイズ処理
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.windowHalfX = this.width / 2;
        this.windowHalfY = this.height / 2;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    // マウス移動処理
    onMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
        this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
    }
    
    // アニメーション
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    
    // レンダリング
    render() {
        // カメラの滑らかな移動
        this.targetX = this.mouseX * 0.5;
        this.targetY = this.mouseY * 0.5;
        
        this.camera.position.x += (this.targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.targetY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // パーティクルアニメーション
        if (this.particles) {
            const time = Date.now() * 0.0005;
            this.particles.material.uniforms.time.value = time;
        }
        
        // シャードアニメーション
        if (this.shards) {
            this.shards.children.forEach(shard => {
                shard.rotation.x += shard.userData.rotationSpeed.x;
                shard.rotation.y += shard.userData.rotationSpeed.y;
                shard.rotation.z += shard.userData.rotationSpeed.z;
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// DOMロード時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.background3D = new Background3D();
});
