import { useState } from "react";
import { X, Search, Loader2, CheckCircle2, MapPin, Star, Phone, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import ErrorState from "@/components/common/ErrorState";
import api from "@/lib/api";

interface PlaceSearchResult {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface PlaceDetails {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  businessStatus?: string;
  priceLevel?: string;
  reviews?: any[];
  photos?: any[];
}

interface ConnectGooglePlacesProps {
  projectId: string;
  onSuccess: () => void;
  onClose: () => void;
}

type Step = "search" | "select" | "confirm" | "success";

const ConnectGooglePlaces = ({ projectId, onSuccess, onClose }: ConnectGooglePlacesProps) => {
  const [step, setStep] = useState<Step>("search");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a hotel name or location");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<{ success: boolean; data: PlaceSearchResult[] }>(
        `/google-places/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (data.success) {
        setSearchResults(data.data);
        setStep("select");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to search places";

      // Check if it's an API not enabled error
      if (errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("has not been used")) {
        setError(
          "Google Places API is not enabled. Please enable 'Places API (New)' in Google Cloud Console and wait a few minutes for it to propagate."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle place selection
  const handleSelectPlace = async (place: PlaceSearchResult) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPlace(place);

      // Fetch detailed information
      const { data } = await api.get<{ success: boolean; data: PlaceDetails }>(
        `/google-places/details/${place.placeId}`
      );

      if (data.success) {
        setPlaceDetails(data.data);
        setStep("confirm");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch place details");
    } finally {
      setLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!selectedPlace) return;

    try {
      setLoading(true);
      setError(null);

      await api.post(`/google-places/projects/${projectId}/place`, {
        placeId: selectedPlace.placeId,
      });

      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save place data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Add Hotel via Google Places</CardTitle>
            <CardDescription>
              Search for your hotel and import reviews, ratings, and details
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Step 1: Search */}
          {step === "search" && (
            <div className="space-y-4">
              {error && <ErrorState description={error} />}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter hotel name, location, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Try searching with specific details like "Grand Hotel New York" or "Hilton San Francisco"
                </p>
                <p className="text-xs text-blue-600">
                  <strong>Note:</strong> Make sure you have enabled "Places API (New)" in your Google Cloud Console with your API key.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Select Place */}
          {step === "select" && (
            <div className="space-y-4">
              {error && <ErrorState description={error} />}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Results</h3>
                <Button variant="outline" size="sm" onClick={() => setStep("search")}>
                  New Search
                </Button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No results found. Try a different search.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.map((place) => (
                    <Card
                      key={place.placeId}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleSelectPlace(place)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate">
                              {place.displayName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{place.formattedAddress}</span>
                            </div>
                            {place.rating && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="font-semibold">{place.rating.toFixed(1)}</span>
                                </div>
                                {place.userRatingCount && (
                                  <span className="text-xs text-slate-500">
                                    ({place.userRatingCount.toLocaleString()} reviews)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm Details */}
          {step === "confirm" && placeDetails && (
            <div className="space-y-4">
              {error && <ErrorState description={error} />}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Confirm Hotel Details</h3>
                <Button variant="outline" size="sm" onClick={() => setStep("select")}>
                  Back to Results
                </Button>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {placeDetails.displayName}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{placeDetails.formattedAddress}</span>
                  </div>
                </div>

                {placeDetails.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="text-xl font-bold">{placeDetails.rating.toFixed(1)}</span>
                    </div>
                    {placeDetails.userRatingCount && (
                      <span className="text-slate-600">
                        Based on {placeDetails.userRatingCount.toLocaleString()} reviews
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {placeDetails.websiteUri && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <a
                        href={placeDetails.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {placeDetails.websiteUri}
                      </a>
                    </div>
                  )}
                  {placeDetails.internationalPhoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-700">{placeDetails.internationalPhoneNumber}</span>
                    </div>
                  )}
                </div>

                {placeDetails.reviews && placeDetails.reviews.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Recent Reviews</h4>
                    <p className="text-sm text-slate-600">
                      {placeDetails.reviews.length} reviews will be imported
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Hotel Data"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Successfully Connected!</h3>
              <p className="text-sm text-slate-600">
                Hotel data from Google Places has been imported
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectGooglePlaces;
