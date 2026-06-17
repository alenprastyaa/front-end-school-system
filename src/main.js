import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VueApexCharts from "vue3-apexcharts";
// import "flowbite";
import "./assets/tailwind.css";
import "./assets/sass/css/windzo.css";
import "@vuepic/vue-datepicker/dist/main.css";
import vClickOutside from "click-outside-vue3";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import { registerPwaServiceWorker } from "@/utils/serviceWorker";

const storedTheme = localStorage.getItem("color-theme");
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (storedTheme === "light") {
  document.documentElement.classList.remove("dark");
}
// te

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(vClickOutside);
app.use(VueApexCharts);
app.component("SkeletonLoader", SkeletonLoader);
app.mount("#app");

registerPwaServiceWorker().catch((error) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn("Service worker registration failed:", error);
  }
});
