const { test, expect } = require('@playwright/test');

const games = {
  'secret-password.html': { id: 'secret_password', badge: 'password_guardian', answers: ['Criar uma frase longa', 'Trocar a senha exposta', 'Não enviar nada', 'Ativar com ajuda', 'Usar um gerenciador'] },
  'privacy-shield.html': { id: 'privacy_shield', badge: 'privacy_guardian', answers: ['Conta privada e aceitar apenas', 'Não permitir e conferir', 'Não publicar assim', 'Não enviar o telefone', 'Negar acessos desnecessários', 'Não enviar a foto'] }
};

for (const [file, game] of Object.entries(games)) {
  test(`${file}: completar todas as tarefas, persistir medalha e jogar novamente`, async ({ page }) => {
    await page.goto('/' + file);
    await page.locator('[data-action="start"]').focus();
    await page.keyboard.press('Enter');
    if (game.id === 'secret_password') {
      for (const word of ['Farol', 'Nuvem', 'Cacto', 'Tambor']) {
        await page.locator('[data-action="word"]').filter({ hasText: word }).focus();
        await page.keyboard.press('Enter');
      }
      await page.locator('[data-action="check-words"]').focus();
      await page.keyboard.press('Enter');
      await page.locator('[data-action="continue"]').focus();
      await page.keyboard.press('Enter');
    }
    for (const answer of game.answers) {
      await page.locator('[data-action="answer"]').filter({ hasText: answer }).focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.locator('[data-action="continue"]').focus();
      await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('heading', { name: 'Missão completa' })).toBeVisible();
    const profile = await page.evaluate(() => CyberKidsProfile.load());
    expect(profile.scores[game.id]).toBe(120);
    expect(profile.badges).toContain(game.badge);
    const stored = await page.evaluate(() => localStorage.getItem('cyberkids_profile'));
    expect(stored).not.toContain('Farol');
    await page.locator('[data-action="replay"]').click();
    expect(await page.evaluate(() => CyberKidsProfile.load().scores[document.body.dataset.game])).toBe(120);
    await expect(page.getByRole('heading', { name: 'Missão completa' })).not.toBeVisible();
  });
}

test('Privacidade: corrigir decisão mantém exercício justo e três erros encerram', async ({ page }) => {
  await page.goto('/privacy-shield.html');
  await page.locator('[data-action="start"]').click();
  const answers = page.locator('[data-action="answer"]');
  const safe = answers.filter({ hasText: 'Conta privada e aceitar apenas' });
  await answers.filter({ hasNotText: 'Conta privada e aceitar apenas' }).first().click();
  await page.locator('[data-action="continue"]').click();
  await safe.click();
  await page.locator('[data-action="continue"]').click();
  for (const answer of games['privacy-shield.html'].answers.slice(1)) {
    await page.locator('[data-action="answer"]').filter({ hasText: answer }).click();
    await page.locator('[data-action="continue"]').click();
  }
  expect(await page.evaluate(() => CyberKidsProfile.load().scores.privacy_shield)).toBe(110);
  await page.evaluate(() => CyberKidsProfile.reset());
  await page.goto('/privacy-shield.html');
  await page.locator('[data-action="start"]').click();
  for (let i = 0; i < 3; i++) {
    await page.locator('[data-action="answer"]').filter({ hasNotText: 'Conta privada e aceitar apenas' }).first().click();
    await page.locator('[data-action="continue"]').click();
  }
  await expect(page.locator('[data-action="replay"]')).toBeVisible();
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('privacy_guardian');
});

test('Senha: mistura exige quatro palavras e rejeita dados pessoais sem duplicar erros', async ({ page }) => {
  await page.goto('/secret-password.html');
  await page.locator('[data-action="start"]').click();
  await expect(page.locator('[data-action="check-words"]')).toBeDisabled();
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const word of ['Duda2014', '123456', 'Farol', 'Nuvem']) await page.locator('[data-action="word"]').filter({ hasText: word }).click();
    await page.locator('[data-action="check-words"]').click();
    await expect(page.locator('[data-action="check-words"]')).toBeDisabled();
    await expect(page.locator('#feedback')).toContainText(String(2 - attempt));
    await page.locator('[data-action="continue"]').click();
  }
  await expect(page.getByRole('heading', { name: /Hora de revisar/ })).toBeVisible();
  expect(await page.evaluate(() => CyberKidsProfile.load().scores.secret_password)).toBe(0);
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('password_guardian');
});
