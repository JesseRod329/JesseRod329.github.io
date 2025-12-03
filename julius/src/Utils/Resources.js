import * as THREE from 'three';

export default class Resources {
    constructor() {
        this.items = {};
        this.generateTextures();
        this.validateTextures();
    }

    generateTextures() {
        try {
            this.items.marble = this.createMarbleTexture();
            this.items.stone = this.createStoneTexture();
            this.items.noise = this.createNoiseTexture();
            this.items.waterNormal = this.createWaterNormalTexture();
        } catch (error) {
            console.warn('Error generating textures:', error);
        }
    }

    validateTextures() {
        // Ensure all textures are valid
        const requiredTextures = ['marble', 'stone', 'noise', 'waterNormal'];
        requiredTextures.forEach(key => {
            if (!this.items[key] || !(this.items[key] instanceof THREE.Texture)) {
                console.warn(`Texture ${key} is missing or invalid, will use fallback`);
            }
        });
    }

    hasTexture(name) {
        return this.items[name] && this.items[name] instanceof THREE.Texture;
    }

    createMarbleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // White background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 512, 512);

        // Veins
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.filter = 'blur(4px)';

        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 100, 100, ${Math.random() * 0.3})`;
            let x = Math.random() * 512;
            let y = Math.random() * 512;
            ctx.moveTo(x, y);

            for (let j = 0; j < 10; j++) {
                x += (Math.random() - 0.5) * 100;
                y += (Math.random() - 0.5) * 100;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        return texture;
    }

    createStoneTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#d9ccb4';
        ctx.fillRect(0, 0, 512, 512);

        // Noise
        for (let i = 0; i < 50000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const gray = Math.random() * 50;
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.1)`;
            ctx.fillRect(x, y, 2, 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        return texture;
    }

    createNoiseTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const imgData = ctx.createImageData(512, 512);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const val = Math.random() * 255;
            imgData.data[i] = val;
            imgData.data[i + 1] = val;
            imgData.data[i + 2] = val;
            imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        return texture;
    }

    createWaterNormalTexture() {
        // Simple noise for water normal map simulation
        return this.createNoiseTexture();
    }
}
