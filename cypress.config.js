const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'docs/qa/evidencias/cypress/relatorio',
    reportFilename: 'relatorio-cypress',
    reportPageTitle: 'Loja PPP — Automação Web (Cypress)',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true
  },
  e2e: {
    baseUrl: 'http://localhost:3030',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'docs/qa/evidencias/cypress/screenshots',
    expose: {
      apiUrl: 'http://localhost:3030/api'
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    }
  }
});
