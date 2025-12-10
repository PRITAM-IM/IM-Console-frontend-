import { useState } from "react";
import { X, Globe, Copy, Check, ExternalLink, Share2, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { FormTemplate } from "@/types/formBuilder";

interface PublishDialogProps {
  template: FormTemplate;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (isPublished: boolean) => Promise<void>;
}

const PublishDialog = ({ template, isOpen, onClose, onPublish }: PublishDialogProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formUrl = template.publishedUrl || `${window.location.origin}/forms/${template._id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await onPublish(!template.isPublished);
      if (!template.isPublished) {
        toast.success('Form published successfully!');
      } else {
        toast.success('Form unpublished successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update publish status');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Share2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Share Form</h2>
                <p className="text-sm text-slate-600 mt-0.5">{template.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Publish Status */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {template.isPublished ? (
                  <div className="p-2 rounded-lg bg-green-100">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-slate-200">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {template.isPublished ? 'Published' : 'Not Published'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {template.isPublished
                      ? 'Your form is live and accepting responses'
                      : 'Your form is private and not accepting responses'}
                  </p>
                  {template.publishedAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      Published on {new Date(template.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                variant={template.isPublished ? "outline" : "default"}
                size="sm"
                className={template.isPublished ? "" : "bg-green-600 hover:bg-green-700 text-white"}
              >
                {isPublishing ? 'Updating...' : template.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            </div>
          </div>

          {/* Form Link */}
          {template.isPublished && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Form Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={formUrl}
                  readOnly
                  className="flex-1 font-mono text-sm bg-slate-50"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="gap-2 min-w-[100px]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Share this link with anyone to collect responses
              </p>
            </div>
          )}

          {/* Actions */}
          {template.isPublished && (
            <div className="grid grid-cols-2 gap-3">
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium text-slate-700"
              >
                <ExternalLink className="h-4 w-4" />
                Open Form
              </a>
              <button
                onClick={() => {
                  // Could add QR code generation here
                  toast.info('QR code feature coming soon!');
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium text-slate-700"
              >
                <Eye className="h-4 w-4" />
                View QR Code
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-4 border border-orange-100">
            <h3 className="font-semibold text-slate-900 mb-3">Form Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-orange-600">{template.viewCount || 0}</p>
                <p className="text-xs text-slate-600 mt-1">Total Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{template.submissionCount || 0}</p>
                <p className="text-xs text-slate-600 mt-1">Submissions</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">💡 Pro Tips</h3>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Share your form link on social media to reach more people</li>
              <li>• Embed the form on your website for seamless integration</li>
              <li>• Track responses in real-time from the Submissions tab</li>
              <li>• Use conditional logic to create dynamic forms</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishDialog;
