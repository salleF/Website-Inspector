let audioCtx = null;
let audioMuted = true;

function getAudioContext() {
  if (audioMuted) return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  } catch (_) { return null; }
}

function toggleAudio() {
  audioMuted = !audioMuted;
  const label = document.getElementById('tray-audio-label');
  const button = document.getElementById('tray-audio-toggle');
  if (label) label.textContent = audioMuted ? '🔇 Som: OFF' : '🔊 Som: ON';
  if (button) button.setAttribute('aria-pressed', String(!audioMuted));
  if (audioMuted && audioCtx) audioCtx.suspend().catch(() => {});
  if (!audioMuted) playMsgPop();
}

function playChatTone(frequencies, duration = 0.12) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    frequencies.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + index * 0.07;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.035, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch (_) {}
}

function playDiscordChime() { playChatTone([523, 659]); }
function playMsgPop() { playChatTone([440]); }
function playKeyClick() { playChatTone([500], 0.05); }
function playEvidenceDing() { playChatTone([523, 659, 784]); }
function playBanHammer() { playChatTone([523, 784]); }
function playJumpscare() { playChatTone([330]); }
function triggerJumpscareVisuals() {}
function playWindowCloseSound() { playChatTone([392]); }
function playWindowsErrorSound() { playChatTone([330]); }
function playDetectiveToggleSound(active) { playChatTone([active ? 659 : 440]); }
function playDetectiveSelectSound() { playChatTone([587], 0.07); }
function playObjectionDing() { playChatTone([523, 659, 784]); }
function playEvidenceMismatchSound() { playChatTone([349]); }
function playStartMenuSound() { playChatTone([440], 0.07); }
