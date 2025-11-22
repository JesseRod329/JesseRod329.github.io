import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTree, FaBuilding, FaPaw, FaBrick, FaTimes } from 'react-icons/fa';
import { formatDetectionResult } from '../utils/detection';

const ObjectPanel = ({ detectedObjects = [], onRemove }) => {
  const getIconForCategory = (category) => {
    switch (category) {
      case 'architecture':
        return <FaBuilding className="text-blue-400" />;
      case 'material':
        return <FaBrick className="text-orange-400" />;
      case 'flora':
        return <FaTree className="text-green-400" />;
      case 'fauna':
        return <FaPaw className="text-purple-400" />;
      default:
        return <FaBuilding />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'architecture':
        return 'bg-blue-500/20 border-blue-400';
      case 'material':
        return 'bg-orange-500/20 border-orange-400';
      case 'flora':
        return 'bg-green-500/20 border-green-400';
      case 'fauna':
        return 'bg-purple-500/20 border-purple-400';
      default:
        return 'bg-gray-500/20 border-gray-400';
    }
  };

  const groupedObjects = detectedObjects.reduce((acc, obj) => {
    const key = `${obj.category}-${obj.type}`;
    if (!acc[key]) {
      acc[key] = { ...obj, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const objectsList = Object.values(groupedObjects);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="fixed left-4 top-20 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <div className="bg-black/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Detected Objects</h3>
          <span className="text-white/60 text-sm">{detectedObjects.length} found</span>
        </div>

        {objectsList.length === 0 ? (
          <div className="text-white/60 text-center py-8">
            <p>Click on objects in the Street View</p>
            <p className="text-xs mt-2">to detect architecture, materials, flora, and fauna</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {objectsList.map((obj, index) => {
                const formatted = formatDetectionResult(obj);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded-lg p-3 ${getCategoryColor(obj.category)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl mt-1">
                          {getIconForCategory(obj.category)}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{formatted.type}</div>
                          <div className="text-white/60 text-xs mt-1 capitalize">
                            {formatted.category}
                          </div>
                          {obj.count > 1 && (
                            <div className="text-white/40 text-xs mt-1">
                              Found {obj.count} times
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-white/40 text-xs">
                        {formatted.confidence}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ObjectPanel;



