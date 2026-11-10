// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Para testar OUTRA aplicação (ex.: um projeto seu já hospedado), rode:
//   BASE_URL=https://meusite.com npx playwright test
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Navegador(es) usados nos testes. Descomente firefox/webkit para multi-navegador.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],

  // Sobe o servidor local automaticamente antes dos testes (ignorado se BASE_URL for definida).
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'node servidor.js',
        url: 'http://localhost:3000/api/status',
        reuseExistingServer: true,
      },
});
