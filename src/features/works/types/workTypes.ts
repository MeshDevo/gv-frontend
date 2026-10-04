// Mirrors the Prisma models and enums from goldenvoice-backend/prisma/schema.prisma

export const WORK_TYPE = {
  ANIME: "ANIME",
  GAME: "GAME",
  ENTERTAINMENT: "ENTERTAINMENT",
  DRAMA: "DRAMA",
  EDUCATION: "EDUCATION",
  ORIGINAL: "ORIGINAL",
} as const;
export type WorkType = (typeof WORK_TYPE)[keyof typeof WORK_TYPE];

export const WORK_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type WorkStatus = (typeof WORK_STATUS)[keyof typeof WORK_STATUS];

/**
 * Work model - mirrors backend Prisma model
 * Only PUBLISHED works are returned by the public API (GET /works)
 */
export interface Work {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  type: WorkType;
  status: WorkStatus;
  releaseDate: string | null; // ISO datetime string
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

/**
 * DubbedVersion model - mirrors backend Prisma model
 * Represents a dubbed version of a work in a target language
 */
export interface DubbedVersion {
  id: string;
  workId: string;
  targetLanguage: string;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
  episodes?: Episode[];
}

/**
 * Episode model - mirrors backend Prisma model
 * Represents a single episode within a dubbed version
 */
export interface Episode {
  id: string;
  dubbedVersionId: string;
  episodeNumber: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * TranslatedVersion model - mirrors backend Prisma model
 * Represents a translated version of a work
 */
export interface TranslatedVersion {
  id: string;
  workId: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatorId: string | null;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Script model - mirrors backend Prisma model
 * Represents a script associated with a work
 */
export interface Script {
  id: string;
  workId: string;
  writerId: string | null;
  title: string;
  content: string | null;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shape returned by GET /works (cursor pagination)
 * See backend workService.ts:listWorks() for response format
 */
export interface WorkListResponse {
  items: Work[];
  nextCursor: string | null;
}

/**
 * User model - mirrors backend Prisma model
 * Returned by auth endpoints and GET /users/me
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "VISITOR" | "MEMBER" | "EDITOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth response - returned by POST /auth/login and POST /auth/register
 */
export interface AuthResponse {
  token: string; // JWT token
  user: User;
}
