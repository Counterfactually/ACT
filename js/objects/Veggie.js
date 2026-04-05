// ============================================================
//  Veggie — Healthy food enemy (stomp or shoot to defeat)
// ============================================================

class Veggie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.setDepth(8);

    // Size per veggie type
    const sizes = {
      carrot:   { w: 30, h: 46 },
      broccoli: { w: 38, h: 46 },
      celery:   { w: 42, h: 46 },
      spinach:  { w: 40, h: 40 },
      cabbage:  { w: 44, h: 44 },
    };
    const sz = sizes[type] || { w: 36, h: 44 };
    this.body.setSize(sz.w, sz.h);
    this.body.setGravityY(GAME.GRAVITY);
    this.body.setCollideWorldBounds(true);

    this._speed = 80; // set by GameScene via setSpeed()
    this._alive = true;
    this._walkDir = -1; // start walking left
    // No vertical tween — it fights physics and causes veggies to fly
  }

  setSpeed(speed) {
    this._speed = speed;
    this.setVelocityX(this._walkDir * speed);
  }

  update() {
    if (!this._alive) return;
    // Walk in current direction; bounce off world bounds
    if (this.body.blocked.left)  { this._walkDir =  1; }
    if (this.body.blocked.right) { this._walkDir = -1; }
    this.setVelocityX(this._walkDir * this._speed);
    this.setFlipX(this._walkDir > 0);
  }

  die(scene) {
    if (!this._alive) return;
    this._alive = false;
    this.setVelocityX(0);
    this.body.enable = false;

    // Pop animation
    scene.tweens.add({
      targets: this,
      scaleX: 1.6,
      scaleY: 0,
      alpha: 0,
      duration: 250,
      ease: 'Back.easeIn',
      onComplete: () => this.destroy(),
    });

    // Particle burst
    if (scene.starEmitter) {
      scene.starEmitter.explode(6, this.x, this.y);
    }
  }
}
