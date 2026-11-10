const { test, expect } = require('@playwright/test');

test.describe('5. Validação de mensagens, títulos e elementos', () => {
  test('exibe os títulos e rótulos esperados no formulário', async ({ page }) => {
    await page.goto('/contato.html');
    await expect(page).toHaveTitle('Contato | Studio Dev');
    await expect(page.getByRole('heading', { name: 'Fale conosco' })).toBeVisible();
    for (const rotulo of ['Nome', 'E-mail', 'Assunto', 'Mensagem']) {
      await expect(page.getByLabel(rotulo, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Enviar mensagem' })).toBeEnabled();
  });

  test('exige o aceite antes de enviar', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('#erro-aceite')).toHaveText('É necessário concordar em ser contatado(a).');
  });

  test('mostra todas as mensagens de erro quando o formulário está vazio', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.locator('#erro-nome')).toHaveText('Informe seu nome completo (mínimo 3 letras).');
    await expect(page.locator('#erro-email')).toHaveText('Informe um e-mail válido.');
    await expect(page.locator('#erro-assunto')).toHaveText('Selecione um assunto.');
    await expect(page.locator('#erro-mensagem')).toHaveText('A mensagem deve ter pelo menos 10 caracteres.');
    await expect(page.locator('.sucesso')).toHaveCount(0);
  });

  test('rejeita e-mail em formato inválido e destaca o campo', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByLabel('Nome').fill('Joao da Silva');
    await page.getByLabel('E-mail').fill('joao-sem-arroba');
    await page.getByLabel('Assunto').selectOption('suporte');
    await page.getByLabel('Mensagem').fill('Mensagem com mais de dez caracteres.');
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.locator('#erro-email')).toHaveText('Informe um e-mail válido.');
    await expect(page.getByLabel('E-mail')).toHaveClass(/invalido/);
    await expect(page.locator('#erro-nome')).toBeEmpty();
  });

  test('rejeita mensagem muito curta', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByLabel('Nome').fill('Joao da Silva');
    await page.getByLabel('E-mail').fill('joao@exemplo.com');
    await page.getByLabel('Assunto').selectOption('suporte');
    await page.getByLabel('Mensagem').fill('Oi');
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('#erro-mensagem')).toHaveText('A mensagem deve ter pelo menos 10 caracteres.');
  });

  test('as mensagens de erro somem após corrigir os dados e reenviar', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByLabel('Concordo em ser contatado(a)').check();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.locator('#erro-nome')).not.toBeEmpty();

    await page.getByLabel('Nome').fill('Joao da Silva');
    await page.getByLabel('E-mail').fill('joao@exemplo.com');
    await page.getByLabel('Assunto').selectOption('orcamento');
    await page.getByLabel('Mensagem').fill('Agora a mensagem está completa.');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.locator('.erro:not(:empty)')).toHaveCount(0);
    await expect(page.locator('.sucesso')).toBeVisible();
  });

  test('a API valida os dados também no servidor (resposta 400)', async ({ request }) => {
    const resposta = await request.post('/api/contato', { data: { nome: 'A', email: 'x' } });
    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.ok).toBe(false);
    expect(Object.keys(corpo.erros)).toEqual(expect.arrayContaining(['nome', 'email', 'assunto', 'mensagem']));
  });

  test('a página Sobre contém o texto institucional esperado', async ({ page }) => {
    await page.goto('/sobre.html');
    await expect(page.getByText('estúdio de desenvolvimento web fundado em 2024')).toBeVisible();
    await expect(page.getByText('sites rápidos, bonitos e acessíveis')).toBeVisible();
  });
});
