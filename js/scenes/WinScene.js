// ============================================================
//  WinScene — Level complete screen
// ============================================================

class WinScene extends Phaser.Scene {
  constructor() { super('WinScene'); }

  init(data) {
    this._level     = data.level     || 1;
    this._score     = data.score     || 0;
    this._timeBonus = data.timeBonus || 0;
    this._health    = data.health    || PLAYER_CFG.MAX_HEALTH;
    this._totalScore = this._score + this._timeBonus;
  }

  create() {
    const isLastLevel = this._level >= LEVELS.length;
    const bg = isLastLevel ? 0x1a3300 : 0x0a2244;
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, bg);

    // Stars burst
    const starEmitter = this.add.particles(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'star', {
      speed: { min: 100, max: 350 },
      scale: { start: 1, end: 0 },
      lifespan: 1200,
      quantity: 30,
      emitting: false,
    });
    starEmitter.explode(30, GAME.WIDTH / 2, GAME.HEIGHT / 2);

    // Title
    const title = isLastLevel ? '🏆 YOU WIN! 🏆' : `✅ LEVEL ${this._level} COMPLETE!`;
    this.add.text(GAME.WIDTH / 2, 90, title, {
      fontSize: isLastLevel ? '48px' : '40px',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 8,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    if (isLastLevel) {
      this.add.text(GAME.WIDTH / 2, 150, 'The Chicken Nugget Hero saved the day!', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);
    }

    // Score breakdown
    let y = isLastLevel ? 200 : 170;
    const lineStyle = {
      fontSize: '22px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
      fontFamily: 'Arial Black, Arial',
    };

    this.add.text(GAME.WIDTH / 2, y, `Level Score:    ${this._score.toLocaleString()}`, lineStyle).setOrigin(0.5);
    y += 40;
    this.add.text(GAME.WIDTH / 2, y, `Time Bonus:    +${this._timeBonus.toLocaleString()}`, {
      ...lineStyle, fill: '#88FF88',
    }).setOrigin(0.5);
    y += 40;

    // Separator line
    const line = this.add.graphics();
    line.lineStyle(2, 0xffffff, 0.5);
    line.lineBetween(GAME.WIDTH / 2 - 180, y, GAME.WIDTH / 2 + 180, y);
    y += 16;

    this.add.text(GAME.WIDTH / 2, y, `TOTAL:    ${this._totalScore.toLocaleString()}`, {
      ...lineStyle, fill: '#FFD700', fontSize: '28px',
    }).setOrigin(0.5);
    y += 55;

    // Health remaining hearts
    this.add.text(GAME.WIDTH / 2, y, 'Health remaining:', {
      fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);
    y += 28;
    for (let i = 0; i < PLAYER_CFG.MAX_HEALTH; i++) {
      this.add.image(GAME.WIDTH / 2 - ((PLAYER_CFG.MAX_HEALTH - 1) * 17) + i * 34, y,
        i < this._health ? 'heart' : 'heart_empty'
      ).setScale(0.7);
    }

    y += 50;

    // Next level / main menu buttons
    if (isLastLevel) {
      this._makeButton(GAME.WIDTH / 2 - 110, y + 10, '🔄 PLAY AGAIN', 0x226622, () => {
        this.scene.start('GameScene', { level: 1, score: 0 });
      });
      this._makeButton(GAME.WIDTH / 2 + 110, y + 10, '🏆 SCORES', 0x884400, () => {
        this.scene.start('LeaderboardScene', {
          score: this._totalScore, gameOver: false, fromWin: true,
        });
      });
    } else {
      this._makeButton(GAME.WIDTH / 2 - 110, y + 10, '▶ NEXT LEVEL', 0x226622, () => {
        this.scene.start('GameScene', {
          level: this._level + 1,
          score: this._totalScore,
          health: this._health,
        });
      });
      this._makeButton(GAME.WIDTH / 2 + 110, y + 10, '🏠 MENU', 0x884400, () => {
        this.scene.start('MenuScene');
      });
    }
  }

  _makeButton(x, y, label, color, callback) {
    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - 105, y - 28, 210, 56, 12);
    bg.lineStyle(3, 0xffffff, 0.6);
    bg.strokeRoundedRect(x - 105, y - 28, 210, 56, 12);

    const txt = this.add.text(x, y, label, {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, 210, 56).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', callback);
    zone.on('pointerover', () => this.tweens.add({ targets: [bg, txt], scaleX: 1.05, scaleY: 1.05, duration: 80 }));
    zone.on('pointerout',  () => this.tweens.add({ targets: [bg, txt], scaleX: 1, scaleY: 1, duration: 80 }));
  }
}
