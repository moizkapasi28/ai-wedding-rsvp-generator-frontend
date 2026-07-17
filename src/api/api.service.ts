import { tokenStore } from "@/store/token";

type RequestBody = undefined | Record<string, unknown> | FormData;

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
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 401 && !url.includes("auth/access-token") && !url.includes("auth/signin")) {
          // Attempt to refresh the access token
          let rTokenStr = localStorage.getItem("refreshToken");
          let rToken = null;
          if (rTokenStr) {
            try { rToken = JSON.parse(rTokenStr); } catch (e) { rToken = rTokenStr; }
          }
          const bodyPayload = rToken && !import.meta.env.VITE_COOKIE_BASED_AUTHENTICATION ? { refreshToken: rToken } : undefined;
          
          try {
            const refreshResp = await fetch(`${this.baseUrl}/auth/access-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: bodyPayload ? JSON.stringify(bodyPayload) : undefined
            });

            if (refreshResp.ok) {
               const refreshData = await refreshResp.json();
               if (!import.meta.env.VITE_COOKIE_BASED_AUTHENTICATION && refreshData.data?.tokens?.access) {
                 tokenStore.setAccessToken(refreshData.data.tokens.access);
                 mainHeader.set("Authorization", `Bearer ${refreshData.data.tokens.access.token}`);
                 options.headers = mainHeader;
               }
               // Retry original request
               const retryResponse = await fetch(url, options);
               if (!retryResponse.ok) {
                 if (retryResponse.status === 401) {
                   window.dispatchEvent(new Event("unauthorized"));
                 }
                 const errorData = await retryResponse.json().catch(() => ({}));
                 throw new Error(errorData.message || errorData.error || `HTTP error! status: ${retryResponse.status}`);
               }
               
               if (retryResponse.status === 204 || retryResponse.headers.get("content-length") === "0") {
                 return undefined as T;
               }
               const text = await retryResponse.text();
               return text ? (JSON.parse(text) as T) : (undefined as T);
            } else {
               window.dispatchEvent(new Event("unauthorized"));
            }
          } catch (e) {
             window.dispatchEvent(new Event("unauthorized"));
          }
        } else if (response.status === 401) {
          window.dispatchEvent(new Event("unauthorized"));
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`,
        );
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
      // eslint-disable-next-line no-console
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
}

export const apiService = new ApiService();
