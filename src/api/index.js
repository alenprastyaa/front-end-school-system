import { clearSessionAndRedirectToLogin } from "@/utils/auth";

const API_BASE_URL = (process.env.VUE_APP_API_BASE_URL || "https://alentest.my.id/school/api").replace(/\/$/, "");

const normalizeSocketPath = (path) => {
  if (!path) {
    return "/socket.io";
  }

  const normalized = `/${String(path).replace(/^\/+|\/+$/g, "")}`;
  return normalized || "/socket.io";
};

const buildRealtimeConfig = () => {
  const configuredSocketUrl = (process.env.VUE_APP_SOCKET_URL || "").trim().replace(/\/$/, "");
  const configuredSocketPath = (process.env.VUE_APP_SOCKET_PATH || "").trim();
  const fallbackOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost";

  let resolvedApiUrl;
  try {
    resolvedApiUrl = new URL(API_BASE_URL, fallbackOrigin);
  } catch (error) {
    resolvedApiUrl = new URL(fallbackOrigin);
  }

  const apiPathname = resolvedApiUrl.pathname.replace(/\/$/, "");
  const derivedBasePath = apiPathname.replace(/\/api$/i, "");
  const derivedSocketPath = `${derivedBasePath || ""}/socket.io`;

  return {
    url: configuredSocketUrl || resolvedApiUrl.origin,
    path: normalizeSocketPath(configuredSocketPath || derivedSocketPath),
  };
};

const buildHeaders = (options = {}) => {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem("token");

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildBody = (body) => {
  if (body == null) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
};

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (!params || typeof params !== "object") {
    return url.toString();
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          url.searchParams.append(key, String(item));
        }
      });
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

const normalizeError = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  const message =
    payload?.message || payload?.error || `Request failed with status ${response.status}`;

  const requestError = new Error(message);
  requestError.status = response.status;
  requestError.payload = payload;
  throw requestError;
};

const isAuthFailure = (error) => {
  const status = Number(error?.status || 0);
  const message = String(error?.message || "").toLowerCase();

  if (status === 401) {
    return true;
  }

  if (status === 403) {
    return /(unauthor|forbidden|invalid token|expired token|jwt|token)/i.test(message);
  }

  return /(token expired|token invalid|invalid token|jwt expired|jwt malformed|unauthorized)/i.test(message);
};

export const apiRequest = async (path, options = {}) => {
  const hasToken = Boolean(localStorage.getItem("token"));

  try {
    const response = await fetch(buildUrl(path, options.params), {
      method: options.method || "GET",
      headers: buildHeaders(options),
      body: buildBody(options.body),
    });

    if (!response.ok) {
      await normalizeError(response);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (hasToken && isAuthFailure(error)) {
      clearSessionAndRedirectToLogin();
    }

    throw error;
  }
};

export const api = {
  baseUrl: API_BASE_URL,
  get: (path, options = {}) => apiRequest(path, options),
  post: (path, body, options = {}) =>
    apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) =>
    apiRequest(path, { ...options, method: "PUT", body }),
  delete: (path, options = {}) =>
    apiRequest(path, { ...options, method: "DELETE" }),
};

export const realtimeConfig = buildRealtimeConfig();
