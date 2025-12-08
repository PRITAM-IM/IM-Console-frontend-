import { X, Plus, Trash2 } from "lucide-react";
import type { FormField, FieldOption } from "@/types/formBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onFieldUpdate: (field: FormField) => void;
  onClose: () => void;
}

const PropertiesPanel = ({ selectedField, onFieldUpdate, onClose }: PropertiesPanelProps) => {
  if (!selectedField) {
    return (
      <div className="w-80 border-l border-slate-200 bg-white flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <X className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const hasOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(selectedField.type);

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate({ ...selectedField, ...updates });
  };

  const updateValidation = (key: string, value: unknown) => {
    onFieldUpdate({
      ...selectedField,
      validation: {
        ...selectedField.validation,
        [key]: value
      }
    });
  };

  const addOption = () => {
    const newOption: FieldOption = {
      id: `opt-${Date.now()}`,
      label: `Option ${(selectedField.options?.length || 0) + 1}`,
      value: `option-${(selectedField.options?.length || 0) + 1}`
    };
    updateField({
      options: [...(selectedField.options || []), newOption]
    });
  };

  const updateOption = (optionId: string, updates: Partial<FieldOption>) => {
    updateField({
      options: selectedField.options?.map(opt =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      )
    });
  };

  const deleteOption = (optionId: string) => {
    updateField({
      options: selectedField.options?.filter(opt => opt.id !== optionId)
    });
  };

  return (
    <div className="w-80 border-l-2 border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Field Settings</h3>
          <p className="text-xs text-slate-500 mt-0.5">{selectedField.type}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-xs font-bold text-slate-700 uppercase">
            Label
          </Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
            className="border-2"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="field-description" className="text-xs font-bold text-slate-700 uppercase">
            Description (Optional)
          </Label>
          <Textarea
            id="field-description"
            value={selectedField.description || ''}
            onChange={(e) => updateField({ description: e.target.value })}
            placeholder="Help text for this field"
            rows={3}
            className="border-2 resize-none"
          />
        </div>

        {/* Placeholder (for text fields) */}
        {['short-text', 'long-text', 'email', 'phone', 'number'].includes(selectedField.type) && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder" className="text-xs font-bold text-slate-700 uppercase">
              Placeholder
            </Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
              className="border-2"
            />
          </div>
        )}

        {/* Options (for choice fields) */}
        {hasOptions && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase">Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(selectedField.options || []).map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-6">{index + 1}.</span>
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(option.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="Option label"
                    className="border-2 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(option.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase">Validation</h4>
          
          {/* Required */}
          <div className="flex items-center justify-between">
            <Label htmlFor="field-required" className="text-sm font-medium text-slate-700">
              Required field
            </Label>
            <Switch
              id="field-required"
              checked={selectedField.validation?.required || false}
              onCheckedChange={(checked) => updateValidation('required', checked)}
            />
          </div>

          {/* Min/Max Length (for text fields) */}
          {['short-text', 'long-text'].includes(selectedField.type) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="field-min-length" className="text-xs font-bold text-slate-700 uppercase">
                  Min Length
                </Label>
                <Input
                  id="field-min-length"
                  type="number"
                  value={selectedField.validation?.minLength || ''}
                  onChange={(e) => updateValidation('minLength', parseInt(e.target.value) || undefined)}
                  placeholder="Min characters"
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field-max-length" className="text-xs font-bold text-slate-700 uppercase">
                  Max Length
                </Label>
                <Input
                  id="field-max-length"
                  type="number"
                  value={selectedField.validation?.maxLength || ''}
                  onChange={(e) => updateValidation('maxLength', parseInt(e.target.value) || undefined)}
                  placeholder="Max characters"
                  className="border-2"
                />
              </div>
            </>
          )}

          {/* Min/Max Value (for number fields) */}
          {selectedField.type === 'number' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="field-min" className="text-xs font-bold text-slate-700 uppercase">
                  Min Value
                </Label>
                <Input
                  id="field-min"
                  type="number"
                  value={selectedField.validation?.min || ''}
                  onChange={(e) => updateValidation('min', parseInt(e.target.value) || undefined)}
                  placeholder="Minimum value"
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field-max" className="text-xs font-bold text-slate-700 uppercase">
                  Max Value
                </Label>
                <Input
                  id="field-max"
                  type="number"
                  value={selectedField.validation?.max || ''}
                  onChange={(e) => updateValidation('max', parseInt(e.target.value) || undefined)}
                  placeholder="Maximum value"
                  className="border-2"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
