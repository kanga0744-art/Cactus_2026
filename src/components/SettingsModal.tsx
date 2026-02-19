import { useState, useEffect } from 'react';
import { Settings, X, Key, Save, User, Wallet, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function SettingsModal({ isOpen, onClose, apiKey, setApiKey }: SettingsModalProps) {
  const [localKey, setLocalKey] = useState(apiKey);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    setLocalKey(apiKey);
    if (isOpen && apiKey) {
      fetchAccountInfo(apiKey);
    }
  }, [apiKey, isOpen]);

  const fetchAccountInfo = async (key: string) => {
    setLoadingProfile(true);
    try {
      const [profileRes, balanceRes] = await Promise.all([
        fetch('https://gen.pollinations.ai/account/profile', {
          headers: { Authorization: `Bearer ${key}` }
        }),
        fetch('https://gen.pollinations.ai/account/balance', {
          headers: { Authorization: `Bearer ${key}` }
        })
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      if (balanceRes.ok) setBalance(await balanceRes.json());
    } catch (e) {
      console.error("Failed to fetch account info", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSave = () => {
    setApiKey(localKey);
    if (localKey) fetchAccountInfo(localKey);
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
              {/* Account Info Section */}
              {apiKey && (
                <div className="bg-cactus-900/50 rounded-2xl p-4 border border-white/5 space-y-3">
                  <h3 className="text-xs font-bold text-cactus-300 uppercase tracking-wider mb-2">Account Info</h3>
                  {loadingProfile ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 text-sun-500 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-white">
                          <User className="w-4 h-4 text-cactus-300" />
                          <span>{profile?.name || 'Unknown User'}</span>
                        </div>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-cactus-200 uppercase">{profile?.tier || 'Free'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-white">
                          <Wallet className="w-4 h-4 text-cactus-300" />
                          <span>Balance</span>
                        </div>
                        <span className="font-mono text-sun-500">{balance?.balance ?? 0} Pollen</span>
                      </div>
                    </>
                  )}
                </div>
              )}

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
