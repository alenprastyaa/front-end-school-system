const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
});

const parseJakartaDateTime = (value) => {
  const match = String(value).trim().match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (!match) {
    return null;
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw = "00", minuteRaw = "00", secondRaw = "00"] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);

  if ([year, month, day, hour, minute, second].some((item) => Number.isNaN(item))) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, second));
};

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00+07:00`);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return parseJakartaDateTime(value);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatDateTimeLocalInput = (value) => {
  if (!value) return "";

  const parsed = parseJakartaDateTime(value);
  if (!parsed) {
    const fallback = new Date(value);
    if (Number.isNaN(fallback.getTime())) return "";
    const pad = (item) => String(item).padStart(2, "0");
    return `${fallback.getFullYear()}-${pad(fallback.getMonth() + 1)}-${pad(fallback.getDate())}T${pad(fallback.getHours())}:${pad(fallback.getMinutes())}`;
  }

  const jakartaDate = new Date(parsed.getTime() + (7 * 60 * 60 * 1000));
  const pad = (item) => String(item).padStart(2, "0");
  return `${jakartaDate.getUTCFullYear()}-${pad(jakartaDate.getUTCMonth() + 1)}-${pad(jakartaDate.getUTCDate())}T${pad(jakartaDate.getUTCHours())}:${pad(jakartaDate.getUTCMinutes())}`;
};

export const formatDate = (value) => {
  const date = parseDateValue(value);
  return date ? dateFormatter.format(date) : "-";
};

export const formatDateTime = (value) => {
  const date = parseDateValue(value);
  return date ? `${dateTimeFormatter.format(date)} WIB` : "-";
};

export const formatTime = (value) => {
  const date = parseDateValue(value);
  return date ? `${timeFormatter.format(date)} WIB` : "-";
};
