import posthog from "posthog-js";

export function usePostHog() {
  posthog.init("phc_bNqlg9NG2WTFIlzJnseHplcQrgeUexohKlfTKdfRn0k", {
    api_host: "https://eu.i.posthog.com",
  });

  return {
    posthog,
  };
}
