import { NativeSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Flame, Snowflake, Trash2, CheckCircle2 } from "lucide-react";

export type CRMStatus = "Hot Lead" | "Cold Lead" | "Junk Lead" | "Closed" | "";

interface StatusDropdownProps {
  value: string;
  onChange: (status: CRMStatus) => void;
  disabled?: boolean;
  className?: string;
}

const StatusDropdown = ({ value, onChange, disabled, className }: StatusDropdownProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Hot Lead":
        return {
          color: "text-red-700 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-300 shadow-md hover:shadow-lg",
          icon: <Flame className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "🔥 Hot Lead"
        };
      case "Cold Lead":
        return {
          color: "text-blue-700 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-300 shadow-md hover:shadow-lg",
          icon: <Snowflake className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "❄️ Cold Lead"
        };
      case "Junk Lead":
        return {
          color: "text-gray-700 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 border-2 border-gray-300 shadow-md hover:shadow-lg",
          icon: <Trash2 className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "🗑️ Junk Lead"
        };
      case "Closed":
        return {
          color: "text-green-700 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-400 shadow-md hover:shadow-lg",
          icon: <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "✅ Closed"
        };
      default:
        return {
          color: "text-slate-600 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-300 hover:border-green-400 hover:shadow-md",
          icon: null,
          label: "📋 Select Status"
        };
    }
  };

  const config = getStatusConfig(value);

  return (
    <div className="relative group">
      <NativeSelect
        value={value}
        onChange={(e) => onChange(e.target.value as CRMStatus)}
        disabled={disabled}
        className={cn(
          "h-10 w-full min-w-[170px] text-xs font-bold cursor-pointer transition-all duration-300",
          "rounded-xl px-4 py-2.5",
          "focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:scale-[1.02]",
          config.color,
          value === "Hot Lead" && "focus:ring-red-400",
          value === "Cold Lead" && "focus:ring-blue-400",
          value === "Junk Lead" && "focus:ring-gray-400",
          value === "Closed" && "focus:ring-green-400",
          !value && "focus:ring-green-400",
          className
        )}
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem"
        }}
      >
        <option value="" className="text-slate-700 bg-white">📋 Select Status</option>
        <option value="Hot Lead" className="text-red-700 bg-white">🔥 Hot Lead</option>
        <option value="Cold Lead" className="text-blue-700 bg-white">❄️ Cold Lead</option>
        <option value="Junk Lead" className="text-gray-700 bg-white">🗑️ Junk Lead</option>
        <option value="Closed" className="text-green-700 bg-white">✅ Closed</option>
      </NativeSelect>
      
      {/* Enhanced Hover indicator */}
      {!disabled && (
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-green-400/60" />
      )}
    </div>
  );
};

export default StatusDropdown;
