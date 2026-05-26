export const SERVICES = {
  "corte-cabello": { label: "Corte de cabello", color: "#8b5cf6" },
  tinte: { label: "Tinte y color", color: "#ec4899" },
  manicura: { label: "Manicura", color: "#f97316" },
  pedicura: { label: "Pedicura", color: "#14b8a6" },
  "masaje-relajante": { label: "Masaje relajante", color: "#0ea5e9" },
  "depilacion-laser": { label: "Depilación láser", color: "#ef4444" },
  "tratamiento-facial": { label: "Tratamiento facial", color: "#06b6d4" },
  "cejas-pestanas": { label: "Cejas y pestañas", color: "#a855f7" },
} as const;

export type ServiceSlug = keyof typeof SERVICES;

export function serviceLabel(slug: string) {
  return SERVICES[slug as ServiceSlug]?.label ?? slug;
}

export function serviceColor(slug: string) {
  return SERVICES[slug as ServiceSlug]?.color ?? "#94a3b8";
}
