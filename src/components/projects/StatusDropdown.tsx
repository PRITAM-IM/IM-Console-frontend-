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
          color: "text-red-700 bg-gradient-to-r from-red-50 to-orange-50 border-red-300 shadow-sm shadow-red-100",
          icon: <Flame className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "🔥 Hot Lead"
        };
      case "Cold Lead":
        return {
          color: "text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 shadow-sm shadow-blue-100",
          icon: <Snowflake className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "❄️ Cold Lead"
        };
      case "Junk Lead":
        return {
          color: "text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-sm shadow-gray-100",
          icon: <Trash2 className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "🗑️ Junk Lead"
        };
      case "Closed":
        return {
          color: "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm shadow-green-100",
          icon: <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />,
          label: "✅ Closed"
        };
      default:
        return {
          color: "text-slate-600 bg-white border-slate-300 hover:border-green-400 hover:bg-green-50/30 shadow-sm",
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
          "h-10 w-full min-w-[160px] text-xs font-bold cursor-pointer transition-all duration-200",
          "rounded-lg px-3 py-2",
          "focus:ring-2 focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          config.color,
          value === "Hot Lead" && "focus:ring-red-300",
          value === "Cold Lead" && "focus:ring-blue-300",
          value === "Junk Lead" && "focus:ring-gray-300",
          value === "Closed" && "focus:ring-green-300",
          !value && "focus:ring-green-300",
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
      
      {/* Hover indicator */}
      {!disabled && (
        <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-2 ring-green-300/50" />
      )}
    </div>
  );
};

export default StatusDropdown;
