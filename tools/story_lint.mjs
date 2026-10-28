/**
 * 剧情校验器：检查 story.js 的死链、断头、不可达场景、线索引用、结局覆盖、分数边界。
 * 用法：node tools/story_lint.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");
const STORY = path.join(ROOT, "game", "story.js");
const GAME = path.join(ROOT, "game", "game.js");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(STORY, "utf8"), sandbox);
const story = sandbox.window.LOVE_STORY;

if (!story || !story.scenes) {
  console.error("无法读取 story.scenes");
  process.exit(1);
}

const problems = [];
const warnings = [];
const scenes = story.scenes;
const ids = Object.keys(scenes);
const endings = Array.isArray(story.endings) ? story.endings : [];

// 线索 ID：从 game.js 的 HOTSPOTS 里提取
const clueIds = new Set();
const gameSrc = fs.readFileSync(GAME, "utf8");
for (const m of gameSrc.matchAll(/clue:\s*"([a-z_]+)"/g)) clueIds.add(m[1]);

// 1) next 死链
for (const id of ids) {
  for (const opt of scenes[id].options || []) {
    if (opt.next && !scenes[opt.next]) problems.push(`[死链] ${id} → ${opt.next}（场景不存在）`);
  }
  if (scenes[id].next && !scenes[scenes[id].next]) problems.push(`[死链] ${id} → ${scenes[id].next}（场景不存在）`);
}

// 2) 断头 / 冗余
for (const id of ids) {
  const scene = scenes[id];
  const hasOptions = (scene.options || []).length > 0;
  const hasNext = Boolean(scene.next);
  if (!hasOptions && !hasNext) problems.push(`[断头] ${id}：没有选项也没有 next`);
  if (hasOptions && hasNext) warnings.push(`[冗余] ${id}：同时有 options 和 next，next 不会被使用`);
}

// 3) requires 引用
for (const id of ids) {
  for (const opt of scenes[id].options || []) {
    for (const clue of opt.requires || []) {
      if (!clueIds.has(clue)) problems.push(`[线索] ${id} 的 requires 引用了未知线索 "${clue}"`);
    }
  }
}

// 4) 不可达场景
const start = story.start;
const reachable = new Set();
const queue = [start];
while (queue.length) {
  const id = queue.shift();
  if (!id || reachable.has(id) || !scenes[id]) continue;
  reachable.add(id);
  const scene = scenes[id];
  if (scene.next) queue.push(scene.next);
  for (const opt of scene.options || []) if (opt.next) queue.push(opt.next);
}
for (const id of ids) {
  if (!reachable.has(id)) problems.push(`[不可达] ${id}：从 ${start} 走不到`);
}

// 5) 分数边界
const min = story.meta?.minScore ?? 0;
const max = story.meta?.maxScore ?? 100;
const startScore = story.meta?.startScore ?? 50;
let worst = 0;
let best = 0;
for (const id of ids) {
  for (const opt of scenes[id].options || []) {
    const d = Number(opt.delta) || 0;
    if (d < 0) worst += d;
    if (d > 0) best += d;
  }
}
if (best > max) warnings.push(`[分数] 理论最高分 ${startScore + best} 超过上限 ${max}（运行时会被夹住）`);
if (startScore + worst < min) warnings.push(`[分数] 理论最低分 ${startScore + worst} 低于下限 ${min}（运行时会被夹住）`);

// 6) 选择数统计
const choiceCount = ids.reduce((n, id) => n + ((scenes[id].options || []).length ? 1 : 0), 0);
if (story.meta?.totalChoices && choiceCount !== story.meta.totalChoices) {
  warnings.push(`[元数据] meta.totalChoices=${story.meta.totalChoices}，实际有选项的场景 ${choiceCount} 个`);
}

// 7) 结局覆盖（结局是分数区间 + flag，不指向场景）
if (!endings.length) {
  problems.push("[结局] 没有定义任何结局");
} else {
  const ranges = endings
    .map((e) => ({ id: e.id, lo: e.minScore ?? 0, hi: e.maxScore ?? 100, flag: e.requiresFlag }))
    .sort((a, b) => a.lo - b.lo);
  let cursor = min;
  for (const r of ranges) {
    if (r.lo > cursor) warnings.push(`[结局] 分数 ${cursor}–${r.lo} 没有对应结局`);
    if (r.lo < cursor && !r.flag) warnings.push(`[结局] ${r.id} 与上一个结局的分数区间重叠（且没有 flag 区分）`);
    cursor = Math.max(cursor, r.hi);
  }
  if (cursor < max) warnings.push(`[结局] 分数 ${cursor}–${max} 没有对应结局`);

  // flag 是否真的会被设置
  const flagSrc = fs.readFileSync(STORY, "utf8") + fs.readFileSync(GAME, "utf8");
  for (const r of ranges) {
    if (!r.flag) continue;
    const used = new RegExp(`${r.flag}\\b`).test(flagSrc);
    if (!used) warnings.push(`[结局] ${r.id} 需要 flag "${r.flag}"，但剧情/代码里没有地方设置它`);
  }
}

// 8) 内容完整性
const MOODS = new Set(["normal", "smile", "shy", "sad", "surprised"]);
for (const id of ids) {
  const scene = scenes[id];
  if (!Array.isArray(scene.lines) || scene.lines.length === 0) {
    problems.push(`[内容] ${id}：没有 lines`);
  } else {
    scene.lines.forEach((line, i) => {
      if (!line || !String(line.text || "").trim()) problems.push(`[内容] ${id} 第 ${i + 1} 句没有文本`);
      if (line && line.mood && !MOODS.has(line.mood)) problems.push(`[表情] ${id} 第 ${i + 1} 句 mood=${line.mood} 未定义`);
    });
  }
  for (const [i, option] of (scene.options || []).entries()) {
    if (!String(option.text || "").trim()) problems.push(`[内容] ${id} 选项 ${i + 1} 没有文本`);
    if (!option.next && !option.game) problems.push(`[内容] ${id} 选项 ${i + 1} 既没有 next 也没有 game`);
    if (option.mood && !MOODS.has(option.mood)) problems.push(`[表情] ${id} 选项 ${i + 1} mood=${option.mood} 未定义`);
    for (const line of option.reaction || []) {
      if (line && line.mood && !MOODS.has(line.mood)) problems.push(`[表情] ${id} 选项 ${i + 1} 反应行 mood=${line.mood} 未定义`);
    }
  }
  if (!scene.narration) warnings.push(`[内容] ${id}：缺少 narration（时间地点标题）`);
}

console.log(`场景 ${ids.length} 个，可达 ${reachable.size} 个，选项场景 ${choiceCount} 个，线索 ${clueIds.size} 条，结局 ${endings.length} 个`);
if (warnings.length) {
  console.log(`\n警告 ${warnings.length} 条：`);
  warnings.forEach((w) => console.log("  " + w));
}
if (problems.length) {
  console.log(`\n问题 ${problems.length} 条：`);
  problems.forEach((p) => console.log("  " + p));
  process.exit(1);
}
console.log("\n检查通过：没有死链、断头、不可达场景或非法线索引用");
