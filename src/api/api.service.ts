import type { GenerateNewTokenResponse } from "@/models/user.model";
import { refreshTokenAtom } from "@/store/store";
import { tokenStore } from "@/store/token";
import { getDefaultStore } from "jotai";

type RequestBody = undefined | Record<string, unknown> | FormData;

// Errors thrown by request() carry the HTTP status and the API's error type
type ApiRequestError = Error & { type?: string; status?: number };

let refreshInFlight: Promise<boolean> | null = null;

// Exchanges the refresh token for a new pair and stores both. Single-flight: the backend
// rotates the refresh token on every use, so requests that 401 together must share one
// refresh — a second one would send a token the first already invalidated. A refused
// refresh ends the session, announced once however many requests were waiting on it.
const refreshAccessToken = (baseUrl: string): Promise<boolean> => {
  refreshInFlight ??= (async () => {
    try {
      const store = getDefaultStore();
      const refreshToken = store.get(refreshTokenAtom);

      const response = refreshToken
        ? await fetch(`${baseUrl}/auth/access-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })
        : null;

      if (!response?.ok) {
        // A 429 or 5xx is temporary; anything else means the refresh token is no good
        if (!response || (response.status < 500 && response.status !== 429)) {
          window.dispatchEvent(new Event("unauthorized"));
        }
        return false;
      }

      const { data }: GenerateNewTokenResponse = await response.json();
      tokenStore.setAccessToken(data.access);
      // Through the atom, not localStorage directly, so React state and other tabs follow
      store.set(refreshTokenAtom, data.refresh.token);
      return true;
    } catch {
      // Network failure, not a refusal: keep the session so the next request can try again
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_URL || "";
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body: RequestBody = undefined,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;
    const mainHeader = new Headers(headers);
    const options: RequestInit = {
      method,
      headers: mainHeader,
    };

    const token = tokenStore.getAccessToken();
    mainHeader.set("Content-Type", `application/json`);

    if (token) {
      mainHeader.set("Authorization", `Bearer ${token}`);
    }

    if (body) {
      if (body instanceof FormData) {
        options.body = body;
        mainHeader.delete("Content-Type");
      } else {
        options.body = JSON.stringify(body);
      }
    }

    try {
      options.headers = mainHeader;
      let response = await fetch(url, options);

      if (
        response.status === 401 &&
        !url.includes("auth/access-token") &&
        !url.includes("auth/signin")
      ) {
        // Expired access token. Another request (or tab) may already have replaced it while
        // this one was in flight; refreshing again would invalidate the token they now hold.
        const current = tokenStore.getAccessToken();
        const renewed =
          (!!current && current !== token) ||
          (await refreshAccessToken(this.baseUrl));

        if (renewed) {
          mainHeader.set("Authorization", `Bearer ${tokenStore.getAccessToken()}`);
          response = await fetch(url, options);
          if (response.status === 401) {
            window.dispatchEvent(new Event("unauthorized"));
          }
        }
      } else if (response.status === 401 && !url.includes("auth/signin")) {
        // A wrong password on sign-in is a 401 too, but there is no session to end
        window.dispatchEvent(new Event("unauthorized"));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const err = new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`,
        ) as ApiRequestError;
        err.type = errorData.type;
        err.status = response.status;
        throw err;
      }

      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return undefined as T;
      }

      // Some APIs return 200 with an empty body too — guard against that as well
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : (undefined as T);
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, headers);
  }

  post<T>(
    endpoint: string,
    body: RequestBody,
    headers: Record<string, string> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", body, headers);
  }

  put<T>(
    endpoint: string,
    body: RequestBody,
    headers: Record<string, string> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, headers);
  }

  patch<T>(
    endpoint: string,
    body: RequestBody,
    headers: Record<string, string> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body, headers);
  }

  delete<T>(
    endpoint: string,
    headers: Record<string, string> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, headers);
  }

  async download(endpoint: string, filename: string): Promise<void> {
    const url = `${this.baseUrl}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;
    const headers = new Headers();
    const token = tokenStore.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Not JSON; keep the status message
        }
        throw new Error(errorMessage);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
