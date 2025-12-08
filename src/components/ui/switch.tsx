import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      onCheckedChange?.(newChecked);
      props.onChange?.(e);
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer",
            "peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white",
            "after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300",
            "after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
            "peer-checked:bg-orange-600",
            className
          )}
        ></div>
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
