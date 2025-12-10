import { motion } from "framer-motion";
import { GripVertical, Trash2, Copy, Settings, Edit2 } from "lucide-react";
import type { FormField, FormPage, FormTheme } from "@/types/formBuilder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormCanvasProps {
  currentPage: FormPage;
  onFieldSelect: (field: FormField) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldDuplicate: (field: FormField) => void;
  selectedField: FormField | null;
  theme?: FormTheme;
  onOpenTemplates?: () => void; // Make it optional
}

const FormCanvas = ({ 
  currentPage, 
  onFieldSelect, 
  onFieldDelete, 
  onFieldDuplicate,
  selectedField,
  theme,
  onOpenTemplates: _onOpenTemplates
}: FormCanvasProps) => {
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('fieldType');
    console.log('Dropped field type:', fieldType);
    // TODO: Add field to canvas
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Generate theme background for canvas
  const getCanvasBackground = () => {
    if (!theme) {
      return { background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' };
    }
    
    // Use custom background if provided
    if (theme.backgroundColor) {
      return { background: theme.backgroundColor };
    }
    
    if (theme.mode === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      };
    } else {
      // Light theme with subtle accent color tint
      return {
        background: `linear-gradient(135deg, #ffffff 0%, ${theme.accentColor}08 50%, #ffffff 100%)`
      };
    }
  };

  // Get border radius class based on theme
  const getBorderRadiusClass = () => {
    if (!theme?.borderRadius) return 'rounded-xl';
    const radiusMap = {
      'sharp': 'rounded-none',
      'rounded': 'rounded-xl',
      'pill': 'rounded-3xl'
    };
    return radiusMap[theme.borderRadius] || 'rounded-xl';
  };

  // Get card background and text colors
  const cardBg = theme?.cardBackground || '#FFFFFF';
  const textPrimary = theme?.textPrimary || '#0F172A';
  const borderColor = theme?.borderColor || '#E2E8F0';

  return (
    <div 
      className="h-full w-full overflow-y-auto overflow-x-hidden flex items-start justify-center p-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={getCanvasBackground()}
    >
      {/* Full-Width Rectangular Canvas Container */}
      <div className="w-full h-full px-5 pb-5">
        <div 
          className={`shadow-lg border-2 h-full overflow-y-auto ${getBorderRadiusClass()}`}
          style={{ 
            backgroundColor: cardBg,
            borderColor: borderColor
          }}
        >
          <div className="p-5">
        {/* Page Header */}
        <div 
          className={`p-4 mb-4 border-2 shadow-sm ${getBorderRadiusClass()}`}
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: textPrimary }}>{currentPage.name}</h2>
          {currentPage.description && (
            <p className="mt-1 text-sm" style={{ color: theme?.textSecondary || '#64748B' }}>{currentPage.description}</p>
          )}
        </div>

        {/* Fields List */}
        <div className="space-y-3">
          {currentPage.fields.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border-2 border-dashed border-slate-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                <Settings className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">No fields yet</h3>
              <p className="text-slate-500 text-sm">
                Drag fields from the left panel or click on a field type to add it here
              </p>
            </div>
          ) : (
            currentPage.fields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "bg-white rounded-lg p-4 border-2 transition-all duration-200 group relative",
                    selectedField?.id === field.id
                      ? "border-orange-500 shadow-lg shadow-orange-500/20"
                      : "border-slate-200 hover:border-orange-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Drag Handle */}
                    <button className="mt-0.5 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    </button>

                    {/* Field Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-slate-900">
                          {field.label}
                          {field.validation?.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {/* Edit Icon - Always visible on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onFieldSelect(field);
                          }}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-100 text-orange-600"
                          title="Edit field properties"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {field.description && (
                        <p className="text-xs text-slate-500 mb-2">{field.description}</p>
                      )}
                      
                      {/* Field Preview based on type */}
                      <FieldPreview field={field} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFieldDuplicate(field);
                        }}
                        className="h-7 w-7 p-0"
                        title="Duplicate field"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFieldDelete(field.id);
                        }}
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                        title="Delete field"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field Preview Component
const FieldPreview = ({ field }: { field: FormField }) => {
  const baseInputClass = "w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-slate-50";

  switch (field.type) {
    case 'short-text':
    case 'email':
    case 'phone':
      return (
        <input
          type="text"
          placeholder={field.placeholder || 'Your answer'}
          className={baseInputClass}
          disabled
        />
      );
    
    case 'long-text':
      return (
        <textarea
          placeholder={field.placeholder || 'Your answer'}
          className={cn(baseInputClass, "min-h-[100px] resize-none")}
          disabled
        />
      );
    
    case 'number':
      return (
        <input
          type="number"
          placeholder={field.placeholder || '0'}
          className={baseInputClass}
          disabled
        />
      );
    
    case 'date':
      return (
        <input
          type="date"
          className={baseInputClass}
          disabled
        />
      );
    
    case 'multiple-choice':
      return (
        <div className="space-y-2">
          {(field.options || [{ id: '1', label: 'Option 1', value: 'option1' }]).map((option) => (
            <label key={option.id} className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="radio" name={field.id} className="w-4 h-4 text-orange-600" disabled />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </div>
      );
    
    case 'checkboxes':
      return (
        <div className="space-y-2">
          {(field.options || [{ id: '1', label: 'Option 1', value: 'option1' }]).map((option) => (
            <label key={option.id} className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" disabled />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </div>
      );
    
    case 'dropdown':
      return (
        <select className={baseInputClass} disabled>
          <option>Select an option</option>
          {(field.options || []).map((option) => (
            <option key={option.id} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    
    case 'rating':
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="text-slate-300 hover:text-orange-500 transition-colors"
              disabled
            >
              ★
            </button>
          ))}
        </div>
      );
    
    case 'file-upload':
      return (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-sm text-slate-500">Click or drag files to upload</p>
        </div>
      );
    
    case 'signature':
      return (
        <div className="border-2 border-slate-300 rounded-lg p-8 bg-slate-50">
          <p className="text-sm text-slate-500 text-center">Signature pad</p>
        </div>
      );
    
    default:
      return <div className="text-sm text-slate-400">Preview not available</div>;
  }
};

export default FormCanvas;
