import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://conduit.bondaracademy.com",
    env: {
      apiUrl: "https://conduit-api.bondaracademy.com/api",
    },
    setupNodeEvents(on, config) {},
    retries: {
      runMode: 2,
      openMode: 0,
    },
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
