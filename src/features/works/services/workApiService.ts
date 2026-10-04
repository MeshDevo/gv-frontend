import { API_BASE_URL, DEFAULT_PAGE_SIZE } from "../../../shared/constants/apiConstants";
import type { Work, WorkListResponse, WorkType } from "../types/workTypes";

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Golden Voice API request failed: ${path} returned ${response.status}.`);
  }
  return response.json() as Promise<T>;
}

// Public endpoint: the backend only returns PUBLISHED works here.
export function fetchPublishedWorks(workType?: WorkType): Promise<WorkListResponse> {
  const typeQuery = workType ? `&type=${workType}` : "";
  return requestJson<WorkListResponse>(`/works?limit=${DEFAULT_PAGE_SIZE}${typeQuery}`);
}

export function fetchPublishedWorkById(workId: string): Promise<Work> {
  return requestJson<Work>(`/works/${workId}`);
}
