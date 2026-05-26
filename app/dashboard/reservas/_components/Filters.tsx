"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { SERVICES } from "@/lib/services";

function toValue(value: string | null) {
  return value ?? "";
}

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const paramsKey = params.toString();

  const [search, setSearch] = useState(() => toValue(params.get("q")));
  const [status, setStatus] = useState(() => params.get("status") ?? "all");
  const [service, setService] = useState(() => params.get("service") ?? "all");
  const [sort, setSort] = useState(() => params.get("sort") ?? "newest");

  useEffect(() => {
    setSearch(toValue(params.get("q")));
    setStatus(params.get("status") ?? "all");
    setService(params.get("service") ?? "all");
    setSort(params.get("sort") ?? "newest");
  }, [paramsKey]);

  const applyParams = useMemo(
    () => (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    applyParams("q", value);
  }, 300);

  return (
    <section className="glass-panel rounded-3xl p-4 md:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              debouncedSearch(value);
            }}
            placeholder="Buscar por nombre o teléfono…"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-auto xl:grid-cols-3">
          <select
            value={status}
            onChange={(event) => {
              const value = event.target.value;
              setStatus(value);
              applyParams("status", value);
            }}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>

          <select
            value={service}
            onChange={(event) => {
              const value = event.target.value;
              setService(value);
              applyParams("service", value);
            }}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          >
            <option value="all">Todos los servicios</option>
            {Object.entries(SERVICES).map(([slug, serviceData]) => (
              <option key={slug} value={slug}>
                {serviceData.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => {
              const value = event.target.value;
              setSort(value);
              applyParams("sort", value);
            }}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="slot">Por franja horaria</option>
          </select>
        </div>
      </div>
    </section>
  );
}
