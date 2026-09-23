const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../profile.js'), 'utf8');

function profile(raw, blocked = false) {
  const store = new Map(raw === undefined ? [] : [['cyberkids_profile', raw]]);
  const context = vm.createContext({ localStorage: {
    getItem(key) { if (blocked) throw new Error('Blocked'); return store.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('Blocked'); store.set(key, value); },
    removeItem(key) { if (blocked) throw new Error('Blocked'); store.delete(key); }
  } });
  vm.runInContext(source, context);
  return { api: context.CyberKidsProfile, store };
}

test('Perfil corrompido ou incompleto sempre produz schema jogável', () => {
  for (const raw of ['{', 'null', '[]', 'true', '"string"', '{"scores":null,"badges":{}}', '{"avatar":{"toString":null}}']) {
    const data = profile(raw).api.load();
    assert.equal(data.name, 'Agente Secreto');
    assert.equal(Object.keys(data.scores).length, 5);
    assert.equal(data.badges.length, 0);
  }
});

test('Tipos, limites, avatares e medalhas são normalizados', () => {
  const { api } = profile();
  const data = api.save({ name: '\u0000' + 'A'.repeat(50), avatar: '<img src=x>', scores: { website_inspector: '99', fake_detector: -3, chat_patrol: Infinity, secret_password: 12.7, privacy_shield: 9e9 }, badges: ['fake_hunter', 'fake_hunter', 'supreme_detective', 'unknown'] });
  assert.equal(data.name.length, 32);
  assert.equal(data.avatar, '🕵️‍♂️');
  assert.equal(data.scores.website_inspector, 0);
  assert.equal(data.scores.fake_detector, 0);
  assert.equal(data.scores.chat_patrol, 0);
  assert.equal(data.scores.secret_password, 12);
  assert.equal(data.scores.privacy_shield, 1000000);
  assert.equal(data.badges.join(','), 'fake_hunter');
});

test('Recordes não diminuem e medalhas exigem conclusão de cada jogo', () => {
  const { api } = profile();
  api.record('website_inspector', 100, { completed: false });
  assert.equal(api.load().badges.length, 0);
  api.record('website_inspector', 20, { completed: true });
  assert.equal(api.load().scores.website_inspector, 100);
  for (const id of ['fake_detector', 'chat_patrol', 'secret_password', 'privacy_shield']) api.record(id, 10, { completed: true });
  const final = api.load();
  assert.equal(final.badges.length, 6);
  assert.ok(final.badges.includes('supreme_detective'));
  api.record('unknown', 99, { completed: true });
  assert.equal(Object.keys(api.load().scores).length, 5);
});

test('Load não compartilha referências e reset restaura os valores originais', () => {
  const { api } = profile();
  const first = api.load();
  first.name = 'Mutated'; first.scores.fake_detector = 999; first.badges.push('fake_hunter');
  assert.equal(api.load().name, 'Agente Secreto');
  api.save(first);
  assert.equal(api.load().name, 'Mutated');
  api.reset();
  assert.equal(api.load().name, 'Agente Secreto');
  assert.equal(api.load().scores.fake_detector, 0);
  assert.equal(api.load().badges.length, 0);
});

test('Falha no localStorage preserva a partida em memória e permite reset', () => {
  const { api } = profile(undefined, true);
  api.record('chat_patrol', 80, { completed: true });
  assert.equal(api.isPersistent(), false);
  assert.equal(api.load().scores.chat_patrol, 80);
  assert.ok(api.load().badges.includes('chat_patrol'));
  api.reset();
  assert.equal(api.load().scores.chat_patrol, 0);
});

test('Nova instância relê progresso salvo por outra página', () => {
  const { api, store } = profile();
  api.record('website_inspector', 250, { completed: true });
  const second = profile(store.get('cyberkids_profile')).api;
  second.record('fake_detector', 100, { completed: true });
  assert.equal(second.load().scores.website_inspector, 250);
  assert.equal(second.load().badges.length, 2);
});

test('Escape neutraliza marcação HTML', () => {
  assert.equal(profile().api.escapeHtml('<img onerror="x"> & \'x\''), '&lt;img onerror=&quot;x&quot;&gt; &amp; &#39;x&#39;');
});
