// ============================================================
//  MenuScene — Title screen
// ============================================================

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    // Background
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x1a2a4a);

    // Decorative nugget left/right
    this.add.image(80, GAME.HEIGHT / 2 + 30, 'nugget').setScale(3).setAlpha(0.3);
    this.add.image(GAME.WIDTH - 80, GAME.HEIGHT / 2 + 30, 'nugget').setScale(3).setAlpha(0.3).setFlipX(true);

    // Title
    const title1 = this.add.text(GAME.WIDTH / 2, 90, '🍗 CHICKEN NUGGET', {
      fontSize: '44px',
      fill: '#FFD700',
      stroke: '#8B4500',
      strokeThickness: 8,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const title2 = this.add.text(GAME.WIDTH / 2, 148, 'OBBY', {
      fontSize: '72px',
      fill: '#FF8C00',
      stroke: '#8B4500',
      strokeThickness: 10,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const sub = this.add.text(GAME.WIDTH / 2, 218, 'Obstacle Course Adventure!', {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // Bounce the title
    this.tweens.add({
      targets: [title1, title2],
      y: '-=10',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Instructions
    this.add.text(GAME.WIDTH / 2, 270, [
      '🥕 STOMP the vegetables  |  🍅 SHOOT with collected power-ups',
      '⚠️  AVOID the condiment enemies — they drain your health!',
      '🏁 Reach the flag to complete the level!',
    ].join('\n'), {
      fontSize: '14px',
      fill: '#ccddff',
      stroke: '#000000',
      strokeThickness: 2,
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    // Controls note
    this.add.text(GAME.WIDTH / 2, 338, '⌨️  Arrow Keys / WASD  |  SPACE = Shoot  |  or use on-screen buttons', {
      fontSize: '13px',
      fill: '#aaaaaa',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // PLAY button
    this._makeButton(GAME.WIDTH / 2 - 120, 400, '▶ PLAY', 0x22aa44, 0x33ee66, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    // HIGH SCORES button
    this._makeButton(GAME.WIDTH / 2 + 120, 400, '🏆 SCORES', 0xaa6600, 0xee9900, () => {
      this.scene.start('LeaderboardScene', { fromMenu: true });
    });

    // Decorative veggies marching across bottom
    this._spawnDecorEnemies();
  }

  _makeButton(x, y, label, colorNormal, colorHover, callback) {
    const bg = this.add.graphics();
    const drawBg = (color) => {
      bg.clear();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(x - 100, y - 26, 200, 52, 12);
      bg.lineStyle(3, 0xffffff, 0.7);
      bg.strokeRoundedRect(x - 100, y - 26, 200, 52, 12);
    };
    drawBg(colorNormal);

    const txt = this.add.text(x, y, label, {
      fontSize: '22px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, 200, 52).setInteractive({ useHandCursor: true });
    zone.on('pointerover',  () => { drawBg(colorHover); this.tweens.add({ targets: txt, scaleX: 1.05, scaleY: 1.05, duration: 80 }); });
    zone.on('pointerout',   () => { drawBg(colorNormal); this.tweens.add({ targets: txt, scaleX: 1, scaleY: 1, duration: 80 }); });
    zone.on('pointerdown',  callback);
  }

  _spawnDecorEnemies() {
    const sprites = ['carrot', 'broccoli', 'celery', 'spinach', 'ketchup_e', 'mustard_e'];
    let x = -60;
    sprites.forEach((key, i) => {
      const img = this.add.image(x, GAME.HEIGHT - 36, key).setScale(0.6).setAlpha(0.6);
      this.tweens.add({
        targets: img,
        x: GAME.WIDTH + 60,
        duration: 6000 + i * 400,
        repeat: -1,
        delay: i * 900,
        ease: 'Linear',
      });
    });
  }
}
