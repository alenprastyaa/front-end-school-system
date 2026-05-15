import { defineAsyncComponent, defineComponent, h } from "vue";

const RouteLoading = defineComponent({
  name: "RouteLoading",
  setup() {
    return () => h("div", {
      class: "flex min-h-[320px] items-center justify-center p-6 text-slate-500 dark:text-slate-300",
    }, [
      h("div", {
        class: "w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/10 dark:border-emerald-500/20 dark:bg-slate-900",
      }, [
        h("div", { class: "mx-auto h-16 w-16 animate-spin rounded-full border-[7px] border-slate-200 border-t-emerald-500 border-r-emerald-500 dark:border-slate-700 dark:border-t-emerald-400 dark:border-r-emerald-400" }),
        h("div", { class: "mt-5" }, [
          h("p", { class: "text-2xl font-black text-slate-950 dark:text-white" }, "Loading..."),
          h("p", { class: "mt-1 text-sm font-medium text-slate-500 dark:text-slate-400" }, "Memuat halaman..."),
        ]),
        h("div", { class: "mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" }, [
          h("div", { class: "h-full w-3/4 rounded-full bg-emerald-500" }),
        ]),
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
