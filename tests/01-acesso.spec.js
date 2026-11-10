const { test, expect } = require('@playwright/test');

test.describe('1. Acesso à aplicação', () => {
  test('a página inicial carrega com status 200', async ({ page }) => {
    const resposta = await page.goto('/');
    expect(resposta.status()).toBe(200);
    await expect(page).toHaveURL(/\/$/);
  });

  test('o título da aba está correto', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Início | Studio Dev');
  });

  test('o título principal (h1) e o menu estão visíveis', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bem-vindo ao Studio Dev');
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
  });

  test('a API do servidor responde com status "ok"', async ({ request }) => {
    const resposta = await request.get('/api/status');
    expect(resposta.ok()).toBeTruthy();
    expect(await resposta.json()).toMatchObject({ status: 'ok' });
  });

  test('uma rota inexistente retorna a página 404', async ({ page }) => {
    const resposta = await page.goto('/pagina-que-nao-existe');
    expect(resposta.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Erro 404' })).toBeVisible();
  });

  test('a página não gera erros no console', async ({ page }) => {
    const erros = [];
    page.on('console', (msg) => msg.type() === 'error' && erros.push(msg.text()));
    page.on('pageerror', (erro) => erros.push(erro.message));
    await page.goto('/');
    expect(erros).toEqual([]);
  });
});
