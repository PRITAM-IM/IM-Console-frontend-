import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import {
    Calendar,
    MapPin,
    TrendingUp,
    Users,
    IndianRupee,
    RefreshCw,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Clock,
    Target,
    Lightbulb,
    Image,
} from 'lucide-react';

interface RevenueOpportunity {
    _id: string;
    eventName: string;
    eventType: 'concert' | 'festival' | 'sports' | 'conference' | 'holiday' | 'other';
    description: string;
    startDate: string;
    endDate: string;
    location: {
        address: string;
        city: string;
        country: string;
    };
    distanceFromHotel: number;
    expectedAttendance?: number;
    aiInsights?: {
        revenueOpportunity: 'High' | 'Medium' | 'Low';
        estimatedRoomDemand: number;
        recommendedCampaignStart: string;
        suggestedActions: string[];
        targetAudience: string;
        pricingStrategy: string;
    };
    source: string;
    campaignImage?: {
        url: string;
        prompt: string;
        provider?: 'gemini' | 'dalle';
        generatedAt: string;
    };
}

const RevenueOpportunitiesPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [discovering, setDiscovering] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<RevenueOpportunity | null>(null);
    const [timeframe, setTimeframe] = useState<'next30days' | 'next90days' | 'upcoming'>('next90days');
    const [generatingImage, setGeneratingImage] = useState<string | null>(null); // Track which opportunity is generating image
    const [stats, setStats] = useState({
        total: 0,
        highOpportunity: 0,
        mediumOpportunity: 0,
        lowOpportunity: 0,
        totalEstimatedRoomDemand: 0,
    });
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (projectId) {
            fetchProject();
            fetchOpportunities();
        }
    }, [projectId, timeframe]);

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${projectId}`);
            // API returns { success: true, data: project }
            if (response.data?.success && response.data?.data) {
                setProject(response.data.data);
                console.log('📍 Project data loaded:', {
                    name: response.data.data.name,
                    hasGooglePlaces: !!response.data.data.googlePlacesData?.location,
                    location: response.data.data.googlePlacesData?.location
                });
            } else if (response.data) {
                // Fallback for direct data response
                setProject(response.data);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/revenue-opportunities/projects/${projectId}`, {
                params: { timeframe },
            });

            if (response.data.success) {
                setOpportunities(response.data.data);
                setStats(response.data.stats);

                // Check if opportunities exist but hotel has changed
                if (response.data.data.length > 0 && project?.googlePlacesData) {
                    const firstOpp = response.data.data[0];
                    const currentHotelCity = project.googlePlacesData.formattedAddress || '';
                    const oppCity = firstOpp.location?.city || '';

                    // Log for debugging
                    console.log('🔍 Checking data freshness:', {
                        currentHotel: project.googlePlacesData.displayName,
                        currentCity: currentHotelCity,
                        opportunityCity: oppCity
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const discoverNewOpportunities = async () => {
        try {
            setDiscovering(true);
            const response = await api.post(`/revenue-opportunities/projects/${projectId}/discover`);

            if (response.data.success && response.data.data) {
                // Directly use the discovered opportunities
                const discoveredOpportunities = response.data.data;
                setOpportunities(discoveredOpportunities);

                // Calculate stats from discovered data
                setStats({
                    total: discoveredOpportunities.length,
                    highOpportunity: discoveredOpportunities.filter((o: any) => o.aiInsights?.revenueOpportunity === 'High').length,
                    mediumOpportunity: discoveredOpportunities.filter((o: any) => o.aiInsights?.revenueOpportunity === 'Medium').length,
                    lowOpportunity: discoveredOpportunities.filter((o: any) => o.aiInsights?.revenueOpportunity === 'Low').length,
                    totalEstimatedRoomDemand: discoveredOpportunities.reduce((sum: number, o: any) => sum + (o.aiInsights?.estimatedRoomDemand || 0), 0),
                });

                alert(`Discovered ${discoveredOpportunities.length} new revenue opportunities!`);
            }
        } catch (error: any) {
            console.error('Error discovering opportunities:', error);
            alert(error.response?.data?.message || 'Failed to discover opportunities');
        } finally {
            setDiscovering(false);
        }
    };

    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case 'concert':
                return '🎵';
            case 'festival':
                return '🎉';
            case 'sports':
                return '⚽';
            case 'conference':
                return '💼';
            case 'holiday':
                return '🎊';
            default:
                return '📅';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDaysUntil = (dateString: string) => {
        const days = Math.floor((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const generateCampaignImage = async (opportunity: RevenueOpportunity) => {
        try {
            setGeneratingImage(opportunity._id);

            const response = await api.post(`/revenue-opportunities/${opportunity._id}/generate-image`);

            if (response.data.success) {
                // Update the opportunity in the list with the new image
                setOpportunities(prev =>
                    prev.map(opp =>
                        opp._id === opportunity._id
                            ? {
                                ...opp, campaignImage: {
                                    url: response.data.data.imageUrl,
                                    prompt: response.data.data.prompt,
                                    provider: response.data.data.provider || 'gemini',
                                    generatedAt: new Date().toISOString()
                                }
                            }
                            : opp
                    )
                );

                alert('✅ Marketing post generated successfully!');
            }
        } catch (error: any) {
            console.error('Error generating campaign image:', error);
            alert(error.response?.data?.message || 'Failed to generate marketing post');
        } finally {
            setGeneratingImage(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
            </div>

            <div className="relative p-6 max-w-7xl mx-auto">
                {/* Hero Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                                        Revenue Opportunities
                                    </h1>
                                    <p className="text-gray-500 text-sm mt-1">
                                        AI-powered event discovery & revenue optimization
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={discoverNewOpportunities}
                            disabled={discovering}
                            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-2 font-semibold">
                                {discovering ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        AI Discovering...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Discover Events
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Google Places Connected - Modern Card */}
                    {project && project.googlePlacesData?.location && (
                        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-emerald-200/50 rounded-2xl p-5 mb-6 shadow-lg shadow-emerald-500/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative flex items-start gap-4">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Connected
                                            </span>
                                        </div>
                                        <a
                                            href={`/dashboard/${projectId}/places`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-700 hover:text-emerald-900 bg-emerald-100/50 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Change Hotel
                                        </a>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg truncate">
                                        {project.googlePlacesData.displayName || project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-0.5 truncate">
                                        {project.googlePlacesData.formattedAddress}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                                            📍 {project.googlePlacesData.location.latitude.toFixed(4)}, {project.googlePlacesData.location.longitude.toFixed(4)}
                                        </span>
                                        {project.googlePlacesData.rating && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">
                                                ⭐ {project.googlePlacesData.rating} ({project.googlePlacesData.userRatingCount} reviews)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Google Places Not Connected - Warning Card */}
                    {project && !project.googlePlacesData?.location && (
                        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 mb-6 shadow-lg shadow-amber-500/10">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25">
                                    <AlertCircle className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-900 text-lg">Connect Google Places</h3>
                                    <p className="text-sm text-amber-800/90 mt-1">
                                        Connect your hotel to Google Places to discover nearby events and unlock AI-powered revenue insights.
                                    </p>
                                    <a
                                        href={`/dashboard/${projectId}/places`}
                                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 text-sm font-semibold"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Connect Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid - Modern Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Total Events */}
                        <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Total Events</p>
                            </div>
                        </div>

                        {/* High Opportunity */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-emerald-600">{stats.highOpportunity}</p>
                                <p className="text-xs text-emerald-600/80 mt-1 font-medium uppercase tracking-wide">High Priority</p>
                            </div>
                        </div>

                        {/* Medium Opportunity */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Target className="h-4 w-4 text-amber-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-amber-600">{stats.mediumOpportunity}</p>
                                <p className="text-xs text-amber-600/80 mt-1 font-medium uppercase tracking-wide">Medium</p>
                            </div>
                        </div>

                        {/* Low Opportunity */}
                        <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-slate-500" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-slate-600">{stats.lowOpportunity}</p>
                                <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">Low</p>
                            </div>
                        </div>

                        {/* Est. Room Demand */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <IndianRupee className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-purple-600">{stats.totalEstimatedRoomDemand}</p>
                                <p className="text-xs text-purple-600/80 mt-1 font-medium uppercase tracking-wide">Est. Rooms</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeframe Filter - Modern Pills */}
                    <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-xl rounded-xl border border-slate-200/50 shadow-sm mt-6 w-fit">
                        <button
                            onClick={() => setTimeframe('next30days')}
                            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${timeframe === 'next30days'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                                }`}
                        >
                            Next 30 Days
                        </button>
                        <button
                            onClick={() => setTimeframe('next90days')}
                            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${timeframe === 'next90days'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                                }`}
                        >
                            Next 90 Days
                        </button>
                        <button
                            onClick={() => setTimeframe('upcoming')}
                            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${timeframe === 'upcoming'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                                }`}
                        >
                            All Upcoming
                        </button>
                    </div>
                </div>

                {/* Stale Data Warning */}
                {!loading && opportunities.length > 0 && project?.googlePlacesData && (
                    (() => {
                        const firstOpp = opportunities[0];
                        const currentHotelName = project.googlePlacesData.displayName || project.name;
                        const currentLocation = project.googlePlacesData.formattedAddress || '';
                        const oppLocation = firstOpp.location?.city || '';

                        // Check if locations don't match (simple check)
                        const isDifferentLocation = currentLocation && oppLocation &&
                            !currentLocation.toLowerCase().includes(oppLocation.toLowerCase());

                        if (isDifferentLocation) {
                            return (
                                <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 bg-orange-500 rounded-xl shadow-lg">
                                            <AlertCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-orange-900 text-lg mb-2">
                                                ⚠️ Outdated Event Data Detected
                                            </h3>
                                            <p className="text-orange-800 mb-3">
                                                The events shown below are for a <strong>different hotel location</strong>.
                                                Your current hotel is <strong>{currentHotelName}</strong> but these events
                                                are for <strong>{oppLocation}</strong>.
                                            </p>
                                            <button
                                                onClick={discoverNewOpportunities}
                                                disabled={discovering}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200 font-semibold"
                                            >
                                                {discovering ? (
                                                    <>
                                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                                        Discovering New Events...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-5 w-5" />
                                                        Discover Events for Current Hotel
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()
                )}

                {/* Opportunities List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                        </div>
                        <p className="mt-4 text-gray-500 text-sm">Loading opportunities...</p>
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-12 text-center shadow-xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2" />
                        <div className="relative">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Found</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Click "Discover Events" to find upcoming opportunities near your hotel and unlock AI-powered revenue insights
                            </p>
                            <button
                                onClick={discoverNewOpportunities}
                                disabled={discovering}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 font-semibold"
                            >
                                <Sparkles className="h-5 w-5" />
                                {discovering ? 'Discovering...' : 'Discover Events Now'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        {opportunities.map((opportunity) => {
                            const daysUntil = getDaysUntil(opportunity.startDate);
                            const isUrgent = daysUntil <= 60 && daysUntil >= 0;
                            const opportunityLevel = opportunity.aiInsights?.revenueOpportunity;

                            return (
                                <div
                                    key={opportunity._id}
                                    className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Opportunity Level Indicator Bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${opportunityLevel === 'High' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                                        opportunityLevel === 'Medium' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                                            'bg-gradient-to-r from-slate-300 to-slate-400'
                                        }`} />

                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Event Type Icon */}
                                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${opportunityLevel === 'High' ? 'bg-gradient-to-br from-emerald-100 to-green-100' :
                                                opportunityLevel === 'Medium' ? 'bg-gradient-to-br from-amber-100 to-orange-100' :
                                                    'bg-gradient-to-br from-slate-100 to-gray-100'
                                                }`}>
                                                {getEventTypeIcon(opportunity.eventType)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 truncate">{opportunity.eventName}</h3>
                                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                {formatDate(opportunity.startDate)}
                                                                {opportunity.endDate !== opportunity.startDate &&
                                                                    ` - ${formatDate(opportunity.endDate)}`}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                                {opportunity.location.city}
                                                                {opportunity.distanceFromHotel > 0 && opportunity.distanceFromHotel < 500
                                                                    ? ` (${opportunity.distanceFromHotel.toFixed(1)} km)`
                                                                    : ''}
                                                            </span>
                                                            {opportunity.expectedAttendance && (
                                                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                    {opportunity.expectedAttendance.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Opportunity Badge */}
                                                    {opportunity.aiInsights && (
                                                        <div className={`flex-shrink-0 px-4 py-2 rounded-xl text-center ${opportunityLevel === 'High' ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25' :
                                                            opportunityLevel === 'Medium' ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25' :
                                                                'bg-gradient-to-br from-slate-400 to-gray-500 text-white shadow-lg shadow-slate-500/25'
                                                            }`}>
                                                            <p className="text-xs font-medium opacity-90">Opportunity</p>
                                                            <p className="text-lg font-bold">{opportunityLevel}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Urgent Badge */}
                                                {isUrgent && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200 rounded-lg mb-3">
                                                        <span className="flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                                        </span>
                                                        <span className="text-sm font-semibold text-orange-700">
                                                            ⚡ {daysUntil} days until event
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Description */}
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{opportunity.description}</p>

                                                {/* AI Insights Cards */}
                                                {opportunity.aiInsights && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {/* Est. Room Demand */}
                                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <IndianRupee className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-purple-600 font-medium">Est. Room Demand</p>
                                                                <p className="text-lg font-bold text-purple-900">{opportunity.aiInsights.estimatedRoomDemand} rooms</p>
                                                            </div>
                                                        </div>

                                                        {/* Campaign Timeline */}
                                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Clock className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs text-blue-600 font-medium">Campaign Start</p>
                                                                <p className="text-sm font-bold text-blue-900">
                                                                    {formatDate(opportunity.aiInsights.recommendedCampaignStart)}
                                                                </p>
                                                                <p className="text-xs mt-0.5">
                                                                    {(() => {
                                                                        const campaignDays = getDaysUntil(opportunity.aiInsights.recommendedCampaignStart);
                                                                        const eventDays = getDaysUntil(opportunity.startDate);

                                                                        if (campaignDays < 0) {
                                                                            if (eventDays <= 14) {
                                                                                return <span className="text-red-600 font-semibold">🚨 Urgent! {eventDays} days left</span>;
                                                                            } else if (eventDays <= 30) {
                                                                                return <span className="text-orange-600 font-semibold">⚡ Start now! {eventDays} days left</span>;
                                                                            } else {
                                                                                return <span className="text-amber-600 font-semibold">Start soon! {eventDays} days left</span>;
                                                                            }
                                                                        } else if (campaignDays === 0) {
                                                                            return <span className="text-emerald-600 font-semibold">✓ Ideal time to start!</span>;
                                                                        } else if (campaignDays <= 7) {
                                                                            return <span className="text-blue-600 font-semibold">Start in {campaignDays} days</span>;
                                                                        } else {
                                                                            return <span className="text-gray-600">Start in {campaignDays} days</span>;
                                                                        }
                                                                    })()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* AI Insights Expandable Section */}
                                        {opportunity.aiInsights && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <button
                                                    onClick={() =>
                                                        setSelectedOpportunity(
                                                            selectedOpportunity?._id === opportunity._id ? null : opportunity
                                                        )
                                                    }
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm group"
                                                >
                                                    <div className="p-1.5 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                        <Lightbulb className="h-4 w-4" />
                                                    </div>
                                                    {selectedOpportunity?._id === opportunity._id
                                                        ? 'Hide AI Insights'
                                                        : 'View AI Insights & Recommendations'}
                                                </button>

                                                {selectedOpportunity?._id === opportunity._id && (
                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        {/* Target Audience */}
                                                        <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="p-1.5 bg-violet-100 rounded-lg">
                                                                    <Users className="h-4 w-4 text-violet-600" />
                                                                </div>
                                                                <h4 className="font-semibold text-violet-900 text-sm">Target Audience</h4>
                                                            </div>
                                                            <p className="text-sm text-violet-800">{opportunity.aiInsights.targetAudience}</p>
                                                        </div>

                                                        {/* Pricing Strategy */}
                                                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                                    <IndianRupee className="h-4 w-4 text-emerald-600" />
                                                                </div>
                                                                <h4 className="font-semibold text-emerald-900 text-sm">Pricing Strategy</h4>
                                                            </div>
                                                            <p className="text-sm text-emerald-800">{opportunity.aiInsights.pricingStrategy}</p>
                                                        </div>

                                                        {/* Suggested Actions */}
                                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <h4 className="font-semibold text-blue-900 text-sm">Recommended Actions</h4>
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {opportunity.aiInsights.suggestedActions.map((action, index) => (
                                                                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                                                                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                                            {index + 1}
                                                                        </span>
                                                                        <span>{action}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Marketing Post Generation Section */}
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            {opportunity.campaignImage ? (
                                                // Show generated image
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                            <Image className="h-4 w-4 text-green-600" />
                                                            Marketing Post Generated
                                                        </h4>
                                                        <a
                                                            href={opportunity.campaignImage.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            Open Full Size →
                                                        </a>
                                                    </div>
                                                    <div className="relative rounded-xl overflow-hidden border-2 border-green-200 shadow-lg">
                                                        <img
                                                            src={opportunity.campaignImage.url}
                                                            alt={`Marketing post for ${opportunity.eventName}`}
                                                            className="w-full h-auto"
                                                        />
                                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold shadow-lg ${opportunity.campaignImage.provider === 'gemini'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-green-500 text-white'
                                                            }`}>
                                                            ✓ {opportunity.campaignImage.provider === 'gemini' ? 'Gemini AI' : 'DALL-E 3'}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 italic">
                                                        Generated on {new Date(opportunity.campaignImage.generatedAt).toLocaleDateString('en-IN')}
                                                        {opportunity.campaignImage.provider && (
                                                            <span className="ml-2">• Powered by {opportunity.campaignImage.provider === 'gemini' ? 'Google Gemini' : 'OpenAI DALL-E 3'}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            ) : (
                                                // Show generate button
                                                <button
                                                    onClick={() => generateCampaignImage(opportunity)}
                                                    disabled={generatingImage === opportunity._id}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                                >
                                                    {generatingImage === opportunity._id ? (
                                                        <>
                                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                                            Generating Marketing Post...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Image className="h-5 w-5" />
                                                            Generate Marketing Post with AI
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueOpportunitiesPage;
