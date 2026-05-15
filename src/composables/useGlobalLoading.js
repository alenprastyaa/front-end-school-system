import { readonly, reactive } from "vue";

const MIN_VISIBLE_MS = 450;

const state = reactive({
  pendingCount: 0,
  visible: false,
  message: "Memuat data...",
  shownAt: 0,
});

let hideTimer = null;

const clearTimer = (timer) => {
  if (timer) {
    window.clearTimeout(timer);
  }
};

const hideLoading = () => {
  hideTimer = null;
  if (state.pendingCount > 0) {
    return;
  }

  state.visible = false;
};

export const beginGlobalLoading = (message = "Memuat data...") => {
  if (typeof window === "undefined") {
    return () => {};
  }

  let finished = false;
  state.pendingCount += 1;
  state.message = message || "Memuat data...";
  clearTimer(hideTimer);
  hideTimer = null;

  if (!state.visible) {
    state.visible = true;
    state.shownAt = Date.now();
  }

  return () => {
    if (finished) {
      return;
    }

    finished = true;
    state.pendingCount = Math.max(0, state.pendingCount - 1);

    if (state.pendingCount > 0) {
      return;
    }

    if (!state.visible) {
      return;
    }

    const elapsed = Date.now() - state.shownAt;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
    clearTimer(hideTimer);
    hideTimer = window.setTimeout(hideLoading, remaining);
  };
};

export const useGlobalLoading = () => readonly(state);
