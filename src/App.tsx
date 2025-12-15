import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "@/routes/ProtectedRoute";
import GuestRoute from "@/routes/GuestRoute";
import AppLayout from "@/components/layout/AppLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FullScreenLayout from "@/components/layout/FullScreenLayout";
import LandingLayout from "@/components/layout/LandingLayout";
import HomePage from "@/pages/HomePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import GoogleCallbackPage from "@/pages/GoogleCallbackPage";
import GoogleAnalyticsCallbackPage from "@/pages/GoogleAnalyticsCallbackPage";
import GoogleAdsCallbackPage from "@/pages/GoogleAdsCallbackPage";
import GoogleSearchConsoleCallbackPage from "@/pages/GoogleSearchConsoleCallbackPage";
import YouTubeCallbackPage from "@/pages/YouTubeCallbackPage";
import FacebookCallbackPage from "@/pages/FacebookCallbackPage";
import MetaAdsCallbackPage from "@/pages/MetaAdsCallbackPage";
import GoogleSheetsCallbackPage from "@/pages/GoogleSheetsCallbackPage";
import GoogleDriveCallbackPage from "@/pages/GoogleDriveCallbackPage";
import GoogleBusinessProfileCallbackPage from "@/pages/GoogleBusinessProfileCallbackPage";
import LinkedInCallbackPage from "@/pages/LinkedInCallbackPage";
import NewProjectPage from "@/pages/NewProjectPage";
import DashboardOverviewPage from "@/pages/DashboardOverviewPage";
import GoogleAnalyticsPage from "@/pages/GoogleAnalyticsPage";
import GoogleAdsPage from "@/pages/GoogleAdsPage";
import GoogleSearchConsolePage from "@/pages/GoogleSearchConsolePage";
import YouTubePage from "@/pages/YouTubePage";
import FacebookPage from "@/pages/FacebookPage";
import MetaAdsPage from "@/pages/MetaAdsPage";
import InstagramPage from "@/pages/InstagramPage";
import GoogleSheetsPage from "@/pages/GoogleSheetsPage";
import GoogleDrivePage from "@/pages/GoogleDrivePage";
import LinkedInPage from "@/pages/LinkedInPage";
import GooglePlacesPage from "@/pages/GooglePlacesPage";
import TemplatesPage from "@/pages/TemplatesPage";
import TemplateBuilderPage from "@/pages/TemplateBuilderPage";
import AIMasterPage from "@/pages/AIMasterPage";
import DashboardIndex from "@/pages/DashboardIndex";
import NotFoundPage from "@/pages/NotFoundPage";
import LoadingState from "@/components/common/LoadingState";



const App = () => (
  <>
    <Toaster position="top-right" richColors closeButton />
    <Suspense fallback={<LoadingState message="Loading hotel analytics..." className="py-16" />}>
      <Routes>
        {/* Public Pages */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/auth/google-analytics/callback" element={<GoogleAnalyticsCallbackPage />} />
        <Route path="/auth/google-ads/callback" element={<GoogleAdsCallbackPage />} />
        <Route path="/auth/google-search-console/callback" element={<GoogleSearchConsoleCallbackPage />} />
        <Route path="/auth/youtube/callback" element={<YouTubeCallbackPage />} />
        <Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />
        <Route path="/auth/meta-ads/callback" element={<MetaAdsCallbackPage />} />
        <Route path="/auth/google-sheets/callback" element={<GoogleSheetsCallbackPage />} />
        <Route path="/auth/google-drive/callback" element={<GoogleDriveCallbackPage />} />
        <Route path="/auth/google-business-profile/callback" element={<GoogleBusinessProfileCallbackPage />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/projects/new" element={<NewProjectPage />} />
          </Route>

          {/* Full Screen Layout for Template Pages */}
          <Route element={<FullScreenLayout />}>
            <Route path="/dashboard/:projectId/templates" element={<TemplatesPage />} />
            <Route path="/dashboard/:projectId/templates/new" element={<TemplateBuilderPage />} />
            <Route path="/dashboard/:projectId/templates/:templateId" element={<TemplateBuilderPage />} />
            <Route path="/dashboard/:projectId/ai-master" element={<AIMasterPage />} />
          </Route>

          {/* Dashboard Layout for Regular Pages */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardIndex />} />
            <Route path="/dashboard/:projectId" element={<DashboardOverviewPage />} />
            <Route path="/dashboard/:projectId/analytics" element={<GoogleAnalyticsPage />} />
            <Route path="/dashboard/:projectId/ads" element={<GoogleAdsPage />} />
            <Route path="/dashboard/:projectId/search-console" element={<GoogleSearchConsolePage />} />
            <Route path="/dashboard/:projectId/youtube" element={<YouTubePage />} />
            <Route path="/dashboard/:projectId/facebook" element={<FacebookPage />} />
            <Route path="/dashboard/:projectId/meta-ads" element={<MetaAdsPage />} />
            <Route path="/dashboard/:projectId/instagram" element={<InstagramPage />} />
            <Route path="/dashboard/:projectId/sheets" element={<GoogleSheetsPage />} />
            <Route path="/dashboard/:projectId/drive" element={<GoogleDrivePage />} />
            <Route path="/dashboard/:projectId/linkedin" element={<LinkedInPage />} />
            <Route path="/dashboard/:projectId/places" element={<GooglePlacesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </>
);

export default App;
