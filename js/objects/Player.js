// ============================================================
//  Player — Chicken Nugget OBBY hero
// ============================================================

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nugget');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(44, 34);
    this.body.setGravityY(GAME.GRAVITY);
    this.setDepth(10);

    this._jumpsLeft = 2;
    this._invincible = false;
    this._invincTimer = 0;
    this._shootCooldown = 0;
    this._powerUpShots = 0;
    this._currentPowerUp = null; // texture key for projectile
    this._facingRight = true;
  }

  // Called each frame from GameScene.update()
  update(delta) {
    if (this._invincible) {
      this._invincTimer -= delta;
      // Flicker effect
      this.setAlpha(Math.floor(this._invincTimer / 100) % 2 === 0 ? 1 : 0.3);
      if (this._invincTimer <= 0) {
        this._invincible = false;
        this.setAlpha(1);
      }
    }

    if (this._shootCooldown > 0) {
      this._shootCooldown -= delta;
    }

    // Reset double-jump when grounded
    if (this.body.blocked.down) {
      this._jumpsLeft = 2;
    }
  }

  moveLeft() {
    this.setVelocityX(-PLAYER_CFG.SPEED);
    this._facingRight = false;
    this.setFlipX(true);
  }

  moveRight() {
    this.setVelocityX(PLAYER_CFG.SPEED);
    this._facingRight = true;
    this.setFlipX(false);
  }

  stopHorizontal() {
    this.setVelocityX(0);
  }

  jump() {
    if (this._jumpsLeft > 0) {
      this.setVelocityY(PLAYER_CFG.JUMP_VEL);
      this._jumpsLeft--;
      return true;
    }
    return false;
  }

  // Call when player lands on top of an enemy
  stompBounce() {
    this.setVelocityY(STOMP_BOUNCE);
    this._jumpsLeft = 2;
  }

  takeDamage() {
    if (this._invincible) return false;
    this._invincible = true;
    this._invincTimer = PLAYER_CFG.INVINCIBILITY_MS;
    return true; // damage was applied
  }

  collectPowerUp(type) {
    this._powerUpShots = PLAYER_CFG.POWER_UP_SHOTS;
    this._currentPowerUp = 'proj_' + type;
  }

  canShoot() {
    return this._powerUpShots > 0 && this._shootCooldown <= 0;
  }

  shoot(scene) {
    if (!this.canShoot()) return null;
    this._powerUpShots--;
    this._shootCooldown = PLAYER_CFG.SHOOT_COOLDOWN;

    const projKey = this._currentPowerUp || 'projectile';
    const proj = scene.physics.add.image(
      this.x + (this._facingRight ? 28 : -28),
      this.y - 4,
      projKey
    );
    proj.setDepth(9);
    proj.body.setAllowGravity(false);
    proj.body.setVelocityX(this._facingRight
      ? PLAYER_CFG.PROJECTILE_SPEED
      : -PLAYER_CFG.PROJECTILE_SPEED
    );
    proj._startX = proj.x;
    proj._facingRight = this._facingRight;

    return proj;
  }

  get shotsLeft() { return this._powerUpShots; }
  get hasPowerUp() { return this._powerUpShots > 0; }
}
