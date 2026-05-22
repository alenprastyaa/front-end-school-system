import { normalizePublicUrl } from "@/utils/url";

const resolvePublicBaseUrl = () =>
  String(
    process.env.VUE_APP_R2_PUBLIC_BASE_URL
    || process.env.R2_PUBLIC_BASE_URL
    || "https://upload.alentest.my.id",
  ).trim().replace(/\/$/, "");

const resolveApiBaseUrl = () =>
  String(
    process.env.VUE_APP_API_BASE_URL
    || "https://alentest.my.id/school/api",
  ).trim().replace(/\/$/, "");

const FILE_UPLOAD_URL = `${resolvePublicBaseUrl()}/file/api/upload-file`;
const LOCAL_FILE_UPLOAD_URL = `${resolveApiBaseUrl()}/learning/question-bank/upload-image`;

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

const postFileToUploadEndpoint = async (endpoint, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Upload file gagal (${response.status})`);
  }

  const uploadedUrl = normalizePublicUrl(resolveUploadedFileUrl(payload?.data || payload));
  if (!uploadedUrl) {
    throw new Error("Response upload file tidak mengandung URL");
  }

  return uploadedUrl;
};

export const uploadFileDirect = async (file, options = {}) => {
  if (!(file instanceof File)) {
    throw new Error("File upload membutuhkan objek File");
  }

  const token = String(options.authTokenOverride || localStorage.getItem("token") || "").trim();
  let uploadedUrl = "";
  let localUploadError = null;

  try {
    uploadedUrl = await postFileToUploadEndpoint(LOCAL_FILE_UPLOAD_URL, file, token);
  } catch (error) {
    localUploadError = error;
  }

  if (!uploadedUrl) {
    uploadedUrl = await postFileToUploadEndpoint(FILE_UPLOAD_URL, file, token).catch((error) => {
      if (localUploadError) {
        throw localUploadError;
      }
      throw error;
    });
  }

  return {
    url: uploadedUrl,
    name: file.name || null,
    mimeType: file.type || null,
    size: Number(file.size) || null,
  };
};
