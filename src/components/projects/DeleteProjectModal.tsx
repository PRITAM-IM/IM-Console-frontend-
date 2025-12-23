import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    projectName: string;
}

const DeleteProjectModal = ({
    isOpen,
    onClose,
    onConfirm,
    projectName,
}: DeleteProjectModalProps) => {
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (confirmText !== projectName) {
            setError("Project name doesn't match. Please type the exact name.");
            return;
        }

        try {
            setIsDeleting(true);
            setError(null);
            await onConfirm();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            setConfirmText("");
            setError(null);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Delete Project</h2>
                                </div>
                                <button
                                    onClick={handleClose}
                                    disabled={isDeleting}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-red-900 mb-2">
                                        ⚠️ Warning: This action cannot be undone!
                                    </p>
                                    <p className="text-sm text-red-700">
                                        Deleting this project will permanently remove:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm text-red-700 list-disc list-inside">
                                        <li>All project data and settings</li>
                                        <li>Connected service configurations</li>
                                        <li>Analytics history and reports</li>
                                        <li>Form templates and submissions</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-700 mb-3">
                                        You are about to delete:{" "}
                                        <span className="font-bold text-slate-900">{projectName}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 mb-2">
                                        To confirm, please type the project name below:
                                    </p>
                                    <Input
                                        value={confirmText}
                                        onChange={(e) => {
                                            setConfirmText(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder={projectName}
                                        disabled={isDeleting}
                                        className="font-mono"
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="text-sm text-red-600 mt-2">{error}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={handleClose}
                                        variant="outline"
                                        disabled={isDeleting}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirm}
                                        disabled={isDeleting || confirmText !== projectName}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                    >
                                        {isDeleting ? "Deleting..." : "Delete Project"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteProjectModal;
