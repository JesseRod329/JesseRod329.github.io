import * as THREE from 'three';
import Villa from './Villa.js';

export default class World {
    constructor(app) {
        this.app = app;
        this.scene = this.app.scene;
        this.resources = this.app.resources;

        // Setup
        this.setEnvironment();
        this.villa = new Villa(app);
    }

    setEnvironment() {
        // Lights
        const sun = new THREE.DirectionalLight(0xfffaed, 2.5);
        sun.position.set(60, 100, 40);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.bias = -0.0001;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 200;
        sun.shadow.camera.left = -120;
        sun.shadow.camera.right = 120;
        sun.shadow.camera.top = 120;
        sun.shadow.camera.bottom = -120;
        this.scene.add(sun);

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0xffd700, 0x1a1a2a, 0.6);
        this.scene.add(hemi);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(300, 300);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x3d2e24,
            roughness: 0.9,
            metalness: 0.1,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        // Add texture if available, otherwise use color fallback
        if (this.resources && this.resources.hasTexture('stone')) {
            const stoneTexture = this.resources.items.stone;
            if (stoneTexture) {
                stoneTexture.needsUpdate = true;
                groundMat.map = stoneTexture;
            }
        }
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    update() {
        if (this.villa)
            this.villa.update();
    }
}
