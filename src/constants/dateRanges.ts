export type DateRangePreset = "7d" | "30d" | "last28days" | "last7days" | "last30days" | "last90days" | "last180days" | "custom";

export const DATE_RANGE_OPTIONS: Array<{
  label: string;
  value: DateRangePreset;
}> = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 28 days", value: "last28days" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 3 months", value: "last90days" },
    { label: "Last 6 months", value: "last180days" },
    { label: "Custom range", value: "custom" },
  ];

