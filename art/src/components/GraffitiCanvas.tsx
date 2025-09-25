import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Color, ToolType, ParticleConfig, GraffitiCanvasRef } from '../types';

interface GraffitiCanvasProps {
  selectedColor: Color;
  selectedTool: ToolType;
  cursorPosition: { x: number; y: number };
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  brushSize: number;
  opacity: number;
  particleConfig: ParticleConfig;
  onSoundPlay: (sound: string) => void;
}

const GraffitiCanvas = forwardRef<GraffitiCanvasRef, GraffitiCanvasProps>(({
  selectedColor,
  selectedTool,
  cursorPosition: _cursorPosition,
  isDrawing: _isDrawing,
  setIsDrawing,
  brushSize,
  opacity,
  particleConfig,
  onSoundPlay,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          saveToHistory();
        }
      }
    },
    save: () => {
      return canvasRef.current?.toDataURL('image/png') || '';
    },
    load: (data: string) => {
      if (canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.drawImage(img, 0, 0);
            saveToHistory();
          }
        };
        img.src = data;
      }
    },
    undo: () => {
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--;
        loadFromHistory();
      }
    },
    redo: () => {
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyIndexRef.current++;
        loadFromHistory();
      }
    }
  }));

  const saveToHistory = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(dataURL);
      historyIndexRef.current = historyRef.current.length - 1;
    }
  };

  const loadFromHistory = () => {
    if (canvasRef.current && historyRef.current[historyIndexRef.current]) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = historyRef.current[historyIndexRef.current];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up drawing styles
    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawSpray = (x: number, y: number) => {
      const sprayRadius = brushSize;
      const particleCount = particleConfig.count;
      
      ctx.fillStyle = selectedColor.hex;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * sprayRadius;
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance;
        const size = particleConfig.size.min + Math.random() * (particleConfig.size.max - particleConfig.size.min);
        
        ctx.globalAlpha = (Math.random() * 0.8 + 0.2) * opacity;
        ctx.beginPath();
        ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    };

    const drawBrush = (x: number, y: number, prevX: number, prevY: number) => {
      ctx.strokeStyle = selectedColor.hex;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawFill = (x: number, y: number) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const targetColor = getPixelColor(imageData, x, y);
      const fillColor = hexToRgba(selectedColor.hex, opacity);
      
      if (colorsEqual(targetColor, fillColor)) return;
      
      const stack = [{ x, y }];
      const visited = new Set();
      
      while (stack.length > 0) {
        const { x: currentX, y: currentY } = stack.pop()!;
        const key = `${currentX},${currentY}`;
        
        if (visited.has(key) || currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) {
          continue;
        }
        
        visited.add(key);
        const currentColor = getPixelColor(imageData, currentX, currentY);
        
        if (colorsEqual(currentColor, targetColor)) {
          setPixelColor(imageData, currentX, currentY, fillColor);
          stack.push(
            { x: currentX + 1, y: currentY },
            { x: currentX - 1, y: currentY },
            { x: currentX, y: currentY + 1 },
            { x: currentX, y: currentY - 1 }
          );
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    // Helper functions for flood fill
    const getPixelColor = (imageData: ImageData, x: number, y: number) => {
      const index = (y * imageData.width + x) * 4;
      return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
      };
    };

    const setPixelColor = (imageData: ImageData, x: number, y: number, color: any) => {
      const index = (y * imageData.width + x) * 4;
      imageData.data[index] = color.r;
      imageData.data[index + 1] = color.g;
      imageData.data[index + 2] = color.b;
      imageData.data[index + 3] = color.a;
    };

    const colorsEqual = (color1: any, color2: any) => {
      return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a;
    };

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b, a: Math.round(alpha * 255) };
    };

    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true;
      setIsDrawing(true);
      lastX = e.clientX;
      lastY = e.clientY;
      
      onSoundPlay(selectedTool);
      
      switch (selectedTool) {
        case 'spray':
          drawSpray(e.clientX, e.clientY);
          break;
        case 'brush':
          // Start brush stroke
          break;
        case 'fill':
          drawFill(e.clientX, e.clientY);
          break;
        case 'eraser':
          drawSpray(e.clientX, e.clientY);
          break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawingRef.current) {
        switch (selectedTool) {
          case 'spray':
            drawSpray(e.clientX, e.clientY);
            break;
          case 'brush':
            drawBrush(e.clientX, e.clientY, lastX, lastY);
            break;
          case 'eraser':
            drawSpray(e.clientX, e.clientY);
            break;
        }
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        setIsDrawing(false);
        saveToHistory();
      }
    };

    const handleMouseLeave = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        setIsDrawing(false);
        saveToHistory();
      }
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [selectedColor, selectedTool, brushSize, opacity, particleConfig, onSoundPlay, setIsDrawing]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-5 cursor-crosshair"
      style={{ touchAction: 'none' }}
    />
  );
});

GraffitiCanvas.displayName = 'GraffitiCanvas';

export default GraffitiCanvas;
