import { API_CONFIG } from "../config/api";

export type EntityID = string;
export type RelativePath = string;

export function getBackendUrl(relativePath: RelativePath): string {
  return new URL(relativePath, API_CONFIG.baseURL).href;
}
