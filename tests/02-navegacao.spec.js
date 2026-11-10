const { test, expect } = require('@playwright/test');

test.describe('2. Navegação entre páginas', () => {
  const links = [
    { nome: 'Serviços', url: /\/servicos\.html$/, titulo: 'Nossos serviços' },
    { nome: 'Sobre', url: /\/sobre\.html$/, titulo: 'Sobre nós' },
    { nome: 'Contato', url: /\/contato\.html$/, titulo: 'Fale conosco' },
  ];

  for (const link of links) {
    test(`o link "${link.nome}" do menu leva à página correta`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('navigation').getByRole('link', { name: link.nome }).click();
      await expect(page).toHaveURL(link.url);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(link.titulo);
    });
  }

  test('o menu marca a página atual (aria-current)', async ({ page }) => {
    await page.goto('/sobre.html');
    await expect(page.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current', 'page');
  });

  test('o botão "Ver serviços" da home leva à página de serviços', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Ver serviços' }).click();
    await expect(page).toHaveURL(/\/servicos\.html$/);
  });

  test('o botão "Fale conosco" da página Sobre leva ao formulário', async ({ page }) => {
    await page.goto('/sobre.html');
    await page.getByRole('link', { name: 'Fale conosco' }).click();
    await expect(page).toHaveURL(/\/contato\.html$/);
  });

  test('o botão voltar do navegador retorna à página anterior', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Serviços' }).click();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('todos os links internos do menu respondem com status 200', async ({ page, request }) => {
    await page.goto('/');
    const hrefs = await page.getByRole('navigation').getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBe(4);
    for (const href of hrefs) {
      const resposta = await request.get(href);
      expect(resposta.status(), `link ${href}`).toBe(200);
    }
  });
});
