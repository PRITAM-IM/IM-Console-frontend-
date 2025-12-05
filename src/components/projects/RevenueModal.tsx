import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign, CheckCircle2, TrendingUp, FileText } from "lucide-react";

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (revenue: number, notes: string) => Promise<void>;
}

const RevenueModal = ({ isOpen, onClose, onSave }: RevenueModalProps) => {
  const [revenue, setRevenue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    
    const revenueValue = parseFloat(revenue);
    if (isNaN(revenueValue) || revenueValue < 0) {
      setError("Please enter a valid revenue amount");
      return;
    }

    setLoading(true);
    try {
      await onSave(revenueValue, notes);
      setRevenue("");
      setNotes("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Failed to save revenue:", error);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRevenue("");
    setNotes("");
    setError("");
    onClose();
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Deal Closed!</span>
                  </div>
                  <DialogDescription className="text-white/80 text-sm mt-1 font-normal">
                    Congratulations! Record the revenue generated from this deal.
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Revenue Input */}
          <div className="space-y-3">
            <Label htmlFor="revenue" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Revenue Generated <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 z-10" />
              <Input
                id="revenue"
                type="number"
                placeholder="0.00"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg font-semibold border-2 focus:border-green-500 transition-all"
                min="0"
                step="0.01"
                autoFocus
              />
              {revenue && !isNaN(parseFloat(revenue)) && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-green-700">
                  {formatCurrency(revenue)}
                </div>
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}
            {revenue && !isNaN(parseFloat(revenue)) && parseFloat(revenue) > 0 && !error && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-700 font-medium">
                  Great work! This deal generated {formatCurrency(revenue)} in revenue.
                </p>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add context about this deal...&#10;&#10;Examples:&#10;• Services or products sold&#10;• Contract terms&#10;• Payment schedule&#10;• Next steps or renewals"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="resize-none text-sm border-2 focus:border-green-400 transition-colors"
            />
            <p className="text-xs text-slate-500">
              {notes.length > 0 ? `${notes.length} characters` : "Optional: Add any relevant details..."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-slate-300 hover:bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !revenue}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Close Deal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueModal;
