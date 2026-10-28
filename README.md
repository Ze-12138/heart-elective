# 心动选修课

[![Deploy](https://github.com/ZE875/heart-elective/actions/workflows/pages.yml/badge.svg)](https://github.com/ZE875/heart-elective/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一个校园恋爱向的 H5 文字游戏：手绘漫画风场景、双模式对话（对白 / 聊天）、好感度与细节线索、可拖动窗帘、可对弈的五子棋小游戏。

**在线试玩**：https://ze875.github.io/heart-elective/

---

## 目录结构

```
心动选修课/
├─ game/                 游戏本体（纯静态，双击 index.html 即可玩）
│  ├─ index.html
│  ├─ game.js            主逻辑：对话、选项、打分、存档、热点、窗帘、小游戏入口
│  ├─ story.js           剧情数据（章节、场景、选项、结局）
│  ├─ minigame.js        五子棋小游戏（独立模块）
│  ├─ style.css
│  ├─ backgrounds/       17 张场景 SVG（兜底/矢量版）
│  ├─ backgrounds-painted/  手绘场景 JPG（含夜聊、关灯版、窗帘分层）
│  ├─ characters/        立绘（站立 10 张 + 坐姿 5 张 + 窗帘素材）
│  └─ assets/            其他素材
├─ tools/                美术与测试工具链（Python / Node）
├─ docs/                 开发计划等文档
└─ 启动游戏.bat          双击直接打开游戏
```

## 怎么玩

**方式一（最简单）**：双击 `启动游戏.bat`，或直接双击 `game/index.html`。
游戏是纯静态的，不需要服务器。

**方式二（本地服务器，推荐调试用）**：

```bash
python tools/serve_love.py 8765
# 浏览器打开 http://127.0.0.1:8765/
```

管理面板：在游戏页面按 **Ctrl + Shift + A**（或访问 `?admin=1`）。

## 操作

| 操作 | 说明 |
|---|---|
| 点击画面 / 空格 | 推进对话 |
| 数字键 1-4 | 选择选项 |
| 鼠标左右移动 | 场景视差（轻微倾斜） |
| 点击房间物件 | 台灯开关、手机发光、兔子/吉他等触发观察线索 |
| 拖动窗帘 | 拉开 / 合上（随开度改变房间明暗） |
| 右上角「细节」 | 查看已发现的线索 |
| 右上角「一起玩」 | 和奶龙酱下一盘五子棋 |

## 工具链

| 脚本 | 用途 |
|---|---|
| `tools/seedream_image.py` | 单张生图（豆包 Seedream，支持参考图） |
| `tools/batch_art.py` | 批量生图（读 JSON 任务表） |
| `tools/cutout.py` | 白底抠图 → 透明 WebP |
| `tools/serve_love.py` | 本地静态服务器 |
| `tools/dom_smoke.mjs` | 用最小 DOM 桩跑一遍初始化，抓运行时异常 |
| `tools/minigame_test.mjs` | 五子棋逻辑 + 渲染冒烟测试 |

生图需要环境变量 `VOLCARK_API_KEY`（或 `~/.dsh/.credentials.yaml`）。

## 当前进度

见 `docs/校园恋爱线开发计划.md`：现有 5 章 / 21 场 / 16 个选择，计划扩展为 8 章 / 60+ 场 / 4 个结局。

## 备注

- 场景与立绘为 AI 生成 + 人工逐张验收，风格统一为「低饱和、细墨线、平涂手绘」
- 剧情、美术、音乐均为原创占位内容，可自由替换
