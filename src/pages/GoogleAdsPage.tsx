import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Link2,
  TrendingUp,
  TrendingDown,
  MousePointer,
  DollarSign,
  Target,
  Percent,
  RefreshCw,
  Search,
  BarChart3,
  Eye,
  AlertCircle,
  ExternalLink,
  Columns
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Legend
} from "recharts";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ReconnectButton from "@/components/common/ReconnectButton";
import DisconnectButton from "@/components/common/DisconnectButton";
import AIMasterButton from "@/components/common/AIMasterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ConnectGoogleAds from "@/components/projects/ConnectGoogleAds";
import api from "@/lib/api";
import { buildDateRange } from "@/lib/utils";
import { formatCurrency as formatCurrencyUtil } from "@/lib/currency";
import type { DateRange, Project } from "@/types";
import type { DateRangePreset } from "@/constants/dateRanges";

interface GoogleAdsOverviewMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
  costPerConversion: number;
  averageCpm?: number;
  conversionRate?: number;
  interactions?: number;
  interactionRate?: number;
}

interface LocationData {
  country: string;
  countryCode: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
}

interface DeviceData {
  device: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
  conversionRate?: number;
  costPerConversion?: number;
}

interface KeywordData {
  id: string;
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
  conversionRate: number;
  costPerConversion: number;
  qualityScore?: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};



const GoogleAdsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [overview, setOverview] = useState<GoogleAdsOverviewMetrics | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [adsErrors, setAdsErrors] = useState<Record<string, string | null>>({
    overview: null,
    locations: null,
    devices: null,
    campaigns: null,
    keywords: null,
    dailyMetrics: null,
  });

  const [rangePreset, setRangePreset] = useState<DateRangePreset>("7d");
  const [customRange, setCustomRange] = useState<{ startDate?: string; endDate?: string }>({});
  const [activeRange, setActiveRange] = useState<DateRange>(() => buildDateRange("7d"));
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (num: number) => {
    const currency = project?.googleAdsCurrency || 'INR';
    return formatCurrencyUtil(num, currency);
  };

  const params = useMemo(
    () => ({
      params: {
        startDate: activeRange.startDate,
        endDate: activeRange.endDate,
      },
    }),
    [activeRange]
  );

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoadingProject(true);
      const response = await api.get<{ success: boolean; data: Project }>(`/projects/${projectId}`);
      const project = response.data.data || response.data;
      setProject(project as Project);
      setProjectError(null);
    } catch (error) {
      setProjectError(
        error instanceof Error ? error.message : "Project not found."
      );
    } finally {
      setLoadingProject(false);
    }
  }, [projectId]);

  const fetchAdsData = useCallback(async () => {
    if (!projectId || !project?.googleAdsCustomerId) return;

    setLoadingAds(true);
    setAdsErrors({
      overview: null,
      locations: null,
      devices: null,
      campaigns: null,
      keywords: null,
      dailyMetrics: null,
    });

    try {
      const overviewRes = await api.get<{ success: boolean; data: GoogleAdsOverviewMetrics }>(
        `/google-ads/${projectId}/overview`,
        params
      );
      setOverview(overviewRes.data.data);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        overview: error.response?.data?.error || error.message,
      }));
    }

    try {
      const locationsRes = await api.get<{ success: boolean; data: LocationData[] }>(
        `/google-ads/${projectId}/locations`,
        params
      );
      setLocations(locationsRes.data.data || []);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        locations: error.response?.data?.error || error.message,
      }));
    }

    try {
      const devicesRes = await api.get<{ success: boolean; data: DeviceData[] }>(
        `/google-ads/${projectId}/devices`,
        params
      );
      setDevices(devicesRes.data.data || []);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        devices: error.response?.data?.error || error.message,
      }));
    }

    try {
      const campaignsRes = await api.get<{ success: boolean; data: Campaign[] }>(
        `/google-ads/${projectId}/campaigns`,
        params
      );
      setCampaigns(campaignsRes.data.data || []);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        campaigns: error.response?.data?.error || error.message,
      }));
    }

    try {
      const keywordsRes = await api.get<{ success: boolean; data: KeywordData[] }>(
        `/google-ads/${projectId}/keywords`,
        params
      );
      setKeywords(keywordsRes.data.data || []);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        keywords: error.response?.data?.error || error.message,
      }));
    }

    // Fetch daily metrics for the Performance Metrics chart
    try {
      const dailyRes = await api.get<{ success: boolean; data: any[] }>(
        `/google-ads/${projectId}/daily-metrics`,
        params
      );
      setDailyMetrics(dailyRes.data.data || []);
    } catch (error: any) {
      setAdsErrors((prev) => ({
        ...prev,
        dailyMetrics: error.response?.data?.error || error.message,
      }));
    }

    setLoadingAds(false);
  }, [projectId, project?.googleAdsCustomerId, params]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.googleAdsCustomerId) {
      void fetchAdsData();
    }
  }, [fetchAdsData, project?.googleAdsCustomerId]);

  const handleConnectSuccess = async () => {
    setShowConnectModal(false);
    await new Promise(resolve => setTimeout(resolve, 500));
    await fetchProject();
  };

  // Filter campaigns by search
  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter keywords by search
  const filteredKeywords = keywords.filter(k =>
    k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!projectId) {
    return (
      <EmptyState
        title="No project selected"
        description="Choose a project from your list to view Google Ads data."
      />
    );
  }

  if (loadingProject) {
    return <LoadingState message="Loading project..." className="py-16" />;
  }

  if (projectError) {
    return (
      <ErrorState
        description={projectError}
        onRetry={fetchProject}
        className="py-16"
      />
    );
  }

  if (project && !project.googleAdsCustomerId) {
    return (
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Google Ads</h1>
          <p className="text-sm text-slate-500">Connect your advertising account</p>
        </div>
        <Card className="bg-white border-2 border-dashed border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Connect Google Ads</CardTitle>
                <CardDescription className="text-slate-500">
                  Link your account to view campaign performance, metrics, and insights.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowConnectModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Link2 className="mr-2 h-4 w-4" />
              Connect Google Ads
            </Button>
          </CardContent>
        </Card>
        {showConnectModal && projectId && (
          <ConnectGoogleAds
            projectId={projectId}
            onSuccess={handleConnectSuccess}
            onClose={() => setShowConnectModal(false)}
          />
        )}
      </section>
    );
  }

  const handleApplyRange = (newPreset: DateRangePreset, newCustomRange: { startDate?: string; endDate?: string }) => {
    // Use fresh values passed from DateRangeSelector instead of relying on state
    setActiveRange(buildDateRange(newPreset, newCustomRange));
  };

  const handleRefresh = () => {
    void fetchAdsData();
  };

  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/25">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Google Ads</h1>
            <p className="text-sm text-slate-500">
              Performance data from {activeRange.startDate} to {activeRange.endDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AIMasterButton />
          <ReconnectButton
            service="google-ads"
            projectId={projectId || ''}
            onReconnectSuccess={() => window.location.reload()}
          />
          <DisconnectButton
            service="google-ads"
            projectId={projectId || ''}
            onDisconnectSuccess={() => window.location.reload()}
          />
          <Button variant="outline" onClick={handleRefresh} disabled={loadingAds}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingAds ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <DateRangeSelector
            preset={rangePreset}
            onPresetChange={setRangePreset}
            customRange={customRange}
            onCustomChange={(field, value) =>
              setCustomRange((prev) => ({ ...prev, [field]: value }))
            }
            onApply={handleApplyRange}
            disabled={loadingAds}
          />
        </div>
      </div>

      {/* Overview Cards */}
      {adsErrors.overview && adsErrors.overview.includes('Test Mode') && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Developer Token in Test Mode</h3>
                <div className="text-sm text-amber-800 space-y-2">
                  <p>Your Google Ads developer token can only access <strong>TEST accounts</strong>, not regular Google Ads accounts.</p>
                  <p className="font-medium">To fix this, choose one option:</p>
                  <div className="ml-4 space-y-1">
                    <p><strong>Option 1:</strong> Create a TEST Manager Account (for development)</p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>Visit <a href="https://ads.google.com/aw/overview" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Google Ads <ExternalLink className="h-3 w-3" /></a> (use a separate Google account)</li>
                      <li>Click the blue button "Create a test manager account"</li>
                      <li>Create test client accounts under this test manager</li>
                      <li>Use the TEST client customer ID (shows "Test account" label in red)</li>
                    </ol>
                    <p className="mt-2"><strong>Option 2:</strong> Apply for Standard Access (for production)</p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>Visit <a href="https://ads.google.com/aw/apicenter" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">API Center <ExternalLink className="h-3 w-3" /></a></li>
                      <li>Apply for Standard Access (takes 1-2 business days)</li>
                      <li>Use with regular Google Ads accounts after approval</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {loadingAds && !overview ? (
        <LoadingState message="Loading ads data..." />
      ) : adsErrors.overview && !overview ? (
        <ErrorState description={adsErrors.overview} onRetry={handleRefresh} />
      ) : overview ? (
        <>
          {/* ACCOUNT OVERVIEW - Pastel Cards */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Account Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Impressions Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-blue-50 border-blue-100 hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-full">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{formatNumber(overview.impressions)}</p>
                          <p className="text-sm text-slate-500">Impressions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span>9.87%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Clicks Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="bg-green-50 border-green-100 hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-full">
                          <MousePointer className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{formatNumber(overview.clicks)}</p>
                          <p className="text-sm text-slate-500">Clicks</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span>2.01%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Conversions Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-orange-50 border-orange-100 hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 rounded-full">
                          <Target className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{overview.conversions.toFixed(2)}</p>
                          <p className="text-sm text-slate-500">Conversions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span>32.30%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cost Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="bg-emerald-50 border-emerald-100 hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 rounded-full">
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{formatCurrency(overview.cost)}</p>
                          <p className="text-sm text-slate-500">Cost</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-500 text-xs">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>33.11%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">CTR</p>
                    <p className="text-xl font-bold text-slate-900">{overview.ctr.toFixed(2)}%</p>
                  </div>
                  <Percent className="h-5 w-5 text-purple-500" />
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Avg CPC</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(overview.averageCpc)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-cyan-500" />
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Conv Rate</p>
                    <p className="text-xl font-bold text-slate-900">{(overview.conversionRate || 0).toFixed(2)}%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Cost/Conv</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(overview.costPerConversion)}</p>
                  </div>
                  <Target className="h-5 w-5 text-orange-500" />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}

      {/* Performance Metrics Chart */}
      {dailyMetrics.length > 0 && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-700 text-lg">Performance Metrics</CardTitle>
                <p className="text-sm text-slate-500">Multi-dimensional campaign analytics</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-400 rounded-sm"></span>
                  <span className="text-slate-600">Impressions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-400 rounded-sm"></span>
                  <span className="text-slate-600">Clicks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-yellow-400 rounded-sm"></span>
                  <span className="text-slate-600">Conversions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-green-400 rounded-sm"></span>
                  <span className="text-slate-600">Cost</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dailyMetrics}
                  margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrency(v)}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'cost') return [formatCurrency(value), 'Cost'];
                      if (name === 'impressions') return [formatNumber(value), 'Impressions'];
                      if (name === 'clicks') return [formatNumber(value), 'Clicks'];
                      if (name === 'conversions') return [value.toFixed(2), 'Conversions'];
                      return [value, name];
                    }}
                  />
                  <Legend />

                  {/* Bars */}
                  <Bar yAxisId="left" dataKey="impressions" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={20} name="Impressions" />
                  <Bar yAxisId="left" dataKey="clicks" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={20} name="Clicks" />
                  <Bar yAxisId="left" dataKey="conversions" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={20} name="Conversions" />
                  <Bar yAxisId="right" dataKey="cost" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={20} name="Cost" />

                  {/* Trend line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Cost Trend"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Filter buttons */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-slate-700">Filter by Change Category</h4>
                <p className="text-xs text-slate-500">Select multiple categories to view change indicators on the graph</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" className="text-xs rounded-full border-purple-200 text-purple-700 hover:bg-purple-50">
                    All Changes
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs rounded-full bg-purple-600 text-white hover:bg-purple-700 border-purple-600">
                    Amount Micros
                  </Button>
                  <span className="text-xs text-purple-600 underline cursor-pointer ml-2">Clear All</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Location</h2>
            <select className="text-xs bg-purple-600 text-white rounded px-3 py-1.5 cursor-pointer">
              <option>Conversions %</option>
              <option>Clicks</option>
              <option>Impressions</option>
              <option>Cost</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {locations.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locations.slice(0, 5)}
                  layout="horizontal"
                  margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis
                    dataKey="country"
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), 'Conversions']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">No location data available</div>
          )}
        </CardContent>
      </Card>

      {/* Devices Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Devices</h2>
            <select className="text-xs bg-purple-600 text-white rounded px-3 py-1.5 cursor-pointer">
              <option>Conversions %</option>
              <option>Clicks</option>
              <option>Impressions</option>
              <option>Cost</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {devices.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={devices}
                  layout="horizontal"
                  margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis
                    dataKey="device"
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), 'Conversions']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">No device data available</div>
          )}
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search campaigns or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-slate-200"
        />
      </div>

      {/* Campaigns Table */}
      {campaigns.length > 0 && (
        <Card className="bg-white overflow-hidden border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  List of Campaigns
                </CardTitle>
                <p className="text-purple-200 text-sm mt-1">Filter by campaign status</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs bg-white/10 text-white rounded px-3 py-1.5 border border-white/20">
                  <option>All Active</option>
                  <option>Enabled</option>
                  <option>Paused</option>
                </select>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Columns className="h-4 w-4 mr-1" />
                  Columns
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50 border-b border-purple-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Updated</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Status ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Impressions ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Clicks ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Cost ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Conv. ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Cost/Conv.</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Avg. CPC ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">CTR ↕</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((campaign, index) => (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-purple-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{campaign.name}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${campaign.status === 'ENABLED'
                          ? 'text-green-600'
                          : campaign.status === 'PAUSED'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${campaign.status === 'ENABLED'
                            ? 'bg-green-500'
                            : campaign.status === 'PAUSED'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                            }`}></span>
                          {campaign.status === 'ENABLED' ? 'Active' : campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {formatNumber(campaign.impressions)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-purple-600">
                        {formatNumber(campaign.clicks)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {formatCurrency(campaign.cost)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-purple-600">
                        {campaign.conversions}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-red-500">
                        {formatCurrency(campaign.costPerConversion || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-purple-600">
                        {formatCurrency(campaign.averageCpc)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {campaign.ctr.toFixed(2)}%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords Table */}
      {keywords.length > 0 && (
        <Card className="bg-white overflow-hidden border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  List of Keywords
                </CardTitle>
                <p className="text-purple-200 text-sm mt-1">Filter by keyword status</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs bg-white/10 text-white rounded px-3 py-1.5 border border-white/20">
                  <option>All</option>
                  <option>BROAD</option>
                  <option>PHRASE</option>
                  <option>EXACT</option>
                </select>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Columns className="h-4 w-4 mr-1" />
                  Columns
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50 border-b border-purple-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Keyword</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Match Type ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Impressions ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Clicks ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Cost ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Conv. ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Cost/Conv.</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">Avg CPC ↕</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">CTR ↕</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKeywords.slice(0, 20).map((kw, index) => (
                    <motion.tr
                      key={kw.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-purple-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm flex items-center gap-2">
                          <Search className="h-3.5 w-3.5 text-slate-400" />
                          {kw.keyword}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${kw.matchType === 'BROAD' ? 'bg-blue-100 text-blue-700' :
                          kw.matchType === 'PHRASE' ? 'bg-purple-100 text-purple-700' :
                            kw.matchType === 'EXACT' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-600'
                          }`}>
                          {kw.matchType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {formatNumber(kw.impressions)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-purple-600">
                        {formatNumber(kw.clicks)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {formatCurrency(kw.cost)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-purple-600">
                        {kw.conversions}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {formatCurrency(kw.costPerConversion)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-purple-600">
                        {formatCurrency(kw.averageCpc)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">
                        {kw.ctr.toFixed(2)}%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Show</span>
                <select className="text-sm border rounded px-2 py-1">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>←</Button>
                <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="px-2 text-slate-400">...</span>
                <Button variant="outline" size="sm">→</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loadingAds && !overview && !locations.length && !devices.length && !campaigns.length && !keywords.length && (
        <LoadingState message="Loading Google Ads data..." className="py-16" />
      )}
    </motion.section>
  );
};

export default GoogleAdsPage;
