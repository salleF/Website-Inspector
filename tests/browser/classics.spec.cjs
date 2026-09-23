const { test, expect } = require('@playwright/test');

test('Inspector: dez rodadas completas, respostas únicas e recorde persistido', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/website-inspector.html');
  const rounds = await page.evaluate(() => scenarios.map(scenario => scenario.results.map(item => item.isSafe)));
  expect(rounds).toHaveLength(10);
  let expectedScore = 0;
  for (let round = 0; round < rounds.length; round++) {
    for (let item = 0; item < rounds[round].length; item++) {
      const correct = rounds[round][item];
      await page.locator(`#actions-${round}-${item} button`).nth(correct ? 0 : 1).click();
      expectedScore += 10;
      expect(await page.evaluate(() => score)).toBe(expectedScore);
      await page.evaluate(({ round, item, correct }) => evaluateResult(round, item, correct), { round, item, correct });
      expect(await page.evaluate(() => score)).toBe(expectedScore);
    }
    await expect(page.locator('#next-bar')).toBeVisible();
    await page.locator('#next-bar button').click();
  }
  await expect(page.locator('#stage-gameover')).toBeVisible();
  const profile = await page.evaluate(() => CyberKidsProfile.load());
  expect(profile.scores.website_inspector).toBe(expectedScore);
  expect(profile.badges).toContain('link_inspector');
  await page.goto('/');
  await expect(page.locator('#record-inspector')).toContainText(String(expectedScore));
});

test('Inspector: revisitar rodada não reabre pontos; terceira falha encerra', async ({ page }) => {
  await page.goto('/website-inspector.html');
  const safe = await page.evaluate(() => scenarios[0].results[0].isSafe);
  await page.locator('#actions-0-0 button').nth(safe ? 0 : 1).click();
  await page.locator('.google-pag-o-item').first().click();
  await expect(page.locator('#actions-0-0 button').first()).toBeDisabled();
  expect(await page.evaluate(() => score)).toBe(10);
  await page.evaluate(() => nextRound());
  expect(await page.evaluate(() => currentRoundIndex)).toBe(0);
  for (let item = 1; item <= 3; item++) {
    const correct = await page.evaluate(index => scenarios[0].results[index].isSafe, item);
    await page.locator(`#actions-0-${item} button`).nth(correct ? 1 : 0).click();
    if (item < 3) {
      const modal = page.locator('#virus-modal');
      if (await modal.isVisible()) await page.evaluate(() => closeVirusModal());
    }
  }
  await expect(page.locator('#stage-gameover')).toBeVisible();
  expect(await page.evaluate(() => lives)).toBe(0);
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('link_inspector');
  await page.evaluate(() => { evaluateResult(0, 4, false); restartGame(); });
  expect(await page.evaluate(() => ({ lives, score, currentRoundIndex }))).toEqual({ lives: 3, score: 0, currentRoundIndex: 0 });
});

test('Fake: todas as notificações, resultado coerente e medalha', async ({ page }) => {
  await page.goto('/fake-detector.html');
  const scenarios = await page.evaluate(() => SCENARIOS.map(item => item.isSafe));
  expect(scenarios).toHaveLength(10);
  for (let round = 0; round < scenarios.length; round++) {
    await page.locator('.btn-player-bubble').nth(scenarios[round] ? 0 : 1).click();
    expect(await page.evaluate(() => score)).toBe((round + 1) * 10);
    await page.evaluate(safe => playerDecide(safe), scenarios[round]);
    expect(await page.evaluate(() => score)).toBe((round + 1) * 10);
    await page.locator('#btn-next-message').click();
  }
  await expect(page.locator('#modal-expulsion')).toBeVisible();
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).toContain('fake_hunter');
  await expect(page.locator('#expulsion-score-pill')).toContainText('100');
});

test('Fake: não pula enunciado, derrota após três erros e reinício limpo', async ({ page }) => {
  await page.goto('/fake-detector.html');
  await page.evaluate(() => nextMessageRound());
  expect(await page.evaluate(() => currentRound)).toBe(0);
  for (let round = 0; round < 3; round++) {
    const safe = await page.evaluate(() => SCENARIOS[currentRound].isSafe);
    await page.locator('.btn-player-bubble').nth(safe ? 1 : 0).click();
    if (round < 2) await page.locator('#btn-next-message').click();
  }
  await expect(page.locator('#modal-expulsion')).toBeVisible();
  expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('fake_hunter');
  await page.locator('#modal-expulsion button').first().click();
  await expect(page.locator('#modal-expulsion')).not.toBeVisible();
  expect(await page.evaluate(() => ({ currentRound, score, errorsCount }))).toEqual({ currentRound: 0, score: 0, errorsCount: 0 });
});
