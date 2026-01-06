import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Eye,
  BarChart3,
  Sparkles,
  ChevronLeft,
  Trash2,
  Edit,
  Calendar,
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import formService from "@/services/formService";
import { toast } from "sonner";

const TemplatesPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load templates from API
  useEffect(() => {
    loadTemplates();
  }, [projectId]);

  const loadTemplates = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const forms = await formService.getFormsByProject(projectId);
      setTemplates(forms);
    } catch (error: any) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate(`/dashboard/${projectId}/templates/new`);
  };

  const handleCreateCPS = () => {
    // Navigate to builder with CPS template flag
    navigate(`/dashboard/${projectId}/templates/new?useCPS=true`);
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/dashboard/${projectId}/templates/${templateId}`);
  };

  const handleViewResponses = (templateId: string) => {
    navigate(`/dashboard/${projectId}/templates/${templateId}/responses`);
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await formService.deleteForm(projectId!, templateId);
      toast.success('Template deleted successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const filteredTemplates = templates.filter((template) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      template.name?.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower)
    );
  });

  const totalResponses = templates.reduce((sum, t) => sum + (t.submissionCount || 0), 0);
  const publishedCount = templates.filter(t => t.isPublished).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-r-2 border-slate-200 flex flex-col flex-shrink-0 overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dashboard/${projectId}`)}
                className="gap-2 w-full justify-start"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>

            {/* Page Title */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900">Form Templates</h1>
                  <p className="text-xs text-slate-500">Client Profiling & Data Collection</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3 flex-1 overflow-auto">
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
                      <p className="text-xs text-slate-600">Total Templates</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{totalResponses}</p>
                      <p className="text-xs text-slate-600">Total Responses</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{publishedCount}</p>
                      <p className="text-xs text-slate-600">Published Forms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
              title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>

            {sidebarCollapsed && (
              <>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">Form Templates</h1>
                    <p className="text-xs text-slate-500">Client Profiling & Data Collection</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreateCPS}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Use CPS Template
            </Button>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Templates Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">All Templates</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading templates...</p>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {searchQuery ? 'No templates found' : 'No templates yet'}
                    </h3>
                    <p className="text-slate-500 mb-4">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'Create your first form template to start collecting client information'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleCreateNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Template
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead>Responses</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTemplates.map((template, index) => (
                          <motion.tr
                            key={template._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group hover:bg-slate-50"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                  <FileText className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{template.name}</span>
                                    {template.isCpsTemplate && (
                                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        CPS
                                      </Badge>
                                    )}
                                  </div>
                                  {template.description && (
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {template.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-600">
                                <FileText className="h-4 w-4" />
                                {template.pages?.length || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-600">
                                <BarChart3 className="h-4 w-4" />
                                {template.submissionCount || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  template.isPublished
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                )}
                              >
                                {template.isPublished ? '● Published' : '○ Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="h-4 w-4" />
                                {template.updatedAt
                                  ? new Date(template.updatedAt).toLocaleDateString()
                                  : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTemplate(template._id)}
                                  className="gap-1"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewResponses(template._id)}
                                  className="gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Responses
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template._id, template.name)}
                                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
