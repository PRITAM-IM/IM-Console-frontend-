import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Eye,
  MoreVertical,
  BarChart3,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


// Mock data - will be replaced with API calls
const mockTemplates = [
  {
    id: '1',
    name: 'Guest Check-In Form',
    description: 'Collect guest information upon arrival',
    pageCount: 3,
    responseCount: 45,
    lastUpdated: '2025-12-05',
    isPublished: true,
    isCpsTemplate: false
  },
  {
    id: '2',
    name: 'Feedback Survey',
    description: 'Post-stay guest feedback collection',
    pageCount: 2,
    responseCount: 128,
    lastUpdated: '2025-12-04',
    isPublished: true,
    isCpsTemplate: false
  }
];

const TemplatesPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [templates] = useState(mockTemplates);

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/${projectId}`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-orange-50/30 rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur-lg opacity-25"></div>
                  <div className="relative p-4 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">Form Templates</h1>
                  <p className="text-sm text-slate-600">
                    Create and manage client profiling forms with multi-page support
                  </p>
                </div>
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
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
                    <p className="text-xs text-slate-500">Total Templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {templates.reduce((sum, t) => sum + t.responseCount, 0)}
                    </p>
                    <p className="text-xs text-slate-500">Total Responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {templates.filter(t => t.isPublished).length}
                    </p>
                    <p className="text-xs text-slate-500">Published Forms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <Card className="border-2 border-dashed border-slate-300">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates yet</h3>
                <p className="text-slate-500 mb-4">
                  Create your first form template to start collecting client information
                </p>
                <Button onClick={handleCreateNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200/60 hover:shadow-lg transition-all group cursor-pointer">
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                            <FileText className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base font-bold text-slate-900">
                                {template.name}
                              </CardTitle>
                              {template.isCpsTemplate && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                  <Sparkles className="h-3 w-3" />
                                  CPS
                                </span>
                              )}
                            </div>
                            {template.description && (
                              <p className="text-xs text-slate-500 mt-1">
                                {template.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{template.pageCount} pages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>{template.responseCount} responses</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                            template.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                          )}>
                            {template.isPublished ? '● Published' : '○ Draft'}
                          </span>
                          <span className="text-xs text-slate-500">
                            Updated {template.lastUpdated}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTemplate(template.id);
                            }}
                            className="flex-1 text-xs"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewResponses(template.id);
                            }}
                            className="flex-1 text-xs"
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Responses
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default TemplatesPage;
