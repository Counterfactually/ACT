// ============================================================
//  UIScene — HUD overlay + on-screen touch controls
// ============================================================

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene', active: false }); }

  create() {
    // ── Health bar ───────────────────────────────────────────
    this._healthIcons = [];
    for (let i = 0; i < PLAYER_CFG.MAX_HEALTH; i++) {
      const img = this.add.image(20 + i * 34, 20, 'heart')
        .setOrigin(0, 0)
        .setScale(0.85)
        .setDepth(100)
        .setScrollFactor(0);
      this._healthIcons.push(img);
    }

    // ── Score ────────────────────────────────────────────────
    this._scoreTxt = this.add.text(GAME.WIDTH / 2, 14, 'SCORE: 0', {
      fontSize: '22px',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

    // ── Timer ────────────────────────────────────────────────
    this._timerTxt = this.add.text(GAME.WIDTH - 10, 14, 'TIME: 90', {
      fontSize: '22px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(1, 0).setDepth(100).setScrollFactor(0);

    // ── Level label ──────────────────────────────────────────
    const level = this.registry.get('level') || 1;
    const levelCfg = LEVELS[level - 1];
    this._levelTxt = this.add.text(GAME.WIDTH / 2, 42, `LEVEL ${level}: ${levelCfg.name}`, {
      fontSize: '14px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

    // ── Power-up shots remaining ──────────────────────────────
    this._shotsTxt = this.add.text(20, GAME.HEIGHT - 50, '', {
      fontSize: '16px',
      fill: '#FF8800',
      stroke: '#000000',
      strokeThickness: 3,
      fontFamily: 'Arial Black, Arial',
    }).setDepth(100).setScrollFactor(0);

    // ── Touch controls ───────────────────────────────────────
    this._buildTouchControls();

    // ── Registry listeners ───────────────────────────────────
    this.registry.events.on('changedata-health',   this._onHealthChange,   this);
    this.registry.events.on('changedata-score',    this._onScoreChange,    this);
    this.registry.events.on('changedata-timeLeft', this._onTimerChange,    this);
    this.registry.events.on('changedata-shots',    this._onShotsChange,    this);
    this.registry.events.on('changedata-powerUpType', this._onPowerUpType, this);

    // Sync initial values
    this._onHealthChange(null, this.registry.get('health') || PLAYER_CFG.MAX_HEALTH);
    this._onScoreChange(null,  this.registry.get('score')  || 0);
    this._onTimerChange(null,  this.registry.get('timeLeft') || 90);
  }

  // ── Health ───────────────────────────────────────────────

  _onHealthChange(parent, value) {
    this._healthIcons.forEach((icon, i) => {
      icon.setTexture(i < value ? 'heart' : 'heart_empty');
    });
  }

  _onScoreChange(parent, value) {
    this._scoreTxt.setText('SCORE: ' + value.toLocaleString());
  }

  _onTimerChange(parent, value) {
    this._timerTxt.setText('TIME: ' + value);
    if (value <= 10) {
      this._timerTxt.setFill('#FF4444');
      if (value % 2 === 0) this._timerTxt.setAlpha(1); else this._timerTxt.setAlpha(0.6);
    } else {
      this._timerTxt.setFill('#ffffff').setAlpha(1);
    }
  }

  _onShotsChange(parent, value) {
    if (value > 0) {
      this._shotsTxt.setText('🍅 x' + value);
    } else {
      this._shotsTxt.setText('');
    }
  }

  _onPowerUpType(parent, type) {
    // Update shot icon colour to match power-up type
    const colors = {
      ketchup_pu: '#FF2222',
      mustard_pu: '#FFCC00',
      mayo_pu:    '#F5F5DC',
      relish_pu:  '#55CC55',
    };
    this._shotsTxt.setFill(colors[type] || '#FF8800');
  }

  // ── Touch control buttons ─────────────────────────────────

  _buildTouchControls() {
    const btnY   = GAME.HEIGHT - 58;
    const btnW   = 72;
    const btnH   = 60;
    const alpha  = 0.55;
    const radius = 14;
    const style  = { fontSize: '28px', fontFamily: 'Arial', stroke: '#000', strokeThickness: 2 };

    const makeBtn = (x, y, label, onDown, onUp) => {
      const g = this.add.graphics().setDepth(200).setScrollFactor(0);
      g.fillStyle(0x000000, alpha);
      g.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, radius);
      g.lineStyle(3, 0xffffff, 0.4);
      g.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, radius);

      const zone = this.add.zone(x, y, btnW, btnH)
        .setInteractive({ useHandCursor: true })
        .setDepth(201)
        .setScrollFactor(0);
      zone.on('pointerdown', onDown, this);
      zone.on('pointerup',   onUp,   this);
      zone.on('pointerout',  onUp,   this);

      const txt = this.add.text(x, y, label, style)
        .setOrigin(0.5)
        .setDepth(202)
        .setScrollFactor(0);

      return { g, zone, txt };
    };

    // Left
    makeBtn(52, btnY, '◀',
      () => this.registry.set('ctrl_left', true),
      () => this.registry.set('ctrl_left', false)
    );

    // Right
    makeBtn(136, btnY, '▶',
      () => this.registry.set('ctrl_right', true),
      () => this.registry.set('ctrl_right', false)
    );

    // Jump
    makeBtn(GAME.WIDTH - 56, btnY, '▲ JUMP',
      () => this.registry.set('ctrl_jump', true),
      () => {} // one-shot; GameScene clears it
    );

    // Shoot
    makeBtn(GAME.WIDTH - 144, btnY, '🍅 FIRE',
      () => this.registry.set('ctrl_shoot', true),
      () => {}
    );
  }

  shutdown() {
    this.registry.events.off('changedata-health',   this._onHealthChange,   this);
    this.registry.events.off('changedata-score',    this._onScoreChange,    this);
    this.registry.events.off('changedata-timeLeft', this._onTimerChange,    this);
    this.registry.events.off('changedata-shots',    this._onShotsChange,    this);
    this.registry.events.off('changedata-powerUpType', this._onPowerUpType, this);
  }
}
