import { useState, useEffect } from 'react';
import { Search, Filter, Check, AlertCircle, Zap, Diamond, Flower } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Model {
  name: string;
  description: string;
  type: string;
  censored: boolean;
  baseModel: boolean;
  // Extended fields based on user request (might be missing in standard API)
  successRate?: number;
  error4xxPercent?: number;
  avgResponseTime?: number;
  p95ResponseTime?: number;
  price?: number;
  currency?: 'pollen' | 'diamond';
  isT2I?: boolean;
  isI2I?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'healthy' | 't2i' | 'i2i'>('all');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Primary: Try the gen endpoint as per documentation
        let response = await fetch('https://gen.pollinations.ai/image/models');
        
        // Fallback: Try the standard image endpoint
        if (!response.ok) {
          console.warn('Gen endpoint failed, trying standard image endpoint...');
          response = await fetch('https://image.pollinations.ai/models');
        }

        if (!response.ok) throw new Error('Failed to fetch models from all endpoints');
        
        const data = await response.json();
        
        // Handle: Array of strings (standard) OR Array of objects (detailed)
        const normalizedData = Array.isArray(data) ? data : [];
        
        const enrichedData = normalizedData.map((m: any) => {
          // Check if m is a string (just the name)
          if (typeof m === 'string') {
            return {
              name: m,
              description: m, // Use name as description if missing
              type: 'standard',
              censored: false,
              baseModel: true,
              successRate: 100, // Assume healthy if listed
              avgResponseTime: 0,
              price: 0,
              currency: 'pollen',
              isT2I: true,
              isI2I: true,
            };
          }
          
          // If it's already an object, use it but ensure defaults
          return {
            name: m.name || 'unknown',
            description: m.description || m.name || 'Unknown Model',
            type: m.type || 'standard',
            censored: m.censored ?? false,
            baseModel: m.baseModel ?? true,
            successRate: m.successRate ?? 99,
            error4xxPercent: m.error4xxPercent ?? 0,
            avgResponseTime: m.avgResponseTime ?? 0,
            p95ResponseTime: m.p95ResponseTime ?? 0,
            price: m.price ?? 0,
            currency: m.currency ?? 'pollen',
            isT2I: m.isT2I ?? true,
            isI2I: m.isI2I ?? true,
          };
        });
        
        // Remove duplicates just in case
        const uniqueModels = Array.from(new Map(enrichedData.map((m: any) => [m.name, m])).values());
        
        setModels(uniqueModels as Model[]);
        setError(null);
      } catch (err) {
        console.error("Model fetch error:", err);
        // Comprehensive fallback list based on Pollinations.ai OpenAPI spec
        setModels([
          { name: 'flux', description: 'Flux (Default)', type: 'flux', censored: false, baseModel: true, successRate: 99, avgResponseTime: 3.0, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'turbo', description: 'Turbo (Fast)', type: 'turbo', censored: false, baseModel: true, successRate: 98, avgResponseTime: 1.5, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'gptimage', description: 'GPT Image', type: 'gptimage', censored: false, baseModel: true, successRate: 95, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'gptimage-large', description: 'GPT Image Large', type: 'gptimage-large', censored: false, baseModel: true, successRate: 95, avgResponseTime: 5.0, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'seedream', description: 'SeeDream', type: 'seedream', censored: false, baseModel: false, successRate: 97, avgResponseTime: 2.8, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'seedream-pro', description: 'SeeDream Pro', type: 'seedream-pro', censored: false, baseModel: false, successRate: 96, avgResponseTime: 3.5, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'nanobanana', description: 'NanoBanana', type: 'nanobanana', censored: false, baseModel: false, successRate: 96, avgResponseTime: 2.0, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'nanobanana-pro', description: 'NanoBanana Pro', type: 'nanobanana-pro', censored: false, baseModel: false, successRate: 95, avgResponseTime: 3.0, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'kontext', description: 'Kontext', type: 'kontext', censored: false, baseModel: false, successRate: 94, avgResponseTime: 3.2, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'zimage', description: 'ZImage', type: 'zimage', censored: false, baseModel: true, successRate: 95, avgResponseTime: 3.0, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'klein', description: 'Klein', type: 'klein', censored: false, baseModel: true, successRate: 95, avgResponseTime: 2.5, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'klein-large', description: 'Klein Large', type: 'klein-large', censored: false, baseModel: true, successRate: 94, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'imagen-4', description: 'Imagen 4', type: 'imagen-4', censored: true, baseModel: true, successRate: 98, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: false },
          { name: 'midjourney', description: 'Midjourney Style', type: 'midjourney', censored: false, baseModel: false, successRate: 95, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true },
          { name: 'anime', description: 'Anime Style', type: 'anime', censored: false, baseModel: false, successRate: 97, avgResponseTime: 2.8, currency: 'pollen', isT2I: true, isI2I: true },
          // Video Models
          { name: 'veo', description: 'Veo (Video)', type: 'veo', censored: false, baseModel: true, successRate: 90, avgResponseTime: 10.0, currency: 'diamond', isT2I: true, isI2I: false },
          { name: 'seedance', description: 'Seedance (Video)', type: 'seedance', censored: false, baseModel: true, successRate: 92, avgResponseTime: 8.0, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'wan', description: 'Wan (Video)', type: 'wan', censored: false, baseModel: true, successRate: 90, avgResponseTime: 9.0, currency: 'pollen', isT2I: true, isI2I: true },
          { name: 'ltx-2', description: 'LTX-2 (Video)', type: 'ltx-2', censored: false, baseModel: true, successRate: 90, avgResponseTime: 9.0, currency: 'pollen', isT2I: true, isI2I: true },
        ]);
        setError('Using offline model list');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = models.filter(m => {
    if (filter === 'healthy' && (m.successRate || 100) < 90) return false;
    if (filter === 't2i' && !m.isT2I) return false;
    if (filter === 'i2i' && !m.isI2I) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedModelData = models.find(m => m.name === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-cactus-900/50 border border-white/10 rounded-xl py-3 px-4 text-left flex items-center justify-between hover:bg-cactus-900/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sun-500/20 flex items-center justify-center text-sun-500">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-cactus-300 uppercase tracking-wider font-bold">Model</div>
            <div className="text-white font-medium">{selectedModelData?.description || selectedModel}</div>
          </div>
        </div>
        <Filter className="w-4 h-4 text-cactus-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 w-full mb-2 bg-cactus-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]"
            >
              {/* Header / Search */}
              <div className="p-4 border-b border-white/10 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cactus-300" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-cactus-900/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-cactus-300/50 focus:outline-none focus:border-sun-500/50"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {(['all', 'healthy', 't2i', 'i2i'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                        filter === f 
                          ? 'bg-sun-500 text-cactus-900' 
                          : 'bg-cactus-900/50 text-cactus-300 hover:bg-cactus-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {loading ? (
                  <div className="p-4 text-center text-cactus-300 text-xs">Loading models...</div>
                ) : filteredModels.length === 0 ? (
                  <div className="p-4 text-center text-cactus-300 text-xs">No models found</div>
                ) : (
                  filteredModels.map((model) => (
                    <button
                      key={model.name}
                      onClick={() => {
                        onSelectModel(model.name);
                        setIsOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl flex items-center justify-between group transition-colors ${
                        selectedModel === model.name
                          ? 'bg-sun-500/10 border border-sun-500/50'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-2 h-2 rounded-full ${model.successRate && model.successRate > 90 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className={`font-bold text-sm ${selectedModel === model.name ? 'text-sun-500' : 'text-white'}`}>
                            {model.name}
                          </div>
                          <div className="text-[10px] text-cactus-300 flex items-center gap-2">
                            <span>{model.avgResponseTime}s</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {model.currency === 'diamond' ? <Diamond className="w-3 h-3 text-blue-400" /> : <Flower className="w-3 h-3 text-pink-400" />}
                              {model.price === 0 ? 'Free' : model.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedModel === model.name && <Check className="w-4 h-4 text-sun-500" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
