import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CatMeowVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create frequency bars in a circle
    const barCount = 64;
    const radius = 8;
    const bars: THREE.Mesh[] = [];

    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(0.3, 1, 0.3);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        shininess: 100
      });
      const bar = new THREE.Mesh(geometry, material);

      const angle = (i / barCount) * Math.PI * 2;
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.position.y = 0;

      scene.add(bar);
      bars.push(bar);
    }
    barsRef.current = bars;

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        bars.forEach((bar, i) => {
          const dataIndex = Math.floor((i / barCount) * dataArrayRef.current!.length);
          const value = dataArrayRef.current![dataIndex] / 255;

          // Scale height based on frequency
          const targetHeight = 0.5 + value * 10;
          bar.scale.y = bar.scale.y * 0.8 + targetHeight * 0.2;

          // Color based on frequency
          const hue = (i / barCount) * 360;
          const saturation = 70 + value * 30;
          const lightness = 40 + value * 30;
          
          bar.material.color.setHSL(hue / 360, saturation / 100, lightness / 100);
          (bar.material as THREE.MeshPhongMaterial).emissive.setHSL(hue / 360, saturation / 100, lightness / 100);
          (bar.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3 + value * 0.7;

          // Rotate slightly
          bar.rotation.y += 0.01;
        });
      }

      // Rotate camera slowly
      const time = Date.now() * 0.0001;
      camera.position.x = Math.sin(time) * 15;
      camera.position.z = Math.cos(time) * 15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      bars.forEach(bar => {
        bar.geometry.dispose();
        bar.material.dispose();
      });
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      setError(null);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to visualize audio.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
    setIsListening(false);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="p-4 bg-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-2">🐱 Cat Meow Audio Visualizer</h1>
        <p className="text-gray-300 mb-4">
          {isListening 
            ? 'Listening for your cat\'s meows... Watch the 3D visualization respond to sound!'
            : 'Click "Start Listening" to begin visualizing audio in 3D'}
        </p>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isListening ? '⏹ Stop Listening' : '🎤 Start Listening'}
        </button>
        {error && (
          <div className="mt-3 p-3 bg-red-900 text-red-200 rounded-lg">
            {error}
          </div>
        )}
      </div>
      <div ref={containerRef} className="flex-1" />
      <div className="p-3 bg-gray-800 text-gray-400 text-sm text-center">
        Frequency bars arranged in a circle • Colors represent different frequencies • Height shows volume intensity
      </div>
    </div>
  );
};

export default CatMeowVisualizer;

