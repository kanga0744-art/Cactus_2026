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
    <div className="flex h-full w-full bg-cactus-900 overflow-hidden">
      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Image Display Area */}
        <div className="flex-1 relative w-full flex flex-col items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {imageUrl ? (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-3xl aspect-square md:aspect-auto md:h-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-black/20"
              >
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-contain"
                />
                {/* Floating Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={handleDownload}
                    className="p-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 transition-all"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="p-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 transition-all"
                    title="Full Screen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-cactus-300 p-8 text-center max-w-md"
              >
                <div className="w-24 h-24 bg-cactus-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                  <ImageIcon className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wide">
                  Start Creating
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Enter a prompt below to generate your unique AI art. Try describing a scene, style, or mood.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm z-30 max-w-[90%]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </motion.div>
          )}

          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-cactus-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cactus-700 border-t-sun-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-sun-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sun-500 font-bold tracking-widest uppercase text-xs mt-4 animate-pulse">Generating...</p>
            </div>
          )}
        </div>

        {/* Bottom Bar - Prompt & Generate Only */}
        <div className="bg-cactus-800 border-t border-white/10 z-30 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] p-4 md:p-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-3">
             {/* Prompt Input */}
             <div className="relative w-full flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                  placeholder="Describe your imagination..."
                  className="w-full bg-cactus-900/80 border border-white/10 rounded-2xl py-3 pl-5 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all shadow-inner"
                />
              </div>
              
              {/* Mobile Settings Toggle */}
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`md:hidden p-3 rounded-2xl border border-white/10 transition-colors ${showOptions ? 'bg-sun-500 text-cactus-900' : 'bg-cactus-900/80 text-cactus-300'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Main Action Button */}
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt}
              className="w-full bg-sun-500 text-cactus-900 font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-sun-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-sun-500/20"
            >
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              {!isGenerating && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>

        {/* Mobile Settings Drawer */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 z-40 bg-cactus-800 rounded-t-[32px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Settings</h3>
                  <button onClick={() => setShowOptions(false)} className="p-2 text-cactus-300 hover:text-white">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </button>
                </div>
                
                {/* Settings Content (Mobile) */}
                <div className="space-y-6 pb-20">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Model</label>
                    <ModelSelector selectedModel={model} onSelectModel={setModel} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Aspect Ratio</label>
                    <div className="relative">
                      <select 
                        value={`${width}x${height}`}
                        onChange={(e) => {
                          const [w, h] = e.target.value.split('x').map(Number);
                          setWidth(w);
                          setHeight(h);
                        }}
                        className="w-full appearance-none bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-sun-500/50 transition-all"
                      >
                        <option value="1024x1024">Square (1:1)</option>
                        <option value="1920x1080">Landscape (16:9)</option>
                        <option value="1080x1920">Portrait (9:16)</option>
                        <option value="768x1024">Portrait (3:4)</option>
                        <option value="1024x768">Landscape (4:3)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cactus-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Reference Image</label>
                    <input
                      type="text"
                      value={referenceImage}
                      onChange={(e) => setReferenceImage(e.target.value)}
                      placeholder="Image URL..."
                      className="w-full bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar (Desktop) */}
      <div className="hidden md:flex w-80 bg-cactus-800 border-l border-white/10 flex-col z-20 shadow-xl">
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar h-full">
          <div className="flex items-center gap-2 text-sun-500 mb-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Configuration</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Model</label>
              <ModelSelector selectedModel={model} onSelectModel={setModel} />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Aspect Ratio</label>
              <div className="relative">
                <select 
                  value={`${width}x${height}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setWidth(w);
                    setHeight(h);
                  }}
                  className="w-full appearance-none bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-sun-500/50 transition-all cursor-pointer hover:bg-cactus-900/70"
                >
                  <option value="1024x1024">Square (1:1)</option>
                  <option value="1920x1080">Landscape (16:9)</option>
                  <option value="1080x1920">Portrait (9:16)</option>
                  <option value="768x1024">Portrait (3:4)</option>
                  <option value="1024x768">Landscape (4:3)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cactus-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cactus-300 uppercase tracking-wider">Reference Image</label>
              <input
                type="text"
                value={referenceImage}
                onChange={(e) => setReferenceImage(e.target.value)}
                placeholder="Image URL..."
                className="w-full bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
