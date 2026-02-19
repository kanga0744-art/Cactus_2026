import { useState, useEffect } from 'react';
import { Search, Filter, Check, AlertCircle, Zap, Diamond, Flower } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Model {
  name: string; // Maps to 'id' from API
  description: string; // Maps to 'name' from API
  type: string;
  censored: boolean;
  baseModel: boolean;
  successRate?: number;
  error4xxPercent?: number;
  avgResponseTime?: number;
  p95ResponseTime?: number;
  price?: number;
  currency?: 'pollen' | 'diamond';
  isT2I?: boolean;
  isI2I?: boolean;
  paidOnly?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // ... fetchModels logic remains same ...
    const fetchModels = async () => {
      try {
        // Use the simple endpoint requested
        const response = await fetch('https://gen.pollinations.ai/image/models');
        
        if (!response.ok) throw new Error('Failed to fetch models');
        
        const data = await response.json();
        
        // Handle: Array of strings (standard) OR Array of objects (detailed)
        const normalizedData = Array.isArray(data) ? data : [];
        
        if (normalizedData.length === 0) {
             throw new Error("No models found from API");
        }

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
              paidOnly: false,
            };
          }
          
          // Map API fields to internal Model interface
          const isT2I = m.input_modalities?.includes('text') ?? true;
          const isI2I = m.input_modalities?.includes('image') ?? false;
          const currency = m.pricing?.currency || 'pollen';
          const price = m.pricing?.completionImageTokens || 0;

          return {
            name: m.id || m.name || 'unknown', // ID is crucial
            description: m.name || m.description || 'Unknown Model', // Display name
            type: m.type || 'standard',
            censored: m.censored ?? false,
            baseModel: m.baseModel ?? true,
            successRate: m.successRate ?? 99,
            error4xxPercent: m.error4xxPercent ?? 0,
            avgResponseTime: m.avgResponseTime ?? 0,
            p95ResponseTime: m.p95ResponseTime ?? 0,
            price: price,
            currency: currency,
            isT2I: isT2I,
            isI2I: isI2I,
            paidOnly: m.paid_only ?? false
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
          { name: 'flux', description: 'Flux (Default)', type: 'flux', censored: false, baseModel: true, successRate: 99, avgResponseTime: 3.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'turbo', description: 'Turbo (Fast)', type: 'turbo', censored: false, baseModel: true, successRate: 98, avgResponseTime: 1.5, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'gptimage', description: 'GPT Image', type: 'gptimage', censored: false, baseModel: true, successRate: 95, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'gptimage-large', description: 'GPT Image Large', type: 'gptimage-large', censored: false, baseModel: true, successRate: 95, avgResponseTime: 5.0, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'seedream', description: 'SeeDream', type: 'seedream', censored: false, baseModel: false, successRate: 97, avgResponseTime: 2.8, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'seedream-pro', description: 'SeeDream Pro', type: 'seedream-pro', censored: false, baseModel: false, successRate: 96, avgResponseTime: 3.5, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'nanobanana', description: 'NanoBanana', type: 'nanobanana', censored: false, baseModel: false, successRate: 96, avgResponseTime: 2.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'nanobanana-pro', description: 'NanoBanana Pro', type: 'nanobanana-pro', censored: false, baseModel: false, successRate: 95, avgResponseTime: 3.0, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'kontext', description: 'Kontext', type: 'kontext', censored: false, baseModel: false, successRate: 94, avgResponseTime: 3.2, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'zimage', description: 'ZImage', type: 'zimage', censored: false, baseModel: true, successRate: 95, avgResponseTime: 3.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'klein', description: 'Klein', type: 'klein', censored: false, baseModel: true, successRate: 95, avgResponseTime: 2.5, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'klein-large', description: 'Klein Large', type: 'klein-large', censored: false, baseModel: true, successRate: 94, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'imagen-4', description: 'Imagen 4', type: 'imagen-4', censored: true, baseModel: true, successRate: 98, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: false, paidOnly: true },
          { name: 'midjourney', description: 'Midjourney Style', type: 'midjourney', censored: false, baseModel: false, successRate: 95, avgResponseTime: 4.0, currency: 'diamond', isT2I: true, isI2I: true, paidOnly: true },
          { name: 'anime', description: 'Anime Style', type: 'anime', censored: false, baseModel: false, successRate: 97, avgResponseTime: 2.8, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          // Video Models
          { name: 'veo', description: 'Veo (Video)', type: 'veo', censored: false, baseModel: true, successRate: 90, avgResponseTime: 10.0, currency: 'diamond', isT2I: true, isI2I: false, paidOnly: true },
          { name: 'seedance', description: 'Seedance (Video)', type: 'seedance', censored: false, baseModel: true, successRate: 92, avgResponseTime: 8.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'wan', description: 'Wan (Video)', type: 'wan', censored: false, baseModel: true, successRate: 90, avgResponseTime: 9.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
          { name: 'ltx-2', description: 'LTX-2 (Video)', type: 'ltx-2', censored: false, baseModel: true, successRate: 90, avgResponseTime: 9.0, currency: 'pollen', isT2I: true, isI2I: true, paidOnly: false },
        ]);
        setError('Using offline model list');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const toggleFilter = (f: string) => {
    if (f === 'all') {
      setFilters([]);
      return;
    }

    setFilters(prev => {
      const newFilters = [...prev];
      if (newFilters.includes(f)) {
        return newFilters.filter(item => item !== f);
      } else {
        // Handle mutual exclusivity for pricing
        if (f === 'free') return [...newFilters.filter(i => i !== 'paid'), f];
        if (f === 'paid') return [...newFilters.filter(i => i !== 'free'), f];
        return [...newFilters, f];
      }
    });
  };

  const filteredModels = models.filter(m => {
    // Pricing check
    if (filters.includes('free') && m.paidOnly) return false;
    if (filters.includes('paid') && !m.paidOnly) return false;
    
    // Capability check
    if (filters.includes('t2i') && !m.isT2I) return false;
    if (filters.includes('i2i') && !m.isI2I) return false;

    // Search logic
    if (search) {
      const searchLower = search.toLowerCase();
      return m.name.toLowerCase().includes(searchLower) || 
             m.description.toLowerCase().includes(searchLower);
    }
    
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-2 bg-cactus-800 border border-white/10 rounded-2xl shadow-inner overflow-hidden flex flex-col max-h-[300px]"
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
                  <button
                    onClick={() => toggleFilter('all')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                      filters.length === 0
                        ? 'bg-sun-500 text-cactus-900' 
                        : 'bg-cactus-900/50 text-cactus-300 hover:bg-cactus-900'
                    }`}
                  >
                    All
                  </button>
                  {(['free', 'paid', 't2i', 'i2i'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFilter(f)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                        filters.includes(f)
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
        )}
      </AnimatePresence>
    </div>
  );
}
