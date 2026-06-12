import { defineAsyncComponent, defineComponent, h } from "vue";

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

const skeletonBlock = (cls) => h("div", { class: `skeleton-shimmer ${cls}` });

// Skeleton generik bergaya halaman aplikasi (header + stat + kartu),
// menggantikan spinner agar konsisten dengan skeleton di seluruh halaman.
const RouteLoading = defineComponent({
  name: "RouteLoading",
  setup() {
    return () => h("div", {
      class: "min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6",
    }, [
      h("div", { class: "space-y-4" }, [
        // Header bar
        h("div", { class: "flex items-center justify-between gap-4" }, [
          h("div", { class: "space-y-2" }, [
            skeletonBlock("h-6 w-44 rounded-lg"),
            skeletonBlock("h-3 w-28 rounded"),
          ]),
          skeletonBlock("h-9 w-28 rounded-xl"),
        ]),
        // Stat row
        h(
          "div",
          { class: "grid grid-cols-2 gap-3 sm:grid-cols-4" },
          Array.from({ length: 4 }, () => skeletonBlock("h-24 rounded-2xl")),
        ),
        // Content cards
        h(
          "div",
          { class: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" },
          Array.from({ length: 6 }, () => skeletonBlock("h-40 rounded-2xl")),
        ),
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
    // Tunggu sebentar sebelum menampilkan skeleton: kalau chunk route sudah
    // ter-cache (refresh cepat), halaman langsung muncul tanpa kedipan loader.
    delay: 200,
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
