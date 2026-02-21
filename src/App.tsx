/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Generator } from './components/Generator';
import { SettingsModal } from './components/SettingsModal';
import { Settings as SettingsIcon, User, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pollinations_api_key') || '');
  const [balance, setBalance] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const closeBook = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    localStorage.setItem('pollinations_api_key', apiKey);
    if (apiKey) {
      fetchAccountInfo(apiKey);
    } else {
      setBalance(null);
      setProfile(null);
    }
  }, [apiKey]);

  const fetchAccountInfo = async (key: string) => {
    try {
      const [balanceRes, profileRes] = await Promise.all([
        fetch('https://gen.pollinations.ai/account/balance', {
          headers: { Authorization: `Bearer ${key.trim()}` }
        }),
        fetch('https://gen.pollinations.ai/account/profile', {
          headers: { Authorization: `Bearer ${key.trim()}` }
        })
      ]);

      if (balanceRes.ok) {
        const data = await balanceRes.json();
        setBalance(data.balance);
      }
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }
    } catch (e) {
      console.error("Failed to fetch account info", e);
    }
  };

  return (
    <div className="min-h-screen bg-paper-50 flex items-center justify-center font-sans overflow-hidden relative page-texture">
      {/* Editorial Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pastel-blue/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pastel-blue/40 blur-[150px] rounded-full" />
      </div>

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
            {/* Left Sidebar - Spine / Table of Contents Style */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-40 p-6 md:p-10 flex flex-row md:flex-col justify-between items-center md:items-stretch pointer-events-none w-full md:w-[260px] md:h-full bg-paper-100/90 backdrop-blur-xl border-b md:border-b-0 md:border-r border-nordic-blue/20 shadow-sm"
            >
              <div className="flex flex-col gap-10 md:gap-12 w-full">
                <div className="flex items-center justify-between w-full pointer-events-auto">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col gap-1 text-nordic-dark cursor-default"
                  >
                    <span className="font-serif italic text-2xl md:text-3xl leading-none">Cactus</span>
                    <span className="font-sans font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] opacity-60">Editorial Edition</span>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeBook}
                    className="p-2 text-nordic-dark/20 hover:text-pastel-rose transition-colors"
                    title="Close Book"
                  >
                    <div className="w-5 h-5 flex items-center justify-center border border-current rounded-sm">
                      <span className="text-[10px] font-black">✕</span>
                    </div>
                  </motion.button>
                </div>

                {/* Desktop Detailed Account Info Area */}
                <div className="hidden md:flex flex-col items-center pointer-events-auto">
                  {apiKey && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4 p-6 bg-white rounded-[2px] border border-nordic-dark/5 w-full book-shadow"
                    >
                      <div className="flex flex-col gap-2 border-b border-nordic-dark/5 pb-4">
                        <div className="flex items-center gap-3 text-nordic-dark">
                          <User className="w-4 h-4 opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] truncate">
                            {profile?.name || 'Loading...'}
                          </span>
                        </div>
                        <span className="text-[8px] font-medium text-nordic-dark/40 uppercase tracking-[0.3em] ml-7">
                          {profile?.tier || 'Free Tier'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-nordic-dark/40">
                          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Credits</span>
                          <Wallet className="w-3 h-3" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-serif italic text-nordic-dark leading-none">
                            {balance ?? 0}
                          </span>
                          <span className="text-[7px] font-black text-nordic-dark/30 uppercase tracking-[0.4em]">Pollen</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Mobile Account Info Area */}
              {apiKey && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="md:hidden flex items-center gap-2 p-1.5 px-3 bg-white rounded-full border border-nordic-dark/5 pointer-events-auto shadow-sm"
                >
                  <div className="flex items-center gap-2 border-r border-nordic-dark/5 pr-2">
                    <User className="w-3 h-3 text-nordic-dark/40" />
                    <span className="text-[9px] font-bold text-nordic-dark uppercase tracking-wider truncate max-w-[50px]">{profile?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-pastel-rose">
                    <Wallet className="w-3 h-3" />
                    <span className="text-[8px] font-mono font-bold text-nordic-dark">{balance ?? 0}</span>
                  </div>
                </motion.div>
              )}

              {/* Huge Vertical Text - Editorial Style */}
              <div className="hidden md:flex flex-1 flex-col items-center justify-center py-12">
                 <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[8vh] font-serif italic font-light text-nordic-dark/10 leading-none tracking-tighter text-vertical select-none whitespace-nowrap cursor-default"
                >
                  The Art of Generation
                </motion.h1>
              </div>

              {/* Footer / Credits */}
              <div className="hidden md:flex flex-col gap-8 mt-10">
                <div className="flex flex-col gap-3">
                  <span className="text-[7px] font-black uppercase tracking-[0.5em] text-nordic-dark/30">Current Palette</span>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-pastel-blue shadow-sm" title="Blue" />
                    <div className="w-2.5 h-2.5 rounded-full bg-pastel-blue/60 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-pastel-blue/30 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-pastel-lavender shadow-sm" title="Lavender" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-[8px] font-medium uppercase tracking-[0.4em] text-nordic-dark/20 text-vertical">
                  <span>Issue No. 01</span>
                  <span>Spring 2026</span>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
               <button 
                onClick={() => setShowSettings(true)}
                className="md:hidden pointer-events-auto p-2 text-nordic-dark/40 hover:text-nordic-dark transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Main Content Area */}
            <motion.main 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 relative z-20 flex flex-col h-full overflow-hidden bg-paper-50"
            >
              {/* Desktop Header Actions */}
              <div className="hidden md:flex absolute top-8 right-10 z-30 gap-6 items-center">
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-white border border-ink-900/5 rounded-full text-ink-900/40 hover:text-ink-900 transition-all book-shadow"
                >
                  <SettingsIcon className="w-4 h-4" />
                </motion.button>
              </div>

              <Generator 
                apiKey={apiKey} 
                onSuccess={() => apiKey && fetchAccountInfo(apiKey)} 
              />
            </motion.main>

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

