import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, Image as ImageIcon, Maximize2, Wand2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { ModelSelector } from './ModelSelector';

interface GeneratorProps {
  apiKey: string;
}

export function Generator({ apiKey }: GeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000));
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [model, setModel] = useState('flux');
  const [showOptions, setShowOptions] = useState(false);
  const [referenceImage, setReferenceImage] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);

    // Construct URL based on new API spec
    // Base: https://gen.pollinations.ai/image/{prompt}
    const encodedPrompt = encodeURIComponent(prompt);
    let url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=${width}&height=${height}&seed=${newSeed}&model=${model}&nologo=true`;
    
    if (referenceImage) {
      url += `&image=${encodeURIComponent(referenceImage)}`;
    }

    if (apiKey) {
      // API key can be passed via query param 'key' or header. 
      // Using query param for simplicity in img src, though header is more secure for fetch.
      // Spec says: ?key=YOUR_API_KEY
      url += `&key=${apiKey}`;
    }

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setIsGenerating(false);
    };
    img.onerror = () => {
      setIsGenerating(false);
    };
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cactus-ai-${seed}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed", e);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Image Display Area - Takes up most space */}
      <div className="flex-1 relative overflow-hidden bg-cactus-900/50 group">
        <AnimatePresence mode="wait">
          {imageUrl ? (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full"
            >
              <img
                src={imageUrl}
                alt={prompt}
                className="w-full h-full object-cover"
              />
              {/* Floating Actions */}
              <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleDownload}
                  className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 hover:border-sun-500 transition-all"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open(imageUrl, '_blank')}
                  className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-sun-500 hover:text-cactus-900 hover:border-sun-500 transition-all"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center text-cactus-300 p-8 text-center"
            >
              <div className="w-32 h-32 bg-cactus-700/30 rounded-full flex items-center justify-center mb-6 border border-white/5">
                <ImageIcon className="w-12 h-12 opacity-50" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">
                Start Creating
              </h3>
              <p className="text-sm max-w-xs opacity-70">
                Cacti and succulents are particularly easy indoor plants to care for.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-cactus-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-16 h-16 border-4 border-cactus-700 border-t-sun-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sun-500 font-bold tracking-widest uppercase text-xs animate-pulse">Growing...</p>
          </div>
        )}
      </div>

      {/* Controls Overlay - Bottom Sheet Style */}
      <div className="bg-cactus-800 p-6 md:p-8 border-t border-white/10 relative z-10">
        <div className="flex flex-col gap-4">
           {/* Prompt Input */}
           <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              placeholder="Describe your plant..."
              className="w-full bg-cactus-900/50 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-white/30 focus:outline-none focus:border-sun-500/50 transition-all"
            />
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cactus-300 hover:text-white transition-colors"
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
                className="overflow-hidden"
              >
                <div className="space-y-4 py-2">
                  <ModelSelector selectedModel={model} onSelectModel={setModel} />
                  
                  <div className="flex gap-4">
                    <select 
                      value={`${width}x${height}`}
                      onChange={(e) => {
                        const [w, h] = e.target.value.split('x').map(Number);
                        setWidth(w);
                        setHeight(h);
                      }}
                      className="w-full bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-cactus-100 outline-none focus:border-sun-500/50"
                    >
                      <option value="1024x1024">Square (1:1)</option>
                      <option value="1920x1080">Landscape (16:9)</option>
                      <option value="1080x1920">Portrait (9:16)</option>
                    </select>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Action Button */}
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt}
            className="w-full bg-sun-500 text-cactus-900 font-bold uppercase tracking-wider py-4 rounded-full hover:bg-sun-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <span>Generate</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
