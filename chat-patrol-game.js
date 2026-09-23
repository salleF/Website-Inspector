let currentShiftIdx = 0;
let currentLives = 3;
let currentScore = 0;
let shiftStartScore = 0;
let isShiftActive = false;
let patienceInterval = null;
let activeContactId = null;
let contactsState = {};
let isDetectiveMode = false;
let selectedEvidence1 = null;
let selectedEvidence2 = null;
let playerProfile;
let shiftGeneration = 0;
let victorySaved = false;
let modalReturnFocus = null;
let suspendedPendingShift = false;
const replyTimers = new Set();

const escapeChatHtml = text => CyberKidsProfile.escapeHtml(String(text ?? ''));
const currentShift = () => CHAT_PATROL_SHIFTS[currentShiftIdx];
const currentContact = () => currentShift()?.contacts.find(contact => contact.id === activeContactId);
const hasOpenModal = () => Boolean(document.querySelector('.modal-overlay.show'));

document.addEventListener('DOMContentLoaded', () => {
  loadPlayerProfile();
  document.querySelectorAll('[data-evidence-source]').forEach(element => {
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectEvidenceFromElement(element);
      }
    });
  });
  initShift(0);
});

function loadPlayerProfile() {
  playerProfile = CyberKidsProfile.load();
  document.getElementById('footer-player-name').textContent = playerProfile.name;
  document.getElementById('footer-player-avatar').textContent = playerProfile.avatar;
}

function clearReplyTimers() {
  replyTimers.forEach(timer => clearTimeout(timer));
  replyTimers.clear();
  clearInterval(patienceInterval);
  patienceInterval = null;
}

function initShift(shiftIndex) {
  const shift = CHAT_PATROL_SHIFTS[shiftIndex];
  if (!shift) return;
  clearReplyTimers();
  shiftGeneration++;
  currentShiftIdx = shiftIndex;
  shiftStartScore = currentScore;
  isShiftActive = false;
  closeAllModals();
  document.getElementById('win-start-menu').classList.remove('open');
  if (isDetectiveMode) toggleDetectiveMode();
  clearDetectiveSelection(1);
  clearDetectiveSelection(2);
  contactsState = {};
  shift.contacts.forEach((contact, index) => {
    contactsState[contact.id] = {
      dialogueStep: 0,
      evidenceCount: 0,
      evidenceGoal: contact.evidenceGoal,
      isBanned: false,
      isCompleted: false,
      hasUnread: index !== 0,
      unlockedConfrontations: [],
      contradictionsFound: [],
      answeredSteps: [],
      pending: false,
      isFriendVerified: false,
      messages: [contactMessage(contact, contact.dialogueTree[0].botMsg, 'msg_0')]
    };
  });
  activeContactId = shift.contacts[0].id;
  updateShiftClockUI(shift);
  updateLivesUI();
  renderDMList();
  renderActiveChat(true);
  renderActiveDossier();
  showBriefingModal(shift);
}

function contactMessage(contact, text, evidenceSource = null) {
  return {author: contact.name, avatar: contact.avatar, avatarBg: contact.avatarBg,
    text, evidenceSource, isPlayer: false};
}

function updateShiftClockUI(shift) {
  document.getElementById('win-clock-shift').textContent = `Turno ${shift.day}/5 · Tempo livre`;
}

function showBriefingModal(shift) {
  document.getElementById('modal-briefing-icon').textContent = shift.briefing.icon;
  document.getElementById('modal-briefing-title').textContent = shift.briefing.title;
  document.getElementById('modal-briefing-desc').textContent = shift.briefing.description;
  document.getElementById('briefing-start-button').textContent = isShiftActive ? 'CONTINUAR TURNO' : 'INICIAR TURNO';
  showModal('modal-briefing');
}

function startCurrentShift() {
  if (!document.getElementById('modal-briefing').classList.contains('show')) return;
  closeModal('modal-briefing');
  isShiftActive = true;
  playDiscordChime();
  renderActiveChat();
  renderActiveDossier();
  focusCurrentChoices();
}

function startPatienceLoop() { clearInterval(patienceInterval); }
function handlePatienceExhausted() {
  showDetectiveToast('Você pode ler com calma. Não responder a uma mensagem não invade sua conta.', true);
}
function updatePatienceBarsInDOM() {}

function loseLife() {
  if (!isShiftActive || currentLives <= 0) return;
  currentLives = Math.max(0, currentLives - 1);
  updateLivesUI();
  if (currentLives === 0) triggerGameOver('Vamos praticar este turno novamente. As escolhas foram apenas simuladas; nenhum dado foi enviado.');
}

function triggerGameOver(reason) {
  if (!isShiftActive) return;
  isShiftActive = false;
  clearReplyTimers();
  shiftGeneration++;
  document.getElementById('modal-game-over-desc').textContent = `${reason} Se uma situação assim acontecer de verdade, pare a conversa e procure um adulto de confiança. Você merece ajuda, mesmo se já compartilhou algo.`;
  showModal('modal-game-over');
}

function restartCurrentShift() {
  currentScore = shiftStartScore;
  currentLives = 3;
  victorySaved = false;
  initShift(currentShiftIdx);
}

function renderDMList() {
  const list = document.getElementById('dm-contacts-list');
  list.replaceChildren();
  let pending = 0;
  currentShift().contacts.forEach(contact => {
    const state = contactsState[contact.id];
    if (!state.isBanned && !state.isCompleted) pending++;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `dm-contact-item ${contact.id === activeContactId ? 'active' : ''}`;
    button.setAttribute('aria-pressed', String(contact.id === activeContactId));
    const status = state.isBanned ? '🚫 Bloqueado' : state.isCompleted ? '✅ Encerrado com segurança' : state.pending ? 'Resposta simulada...' : state.hasUnread ? 'Nova mensagem · sem pressa' : 'Conversa em análise';
    button.innerHTML = `<span class="dm-avatar-box" style="background:${escapeChatHtml(contact.avatarBg)}">${escapeChatHtml(contact.avatar)}</span><span class="dm-contact-meta"><span class="dm-name-text">${escapeChatHtml(contact.name)}</span><span class="dm-threat-tag">${status}</span></span>`;
    button.onclick = () => selectContact(contact.id);
    list.append(button);
  });
  document.getElementById('dm-pending-count').textContent = `${pending} pendente${pending === 1 ? '' : 's'}`;
}

function selectContact(contactId) {
  if (!contactsState[contactId] || activeContactId === contactId || hasOpenModal()) return;
  clearDetectiveSelection(1);
  clearDetectiveSelection(2);
  activeContactId = contactId;
  contactsState[contactId].hasUnread = false;
  playMsgPop();
  renderDMList();
  renderActiveChat(true);
  renderActiveDossier();
  document.querySelector('#dm-contacts-list [aria-pressed="true"]')?.focus({preventScroll: true});
}

function renderActiveChat(scrollToBottom = false) {
  const contact = currentContact();
  const state = contactsState[activeContactId];
  if (!contact || !state) return;
  document.getElementById('chat-active-avatar').textContent = contact.avatar;
  document.getElementById('chat-active-avatar').style.background = contact.avatarBg;
  document.getElementById('chat-active-name').textContent = contact.name;
  document.getElementById('chat-active-tag').textContent = contact.tag;
  document.getElementById('chat-active-threat').textContent = state.isBanned ? 'Bloqueado' : state.isCompleted ? 'Concluído' : 'Simulação';
  const feed = document.getElementById('chat-messages-feed');
  const oldScroll = feed.scrollTop;
  feed.replaceChildren();
  state.messages.forEach(message => {
    const row = document.createElement(message.evidenceSource ? 'button' : 'div');
    row.className = `chat-msg-row ${message.evidenceSource ? 'evidence-selectable' : ''}`;
    if (message.evidenceSource) {
      row.type = 'button';
      row.dataset.evidenceSource = message.evidenceSource;
      row.dataset.contactId = contact.id;
      row.onclick = () => selectEvidenceFromElement(row);
      [selectedEvidence1, selectedEvidence2].forEach((evidence, index) => {
        if (evidence?.source === message.evidenceSource && evidence.contactId === contact.id) row.classList.add(`evidence-selected-${index + 1}`);
      });
      row.setAttribute('aria-label', `Selecionar pista: ${message.text}`);
    }
    const messageLabel = message.evidenceSource ? ` · Mensagem ${Number(message.evidenceSource.slice(4)) + 1}` : '';
    row.innerHTML = `<span class="msg-avatar" style="background:${escapeChatHtml(message.avatarBg)}">${escapeChatHtml(message.avatar)}</span><span class="msg-content-wrap"><span class="msg-header-row"><span class="msg-author">${escapeChatHtml(message.author + messageLabel)}</span></span><span class="msg-text-body ${message.isPlayer ? 'player-reply' : ''}">${escapeChatHtml(message.text)}</span></span>`;
    feed.append(row);
  });
  feed.scrollTop = scrollToBottom ? feed.scrollHeight : oldScroll;
  document.getElementById('typing-indicator').style.display = state.pending ? 'flex' : 'none';
  document.getElementById('typing-username').textContent = `${contact.name}: próxima mensagem da simulação...`;
  renderDialogueChoices(contact, state);
}

function renderDialogueChoices(contact, state) {
  const grid = document.getElementById('dialogue-choices-grid');
  grid.replaceChildren();
  if (state.isBanned || state.isCompleted) {
    grid.textContent = state.isBanned ? 'Conversa bloqueada na simulação. Peça apoio a um adulto de confiança em situações reais.' : 'Conversa encerrada com segurança. Você pode responder aos colegas quando quiser.';
    return;
  }
  const step = contact.dialogueTree[state.dialogueStep];
  if (!step) {
    grid.textContent = 'Roteiro lido. Você pode investigar as mensagens anteriores ou encerrar a conversa pelo botão de proteção.';
    return;
  }
  step.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    const locked = index === 0 && (contact.isSuspect ? !state.unlockedConfrontations.includes(state.dialogueStep) : !state.isFriendVerified);
    button.type = 'button';
    button.className = `dialogue-btn-choice ${locked ? 'locked' : ''}`;
    button.disabled = state.pending || !isShiftActive;
    button.textContent = `${locked ? '🔍 ' : choice.icon + ' '}${locked ? 'Investigue para liberar: ' : ''}${choice.text}`;
    button.onclick = () => {
      if (locked) {
        showDetectiveToast(contact.isSuspect ? step.clue : contact.verification.clue, false);
        return;
      }
      handlePlayerChoice(contact, choice);
    };
    grid.append(button);
  });
}

function handlePlayerChoice(contact, choice) {
  const state = contactsState[contact.id];
  const step = contact.dialogueTree[state?.dialogueStep];
  if (!isShiftActive || hasOpenModal() || !state || state.pending || state.isBanned || state.isCompleted || contact.id !== activeContactId || !step?.choices.includes(choice)) return;
  if (step.choices[0] === choice && (contact.isSuspect ? !state.unlockedConfrontations.includes(state.dialogueStep) : !state.isFriendVerified)) return;
  if (choice.type === 'leave') {
    attemptBanSuspect();
    return;
  }
  const stepIndex = state.dialogueStep;
  if (state.answeredSteps.includes(stepIndex)) return;
  state.answeredSteps.push(stepIndex);
  state.pending = true;
  state.messages.push({author: `${playerProfile.name} · escolha simulada`, avatar: playerProfile.avatar,
    avatarBg: '#225b42', text: choice.text, isPlayer: true});
  playMsgPop();
  if (choice.type === 'danger') {
    appendSystemMessage(contact.isSuspect ? 'Nesta simulação, esta escolha exporia informações. Não repita isso em uma conversa real. Pare e chame um adulto de confiança; pedir ajuda é sempre permitido.' : 'Você pode colocar limites sem ofender. Recusar uma conversa não expõe dados nem invade sua conta.', contact.id);
    if (contact.isSuspect) loseLife();
    if (!isShiftActive) return;
  }
  renderActiveChat(true);
  renderActiveDossier();
  renderDMList();
  const generation = shiftGeneration;
  const timer = setTimeout(() => {
    replyTimers.delete(timer);
    if (generation !== shiftGeneration || contactsState[contact.id] !== state || !isShiftActive || state.isBanned || state.isCompleted) return;
    if (choice.botReply) state.messages.push(contactMessage(contact, choice.botReply));
    state.dialogueStep = stepIndex + 1;
    state.pending = false;
    const nextStep = contact.dialogueTree[state.dialogueStep];
    if (nextStep) state.messages.push(contactMessage(contact, nextStep.botMsg, `msg_${state.dialogueStep}`));
    else if (!contact.isSuspect) {
      state.isCompleted = true;
      currentScore += 30;
    }
    if (contact.id !== activeContactId) state.hasUnread = true;
    else {
      renderActiveChat(true);
      renderActiveDossier();
      if (!hasOpenModal()) focusCurrentChoices();
    }
    updateLivesUI();
    renderDMList();
    playDiscordChime();
    checkShiftCompletion();
  }, 450);
  replyTimers.add(timer);
}

function appendSystemMessage(text, contactId = activeContactId) {
  const state = contactsState[contactId];
  if (!state) return;
  state.messages.push({author: 'Orientação da aula', avatar: '🛡️', avatarBg: '#3f4147', text, isPlayer: false});
  if (contactId === activeContactId) renderActiveChat(true);
}

function renderActiveDossier() {
  const contact = currentContact();
  const state = contactsState[activeContactId];
  if (!contact || !state) return;
  document.getElementById('dossier-banner').style.background = contact.bannerGradient;
  ['name', 'tag', 'avatar', 'bio', 'created', 'location', 'mutual', 'verified'].forEach(field => {
    document.getElementById(`dossier-${field}`).textContent = contact[field];
  });
  document.getElementById('dossier-avatar').style.background = contact.avatarBg;
  document.querySelectorAll('.suspect-dossier-panel [data-evidence-source]').forEach(element => {
    element.dataset.contactId = contact.id;
    element.classList.remove('evidence-selected-1', 'evidence-selected-2');
    [selectedEvidence1, selectedEvidence2].forEach((evidence, index) => {
      if (evidence?.source === element.dataset.evidenceSource && evidence.contactId === contact.id) element.classList.add(`evidence-selected-${index + 1}`);
    });
  });
  document.getElementById('evidence-counter-label').textContent = contact.isSuspect ? `${state.evidenceCount} / ${state.evidenceGoal}` : state.isFriendVerified ? 'Contato confirmado' : 'Verifique o contato';
  const track = document.getElementById('evidence-blocks-track');
  track.replaceChildren();
  for (let index = 0; index < state.evidenceGoal; index++) {
    const block = document.createElement('span');
    block.className = `evidence-block-unit ${index < state.evidenceCount ? 'active' : ''}`;
    track.append(block);
  }
  const hint = document.getElementById('evidence-hint');
  if (state.isBanned || state.isCompleted) hint.textContent = 'Conversa encerrada. Nenhum dado real foi enviado.';
  else if (!contact.isSuspect) hint.textContent = contact.verification.clue;
  else {
    const remaining = contact.contradictions.find(clue => !state.contradictionsFound.includes(clue.id) && state.messages.some(message => message.evidenceSource === clue.targets.find(source => source.startsWith('msg_'))));
    hint.textContent = remaining ? remaining.clue : 'Todas as pistas disponíveis foram analisadas. Leia a próxima mensagem ou bloqueie quando quiser.';
  }
  const button = document.getElementById('btn-ban-suspect');
  button.disabled = !isShiftActive || state.isBanned || state.isCompleted;
  button.classList.toggle('ready', !button.disabled);
  button.textContent = state.isBanned ? '🔒 CONTATO BLOQUEADO' : state.isCompleted ? '✅ CONVERSA ENCERRADA' : contact.isSuspect ? '🚫 BLOQUEAR E PEDIR AJUDA' : '👋 ENCERRAR POR AGORA';
  updateLivesUI();
}

function attemptBanSuspect() {
  const contact = currentContact();
  const state = contactsState[activeContactId];
  if (!isShiftActive || hasOpenModal() || !contact || !state || state.isBanned || state.isCompleted) return;
  state.isBanned = contact.isSuspect;
  state.isCompleted = !contact.isSuspect;
  state.pending = false;
  currentScore += 30;
  clearDetectiveSelection(1);
  clearDetectiveSelection(2);
  appendSystemMessage(contact.isSuspect ? 'Contato bloqueado e denúncia simulada registrada. Na vida real, você pode bloquear sem discutir ou reunir provas. Procure um adulto de confiança; a culpa nunca é da criança.' : 'Tudo bem responder em outro momento. Você pode encerrar uma conversa com educação e confirmar a identidade pessoalmente.', contact.id);
  playBanHammer();
  renderActiveChat(true);
  renderActiveDossier();
  renderDMList();
  showDetectiveToast('Conversa encerrada com segurança. +30 pontos.', true);
  checkShiftCompletion();
}

function checkShiftCompletion() {
  if (!isShiftActive) return;
  if (!currentShift().contacts.every(contact => contactsState[contact.id].isBanned || contactsState[contact.id].isCompleted)) return;
  isShiftActive = false;
  clearReplyTimers();
  if (currentShiftIdx === CHAT_PATROL_SHIFTS.length - 1) handleGameVictory();
  else showShiftCompleteModal();
}

function showShiftCompleteModal() {
  document.getElementById('modal-shift-summary').textContent = `Turno ${currentShiftIdx + 1} concluído. Todas as conversas foram encerradas com segurança. Pontuação acumulada: ${currentScore}. Investigar é opcional; bloquear e pedir ajuda não exige confronto.`;
  showModal('modal-shift-complete');
  playEvidenceDing();
}

function advanceToNextShift() {
  if (isShiftActive || !document.getElementById('modal-shift-complete').classList.contains('show') || currentShiftIdx >= CHAT_PATROL_SHIFTS.length - 1) return;
  initShift(currentShiftIdx + 1);
}

function handleGameVictory() {
  if (victorySaved) return;
  saveVictoryToProfile();
  victorySaved = true;
  document.getElementById('victory-score').textContent = `${currentScore + 100} pontos nesta partida, incluindo 100 pela conclusão.`;
  showModal('modal-victory');
  playEvidenceDing();
}

function saveVictoryToProfile() {
  playerProfile = CyberKidsProfile.record('chat_patrol', currentScore + 100, {completed: true});
}

function updateLivesUI() {
  for (let index = 1; index <= 3; index++) {
    const heart = document.getElementById(`task-heart-${index}`);
    heart.className = `taskbar-window-tab ${index <= currentLives ? 'heart-alive' : 'heart-lost'}`;
    heart.textContent = index <= currentLives ? '❤️' : '🤍';
    heart.setAttribute('aria-label', `Tentativa ${index}: ${index <= currentLives ? 'disponível' : 'usada'}`);
  }
  document.getElementById('chat-score').textContent = `${currentScore} pts`;
}

function toggleDetectiveMode() {
  isDetectiveMode = !isDetectiveMode;
  document.body.classList.toggle('detective-active', isDetectiveMode);
  document.getElementById('detective-hud-bar').classList.toggle('visible', isDetectiveMode);
  const button = document.getElementById('btn-taskbar-detective');
  button.classList.toggle('active', isDetectiveMode);
  button.setAttribute('aria-pressed', String(isDetectiveMode));
  button.textContent = `🔍 Investigar: ${isDetectiveMode ? 'ON' : 'OFF'}`;
  if (!isDetectiveMode) {
    clearDetectiveSelection(1);
    clearDetectiveSelection(2);
  } else showDetectiveToast('Selecione duas pistas. As regras da aula estão em Meu Perfil. A dica do dossiê orienta a comparação.', true);
  playDetectiveToggleSound(isDetectiveMode);
}

function selectEvidenceFromElement(element) {
  const state = contactsState[activeContactId];
  if (!isShiftActive || !state || state.isBanned || state.isCompleted) return;
  if (!isDetectiveMode) {
    showDetectiveToast('Ative Investigar na barra inferior para selecionar pistas.', false);
    return;
  }
  const source = element.dataset.evidenceSource;
  const contactId = source?.startsWith('my_') ? null : element.dataset.contactId;
  const text = element.innerText.trim();
  if (!source || !text || (contactId && contactId !== activeContactId)) return;
  const evidence = {source, contactId, text, element};
  if ([selectedEvidence1, selectedEvidence2].some(selected => selected?.source === source && selected.contactId === contactId)) {
    showDetectiveToast('Escolha uma pista diferente. A mesma pista não pode ocupar os dois espaços.', false);
    return;
  }
  if (!selectedEvidence1) selectedEvidence1 = evidence;
  else {
    if (selectedEvidence2?.element) selectedEvidence2.element.classList.remove('evidence-selected-2');
    selectedEvidence2 = evidence;
  }
  element.classList.add(selectedEvidence1 === evidence ? 'evidence-selected-1' : 'evidence-selected-2');
  renderDetectiveSlot(1, selectedEvidence1);
  renderDetectiveSlot(2, selectedEvidence2);
  updateCrossExamineButtonState();
  playDetectiveSelectSound();
  showDetectiveToast(`Pista selecionada: ${truncateEvidenceText(text)}${source.startsWith('my_') ? '. Feche o perfil para comparar com a conversa.' : ''}`, true);
}

function renderDetectiveSlot(slotNumber, evidence) {
  const slot = document.getElementById(`detective-slot-${slotNumber}`);
  slot.className = `detective-slot-box ${evidence ? `filled-${slotNumber}` : ''}`;
  slot.textContent = evidence ? `${slotNumber}: ${truncateEvidenceText(evidence.text)} · limpar` : `Selecionar pista ${slotNumber}`;
  slot.title = evidence?.text || `Selecione a pista ${slotNumber}`;
}

function truncateEvidenceText(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 55 ? `${clean.substring(0, 52)}...` : clean;
}

function clearDetectiveSelection(slotNumber) {
  const selected = slotNumber === 1 ? selectedEvidence1 : selectedEvidence2;
  selected?.element?.classList.remove(`evidence-selected-${slotNumber}`);
  document.querySelectorAll(`.evidence-selected-${slotNumber}`).forEach(element => element.classList.remove(`evidence-selected-${slotNumber}`));
  if (slotNumber === 1) selectedEvidence1 = null;
  else selectedEvidence2 = null;
  renderDetectiveSlot(slotNumber, null);
  updateCrossExamineButtonState();
}

function updateCrossExamineButtonState() {
  const button = document.getElementById('btn-cross-examine');
  button.disabled = !selectedEvidence1 || !selectedEvidence2;
  button.classList.toggle('ready', !button.disabled);
}

function executeCrossExamine() {
  const contact = currentContact();
  const state = contactsState[activeContactId];
  if (!isShiftActive || hasOpenModal() || !isDetectiveMode || !contact || !state || state.isBanned || state.isCompleted || !selectedEvidence1 || !selectedEvidence2) return;
  const selected = [selectedEvidence1, selectedEvidence2];
  const valid = selected.every(evidence => evidence.source.startsWith('my_') ? Boolean(document.querySelector(`[data-evidence-source="${evidence.source}"]`)) : evidence.contactId === contact.id && (evidence.source.startsWith('msg_') ? state.messages.some(message => message.evidenceSource === evidence.source) : Boolean(document.querySelector(`.suspect-dossier-panel [data-evidence-source="${evidence.source}"]`))));
  const sources = selected.map(evidence => evidence.source);
  const matches = clue => sources[0] !== sources[1] && clue.targets.length === 2 && clue.targets.every(source => sources.includes(source));
  if (!valid) showDetectiveToast('As pistas precisam pertencer à conversa atual.', false);
  else if (!contact.isSuspect) {
    if (matches(contact.verification)) {
      if (!state.isFriendVerified) {
        state.isFriendVerified = true;
        currentScore += 15;
        appendSystemMessage(contact.verification.explanation);
      }
      showDetectiveToast('Contato confirmado pelo registro da aula. +15 pontos apenas na primeira verificação.', true);
      playEvidenceDing();
    } else showDetectiveToast(contact.verification.clue, false);
  } else {
    const clue = contact.contradictions.find(matches);
    if (!clue) showDetectiveToast('Essas duas pistas não mostram o problema descrito. Leia a dica do dossiê e tente outro par.', false);
    else if (state.contradictionsFound.includes(clue.id)) showDetectiveToast('Você já analisou essa pista. Não é necessário repetir.', true);
    else {
      state.contradictionsFound.push(clue.id);
      state.unlockedConfrontations.push(clue.step);
      state.evidenceCount = state.contradictionsFound.length;
      currentScore += 15;
      appendSystemMessage(`Pista analisada: ${clue.explanation}`);
      showDetectiveToast(`${clue.explanation} +15 pontos.`, true);
      playEvidenceDing();
    }
  }
  clearDetectiveSelection(1);
  clearDetectiveSelection(2);
  renderActiveDossier();
  renderDialogueChoices(contact, state);
}

function showDetectiveToast(message, success) {
  const toast = document.getElementById('detective-toast');
  toast.className = `detective-feedback-toast ${success ? 'success' : 'mismatch'}`;
  toast.textContent = message;
}

function toggleStartMenu() {
  if (hasOpenModal()) return;
  const menu = document.getElementById('win-start-menu');
  const open = menu.classList.toggle('open');
  document.getElementById('btn-win-start').setAttribute('aria-expanded', String(open));
  if (open) menu.querySelector('button').focus();
  playStartMenuSound();
}

function showModal(id) {
  if (!hasOpenModal()) modalReturnFocus = document.activeElement;
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.toggle('show', modal.id === id));
  document.querySelector('main').inert = true;
  document.querySelector('.windows-taskbar').inert = true;
  document.getElementById('win-start-menu').classList.remove('open');
  document.getElementById('btn-win-start').setAttribute('aria-expanded', 'false');
  const modal = document.getElementById(id);
  modal.querySelector('button, [tabindex="0"]')?.focus();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  document.querySelector('main').inert = false;
  document.querySelector('.windows-taskbar').inert = false;
  if (modalReturnFocus?.isConnected && !modalReturnFocus.closest('.modal-overlay')) modalReturnFocus.focus();
  else document.getElementById('btn-win-start').focus();
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('show'));
  document.querySelector('main').inert = false;
  document.querySelector('.windows-taskbar').inert = false;
}

function focusCurrentChoices() {
  const target = document.querySelector('#dialogue-choices-grid button:not(:disabled)');
  if (target) target.focus({preventScroll: true});
}

function openMyProfileModal() { showModal('modal-my-profile'); }
function closeMyProfileModal() { closeModal('modal-my-profile'); }
function openBriefingModal() { showBriefingModal(currentShift()); }
function requestExitToHub() { showModal('modal-confirm-exit'); }
function closeExitConfirmation() { closeModal('modal-confirm-exit'); }

document.addEventListener('click', event => {
  const menu = document.getElementById('win-start-menu');
  if (menu && !menu.contains(event.target) && !document.getElementById('btn-win-start').contains(event.target)) {
    menu.classList.remove('open');
    document.getElementById('btn-win-start').setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', event => {
  const modal = document.querySelector('.modal-overlay.show');
  if (!modal) {
    if (event.key === 'Escape') {
      document.getElementById('win-start-menu').classList.remove('open');
      document.getElementById('btn-win-start').setAttribute('aria-expanded', 'false');
    }
    return;
  }
  if (event.key === 'Escape' && (['modal-my-profile', 'modal-confirm-exit'].includes(modal.id) || (modal.id === 'modal-briefing' && isShiftActive))) {
    closeModal(modal.id);
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = Array.from(modal.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')).filter(element => element.getClientRects().length);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last) || !modal.contains(document.activeElement)) {
    event.preventDefault();
    (event.shiftKey ? last : first)?.focus();
  }
});

window.addEventListener('pagehide', () => {
  suspendedPendingShift = Object.values(contactsState).some(state => state.pending);
  clearReplyTimers();
});
window.addEventListener('pageshow', event => {
  if (event.persisted && suspendedPendingShift) {
    suspendedPendingShift = false;
    restartCurrentShift();
  }
});
