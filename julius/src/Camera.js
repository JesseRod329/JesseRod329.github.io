import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

export default class Camera {
    constructor(app) {
        this.app = app;
        this.sizes = this.app.sizes;
        this.scene = this.app.scene;
        this.canvas = this.app.canvas;

        this.setInstance();
        this.setControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            0.1,
            500
        );
        this.instance.position.set(60, 60, 60);
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new MapControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;

        this.controls.minDistance = 10;
        this.controls.maxDistance = 150;

        this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't go below ground

        this.controls.target.set(0, 0, 0);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update();
    }
}
