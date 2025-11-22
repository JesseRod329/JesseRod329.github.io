import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectObjectsViaAPI, formatDetectionResult } from '../utils/detection';
import { FaTree, FaBuilding, FaPaw, FaBrick } from 'react-icons/fa';

const ObjectDetector = ({ 
  lat, 
  lng, 
  onDetection, 
  enabled = true,
  detectedObjects = [],
  onRemoveDetection 
}) => {
  const [clicking, setClicking] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const containerRef = useRef(null);

  const handleClick = useCallback(async (e) => {
    if (!enabled) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setClickPosition({ x, y });
    setClicking(true);
    
    // Create a small image capture of the clicked area
    // In production, you'd capture the actual image data
    const imageData = null; // Would be actual image data
    
    try {
      const detections = await detectObjectsViaAPI(imageData, lat, lng);
      
      if (detections.length > 0) {
        const detection = detections[0]; // Use first detection
        detection.position = { x, y };
        onDetection && onDetection(detection);
      }
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setTimeout(() => {
        setClicking(false);
        setClickPosition(null);
      }, 1000);
    }
  }, [enabled, lat, lng, onDetection]);

  const getIconForCategory = (category) => {
    switch (category) {
      case 'architecture':
        return <FaBuilding />;
      case 'material':
        return <FaBrick />;
      case 'flora':
        return <FaTree />;
      case 'fauna':
        return <FaPaw />;
      default:
        return <FaBuilding />;
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`absolute inset-0 z-10 ${enabled ? 'cursor-crosshair' : 'cursor-default'}`}
      style={{ pointerEvents: enabled ? 'auto' : 'none' }}
    >
      {/* Click ripple effect */}
      <AnimatePresence>
        {clicking && clickPosition && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute rounded-full border-2 border-blue-400"
            style={{
              left: `${clickPosition.x}%`,
              top: `${clickPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
            }}
          />
        )}
      </AnimatePresence>

      {/* Display detected objects */}
      {detectedObjects.map((obj, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute cursor-pointer group"
          style={{
            left: `${obj.position.x}%`,
            top: `${obj.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveDetection && onRemoveDetection(index);
          }}
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-3xl text-white drop-shadow-lg"
            >
              {getIconForCategory(obj.category)}
            </motion.div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {obj.type}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ObjectDetector;



