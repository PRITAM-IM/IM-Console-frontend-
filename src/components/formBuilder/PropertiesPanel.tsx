import { X, Plus, Trash2, ChevronDown, ChevronRight, Zap } from "lucide-react";
import type { FormField, FieldOption, FormPage, ConditionalLogic } from "@/types/formBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onFieldUpdate: (field: FormField) => void;
  onClose: () => void;
  allPages?: FormPage[];
  currentPageIndex?: number;
  onUpdateLogic?: (fieldId: string, logic: ConditionalLogic[]) => void;
}

const PropertiesPanel = ({ 
  selectedField, 
  onFieldUpdate, 
  onClose,
  allPages,
  currentPageIndex,
  onUpdateLogic 
}: PropertiesPanelProps) => {
  const [showLogicSection, setShowLogicSection] = useState(false);
  
  // Hide panel when no field is selected
  if (!selectedField) {
    return null;
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

        {/* Conditional Logic Section - Collapsible */}
        {allPages && onUpdateLogic && (
          <div className="border-t-2 border-slate-200 pt-4 mt-4">
            <button
              onClick={() => setShowLogicSection(!showLogicSection)}
              className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-slate-900">Conditional Logic</span>
              </div>
              {showLogicSection ? (
                <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-purple-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-purple-600" />
              )}
            </button>

            {showLogicSection && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-slate-600 px-3">
                  Show/hide this field based on user responses
                </p>
                
                {/* Display existing logic rules */}
                <div className="space-y-3">
                  {selectedField.conditionalLogic && selectedField.conditionalLogic.length > 0 ? (
                    selectedField.conditionalLogic.map((rule, index) => {
                      const currentPage = allPages[currentPageIndex || 0];

                      
                      return (
                        <div key={rule.id} className="p-4 bg-purple-50/50 rounded-lg border border-purple-200 space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-700">Rule {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedLogic = selectedField.conditionalLogic?.filter(r => r.id !== rule.id) || [];
                                onUpdateLogic(selectedField.id, updatedLogic);
                                onFieldUpdate({
                                  ...selectedField,
                                  conditionalLogic: updatedLogic
                                });
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          {/* Trigger Field */}
                          <div>
                            <Label className="text-xs font-medium text-slate-700">When field</Label>
                            <select
                              value={rule.triggerFieldId}
                              onChange={(e) => {
                                const updatedLogic = selectedField.conditionalLogic?.map(r =>
                                  r.id === rule.id ? { ...r, triggerFieldId: e.target.value } : r
                                ) || [];
                                onUpdateLogic(selectedField.id, updatedLogic);
                                onFieldUpdate({
                                  ...selectedField,
                                  conditionalLogic: updatedLogic
                                });
                              }}
                              className="w-full mt-1 px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              {currentPage.fields
                                .filter(f => f.id !== selectedField.id)
                                .map(f => (
                                  <option key={f.id} value={f.id}>{f.label}</option>
                                ))}
                            </select>
                          </div>

                          {/* Condition */}
                          <div>
                            <Label className="text-xs font-medium text-slate-700">Condition</Label>
                            <select
                              value={rule.triggerCondition}
                              onChange={(e) => {
                                const updatedLogic = selectedField.conditionalLogic?.map(r =>
                                  r.id === rule.id ? { ...r, triggerCondition: e.target.value as any } : r
                                ) || [];
                                onUpdateLogic(selectedField.id, updatedLogic);
                                onFieldUpdate({
                                  ...selectedField,
                                  conditionalLogic: updatedLogic
                                });
                              }}
                              className="w-full mt-1 px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="equals">Equals</option>
                              <option value="not_equals">Does not equal</option>
                              <option value="contains">Contains</option>
                              <option value="greater_than">Greater than</option>
                              <option value="less_than">Less than</option>
                              <option value="is_empty">Is empty</option>
                              <option value="is_not_empty">Is not empty</option>
                            </select>
                          </div>

                          {/* Value (only for certain conditions) */}
                          {!['is_empty', 'is_not_empty'].includes(rule.triggerCondition) && (
                            <div>
                              <Label className="text-xs font-medium text-slate-700">Value</Label>
                              <Input
                                value={rule.triggerValue || ''}
                                onChange={(e) => {
                                  const updatedLogic = selectedField.conditionalLogic?.map(r =>
                                    r.id === rule.id ? { ...r, triggerValue: e.target.value } : r
                                  ) || [];
                                  onUpdateLogic(selectedField.id, updatedLogic);
                                  onFieldUpdate({
                                    ...selectedField,
                                    conditionalLogic: updatedLogic
                                  });
                                }}
                                placeholder="Enter value..."
                                className="mt-1 text-sm border-2"
                              />
                            </div>
                          )}

                          {/* Action */}
                          <div>
                            <Label className="text-xs font-medium text-slate-700">Then</Label>
                            <select
                              value={rule.action}
                              onChange={(e) => {
                                const updatedLogic = selectedField.conditionalLogic?.map(r =>
                                  r.id === rule.id ? { ...r, action: e.target.value as any } : r
                                ) || [];
                                onUpdateLogic(selectedField.id, updatedLogic);
                                onFieldUpdate({
                                  ...selectedField,
                                  conditionalLogic: updatedLogic
                                });
                              }}
                              className="w-full mt-1 px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="show">Show this field</option>
                              <option value="hide">Hide this field</option>
                              <option value="require">Make this field required</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-slate-500 italic px-3">
                      No logic rules yet
                    </div>
                  )}
                </div>
                
                {/* Add Logic Rule Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    const currentPage = allPages[currentPageIndex || 0];
                    const availableFields = currentPage.fields.filter(f => f.id !== selectedField.id);
                    
                    if (availableFields.length > 0) {
                      const newRule: ConditionalLogic = {
                        id: `logic-${Date.now()}`,
                        triggerFieldId: availableFields[0].id,
                        triggerCondition: 'equals',
                        triggerValue: '',
                        action: 'show',
                        targetFieldIds: [selectedField.id]
                      };
                      
                      const updatedLogic = [
                        ...(selectedField.conditionalLogic || []),
                        newRule
                      ];
                      
                      onUpdateLogic(selectedField.id, updatedLogic);
                      onFieldUpdate({
                        ...selectedField,
                        conditionalLogic: updatedLogic
                      });
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Logic Rule
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
