const { test, expect } = require('@playwright/test');
const path = require('path');

const PASTA = path.join(__dirname, '..', 'prints', 'screenshots');
const salvar = (nome) => ({ path: path.join(PASTA, nome), fullPage: true });

test.describe('6. Captura de tela (screenshots)', () => {
  test('captura a página inicial', async ({ page }) => {
    await page.goto('/');
    await page.screenshot(salvar('01-inicio.png'));
  });

  test('captura a página de serviços e a busca filtrada', async ({ page }) => {
    await page.goto('/servicos.html');
    await page.screenshot(salvar('02-servicos.png'));
    await page.getByLabel('Buscar serviço').fill('app');
    await page.screenshot(salvar('03-servicos-filtrados.png'));
  });

  test('captura a página Sobre', async ({ page }) => {
    await page.goto('/sobre.html');
    await page.screenshot(salvar('04-sobre.png'));
  });

  test('captura o formulário vazio, com erros e com sucesso', async ({ page }) => {
    await page.goto('/contato.html');
    await page.screenshot(salvar('05-contato-vazio.png'));

    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('#erro-nome')).not.toBeEmpty();
    await page.screenshot(salvar('06-contato-erros.png'));

    await page.getByLabel('Nome').fill('Joao da Silva');
    await page.getByLabel('E-mail').fill('joao@exemplo.com');
    await page.getByLabel('Assunto').selectOption('orcamento');
    await page.getByLabel('Mensagem').fill('Gostaria de um orçamento para um site institucional.');
    await page.screenshot(salvar('07-contato-preenchido.png'));

    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('.sucesso')).toBeVisible();
    await page.screenshot(salvar('08-contato-sucesso.png'));
  });

  test('captura o modo escuro', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Alternar tema' }).click();
    await expect(page.locator('body')).toHaveClass(/escuro/);
    await page.screenshot(salvar('09-inicio-modo-escuro.png'));
  });

  test('captura a versão mobile (celular)', async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await contexto.newPage();
    await page.goto('/');
    await page.screenshot(salvar('10-inicio-mobile.png'));
    await contexto.close();
  });

  test('captura um elemento específico (card de serviço)', async ({ page }) => {
    await page.goto('/servicos.html');
    await page.locator('#lista-servicos li').first().screenshot({ path: path.join(PASTA, '11-card-servico.png') });
  });

  test('captura a página 404', async ({ page }) => {
    await page.goto('/rota-inexistente');
    await page.screenshot(salvar('12-pagina-404.png'));
  });
});
