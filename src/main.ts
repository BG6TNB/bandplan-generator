import { createApp } from "vue";
import "@/assets/style.css";
import App from "@/App.vue";
import { posthogPlugin } from "@/lib/posthog";

createApp(App).use(posthogPlugin).mount("#app");
