// The backend mounts every module under /api/v1 (see goldenvoice-backend app.ts).
// Mirrors Prisma enums and models from goldenvoice-backend/prisma/schema.prisma

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export const DEFAULT_PAGE_SIZE = 20;

// Mirrors WorkStatus enum from backend
export const WORK_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

// Mirrors WorkType enum from backend
export const WORK_TYPE_ENUM = {
  ANIME: "ANIME",
  GAME: "GAME",
  ENTERTAINMENT: "ENTERTAINMENT",
  DRAMA: "DRAMA",
  EDUCATION: "EDUCATION",
  ORIGINAL: "ORIGINAL",
} as const;

// Mirrors UserRole enum from backend
export const USER_ROLE = {
  VISITOR: "VISITOR",
  MEMBER: "MEMBER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
} as const;
