const jakartaTimeZone = "Asia/Jakarta";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: jakartaTimeZone,
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: jakartaTimeZone,
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: jakartaTimeZone,
});

const formatJakartaParts = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: jakartaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
};

const getJakartaOffsetMinutes = (date) => {
  const parts = formatJakartaParts(date);
  if (!parts.year || !parts.month || !parts.day || !parts.hour || !parts.minute || !parts.second) {
    return 0;
  }

  const milliseconds = Number(parts.fractionalSecond || "0".padEnd(3, "0"));
  const jakartaAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
    milliseconds,
  );

  return (jakartaAsUtc - date.getTime()) / 60000;
};

const createJakartaDate = (year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) => {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  let instant = utcGuess;

  for (let index = 0; index < 2; index += 1) {
    const offsetMinutes = getJakartaOffsetMinutes(new Date(instant));
    instant = utcGuess - offsetMinutes * 60000;
  }

  return new Date(instant);
};

const parseJakartaDateTime = (value) => {
  const match = String(value).trim().match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/,
  );

  if (!match) {
    return null;
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw = "00", minuteRaw = "00", secondRaw = "00", milliRaw = "000"] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);
  const millisecond = Number(String(milliRaw).padEnd(3, "0"));

  if ([year, month, day, hour, minute, second, millisecond].some((item) => Number.isNaN(item))) {
    return null;
  }

  return createJakartaDate(year, month, day, hour, minute, second, millisecond);
};

export const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yearRaw, monthRaw, dayRaw] = value.split("-");
    return createJakartaDate(Number(yearRaw), Number(monthRaw), Number(dayRaw));
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return parseJakartaDateTime(value);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getJakartaDateKey = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: jakartaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const mapped = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  if (!mapped.year || !mapped.month || !mapped.day) {
    return "";
  }

  return `${mapped.year}-${mapped.month}-${mapped.day}`;
};

export const formatDateTimeLocalInput = (value) => {
  if (!value) return "";

  const parsed = parseDateValue(value);
  if (!parsed) return "";

  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: jakartaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsed);

  const mapped = Object.fromEntries(
    dateParts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  if (!mapped.year || !mapped.month || !mapped.day || !mapped.hour || !mapped.minute) {
    return "";
  }

  return `${mapped.year}-${mapped.month}-${mapped.day}T${mapped.hour}:${mapped.minute}`;
};

export const formatDateInputValue = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: jakartaTimeZone,
  }).format(date);
};

export const formatDate = (value) => {
  const date = parseDateValue(value);
  return date ? dateFormatter.format(date) : "-";
};

export const formatLongDate = (value) => {
  const date = parseDateValue(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: jakartaTimeZone,
  }).format(date);
};

export const formatDateTime = (value) => {
  const date = parseDateValue(value);
  return date ? `${dateTimeFormatter.format(date)} WIB` : "-";
};

export const formatStoredDateTime = (value) => {
  if (typeof value === "string") {
    const match = value.trim().match(
      /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/,
    );
    if (match) {
      return formatDateTime(`${match[1]} ${match[2]}`);
    }
  }

  return formatDateTime(value);
};

export const formatTime = (value) => {
  const date = parseDateValue(value);
  return date ? `${timeFormatter.format(date)} WIB` : "-";
};

export const formatChatTime = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: jakartaTimeZone,
  }).format(date);
};

export const formatChatDateKey = (value) => getJakartaDateKey(value);

export const formatChatDateSeparator = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";

  const todayKey = getJakartaDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getJakartaDateKey(yesterday);
  const currentKey = getJakartaDateKey(date);

  if (currentKey === todayKey) return "Hari ini";
  if (currentKey === yesterdayKey) return "Kemarin";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: jakartaTimeZone,
  }).format(date);
};

export const formatChatShortDate = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: jakartaTimeZone,
  }).format(date);
};

export const formatDateKey = (value) => getJakartaDateKey(value);
