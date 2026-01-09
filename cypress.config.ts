import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    projectId: "s4itd8",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "https://test.truscholar.io/",
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          // Auto-grant camera/mic permissions without popup
          launchOptions.args.push('--use-fake-ui-for-media-stream');
          launchOptions.args.push('--use-fake-device-for-media-stream');
          
          // Additional flags for permissions
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--allow-file-access');
          
          return launchOptions;
        }
       
      });

      return config;
    },
  },
});

