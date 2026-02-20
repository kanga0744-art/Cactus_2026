import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import React from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2d4a3d] text-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sun-500/20 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-cactus-300/15 blur-[180px] rounded-full" />
      </div>

      <div className="relative w-48 h-48 mb-4 z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* Pot */}
          <motion.path
            d="M65 170 L55 140 H145 L135 170 H65 Z"
            fill="#D4AC0D"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ originX: "50%", originY: "100%" }}
          />
          
          {/* Main Trunk */}
          <motion.path
            d="M100 145 V 40"
            stroke="#A8C6A0"
            strokeWidth="24"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
          
          {/* Left Arm */}
          <motion.path
            d="M100 100 Q 60 100 60 70 V 55"
            stroke="#A8C6A0"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          />

          {/* Right Arm */}
          <motion.path
            d="M100 85 Q 140 85 140 55 V 45"
            stroke="#A8C6A0"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
          />

          {/* Flower on top */}
          <motion.circle
            cx="100"
            cy="35"
            r="8"
            fill="#F4D03F"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          />
        </svg>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-display font-bold text-xl text-sun-500">
          {Math.round(progress)}%
        </div>
      </div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-sans tracking-widest uppercase text-cactus-100 mt-4"
      >
        Planting Seeds...
      </motion.h1>
    </motion.div>
  );
};
