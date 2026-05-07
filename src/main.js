import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
// import "flowbite";
import "./assets/tailwind.css";
import "./assets/sass/css/windzo.css";
import vClickOutside from "click-outside-vue3";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(vClickOutside);
app.mount("#app");
