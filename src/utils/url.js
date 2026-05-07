const HTTPS_HOSTS = new Set([
  "school-system.my.id",
  "alentest.my.id",
]);

const getApiOrigin = () => {
  const configuredBaseUrl = (process.env.VUE_APP_API_BASE_URL || "").trim();
  const fallbackOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost";

  try {
    return new URL(configuredBaseUrl || fallbackOrigin, fallbackOrigin).origin;
  } catch (error) {
    return fallbackOrigin;
  }
};

export const normalizePublicUrl = (value) => {
  if (!value) {
    return "";
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return "";
  }

  if (rawValue.startsWith("//")) {
    return `https:${rawValue}`;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    try {
      const parsed = new URL(rawValue);
      if (parsed.protocol === "http:" && HTTPS_HOSTS.has(parsed.hostname)) {
        parsed.protocol = "https:";
        return parsed.toString();
      }
      return parsed.toString();
    } catch (error) {
      return rawValue;
    }
  }

  if (rawValue.startsWith("/")) {
    return `${getApiOrigin()}${rawValue}`;
  }

  return rawValue;
};
