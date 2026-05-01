import { normalizePublicUrl } from "@/utils/url";

const FILE_UPLOAD_URL = "https://alentest.my.id/file/api/upload-file";

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

export const uploadFileDirect = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("File upload membutuhkan objek File");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(FILE_UPLOAD_URL, {
    method: "POST",
    body: formData,
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
