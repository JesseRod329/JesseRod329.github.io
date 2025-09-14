import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Placeholder content for each face
const faceContentData = [
  { type: 'text', content: 'About Me\n\nPassionate Developer', color: '#ffffff' }, // About
  { type: 'projects' }, // Projects (handled separately)
  { type: 'text', content: 'Skills\n\nReact, Three.js, GSAP', color: '#ffffff' }, // Skills
  { type: 'text', content: 'Experience\n\nGoogle, Apple, Meta', color: '#ffffff' }, // Experience
  { type: 'text', content: 'Contact\n\nEmail: hi@example.com', color: '#ffffff' }, // Contact
  { type: 'text', content: 'Links\n\nGitHub, LinkedIn', color: '#ffffff' }  // Links
];

interface ThreeSceneProps {
  currentFace: number;
  setCurrentFace: (face: number) => void;
  portfolioData: any[]; // Added portfolioData to the interface
}

export default function ThreeScene({ currentFace, setCurrentFace, portfolioData }: ThreeSceneProps) {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cubeRef = useRef<THREE.Group | null>(null);
  const targetRotation = useRef([0, 0, 0]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isRotatingRef = useRef(false);
  const projectSpritesRef = useRef<THREE.Sprite[]>([]); // To store project sprites for raycasting
  const [currentProjectPageIndex, setCurrentProjectPageIndex] = useState(0); // For project pagination

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

    // Helper to create text sprites
    const createTextSprite = (message: string, color = '#ffffff', fontSize = 60) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return new THREE.Sprite();

      const font = `${fontSize}px Arial`;
      context.font = font;
      const metrics = context.measureText(message);
      const textWidth = metrics.width;

      canvas.width = textWidth + 20; // Add some padding
      canvas.height = fontSize + 20; // Add some padding

      context.font = font;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(message, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);

      // Scale sprite based on text size
      sprite.scale.set(canvas.width * 0.005, canvas.height * 0.005, 1);
      return sprite;
    };

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

      // Add project titles to the "Projects" face (index 1)
      if (index === 1 && portfolioData && portfolioData.length > 0) {
        const projectsPerPage = 4;
        const totalProjectPages = Math.ceil(portfolioData.length / projectsPerPage);
        const startIndex = currentProjectPageIndex * projectsPerPage;
        const endIndex = Math.min(startIndex + projectsPerPage, portfolioData.length);
        const projectsToDisplay = portfolioData.slice(startIndex, endIndex);

        // Clear previous project sprites from the scene and ref
        projectSpritesRef.current.forEach(sprite => {
          cubeGroup.remove(sprite);
          sprite.material.dispose();
          sprite.geometry.dispose();
        });
        projectSpritesRef.current = []; 

        const itemHeight = 0.4; // Approximate height of a project title sprite
        const startY = (projectsToDisplay.length - 1) * itemHeight / 2; // Center vertically

        projectsToDisplay.forEach((project: any, projIndex: number) => {
          const projectSprite = createTextSprite(project.title, '#ffffff', 40);
          projectSprite.position.copy(face.position);
          projectSprite.position.z += 0.02; // Slightly in front of the face
          projectSprite.position.y = face.position.y + startY - (projIndex * itemHeight); // Stack vertically
          projectSprite.userData.project = project; // Store project data for interaction
          cubeGroup.add(projectSprite);
          projectSpritesRef.current.push(projectSprite);
        });

        // Add navigation buttons if more projects exist
        if (totalProjectPages > 1) {
          // Previous button
          if (currentProjectPageIndex > 0) {
            const prevButton = createTextSprite('<', '#00ff00', 50);
            prevButton.position.set(face.position.x - 0.7, face.position.y, face.position.z + 0.02);
            prevButton.userData.action = 'prevProjectPage';
            cubeGroup.add(prevButton);
            projectSpritesRef.current.push(prevButton);
          }

          // Next button
          if (currentProjectPageIndex < totalProjectPages - 1) {
            const nextButton = createTextSprite('>', '#00ff00', 50);
            nextButton.position.set(face.position.x + 0.7, face.position.y, face.position.z + 0.02);
            nextButton.userData.action = 'nextProjectPage';
            cubeGroup.add(nextButton);
            projectSpritesRef.current.push(nextButton);
          }

          // Page indicators
          const indicatorSpacing = 0.1;
          const indicatorsStartX = face.position.x - (totalProjectPages - 1) * indicatorSpacing / 2;
          for (let i = 0; i < totalProjectPages; i++) {
            const indicatorColor = (i === currentProjectPageIndex) ? '#00ff00' : '#666666';
            const indicator = createTextSprite('•', indicatorColor, 30);
            indicator.position.set(indicatorsStartX + i * indicatorSpacing, face.position.y - 0.8, face.position.z + 0.02);
            cubeGroup.add(indicator);
            projectSpritesRef.current.push(indicator); // Add to sprites for cleanup
          }
        }
      }
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
    let hoveredSprite: THREE.Sprite | null = null; // To keep track of the currently hovered sprite
    let hoveredFace: THREE.Mesh | null = null; // To keep track of the currently hovered face

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
      if (!isDragging) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Check for face hovers
        const faceObjects = faces.map(f => f.face);
        const intersectsFaces = raycaster.intersectObjects(faceObjects);

        if (intersectsFaces.length > 0) {
          const intersected = intersectsFaces[0].object as THREE.Mesh;
          if (hoveredFace !== intersected) {
            if (hoveredFace) {
              // Reset previous hovered face
              (hoveredFace.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
            }
            hoveredFace = intersected;
            // Highlight new hovered face
            (hoveredFace.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5; // Brighter emissive
          }
        } else {
          if (hoveredFace) {
            // Reset if no face is hovered
            (hoveredFace.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
            hoveredFace = null;
          }
        }

        // Check for project sprite hovers
        const intersectsSprites = raycaster.intersectObjects(projectSpritesRef.current);

        if (intersectsSprites.length > 0) {
          const intersected = intersectsSprites[0].object as THREE.Sprite;
          if (hoveredSprite !== intersected) {
            if (hoveredSprite) {
              // Reset previous hovered sprite
              (hoveredSprite.material as THREE.SpriteMaterial).color.set(0xffffff);
            }
            hoveredSprite = intersected;
            // Highlight new hovered sprite
            (hoveredSprite.material as THREE.SpriteMaterial).color.set(0x00ff00); // Green highlight
          }
        } else {
          if (hoveredSprite) {
            // Reset if no sprite is hovered
            (hoveredSprite.material as THREE.SpriteMaterial).color.set(0xffffff);
            hoveredSprite = null;
          }
        }
      }

      if (!isDragging) return;

      const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
      };

      // Update targetRotation based on mouse movement
      targetRotation.current[1] += deltaMove.x * 0.005; // Reduced sensitivity
      targetRotation.current[0] += deltaMove.y * 0.005; // Reduced sensitivity

      previousMousePosition = {
        x: event.offsetX,
        y: event.y
      };
    };

    const onWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.005; // Reduced zoom sensitivity
      camera.position.z = Math.max(3, Math.min(8, camera.position.z));
    };

    const onClick = (event: MouseEvent) => {
      // Only allow click if not currently dragging or rotating from a previous drag
      if (isDragging || isRotatingRef.current) return;

      // Raycasting for face detection
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check for face clicks
      const faceObjects = faces.map(f => f.face);
      const intersectsFaces = raycaster.intersectObjects(faceObjects);
      if (intersectsFaces.length > 0) {
        const clickedFaceData = faces.find(f => f.face === intersectsFaces[0].object);
        if (clickedFaceData) {
          setCurrentFace(clickedFaceData.index);
          return; // Face clicked, don't check project sprites
        }
      }

      // Check for project sprite clicks
      const intersectsSprites = raycaster.intersectObjects(projectSpritesRef.current);
      if (intersectsSprites.length > 0) {
        const clickedSprite = intersectsSprites[0].object as THREE.Sprite;
        if (clickedSprite.userData.project) {
          navigate(`/projects/${clickedSprite.userData.project.slug}`);
        } else if (clickedSprite.userData.action === 'prevProjectPage') {
          setCurrentProjectPageIndex(prev => Math.max(0, prev - 1));
        } else if (clickedSprite.userData.action === 'nextProjectPage') {
          setCurrentProjectPageIndex(prev => prev + 1);
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('click', onClick);

    // Set initial rotation
    targetRotation.current = [...faceRotations[currentFace]]; // Use spread to create a new array

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth rotation to target
      if (targetRotation.current) {
        cubeGroup.rotation.x += (targetRotation.current[0] - cubeGroup.rotation.x) * 0.03; // Reduced speed
        cubeGroup.rotation.y += (targetRotation.current[1] - cubeGroup.rotation.y) * 0.03; // Reduced speed
        cubeGroup.rotation.z += (targetRotation.current[2] - cubeGroup.rotation.z) * 0.03; // Reduced speed
      }

      // Gentle floating animation (commented out for stability)
      // cubeGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;

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
  }, [currentFace, setCurrentFace, portfolioData, currentProjectPageIndex]);

  // Update rotation when currentFace changes
  useEffect(() => {
    targetRotation.current = faceRotations[currentFace];
  }, [currentFace]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
