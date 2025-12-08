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
      <DialogContent className="sm:max-w-lg overflow-hidden p-0 border-2 border-green-200 shadow-2xl">
        {/* Enhanced Header with gradient */}
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-7 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="p-2.5 bg-white/25 rounded-2xl backdrop-blur-sm shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">✅</span>
                    <span className="font-bold text-xl">Deal Closed!</span>
                  </div>
                  <DialogDescription className="text-white/90 text-sm mt-1.5 font-medium">
                    Congratulations! Record the revenue generated from this deal.
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-7 space-y-6 bg-gradient-to-br from-white to-green-50/30">
          {/* Revenue Input */}
          <div className="space-y-3">
            <Label htmlFor="revenue" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Revenue Generated <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-green-600 z-10 font-bold" />
              <Input
                id="revenue"
                type="number"
                placeholder="0.00"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="pl-14 pr-4 h-14 text-xl font-bold border-2 focus:border-green-500 transition-all shadow-sm focus:shadow-lg rounded-xl"
                min="0"
                step="0.01"
                autoFocus
              />
              {revenue && !isNaN(parseFloat(revenue)) && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  {formatCurrency(revenue)}
                </div>
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2.5 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
                <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}
            {revenue && !isNaN(parseFloat(revenue)) && parseFloat(revenue) > 0 && !error && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-bold">
                  Great work! This deal generated {formatCurrency(revenue)} in revenue.
                </p>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add context about this deal...&#10;&#10;Examples:&#10;• Services or products sold&#10;• Contract terms&#10;• Payment schedule&#10;• Next steps or renewals"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="resize-none text-sm border-2 focus:border-green-400 transition-all shadow-sm focus:shadow-md rounded-xl"
            />
            <p className="text-xs text-slate-500 font-medium">
              {notes.length > 0 ? `${notes.length} characters` : "Optional: Add any relevant details..."}
            </p>
          </div>
        </div>

        {/* Enhanced Footer */}
        <DialogFooter className="px-7 py-5 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-t-2 border-green-200 gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-2 border-slate-300 hover:border-slate-400 hover:bg-white font-semibold transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !revenue}
            className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 border-0 text-white shadow-lg hover:shadow-2xl transition-all font-bold px-6 hover:scale-105"
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
