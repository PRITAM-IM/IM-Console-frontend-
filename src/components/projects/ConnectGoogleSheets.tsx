import { useEffect, useMemo, useState } from "react";
import { X, FileSpreadsheet, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface Spreadsheet {
  spreadsheetId: string;
  title: string;
  sheetCount: number;
  url: string;
}

interface ConnectGoogleSheetsProps {
  projectId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

type Step = "init" | "oauth" | "select" | "success";

const ConnectGoogleSheets = ({ projectId, onSuccess, onClose }: ConnectGoogleSheetsProps) => {
  const [step, setStep] = useState<Step>("init");
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSpreadsheets = useMemo(() => {
    if (!searchQuery.trim()) {
      return spreadsheets;
    }
    const query = searchQuery.toLowerCase().trim();
    return spreadsheets.filter(
      (sheet) =>
        sheet.title.toLowerCase().includes(query) ||
        sheet.spreadsheetId.includes(query)
    );
  }, [spreadsheets, searchQuery]);

  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<{ success: boolean; data: Spreadsheet[] }>(
          `/google-sheets/spreadsheets/${projectId}`
        );
        if (data.success && data.data.length > 0) {
          setSpreadsheets(data.data);
          setStep("select");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "";
        if (errorMessage.includes("Google Sheets API") || errorMessage.includes("not been used") || errorMessage.includes("disabled")) {
          setError("⚠️ Google Sheets API is not enabled. Please enable it in your Google Cloud Console.");
        }
      } finally {
        setLoading(false);
      }
    };
    void checkExistingConnection();
  }, [projectId]);

  const handleInitiateAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<{ success: boolean; authUrl: string }>(
        `/google-sheets/auth?projectId=${projectId}`
      );
      if (data.success && data.authUrl) {
        setStep("oauth");
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          data.authUrl,
          "Google Sheets Authorization",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );

        const checkPopup = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(checkPopup);
            try {
              const { data: sheetsData } = await api.get<{ success: boolean; data: Spreadsheet[] }>(
                `/google-sheets/spreadsheets/${projectId}`
              );
              if (sheetsData.success && sheetsData.data.length > 0) {
                setSpreadsheets(sheetsData.data);
                setStep("select");
              } else {
                setStep("init");
                setError("Authorization was cancelled or failed. Please try again.");
              }
            } catch (e) {
              setStep("init");
              setError("Failed to fetch spreadsheets after authorization.");
            }
            setLoading(false);
          }
        }, 500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleSaveSpreadsheet = async () => {
    if (!selectedSpreadsheetId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/google-sheets/spreadsheet', {
        projectId,
        spreadsheetId: selectedSpreadsheetId,
      });

      setStep("success");
      
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white shadow-2xl border-2 border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between border-b-2 border-slate-100 pb-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 text-xl font-bold">Connect Google Sheets</CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                Link a spreadsheet to your project
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-600 transition-colors">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {step === "init" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30"></div>
                <div className="relative p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full border-2 border-green-200">
                  <FileSpreadsheet className="h-14 w-14 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2 text-slate-900">Connect Google Sheets</h3>
                <p className="text-sm text-slate-600 max-w-md font-medium">
                  Authorize access to your Google Sheets to view and manage spreadsheet data.
                </p>
              </div>
              <Button
                onClick={handleInitiateAuth}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all font-bold px-6 py-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    Connect with Google
                  </>
                )}
              </Button>
            </div>
          )}

          {step === "oauth" && (
            <div className="flex flex-col items-center justify-center py-16 space-y-5">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-25 animate-pulse"></div>
                <Loader2 className="relative h-14 w-14 animate-spin text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2 text-slate-900">Authorizing...</h3>
                <p className="text-sm text-slate-600 font-medium">
                  Complete the authorization in the popup window.
                </p>
              </div>
            </div>
          )}

          {step === "select" && (
            <div className="space-y-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search spreadsheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-slate-200 rounded-xl focus:border-green-400 transition-all shadow-sm"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 border-2 border-slate-200 rounded-xl p-3 bg-slate-50/50">
                {filteredSpreadsheets.length === 0 ? (
                  <p className="text-center py-8 text-slate-500 font-medium">No spreadsheets found</p>
                ) : (
                  filteredSpreadsheets.map((sheet) => (
                    <div
                      key={sheet.spreadsheetId}
                      onClick={() => setSelectedSpreadsheetId(sheet.spreadsheetId)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                        selectedSpreadsheetId === sheet.spreadsheetId
                          ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md scale-[1.02]"
                          : "border-slate-200 bg-white hover:border-green-300 hover:bg-green-50/30 hover:shadow"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl shadow-sm transition-all ${
                          selectedSpreadsheetId === sheet.spreadsheetId
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 scale-110"
                            : "bg-slate-100"
                        }`}>
                          <FileSpreadsheet className={`h-6 w-6 ${
                            selectedSpreadsheetId === sheet.spreadsheetId
                              ? "text-white"
                              : "text-slate-500"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-base truncate mb-1 ${
                            selectedSpreadsheetId === sheet.spreadsheetId
                              ? "text-green-900"
                              : "text-slate-900"
                          }`}>
                            {sheet.title}
                          </p>
                          <p className={`text-xs truncate font-semibold ${
                            selectedSpreadsheetId === sheet.spreadsheetId
                              ? "text-green-700"
                              : "text-slate-500"
                          }`}>
                            {sheet.sheetCount} sheet{sheet.sheetCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {selectedSpreadsheetId === sheet.spreadsheetId && (
                          <CheckCircle2 className="h-7 w-7 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-16 space-y-5">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30"></div>
                <div className="relative rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4 border-2 border-green-300">
                  <CheckCircle2 className="h-14 w-14 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2 text-slate-900">Google Sheets Connected!</h3>
                <p className="text-sm text-slate-600 font-medium">
                  Your spreadsheet has been linked successfully.
                </p>
              </div>
            </div>
          )}

          {step === "select" && (
            <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-100 mt-6">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="border-2 border-slate-300 hover:border-slate-400 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSpreadsheet}
                disabled={!selectedSpreadsheetId || loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all font-bold px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Spreadsheet"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectGoogleSheets;





