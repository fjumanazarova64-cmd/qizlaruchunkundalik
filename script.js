/**
 * SECRET BLOOM ✦ THE MODERN WOMAN'S SANCTUARY
 * Core Application Engine: 10 Aesthetic & Intellectual Modules,
 * Pomodoro Focus Cafe, Capsule Lookbook, Skincare Lab, Finance Tracker,
 * Secret Journal with PIN Lock, Audio Sanctuary, Lola Mentor, and Themes.
 */

// --- UTILITY SELECTORS & STORAGE HELPERS ---
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const readStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data !== null ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("Storage read error", e);
    return fallback;
  }
};

const saveStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    console.error("Storage save error", e);
    showToast("Xotira to‘ldi yoki saqlashda xatolik yuz berdi ⚠️");
    return false;
  }
};

// --- APP GLOBAL STATE ---
let appState = {
  theme: readStorage("bloom_theme", "midnight"),
  sfx: readStorage("bloom_sfx", true),
  pin: readStorage("bloom_pin", "1234"),
  isLocked: readStorage("bloom_locked", false),
  entries: readStorage("bloom_entries", []),
  water: readStorage("bloom_water", { date: new Date().toDateString(), count: 0 }),
  habits: readStorage("bloom_habits", [
    { id: 1, name: "📖 20 daqiqa intellektual kitob mutolaasi", done: false },
    { id: 2, name: "💧 2 litr toza suv balansi", done: false },
    { id: 3, name: "🧴 Skincare parvarishi (SPF & namlantirish)", done: false },
    { id: 4, name: "🏃‍♀️ 30 daqiqa fitnes, pilates yoki sayr", done: false },
    { id: 5, name: "⏱ Kunlik rejalashtirish & Pomodoro fokus", done: false },
    { id: 6, name: "🌙 23:00 gacha telefonsiz uyquga yotish", done: false }
  ]),
  financeGoals: readStorage("bloom_finance_goals", [
    { id: 1, title: "IELTS / Til Imtihoni", target: 350, current: 220, icon: "🎓" },
    { id: 2, title: "MacBook / Ishchi Noutbuk", target: 900, current: 550, icon: "💻" },
    { id: 3, title: "Sayohat & Tajriba Jamg‘armasi", target: 800, current: 320, icon: "✈️" },
    { id: 4, title: "Shaxsiy Loyiha & Kurslar", target: 500, current: 380, icon: "💼" }
  ]),
  vision: readStorage("bloom_vision", [
    { id: 1, title: "Oliy Ta'lim & Magistratura", desc: "Nufuzli xalqaro grant yoki universitetda bilim olish", icon: "🎓", progress: 65 },
    { id: 2, title: "Chet Tillari & Erkin Muloqot", desc: "C1 darajasida chet tilini egallash va dunyo bo‘ylab sayohat", icon: "🌍", progress: 80 },
    { id: 3, title: "Karyera & Moliyaviy Mustaqillik", desc: "O‘z kasbining yetakchi mutaxassisi yoki shaxsiy loyiha asoschisi bo‘lish", icon: "💼", progress: 55 },
    { id: 4, title: "Shinam Uy & Shaxsiy Kutubxona", desc: "Estetik interyer va eng sara 100 ta kitoblar jamlanmasi", icon: "🕯️", progress: 70 }
  ]),
  gratitudes: readStorage("bloom_gratitudes", []),
  customBooks: readStorage("bloom_custom_books", []),
  pomodoro: readStorage("bloom_pomodoro", { sessions: 0 }),
  gameStats: readStorage("bloom_game_stats", { played: 0, best2048: 0, bestCatch: 0, bestMemory: 0 })
};

// --- TOAST NOTIFICATIONS ---
let toastTimer = null;
function showToast(message) {
  const t = $("toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// --- WEB AUDIO API & SOUND SYNTHESIS ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSfx(type) {
  if (!appState.sfx) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const pitch = 280 + Math.random() * 200;
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.3, now + 0.07);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === "magic") {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } else if (type === "win") {
      const notes = [392, 493.88, 587.33, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.45);
      });
    }
  } catch (e) {
    console.error("SFX error", e);
  }
}

// --- MULTI-TRACK AMBIENT GENERATOR ---
const ambientChannels = {
  rain: { node: null, gain: null, playing: false },
  cafe: { node: null, gain: null, playing: false },
  waves: { node: null, gain: null, playing: false },
  fire: { node: null, gain: null, playing: false },
  birds: { node: null, gain: null, playing: false },
  night: { node: null, gain: null, playing: false }
};

let lofiSynthTimer = null;
let isLofiPlaying = false;
let currentLofiTrackIndex = 0;
const lofiTracks = [
  { title: "Moonlight Melody 🌙", chords: [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 392.00]] },
  { title: "Parisian Afternoon ☕", chords: [[293.66, 349.23, 440.00, 523.25], [261.63, 329.63, 392.00, 440.00], [220.00, 261.63, 329.63, 440.00], [196.00, 246.94, 293.66, 349.23]] },
  { title: "Deep Focus Sanctuary 🕯️", chords: [[329.63, 392.00, 493.88, 587.33], [293.66, 349.23, 440.00, 523.25], [246.94, 311.13, 369.99, 440.00], [261.63, 329.63, 392.00, 523.25]] }
];

function createNoiseBuffer(ctx, duration = 4) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startAmbientSound(name, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const ch = ambientChannels[name];
  if (!ch) return;

  if (volume <= 0) {
    if (ch.playing && ch.gain) {
      ch.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    }
    return;
  }

  if (!ch.playing) {
    const noiseBuffer = createNoiseBuffer(ctx, 3);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (name === "rain") {
      filter.type = "lowpass";
      filter.frequency.value = 1100;
    } else if (name === "cafe") {
      filter.type = "bandpass";
      filter.frequency.value = 520;
      filter.Q.value = 1.4;
    } else if (name === "waves") {
      filter.type = "lowpass";
      filter.frequency.value = 420;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.frequency.value = 0.11;
      oscGain.gain.value = 280;
      osc.connect(filter.frequency);
      osc.start();
    } else if (name === "fire") {
      filter.type = "highpass";
      filter.frequency.value = 1700;
    } else if (name === "birds") {
      filter.type = "bandpass";
      filter.frequency.value = 3100;
      filter.Q.value = 2.8;
    } else if (name === "night") {
      filter.type = "bandpass";
      filter.frequency.value = 4400;
      filter.Q.value = 3.5;
    }

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime((volume / 100) * 0.14, ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    ch.node = noise;
    ch.gain = gain;
    ch.playing = true;
  } else if (ch.gain) {
    ch.gain.gain.setTargetAtTime((volume / 100) * 0.14, ctx.currentTime, 0.1);
  }
}

function playLofiChords() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const track = lofiTracks[currentLofiTrackIndex];
  let chordIdx = 0;

  function playNextChord() {
    if (!isLofiPlaying) return;
    const now = ctx.currentTime;
    const chord = track.chords[chordIdx % track.chords.length];
    const masterVol = Number($("musicMasterVolume")?.value || 40) / 100;

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      filter.type = "lowpass";
      filter.frequency.value = 1300;

      gain.gain.setValueAtTime(0.0001, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(masterVol * 0.05, now + i * 0.04 + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 3.4);
    });

    chordIdx++;
  }

  playNextChord();
  clearInterval(lofiSynthTimer);
  lofiSynthTimer = setInterval(playNextChord, 3600);
}

function toggleLofiMusic() {
  isLofiPlaying = !isLofiPlaying;
  const playBtn = $("mainPlayBtn");
  const quickToggle = $("quickMusicToggle");
  const vinyl = $("vinylDisc");
  const toneArm = $("toneArm");
  const status = $("playerStatusText");
  const quickText = $("quickMusicText");
  const track = lofiTracks[currentLofiTrackIndex];

  if (isLofiPlaying) {
    playLofiChords();
    if (playBtn) playBtn.textContent = "⏸";
    if (quickToggle) quickToggle.textContent = "⏸";
    if (vinyl) vinyl.classList.add("spinning");
    if (toneArm) toneArm.classList.add("active");
    if (status) status.textContent = "Sokin Lo-Fi musiqasi ijro etilmoqda ✨";
    if (quickText) quickText.textContent = track.title + " (Ijro etilmoqda)";
  } else {
    clearInterval(lofiSynthTimer);
    if (playBtn) playBtn.textContent = "▶";
    if (quickToggle) quickToggle.textContent = "▶";
    if (vinyl) vinyl.classList.remove("spinning");
    if (toneArm) toneArm.classList.remove("active");
    if (status) status.textContent = "Musiqa to‘xtatildi";
    if (quickText) quickText.textContent = "Fokus & Sokinlik Muhiti: Faol emas";
  }
}

// Sleep Timer
let sleepTimerTimeout = null;
function setSleepTimer(minutes) {
  clearTimeout(sleepTimerTimeout);
  if (minutes <= 0) {
    showToast("Uyqu taymeri o‘chirildi.");
    return;
  }
  showToast(`Uyqu taymeri: ${minutes} daqiqaga o‘rnatildi 🌙`);
  sleepTimerTimeout = setTimeout(() => {
    isLofiPlaying = false;
    clearInterval(lofiSynthTimer);
    Object.keys(ambientChannels).forEach(name => startAmbientSound(name, 0));
    $$(".ambient-slider").forEach(sl => sl.value = 0);
    toggleLofiMusic();
    showToast("Uyqu taymeri ishladi. Xayrli tun! ✨");
  }, minutes * 60 * 1000);
}

// Realtime Canvas Visualizer
function initVisualizer() {
  const canvas = $("visualizerCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let bars = 24;

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
      let h = isLofiPlaying
        ? Math.sin(Date.now() * 0.005 + i * 0.4) * 16 + 20
        : 3;
      const gradient = ctx.createLinearGradient(0, canvas.height - h, 0, canvas.height);
      gradient.addColorStop(0, "#e5989b");
      gradient.addColorStop(1, "#b5838d");

      ctx.fillStyle = gradient;
      ctx.fillRect(i * w + 2, canvas.height - h, w - 4, h);
    }
  }
  draw();
}

// Sparkle Particle Background
function initSparkles() {
  const canvas = $("sparkleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.8,
      color: ["#e5989b", "#b5838d", "#e2b170", "#84a59d"][Math.floor(Math.random() * 4)],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  window.addEventListener("pointermove", e => {
    if (Math.random() < 0.2) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        radius: Math.random() * 2 + 1,
        color: "#ffffff",
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        alpha: 0.8
      });
      if (particles.length > 60) particles.shift();
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.002;
      if (p.alpha <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        particles[idx] = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.8,
          color: ["#e5989b", "#b5838d", "#e2b170"][Math.floor(Math.random() * 3)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.5 + 0.2
        };
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}

function generateStarField() {
  const container = $("starsContainer");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 65; i++) {
    const star = document.createElement("span");
    star.className = "star-dot";
    star.textContent = ["✦", "✧", "⋆", "·"][Math.floor(Math.random() * 4)];
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.fontSize = (8 + Math.random() * 10) + "px";
    star.style.setProperty("--duration", (2 + Math.random() * 4) + "s");
    star.style.animationDelay = (Math.random() * 5) + "s";
    container.appendChild(star);
  }
}

// Digital Clock & Date
function updateLiveClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  if ($("liveClock")) $("liveClock").textContent = `${hrs}:${mins}`;

  const options = { weekday: "long", day: "numeric", month: "long" };
  const dateStr = now.toLocaleDateString("uz-UZ", options);
  if ($("currentFullDate")) $("currentFullDate").textContent = dateStr;

  let greet = "Xush kelibsiz. Bugun o‘z orzularingiz tomon qadam tashlang ✨";
  const h = now.getHours();
  if (h >= 5 && h < 11) greet = "Xayrli tong! Bugun yangi muvaffaqiyatlar sari intiling ☕";
  else if (h >= 11 && h < 17) greet = "Xayrli kun! Diqqat va mahsuldorlik hamrohingiz bo‘lsin 💼";
  else if (h >= 17 && h < 22) greet = "Xayrli kech! O‘zingiz va qalb xotirjamligingizga vaqt ajrating 🕯️";
  else greet = "Tungi sokinlik muborak. Ruhingiz orom olsin 🌙";

  if ($("greetingText")) $("greetingText").textContent = greet;
}

// Navigation Router
function showPage(pageId) {
  playSfx("click");
  $$(".page").forEach(p => p.classList.remove("active"));
  $$(".nav").forEach(b => b.classList.toggle("active", b.dataset.page === pageId));

  const target = $(pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sidebar = $("sidebar");
  if (sidebar) sidebar.classList.remove("mobile-open");

  if (pageId === "diary") checkDiaryLockState();
  if (pageId === "home") updateDashboardStats();
  if (pageId === "library") renderBooks();
  if (pageId === "growth") { renderHabits(); renderFinanceGoals(); }
}

// Theme Switcher
function setTheme(themeName) {
  document.body.setAttribute("data-theme", themeName);
  appState.theme = themeName;
  saveStorage("bloom_theme", themeName);

  const iconMap = {
    midnight: "🌙",
    sakura: "🌸",
    matcha: "🍵",
    peach: "🍑",
    cyber: "💎"
  };
  if ($("currentThemeIcon")) $("currentThemeIcon").textContent = iconMap[themeName] || "🌙";

  $$(".theme-opt").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === themeName);
  });
  showToast(`Mavzu: ${themeName.toUpperCase()} o‘rnatildi ✨`);
}

// Daily Affirmation
const affirmations = [
  "O‘z mehnating, aqling va ichki nafosating bilan dunyoni yaxshi tomonga o‘zgartirishga qodirsan. ✨",
  "Mukammallikka intilish shart emas — har kuni o‘rganish va o‘sish muhimroq. 🌟",
  "O‘zingga bo‘lgan ishonch qiyinchiliklarni imkoniyatga aylantiradi. 💼",
  "Shaxsiy chegaralaringizni hurmat qilish — o‘zingizga bo‘lgan eng yuksak muhabbatdir. 🛡️",
  "Bugun kichik, lekin qat'iy qadamlar tashlab kelajak poydevorini qurasiz. 🕯️",
  "Sizning fikrlaringiz va ovozingiz dunyoda muhim o‘ringa ega. 👑",
  "Qalbingizdagi xotirjamlik — barcha buyuk ishlarning boshlanishidir. 🌿"
];

function getRandomAffirmation() {
  playSfx("magic");
  const text = affirmations[Math.floor(Math.random() * affirmations.length)];
  if ($("dailyAffirmationText")) $("dailyAffirmationText").textContent = `“${text}”`;
}

function speakAffirmation() {
  playSfx("click");
  const text = $("dailyAffirmationText")?.textContent || "";
  if (!("speechSynthesis" in window)) {
    showToast("Brauzeringiz ovozli o‘qishni qo‘llamaydi.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

// Hydration Tracker
function updateWaterUI() {
  const today = new Date().toDateString();
  if (appState.water.date !== today) {
    appState.water = { date: today, count: 0 };
    saveStorage("bloom_water", appState.water);
  }

  const count = appState.water.count;
  const percent = Math.min(100, Math.round((count / 8) * 100));

  if ($("waterStatusPercent")) $("waterStatusPercent").textContent = `${percent}%`;
  if ($("waterCountText")) $("waterCountText").textContent = `Bugun: ${count} / 8 stakan`;
  if ($("sideWaterCount")) $("sideWaterCount").textContent = `${count} / 8`;
  if ($("sideWaterFill")) $("sideWaterFill").style.width = `${percent}%`;

  $$(".glass-btn").forEach((btn, idx) => {
    btn.classList.toggle("filled", idx < count);
    btn.textContent = idx < count ? "💧" : "🥛";
  });
}

function handleWaterClick(glassIndex) {
  playSfx("pop");
  if (appState.water.count === glassIndex + 1) {
    appState.water.count = glassIndex;
  } else {
    appState.water.count = glassIndex + 1;
  }
  saveStorage("bloom_water", appState.water);
  updateWaterUI();

  if (appState.water.count === 8) {
    playSfx("win");
    showToast("Ajoyib! Bugungi 2 litr suv balansi to‘liq bajarildi! 💧✨");
  }
}

// Dashboard Statistics
function updateDashboardStats() {
  if ($("statDiaryCount")) $("statDiaryCount").textContent = appState.entries.length;
  if ($("statBooksCount")) $("statBooksCount").textContent = 6 + appState.customBooks.length;
  if ($("statGamesPlayed")) $("statGamesPlayed").textContent = appState.pomodoro.sessions + appState.gameStats.played;

  const dates = new Set(appState.entries.map(e => e.date ? e.date.slice(0, 10) : ""));
  const streak = Math.max(1, dates.size);
  if ($("statStreak")) $("statStreak").textContent = `${streak} kun`;
}

// ==========================================================================
// SHAXSIY KUNDALIK (SECRET JOURNAL WITH PIN LOCK & AUDIO)
// ==========================================================================
let enteredPin = "";
let recordedVoiceBlob = null;
let attachedPhotoBase64 = null;

function checkDiaryLockState() {
  const lockScreen = $("diaryLockScreen");
  const content = $("diaryUnlockedContent");

  if (appState.isLocked) {
    if (lockScreen) lockScreen.classList.remove("hidden");
    if (content) content.classList.add("hidden");
    resetPinDisplay();
  } else {
    if (lockScreen) lockScreen.classList.add("hidden");
    if (content) content.classList.remove("hidden");
    renderEntries();
  }
}

function resetPinDisplay() {
  enteredPin = "";
  $$(".pin-dot").forEach(d => d.classList.remove("filled"));
}

function handlePinKey(digit) {
  playSfx("click");
  if (enteredPin.length < 4) {
    enteredPin += digit;
    const dots = $$(".pin-dot");
    if (dots[enteredPin.length - 1]) dots[enteredPin.length - 1].classList.add("filled");

    if (enteredPin.length === 4) {
      setTimeout(verifyPin, 150);
    }
  }
}

function verifyPin() {
  if (enteredPin === appState.pin) {
    playSfx("magic");
    appState.isLocked = false;
    saveStorage("bloom_locked", false);
    checkDiaryLockState();
    showToast("Kundalik ochildi. Xush kelibsiz 🖋️✨");
  } else {
    playSfx("pop");
    showToast("PIN-kod noto‘g‘ri! Qayta urinib ko‘ring.");
    resetPinDisplay();
  }
}

function lockDiary() {
  playSfx("click");
  appState.isLocked = true;
  saveStorage("bloom_locked", true);
  checkDiaryLockState();
  showToast("Kundalik xavfsiz qulflandi 🔒");
}

// Voice Recorder
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

async function toggleVoiceRecording() {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          recordedVoiceBlob = reader.result;
          const preview = $("voicePreviewAudio");
          if (preview) {
            preview.src = recordedVoiceBlob;
            preview.classList.remove("hidden");
          }
          if ($("voiceStatus")) $("voiceStatus").textContent = "✓ Ovozli esdalik tayyor!";
        };
      };

      mediaRecorder.start();
      isRecording = true;
      playSfx("click");
      if ($("voiceRecIcon")) $("voiceRecIcon").textContent = "⏹";
      if ($("voiceRecText")) $("voiceRecText").textContent = "Yozishni to‘xtatish";
      if ($("voiceStatus")) $("voiceStatus").textContent = "Ovoz yozilmoqda... 🔴";
    } catch (err) {
      console.error("Microphone error", err);
      showToast("Mikrofonga ruxsat berilmadi yoki mavjud emas.");
    }
  } else {
    if (mediaRecorder) mediaRecorder.stop();
    isRecording = false;
    playSfx("click");
    if ($("voiceRecIcon")) $("voiceRecIcon").textContent = "🎙️";
    if ($("voiceRecText")) $("voiceRecText").textContent = "Qayta yozish";
  }
}

// Photo Attachment
function handlePhotoAttach(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("Rasm 5MB dan kichik bo‘lishi kerak.");
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    attachedPhotoBase64 = ev.target.result;
    const previewImg = $("photoPreviewImg");
    const container = $("photoPreviewContainer");
    if (previewImg && container) {
      previewImg.src = attachedPhotoBase64;
      container.classList.remove("hidden");
    }
    showToast("Rasm biriktirildi! 📷");
  };
  reader.readAsDataURL(file);
}

function removeAttachedPhoto() {
  attachedPhotoBase64 = null;
  const container = $("photoPreviewContainer");
  if (container) container.classList.add("hidden");
  if ($("entryPhotoInput")) $("entryPhotoInput").value = "";
}

// Save Entry
function saveDiaryEntry() {
  const title = $("entryTitle")?.value.trim() || "Kundalik Qaydi";
  const text = $("entryText")?.value.trim();
  const mood = $("entryMood")?.value || "✨";
  const category = $("entryCategory")?.value || "Shaxsiy Fikrlar";
  const font = $("entryFontSelect")?.value || "font-serif";
  const paper = $("paperThemeSelect")?.value || "paper-classic";

  if (!text) {
    showToast("Iltimos, avval kundalikka biron fikr yozing 🖋️");
    return;
  }

  const entry = {
    id: Date.now(),
    title,
    text,
    mood,
    category,
    font,
    paper,
    voice: recordedVoiceBlob,
    photo: attachedPhotoBase64,
    date: new Date().toISOString()
  };

  appState.entries.unshift(entry);
  if (saveStorage("bloom_entries", appState.entries)) {
    playSfx("magic");
    showToast("Yozuv muvaffaqiyatli saqlandi! 📖✨");

    if ($("entryTitle")) $("entryTitle").value = "";
    if ($("entryText")) $("entryText").value = "";
    if ($("charCountDisplay")) $("charCountDisplay").textContent = "0 ta belgi";
    removeAttachedPhoto();
    recordedVoiceBlob = null;
    const preview = $("voicePreviewAudio");
    if (preview) {
      preview.src = "";
      preview.classList.add("hidden");
    }
    if ($("voiceStatus")) $("voiceStatus").textContent = "";

    renderEntries();
    updateDashboardStats();
  }
}

function renderEntries() {
  const container = $("entriesListGrid");
  if (!container) return;

  const query = ($("searchEntriesInput")?.value || "").toLowerCase();
  const moodFilter = $("filterMoodSelect")?.value || "all";

  const filtered = appState.entries.filter(e => {
    const matchesSearch = (e.title + " " + e.text).toLowerCase().includes(query);
    const matchesMood = moodFilter === "all" || e.mood === moodFilter;
    return matchesSearch && matchesMood;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <span style="font-size: 36px; display: block; margin-bottom: 8px;">🖋️</span>
        <p>${query ? "Mos yozuv topilmadi." : "Hali qaydlar yo‘q. Bugungi birinchi sahifangizni yozing."}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(e => `
    <article class="entry-card ${e.paper || 'paper-classic'}">
      <div class="entry-card-meta">
        <span class="entry-mood-badge">${e.mood}</span>
        <span class="entry-category-chip">${escapeHtml(e.category)}</span>
        <span class="entry-date-text">${new Date(e.date).toLocaleDateString("uz-UZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <h3 class="${e.font || 'font-serif'}">${escapeHtml(e.title)}</h3>
      <p class="entry-card-snippet ${e.font || 'font-serif'}">${escapeHtml(e.text.slice(0, 160))}${e.text.length > 160 ? "..." : ""}</p>
      
      <div class="entry-card-attachments">
        ${e.photo ? '<span class="attachment-tag">📷 Rasm</span>' : ''}
        ${e.voice ? '<span class="attachment-tag">🎙️ Ovoz</span>' : ''}
      </div>

      <div class="entry-card-actions">
        <button class="btn-text-sm" onclick="viewFullEntry(${e.id})">Batafsil mutolaa ↗</button>
        <button class="btn-text-sm" style="color: #ff6b6b;" onclick="deleteEntry(${e.id})">O‘chirish 🗑</button>
      </div>
    </article>
  `).join("");
}

function viewFullEntry(id) {
  const item = appState.entries.find(e => e.id === id);
  if (!item) return;

  if ($("viewEntryMeta")) $("viewEntryMeta").textContent = `${item.mood} · ${item.category} · ${new Date(item.date).toLocaleString("uz-UZ")}`;
  if ($("viewEntryTitle")) $("viewEntryTitle").textContent = item.title;
  if ($("viewEntryBody")) {
    $("viewEntryBody").textContent = item.text;
    $("viewEntryBody").className = `entry-full-text ${item.font || 'font-serif'}`;
  }

  const photoBox = $("viewEntryPhoto");
  if (photoBox) {
    if (item.photo) {
      photoBox.innerHTML = `<img src="${item.photo}" alt="Kundalik rasmi">`;
      photoBox.classList.remove("hidden");
    } else {
      photoBox.classList.add("hidden");
    }
  }

  const voiceBox = $("viewEntryVoice");
  if (voiceBox) {
    if (item.voice) {
      voiceBox.innerHTML = `<audio controls src="${item.voice}"></audio>`;
      voiceBox.classList.remove("hidden");
    } else {
      voiceBox.classList.add("hidden");
    }
  }

  $("entryViewerModal")?.classList.remove("hidden");
}

function deleteEntry(id) {
  if (confirm("Ushbu yozuvni o‘chirmoqchimisiz?")) {
    appState.entries = appState.entries.filter(e => e.id !== id);
    saveStorage("bloom_entries", appState.entries);
    renderEntries();
    updateDashboardStats();
    showToast("Yozuv o‘chirildi.");
  }
}

function exportDiaryBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.entries, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `Secret_Bloom_Journal_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Zaxira nusxa yuklab olindi! 📥");
}

// ==========================================================================
// 10 TA ESTETIK & INTELLEKTUAL MASHG‘ULOT
// ==========================================================================
function openGame(gameName) {
  playSfx("click");
  showPage("games");
  $$(".game-pill").forEach(p => p.classList.toggle("active", p.dataset.game === gameName));
  $$(".game-view").forEach(v => v.classList.remove("active"));
  const view = $(`game-${gameName}`);
  if (view) view.classList.add("active");

  appState.gameStats.played++;
  saveStorage("bloom_game_stats", appState.gameStats);
  updateDashboardStats();

  if (gameName === "catchstars") initCatchGame();
  if (gameName === "memory") initMemoryAdvGame();
  if (gameName === "sweet2048") init2048Game();
  if (gameName === "popit") initPopItBoard();
  if (gameName === "quiz") loadNextQuizQuestion();
}

// 1. CAPSULE WARDROBE & LOOKBOOK
const wardrobeData = {
  hair: [
    { name: "Klassik to‘lqinli kare", icon: "💇‍♀️", render: "👩🏻" },
    { name: "Nafis shoyi hijob", icon: "🧕🏻", render: "🧕🏻" },
    { name: "Parij uslubidagi soch", icon: "💇", render: "👧" },
    { name: "Fransuzcha past tugun", icon: "👸", render: "👸" },
    { name: "Yig‘ilgan elegant ot dumi", icon: "👱‍♀️", render: "👱‍♀️" }
  ],
  outfits: [
    { name: "Old Money Tviddan Pidjak", icon: "🧥", render: "🧥" },
    { name: "Shoyi Maxsi Abaya / Libos", icon: "👘", render: "👘" },
    { name: "Minimalist Oqshom Ko‘ylagi", icon: "👗", render: "👗" },
    { name: "Kashmir Jemper & Ko‘ylak", icon: "👚", render: "👚" },
    { name: "Klassik Bej Trenч Palto", icon: "🥼", render: "🥼" }
  ],
  bottoms: [
    { name: "Keng Palatso Shimi", icon: "👖", render: "👖" },
    { name: "Shoyi Plisse Yubka", icon: "👗", render: "👗" },
    { name: "Klassik To‘g‘ri Bichimli Shim", icon: "🩳", render: "🩳" }
  ],
  shoes: [
    { name: "Teri Lofer (Loafers)", icon: "👞", render: "👞" },
    { name: "Klassik Qora Lodochka", icon: "👠", render: "👠" },
    { name: "Oq Minimalist Krossovka", icon: "👟", render: "👟" },
    { name: "Chelsi Etigi", icon: "👢", render: "👢" }
  ],
  accessories: [
    { name: "Shveysariya Soati & Oltin Zanjir", icon: "⌚", render: "⌚" },
    { name: "Italiya Teri Tote Sumkasi", icon: "👜", render: "👜" },
    { name: "Quyosh Ko‘zoynagi", icon: "🕶️", render: "🕶️" },
    { name: "Ipak Ro‘molcha", icon: "🧣", render: "🧣" },
    { name: "Marvarid Ziraklar", icon: "💍", render: "💍" }
  ]
};

let currentDollState = {
  hair: wardrobeData.hair[0].render,
  outfit: wardrobeData.outfits[0].render,
  bottom: wardrobeData.bottoms[0].render,
  shoes: wardrobeData.shoes[0].render,
  accessory: wardrobeData.accessories[0].render,
  scene: "bedroom"
};

function updateDollUI() {
  if ($("dollHair")) $("dollHair").textContent = currentDollState.hair;
  if ($("dollOutfit")) $("dollOutfit").textContent = currentDollState.outfit;
  if ($("dollBottom")) $("dollBottom").textContent = currentDollState.bottom;
  if ($("dollShoes")) $("dollShoes").textContent = currentDollState.shoes;
  if ($("dollAccessory")) $("dollAccessory").textContent = currentDollState.accessory;
}

function renderWardrobeCategory(cat) {
  const container = $("wardrobeItemsGrid");
  if (!container) return;
  const items = wardrobeData[cat] || [];
  container.innerHTML = items.map((it, idx) => `
    <div class="wardrobe-item-card ${currentDollState[cat] === it.render ? 'selected' : ''}" onclick="applyWardrobeItem('${cat}', ${idx})">
      <span class="w-item-icon">${it.icon}</span>
      <span>${escapeHtml(it.name)}</span>
    </div>
  `).join("");
}

function applyWardrobeItem(cat, idx) {
  playSfx("pop");
  const item = wardrobeData[cat][idx];
  if (!item) return;

  if (cat === "hair") currentDollState.hair = item.render;
  else if (cat === "outfits") currentDollState.outfit = item.render;
  else if (cat === "bottoms") currentDollState.bottom = item.render;
  else if (cat === "shoes") currentDollState.shoes = item.render;
  else if (cat === "accessories") currentDollState.accessory = item.render;

  updateDollUI();
  renderWardrobeCategory(cat);
}

function randomizeOutfit() {
  playSfx("magic");
  Object.keys(wardrobeData).forEach(cat => {
    const arr = wardrobeData[cat];
    const rand = Math.floor(Math.random() * arr.length);
    applyWardrobeItem(cat, rand);
  });
  showToast("Yangi kapsula lookbook tanlandi! 👗✨");
}

// 2. SKINCARE ROUTINE & GLOW LAB
function initMakeupStudio() {
  $$("#lipstickSwatches .swatch").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("pop");
      $$("#lipstickSwatches .swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const color = btn.dataset.color;
      if ($("makeupLips")) $("makeupLips").style.background = color;
    });
  });

  $$("#eyeshadowSwatches .swatch").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("pop");
      $$("#eyeshadowSwatches .swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const color = btn.dataset.color;
      if ($("eyeshadowLeft")) $("eyeshadowLeft").style.background = color;
      if ($("eyeshadowRight")) $("eyeshadowRight").style.background = color;
    });
  });

  $$("#blushSwatches .swatch").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("pop");
      $$("#blushSwatches .swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const color = btn.dataset.color;
      if ($("blushLeft")) $("blushLeft").style.background = color;
      if ($("blushRight")) $("blushRight").style.background = color;
    });
  });

  $$(".btn-gem-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("magic");
      const type = btn.dataset.gem;
      const container = $("faceGemsContainer");
      if (!container) return;
      if (type === "sparkle") container.innerHTML = '<span style="position:absolute; top:75px; left:30px; font-size:16px;">✦</span><span style="position:absolute; top:75px; right:30px; font-size:16px;">✦</span>';
      else if (type === "freckles") container.innerHTML = '<span style="position:absolute; top:135px; left:75px; font-size:10px; opacity:0.6;">••• •••</span>';
      else if (type === "hearts") container.innerHTML = '<span style="position:absolute; top:120px; left:40px; font-size:14px;">🤍</span><span style="position:absolute; top:120px; right:40px; font-size:14px;">🤍</span>';
      else container.innerHTML = "";
    });
  });
}

// 3. AESTHETIC SPACE & DESK DESIGNER
function initRoomDesigner() {
  $$("#wallColorSwatches .swatch").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("pop");
      $$("#wallColorSwatches .swatch").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      if ($("roomWall")) $("roomWall").style.background = btn.dataset.wall;
    });
  });

  $("neonTextSelect")?.addEventListener("change", e => {
    playSfx("click");
    if ($("roomNeon")) $("roomNeon").textContent = e.target.value;
  });

  const toggles = [
    { id: "toggleBed", target: "roomBed" },
    { id: "toggleDesk", target: "roomDesk" },
    { id: "toggleRug", target: "roomRug" },
    { id: "togglePlant", target: "roomPlant" },
    { id: "togglePet", target: "roomPet" }
  ];

  toggles.forEach(t => {
    $(t.id)?.addEventListener("change", e => {
      playSfx("pop");
      $(t.target)?.classList.toggle("hidden", !e.target.checked);
    });
  });
}

// 4. POMODORO FOCUS CAFE
let pomodoroTimerInterval = null;
let pomodoroSecondsLeft = 25 * 60;
let isPomodoroRunning = false;

function formatPomodoroTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updatePomodoroDisplay() {
  if ($("pomodoroTimeDisplay")) $("pomodoroTimeDisplay").textContent = formatPomodoroTime(pomodoroSecondsLeft);
}

function togglePomodoro() {
  const btn = $("pomodoroStartBtn");
  if (!isPomodoroRunning) {
    isPomodoroRunning = true;
    if (btn) btn.textContent = "⏸ To‘xtatish";
    playSfx("click");

    pomodoroTimerInterval = setInterval(() => {
      if (pomodoroSecondsLeft > 0) {
        pomodoroSecondsLeft--;
        updatePomodoroDisplay();
      } else {
        clearInterval(pomodoroTimerInterval);
        isPomodoroRunning = false;
        appState.pomodoro.sessions++;
        saveStorage("bloom_pomodoro", appState.pomodoro);
        if ($("pomodoroSessionsCount")) $("pomodoroSessionsCount").textContent = appState.pomodoro.sessions;
        if (btn) btn.textContent = "▶ Boshlash";
        playSfx("win");
        showToast("Tabriklaymiz! 25 daqiqalik fokus seansi muvaffaqiyatli yakunlandi! ☕🎉");
      }
    }, 1000);
  } else {
    clearInterval(pomodoroTimerInterval);
    isPomodoroRunning = false;
    if (btn) btn.textContent = "▶ Boshlash";
    playSfx("click");
  }
}

function resetPomodoro(durationMin = 25, label = "Fokus vaqti ☕") {
  clearInterval(pomodoroTimerInterval);
  isPomodoroRunning = false;
  pomodoroSecondsLeft = durationMin * 60;
  updatePomodoroDisplay();
  if ($("pomodoroStartBtn")) $("pomodoroStartBtn").textContent = "▶ Boshlash";
  if ($("pomodoroStateLabel")) $("pomodoroStateLabel").textContent = label;
  playSfx("click");
}

function addPomodoroTask() {
  const input = $("pomodoroNewTaskInput");
  const text = input?.value.trim();
  if (!text) return;
  const list = $("pomodoroTasksList");
  if (!list) return;

  const row = document.createElement("div");
  row.className = "task-check-row";
  row.innerHTML = `<input type="checkbox"> <span>${escapeHtml(text)}</span>`;
  list.appendChild(row);
  input.value = "";
  playSfx("pop");
}

// 5. 2048 CAFÉ: PARISIENNE BAKERY
let board2048 = Array(16).fill(0);
let score2048 = 0;
const dessertMap = {
  2: { name: "Espresso", icon: "☕" },
  4: { name: "Kruassan", icon: "🥐" },
  8: { name: "Ekler", icon: "🥖" },
  16: { name: "Matcha Latte", icon: "🍵" },
  32: { name: "Malinali Tart", icon: "🥧" },
  64: { name: "Tiramisu", icon: "🍰" },
  128: { name: "Fransuz Makaron", icon: "🍧" },
  256: { name: "Karamelli Sufle", icon: "🍮" },
  512: { name: "Grand Gateau", icon: "🎂" },
  1024: { name: "Imperator Shokoladi", icon: "🍫" },
  2048: { name: "PARIS GOLD 👑", icon: "👑" }
};

function init2048Game() {
  board2048 = Array(16).fill(0);
  score2048 = 0;
  spawn2048Random();
  spawn2048Random();
  render2048();
}

function spawn2048Random() {
  const emptyIndices = board2048.map((v, i) => (v === 0 ? i : -1)).filter(i => i !== -1);
  if (emptyIndices.length === 0) return;
  const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board2048[randIdx] = Math.random() < 0.9 ? 2 : 4;
}

function render2048() {
  const grid = $("grid2048");
  if (!grid) return;
  if ($("score2048")) $("score2048").textContent = score2048;

  if (score2048 > appState.gameStats.best2048) {
    appState.gameStats.best2048 = score2048;
    saveStorage("bloom_game_stats", appState.gameStats);
  }
  if ($("best2048")) $("best2048").textContent = appState.gameStats.best2048;

  grid.innerHTML = board2048.map(val => {
    if (val === 0) return '<div class="cell-2048"></div>';
    const info = dessertMap[val] || { icon: "👑", name: "" };
    return `
      <div class="cell-2048 val-${val}">
        <span class="cell-sweet-icon">${info.icon}</span>
        <span>${val}</span>
      </div>
    `;
  }).join("");
}

function slide2048Row(row) {
  let arr = row.filter(x => x !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score2048 += arr[i];
      arr[i + 1] = 0;
      playSfx("pop");
    }
  }
  arr = arr.filter(x => x !== 0);
  while (arr.length < 4) arr.push(0);
  return arr;
}

function move2048(direction) {
  let oldBoard = [...board2048];

  if (direction === "left") {
    for (let r = 0; r < 4; r++) {
      let row = [board2048[r * 4], board2048[r * 4 + 1], board2048[r * 4 + 2], board2048[r * 4 + 3]];
      let slided = slide2048Row(row);
      for (let c = 0; c < 4; c++) board2048[r * 4 + c] = slided[c];
    }
  } else if (direction === "right") {
    for (let r = 0; r < 4; r++) {
      let row = [board2048[r * 4 + 3], board2048[r * 4 + 2], board2048[r * 4 + 1], board2048[r * 4]].reverse();
      let slided = slide2048Row(row.reverse()).reverse();
      for (let c = 0; c < 4; c++) board2048[r * 4 + c] = slided[c];
    }
  } else if (direction === "up") {
    for (let c = 0; c < 4; c++) {
      let col = [board2048[c], board2048[c + 4], board2048[c + 8], board2048[c + 12]];
      let slided = slide2048Row(col);
      for (let r = 0; r < 4; r++) board2048[r * 4 + c] = slided[r];
    }
  } else if (direction === "down") {
    for (let c = 0; c < 4; c++) {
      let col = [board2048[c + 12], board2048[c + 8], board2048[c + 4], board2048[c]].reverse();
      let slided = slide2048Row(col.reverse()).reverse();
      for (let r = 0; r < 4; r++) board2048[r * 4 + c] = slided[r];
    }
  }

  if (JSON.stringify(oldBoard) !== JSON.stringify(board2048)) {
    spawn2048Random();
    render2048();
  }
}

// 6. CATCH THE FOCUS STARS
let catchAnimation = null;
let catchRunning = false;
let catchBasketX = 250;
let catchScore = 0;
let catchLives = 3;
let catchItems = [];

function initCatchGame() {
  const canvas = $("catchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  catchScore = 0;
  catchLives = 3;
  catchItems = [];
  catchRunning = true;
  if ($("catchScore")) $("catchScore").textContent = "0";
  if ($("catchLives")) $("catchLives").textContent = "❤️❤️❤️";

  canvas.onpointermove = e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || canvas.width);
    catchBasketX = (e.clientX - rect.left) * scaleX - 40;
    catchBasketX = Math.max(0, Math.min(canvas.width - 80, catchBasketX));
  };

  let lastSpawn = Date.now();

  function loop() {
    if (!catchRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Date.now() - lastSpawn > 600) {
      lastSpawn = Date.now();
      const rand = Math.random();
      let type = "star";
      let points = 10;
      let symbol = "⭐";

      if (rand < 0.4) {
        type = "gem";
        points = 25;
        symbol = "💎";
      } else if (rand < 0.55) {
        type = "book";
        points = 50;
        symbol = "📖";
      } else if (rand < 0.75) {
        type = "cloud";
        points = -1;
        symbol = "⚡";
      }

      catchItems.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        speed: 2 + Math.random() * 2.5,
        type,
        points,
        symbol
      });
    }

    ctx.font = "34px Arial";
    ctx.fillText("⚜️", catchBasketX, canvas.height - 20);

    for (let i = catchItems.length - 1; i >= 0; i--) {
      const it = catchItems[i];
      it.y += it.speed;

      ctx.font = "24px Arial";
      ctx.fillText(it.symbol, it.x, it.y);

      if (it.y > canvas.height - 55 && it.y < canvas.height - 15) {
        if (it.x > catchBasketX - 15 && it.x < catchBasketX + 70) {
          if (it.type === "cloud") {
            playSfx("pop");
            catchLives--;
            if ($("catchLives")) $("catchLives").textContent = "❤️".repeat(Math.max(0, catchLives));
            if (catchLives <= 0) {
              catchRunning = false;
              playSfx("pop");
              showToast(`Mashq yakunlandi! Siz ${catchScore} fokus ball to‘pladingiz ✨`);
              return;
            }
          } else {
            playSfx("pop");
            catchScore += it.points;
            if ($("catchScore")) $("catchScore").textContent = catchScore;
          }
          catchItems.splice(i, 1);
          continue;
        }
      }

      if (it.y > canvas.height + 20) {
        catchItems.splice(i, 1);
      }
    }

    catchAnimation = requestAnimationFrame(loop);
  }

  cancelAnimationFrame(catchAnimation);
  loop();
}

// 7. ART MASTERPIECES & CRYSTALS MEMORY
let memoryCards = [];
let flippedIndices = [];
let matchedIndices = [];
let memoryTimerInterval = null;
let memorySeconds = 0;
let memoryMovesCount = 0;

function initMemoryAdvGame() {
  const symbols = ["💎", "🖼️", "🕯️", "🏛️", "⚜️", "⭐", "☕", "📖"];
  memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  flippedIndices = [];
  matchedIndices = [];
  memoryMovesCount = 0;
  memorySeconds = 0;

  if ($("memoryMoves")) $("memoryMoves").textContent = "0";
  if ($("memoryTimer")) $("memoryTimer").textContent = "0s";
  if ($("memoryAdvMessage")) $("memoryAdvMessage").textContent = "Juft san'at va durdonalarni toping!";

  clearInterval(memoryTimerInterval);
  memoryTimerInterval = setInterval(() => {
    memorySeconds++;
    if ($("memoryTimer")) $("memoryTimer").textContent = `${memorySeconds}s`;
  }, 1000);

  const board = $("memoryAdvBoard");
  if (!board) return;
  board.innerHTML = memoryCards.map((_, idx) => `
    <button class="memory-adv-card" data-idx="${idx}" onclick="handleMemoryCardClick(${idx})">
      <span>✦</span>
    </button>
  `).join("");
}

function handleMemoryCardClick(idx) {
  if (flippedIndices.includes(idx) || matchedIndices.includes(idx) || flippedIndices.length >= 2) return;

  playSfx("click");
  const card = $(`memoryAdvBoard`)?.children[idx];
  if (card) {
    card.classList.add("flipped");
    card.innerHTML = `<span>${memoryCards[idx]}</span>`;
  }
  flippedIndices.push(idx);

  if (flippedIndices.length === 2) {
    memoryMovesCount++;
    if ($("memoryMoves")) $("memoryMoves").textContent = memoryMovesCount;

    const [a, b] = flippedIndices;
    if (memoryCards[a] === memoryCards[b]) {
      playSfx("magic");
      matchedIndices.push(a, b);
      const cardA = $("memoryAdvBoard")?.children[a];
      const cardB = $("memoryAdvBoard")?.children[b];
      if (cardA) cardA.classList.add("matched");
      if (cardB) cardB.classList.add("matched");
      flippedIndices = [];

      if (matchedIndices.length === memoryCards.length) {
        clearInterval(memoryTimerInterval);
        playSfx("win");
        if ($("memoryAdvMessage")) $("memoryAdvMessage").textContent = `Mukammal natija! ${memorySeconds} soniyada barchasini topdingiz! 🎉`;
      }
    } else {
      setTimeout(() => {
        const cardA = $("memoryAdvBoard")?.children[a];
        const cardB = $("memoryAdvBoard")?.children[b];
        if (cardA) { cardA.classList.remove("flipped"); cardA.innerHTML = "<span>✦</span>"; }
        if (cardB) { cardB.classList.remove("flipped"); cardB.innerHTML = "<span>✦</span>"; }
        flippedIndices = [];
      }, 700);
    }
  }
}

// 8. ZEN ANTISTRESS SOUNDPAD
function initPopItBoard() {
  const container = $("popitMat");
  if (!container) return;
  container.innerHTML = "";
  const refinedColors = [
    ["#e5989b", "#b5838d"],
    ["#d4a373", "#e09f67"],
    ["#e2b170", "#cb997e"],
    ["#84a59d", "#6b9080"],
    ["#6d6875", "#4a4e69"],
    ["#b5838d", "#8b3a4c"]
  ];

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const bubble = document.createElement("button");
      bubble.className = "popit-bubble";
      bubble.style.setProperty("--bubble-color", refinedColors[r][0]);
      bubble.style.setProperty("--bubble-color2", refinedColors[r][1]);
      bubble.onclick = () => {
        playSfx("pop");
        bubble.classList.toggle("popped");
      };
      container.appendChild(bubble);
    }
  }
}

function flipPopItBoard() {
  playSfx("pop");
  $$(".popit-bubble").forEach(b => b.classList.remove("popped"));
  showToast("Zen taxtasi yangilandi. Mayin tovushlardan bahra oling 🫧");
}

// 9. METAPHORICAL TAROT & MINDFUL INSIGHT
const orbAnswers = [
  "Shubhalaringizni chetga suring: Aql va intuitsiyangiz to‘g‘ri yo‘lni ko‘rsatmoqda. 🌿",
  "Katta maqsadlar sari kichik, ammo har kungi qat'iyat bilan intiling. ✨",
  "O‘z qadriyatlaringizga sodiq qoling, bu sizni har qanday vaziyatda g‘olib qiladi. 👑",
  "Hozirgi vaqt — o‘z ustingizda ishlash va yangi bilimlar to‘plash pallasidir. 📖",
  "O‘zingizga mehribon bo‘ling va kichik yutuqlaringizni ham e'tirof eting. 🌸",
  "Kutilmagan imkoniyat eshiklari ochiladi — tayyor turing! 🌟",
  "Ichki xotirjamlik — sizning eng asosiy ustunligingizdir. 🕯️",
  "Qat'iy 'yo‘q' deyish orqali o‘z vaqtingiz va ruhiyatingizni himoya qiling. 🛡️"
];

function shakeOrb() {
  playSfx("magic");
  const orb = $("crystalOrb");
  if (orb) {
    orb.style.transform = "scale(1.08) rotate(6deg)";
    setTimeout(() => orb.style.transform = "", 400);
  }
  const answer = orbAnswers[Math.floor(Math.random() * orbAnswers.length)];
  if ($("orbAnswer")) $("orbAnswer").textContent = answer;
}

const tarotCardsData = {
  love: "💖 Ichki Uyg‘unlik & Munosabatlar: Boshqalarni tushunish o‘zingizni tushunishdan boshlanadi. O‘z qalbingizga va hislaringizga vaqt ajrating.",
  success: "⭐ Liderlik & Zafar: Boshlagan ishingizda professionalizm va sabr eng katta mevani beradi. O‘z mahoratingizga ishoning!",
  peace: "🌿 Qat'iyat & Sabr: Hozirgi sinovlar sizni yanada mustaqil va donoroq qiladi. Shoshilmang, har bir jarayon o‘z mevasini beradi."
};

function initTarot() {
  $$(".tarot-card").forEach(card => {
    card.addEventListener("click", () => {
      playSfx("magic");
      $$(".tarot-card").forEach(c => c.classList.remove("flipped"));
      card.classList.add("flipped");
      const key = card.dataset.tarot;
      const resBox = $("tarotResultBox");
      if (resBox) {
        resBox.textContent = tarotCardsData[key] || "";
        resBox.classList.remove("hidden");
      }
    });
  });
}

// 10. SMART WOMEN IQ & CAREER TRIVIA
const quizQuestions = [
  {
    q: "Nobel mukofotini ikki xil fundamental soha (fizika va kimyo) bo‘yicha qo‘lga kiritgan tarixdagi birinchi inson kim?",
    options: ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Lise Meitner"],
    answer: 0,
    fact: "Marie Curie radioaktivlikni kashf qilib, ikki xil sohada Nobel olgan yagona olimadir."
  },
  {
    q: "Dunyo tarixidagi birinchi kompyuter algoritmini yozgan va dasturlash asoschisi deb tan olingan olima kim?",
    options: ["Grace Hopper", "Ada Lovelace", "Margaret Hamilton", "Hedy Lamarr"],
    answer: 1,
    fact: "Ada Lovelace 1843-yilda Charlez Bebbij mashinasi uchun ilk dasturni yaratgan."
  },
  {
    q: "O‘zbek adabiyoti va davlatchilik tarixida madrasalar, karvonsaroylar qurdirib, ilm ahliga homiylik qilgan ma'rifatparvar kim?",
    options: ["Zebunniso", "Nodirabegim (Mohlaroyim)", "Uvaysiy", "Dilshodi Barno"],
    answer: 1,
    fact: "Nodirabegim Qo‘qon xonligida kutubxonalar, madrasalar barpo etib, ilm-fanni yuksaltirgan."
  },
  {
    q: "Moliyaviy savodxonlikda '50/30/20 qoidasi'ga ko‘ra, daromadning 20% qismi qayerga yo‘naltirilishi kerak?",
    options: ["Ko‘ngilochar xarajatlarga", "Kiyim-kechakka", "Jamg‘arma va investitsiyalarga", "Majburiy oziq-ovqatga"],
    answer: 2,
    fact: "Daromadning 20% qismini kelajak jamg‘armasi va investitsiyalarga ajratish moliyaviy mustaqillik kalitidir."
  },
  {
    q: "Dermatologiyada quyoshdan himoyalovchi SPF kremi qachon ishlatilishi kerak?",
    options: ["Faqat yozda, sohilga chiqqanda", "Faqat quyoshli kunlarda", "Yil faslidan qat'i nazar, har kuni", "Faqat yoshlikda"],
    answer: 2,
    fact: "UV-nurlar bulutli kunda ham mavjud bo‘lib, terining erta qarishining 80% sababchisidir. SPF har kuni kerak."
  }
];

let currentQuizIndex = 0;
function loadNextQuizQuestion() {
  const qObj = quizQuestions[currentQuizIndex % quizQuestions.length];
  if ($("quizProgressBadge")) $("quizProgressBadge").textContent = `Savol ${ (currentQuizIndex % quizQuestions.length) + 1 } / ${quizQuestions.length}`;
  if ($("quizQuestion")) $("quizQuestion").textContent = qObj.q;

  const optionsContainer = $("quizOptions");
  if (!optionsContainer) return;

  const feedbackBox = $("quizFeedback");
  if (feedbackBox) feedbackBox.classList.add("hidden");

  optionsContainer.innerHTML = qObj.options.map((opt, idx) => `
    <button class="quiz-opt-btn" onclick="checkQuizAnswer(${idx})">${opt}</button>
  `).join("");
}

function checkQuizAnswer(selectedIdx) {
  const qObj = quizQuestions[currentQuizIndex % quizQuestions.length];
  const buttons = $$(".quiz-opt-btn");
  buttons.forEach(b => b.disabled = true);

  const feedbackBox = $("quizFeedback");

  if (selectedIdx === qObj.answer) {
    playSfx("win");
    buttons[selectedIdx].classList.add("correct");
    if (feedbackBox) {
      feedbackBox.textContent = `A'lo javob! 🎉 ${qObj.fact}`;
      feedbackBox.classList.remove("hidden");
    }
  } else {
    playSfx("pop");
    buttons[selectedIdx].classList.add("wrong");
    buttons[qObj.answer].classList.add("correct");
    if (feedbackBox) {
      feedbackBox.textContent = `To‘g‘ri javob: ${qObj.options[qObj.answer]}. ${qObj.fact}`;
      feedbackBox.classList.remove("hidden");
    }
  }

  setTimeout(() => {
    currentQuizIndex++;
    loadNextQuizQuestion();
  }, 2500);
}

// ==========================================================================
// RIVOJLANISH & MOLIYA (HABITS, FINANCE GOALS, BREATH)
// ==========================================================================
function renderHabits() {
  const container = $("habitsList");
  if (!container) return;

  container.innerHTML = appState.habits.map(h => `
    <div class="habit-row ${h.done ? 'completed' : ''}" onclick="toggleHabit(${h.id})">
      <div class="habit-info">
        <button class="habit-checkbox">${h.done ? '✓' : ''}</button>
        <span>${escapeHtml(h.name)}</span>
      </div>
      <small style="color: var(--text-muted);">${h.done ? 'Bajarildi ✨' : 'Kutilmoqda'}</small>
    </div>
  `).join("");

  const completedCount = appState.habits.filter(h => h.done).length;
  if ($("habitsProgressText")) {
    $("habitsProgressText").textContent = `Bugungi bajarilish: ${completedCount} / ${appState.habits.length}`;
  }
}

function toggleHabit(id) {
  playSfx("pop");
  const habit = appState.habits.find(h => h.id === id);
  if (habit) {
    habit.done = !habit.done;
    saveStorage("bloom_habits", appState.habits);
    renderHabits();
  }
}

function addNewHabitPrompt() {
  const name = prompt("Yangi professional yoki shaxsiy odat nomini kiriting:");
  if (name && name.trim()) {
    playSfx("magic");
    appState.habits.push({ id: Date.now(), name: "✦ " + name.trim(), done: false });
    saveStorage("bloom_habits", appState.habits);
    renderHabits();
    showToast("Yangi odat qo‘shildi!");
  }
}

// Financial Goals Tracker
function renderFinanceGoals() {
  const container = $("financeCardsGrid");
  if (!container) return;

  container.innerHTML = appState.financeGoals.map(g => {
    const percent = Math.min(100, Math.round((g.current / g.target) * 100));
    return `
      <div class="finance-goal-card">
        <div class="finance-card-top">
          <span class="finance-goal-icon">${g.icon}</span>
          <button class="btn-text-sm" onclick="addAmountToGoal(${g.id})">＋ Qo‘shish</button>
        </div>
        <h4>${escapeHtml(g.title)}</h4>
        <div class="finance-card-amounts">
          <span>Yig‘ildi: <b>$${g.current}</b></span>
          <span>Maqsad: $${g.target} (${percent}%)</span>
        </div>
        <div class="dream-bar-track">
          <div class="dream-bar-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function addAmountToGoal(id) {
  const goal = appState.financeGoals.find(g => g.id === id);
  if (!goal) return;
  const amt = prompt(`'${goal.title}' uchun qo‘shiladigan mablag‘ miqdori ($):`, "50");
  if (amt && !isNaN(amt) && Number(amt) > 0) {
    playSfx("win");
    goal.current += Number(amt);
    saveStorage("bloom_finance_goals", appState.financeGoals);
    renderFinanceGoals();
    showToast(`Jamg‘arma yangilandi: +$${amt} qo‘shildi! 💳✨`);
  }
}

function addSavingsGoalPrompt() {
  const title = prompt("Yangi jamg‘arma maqsadi (masalan: Kurslar, Sayohat, Avtomobil):");
  if (!title) return;
  const target = prompt("Kerakli umumiy summa ($):", "500");
  if (!target || isNaN(target)) return;
  const icon = prompt("Emoji yoki belgi (masalan: 🎓, ✈️, 💻, 🚘):") || "💼";

  appState.financeGoals.push({
    id: Date.now(),
    title: title.trim(),
    target: Number(target),
    current: 0,
    icon: icon.trim()
  });
  saveStorage("bloom_finance_goals", appState.financeGoals);
  renderFinanceGoals();
  playSfx("magic");
  showToast("Yangi jamg‘arma maqsadi qo‘shildi! 💳");
}

// Zen Breath 4-7-8
let breathTimer = null;
let isBreathingActive = false;

function toggleZenBreath() {
  const circle = $("breathCircle");
  const text = $("breathText");
  const btn = $("startBreathBtn");
  if (!circle || !text || !btn) return;

  if (!isBreathingActive) {
    isBreathingActive = true;
    btn.textContent = "To‘xtatish";

    function step() {
      if (!isBreathingActive) return;
      playSfx("magic");
      text.textContent = "Nafas oling... (4s)";
      circle.classList.remove("exhale");
      circle.classList.add("inhale");

      setTimeout(() => {
        if (!isBreathingActive) return;
        text.textContent = "Ushlab turing... (4s)";

        setTimeout(() => {
          if (!isBreathingActive) return;
          text.textContent = "Mayin chiqaring... (4s)";
          circle.classList.remove("inhale");
          circle.classList.add("exhale");
        }, 4000);
      }, 4000);
    }

    step();
    breathTimer = setInterval(step, 12000);
  } else {
    isBreathingActive = false;
    clearInterval(breathTimer);
    btn.textContent = "Mashqni boshlash";
    text.textContent = "Dam oling...";
    circle.classList.remove("inhale", "exhale");
  }
}

// Vision Board
function renderVisionBoard() {
  const container = $("visionBoardGrid");
  if (!container) return;

  container.innerHTML = appState.vision.map(v => `
    <div class="dream-card">
      <span class="dream-card-icon">${v.icon}</span>
      <h4>${escapeHtml(v.title)}</h4>
      <p>${escapeHtml(v.desc)}</p>
      <div class="dream-progress-wrap">
        <div class="dream-progress-label">
          <span>Rivojlanish:</span>
          <b>${v.progress}%</b>
        </div>
        <div class="dream-bar-track">
          <div class="dream-bar-fill" style="width: ${v.progress}%"></div>
        </div>
      </div>
    </div>
  `).join("");
}

function addNewDreamCard() {
  const title = prompt("Orzuingiz sarlavhasi (masalan: Xalqaro konferensiyada ma'ruza):");
  if (!title) return;
  const desc = prompt("Qisqacha ta'rif yoki niyat:");
  const icon = prompt("Emoji yoki belgi (masalan: ✈️, 🎓, 💼):") || "✦";

  appState.vision.push({
    id: Date.now(),
    title: title.trim(),
    desc: desc ? desc.trim() : "Orzularim sari qadam",
    icon: icon.trim(),
    progress: 25
  });
  saveStorage("bloom_vision", appState.vision);
  renderVisionBoard();
  playSfx("magic");
  showToast("Yangi maqsad doskaga joylandi! 🖼️✨");
}

// ==========================================================================
// KUTUBXONA & EDITORIAL
// ==========================================================================
const builtInArticles = [
  {
    id: "art-1",
    cat: "psixologiya",
    icon: "🛡️",
    title: "Psixologik Chegaralar: Qanday qilib aybdorlik hissisiz 'Yo‘q' deyish mumkin?",
    desc: "O‘z vaqtingiz, energiyangiz va ruhiyatingizni boshqalarning manipulyatsiyasidan himoya qilish sirlari.",
    readTime: "5 daqiqa",
    content: `
      <h3>Nega ko‘p qizlar 'yo‘q' deyishga qiynaladi?</h3>
      <p>Ko‘pincha jamiyat qizlardan barchaga yoqishni, muloyim va qulay bo‘lishni talab qiladi. Ammo boshqalarga 'ha' deb, o‘z vaqtingiz va orzularingizga 'yo‘q' deyish — ruhiy charchoqqa olib keladi.</p>
      
      <h4>1. Sizning 'Yo‘q' degan javobingiz to‘liq jumlalardir</h4>
      <p>Rad etganda uzoq oqlanish yoki kechirim so‘rash shart emas: "Rahmat, ammo hozir bunga vaqtim yo‘q" yoki "Taklifingiz uchun rahmat, lekin bu rejamga to‘g‘ri kelmaydi" deyish yetarlidir.</p>

      <h4>2. O‘z chegaralaringizni aniqlab oling</h4>
      <p>Siz uchun nima qabul qilib bo‘lmas ekanligini yozing: dam olish kunlari ish xabarlariga javob bermaslik, shaxsiy hayotingiz haqidagi noo‘rin savollarni to‘xtatish.</p>

      <h4>3. O‘zingizni aybdor his qilmang</h4>
      <p>Siz o‘z chegarangizni chizganingizda, aqlli insonlar sizni ko‘proq hurmat qila boshlaydi.</p>
    `
  },
  {
    id: "art-2",
    cat: "karyera",
    icon: "💼",
    title: "Karyera va Moliyaviy Mustaqillik: Zamonaviy Qizlar Uchun Yo‘l Xaritasi",
    desc: "Imposter sindromini yengish, yuqori maoshli muzokaralar va shaxsiy kapitalni yaratish formulasi.",
    readTime: "6 daqiqa",
    content: `
      <h3>Moliyaviy mustaqillik — erkinlik kalitidir</h3>
      <p>O‘z daromadiga ega bo‘lgan ayol o‘z qadriyatlariga mos tarzda qaror qabul qila oladi.</p>

      <h4>Asosiy tavsiyalar:</h4>
      <ul>
        <li><b>Imposter (Soxtalik) sindromini unuting:</b> O‘zingizni boshqalar bilan taqqoslamang. Sizning hozirgi yutuqlaringiz faqat sizning mehnatingiz natijasidir.</li>
        <li><b>Bitta daromad bilan cheklanmang:</b> O‘z kasbingizdan tashqari frilans, konsultatsiya yoki passiv investitsiya usullarini o‘rganing.</li>
        <li><b>50/30/20 qoidasi:</b> 50% zaruriy ehtiyojlar, 30% orzular, 20% majburiy jamg‘arma fondi.</li>
      </ul>
    `
  },
  {
    id: "art-3",
    cat: "uslub",
    icon: "👗",
    title: "Kapsula Garderob: Kam narsalar bilan har kuni mukammal ko‘rinish",
    desc: "Old money, sifatli matolar, vazmin palitralar va tartibli shaxsiy stil yaratish san'ati.",
    readTime: "5 daqiqa",
    content: `
      <h3>Ortiqcha kiyimlar emas — to‘g‘ri tanlov</h3>
      <p>Kapsula garderobning maqsadi — 'kiyishga hech narsa yo‘q' degan holatdan butunlay xalos bo‘lishdir.</p>

      <h4>Kapsula asosi:</h4>
      <ol>
        <li>Mukammal o‘tiradigan sifatli pidjak (blazer).</li>
        <li>Keng qora yoki grafit palatso shimi.</li>
        <li>Oq sifatli paxtali ko‘ylak va ipak bluzka.</li>
        <li>Klassik teri lofer va sifatli charm sumka.</li>
      </ol>
      <p>Barcha kiyimlar bir-biri bilan rang jihatdan mos tushishi kerak (Krem, Shokolad, Qora, Zaytun).</p>
    `
  },
  {
    id: "art-4",
    cat: "salomatlik",
    icon: "🧴",
    title: "Dermatologik Skincare: Faol Moddalar va Ilmiy Terini Parvarishlash",
    desc: "Retinol, S vitamini, Niasinamid, Gialuron kislotasi va SPF — ularni qanday to‘g‘ri qo‘llash kerak?",
    readTime: "5 daqiqa",
    content: `
      <h3>Go‘zallik laboratoriyasi</h3>
      <p>Teri parvarishida eng muhimi — mahsulotning narxi emas, balki faol tarkibiy qismlarning o‘zaro mosligidir.</p>

      <h4>Ertalabki parvarish:</h4>
      <p>Yumshoq gel ➔ S vitamini (antioksidant) ➔ Namlantiruvchi krem ➔ SPF 50+.</p>

      <h4>Kechki parvarish:</h4>
      <p>Gidrofil yog‘ ➔ Yuvish geli ➔ Retinol yoki AHA/BHA kislotalar ➔ Chuqur namlantiruvchi krem.</p>
    `
  },
  {
    id: "art-5",
    cat: "tarix",
    icon: "👑",
    title: "Tarixni O‘zgartirgan Lider Ayollar: Siyosat, Fan va San'at Darg‘alari",
    desc: "Nodirabegim, Marie Curie, Margaret Thatcher va Malala Yousafzai jasorati.",
    readTime: "6 daqiqa",
    content: `
      <h3>Iroda va aql timsollari</h3>
      <p>Ushbu ayollar har qanday qiyinchilik oldida bosh egmagan, balki butun dunyo tarixining oqimini o‘zgartirgan.</p>
      <p>Ularning umumiy jihati — qat'iy intizom, ilmga cheksiz muhabbat va boshqalarga yordam berish maqsadi edi.</p>
    `
  },
  {
    id: "art-6",
    cat: "psixologiya",
    icon: "🌿",
    title: "Emotsional Intellekt (EQ): Qizlar Uchun Liderlik va Muloqot Sirlari",
    desc: "O‘z his-tuyg‘ularini boshqarish, nizolardan madaniyatli chiqish va odamlarni o‘ziga jalb qilish.",
    readTime: "4 daqiqa",
    content: `
      <h3>EQ nima uchun IQ dan muhimroq?</h3>
      <p>Hayotda eng katta muvaffaqiyatga odamlarni tinglay oladigan, o‘z g‘azabi yoki xavotirini boshqara oladigan insonlar erishadi.</p>
      <p>Har qanday ziddiyatda ovoz ko‘tarish o‘rniga faktlar bilan xotirjam gapirish — chinakam aslzodalik belgisidir.</p>
    `
  }
];

function renderBooks() {
  const container = $("booksGrid");
  if (!container) return;

  const query = ($("librarySearchInput")?.value || "").toLowerCase();
  const activePill = document.querySelector("#libraryFilterPills .filter-pill.active");
  const cat = activePill ? activePill.dataset.cat : "all";

  const all = [...builtInArticles, ...appState.customBooks];
  const filtered = all.filter(b => {
    const matchesCat = cat === "all" || b.cat === cat || (cat === "pdf" && b.isPdf);
    const matchesQuery = (b.title + " " + (b.desc || "")).toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px;">Maqola topilmadi.</p>';
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="book-article-card">
      <div class="book-cover-art">${item.icon || "📖"}</div>
      <span class="book-category-tag">${escapeHtml((item.cat || "Editorial").toUpperCase())}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.desc || "Qiziqarli mutolaa maqolasi")}</p>
      <div class="book-card-footer">
        <span class="read-time-pill">⏱ ${item.readTime || 'PDF'}</span>
        <button class="btn-primary-sm" onclick="openReaderModal('${item.id}')">Mutolaa ↗</button>
      </div>
    </article>
  `).join("");
}

function openReaderModal(id) {
  playSfx("magic");
  const all = [...builtInArticles, ...appState.customBooks];
  const item = all.find(b => b.id === id);
  if (!item) return;

  if ($("readerModalTitle")) $("readerModalTitle").textContent = item.title;
  const body = $("readerModalBody");
  if (body) {
    if (item.isPdf && item.pdfUrl) {
      body.innerHTML = `<iframe src="${item.pdfUrl}" style="width:100%; height:70vh; border:none; border-radius:8px;" title="${item.title}"></iframe>`;
    } else {
      body.innerHTML = item.content || `<p>${item.desc}</p>`;
    }
  }

  $("bookReaderModal")?.classList.remove("hidden");
}

function handleCustomPdfUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showToast("Faqat PDF fayl tanlang!");
    return;
  }

  const url = URL.createObjectURL(file);
  const newBook = {
    id: "pdf-" + Date.now(),
    title: file.name.replace(/\.pdf$/i, ""),
    desc: `Shaxsiy PDF hujjat · ${(file.size / 1024 / 1024).toFixed(2)} MB`,
    cat: "pdf",
    icon: "📕",
    readTime: "PDF",
    isPdf: true,
    pdfUrl: url
  };

  appState.customBooks.push(newBook);
  saveStorage("bloom_custom_books", appState.customBooks.map(({ pdfUrl, ...rest }) => rest));
  renderBooks();
  updateDashboardStats();
  playSfx("win");
  showToast("PDF kutubxonaga qo‘shildi! 📚");
}

// ==========================================================================
// MODEST & ELEGANCE (GRATITUDE)
// ==========================================================================
function saveModestGratitude() {
  const text = $("modestGratitudeText")?.value.trim();
  if (!text) {
    showToast("Iltimos, avval minnatdorlik fikringizni yozing 🌸");
    return;
  }

  appState.gratitudes.unshift({
    id: Date.now(),
    text,
    date: new Date().toLocaleDateString("uz-UZ")
  });
  saveStorage("bloom_gratitudes", appState.gratitudes);
  renderGratitudes();
  if ($("modestGratitudeText")) $("modestGratitudeText").value = "";
  playSfx("magic");
  showToast("Kechki shukronalik sahifangiz saqlandi! 🌷✨");
}

function renderGratitudes() {
  const list = $("gratitudeSavedList");
  if (!list) return;

  list.innerHTML = appState.gratitudes.slice(0, 5).map(g => `
    <div class="gratitude-item">
      <small style="display:block; color:var(--accent-gold); margin-bottom:2px;">✦ ${g.date}</small>
      <p>${escapeHtml(g.text)}</p>
    </div>
  `).join("");
}

// ==========================================================================
// LOLA — VIRTUAL MENTOR (INTELLIGENT CONFIDANTE)
// ==========================================================================
const lolaReplies = [
  {
    keys: ["ishonch", "imposter", "qo'rqaman", "tortinchoq", "o'zimga"],
    reply: "Imposter sindromi (o‘ziga ishonchsizlik) aynan eng aqlli va o‘z ustida tinimsiz ishlaydigan insonlarda eng ko‘p uchraydi! 💼 Bilasizmi, agar siz o‘sha yutuqlarga loyiq bo‘lmaganingizda, hozir turgan darajangizda bo‘lolmas edingiz. Har qanday yutuqni tasodif emas, balki shaxsiy mehnatingiz natijasi deb qabul qiling. Siz bunga mutlaqo loyiqsiz! 👑"
  },
  {
    keys: ["vaqt", "reja", "chalg'ish", "pomodoro", "ulgurmayapman"],
    reply: "Vaqtni boshqarish siri — hamma narsaga ulgurishda emas, balki eng muhim 3 ta vazifani tanlab olishdadir ⏱ Bugun Pomodoro metodini sinab ko‘ring: 25 daqiqa davomida telefonsiz faqat bitta vazifaga diqqat qarating va 5 daqiqa dam oling. Natijadan hayratda qolasiz! ☕"
  },
  {
    keys: ["chegara", "yo'q", "rad", "odamlar", "hafa"],
    reply: "Birovga 'yo‘q' deyish — yomon munosabat belgisi emas, balki o‘z qadriyatlaringizni himoya qilishdir 🛡️ Siz butun dunyoni xursand qilishga majbur emassiz. O‘zingizga tinchlik bergan insonlar bilan birga bo‘ling va keraksiz majburiyatlarni muloyimlik bilan rad eting 🌿"
  },
  {
    keys: ["kundalik", "savol", "yozish", "g'oya"],
    reply: "Bugungi chuqur tafakkur uchun savollar: 1) Bugun o‘zimdagi qaysi qarorim bilan faxrlanaman? 2) Kelasi 1 yilda o‘zimni qanday professional va shaxsiy darajada ko‘rmoqchiman? 3) Meni eng ko‘p quvvatlantiradigan odat qaysi? Shu haqda kundalikka yozing! 🖋️✨"
  },
  {
    keys: ["uslub", "kiyinish", "garderob", "kapsula", "moda"],
    reply: "Haqiqiy uslub — trendlar ketidan quvish emas, balki o‘z qaddi-qomatingizga, xarakteringizga mos tushadigan sifatli kiyimlarni tanlashdir 👗 Neytral ranglar (Krem, Shokolad, Qora, Zaytun) va sifatli matolar har doim eng qimmat va vazmin taassurot qoldiradi."
  },
  {
    keys: ["salom", "assalomu", "lola"],
    reply: "Assalomu alaykum! 🌷 Men siz bilan muloqot qilayotganimdan juda mamnunman. Karyera, shaxsiy maqsadlar, darslar yoki shunchaki qalb xotirjamligi haqida suhbatlashamizmi? Istalgan savolingizni bemalol yozing! ✨"
  }
];

function sendLolaMessage(text) {
  text = text.trim();
  if (!text) return;

  const container = $("lolaMessages");
  if (!container) return;

  const userMsg = document.createElement("div");
  userMsg.className = "msg msg-user";
  userMsg.textContent = text;
  container.appendChild(userMsg);
  container.scrollTop = container.scrollHeight;
  playSfx("click");

  if ($("lolaChatInput")) $("lolaChatInput").value = "";

  setTimeout(() => {
    playSfx("magic");
    const lower = text.toLowerCase();
    const matched = lolaReplies.find(r => r.keys.some(k => lower.includes(k)));
    const botReply = matched
      ? matched.reply
      : "Bu juda teran va muhim fikr 🌸 Bu haqda kundaligingizga chuqurroq yozib qo‘yishingiz yoki Bloom kutubxonasidan shaxsiy rivojlanish maqolalarini mutolaa qilishingiz mumkin. Men doim sizning yoningizdaman!";

    const botMsg = document.createElement("div");
    botMsg.className = "msg msg-bot";
    botMsg.textContent = botReply;
    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
  }, 650);
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ==========================================================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  setTheme(appState.theme);
  initSparkles();
  generateStarField();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  initVisualizer();

  $$(".nav").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  $("mobileMenuBtn")?.addEventListener("click", () => {
    $("sidebar")?.classList.toggle("mobile-open");
  });

  $("themeDropdownBtn")?.addEventListener("click", e => {
    e.stopPropagation();
    $("themeMenu")?.classList.toggle("hidden");
  });
  document.addEventListener("click", () => $("themeMenu")?.classList.add("hidden"));

  $$(".theme-opt").forEach(btn => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  $("sfxToggleBtn")?.addEventListener("click", () => {
    appState.sfx = !appState.sfx;
    saveStorage("bloom_sfx", appState.sfx);
    if ($("sfxIcon")) $("sfxIcon").textContent = appState.sfx ? "🔊" : "🔇";
    showToast(`Tovushlar: ${appState.sfx ? "Yoqildi 🔊" : "O‘chirildi 🔇"}`);
  });
  if ($("sfxIcon")) $("sfxIcon").textContent = appState.sfx ? "🔊" : "🔇";

  $("quickLockBtn")?.addEventListener("click", () => {
    if (!appState.isLocked) {
      lockDiary();
      showPage("diary");
    } else {
      showPage("diary");
    }
  });
  $("lockDiaryNowBtn")?.addEventListener("click", lockDiary);

  $$(".pin-keypad .key-btn").forEach(btn => {
    const key = btn.dataset.key;
    if (key !== undefined) {
      btn.addEventListener("click", () => handlePinKey(key));
    }
  });
  $("pinClearBtn")?.addEventListener("click", () => {
    playSfx("click");
    resetPinDisplay();
  });
  $("pinForgotBtn")?.addEventListener("click", () => {
    alert("Dastlabki PIN-kod: 1234. Sozlamalarda uni o‘zgartirishingiz mumkin.");
  });

  $("setNewPinBtn")?.addEventListener("click", () => {
    $("pinSettingsModal")?.classList.remove("hidden");
  });
  $("closePinModalBtn")?.addEventListener("click", () => $("pinSettingsModal")?.classList.add("hidden"));
  $("cancelPinChangeBtn")?.addEventListener("click", () => $("pinSettingsModal")?.classList.add("hidden"));
  $("savePinChangeBtn")?.addEventListener("click", () => {
    const oldP = $("oldPinInput")?.value;
    const newP = $("newPinInput")?.value;
    const confP = $("confirmPinInput")?.value;

    if (oldP !== appState.pin) {
      showToast("Eski PIN-kod noto‘g‘ri!");
      return;
    }
    if (!newP || newP.length !== 4 || isNaN(newP)) {
      showToast("Yangi PIN-kod 4 xonali raqam bo‘lishi kerak!");
      return;
    }
    if (newP !== confP) {
      showToast("Yangi PIN-kodlar bir-biriga mos kelmadi!");
      return;
    }

    appState.pin = newP;
    saveStorage("bloom_pin", newP);
    $("pinSettingsModal")?.classList.add("hidden");
    playSfx("magic");
    showToast("Yangi PIN-kod saqlandi! 🔑✨");
  });

  $("saveEntryBtn")?.addEventListener("click", saveDiaryEntry);
  $("recordVoiceBtn")?.addEventListener("click", toggleVoiceRecording);
  $("entryPhotoInput")?.addEventListener("change", handlePhotoAttach);
  $("removePhotoBtn")?.addEventListener("click", removeAttachedPhoto);
  $("exportDiaryBtn")?.addEventListener("click", exportDiaryBackup);

  $("entryText")?.addEventListener("input", () => {
    const len = $("entryText").value.length;
    if ($("charCountDisplay")) $("charCountDisplay").textContent = `${len} ta belgi`;
  });

  $("paperThemeSelect")?.addEventListener("change", e => {
    const container = $("diaryPaperContainer");
    if (container) container.className = `diary-paper-container ${e.target.value}`;
  });

  $("entryFontSelect")?.addEventListener("change", e => {
    const textarea = $("entryText");
    if (textarea) textarea.className = `diary-textarea ${e.target.value}`;
  });

  $$("#stickerPalette .sticker-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("pop");
      const textarea = $("entryText");
      if (textarea) {
        textarea.value += " " + btn.dataset.sticker + " ";
        textarea.focus();
      }
    });
  });

  $("searchEntriesInput")?.addEventListener("input", renderEntries);
  $("filterMoodSelect")?.addEventListener("change", renderEntries);
  $("closeEntryViewerBtn")?.addEventListener("click", () => $("entryViewerModal")?.classList.add("hidden"));

  // Hydration
  $$(".glass-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.glass);
      handleWaterClick(idx);
    });
  });
  $("resetWaterBtn")?.addEventListener("click", () => {
    playSfx("click");
    appState.water.count = 0;
    saveStorage("bloom_water", appState.water);
    updateWaterUI();
    showToast("Suv hisoblagichi tozalandi.");
  });

  // Affirmations
  $("refreshAffirmationBtn")?.addEventListener("click", getRandomAffirmation);
  $("speakAffirmationBtn")?.addEventListener("click", speakAffirmation);
  $("copyAffirmationBtn")?.addEventListener("click", () => {
    const txt = $("dailyAffirmationText")?.textContent || "";
    navigator.clipboard?.writeText(txt).then(() => showToast("Tasdiq nusxalandi! 📋"));
  });

  // Games Navigation
  $$(".game-pill").forEach(pill => {
    pill.addEventListener("click", () => openGame(pill.dataset.game));
  });

  // Wardrobe Lookbook
  $$(".wardrobe-tabs .w-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".wardrobe-tabs .w-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderWardrobeCategory(tab.dataset.cat);
    });
  });
  renderWardrobeCategory("hair");
  $("randomizeOutfitBtn")?.addEventListener("click", randomizeOutfit);
  $("saveOutfitSnapBtn")?.addEventListener("click", () => {
    playSfx("magic");
    showToast("Ajoyib ko‘rinish Lookbook albomiga saqlandi! 📸✨");
  });

  $$(".stage-scenery-selector .scene-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".stage-scenery-selector .scene-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const scenery = $("dollScenery");
      if (scenery) scenery.className = `doll-scenery scenery-${btn.dataset.scene}`;
    });
  });

  // Skincare & Room
  initMakeupStudio();
  $("resetMakeupBtn")?.addEventListener("click", () => {
    playSfx("click");
    if ($("makeupLips")) $("makeupLips").style.background = "#a3485e";
    if ($("eyeshadowLeft")) $("eyeshadowLeft").style.background = "rgba(181, 131, 141, 0.5)";
    if ($("eyeshadowRight")) $("eyeshadowRight").style.background = "rgba(181, 131, 141, 0.5)";
    if ($("blushLeft")) $("blushLeft").style.background = "rgba(229, 152, 155, 0.5)";
    if ($("blushRight")) $("blushRight").style.background = "rgba(229, 152, 155, 0.5)";
    if ($("faceGemsContainer")) $("faceGemsContainer").innerHTML = "";
    showToast("Glow palitrasi tiklandi!");
  });

  initRoomDesigner();
  $("resetRoomBtn")?.addEventListener("click", () => {
    playSfx("click");
    if ($("roomWall")) $("roomWall").style.background = "#1c1427";
    if ($("roomNeon")) $("roomNeon").textContent = "MINDFUL & FOCUSED ✨";
  });

  // Pomodoro Focus Cafe
  $("pomodoroStartBtn")?.addEventListener("click", togglePomodoro);
  $("pomodoroResetBtn")?.addEventListener("click", () => resetPomodoro(25, "Fokus vaqti ☕"));
  $("pomodoroBreakBtn")?.addEventListener("click", () => resetPomodoro(5, "Tanaffus vaqti 🍃"));
  $("pomodoroAddTaskBtn")?.addEventListener("click", addPomodoroTask);
  $("pomodoroNewTaskInput")?.addEventListener("keydown", e => { if (e.key === "Enter") addPomodoroTask(); });
  if ($("pomodoroSessionsCount")) $("pomodoroSessionsCount").textContent = appState.pomodoro.sessions;

  // 2048 & Catch Stars & Memory & Popit & Magic Orb
  $("restart2048Btn")?.addEventListener("click", init2048Game);
  $("btn2048Up")?.addEventListener("click", () => move2048("up"));
  $("btn2048Down")?.addEventListener("click", () => move2048("down"));
  $("btn2048Left")?.addEventListener("click", () => move2048("left"));
  $("btn2048Right")?.addEventListener("click", () => move2048("right"));
  window.addEventListener("keydown", e => {
    if ($("game-sweet2048")?.classList.contains("active")) {
      if (e.key === "ArrowUp") { e.preventDefault(); move2048("up"); }
      if (e.key === "ArrowDown") { e.preventDefault(); move2048("down"); }
      if (e.key === "ArrowLeft") { e.preventDefault(); move2048("left"); }
      if (e.key === "ArrowRight") { e.preventDefault(); move2048("right"); }
    }
  });

  $("startCatchGameBtn")?.addEventListener("click", initCatchGame);
  $("startMemoryAdvBtn")?.addEventListener("click", initMemoryAdvGame);
  initPopItBoard();
  $("flipPopItBtn")?.addEventListener("click", flipPopItBoard);
  $("shakeOrbBtn")?.addEventListener("click", shakeOrb);
  $("crystalOrb")?.addEventListener("click", shakeOrb);
  initTarot();

  // Growth & Finance
  $("addNewHabitBtn")?.addEventListener("click", addNewHabitPrompt);
  $("addSavingsGoalBtn")?.addEventListener("click", addSavingsGoalPrompt);
  $("startBreathBtn")?.addEventListener("click", toggleZenBreath);
  $("addDreamBtn")?.addEventListener("click", addNewDreamCard);

  // Library & Reader
  $("librarySearchInput")?.addEventListener("input", renderBooks);
  $$("#libraryFilterPills .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$("#libraryFilterPills .filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderBooks();
    });
  });
  $("libraryPdfUpload")?.addEventListener("change", handleCustomPdfUpload);
  $("closeReaderModalBtn")?.addEventListener("click", () => $("bookReaderModal")?.classList.add("hidden"));

  let currentReaderFontSize = 16;
  $("readerFontInc")?.addEventListener("click", () => {
    currentReaderFontSize = Math.min(24, currentReaderFontSize + 2);
    if ($("readerModalBody")) $("readerModalBody").style.fontSize = `${currentReaderFontSize}px`;
    if ($("readerFontSizeDisplay")) $("readerFontSizeDisplay").textContent = `${currentReaderFontSize}px`;
  });
  $("readerFontDec")?.addEventListener("click", () => {
    currentReaderFontSize = Math.max(12, currentReaderFontSize - 2);
    if ($("readerModalBody")) $("readerModalBody").style.fontSize = `${currentReaderFontSize}px`;
    if ($("readerFontSizeDisplay")) $("readerFontSizeDisplay").textContent = `${currentReaderFontSize}px`;
  });

  $$(".btn-theme-reader").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".btn-theme-reader").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const rBody = $("readerModalBody");
      if (rBody) rBody.className = `reader-body theme-${btn.dataset.rtheme}`;
    });
  });

  $("saveModestGratitudeBtn")?.addEventListener("click", saveModestGratitude);

  // Music Studio
  $("mainPlayBtn")?.addEventListener("click", toggleLofiMusic);
  $("quickMusicToggle")?.addEventListener("click", toggleLofiMusic);
  $("prevTrackBtn")?.addEventListener("click", () => {
    playSfx("click");
    currentLofiTrackIndex = (currentLofiTrackIndex - 1 + lofiTracks.length) % lofiTracks.length;
    if ($("currentTrackTitle")) $("currentTrackTitle").textContent = lofiTracks[currentLofiTrackIndex].title;
    if (isLofiPlaying) playLofiChords();
  });
  $("nextTrackBtn")?.addEventListener("click", () => {
    playSfx("click");
    currentLofiTrackIndex = (currentLofiTrackIndex + 1) % lofiTracks.length;
    if ($("currentTrackTitle")) $("currentTrackTitle").textContent = lofiTracks[currentLofiTrackIndex].title;
    if (isLofiPlaying) playLofiChords();
  });

  $$(".ambient-slider").forEach(slider => {
    slider.addEventListener("input", e => {
      const name = e.target.dataset.sound;
      const val = Number(e.target.value);
      startAmbientSound(name, val);
    });
  });

  $("muteAllAmbientBtn")?.addEventListener("click", () => {
    playSfx("click");
    $$(".ambient-slider").forEach(sl => {
      sl.value = 0;
      startAmbientSound(sl.dataset.sound, 0);
    });
    showToast("Barcha ambient audio o‘chirildi.");
  });

  $("sleepTimerSelect")?.addEventListener("change", e => setSleepTimer(Number(e.target.value)));

  $("customAudioUpload")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = $("nativeAudioElement");
    if (audio) {
      audio.src = url;
      audio.classList.remove("hidden");
      audio.play();
      if ($("playerStatusText")) $("playerStatusText").textContent = `Ijro: ${file.name}`;
      showToast("Audio yuklandi va ijro etilmoqda ♫");
    }
  });

  // Lola Chat
  $("lolaChatForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const text = $("lolaChatInput")?.value || "";
    sendLolaMessage(text);
  });

  $$("#lolaChips .chip-btn").forEach(chip => {
    chip.addEventListener("click", () => sendLolaMessage(chip.dataset.prompt));
  });

  // Habit Refresh
  const savedHabitDate = readStorage("bloom_habit_date", new Date().toDateString());
  if (savedHabitDate !== new Date().toDateString()) {
    appState.habits.forEach(h => h.done = false);
    saveStorage("bloom_habits", appState.habits);
    saveStorage("bloom_habit_date", new Date().toDateString());
  }

  // Keyboard PIN
  window.addEventListener("keydown", e => {
    if (appState.isLocked && $("diaryLockScreen") && !$("diaryLockScreen").classList.contains("hidden")) {
      if (e.key >= "0" && e.key <= "9") handlePinKey(e.key);
      else if (e.key === "Backspace") resetPinDisplay();
    }
  });

  // Backdrop modal close
  window.addEventListener("click", e => {
    if (e.target && e.target.classList && e.target.classList.contains("modal")) {
      e.target.classList.add("hidden");
    }
  });

  // Window bindings
  window.showPage = showPage;
  window.openGame = openGame;
  window.openReaderModal = openReaderModal;
  window.applyWardrobeItem = applyWardrobeItem;
  window.handleMemoryCardClick = handleMemoryCardClick;
  window.checkQuizAnswer = checkQuizAnswer;
  window.viewFullEntry = viewFullEntry;
  window.deleteEntry = deleteEntry;
  window.toggleHabit = toggleHabit;
  window.handleWaterClick = handleWaterClick;
  window.addAmountToGoal = addAmountToGoal;

  // Initial renders
  updateWaterUI();
  updateDashboardStats();
  renderHabits();
  renderFinanceGoals();
  renderVisionBoard();
  renderGratitudes();
  updateDollUI();
});
