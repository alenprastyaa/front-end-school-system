const HEIC_PATTERN = /\.(heic|heif)$/i;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Browser tidak dapat membuka gambar ini"));
    img.src = src;
  });

const canvasToBlob = (canvas, quality = 0.92) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Gagal mengubah gambar ke JPG"));
        return;
      }
      resolve(blob);
    }, "image/jpeg", quality);
  });

export const isHeicLikeFile = (file) => {
  if (!(file instanceof File)) {
    return false;
  }

  const mimeType = String(file.type || "").toLowerCase();
  const fileName = String(file.name || "");
  return mimeType.includes("heic") || mimeType.includes("heif") || HEIC_PATTERN.test(fileName);
};

export const convertHeicToJpegIfPossible = async (file) => {
  if (!isHeicLikeFile(file)) {
    return file;
  }

  if (typeof window === "undefined") {
    return file;
  }

  let width = 0;
  let height = 0;
  let drawSource = null;

  if (typeof window.createImageBitmap === "function") {
    try {
      const bitmap = await window.createImageBitmap(file, { imageOrientation: "from-image" });
      width = bitmap.width;
      height = bitmap.height;
      drawSource = bitmap;
    } catch (error) {
      drawSource = null;
    }
  }

  if (!drawSource) {
    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);
    width = image.naturalWidth || image.width;
    height = image.naturalHeight || image.height;
    drawSource = image;
  }

  if (!width || !height) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(drawSource, 0, 0, width, height);
  const jpegBlob = await canvasToBlob(canvas);
  const nextName = String(file.name || "image")
    .replace(HEIC_PATTERN, "")
    .replace(/\.+$/, "");

  return new File([jpegBlob], `${nextName || "image"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};
