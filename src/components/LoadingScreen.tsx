import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import React from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onComplete, 1200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper-50 overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Full Screen Immersive Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        
        {/* The "Under" Layer (The actual book content waiting) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="w-full h-full max-w-[1200px] max-h-[800px] bg-paper-100 shadow-2xl flex flex-col items-center justify-center p-12 md:p-24 page-texture rounded-sm"
           >
              <div className="w-full h-full border border-nordic-dark/5 rounded-sm flex flex-col items-center justify-center gap-12">
                <span className="font-serif italic text-3xl md:text-5xl text-nordic-dark/30">The Story Begins</span>
                <div className="w-24 h-[1px] bg-nordic-dark/10" />
                <span className="font-sans font-black uppercase tracking-[0.6em] text-[10px] md:text-xs text-nordic-dark/20">Editorial Edition • Vol. 01</span>
              </div>
           </motion.div>
        </div>

        {/* The "Cloth" Layer (The cover being pulled) */}
        <motion.div
          className="absolute inset-0 z-10 cursor-pointer overflow-hidden flex items-center justify-center"
          animate={isOpen ? { 
            x: "100%",
            rotate: 5,
            scale: 1.1,
          } : { 
            x: "0%",
            rotate: 0,
            scale: 1,
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={!isOpen ? handleOpen : undefined}
        >
          {/* Crumpled Cloth Cover */}
          <div className="relative w-full h-full max-w-[1200px] max-h-[800px] bg-nordic-blue shadow-[0_50px_100px_-20px_rgba(30,58,95,0.4)] rounded-sm flex flex-col items-center justify-between p-12 md:p-24 cloth-texture overflow-hidden">
            
            {/* Cloth Wrinkle Effects (Simulated with Gradients) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
            
            <div className="flex flex-col items-center gap-4 relative z-20">
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif italic text-5xl md:text-8xl text-nordic-dark"
              >
                Cactus
              </motion.span>
              <div className="w-16 h-[1px] bg-nordic-dark/20 my-4" />
              <span className="font-sans font-black uppercase tracking-[0.8em] text-[10px] md:text-sm text-nordic-dark/40">Editorial Edition</span>
            </div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group flex flex-col items-center z-20"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full group-hover:bg-white/30 transition-all" />
              <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-64 md:h-64 relative z-10 drop-shadow-[0_20px_50px_rgba(30,58,95,0.3)]">
                {/* Pot */}
                <path d="M65 170 L55 140 H145 L135 170 H65 Z" fill="#1E3A5F" />
                {/* Main Trunk */}
                <path d="M100 145 V 40" stroke="#1E3A5F" strokeWidth="24" strokeLinecap="round" />
                {/* Left Arm */}
                <path d="M100 100 Q 60 100 60 70 V 55" stroke="#1E3A5F" strokeWidth="20" strokeLinecap="round" fill="none" />
                {/* Right Arm */}
                <path d="M100 85 Q 140 85 140 55 V 45" stroke="#1E3A5F" strokeWidth="20" strokeLinecap="round" fill="none" />
                {/* Flower */}
                <circle cx="100" cy="35" r="8" fill="#E8A0BF" />
              </svg>
              
              {!isOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12"
                >
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-nordic-dark/40 animate-pulse">Pull to Reveal the Story</span>
                </motion.div>
              )}
            </motion.div>

            <div className="flex flex-col items-center gap-6 relative z-20">
              <span className="font-serif italic text-xl md:text-2xl text-nordic-dark/60">Volume I • Spring 2026</span>
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-pastel-blue/40" />
                <div className="w-3 h-3 rounded-full bg-pastel-blue/60" />
                <div className="w-3 h-3 rounded-full bg-pastel-blue/80" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
