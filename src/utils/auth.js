import { normalizePublicUrl } from "@/utils/url";

const FORCED_LOGOUT_NOTICE_KEY = "forced-logout-notice";

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
      full_name: data.full_name || "",
      username: data.username,
      role: data.role,
      school_id: data.school_id,
      school_name: data.school_name,
      school_logo: normalizePublicUrl(data.school_logo) || null,
      profile_image: normalizePublicUrl(data.profile_image) || null,
      face_reference_image: normalizePublicUrl(data.face_reference_image) || null,
      face_reference_descriptor: data.face_reference_descriptor || null,
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

export const persistForcedLogoutNotice = (payload = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const data = payload?.data || payload || {};
  const notice = {
    reason: data.reason || "SESSION_REPLACED",
    active_device: data.active_device || "Perangkat tidak dikenal",
    active_ip: data.active_ip || null,
    active_login_at: data.active_login_at || null,
    message: payload?.message || data.message || "Akun Anda keluar karena ada login dari perangkat lain.",
  };

  sessionStorage.setItem(FORCED_LOGOUT_NOTICE_KEY, JSON.stringify(notice));
};

export const getForcedLogoutNotice = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(FORCED_LOGOUT_NOTICE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearForcedLogoutNotice = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(FORCED_LOGOUT_NOTICE_KEY);
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
