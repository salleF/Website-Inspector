(function (global) {
  'use strict';

  const KEY = 'cyberkids_profile';
  const games = {
    website_inspector: 'link_inspector',
    fake_detector: 'fake_hunter',
    chat_patrol: 'chat_patrol',
    secret_password: 'password_guardian',
    privacy_shield: 'privacy_guardian'
  };
  const avatars = {
    '🕵️‍♂️': 'Detetive', '🤖': 'Cyber Bot', '🦊': 'Raposa',
    '🐱': 'Gato', '🧙‍♂️': 'Mago', '🦸‍♀️': 'Heroína'
  };
  let persistent = true;
  let memory = normalize(null);

  function number(value) {
    return typeof value === 'number' && Number.isFinite(value)
      ? Math.min(1000000, Math.max(0, Math.floor(value))) : 0;
  }

  function normalize(value) {
    const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const sourceScores = input.scores && typeof input.scores === 'object' && !Array.isArray(input.scores) ? input.scores : {};
    const name = typeof input.name === 'string'
      ? Array.from(input.name.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').trim()).slice(0, 32).join('') : '';
    const avatar = typeof input.avatar === 'string' && Object.hasOwn(avatars, input.avatar) ? input.avatar : '🕵️‍♂️';
    const scores = {};
    Object.keys(games).forEach(id => { scores[id] = number(sourceScores[id]); });
    const sourceBadges = Array.isArray(input.badges) ? input.badges : [];
    const badges = Object.values(games).filter(id => sourceBadges.includes(id));
    if (badges.length === Object.keys(games).length) badges.push('supreme_detective');
    return { version: 1, name: name || 'Agente Secreto', avatar, avatarLabel: avatars[avatar], scores, badges };
  }

  function showStorageStatus() {
    if (!global.document || !global.document.body) return;
    let warning = global.document.getElementById('profile-storage-warning');
    if (persistent) {
      if (warning) warning.remove();
      return;
    }
    if (!warning) {
      warning = global.document.createElement('div');
      warning.id = 'profile-storage-warning';
      warning.setAttribute('role', 'status');
      warning.style.cssText = 'position:fixed;z-index:20000;bottom:12px;left:12px;right:12px;max-height:40vh;overflow:auto;padding:12px 16px;background:#fff7ed;color:#7c2d12;border:2px solid #9a3412;font:600 14px/1.5 system-ui,sans-serif;text-align:center;';
      const message = global.document.createElement('p');
      message.textContent = 'Este navegador não está salvando o progresso. Você pode jogar, mas os pontos desta página serão perdidos ao sair. Peça ajuda ao professor para ativar o armazenamento.';
      message.style.margin = '0 0 8px';
      const close = global.document.createElement('button');
      close.type = 'button';
      close.textContent = 'Entendi';
      close.style.cssText = 'color:#7c2d12;background:#fff;border:2px solid #9a3412;padding:8px 16px;font:inherit;cursor:pointer;';
      close.addEventListener('click', () => warning.remove());
      warning.append(message, close);
      global.document.body.prepend(warning);
    }
  }

  function load() {
    if (persistent) {
      try {
        const raw = global.localStorage.getItem(KEY);
        try { memory = normalize(raw === null ? null : JSON.parse(raw)); }
        catch (_) { memory = normalize(null); }
      } catch (_) {
        persistent = false;
        showStorageStatus();
      }
    }
    return normalize(memory);
  }

  function save(profile) {
    memory = normalize(profile);
    try {
      global.localStorage.setItem(KEY, JSON.stringify(memory));
      persistent = true;
    } catch (_) { persistent = false; }
    showStorageStatus();
    return normalize(memory);
  }

  function record(gameId, score, options) {
    const profile = load();
    if (typeof gameId !== 'string' || !Object.hasOwn(games, gameId)) return profile;
    profile.scores[gameId] = Math.max(profile.scores[gameId], number(score));
    if (options && options.completed === true) profile.badges.push(games[gameId]);
    return save(profile);
  }

  function reset() {
    memory = normalize(null);
    try {
      global.localStorage.removeItem(KEY);
      persistent = true;
    } catch (_) { persistent = false; }
    showStorageStatus();
    return normalize(memory);
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  global.CyberKidsProfile = Object.freeze({ load, save, record, reset, escapeHtml, isPersistent: () => persistent });
  if (global.document) global.document.addEventListener('DOMContentLoaded', showStorageStatus);
})(typeof window !== 'undefined' ? window : globalThis);
