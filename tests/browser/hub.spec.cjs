const { test, expect } = require('@playwright/test');

test('Apelido, avatar e modal funcionam por teclado e persistem', async ({ page }) => {
  await page.goto('/');
  const name = page.locator('#player-name-field');
  await name.fill('Agente Teste');
  await name.press('Tab');
  await page.locator('.avatar-btn-change').click();
  const modal = page.locator('#modal-avatar');
  await expect(modal).toBeVisible();
  const avatar = modal.getByRole('button', { name: /Raposa/ });
  await avatar.focus();
  await page.keyboard.press('Enter');
  await expect(modal).not.toBeVisible();
  await page.reload();
  await expect(name).toHaveValue('Agente Teste');
  await expect(page.locator('#player-avatar-icon')).toContainText('🦊');
  await page.getByRole('button', { name: /Guia da Atividade/i }).click();
  await expect(page.locator('#modal-teacher')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal-teacher')).not.toBeVisible();
});

test('Reset confirmado limpa somente o perfil da central', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('unrelated-setting', 'preserve');
    const profile = CyberKidsProfile.load();
    profile.name = 'Outro aluno';
    CyberKidsProfile.save(profile);
    CyberKidsProfile.record('fake_detector', 100, { completed: true });
  });
  await page.reload();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: /Reiniciar perfil/i }).click();
  expect(await page.evaluate(() => CyberKidsProfile.load().scores.fake_detector)).toBe(100);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: /Reiniciar perfil/i }).click();
  await expect(page.locator('#player-name-field')).toHaveValue('Agente Secreto');
  await expect(page.locator('#stat-total-score')).toHaveText('0');
  expect(await page.evaluate(() => localStorage.getItem('unrelated-setting'))).toBe('preserve');
});

test('Cinco medalhas liberam a suprema e recordes aparecem em conjunto', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    for (const id of ['website_inspector', 'fake_detector', 'chat_patrol', 'secret_password', 'privacy_shield']) CyberKidsProfile.record(id, 100, { completed: true });
  });
  await page.reload();
  await expect(page.locator('#stat-total-score')).toHaveText('500');
  await expect(page.locator('#stat-badges-count')).toHaveText('6 / 6');
  await expect(page.locator('#badge-supreme')).toHaveClass(/unlocked/);
});
