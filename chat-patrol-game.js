// ============================================================================
// CHAT PATROL: MOTOR DE JOGO, MECÂNICA INVESTIGATIVA & MULTITAREFA
// Estilo Papers, Please + Ace Attorney + Five Nights at Freddy's
// Zero dependências externas — Integração total com localStorage (CyberKids OS)
// ============================================================================

// Global Game State
let currentShiftIdx = 0;
let currentLives = 3;
let currentScore = 0;
let isShiftActive = false;
let patienceInterval = null;
let activeContactId = null;
let contactsState = {};

// Detective Mode Selection State
let isDetectiveMode = false;
let selectedEvidence1 = null;
let selectedEvidence2 = null;

// Player Profile Storage Reference
let playerProfile = {
  name: "Agente Secreto",
  avatar: "🕵️‍♂️",
  avatarLabel: "Detetive",
  scores: { website_inspector: 0, fake_detector: 0, chat_patrol: 0 },
  badges: []
};

// ----------------------------------------------------------------------------
// INITIALIZATION & STORAGE
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadPlayerProfile();
  initShift(0);
});

function loadPlayerProfile() {
  try {
    const raw = localStorage.getItem('cyberkids_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      playerProfile = Object.assign(playerProfile, parsed);
    }
  } catch (e) {
    console.warn("Falha ao carregar perfil do jogador:", e);
  }
}

function initShift(shiftIndex) {
  currentShiftIdx = shiftIndex;
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  if (!shiftData) return;

  isShiftActive = false;
  clearInterval(patienceInterval);

  // Reset contacts state
  contactsState = {};
  shiftData.contacts.forEach((c, idx) => {
    const initialMsg = c.dialogueTree && c.dialogueTree[0] ? c.dialogueTree[0].botMsg : "Olá!";
    const nowStr = "Hoje às " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contactsState[c.id] = {
      patienceRemaining: c.patienceSec,
      maxPatience: c.patienceSec,
      dialogueStep: 0,
      evidenceCount: 0,
      evidenceGoal: c.evidenceGoal,
      isBanned: false,
      isCompleted: false,
      hasUnread: idx !== 0,
      unlockedConfrontations: [], // array of step indices where confrontation is unlocked
      contradictionsFound: [],    // array of contradiction ids resolved
      stepChoicesShuffled: {},    // cache shuffled options per step to avoid shuffling mid-render
      isFriendVerified: false,    // true if legitimate friend has been verified
      messages: [
        {
          author: c.name,
          avatar: c.avatar,
          avatarBg: c.avatarBg,
          text: initialMsg,
          timestamp: nowStr,
          isPlayer: false,
          evidenceSource: 'msg_0'
        }
      ]
    };
  });

  // Default active contact is the first one
  activeContactId = shiftData.contacts[0].id;

  // Clear detective mode
  if (isDetectiveMode) toggleDetectiveMode();
  clearDetectiveSelection(1);
  clearDetectiveSelection(2);

  // Update UI Elements
  updateShiftClockUI(shiftData);
  updateLivesUI();
  renderDMList();
  renderActiveChat();
  renderActiveDossier();

  // Show Shift Briefing Modal
  showBriefingModal(shiftData);
}

function updateShiftClockUI(shiftData) {
  const clockEl = document.getElementById('win-clock-shift');
  if (clockEl) {
    clockEl.textContent = shiftData.timeLabel || `📅 Dia ${shiftData.day} • 15:00`;
  }
}

function showBriefingModal(shiftData) {
  const modal = document.getElementById('modal-briefing');
  const icon = document.getElementById('modal-briefing-icon');
  const title = document.getElementById('modal-briefing-title');
  const desc = document.getElementById('modal-briefing-desc');

  if (icon) icon.textContent = shiftData.briefing.icon;
  if (title) title.textContent = shiftData.briefing.title;
  if (desc) desc.innerHTML = shiftData.briefing.description;

  if (modal) modal.classList.add('show');
}

function startCurrentShift() {
  const modal = document.getElementById('modal-briefing');
  if (modal) modal.classList.remove('show');

  isShiftActive = true;
  startPatienceLoop();
  playDiscordChime();
}

// ----------------------------------------------------------------------------
// MULTITASKING REAL-TIME PATIENCE LOOP (FNAF-LIKE TENSION)
// ----------------------------------------------------------------------------
function startPatienceLoop() {
  clearInterval(patienceInterval);
  patienceInterval = setInterval(() => {
    if (!isShiftActive) return;

    const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
    if (!shiftData) return;

    let anyActive = false;

    shiftData.contacts.forEach(c => {
      const state = contactsState[c.id];
      if (!state || state.isBanned || state.isCompleted) return;

      anyActive = true;
      state.patienceRemaining -= 1;

      // Patience exhausted -> Jumpscare & Life Penalty
      if (state.patienceRemaining <= 0) {
        handlePatienceExhausted(c);
      }
    });

    updatePatienceBarsInDOM();

    if (!anyActive) {
      checkShiftCompletion();
    }
  }, 1000);
}

function handlePatienceExhausted(contact) {
  const state = contactsState[contact.id];
  if (!state) return;

  // Trigger jumpscare audio and visuals
  playJumpscare();

  loseLife();

  // Reset patience slightly so player can react
  state.patienceRemaining = Math.max(10, Math.floor(contact.patienceSec * 0.4));

  // Append angry message from contact
  const angryMsgs = [
    "VOCÊ TÁ ME IGNORANDO?! RESPONDE AGORA SENÃO VOU INVADIR SUA CONTA!",
    "ÚLTIMO AVISO! ME PASSA SEUS DADOS LOGO OU VAI SOFRER AS CONSEQUÊNCIAS!",
    "PAROU DE RESPONDER POR QUÊ?! PASSA SEUS DADOS AGORA MESMO!"
  ];
  const nowStr = "Hoje às " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const chosenAngry = angryMsgs[Math.floor(Math.random() * angryMsgs.length)];

  state.messages.push({
    author: contact.name,
    avatar: contact.avatar,
    avatarBg: contact.avatarBg,
    text: chosenAngry,
    timestamp: nowStr,
    isPlayer: false,
    evidenceSource: `msg_${state.messages.length}`
  });

  if (activeContactId === contact.id) {
    renderActiveChat();
  } else {
    state.hasUnread = true;
    renderDMList();
  }
}

function loseLife() {
  currentLives--;
  playWindowCloseSound();
  updateLivesUI();

  if (currentLives <= 0) {
    triggerGameOver("A integridade do seu sistema foi completamente comprometida! Você perdeu todas as vidas.");
  }
}

function triggerGameOver(customReason) {
  isShiftActive = false;
  clearInterval(patienceInterval);
  playWindowsErrorSound();

  const modal = document.getElementById('modal-game-over');
  const desc = document.getElementById('modal-game-over-desc');
  if (desc && customReason) {
    desc.innerHTML = `${customReason}<br><br>Lembre-se: golpistas usam pressão psicológica e dados falsos para enganar. Fique sempre atento às contradições no Modo Detetive!`;
  }
  if (modal) modal.classList.add('show');
}

function restartCurrentShift() {
  const modal = document.getElementById('modal-game-over');
  if (modal) modal.classList.remove('show');

  currentLives = 3;
  updateLivesUI();
  initShift(currentShiftIdx);
}

// ----------------------------------------------------------------------------
// UI RENDERING: DM LIST (COLUMN 2)
// ----------------------------------------------------------------------------
function renderDMList() {
  const listEl = document.getElementById('dm-contacts-list');
  if (!listEl) return;

  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  if (!shiftData) return;

  listEl.innerHTML = '';

  let pendingCount = 0;

  shiftData.contacts.forEach(c => {
    const state = contactsState[c.id];
    if (!state) return;
    const isActive = c.id === activeContactId;

    if (!state.isBanned && !state.isCompleted) {
      pendingCount++;
    }

    const item = document.createElement('div');
    item.className = `dm-contact-item ${isActive ? 'active' : ''}`;
    item.onclick = () => selectContact(c.id);

    let statusText = "Aguardando resposta...";
    let statusClass = "";

    if (state.isBanned) {
      statusText = "🚫 Bloqueado & Denunciado";
      statusClass = "threat-danger";
    } else if (state.isCompleted) {
      statusText = "✅ Conversa Segura";
      statusClass = "threat-safe";
    } else {
      const pct = (state.patienceRemaining / state.maxPatience) * 100;
      if (pct <= 25) {
        statusText = `🔥 Urgente: ${state.patienceRemaining}s`;
        statusClass = "threat-danger";
      } else if (pct <= 50) {
        statusText = `⏳ Paciência: ${state.patienceRemaining}s`;
        statusClass = "threat-warn";
      } else {
        statusText = `💬 Paciência: ${state.patienceRemaining}s`;
      }
    }

    const unreadDot = state.hasUnread && !isActive ? `<span style="background:var(--dc-red); width:8px; height:8px; border-radius:50%; display:inline-block; margin-left:auto;"></span>` : '';

    item.innerHTML = `
      <div class="dm-avatar-box" style="background:${c.avatarBg}">
        ${c.avatar}
        <span class="status-indicator ${c.status || 'online'}"></span>
      </div>
      <div class="dm-contact-meta">
        <div class="dm-name-row">
          <span class="dm-name-text">${c.name}</span>
          ${unreadDot}
        </div>
        <div class="dm-threat-tag ${statusClass}">
          ${statusText}
        </div>
        ${!state.isBanned && !state.isCompleted ? `
          <div class="patience-track">
            <div class="patience-fill" id="patience-fill-${c.id}" style="width: ${(state.patienceRemaining / state.maxPatience) * 100}%;"></div>
          </div>
        ` : ''}
      </div>
    `;

    listEl.appendChild(item);
  });

  const pendingLabel = document.getElementById('dm-pending-count');
  if (pendingLabel) {
    pendingLabel.textContent = `${pendingCount} Alerta${pendingCount !== 1 ? 's' : ''}`;
  }
}

function updatePatienceBarsInDOM() {
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  if (!shiftData) return;

  shiftData.contacts.forEach(c => {
    const state = contactsState[c.id];
    if (!state || state.isBanned || state.isCompleted) return;

    const fill = document.getElementById(`patience-fill-${c.id}`);
    if (fill) {
      const pct = Math.max(0, Math.min(100, (state.patienceRemaining / state.maxPatience) * 100));
      fill.style.width = `${pct}%`;

      if (pct <= 25) {
        fill.style.background = "var(--dc-red)";
      } else if (pct <= 50) {
        fill.style.background = "var(--dc-yellow)";
      } else {
        fill.style.background = "var(--dc-green)";
      }
    }
  });
}

function selectContact(contactId) {
  if (activeContactId === contactId) return;

  playMsgPop();
  activeContactId = contactId;

  const state = contactsState[contactId];
  if (state) state.hasUnread = false;

  renderDMList();
  renderActiveChat();
  renderActiveDossier();
}

// ----------------------------------------------------------------------------
// UI RENDERING: ACTIVE CHAT FEED & CHOICES (COLUMN 3)
// ----------------------------------------------------------------------------
function renderActiveChat() {
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  const contact = shiftData.contacts.find(c => c.id === activeContactId);
  const state = contactsState[activeContactId];
  if (!contact || !state) return;

  // Header Bar
  const activeAvatar = document.getElementById('chat-active-avatar');
  const activeName = document.getElementById('chat-active-name');
  const activeTag = document.getElementById('chat-active-tag');
  const activeThreat = document.getElementById('chat-active-threat');

  if (activeAvatar) {
    activeAvatar.textContent = contact.avatar;
    activeAvatar.style.background = contact.avatarBg;
  }
  if (activeName) activeName.textContent = contact.name;
  if (activeTag) activeTag.textContent = contact.tag;
  if (activeThreat) {
    if (state.isBanned) {
      activeThreat.textContent = "Status: Bloqueado";
      activeThreat.style.background = "rgba(242, 63, 67, 0.2)";
      activeThreat.style.color = "var(--dc-red)";
    } else if (state.isCompleted) {
      activeThreat.textContent = "Status: Seguro";
      activeThreat.style.background = "rgba(35, 165, 90, 0.2)";
      activeThreat.style.color = "var(--dc-green)";
    } else if (!contact.isSuspect) {
      activeThreat.textContent = "Status: Colega Escolar";
      activeThreat.style.background = "rgba(88, 101, 242, 0.2)";
      activeThreat.style.color = "var(--dc-blurple)";
    } else {
      activeThreat.textContent = "Nível: Suspeito";
      activeThreat.style.background = "rgba(240, 178, 50, 0.2)";
      activeThreat.style.color = "var(--dc-yellow)";
    }
  }

  // Welcome Banner
  const welcomeAvatar = document.getElementById('welcome-avatar');
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeDesc = document.getElementById('welcome-desc');
  if (welcomeAvatar) {
    welcomeAvatar.textContent = contact.avatar;
    welcomeAvatar.style.background = contact.avatarBg;
  }
  if (welcomeTitle) welcomeTitle.textContent = contact.name;
  if (welcomeDesc) welcomeDesc.textContent = `Esta é a mensagem direta de abertura com ${contact.name}${contact.tag}.`;

  // Messages Stream
  const feed = document.getElementById('chat-messages-feed');
  if (feed) {
    // Keep the welcome banner at the top
    const welcomeBanner = feed.querySelector('.chat-welcome-banner');
    feed.innerHTML = '';
    if (welcomeBanner) feed.appendChild(welcomeBanner);

    // Render Messages
    state.messages.forEach((msg, idx) => {
      const msgItem = document.createElement('div');
      msgItem.className = 'chat-message-row evidence-selectable';
      const evidenceSource = msg.evidenceSource || `msg_${idx}`;
      msgItem.setAttribute('data-evidence-source', evidenceSource);
      msgItem.onclick = () => selectEvidenceFromElement(msgItem);

      // Apply selection highlights if active
      if (selectedEvidence1 && selectedEvidence1.source === evidenceSource) {
        msgItem.classList.add('evidence-selected-1');
      }
      if (selectedEvidence2 && selectedEvidence2.source === evidenceSource) {
        msgItem.classList.add('evidence-selected-2');
      }

      msgItem.innerHTML = `
        <div class="message-avatar" style="background:${msg.avatarBg}">${msg.avatar}</div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">${msg.author}</span>
            <span class="message-timestamp">${msg.timestamp}</span>
          </div>
          <div class="message-text">${msg.text}</div>
        </div>
      `;
      feed.appendChild(msgItem);
    });

    // Auto scroll to bottom
    feed.scrollTop = feed.scrollHeight;
  }

  // Render dialogue choices
  renderDialogueChoices(contact, state);
}

// ----------------------------------------------------------------------------
// 3 CHOICES ARCHITECTURE:
// Choice 1: Confrontation (Locked until contradiction found via Detective Mode) / Help Legitimate Friend
// Choice 2 & 3: Bait and Risk Options with Dynamic Position Shuffling
// ----------------------------------------------------------------------------
function renderDialogueChoices(contact, state) {
  const choicesGrid = document.getElementById('dialogue-choices-grid');
  if (!choicesGrid) return;

  choicesGrid.innerHTML = '';

  if (state.isBanned) {
    choicesGrid.innerHTML = `
      <div style="color:var(--dc-red); font-weight:700; padding:12px; background:#1e1f22; border-radius:6px; text-align:center; border:1px solid var(--dc-red); grid-column: 1 / -1;">
        🚫 Este usuário foi bloqueado e denunciado com sucesso! Ameaça neutralizada.
      </div>
    `;
    return;
  }

  if (state.isCompleted) {
    choicesGrid.innerHTML = `
      <div style="color:var(--dc-green); font-weight:700; padding:12px; background:#1e1f22; border-radius:6px; text-align:center; border:1px solid var(--dc-green); grid-column: 1 / -1;">
        ✅ Conversa com amigo legítimo concluída com sucesso e segurança!
      </div>
    `;
    return;
  }

  // Check if dialogue tree has a current step
  const stepIdx = state.dialogueStep;
  const currentStep = contact.dialogueTree ? contact.dialogueTree[stepIdx] : null;

  if (!currentStep) {
    // If steps are finished, display waiting for Ban or completion
    if (contact.isSuspect) {
      choicesGrid.innerHTML = `
        <div style="color:var(--dc-yellow); font-weight:700; padding:12px; background:#1e1f22; border-radius:6px; text-align:center; border:1px solid var(--dc-yellow); grid-column: 1 / -1;">
          🎯 Você confrontou o suspeito em todas as etapas! Use o botão <strong>BLOQUEAR E DENUNCIAR</strong> no Dossiê à direita!
        </div>
      `;
    } else {
      choicesGrid.innerHTML = `
        <div style="color:var(--dc-green); font-weight:700; padding:12px; background:#1e1f22; border-radius:6px; text-align:center; border:1px solid var(--dc-green); grid-column: 1 / -1;">
          ✅ Todas as dúvidas foram esclarecidas! A conversa está segura.
        </div>
      `;
    }
    return;
  }

  // CHOICE 1: CONFRONTATION OR LEGITIMATE ASSISTANCE
  const confrontationUnlocked = state.unlockedConfrontations.includes(stepIdx) || state.evidenceCount > stepIdx;
  const confrontationChoice = currentStep.choices[0]; // First choice in data is confrontation / direct verify

  const btnConfront = document.createElement('button');
  btnConfront.className = 'dialogue-btn-choice';

  if (!contact.isSuspect) {
    // Legitimate friend option
    if (state.isFriendVerified) {
      btnConfront.classList.add('ready');
      btnConfront.innerHTML = `
        <span class="choice-icon">🤝</span>
        <span>${confrontationChoice.text || '[Ajudar Colega] Enviar ajuda escolar com segurança'}</span>
      `;
      btnConfront.onclick = () => handlePlayerChoice(contact, confrontationChoice);
    } else {
      btnConfront.classList.add('locked');
      btnConfront.innerHTML = `
        <span class="choice-icon">🔒</span>
        <span>[BLOQUEADO] Verifique a coerência escolar no Modo Detetive para liberar o envio de ajuda</span>
      `;
      btnConfront.onclick = () => {
        playWindowsErrorSound();
        showDetectiveToast("🔒 Use o Modo Detetive na barra de tarefas para comparar as informações do seu perfil com as mensagens do colega!", false);
      };
    }
  } else {
    // Suspect confrontation option
    if (confrontationUnlocked) {
      btnConfront.classList.add('confrontation', 'ready');
      btnConfront.innerHTML = `
        <span class="choice-icon">⚡</span>
        <span>${confrontationChoice.text}</span>
      `;
      btnConfront.onclick = () => handlePlayerChoice(contact, confrontationChoice);
    } else {
      btnConfront.classList.add('confrontation', 'locked');
      btnConfront.innerHTML = `
        <span class="choice-icon">🔒</span>
        <span>[CONFRONTO BLOQUEADO] Descubra uma contradição no Modo Detetive para destravar!</span>
      `;
      btnConfront.onclick = () => {
        playWindowsErrorSound();
        showDetectiveToast("🔒 O confronto está bloqueado! Ative o Modo Detetive na barra de tarefas e cruze 2 dados conflitantes!", false);
      };
    }
  }
  choicesGrid.appendChild(btnConfront);

  // CHOICES 2 & 3: BAIT AND RISK (SHUFFLED ORDER PER STEP)
  if (!state.stepChoicesShuffled[stepIdx]) {
    // Get choices 1 and 2 from step (the 2 secondary choices)
    const secondaryChoices = currentStep.choices.slice(1, 3);
    // Shuffle them randomly
    if (Math.random() > 0.5 && secondaryChoices.length === 2) {
      state.stepChoicesShuffled[stepIdx] = [secondaryChoices[1], secondaryChoices[0]];
    } else {
      state.stepChoicesShuffled[stepIdx] = [...secondaryChoices];
    }
  }

  const shuffled = state.stepChoicesShuffled[stepIdx];
  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'dialogue-btn-choice';
    btn.innerHTML = `
      <span class="choice-icon">${choice.icon || '💬'}</span>
      <span>${choice.text}</span>
    `;
    btn.onclick = () => handlePlayerChoice(contact, choice);
    choicesGrid.appendChild(btn);
  });
}

function handlePlayerChoice(contact, choice) {
  const state = contactsState[contact.id];
  if (!state || !isShiftActive) return;

  playMsgPop();

  // 1. Append player reply to chat
  const nowStr = "Hoje às " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.messages.push({
    author: "Você (Vigilante)",
    avatar: "🕵️‍♂️",
    avatarBg: "#23a55a",
    text: choice.text,
    timestamp: nowStr,
    isPlayer: true,
    evidenceSource: `msg_${state.messages.length}`
  });

  // 2. Process choice effects & Traps
  if (choice.type === 'confrontation' || choice.type === 'counter') {
    state.evidenceCount = Math.min(state.evidenceGoal, state.evidenceCount + (choice.evidence || 1));
    playEvidenceDing();
    currentScore += 15;
    showDetectiveToast(`⚡ Confronto certeiro! O suspeito foi desestabilizado! (+1 Evidência: ${state.evidenceCount}/${state.evidenceGoal})`, true);
    appendSystemMessage(`⚡ CONFRONTO REALIZADO: Suspeito acuado pela contradição! Evidências: ${state.evidenceCount}/${state.evidenceGoal}`);
  } else if (choice.type === 'fake_friend_trap') {
    // FAKE FRIEND INSTANT GAME OVER TRAP
    playJumpscare();
    currentLives = 0;
    updateLivesUI();
    triggerGameOver("💀 GAME OVER! Você aceitou o pedido de um falso colega e compartilhou acessos confidenciais da sua conta!");
    return;
  } else if (choice.type === 'danger' || choice.penalty) {
    playJumpscare();
    loseLife();
    showDetectiveToast("⚠️ ESCOLHA DE ALTO RISCO! Compartilhar informações confidenciais comprometeu sua conta! (-1 Vida)", false);
    appendSystemMessage("⚠️ ALERTA DE SEGURANÇA: Resposta perigosa fornecida! Dados pessoais expostos (-1 Vida).");
    if (currentLives <= 0) return;
  } else if (choice.type === 'friend_safe') {
    state.isCompleted = true;
    currentScore += 30;
    playEvidenceDing();
    showDetectiveToast(`🤝 Ajuda escolar enviada com segurança para ${contact.name}! (+30 Pts)`, true);
    appendSystemMessage(`✅ CONCLUÍDO: Conversa com ${contact.name} finalizada com sucesso.`);
  } else if (choice.type === 'bait') {
    // Bait sets up an opportunity for the bot to expose itself
    showDetectiveToast("🔍 Pergunta enviada! Observe a resposta do suspeito para capturar novas contradições!", true);
  }

  // Refresh UI
  renderActiveChat();
  renderActiveDossier();
  renderDMList();

  // 3. Show typing indicator and bot reply
  const typingIndicator = document.getElementById('typing-indicator');
  const typingUser = document.getElementById('typing-username');
  if (typingIndicator && typingUser) {
    typingUser.textContent = `${contact.name} está digitando...`;
    typingIndicator.style.display = 'flex';
  }

  // Keyboard typing sound simulation
  const typeInterval = setInterval(() => {
    playKeyClick();
  }, 180);

  setTimeout(() => {
    clearInterval(typeInterval);
    if (typingIndicator) typingIndicator.style.display = 'none';

    if (choice.botReply) {
      playDiscordChime();
      const replyMsg = {
        author: contact.name,
        avatar: contact.avatar,
        avatarBg: contact.avatarBg,
        text: choice.botReply,
        timestamp: nowStr,
        isPlayer: false,
        evidenceSource: `msg_${state.messages.length}`
      };
      state.messages.push(replyMsg);
    }

    state.dialogueStep++;
    renderActiveChat();
    renderActiveDossier();
    renderDMList();

    // Check if shift is won after friend response
    checkShiftCompletion();
  }, 1100);
}

function appendSystemMessage(text) {
  const state = contactsState[activeContactId];
  if (!state) return;

  state.messages.push({
    author: "🛡️ SISTEMA CYBERKIDS",
    avatar: "🤖",
    avatarBg: "#3f4147",
    text: text,
    timestamp: "Agora",
    isPlayer: false,
    evidenceSource: `sys_${state.messages.length}`
  });
  renderActiveChat();
}

// ----------------------------------------------------------------------------
// UI RENDERING: SUSPECT DOSSIER & BAN (COLUMN 4)
// ----------------------------------------------------------------------------
function renderActiveDossier() {
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  const contact = shiftData.contacts.find(c => c.id === activeContactId);
  const state = contactsState[activeContactId];
  if (!contact || !state) return;

  const banner = document.getElementById('dossier-banner');
  const avatar = document.getElementById('dossier-avatar');
  const nameEl = document.getElementById('dossier-name');
  const tagEl = document.getElementById('dossier-tag');
  const bioEl = document.getElementById('dossier-bio');
  const createdEl = document.getElementById('dossier-created');
  const locationEl = document.getElementById('dossier-location');
  const mutualEl = document.getElementById('dossier-mutual');
  const verifiedEl = document.getElementById('dossier-verified');
  const counterLabel = document.getElementById('evidence-counter-label');
  const track = document.getElementById('evidence-blocks-track');
  const hintEl = document.getElementById('evidence-hint');
  const banBtn = document.getElementById('btn-ban-suspect');

  if (banner) banner.style.background = contact.bannerGradient || 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  if (avatar) {
    avatar.textContent = contact.avatar;
    avatar.style.background = contact.avatarBg;
  }
  if (nameEl) nameEl.textContent = contact.name;
  if (tagEl) tagEl.textContent = contact.tag;
  if (bioEl) bioEl.textContent = contact.bio;
  if (createdEl) createdEl.textContent = contact.created;
  if (locationEl) locationEl.textContent = contact.location;
  if (mutualEl) mutualEl.textContent = contact.mutual;
  if (verifiedEl) verifiedEl.textContent = contact.verified;

  // Evidence track rendering
  if (counterLabel) {
    counterLabel.textContent = `${state.evidenceCount} / ${state.evidenceGoal}`;
  }

  if (track) {
    track.innerHTML = '';
    for (let i = 0; i < state.evidenceGoal; i++) {
      const block = document.createElement('div');
      block.className = `evidence-block-unit ${i < state.evidenceCount ? 'active' : ''}`;
      track.appendChild(block);
    }
  }

  // Ban Button State
  if (banBtn) {
    if (!contact.isSuspect) {
      banBtn.disabled = true;
      banBtn.style.opacity = "0.5";
      banBtn.style.cursor = "not-allowed";
      banBtn.innerHTML = `<span>🤝 COLEGA LEGÍTIMO</span>`;
      if (hintEl) hintEl.textContent = "Este é um colega real da escola. Não o bloqueie!";
    } else if (state.isBanned) {
      banBtn.disabled = true;
      banBtn.style.opacity = "0.5";
      banBtn.style.cursor = "not-allowed";
      banBtn.innerHTML = `<span>🔒 SUSPEITO BLOQUEADO</span>`;
      if (hintEl) hintEl.textContent = "Ameaça neutralizada com sucesso.";
    } else if (state.evidenceCount >= state.evidenceGoal) {
      banBtn.disabled = false;
      banBtn.style.opacity = "1";
      banBtn.style.cursor = "pointer";
      banBtn.classList.add('ready');
      banBtn.innerHTML = `<span>🚫 BLOQUEAR E DENUNCIAR AGORA!</span>`;
      if (hintEl) hintEl.innerHTML = `🎯 <strong>Pronto para banir!</strong> Todas as provas foram acumuladas.`;
    } else {
      banBtn.disabled = true;
      banBtn.style.opacity = "0.6";
      banBtn.style.cursor = "not-allowed";
      banBtn.classList.remove('ready');
      banBtn.innerHTML = `<span>🔒 BLOQUEAR USUÁRIO (${state.evidenceCount}/${state.evidenceGoal})</span>`;
      if (hintEl) hintEl.textContent = "Use o Modo Detetive para cruzar mentiras e liberar o banimento.";
    }
  }
}

function attemptBanSuspect() {
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  const contact = shiftData.contacts.find(c => c.id === activeContactId);
  const state = contactsState[activeContactId];
  if (!contact || !state || !contact.isSuspect) return;

  if (state.evidenceCount < state.evidenceGoal) {
    showDetectiveToast(`⚠️ Evidências insuficientes (${state.evidenceCount}/${state.evidenceGoal}) para banir!`, false);
    playWindowsErrorSound();
    return;
  }

  // Execute Ban Hammer
  playBanHammer();
  state.isBanned = true;
  currentScore += 30;

  // Trigger Ban stamp and system message
  appendSystemMessage(`🔨 [BAN HAMMER] ${contact.name} foi BLOQUEADO e REPORTADO à moderação com sucesso!`);
  showDetectiveToast(`🔨 ${contact.name} foi banido com sucesso! (+30 Pts)`, true);

  renderActiveDossier();
  renderDialogueChoices(contact, state);
  renderDMList();

  // Check if shift is won
  setTimeout(() => {
    checkShiftCompletion();
  }, 1000);
}

// ----------------------------------------------------------------------------
// SHIFT PROGRESSION & VICTORY
// ----------------------------------------------------------------------------
function checkShiftCompletion() {
  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  if (!shiftData) return;

  const allDone = shiftData.contacts.every(c => {
    const state = contactsState[c.id];
    return state && (state.isBanned || state.isCompleted);
  });

  if (allDone && isShiftActive) {
    isShiftActive = false;
    clearInterval(patienceInterval);

    if (currentShiftIdx === CHAT_PATROL_SHIFTS.length - 1) {
      // Game Won (Day 5 Completed)
      handleGameVictory();
    } else {
      // Shift Completed
      showShiftCompleteModal();
    }
  }
}

function showShiftCompleteModal() {
  playObjectionDing();
  const modal = document.getElementById('modal-shift-complete');
  const summary = document.getElementById('modal-shift-summary');
  if (summary) {
    summary.innerHTML = `Você protegeu sua conta no <strong>Turno ${currentShiftIdx + 1}</strong> com sucesso!<br>Todas as ameaças foram neutralizadas e colegas legítimos atendidos!`;
  }
  if (modal) modal.classList.add('show');
}

function advanceToNextShift() {
  const modal = document.getElementById('modal-shift-complete');
  if (modal) modal.classList.remove('show');

  currentShiftIdx++;
  initShift(currentShiftIdx);
}

function handleGameVictory() {
  saveVictoryToProfile();
  playObjectionDing();

  const modal = document.getElementById('modal-victory');
  if (modal) modal.classList.add('show');
}

function saveVictoryToProfile() {
  loadPlayerProfile();

  // Update chat patrol score
  if (!playerProfile.scores) playerProfile.scores = {};
  playerProfile.scores.chat_patrol = Math.max(playerProfile.scores.chat_patrol || 0, currentScore + 100);

  // Add chat_patrol badge
  if (!playerProfile.badges) playerProfile.badges = [];
  if (!playerProfile.badges.includes('chat_patrol')) {
    playerProfile.badges.push('chat_patrol');
  }

  // Check if player has all 3 primary badges to unlock supreme_detective
  const hasInspector = playerProfile.badges.includes('link_inspector');
  const hasHunter = playerProfile.badges.includes('fake_hunter');
  const hasPatrol = playerProfile.badges.includes('chat_patrol');

  if (hasInspector && hasHunter && hasPatrol && !playerProfile.badges.includes('supreme_detective')) {
    playerProfile.badges.push('supreme_detective');
  }

  try {
    localStorage.setItem('cyberkids_profile', JSON.stringify(playerProfile));
  } catch (e) {
    console.error("Erro ao salvar progresso no localStorage:", e);
  }
}

// ----------------------------------------------------------------------------
// WINDOWS OS TASKBAR & LIVES MANAGEMENT
// ----------------------------------------------------------------------------
function updateLivesUI() {
  for (let i = 1; i <= 3; i++) {
    const tab = document.getElementById(`task-heart-${i}`);
    if (tab) {
      if (i <= currentLives) {
        tab.className = 'taskbar-window-tab heart-alive';
        tab.textContent = `❤️ Vidas ${i}.exe`;
      } else {
        tab.className = 'taskbar-window-tab heart-lost';
        tab.textContent = `🖤 Vidas ${i}.exe (Fechada)`;
      }
    }
  }
}

// ----------------------------------------------------------------------------
// DETECTIVE MODE & 4 MODALITIES CROSS-EXAMINATION ENGINE
// Modalidade 1: Perfil × Perfil (dossier_* vs dossier_*)
// Modalidade 2: Perfil × Conversa (dossier_* vs msg_*)
// Modalidade 3: Conversa × Conversa (msg_* vs msg_*)
// Modalidade 4: Meu Perfil × Conversa / Perfil (my_* vs msg_* ou dossier_*)
// ----------------------------------------------------------------------------
function toggleDetectiveMode() {
  isDetectiveMode = !isDetectiveMode;
  playDetectiveToggleSound(isDetectiveMode);

  const bar = document.getElementById('detective-hud-bar');
  const btn = document.getElementById('btn-taskbar-detective');

  if (isDetectiveMode) {
    document.body.classList.add('detective-active');
    if (bar) bar.classList.add('visible');
    if (btn) {
      btn.classList.add('active');
      btn.textContent = '🔍 Modo Detetive: ON';
    }
    showDetectiveToast("🔍 Modo Detetive ATIVADO! Clique em mensagens, dados do dossiê ou no seu perfil para cruzar pistas!", true);
  } else {
    document.body.classList.remove('detective-active');
    if (bar) bar.classList.remove('visible');
    if (btn) {
      btn.classList.remove('active');
      btn.textContent = '🔍 Modo Detetive: OFF';
    }
    clearDetectiveSelection(1);
    clearDetectiveSelection(2);
  }
}

function selectEvidenceFromElement(el) {
  if (!isDetectiveMode) return;

  const source = el.getAttribute('data-evidence-source');
  const text = el.innerText.trim();
  if (!source || !text) return;

  playDetectiveSelectSound();

  if (!selectedEvidence1) {
    selectedEvidence1 = { source, text, element: el };
    el.classList.add('evidence-selected-1');
    renderDetectiveSlot(1, selectedEvidence1);
  } else if (!selectedEvidence2) {
    if (selectedEvidence1.source === source && selectedEvidence1.text === text) {
      showDetectiveToast("Selecione um elemento DIFERENTE para o segundo slot!", false);
      return;
    }
    selectedEvidence2 = { source, text, element: el };
    el.classList.add('evidence-selected-2');
    renderDetectiveSlot(2, selectedEvidence2);
  } else {
    // If both slots full, replace slot 2
    if (selectedEvidence2.element) {
      selectedEvidence2.element.classList.remove('evidence-selected-2');
    }
    selectedEvidence2 = { source, text, element: el };
    el.classList.add('evidence-selected-2');
    renderDetectiveSlot(2, selectedEvidence2);
  }

  updateCrossExamineButtonState();
}

function renderDetectiveSlot(slotNum, evidence) {
  const slot = document.getElementById(`detective-slot-${slotNum}`);
  if (!slot) return;

  slot.className = `detective-slot-box filled-${slotNum}`;
  slot.innerHTML = `
    <span>${slotNum === 1 ? '🟡' : '🔵'} ${truncateEvidenceText(evidence.text)}</span>
    <button style="margin-left:auto; background:none; border:none; color:inherit; cursor:pointer; font-weight:bold;" onclick="event.stopPropagation(); clearDetectiveSelection(${slotNum})">✕</button>
  `;
}

function truncateEvidenceText(txt) {
  const clean = txt.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  return clean.length > 30 ? clean.substring(0, 27) + '...' : clean;
}

function clearDetectiveSelection(slotNum) {
  if (slotNum === 1) {
    if (selectedEvidence1 && selectedEvidence1.element) {
      selectedEvidence1.element.classList.remove('evidence-selected-1');
    }
    selectedEvidence1 = null;
  } else if (slotNum === 2) {
    if (selectedEvidence2 && selectedEvidence2.element) {
      selectedEvidence2.element.classList.remove('evidence-selected-2');
    }
    selectedEvidence2 = null;
  }

  const slot = document.getElementById(`detective-slot-${slotNum}`);
  if (slot) {
    slot.className = 'detective-slot-box';
    slot.innerHTML = `${slotNum === 1 ? '🟡' : '🔵'} Elemento ${slotNum}: (Selecione no Chat ou Perfil)`;
  }

  updateCrossExamineButtonState();
}

function updateCrossExamineButtonState() {
  const btn = document.getElementById('btn-cross-examine');
  if (!btn) return;

  if (selectedEvidence1 && selectedEvidence2) {
    btn.classList.add('ready');
  } else {
    btn.classList.remove('ready');
  }
}

function executeCrossExamine() {
  if (!selectedEvidence1 || !selectedEvidence2) {
    showDetectiveToast('⚠️ Selecione 2 elementos para cruzar as informações!', false);
    playWindowsErrorSound();
    return;
  }

  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  const contact = shiftData.contacts.find(c => c.id === activeContactId);
  const state = contactsState[activeContactId];
  if (!contact || !state) return;

  const src1 = selectedEvidence1.source;
  const src2 = selectedEvidence2.source;

  // Case 1: Legitimate friend verification check (Turno 2)
  if (!contact.isSuspect) {
    // If comparing player profile with friend profile or message
    if ((src1.startsWith('my_') && (src2.startsWith('msg_') || src2.startsWith('dossier_'))) ||
        (src2.startsWith('my_') && (src1.startsWith('msg_') || src1.startsWith('dossier_')))) {
      state.isFriendVerified = true;
      playObjectionDing();
      showDetectiveToast(`✅ Coerência confirmada! As informações batem com a realidade escolar! Opção de Ajudar liberada.`, true);
      appendSystemMessage(`✅ VERIFICAÇÃO CONCLUÍDA: ${contact.name} comprovou ser um colega real da escola. Ação de ajuda destravada!`);
      renderDialogueChoices(contact, state);
    } else {
      showDetectiveToast(`ℹ️ ${contact.name} é um amigo legítimo! Compare com seu perfil para validar a ajuda escolar.`, false);
      playEvidenceMismatchSound();
    }
    clearDetectiveSelection(1);
    clearDetectiveSelection(2);
    return;
  }

  // Case 2: Suspect Contradiction Match Check across the 4 modalities
  let matchedContradiction = null;

  if (contact.contradictions && contact.contradictions.length > 0) {
    matchedContradiction = contact.contradictions.find(c => {
      // Direct targets array match
      const directMatch = c.targets.includes(src1) && c.targets.includes(src2);
      if (directMatch) return true;

      // Category matching: Perfil x Perfil
      if (c.type === 'dossier_vs_dossier' && src1.startsWith('dossier_') && src2.startsWith('dossier_')) return true;

      // Category matching: Perfil x Conversa
      if (c.type === 'dossier_vs_msg' && ((src1.startsWith('dossier_') && src2.startsWith('msg_')) || (src2.startsWith('dossier_') && src1.startsWith('msg_')))) return true;

      // Category matching: Conversa x Conversa
      if (c.type === 'msg_vs_msg' && src1.startsWith('msg_') && src2.startsWith('msg_') && src1 !== src2) return true;

      // Category matching: Meu Perfil x Conversa / Perfil
      if (c.type === 'my_vs_suspect' && ((src1.startsWith('my_') && (src2.startsWith('msg_') || src2.startsWith('dossier_'))) || (src2.startsWith('my_') && (src1.startsWith('msg_') || src1.startsWith('dossier_'))))) return true;

      return false;
    });
  }

  // General investigative fallback for dynamic cross-examination
  let isContradiction = false;
  let explanation = '';

  if (matchedContradiction) {
    isContradiction = true;
    explanation = matchedContradiction.explanation;
  } else if ((src1.startsWith('my_') && (src2.startsWith('msg_') || src2.startsWith('dossier_'))) ||
             (src2.startsWith('my_') && (src1.startsWith('msg_') || src1.startsWith('dossier_')))) {
    isContradiction = true;
    explanation = 'Inconsistência flagrante entre os dados reais da sua escola e o contato suspeito!';
  } else if ((src1.startsWith('dossier_') && src2.startsWith('msg_')) || (src2.startsWith('dossier_') && src1.startsWith('msg_'))) {
    isContradiction = true;
    explanation = 'Furo na história! O que o suspeito disse no chat não bate com o registro do Dossiê!';
  } else if (src1.startsWith('dossier_') && src2.startsWith('dossier_') && src1 !== src2) {
    isContradiction = true;
    explanation = 'Contradição interna entre os dados de registro do perfil do suspeito!';
  } else if (src1.startsWith('msg_') && src2.startsWith('msg_') && src1 !== src2) {
    isContradiction = true;
    explanation = 'O suspeito mudou a própria versão dos fatos durante a conversa!';
  }

  if (isContradiction) {
    // Unlock the confrontation choice for the current step
    if (!state.unlockedConfrontations.includes(state.dialogueStep)) {
      state.unlockedConfrontations.push(state.dialogueStep);
    }

    if (state.evidenceCount >= state.evidenceGoal) {
      showDetectiveToast('🎯 Todas as evidências já foram coletadas! Bloqueie o suspeito no Dossiê!', true);
      playEvidenceDing();
    } else {
      state.evidenceCount = Math.min(state.evidenceGoal, state.evidenceCount + 1);
      currentScore += 15;
      playObjectionDing();
      showDetectiveToast(`⚡ OBJECTION! ${explanation} (+1 Evidência: ${state.evidenceCount}/${state.evidenceGoal})`, true);
      appendSystemMessage(`⚡ CONTRADIÇÃO DETECTADA: ${explanation} [Opção de Confronto Destravada!]`);
    }

    renderActiveDossier();
    renderDialogueChoices(contact, state);
  } else {
    showDetectiveToast('❌ Nenhuma contradição encontrada entre esses dois elementos. Tente cruzar outras pistas!', false);
    playEvidenceMismatchSound();
  }

  clearDetectiveSelection(1);
  clearDetectiveSelection(2);
}

function showDetectiveToast(message, isSuccess) {
  const toast = document.getElementById('detective-toast');
  if (!toast) return;

  toast.className = `detective-feedback-toast ${isSuccess ? 'success' : 'mismatch'}`;
  toast.innerHTML = message;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.className = 'detective-feedback-toast';
  }, 3500);
}

// ----------------------------------------------------------------------------
// WINDOWS START MENU & MODAL CONTROLLERS
// ----------------------------------------------------------------------------
function toggleStartMenu() {
  playStartMenuSound();
  const menu = document.getElementById('win-start-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

// Close Start Menu on click outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('win-start-menu');
  const btnStart = document.getElementById('btn-win-start');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && (!btnStart || !btnStart.contains(e.target))) {
      menu.classList.remove('open');
    }
  }
});

function openMyProfileModal() {
  const menu = document.getElementById('win-start-menu');
  if (menu) menu.classList.remove('open');

  const modal = document.getElementById('modal-my-profile');
  if (modal) modal.classList.add('show');
}

function closeMyProfileModal() {
  const modal = document.getElementById('modal-my-profile');
  if (modal) modal.classList.remove('show');
}

function openBriefingModal() {
  const menu = document.getElementById('win-start-menu');
  if (menu) menu.classList.remove('open');

  const shiftData = CHAT_PATROL_SHIFTS[currentShiftIdx];
  if (shiftData) showBriefingModal(shiftData);
}

function requestExitToHub() {
  const menu = document.getElementById('win-start-menu');
  if (menu) menu.classList.remove('open');

  const modal = document.getElementById('modal-confirm-exit');
  if (modal) modal.classList.add('show');
}

function closeExitConfirmation() {
  const modal = document.getElementById('modal-confirm-exit');
  if (modal) modal.classList.remove('show');
}
