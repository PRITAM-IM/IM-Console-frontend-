import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, Flame, Snowflake, Trash2 } from "lucide-react";
import type { CRMStatus } from "./StatusDropdown";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => Promise<void>;
  status: CRMStatus;
}

const FeedbackModal = ({ isOpen, onClose, onSave, status }: FeedbackModalProps) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(notes);
      setNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to save feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNotes("");
    onClose();
  };

  const getStatusConfig = () => {
    switch (status) {
      case "Hot Lead":
        return {
          gradient: "from-red-500 to-orange-500",
          bg: "bg-gradient-to-r from-red-50 to-orange-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <Flame className="h-5 w-5" />,
          emoji: "🔥",
          description: "This lead is showing strong interest. Document key points and next steps."
        };
      case "Cold Lead":
        return {
          gradient: "from-blue-500 to-cyan-500",
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Snowflake className="h-5 w-5" />,
          emoji: "❄️",
          description: "This lead needs nurturing. Note why they're not ready and follow-up plans."
        };
      case "Junk Lead":
        return {
          gradient: "from-gray-500 to-slate-500",
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <Trash2 className="h-5 w-5" />,
          emoji: "🗑️",
          description: "Mark the reason this lead isn't viable for future reference."
        };
      default:
        return {
          gradient: "from-slate-500 to-slate-600",
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: <MessageSquare className="h-5 w-5" />,
          emoji: "📝",
          description: "Add your notes about this lead."
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {config.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{config.emoji}</span>
                    <span>{status}</span>
                  </div>
                  <DialogDescription className="text-white/80 text-sm mt-1 font-normal">
                    {config.description}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              Feedback & Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Share your insights, observations, or action items...&#10;&#10;Examples:&#10;• Key decision makers&#10;• Budget discussions&#10;• Timeline expectations&#10;• Concerns or objections"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="resize-none text-sm border-2 focus:border-green-400 transition-colors"
              autoFocus
            />
            <p className="text-xs text-slate-500">
              {notes.length > 0 ? `${notes.length} characters` : "Start typing your notes..."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`bg-gradient-to-r ${config.gradient} border-0 text-white shadow-lg hover:shadow-xl transition-all`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Save Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
