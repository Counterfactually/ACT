// ============================================================
//  GameScene — Core gameplay loop
// ============================================================

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this._levelId   = (data && data.level)  || 1;
    this._score     = (data && data.score)  || 0;
    this._health    = (data && data.health !== undefined) ? data.health : PLAYER_CFG.MAX_HEALTH;
    this._levelCfg  = LEVELS[this._levelId - 1];
    this._elapsed   = 0;
    this._gameOver  = false;
    this._levelDone = false;
    this._projectiles = [];
    this._burgerBuddy = null; // Hamburger NPC companion
  }

  create() {
    const cfg = this._levelCfg;

    // ── World bounds ─────────────────────────────────────────
    this.physics.world.setBounds(0, 0, GAME.LEVEL_WIDTH, GAME.HEIGHT);
    this.cameras.main.setBounds(0, 0, GAME.LEVEL_WIDTH, GAME.HEIGHT);

    // ── Background ───────────────────────────────────────────
    this._buildBackground(cfg);

    // ── Ground ───────────────────────────────────────────────
    this._buildGround(cfg);

    // ── Platforms ────────────────────────────────────────────
    this._platforms = this.physics.add.staticGroup();
    this._buildPlatforms(cfg);

    // ── Player ───────────────────────────────────────────────
    this._player = new Player(this, 120, GAME.GROUND_Y - 40);
    this.cameras.main.startFollow(this._player, false, 0.1, 0.1);

    // ── Enemies ──────────────────────────────────────────────
    this._veggies   = this.physics.add.group({ classType: Veggie });
    this._condiments = this.physics.add.group({ classType: CondimentEnemy });
    this._buildEnemies(cfg);

    // ── Power-ups ────────────────────────────────────────────
    this._powerUps = this.physics.add.group({ classType: PowerUp });
    this._buildPowerUps(cfg);

    // ── End flag ─────────────────────────────────────────────
    this._flag = this.add.image(cfg.flagX, GAME.GROUND_Y - 40, 'flag')
      .setOrigin(0, 1)
      .setDepth(5);

    // ── Particle emitter ─────────────────────────────────────
    this.starEmitter = this.add.particles(0, 0, 'star', {
      speed: { min: 80, max: 200 },
      scale: { start: 0.8, end: 0 },
      lifespan: 500,
      quantity: 0,
      emitting: false,
    });
    this.starEmitter.setDepth(20);

    // ── Physics colliders & overlaps ─────────────────────────
    this.physics.add.collider(this._player, this._platforms);
    this.physics.add.collider(this._player, this._groundBody);
    this.physics.add.collider(this._veggies, this._platforms);
    this.physics.add.collider(this._veggies, this._groundBody);
    this.physics.add.collider(this._condiments, this._platforms);
    this.physics.add.collider(this._condiments, this._groundBody);

    // Stomp or take damage from veggie
    this.physics.add.overlap(
      this._player, this._veggies,
      this._handlePlayerVeggie, null, this
    );

    // Damage from condiment enemy
    this.physics.add.overlap(
      this._player, this._condiments,
      this._handlePlayerCondiment, null, this
    );

    // Collect power-up (condiment bottles)
    this.physics.add.overlap(
      this._player, this._powerUps,
      this._handlePowerUp, null, this
    );

    // Burger power-ups are in the same group — filtered inside handler

    // ── UI Scene overlay ─────────────────────────────────────
    this.scene.launch('UIScene');
    this._uiScene = this.scene.get('UIScene');

    // Publish initial registry values
    this.registry.set('health',   this._health);
    this.registry.set('score',    this._score);
    this.registry.set('timeLeft', this._levelCfg.timeLimit);
    this.registry.set('shots',    0);
    this.registry.set('level',    this._levelId);

    // ── Input ────────────────────────────────────────────────
    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this._jumpPressed = false;
    this._shootPressed = false;
  }

  // ── Build helpers ─────────────────────────────────────────

  _buildBackground(cfg) {
    // Sky gradient using two overlapping rectangles
    this.add.rectangle(GAME.LEVEL_WIDTH / 2, GAME.HEIGHT / 2,
      GAME.LEVEL_WIDTH, GAME.HEIGHT, cfg.bgColor2).setDepth(0);

    // Far background hills (parallax layer 1 — moves at 20% player speed)
    this._bgHills = this.add.tileSprite(
      GAME.WIDTH / 2, GAME.HEIGHT * 0.55,
      GAME.LEVEL_WIDTH, GAME.HEIGHT * 0.7,
      'ground'
    );
    this._bgHills.setTileScale(3, 2);
    this._bgHills.setAlpha(0.15);
    this._bgHills.setScrollFactor(0.2);
    this._bgHills.setDepth(1);

    // Clouds (simple rectangles)
    const cloudPositions = [200, 500, 900, 1400, 1900, 2500, 3000];
    const cloudY = [60, 90, 50, 80, 65, 55, 75];
    cloudPositions.forEach((cx, i) => {
      const cloud = this.add.graphics().setScrollFactor(0.3).setDepth(2);
      cloud.fillStyle(0xffffff, 0.7);
      cloud.fillRoundedRect(cx, cloudY[i], 120, 40, 20);
      cloud.fillRoundedRect(cx + 20, cloudY[i] - 20, 80, 40, 20);
    });
  }

  _buildGround(cfg) {
    // Invisible rectangle with static physics — spans the full level width
    const groundRect = this.add.rectangle(
      GAME.LEVEL_WIDTH / 2,
      GAME.GROUND_Y + GAME.GROUND_H / 2,
      GAME.LEVEL_WIDTH,
      GAME.GROUND_H,
      0x000000, 0
    );
    this.physics.add.existing(groundRect, true); // true = static
    this._groundBody = groundRect;

    // Visual ground strip
    const groundVis = this.add.graphics().setDepth(3);
    groundVis.fillStyle(cfg.groundColor, 1);
    groundVis.fillRect(0, GAME.GROUND_Y, GAME.LEVEL_WIDTH, GAME.GROUND_H);
    groundVis.fillStyle(cfg.groundTop, 1);
    groundVis.fillRect(0, GAME.GROUND_Y, GAME.LEVEL_WIDTH, 10);
  }

  _buildPlatforms(cfg) {
    cfg.platforms.forEach(p => {
      // Build platform from tiles
      const numTiles = Math.ceil(p.w / 32);
      for (let i = 0; i < numTiles; i++) {
        const tile = this._platforms.create(
          p.x + i * 32, p.y, 'platform_tile'
        );
        tile.setOrigin(0, 0);
        tile.refreshBody();
        tile.setDepth(4);
      }
    });
  }

  _buildEnemies(cfg) {
    cfg.veggies.forEach(vd => {
      const v = new Veggie(this, vd.x, vd.y - 30, vd.type);
      v.setSpeed(cfg.veggieSpeed);
      this._veggies.add(v, true);
    });

    cfg.condiments.forEach(cd => {
      const c = new CondimentEnemy(this, cd.x, GAME.GROUND_Y - 35, cd.type);
      c.setSpeed(cfg.condimentSpeed);
      this._condiments.add(c, true);
    });
  }

  _buildPowerUps(cfg) {
    cfg.powerUps.forEach(pd => {
      const pu = new PowerUp(this, pd.x, pd.y, pd.type);
      this._powerUps.add(pu, true);
    });
  }

  // ── Collision callbacks ───────────────────────────────────

  _handlePlayerVeggie(player, veggie) {
    if (!veggie._alive) return;

    // Stomp: player moving down and above veggie centre
    if (player.body.velocity.y > 0 &&
        player.body.bottom <= veggie.body.top + 16) {
      veggie.die(this);
      player.stompBounce();
      this._addScore(SCORE.STOMP);
    } else {
      // Take damage
      if (player.takeDamage()) {
        this._applyDamage();
      }
    }
  }

  _handlePlayerCondiment(player, condiment) {
    if (!condiment._alive) return;
    if (player.takeDamage()) {
      this._applyDamage();
      // Knockback
      const dir = player.x < condiment.x ? -1 : 1;
      player.setVelocityX(dir * 300);
      player.setVelocityY(-250);
    }
  }

  _handlePowerUp(player, powerUp) {
    if (!powerUp._alive) return;
    powerUp.collect(this);
    this._addScore(SCORE.POWER_UP);
    this.cameras.main.flash(200, 255, 255, 100);

    if (powerUp.puType === 'burger_pu') {
      this._spawnBurgerBuddy();
    } else {
      player.collectPowerUp(powerUp.puType);
      this.registry.set('shots', player.shotsLeft);
      this.registry.set('powerUpType', powerUp.puType);
    }
  }

  // ── Score / Health ────────────────────────────────────────

  _addScore(amount) {
    this._score += amount;
    this.registry.set('score', this._score);

    // Floating score text
    const cam = this.cameras.main;
    const txt = this.add.text(
      this._player.x, this._player.y - 30,
      '+' + amount,
      { fontSize: '20px', fill: '#FFD700', stroke: '#000', strokeThickness: 3, fontFamily: 'Arial Black, Arial' }
    ).setDepth(30).setOrigin(0.5);
    this.tweens.add({
      targets: txt,
      y: txt.y - 50,
      alpha: 0,
      duration: 900,
      onComplete: () => txt.destroy(),
    });
  }

  _applyDamage() {
    this._health--;
    this.registry.set('health', this._health);
    this.cameras.main.shake(200, 0.015);

    if (this._health <= 0) {
      this._endGame(false);
    }
  }

  // ── Shooting ─────────────────────────────────────────────

  _fireProjectile() {
    // Shoots in BOTH directions simultaneously (costs 1 shot)
    const projs = this._player.shootBoth(this);
    if (projs.length === 0) return;
    this.registry.set('shots', this._player.shotsLeft);
    projs.forEach(proj => {
      this._setupProjectileCollisions(proj, true);
      this._projectiles.push(proj);
    });
  }

  // Wire collision callbacks for any projectile (player or burger buddy)
  _setupProjectileCollisions(proj, scoreable) {
    this.physics.add.overlap(proj, this._veggies, (p, v) => {
      if (!v._alive || proj._destroyed) return;
      v.die(this);
      if (scoreable) this._addScore(SCORE.SHOOT);
      this._destroyProjectile(proj);
    });
    this.physics.add.overlap(proj, this._condiments, (p, c) => {
      if (!c._alive || proj._destroyed) return;
      c.die(this);
      if (scoreable) this._addScore(SCORE.SHOOT);
      this._destroyProjectile(proj);
    });
  }

  _destroyProjectile(proj) {
    if (proj._destroyed) return;
    proj._destroyed = true;
    const splat = this.add.graphics().setDepth(25);
    splat.fillStyle(0xFF4400, 0.7);
    splat.fillCircle(proj.x, proj.y, 14);
    this.tweens.add({ targets: splat, alpha: 0, duration: 300, onComplete: () => splat.destroy() });
    proj.destroy();
    this._projectiles = this._projectiles.filter(p => p !== proj);
  }

  // ── Burger Buddy NPC ─────────────────────────────────────

  _spawnBurgerBuddy() {
    if (this._burgerBuddy) {
      // Refresh lifetime if already active
      this._burgerBuddy.lifetime = 14000;
      return;
    }
    const sprite = this.add.image(
      this._player.x - 70, this._player.y, 'burger_buddy'
    ).setDepth(9).setScale(0.85);

    this._burgerBuddy = { sprite, lifetime: 14000, shootTimer: 0, alive: true };

    // Announce
    const txt = this.add.text(this._player.x, this._player.y - 60,
      '🍔 BURGER BUDDY!',
      { fontSize: '24px', fill: '#FFD700', stroke: '#000', strokeThickness: 5, fontFamily: 'Arial Black, Arial' }
    ).setDepth(35).setOrigin(0.5);
    this.tweens.add({ targets: txt, y: txt.y - 55, alpha: 0, duration: 1600, onComplete: () => txt.destroy() });
  }

  _updateBurgerBuddy(delta) {
    const bb = this._burgerBuddy;
    if (!bb || !bb.alive) return;

    bb.lifetime -= delta;
    if (bb.lifetime <= 0) { this._killBurgerBuddy(); return; }

    // Follow player with a smooth lag, stay slightly behind
    const targetX = this._player.x - (this._player._facingRight ? 70 : -70);
    bb.sprite.x += (targetX - bb.sprite.x) * 0.07;
    bb.sprite.y += (this._player.y - bb.sprite.y) * 0.07;
    bb.sprite.setFlipX(bb.sprite.x > this._player.x);

    // Flash when about to expire
    if (bb.lifetime < 3000) {
      bb.sprite.setAlpha(Math.floor(bb.lifetime / 200) % 2 === 0 ? 1 : 0.4);
    }

    // Auto-shoot at nearest enemy every 2 seconds
    bb.shootTimer -= delta;
    if (bb.shootTimer <= 0) {
      bb.shootTimer = 2000;
      this._burgerBuddyShoot();
    }
  }

  _burgerBuddyShoot() {
    const bb = this._burgerBuddy;
    const allEnemies = [
      ...this._veggies.getChildren(),
      ...this._condiments.getChildren(),
    ].filter(e => e._alive);
    if (allEnemies.length === 0) return;

    // Find nearest enemy
    let nearest = allEnemies[0];
    let minDist = Phaser.Math.Distance.Between(bb.sprite.x, bb.sprite.y, nearest.x, nearest.y);
    allEnemies.forEach(e => {
      const d = Phaser.Math.Distance.Between(bb.sprite.x, bb.sprite.y, e.x, e.y);
      if (d < minDist) { minDist = d; nearest = e; }
    });

    const dir = nearest.x >= bb.sprite.x ? 1 : -1;
    const proj = this.physics.add.image(
      bb.sprite.x + dir * 30, bb.sprite.y - 5, 'proj_ketchup_pu'
    );
    proj.setDepth(9);
    proj.body.setAllowGravity(false);
    proj.body.setVelocityX(dir * PLAYER_CFG.PROJECTILE_SPEED * 0.85);
    proj._startX = proj.x;
    this._setupProjectileCollisions(proj, true); // burger shots also score
    this._projectiles.push(proj);
  }

  _killBurgerBuddy() {
    const bb = this._burgerBuddy;
    if (!bb) return;
    bb.alive = false;
    this.tweens.add({
      targets: bb.sprite,
      alpha: 0, y: bb.sprite.y - 40,
      duration: 600,
      onComplete: () => bb.sprite.destroy(),
    });
    this._burgerBuddy = null;
  }

  // ── Level end ─────────────────────────────────────────────

  _checkLevelComplete() {
    if (this._levelDone) return;
    if (this._player.x >= this._levelCfg.flagX) {
      this._levelDone = true;
      this._endGame(true);
    }
  }

  _endGame(win) {
    if (this._gameOver) return;
    this._gameOver = true;

    this.time.delayedCall(500, () => {
      this.scene.stop('UIScene');
      if (win) {
        const timeLeft = Math.max(0,
          this._levelCfg.timeLimit - Math.floor(this._elapsed / 1000)
        );
        const timeBonus = timeLeft * SCORE.TIME_BONUS_MULT;
        this.scene.start('WinScene', {
          level: this._levelId,
          score: this._score,
          timeBonus,
          health: this._health,
        });
      } else {
        this.scene.start('LeaderboardScene', {
          score: this._score,
          gameOver: true,
          level: this._levelId,
        });
      }
    });
  }

  // ── Main update loop ─────────────────────────────────────

  update(time, delta) {
    if (this._gameOver || this._levelDone) return;

    // Timer
    this._elapsed += delta;
    const timeLeft = Math.max(0,
      this._levelCfg.timeLimit - Math.floor(this._elapsed / 1000)
    );
    this.registry.set('timeLeft', timeLeft);
    if (timeLeft <= 0) {
      this._endGame(false);
      return;
    }

    // Player update
    this._player.update(delta);

    // Enemies update
    this._veggies.getChildren().forEach(v => v.update && v.update());
    this._condiments.getChildren().forEach(c => {
      if (c.update) c.update(this._player);
    });

    // Burger buddy NPC update
    this._updateBurgerBuddy(delta);

    // Projectile range check
    this._projectiles = this._projectiles.filter(proj => {
      if (!proj.active) return false;
      const dist = Math.abs(proj.x - proj._startX);
      if (dist > PLAYER_CFG.PROJECTILE_RANGE) {
        proj.destroy();
        return false;
      }
      return true;
    });

    // ── Controls (keyboard + touch registry) ─────────────────
    const leftDown  = this._cursors.left.isDown  || this._wasd.left.isDown
                   || this.registry.get('ctrl_left');
    const rightDown = this._cursors.right.isDown || this._wasd.right.isDown
                   || this.registry.get('ctrl_right');
    const jumpDown  = Phaser.Input.Keyboard.JustDown(this._cursors.up)
                   || Phaser.Input.Keyboard.JustDown(this._wasd.up)
                   || this.registry.get('ctrl_jump');
    const shootDown = Phaser.Input.Keyboard.JustDown(this._wasd.shoot)
                   || this.registry.get('ctrl_shoot');

    // Clear one-shot registry flags
    if (this.registry.get('ctrl_jump'))  this.registry.set('ctrl_jump', false);
    if (this.registry.get('ctrl_shoot')) this.registry.set('ctrl_shoot', false);

    if (leftDown)  { this._player.moveLeft();  }
    else if (rightDown) { this._player.moveRight(); }
    else           { this._player.stopHorizontal(); }

    if (jumpDown)  { this._player.jump(); }
    if (shootDown) { this._fireProjectile(); }

    // Level complete check
    this._checkLevelComplete();
  }
}
