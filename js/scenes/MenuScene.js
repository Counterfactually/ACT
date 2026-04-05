// ============================================================
//  MenuScene — Title screen  (iPad-mini safe layout)
// ============================================================

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x1a2a4a);

    // Decorative dim nuggets
    this.add.image(60, GAME.HEIGHT / 2, 'nugget').setScale(2.5).setAlpha(0.2);
    this.add.image(GAME.WIDTH - 60, GAME.HEIGHT / 2, 'nugget').setScale(2.5).setAlpha(0.2).setFlipX(true);

    // ── Title ─────────────────────────────────────────────────
    const title1 = this.add.text(GAME.WIDTH / 2, 52, '🍗 CHICKEN NUGGET', {
      fontSize: '38px', fill: '#FFD700',
      stroke: '#8B4500', strokeThickness: 7,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const title2 = this.add.text(GAME.WIDTH / 2, 104, 'O B B Y', {
      fontSize: '64px', fill: '#FF8C00',
      stroke: '#8B4500', strokeThickness: 10,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [title1, title2], y: '-=8',
      duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this.add.text(GAME.WIDTH / 2, 174, 'Obstacle Course Adventure!', {
      fontSize: '18px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // ── How to play ───────────────────────────────────────────
    this.add.text(GAME.WIDTH / 2, 218, [
      '🥕 STOMP veggies    🍅 SHOOT with power-ups',
      '⚠️  Dodge condiment enemies!    🏁 Reach the flag!',
      '🍔 Grab the Burger Buddy for a helper companion!',
    ].join('\n'), {
      fontSize: '13px', fill: '#ccddff',
      stroke: '#000000', strokeThickness: 2,
      fontFamily: 'Arial, sans-serif',
      align: 'center', lineSpacing: 5,
    }).setOrigin(0.5);

    // ── Buttons — stacked for reliable iPad tapping ───────────
    this._makeButton(GAME.WIDTH / 2, 316, '▶  PLAY', 0x22aa44, 0x44ee66, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    this._makeButton(GAME.WIDTH / 2, 394, '🏆  HIGH SCORES', 0xaa6600, 0xee9900, () => {
      this.scene.start('LeaderboardScene', { fromMenu: true });
    });

    // ── Marching decorative enemies ───────────────────────────
    ['carrot', 'broccoli', 'cabbage', 'ketchup_e', 'mustard_e'].forEach((key, i) => {
      const img = this.add.image(-60, GAME.HEIGHT - 28, key).setScale(0.55).setAlpha(0.5);
      this.tweens.add({
        targets: img, x: GAME.WIDTH + 60,
        duration: 5500 + i * 500, repeat: -1, delay: i * 800, ease: 'Linear',
      });
    });
  }

  _makeButton(x, y, label, colorNormal, colorHover, callback) {
    const w = 340, h = 66;
    const bg = this.add.graphics();
    const draw = (c) => {
      bg.clear();
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
      bg.lineStyle(3, 0xffffff, 0.65);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    };
    draw(colorNormal);

    const txt = this.add.text(x, y, label, {
      fontSize: '26px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerover',  () => { draw(colorHover);   this.tweens.add({ targets: txt, scaleX: 1.04, scaleY: 1.04, duration: 80 }); });
    zone.on('pointerout',   () => { draw(colorNormal);  this.tweens.add({ targets: txt, scaleX: 1,    scaleY: 1,    duration: 80 }); });
    zone.on('pointerdown',  callback);
  }
}
