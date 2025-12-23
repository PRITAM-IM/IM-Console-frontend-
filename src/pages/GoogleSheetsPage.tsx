import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  ExternalLink,
  Table,
  Loader2,
  ChevronDown,
  Search,
  Download,
  RefreshCw,
  Rows,
  Columns,
  Filter,
  Database,
  Grid3x3
} from "lucide-react";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ReconnectButton from "@/components/common/ReconnectButton";
import DisconnectButton from "@/components/common/DisconnectButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ConnectGoogleSheets from "@/components/projects/ConnectGoogleSheets";
import StatusDropdown, { type CRMStatus } from "@/components/projects/StatusDropdown";
import FeedbackModal from "@/components/projects/FeedbackModal";
import RevenueModal from "@/components/projects/RevenueModal";
import api from "@/lib/api";
import type { Project, SpreadsheetDetails, GoogleSheet } from "@/types";

interface SheetValues {
  range: string;
  values: any[][];
}

interface ModalState {
  type: 'feedback' | 'revenue' | null;
  status: CRMStatus;
  rowIndex: number;
}

const GoogleSheetsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [spreadsheetDetails, setSpreadsheetDetails] = useState<SpreadsheetDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Sheet data state
  const [selectedSheet, setSelectedSheet] = useState<GoogleSheet | null>(null);
  const [sheetData, setSheetData] = useState<SheetValues | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSheetSelector, setShowSheetSelector] = useState(false);

  // CRM state
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    status: "",
    rowIndex: -1,
  });
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<number, any>>(new Map());

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

  const fetchSpreadsheetDetails = useCallback(async () => {
    if (!projectId || !project?.googleSheetId) return;
    try {
      setLoadingDetails(true);
      const response = await api.get<{ success: boolean; data: SpreadsheetDetails }>(
        `/google-sheets/${projectId}/details`
      );
      setSpreadsheetDetails(response.data.data);
      // Auto-select first sheet
      if (response.data.data.sheets.length > 0 && !selectedSheet) {
        setSelectedSheet(response.data.data.sheets[0]);
      }
    } catch (error) {
      console.error("Failed to fetch spreadsheet details:", error);
    } finally {
      setLoadingDetails(false);
    }
  }, [projectId, project?.googleSheetId, selectedSheet]);

  const fetchSheetData = useCallback(async () => {
    if (!projectId || !project?.googleSheetId || !selectedSheet) return;
    try {
      setLoadingData(true);
      const range = `${selectedSheet.title}!A1:Z1000`; // Fetch first 1000 rows
      const response = await api.get<{ success: boolean; data: SheetValues }>(
        `/google-sheets/${projectId}/values?range=${encodeURIComponent(range)}`
      );
      setSheetData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch sheet data:", error);
      setSheetData(null);
    } finally {
      setLoadingData(false);
    }
  }, [projectId, project?.googleSheetId, selectedSheet]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project?.googleSheetId) {
      void fetchSpreadsheetDetails();
    }
  }, [fetchSpreadsheetDetails, project?.googleSheetId]);

  useEffect(() => {
    if (selectedSheet) {
      void fetchSheetData();
    }
  }, [fetchSheetData, selectedSheet]);

  const handleConnectSuccess = () => {
    setShowConnectModal(false);
    void fetchProject();
  };

  const handleSheetSelect = (sheet: GoogleSheet) => {
    setSelectedSheet(sheet);
    setShowSheetSelector(false);
    setSearchQuery("");
  };

  // CRM Functions
  const handleStatusChange = (rowIndex: number, newStatus: CRMStatus) => {
    if (!newStatus) return;

    if (newStatus === "Closed") {
      setModalState({ type: "revenue", status: newStatus, rowIndex });
    } else if (["Hot Lead", "Cold Lead", "Junk Lead"].includes(newStatus)) {
      setModalState({ type: "feedback", status: newStatus, rowIndex });
    }
  };

  const updateSheetRow = async (rowIndex: number, updates: { [key: string]: any }) => {
    if (!projectId || !selectedSheet) return;

    try {
      await api.post(`/google-sheets/${projectId}/update-row`, {
        sheetName: selectedSheet.title,
        rowIndex: rowIndex + 1, // +1 because headers are row 0
        values: updates,
      });

      // Refresh data after successful update
      await fetchSheetData();
    } catch (error) {
      console.error("Failed to update sheet:", error);
      throw error;
    }
  };

  const handleFeedbackSave = async (notes: string) => {
    const { rowIndex, status } = modalState;

    // Optimistic update
    const updates = new Map(optimisticUpdates);
    updates.set(rowIndex, { Status: status, Notes: notes });
    setOptimisticUpdates(updates);

    try {
      await updateSheetRow(rowIndex, { Status: status, Notes: notes });
      toast.success(`Lead marked as ${status}`, {
        description: "Status updated successfully",
      });
      setOptimisticUpdates(new Map());
    } catch (error) {
      toast.error("Failed to update status", {
        description: "Please try again",
      });
      // Revert optimistic update
      const revertedUpdates = new Map(optimisticUpdates);
      revertedUpdates.delete(rowIndex);
      setOptimisticUpdates(revertedUpdates);
    }
  };

  const handleRevenueSave = async (revenue: number, notes: string) => {
    const { rowIndex, status } = modalState;

    // Optimistic update
    const updates = new Map(optimisticUpdates);
    updates.set(rowIndex, {
      Status: status,
      "Revenue Generated": revenue,
      Notes: notes
    });
    setOptimisticUpdates(updates);

    try {
      await updateSheetRow(rowIndex, {
        Status: status,
        "Revenue Generated": revenue,
        Notes: notes
      });
      toast.success(`Deal closed with $${revenue.toFixed(2)} revenue`, {
        description: "Congratulations on closing the deal!",
      });
      setOptimisticUpdates(new Map());
    } catch (error) {
      toast.error("Failed to update status", {
        description: "Please try again",
      });
      // Revert optimistic update
      const revertedUpdates = new Map(optimisticUpdates);
      revertedUpdates.delete(rowIndex);
      setOptimisticUpdates(revertedUpdates);
    }
  };

  const closeModal = () => {
    setModalState({ type: null, status: "", rowIndex: -1 });
  };

  // Filter data based on search
  const filteredData = sheetData?.values?.filter((row, index) => {
    if (index === 0) return true; // Always show header
    if (!searchQuery) return true;
    return row.some(cell =>
      String(cell).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const headers = filteredData[0] || [];
  const rows = filteredData.slice(1);

  // Find Status column index or mark to add it
  const statusColumnIndex = headers.findIndex(
    (h: string) => h?.toLowerCase() === "status"
  );
  const hasStatusColumn = statusColumnIndex !== -1;

  // Enhanced headers with Status column if missing
  const displayHeaders = hasStatusColumn ? headers : [...headers, "Status"];
  const actualStatusIndex = hasStatusColumn ? statusColumnIndex : headers.length;

  // Get cell value with optimistic updates
  const getCellValue = (rowIndex: number, colIndex: number, originalValue: any) => {
    const optimisticUpdate = optimisticUpdates.get(rowIndex);
    if (!optimisticUpdate) return originalValue;

    const columnName = displayHeaders[colIndex];
    if (optimisticUpdate.hasOwnProperty(columnName)) {
      return optimisticUpdate[columnName];
    }
    return originalValue;
  };

  if (loadingProject) {
    return <LoadingState message="Loading project..." />;
  }

  if (projectError) {
    return <ErrorState description={projectError} onRetry={fetchProject} />;
  }

  if (!project?.googleSheetId) {
    return (
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Google Sheets</h1>
          <p className="text-sm text-slate-500">Connect a spreadsheet to your project</p>
        </div>

        <Card className="bg-white border-2 border-dashed border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Connect Google Sheets</CardTitle>
                <CardDescription className="text-slate-500">
                  Link a spreadsheet to view and manage your data.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowConnectModal(true)} className="bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Connect Spreadsheet
            </Button>
          </CardContent>
        </Card>

        {showConnectModal && (
          <ConnectGoogleSheets
            projectId={projectId!}
            onSuccess={handleConnectSuccess}
            onClose={() => setShowConnectModal(false)}
          />
        )}
      </section>
    );
  }

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      {/* Modern Header with Stats */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-green-50/30 rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-25"></div>
              <div className="relative p-4 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-lg">
                <FileSpreadsheet className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {spreadsheetDetails?.title || "Google Sheets CRM"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Grid3x3 className="h-3.5 w-3.5" />
                  <span>{spreadsheetDetails?.sheets.length || 0} sheets</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  <span>{rows.length.toLocaleString()} records</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span>{spreadsheetDetails?.timeZone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnectModal(true)}
              className="border-slate-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all font-semibold"
            >
              Change Spreadsheet
            </Button>
            <ReconnectButton
              service="google-sheets"
              projectId={projectId || ''}
              onReconnectSuccess={() => window.location.reload()}
              variant="outline"
            />
            <DisconnectButton
              service="google-sheets"
              projectId={projectId || ''}
              onDisconnectSuccess={() => window.location.reload()}
              variant="outline"
            />
            <a
              href={spreadsheetDetails?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all shadow-sm hover:shadow"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Sheets
            </a>
            <Button
              variant="outline"
              onClick={fetchSheetData}
              disabled={loadingData}
              className="border-slate-300 hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sheet Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSheetSelector(!showSheetSelector)}
                className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all min-w-[220px] group"
              >
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm group-hover:shadow transition-shadow">
                  <Table className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="flex-1 text-left font-semibold text-slate-900 text-sm">
                  {selectedSheet?.title || "Select Sheet"}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showSheetSelector ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSheetSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <p className="text-xs font-bold text-slate-600 px-2 tracking-wide">SELECT A SHEET</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                      {spreadsheetDetails?.sheets.map((sheet) => (
                        <button
                          key={sheet.sheetId}
                          onClick={() => handleSheetSelect(sheet)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${selectedSheet?.sheetId === sheet.sheetId
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-sm'
                            : 'hover:bg-slate-50 border-2 border-transparent'
                            }`}
                        >
                          <div className={`p-2 rounded-lg shadow-sm ${selectedSheet?.sheetId === sheet.sheetId
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-slate-100'
                            }`}>
                            <Table className={`h-4 w-4 ${selectedSheet?.sheetId === sheet.sheetId
                              ? 'text-white'
                              : 'text-slate-500'
                              }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-semibold ${selectedSheet?.sheetId === sheet.sheetId
                              ? 'text-green-900'
                              : 'text-slate-900'
                              }`}>{sheet.title}</p>
                            <p className="text-xs text-slate-500 font-medium">
                              {sheet.rowCount.toLocaleString()} rows × {sheet.columnCount} cols
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-[42px] bg-white border-2 border-slate-200 rounded-xl focus:border-green-400 transition-all"
              />
            </div>

            {/* Stats Pills */}
            {sheetData && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <Rows className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">{rows.length.toLocaleString()} rows</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <Columns className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">{displayHeaders.length} cols</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-lg">
                    <Filter className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Filtered</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      {loadingData || loadingDetails ? (
        <Card className="bg-white">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
              <p className="text-slate-600">Loading spreadsheet data...</p>
            </div>
          </CardContent>
        </Card>
      ) : sheetData && sheetData.values && sheetData.values.length > 0 ? (
        <Card className="bg-white overflow-hidden border-slate-200/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-slate-700">
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-16">
                    #
                  </th>
                  {displayHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap"
                    >
                      {header || `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.01, duration: 0.2 }}
                    className="hover:bg-gradient-to-r hover:from-green-50/60 hover:to-emerald-50/40 transition-all group border-b border-slate-50 last:border-0"
                  >
                    <td className="px-5 py-4 text-xs text-slate-400 font-bold font-mono bg-slate-50/50 group-hover:bg-green-100/50 transition-colors">
                      {rowIndex + 1}
                    </td>
                    {displayHeaders.map((_, colIndex) => {
                      const isStatusColumn = colIndex === actualStatusIndex;
                      const cellValue = getCellValue(rowIndex, colIndex, row[colIndex]);

                      return (
                        <td
                          key={colIndex}
                          className="px-5 py-4 text-sm text-slate-700 max-w-xs"
                          title={isStatusColumn ? undefined : String(cellValue || '')}
                        >
                          {isStatusColumn ? (
                            <StatusDropdown
                              value={String(cellValue || "")}
                              onChange={(newStatus) => handleStatusChange(rowIndex, newStatus)}
                              disabled={optimisticUpdates.has(rowIndex)}
                            />
                          ) : (
                            cellValue !== undefined && cellValue !== null && cellValue !== '' ? (
                              <span className="block truncate font-medium">
                                {String(cellValue)}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-medium">—</span>
                            )
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Table Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-semibold text-slate-700">
                  Showing {rows.length.toLocaleString()} of {(sheetData.values.length - 1).toLocaleString()} records
                </p>
              </div>
              {searchQuery && (
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                  Filtered
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all font-semibold"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-white">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Table className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No data found</h3>
            <p className="text-slate-500 mb-4">
              {selectedSheet
                ? `The sheet "${selectedSheet.title}" appears to be empty.`
                : "Select a sheet to view its data."
              }
            </p>
            <Button variant="outline" onClick={fetchSheetData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {showConnectModal && (
        <ConnectGoogleSheets
          projectId={projectId!}
          onSuccess={handleConnectSuccess}
          onClose={() => setShowConnectModal(false)}
        />
      )}

      {/* CRM Modals */}
      <FeedbackModal
        isOpen={modalState.type === "feedback"}
        onClose={closeModal}
        onSave={handleFeedbackSave}
        status={modalState.status}
      />

      <RevenueModal
        isOpen={modalState.type === "revenue"}
        onClose={closeModal}
        onSave={handleRevenueSave}
      />
    </motion.section>
  );
};

export default GoogleSheetsPage;
