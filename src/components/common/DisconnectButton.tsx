import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Unplug,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import api from "@/lib/api";

interface DisconnectButtonProps {
  service: 'google-analytics' | 'google-ads' | 'google-search-console' | 'youtube' | 'facebook' | 'instagram' | 'meta-ads' | 'linkedin' | 'google-sheets' | 'google-drive' | 'google-places';
  projectId: string;
  onDisconnectSuccess?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const SERVICE_CONFIG: Record<string, {
  name: string;
  disconnectEndpoint: string;
  fieldToRemove: string;
  gradient: string;
  iconBg: string;
  icon: string;
  description: string;
}> = {
  'google-analytics': {
    name: 'Google Analytics',
    disconnectEndpoint: '/google/disconnect',
    fieldToRemove: 'gaPropertyId',
    gradient: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100',
    icon: '📊',
    description: 'This will remove your Analytics connection',
  },
  'google-ads': {
    name: 'Google Ads',
    disconnectEndpoint: '/google-ads/disconnect',
    fieldToRemove: 'googleAdsCustomerId',
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-100',
    icon: '💰',
    description: 'This will remove your Ads connection',
  },
  'google-search-console': {
    name: 'Search Console',
    disconnectEndpoint: '/gsc/disconnect',
    fieldToRemove: 'searchConsoleSiteUrl',
    gradient: 'from-green-500 to-emerald-500',
    iconBg: 'bg-green-100',
    icon: '🔍',
    description: 'This will remove your Search Console connection',
  },
  'youtube': {
    name: 'YouTube',
    disconnectEndpoint: '/youtube/disconnect',
    fieldToRemove: 'youtubeChannelId',
    gradient: 'from-red-500 to-rose-500',
    iconBg: 'bg-red-100',
    icon: '▶️',
    description: 'This will remove your YouTube connection',
  },
  'facebook': {
    name: 'Facebook',
    disconnectEndpoint: '/facebook/disconnect',
    fieldToRemove: 'facebookPageId',
    gradient: 'from-blue-600 to-indigo-600',
    iconBg: 'bg-blue-100',
    icon: '👥',
    description: 'This will remove your Facebook Page connection',
  },
  'instagram': {
    name: 'Instagram',
    disconnectEndpoint: '/instagram/disconnect',
    fieldToRemove: 'instagram',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    iconBg: 'bg-pink-100',
    icon: '📸',
    description: 'This will remove your Instagram connection',
  },
  'meta-ads': {
    name: 'Meta Ads',
    disconnectEndpoint: '/meta-ads/disconnect',
    fieldToRemove: 'metaAdsAccountId',
    gradient: 'from-blue-500 to-purple-600',
    iconBg: 'bg-indigo-100',
    icon: '📢',
    description: 'This will remove your Meta Ads connection',
  },
  'linkedin': {
    name: 'LinkedIn',
    disconnectEndpoint: '/linkedin/disconnect',
    fieldToRemove: 'linkedinPageId',
    gradient: 'from-sky-600 to-blue-700',
    iconBg: 'bg-sky-100',
    icon: '💼',
    description: 'This will remove your LinkedIn connection',
  },
  'google-sheets': {
    name: 'Google Sheets',
    disconnectEndpoint: '/google-sheets/disconnect',
    fieldToRemove: 'googleSheetsSpreadsheetId',
    gradient: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-100',
    icon: '📊',
    description: 'This will remove your Google Sheets connection',
  },
  'google-drive': {
    name: 'Google Drive',
    disconnectEndpoint: '/google-drive/disconnect',
    fieldToRemove: 'googleDriveFolderId',
    gradient: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    icon: '💾',
    description: 'This will remove your Google Drive connection',
  },
  'google-places': {
    name: 'Google Places',
    disconnectEndpoint: '/google-places/disconnect',
    fieldToRemove: 'googlePlacesId',
    gradient: 'from-red-500 to-orange-500',
    iconBg: 'bg-red-100',
    icon: '📍',
    description: 'This will remove your Google Places connection',
  },
};

type Step = 'confirm' | 'processing' | 'success' | 'error';

const DisconnectButton = ({
  service,
  projectId,
  onDisconnectSuccess,
  variant = 'outline',
  size = 'sm',
  className = '',
}: DisconnectButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState<Step>('confirm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = SERVICE_CONFIG[service];

  // Reset state when dialog closes
  const handleClose = () => {
    if (!loading || step === 'error') {
      setShowDialog(false);
      setTimeout(() => {
        setStep('confirm');
        setError(null);
      }, 300);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      await api.post(config.disconnectEndpoint, { projectId });

      setStep('success');
      setTimeout(() => {
        setShowDialog(false);
        onDisconnectSuccess?.();
      }, 1500);
    } catch (err: any) {
      console.error(`[DisconnectButton] Error:`, err);
      setError(err.response?.data?.error || err.message || 'Failed to disconnect service');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowDialog(true)}
        className={className}
      >
        <Unplug className="h-4 w-4 mr-2" />
        Disconnect
      </Button>

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Header */}
            <div className={`relative bg-gradient-to-br ${config.gradient} p-6 text-white`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <button
                onClick={handleClose}
                disabled={loading && step !== 'error'}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative flex items-center gap-4">
                <motion.div
                  className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {config.icon}
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Disconnect {config.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              {/* Step: Confirm */}
              {step === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900">Are you sure?</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Disconnecting will remove all {config.name} data and settings from this project. You can reconnect anytime.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-medium">This action will:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Remove the connection to your {config.name} account</li>
                      <li>Stop syncing data from {config.name}</li>
                      <li>Clear stored credentials for this service</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDisconnect}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Disconnecting...
                        </>
                      ) : (
                        <>
                          <Unplug className="h-4 w-4 mr-2" />
                          Disconnect
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step: Processing */}
              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 py-8 text-center"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto" />
                  <div>
                    <p className="font-medium text-slate-700">Disconnecting...</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Please wait while we remove the connection
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step: Success */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mt-4">
                    Successfully Disconnected!
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Your {config.name} has been disconnected.
                  </p>
                </motion.div>
              )}

              {/* Step: Error */}
              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Failed to disconnect</h4>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setError(null);
                        setStep('confirm');
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisconnectButton;
