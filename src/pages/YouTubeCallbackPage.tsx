import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

const YouTubeCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const youtubeConnected = urlParams.get("youtube_connected");
      const errorParam = urlParams.get("error");

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        if (window.opener) {
          window.opener.postMessage(
            { type: "YOUTUBE_OAUTH_ERROR", error: decodeURIComponent(errorParam) },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
        return;
      }

      if (!youtubeConnected) {
        setError("Missing connection confirmation");
        if (window.opener) {
          window.opener.postMessage(
            { type: "YOUTUBE_OAUTH_ERROR", error: "Missing connection confirmation" },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
        return;
      }

      // Connection was successful (backend already saved it)
      const projectId = youtubeConnected;
      
      // Send success message to parent window
      if (window.opener) {
        window.opener.postMessage(
          { type: "YOUTUBE_OAUTH_SUCCESS", projectId },
          window.location.origin
        );
        window.close();
      } else {
        // If no opener (direct navigation), redirect to dashboard
        navigate(`/dashboard/${projectId}/youtube?youtube_connected=true`);
      }
    };

    void handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hotel-foam via-white to-slate-50">
        <div className="max-w-md">
          <ErrorState 
            description={error}
            onRetry={() => window.close()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hotel-foam via-white to-slate-50">
      <LoadingState message="Completing YouTube connection..." />
    </div>
  );
};

export default YouTubeCallbackPage;


