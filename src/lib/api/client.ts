// The one Axios instance every API call goes through, plus tiny helpers that unwrap the response envelope.
import axios from "axios";
import { clearToken, getToken } from "@/lib/auth";
import { getSessionId } from "@/lib/session";
import type { ApiSuccess, Paged } from "@/types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

/** True for requests to the admin part of the API. */
function isAdminUrl(url: string | undefined): boolean {
  return Boolean(url?.startsWith("/admin"));
}

// Before every request: admin calls carry the token, visitor calls carry the session id
api.interceptors.request.use((config) => {
  if (isAdminUrl(config.url)) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    const sessionId = getSessionId();
    if (sessionId) config.headers["X-Session-Id"] = sessionId;
  }
  return config;
});

// After every response: an expired admin token sends the person back to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string | undefined = error.config?.url;
    const isLogin = url === "/admin/auth/login";
    if (error.response?.status === 401 && isAdminUrl(url) && !isLogin) {
      clearToken();
      // A full page load is used on purpose: this code runs outside React, so there is no router here
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

/** GET and return data */
export async function getData<T>(url: string, params?: object): Promise<T> {
  const response = await api.get<ApiSuccess<T>>(url, { params });
  return response.data.data;
}

/** GET a paginated list and return the items together with the paging info */
export async function getPaged<T>(url: string, params?: object): Promise<Paged<T>> {
  const response = await api.get<ApiSuccess<T[]>>(url, { params });
  return { items: response.data.data, meta: response.data.meta! };
}

/** POST a body and return data */
export async function postData<T>(url: string, body: object, timeout?: number): Promise<T> {
  const response = await api.post<ApiSuccess<T>>(url, body, { timeout });
  return response.data.data;
}

/** PATCH a body and return data */
export async function patchData<T>(url: string, body: object): Promise<T> {
  const response = await api.patch<ApiSuccess<T>>(url, body);
  return response.data.data;
}
