/**
 * 用最小 DOM 桩跑一遍 game.js 的初始化，抓运行时异常。
 * node tools/dom_smoke.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.join(import.meta.dirname, "..", "game");

function makeClassList() {
  const set = new Set();
  return {
    add: (...c) => c.forEach((x) => set.add(x)),
    remove: (...c) => c.forEach((x) => set.delete(x)),
    toggle: (c, force) => (force === undefined ? (set.has(c) ? set.delete(c) : set.add(c)) : force ? set.add(c) : set.delete(c)),
    contains: (c) => set.has(c),
    get value() {
      return [...set].join(" ");
    },
    [Symbol.iterator]: () => set.values(),
  };
}

function makeEl(id = "") {
  const el = {
    id,
    dataset: {},
    style: { setProperty() {}, removeProperty() {} },
    classList: makeClassList(),
    children: [],
    value: "",
    textContent: "",
    innerHTML: "",
    offsetWidth: 0,
    offsetHeight: 0,
    src: "",
    addEventListener() {},
    removeEventListener() {},
    append(...nodes) {
      this.children.push(...nodes);
    },
    appendChild(node) {
      this.children.push(node);
      return node;
    },
    replaceChildren(...nodes) {
      this.children = [...nodes];
    },
    remove() {},
    querySelector() {
      return makeEl();
    },
    querySelectorAll() {
      return [];
    },
    getAttribute() {
      return null;
    },
    setAttribute() {},
    focus() {},
    closest() {
      return null;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: 1600, height: 1000, bottom: 1000, right: 1600 };
    },
    animate() {
      return { finished: Promise.resolve(), cancel() {} };
    },
  };
  return el;
}

const registry = new Map();
const document = {
  body: makeEl("body"),
  documentElement: makeEl("html"),
  getElementById(id) {
    if (!registry.has(id)) registry.set(id, makeEl(id));
    return registry.get(id);
  },
  createElement(tag) {
    const el = makeEl();
    el.tagName = tag.toUpperCase();
    return el;
  },
  createElementNS(ns, tag) {
    return this.createElement(tag);
  },
  querySelector() {
    return makeEl();
  },
  querySelectorAll() {
    return [];
  },
  addEventListener() {},
  fonts: { ready: Promise.resolve() },
};

const windowObj = {
  document,
  location: { search: process.argv[2] || "", href: "http://localhost/", hash: "" },
  localStorage: {
    _v: {},
    getItem(k) {
      return this._v[k] ?? null;
    },
    setItem(k, v) {
      this._v[k] = String(v);
    },
    removeItem(k) {
      delete this._v[k];
    },
  },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  addEventListener() {},
  removeEventListener() {},
  innerWidth: 1600,
  innerHeight: 1000,
  devicePixelRatio: 1,
  Image: class {
    constructor() {
      this.src = "";
    }
    addEventListener() {}
  },
  URLSearchParams,
  console,
};

const context = vm.createContext({
  ...windowObj,
  window: windowObj,
  globalThis: windowObj,
  console,
  URLSearchParams,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Promise,
  Math,
  Date,
  JSON,
  parseInt,
  parseFloat,
  isNaN,
  Object,
  Array,
  Set,
  Map,
  String,
  Number,
  Boolean,
  Error,
  Intl,
  RegExp,
});

const storyCode = fs.readFileSync(path.join(ROOT, "story.js"), "utf8");
vm.runInContext(storyCode, context, { filename: "story.js" });

try {
  const gameCode = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
  vm.runInContext(gameCode, context, { filename: "game.js" });
  console.log("INIT OK —— 初始化没有抛异常");
} catch (error) {
  console.log("INIT FAILED:", error && error.message);
  console.log((error && error.stack || "").split("\n").slice(0, 8).join("\n"));
  process.exitCode = 1;
}
