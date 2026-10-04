// Mirrors the Prisma enums and Work model in goldenvoice-backend.
export const WORK_TYPE = {
  ANIME: "ANIME", GAME: "GAME", ENTERTAINMENT: "ENTERTAINMENT",
  DRAMA: "DRAMA", EDUCATION: "EDUCATION", ORIGINAL: "ORIGINAL",
} as const;
export type WorkType = (typeof WORK_TYPE)[keyof typeof WORK_TYPE];

export interface Work {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  type: WorkType;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  releaseDate: string | null;
  createdAt: string;
}

// Shape returned by GET /works (cursor pagination).
export interface WorkListResponse { items: Work[]; nextCursor: string | null; }
