export const SHIFT_LABELS = {
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
  full: "Integral",
} as const;

export const SHIFT_OPTIONS = [
  { label: SHIFT_LABELS.morning, value: "morning" },
  { label: SHIFT_LABELS.afternoon, value: "afternoon" },
  { label: SHIFT_LABELS.evening, value: "evening" },
  { label: SHIFT_LABELS.full, value: "full" },
] as const;
