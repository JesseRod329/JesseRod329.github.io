import * as THREE from 'three';
import { rooms, courtyard, columnPositions } from '../rooms.js';

export default class Villa {
    constructor(app) {
        this.app = app;
        this.scene = this.app.scene;
        this.resources = this.app.resources;

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.selectableFloors = [];

        this.createRooms();
        this.createCourtyard();
        this.createColumns();
    }

    createRooms() {
        if (!rooms || rooms.length === 0) {
            console.warn('No rooms data available');
            return;
        }

        rooms.forEach((room) => {
            if (!room || !room.name) {
                console.warn('Invalid room data:', room);
                return;
            }

            const roomGroup = new THREE.Group();

            // Floor
            const floorGeometry = new THREE.BoxGeometry(room.width, 0.4, room.depth);

            // Use procedural textures if available, else fallback color
            let floorMaterial;
            if (room.name.includes('Atrium') || room.name.includes('Peristyle')) {
                floorMaterial = new THREE.MeshStandardMaterial({
                    color: room.color || 0xc8b08a,
                    roughness: 0.8,
                    metalness: 0.1,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });
                if (this.resources && this.resources.hasTexture('stone')) {
                    const stoneTexture = this.resources.items.stone;
                    if (stoneTexture) {
                        stoneTexture.needsUpdate = true;
                        floorMaterial.map = stoneTexture;
                    }
                }
            } else if (room.name.includes('Master') || room.name.includes('Tablinum')) {
                floorMaterial = new THREE.MeshStandardMaterial({
                    color: room.color || 0xc8b08a, // Tint the marble
                    roughness: 0.2,
                    metalness: 0.1,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });
                if (this.resources && this.resources.hasTexture('marble')) {
                    const marbleTexture = this.resources.items.marble;
                    if (marbleTexture) {
                        marbleTexture.needsUpdate = true;
                        floorMaterial.map = marbleTexture;
                    }
                }
            } else {
                floorMaterial = new THREE.MeshStandardMaterial({
                    color: room.color || 0xc8b08a,
                    roughness: 0.5,
                    metalness: 0.1,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });
            }

            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.set(room.x, 0.2, room.z);
            floor.receiveShadow = true;
            floor.castShadow = true;
            floor.userData = { ...room }; // Store full room data
            // Store original color for highlight system
            floor.userData.originalColor = floorMaterial.color.clone();

            roomGroup.add(floor);
            this.selectableFloors.push(floor);

            // Walls
            const wallHeight = Math.min(room.height, 6);
            const wallThickness = 0.8;
            const wallMaterial = new THREE.MeshStandardMaterial({
                color: 0xE6D2B5,
                roughness: 0.9,
                emissive: 0x000000,
                emissiveIntensity: 0
            });
            // Add texture if available
            if (this.resources && this.resources.hasTexture('stone')) {
                const stoneTexture = this.resources.items.stone;
                if (stoneTexture) {
                    stoneTexture.needsUpdate = true;
                    wallMaterial.map = stoneTexture;
                }
            }

            const walls = [
                { pos: [room.x, wallHeight / 2, room.z - room.depth / 2], dim: [room.width, wallHeight, wallThickness] },
                { pos: [room.x, wallHeight / 2, room.z + room.depth / 2], dim: [room.width, wallHeight, wallThickness] },
                { pos: [room.x - room.width / 2, wallHeight / 2, room.z], dim: [wallThickness, wallHeight, room.depth - wallThickness] },
                { pos: [room.x + room.width / 2, wallHeight / 2, room.z], dim: [wallThickness, wallHeight, room.depth - wallThickness] }
            ];

            walls.forEach(({ pos, dim }) => {
                const geometry = new THREE.BoxGeometry(...dim);
                const wall = new THREE.Mesh(geometry, wallMaterial);
                wall.position.set(...pos);
                wall.castShadow = true;
                wall.receiveShadow = true;
                roomGroup.add(wall);
            });

            this.group.add(roomGroup);
        });
    }

    createCourtyard() {
        const { center, width, depth, fountainRadius } = courtyard;

        // Garden
        const gardenGeo = new THREE.BoxGeometry(width, 0.2, depth);
        const gardenMat = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,
            roughness: 1,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        if (this.resources && this.resources.hasTexture('noise')) {
            const noiseTexture = this.resources.items.noise;
            if (noiseTexture) {
                noiseTexture.needsUpdate = true;
                gardenMat.map = noiseTexture; // Grass texture
            }
        }
        const garden = new THREE.Mesh(gardenGeo, gardenMat);
        garden.position.set(center.x, 0.25, center.z);
        garden.receiveShadow = true;
        this.group.add(garden);

        // Water
        const waterGeo = new THREE.CylinderGeometry(fountainRadius, fountainRadius, 0.2, 32);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x91d1ff,
            transparent: true,
            opacity: 0.85,
            roughness: 0.1,
            metalness: 0.8,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        if (this.resources && this.resources.hasTexture('waterNormal')) {
            const waterNormalTexture = this.resources.items.waterNormal;
            if (waterNormalTexture) {
                waterNormalTexture.needsUpdate = true;
                waterMat.normalMap = waterNormalTexture;
            }
        }
        this.water = new THREE.Mesh(waterGeo, waterMat);
        this.water.position.set(center.x, 0.8, center.z);
        this.group.add(this.water);
    }

    createColumns() {
        if (!columnPositions || columnPositions.length === 0) {
            console.warn('No column positions available');
            return;
        }

        const colGeo = new THREE.CylinderGeometry(0.4, 0.5, 7, 16);
        const capGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
        const colMat = new THREE.MeshStandardMaterial({
            color: 0xf2e6d0,
            roughness: 0.4,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        if (this.resources && this.resources.hasTexture('marble')) {
            const marbleTexture = this.resources.items.marble;
            if (marbleTexture) {
                marbleTexture.needsUpdate = true;
                colMat.map = marbleTexture;
            }
        }

        columnPositions.forEach(({ x, z }) => {
            if (typeof x !== 'number' || typeof z !== 'number') {
                console.warn('Invalid column position:', { x, z });
                return;
            }

            const col = new THREE.Mesh(colGeo, colMat);
            col.position.set(x, 3.5, z);
            col.castShadow = true;
            col.receiveShadow = true;
            this.group.add(col);

            const cap = new THREE.Mesh(capGeo, colMat);
            cap.position.set(x, 7.2, z);
            this.group.add(cap);
        });
    }

    update() {
        // Animate water
        if (this.water) {
            this.water.rotation.y += 0.002;
        }
    }
}
