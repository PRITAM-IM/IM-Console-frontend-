import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import {
    Calendar,
    MapPin,
    TrendingUp,
    Users,
    DollarSign,
    RefreshCw,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Clock,
    Target,
    Lightbulb,
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
}

const RevenueOpportunitiesPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [discovering, setDiscovering] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<RevenueOpportunity | null>(null);
    const [timeframe, setTimeframe] = useState<'next30days' | 'next90days' | 'upcoming'>('next90days');
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

    const getOpportunityColor = (level?: 'High' | 'Medium' | 'Low') => {
        switch (level) {
            case 'High':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'Medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Low':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            Revenue Opportunities
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Discover upcoming events and maximize your hotel revenue with AI-powered insights
                        </p>
                    </div>
                    <button
                        onClick={discoverNewOpportunities}
                        disabled={discovering}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {discovering ? (
                            <>
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                Discovering...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Discover Events
                            </>
                        )}
                    </button>
                </div>
                {/* Google Places Connected - Show Success Banner */}
                {project && project.googlePlacesData?.location && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-green-900">✓ Google Places Connected</h3>
                                    <a
                                        href={`/dashboard/${projectId}/places`}
                                        className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Change Hotel
                                    </a>
                                </div>
                                <p className="text-sm text-green-800 mt-1 font-medium">
                                    {project.googlePlacesData.displayName || project.name}
                                </p>
                                <p className="text-xs text-green-700 mt-0.5">
                                    {project.googlePlacesData.formattedAddress}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        📍 {project.googlePlacesData.location.latitude.toFixed(4)}, {project.googlePlacesData.location.longitude.toFixed(4)}
                                    </span>
                                    {project.googlePlacesData.rating && (
                                        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                            ⭐ {project.googlePlacesData.rating} ({project.googlePlacesData.userRatingCount} reviews)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Google Places Not Connected - Show Connect Banner */}
                {project && !project.googlePlacesData?.location && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-amber-900">Connect Google Places for Event Discovery</h3>
                                <p className="text-sm text-amber-800 mt-1">
                                    To discover events near your hotel, please connect Google Places. This provides accurate location data and enables our AI to find relevant events in your area.
                                </p>
                                <a
                                    href={`/dashboard/${projectId}/places`}
                                    className="mt-3 inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                                >
                                    Connect Google Places
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">High Opportunity</p>
                                <p className="text-2xl font-bold text-green-600">{stats.highOpportunity}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Medium Opportunity</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.mediumOpportunity}</p>
                            </div>
                            <Target className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Low Opportunity</p>
                                <p className="text-2xl font-bold text-gray-600">{stats.lowOpportunity}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Est. Room Demand</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalEstimatedRoomDemand}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Timeframe Filter */}
                <div className="flex gap-2 mt-6">
                    <button
                        onClick={() => setTimeframe('next30days')}
                        className={`px-4 py-2 rounded-lg transition-colors ${timeframe === 'next30days'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Next 30 Days
                    </button>
                    <button
                        onClick={() => setTimeframe('next90days')}
                        className={`px-4 py-2 rounded-lg transition-colors ${timeframe === 'next90days'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Next 90 Days
                    </button>
                    <button
                        onClick={() => setTimeframe('upcoming')}
                        className={`px-4 py-2 rounded-lg transition-colors ${timeframe === 'upcoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All Upcoming
                    </button>
                </div>
            </div>

            {/* Opportunities List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : opportunities.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600 mb-6">
                        Click "Discover Events" to find upcoming opportunities near your hotel
                    </p>
                    <button
                        onClick={discoverNewOpportunities}
                        disabled={discovering}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {discovering ? 'Discovering...' : 'Discover Events Now'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {opportunities.map((opportunity) => {
                        const daysUntil = getDaysUntil(opportunity.startDate);
                        const isUrgent = daysUntil <= 60 && daysUntil >= 0;

                        return (
                            <div
                                key={opportunity._id}
                                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl">{getEventTypeIcon(opportunity.eventType)}</span>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{opportunity.eventName}</h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(opportunity.startDate)}
                                                            {opportunity.endDate !== opportunity.startDate &&
                                                                ` - ${formatDate(opportunity.endDate)}`}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {opportunity.location.city}
                                                            {opportunity.distanceFromHotel > 0 && opportunity.distanceFromHotel < 500
                                                                ? ` (${opportunity.distanceFromHotel.toFixed(1)} km away)`
                                                                : ''}
                                                        </span>
                                                        {opportunity.expectedAttendance && (
                                                            <span className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                {opportunity.expectedAttendance.toLocaleString()} expected
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {isUrgent && (
                                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-md inline-flex mb-3">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm font-medium">
                                                        Start campaign now! Only {daysUntil} days until event
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-gray-700 mb-4">{opportunity.description}</p>

                                            {opportunity.aiInsights && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Revenue Opportunity Badge */}
                                                    <div
                                                        className={`p-4 rounded-lg border ${getOpportunityColor(
                                                            opportunity.aiInsights.revenueOpportunity
                                                        )}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium">Revenue Opportunity</span>
                                                            <TrendingUp className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-2xl font-bold">
                                                            {opportunity.aiInsights.revenueOpportunity}
                                                        </p>
                                                        <p className="text-sm mt-1">
                                                            Est. {opportunity.aiInsights.estimatedRoomDemand} rooms
                                                        </p>
                                                    </div>

                                                    {/* Campaign Timeline */}
                                                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-blue-900">Campaign Start</span>
                                                            <Clock className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <p className="text-lg font-bold text-blue-900">
                                                            {formatDate(opportunity.aiInsights.recommendedCampaignStart)}
                                                        </p>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            {(() => {
                                                                const campaignDays = getDaysUntil(opportunity.aiInsights.recommendedCampaignStart);
                                                                const eventDays = getDaysUntil(opportunity.startDate);

                                                                if (campaignDays < 0) {
                                                                    // Campaign should have started, show urgency based on event date
                                                                    if (eventDays <= 14) {
                                                                        return <span className="text-red-600 font-medium">🚨 Urgent! Only {eventDays} days until event</span>;
                                                                    } else if (eventDays <= 30) {
                                                                        return <span className="text-orange-600 font-medium">⚡ Start now! {eventDays} days until event</span>;
                                                                    } else {
                                                                        return <span className="text-amber-600 font-medium">Start soon! {eventDays} days until event</span>;
                                                                    }
                                                                } else if (campaignDays === 0) {
                                                                    return <span className="text-green-600 font-medium">✓ Ideal time to start!</span>;
                                                                } else if (campaignDays <= 7) {
                                                                    return <span className="text-blue-600 font-medium">Start in {campaignDays} days</span>;
                                                                } else {
                                                                    return `Recommended: Start in ${campaignDays} days`;
                                                                }
                                                            })()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Insights Expandable Section */}
                                    {opportunity.aiInsights && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() =>
                                                    setSelectedOpportunity(
                                                        selectedOpportunity?._id === opportunity._id ? null : opportunity
                                                    )
                                                }
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                <Lightbulb className="h-5 w-5" />
                                                {selectedOpportunity?._id === opportunity._id
                                                    ? 'Hide AI Insights'
                                                    : 'View AI Insights & Recommendations'}
                                            </button>

                                            {selectedOpportunity?._id === opportunity._id && (
                                                <div className="mt-4 space-y-4">
                                                    {/* Target Audience */}
                                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                                            <Users className="h-5 w-5" />
                                                            Target Audience
                                                        </h4>
                                                        <p className="text-purple-800">{opportunity.aiInsights.targetAudience}</p>
                                                    </div>

                                                    {/* Pricing Strategy */}
                                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                                            <DollarSign className="h-5 w-5" />
                                                            Pricing Strategy
                                                        </h4>
                                                        <p className="text-green-800">{opportunity.aiInsights.pricingStrategy}</p>
                                                    </div>

                                                    {/* Suggested Actions */}
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                                            <CheckCircle2 className="h-5 w-5" />
                                                            Recommended Actions
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {opportunity.aiInsights.suggestedActions.map((action, index) => (
                                                                <li key={index} className="flex items-start gap-2 text-blue-800">
                                                                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                                                                    <span>{action}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RevenueOpportunitiesPage;
