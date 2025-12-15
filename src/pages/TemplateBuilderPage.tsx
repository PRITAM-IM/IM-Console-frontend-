import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Eye,
  Save,
  ChevronLeft,
  FileText,
  GripVertical,
  Trash2,
  Palette,
  Share2,

} from "lucide-react";
import type { FormTemplate, FormPage, FormField, FieldType, ConditionalLogic } from "@/types/formBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FieldPalette from "@/components/formBuilder/FieldPalette";
import FormCanvas from "@/components/formBuilder/FormCanvas";
import PropertiesPanel from "@/components/formBuilder/PropertiesPanel";
import TemplatePanel from "@/components/formBuilder/TemplatePanel";
import type { DesignTemplate } from "@/components/formBuilder/TemplatePanel";

import PublishDialog from "@/components/formBuilder/PublishDialog";
import { FormPreviewDialog } from "@/components/formBuilder/FormPreviewDialog";
import { cn } from "@/lib/utils";
import { generateCPSTemplate } from "@/data/cpsTemplateData";
import formService from "@/services/formService";

const TemplateBuilderPage = () => {
  const { projectId, templateId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const useCPS = searchParams.get('useCPS') === 'true';

  // Initialize with CPS template if flag is set
  const getInitialTemplate = (): FormTemplate => {
    if (useCPS) {
      const cpsPages = generateCPSTemplate(projectId || '', '');
      const pagesWithIds = cpsPages.map((page, index) => ({
        ...page,
        id: `page-${Date.now()}-${index}`,
        fields: page.fields.map((field, fieldIndex) => ({
          ...field,
          id: `field-${Date.now()}-${index}-${fieldIndex}`
        }))
      }));

      return {
        projectId: projectId || '',
        name: 'Client Profiling Sheet – CPS',
        description: 'Comprehensive client profiling and marketing strategy template',
        theme: {
          accentColor: '#f97316',
          mode: 'light'
        },
        coverPage: {
          title: 'Client Profiling Sheet',
          description: 'Please complete all sections to help us understand your business better',
          showCover: true
        },
        pages: pagesWithIds,
        isPublished: false,
        isCpsTemplate: true
      };
    }

    return {
      projectId: projectId || '',
      name: 'Untitled Form',
      description: '',
      theme: {
        accentColor: '#f97316',
        mode: 'light'
      },
      coverPage: {
        title: 'Welcome',
        description: 'Please fill out this form',
        showCover: false
      },
      pages: [
        {
          id: `page-${Date.now()}`,
          name: 'Page 1',
          description: '',
          fields: [],
          order: 0
        }
      ],
      isPublished: false
    };
  };

  // Template State
  const [template, setTemplate] = useState<FormTemplate>(getInitialTemplate());
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const currentPage = template.pages[currentPageIndex];

  // Load existing template if templateId is provided
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && templateId !== 'new' && projectId && !useCPS) {
        try {
          const loadedTemplate = await formService.getFormById(projectId, templateId);
          setTemplate(loadedTemplate);
          toast.success('Form loaded successfully');
        } catch (error: any) {
          console.error('Error loading template:', error);
          toast.error(error.response?.data?.error || 'Failed to load form');
        }
      }
    };

    loadTemplate();
  }, [templateId, projectId, useCPS]);

  // Auto-save feature - save template after changes (debounced)
  useEffect(() => {
    // Don't auto-save immediately on load or if it's a new unsaved template without an ID
    if (!template._id || !projectId) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        setIsSaving(true);
        await formService.updateForm(projectId, template._id!, template);
        setLastSaved(new Date());
      } catch (error: any) {
        console.error('Auto-save failed:', error);
        toast.error('Auto-save failed');
      } finally {
        setIsSaving(false);
      }
    }, 2000); // Auto-save 2 seconds after last change

    return () => clearTimeout(autoSaveTimer);
  }, [template.name, template.pages, template.theme, template.coverPage]); // Dependencies: save when these change

  // Save template function
  const handleSave = async () => {
    if (!projectId) {
      toast.error('Project ID is missing');
      console.error('Save failed: No project ID');
      return;
    }

    console.log('Saving form...', { projectId, templateId: template._id, name: template.name });

    try {
      setIsSaving(true);

      if (template._id) {
        // Update existing form
        console.log('Updating existing form:', template._id);
        const updated = await formService.updateForm(projectId, template._id, template);
        setTemplate(updated);
        toast.success('Form saved successfully!');
        console.log('Form updated:', updated);
      } else {
        // Create new form
        console.log('Creating new form');
        const created = await formService.createForm(projectId, template);
        setTemplate(created);
        toast.success('Form created successfully!');
        console.log('Form created:', created);

        // Update URL to include the new template ID
        navigate(`/dashboard/${projectId}/templates/${created._id}/edit`, { replace: true });
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 404) {
        toast.error('Project not found');
      } else {
        toast.error(error.response?.data?.error || error.message || 'Failed to save form');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Preview function
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Show success toast when CPS template is loaded
  useEffect(() => {
    if (useCPS) {
      toast.success('CPS Template loaded with 16 pre-built pages! You can edit, add, or remove pages and fields as needed.', {
        duration: 5000
      });
    }
  }, [useCPS]);

  // Add Field to Current Page
  const handleFieldSelect = (fieldType: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: getDefaultLabel(fieldType),
      placeholder: '',
      description: '',
      options: getDefaultOptions(fieldType),
      validation: {
        required: false
      },
      order: currentPage.fields.length
    };

    updatePage(currentPageIndex, {
      fields: [...currentPage.fields, newField]
    });

    setSelectedField(newField);
    toast.success('Field added');
  };

  // Update Field
  const handleFieldUpdate = (updatedField: FormField) => {
    updatePage(currentPageIndex, {
      fields: currentPage.fields.map(f =>
        f.id === updatedField.id ? updatedField : f
      )
    });
    setSelectedField(updatedField);
  };

  // Delete Field
  const handleFieldDelete = (fieldId: string) => {
    updatePage(currentPageIndex, {
      fields: currentPage.fields.filter(f => f.id !== fieldId)
    });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    toast.success('Field deleted');
  };

  // Duplicate Field
  const handleFieldDuplicate = (field: FormField) => {
    const duplicatedField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (Copy)`,
      order: currentPage.fields.length
    };

    updatePage(currentPageIndex, {
      fields: [...currentPage.fields, duplicatedField]
    });
    toast.success('Field duplicated');
  };

  // Page Management
  const addPage = () => {
    const newPage: FormPage = {
      id: `page-${Date.now()}`,
      name: `Page ${template.pages.length + 1}`,
      description: '',
      fields: [],
      order: template.pages.length
    };

    setTemplate(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setCurrentPageIndex(template.pages.length);
    toast.success('Page added');
  };

  const updatePage = (index: number, updates: Partial<FormPage>) => {
    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.map((page, i) =>
        i === index ? { ...page, ...updates } : page
      )
    }));
  };

  const deletePage = (index: number) => {
    if (template.pages.length === 1) {
      toast.error('Cannot delete the last page');
      return;
    }

    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index)
    }));

    if (currentPageIndex >= template.pages.length - 1) {
      setCurrentPageIndex(Math.max(0, template.pages.length - 2));
    }
    toast.success('Page deleted');
  };

  const renamePage = (index: number, newName: string) => {
    updatePage(index, { name: newName });
  };

  // Helper Functions
  const getDefaultLabel = (fieldType: FieldType): string => {
    const labels: Record<FieldType, string> = {
      'short-text': 'Short Answer',
      'long-text': 'Long Answer',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'number': 'Number',
      'url': 'Website URL',
      'password': 'Password',
      'multiple-choice': 'Multiple Choice Question',
      'checkboxes': 'Select Multiple',
      'dropdown': 'Select from Dropdown',
      'picture-choice': 'Picture Choice',
      'date': 'Date',
      'time': 'Time',
      'date-time': 'Date and Time',
      'date-range': 'Date Range',
      'rating': 'Star Rating',
      'ranking': 'Ranking',
      'slider': 'Slider',
      'opinion-scale': 'Opinion Scale',
      'file-upload': 'File Upload',
      'signature': 'Signature',
      'color-picker': 'Color Picker',
      'location': 'Location',
      'address': 'Address',
      'currency': 'Currency',
      'heading': 'Heading',
      'paragraph': 'Paragraph',
      'banner': 'Banner',
      'divider': 'Divider',
      'image': 'Image',
      'video': 'Video'
    };
    return labels[fieldType] || 'Untitled Field';
  };

  const getDefaultOptions = (fieldType: FieldType) => {
    if (['multiple-choice', 'checkboxes', 'dropdown', 'picture-choice'].includes(fieldType)) {
      return [
        { id: 'opt-1', label: 'Option 1', value: 'option-1' },
        { id: 'opt-2', label: 'Option 2', value: 'option-2' },
        { id: 'opt-3', label: 'Option 3', value: 'option-3' }
      ];
    }
    return undefined;
  };

  // Handle publish toggle
  const handlePublish = async (isPublished: boolean) => {
    if (!template._id || !projectId) {
      toast.error('Please save the form first');
      return;
    }

    try {
      const updated = await formService.togglePublish(projectId, template._id, isPublished);
      setTemplate(updated);
    } catch (error: any) {
      console.error('Error toggling publish:', error);
      throw error;
    }
  };

  // Handle logic update for a field
  const handleLogicUpdate = (fieldId: string, logic: ConditionalLogic[]) => {
    const updatedFields = currentPage.fields.map(field =>
      field.id === fieldId ? { ...field, conditionalLogic: logic } : field
    );
    updatePage(currentPageIndex, { fields: updatedFields });
    toast.success('Logic updated');
  };

  // Handle template application
  const handleTemplateApply = (designTemplate: DesignTemplate) => {
    setTemplate(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...designTemplate.styles
      }
    }));
    toast.success(`Template "${designTemplate.name}" applied!`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Toolbar */}
      <div className="bg-white border-b-2 border-slate-200 px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/${projectId}/templates`)}
            className="gap-1 sm:gap-2 flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Templates</span>
          </Button>
          <div className="hidden sm:block h-8 w-px bg-slate-300" />
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="hidden sm:block p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg flex-shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="text-base sm:text-lg font-bold border-0 focus-visible:ring-0 p-0 h-auto truncate"
              />
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500 hidden sm:block">Form Template</p>
                {isSaving ? (
                  <span className="text-xs text-orange-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-orange-600 rounded-full animate-pulse" />
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-green-600 rounded-full" />
                    <span className="hidden sm:inline">Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                    <span className="sm:hidden">Saved</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedField(null);
              setShowTemplatePanel(true);
            }}
            className="gap-1 sm:gap-2 hidden md:flex"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden lg:inline">Templates</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPublishDialog(true)}
            className="gap-1 sm:gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="gap-1 sm:gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1 sm:gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>

      {/* Builder Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Field Palette - Hidden on mobile */}
        <div className="hidden lg:block">
          <FieldPalette onFieldSelect={handleFieldSelect} />
        </div>

        {/* Center: Form Canvas with Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden min-h-0">
            <FormCanvas
              currentPage={currentPage}
              onFieldSelect={setSelectedField}
              onFieldDelete={handleFieldDelete}
              onFieldDuplicate={handleFieldDuplicate}
              selectedField={selectedField}
              theme={template.theme}
              onOpenTemplates={() => setShowTemplatePanel(true)}
            />
          </div>

          {/* Page Tabs (Bottom) - Compact Style */}
          <div className="bg-slate-50 border-t border-slate-200 flex items-center gap-2 flex-shrink-0 h-10">
            {/* Scrollable tabs container */}
            <div className="flex-1 overflow-x-auto px-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <div className="flex items-center gap-1 h-10">
                {template.pages.map((page, index) => (
                  <PageTab
                    key={page.id}
                    page={page}
                    index={index}
                    isActive={currentPageIndex === index}
                    onClick={() => setCurrentPageIndex(index)}
                    onRename={(newName) => renamePage(index, newName)}
                    onDelete={() => deletePage(index)}
                    canDelete={template.pages.length > 1}
                  />
                ))}
              </div>
            </div>
            {/* Fixed Add Page button */}
            <div className="px-3 border-l border-slate-200 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={addPage}
                className="gap-1.5 h-7 px-2.5 text-xs hover:bg-orange-50 hover:text-orange-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Page
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Show Templates Panel, or Properties Panel when field is selected - Hidden on mobile unless active */}
        {showTemplatePanel ? (
          <div className="w-full sm:w-80 flex-shrink-0 absolute sm:relative inset-0 sm:inset-auto bg-white z-50 sm:z-auto">
            <TemplatePanel
              template={template}
              onTemplateApply={handleTemplateApply}
              onClose={() => setShowTemplatePanel(false)}
            />
          </div>
        ) : selectedField ? (
          <div className="w-full sm:w-80 flex-shrink-0 absolute sm:relative inset-0 sm:inset-auto bg-white z-50 sm:z-auto">
            <PropertiesPanel
              selectedField={selectedField}
              onFieldUpdate={handleFieldUpdate}
              onClose={() => setSelectedField(null)}
              allPages={template.pages}
              currentPageIndex={currentPageIndex}
              onUpdateLogic={handleLogicUpdate}
            />
          </div>
        ) : null}
      </div>

      {/* Preview Dialog */}
      <FormPreviewDialog
        template={template}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      {/* Publish Dialog */}
      <PublishDialog
        template={template}
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        onPublish={handlePublish}
      />
    </div>
  );
};

// Page Tab Component
interface PageTabProps {
  page: FormPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const PageTab = ({ page, index: _index, isActive, onClick, onRename, onDelete, canDelete }: PageTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(page.name);
  const [showActions, setShowActions] = useState(false);

  const handleRename = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "relative group flex items-center gap-1.5 px-3 py-1.5 rounded-t border transition-all cursor-pointer min-w-[100px] h-7",
        isActive
          ? "bg-white border-slate-300 border-b-white -mb-px shadow-sm z-10"
          : "bg-slate-100 border-transparent hover:bg-slate-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <GripVertical className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100" />

      {isEditing ? (
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          className="h-5 text-xs border-orange-300 py-0 px-1"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={cn(
            "text-xs font-medium flex-1 truncate",
            isActive ? "text-slate-900" : "text-slate-600"
          )}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {page.name}
        </span>
      )}

      {showActions && !isEditing && (
        <div className="flex items-center">
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-0.5 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-3 w-3 text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateBuilderPage;
