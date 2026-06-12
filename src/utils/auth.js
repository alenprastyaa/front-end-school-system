import { normalizePublicUrl } from "@/utils/url";

const FORCED_LOGOUT_NOTICE_KEY = "forced-logout-notice";

const decodeJwtPayload = (token) => {
  try {
    const rawToken = String(token || "").trim();
    if (!rawToken) return null;
    const parts = rawToken.split(".");
    if (parts.length < 2) return null;
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
};

export const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/^SUPERADMIN$/, "SUPER_ADMIN")
    .replace(/^SUPER_ADMINISTRATOR$/, "SUPER_ADMIN");

export const getStoredRole = () => {
  const tokenPayload = decodeJwtPayload(localStorage.getItem("token"));
  const tokenRole = normalizeRole(tokenPayload?.role);
  if (tokenRole) {
    return tokenRole;
  }
  return normalizeRole(localStorage.getItem("role"));
};

const requiredStudentProfileFields = [
  { key: "full_name", label: "Nama Lengkap" },
  { key: "parent_email", label: "Email" },
  { key: "phone_number", label: "No. HP" },
];

const hasProfileValue = (value) => String(value ?? "").trim() !== "";

export const getMissingStudentProfileFields = (user = {}) => {
  if (normalizeRole(user?.role) !== "SISWA") {
    return [];
  }

  return requiredStudentProfileFields
    .filter((field) => !hasProfileValue(user?.[field.key]))
    .map((field) => field.label);
};

export const isStudentProfileComplete = (user = {}) => {
  if (normalizeRole(user?.role) !== "SISWA") {
    return true;
  }

  if (user?.profile_complete === true) {
    return true;
  }

  return getMissingStudentProfileFields(user).length === 0;
};

export const isStudentFaceEnrolled = (user = {}) => {
  if (normalizeRole(user?.role) !== "SISWA") {
    return true;
  }

  return hasProfileValue(user?.face_reference_image) && hasProfileValue(user?.face_reference_descriptor);
};

const isTokenUsable = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return false;
  }

  if (payload.exp && Number(payload.exp) * 1000 <= Date.now()) {
    return false;
  }

  return true;
};

export const isAuthenticated = () => isTokenUsable(localStorage.getItem("token"));

export const persistSession = (payload) => {
  const data = payload?.data || payload;
  const tokenRole = normalizeRole(decodeJwtPayload(data.token)?.role);
  const role = tokenRole || normalizeRole(data.role);
  const schoolFeatures = data.school_features || {};

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", role);
  localStorage.setItem(
    "user",
    JSON.stringify({
      full_name: data.full_name || "",
      username: data.username,
      role,
      school_id: data.school_id,
      school_name: data.school_name,
      school_logo: normalizePublicUrl(data.school_logo) || null,
      attendance_latitude: data.attendance_latitude ?? null,
      attendance_longitude: data.attendance_longitude ?? null,
      attendance_radius_meters: data.attendance_radius_meters ?? null,
      attendance_late_after_time: data.attendance_late_after_time || "",
      attendance_checkout_deadline: data.attendance_checkout_deadline || "",
      inventory_module_enabled: schoolFeatures.inventory_module_enabled !== false,
      attendance_module_enabled: schoolFeatures.attendance_module_enabled !== false,
      attendance_teacher_module_enabled: schoolFeatures.attendance_teacher_module_enabled !== false,
      official_exam_module_enabled: schoolFeatures.official_exam_module_enabled !== false,
      koperasi_module_enabled: schoolFeatures.koperasi_module_enabled !== false,
      private_chat_module_enabled: schoolFeatures.private_chat_module_enabled !== false,
      teaching_module_ai_enabled: schoolFeatures.teaching_module_ai_enabled !== false,
      payroll_module_enabled: schoolFeatures.payroll_module_enabled !== false,
      spmb_module_enabled: schoolFeatures.spmb_module_enabled === true,
      personal_teacher_mode_enabled: schoolFeatures.personal_teacher_mode_enabled === true,
      parent_email: data.parent_email || "",
      phone_number: data.phone_number || "",
      profile_complete: data.profile_complete === true,
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
