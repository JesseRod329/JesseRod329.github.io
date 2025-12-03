import * as THREE from 'three';
import gsap from 'gsap';
import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Resources from './Utils/Resources.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';

let instance = null;

export default class App {
    constructor() {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        // Global Access
        window.app = this;

        // Setup
        this.canvas = document.querySelector('#app canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            document.getElementById('app').appendChild(this.canvas);
        }

        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2a2a2a);
        this.scene.fog = new THREE.FogExp2(0x2a2a2a, 0.008);

        this.resources = new Resources();
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.world = new World(this);

        // UI Elements
        this.infoPanel = document.getElementById('info-panel');
        this.panelTitle = document.getElementById('panel-title');
        this.panelDesc = document.getElementById('panel-desc');
        this.panelMeta = document.getElementById('panel-meta');

        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.activeFloor = null;

        window.addEventListener('pointerdown', (event) => this.onPointerDown(event));

        // Resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update();
        });
    }

    onPointerDown(event) {
        try {
            this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
            this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera.instance);

            if (!this.world || !this.world.villa || !this.world.villa.selectableFloors) {
                return;
            }

            const floors = this.world.villa.selectableFloors;
            const intersects = this.raycaster.intersectObjects(floors);

            if (intersects.length > 0) {
                this.selectRoom(intersects[0].object);
            } else {
                this.deselectRoom();
            }
        } catch (error) {
            console.warn('Error handling pointer event:', error);
        }
    }

    selectRoom(mesh) {
        if (!mesh || !mesh.material) {
            console.warn('Invalid mesh provided to selectRoom');
            return;
        }

        try {
            // Restore previous floor color if exists
            if (this.activeFloor && this.activeFloor !== mesh) {
                if (this.activeFloor.userData && this.activeFloor.userData.originalColor) {
                    this.activeFloor.material.color.copy(this.activeFloor.userData.originalColor);
                }
            }

            // Store original color if not already stored
            if (!mesh.userData.originalColor) {
                mesh.userData.originalColor = mesh.material.color.clone();
            }

            // Highlight with bright color
            this.activeFloor = mesh;
            mesh.material.color.setHex(0xf4e285);

            // Update UI
            if (this.panelTitle) {
                this.panelTitle.textContent = mesh.userData.name || 'Unknown Room';
            }
            if (this.panelDesc) {
                this.panelDesc.textContent = mesh.userData.description || "No description available.";
            }
            if (this.panelMeta && mesh.geometry && mesh.geometry.parameters) {
                this.panelMeta.textContent = `Dimensions: ${mesh.geometry.parameters.width}m x ${mesh.geometry.parameters.depth}m`;
            }
            if (this.infoPanel) {
                this.infoPanel.classList.add('visible');
            }

            // Camera Animation (GSAP)
            const targetPos = new THREE.Vector3(
                mesh.position.x + 20,
                mesh.position.y + 30,
                mesh.position.z + 20
            );

            if (this.camera && this.camera.instance) {
                gsap.to(this.camera.instance.position, {
                    duration: 1.5,
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    ease: "power2.inOut"
                });

                if (this.camera.controls) {
                    gsap.to(this.camera.controls.target, {
                        duration: 1.5,
                        x: mesh.position.x,
                        y: mesh.position.y,
                        z: mesh.position.z,
                        ease: "power2.inOut"
                    });
                }
            }
        } catch (error) {
            console.warn('Error selecting room:', error);
        }
    }

    deselectRoom() {
        try {
            if (this.infoPanel) {
                this.infoPanel.classList.remove('visible');
            }
            if (this.activeFloor) {
                if (this.activeFloor.userData && this.activeFloor.userData.originalColor) {
                    this.activeFloor.material.color.copy(this.activeFloor.userData.originalColor);
                }
                this.activeFloor = null;
            }
        } catch (error) {
            console.warn('Error deselecting room:', error);
        }
    }

    resize() {
        try {
            if (this.camera) {
                this.camera.resize();
            }
            if (this.renderer) {
                this.renderer.resize();
            }
        } catch (error) {
            console.warn('Error during resize:', error);
        }
    }

    update() {
        try {
            if (this.camera) {
                this.camera.update();
            }
            if (this.world) {
                this.world.update();
            }
            if (this.renderer) {
                this.renderer.update();
            }
        } catch (error) {
            console.warn('Error during update:', error);
        }
    }
}
