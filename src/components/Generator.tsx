import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, Image as ImageIcon, Maximize2, Wand2, SlidersHorizontal, ArrowRight, AlertCircle } from 'lucide-react';
import { ModelSelector } from './ModelSelector';

interface GeneratorProps {
  apiKey: string;
  onSuccess?: () => void;
}

export function Generator({ apiKey, onSuccess }: GeneratorProps) {
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
      if (onSuccess) onSuccess();
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
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex h-full w-full bg-transparent overflow-hidden p-4 md:p-10 gap-6 md:gap-10"
    >
      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 gap-6 md:gap-10">
        
        {/* Image Display Area - Editorial Page Style */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 relative w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-white/60 backdrop-blur-sm border border-nordic-blue/10 rounded-sm book-shadow min-h-0 page-texture"
        >
          <AnimatePresence mode="wait">
            {imageUrl ? (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full flex items-center justify-center rounded-sm overflow-hidden group"
              >
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-full object-contain shadow-2xl"
                />
                {/* Floating Actions - Minimalist */}
                <div className="absolute bottom-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="p-4 bg-white border border-nordic-dark/10 rounded-full text-nordic-dark hover:bg-nordic-dark hover:text-white transition-all shadow-lg"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="p-4 bg-white border border-nordic-dark/10 rounded-full text-nordic-dark hover:bg-nordic-dark hover:text-white transition-all shadow-lg"
                    title="Full Screen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-nordic-dark/20 p-8 text-center max-w-md"
              >
                <ImageIcon className="w-12 h-12 mb-6 opacity-10" />
                <h3 className="text-2xl font-serif italic text-nordic-dark/40 mb-4">
                  The Canvas Awaits
                </h3>
                <p className="text-xs font-medium uppercase tracking-[0.3em] leading-relaxed">
                  Compose your vision below to begin the generation process.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-pastel-rose text-nordic-dark px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl z-30 max-w-[90%] border border-nordic-dark/5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </motion.div>
          )}

          {/* Loading Overlay - Minimalist Editorial */}
          {isGenerating && (
            <div className="absolute inset-0 bg-paper-50/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <div className="relative mb-10">
                <div className="w-16 h-16 border border-nordic-dark/10 border-t-nordic-dark rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-nordic-dark/20" />
                </div>
              </div>
              <p className="text-nordic-dark font-serif italic text-xl animate-pulse">Curating your vision...</p>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-nordic-dark/30 mt-4">Editorial Process in Progress</span>
            </div>
          )}
        </motion.div>

        {/* Bottom Bar - Minimalist Editorial */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border border-nordic-dark/10 rounded-sm book-shadow z-30 shrink-0 p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
             {/* Prompt Input & Desktop Button */}
             <div className="relative w-full flex gap-3 md:gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                  placeholder="Describe your imagination..."
                  className="w-full bg-paper-100/50 border border-nordic-dark/10 rounded-sm py-4 md:py-5 pl-6 md:pl-8 pr-4 text-nordic-dark placeholder:text-nordic-dark/30 focus:outline-none focus:border-nordic-blue/50 transition-all text-sm md:text-base font-medium"
                />
              </div>
              
              {/* Mobile Settings Toggle */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOptions(!showOptions)}
                className={`md:hidden p-4 rounded-sm border border-nordic-dark/10 transition-colors ${showOptions ? 'bg-nordic-dark text-white' : 'bg-paper-100 text-nordic-dark/40'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </motion.button>

              {/* Main Action Button (Desktop) */}
              <motion.button
                whileHover={{ y: -2, backgroundColor: "var(--color-nordic-dark)" }}
                whileTap={{ scale: 0.98 }}
                onClick={generateImage}
                disabled={isGenerating || !prompt}
                className="hidden md:flex bg-nordic-blue text-nordic-dark font-black uppercase tracking-[0.3em] px-10 py-4 rounded-sm hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed items-center justify-center gap-4 group text-[10px] whitespace-nowrap shadow-lg shadow-nordic-blue/20"
              >
                <span>{isGenerating ? 'Curating...' : 'Generate'}</span>
                {!isGenerating && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
              </motion.button>
            </div>

            {/* Main Action Button (Mobile) */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={generateImage}
              disabled={isGenerating || !prompt}
              className="md:hidden w-full bg-nordic-blue text-nordic-dark font-black uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-nordic-dark hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 group text-[10px] shadow-lg shadow-nordic-blue/20"
            >
              <span>{isGenerating ? 'Curating...' : 'Generate Vision'}</span>
              {!isGenerating && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
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
              className="absolute inset-x-0 bottom-0 z-40 bg-white rounded-t-[40px] border-t border-ink-900/10 shadow-2xl md:hidden flex flex-col max-h-[85vh] page-texture"
            >
              <div className="p-10 space-y-10 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif italic text-ink-900">Configuration</h3>
                  <button onClick={() => setShowOptions(false)} className="p-2 text-ink-900/20 hover:text-ink-900">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </button>
                </div>
                
                {/* Settings Content (Mobile) */}
                <div className="space-y-10 pb-24">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ink-900/30 uppercase tracking-[0.4em]">AI Model</label>
                    <ModelSelector selectedModel={model} onSelectModel={setModel} />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ink-900/30 uppercase tracking-[0.4em]">Aspect Ratio</label>
                    <div className="relative">
                      <select 
                        value={`${width}x${height}`}
                        onChange={(e) => {
                          const [w, h] = e.target.value.split('x').map(Number);
                          setWidth(w);
                          setHeight(h);
                        }}
                        className="w-full appearance-none bg-paper-100 border border-ink-900/5 rounded-sm py-5 px-8 text-sm text-ink-900 outline-none focus:border-ink-900/20 transition-all font-bold"
                      >
                        <option value="1024x1024">Square (1:1)</option>
                        <option value="1920x1080">Landscape (16:9)</option>
                        <option value="1080x1920">Portrait (9:16)</option>
                        <option value="768x1024">Portrait (3:4)</option>
                        <option value="1024x768">Landscape (4:3)</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-ink-900/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ink-900/30 uppercase tracking-[0.4em]">Reference Image</label>
                    <input
                      type="text"
                      value={referenceImage}
                      onChange={(e) => setReferenceImage(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full bg-paper-100 border border-ink-900/5 rounded-sm py-5 px-8 text-sm text-ink-900 placeholder:text-ink-900/10 focus:outline-none focus:border-ink-900/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar (Desktop) - Editorial Configuration */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-80 bg-paper-100 border-l border-ink-900/5 flex-col z-20 shadow-sm overflow-hidden"
      >
        <div className="p-8 md:p-10 space-y-10 overflow-y-auto custom-scrollbar h-full">
          <div className="flex items-center gap-4 text-ink-900 mb-4 border-b border-ink-900/5 pb-8">
            <SlidersHorizontal className="w-5 h-5 opacity-40" />
            <h3 className="font-serif italic text-2xl">Settings</h3>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-ink-900/30 uppercase tracking-[0.5em]">AI Model</label>
              <ModelSelector selectedModel={model} onSelectModel={setModel} />
            </div>
            
            <div className="space-y-4">
              <label className="text-[9px] font-black text-ink-900/30 uppercase tracking-[0.5em]">Aspect Ratio</label>
              <div className="relative">
                <select 
                  value={`${width}x${height}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setWidth(w);
                    setHeight(h);
                  }}
                  className="w-full appearance-none bg-white border border-ink-900/5 rounded-sm py-5 px-8 text-[11px] text-ink-900 outline-none focus:border-ink-900/20 transition-all cursor-pointer hover:bg-paper-50 font-bold book-shadow"
                >
                  <option value="1024x1024">Square (1:1)</option>
                  <option value="1920x1080">Landscape (16:9)</option>
                  <option value="1080x1920">Portrait (9:16)</option>
                  <option value="768x1024">Portrait (3:4)</option>
                  <option value="1024x768">Landscape (4:3)</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-ink-900/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-ink-900/30 uppercase tracking-[0.5em]">Reference Image</label>
              <input
                type="text"
                value={referenceImage}
                onChange={(e) => setReferenceImage(e.target.value)}
                placeholder="Image URL..."
                className="w-full bg-white border border-ink-900/5 rounded-sm py-5 px-8 text-[11px] text-ink-900 placeholder:text-ink-900/10 focus:outline-none focus:border-ink-900/20 transition-all font-medium book-shadow"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
