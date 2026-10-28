/** 五子棋逻辑自测：用最小 DOM 桩加载 minigame.js，验证胜负判定与 AI 防守。 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.join(import.meta.dirname, "..", "game");

function el() {
  const node = {
    style: { setProperty() {}, getPropertyValue: () => "", removeProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    dataset: {},
    children: [],
    append(...kids) { node.children.push(...kids); },
    appendChild(kid) { node.children.push(kid); },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    remove() {},
    focus() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 480, height: 480 }),
    getContext: () => ctx2d,
    width: 480,
    height: 480,
    textContent: "",
    className: "",
    innerHTML: "",
  };
  return node;
}

const ctx2d = {
  setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {},
  stroke() {}, fill() {}, arc() {}, closePath() {}, drawImage() {}, rect() {},
  setLineDash() {}, createLinearGradient: () => ({ addColorStop() {} }),
  createRadialGradient: () => ({ addColorStop() {} }),
  save() {}, restore() {}, translate() {}, scale() {},
  globalAlpha: 1, lineWidth: 1, lineDashOffset: 0,
  _size: 480,
};

const documentStub = {
  body: el(),
  documentElement: el(),
  createElement: () => el(),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener() {},
};

const timers = [];
const windowStub = {
  document: documentStub,
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 800,
  addEventListener() {},
  setTimeout: (fn, ms) => { timers.push(fn); return timers.length; },
  clearTimeout() {},
  requestAnimationFrame: (fn) => { timers.push(fn); return timers.length; },
  matchMedia: () => ({ matches: false }),
};

const sandbox = {
  window: windowStub,
  document: documentStub,
  Math,
  Date,
  JSON,
  console,
  setTimeout: windowStub.setTimeout,
  clearTimeout: windowStub.clearTimeout,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(`${ROOT}\\minigame.js`, "utf8"), sandbox);

const game = windowStub.LoveGomoku._test;
let failed = 0;
const check = (name, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
};

// 1) 横向五连判胜
game.reset();
for (let x = 0; x < 4; x += 1) game.place(x, 7, 1);
check("四连未判胜", game.state.over === false);
game.place(4, 7, 1);
check("五连判胜", game.state.over === true);

// 2) 竖向判胜
game.reset();
for (let y = 0; y < 5; y += 1) game.place(3, y, 2);
check("竖向五连判胜", game.state.over === true);

// 3) 斜向判胜
game.reset();
for (let i = 0; i < 5; i += 1) game.place(i, i, 1);
check("斜向五连判胜", game.state.over === true);

// 4) AI 会堵黑棋的四连
game.reset();
for (let x = 3; x < 7; x += 1) game.state.board[7][x] = 1;
game.state.moves = 4;
const move = game.aiMove();
const blocks = move && move[1] === 7 && (move[0] === 2 || move[0] === 7);
check(`AI 堵四连 (落子 ${move})`, Boolean(blocks));

// 5) AI 有五连机会时直接赢
game.reset();
for (let x = 3; x < 7; x += 1) game.state.board[9][x] = 2;
game.state.moves = 4;
const winMove = game.aiMove();
const wins = winMove && winMove[1] === 9 && (winMove[0] === 2 || winMove[0] === 7);
check(`AI 抓五连 (落子 ${winMove})`, Boolean(wins));

// 6) 渲染冒烟：open + 落子不能抛异常
let renderOk = true;
try {
  windowStub.LoveGomoku.open({});
  windowStub.LoveGomoku._test.reset();
  windowStub.LoveGomoku._test.place(7, 7, 1);
  windowStub.LoveGomoku._test.place(8, 8, 2);
} catch (error) {
  renderOk = false;
  console.log("渲染异常:", error.message);
}
check("渲染流程无异常", renderOk);

console.log(failed ? `\n${failed} 项失败` : "\n全部通过");
process.exit(failed ? 1 : 0);
