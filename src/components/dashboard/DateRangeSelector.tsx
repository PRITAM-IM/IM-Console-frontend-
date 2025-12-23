import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DATE_RANGE_OPTIONS } from "@/constants/dateRanges";
import type { DateRangePreset } from "@/constants/dateRanges";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, subDays } from "date-fns";

// Full control pattern - with Apply button
interface FullControlProps {
  preset: DateRangePreset;
  onPresetChange: (value: DateRangePreset) => void;
  customRange: { startDate?: string; endDate?: string };
  onCustomChange: (field: "startDate" | "endDate", value: string) => void;
  onApply: () => void;
  disabled?: boolean;
  onDateRangeChange?: never;
}

// Simple pattern - instant change on select
interface SimpleProps {
  onDateRangeChange: (preset: DateRangePreset) => void;
  disabled?: boolean;
  preset?: never;
  onPresetChange?: never;
  customRange?: never;
  onCustomChange?: never;
  onApply?: never;
}

type DateRangeSelectorProps = FullControlProps | SimpleProps;

const DateRangeSelector = (props: DateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempPreset, setTempPreset] = useState<DateRangePreset>("7d");
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);

  // Simple pattern - instant change (no calendar needed)
  if ('onDateRangeChange' in props && props.onDateRangeChange) {
    const { onDateRangeChange, disabled } = props;
    return (
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-slate-500" />
        <select
          onChange={(event) => onDateRangeChange(event.target.value as DateRangePreset)}
          disabled={disabled}
          className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm"
          defaultValue="7d"
        >
          {DATE_RANGE_OPTIONS.filter(opt => opt.value !== 'custom').map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Full control pattern - with calendar
  const { preset, onPresetChange, customRange, onCustomChange, onApply, disabled } = props as FullControlProps;

  const getDisplayText = () => {
    if (preset === "custom" && customRange.startDate && customRange.endDate) {
      return `${customRange.startDate} - ${customRange.endDate}`;
    }
    const option = DATE_RANGE_OPTIONS.find(opt => opt.value === preset);
    return option?.label || "Select Date";
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTempPreset(preset);
    // Initialize temp dates based on current preset
    if (preset === "custom" && customRange.startDate && customRange.endDate) {
      setTempStartDate(new Date(customRange.startDate));
      setTempEndDate(new Date(customRange.endDate));
    } else {
      // Calculate dates for preset
      const today = new Date();
      const yesterday = subDays(today, 1);
      let start = yesterday;

      switch (preset) {
        case "7d":
        case "last7days":
          start = subDays(yesterday, 6);
          break;
        case "last28days":
          start = subDays(yesterday, 27);
          break;
        case "30d":
        case "last30days":
          start = subDays(yesterday, 29);
          break;
        case "last90days":
          start = subDays(yesterday, 89);
          break;
        case "last180days":
          start = subDays(yesterday, 179);
          break;
      }

      setTempStartDate(start);
      setTempEndDate(yesterday);
    }
    setSelectingStart(true);
  };

  const handlePresetClick = (value: DateRangePreset) => {
    setTempPreset(value);

    if (value === "custom") {
      setTempStartDate(null);
      setTempEndDate(null);
      setSelectingStart(true);
    } else {
      // Calculate dates for preset
      const today = new Date();
      const yesterday = subDays(today, 1);
      let start = yesterday;

      switch (value) {
        case "7d":
        case "last7days":
          start = subDays(yesterday, 6);
          break;
        case "last28days":
          start = subDays(yesterday, 27);
          break;
        case "30d":
        case "last30days":
          start = subDays(yesterday, 29);
          break;
        case "last90days":
          start = subDays(yesterday, 89);
          break;
        case "last180days":
          start = subDays(yesterday, 179);
          break;
      }

      setTempStartDate(start);
      setTempEndDate(yesterday);
    }
  };

  const handleDateClick = (date: Date) => {
    if (tempPreset !== "custom") return;

    if (selectingStart) {
      setTempStartDate(date);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (tempStartDate && date < tempStartDate) {
        setTempStartDate(date);
        setTempEndDate(null);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleApply = () => {
    if (tempPreset === "custom") {
      if (tempStartDate && tempEndDate) {
        onCustomChange("startDate", format(tempStartDate, "yyyy-MM-dd"));
        onCustomChange("endDate", format(tempEndDate, "yyyy-MM-dd"));
        onPresetChange("custom");
        onApply();
        setIsOpen(false);
      }
    } else {
      onPresetChange(tempPreset);
      onApply();
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTempPreset(preset);
    setTempStartDate(null);
    setTempEndDate(null);
    setSelectingStart(true);
  };

  // Generate calendar days for two months
  const generateCalendarDays = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    // Add padding days from previous month
    const startDay = start.getDay();
    const paddingDays = [];
    for (let i = 0; i < startDay; i++) {
      paddingDays.push(null);
    }

    return [...paddingDays, ...days];
  };

  const currentMonthDays = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);
  const nextMonthDays = useMemo(() => generateCalendarDays(addMonths(currentMonth, 1)), [currentMonth]);

  const isDateInRange = (date: Date) => {
    if (!tempStartDate) return false;
    if (!tempEndDate) return isSameDay(date, tempStartDate);
    return isWithinInterval(date, { start: tempStartDate, end: tempEndDate });
  };

  const isDateSelected = (date: Date) => {
    return (tempStartDate && isSameDay(date, tempStartDate)) ||
      (tempEndDate && isSameDay(date, tempEndDate));
  };

  const renderCalendar = (month: Date, days: (Date | null)[]) => (
    <div className="min-w-[240px]">
      {/* Month Header */}
      <div className="text-center mb-3">
        <span className="text-sm font-semibold text-slate-900">
          {format(month, "MMMM / yyyy")}
        </span>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-[10px] font-semibold text-slate-600 py-1 w-8">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="w-8 h-8" />;
          }

          const isInRange = isDateInRange(date);
          const isSelected = isDateSelected(date);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={tempPreset !== "custom"}
              className={`w-8 h-8 text-xs font-medium rounded transition-all flex items-center justify-center ${isSelected
                  ? 'bg-purple-600 text-white font-bold'
                  : isInRange
                    ? 'bg-purple-100 text-purple-900'
                    : isToday
                      ? 'border-2 border-purple-600 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                } ${tempPreset !== "custom" ? 'cursor-default' : 'cursor-pointer hover:border hover:border-purple-300'}`}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Compact Button */}
      <button
        onClick={handleOpen}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CalendarDays className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={handleCancel}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex">
                {/* Calendar Section - Always Visible */}
                <div className="p-4 border-r border-slate-200">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-slate-700" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-slate-700" />
                    </button>
                  </div>

                  {/* Two Month Calendars */}
                  <div className="flex gap-4">
                    {renderCalendar(currentMonth, currentMonthDays)}
                    {renderCalendar(addMonths(currentMonth, 1), nextMonthDays)}
                  </div>
                </div>

                {/* Preset Options - Right Side */}
                <div className="p-4 w-52">
                  <div className="space-y-1.5">
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePresetClick(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${tempPreset === option.value
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cancel/Apply Buttons - Always at Bottom */}
              <div className="flex gap-3 p-3 border-t border-slate-200 bg-slate-50">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={tempPreset === "custom" && (!tempStartDate || !tempEndDate)}
                  className="flex-1 h-9 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeSelector;
