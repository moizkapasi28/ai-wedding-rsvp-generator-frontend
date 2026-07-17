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
        if (response.status === 401) {
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
