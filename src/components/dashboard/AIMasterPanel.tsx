import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Search,
  BarChart3,
  Megaphone,
  Facebook,
  Youtube,
  Star,
  Target,
  DollarSign,
  ChevronLeft,
  Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import type { Project } from "@/types";

interface AIMasterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projects: Project[];
  currentProject: Project | null;
  onProjectChange: (project: Project) => void;
}

type ServiceType = 'save-your-money' | 'google-ads' | 'google-analytics' | 'google-search-console' | 'meta-ads' | 'facebook-insights' | 'youtube-insights' | 'google-reviews' | 'google-places';

interface ServiceItem {
  id: ServiceType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  dataKey?: string;
}

const AIMasterPanel = ({ isOpen, onClose, projectId, projects, currentProject, onProjectChange }: AIMasterPanelProps) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('save-your-money');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

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
      icon: TrendingUp,
      connected: !!currentProject?.googleAdsCustomerId,
      dataKey: 'googleAdsCustomerId'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      icon: BarChart3,
      connected: !!currentProject?.gaPropertyId,
      dataKey: 'gaPropertyId'
    },
    {
      id: 'google-search-console',
      name: 'Search Console',
      icon: Search,
      connected: !!currentProject?.searchConsoleSiteUrl,
      dataKey: 'searchConsoleSiteUrl'
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads',
      icon: Megaphone,
      connected: !!currentProject?.metaAdsAccountId,
      dataKey: 'metaAdsAccountId'
    },
    {
      id: 'facebook-insights',
      name: 'Facebook Insights',
      icon: Facebook,
      connected: !!currentProject?.facebookPageId,
      dataKey: 'facebookPageId'
    },
    {
      id: 'youtube-insights',
      name: 'YouTube Insights',
      icon: Youtube,
      connected: !!currentProject?.youtubeChannelId,
      dataKey: 'youtubeChannelId'
    },
    {
      id: 'google-places',
      name: 'Google Places',
      icon: Star,
      connected: !!currentProject?.googlePlacesId,
      dataKey: 'googlePlacesId'
    },
  ];

  const currentService = services.find(s => s.id === selectedService);

  // Reset when project changes
  useEffect(() => {
    setAnalysis(null);
    setShowPrompt(false);
    setSelectedService('save-your-money');
  }, [projectId]);

  // Show prompt when changing to a specific service
  useEffect(() => {
    if (selectedService !== 'save-your-money' && currentService?.connected) {
      setShowPrompt(true);
      setAnalysis(null);
    } else if (selectedService === 'save-your-money') {
      setShowPrompt(false);
    }
  }, [selectedService]);

  const getPromptText = () => {
    const serviceNames: Record<ServiceType, string> = {
      'save-your-money': '',
      'google-ads': 'Google Ads',
      'google-analytics': 'Google Analytics',
      'google-search-console': 'Google Search Console',
      'meta-ads': 'Meta Ads',
      'facebook-insights': 'Facebook Insights',
      'youtube-insights': 'YouTube',
      'google-reviews': 'Google Reviews',
      'google-places': 'Google Places'
    };
    return `Would you like me to know your ${serviceNames[selectedService]} performance?`;
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/ai/analyze-service", {
        projectId,
        serviceType: selectedService,
      });

      if (data.success) {
        setAnalysis(data.data.analysis);
        setShowPrompt(false);
      } else {
        setError(data.error || "Failed to generate analysis");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to generate analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId: ServiceType) => {
    const service = services.find(s => s.id === serviceId);
    if (!service?.connected && serviceId !== 'save-your-money') {
      return; // Don't allow clicking disconnected services
    }
    setSelectedService(serviceId);
  };

  const handleAskAIMaster = () => {
    fetchAnalysis();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex bg-gradient-to-b from-slate-50 via-white to-slate-50">
          {/* Left Sidebar */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
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
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Selected Project
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-semibold"
                  >
                    <span className="truncate">{currentProject?.name || 'Select Project'}</span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  {projects.map((project) => (
                    <DropdownMenuItem
                      key={project.id ?? project._id}
                      onClick={() => onProjectChange(project)}
                      className={cn(
                        "cursor-pointer",
                        (project.id ?? project._id) === projectId ? "bg-indigo-50 text-indigo-700" : ""
                      )}
                    >
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Services Sidebar */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
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
                onClick={onClose}
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
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-4 bg-red-100 rounded-2xl">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-800">Something went wrong</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mt-2">{error}</p>
                  <Button
                    onClick={fetchAnalysis}
                    className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : showPrompt ? (
                <div className="flex flex-col items-center justify-center h-full px-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl"
                  >
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
                            Click below to let AI Master analyze your {currentService?.name} data and provide insights.
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
                  </motion.div>
                </div>
              ) : analysis ? (
                <div className="max-w-3xl mx-auto">
                  <div className="prose-container">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => {
                          const text = String(children);
                          let icon = <TrendingUp className="h-5 w-5" />;
                          let bgColor = "from-slate-100 to-slate-50";
                          let iconBg = "bg-slate-200 text-slate-600";
                          let borderColor = "border-slate-200";

                          if (text.includes("Wrong") || text.includes("Issues") || text.includes("🔴")) {
                            icon = <AlertTriangle className="h-5 w-5" />;
                            bgColor = "from-red-50 to-orange-50";
                            iconBg = "bg-red-100 text-red-600";
                            borderColor = "border-red-200";
                          } else if (text.includes("Right") || text.includes("Positive") || text.includes("✅")) {
                            icon = <CheckCircle2 className="h-5 w-5" />;
                            bgColor = "from-emerald-50 to-green-50";
                            iconBg = "bg-emerald-100 text-emerald-600";
                            borderColor = "border-emerald-200";
                          } else if (text.includes("Suggest") || text.includes("Recommendation") || text.includes("💡")) {
                            icon = <Zap className="h-5 w-5" />;
                            bgColor = "from-amber-50 to-yellow-50";
                            iconBg = "bg-amber-100 text-amber-600";
                            borderColor = "border-amber-200";
                          } else if (text.includes("Action") || text.includes("Must") || text.includes("🎯")) {
                            icon = <Target className="h-5 w-5" />;
                            bgColor = "from-indigo-50 to-purple-50";
                            iconBg = "bg-indigo-100 text-indigo-600";
                            borderColor = "border-indigo-200";
                          }

                          return (
                            <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${bgColor} rounded-xl border ${borderColor} mt-6 mb-4 first:mt-0`}>
                              <div className={`p-2 rounded-lg ${iconBg}`}>
                                {icon}
                              </div>
                              <h2 className="text-lg font-bold text-slate-800 m-0">
                                {text.replace(/🔴|✅|💡|🎯/g, '').trim()}
                              </h2>
                            </div>
                          );
                        },
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold text-slate-800 mt-5 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-slate-600 mb-4 leading-relaxed text-[15px]">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-3 mb-5">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex gap-3 text-slate-600 text-[15px] leading-relaxed">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              •
                            </span>
                            <span className="flex-1">{children}</span>
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-slate-800">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="text-red-600 not-italic font-medium">{children}</em>
                        ),
                      }}
                    >
                      {analysis}
                    </ReactMarkdown>
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
      )}
    </AnimatePresence>
  );
};

export default AIMasterPanel;
