import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, Image as ImageIcon, Maximize2, Wand2, SlidersHorizontal, ArrowRight, AlertCircle } from 'lucide-react';
import { ModelSelector } from './ModelSelector';

interface GeneratorProps {
  apiKey: string;
}

export function Generator({ apiKey }: GeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000));
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [model, setModel] = useState('flux');
  const [showOptions, setShowOptions] = useState(false);
  const [referenceImage, setReferenceImage] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);

    // Construct URL using URLSearchParams for reliability
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('height', height.toString());
    params.append('seed', newSeed.toString());
    params.append('model', model);
    params.append('nologo', 'true');

    if (referenceImage) {
      params.append('image', referenceImage);
    }

    // Add key to params as well, just in case
    if (apiKey) {
      params.append('key', apiKey.trim());
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

    try {
      // Use fetch to check for errors first
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        try {
            // Try to parse JSON error if possible
            const jsonError = JSON.parse(errorText);
            throw new Error(jsonError.error?.message || jsonError.message || `Generation failed: ${response.status} ${response.statusText}`);
        } catch (e) {
            // Fallback to text or status
            throw new Error(errorText || `Generation failed: ${response.status} ${response.statusText}`);
        }
      }

      // If successful, get the blob
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      setImageUrl(objectUrl);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `cactus-ai-${seed}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed", e);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="flex h-full w-full bg-transparent overflow-hidden p-2 md:p-8 gap-4 md:gap-8">
      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 gap-4 md:gap-8">
        
        {/* Image Display Area - Floating Glass Style */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative w-full flex flex-col items-center justify-center p-4 md:p-10 overflow-hidden bg-white/[0.08] backdrop-blur-2xl border-2 border-white/20 rounded-[32px] md:rounded-[56px] shadow-none min-h-0"
        >
          <AnimatePresence mode="wait">
            {imageUrl ? (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-full h-full flex items-center justify-center rounded-[24px] md:rounded-[40px] overflow-hidden group bg-black/30 border-2 border-white/10"
              >
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-contain"
                />
                {/* Floating Actions */}
                <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDownload}
                    className="p-3 bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 transition-all shadow-xl"
                    title="Download"
                  >
                    <Download className="w-6 h-6" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="p-3 bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 transition-all shadow-xl"
                    title="Full Screen"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-cactus-300 p-8 text-center max-w-md"
              >
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 md:w-16 md:h-16 bg-cactus-800/40 rounded-full flex items-center justify-center mb-3 md:mb-5 border-2 border-white/10 shadow-2xl"
                >
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-sun-500 opacity-60" />
                </motion.div>
                <h3 className="text-base md:text-lg font-display font-bold text-white mb-2 md:mb-3 uppercase tracking-[0.2em] drop-shadow-lg">
                  Start Creating
                </h3>
                <p className="text-[10px] md:text-xs opacity-70 leading-relaxed font-medium">
                  Unleash your imagination. Describe your vision below and watch the magic happen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-2xl backdrop-blur-xl z-30 max-w-[90%] border-2 border-white/20"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="truncate">{error}</span>
            </motion.div>
          )}

          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-cactus-900/60 backdrop-blur-2xl flex flex-col items-center justify-center z-20 rounded-[32px] md:rounded-[56px]">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-white/10 border-t-sun-500 rounded-full animate-spin shadow-[0_0_20px_rgba(244,208,63,0.3)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-sun-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sun-500 font-bold tracking-[0.4em] uppercase text-sm mt-8 animate-pulse drop-shadow-lg">Crafting Masterpiece...</p>
            </div>
          )}
        </motion.div>

        {/* Bottom Bar - Floating Glass Style */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.08] backdrop-blur-2xl border-2 border-white/20 rounded-[24px] md:rounded-[48px] shadow-none z-30 shrink-0 p-3 md:p-6"
        >
          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
             {/* Prompt Input & Desktop Button */}
             <div className="relative w-full flex gap-2 md:gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                  placeholder="Describe your imagination..."
                  className="w-full bg-cactus-900/50 border-2 border-white/10 rounded-[16px] md:rounded-[32px] py-3 md:py-4 pl-5 md:pl-8 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all shadow-inner text-sm md:text-lg font-medium"
                />
              </div>
              
              {/* Mobile Settings Toggle */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOptions(!showOptions)}
                className={`md:hidden p-3 rounded-[16px] border-2 border-white/10 transition-colors ${showOptions ? 'bg-sun-500 text-cactus-900 border-sun-500' : 'bg-cactus-900/40 text-cactus-300'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </motion.button>

              {/* Main Action Button (Desktop) */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateImage}
                disabled={isGenerating || !prompt}
                className="hidden md:flex bg-sun-500 text-cactus-900 font-black uppercase tracking-[0.15em] px-6 py-3.5 rounded-[24px] hover:bg-sun-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 group shadow-xl shadow-sun-500/20 text-[11px] whitespace-nowrap"
              >
                <span>{isGenerating ? 'Generating...' : 'Ignite'}</span>
                {!isGenerating && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </div>

            {/* Main Action Button (Mobile) */}
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateImage}
              disabled={isGenerating || !prompt}
              className="md:hidden w-full bg-sun-500 text-cactus-900 font-black uppercase tracking-[0.1em] py-3 rounded-[16px] hover:bg-sun-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-xl shadow-sun-500/30 text-xs"
            >
              <span>{isGenerating ? 'Generating...' : 'Ignite Imagination'}</span>
              {!isGenerating && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Settings Drawer */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="absolute inset-x-0 bottom-0 z-40 bg-cactus-900/98 backdrop-blur-3xl rounded-t-[48px] border-t-2 border-white/20 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] md:hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 space-y-8 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Configuration</h3>
                  <button onClick={() => setShowOptions(false)} className="p-2 text-cactus-300 hover:text-white">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </button>
                </div>
                
                {/* Settings Content (Mobile) */}
                <div className="space-y-8 pb-24">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-cactus-300 uppercase tracking-[0.2em]">AI Model</label>
                    <ModelSelector selectedModel={model} onSelectModel={setModel} />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-cactus-300 uppercase tracking-[0.2em]">Aspect Ratio</label>
                    <div className="relative">
                      <select 
                        value={`${width}x${height}`}
                        onChange={(e) => {
                          const [w, h] = e.target.value.split('x').map(Number);
                          setWidth(w);
                          setHeight(h);
                        }}
                        className="w-full appearance-none bg-cactus-900/50 border-2 border-white/10 rounded-2xl py-4 px-6 text-base text-white outline-none focus:border-sun-500/50 transition-all font-bold"
                      >
                        <option value="1024x1024">Square (1:1)</option>
                        <option value="1920x1080">Landscape (16:9)</option>
                        <option value="1080x1920">Portrait (9:16)</option>
                        <option value="768x1024">Portrait (3:4)</option>
                        <option value="1024x768">Landscape (4:3)</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-sun-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-cactus-300 uppercase tracking-[0.2em]">Reference Image</label>
                    <input
                      type="text"
                      value={referenceImage}
                      onChange={(e) => setReferenceImage(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full bg-cactus-900/50 border-2 border-white/10 rounded-2xl py-4 px-6 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-sun-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar (Desktop) - Floating Glass Style */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-80 bg-white/[0.08] backdrop-blur-2xl border-2 border-white/20 rounded-[40px] md:rounded-[56px] flex-col z-20 shadow-none overflow-hidden"
      >
        <div className="p-8 md:p-10 space-y-10 overflow-y-auto custom-scrollbar h-full">
          <div className="flex items-center gap-4 text-sun-500 mb-2 border-b-2 border-white/5 pb-6">
            <SlidersHorizontal className="w-6 h-6" />
            <h3 className="font-black uppercase tracking-[0.3em] text-xs">Configuration</h3>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-cactus-300 uppercase tracking-[0.4em]">AI Model</label>
              <ModelSelector selectedModel={model} onSelectModel={setModel} />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-cactus-300 uppercase tracking-[0.4em]">Aspect Ratio</label>
              <div className="relative">
                <select 
                  value={`${width}x${height}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setWidth(w);
                    setHeight(h);
                  }}
                  className="w-full appearance-none bg-cactus-900/40 border-2 border-white/10 rounded-2xl py-5 px-8 text-sm text-white outline-none focus:border-sun-500/50 transition-all cursor-pointer hover:bg-cactus-900/60 font-bold"
                >
                  <option value="1024x1024">Square (1:1)</option>
                  <option value="1920x1080">Landscape (16:9)</option>
                  <option value="1080x1920">Portrait (9:16)</option>
                  <option value="768x1024">Portrait (3:4)</option>
                  <option value="1024x768">Landscape (4:3)</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-sun-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-cactus-300 uppercase tracking-[0.4em]">Reference Image</label>
              <input
                type="text"
                value={referenceImage}
                onChange={(e) => setReferenceImage(e.target.value)}
                placeholder="Image URL..."
                className="w-full bg-cactus-900/40 border-2 border-white/10 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-sun-500/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
