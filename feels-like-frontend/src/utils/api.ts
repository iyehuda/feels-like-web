import { API_CONFIG } from "../config/api";

export function getBackendUrl(relativePath: string): string {
  return new URL(relativePath, API_CONFIG.baseURL).href;
}
