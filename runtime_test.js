const fs = require('fs');

// Create a mock browser DOM environment
const html = fs.readFileSync('index.html', 'utf8');

// Simple minimal DOM mock
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(...cls) { cls.forEach(c => this.classes.add(c)); }
  remove(...cls) { cls.forEach(c => this.classes.delete(c)); }
  toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
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

// Parse HTML elements into mock DOM
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
  
  // Extract data attributes
  const dataRegex = /data-([a-zA-Z0-9_-]+)=["']([^"']+)["']/g;
  let dm;
  while ((dm = dataRegex.exec(attrsStr)) !== null) {
    const key = dm[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    el.dataset[key] = dm[2];
  }

  // Extract type
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
  // Support comma separated
  const parts = sel.split(',').map(s => s.trim());
  const found = new Set();
  parts.forEach(part => {
    if (part.startsWith('#')) {
      const el = elementMap.get(part.slice(1));
      if (el) found.add(el);
    } else if (part.startsWith('.')) {
      const cls = part.slice(1);
      allElements.forEach(el => {
        if (el.classList.contains(cls)) found.add(el);
      });
    } else {
      allElements.forEach(el => {
        if (el.tagName.toLowerCase() === part.toLowerCase()) found.add(el);
      });
    }
  });
  return Array.from(found);
}

// Global environment
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

console.log('Testing script.js loading...');
try {
  const jsContent = fs.readFileSync('script.js', 'utf8');
  eval(jsContent);
  console.log('script.js evaluated successfully without syntax or immediate errors!');
} catch (e) {
  console.error('Error during script.js evaluation:', e);
  process.exit(1);
}

// Now test calling major functions
setTimeout(() => {
  try {
    console.log('Testing page navigation...');
    const pages = ['home', 'diary', 'games', 'growth', 'library', 'modest', 'music', 'lola'];
    pages.forEach(p => {
      if (typeof window.showPage === 'function') window.showPage(p);
    });
    console.log('Page navigation OK!');

    console.log('Testing games activation...');
    const games = ['dressup', 'makeup', 'room', 'pomodoro', 'sweet2048', 'catchstars', 'memory', 'popit', 'magicorb', 'quiz'];
    games.forEach(g => {
      if (typeof window.openGame === 'function') window.openGame(g);
    });
    console.log('Games activation OK!');

    console.log('Testing Pomodoro controls...');
    const startBtn = elementMap.get('pomodoroStartBtn');
    if (startBtn) startBtn.click();
    const breakBtn = elementMap.get('pomodoroBreakBtn');
    if (breakBtn) breakBtn.click();
    const resetBtn = elementMap.get('pomodoroResetBtn');
    if (resetBtn) resetBtn.click();
    console.log('Pomodoro OK!');

    console.log('Testing PIN pad entry...');
    for (let i = 1; i <= 4; i++) {
      if (typeof window.pressPinDigit === 'function') window.pressPinDigit(String(i));
    }
    console.log('PIN pad OK!');

    console.log('Testing Lola mentor interaction...');
    const lolaInput = elementMap.get('lolaInput');
    const lolaSendBtn = elementMap.get('lolaSendBtn');
    if (lolaInput && lolaSendBtn) {
      lolaInput.value = 'salom';
      lolaSendBtn.click();
    }
    console.log('Lola interaction OK!');

    console.log('All tests executed with zero runtime exceptions!');
    process.exit(0);
  } catch (err) {
    console.error('Runtime error in simulated execution:', err);
    process.exit(1);
  }
}, 50);
