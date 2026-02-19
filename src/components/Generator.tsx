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
    <div className="flex flex-col h-screen w-full bg-cactus-900 overflow-hidden">
      {/* Image Display Area - Flexible height, scrollable if needed */}
      <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {imageUrl ? (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-3xl aspect-square md:aspect-auto md:h-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
            >
              <img
                src={imageUrl}
                alt={prompt}
                className="w-full h-full object-contain bg-black/20"
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

      {/* Controls Area - Fixed at bottom on mobile, normal flow on desktop */}
      <div className="bg-cactus-800 border-t border-white/10 z-30 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
          <div className="flex flex-col gap-3">
             {/* Prompt Input */}
             <div className="relative w-full">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                placeholder="Describe your imagination..."
                className="w-full bg-cactus-900/80 border border-white/10 rounded-2xl py-3 pl-5 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all shadow-inner"
              />
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${showOptions ? 'bg-white/10 text-white' : 'text-cactus-300 hover:text-white'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Options (Collapsible) */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full"
                >
                  <div className="space-y-3 py-2">
                    <ModelSelector selectedModel={model} onSelectModel={setModel} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <select 
                          value={`${width}x${height}`}
                          onChange={(e) => {
                            const [w, h] = e.target.value.split('x').map(Number);
                            setWidth(w);
                            setHeight(h);
                          }}
                          className="w-full appearance-none bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-cactus-100 outline-none focus:border-sun-500/50"
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

                      {/* Reference Image Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={referenceImage}
                          onChange={(e) => setReferenceImage(e.target.value)}
                          placeholder="Reference Image URL (Optional)"
                          className="w-full bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
      </div>
    </div>
  );
}
