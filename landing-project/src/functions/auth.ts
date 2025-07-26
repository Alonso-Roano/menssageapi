import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import endpoints from "./endpoints";
import { storage } from "./storage";

const API_BASE_URL = import.meta.env.PUBLIC_API_URL_CLEAN ?? 'https://fallback-url.com';
const ANON_KEY = import.meta.env.PUBLIC_API_KEY ?? 'ANON_KEY_FALLBACK';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get("accessToken");
    config.headers["Authorization"] = `Bearer ${token ?? ANON_KEY}`;
    config.headers["apikey"] = `${ANON_KEY}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = storage.get("refreshToken");
        if (!refreshTokenValue) {
          storage.clearAll();
          return Promise.reject(error);
        }

        const refreshed = await refreshToken(refreshTokenValue);

        if (refreshed.access_token && refreshed.refresh_token) {
          storage.set("accessToken", refreshed.access_token);
          storage.set("refreshToken", refreshed.refresh_token);
          originalRequest.headers["Authorization"] = `Bearer ${refreshed.access_token}`;
          return apiClient(originalRequest);
        } else {
          storage.clearAll();
          return Promise.reject(error);
        }
      } catch (err) {
        storage.clearAll();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(
  key: string,
  params: Record<string, string | number> = {},
  data: any = null,
  customConfig: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const endpointConfig = key
      .split(".")
      .reduce((acc: any, curr: string) => acc?.[curr], endpoints);

    if (!endpointConfig) {
      throw new Error(`Endpoint "${key}" no encontrado`);
    }

    let { method, url } = endpointConfig;

    Object.keys(params).forEach((param) => {
      if (url.includes(`{${param}}`)) {
        url = url.replace(`{${param}}`, encodeURIComponent(String(params[param])));
        delete params[param];
      }
    });

    console.log(url);

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
      headers: {
        "Content-Type": "application/json",
        ...customConfig.headers,
      },
      ...customConfig,
    };

    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.data.message === "Invalid JWT") {
      storage.clearAll();
    }
    throw error;
  }
};

async function refreshToken(refreshToken: string): Promise<{
  access_token?: string;
  refresh_token?: string;
}> {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      refresh_token: refreshToken
    }, {
      headers: {
        "apikey": ANON_KEY,
        "Content-Type": "application/json"
      }
    });

    return {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token
    };
  } catch (error) {
    console.error("Error refreshing token", error);
    return {};
  }
}
