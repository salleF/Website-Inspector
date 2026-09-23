const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Telas não apresentam violações WCAG A/AA sérias ou críticas', async ({ page }) => {
  test.setTimeout(120000);
  const findings = [];
  for (const file of ['index.html', 'website-inspector.html', 'fake-detector.html', 'chat-patrol.html', 'secret-password.html', 'privacy-shield.html']) {
    await page.goto('/' + file);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    for (const violation of result.violations.filter(item => ['critical', 'serious'].includes(item.impact))) {
      findings.push({ file, rule: violation.id, impact: violation.impact, nodes: violation.nodes.map(node => ({ target: node.target, detail: node.failureSummary })) });
    }
    if (file === 'chat-patrol.html' || file === 'secret-password.html' || file === 'privacy-shield.html') {
      if (file === 'chat-patrol.html') await page.locator('button[onclick="startCurrentShift()"]').click();
      else await page.locator('[data-action="start"]').click();
      const active = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      for (const violation of active.violations.filter(item => ['critical', 'serious'].includes(item.impact))) {
        findings.push({ file: file + ' ativo', rule: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, detail: node.failureSummary })) });
      }
    }
  }
  expect(findings).toEqual([]);
});
