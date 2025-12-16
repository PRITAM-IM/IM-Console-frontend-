import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HardDrive, Folder, FileText, Image, Video, Music, Archive, ExternalLink, RefreshCw, ChevronRight, ArrowLeft, Home } from "lucide-react";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ReconnectButton from "@/components/common/ReconnectButton";
import DisconnectButton from "@/components/common/DisconnectButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectGoogleDrive from "@/components/projects/ConnectGoogleDrive";
import api from "@/lib/api";
import type { Project, GoogleDriveStats, GoogleDriveFile } from "@/types";

interface DriveFolder {
  id: string;
  name: string;
  webViewLink?: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("folder")) return Folder;
  if (mimeType.includes("image")) return Image;
  if (mimeType.includes("video")) return Video;
  if (mimeType.includes("audio")) return Music;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive;
  return FileText;
};

const formatBytes = (bytes: string | number) => {
  const b = typeof bytes === "string" ? parseInt(bytes) : bytes;
  if (b === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const GoogleDrivePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [driveStats, setDriveStats] = useState<GoogleDriveStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolders, setCurrentFolders] = useState<DriveFolder[]>([]);
  const [currentFiles, setCurrentFiles] = useState<GoogleDriveFile[]>([]);
  const [loadingContents, setLoadingContents] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoadingProject(true);
      const response = await api.get<{ success: boolean; data: Project }>(`/projects/${projectId}`);
      const proj = response.data.data || response.data;
      setProject(proj as Project);
      setProjectError(null);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "Project not found.");
    } finally {
      setLoadingProject(false);
    }
  }, [projectId]);

  const fetchDriveStats = useCallback(async () => {
    if (!projectId || !project?.googleDriveFolderId) return;
    try {
      setLoadingStats(true);
      const response = await api.get<{ success: boolean; data: GoogleDriveStats }>(
        `/google-drive/${projectId}/stats`
      );
      setDriveStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch drive stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [projectId, project?.googleDriveFolderId]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.googleDriveFolderId) {
      void fetchDriveStats();
      // Initialize with root folder
      setCurrentFolderId(project.googleDriveFolderId);
      setBreadcrumbs([{ id: project.googleDriveFolderId, name: "Root" }]);
    }
  }, [fetchDriveStats, project?.googleDriveFolderId]);
  
  // Fetch folder contents when currentFolderId changes
  useEffect(() => {
    if (currentFolderId && projectId) {
      void fetchFolderContents(currentFolderId);
    }
  }, [currentFolderId, projectId]);
  
  const fetchFolderContents = async (folderId: string) => {
    if (!projectId) return;
    
    try {
      setLoadingContents(true);
      const response = await api.get<{ 
        success: boolean; 
        data: { folders: DriveFolder[]; files: GoogleDriveFile[] } 
      }>(`/google-drive/${projectId}/folder/${folderId}/contents`);
      
      setCurrentFolders(response.data.data.folders);
      setCurrentFiles(response.data.data.files);
    } catch (error) {
      console.error("Failed to fetch folder contents:", error);
      setCurrentFolders([]);
      setCurrentFiles([]);
    } finally {
      setLoadingContents(false);
    }
  };
  
  const navigateToFolder = (folder: DriveFolder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };
  
  const navigateToBreadcrumb = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };
  
  const navigateBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    }
  };

  const handleConnectSuccess = () => {
    setShowConnectModal(false);
    void fetchProject();
  };

  if (loadingProject) {
    return <LoadingState message="Loading project..." />;
  }

  if (projectError) {
    return <ErrorState description={projectError} onRetry={fetchProject} />;
  }

  if (!project?.googleDriveFolderId) {
    return (
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Google Drive</h1>
          <p className="text-sm text-slate-500">Connect a folder to your project</p>
        </div>

        <Card className="bg-white border-2 border-dashed border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <HardDrive className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Connect Google Drive</CardTitle>
                <CardDescription className="text-slate-500">
                  Link a folder to view and manage your files.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowConnectModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <HardDrive className="mr-2 h-4 w-4" />
              Connect Drive Folder
            </Button>
          </CardContent>
        </Card>

        {showConnectModal && (
          <ConnectGoogleDrive
            projectId={projectId!}
            onSuccess={handleConnectSuccess}
            onClose={() => setShowConnectModal(false)}
          />
        )}
      </section>
    );
  }

  const usagePercent = driveStats?.storageQuota
    ? (parseInt(driveStats.storageQuota.usage) / parseInt(driveStats.storageQuota.limit)) * 100
    : 0;

  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <HardDrive className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Google Drive</h1>
            <p className="text-sm text-slate-500">Connected folder data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReconnectButton
            service="google-drive"
            projectId={projectId || ''}
            onReconnectSuccess={() => window.location.reload()}
            variant="outline"
          />
          <DisconnectButton
            service="google-drive"
            projectId={projectId || ''}
            onDisconnectSuccess={() => window.location.reload()}
            variant="outline"
          />
          <Button variant="outline" onClick={fetchDriveStats} disabled={loadingStats}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingStats ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loadingStats ? (
        <LoadingState message="Loading drive stats..." />
      ) : driveStats ? (
        <div className="space-y-6">
          {/* Storage Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-100">Total Files</p>
                <p className="text-3xl font-bold">{driveStats.totalFiles}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-100">Total Folders</p>
                <p className="text-3xl font-bold">{driveStats.totalFolders}</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500">Storage Used</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatBytes(driveStats.storageQuota.usage)}
                </p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  of {formatBytes(driveStats.storageQuota.limit)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Folder Browser */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Browse Files & Folders</CardTitle>
                  <CardDescription className="text-slate-500">
                    Navigate through your Google Drive folders
                  </CardDescription>
                </div>
                {breadcrumbs.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
            </CardHeader>
            
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-sm overflow-x-auto">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.id} className="flex items-center gap-2 flex-shrink-0">
                      {index === 0 ? (
                        <button
                          onClick={() => navigateToBreadcrumb(index)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Home className="h-4 w-4" />
                          {crumb.name}
                        </button>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                          <button
                            onClick={() => navigateToBreadcrumb(index)}
                            className={`${
                              index === breadcrumbs.length - 1
                                ? "text-slate-900 font-medium"
                                : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            {crumb.name}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <CardContent className="pt-6">
              {loadingContents ? (
                <div className="py-12">
                  <LoadingState message="Loading folder contents..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Folders */}
                  {currentFolders.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Folders ({currentFolders.length})
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {currentFolders.map((folder) => (
                          <button
                            key={folder.id}
                            onClick={() => navigateToFolder(folder)}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                              <Folder className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate group-hover:text-blue-700">
                                {folder.name}
                              </p>
                              <p className="text-xs text-slate-500">Folder</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Files */}
                  {currentFiles.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Files ({currentFiles.length})
                      </p>
                      <div className="divide-y divide-slate-100">
                        {currentFiles.map((file) => {
                          const Icon = getFileIcon(file.mimeType);
                          return (
                            <div key={file.id} className="py-3 flex items-center gap-4 hover:bg-slate-50 -mx-3 px-3 rounded-lg transition-colors">
                              <div className="p-2 bg-slate-100 rounded-lg">
                                {file.thumbnailLink ? (
                                  <img
                                    src={file.thumbnailLink}
                                    alt={file.name}
                                    className="h-10 w-10 object-cover rounded"
                                  />
                                ) : (
                                  <Icon className="h-5 w-5 text-slate-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">
                                  {file.modifiedTime && new Date(file.modifiedTime).toLocaleDateString()}
                                  {file.size && ` • ${formatBytes(file.size)}`}
                                </p>
                              </div>
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {currentFolders.length === 0 && currentFiles.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                        <Folder className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">This folder is empty</p>
                      <p className="text-sm text-slate-500 mt-1">No files or subfolders found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Folder ID */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Connected Folder ID</p>
                  <p className="font-mono text-sm text-slate-900">{project.googleDriveFolderId}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowConnectModal(true)}>
                  Change Folder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-white">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Unable to load drive stats.</p>
            <Button variant="outline" className="mt-4" onClick={fetchDriveStats}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {showConnectModal && (
        <ConnectGoogleDrive
          projectId={projectId!}
          onSuccess={handleConnectSuccess}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </motion.section>
  );
};

export default GoogleDrivePage;





