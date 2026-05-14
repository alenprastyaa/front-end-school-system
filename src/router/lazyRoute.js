import { defineAsyncComponent, defineComponent, h } from "vue";

const RouteLoading = defineComponent({
  name: "RouteLoading",
  setup() {
    return () => h("div", {
      class: "flex min-h-[240px] items-center justify-center p-6 text-slate-500 dark:text-slate-300",
    }, [
      h("div", {
        class: "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900",
      }, [
        h("span", {
          class: "h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400",
        }),
        h("span", { class: "text-sm font-medium" }, "Memuat halaman..."),
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
    delay: 80,
    timeout: 30000,
    suspensible: false,
  });

  return defineComponent({
    name: "LazyRouteWrapper",
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => h(AsyncPage, attrs);
    },
  });
};
