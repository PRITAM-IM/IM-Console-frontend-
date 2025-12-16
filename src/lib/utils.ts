import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { subDays } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import type { DateRange } from "@/types";
import type { DateRangePreset } from "@/constants/dateRanges";

// Indian Standard Time (IST) timezone
const IST_TIMEZONE = "Asia/Kolkata";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get current date in Indian timezone (IST)
 * This ensures consistency with Google API data which uses account timezone
 */
export function getIndianDate(): Date {
  return toZonedTime(new Date(), IST_TIMEZONE);
}

/**
 * Format a date in Indian timezone
 */
export function formatIndianDate(date: Date, formatStr: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, IST_TIMEZONE, formatStr);
}

/**
 * Build date range for API queries
 * Uses Indian timezone to ensure consistency with data from Google services
 * 
 * IMPORTANT: Google Analytics data may have up to 48 hours delay
 * For most accurate comparison with dashboards, use "yesterday" as end date
 */
export function buildDateRange(
  preset: DateRangePreset | "last28days" | "last7days" | "last30days",
  customRange?: { startDate?: string; endDate?: string },
  options?: {
    useYesterdayAsEnd?: boolean; // Use yesterday to avoid incomplete data
    timezone?: string;
  }
): DateRange {
  // Get current date in Indian timezone
  const now = new Date();
  const todayInIST = toZonedTime(now, IST_TIMEZONE);

  // IMPORTANT: Date ranges exclude today and end on yesterday
  // Example: today is 2025/12/16, last 7 days = 2025/12/09 to 2025/12/15
  const yesterday = subDays(todayInIST, 1);
  const useYesterdayAsEnd = options?.useYesterdayAsEnd ?? true; // Default to true

  let endDate: Date = useYesterdayAsEnd ? yesterday : todayInIST;
  let startDate: Date;

  if (customRange?.startDate && customRange?.endDate) {
    return {
      startDate: customRange.startDate,
      endDate: customRange.endDate,
    };
  }

  switch (preset) {
    case "7d":
    case "last7days":
      // Last 7 complete days: yesterday minus 6 days
      startDate = subDays(endDate, 6);
      break;
    case "30d":
    case "last30days":
      // Last 30 complete days: yesterday minus 29 days
      startDate = subDays(endDate, 29);
      break;
    case "last28days":
      // Last 28 complete days: yesterday minus 27 days
      startDate = subDays(endDate, 27);
      break;
    case "custom":
      // Default to last 7 days if custom but no dates provided
      startDate = subDays(endDate, 6);
      break;
    default:
      startDate = subDays(endDate, 6);
  }

  return {
    startDate: formatInTimeZone(startDate, IST_TIMEZONE, "yyyy-MM-dd"),
    endDate: formatInTimeZone(endDate, IST_TIMEZONE, "yyyy-MM-dd"),
  };
}

/**
 * Get date range that matches Google Analytics dashboard exactly
 * Uses yesterday as end date to account for data processing delays
 */
export function buildAccurateDateRange(
  preset: DateRangePreset | "last28days" | "last7days" | "last30days",
  customRange?: { startDate?: string; endDate?: string }
): DateRange {
  return buildDateRange(preset, customRange, { useYesterdayAsEnd: true });
}
