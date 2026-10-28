(() => {
  "use strict";

  const story = window.LOVE_STORY;
  if (!story) return;

  // ?pixel=fine|mid|coarse 实时切换场景的像素化强度，方便对比
  const params = new URLSearchParams(location.search);
  const pixelMode = params.get("pixel");
  if (pixelMode) document.body.dataset.pixel = pixelMode;

  // ?hand=soft|strong|off —— 手绘线条抖动，默认轻度
  const handMode = params.get("hand") || "soft";
  if (handMode !== "off") document.body.dataset.hand = handMode;

  // 铅笔纸纹默认开启；?texture=off 可关掉
  if (params.get("texture") !== "off") document.body.dataset.texture = "on";

  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "nailong_love_save_v2";
  const TOTAL_CHOICES = story.meta.totalChoices ||
    Object.values(story.scenes).filter((scene) => scene.step).length;
  const FACT_KEYS = Object.keys(story.facts || {});
  const MOODS = ["normal", "smile", "shy", "sad", "surprised"];
  const BACKGROUNDS = [
    "campus", "classroom", "dorm", "restaurant", "walk", "cinema",
    "street", "library", "rain", "track", "ferris", "aquarium",
    "dorm-day-girl", "dorm-night-boy", "dorm-night-girl",
    "dorm-storm-girl", "dorm-radio-night",
  ];
  const NIGHT_BACKGROUNDS = new Set([
    "ferris", "dorm-night-boy", "dorm-night-girl",
    "dorm-storm-girl", "dorm-radio-night",
  ]);
  // 这几张背景的人画在 SVG 里，用场景自带的人物，隐藏普通立绘
  const SCENE_CAST_BACKGROUNDS = new Set([
    "classroom", "cinema", "library", "restaurant",
    "walk", "street", "rain", "track", "ferris", "aquarium",
    "dorm-day-girl", "dorm-storm-girl", "campus",
    "dorm-day-girl", "dorm-night-boy", "dorm-night-girl",
    "dorm-storm-girl", "dorm-radio-night",
  ]);
  const TYPE_SPEED = 26;
  let chatStatusBase = "微信 · 在线";

  const MOMENTS = [
    { time: "昨天 23:12", text: "楼下的桂花开了。风一吹，整条路都是甜的。", art: "leaf" },
    { time: "周二 22:47", text: "今晚的《晚风信箱》念了一封写给三年后自己的信。如果是你，会写什么？", art: "radio" },
    { time: "11月9日", text: "每年冬天都要重看一遍《怦然心动》。有些台词，越长大越懂。", art: "film" },
    { time: "11月3日", text: "水族馆的水母好安静，像会呼吸的灯。", art: "jelly" },
    { time: "10月28日", text: "想坐一次摩天轮看夜景——虽然上去之后大概会后悔。", art: "ferris" },
    { time: "10月21日", text: "奶茶三分糖，芋泥加一份。点单的时候声音要很小，像在说一个秘密。", art: "drink" },
    { time: "10月16日", text: "食堂阿姨今天多看了我一眼。没办法，香菜真的要一根一根挑出来。", art: "bowl" },
    { time: "10月9日", text: "体测八百米，跑完在操场躺了很久。云走得真慢，慢得像不用赶去任何地方。", art: "cloud" },
    { time: "9月30日", text: "新书签是梧桐叶的形状。夹在借来的书里，突然有点舍不得还了。", art: "book" },
  ];
  const MOMENT_ART = {
    leaf: '<svg viewBox="0 0 120 60"><path d="M12 44 C40 34 70 26 108 16" stroke="#a9785a" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#b7c9a6" stroke="#4a3d35" stroke-width="2"><path d="M38 36 q-6 -12 6 -16 q4 10 -6 16 Z"/><path d="M60 30 q-4 -12 8 -14 q2 10 -8 14 Z"/><path d="M82 24 q-4 -12 8 -14 q2 10 -8 14 Z"/></g><circle cx="24" cy="42" r="3" fill="#e8a06f" stroke="#4a3d35" stroke-width="1.6"/><circle cx="52" cy="34" r="3" fill="#e8a06f" stroke="#4a3d35" stroke-width="1.6"/></svg>',
    radio: '<svg viewBox="0 0 120 60"><g fill="none" stroke="#a9785a" stroke-width="2.5" stroke-linecap="round"><path d="M34 46 q-10 -10 0 -20"/><path d="M24 52 q-16 -16 0 -31"/></g><rect x="48" y="22" width="44" height="30" rx="4" fill="#cfe3ef" stroke="#4a3d35" stroke-width="2.5"/><circle cx="62" cy="38" r="7" fill="#fffdf7" stroke="#4a3d35" stroke-width="2"/><path d="M84 22 L97 12" stroke="#4a3d35" stroke-width="2.4"/><path d="M80 32 h8 M80 40 h8" stroke="#4a3d35" stroke-width="2"/></svg>',
    film: '<svg viewBox="0 0 120 60"><g stroke="#4a3d35" stroke-width="2.4"><rect x="26" y="18" width="66" height="30" rx="3" fill="#fdf8ee"/><path d="M26 18 l10 -8 h66 l-10 8 M92 48 l10 -8" fill="#e8c07d"/></g><g fill="#4a3d35"><circle cx="36" cy="27" r="2"/><circle cx="36" cy="39" r="2"/><circle cx="84" cy="26" r="2"/><circle cx="84" cy="38" r="2"/></g><path d="M48 27 h26" stroke="#b06f63" stroke-width="2" stroke-linecap="round"/></svg>',
    jelly: '<svg viewBox="0 0 120 60"><g stroke="#4a3d35" stroke-width="2.4"><path d="M40 26 q20 -18 40 0 q0 10 -20 10 q-20 0 -20 -10 Z" fill="#e3d1e8"/><path d="M46 36 q-2 12 4 18 M56 36 q2 10 -2 20 M66 36 q-2 12 4 18 M76 36 q2 10 -2 20" fill="none" stroke="#b591c2"/></g><circle cx="54" cy="26" r="1.6" fill="#4a3d35"/><circle cx="66" cy="26" r="1.6" fill="#4a3d35"/></svg>',
    ferris: '<svg viewBox="0 0 120 60"><g fill="none" stroke="#4a3d35" stroke-width="2.4"><circle cx="60" cy="30" r="20" fill="#fdf8ee"/><circle cx="60" cy="30" r="8" fill="#f6efe2"/><path d="M60 10 v40 M40 30 h40 M46 16 L74 44 M74 16 L46 44"/><path d="M48 52 L60 30 L72 52"/></g><g fill="#e8a06f"><circle cx="60" cy="10" r="3"/><circle cx="80" cy="30" r="3"/><circle cx="60" cy="50" r="3"/><circle cx="40" cy="30" r="3"/></g></svg>',
    drink: '<svg viewBox="0 0 120 60"><path d="M44 18 h32 l-4 34 q-12 6 -24 0 Z" fill="#fdf8ee" stroke="#4a3d35" stroke-width="2.4"/><path d="M42 18 h36" stroke="#4a3d35" stroke-width="3" stroke-linecap="round"/><path d="M64 18 L72 6" stroke="#4a3d35" stroke-width="2.6" stroke-linecap="round"/><g fill="#b58c6e"><circle cx="52" cy="42" r="3"/><circle cx="60" cy="46" r="3"/><circle cx="68" cy="41" r="3"/></g><path d="M50 28 h20" stroke="#d9b6bd" stroke-width="3"/></svg>',
    bowl: '<svg viewBox="0 0 120 60"><path d="M30 26 h60 q-4 22 -30 22 q-26 0 -30 -22 Z" fill="#fdf8ee" stroke="#4a3d35" stroke-width="2.4"/><path d="M26 26 h68" stroke="#4a3d35" stroke-width="3" stroke-linecap="round"/><path d="M76 18 L96 8 M82 22 L102 12" stroke="#a9785a" stroke-width="2.6" stroke-linecap="round"/><path d="M38 22 q4 -9 10 -3 M50 20 q2 -8 8 -4" fill="#b7c9a6" stroke="#4a3d35" stroke-width="1.8"/><path d="M104 42 q-10 0 -10 -7" fill="none" stroke="#4a3d35" stroke-width="2"/></svg>',
    cloud: '<svg viewBox="0 0 120 60"><path d="M34 40 q-13 0 -13 -9 q0 -9 12 -9 q3 -12 15 -12 q13 0 16 12 q12 0 12 9 q0 9 -12 9 Z" fill="#e3f0f4" stroke="#4a3d35" stroke-width="2.4"/><path d="M20 50 h56" stroke="#c9d8e0" stroke-width="2.4" stroke-dasharray="5 6" stroke-linecap="round"/></svg>',
    book: '<svg viewBox="0 0 120 60"><path d="M24 38 q18 -10 36 0 q18 -10 36 0 v-18 q-18 -8 -36 0 q-18 -8 -36 0 Z" fill="#fdf8ee" stroke="#4a3d35" stroke-width="2.4" stroke-linejoin="round"/><path d="M60 20 v18" stroke="#4a3d35" stroke-width="2"/><path d="M72 12 l9 4 v15 l-9 -4 Z" fill="#e8a06f" stroke="#4a3d35" stroke-width="1.8"/></svg>',
  };

  const BOY_SVG = `<svg viewBox="0 0 302 520" role="img" aria-label="男生"><g stroke-linejoin="round" stroke-linecap="round"><path d="M14.1 240.7L21.4 258.0L29.4 274.0L38.4 287.1L47.9 296.8L56.5 304.4L63.2 311.7L67.3 320.1L69.1 329.5L68.7 339.3L67.0 349.6L64.9 360.0L64.4 370.1L66.9 378.6L73.6 385.1L83.3 389.9L92.9 393.9L98.4 397.3L97.8 399.6L91.5 400.2L82.6 399.1L73.7 397.4L66.0 396.2L59.5 396.5L54.0 398.6L49.7 402.4L46.2 407.6L43.5 413.2L41.3 419.1L40.8 425.0L43.2 430.0L49.3 433.0L58.5 432.9L69.5 429.7L81.1 424.4L93.0 417.7L104.9 409.4L115.8 400.1L124.0 390.9L127.7 384.2L127.1 381.5L124.0 382.1L120.4 383.7L117.5 383.6L115.4 380.0L114.1 372.6L113.8 361.3L114.7 347.3L117.6 332.2L123.0 318.7L131.0 308.0L140.5 299.9L149.8 293.1L157.6 287.6L164.4 284.6L171.3 284.7L179.3 287.6L187.2 291.5L193.0 295.3L196.1 298.5L198.8 302.1L204.7 307.4L216.4 315.8L232.5 326.7L249.2 338.9L262.3 351.1L270.2 362.8L273.5 373.1L273.2 378.9L269.4 377.5L262.5 368.3L253.6 355.3L244.5 343.0L236.7 335.0L231.1 331.9L228.5 333.8L229.3 340.1L233.8 350.5L241.0 364.3L249.3 381.2L256.7 400.0L262.1 418.6L264.7 433.3L264.5 440.9L262.2 439.4L258.3 430.0L253.7 417.2L248.6 407.6L243.3 407.0L238.2 415.8L233.7 430.1L229.7 444.3L225.9 455.2L222.0 462.2L217.8 467.6L210.8 473.4L196.5 477.4L168.8 469.2L126.4 431.0L72.1 352.0L12.3 242.4Z" fill="#e2e4da" stroke="#4a3d35" stroke-width="3.0"/><path d="M94.9 395.3L96.7 396.0L97.9 396.0L98.4 395.3Z" fill="#e2e4da" stroke="#4a3d35" stroke-width="3.0"/><path d="M21.1 82.6L21.0 108.5L21.8 133.3L23.9 155.4L27.3 174.3L31.6 189.9L36.2 203.9L40.8 216.8L45.1 230.2L48.9 244.9L52.0 261.0L54.5 275.6L56.5 285.3L58.3 287.9L60.9 284.9L65.6 279.5L73.2 275.1L83.5 272.9L94.9 273.3L105.8 275.8L115.1 280.1L122.4 285.0L127.6 287.9L130.2 285.7L129.6 275.6L126.8 258.4L124.0 238.1L123.2 220.4L124.8 207.9L127.7 200.2L129.7 194.1L130.2 187.4L129.5 178.8L128.8 167.6L128.1 153.7L127.4 138.0L125.1 122.8L120.8 110.8L114.0 103.3L105.3 99.8L95.8 98.9L87.0 99.6L79.3 100.8L71.9 101.5L63.7 100.1L54.2 96.9L44.0 92.3L34.0 87.5L24.6 82.6Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M24.6 107.2L25.2 109.1L25.8 109.7L26.4 108.9Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M98.4 110.7L99.2 111.7L100.1 112.4Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M42.2 117.7L44.5 119.6L45.7 119.6L45.7 117.7Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M115.9 121.2L117.6 121.3L119.5 121.2Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M63.2 131.8L65.0 131.9L66.8 131.8Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M80.8 149.3L82.8 152.5L84.6 154.4L85.5 154.2L85.3 152.3L84.3 149.3Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M31.6 152.8L43.0 155.4L53.8 157.7L62.0 159.0L65.4 159.0L61.6 157.7L50.6 155.4L35.1 152.8Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M112.4 163.4L113.4 165.0L114.0 165.6L114.2 165.1Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M94.9 180.9L96.0 185.9L96.6 186.5L96.6 182.7Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M45.7 191.5L46.1 194.3L46.7 194.9L47.4 193.2Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M52.7 191.5L53.1 197.1L53.7 197.7L54.5 193.2Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M14.1 5.3L50.0 11.9L82.0 20.9L106.1 34.0L120.7 50.9L125.6 68.6L123.2 83.2L115.9 92.2L106.3 95.6L96.1 95.3L86.6 93.2L78.4 90.2L71.7 87.2L66.9 85.0L63.4 85.1L60.4 87.6L56.3 90.7L50.0 92.7L41.7 92.2L32.8 87.4L24.6 73.0L17.9 45.3L12.3 7.0Z" fill="#928f8a" stroke="#4a3d35" stroke-width="3.0"/><path d="M101.9 268.8L92.1 286.7L84.1 305.8L78.7 326.0L75.6 345.4L74.4 361.3L74.9 371.3L77.1 374.9L80.7 372.8L85.6 366.5L91.5 355.7L98.1 340.9L104.1 322.9L107.8 303.9L107.9 285.7L105.4 268.8Z" fill="#4c82c3" stroke="#4a3d35" stroke-width="3.0"/><path d="M249.5 377.7L238.4 414.8L228.4 444.9L220.2 465.6L214.4 478.7L212.0 487.2L214.3 491.7L221.3 491.9L231.2 487.7L241.2 480.1L248.9 469.7L253.4 455.5L254.6 435.7L253.6 409.7L251.2 379.5Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M126.5 205.5L135.0 221.7L142.8 238.5L148.8 254.6L152.2 267.5L152.6 276.2L151.2 281.3L148.4 283.4L144.2 281.3L138.3 272.6L132.2 256.0L127.5 233.2L124.7 207.3Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M235.4 332.0L239.6 346.7L244.9 362.3L251.3 379.8L258.1 397.8L264.3 413.0L268.8 420.6L270.8 417.7L269.3 404.6L263.2 383.9L252.5 358.9L238.9 332.0Z" fill="#445260" stroke="#4a3d35" stroke-width="3.0"/><path d="M38.6 212.6L42.3 230.5L45.0 248.1L45.5 262.6L43.8 269.6L40.8 263.8L38.4 243.9L36.9 214.3Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M59.7 388.2L64.9 392.4L69.5 396.9L72.5 402.4L72.7 409.2L69.8 416.0L64.8 420.2L59.0 420.5L53.5 417.1L49.4 411.9L47.9 406.4L49.3 400.9L53.0 395.5L58.0 390.0Z" fill="#697074" stroke="#4a3d35" stroke-width="3.0"/><path d="M126.5 374.2L114.9 387.9L103.4 399.7L93.5 408.5L87.6 414.3L87.6 416.6L93.6 415.4L103.4 410.6L114.4 403.4L123.8 395.1L129.8 386.9L131.4 380.0L130.0 374.2Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M281.1 384.7L281.6 399.0L280.1 415.0L276.1 432.0L270.5 446.3L266.4 451.5L266.4 442.7L271.3 419.2L279.3 386.5Z" fill="#eff8fc" stroke="#4a3d35" stroke-width="3.0"/><path d="M98.4 363.6L103.4 371.4L106.3 378.5L105.8 383.8L102.2 386.5L97.5 385.6L94.4 381.2L94.3 374.1L96.6 365.4Z" fill="#527087" stroke="#4a3d35" stroke-width="3.0"/><path d="M59.7 268.8L63.4 276.3L66.0 283.6L66.8 288.8L65.3 288.9L62.1 282.2L58.0 270.5Z" fill="#5a83a8"/><path d="M196.8 286.4L204.2 295.0L210.3 301.1L212.6 301.9L208.9 296.4L200.3 286.4Z" fill="#eff8fc"/><path d="M14.1 504.2L26.3 505.8L30.8 506.8L24.9 506.7L12.3 505.9Z" fill="#020306"/><path d="M235.4 314.5L243.0 323.0L246.6 327.0L244.2 324.1L237.2 316.2Z" fill="#eff8fc"/><path d="M98.4 353.1L91.7 361.2L85.8 368.5L81.3 374.4L78.9 378.9L78.6 381.5L80.8 381.2L85.4 376.6L92.1 367.3L100.1 354.9Z" fill="#5a83a8"/><path d="M242.4 384.7L238.6 405.4L236.7 418.0L237.5 418.0L240.3 405.9L244.2 386.5Z" fill="#a6afb3"/><path d="M105.4 332.0L106.6 341.5L106.7 349.8L105.8 354.7L104.4 353.8L103.6 346.2L103.6 333.8Z" fill="#23538b"/><path d="M189.7 296.9L199.4 303.2L203.2 306.1L198.5 304.1L188.0 298.6Z" fill="#a6afb3"/><path d="M112.4 307.4L109.2 317.9L108.1 323.5L109.5 322.4L112.5 316.2L115.9 307.4Z" fill="#5a83a8"/><path d="M14.1 230.1L17.8 234.7L20.9 237.4L22.3 237.4L21.0 234.5L17.6 230.1Z" fill="#a6afb3"/><path d="M28.1 247.7L28.6 263.9L29.1 273.8L29.5 273.9L29.8 264.5L29.9 249.5Z" fill="#928f8a"/><path d="M158.1 286.4L151.4 290.5L146.8 294.0L145.5 296.3L147.9 296.2L153.1 293.2L159.9 288.1Z" fill="#928f8a"/><path d="M224.9 332.0L228.3 341.4L231.3 348.6L232.4 350.5L230.7 345.0L226.6 333.8Z" fill="#a6afb3"/><path d="M66.8 346.1L65.9 354.6L65.6 361.0L66.3 362.5L67.9 357.0L70.3 346.1Z" fill="#5a83a8"/><path d="M38.6 416.4L41.4 418.6L42.6 418.6L42.2 416.4Z" fill="#eff8fc"/><path d="M105.4 500.7L117.8 501.6L123.9 501.9L120.2 501.5L108.9 500.7Z" fill="#bec7cb"/><path d="M31.6 180.9L32.0 190.7L32.6 191.3L33.4 182.7Z" fill="#bec7cb"/><path d="M168.6 268.8L171.6 276.1L174.2 280.8L175.2 281.1L173.8 277.2L170.4 270.5Z" fill="#a6afb3"/><path d="M77.3 286.4L77.5 293.8L77.2 297.2L76.5 294.8L75.5 288.1Z" fill="#23538b"/><path d="M274.1 363.6L276.1 368.0L277.3 368.0L277.6 363.6Z" fill="#eff8fc"/><path d="M14.1 500.7L13.7 501.6L12.3 502.4Z" fill="#bec7cb"/><path d="M108.9 321.5L110.0 327.5L110.1 330.4L109.0 328.5L107.2 323.2Z" fill="#527087"/><path d="M137.0 504.2L137.8 505.8L137.2 506.4L135.3 505.9Z" fill="#020306"/><path d="M31.6 289.9L36.1 293.2L37.5 294.9L35.0 294.1L29.9 291.6Z" fill="#928f8a"/><path d="M59.7 363.6L61.5 370.4L62.4 375.7L62.0 378.3L60.7 377.3L59.3 372.6L58.0 365.4Z" fill="#728594"/><path d="M203.8 483.1L202.2 487.9L201.2 490.2L201.2 488.9L202.0 484.9Z" fill="#a6afb3"/><path d="M66.8 8.8L74.8 9.7L78.9 10.0L77.0 9.7L70.3 8.8Z" fill="#697074"/><path d="M49.2 230.1L48.8 237.1L48.2 237.7L47.4 231.9Z" fill="#728594"/><path d="M158.1 261.8L159.6 265.5L160.5 267.2L160.6 266.3L159.9 263.5Z" fill="#eff8fc"/><path d="M172.2 272.3L173.7 274.6L173.1 275.2L170.4 274.1Z" fill="#eff8fc"/><path d="M137.0 65.0L136.6 71.3L136.0 71.9L135.3 66.8Z" fill="#697074"/><path d="M133.5 89.6L132.5 94.2L132.3 96.5L133.4 95.2L135.3 91.4Z" fill="#6a665a"/><path d="M42.2 117.7L44.5 119.6L45.7 119.6L45.7 117.7Z" fill="#e2e4da"/><path d="M66.8 272.3L68.7 276.0L70.0 279.6L70.1 282.2L69.1 282.3L67.2 279.3L65.0 274.1Z" fill="#4c82c3"/><path d="M70.3 275.8L73.5 279.7L75.4 281.4L75.4 279.7L73.8 275.8Z" fill="#23538b"/><path d="M108.9 346.1L110.4 351.3L111.6 353.4L112.2 351.3L112.4 346.1Z" fill="#5a83a8"/><path d="M42.2 433.9L46.5 435.5L49.0 436.1L48.4 435.4L45.7 433.9Z" fill="#928f8a"/><path d="M87.8 504.2L89.3 505.8L88.7 506.4L86.1 505.9Z" fill="#020306"/><path d="M38.6 12.3L45.0 13.2L48.3 13.6L47.0 13.2L42.2 12.3Z" fill="#6a665a"/><path d="M17.6 110.7L17.0 117.8L17.1 121.1L18.0 118.8L19.3 112.4Z" fill="#928f8a"/><path d="M94.9 180.9L96.0 185.9L96.6 186.5L96.6 182.7Z" fill="#728594"/><path d="M52.7 191.5L53.1 197.1L53.7 197.7L54.5 193.2Z" fill="#e2e4da"/><path d="M38.6 286.4L40.2 287.7L41.3 287.7L42.2 286.4Z" fill="#a6afb3"/><path d="M73.8 307.4L73.3 310.8L73.9 311.4L75.5 309.2Z" fill="#527087"/><path d="M274.1 395.3L273.6 400.9L273.1 401.5L272.3 397.0Z" fill="#728594"/><path d="M263.5 405.8L263.9 411.4L264.5 412.0L265.3 407.6Z" fill="#374250"/><path d="M77.3 500.7L80.0 502.5L81.8 503.2L82.0 502.4L80.8 500.7Z" fill="#bec7cb"/><path d="M73.8 96.6L73.7 100.2L73.1 100.7L72.0 98.4Z" fill="#928f8a"/><path d="M80.8 149.3L82.8 152.5L84.6 154.4L85.5 154.2L85.3 152.3L84.3 149.3Z" fill="#a6afb3"/><path d="M28.1 184.5L28.5 189.4L29.1 190.0L29.9 186.2Z" fill="#5a83a8"/><path d="M45.7 237.2L45.3 242.1L44.7 242.7L43.9 238.9Z" fill="#bec7cb"/><path d="M119.5 289.9L120.2 292.7L120.8 293.3L121.2 291.6Z" fill="#527087"/><path d="M126.5 96.6L127.2 99.8L127.8 100.4L128.2 98.4Z" fill="#928f8a"/><path d="M66.8 152.8L68.8 156.1L69.4 157.7L67.9 157.0L65.0 154.6Z" fill="#a6afb3"/><path d="M73.8 272.3L76.9 273.2L78.0 273.2L77.3 272.3Z" fill="#5a83a8"/><path d="M203.8 300.4L205.6 303.2L206.7 304.6L206.6 304.1L205.5 302.2Z" fill="#928f8a"/><path d="M228.4 325.0L229.4 327.3L230.5 327.3L231.9 325.0Z" fill="#697074"/><path d="M42.2 430.4L46.8 431.3L49.3 431.7L48.7 431.3L45.7 430.4Z" fill="#eff8fc"/><path d="M31.6 152.8L35.4 153.7L37.5 154.1L37.3 153.7L35.1 152.8Z" fill="#a6afb3"/><path d="M49.2 152.8L52.9 153.7L55.1 154.1L54.8 153.7L52.7 152.8Z" fill="#bec7cb"/><path d="M31.6 230.1L31.2 233.7L30.6 234.3L29.9 231.9Z" fill="#928f8a"/><path d="M151.1 258.2L151.6 262.0L151.5 263.9L150.7 262.9L149.3 260.0Z" fill="#928f8a"/><path d="M119.5 272.3L119.9 275.8L120.5 276.4L121.2 274.1Z" fill="#5a83a8"/><path d="M186.2 282.8L188.5 284.4L189.2 285.4L187.6 285.4L184.5 284.6Z" fill="#eff8fc"/><path d="M108.9 377.7L111.3 379.0L112.6 380.2L112.2 380.7L110.2 380.4L107.2 379.5Z" fill="#728594"/><path d="M80.8 381.2L83.1 382.8L83.8 383.8L82.2 383.8L79.1 383.0Z" fill="#527087"/><path d="M245.9 381.2L246.4 384.8L246.9 385.3L247.7 383.0Z" fill="#bec7cb"/><path d="M66.8 388.2L70.5 389.2L72.7 389.5L72.4 389.1L70.3 388.2Z" fill="#eff8fc"/><path d="M284.6 405.8L285.0 409.3L285.6 409.9L286.4 407.6Z" fill="#a6afb3"/><path d="M200.3 497.2L201.5 498.8L202.1 499.4L202.0 498.9Z" fill="#e2e4da"/><path d="M24.6 8.8L26.5 9.5L27.6 9.5L28.1 8.8Z" fill="#697074"/><path d="M63.2 72.0L63.1 74.0L63.7 74.6L65.0 73.8Z" fill="#6a665a"/><path d="M66.8 82.6L67.2 85.4L67.8 86.0L68.5 84.3Z" fill="#6a665a"/><path d="M80.8 86.1L81.3 87.7L80.7 88.3L79.1 87.8Z" fill="#6a665a"/><path d="M24.6 107.2L25.2 109.1L25.8 109.7L26.4 108.9Z" fill="#928f8a"/><path d="M98.4 110.7L99.2 111.7L100.1 112.4Z" fill="#e2e4da"/><path d="M115.9 121.2L117.6 121.3L119.5 121.2Z" fill="#928f8a"/><path d="M63.2 131.8L65.0 131.9L66.8 131.8Z" fill="#a6afb3"/><path d="M112.4 163.4L113.4 165.0L114.0 165.6L114.2 165.1Z" fill="#a6afb3"/><path d="M126.5 177.4L128.3 177.6L130.0 177.4Z" fill="#728594"/><path d="M24.6 191.5L25.0 194.3L25.6 194.9L26.4 193.2Z" fill="#527087"/><path d="M45.7 191.5L46.1 194.3L46.7 194.9L47.4 193.2Z" fill="#bec7cb"/><path d="M119.5 202.0L118.7 202.9L117.7 203.8Z" fill="#928f8a"/><path d="M35.1 212.6L35.5 215.4L36.1 216.0L36.9 214.3Z" fill="#bec7cb"/><path d="M52.7 251.2L53.1 254.1L53.7 254.6L54.5 253.0Z" fill="#bec7cb"/><path d="M73.8 268.8L75.6 269.5L76.8 269.5L77.3 268.8Z" fill="#a6afb3"/><path d="M28.1 275.8L28.2 277.8L27.6 278.4L26.4 277.6Z" fill="#a6afb3"/><path d="M151.1 279.3L150.6 281.0L151.2 281.5L152.8 281.1Z" fill="#e2e4da"/><path d="M158.1 279.3L157.5 281.3L156.9 281.9L156.4 281.1Z" fill="#a6afb3"/><path d="M126.5 289.9L127.4 291.5L128.0 292.1L128.2 291.6Z" fill="#928f8a"/><path d="M77.3 318.0L77.7 320.8L78.3 321.4L79.1 319.7Z" fill="#5a83a8"/><path d="M217.8 321.5L218.4 323.5L219.0 324.0L219.6 323.2Z" fill="#a6afb3"/><path d="M94.9 395.3L96.7 396.0L97.9 396.0L98.4 395.3Z" fill="#eff8fc"/><path d="M84.3 402.3L85.1 403.3L86.1 404.1Z" fill="#928f8a"/><path d="M52.7 412.8L54.7 413.7L55.9 413.7L56.2 412.8Z" fill="#728594"/><path d="M35.1 419.9L35.5 422.7L36.1 423.3L36.9 421.6Z" fill="#697074"/><path d="M45.7 426.9L47.5 427.6L48.7 427.6L49.2 426.9Z" fill="#a6afb3"/><path d="M256.5 448.0L256.6 449.9L256.0 450.5L254.7 449.7Z" fill="#728594"/><path d="M217.8 462.0L218.6 463.0L219.6 463.8Z" fill="#a6afb3"/></g></svg>`;

  const GIRL_SVG = `<svg viewBox="0 0 217 520" role="img" aria-label="奶龙酱"><g stroke-linejoin="round" stroke-linecap="round"><path d="M59.9 301.2L44.6 320.9L33.4 349.6L29.5 388.6L34.1 432.1L47.0 467.9L66.9 488.5L93.8 491.2L124.8 478.2L155.2 454.3L177.0 426.9L187.2 405.4L186.9 393.9L180.5 390.5L171.4 388.9L162.0 384.8L154.9 377.3L151.1 368.3L151.0 360.1L152.9 353.9L154.9 349.8L154.7 346.7L149.8 343.6L138.4 339.7L121.5 334.8L102.6 329.2L86.4 323.0L75.1 316.2L68.3 308.9L63.6 301.2Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M89.8 342.3L90.3 350.5L89.9 357.2L87.9 361.7L84.4 364.4L79.8 366.8L74.8 370.3L69.8 375.2L65.9 381.7L64.1 388.8L65.5 395.8L70.2 402.0L77.3 406.7L86.0 409.6L96.8 410.4L110.5 409.1L125.5 405.8L138.4 400.4L145.1 392.0L144.9 380.7L139.5 368.3L131.7 358.6L123.4 353.8L115.4 353.0L107.9 352.3L100.6 348.7L93.5 342.3Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M59.9 409.6L66.3 411.3L69.5 411.9L68.2 411.2L63.6 409.6Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M116.0 9.4L128.8 17.6L141.1 27.0L152.2 38.3L161.2 51.3L168.3 65.1L173.1 78.8L176.1 92.3L177.1 106.9L177.6 123.2L178.5 140.8L180.9 157.1L183.7 170.4L185.3 179.2L184.3 183.9L180.3 185.3L174.8 185.5L169.5 186.5L165.7 189.8L163.4 195.4L162.6 202.5L163.2 210.7L165.6 220.6L169.6 233.7L174.2 249.4L178.1 264.7L179.6 274.6L178.5 276.0L174.7 268.3L169.1 254.2L162.0 236.4L154.3 217.9L146.3 200.8L138.7 186.0L132.0 172.8L126.6 159.2L122.5 144.8L119.3 131.2L116.7 121.9L114.3 118.1L111.8 118.2L108.9 118.4L105.1 116.3L100.0 112.3L93.4 108.6L85.6 107.4L77.4 109.3L69.9 114.1L64.2 120.7L60.9 128.1L60.7 135.6L64.3 142.8L71.5 149.8L80.6 156.4L88.1 162.3L91.2 166.8L89.6 169.7L85.2 171.5L80.7 173.4L77.3 176.3L75.3 180.8L74.7 186.9L75.5 194.4L77.5 202.7L79.3 210.3L79.6 214.8L77.2 214.6L72.9 208.4L67.2 197.5L61.2 183.3L54.6 168.7L47.9 155.6L41.1 145.6L34.9 137.9L29.7 130.9L26.0 121.9L23.7 109.4L23.5 93.3L26.3 75.2L34.7 56.6L51.9 39.6L79.5 24.6L114.1 11.2Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M82.3 16.8L83.2 18.2L82.5 18.8L80.4 18.7Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M33.7 95.4L35.0 103.1L35.4 108.1L34.8 108.5L33.4 104.4L31.8 97.3Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M108.5 95.4L109.4 96.9L110.6 96.9L112.2 95.4Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M127.2 95.4L128.4 99.9L129.0 100.5L129.1 97.3Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M142.2 106.6L143.6 109.0L144.8 109.0L145.9 106.6Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M48.6 110.4L49.5 111.4L50.5 112.2Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M127.2 129.1L127.1 132.8L126.5 133.5L125.3 130.9Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M59.9 159.0L62.0 161.8L63.5 163.0L63.9 161.8L63.6 159.0Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M104.7 218.8L120.7 229.1L136.3 241.5L150.4 255.9L161.9 269.4L169.6 280.5L174.1 288.8L175.5 296.1L174.7 303.1L172.7 309.9L170.9 316.1L170.4 322.5L171.7 329.8L174.7 339.0L179.0 349.8L182.7 360.5L184.0 368.3L181.6 370.2L175.6 365.7L165.7 356.4L151.3 346.3L132.5 337.4L111.5 330.3L92.7 323.5L79.5 316.4L72.0 309.0L68.2 301.8L66.4 294.5L66.3 286.3L67.7 276.8L70.8 265.9L75.0 254.5L80.5 243.9L86.9 234.8L94.6 227.3L102.9 220.7Z" fill="#fde7e7" stroke="#4a3d35" stroke-width="3.0"/><path d="M145.9 271.2L146.7 273.5L147.3 274.1L147.8 273.1Z" fill="#fde7e7" stroke="#4a3d35" stroke-width="3.0"/><path d="M157.1 282.4L157.2 284.2L156.6 284.8L155.3 284.3Z" fill="#fde7e7" stroke="#4a3d35" stroke-width="3.0"/><path d="M164.6 215.1L167.2 222.9L171.0 234.1L175.7 249.7L179.8 268.9L181.3 288.6L180.0 306.7L177.9 322.3L177.4 335.8L180.0 345.7L184.8 347.9L190.1 336.5L193.4 310.9L193.0 276.9L188.0 246.6L179.2 226.4L168.3 215.1Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M82.3 106.6L74.9 120.6L71.0 133.2L73.0 143.1L80.5 149.7L91.3 152.5L101.3 151.5L107.8 147.4L109.4 141.0L107.3 133.1L102.3 124.4L95.0 115.5L86.0 106.6Z" fill="#fbfafa" stroke="#4a3d35" stroke-width="3.0"/><path d="M82.3 140.3L82.0 142.0L81.4 142.6L80.4 142.2Z" fill="#fbfafa" stroke="#4a3d35" stroke-width="3.0"/><path d="M104.7 177.7L117.3 186.7L128.5 195.2L136.8 202.3L139.9 207.7L136.8 211.3L127.7 212.6L115.4 210.9L103.8 205.8L97.5 197.8L97.8 188.7L102.9 179.6Z" fill="#fde7e7" stroke="#4a3d35" stroke-width="3.0"/><path d="M123.5 342.3L116.7 356.0L111.7 368.7L110.1 378.3L112.7 382.9L118.4 380.4L124.2 371.7L127.1 358.1L127.2 342.3Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M101.0 357.3L92.7 363.3L84.5 369.6L77.2 376.4L72.6 383.0L72.7 388.0L77.8 388.9L86.1 384.0L94.9 373.4L102.9 359.1Z" fill="#ab966d" stroke="#4a3d35" stroke-width="3.0"/><path d="M145.9 211.4L148.7 225.4L153.0 239.2L158.0 249.2L160.4 249.0L157.3 235.2L149.6 211.4Z" fill="#fbfafa" stroke="#4a3d35" stroke-width="3.0"/><path d="M112.2 159.0L118.7 163.2L124.8 168.4L129.9 175.0L132.7 181.9L132.0 186.6L127.3 186.5L120.8 181.1L114.9 171.9L110.4 160.9Z" fill="#fde7e7" stroke="#4a3d35" stroke-width="3.0"/><path d="M15.0 203.9L22.3 211.8L30.2 218.6L38.6 223.1L46.2 224.2L50.6 221.9L50.0 217.3L43.6 212.3L32.5 207.7L18.7 203.9Z" fill="#e4e4d9" stroke="#4a3d35" stroke-width="3.0"/><path d="M41.2 159.0L46.7 177.2L51.9 188.3L55.7 189.8L57.1 183.9L55.3 175.2L50.8 166.6L44.9 159.0Z" fill="#f0e0b7" stroke="#4a3d35" stroke-width="3.0"/><path d="M164.6 338.6L160.5 343.7L157.0 349.3L154.8 355.8L154.7 362.9L156.8 367.8L160.2 366.4L163.6 356.6L166.5 340.4Z" fill="#ab966d" stroke="#4a3d35" stroke-width="3.0"/><path d="M116.0 383.5L116.3 392.1L119.9 398.2L126.6 400.4L132.9 398.8L134.3 394.6L129.3 389.2L119.7 383.5Z" fill="#fbfafa" stroke="#4a3d35" stroke-width="3.0"/><path d="M37.4 282.4L38.8 291.1L41.8 296.8L45.6 298.0L47.8 295.0L46.1 289.3L41.2 282.4Z" fill="#fbfafa" stroke="#4a3d35" stroke-width="3.0"/><path d="M22.4 121.6L27.6 138.5L32.1 149.9L34.8 152.6L34.7 147.1L31.4 135.7L26.2 121.6Z" fill="#9c845a" stroke="#4a3d35" stroke-width="3.0"/><path d="M183.3 110.4L183.3 135.3L184.1 154.3L185.4 162.2L186.4 156.5L186.2 138.3L185.2 112.2Z" fill="#9c845a"/><path d="M22.4 46.8L20.9 62.0L20.9 68.3L22.9 62.0L26.2 46.8Z" fill="#9c845a"/><path d="M116.0 106.6L114.9 114.9L114.5 121.5L114.9 123.5L116.2 118.6L117.8 108.5Z" fill="#fde7e7"/><path d="M63.6 256.3L63.7 262.2L64.8 265.4L66.5 264.9L67.5 261.4L67.3 256.3Z" fill="#fbfafa"/><path d="M52.4 230.1L55.5 237.6L57.4 240.4L57.5 237.2L56.1 230.1Z" fill="#b0aaa7"/><path d="M93.5 394.7L91.2 399.5L88.1 402.4L85.7 402.5L86.9 400.1L91.7 396.5Z" fill="#9c845a"/><path d="M63.6 211.4L66.0 218.9L67.5 221.8L67.9 218.6L67.3 211.4Z" fill="#b0aaa7"/><path d="M18.7 301.2L19.0 307.2L20.6 310.8L23.4 311.1L25.5 308.6L25.1 305.0L22.4 301.2Z" fill="#fbfafa"/><path d="M15.0 503.2L25.4 505.5L33.6 506.8L36.3 506.7L30.7 505.3L18.7 503.2Z" fill="#020203"/><path d="M48.6 267.5L49.0 274.3L50.2 278.5L51.8 278.6L51.9 275.1L50.5 269.4Z" fill="#fbfafa"/><path d="M172.1 58.0L175.0 67.5L175.8 71.8L173.9 68.5L170.2 59.9Z" fill="#9c845a"/><path d="M172.1 376.0L171.2 381.9L169.2 386.2L166.6 387.9L165.3 386.5L166.7 382.8L170.2 377.8Z" fill="#9c845a"/><path d="M15.0 192.7L21.3 196.2L23.4 198.0L20.0 197.2L13.1 194.5Z" fill="#c1c2bf"/><path d="M172.1 207.6L177.9 210.0L180.3 211.9L178.7 212.6L174.7 211.7L170.2 209.5Z" fill="#c1c2bf"/><path d="M78.6 166.5L82.3 173.3L84.1 178.3L83.2 180.2L80.9 178.6L78.5 174.2L76.7 168.3Z" fill="#fde7e7"/><path d="M41.2 166.5L39.3 175.4L38.9 179.5L40.3 176.5L43.0 168.3Z" fill="#ab966d"/><path d="M187.1 503.2L189.4 505.1L191.1 505.8L191.6 505.0L190.8 503.2Z" fill="#020203"/><path d="M175.8 110.4L175.4 119.3L174.8 119.9L174.0 112.2Z" fill="#ecd198"/><path d="M67.3 207.6L69.2 213.8L71.1 217.3L72.3 216.8L72.2 213.1L71.1 207.6Z" fill="#6a423e"/><path d="M15.0 215.1L21.3 218.5L24.4 220.9L23.1 221.4L18.8 219.9L13.1 217.0Z" fill="#c1c2bf"/><path d="M145.9 499.4L155.4 500.4L160.2 500.8L157.7 500.3L149.6 499.4Z" fill="#c1c2bf"/><path d="M101.0 503.2L104.7 504.9L105.7 505.9L103.5 505.9L99.1 505.0Z" fill="#020203"/><path d="M78.6 102.9L74.4 107.7L72.2 110.0L73.2 108.7L76.7 104.7Z" fill="#fde7e7"/><path d="M89.8 170.2L92.4 173.2L94.0 174.7L93.7 174.1L91.7 172.1Z" fill="#e4e4d9"/><path d="M74.8 230.1L75.5 232.5L76.8 232.5L78.6 230.1Z" fill="#e4e4d9"/><path d="M41.2 301.2L37.6 305.1L36.0 307.9L36.9 308.5L39.7 306.6L43.0 303.0Z" fill="#9f9898"/><path d="M145.9 361.0L147.3 364.1L148.6 364.1L149.6 361.0Z" fill="#9c845a"/><path d="M59.9 383.5L61.3 390.8L62.2 394.2L62.3 391.8L61.7 385.3Z" fill="#8a776a"/><path d="M89.8 499.4L97.5 500.4L101.4 500.8L99.7 500.3L93.5 499.4Z" fill="#c1c2bf"/><path d="M179.6 110.4L180.0 116.3L180.6 117.0L181.4 112.2Z" fill="#ab966d"/><path d="M74.8 181.4L76.3 184.2L77.5 184.2L78.6 181.4Z" fill="#b0aaa7"/><path d="M172.1 185.2L176.1 186.9L177.4 187.9L175.0 187.9L170.2 187.1Z" fill="#9c845a"/><path d="M145.9 334.8L149.2 336.5L151.2 337.1L151.2 336.4L149.6 334.8Z" fill="#fde7e7"/><path d="M101.0 349.8L102.0 354.0L101.9 356.6L100.9 356.7L99.8 354.7L99.1 351.7Z" fill="#8a776a"/><path d="M119.7 9.4L122.3 10.6L123.5 10.6L123.5 9.4Z" fill="#9c845a"/><path d="M160.9 46.8L163.4 48.8L164.7 48.8L164.6 46.8Z" fill="#9c845a"/><path d="M15.0 80.4L15.4 85.7L16.0 86.3L16.8 82.3Z" fill="#55431e"/><path d="M37.4 106.6L36.6 109.6L36.0 110.3L35.5 108.5Z" fill="#d5bd92"/><path d="M142.2 106.6L143.6 109.0L144.8 109.0L145.9 106.6Z" fill="#fde7e7"/><path d="M164.6 203.9L166.1 206.1L166.3 207.3L165.0 207.1L162.7 205.8Z" fill="#e4e4d9"/><path d="M172.1 278.7L174.0 280.8L175.4 281.7L176.0 280.8L175.8 278.7Z" fill="#c1c2bf"/><path d="M175.8 297.4L177.7 297.6L179.6 297.4Z" fill="#fde7e7"/><path d="M59.9 409.6L66.3 411.3L69.5 411.9L68.2 411.2L63.6 409.6Z" fill="#fde7e7"/><path d="M93.5 9.4L92.9 10.3L91.7 11.2Z" fill="#ab966d"/><path d="M93.5 99.1L92.9 100.9L92.3 101.5L91.7 101.0Z" fill="#d5bd92"/><path d="M127.2 129.1L127.1 132.8L126.5 133.5L125.3 130.9Z" fill="#ab966d"/><path d="M37.4 132.8L37.7 135.6L38.3 136.3L39.3 134.7Z" fill="#ab966d"/><path d="M59.9 159.0L62.0 161.8L63.5 163.0L63.9 161.8L63.6 159.0Z" fill="#e4e4d9"/><path d="M56.1 203.9L55.6 206.4L56.3 207.0L58.0 205.8Z" fill="#f0e0b7"/><path d="M89.8 342.3L93.5 344.0L95.7 344.6L95.5 343.9L93.5 342.3Z" fill="#fbfafa"/><path d="M104.7 402.2L104.3 404.6L104.9 405.3L106.6 404.0Z" fill="#fbfafa"/><path d="M29.9 499.4L29.3 500.4L28.1 501.3Z" fill="#b0aaa7"/><path d="M59.9 499.4L64.8 500.4L67.5 500.8L66.8 500.3L63.6 499.4Z" fill="#c1c2bf"/><path d="M78.6 5.6L82.5 6.6L84.8 7.0L84.6 6.5L82.3 5.6Z" fill="#352802"/><path d="M74.8 9.4L74.1 10.3L72.9 11.2Z" fill="#9c845a"/><path d="M82.3 16.8L83.2 18.2L82.5 18.8L80.4 18.7Z" fill="#e4e4d9"/><path d="M22.4 76.7L22.0 80.5L21.4 81.1L20.6 78.6Z" fill="#d5bd92"/><path d="M108.5 95.4L109.4 96.9L110.6 96.9L112.2 95.4Z" fill="#ab966d"/><path d="M127.2 95.4L128.0 97.7L128.6 98.3L129.1 97.3Z" fill="#ecd198"/><path d="M183.3 95.4L185.2 95.6L187.1 95.4Z" fill="#725523"/><path d="M89.8 106.6L93.8 107.6L96.1 108.0L95.8 107.5L93.5 106.6Z" fill="#fde7e7"/><path d="M56.1 132.8L55.9 134.5L55.2 135.2L54.2 134.7Z" fill="#e4e4d9"/><path d="M44.9 144.0L45.1 146.1L45.8 146.8L46.8 145.9Z" fill="#c5a97c"/><path d="M187.1 211.4L191.0 212.3L193.3 212.7L193.1 212.3L190.8 211.4Z" fill="#e4e4d9"/><path d="M108.5 218.8L112.5 219.8L114.8 220.2L114.5 219.8L112.2 218.8Z" fill="#b0aaa7"/><path d="M71.1 241.3L71.1 244.3L71.8 244.9L72.9 243.2Z" fill="#6a423e"/><path d="M145.9 271.2L146.7 273.5L147.3 274.1L147.8 273.1Z" fill="#e4e4d9"/><path d="M67.3 293.7L66.9 297.4L66.3 298.1L65.5 295.5Z" fill="#6a423e"/><path d="M26.2 308.6L27.4 310.9L28.0 311.5L28.1 310.5Z" fill="#b0aaa7"/><path d="M37.4 308.6L37.7 310.7L38.3 311.4L39.3 310.5Z" fill="#c1c2bf"/><path d="M78.6 361.0L79.0 362.7L78.4 363.4L76.7 362.9Z" fill="#ab966d"/><path d="M67.3 372.2L69.5 373.2L70.8 373.2L71.1 372.2Z" fill="#9c845a"/><path d="M101.0 390.9L100.2 393.2L99.6 393.8L99.1 392.8Z" fill="#8a776a"/><path d="M179.6 390.9L179.5 392.7L180.1 393.3L181.4 392.8Z" fill="#fde7e7"/><path d="M89.8 409.6L90.7 411.1L91.9 411.1L93.5 409.6Z" fill="#fde7e7"/><path d="M97.3 5.6L96.5 6.6L95.4 7.5Z" fill="#55431e"/><path d="M33.7 95.4L32.8 96.4L31.8 97.3Z" fill="#c5a97c"/><path d="M179.6 95.4L180.0 98.4L180.6 99.0L181.4 97.3Z" fill="#9c845a"/><path d="M127.2 106.6L127.9 108.2L127.2 108.8L125.3 108.5Z" fill="#f0e0b7"/><path d="M48.6 110.4L49.5 111.4L50.5 112.2Z" fill="#f0e0b7"/><path d="M82.3 140.3L82.0 142.0L81.4 142.6L80.4 142.2Z" fill="#e4e4d9"/><path d="M63.6 144.0L65.0 145.3L66.3 145.3L67.3 144.0Z" fill="#fde7e7"/><path d="M48.6 155.3L50.1 156.5L51.3 156.5L52.4 155.3Z" fill="#ab966d"/><path d="M74.8 155.3L74.1 156.2L72.9 157.1Z" fill="#fde7e7"/><path d="M160.9 177.7L163.0 179.0L164.3 179.0L164.6 177.7Z" fill="#9c845a"/><path d="M71.1 181.4L70.6 184.5L70.0 185.1L69.2 183.3Z" fill="#e4e4d9"/><path d="M41.2 200.1L42.1 201.9L42.8 202.5L43.0 202.0Z" fill="#9c845a"/><path d="M134.7 211.4L134.9 213.1L135.6 213.7L136.5 213.2Z" fill="#9f9898"/><path d="M194.5 215.1L195.8 216.1L195.1 216.7L192.7 217.0Z" fill="#c1c2bf"/><path d="M89.8 218.8L91.8 219.6L93.0 219.6L93.5 218.8Z" fill="#e4e4d9"/><path d="M86.0 222.6L88.0 223.3L89.3 223.3L89.8 222.6Z" fill="#b0aaa7"/><path d="M67.3 241.3L67.2 243.8L67.8 244.4L69.2 243.2Z" fill="#e4e4d9"/><path d="M63.6 282.4L63.0 284.5L62.4 285.2L61.7 284.3Z" fill="#9f9898"/><path d="M157.1 282.4L157.2 284.2L156.6 284.8L155.3 284.3Z" fill="#9f9898"/><path d="M168.3 312.4L169.2 314.7L169.8 315.3L170.2 314.2Z" fill="#8a776a"/><path d="M97.3 346.0L96.8 347.8L97.4 348.4L99.1 347.9Z" fill="#fde7e7"/><path d="M101.0 383.5L101.9 384.5L102.9 385.3Z" fill="#9c845a"/><path d="M108.5 383.5L108.8 385.0L108.2 385.6L106.6 385.3Z" fill="#fde7e7"/><path d="M183.3 383.5L184.7 384.7L186.0 384.7L187.1 383.5Z" fill="#fde7e7"/><path d="M157.1 398.4L159.3 399.7L160.5 399.7L160.9 398.4Z" fill="#fde7e7"/><path d="M15.0 499.4L16.9 500.2L18.2 500.2L18.7 499.4Z" fill="#c1c2bf"/></g></svg>`;

  const state = {
    sceneId: story.start,
    score: story.meta.startScore,
    flags: {},
    tagStats: {},
    memories: {},
    factResults: {},
    finalTone: null,
    location: null,
    history: [],
    chapterId: null,
    mode: "dialogue",
    queue: [],
    queueIndex: 0,
    queueKind: "scene",
    pendingNext: null,
    typing: false,
    typeTimer: 0,
    fullText: "",
    optionsShown: false,
    activeOptions: [],
    customOpen: false,
    customEditor: null,
    locked: false,
    paused: false,
    finished: false,
    endingId: null,
    chatTimer: 0,
    currentLine: null,
    chapterTimer: 0,
    chapterSkip: null,
    toastTimer: 0,
    choiceTimer: 0,
    clues: {},
  };

  const CLUE_KEY = "love.clues.v1";
  try {
    const savedClues = JSON.parse(localStorage.getItem(CLUE_KEY) || "{}");
    if (savedClues && typeof savedClues === "object") state.clues = savedClues;
  } catch (error) {
    /* 忽略损坏的本地存储 */
  }

  function saveClues() {
    try {
      localStorage.setItem(CLUE_KEY, JSON.stringify(state.clues));
    } catch (error) {
      /* 隐私模式下忽略 */
    }
    updateClueBadge();
  }

  function updateClueBadge() {
    const badge = $("clue-count");
    if (!badge) return;
    badge.textContent = String(Object.keys(state.clues).length);
    badge.dataset.empty = Object.keys(state.clues).length ? "false" : "true";
  }

  const clampScore = (value) =>
    Math.max(story.meta.minScore, Math.min(story.meta.maxScore, value));

  function show(element) {
    element.classList.remove("hidden");
  }

  function hide(element) {
    element.classList.add("hidden");
  }

  function clearTimers() {
    window.clearTimeout(state.typeTimer);
    window.clearTimeout(state.chatTimer);
    window.clearTimeout(state.chapterTimer);
    window.clearTimeout(state.toastTimer);
    state.typeTimer = 0;
    state.chatTimer = 0;
    state.chapterTimer = 0;
    state.toastTimer = 0;
    state.chapterSkip = null;
    state.typing = false;
  }

  function setPhase(phase) {
    document.body.dataset.phase = phase;
    document.body.dataset.mode = state.mode;
    $("title-screen").classList.toggle("hidden", phase !== "title");
    $("ending-screen").classList.toggle("hidden", phase !== "ending");
    $("egg-screen").classList.toggle("hidden", phase !== "egg");
    $("hud").classList.toggle("hidden", phase !== "playing");
    const playing = phase === "playing";
    $("dialogue-layer").classList.toggle(
      "hidden", !(playing && state.mode !== "chat"));
    $("chat-panel").classList.toggle(
      "hidden", !(playing && state.mode === "chat"));
    if (!(playing && state.mode === "chat")) closeMoments();
    if (!playing) hide($("memory-panel"));
  }

  function setMode(mode) {
    state.mode = mode === "chat" ? "chat" : "dialogue";
    document.body.dataset.mode = state.mode;
    const playing = document.body.dataset.phase === "playing";
    $("dialogue-layer").classList.toggle(
      "hidden", !(playing && state.mode !== "chat"));
    $("chat-panel").classList.toggle(
      "hidden", !(playing && state.mode === "chat"));
    if (!(playing && state.mode === "chat")) closeMoments();
  }

  // 场景姿势：教室是坐着上课，广播那场坐在桌前
  const POSE_BY_BACKGROUND = {};
  const SEATED_MOODS = {
    girl: new Set(["smile", "shy"]),
    boy: new Set(["smile"]),
  };

  // 场景道具：left/bottom 是百分比，h 是贴合尺寸（px）
  const PROPS_BY_BACKGROUND = {
  };

  // ---------- 场景动态 ----------
  const FISH_SVG =
    '<svg viewBox="0 0 60 28"><path d="M6 14 q12 -11 26 -1 q-14 11 -26 1 Z" fill="currentColor" opacity=".9"/>'
    + '<path d="M32 14 l12 -8 v16 Z" fill="currentColor" opacity=".7"/>'
    + '<circle cx="15" cy="12" r="1.5" fill="#2b3a4a" opacity=".8"/></svg>';
  const JELLY_SVG =
    '<svg viewBox="0 0 48 60"><path d="M4 24 a20 17 0 0 1 40 0 q-20 9 -40 0 Z" fill="currentColor" opacity=".8"/>'
    + '<path d="M9 28 q-2 14 3 24 M17 30 q-1 13 2 22 M24 30 q0 15 1 23 M31 30 q2 13 -1 22 M39 28 q3 13 -2 23" '
    + 'stroke="currentColor" stroke-width="2" fill="none" opacity=".55"/></svg>';

  function fxFish(layer) {
    for (let i = 0; i < 7; i += 1) {
      const fish = document.createElement("span");
      fish.className = "fx-fish";
      fish.innerHTML = FISH_SVG;
      fish.style.setProperty("--y", `${14 + Math.random() * 62}%`);
      fish.style.setProperty("--size", `${24 + Math.random() * 30}px`);
      fish.style.setProperty("--dur", `${15 + Math.random() * 16}s`);
      fish.style.setProperty("--delay", `${-Math.random() * 24}s`);
      fish.style.setProperty("--hue", `${182 + Math.random() * 46}`);
      fish.style.opacity = `${0.45 + Math.random() * 0.4}`;
      layer.append(fish);
    }
    for (let i = 0; i < 3; i += 1) {
      const jelly = document.createElement("span");
      jelly.className = "fx-jelly";
      jelly.innerHTML = JELLY_SVG;
      jelly.style.left = `${12 + Math.random() * 70}%`;
      jelly.style.top = `${18 + Math.random() * 40}%`;
      jelly.style.setProperty("--size", `${46 + Math.random() * 34}px`);
      jelly.style.setProperty("--dur", `${9 + Math.random() * 7}s`);
      jelly.style.setProperty("--delay", `${-Math.random() * 10}s`);
      layer.append(jelly);
    }
  }

  function fxBokeh(layer) {
    for (let i = 0; i < 16; i += 1) {
      const dot = document.createElement("span");
      dot.className = "fx-bokeh";
      dot.style.setProperty("--x", `${52 + Math.random() * 46}%`);
      dot.style.setProperty("--y", `${4 + Math.random() * 58}%`);
      dot.style.setProperty("--size", `${3 + Math.random() * 6}px`);
      dot.style.setProperty("--dur", `${6 + Math.random() * 9}s`);
      dot.style.setProperty("--delay", `${-Math.random() * 8}s`);
      layer.append(dot);
    }
  }

  // 宿舍窗帘：帘杆 + 布，按窗户透视 skewY，宽度随拖动变化
  // 每个宿舍场景的窗帘几何：窗户玻璃区域 + 透视倾角
  const CURTAIN_RIG = {
    girl: {
      left: "69.06%",
      right: "2.5%",
      top: "-0.4%",
      height: "56%",
      skewY: "9deg",
      skewX: "-1.37deg",
      clothScale: "104%",
    },
    boy: {
      left: "69.0%",
      right: "0%",
      top: "0.6%",
      height: "60%",
      skewY: "8.5deg",
      skewX: "-1.6deg",
      clothScale: "100%",
    },
  };

  function fxCurtainLayer(layer, which) {
    const rig = document.createElement("div");
    rig.className = `fx-curtain-rig fx-curtain-rig-${which}`;

    const rod = document.createElement("div");
    rod.className = "fx-curtain-rod";

    const cast = document.createElement("div");
    cast.className = "fx-curtain-cast";

    const cloth = document.createElement("div");
    cloth.className = "fx-curtain-cloth";

    const rim = document.createElement("div");
    rim.className = "fx-curtain-rim";

    const hem = document.createElement("div");
    hem.className = "fx-curtain-hem";

    cloth.append(rim, hem);

    const grip = document.createElement("span");
    grip.className = "fx-curtain-grip";
    grip.textContent = "⇄";

    rig.append(cast, rod, cloth, grip);

    const shade = document.createElement("div");
    shade.className = "fx-curtain-shade";

    layer.append(shade, rig);

    const pre = new Image();
    pre.src = "./characters/curtain-scene.webp";

    const rigCfg = CURTAIN_RIG[which] || CURTAIN_RIG.girl;
    rig.style.setProperty("--rig-left", rigCfg.left);
    rig.style.setProperty("--rig-right", rigCfg.right);
    rig.style.setProperty("--rig-top", rigCfg.top);
    rig.style.setProperty("--rig-height", rigCfg.height);
    rig.style.setProperty("--skew-y", rigCfg.skewY);
    rig.style.setProperty("--skew-x", rigCfg.skewX);
    rig.style.setProperty("--cloth-scale", rigCfg.clothScale);

    const state = { open: 0.32 };
    const apply = () => {
      rig.style.setProperty("--open", state.open.toFixed(4));
      grip.style.right = `calc(${(state.open * 100).toFixed(1)}% + 6px)`;
      shade.style.opacity = (0.04 + 0.30 * state.open).toFixed(3);
    };
    apply();

    let dragging = false;
    let startX = 0;
    let startOpen = state.open;
    rig.addEventListener("pointerdown", (event) => {
      dragging = true;
      startX = event.clientX;
      startOpen = state.open;
      rig.setPointerCapture?.(event.pointerId);
      rig.classList.add("dragging");
    });
    rig.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const span = Math.max(160, rig.clientWidth || 300);
      state.open = Math.min(1, Math.max(0.06, startOpen + (startX - event.clientX) / span));
      apply();
    });
    const stop = () => {
      dragging = false;
      rig.classList.remove("dragging");
    };
    rig.addEventListener("pointerup", stop);
    rig.addEventListener("pointercancel", stop);
    rig.addEventListener("pointerleave", stop);
  }

  // ---------- 鼠标交互：视差 + 场景热点 ----------

  const HOTSPOTS = {
    "dorm-night-girl": [
      { id: "lamp", label: "台灯", x: 46.6, y: 26.8, r: 44 },
      { id: "phone", label: "手机", x: 44.3, y: 66.2, r: 38 },
      {
        id: "plush",
        label: "兔子玩偶",
        x: 54.6,
        y: 35.4,
        r: 36,
        clue: "girl_bunny",
        note: "兔子的耳朵被缝过两次，针脚歪歪扭扭。她说那是自己补的——补的时候大概很困。",
      },
      {
        id: "lights",
        label: "灯串",
        x: 21.0,
        y: 8.0,
        r: 52,
        clue: "girl_lights",
        note: "灯串的插头上贴着一张便签：「今天也辛苦啦」。字很小，像是随手写的。",
      },
      {
        id: "moon",
        label: "窗外的月亮",
        x: 88.6,
        y: 7.5,
        r: 44,
        clue: "girl_moon",
        note: "月亮总停在窗格右上角这个位置。她每晚都把窗帘拉到刚好露出它。",
      },
    ],
    "dorm-night-boy": [
      { id: "lamp", label: "台灯", x: 10.8, y: 25.0, r: 44 },
      { id: "phone", label: "手机", x: 47.0, y: 54.0, r: 40 },
      {
        id: "guitar",
        label: "吉他",
        x: 8.5,
        y: 76.0,
        r: 52,
        clue: "boy_guitar",
        note: "琴颈上贴着一截褪色的胶带，写着「7.14 礼堂」。日期被反复描过。",
      },
      {
        id: "books",
        label: "床头的书",
        x: 9.0,
        y: 68.0,
        r: 40,
        clue: "boy_book",
        note: "旧书里夹着一张照片，边缘被人反复捏过，已经发软。",
      },
      {
        id: "poster",
        label: "墙上的海报",
        x: 55.0,
        y: 13.0,
        r: 46,
        clue: "boy_poster",
        note: "校园音乐节的海报。右下角有一行手写的小字，被磨得快看不清了。",
      },
    ],
  };

  function initParallax() {
    const shell = $("game-shell");
    const scene = $("scene");
    if (!shell || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      raf = 0;
      shell.style.setProperty("--par-x", tx.toFixed(3));
      shell.style.setProperty("--par-y", ty.toFixed(3));
    };
    const onMove = (event) => {
      const rect = scene.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    shell.addEventListener("pointermove", onMove, { passive: true });
    shell.addEventListener("pointerleave", reset);
  }

  function clearHotspots() {
    const old = document.querySelector(".hotspots");
    if (old) old.remove();
    document.querySelectorAll(".lamp-off-layer, .lamp-warm, .phone-glow, .moon-glow").forEach((el) => el.remove());
    delete document.body.dataset.lamp;
    delete document.body.dataset.phone;
  }

  // 关灯版画面资源（模型生成的同一房间、灯全灭）
  const OFF_BACKGROUND = {
    "dorm-night-girl": "./backgrounds-painted/sleep-girl-off.jpg",
    "dorm-night-boy": "./backgrounds-painted/sleep-boy-off.jpg",
  };

  function renderHotspots(name) {
    clearHotspots();
    const list = HOTSPOTS[name];
    if (!list || !list.length) return;
    const scene = $("scene");
    if (!scene) return;

    const wrap = document.createElement("div");
    wrap.className = "hotspots";

    // 关灯版画面（同一房间、灯全灭），点台灯时淡入
    const offSrc = OFF_BACKGROUND[name];
    if (offSrc && !scene.querySelector(".lamp-off-layer")) {
      const off = document.createElement("div");
      off.className = "lamp-off-layer";
      off.style.backgroundImage = `url("${offSrc}")`;
      scene.append(off);
    }

    for (const spot of list) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hotspot";
      btn.dataset.spot = spot.id;
      btn.title = spot.label;
      btn.setAttribute("aria-label", spot.label);
      btn.style.left = `calc(${spot.x}% - ${spot.r}px)`;
      btn.style.top = `calc(${spot.y}% - ${spot.r}px)`;
      btn.style.width = `${spot.r * 2}px`;
      btn.style.height = `${spot.r * 2}px`;
      btn.addEventListener("click", () => triggerHotspot(spot.id, spot, scene));
      wrap.append(btn);
    }

    scene.append(wrap);
  }

  function showPropNote(spot, scene) {
    const old = document.querySelector(".prop-note");
    if (old) old.remove();
    const note = document.createElement("div");
    note.className = "prop-note";
    note.style.left = `min(max(8%, calc(${spot.x}% - 150px)), 68%)`;
    note.style.top = `min(max(6%, calc(${spot.y}% - 150px)), 62%)`;
    const title = document.createElement("strong");
    title.textContent = spot.label;
    const body = document.createElement("p");
    body.textContent = spot.note;
    note.append(title, body);
    scene.append(note);
    setTimeout(() => note.classList.add("is-gone"), 4200);
    setTimeout(() => note.remove(), 4800);
  }

  function triggerHotspot(id, spot, scene) {
    if (spot.clue) {
      showPropNote(spot, scene);
      state.clues[spot.clue] = { label: spot.label, note: spot.note };
      saveClues();
      return;
    }

    if (id === "lamp") {
      const off = document.body.dataset.lamp === "off";
      if (off) delete document.body.dataset.lamp;
      else document.body.dataset.lamp = "off";
      return;
    }

    if (id === "phone") {
      if (document.body.dataset.phone === "on") delete document.body.dataset.phone;
      else document.body.dataset.phone = "on";
      return;
    }

    // 玩偶 / 吉他：戳一下晃一晃
    const fx = document.createElement("div");
    fx.className = "plush-poke";
    fx.style.left = `${spot.x}%`;
    fx.style.top = `${spot.y}%`;
    scene.append(fx);
    setTimeout(() => fx.remove(), 560);
  }

  // ---------- 一起玩：五子棋 ----------

  function openGomoku() {
    if (!window.LoveGomoku) return;
    window.LoveGomoku.open({
      onFinish: (result) => {
        if (result === "quit") return;
        if (result === "win") {
          state.score = clampScore(state.score + 6);
          state.flags.gomokuWin = true;
          state.flags.gomokuWinOnce = true;
        } else if (result === "lose") {
          state.score = clampScore(state.score - 2);
          state.flags.gomokuLose = true;
        } else {
          state.score = clampScore(state.score + 1);
        }
        saveGame();
        renderScore();
      },
    });
  }

  function initMinigameUI() {
    const button = $("play-button");
    if (button) {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openGomoku();
      });
    }
  }

  // ---------- 线索面板 ----------

  function renderCluePanel() {
    const list = $("clue-list");
    if (!list) return;
    list.replaceChildren();
    const entries = Object.values(state.clues);
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "clue-empty";
      empty.textContent = "还没有发现任何细节。在房间里点点看。";
      list.append(empty);
      return;
    }
    entries.forEach((clue) => {
      const item = document.createElement("div");
      item.className = "clue-item";
      const title = document.createElement("strong");
      title.textContent = clue.label;
      const body = document.createElement("p");
      body.textContent = clue.note;
      item.append(title, body);
      list.append(item);
    });
  }

  function toggleCluePanel(force) {
    const panel = $("clue-panel");
    if (!panel) return;
    const show = typeof force === "boolean" ? force : panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !show);
    if (show) renderCluePanel();
  }

  function initClueUI() {
    const toggle = $("clue-toggle");
    if (toggle) {
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleCluePanel();
      });
    }
    const close = $("clue-close");
    if (close) close.addEventListener("click", () => toggleCluePanel(false));
    updateClueBadge();
  }

  // ---------- 管理者面板：自由切换场景 / 表情 ----------
  const SCENE_LABELS = {
    campus: "校门口",
    classroom: "微积分课",
    dorm: "宿舍",
    restaurant: "小餐馆",
    walk: "后门散步",
    cinema: "电影院",
    street: "夜市",
    library: "图书馆",
    rain: "暴雨",
    track: "操场",
    ferris: "摩天轮",
    aquarium: "水族馆",
    "dorm-day-girl": "宿舍白天",
    "dorm-night-boy": "男生夜聊",
    "dorm-night-girl": "女生夜聊",
    "dorm-storm-girl": "雷雨夜",
    "dorm-radio-night": "广播台",
  };

  function buildAdminPanel() {
    if (document.getElementById("admin-panel")) return;
    const panel = document.createElement("aside");
    panel.id = "admin-panel";
    panel.className = "admin-panel hidden";
    panel.setAttribute("aria-label", "管理者面板");

    const head = document.createElement("div");
    head.className = "admin-head";
    const title = document.createElement("strong");
    title.textContent = "管理者面板";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "admin-close";
    close.textContent = "×";
    close.addEventListener("click", () => toggleAdmin(false));
    head.append(title, close);

    const sceneTitle = document.createElement("p");
    sceneTitle.className = "admin-sub";
    sceneTitle.textContent = "切换场景";

    const grid = document.createElement("div");
    grid.className = "admin-grid";
    for (const name of BACKGROUNDS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "admin-scene";
      button.dataset.scene = name;
      button.textContent = SCENE_LABELS[name] || name;
      button.addEventListener("click", () => {
        setBackground(name);
        for (const node of grid.children) node.classList.remove("is-active");
        button.classList.add("is-active");
        if (typeof setPhase === "function") setPhase("playing");
      });
      grid.append(button);
    }

    const moodTitle = document.createElement("p");
    moodTitle.className = "admin-sub";
    moodTitle.textContent = "切换女主表情（教室场景生效）";

    const moods = document.createElement("div");
    moods.className = "admin-moods";
    for (const mood of MOODS) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = mood;
      button.addEventListener("click", () => setExpression(mood));
      moods.append(button);
    }

    const hint = document.createElement("p");
    hint.className = "admin-hint";
    hint.textContent = "快捷键：Ctrl + Shift + A 开关面板";

    panel.append(head, sceneTitle, grid, moodTitle, moods, hint);
    document.body.append(panel);
  }

  function toggleAdmin(force) {
    const panel = document.getElementById("admin-panel");
    if (!panel) return;
    const show = force === undefined ? panel.classList.contains("hidden") : force;
    panel.classList.toggle("hidden", !show);
    document.body.classList.toggle("admin-open", show);
  }

  function initAdmin() {
    buildAdminPanel();
    const enabled = new URLSearchParams(location.search).get("admin") === "1";
    if (enabled) toggleAdmin(true);
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && (event.key === "A" || event.key === "a")) {
        event.preventDefault();
        toggleAdmin();
      }
    });
  }

  function renderSceneFx(name) {
    const layer = $("scene-fx");
    if (!layer) return;
    layer.replaceChildren();
    document.body.dataset.sway = "off";

    if (name === "aquarium") fxFish(layer);
    if (name === "ferris") document.body.dataset.sway = "on";
    if (name === "dorm-night-girl") fxCurtainLayer(layer, "girl");
    if (name === "dorm-night-boy") fxCurtainLayer(layer, "boy");
    renderHotspots(name);
  }

  function renderProps(name) {
    const layer = $("props-layer");
    if (!layer) return;
    layer.replaceChildren();
    for (const prop of PROPS_BY_BACKGROUND[name] || []) {
      const img = document.createElement("img");
      img.className = "prop";
      img.src = `./props/${prop.src}.webp`;
      img.alt = "";
      img.style.left = `${prop.left}%`;
      img.style.bottom = `${prop.bottom}%`;
      img.style.setProperty("--h", `${prop.h}px`);
      layer.append(img);
    }
  }

  function currentPose() {
    return document.body.dataset.pose || "stand";
  }

  function spriteFor(who, mood, pose) {
    if (pose === "stand") return `./characters/${who}-${mood}.webp`;
    const base = `./characters/${who}-sit`;
    if (SEATED_MOODS[who] && SEATED_MOODS[who].has(mood)) return `${base}-${mood}.webp`;
    return `${base}.webp`;
  }

  function updateSprite(el, who, mood) {
    const img = el.querySelector("img");
    if (!img) return;
    const src = spriteFor(who, mood, currentPose());
    const file = src.split("/").pop();
    if (!img.src.endsWith(file)) img.src = src;
  }

  function refreshSprites() {
    const girl = $("girl");
    updateSprite(girl, "girl", girl.dataset.expression || "normal");
    updateSprite($("boy"), "boy", "normal");
  }

  function setExpression(mood) {
    const next = MOODS.includes(mood) ? mood : "normal";
    const girl = $("girl");
    if (girl.dataset.expression !== next) {
      girl.dataset.expression = next;
      document.body.dataset.mood = next;
      updateSprite(girl, "girl", next);
      girl.classList.remove("pop");
      void girl.offsetWidth;
      girl.classList.add("pop");
    }
  }

  function setBackground(name) {
    const scene = $("scene");
    const next = BACKGROUNDS.includes(name) ? name : "campus";
    for (const className of [...scene.classList]) {
      if (className.startsWith("bg-")) scene.classList.remove(className);
    }
    scene.classList.add(`bg-${next}`);
    scene.dataset.bg = next;
    document.body.dataset.dark = NIGHT_BACKGROUNDS.has(next) ? "true" : "false";
    document.body.dataset.pose = POSE_BY_BACKGROUND[next] || "stand";
    document.body.dataset.cast = SCENE_CAST_BACKGROUNDS.has(next)
      ? "scene" : "standing";
    refreshSprites();
    renderProps(next);
    renderSceneFx(next);
    $("rain-layer").classList.toggle(
      "active", next === "rain" || next === "dorm-storm-girl");
  }

  // 手绘立绘：每个表情一张 WebP，缺失时回退到旧的 SVG 造型
  function characterMarkup(who, mood, pose = "stand") {
    return `<span class="chara-shadow" aria-hidden="true"></span><img class="chara-img" src="${spriteFor(who, mood, pose)}" alt="" draggable="false" decoding="async">`;
  }

  function injectCharacters() {
    const boy = $("boy");
    const girl = $("girl");
    document.body.dataset.art = "flat-v2";
    document.body.dataset.pose = "stand";
    boy.innerHTML = characterMarkup("boy", "normal");
    girl.innerHTML = characterMarkup("girl", "normal");
    for (const el of [boy, girl]) {
      const img = el.querySelector("img");
      if (!img) continue;
      const who = el.id;
      let triedSeated = false;
      img.addEventListener("error", () => {
        if (!triedSeated && currentPose() !== "stand") {
          triedSeated = true;
          img.src = `./characters/${who}-sit.webp`;
          return;
        }
        console.warn(`[心动选修课] 立绘加载失败，回退到 SVG：${img.src}`);
        el.innerHTML = who === "boy" ? BOY_SVG : GIRL_SVG;
      });
    }
    for (const who of ["boy", "girl"]) {
      for (const mood of MOODS) {
        const pre = new Image();
        pre.src = `./characters/${who}-${mood}.webp`;
      }
      for (const suffix of ["", "-smile", "-shy"]) {
        const pre = new Image();
        pre.src = `./characters/${who}-sit${suffix}.webp`;
      }
    }
  }

  function renderMoments() {
    const feed = $("moments-feed");
    feed.replaceChildren();
    for (const item of MOMENTS) {
      const card = document.createElement("article");
      card.className = "moment-card";
      const meta = document.createElement("div");
      meta.className = "moment-meta";
      meta.innerHTML = '<span class="moment-avatar">奶</span>' +
        '<span class="moment-name">奶龙酱</span>' +
        '<span class="moment-time">' + item.time + "</span>";
      const text = document.createElement("p");
      text.className = "moment-text";
      text.textContent = item.text;
      const art = document.createElement("div");
      art.className = "moment-art";
      art.innerHTML = MOMENT_ART[item.art] || "";
      card.append(meta, text, art);
      feed.append(card);
    }
  }

  function openMoments() {
    renderMoments();
    $("moments-panel").classList.remove("hidden");
  }

  function closeMoments() {
    $("moments-panel").classList.add("hidden");
  }

  function renderParticles() {
    const wrap = $("particles");
    wrap.replaceChildren();
    const tints = [
      "rgba(255, 255, 255, .72)",
      "rgba(255, 214, 166, .68)",
      "rgba(255, 170, 185, .5)",
      "rgba(174, 220, 180, .55)",
    ];
    for (let i = 0; i < 18; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--size", `${3 + Math.random() * 5}px`);
      particle.style.setProperty("--delay", `${Math.random() * 10}s`);
      particle.style.setProperty("--duration", `${10 + Math.random() * 11}s`);
      particle.style.setProperty("--drift", `${-34 + Math.random() * 68}px`);
      particle.style.setProperty("--tint", tints[i % tints.length]);
      wrap.append(particle);
    }
  }

  function factLabel(key) {
    return story.facts[key] ? story.facts[key].label : key;
  }

  function updateMemoryCount() {
    const learned = FACT_KEYS.filter((key) => state.memories[key]).length;
    $("memory-count").textContent = `${learned} / ${FACT_KEYS.length}`;
  }

  function learnFacts(keys) {
    if (!Array.isArray(keys) || !keys.length) return;
    const newly = [];
    for (const key of keys) {
      if (!story.facts[key] || state.memories[key]) continue;
      state.memories[key] = true;
      newly.push(key);
    }
    if (!newly.length) return;
    updateMemoryCount();
    if (!$("memory-panel").classList.contains("hidden")) renderMemoryPanel();
    $("memory-toast").textContent =
      `已记住 · ${newly.map((key) => factLabel(key)).join(" · ")}`;
    $("memory-toast").classList.add("show");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
      $("memory-toast").classList.remove("show");
    }, 2500);
    saveProgress();
  }

  function renderMemoryPanel() {
    const list = $("memory-list");
    list.replaceChildren();
    for (const key of FACT_KEYS) {
      const fact = story.facts[key];
      const learned = Boolean(state.memories[key]);
      const item = document.createElement("li");
      item.className = `memory-item ${learned ? "known" : "unknown"}`;
      const mark = document.createElement("span");
      mark.className = "memory-mark";
      mark.textContent = learned ? "✦" : "？";
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = learned ? fact.label : "？？？";
      const hint = document.createElement("p");
      hint.textContent = learned ? fact.hint : "还没听到这个细节。";
      body.append(title, hint);
      item.append(mark, body);
      list.append(item);
    }
  }

  function openMemory() {
    if (document.body.dataset.phase !== "playing") return;
    renderMemoryPanel();
    show($("memory-panel"));
    state.paused = true;
    window.clearTimeout(state.chatTimer);
    state.chatTimer = 0;
  }

  function closeMemory() {
    hide($("memory-panel"));
    state.paused = false;
    if (state.mode === "chat" && !state.locked && !state.optionsShown &&
        state.queueIndex < state.queue.length) {
      scheduleChatAdvance(state.currentLine);
    }
  }

  function saveProgress() {
    const payload = {
      version: 2,
      sceneId: state.sceneId,
      score: state.score,
      flags: state.flags,
      tagStats: state.tagStats,
      memories: state.memories,
      factResults: state.factResults,
      finalTone: state.finalTone,
      location: state.location,
      history: state.history,
      chapterId: state.chapterId,
      finished: state.finished,
      endingId: state.endingId,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (_) {
      /* 本地存储不可用时仍可继续游玩。 */
    }
  }

  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== 2) return null;
      if (data.finished) {
        return story.endings.some((ending) => ending.id === data.endingId)
          ? data : null;
      }
      if (!story.scenes[data.sceneId]) return null;
      if (typeof data.score !== "number") return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function resetState() {
    clearTimers();
    Object.assign(state, {
      sceneId: story.start,
      score: story.meta.startScore,
      flags: {},
      tagStats: {},
      memories: {},
      factResults: {},
      finalTone: null,
      location: null,
      history: [],
      chapterId: null,
      mode: "dialogue",
      queue: [],
      queueIndex: 0,
      queueKind: "scene",
      pendingNext: null,
      typing: false,
      fullText: "",
      optionsShown: false,
      activeOptions: [],
      customOpen: false,
      customEditor: null,
      locked: false,
      paused: false,
      finished: false,
      endingId: null,
      currentLine: null,
    });
    $("memory-toast").classList.remove("show");
    document.body.removeAttribute("data-ending");
  }

  function applySave(data) {
    state.sceneId = data.sceneId;
    state.score = clampScore(Number(data.score) || story.meta.startScore);
    state.flags = data.flags && typeof data.flags === "object" ? data.flags : {};
    state.tagStats =
      data.tagStats && typeof data.tagStats === "object" ? data.tagStats : {};
    state.memories =
      data.memories && typeof data.memories === "object" ? data.memories : {};
    state.factResults =
      data.factResults && typeof data.factResults === "object"
        ? data.factResults : {};
    state.finalTone = data.finalTone || null;
    state.location = data.location || null;
    state.history = Array.isArray(data.history) ? data.history : [];
    state.chapterId = data.chapterId || null;
    state.finished = Boolean(data.finished);
    state.endingId = data.endingId || null;
    state.queue = [];
    state.queueIndex = 0;
    state.queueKind = "scene";
    state.pendingNext = null;
    state.typing = false;
    state.optionsShown = false;
    state.activeOptions = [];
    state.customOpen = false;
    state.customEditor = null;
    state.locked = false;
    state.paused = false;
    state.currentLine = null;
    state.mode = "dialogue";
    updateMemoryCount();
  }

  function updateContinueButton() {
    const save = readSave();
    const button = $("continue-button");
    button.classList.toggle("hidden", !save);
    if (save) {
      button.textContent = save.finished ? "查看上次结局" : "继续上次";
    }
  }

  function updateHud(scene) {
    const chapter = story.chapters[scene.chapter];
    $("chapter-chip").textContent = chapter ? chapter.label : "";
    $("step-chip").textContent = scene.step
      ? `第 ${scene.step} / ${TOTAL_CHOICES} 次选择`
      : "剧情推进";
    updateMemoryCount();
  }

  function startGame(fromSave) {
    clearTimers();
    hide($("memory-panel"));
    hide($("chapter-overlay"));
    $("options").replaceChildren();
    $("chat-options").replaceChildren();
    $("chat-messages").replaceChildren();
    if (fromSave) {
      const data = readSave();
      if (data) {
        applySave(data);
        if (data.finished) {
          setPhase("ending");
          showEnding(story.endings.find((ending) => ending.id === data.endingId));
          return;
        }
        setPhase("playing");
        renderScene(data.sceneId);
        return;
      }
    }
    clearSave();
    resetState();
    setPhase("playing");
    setMode("dialogue");
    updateContinueButton();
    renderScene(story.start);
  }

  function restartGame() {
    clearSave();
    resetState();
    hide($("memory-panel"));
    hide($("chapter-overlay"));
    setPhase("playing");
    setMode("dialogue");
    updateContinueButton();
    renderScene(story.start);
  }

  function withChapterOverlay(scene, callback) {
    const chapter = story.chapters[scene.chapter];
    if (!chapter || state.chapterId === scene.chapter) {
      callback();
      return;
    }
    state.chapterId = scene.chapter;
    saveProgress();
    $("chapter-number").textContent = chapter.number;
    $("chapter-title").textContent = chapter.title;
    $("chapter-subtitle").textContent = chapter.subtitle;
    const overlay = $("chapter-overlay");
    overlay.classList.remove("hidden", "show");
    void overlay.offsetWidth;
    overlay.classList.add("show");
    state.locked = true;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(state.chapterTimer);
      state.chapterTimer = 0;
      overlay.classList.remove("show");
      window.setTimeout(() => overlay.classList.add("hidden"), 520);
      state.locked = false;
      state.chapterSkip = null;
      callback();
    };
    state.chapterSkip = finish;
    overlay.onclick = (event) => {
      event.stopPropagation();
      finish();
    };
    state.chapterTimer = window.setTimeout(finish, 1750);
  }

  function renderScene(sceneId) {
    const scene = story.scenes[sceneId];
    if (!scene) {
      finishGame();
      return;
    }
    state.sceneId = sceneId;
    state.queue = Array.isArray(scene.lines) ? scene.lines.slice() : [];
    state.queueIndex = 0;
    state.queueKind = "scene";
    state.pendingNext = null;
    state.currentLine = null;
    state.typing = false;
    state.optionsShown = false;
    state.activeOptions = [];
    state.customOpen = false;
    state.customEditor = null;
    state.locked = false;
    state.paused = false;
    state.finished = false;
    state.endingId = null;
    state.location = scene.location || state.location;
    setMode(scene.mode || "dialogue");
    setBackground(scene.background);
    setExpression("normal");
    updateHud(scene);
    $("narration").textContent = scene.narration || "";
    $("options").replaceChildren();
    $("chat-options").replaceChildren();
    $("chat-messages").replaceChildren();
    chatStatusBase = scene.narration || "微信 · 在线";
    $("chat-status").textContent = chatStatusBase;
    $("next-hint").textContent = "点击继续";
    $("next-hint").classList.add("hidden");
    $("dialogue-card").dataset.speaker = "narrator";
    $("speaker").textContent = "旁白";
    $("dialogue-text").textContent = "";
    saveProgress();
    withChapterOverlay(scene, playNextLine);
  }

  function playNextLine() {
    if (state.locked || document.body.dataset.phase !== "playing") return;
    window.clearTimeout(state.chatTimer);
    state.chatTimer = 0;
    if (state.queueIndex >= state.queue.length) {
      onLineFinished();
      return;
    }
    const line = state.queue[state.queueIndex];
    state.queueIndex += 1;
    state.currentLine = line;
    applyLine(line);
  }

  function applyLine(line) {
    if (!line) return;
    if (Array.isArray(line.learn)) learnFacts(line.learn);
    if (line.effect === "flash") triggerFlash();
    if (line.speaker === "奶龙酱" && line.mood) setExpression(line.mood);
    if (state.mode === "chat") {
      appendChatLine(line);
      onLineFinished();
      return;
    }
    const speaker = line.speaker || "旁白";
    $("speaker").textContent = speaker;
    $("dialogue-card").dataset.speaker =
      speaker === "奶龙酱" ? "girl" : speaker === "你" ? "you" : "narrator";
    $("next-hint").classList.remove("hidden");
    $("next-hint").textContent = "点击跳过";
    typeText(line.text || "");
  }

  function typeText(text) {
    window.clearTimeout(state.typeTimer);
    state.fullText = text;
    state.typing = true;
    $("dialogue-text").textContent = "";
    if (!text) {
      finishTyping();
      return;
    }
    let index = 0;
    const step = () => {
      if (!state.typing) return;
      index += 1;
      $("dialogue-text").textContent = text.slice(0, index);
      if (index >= text.length) {
        finishTyping();
        return;
      }
      state.typeTimer = window.setTimeout(step, TYPE_SPEED);
    };
    state.typeTimer = window.setTimeout(step, TYPE_SPEED);
  }

  function finishTyping() {
    if (!state.typing) return;
    window.clearTimeout(state.typeTimer);
    state.typeTimer = 0;
    state.typing = false;
    $("dialogue-text").textContent = state.fullText;
    onLineFinished();
  }

  function setContinueHint() {
    $("next-hint").textContent = "点击继续";
    $("next-hint").classList.remove("hidden");
  }

  function onLineFinished() {
    const scene = story.scenes[state.sceneId];
    const atEnd = state.queueIndex >= state.queue.length;
    if (!atEnd) {
      if (state.mode === "chat") {
        scheduleChatAdvance(state.currentLine);
      } else {
        setContinueHint();
      }
      return;
    }
    if (state.queueKind === "reaction") {
      if (state.mode === "chat") {
        state.chatTimer = window.setTimeout(() => {
          if (!state.paused) showChatContinue();
        }, 700);
      } else {
        setContinueHint();
      }
      return;
    }
    if (scene && scene.options && scene.options.length) {
      if (state.mode === "chat") {
        state.chatTimer = window.setTimeout(() => {
          if (!state.paused) showOptions();
        }, 650);
      } else {
        showOptions();
      }
      return;
    }
    if (state.mode === "chat") {
      state.chatTimer = window.setTimeout(() => {
        if (!state.paused) showChatContinue();
      }, 650);
    } else {
      setContinueHint();
    }
  }

  function scheduleChatAdvance(line) {
    if (state.paused) return;
    window.clearTimeout(state.chatTimer);
    const textLength = line && line.text ? line.text.length : 0;
    const delay = line && line.speaker === "时间"
      ? 520
      : Math.min(2800, 950 + textLength * 26);
    state.chatTimer = window.setTimeout(() => {
      state.chatTimer = 0;
      if (!state.paused && state.mode === "chat" && !state.locked) {
        playNextLine();
      }
    }, delay);
  }

  function advance() {
    if (state.locked || state.paused) return;
    if (document.body.dataset.phase !== "playing") return;
    if (!$("memory-panel").classList.contains("hidden")) return;
    if (state.optionsShown) return;
    if (state.typing) {
      finishTyping();
      return;
    }
    if (state.queueIndex < state.queue.length) {
      window.clearTimeout(state.chatTimer);
      state.chatTimer = 0;
      playNextLine();
      return;
    }
    onQueueFinished();
  }

  function onQueueFinished() {
    if (state.locked) return;
    state.locked = true;
    window.clearTimeout(state.chatTimer);
    state.chatTimer = 0;
    hide($("next-hint"));
    const kind = state.queueKind;
    if (kind === "reaction") {
      const next = state.pendingNext;
      state.pendingNext = null;
      state.queueKind = "scene";
      if (next) renderScene(next);
      else finishGame();
      return;
    }
    const scene = story.scenes[state.sceneId];
    if (scene && scene.options && scene.options.length) {
      state.locked = false;
      showOptions();
      return;
    }
    if (scene && scene.next) {
      renderScene(scene.next);
      return;
    }
    finishGame();
  }

  function availableOptions(scene) {
    return (scene.options || []).filter((option) => {
      if (!option || !option.requires) return true;
      return option.requires.every((clue) => Boolean(state.clues[clue]));
    });
  }

  function startChoiceTimer(scene, count) {
    window.clearTimeout(state.choiceTimer);
    const bar = document.querySelector(".choice-timer");
    if (!scene.timer || !bar) return;
    let left = scene.timer;
    const total = scene.timer;
    bar.style.setProperty("--left", "1");
    const tick = () => {
      left -= 0.1;
      bar.style.setProperty("--left", String(Math.max(0, left / total)));
      if (left <= 0) {
        window.clearTimeout(state.choiceTimer);
        const fallback = state.activeOptions.findIndex((o) => o && o.fallback);
        chooseOption(fallback >= 0 ? fallback : state.activeOptions.length - 1);
        return;
      }
      state.choiceTimer = window.setTimeout(tick, 100);
    };
    state.choiceTimer = window.setTimeout(tick, 100);
  }

  function showOptions() {
    if (state.optionsShown || state.locked) return;
    const scene = story.scenes[state.sceneId];
    if (!scene || !scene.options || !scene.options.length) return;
    const pool = availableOptions(scene);
    if (!pool.length) return;
    state.optionsShown = true;
    state.activeOptions = pool;
    state.locked = false;
    window.clearTimeout(state.chatTimer);
    state.chatTimer = 0;
    hide($("next-hint"));
    if (state.mode === "chat") renderChatOptions(pool);
    else renderDialogueOptions(pool);
    if (scene.timer) {
      const host = $("options");
      if (host) {
        const bar = document.createElement("div");
        bar.className = "choice-timer";
        bar.style.setProperty("--total", String(scene.timer));
        host.append(bar);
      }
    }
    startChoiceTimer(scene, pool.length);
  }

  function renderDialogueOptions(options) {
    const scene = story.scenes[state.sceneId];
    const container = $("options");
    container.replaceChildren();
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.style.animationDelay = `${index * 80}ms`;
      const badge = document.createElement("span");
      badge.className = "option-index";
      badge.textContent = String(index + 1);
      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option.text;
      button.append(badge, text);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        chooseOption(index);
      });
      container.append(button);
    });
    if (scene && scene.custom) {
      const customButton = document.createElement("button");
      customButton.type = "button";
      customButton.className = "option-button custom-option-button";
      customButton.style.animationDelay = `${options.length * 80}ms`;
      const badge = document.createElement("span");
      badge.className = "option-index";
      badge.textContent = "写";
      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = "自己说一句……";
      customButton.append(badge, text);
      customButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openCustomEditor("dialogue", customButton);
      });
      container.append(customButton);
    }
  }

  function renderChatOptions(options) {
    const scene = story.scenes[state.sceneId];
    const container = $("chat-options");
    container.replaceChildren();
    const label = document.createElement("p");
    label.className = "chat-choice-label";
    label.textContent = "选择你的回复";
    container.append(label);
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-option";
      button.style.animationDelay = `${index * 70}ms`;
      button.textContent = option.text;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        chooseOption(index);
      });
      container.append(button);
    });
    if (scene && scene.custom) {
      const customButton = document.createElement("button");
      customButton.type = "button";
      customButton.className = "chat-option custom-chat-option";
      customButton.style.animationDelay = `${options.length * 70}ms`;
      customButton.textContent = "自己写一句回复……";
      customButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openCustomEditor("chat", customButton);
      });
      container.append(customButton);
    }
    scrollChat();
  }

  function normalizeCustomText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\s，。！？、；：,.!?;:'"“”‘’（）()《》<>…—\-_/\\[\]{}·~`|]+/g, "");
  }

  function matchCustomOption(scene, text) {
    const custom = scene && scene.custom;
    const normalized = normalizeCustomText(text);
    if (!custom || !Array.isArray(custom.rules) || !normalized) return 0;
    let bestIndex = -1;
    let bestScore = 0;
    custom.rules.forEach((rule) => {
      const index = Number(rule.option);
      if (!Number.isInteger(index) || index < 0 || index >= scene.options.length) {
        return;
      }
      let score = 0;
      (rule.keys || []).forEach((key) => {
        const normalizedKey = normalizeCustomText(key);
        if (normalizedKey && normalized.includes(normalizedKey)) {
          score += normalizedKey.length + 2;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    if (bestIndex >= 0) return bestIndex;
    const fallback = Number.isInteger(custom.fallback) ? custom.fallback : 0;
    return fallback >= 0 && fallback < scene.options.length ? fallback : 0;
  }

  function closeCustomEditor() {
    const editor = state.customEditor ||
      document.querySelector(".custom-editor");
    if (editor) editor.remove();
    document
      .querySelectorAll(".option-button[disabled], .chat-option[disabled]")
      .forEach((button) => {
        button.disabled = false;
      });
    state.customOpen = false;
    state.customEditor = null;
    const trigger = document.querySelector(
      ".custom-option-button, .custom-chat-option");
    if (trigger) trigger.focus({ preventScroll: true });
  }

  function openCustomEditor(mode, trigger) {
    if (state.customOpen) {
      closeCustomEditor();
      return;
    }
    const scene = story.scenes[state.sceneId];
    if (!scene || !scene.custom || !scene.options) return;
    const container = mode === "chat" ? $("chat-options") : $("options");
    container
      .querySelectorAll(".option-button, .chat-option")
      .forEach((button) => {
        if (button !== trigger) button.disabled = true;
      });

    const editor = document.createElement("form");
    editor.className = `custom-editor custom-editor-${mode}`;
    const input = document.createElement("textarea");
    input.className = "custom-input";
    input.rows = 2;
    input.maxLength = 40;
    input.placeholder = scene.custom.placeholder || "用你自己的话说……";
    input.setAttribute("aria-label", "自己说一句");

    const foot = document.createElement("div");
    foot.className = "custom-editor-foot";
    const count = document.createElement("span");
    count.className = "custom-count";
    count.textContent = "0 / 40";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "custom-cancel";
    cancel.textContent = "取消";
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "custom-submit";
    submit.textContent = "说出口";
    foot.append(count, cancel, submit);
    editor.append(input, foot);

    let composing = false;
    input.addEventListener("compositionstart", () => {
      composing = true;
    });
    input.addEventListener("compositionend", () => {
      composing = false;
    });
    input.addEventListener("input", () => {
      count.textContent = `${input.value.length} / 40`;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeCustomEditor();
        return;
      }
      if (event.key === "Enter" && !event.shiftKey &&
          !event.isComposing && !composing) {
        event.preventDefault();
        event.stopPropagation();
        editor.requestSubmit();
      }
    });
    cancel.addEventListener("click", (event) => {
      event.stopPropagation();
      closeCustomEditor();
    });
    editor.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    editor.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const text = input.value.trim();
      if (!text) {
        editor.classList.remove("custom-editor-nudge");
        void editor.offsetWidth;
        editor.classList.add("custom-editor-nudge");
        input.focus();
        return;
      }
      const index = matchCustomOption(scene, text);
      closeCustomEditor();
      chooseOption(index, text);
    });

    container.append(editor);
    state.customOpen = true;
    state.customEditor = editor;
    if (mode === "chat") scrollChat();
    window.requestAnimationFrame(() => input.focus());
  }

  function showChatContinue() {
    const container = $("chat-options");
    container.replaceChildren();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-continue";
    button.textContent = "继续 →";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onQueueFinished();
    });
    container.append(button);
    scrollChat();
  }

  function chooseOption(index, customText = "") {
    if (state.locked || !state.optionsShown) return;
    const scene = story.scenes[state.sceneId];
    const option = scene && scene.options ? scene.options[index] : null;
    if (!option) return;
    const spokenText = String(customText || "").trim() || option.text;
    const isCustom = Boolean(String(customText || "").trim());
    state.locked = true;
    state.optionsShown = false;
    state.activeOptions = [];
    state.customOpen = false;
    state.customEditor = null;
    $("options").replaceChildren();
    $("chat-options").replaceChildren();
    hide($("next-hint"));

    // 选项里挂了小游戏：先开游戏，结束后再接台词与下一场
    if (option.game === "gomoku" && window.LoveGomoku) {
      state.queue = [];
      state.queueIndex = 0;
      state.pendingNext = option.next || "";
      state.locked = true;
      saveProgress();
      const invite = option.invite || "";
      window.LoveGomoku.open({
        onFinish: (result) => {
          let line;
          let bonus = 0;
          if (result === "win") {
            line = "你赢了。她盯着棋盘看了两秒，忽然笑出来：「不算，你刚才那手是偷袭。」";
            bonus = 6;
            state.flags.gomokuWin = true;
          } else if (result === "lose") {
            line = "她赢了，却没一点赢家的样子，把棋子一颗颗收回去：「你让我的吧。」";
            bonus = 3;
          } else if (result === "draw") {
            line = "棋盘下满了，谁也没连成五子。她托着腮：「这算不算另一种默契？」";
            bonus = 4;
          } else {
            line = "你们改天再下。她把手机翻过去，屏幕的光映在天花板上。";
          }
          state.score = clampScore(state.score + bonus);
          state.flags.gomokuPlayed = true;
          const lines = [];
          if (invite) lines.push({ speaker: "你", text: invite });
          if (line) lines.push({ speaker: "旁白", text: line });
          state.queueKind = "reaction";
          state.queue = lines;
          state.queueIndex = 0;
          state.locked = false;
          saveProgress();
          updateMemoryCount();
          if (!lines.length) onQueueFinished();
          else playNextLine();
        },
      });
      return;
    }

    const delta = Number(option.delta) || 0;
    state.score = clampScore(state.score + delta);
    const stats = state.tagStats[option.tag] ||
      (state.tagStats[option.tag] = { count: 0, good: 0, bad: 0, delta: 0 });
    stats.count += 1;
    stats.delta += delta;
    if (delta > 0) stats.good += 1;
    else if (delta < 0) stats.bad += 1;

    if (option.flag) state.flags[option.flag] = true;
    if (option.finalTone) state.finalTone = option.finalTone;
    if (scene.location) state.location = scene.location;

    const factKey = option.factKey || scene.memoryFact;
    if (factKey && story.facts[factKey]) {
      state.factResults[factKey] = Boolean(option.factHit);
    }

    state.history.push({
      sceneId: state.sceneId,
      sceneLabel: scene.narration || "",
      chapter: scene.chapter,
      text: option.text,
      delta,
      tag: option.tag,
      note: option.note || "",
      factKey: factKey || null,
      factHit: factKey ? Boolean(option.factHit) : null,
      custom: isCustom,
    });

    if (option.mood) setExpression(option.mood);
    const useCold = option.reactionCold && state.score < 60;
    const reaction = useCold ? option.reactionCold : option.reaction;
    const lines = Array.isArray(reaction) ? reaction.slice() : [];
    if (state.mode === "chat") {
      appendChatBubble("你", spokenText);
    } else {
      lines.unshift({ speaker: "你", text: spokenText });
    }

    state.queueKind = "reaction";
    state.queue = lines;
    state.queueIndex = 0;
    state.pendingNext = option.next || "";
    state.locked = false;
    saveProgress();
    updateMemoryCount();
    if (!lines.length) {
      onQueueFinished();
      return;
    }
    if (state.mode === "chat") {
      window.clearTimeout(state.chatTimer);
      state.chatTimer = window.setTimeout(() => {
        if (!state.paused) playNextLine();
      }, 420);
    } else {
      playNextLine();
    }
  }

  function appendChatLine(line) {
    appendChatBubble(line.speaker || "旁白", line.text || "");
  }

  function appendChatBubble(speaker, text) {
    if (speaker === "你") $("chat-status").textContent = "对方正在输入…";
    else if (speaker === "奶龙酱") $("chat-status").textContent = chatStatusBase;
    const messages = $("chat-messages");
    if (speaker === "时间") {
      const node = document.createElement("div");
      node.className = "chat-time";
      node.textContent = text;
      messages.append(node);
      scrollChat();
      return;
    }
    if (speaker === "旁白") {
      const node = document.createElement("div");
      node.className = "chat-narration";
      node.textContent = text;
      messages.append(node);
      scrollChat();
      return;
    }
    const row = document.createElement("div");
    row.className = `chat-row ${speaker === "奶龙酱" ? "left" : "right"}`;
    if (speaker === "奶龙酱") {
      const avatar = document.createElement("span");
      avatar.className = "chat-avatar-small";
      avatar.textContent = "奶";
      row.append(avatar);
    }
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${speaker === "奶龙酱" ? "left" : "right"}`;
    bubble.textContent = text;
    row.append(bubble);
    messages.append(row);
    scrollChat();
  }

  function scrollChat() {
    const messages = $("chat-messages");
    window.requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function triggerFlash() {
    const flash = $("flash-overlay");
    flash.classList.remove("flash");
    void flash.offsetWidth;
    flash.classList.add("flash");
    window.setTimeout(() => flash.classList.remove("flash"), 760);
  }

  function pickEnding() {
    const memoryHits = Object.values(state.factResults)
      .filter((value) => value === true).length;
    const ordered = [...story.endings]
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
    return ordered.find((ending) => {
      if (ending.requiresFlag && !state.flags[ending.requiresFlag]) return false;
      if (ending.fallback) return false;
      if (state.score < ending.minScore || state.score > ending.maxScore) {
        return false;
      }
      if (ending.requiresMemory && memoryHits < ending.requiresMemory) {
        return false;
      }
      if (ending.tones && !ending.tones.includes(state.finalTone)) return false;
      return true;
    }) || story.endings.find((ending) => ending.fallback) ||
      story.endings[story.endings.length - 1];
  }

  function topTags(limit) {
    const entries = Object.entries(state.tagStats)
      .map(([key, stats]) => ({
        key,
        label: story.tags[key] || key,
        count: Number(stats.count) || 0,
        delta: Number(stats.delta) || 0,
      }))
      .filter((item) => item.count > 0);
    entries.sort((a, b) => b.count - a.count || b.delta - a.delta);
    return entries.slice(0, limit).map((item) => item.label);
  }

  function renderMemoryReview() {
    const list = $("memory-review");
    list.replaceChildren();
    for (const key of FACT_KEYS) {
      const fact = story.facts[key];
      const learned = Boolean(state.memories[key]);
      const result = state.factResults[key];
      let status = "还没听到这个细节";
      let cls = "unknown";
      let mark = "？";
      if (learned && result === true) {
        status = "这次接住了";
        cls = "hit";
        mark = "✓";
      } else if (learned && result === false) {
        status = "这次没有接住";
        cls = "miss";
        mark = "✕";
      } else if (learned) {
        status = "没来得及验证";
        cls = "untested";
        mark = "○";
      } else if (result === true) {
        status = "接住了，但之前没留意";
        cls = "hit";
        mark = "✓";
      }
      const item = document.createElement("li");
      item.className = `memory-review-item ${cls}`;
      const badge = document.createElement("span");
      badge.className = "memory-review-mark";
      badge.textContent = mark;
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = learned ? fact.label : "？？？";
      const hint = document.createElement("p");
      hint.textContent = learned ? fact.hint : "这一段可能藏在别的选择里。";
      const stateLabel = document.createElement("small");
      stateLabel.textContent = status;
      body.append(title, hint, stateLabel);
      item.append(badge, body);
      list.append(item);
    }
  }

  function renderChoiceReview() {
    const good = state.history
      .filter((item) => item.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
    const growth = state.history
      .filter((item) => item.delta < 0)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 2);
    fillReviewList($("choice-good"), good,
      "这一局还没有明显做得好的瞬间。");
    fillReviewList($("choice-growth"), growth,
      "这一局没有明显的扣分项，继续把倾听和尊重带进现实吧。");
  }

  function fillReviewList(container, items, emptyText) {
    container.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "review-empty";
      empty.textContent = emptyText;
      container.append(empty);
      return;
    }
    for (const item of items) {
      const li = document.createElement("li");
      const head = document.createElement("div");
      head.className = "review-head";
      const delta = document.createElement("span");
      delta.className =
        `review-delta ${item.delta > 0 ? "good" : "bad"}`;
      delta.textContent = item.delta > 0 ? `+${item.delta}` : String(item.delta);
      const scene = document.createElement("span");
      scene.className = "review-scene";
      scene.textContent = item.sceneLabel || "这一段";
      head.append(delta, scene);
      const text = document.createElement("p");
      text.className = "review-text";
      text.textContent = item.text;
      const note = document.createElement("small");
      note.className = "review-note";
      note.textContent = item.note;
      li.append(head, text, note);
      container.append(li);
    }
  }

  function showEnding(ending) {
    if (!ending) {
      finishGame();
      return;
    }
    clearTimers();
    state.locked = true;
    state.optionsShown = false;
    state.finished = true;
    state.endingId = ending.id;
    document.body.dataset.ending = ending.id;
    setPhase("ending");
    $("ending-title").textContent = ending.title;
    $("ending-subtitle").textContent = ending.subtitle;
    const flavor = ending.flavors && state.location
      ? ending.flavors[state.location] : "";
    $("ending-flavor").textContent = flavor || "";
    $("ending-flavor").classList.toggle("hidden", !flavor);
    $("ending-text").textContent = ending.text;
    $("ending-score").textContent = String(state.score);
    $("score-ring").style.setProperty("--value", String(state.score));
    $("ending-score-fill").style.width = `${state.score}%`;
    const tags = topTags(2);
    $("ending-score-label").textContent =
      `本局心动值 ${state.score} · 你最常给出的回应：` +
      `${tags.length ? tags.join("、") : "还在观察"}`;
    renderMemoryReview();
    renderChoiceReview();
    $("ending-advice").textContent = ending.advice || "";
    $("crush-name").value = "";
    $("egg-to").textContent = "";
    $("egg-to").classList.add("hidden");
    setExpression(ending.mood || "normal");
    $("ending-screen").scrollTop = 0;
    saveProgress();
  }

  function finishGame() {
    state.locked = true;
    state.optionsShown = false;
    clearTimers();
    const ending = pickEnding();
    state.finished = true;
    state.endingId = ending.id;
    saveProgress();
    showEnding(ending);
  }

  function showEgg() {
    const name = $("crush-name").value.trim().slice(0, 16);
    const to = $("egg-to");
    if (name) {
      to.textContent = `致 ${name}`;
      to.classList.remove("hidden");
    } else {
      to.textContent = "";
      to.classList.add("hidden");
    }
    setPhase("egg");
  }

  function returnToTitle() {
    clearTimers();
    hide($("memory-panel"));
    hide($("chapter-overlay"));
    $("crush-name").value = "";
    $("egg-to").textContent = "";
    $("egg-to").classList.add("hidden");
    $("options").replaceChildren();
    $("chat-options").replaceChildren();
    state.locked = false;
    state.paused = false;
    state.mode = "dialogue";
    setMode("dialogue");
    setPhase("title");
    setBackground("campus");
    setExpression("normal");
    updateContinueButton();
  }

  $("start-button").addEventListener("click", () => startGame(false));
  $("continue-button").addEventListener("click", () => startGame(true));
  $("click-catcher").addEventListener("click", advance);
  $("dialogue-card").addEventListener("click", (event) => {
    event.stopPropagation();
    advance();
  });
  $("dialogue-card").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
    }
  });
  $("chat-messages").addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    advance();
  });
  $("chat-more").addEventListener("click", (event) => {
    event.stopPropagation();
    openMoments();
  });
  $("chat-more").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMoments();
    }
  });
  $("moments-close").addEventListener("click", closeMoments);
  for (const fxId of ["fx-dorm", "fx-radio"]) {
    $(fxId).querySelector(".curtain-hit").addEventListener("click", (event) => {
      event.stopPropagation();
      $(fxId).querySelector(".curtains").classList.toggle("closed");
      document.body.classList.add("curtain-learned");
      if ($("scene").dataset.bg === "dorm-storm-girl") triggerFlash();
    });
  }
  let pokeTimer = 0;
  $("fx-dorm").querySelector(".plush-hit").addEventListener("click", (event) => {
    event.stopPropagation();
    const layer = $("fx-dorm");
    layer.classList.remove("poked");
    void layer.offsetWidth;
    layer.classList.add("poked");
    clearTimeout(pokeTimer);
    pokeTimer = setTimeout(() => layer.classList.remove("poked"), 1800);
  });
  $("fx-pat").querySelector(".pat-hit").addEventListener("click", (event) => {
    event.stopPropagation();
    const layer = $("fx-dorm");
    layer.classList.remove("patted");
    void layer.offsetWidth;
    layer.classList.add("patted");
    const msgs = $("chat-messages");
    const row = document.createElement("div");
    row.className = "chat-narration";
    row.textContent = "你拍了拍奶龙酱";
    msgs.append(row);
    msgs.scrollTop = msgs.scrollHeight;
    window.setTimeout(() => layer.classList.remove("patted"), 1900);
  });
  $("memory-button").addEventListener("click", (event) => {
    event.stopPropagation();
    openMemory();
  });
  $("memory-close").addEventListener("click", closeMemory);
  $("memory-panel").addEventListener("click", (event) => {
    if (event.target === $("memory-panel")) closeMemory();
  });
  $("egg-button").addEventListener("click", showEgg);
  $("crush-name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      showEgg();
    }
  });
  $("egg-back").addEventListener("click", returnToTitle);
  $("again-button").addEventListener("click", restartGame);
  $("title-button").addEventListener("click", returnToTitle);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.customOpen) {
        event.preventDefault();
        closeCustomEditor();
        return;
      }
      if (!$("memory-panel").classList.contains("hidden")) closeMemory();
      if (!$("moments-panel").classList.contains("hidden")) closeMoments();
      return;
    }
    if (state.customOpen) return;
    if (!$("chapter-overlay").classList.contains("hidden")) {
      if ((event.key === "Enter" || event.key === " ") && state.chapterSkip) {
        event.preventDefault();
        state.chapterSkip();
      }
      return;
    }
    if (document.body.dataset.phase !== "playing") return;
    if (!$("memory-panel").classList.contains("hidden")) return;
    if (!$("moments-panel").classList.contains("hidden")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
      return;
    }
    if (state.optionsShown && !state.locked) {
      const number = Number(event.key);
      if (number >= 1 && number <= state.activeOptions.length) {
        event.preventDefault();
        chooseOption(number - 1);
      }
    }
  });

  initAdmin();
  initClueUI();
  initMinigameUI();
  initParallax();
  injectCharacters();
  renderParticles();
  for (const name of BACKGROUNDS) {
    const img = new Image();
    img.src = `./backgrounds/${name}.svg`;
  }
  setBackground("campus");
  setExpression("normal");
  updateMemoryCount();
  updateContinueButton();
  setMode("dialogue");
  setPhase("title");
})();
