/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Generator } from './components/Generator';
import { SettingsModal } from './components/SettingsModal';
import { Settings as SettingsIcon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pollinations_api_key') || '');

  useEffect(() => {
    localStorage.setItem('pollinations_api_key', apiKey);
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-cactus-800 flex items-center justify-center font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-[100dvh] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left/Top Section - Branding & Vertical Text */}
            <div className="relative z-10 p-6 md:p-12 flex flex-row md:flex-col justify-between items-start md:items-center pointer-events-none w-full md:w-auto md:h-full">
              {/* Logo Area */}
              <div className="flex flex-col items-start pointer-events-auto">
                <div className="flex items-center gap-2 text-sun-500 mb-1">
                  <span className="text-2xl">✿</span>
                  <span className="font-bold tracking-wider uppercase text-sm">Planet<br/>Desert</span>
                </div>
              </div>

              {/* Huge Vertical Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 flex items-center justify-center">
                 <h1 className="text-[15vw] md:text-[12vh] font-display font-bold text-white leading-none tracking-tighter opacity-10 md:opacity-100 md:text-vertical select-none whitespace-nowrap">
                  CACTUS AI
                </h1>
              </div>

              {/* Footer / Credits */}
              <div className="hidden md:flex flex-col gap-4 text-[10px] uppercase tracking-widest text-cactus-300 text-vertical">
                <span>Inspired by Nature</span>
                <span>Powered by Pollinations.ai</span>
              </div>
              
              {/* Mobile Menu Button */}
               <button 
                onClick={() => setShowSettings(true)}
                className="md:hidden pointer-events-auto p-2 text-sun-500"
              >
                <SettingsIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content Area - Overlapping Card */}
            <main className="flex-1 relative z-20 flex flex-col md:justify-center px-4 pb-4 md:p-8 md:pl-0 h-full">
              {/* Desktop Header Actions */}
              <div className="hidden md:flex absolute top-8 right-8 z-30 gap-6 items-center">
                <nav className="flex gap-6 text-xs font-bold uppercase tracking-widest text-cactus-100">
                  <a href="#" className="hover:text-sun-500 transition-colors">Home</a>
                  <a href="#" className="hover:text-sun-500 transition-colors">Catalogue</a>
                  <a href="#" className="hover:text-sun-500 transition-colors">Sale %</a>
                </nav>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-cactus-900 rounded-full text-sun-500 hover:bg-black/20 transition-colors"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Generator Container */}
              <div className="w-full h-full md:h-[90%] bg-cactus-300/10 backdrop-blur-sm rounded-[40px] border border-white/10 overflow-hidden relative flex flex-col">
                {/* Decorative Circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-sun-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
                
                <Generator apiKey={apiKey} />
              </div>
            </main>

            {/* Modals */}
            <SettingsModal 
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

