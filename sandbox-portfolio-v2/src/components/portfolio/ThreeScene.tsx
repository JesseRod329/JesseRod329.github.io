import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Black and silver theme with different glow colors for each face
const faceColors = [
  0x666666, // Silver - About
  0xff6b6b, // Red - Projects (Knock Knock Door) 
  0x4ecdc4, // Cyan - Skills
  0xffe66d, // Yellow - Experience
  0xff8b94, // Pink - Contact
  0x96ceb4  // Green - Links
];

const faceRotations = [
  [0, 0, 0],               // Front - About
  [0, Math.PI / 2, 0],     // Right - Projects
  [0, Math.PI, 0],         // Back - Skills 
  [0, -Math.PI / 2, 0],    // Left - Experience
  [-Math.PI / 2, 0, 0],    // Top - Contact
  [Math.PI / 2, 0, 0]      // Bottom - Links
];

interface ThreeSceneProps {
  currentFace: number;
  setCurrentFace: (face: number) => void;
  portfolioData: any;
}

export default function ThreeScene({ currentFace, setCurrentFace }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cubeRef = useRef<THREE.Group | null>(null);
  const targetRotation = useRef([0, 0, 0]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isRotatingRef = useRef(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lighting setup for dramatic black/silver theme
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(10, 10, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light with silver tint
    const fillLight = new THREE.DirectionalLight(0xc0c0c0, 0.5);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Accent light that changes color based on current face
    const accentLight = new THREE.PointLight(faceColors[currentFace], 1, 50);
    accentLight.position.set(0, 0, 5);
    scene.add(accentLight);

    // Create cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Create cube faces with black base and silver accents
    const geometry = new THREE.PlaneGeometry(1.8, 1.8);
    const faces: Array<{ face: THREE.Mesh; border: THREE.LineSegments; glow: THREE.Mesh; index: number }> = [];

    const facePositions = [
      [0, 0, 1],     // Front - About
      [1, 0, 0],     // Right - Projects
      [0, 0, -1],    // Back - Skills
      [-1, 0, 0],    // Left - Experience
      [0, 1, 0],     // Top - Contact
      [0, -1, 0]     // Bottom - Links
    ];

    facePositions.forEach((position, index) => {
      // Create face material with black base and glowing edge
      const material = new THREE.MeshPhongMaterial({
        color: 0x111111, // Almost black
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        shininess: 100
      });

      const face = new THREE.Mesh(geometry, material);
      face.position.set(...position);
     
      // Apply rotation based on face
      const rotation = faceRotations[index];
      face.rotation.set(...rotation);

      // Add glowing border with unique color for each face
      const borderGeometry = new THREE.EdgesGeometry(geometry);
      const borderMaterial = new THREE.LineBasicMaterial({ 
        color: faceColors[index],
        transparent: true,
        opacity: 0.8
      });
      const border = new THREE.LineSegments(borderGeometry, borderMaterial);
      border.position.copy(face.position);
      border.rotation.copy(face.rotation);

      // Add inner glow effect
      const glowGeometry = new THREE.PlaneGeometry(1.6, 1.6);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: faceColors[index],
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(face.position);
      glow.rotation.copy(face.rotation);
      glow.position.z += position[2] * 0.01; // Slightly offset

      cubeGroup.add(face);
      cubeGroup.add(border);
      cubeGroup.add(glow);
      faces.push({ face, border, glow, index });
    });

    // Add main wireframe cube with silver color
    const wireframeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc0c0c0, // Silver
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframeCube = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    cubeGroup.add(wireframeCube);

    // Add floating particles around the cube
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 5;
    sceneRef.current = scene;
    cubeRef.current = cubeGroup;

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (_event: MouseEvent) => {
      isDragging = true;
      isRotatingRef.current = true;
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        isRotatingRef.current = false;
      }, 100);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
      };

      cubeGroup.rotation.y += deltaMove.x * 0.01;
      cubeGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
      };
    };

    const onWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(8, camera.position.z));
    };

    const onClick = (event: MouseEvent) => {
      if (isRotatingRef.current) return;

      // Raycasting for face detection
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const faceObjects = faces.map(f => f.face);
      const intersects = raycaster.intersectObjects(faceObjects);
      if (intersects.length > 0) {
        const clickedFaceData = faces.find(f => f.face === intersects[0].object);
        if (clickedFaceData) {
          setCurrentFace(clickedFaceData.index);
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('click', onClick);

    // Set initial rotation
    targetRotation.current = faceRotations[currentFace];

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth rotation to target
      if (targetRotation.current) {
        cubeGroup.rotation.x += (targetRotation.current[0] - cubeGroup.rotation.x) * 0.05;
        cubeGroup.rotation.y += (targetRotation.current[1] - cubeGroup.rotation.y) * 0.05;
        cubeGroup.rotation.z += (targetRotation.current[2] - cubeGroup.rotation.z) * 0.05;
      }

      // Gentle floating animation
      cubeGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;

      // Rotate particles
      particles.rotation.y += 0.001;

      // Update face highlighting and glow effects
      faces.forEach((faceData, index) => {
        const { face, border, glow } = faceData;
        
        if (index === currentFace) {
          // Active face - brighter and more opaque
          face.material.opacity = Math.min(0.9, face.material.opacity + 0.02);
          face.material.emissive.setHex(faceColors[index]);
          face.material.emissiveIntensity = 0.3;
          
          border.material.opacity = Math.min(1.0, border.material.opacity + 0.03);
          glow.material.opacity = Math.min(0.4, glow.material.opacity + 0.02);
          
          // Pulsing effect for active face
          const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
          border.material.opacity *= pulse;
          glow.material.opacity *= pulse;
        } else {
          // Inactive faces - dimmer
          face.material.opacity = Math.max(0.3, face.material.opacity - 0.02);
          face.material.emissive.setHex(0x000000);
          face.material.emissiveIntensity = 0;
          
          border.material.opacity = Math.max(0.4, border.material.opacity - 0.02);
          glow.material.opacity = Math.max(0.05, glow.material.opacity - 0.01);
        }
      });

      // Update accent light color and position
      accentLight.color.setHex(faceColors[currentFace]);
      accentLight.position.x = Math.sin(Date.now() * 0.002) * 3;
      accentLight.position.y = Math.cos(Date.now() * 0.003) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
     
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentFace, setCurrentFace]);

  // Update rotation when currentFace changes
  useEffect(() => {
    targetRotation.current = faceRotations[currentFace];
  }, [currentFace]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
