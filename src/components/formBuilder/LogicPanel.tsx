import { useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormField, FormPage } from "@/types/formBuilder";

interface ConditionalLogic {
  id: string;
  triggerFieldId: string;
  triggerCondition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  triggerValue?: any;
  action: 'show' | 'hide' | 'require' | 'skip_to_page';
  targetFieldIds?: string[];
  targetPageId?: string;
}

interface LogicPanelProps {
  field: FormField | null;
  allPages: FormPage[];
  currentPageIndex: number;
  onUpdateLogic: (fieldId: string, logic: ConditionalLogic[]) => void;
}

const LogicPanel = ({ field, allPages, currentPageIndex, onUpdateLogic }: LogicPanelProps) => {
  const [logicRules, setLogicRules] = useState<ConditionalLogic[]>(
    field?.conditionalLogic || []
  );

  if (!field) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 border-l border-slate-200">
        <div className="text-center p-8">
          <Zap className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Select a field to add conditional logic</p>
        </div>
      </div>
    );
  }

  const currentPage = allPages[currentPageIndex];
  const availableFields = currentPage.fields.filter(f => f.id !== field.id);

  const addLogicRule = () => {
    const newRule: ConditionalLogic = {
      id: `logic-${Date.now()}`,
      triggerFieldId: availableFields[0]?.id || '',
      triggerCondition: 'equals',
      triggerValue: '',
      action: 'show',
      targetFieldIds: [field.id]
    };

    const updatedRules = [...logicRules, newRule];
    setLogicRules(updatedRules);
    onUpdateLogic(field.id, updatedRules);
  };

  const removeLogicRule = (ruleId: string) => {
    const updatedRules = logicRules.filter(r => r.id !== ruleId);
    setLogicRules(updatedRules);
    onUpdateLogic(field.id, updatedRules);
  };

  const updateLogicRule = (ruleId: string, updates: Partial<ConditionalLogic>) => {
    const updatedRules = logicRules.map(r => 
      r.id === ruleId ? { ...r, ...updates } : r
    );
    setLogicRules(updatedRules);
    onUpdateLogic(field.id, updatedRules);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-b from-purple-50 to-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-purple-100">
            <Zap className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Conditional Logic</h3>
        </div>
        <p className="text-xs text-slate-600">
          Show/hide fields based on user responses
        </p>
      </div>

      {/* Logic Rules */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logicRules.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-sm text-slate-600 mb-4">No logic rules yet</p>
            <Button onClick={addLogicRule} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Logic Rule
            </Button>
          </div>
        ) : (
          <>
            {logicRules.map((rule, index) => (
              <div key={rule.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Rule {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLogicRule(rule.id)}
                    className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Trigger Field */}
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">When field</label>
                  <select
                    value={rule.triggerFieldId}
                    onChange={(e) => updateLogicRule(rule.id, { triggerFieldId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {availableFields.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Condition</label>
                  <select
                    value={rule.triggerCondition}
                    onChange={(e) => updateLogicRule(rule.id, { triggerCondition: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    <label className="text-xs font-medium text-slate-700 mb-1 block">Value</label>
                    <Input
                      value={rule.triggerValue || ''}
                      onChange={(e) => updateLogicRule(rule.id, { triggerValue: e.target.value })}
                      placeholder="Enter value..."
                      className="text-sm"
                    />
                  </div>
                )}

                {/* Action */}
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Then</label>
                  <select
                    value={rule.action}
                    onChange={(e) => updateLogicRule(rule.id, { action: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="show">Show this field</option>
                    <option value="hide">Hide this field</option>
                    <option value="require">Make this field required</option>
                    <option value="skip_to_page">Skip to page</option>
                  </select>
                </div>

                {/* Target Page (if skip_to_page) */}
                {rule.action === 'skip_to_page' && (
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1 block">Target Page</label>
                    <select
                      value={rule.targetPageId || ''}
                      onChange={(e) => updateLogicRule(rule.id, { targetPageId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {allPages.map(page => (
                        <option key={page.id} value={page.id}>{page.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}

            <Button onClick={addLogicRule} size="sm" variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Another Rule
            </Button>
          </>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-600">
          💡 Logic rules are evaluated in order. The first matching rule will be applied.
        </p>
      </div>
    </div>
  );
};

export default LogicPanel;
