import posthog from "posthog-js";
import type { App } from "vue";

export const posthogPlugin = {
  install(app: App) {
    if (import.meta.env.PROD) {
      app.config.globalProperties.$posthog = posthog.init(
        "phc_bNqlg9NG2WTFIlzJnseHplcQrgeUexohKlfTKdfRn0k",
        {
          api_host: "https://eu.i.posthog.com",
        }
      );
    }
  },
};
