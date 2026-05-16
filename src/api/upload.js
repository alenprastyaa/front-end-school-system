import { normalizePublicUrl } from "@/utils/url";

const resolvePublicBaseUrl = () =>
  String(
    process.env.VUE_APP_R2_PUBLIC_BASE_URL
    || process.env.R2_PUBLIC_BASE_URL
    || "https://upload.alentest.my.id",
  ).trim().replace(/\/$/, "");

const FILE_UPLOAD_URL = `${resolvePublicBaseUrl()}/file/api/upload-file`;

const resolveUploadedFileUrl = (payload) => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.url === "string") {
    return payload.url;
  }

  if (typeof payload.path === "string") {
    return payload.path;
  }

  if (payload.data) {
    return resolveUploadedFileUrl(payload.data);
  }

  if (payload.result) {
    return resolveUploadedFileUrl(payload.result);
  }

  return null;
};

export const uploadFileDirect = async (file, options = {}) => {
  if (!(file instanceof File)) {
    throw new Error("File upload membutuhkan objek File");
  }

  const token = String(options.authTokenOverride || localStorage.getItem("token") || "").trim();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(FILE_UPLOAD_URL, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Upload file gagal");
  }

  const uploadedUrl = normalizePublicUrl(resolveUploadedFileUrl(payload));
  if (!uploadedUrl) {
    throw new Error("Response upload file tidak mengandung URL");
  }

  return {
    url: uploadedUrl,
    name: file.name || null,
    mimeType: file.type || null,
    size: Number(file.size) || null,
  };
};
