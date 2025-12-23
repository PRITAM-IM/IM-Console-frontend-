import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    LayoutDashboard,
    Plus,
    Globe,
    Calendar,
    ExternalLink,
    Search,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import api from "@/lib/api";
import type { Project } from "@/types";

const AllProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
        isOpen: false,
        project: null,
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<{ success: boolean; data: Project[] }>("/projects");
            const projectsData = response.data.data || response.data;
            setProjects(Array.isArray(projectsData) ? projectsData : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = (project: Project) => {
        setDeleteModal({ isOpen: true, project });
    };

    const confirmDeleteProject = async () => {
        if (!deleteModal.project) return;

        const projectId = deleteModal.project.id || deleteModal.project._id;
        const projectName = deleteModal.project.name;

        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(projects.filter(p => (p.id || p._id) !== projectId));
            setDeleteModal({ isOpen: false, project: null });

            // Show success toast
            toast.success("Project deleted successfully!", {
                description: `"${projectName}" has been permanently removed from your account.`,
                duration: 5000,
            });
        } catch (err) {
            toast.error("Failed to delete project", {
                description: err instanceof Error ? err.message : "Please try again later.",
                duration: 5000,
            });
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingState message="Loading projects..." className="py-16" />;
    }

    if (error) {
        return <ErrorState description={error} onRetry={fetchProjects} className="py-16" />;
    }

    return (
        <motion.section
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/25">
                        <LayoutDashboard className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">All Projects</h1>
                        <p className="text-sm text-slate-500">
                            Manage and view all your projects ({projects.length})
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate("/projects/new")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </div>

            {/* Search Bar */}
            <Card className="bg-white border-slate-200">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search projects by name or URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 text-base"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <Card className="bg-white border-2 border-dashed border-slate-200">
                    <CardContent className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <LayoutDashboard className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {searchQuery ? "No projects found" : "No projects yet"}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {searchQuery
                                ? "Try adjusting your search query"
                                : "Create your first project to get started"}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => navigate("/projects/new")}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Project
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project, index) => {
                        const projectId = project.id || project._id;
                        const connectedServices = [
                            project.gaPropertyId && "Analytics",
                            project.googleAdsCustomerId && "Google Ads",
                            project.searchConsoleSiteUrl && "Search Console",
                            project.youtubeChannelId && "YouTube",
                            project.facebookPageId && "Facebook",
                            project.metaAdsAccountId && "Meta Ads",
                            project.instagram?.igUserId && "Instagram",
                            project.linkedinPageId && "LinkedIn",
                            project.googleSheetId && "Sheets",
                            project.googleDriveFolderId && "Drive",
                            project.googlePlacesId && "Places",
                        ].filter(Boolean);

                        return (
                            <motion.div
                                key={projectId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-white border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 group">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg text-slate-900 truncate group-hover:text-red-600 transition-colors">
                                                    {project.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1.5 mt-1">
                                                    <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">{project.websiteUrl}</span>
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/projects/edit/${projectId}`)}
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteProject(project)}
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Connected Services */}
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                                Connected Services ({connectedServices.length})
                                            </p>
                                            {connectedServices.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {connectedServices.slice(0, 6).map((service) => (
                                                        <span
                                                            key={service}
                                                            className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200"
                                                        >
                                                            {service}
                                                        </span>
                                                    ))}
                                                    {connectedServices.length > 6 && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                                                            +{connectedServices.length - 6} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400">No services connected</p>
                                            )}
                                        </div>

                                        {/* Created Date */}
                                        {project.createdAt && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                                            <Button
                                                onClick={() => navigate(`/dashboard/${projectId}`)}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                                size="sm"
                                            >
                                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                                Open Dashboard
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(project.websiteUrl, "_blank")}
                                                className="border-slate-300 hover:border-red-400 hover:bg-red-50"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Delete Project Modal */}
            <DeleteProjectModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, project: null })}
                onConfirm={confirmDeleteProject}
                projectName={deleteModal.project?.name || ""}
            />
        </motion.section>
    );
};

export default AllProjectsPage;
