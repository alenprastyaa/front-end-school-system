import { normalizePublicUrl } from "@/utils/url";

export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
};

export const getStoredRole = () => localStorage.getItem("role");

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));

export const persistSession = (payload) => {
  const data = payload?.data || payload;

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.username,
      role: data.role,
      school_id: data.school_id,
      school_name: data.school_name,
      profile_image: normalizePublicUrl(data.profile_image) || null,
    }),
  );
};

export const updateStoredUser = (patch = {}) => {
  const current = getStoredUser() || {};
  localStorage.setItem("user", JSON.stringify({ ...current, ...patch }));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

export const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === "/auth/login") {
    return;
  }

  window.location.assign("/auth/login");
};

export const clearSessionAndRedirectToLogin = () => {
  clearSession();
  redirectToLogin();
};
