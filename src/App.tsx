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
    <div className="min-h-screen bg-[#2d4a3d] flex items-center justify-center font-sans overflow-hidden relative">
      {/* Atmospheric Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[70%] h-[70%] bg-sun-500/30 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[80%] h-[80%] bg-cactus-300/25 blur-[200px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-sun-600/20 blur-[120px] rounded-full animate-bounce duration-[10s]" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(78,107,94,0.3)_0%,transparent_80%)]" 
        />
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
            {/* Left Sidebar - Branding & Account Info */}
            <div className="relative z-40 p-4 md:p-10 flex flex-row md:flex-col justify-between items-center md:items-stretch pointer-events-none w-full md:w-[280px] md:h-full bg-cactus-900/40 md:bg-cactus-900/20 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10">
              {/* Logo Area */}
              <div className="flex items-center pointer-events-auto">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 text-sun-500 cursor-default"
                >
                  <span className="text-xl md:text-3xl">✿</span>
                  <span className="font-bold tracking-tighter uppercase text-[10px] md:text-lg leading-tight">Planet<br/>Desert</span>
                </motion.div>
              </div>

              {/* Mobile Account Info Area - Centered between Logo and Settings */}
              {apiKey && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="md:hidden flex items-center gap-2 p-1.5 px-3 bg-white/[0.08] backdrop-blur-2xl rounded-full border border-white/20 pointer-events-auto shadow-lg"
                >
                  <div className="flex items-center gap-2 border-r border-white/10 pr-2">
                    <div className="w-6 h-6 rounded-full bg-sun-500/20 flex items-center justify-center border border-sun-500/30">
                      <User className="w-3 h-3 text-sun-500" />
                    </div>
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider truncate max-w-[50px]">{profile?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sun-500">
                    <Wallet className="w-3 h-3" />
                    <span className="text-[10px] font-mono font-bold">{balance ?? 0}</span>
                  </div>
                </motion.div>
              )}

              {/* Huge Vertical Text - Now integrated into sidebar for PC */}
              <div className="hidden md:flex flex-1 flex-col items-center justify-center py-12">
                 <motion.h1 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    x: [0, -5, 5, -5, 5, 0],
                    transition: { duration: 0.4 }
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-[10vh] font-display font-bold text-white leading-none tracking-tighter text-vertical select-none whitespace-nowrap drop-shadow-2xl cursor-default opacity-80"
                >
                  CACTUS AI
                </motion.h1>
              </div>

              {/* Mobile CACTUS AI - Background Shading */}
              <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <h1 className="text-[12vw] font-display font-bold text-black/10 leading-none tracking-tighter select-none whitespace-nowrap drop-shadow-sm">
                  CACTUS AI
                </h1>
              </div>
              
              {/* Desktop Detailed Account Info Area */}
              <div className="hidden md:flex flex-col items-center">
                {apiKey && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col gap-3 p-5 bg-white/[0.08] backdrop-blur-2xl rounded-[32px] border-2 border-white/20 pointer-events-auto w-full shadow-xl"
                  >
                    <div className="flex flex-col gap-1.5 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-sun-500/10 rounded-xl border border-sun-500/20">
                          <User className="w-4 h-4 text-sun-500" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                          {profile?.name || 'Loading...'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-sun-500 uppercase tracking-[0.2em] ml-10">
                          {profile?.tier || 'Free Tier'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-cactus-300">
                          <Wallet className="w-4 h-4" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Balance</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-sun-500 animate-pulse" />
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-mono font-bold text-sun-500 leading-none">
                          {balance ?? 0}
                        </span>
                        <span className="text-[9px] font-bold text-cactus-400 uppercase tracking-widest">Pollen</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer / Credits */}
              <div className="hidden md:flex flex-col gap-4 text-[9px] uppercase tracking-[0.3em] text-cactus-300/50 text-vertical mt-8">
                <span>Inspired by Nature</span>
                <span>Powered by Pollinations.ai</span>
              </div>
              
              {/* Mobile Menu Button */}
               <button 
                onClick={() => setShowSettings(true)}
                className="md:hidden pointer-events-auto p-2 text-sun-500 hover:scale-110 transition-transform"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 relative z-20 flex flex-col h-full overflow-hidden">
              {/* Desktop Header Actions */}
              <div className="hidden md:flex absolute top-6 right-6 z-30 gap-4 items-center">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-full text-sun-500 hover:bg-sun-500 hover:text-cactus-900 transition-all shadow-xl"
                >
                  <SettingsIcon className="w-5 h-5" />
                </motion.button>
              </div>

              <Generator apiKey={apiKey} />
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

