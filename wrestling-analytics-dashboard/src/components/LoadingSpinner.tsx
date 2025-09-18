import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
        />
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          Loading Wrestling Data
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Analyzing matches and preparing visualizations...
        </motion.p>
        
        {/* Wrestling-themed loading messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🥊 Loading 594 wrestler datasets...
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
