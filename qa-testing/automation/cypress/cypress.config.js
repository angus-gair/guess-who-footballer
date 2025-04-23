const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
      
      // Return the config object
      return config;
    },
    baseUrl: 'https://who.gair.com.au',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    experimentalStudio: true
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
  
  env: {
    apiUrl: 'https://who.gair.com.au/api',
    socketUrl: 'https://who.gair.com.au',
    // Test user credentials
    testUser: 'cypressuser',
  },
  
  retries: {
    runMode: 2,
    openMode: 0
  }
}); 