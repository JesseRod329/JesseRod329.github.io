class SoundEngine {
    constructor() {
        this.ctx = null;
        this.spinOsc = null;
        this.spinGain = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.setupSpinSound();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setupSpinSound() {
        this.spinOsc = this.ctx.createOscillator();
        this.spinGain = this.ctx.createGain();

        this.spinOsc.type = 'sawtooth';
        this.spinOsc.frequency.value = 50;
        this.spinGain.gain.value = 0;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        this.spinOsc.connect(filter);
        filter.connect(this.spinGain);
        this.spinGain.connect(this.ctx.destination);

        this.spinOsc.start();
    }

    updateSpinSound(speed) {
        if (!this.ctx) return;
        const normalizedSpeed = Math.min(Math.abs(speed) / 20, 1);
        const baseFreq = 50;
        this.spinOsc.frequency.setTargetAtTime(baseFreq + (normalizedSpeed * 200), this.ctx.currentTime, 0.1);
        this.spinGain.gain.setTargetAtTime(normalizedSpeed * 0.1, this.ctx.currentTime, 0.1);
    }

    playWarp(val) {
        if (!this.ctx) this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.value = 100 + (val * 10);
        osc.type = 'triangle';

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    playExplosion() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;

        // Low boom
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.frequency.setValueAtTime(100, t);
        osc1.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
        gain1.gain.setValueAtTime(0.2, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(t);
        osc1.stop(t + 0.5);

        // High crackle
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, t);
        osc2.frequency.exponentialRampToValueAtTime(100, t + 0.2);
        gain2.gain.setValueAtTime(0.1, t);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.2);
    }
}

// --- Particle System ---
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            map: this.createParticleTexture()
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Pre-allocate arrays
        this.maxParticles = 3000;
        this.positions = new Float32Array(this.maxParticles * 3);
        this.colors = new Float32Array(this.maxParticles * 3);
        this.velocities = []; // Store velocity vectors
        this.lives = [];      // Store life (0-1)

        for (let i = 0; i < this.maxParticles; i++) {
            this.lives[i] = 0; // Inactive
            this.velocities[i] = new THREE.Vector3();
        }
    }

    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    emit(count, position, color, speed, spread = 0.5) {
        let emitted = 0;
        for (let i = 0; i < this.maxParticles && emitted < count; i++) {
            if (this.lives[i] <= 0) {
                this.lives[i] = 1.0;
                this.positions[i * 3] = position.x;
                this.positions[i * 3 + 1] = position.y;
                this.positions[i * 3 + 2] = position.z;

                this.colors[i * 3] = color.r;
                this.colors[i * 3 + 1] = color.g;
                this.colors[i * 3 + 2] = color.b;

                // Random direction
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const v = speed * (0.5 + Math.random() * 0.5);

                this.velocities[i].set(
                    v * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * spread,
                    v * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * spread,
                    v * Math.cos(phi) + (Math.random() - 0.5) * spread
                );

                emitted++;
            }
        }
    }

    update() {
        let activeCount = 0;
        for (let i = 0; i < this.maxParticles; i++) {
            if (this.lives[i] > 0) {
                this.lives[i] -= 0.015; // Slower decay

                this.positions[i * 3] += this.velocities[i].x;
                this.positions[i * 3 + 1] += this.velocities[i].y;
                this.positions[i * 3 + 2] += this.velocities[i].z;

                // Gravity
                this.velocities[i].y -= 0.003;

                // Drag
                this.velocities[i].multiplyScalar(0.98);

                activeCount++;
            } else {
                // Hide inactive
                this.positions[i * 3] = 9999;
            }
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }
}

// --- 3D Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x6366f1, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xf43f5e, 1);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Spinner Group
const spinnerGroup = new THREE.Group();
scene.add(spinnerGroup);

// Materials
const materialBody = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.2,
    metalness: 0.8
});
const materialBlade = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x220044
});
const materialCap = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1
});

// Center Bearing
const bearingGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
const bearing = new THREE.Mesh(bearingGeo, materialCap);
bearing.rotation.x = Math.PI / 2;
spinnerGroup.add(bearing);

// Blades (Procedural Tri-Spinner)
for (let i = 0; i < 3; i++) {
    const angle = (i * 120) * (Math.PI / 180);
    const bladeGroup = new THREE.Group();

    // Arm
    const armGeo = new THREE.BoxGeometry(1.5, 3, 0.3);
    const arm = new THREE.Mesh(armGeo, materialBody);
    arm.position.y = 1.5;
    bladeGroup.add(arm);

    // Weight Ring
    const ringGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
    const ring = new THREE.Mesh(ringGeo, materialBlade);
    ring.position.y = 2.5;
    bladeGroup.add(ring);

    // Inner Weight
    const weightGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const weight = new THREE.Mesh(weightGeo, materialCap);
    weight.rotation.x = Math.PI / 2;
    weight.position.y = 2.5;
    bladeGroup.add(weight);

    bladeGroup.rotation.z = angle;
    spinnerGroup.add(bladeGroup);
}

camera.position.z = 7;

// --- Physics & Interaction ---
let rotationVelocity = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let lastTime = 0;

const sound = new SoundEngine();
const particles = new ParticleSystem(scene);
let hasInteracted = false;

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onDown(x, y) {
    if (!hasInteracted) { sound.init(); hasInteracted = true; }

    // Normalize mouse coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spinnerGroup.children, true);

    if (intersects.length > 0) {
        isDragging = true;
        lastMouseX = x;
        lastMouseY = y;
        lastTime = Date.now();
        rotationVelocity = 0;
    }
}

function onMove(x, y) {
    if (!isDragging) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentAngle = Math.atan2(y - centerY, x - centerX);
    const lastAngle = Math.atan2(lastMouseY - centerY, lastMouseX - centerX);

    let delta = currentAngle - lastAngle;

    // Rotate the group
    spinnerGroup.rotation.z -= delta; // Invert for natural feel

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
        rotationVelocity = -delta * 10;
    }

    lastMouseX = x;
    lastMouseY = y;
    lastTime = now;
}

function onUp() {
    isDragging = false;
}

// Keyboard Controls
window.addEventListener('keydown', (e) => {
    if (!hasInteracted) { sound.init(); hasInteracted = true; }

    const boost = 0.8; // Increased boost
    if (e.key === 'ArrowLeft') {
        rotationVelocity += boost;
    } else if (e.key === 'ArrowRight') {
        rotationVelocity -= boost;
    } else if (e.key === ' ') {
        // Spacebar brake
        rotationVelocity *= 0.5;
    }
});

// Event Listeners
window.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
window.addEventListener('mouseup', onUp);

window.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX, e.touches[0].clientY));
window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY));
window.addEventListener('touchend', onUp);

// Slider
const slider = document.getElementById('warp-slider');
slider.addEventListener('input', (e) => {
    if (!hasInteracted) { sound.init(); hasInteracted = true; }
    sound.playWarp(e.target.value);

    // Change color based on slider
    const hue = e.target.value / 100;
    materialBlade.color.setHSL(hue, 0.8, 0.5);
    materialBlade.emissive.setHSL(hue, 1, 0.2);
});

// Animation Loop
let lastEmitTime = 0;
let hueOffset = 0;

function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        rotationVelocity *= 0.995; // Less friction for longer spin
        spinnerGroup.rotation.z += rotationVelocity * 0.1;
    }

    // Tilt effect
    if (!isDragging) {
        spinnerGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        spinnerGroup.rotation.y = Math.cos(Date.now() * 0.001) * 0.1;
    }

    // High Speed Effects
    const speed = Math.abs(rotationVelocity);

    // Dynamic Color Shift at high speeds
    if (speed > 5) {
        hueOffset += 0.01;
        materialBlade.emissive.setHSL((Date.now() * 0.0005) % 1, 1, 0.5);
    }

    if (speed > 2) {
        // Camera Shake
        const shakeIntensity = Math.min(speed * 0.005, 0.2);
        camera.position.x = (Math.random() - 0.5) * shakeIntensity;
        camera.position.y = (Math.random() - 0.5) * shakeIntensity;

        // Fireworks / Particles
        // Emit rate increases with speed
        const emitThreshold = Math.max(1000 / (speed * 15), 10);

        if (Date.now() - lastEmitTime > emitThreshold) {
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1, 0.6);

            // Emit from blade tips
            for (let i = 0; i < 3; i++) {
                const angle = spinnerGroup.rotation.z + (i * 120 * Math.PI / 180);
                const r = 2.5;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;

                // Emit burst
                particles.emit(5, new THREE.Vector3(x, y, 0), color, speed * 0.2, 1.0);
            }
            lastEmitTime = Date.now();

            // Random Explosions at very high speed
            if (speed > 15 && Math.random() > 0.95) {
                sound.playExplosion();
                // Big burst from center
                const burstColor = new THREE.Color().setHSL(Math.random(), 1, 0.5);
                particles.emit(50, new THREE.Vector3(0, 0, 0), burstColor, speed * 0.5, 5.0);
            }
        }
    } else {
        camera.position.x = 0;
        camera.position.y = 0;
    }

    sound.updateSpinSound(rotationVelocity * 10);
    particles.update();
    renderer.render(scene, camera);
}

// Handle Resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

animate();
