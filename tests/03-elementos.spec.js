const { test, expect } = require('@playwright/test');

test.describe('3. Elementos gráficos (botões, campos e outros)', () => {
  test('o botão "Curtir" incrementa o contador a cada clique', async ({ page }) => {
    await page.goto('/');
    const contador = page.locator('#contador');
    await expect(contador).toHaveText('0');
    await page.getByRole('button', { name: 'Curtir' }).click();
    await page.getByRole('button', { name: 'Curtir' }).click();
    await page.getByRole('button', { name: 'Curtir' }).click();
    await expect(contador).toHaveText('3');
  });

  test('o botão "Alternar tema" liga e desliga o modo escuro', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).not.toHaveClass(/escuro/);
    await page.getByRole('button', { name: 'Alternar tema' }).click();
    await expect(page.locator('body')).toHaveClass(/escuro/);
    await page.getByRole('button', { name: 'Alternar tema' }).click();
    await expect(page.locator('body')).not.toHaveClass(/escuro/);
  });

  test('o campo de texto exibe a saudação personalizada', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Seu nome').fill('Joao');
    await expect(page.locator('#saudacao')).toHaveText('Olá, Joao! Seja bem-vindo(a).');
    await page.getByLabel('Seu nome').clear();
    await expect(page.locator('#saudacao')).toBeEmpty();
  });

  test('o campo de busca filtra a lista de serviços', async ({ page }) => {
    await page.goto('/servicos.html');
    const cards = page.locator('#lista-servicos li:visible');
    await expect(cards).toHaveCount(4);
    await page.getByLabel('Buscar serviço').fill('loja');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Loja virtual');
  });

  test('a busca sem resultado mostra a mensagem de aviso', async ({ page }) => {
    await page.goto('/servicos.html');
    await expect(page.locator('#sem-resultado')).toBeHidden();
    await page.getByLabel('Buscar serviço').fill('xyz123');
    await expect(page.locator('#sem-resultado')).toBeVisible();
    await expect(page.locator('#sem-resultado')).toHaveText('Nenhum serviço encontrado.');
  });

  test('é possível selecionar uma opção na lista e marcar o checkbox', async ({ page }) => {
    await page.goto('/contato.html');
    await page.getByLabel('Assunto').selectOption('suporte');
    await expect(page.getByLabel('Assunto')).toHaveValue('suporte');
    const aceite = page.getByLabel('Concordo em ser contatado(a)');
    await aceite.check();
    await expect(aceite).toBeChecked();
    await aceite.uncheck();
    await expect(aceite).not.toBeChecked();
  });
});
