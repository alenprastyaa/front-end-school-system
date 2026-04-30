import { reactive } from "vue";

const isDateLikeString = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^\d{4}-\d{2}(-\d{2})?(T.*)?$/.test(value.trim());
};

const normalizeValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return { type: "empty", value: "" };
  }

  if (typeof value === "boolean") {
    return { type: "number", value: value ? 1 : 0 };
  }

  if (value instanceof Date) {
    return { type: "number", value: value.getTime() };
  }

  if (typeof value === "number") {
    return { type: "number", value };
  }

  if (typeof value === "string" && isDateLikeString(value)) {
    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp)) {
      return { type: "number", value: timestamp };
    }
  }

  return { type: "string", value: String(value).toLowerCase() };
};

export const createSortState = (key, direction = "asc") =>
  reactive({
    key,
    direction,
  });

export const toggleSort = (sortState, key) => {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    return;
  }

  sortState.key = key;
  sortState.direction = "asc";
};

export const sortItems = (items, sortState, accessors = {}) => {
  if (!Array.isArray(items)) {
    return [];
  }

  const key = sortState?.key;
  if (!key) {
    return [...items];
  }

  const direction = sortState?.direction === "desc" ? -1 : 1;
  const accessor = accessors[key] || ((item) => item?.[key]);

  return [...items].sort((left, right) => {
    const leftValue = normalizeValue(accessor(left));
    const rightValue = normalizeValue(accessor(right));

    if (leftValue.type === "empty" && rightValue.type !== "empty") {
      return 1;
    }

    if (leftValue.type !== "empty" && rightValue.type === "empty") {
      return -1;
    }

    if (leftValue.type === "number" && rightValue.type === "number") {
      return (leftValue.value - rightValue.value) * direction;
    }

    return leftValue.value.localeCompare(rightValue.value, undefined, {
      numeric: true,
      sensitivity: "base",
    }) * direction;
  });
};
