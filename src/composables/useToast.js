import { reactive } from "vue";

const toasts = reactive([]);
let toastCounter = 0;

const normalizeToastType = (type) => {
  if (type === "success" || type === "error" || type === "info") return type;
  return "info";
};

export const pushToast = ({
  title = "Pemberitahuan",
  message = "",
  type = "info",
  duration = 3200,
} = {}) => {
  const nextToast = {
    id: `${Date.now()}-${toastCounter += 1}`,
    title,
    message,
    type: normalizeToastType(type),
  };

  toasts.unshift(nextToast);

  if (Number(duration) > 0) {
    window.setTimeout(() => {
      dismissToast(nextToast.id);
    }, Number(duration));
  }

  return nextToast.id;
};

export const dismissToast = (toastId) => {
  const targetIndex = toasts.findIndex((item) => item.id === toastId);
  if (targetIndex >= 0) {
    toasts.splice(targetIndex, 1);
  }
};

export const useToast = () => ({
  toasts,
  pushToast,
  dismissToast,
});
