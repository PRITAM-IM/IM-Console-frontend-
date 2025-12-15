import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Search,
  Megaphone,
  Facebook,
  Youtube,
  Star,
  DollarSign,
  ChevronLeft,
  Lightbulb,
  Zap,
  TrendingDown,
  Clock,
  Target,
  ArrowRight,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface Project {
  _id?: string;
  id?: string;
  name: string;
  gaPropertyId?: string;
  googleAdsCustomerId?: string;
  searchConsoleUrl?: string;
  metaAdsAccountId?: string;
  youtubeChannelId?: string;
  facebookPageId?: string;
  googlePlacesId?: string;
}

interface ServiceItem {
  id: ServiceType;
  name: string;
  icon: any;
  connected: boolean;
}

type ServiceType = 'save-your-money' | 'google-ads' | 'google-analytics' | 'google-search-console' | 'meta-ads' | 'facebook-insights' | 'youtube-insights' | 'google-places';

// Cache helpers
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const CACHE_PREFIX = 'ai_master_analysis_';

interface CachedAnalysis {
  analysis: string;
  timestamp: number;
  projectId: string;
  serviceType: string;
}

const getCacheKey = (projectId: string, serviceType: string) => {
  return `${CACHE_PREFIX}${projectId}_${serviceType}`;
};

const getCachedAnalysis = (projectId: string, serviceType: string): string | null => {
  try {
    const cacheKey = getCacheKey(projectId, serviceType);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const data: CachedAnalysis = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (within 6 hours)
    if (now - data.timestamp < CACHE_DURATION) {
      console.log(`[AI Master] Using cached analysis (${Math.floor((CACHE_DURATION - (now - data.timestamp)) / 1000 / 60)} minutes remaining)`);
      return data.analysis;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('[AI Master] Cache read error:', error);
    return null;
  }
};

const setCachedAnalysis = (projectId: string, serviceType: string, analysis: string) => {
  try {
    const cacheKey = getCacheKey(projectId, serviceType);
    const data: CachedAnalysis = {
      analysis,
      timestamp: Date.now(),
      projectId,
      serviceType
    };
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log('[AI Master] Analysis cached for 6 hours');
  } catch (error) {
    console.error('[AI Master] Cache write error:', error);
  }
};

const clearExpiredCache = () => {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const data: CachedAnalysis = JSON.parse(localStorage.getItem(key) || '');
          if (now - data.timestamp >= CACHE_DURATION) {
            localStorage.removeItem(key);
            console.log(`[AI Master] Removed expired cache: ${key}`);
          }
        } catch (e) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('[AI Master] Cache cleanup error:', error);
  }
};

// Helper function to parse markdown sections
const parseAnalysisSections = (markdown: string) => {
  const sections: { title: string; content: string; icon: string }[] = [];
  const lines = markdown.split('\n');
  let currentSection = { title: '', content: '', icon: '' };

  lines.forEach((line) => {
    // Detect section headers (## with emoji)
    if (line.startsWith('##')) {
      if (currentSection.title) {
        sections.push(currentSection);
      }
      const match = line.match(/##\s*([^\n]+)/);
      if (match) {
        currentSection = { title: match[1].trim(), content: '', icon: match[1].trim() };
      }
    } else if (currentSection.title && line.trim()) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection.title) {
    sections.push(currentSection);
  }

  return sections;
};

// Component to render a beautiful analysis section
const AnalysisSection = ({ title, content, index }: { title: string; content: string; index: number }) => {
  const getSectionIcon = () => {
    if (title.includes('Wrong') || title.includes('🔴')) return <AlertTriangle className="h-5 w-5" />;
    if (title.includes('Suggestion') || title.includes('💡')) return <Lightbulb className="h-5 w-5" />;
    if (title.includes('Quick Win') || title.includes('⚡')) return <Zap className="h-5 w-5" />;
    if (title.includes('Right') || title.includes('✅')) return <CheckCircle2 className="h-5 w-5" />;
    return <Sparkles className="h-5 w-5" />;
  };

  const getSectionColor = () => {
    if (title.includes('Wrong') || title.includes('🔴')) return 'from-red-500 to-rose-500';
    if (title.includes('Suggestion') || title.includes('💡')) return 'from-blue-500 to-indigo-500';
    if (title.includes('Quick Win') || title.includes('⚡')) return 'from-green-500 to-emerald-500';
    if (title.includes('Right') || title.includes('✅')) return 'from-emerald-500 to-teal-500';
    return 'from-orange-500 to-red-500';
  };

  const getSectionBg = () => {
    if (title.includes('Wrong') || title.includes('🔴')) return 'from-red-50 to-rose-50';
    if (title.includes('Suggestion') || title.includes('💡')) return 'from-blue-50 to-indigo-50';
    if (title.includes('Quick Win') || title.includes('⚡')) return 'from-green-50 to-emerald-50';
    if (title.includes('Right') || title.includes('✅')) return 'from-emerald-50 to-teal-50';
    return 'from-orange-50 to-red-50';
  };

  // Parse content items and extract data for visualization
  const items: Array<{ text: string; category?: string; priority?: number; timeframe?: string }> = [];
  const contentLines = content.split('\n');
  let currentItem = '';

  contentLines.forEach((line) => {
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      if (currentItem) items.push({ text: currentItem });
      currentItem = line.replace(/^[-*]\s*/, '').trim();
    } else if (line.trim() && currentItem) {
      currentItem += ' ' + line.trim();
    } else if (line.trim() && !currentItem) {
      currentItem = line.trim();
    }
  });
  if (currentItem) items.push({ text: currentItem });

  // Extract categories and priorities for visualization
  const categorizedItems = items.map((item) => {
    let category = 'Other';
    let priority = 50;
    let timeframe = 'Medium-term';

    // Detect category from content
    if (item.text.toLowerCase().includes('quick win') || item.text.toLowerCase().includes('< 1 week')) {
      timeframe = 'Quick Win';
      priority = 90;
    } else if (item.text.toLowerCase().includes('1-4 week') || item.text.toLowerCase().includes('medium')) {
      timeframe = 'Medium-term';
      priority = 60;
    } else if (item.text.toLowerCase().includes('1-3 month') || item.text.toLowerCase().includes('strategic')) {
      timeframe = 'Strategic';
      priority = 40;
    }

    if (item.text.toLowerCase().includes('youtube') || item.text.toLowerCase().includes('video')) category = 'YouTube';
    else if (item.text.toLowerCase().includes('facebook') || item.text.toLowerCase().includes('meta') || item.text.toLowerCase().includes('social')) category = 'Social Media';
    else if (item.text.toLowerCase().includes('google ads') || item.text.toLowerCase().includes('advertising')) category = 'Advertising';
    else if (item.text.toLowerCase().includes('analytics') || item.text.toLowerCase().includes('tracking')) category = 'Analytics';
    else if (item.text.toLowerCase().includes('conversion') || item.text.toLowerCase().includes('booking')) category = 'Conversion';
    else if (item.text.toLowerCase().includes('content')) category = 'Content';
    else if (item.text.toLowerCase().includes('marketing')) category = 'Marketing';

    return { ...item, category, priority, timeframe };
  });

  // Create chart data
  const categoryData = Object.entries(
    categorizedItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const timeframeData = Object.entries(
    categorizedItems.reduce((acc, item) => {
      acc[item.timeframe] = (acc[item.timeframe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const CHART_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

  // Determine if this section should show charts
  const shouldShowCharts = (title.includes('Suggestion') || title.includes('Quick Win')) && items.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`border-none shadow-lg bg-gradient-to-br ${getSectionBg()}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 bg-gradient-to-br ${getSectionColor()} rounded-xl text-white`}>
              {getSectionIcon()}
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {title.replace(/[🔴✅💡⚡🎯]/g, '').trim()}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Charts Section - Only for Suggestions and Quick Wins */}
          {shouldShowCharts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Category Distribution */}
              {categoryData.length > 1 && (
                <Card className="bg-white/80 border-white/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700">Issues by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `${props.name} ${props.percent ? (props.percent * 100).toFixed(0) : 0}%`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Priority/Timeframe Distribution */}
              {timeframeData.length > 1 && (
                <Card className="bg-white/80 border-white/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700">Action Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={timeframeData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Metric Cards for "What's Going Wrong" */}
          {title.includes('Wrong') && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white/80 border-white/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Critical Issues</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">{items.length}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-xl">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 border-white/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Estimated Loss</p>
                      <p className="text-3xl font-bold text-orange-600 mt-1">15-30%</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <TrendingDown className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 border-white/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Urgency</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">High</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Flame className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {items.slice(0, 8).map((item, idx) => {
              // Check if item has subsections (like "Problem:", "Impact:", etc.)
              const hasLabel = item.text.match(/^(\w+(?:\s+\w+)?):\s*(.+)/);
              if (hasLabel) {
                const [, label, text] = hasLabel;
                return (
                  <div key={idx} className="bg-white/60 rounded-lg p-4 border border-white/40 hover:bg-white/80 transition-all">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900">{label}:</span>
                        <span className="text-slate-700 ml-1">{text}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="bg-white/60 rounded-lg p-4 border border-white/40 hover:bg-white/80 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 bg-gradient-to-br ${getSectionColor()} rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1">{item.text}</p>
                  </div>
                </div>
              );
            })}
            {items.length > 8 && (
              <div className="text-center pt-2">
                <p className="text-sm text-slate-600 font-medium">
                  +{items.length - 8} more items
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AIMasterPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType>('save-your-money');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        if (data.success) {
          setAllProjects(data.data);
          const current = data.data.find((p: Project) =>
            (p.id || p._id) === projectId
          );
          if (current) {
            setCurrentProject(current);
          }
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    if (projectId) {
      fetchProjects();
    }
  }, [projectId]);

  // Get connected services based on current project
  const services: ServiceItem[] = [
    {
      id: 'save-your-money',
      name: 'Save Your Money',
      icon: DollarSign,
      connected: true, // Always available
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      icon: Megaphone,
      connected: !!currentProject?.googleAdsCustomerId,
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      icon: TrendingUp,
      connected: !!currentProject?.gaPropertyId,
    },
    {
      id: 'google-search-console',
      name: 'Search Console',
      icon: Search,
      connected: !!currentProject?.searchConsoleUrl,
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads',
      icon: Megaphone,
      connected: !!currentProject?.metaAdsAccountId,
    },
    {
      id: 'facebook-insights',
      name: 'Facebook Insights',
      icon: Facebook,
      connected: !!currentProject?.facebookPageId,
    },
    {
      id: 'youtube-insights',
      name: 'YouTube Insights',
      icon: Youtube,
      connected: !!currentProject?.youtubeChannelId,
    },
    {
      id: 'google-places',
      name: 'Google Places',
      icon: Star,
      connected: !!currentProject?.googlePlacesId,
    },
  ];

  const currentService = services.find(s => s.id === selectedService);

  // Clean up expired cache on mount
  useEffect(() => {
    clearExpiredCache();
  }, []);

  // Reset when project changes
  useEffect(() => {
    setAnalysis(null);
    setShowPrompt(false);
    setSelectedService('save-your-money');
  }, [projectId]);

  // Show prompt when changing to a specific service OR load from cache
  useEffect(() => {
    if (currentService?.connected) {
      // Check if we have cached data for this service
      if (projectId) {
        const cached = getCachedAnalysis(projectId, selectedService);
        if (cached) {
          setAnalysis(cached);
          setShowPrompt(false);
          return;
        }
      }
      setShowPrompt(true);
      setAnalysis(null);
    }
  }, [selectedService, projectId]);

  const getPromptText = () => {
    if (selectedService === 'save-your-money') {
      return 'Do you want me to analyze your whole metrics to let you know where you can save your money?';
    }

    const serviceNames: Record<ServiceType, string> = {
      'save-your-money': '',
      'google-ads': 'Google Ads',
      'google-analytics': 'Google Analytics',
      'google-search-console': 'Google Search Console',
      'meta-ads': 'Meta Ads',
      'facebook-insights': 'Facebook Insights',
      'youtube-insights': 'YouTube',
      'google-places': 'Google Places'
    };
    return `Would you like me to know your ${serviceNames[selectedService]} performance?`;
  };

  const handleServiceClick = (serviceId: ServiceType) => {
    const service = services.find(s => s.id === serviceId);
    if (!service?.connected && serviceId !== 'save-your-money') {
      return; // Don't allow clicking disconnected services
    }
    setSelectedService(serviceId);
  };

  const handleProjectChange = (newProject: Project) => {
    const newId = newProject.id ?? newProject._id;
    if (newId) {
      navigate(`/dashboard/${newId}/ai-master`);
    }
  };

  const fetchAnalysis = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    setShowPrompt(false);

    try {
      const { data } = await api.post('/ai/analyze-service', {
        projectId,
        serviceType: selectedService,
      });

      if (data.success) {
        const analysisResult = data.data.analysis;
        setAnalysis(analysisResult);
        // Cache the result for 6 hours
        setCachedAnalysis(projectId, selectedService, analysisResult);
      } else {
        throw new Error(data.error || 'Failed to generate analysis');
      }
    } catch (err: any) {
      console.error('AI Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleAskAIMaster = () => {
    fetchAnalysis();
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full max-w-xs border-r border-slate-200 flex flex-col shadow-lg"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-600 px-6 py-5">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">AI Master</h2>
                <p className="text-white/80 text-xs font-medium">Your intelligent assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Selector */}
        <div className="px-4 py-4 border-b border-slate-200">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            Selected Project
          </label>
          <div className="relative">
            <select
              value={currentProject?.id || currentProject?._id || ''}
              onChange={(e) => {
                const selected = allProjects.find(p => (p.id || p._id) === e.target.value);
                if (selected) handleProjectChange(selected);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {allProjects.map((project) => (
                <option key={project.id || project._id} value={project.id || project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Services
            </h3>
            <div className="space-y-1">
              {services.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                const isConnected = service.connected;

                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.id)}
                    disabled={!isConnected && service.id !== 'save-your-money'}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left",
                      isSelected
                        ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                        : isConnected
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-700"
                          : "bg-slate-50/50 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "h-4 w-4",
                        isSelected ? "text-white" : isConnected ? "text-slate-600" : "text-slate-400"
                      )} />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    {service.id !== 'save-your-money' && (
                      isConnected ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-300" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by AI • Real-time insights</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Back Button */}
        <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center px-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/${projectId}`)}
            className="gap-2 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <p className="mt-6 text-lg font-semibold text-slate-800">Analyzing your data...</p>
              <p className="text-slate-500 text-sm mt-1">AI Master is processing</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-4 bg-red-100 rounded-2xl mb-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 max-w-md mb-6">{error}</p>
              <Button
                onClick={fetchAnalysis}
                className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : analysis ? (
            <div className="max-w-6xl mx-auto pb-8">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="border-none shadow-xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold text-white">
                            AI Analysis Results
                          </CardTitle>
                          <CardDescription className="text-white/80 text-base mt-1 flex items-center gap-2">
                            {currentService?.name} • Powered by AI Master
                            {(() => {
                              if (projectId) {
                                const cached = localStorage.getItem(getCacheKey(projectId, selectedService));
                                if (cached) {
                                  try {
                                    const data: CachedAnalysis = JSON.parse(cached);
                                    const minutesRemaining = Math.floor((CACHE_DURATION - (Date.now() - data.timestamp)) / 1000 / 60);
                                    if (minutesRemaining > 0) {
                                      return (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                          <Clock className="h-3 w-3" />
                                          Cached ({minutesRemaining}m)
                                        </span>
                                      );
                                    }
                                  } catch (e) { }
                                }
                              }
                              return null;
                            })()}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={fetchAnalysis}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Analysis Sections */}
              <div className="space-y-6">
                {parseAnalysisSections(analysis).map((section, index) => (
                  <AnalysisSection
                    key={index}
                    title={section.title}
                    content={section.content}
                    index={index}
                  />
                ))}
              </div>

              {/* Action Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Ready to take action?</h3>
                          <p className="text-sm text-slate-600">Implement these insights to improve your performance</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/dashboard/${projectId}`)}
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                      >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : showPrompt && currentService?.connected ? (
            <div className="max-w-2xl mx-auto mt-20">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-100 shadow-xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {getPromptText()}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {selectedService === 'save-your-money'
                        ? 'AI Master will analyze data from all your connected services (Google Ads, Analytics, Search Console, Meta Ads, Facebook, YouTube, LinkedIn, etc.) to identify cost-saving opportunities and provide actionable recommendations.'
                        : `Click below to let AI Master analyze your ${currentService?.name} data and provide insights.`
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAskAIMaster}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg h-12 text-base font-semibold"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Ask AI Master
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl mb-4">
                <Sparkles className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to AI Master</h3>
              <p className="text-slate-600 max-w-md">
                Select a service from the sidebar to get AI-powered insights and recommendations for your project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMasterPage;
