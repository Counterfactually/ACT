// ============================================================
//  CondimentEnemy — Ketchup / Mustard / Dressing villain
// ============================================================

class CondimentEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.setDepth(8);
    this.body.setSize(30, 56);
    this.body.setGravityY(GAME.GRAVITY);
    this.body.setCollideWorldBounds(true);

    this._speed = 65;
    this._alive = true;
    this._wobbleDir = 1;

    // Wobble / patrol
    scene.tweens.add({
      targets: this,
      angle: 8,
      duration: 400 + Math.random() * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  setSpeed(speed) {
    this._speed = speed;
  }

  update(player) {
    if (!this._alive || !player) return;

    // Chase the player horizontally
    const dx = player.x - this.x;
    const dir = Math.sign(dx);
    this.setVelocityX(dir * this._speed);
    this.setFlipX(dir < 0);
  }

  die(scene) {
    if (!this._alive) return;
    this._alive = false;
    this.body.enable = false;

    scene.tweens.add({
      targets: this,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => this.destroy(),
    });
  }
}
