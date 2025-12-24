import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Users,
  MessageSquare,
  RefreshCw,
  Building2,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import AIMasterButton from "@/components/common/AIMasterButton";
import DisconnectButton from "@/components/common/DisconnectButton";
import ConnectGooglePlaces from "@/components/projects/ConnectGooglePlaces";
import api from "@/lib/api";
import type { Project } from "@/types";

interface PhotoCardProps {
  photo: any;
  index: number;
}

const PhotoCard = ({ photo, index }: PhotoCardProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(false);
        setErrorMessage('');

        // Encode the photo name for URL
        const encodedPhotoName = encodeURIComponent(photo.name);
        console.log(`[PhotoCard] Fetching photo ${index + 1}:`, photo.name);

        const { data } = await api.get(`/google-places/photo/${encodedPhotoName}?maxWidth=800`);

        if (data.success && data.data.photoDataUrl) {
          setPhotoUrl(data.data.photoDataUrl);
          console.log(`[PhotoCard] Successfully loaded photo ${index + 1}`);
        } else {
          console.error(`[PhotoCard] Photo ${index + 1} failed: No data URL in response`);
          setError(true);
          setErrorMessage('No image data');
        }
      } catch (err: any) {
        console.error(`[PhotoCard] Failed to load photo ${index + 1}:`, err);
        console.error(`[PhotoCard] Error details:`, {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(true);
        setErrorMessage(err.response?.data?.error || err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (photo?.name) {
      void fetchPhoto();
    } else {
      console.error('[PhotoCard] No photo name provided:', photo);
      setError(true);
      setErrorMessage('Invalid photo');
      setLoading(false);
    }
  }, [photo, index]);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
          <div className="text-sm mb-1">No Image</div>
          {errorMessage && <div className="text-xs opacity-70">{errorMessage}</div>}
        </div>
      )}
      {photoUrl && !error && (
        <img
          src={photoUrl}
          alt={`Hotel photo ${index + 1}`}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-pointer"
          onClick={() => {
            // Open in new tab
            const win = window.open();
            if (win) {
              win.document.write(`<img src="${photoUrl}" style="max-width:100%; height:auto;" />`);
            }
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
    </div>
  );
};

interface PlaceData {
  savedData?: {
    displayName?: string;
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
    websiteUri?: string;
    phoneNumber?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    lastUpdated?: string;
  };
  currentData?: {
    placeId: string;
    displayName: string;
    formattedAddress: string;
    rating?: number;
    userRatingCount?: number;
    websiteUri?: string;
    internationalPhoneNumber?: string;
    nationalPhoneNumber?: string;
    businessStatus?: string;
    currentOpeningHours?: any;
    reviews?: any[];
    photos?: any[];
  };
}

const GooglePlacesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showReconnectModal, setShowReconnectModal] = useState(false);

  // Fetch project
  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoadingProject(true);
      setProjectError(null);
      const { data } = await api.get<{ success: boolean; data: Project }>(`/projects/${projectId}`);
      if (data.success) {
        setProject(data.data);
      }
    } catch (err: any) {
      setProjectError(err.response?.data?.error || "Failed to load project");
    } finally {
      setLoadingProject(false);
    }
  }, [projectId]);

  // Fetch place data
  const fetchPlaceData = useCallback(async () => {
    if (!projectId || !project?.googlePlacesId) return;

    try {
      setLoadingData(true);
      setDataError(null);
      const { data } = await api.get<{ success: boolean; data: PlaceData }>(
        `/google-places/projects/${projectId}/place`
      );
      if (data.success) {
        setPlaceData(data.data);
      }
    } catch (err: any) {
      setDataError(err.response?.data?.error || "Failed to load place data");
    } finally {
      setLoadingData(false);
    }
  }, [projectId, project?.googlePlacesId]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.googlePlacesId) {
      void fetchPlaceData();
    }
  }, [fetchPlaceData, project?.googlePlacesId]);

  const handleConnectSuccess = () => {
    setShowConnectModal(false);
    void fetchProject();
  };

  const handleReconnectSuccess = () => {
    setShowReconnectModal(false);
    void fetchProject();
  };

  if (loadingProject) {
    return <LoadingState message="Loading project..." className="py-16" />;
  }

  if (projectError || !project) {
    return <ErrorState description={projectError || "Project not found"} className="py-16" />;
  }

  // Not connected state
  if (!project.googlePlacesId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Google Places</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">
          Search and connect your hotel from Google Places to import reviews, ratings, and location data.
        </p>
        <Button onClick={() => setShowConnectModal(true)} size="lg">
          <MapPin className="mr-2 h-4 w-4" />
          Connect Google Places
        </Button>

        {showConnectModal && (
          <ConnectGooglePlaces
            projectId={projectId!}
            onSuccess={handleConnectSuccess}
            onClose={() => setShowConnectModal(false)}
          />
        )}
      </div>
    );
  }

  const currentData = placeData?.currentData;
  const savedData = placeData?.savedData || project.googlePlacesData;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Location</h1>
          <p className="text-slate-600 mt-1">Hotel Information</p>
        </div>
        <div className="flex items-center gap-2">
          <AIMasterButton />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReconnectModal(true)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reconnect
          </Button>
          <DisconnectButton
            service="google-places"
            projectId={projectId || ''}
            onDisconnectSuccess={fetchProject}
          />
          <Button onClick={() => fetchPlaceData()} disabled={loadingData} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {dataError && <ErrorState description={dataError} onRetry={fetchPlaceData} />}

      {loadingData ? (
        <LoadingState message="Loading place data..." />
      ) : (
        <>
          {/* Hotel Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    {currentData?.displayName || savedData?.displayName || "Hotel Name"}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {currentData?.formattedAddress || savedData?.formattedAddress || "Address not available"}
                  </CardDescription>
                </div>
                {currentData?.businessStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${currentData.businessStatus === "OPERATIONAL"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {currentData.businessStatus}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating */}
                {(currentData?.rating || savedData?.rating) && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-amber-600 fill-current" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {(currentData?.rating || savedData?.rating)?.toFixed(1)}
                      </p>
                      <p className="text-sm text-slate-600">Average Rating</p>
                    </div>
                  </div>
                )}

                {/* Reviews Count */}
                {(currentData?.userRatingCount || savedData?.userRatingCount) && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {(currentData?.userRatingCount || savedData?.userRatingCount)?.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600">Total Reviews</p>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {currentData?.reviews && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{currentData.reviews.length}</p>
                      <p className="text-sm text-slate-600">Recent Reviews</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentData?.websiteUri || savedData?.websiteUri) && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <a
                      href={currentData?.websiteUri || savedData?.websiteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {currentData?.websiteUri || savedData?.websiteUri}
                    </a>
                  </div>
                )}
                {(currentData?.internationalPhoneNumber ||
                  currentData?.nationalPhoneNumber ||
                  savedData?.phoneNumber) && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-slate-500" />
                      <span className="text-slate-700">
                        {currentData?.internationalPhoneNumber ||
                          currentData?.nationalPhoneNumber ||
                          savedData?.phoneNumber}
                      </span>
                    </div>
                  )}
                {savedData?.location && (
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-slate-500" />
                    <a
                      href={`https://www.google.com/maps?q=${savedData.location.latitude},${savedData.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hotel Photos */}
          {currentData?.photos && currentData.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Hotel Photos</CardTitle>
                <CardDescription>Photos from Google Places</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentData.photos.slice(0, 12).map((photo: any, index: number) => (
                    <PhotoCard key={index} photo={photo} index={index} />
                  ))}
                </div>
                {currentData.photos.length > 12 && (
                  <p className="text-sm text-slate-600 text-center mt-4">
                    +{currentData.photos.length - 12} more photos available
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Reviews */}
          {currentData?.reviews && currentData.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest reviews from Google</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.reviews.slice(0, 5).map((review: any, index: number) => (
                    <div key={index} className="border-b border-slate-200 pb-4 last:border-0">
                      <div className="flex items-start gap-3 mb-2">
                        {review.authorAttribution?.photoUri ? (
                          <img
                            src={review.authorAttribution.photoUri}
                            alt={review.authorAttribution.displayName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 ${review.authorAttribution?.photoUri ? 'hidden' : ''
                            }`}
                        >
                          {(review.authorAttribution?.displayName || 'A')
                            .split(' ')
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">
                            {review.authorAttribution?.displayName || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? "text-amber-500 fill-current" : "text-slate-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">
                              {review.relativePublishTimeDescription}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.text?.text && (
                        <p className="text-sm text-slate-700 leading-relaxed ml-13">{review.text.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Reconnect Modal */}
      {showReconnectModal && (
        <ConnectGooglePlaces
          projectId={projectId!}
          onSuccess={handleReconnectSuccess}
          onClose={() => setShowReconnectModal(false)}
        />
      )}
    </div>
  );
};

export default GooglePlacesPage;
