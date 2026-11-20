const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Advanced DOM mock
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(...cls) { cls.forEach(c => c && this.classes.add(c)); }
  remove(...cls) { cls.forEach(c => this.classes.delete(c)); }
  toggle(c, force) {
    if (force !== undefined) {
      if (force) this.classes.add(c);
      else this.classes.delete(c);
      return force;
    }
    if (this.classes.has(c)) { this.classes.delete(c); return false; }
    else { this.classes.add(c); return true; }
  }
  contains(c) { return this.classes.has(c); }
}

class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = new MockClassList();
    if (className) className.split(/\s+/).forEach(c => this.classList.add(c));
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.style = {
      setProperty: (k, v) => { this.style[k] = v; }
    };
    this.dataset = {};
    this._listeners = {};
    this.innerText = '';
    this.innerHTML = '';
    this.value = '';
    this.checked = false;
    this.width = 600;
    this.height = 400;
  }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, val) { this.attributes[name] = String(val); }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(evt, fn) {
    if (!this._listeners[evt]) this._listeners[evt] = [];
    this._listeners[evt].push(fn);
  }
  dispatchEvent(evt) {
    const list = this._listeners[evt.type] || [];
    list.forEach(fn => fn(evt));
  }
  click() {
    this.dispatchEvent({ type: 'click', target: this, preventDefault: () => {}, stopPropagation: () => {} });
  }
  appendChild(child) {
    this.children.push(child);
    child.parentElement = this;
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    return child;
  }
  querySelector(sel) {
    return mockQuerySelector(this, sel);
  }
  querySelectorAll(sel) {
    return mockQuerySelectorAll(this, sel);
  }
  getContext() {
    return new Proxy({
      measureText: () => ({ width: 10 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      getImageData: () => ({ data: new Uint8ClampedArray(4) })
    }, {
      get: (target, prop) => prop in target ? target[prop] : () => {}
    });
  }
  getBoundingClientRect() {
    return { top: 0, left: 0, width: 600, height: 400, right: 600, bottom: 400 };
  }
  scrollIntoView() {}
}

const elementMap = new Map();
const allElements = [];

const elemRegex = /<([a-zA-Z0-9-]+)([^>]*)>/g;
let m;
while ((m = elemRegex.exec(html)) !== null) {
  const tag = m[1];
  const attrsStr = m[2];
  if (tag.startsWith('/')) continue;
  
  let id = '';
  const idMatch = attrsStr.match(/\bid=["']([^"']+)["']/);
  if (idMatch) id = idMatch[1];
  
  let cls = '';
  const clsMatch = attrsStr.match(/\bclass=["']([^"']+)["']/);
  if (clsMatch) cls = clsMatch[1];

  const el = new MockElement(tag, id, cls);
  
  const dataRegex = /data-([a-zA-Z0-9_-]+)=["']([^"']+)["']/g;
  let dm;
  while ((dm = dataRegex.exec(attrsStr)) !== null) {
    const key = dm[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    el.dataset[key] = dm[2];
  }

  const typeMatch = attrsStr.match(/\btype=["']([^"']+)["']/);
  if (typeMatch) el.setAttribute('type', typeMatch[1]);

  if (id) elementMap.set(id, el);
  allElements.push(el);
}

function mockQuerySelector(root, sel) {
  const res = mockQuerySelectorAll(root, sel);
  return res.length > 0 ? res[0] : null;
}

function mockQuerySelectorAll(root, sel) {
  const parts = sel.split(',').map(s => s.trim());
  const found = new Set();
  const searchScope = root ? (root.children ? getAllDescendants(root) : allElements) : allElements;
  parts.forEach(part => {
    if (part.startsWith('#')) {
      const el = elementMap.get(part.slice(1));
      if (el) found.add(el);
    } else if (part.startsWith('.')) {
      const cls = part.slice(1);
      searchScope.forEach(el => {
        if (el.classList.contains(cls)) found.add(el);
      });
    } else {
      searchScope.forEach(el => {
        if (el.tagName.toLowerCase() === part.toLowerCase()) found.add(el);
      });
    }
  });
  return Array.from(found);
}

function getAllDescendants(el) {
  let list = [];
  el.children.forEach(c => {
    list.push(c);
    list = list.concat(getAllDescendants(c));
  });
  return list;
}

const localStorageData = {};
global.localStorage = {
  getItem: (k) => localStorageData[k] || null,
  setItem: (k, v) => { localStorageData[k] = String(v); },
  removeItem: (k) => { delete localStorageData[k]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

global.window = {
  localStorage: global.localStorage,
  scrollTo: () => {},
  prompt: (msg, def) => def || "100000",
  alert: (msg) => console.log('ALERT:', msg),
  confirm: (msg) => true,
  addEventListener: (evt, fn) => {
    if (evt === 'DOMContentLoaded') setTimeout(fn, 10);
  },
  innerWidth: 1024,
  innerHeight: 768,
  AudioContext: class {
    constructor() { this.state = 'running'; this.destination = {}; }
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} } }; }
    createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, Q: { setValueAtTime: () => {} }, type: 'lowpass' }; }
    createBufferSource() { return { connect: () => {}, start: () => {}, stop: () => {}, loop: false, buffer: null }; }
    createBuffer() { return { getChannelData: () => new Float32Array(44100) }; }
    resume() { return Promise.resolve(); }
  },
  webkitAudioContext: null,
  speechSynthesis: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => []
  },
  SpeechSynthesisUtterance: class { constructor(t) { this.text = t; } }
};
global.window.webkitAudioContext = global.window.AudioContext;

global.document = {
  getElementById: (id) => elementMap.get(id) || null,
  querySelector: (sel) => mockQuerySelector(null, sel),
  querySelectorAll: (sel) => mockQuerySelectorAll(null, sel),
  createElement: (tag) => {
    const el = new MockElement(tag);
    allElements.push(el);
    return el;
  },
  body: elementMap.get('body') || new MockElement('body'),
  addEventListener: (evt, fn) => {
    if (evt === 'DOMContentLoaded') setTimeout(fn, 10);
  }
};

global.navigator = {
  mediaDevices: {
    getUserMedia: () => Promise.resolve({})
  },
  clipboard: {
    writeText: () => Promise.resolve()
  }
};

global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

const jsContent = fs.readFileSync('script.js', 'utf8');
eval(jsContent);

setTimeout(() => {
  console.log('Running detailed suite...');
  const errors = [];

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message, e.stack);
      errors.push({ name, err: e });
    }
  }

  // 1. Water Tracker
  test('Water Tracker Click & Reset', () => {
    const g0 = elementMap.get('waterGlassesGrid');
    const reset = elementMap.get('resetWaterBtn');
    if (reset) reset.click();
    const glassBtns = mockQuerySelectorAll(g0, '.glass-btn');
    glassBtns.forEach(b => b.click());
    if (reset) reset.click();
  });

  // 2. Affirmations
  test('Affirmation refresh, copy, speak', () => {
    const ref = elementMap.get('refreshAffirmationBtn');
    const copy = elementMap.get('copyAffirmationBtn');
    const speak = elementMap.get('speakAffirmationBtn');
    if (ref) ref.click();
    if (copy) copy.click();
    if (speak) speak.click();
  });

  // 3. Theme Dropdown
  test('Theme switching', () => {
    ['midnight', 'sakura', 'matcha', 'peach', 'cyber'].forEach(t => {
      if (typeof window.setTheme === 'function') window.setTheme(t);
    });
  });

  // 4. Diary Entry Creation & Search
  test('Diary save, search, and list', () => {
    const entryText = elementMap.get('entryText');
    const saveBtn = elementMap.get('saveEntryBtn');
    if (entryText && saveBtn) {
      entryText.value = 'Bugun ajoyib kun bo‘ldi. Loyihalar ustida ishladim.';
      saveBtn.click();
    }
    const searchInput = elementMap.get('searchEntriesInput');
    if (searchInput) {
      searchInput.value = 'ajoyib';
      searchInput.dispatchEvent({ type: 'input' });
    }
  });

  // 5. Lookbook Capsule Items
  test('Lookbook outfit customization', () => {
    const randBtn = elementMap.get('randomizeOutfitBtn');
    const snapBtn = elementMap.get('saveOutfitSnapBtn');
    if (randBtn) randBtn.click();
    if (snapBtn) snapBtn.click();
  });

  // 6. Skincare Lab
  test('Skincare routine progression', () => {
    const completeBtn = elementMap.get('completeSkincareBtn');
    if (completeBtn) completeBtn.click();
  });

  // 7. Aesthetic Space Decor
  test('Aesthetic room styling', () => {
    const decorBtns = mockQuerySelectorAll(null, '.decor-opt-btn');
    decorBtns.slice(0, 5).forEach(b => b.click());
    const resetBtn = elementMap.get('resetRoomDecorBtn');
    if (resetBtn) resetBtn.click();
  });

  // 8. 2048 Game Restart & Moves
  test('Café 2048 controls', () => {
    const restart = elementMap.get('restart2048Btn');
    if (restart) restart.click();
    const up = elementMap.get('btn2048Up');
    const left = elementMap.get('btn2048Left');
    if (up) up.click();
    if (left) left.click();
  });

  // 9. Focus Stars
  test('Focus Stars Start', () => {
    const startBtn = elementMap.get('startCatchGameBtn');
    if (startBtn) startBtn.click();
  });

  // 10. Memory Game Start
  test('Memory game start', () => {
    const startBtn = elementMap.get('startMemoryAdvBtn');
    if (startBtn) startBtn.click();
  });

  // 11. Pop-it Board
  test('Pop-it bubbles', () => {
    const flipBtn = elementMap.get('flipPopItBtn');
    if (flipBtn) flipBtn.click();
  });

  // 12. Magic Orb & Tarot
  test('Magic Orb and Tarot reveal', () => {
    const shakeBtn = elementMap.get('shakeOrbBtn');
    if (shakeBtn) shakeBtn.click();
    const tarotCards = mockQuerySelectorAll(null, '.tarot-card');
    tarotCards.forEach(c => c.click());
  });

  // 13. Smart Women Quiz
  test('Smart Women Quiz answer selection', () => {
    const options = mockQuerySelectorAll(null, '.quiz-option-btn');
    if (options.length > 0) options[0].click();
  });

  // 14. Finance Savings Goals
  test('Finance goals adding and funding', () => {
    if (typeof window.addSavingsGoalPrompt === 'function') window.addSavingsGoalPrompt();
    if (typeof window.addAmountToGoal === 'function') window.addAmountToGoal(0, 50000);
  });

  // 15. Habits & Breathing
  test('Habits and Breathing', () => {
    const addHabit = elementMap.get('addNewHabitBtn');
    if (addHabit) addHabit.click();
    const breathBtn = elementMap.get('startBreathBtn');
    if (breathBtn) breathBtn.click();
  });

  // 16. Vision Board
  test('Vision board dream add', () => {
    const dreamBtn = elementMap.get('addDreamBtn');
    if (dreamBtn) dreamBtn.click();
  });

  // 17. Library Search and Filters
  test('Library search and filter pills', () => {
    const search = elementMap.get('librarySearchInput');
    if (search) {
      search.value = 'etiket';
      search.dispatchEvent({ type: 'input' });
    }
    const pills = mockQuerySelectorAll(null, '.filter-pill');
    pills.forEach(p => p.click());
  });

  // 18. Ambient Audio Controls
  test('Ambient audio mixer channels', () => {
    ['rain', 'cafe', 'ocean', 'fire', 'birds', 'night'].forEach(snd => {
      const toggle = elementMap.get(`sound_${snd}`);
      if (toggle) toggle.click();
    });
    const masterPlay = elementMap.get('masterPlayBtn');
    if (masterPlay) masterPlay.click();
    const loFi = elementMap.get('lofiBeatToggle');
    if (loFi) loFi.click();
  });

  // 19. Lola Mentor Responses
  test('Lola Mentor prompts', () => {
    const chips = mockQuerySelectorAll(null, '.lola-chip');
    chips.forEach(c => c.click());
  });

  // 20. PIN Management
  test('PIN setup and lock screen', () => {
    if (typeof window.lockDiary === 'function') window.lockDiary();
    if (typeof window.unlockDiary === 'function') window.unlockDiary();
    if (typeof window.changePinPrompt === 'function') window.changePinPrompt();
  });

  console.log(`\nDetailed test suite finished. Total errors: ${errors.length}`);
  if (errors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}, 100);
