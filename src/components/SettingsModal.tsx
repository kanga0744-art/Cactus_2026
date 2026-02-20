import { useState, useEffect } from 'react';
import { X, Key, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function SettingsModal({ isOpen, onClose, apiKey, setApiKey }: SettingsModalProps) {
  const [localKey, setLocalKey] = useState(apiKey);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(localKey);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-cactus-900/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-cactus-800 rounded-[32px] p-8 z-50 shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-cactus-900 hover:bg-black/20 rounded-full transition-colors text-cactus-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-cactus-300 uppercase tracking-wider mb-3">
                  API Key (Optional)
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cactus-300/50" />
                  <input
                    type="password"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    placeholder="Enter key..."
                    className="w-full bg-cactus-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-sun-500/50 transition-colors font-medium"
                  />
                </div>
                <p className="text-[11px] text-cactus-300/50 mt-3 leading-relaxed">
                  Pollinations.ai is free. Add a key only if you have specific premium access needs.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-sun-500 text-cactus-900 font-bold py-4 rounded-2xl hover:bg-sun-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sun-500/20 uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
