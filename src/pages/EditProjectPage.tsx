import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import api from "@/lib/api";
import type { Project } from "@/types";

const projectSchema = z.object({
    name: z.string().min(2, "Project name is required"),
    websiteUrl: z.string().url("Enter a valid URL (https://example.com)"),
});

type ProjectForm = z.infer<typeof projectSchema>;

const EditProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProjectForm>({
        resolver: zodResolver(projectSchema),
    });

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                const response = await api.get<{ success: boolean; data: Project }>(`/projects/${projectId}`);
                const projectData = response.data.data || response.data;
                setProject(projectData as Project);

                // Populate form with existing data
                reset({
                    name: projectData.name,
                    websiteUrl: projectData.websiteUrl,
                });
            } catch (error) {
                setServerError(
                    error instanceof Error ? error.message : "Failed to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchProject();
    }, [projectId, reset]);

    const onSubmit = async (values: ProjectForm) => {
        try {
            setServerError(null);
            await api.put(`/projects/${projectId}`, values);

            // Show success toast
            toast.success("Project updated successfully!", {
                description: `Changes to "${values.name}" have been saved.`,
                duration: 4000,
            });

            navigate(`/dashboard/${projectId}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unable to update project.";
            setServerError(errorMessage);

            toast.error("Failed to update project", {
                description: errorMessage,
                duration: 5000,
            });
        }
    };

    if (loading) {
        return <LoadingState message="Loading project..." className="py-16" />;
    }

    if (serverError && !project) {
        return <ErrorState description={serverError} className="py-16" />;
    }

    return (
        <section className="max-w-3xl space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Edit project
                </p>
                <h1 className="text-3xl font-bold text-hotel-navy">
                    Update project details
                </h1>
                <p className="text-sm text-slate-500">
                    Make changes to your project information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-soft"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input id="websiteUrl" {...register("websiteUrl")} placeholder="https://hotel.com" />
                    {errors.websiteUrl && (
                        <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
                    )}
                </div>

                {serverError && (
                    <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(`/dashboard/${projectId}`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default EditProjectPage;
