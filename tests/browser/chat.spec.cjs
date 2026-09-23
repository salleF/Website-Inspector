const { test, expect } = require('@playwright/test');

async function start(page) {
  await page.locator('button[onclick="startCurrentShift()"]').click();
}

async function pickEvidence(page, source) {
  if (source.startsWith('my_')) {
    await page.locator('.current-user-footer').click();
    await page.locator(`#modal-my-profile [data-evidence-source="${source}"]`).click();
    await page.getByRole('button', { name: 'Fechar perfil', exact: true }).click();
  } else await page.locator(`[data-evidence-source="${source}"]`).click();
}

async function compare(page, sources) {
  for (const source of sources) await pickEvidence(page, source);
  await page.locator('#btn-cross-examine').click();
}

test('Chat: todos os cinco turnos, onze contatos e todas as pistas são resolvíveis', async ({ page }) => {
  test.setTimeout(240000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/chat-patrol.html');
  const model = await page.evaluate(() => CHAT_PATROL_SHIFTS);
  let expected = 0;
  for (let shift = 0; shift < model.length; shift++) {
    await start(page);
    await page.locator('#btn-taskbar-detective').click();
    for (const contact of model[shift].contacts) {
      await page.locator('#dm-contacts-list button').filter({ hasText: contact.name }).click();
      if (!contact.isSuspect) {
        await compare(page, contact.verification.targets);
        expected += 15;
        expect(await page.evaluate(() => currentScore)).toBe(expected);
      }
      for (let step = 0; step < contact.dialogueTree.length; step++) {
        await expect(page.locator(`[data-evidence-source="msg_${step}"]`)).toContainText(contact.dialogueTree[step].botMsg);
        if (contact.isSuspect) {
          const clue = contact.contradictions.find(item => item.step === step);
          expect(clue, contact.id + ' etapa ' + step).toBeTruthy();
          await compare(page, clue.targets);
          expected += 15;
          expect(await page.evaluate(() => currentScore)).toBe(expected);
          if (step === 0) {
            await compare(page, clue.targets);
            expect(await page.evaluate(() => currentScore)).toBe(expected);
          }
        }
        await page.locator('#dialogue-choices-grid button').first().click();
        await page.evaluate(({ id, step }) => {
          const contact = currentShift().contacts.find(item => item.id === id);
          handlePlayerChoice(contact, contact.dialogueTree[step].choices[0]);
        }, { id: contact.id, step });
        await expect.poll(() => page.evaluate(id => contactsState[id].dialogueStep, contact.id)).toBe(step + 1);
        expect(await page.evaluate(id => contactsState[id].answeredSteps.length, contact.id)).toBe(step + 1);
      }
      if (contact.isSuspect) await page.locator('#btn-ban-suspect').click();
      expected += 30;
      expect(await page.evaluate(() => currentScore)).toBe(expected);
      await page.evaluate(() => attemptBanSuspect());
      expect(await page.evaluate(() => currentScore)).toBe(expected);
    }
    if (shift < model.length - 1) await page.locator('button[onclick="advanceToNextShift()"]').click();
  }
  await expect(page.locator('#modal-victory')).toBeVisible();
  expect(await page.evaluate(() => CyberKidsProfile.load().scores.chat_patrol)).toBe(expected + 100);
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).toContain('chat_patrol');
  expect(errors).toEqual([]);
});

test('Chat: bloquear sem investigar é permitido e tempo de leitura não tira vidas', async ({ page }) => {
  await page.goto('/chat-patrol.html');
  await start(page);
  await page.clock.install();
  await page.clock.fastForward(5 * 60 * 1000);
  expect(await page.evaluate(() => currentLives)).toBe(3);
  await expect(page.locator('#btn-ban-suspect')).toBeEnabled();
  await page.locator('#btn-ban-suspect').click();
  await expect(page.locator('#modal-shift-complete')).toBeVisible();
  expect(await page.evaluate(() => currentScore)).toBe(30);
});

test('Chat: par inválido não pontua e reiniciar cancela respostas e restaura checkpoint', async ({ page }) => {
  await page.goto('/chat-patrol.html');
  await start(page);
  await page.locator('#btn-taskbar-detective').click();
  await compare(page, ['dossier_created', 'dossier_location']);
  expect(await page.evaluate(() => currentScore)).toBe(0);
  const clue = await page.evaluate(() => currentContact().contradictions[0]);
  await compare(page, clue.targets);
  expect(await page.evaluate(() => currentScore)).toBe(15);
  await page.locator('#dialogue-choices-grid button').first().click();
  await page.evaluate(() => restartCurrentShift());
  await page.clock.install();
  await page.clock.runFor(1200);
  expect(await page.evaluate(() => ({ score: currentScore, step: contactsState[activeContactId].dialogueStep, count: contactsState[activeContactId].messages.length }))).toEqual({ score: 0, step: 0, count: 1 });
  await expect(page.locator('#modal-briefing')).toBeVisible();
});

test('Chat: trocar contato limpa pistas e rejeita mistura de identidades', async ({ page }) => {
  await page.goto('/chat-patrol.html');
  await start(page);
  await page.locator('#btn-ban-suspect').click();
  await page.locator('button[onclick="advanceToNextShift()"]').click();
  await start(page);
  await page.locator('#btn-taskbar-detective').click();
  await pickEvidence(page, 'dossier_created');
  await page.locator('#dm-contacts-list button').nth(1).click();
  expect(await page.evaluate(() => [selectedEvidence1, selectedEvidence2])).toEqual([null, null]);
  await expect(page.locator('#btn-cross-examine')).toBeDisabled();
});

test('Chat: escolhas arriscadas encerram em três falhas sem callback tardio', async ({ page }) => {
  await page.goto('/chat-patrol.html');
  await start(page);
  for (let step = 0; step < 3; step++) {
    const index = await page.evaluate(() => currentContact().dialogueTree[contactsState[activeContactId].dialogueStep].choices.findIndex(choice => choice.type === 'danger'));
    expect(index).toBeGreaterThanOrEqual(0);
    await page.locator('#dialogue-choices-grid button').nth(index).click();
    if (step < 2) await expect.poll(() => page.evaluate(() => contactsState[activeContactId].pending)).toBe(false);
  }
  await expect(page.locator('#modal-game-over')).toBeVisible();
  expect(await page.evaluate(() => currentLives)).toBe(0);
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('chat_patrol');
  await page.locator('#modal-game-over button[onclick="restartCurrentShift()"]').click();
  expect(await page.evaluate(() => currentLives)).toBe(3);
});

test('Chat: voltar pelo histórico durante resposta não deixa contato travado', async ({ page }) => {
  await page.goto('/chat-patrol.html');
  await start(page);
  await page.locator('#dialogue-choices-grid button').nth(1).click();
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect.poll(() => page.evaluate(() => contactsState[activeContactId].pending)).toBe(false);
  if (await page.locator('#modal-briefing').isVisible()) await start(page);
  await expect(page.locator('#dialogue-choices-grid button').nth(1)).toBeEnabled();
  const step = await page.evaluate(() => contactsState[activeContactId].dialogueStep);
  await page.locator('#dialogue-choices-grid button').nth(1).click();
  await expect.poll(() => page.evaluate(() => contactsState[activeContactId].dialogueStep)).toBe(step + 1);
});
