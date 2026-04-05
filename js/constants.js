// ============================================================
//  Chicken Nugget OBBY — Shared Constants
// ============================================================

const GAME = {
  WIDTH: 800,
  HEIGHT: 500,
  GRAVITY: 700,
  LEVEL_WIDTH: 3300,   // total level width in pixels
  GROUND_Y: 450,       // y position of ground surface
  GROUND_H: 50,
};

const PLAYER_CFG = {
  SPEED: 230,
  JUMP_VEL: -580,
  MAX_HEALTH: 5,
  INVINCIBILITY_MS: 1200, // ms of invincibility after being hit
  SHOOT_COOLDOWN: 400,    // ms between shots
  PROJECTILE_SPEED: 480,
  PROJECTILE_RANGE: 700,  // pixels before projectile disappears
  POWER_UP_SHOTS: 6,      // shots per power-up collected
};

const STOMP_BOUNCE = -350; // upward velocity after stomping a veggie

// ---------------------------------------------------------------
//  Level Definitions
// ---------------------------------------------------------------
const LEVELS = [
  // ── Level 1: The Veggie Garden ──────────────────────────────
  {
    id: 1,
    name: 'The Veggie Garden',
    bgColor: 0x87CEEB,
    bgColor2: 0xd4f0ff,
    groundColor: 0x4a7c59,
    groundTop: 0x6abf69,
    timeLimit: 90,
    scrollSpeed: 0, // camera follows player, background parallax speed
    veggieSpeed: 90,
    condimentSpeed: 60,
    veggieTypes: ['carrot', 'broccoli', 'cabbage', 'cauliflower'],
    condimentTypes: ['ketchup_e'],
    // platforms: {x, y, w} — x/y = top-left corner
    platforms: [
      { x: 270, y: 390, w: 130 },
      { x: 480, y: 345, w: 110 },
      { x: 720, y: 370, w: 130 },
      { x: 960, y: 310, w: 110 },
      { x: 1180, y: 360, w: 130 },
      { x: 1430, y: 325, w: 110 },
      { x: 1660, y: 380, w: 130 },
      { x: 1900, y: 335, w: 110 },
      { x: 2140, y: 360, w: 130 },
      { x: 2390, y: 305, w: 110 },
      { x: 2620, y: 350, w: 130 },
      { x: 2870, y: 375, w: 150 },
    ],
    veggies: [
      { x: 580,  y: GAME.GROUND_Y, type: 'carrot' },
      { x: 750,  y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 850,  y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 1090, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 1220, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 1330, y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 1560, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 1780, y: 305,           type: 'broccoli' },
      { x: 1950, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2040, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 2280, y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 2420, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2500, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 2750, y: GAME.GROUND_Y, type: 'cabbage' },
      // Flying cauliflowers
      { x: 680,  y: 240, type: 'cauliflower' },
      { x: 1400, y: 210, type: 'cauliflower' },
      { x: 2100, y: 255, type: 'cauliflower' },
      { x: 2850, y: 225, type: 'cauliflower' },
    ],
    condiments: [
      { x: 700,  type: 'ketchup_e' },
      { x: 1200, type: 'ketchup_e' },
      { x: 1700, type: 'ketchup_e' },
      { x: 2200, type: 'ketchup_e' },
      { x: 2800, type: 'ketchup_e' },
    ],
    powerUps: [
      { x: 530,  y: 310, type: 'ketchup_pu' },
      { x: 1100, y: 290, type: 'burger_pu' },
      { x: 1480, y: 290, type: 'mustard_pu' },
      { x: 2190, y: 325, type: 'mayo_pu' },
      { x: 2700, y: 310, type: 'burger_pu' },
    ],
    flagX: 3150,
  },

  // ── Level 2: The Condiment Kitchen ──────────────────────────
  {
    id: 2,
    name: 'The Condiment Kitchen',
    bgColor: 0xFFAA55,
    bgColor2: 0xffe0a0,
    groundColor: 0x8B4513,
    groundTop: 0xc06020,
    timeLimit: 90,
    veggieSpeed: 115,
    condimentSpeed: 88,
    veggieTypes: ['celery', 'spinach', 'carrot', 'cabbage', 'cauliflower'],
    condimentTypes: ['ketchup_e', 'mustard_e'],
    platforms: [
      { x: 250, y: 385, w: 110 },
      { x: 440, y: 325, w: 100 },
      { x: 680, y: 360, w: 110 },
      { x: 920, y: 290, w: 100 },
      { x: 1150, y: 345, w: 110 },
      { x: 1390, y: 305, w: 100 },
      { x: 1620, y: 365, w: 110 },
      { x: 1870, y: 315, w: 100 },
      { x: 2100, y: 355, w: 110 },
      { x: 2350, y: 285, w: 100 },
      { x: 2580, y: 335, w: 110 },
      { x: 2830, y: 365, w: 150 },
    ],
    veggies: [
      { x: 520,  y: GAME.GROUND_Y, type: 'celery' },
      { x: 680,  y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 800,  y: GAME.GROUND_Y, type: 'spinach' },
      { x: 1050, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 1180, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 1290, y: GAME.GROUND_Y, type: 'celery' },
      { x: 1520, y: GAME.GROUND_Y, type: 'spinach' },
      { x: 1770, y: 285,           type: 'carrot' },
      { x: 1900, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2000, y: GAME.GROUND_Y, type: 'celery' },
      { x: 2250, y: GAME.GROUND_Y, type: 'spinach' },
      { x: 2380, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2480, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 2730, y: GAME.GROUND_Y, type: 'celery' },
      { x: 2960, y: GAME.GROUND_Y, type: 'cabbage' },
      // Flying cauliflowers
      { x: 760,  y: 220, type: 'cauliflower' },
      { x: 1350, y: 195, type: 'cauliflower' },
      { x: 1980, y: 235, type: 'cauliflower' },
      { x: 2680, y: 210, type: 'cauliflower' },
      { x: 3020, y: 200, type: 'cauliflower' },
    ],
    condiments: [
      { x: 660,  type: 'ketchup_e' },
      { x: 1030, type: 'mustard_e' },
      { x: 1510, type: 'ketchup_e' },
      { x: 1970, type: 'mustard_e' },
      { x: 2460, type: 'ketchup_e' },
      { x: 2920, type: 'mustard_e' },
    ],
    powerUps: [
      { x: 490,  y: 290, type: 'ketchup_pu' },
      { x: 1050, y: 268, type: 'burger_pu' },
      { x: 1390, y: 268, type: 'relish_pu' },
      { x: 2100, y: 318, type: 'mayo_pu' },
      { x: 2580, y: 298, type: 'mustard_pu' },
      { x: 2900, y: 278, type: 'burger_pu' },
    ],
    flagX: 3150,
  },

  // ── Level 3: The Salad Boss Battle ──────────────────────────
  {
    id: 3,
    name: 'The Salad Boss Battle',
    bgColor: 0x2C1654,
    bgColor2: 0x4a1a7a,
    groundColor: 0x1a0a33,
    groundTop: 0x3d1a66,
    timeLimit: 90,
    veggieSpeed: 145,
    condimentSpeed: 115,
    veggieTypes: ['carrot', 'broccoli', 'celery', 'spinach', 'cabbage', 'cauliflower'],
    condimentTypes: ['ketchup_e', 'mustard_e', 'dressing_e'],
    platforms: [
      { x: 230, y: 380, w: 100 },
      { x: 420, y: 315, w: 90 },
      { x: 660, y: 355, w: 100 },
      { x: 900, y: 285, w: 90 },
      { x: 1130, y: 335, w: 100 },
      { x: 1370, y: 295, w: 90 },
      { x: 1600, y: 355, w: 100 },
      { x: 1850, y: 305, w: 90 },
      { x: 2080, y: 345, w: 100 },
      { x: 2330, y: 275, w: 90 },
      { x: 2560, y: 325, w: 100 },
      { x: 2810, y: 355, w: 90 },
      { x: 3000, y: 380, w: 150 },
    ],
    veggies: [
      { x: 500,  y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 640,  y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 750,  y: GAME.GROUND_Y, type: 'spinach' },
      { x: 1000, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 1130, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 1250, y: GAME.GROUND_Y, type: 'celery' },
      { x: 1480, y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 1620, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 1750, y: 278,           type: 'spinach' },
      { x: 1980, y: GAME.GROUND_Y, type: 'carrot' },
      { x: 2100, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2230, y: GAME.GROUND_Y, type: 'celery' },
      { x: 2460, y: GAME.GROUND_Y, type: 'broccoli' },
      { x: 2590, y: GAME.GROUND_Y, type: 'cabbage' },
      { x: 2710, y: GAME.GROUND_Y, type: 'spinach' },
      { x: 2940, y: GAME.GROUND_Y, type: 'carrot' },
      // Flying cauliflowers — more in level 3
      { x: 620,  y: 200, type: 'cauliflower' },
      { x: 1100, y: 180, type: 'cauliflower' },
      { x: 1700, y: 215, type: 'cauliflower' },
      { x: 2300, y: 190, type: 'cauliflower' },
      { x: 2800, y: 205, type: 'cauliflower' },
      { x: 3080, y: 185, type: 'cauliflower' },
    ],
    condiments: [
      { x: 620,  type: 'ketchup_e' },
      { x: 870,  type: 'mustard_e' },
      { x: 1180, type: 'dressing_e' },
      { x: 1540, type: 'ketchup_e' },
      { x: 1820, type: 'mustard_e' },
      { x: 2100, type: 'dressing_e' },
      { x: 2440, type: 'ketchup_e' },
      { x: 2780, type: 'mustard_e' },
      { x: 3050, type: 'dressing_e' },
    ],
    powerUps: [
      { x: 470,  y: 343, type: 'ketchup_pu' },
      { x: 930,  y: 248, type: 'burger_pu' },
      { x: 1370, y: 258, type: 'mustard_pu' },
      { x: 2080, y: 308, type: 'mayo_pu' },
      { x: 2560, y: 288, type: 'relish_pu' },
      { x: 2900, y: 318, type: 'burger_pu' },
    ],
    flagX: 3150,
  },
];

// Score values
const SCORE = {
  STOMP: 100,
  SHOOT: 150,
  POWER_UP: 50,
  TIME_BONUS_MULT: 10,
};
