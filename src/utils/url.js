const HTTPS_HOSTS = new Set([
  "school-system.my.id",
  "alentest.my.id",
]);

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
    return rawValue;
  }

  return rawValue;
};
