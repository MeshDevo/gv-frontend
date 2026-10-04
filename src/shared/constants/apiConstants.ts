// The backend mounts every module under /api/v1 (see goldenvoice-backend app.ts).
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const DEFAULT_PAGE_SIZE = 20;
