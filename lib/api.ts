import type { Booking, BookingCounts, BookingFilters, BookingStatus } from "./types";
import { mockApi } from "./mock-data";

const BACKEND_URL = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(
  /\/$/,
  "",
);

function buildUrl(path: string, query?: Record<string, string | undefined>) {
  if (!BACKEND_URL) {
    return path;
  }

  const url = new URL(path, BACKEND_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

function outgoingHeaders() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Backend's ApiKeyGuard authenticates server-to-server via x-api-key (not cookies).
  const apiKey = process.env.BACKEND_API_KEY;
  if (apiKey) {
    headers.set("x-api-key", apiKey);
  }

  return headers;
}

async function requestJson<T>(path: string, init: RequestInit = {}, query?: Record<string, string | undefined>) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not configured");
  }

  const forwardedHeaders = outgoingHeaders();
  const response = await fetch(buildUrl(path, query), {
    ...init,
    cache: "no-store",
    headers: {
      ...Object.fromEntries(forwardedHeaders.entries()),
      ...(init.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Backend request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchBookings(filters: BookingFilters): Promise<Booking[]> {
  if (!BACKEND_URL) {
    return mockApi.fetchBookings(filters);
  }

  return requestJson<Booking[]>("/bookings", {}, {
    q: filters.q,
    status: filters.status,
    service: filters.service,
    sort: filters.sort,
  });
}

export async function fetchBookingCounts(): Promise<BookingCounts> {
  if (!BACKEND_URL) {
    return mockApi.fetchBookingCounts();
  }

  return requestJson<BookingCounts>("/bookings/stats");
}

export async function fetchBookingById(id: string): Promise<Booking | null> {
  if (!BACKEND_URL) {
    return mockApi.fetchBookingById(id);
  }

  const response = await fetch(buildUrl(`/bookings/${id}`), {
    cache: "no-store",
    headers: Object.fromEntries(outgoingHeaders().entries()),
  });

  // A missing booking is a clean 404 → null so the page can call notFound().
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Backend request failed with status ${response.status}`);
  }

  return (await response.json()) as Booking;
}

export async function patchBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  if (!BACKEND_URL) {
    return mockApi.patchBookingStatus(id, status);
  }

  return requestJson<Booking>(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function hasBackend() {
  return Boolean(BACKEND_URL);
}
