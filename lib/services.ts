export const SERVICES = {
  reset_head: { label: "Reset Head", color: "#0ea5e9" },
  supreme_head: { label: "Supreme Head", color: "#8b5cf6" },
  harmony_head: { label: "Harmony Head", color: "#14b8a6" },
  masaje_relajante: { label: "Masaje relajante", color: "#f97316" },
  masaje_balines: { label: "Masaje balinés", color: "#ec4899" },
  eternal_facial: { label: "Eternal Facial", color: "#06b6d4" },
} as const;

export type ServiceSlug = keyof typeof SERVICES;

export function serviceLabel(slug: string) {
  return SERVICES[slug as ServiceSlug]?.label ?? slug;
}

export function serviceColor(slug: string) {
  return SERVICES[slug as ServiceSlug]?.color ?? "#94a3b8";
}
