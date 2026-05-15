import { defineAsyncComponent, defineComponent, h } from "vue";

const dotCount = 24;

const createDot = (index) => h("span", {
  class: "absolute left-1/2 top-1/2 h-5 w-5 -ml-2.5 -mt-2.5 rounded-full bg-slate-950 dark:bg-white",
  style: {
    transform: `rotate(${index * (360 / dotCount)}deg) translateY(-5.5rem)`,
    opacity: String(1 - (index / dotCount) * 0.82),
  },
});

const RouteLoading = defineComponent({
  name: "RouteLoading",
  setup() {
    return () => h("div", {
      class: "flex min-h-[320px] items-center justify-center bg-white p-6 text-slate-950 dark:bg-slate-950 dark:text-white",
    }, [
      h("div", { class: "relative flex h-56 w-56 items-center justify-center" }, [
        h("div", { class: "absolute inset-0 animate-spin" }, Array.from({ length: dotCount }, (_, index) => createDot(index))),
        h("p", { class: "relative text-3xl font-black tracking-normal" }, "loading..."),
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
  });

  return defineComponent({
    name: "LazyRouteWrapper",
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => h(AsyncPage, attrs);
    },
  });
};
