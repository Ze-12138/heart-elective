/* 五子棋小游戏：玩家执黑，奶龙酱执白。
   作为独立模块挂到 window.LoveGomoku，供 game.js 调用。 */
(function () {
  "use strict";

  const SIZE = 15;
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;
  const WIN = 5;

  const state = {
    board: [],
    turn: BLACK,
    over: false,
    last: null,
    onFinish: null,
    thinking: false,
    moves: 0,
  };

  let overlay = null;
  let canvas = null;
  let ctx = null;
  let statusEl = null;
  let tipEl = null;

  const LINES = {
    win: ["这局我输了……不过输得挺开心。", "你下得好快，我都没想清楚。"],
    lose: ["嘿，我赢啦。下次让你先走三手？", "这局我运气好一点点。"],
    draw: ["平局诶，很少见。", "棋盘满了，我们好像都挺谨慎。"],
  };

  // ---------- 规则 ----------

  function reset() {
    state.board = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
    state.turn = BLACK;
    state.over = false;
    state.last = null;
    state.thinking = false;
    state.moves = 0;
  }

  function inBounds(x, y) {
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
  }

  function countDir(x, y, dx, dy, color) {
    let n = 0;
    let cx = x + dx;
    let cy = y + dy;
    while (inBounds(cx, cy) && state.board[cy][cx] === color) {
      n += 1;
      cx += dx;
      cy += dy;
    }
    return n;
  }

  function isWin(x, y, color) {
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    return dirs.some(([dx, dy]) =>
      countDir(x, y, dx, dy, color) + countDir(x, y, -dx, -dy, color) + 1 >= WIN);
  }

  function isFull() {
    return state.board.every((row) => row.every((cell) => cell !== EMPTY));
  }

  // ---------- AI ----------

  function lineScore(x, y, color) {
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    let total = 0;
    for (const [dx, dy] of dirs) {
      const a = countDir(x, y, dx, dy, color);
      const b = countDir(x, y, -dx, -dy, color);
      const run = a + b + 1;
      const openA = inBounds(x + (a + 1) * dx, y + (a + 1) * dy) &&
        state.board[y + (a + 1) * dy][x + (a + 1) * dx] === EMPTY;
      const openB = inBounds(x - (b + 1) * dx, y - (b + 1) * dy) &&
        state.board[y - (b + 1) * dy][x - (b + 1) * dx] === EMPTY;
      const open = (openA ? 1 : 0) + (openB ? 1 : 0);
      if (run >= 5) total += 1000000;
      else if (run === 4 && open >= 1) total += 120000;
      else if (run === 4) total += 12000;
      else if (run === 3 && open === 2) total += 9000;
      else if (run === 3 && open === 1) total += 900;
      else if (run === 2 && open === 2) total += 260;
      else if (run === 2 && open === 1) total += 40;
      else if (run === 1 && open === 2) total += 12;
    }
    return total;
  }

  function candidates() {
    const out = [];
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        if (state.board[y][x] !== EMPTY) continue;
        let near = false;
        for (let dy = -2; dy <= 2 && !near; dy += 1) {
          for (let dx = -2; dx <= 2; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (inBounds(nx, ny) && state.board[ny][nx] !== EMPTY) {
              near = true;
              break;
            }
          }
        }
        if (near) out.push([x, y]);
      }
    }
    return out;
  }

  function aiMove() {
    if (state.moves === 0) return [7, 7];
    const cells = candidates();
    if (!cells.length) return null;

    let best = null;
    const scored = cells.map(([x, y]) => {
      const attack = lineScore(x, y, WHITE);
      const defend = lineScore(x, y, BLACK);
      const center = 12 - (Math.abs(x - 7) + Math.abs(y - 7));
      const score = attack * 1.06 + defend + center * 2 + Math.random() * 6;
      return { x, y, score, attack, defend };
    });
    scored.sort((a, b) => b.score - a.score);

    // 能立刻赢就赢
    const winNow = scored.find((c) => c.attack >= 1000000);
    if (winNow) return [winNow.x, winNow.y];
    // 对手下一步能赢就堵
    const mustBlock = scored.find((c) => c.defend >= 1000000);
    if (mustBlock) return [mustBlock.x, mustBlock.y];

    const top = scored.slice(0, 3);
    best = top[Math.floor(Math.random() * top.length)];
    return [best.x, best.y];
  }

  // ---------- 绘制 ----------

  function resize() {
    if (!canvas) return;
    const size = Math.min(520, Math.round(Math.min(window.innerWidth * 0.86, window.innerHeight * 0.62)));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx._size = size;
    paperCanvas = null;
    draw();
  }

  // 固定种子随机数：每次重绘纹理一致
  function rng(seed) {
    let t = seed + 0x6d2b79f5;
    return function next() {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const INK = [74, 61, 53];

  function ink(alpha) {
    return `rgba(${INK[0]}, ${INK[1]}, ${INK[2]}, ${alpha})`;
  }

  // 铅笔/蜡笔线：第一遍清晰实线，追加的遍数才做断续与淡描
  function crayonLine(c2, pts, color, width, seed, passes) {
    const r = rng(seed);
    const total = passes || 1;
    for (let pass = 0; pass < total; pass += 1) {
      c2.beginPath();
      pts.forEach((pt, i) => {
        const amp = pass === 0 ? width * 0.28 : width * 0.8;
        const x = pt[0] + (r() - 0.5) * amp;
        const y = pt[1] + (r() - 0.5) * amp;
        if (i === 0) c2.moveTo(x, y);
        else c2.lineTo(x, y);
      });
      c2.strokeStyle = color;
      if (pass === 0) {
        c2.lineWidth = width;
        c2.globalAlpha = 1;
        c2.setLineDash([]);
      } else {
        c2.lineWidth = Math.max(0.5, width * 0.55);
        c2.globalAlpha = 0.32;
        c2.setLineDash([width * (3 + r() * 6), width * (0.2 + r() * 0.8)]);
        c2.lineDashOffset = r() * width * 5;
      }
      c2.stroke();
    }
    c2.setLineDash([]);
    c2.globalAlpha = 1;
  }

  function linePts(x1, y1, x2, y2, seed, ampOverride) {
    const r = rng(seed);
    const steps = 10;
    const pts = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const amp = ampOverride !== undefined ? ampOverride : 1.1;
      pts.push([
        x1 + (x2 - x1) * t + (r() - 0.5) * amp,
        y1 + (y2 - y1) * t + (r() - 0.5) * amp,
      ]);
    }
    return pts;
  }

  function circlePts(cx, cy, r, seed, amp) {
    const rand = rng(seed);
    const steps = 30;
    const pts = [];
    for (let i = 0; i < steps; i += 1) {
      const a = (i / steps) * Math.PI * 2;
      const rr = r + (rand() - 0.5) * amp;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    pts.push(pts[0]);
    return pts;
  }

  function hatch(c2, cx, cy, r, color, seed, count) {
    const rand = rng(seed);
    for (let i = 0; i < count; i += 1) {
      const a = rand() * Math.PI * 2;
      const len = r * (0.45 + rand() * 0.5);
      const x1 = cx + Math.cos(a) * (r * 0.1);
      const y1 = cy + Math.sin(a) * (r * 0.1);
      const x2 = cx + Math.cos(a) * len;
      const y2 = cy + Math.sin(a) * len;
      c2.beginPath();
      c2.moveTo(x1, y1);
      c2.lineTo(x2, y2);
      c2.strokeStyle = color;
      c2.lineWidth = Math.max(0.6, r * 0.075);
      c2.globalAlpha = 0.16 + rand() * 0.12;
      c2.stroke();
    }
    c2.globalAlpha = 1;
  }

  let paperCanvas = null;

  function buildPaper(size) {
    const dpr = window.devicePixelRatio || 1;
    const off = document.createElement("canvas");
    off.width = Math.round(size * dpr);
    off.height = Math.round(size * dpr);
    const c2 = off.getContext("2d");
    if (!c2) return null;
    c2.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = size * 0.055;
    const gap = (size - pad * 2) / (SIZE - 1);

    // 纸：暖米色 + 斜向明暗
    const paper = c2.createLinearGradient(0, 0, size, size);
    paper.addColorStop(0, "#fdfcf9");
    paper.addColorStop(0.55, "#f7f4ec");
    paper.addColorStop(1, "#efeee8");
    c2.fillStyle = paper;
    c2.fillRect(0, 0, size, size);

    // 纸纹：颗粒 + 细纤维
    const grain = rng(90210);
    c2.fillStyle = "rgba(120, 124, 140, .05)";
    for (let i = 0; i < 2200; i += 1) {
      const gx = grain() * size;
      const gy = grain() * size;
      const gr = 0.4 + grain() * 1.2;
      c2.beginPath();
      c2.arc(gx, gy, gr, 0, Math.PI * 2);
      c2.fill();
    }
    c2.strokeStyle = "rgba(130, 134, 150, .06)";
    c2.lineWidth = 0.6;
    for (let i = 0; i < 90; i += 1) {
      const gx = grain() * size;
      const gy = grain() * size;
      const len = 6 + grain() * 22;
      const ang = (grain() - 0.5) * 0.5;
      c2.beginPath();
      c2.moveTo(gx, gy);
      c2.lineTo(gx + Math.cos(ang) * len, gy + Math.sin(ang) * len);
      c2.stroke();
    }

    // 网格：铅笔线
    c2.lineCap = "round";
    c2.lineJoin = "round";
    for (let i = 0; i < SIZE; i += 1) {
      const p = pad + i * gap;
      crayonLine(c2, linePts(pad, p, size - pad, p, 1000 + i, 0.6), "rgba(108, 112, 128, .72)", Math.max(1.1, gap * 0.045), 4000 + i, 1);
      crayonLine(c2, linePts(p, pad, p, size - pad, 2000 + i, 0.6), "rgba(108, 112, 128, .72)", Math.max(1.1, gap * 0.045), 5000 + i, 1);
    }

    // 外框：直线（不加抖动），深墨色
    const frameW = Math.max(2, gap * 0.085);
    c2.strokeStyle = ink(0.95);
    c2.lineWidth = frameW;
    c2.lineCap = "square";
    c2.setLineDash([]);
    c2.beginPath();
    c2.rect(pad - frameW * 0.5, pad - frameW * 0.5, size - pad * 2 + frameW, size - pad * 2 + frameW);
    c2.stroke();
    c2.lineCap = "round";

    // 星位：蜡笔点
    const star = rng(555);
    c2.fillStyle = "rgba(108, 112, 128, .8)";
    for (const [gx, gy] of [[3, 3], [11, 3], [3, 11], [11, 11], [7, 7]]) {
      const cx = pad + gx * gap;
      const cy = pad + gy * gap;
      const rr = Math.max(2, gap * 0.11);
      for (let k = 0; k < 3; k += 1) {
        c2.beginPath();
        c2.arc(cx + (star() - 0.5) * 1.6, cy + (star() - 0.5) * 1.6, rr * (0.7 + star() * 0.5), 0, Math.PI * 2);
        c2.fill();
      }
    }

    return { canvas: off, size, pad, gap };
  }

  function draw() {
    if (!ctx) return;
    const size = ctx._size || 480;
    if (!paperCanvas || paperCanvas.size !== size) {
      paperCanvas = buildPaper(size);
    }
    if (!paperCanvas) return;
    const { pad, gap } = paperCanvas;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(paperCanvas.canvas, 0, 0, size, size);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 棋子：蜡笔涂色 + 排线阴影 + 手绘轮廓
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        const cell = state.board[y][x];
        if (cell === EMPTY) continue;
        const cx = pad + x * gap;
        const cy = pad + y * gap;
        const r = gap * 0.43;
        const seed = 3000 + y * 31 + x;

        const base = cell === BLACK ? "rgba(48, 48, 56, .96)" : "rgba(255, 253, 249, .98)";
        const shade = cell === BLACK ? "rgba(12, 10, 9, .55)" : "rgba(150, 132, 106, .4)";

        const outline = circlePts(cx, cy, r, seed, Math.max(0.5, r * 0.06));
        ctx.beginPath();
        outline.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])));
        ctx.closePath();
        ctx.fillStyle = base;
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.globalAlpha = 1;

        hatch(ctx, cx, cy, r, shade, seed + 11, cell === BLACK ? 9 : 6);

        crayonLine(ctx, outline, cell === BLACK ? ink(0.92) : "rgba(116, 98, 76, .88)", Math.max(1.3, r * 0.13), seed + 5, 1);

        // 小高光
        ctx.beginPath();
        ctx.arc(cx - r * 0.34, cy - r * 0.38, r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = cell === BLACK ? "rgba(120, 114, 108, .5)" : "rgba(255, 255, 255, .9)";
        ctx.fill();
      }
    }

    // 最后一手：橙色彩笔圈
    if (state.last) {
      const [lx, ly] = state.last;
      const ring = circlePts(pad + lx * gap, pad + ly * gap, gap * 0.55, 7777, gap * 0.05);
      crayonLine(ctx, ring, "rgba(232, 122, 92, .95)", Math.max(1.8, gap * 0.1), 8888, 1);
    }
  }

  // ---------- 交互 ----------

  function updateStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function pickTip(kind) {
    const pool = LINES[kind] || LINES.draw;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function finish(result) {
    state.over = true;
    if (tipEl) {
      tipEl.textContent = result === "win" ? pickTip("win") : result === "lose" ? pickTip("lose") : pickTip("draw");
      tipEl.classList.add("is-on");
    }
    updateStatus(result === "win" ? "你赢了" : result === "lose" ? "奶龙酱赢了" : "平局");
    if (typeof state.onFinish === "function") {
      setTimeout(() => state.onFinish(result), 900);
    }
  }

  function place(x, y, color) {
    state.board[y][x] = color;
    state.moves += 1;
    state.last = [x, y];
    draw();
    if (isWin(x, y, color)) {
      finish(color === BLACK ? "win" : "lose");
      return true;
    }
    if (isFull()) {
      finish("draw");
      return true;
    }
    return false;
  }

  function chooseOption() {
    // 占位，保持接口统一
  }

  function onCanvasClick(event) {
    if (!canvas || state.over || state.thinking) return;
    if (state.turn !== BLACK) return;
    const rect = canvas.getBoundingClientRect();
    const size = ctx._size || rect.width;
    const pad = size * 0.045;
    const gap = (size - pad * 2) / (SIZE - 1);
    const x = Math.round(((event.clientX - rect.left) * (size / rect.width) - pad) / gap);
    const y = Math.round(((event.clientY - rect.top) * (size / rect.height) - pad) / gap);
    if (!inBounds(x, y) || state.board[y][x] !== EMPTY) return;

    if (place(x, y, BLACK)) return;

    state.turn = WHITE;
    state.thinking = true;
    updateStatus("奶龙酱在想……");
    setTimeout(() => {
      const move = aiMove();
      state.thinking = false;
      if (!move) {
        finish("draw");
        return;
      }
      const done = place(move[0], move[1], WHITE);
      state.turn = BLACK;
      if (!done) updateStatus("轮到你落子");
    }, 420 + Math.random() * 320);
  }

  function buildOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "minigame-layer hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "minigame-card";

    const head = document.createElement("div");
    head.className = "minigame-head";
    const title = document.createElement("h2");
    title.textContent = "五子棋";
    const close = document.createElement("button");
    close.className = "minigame-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "退出");
    close.addEventListener("click", () => closeGame(true));
    head.append(title, close);

    const meta = document.createElement("p");
    meta.className = "minigame-sub";
    meta.textContent = "你执黑先行，奶龙酱执白。五子连珠即胜。";

    statusEl = document.createElement("p");
    statusEl.className = "minigame-status";
    statusEl.textContent = "轮到你落子";

    canvas = document.createElement("canvas");
    canvas.className = "minigame-board";
    canvas.addEventListener("click", onCanvasClick);
    ctx = canvas.getContext("2d");

    tipEl = document.createElement("p");
    tipEl.className = "minigame-tip";

    const actions = document.createElement("div");
    actions.className = "minigame-actions";
    const again = document.createElement("button");
    again.type = "button";
    again.textContent = "再来一局";
    again.addEventListener("click", () => {
      reset();
      if (tipEl) {
        tipEl.classList.remove("is-on");
        tipEl.textContent = "";
      }
      updateStatus("轮到你落子");
      draw();
    });
    const leave = document.createElement("button");
    leave.type = "button";
    leave.textContent = "先不玩了";
    leave.addEventListener("click", () => closeGame(true));
    actions.append(again, leave);

    card.append(head, meta, statusEl, canvas, tipEl, actions);
    overlay.append(card);
    document.body.append(overlay);
    return overlay;
  }

  function closeGame(cancelled) {
    if (!overlay) return;
    overlay.classList.add("hidden");
    const cb = state.onFinish;
    if (cancelled && typeof cb === "function") {
      cb("quit");
    }
  }

  function open(options) {
    buildOverlay();
    reset();
    state.onFinish = options && options.onFinish ? options.onFinish : null;
    if (tipEl) {
      tipEl.classList.remove("is-on");
      tipEl.textContent = "";
    }
    updateStatus("轮到你落子");
    overlay.classList.remove("hidden");
    resize();
  }

  window.LoveGomoku = {
    open,
    close: closeGame,
    // 供自动化测试使用（不参与游戏流程）
    _test: { state, reset, place, isWin, aiMove, setFinish: (fn) => { state.onFinish = fn; } },
  };
  window.addEventListener("resize", () => {
    if (overlay && !overlay.classList.contains("hidden")) resize();
  });
})();
