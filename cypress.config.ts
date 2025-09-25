import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    projectId: "s4itd8",   // ✅ must be inside e2e, not inside setupNodeEvents
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});

