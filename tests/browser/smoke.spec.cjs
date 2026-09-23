const { test, expect } = require('@playwright/test');

const pages = ['index.html', 'website-inspector.html', 'fake-detector.html', 'chat-patrol.html', 'secret-password.html', 'privacy-shield.html'];

for (const width of [1366, 768, 390, 320]) {
  test(`Todas as telas carregam sem erro ou overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1366 ? 768 : 844 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const failed = [];
    page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
    await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:8765/') ? route.continue() : route.abort());
    for (const filename of pages) {
      await page.goto('/' + filename);
      await expect(page.locator('body')).toBeVisible();
      const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, title: document.title, broken: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src) }));
      expect(metrics.title).not.toBe('');
      expect(metrics.scroll, filename).toBeLessThanOrEqual(metrics.width + 1);
      expect(metrics.broken, filename).toEqual([]);
      if (filename === 'website-inspector.html') {
        expect(await page.evaluate(() => document.body.scrollTop)).toBe(0);
        await expect(page.locator('.lesson-title')).toBeInViewport();
      }
      await page.screenshot({ path: `test-results/screenshots/${width}-${filename}.png`, fullPage: true });
      if (filename === 'chat-patrol.html') {
        await page.locator('button[onclick="startCurrentShift()"]').click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth), filename + ' ativo').toBeLessThanOrEqual(width + 1);
        await page.screenshot({ path: `test-results/screenshots/${width}-chat-active.png`, fullPage: true });
      }
      if (filename === 'secret-password.html' || filename === 'privacy-shield.html') {
        await page.locator('[data-action="start"]').click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth), filename + ' ativo').toBeLessThanOrEqual(width + 1);
        await page.screenshot({ path: `test-results/screenshots/${width}-active-${filename}.png`, fullPage: true });
      }
    }
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
  });
}

test('Rotas de lançamento e endereço legado funcionam', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a.btn-game-launch').evaluateAll(elements => elements.map(el => el.getAttribute('href')));
  expect(links.sort()).toEqual(pages.slice(1).sort());
  await page.goto('/detetive_web_game.html');
  await expect(page).toHaveURL(/website-inspector\.html$/);
});

test('Perfil incompleto ou corrompido não quebra nenhuma tela', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  for (const data of ['{', 'null', '[]', '{"scores":null,"badges":{}}', '{"name":"<img src=x onerror=alert(1)>","scores":{"website_inspector":"20"},"badges":["fake_hunter","fake_hunter","unknown"]}']) {
    await page.evaluate(raw => localStorage.setItem('cyberkids_profile', raw), data);
    for (const filename of pages) {
      await page.goto('/' + filename);
      expect(await page.evaluate(() => CyberKidsProfile.load().badges)).not.toContain('unknown');
    }
  }
  expect(errors).toEqual([]);
});

test('Sem armazenamento, áudio ou WebGL o jogo continua utilizável', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) { return /webgl/.test(kind) ? null : original.call(this, kind, ...args); };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const filename of pages) {
    await page.goto('/' + filename);
    await page.evaluate(() => {
      CyberKidsProfile.record('fake_detector', 10, { completed: true });
      if (CyberKidsProfile.load().scores.fake_detector !== 10) throw new Error('Memory fallback lost score');
    });
    await expect(page.locator('#profile-storage-warning')).toBeVisible();
    await page.locator('#profile-storage-warning button').click();
    if (filename === 'website-inspector.html') {
      await page.locator('#sound-toggle').click();
      await page.locator('#vhs-toggle').click();
      const safe = await page.evaluate(() => scenarios[0].results[0].isSafe);
      await page.locator('#actions-0-0').getByRole('button').nth(safe ? 0 : 1).click();
    }
    if (filename === 'fake-detector.html') {
      await page.locator('#sound-toggle').click();
      await page.locator('.btn-player-bubble').first().click();
    }
    if (filename === 'chat-patrol.html') {
      await page.locator('button[onclick="startCurrentShift()"]').click();
      await page.locator('#tray-audio-toggle').click();
      await page.locator('#btn-ban-suspect').click();
    }
  }
  expect(errors).toEqual([]);
});
