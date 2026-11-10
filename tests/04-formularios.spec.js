const { test, expect } = require('@playwright/test');

async function preencherFormulario(page, dados) {
  await page.getByLabel('Nome').fill(dados.nome);
  await page.getByLabel('E-mail').fill(dados.email);
  await page.getByLabel('Assunto').selectOption(dados.assunto);
  await page.getByLabel('Mensagem').fill(dados.mensagem);
}

test.describe('4. Formulários', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contato.html');
  });

  test('preenche e envia o formulário com dados válidos', async ({ page }) => {
    await preencherFormulario(page, {
      nome: 'Joao da Silva',
      email: 'joao@exemplo.com',
      assunto: 'orcamento',
      mensagem: 'Gostaria de um orçamento para um site institucional.',
    });
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.locator('.sucesso')).toContainText('Mensagem enviada com sucesso!');
    await expect(page.locator('.sucesso strong')).toHaveText(/^PRT-\d{6}$/);
  });

  test('o formulário é limpo depois do envio com sucesso', async ({ page }) => {
    await preencherFormulario(page, {
      nome: 'Maria Souza',
      email: 'maria@exemplo.com',
      assunto: 'parceria',
      mensagem: 'Vamos conversar sobre uma parceria comercial.',
    });
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('.sucesso')).toBeVisible();

    await expect(page.getByLabel('Nome')).toHaveValue('');
    await expect(page.getByLabel('E-mail')).toHaveValue('');
    await expect(page.getByLabel('Mensagem')).toHaveValue('');
  });

  test('o envio dispara uma requisição POST para /api/contato com os dados digitados', async ({ page }) => {
    await preencherFormulario(page, {
      nome: 'Carlos Lima',
      email: 'carlos@exemplo.com',
      assunto: 'suporte',
      mensagem: 'Preciso de ajuda com o meu site.',
    });
    await page.getByLabel('Concordo em ser contatado(a)').check();

    const [requisicao] = await Promise.all([
      page.waitForRequest((r) => r.url().endsWith('/api/contato') && r.method() === 'POST'),
      page.getByRole('button', { name: 'Enviar mensagem' }).click(),
    ]);
    expect(requisicao.postDataJSON()).toMatchObject({
      nome: 'Carlos Lima',
      email: 'carlos@exemplo.com',
      assunto: 'suporte',
    });
  });

  test('o envio com Enter dentro do campo de texto também submete o formulário', async ({ page }) => {
    await preencherFormulario(page, {
      nome: 'Ana Paula',
      email: 'ana@exemplo.com',
      assunto: 'orcamento',
      mensagem: 'Quero saber os valores dos serviços.',
    });
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByLabel('Nome').press('Enter');
    await expect(page.locator('.sucesso')).toBeVisible();
  });
});
