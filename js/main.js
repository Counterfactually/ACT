// ============================================================
//  main.js — Phaser Game Configuration
// ============================================================

const config = {
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  backgroundColor: '#1a0a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // per-body gravity set individually
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    UIScene,
    WinScene,
    LeaderboardScene,
  ],
};

const game = new Phaser.Game(config);
