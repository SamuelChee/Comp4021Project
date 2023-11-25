import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, velocityX, velocityY, bulletSize, bulletColor) {
    super(scene);

    // Position
    this.x = x;
    this.y = y;

    // Movement
    this.velocityX = velocityX;
    this.velocityY = velocityY;

    // Visuals
    this.bulletSize = bulletSize;
    this.bulletColor = bulletColor;

    this.initBullet();
    this.initPhysics();
  }

  initPhysics() {
    this.scene.physics.world.enable(this);
    this.body.setSize(this.bulletSize * 2, this.bulletSize * 2);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.setAllowGravity(false);
  }

  initBullet() {
    this.scene.add.existing(this);
    this.fillStyle(this.bulletColor, 1);
    this.fillCircle(this.bulletSize, this.bulletSize, this.bulletSize);
  }

  move() {
    this.setX(this.x + this.velocityX);
    this.setY(this.y + this.velocityY);
  }
}

export class Weapon {
  constructor(damage, fireRate, bulletSpeed) {
    this.damage = damage;
    this.fireRate = fireRate;
    this.bulletSpeed = bulletSpeed;
  }

  createBullet(scene, x, y, angle) {
    const velocityX = Math.cos(angle) * this.bulletSpeed;
    const velocityY = Math.sin(angle) * this.bulletSpeed;

    return new Bullet(scene, x, y, velocityX, velocityY, 3, 0xffffff);
  }
}



/*// Example usage:

const weapon1 = new Weapon(10, 1, 200);
const weapon2 = new Weapon(5, 2, 150);
const weapon3 = new Weapon(15, 0.5, 250);
const weapon4 = new Weapon(8, 1.5, 180);

// Create bullets using different weapons
const bullet1 = weapon1.createBullet(scene, x, y, angle);
const bullet2 = weapon2.createBullet(scene, x, y, angle);
const bullet3 = weapon3.createBullet(scene, x, y, angle);
const bullet4 = weapon4.createBullet(scene, x, y, angle);*/