import { defineAsyncComponent, defineComponent, h } from "vue";

const dotCount = 18;
const chunkReloadKey = "school-system:chunk-reload-attempted";
const pwaCachePrefixes = ["school-system-pwa-", "school-system-runtime-"];

export const isChunkLoadError = (error) => {
  const message = String(error?.message || "");
  return error?.name === "ChunkLoadError" || /Loading (?:CSS )?chunk \d+ failed/i.test(message);
};

const hasReloadAttempted = () => {
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(chunkReloadKey) === "1";
  } catch (error) {
    return false;
  }
};

const markReloadAttempted = () => {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(chunkReloadKey, "1");
    }
  } catch (error) {
    // sessionStorage can be unavailable in hardened browsers; ignore and continue.
  }
};

const clearPwaCaches = async () => {
  if (typeof caches === "undefined") {
    return;
  }

  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (!pwaCachePrefixes.some((prefix) => key.startsWith(prefix))) {
        return undefined;
      }
      return caches.delete(key);
    }),
  );
};

const refreshServiceWorkers = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.update?.().catch(() => undefined)),
  );
};

export const recoverFromChunkLoadError = () => {
  if (typeof window === "undefined" || hasReloadAttempted()) {
    return false;
  }

  markReloadAttempted();

  Promise.all([
    clearPwaCaches().catch(() => undefined),
    refreshServiceWorkers().catch(() => undefined),
  ]).finally(() => {
    window.location.reload();
  });

  return true;
};

export const clearChunkReloadAttempt = () => {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(chunkReloadKey);
    }
  } catch (error) {
    // Ignore storage failures.
  }
};

const createDot = (index) => h("span", {
  class: "absolute left-1/2 top-1/2 h-2.5 w-2.5 -ml-1 -mt-1 rounded-full bg-sky-500",
  style: {
    transform: `rotate(${index * (360 / dotCount)}deg) translateY(-3.2rem)`,
    opacity: String(1 - (index / dotCount) * 0.76),
  },
});

const RouteLoading = defineComponent({
  name: "RouteLoading",
  setup() {
    return () => h("div", {
      class: "flex min-h-full items-center justify-center bg-[#d9dbd5] p-6 text-[#111b21] dark:bg-[#0b141a] dark:text-[#e9edef]",
    }, [
      h("div", { class: "w-full max-w-xs rounded-3xl border border-[#e9edef] bg-white p-7 text-center shadow-xl shadow-slate-900/10 dark:border-[#222e35] dark:bg-[#202c33]" }, [
        h("div", { class: "relative mx-auto flex h-28 w-28 items-center justify-center" }, [
          h("div", { class: "absolute inset-0 animate-spin" }, Array.from({ length: dotCount }, (_, index) => createDot(index))),
          h("div", { class: "flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:ring-sky-400/20" }, [
            h("span", { class: "h-3 w-3 rounded-full bg-sky-500" }),
          ]),
        ]),
        h("p", { class: "mt-6 text-base font-semibold tracking-normal" }, "Memuat halaman"),
        h("p", { class: "mt-1 text-xs font-medium text-[#667781] dark:text-[#8696a0]" }, "Mohon tunggu sebentar"),
      ]),
    ]);
  },
});

const RouteLoadError = defineComponent({
  name: "RouteLoadError",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    return () => h("div", {
      class: "m-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
    }, props.error?.message || "Halaman gagal dimuat. Coba muat ulang halaman.");
  },
});

export const lazyRoute = (loader) => {
  const AsyncPage = defineAsyncComponent({
    loader,
    loadingComponent: RouteLoading,
    errorComponent: RouteLoadError,
    delay: 0,
    timeout: 30000,
    suspensible: false,
    onError(error, retry, fail) {
      if (isChunkLoadError(error) && recoverFromChunkLoadError()) {
        return;
      }

      fail(error);
    },
  });

  return defineComponent({
    name: "LazyRouteWrapper",
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => h(AsyncPage, attrs);
    },
  });
};
