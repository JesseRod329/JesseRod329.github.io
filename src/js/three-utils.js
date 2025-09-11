import * as THREE from 'three';

/**
 * Three.js utility functions for 3D generative art backgrounds
 */
export class ThreeBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleCount: 1000,
      particleSize: 2,
      rotationSpeed: 0.001,
      color: '#ff3',
      backgroundColor: '#000000',
      ...options
    };
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.animate();
    this.handleResize();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
  }

  createCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.options.particleCount * 3);
    const colors = new Float32Array(this.options.particleCount * 3);
    const sizes = new Float32Array(this.options.particleCount);

    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      const radius = Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random colors
      const color = new THREE.Color(this.options.color);
      color.setHSL(Math.random(), 0.7, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * this.options.particleSize + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: this.options.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    if (this.particles) {
      this.particles.rotation.x += this.options.rotationSpeed;
      this.particles.rotation.y += this.options.rotationSpeed * 0.5;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.container && this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

/**
 * Create a geometric shape background
 */
export class GeometricBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      shapeCount: 20,
      rotationSpeed: 0.002,
      color: '#ff3',
      backgroundColor: '#000000',
      ...options
    };
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.shapes = [];
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createShapes();
    this.animate();
    this.handleResize();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
  }

  createCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 10;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }

  createShapes() {
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.ConeGeometry(0.5, 1, 8),
      new THREE.TorusGeometry(0.5, 0.2, 8, 16),
      new THREE.OctahedronGeometry(0.5)
    ];

    for (let i = 0; i < this.options.shapeCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: this.options.color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Random position
      shape.position.x = (Math.random() - 0.5) * 20;
      shape.position.y = (Math.random() - 0.5) * 20;
      shape.position.z = (Math.random() - 0.5) * 20;
      
      // Random rotation
      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      shape.rotation.z = Math.random() * Math.PI;
      
      this.scene.add(shape);
      this.shapes.push(shape);
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.shapes.forEach((shape, index) => {
      shape.rotation.x += this.options.rotationSpeed * (index % 2 === 0 ? 1 : -1);
      shape.rotation.y += this.options.rotationSpeed * 0.5 * (index % 3 === 0 ? 1 : -1);
      shape.rotation.z += this.options.rotationSpeed * 0.3;
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.container && this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
