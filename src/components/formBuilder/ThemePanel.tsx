import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormTemplate } from "@/types/formBuilder";

interface ThemePanelProps {
  template: FormTemplate;
  onThemeUpdate: (theme: FormTemplate['theme']) => void;
  onClose: () => void;
}

const themes = [
  {
    name: "Orange Pop",
    accentColor: "#f97316",
    mode: "light" as const,
    preview: "from-orange-500 to-red-600"
  },
  {
    name: "Ocean Blue",
    accentColor: "#0ea5e9",
    mode: "light" as const,
    preview: "from-blue-500 to-cyan-600"
  },
  {
    name: "Forest Green",
    accentColor: "#22c55e",
    mode: "light" as const,
    preview: "from-green-500 to-emerald-600"
  },
  {
    name: "Royal Purple",
    accentColor: "#a855f7",
    mode: "light" as const,
    preview: "from-purple-500 to-violet-600"
  },
  {
    name: "Sunset Pink",
    accentColor: "#ec4899",
    mode: "light" as const,
    preview: "from-pink-500 to-rose-600"
  },
  {
    name: "Dark Mode",
    accentColor: "#f97316",
    mode: "dark" as const,
    preview: "from-slate-800 to-slate-900"
  },
  {
    name: "Midnight Blue",
    accentColor: "#3b82f6",
    mode: "dark" as const,
    preview: "from-blue-900 to-indigo-900"
  },
  {
    name: "Deep Purple",
    accentColor: "#8b5cf6",
    mode: "dark" as const,
    preview: "from-purple-900 to-violet-900"
  },
  {
    name: "Emerald Night",
    accentColor: "#10b981",
    mode: "dark" as const,
    preview: "from-emerald-900 to-teal-900"
  },
  {
    name: "Cherry Red",
    accentColor: "#ef4444",
    mode: "light" as const,
    preview: "from-red-500 to-orange-600"
  },
  {
    name: "Teal Fresh",
    accentColor: "#14b8a6",
    mode: "light" as const,
    preview: "from-teal-500 to-cyan-600"
  },
  {
    name: "Amber Warmth",
    accentColor: "#f59e0b",
    mode: "light" as const,
    preview: "from-amber-500 to-yellow-600"
  }
];

const ThemePanel = ({ template, onThemeUpdate, onClose }: ThemePanelProps) => {
  const currentTheme = template.theme;

  const handleThemeSelect = (theme: typeof themes[0]) => {
    onThemeUpdate({
      accentColor: theme.accentColor,
      mode: theme.mode
    });
  };

  return (
    <div className="w-80 border-l-2 border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Form Theme</h3>
          <p className="text-xs text-slate-500 mt-0.5">Customize your form appearance</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Theme Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {themes.map((theme) => {
            const isSelected = 
              currentTheme.accentColor === theme.accentColor && 
              currentTheme.mode === theme.mode;

            return (
              <button
                key={theme.name}
                onClick={() => handleThemeSelect(theme)}
                className={cn(
                  "relative group text-left rounded-xl border-2 overflow-hidden transition-all",
                  isSelected
                    ? "border-orange-500 shadow-lg shadow-orange-500/20"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                )}
              >
                {/* Theme Preview */}
                <div className={cn(
                  "h-20 bg-gradient-to-br flex items-center justify-center p-4",
                  theme.preview
                )}>
                  {/* Mock Form Elements */}
                  <div className={cn(
                    "w-full max-w-[200px] rounded-lg p-3 space-y-2",
                    theme.mode === 'dark' ? 'bg-slate-800' : 'bg-white'
                  )}>
                    <div className={cn(
                      "h-2 rounded-full",
                      theme.mode === 'dark' ? 'bg-slate-600' : 'bg-slate-200'
                    )} style={{ width: '80%' }}></div>
                    <div className={cn(
                      "h-6 rounded border-2",
                      theme.mode === 'dark' ? 'border-slate-600' : 'border-slate-200'
                    )}></div>
                    <div 
                      className="h-6 rounded text-xs flex items-center justify-center font-semibold text-white"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Button
                    </div>
                  </div>
                </div>

                {/* Theme Name */}
                <div className="p-3 bg-white">
                  <p className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-orange-600" : "text-slate-900"
                  )}>
                    {theme.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize mt-0.5">
                    {theme.mode} mode
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selection Info */}
      <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Current Theme</p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {themes.find(t => t.accentColor === currentTheme.accentColor && t.mode === currentTheme.mode)?.name || 'Custom'}
            </p>
          </div>
          <div 
            className="w-12 h-12 rounded-lg border-2 border-slate-300 shadow-md"
            style={{ backgroundColor: currentTheme.accentColor }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
