import { motion } from "framer-motion";
import { GripVertical, Trash2, Copy, Settings } from "lucide-react";
import type { FormField, FormPage } from "@/types/formBuilder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormCanvasProps {
  currentPage: FormPage;
  onFieldSelect: (field: FormField) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldDuplicate: (field: FormField) => void;
  selectedField: FormField | null;
}

const FormCanvas = ({ 
  currentPage, 
  onFieldSelect, 
  onFieldDelete, 
  onFieldDuplicate,
  selectedField 
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

  return (
    <div 
      className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto overflow-x-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{currentPage.name}</h2>
          {currentPage.description && (
            <p className="text-slate-600 mt-2">{currentPage.description}</p>
          )}
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {currentPage.fields.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Settings className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No fields yet</h3>
              <p className="text-slate-500">
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
                    "bg-white rounded-xl p-5 border-2 transition-all duration-200 group",
                    selectedField?.id === field.id
                      ? "border-orange-500 shadow-lg shadow-orange-500/20"
                      : "border-slate-200 hover:border-orange-300 hover:shadow-md"
                  )}
                  onClick={() => onFieldSelect(field)}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <button className="mt-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-5 w-5 text-slate-400" />
                    </button>

                    {/* Field Content */}
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        {field.label}
                        {field.validation?.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.description && (
                        <p className="text-xs text-slate-500 mb-3">{field.description}</p>
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
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFieldDelete(field.id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
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
