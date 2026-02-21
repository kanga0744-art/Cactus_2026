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
            className="fixed inset-0 bg-nordic-dark/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: "-45%", y: "-50%" }}
            animate={{ opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, x: "-45%", y: "-50%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 w-[90%] max-w-sm bg-white rounded-sm p-10 z-50 shadow-2xl border border-nordic-dark/5 page-texture"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif italic text-nordic-dark flex items-center gap-3">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-paper-100 rounded-full transition-colors text-nordic-dark/20 hover:text-nordic-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[9px] font-black text-nordic-dark/30 uppercase tracking-[0.4em] mb-4">
                  API Key (Optional)
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nordic-dark/10" />
                  <input
                    type="password"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    placeholder="Enter key..."
                    className="w-full bg-paper-100 border border-nordic-dark/5 rounded-sm py-4 pl-12 pr-4 text-nordic-dark placeholder:text-nordic-dark/10 focus:outline-none focus:border-nordic-dark/20 transition-all font-medium"
                  />
                </div>
                <p className="text-[10px] text-nordic-dark/30 mt-4 leading-relaxed font-medium">
                  Pollinations.ai is free. Add a key only if you have specific premium access needs.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-nordic-blue text-nordic-dark font-black py-5 rounded-sm hover:bg-nordic-dark hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-[0.3em] text-[10px]"
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
