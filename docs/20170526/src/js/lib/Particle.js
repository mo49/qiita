import { Library } from '../data/Library';

export default class Particle {
  constructor(opts={}) {
    this.birthTime = (new Date()).getTime();
    this.startTime = new Date();
    this.firework_size = opts.firework_size;
    this.color_steps = opts.color_steps;
    this.gravity  = opts.gravity;
    this.alpha    = 1;
    this.easing   = Math.random() * 0.02;
    this.fade     = opts.fade + Math.random() * 0.05;
    this.gridX    = opts.marker % (this.firework_size * this.color_steps/10);
    this.gridY    = Math.floor(opts.marker / (this.firework_size * this.color_steps/10)) * this.firework_size;
    this.color    = opts.marker;
    this.random_color = opts.random_color;
    this.gradation_color = opts.gradation_color;

    this.name = opts.name;
    this.shape = opts.shape;
    this.target_y = opts.target_y;
    this.particle_scale = opts.particle_scale;
    this.lifespan = opts.lifespan;
    this.time_difference = opts.time_difference;
    this.duration = Math.random() * this.time_difference + this.lifespan;
    this.points = opts.points;
    this.jump = opts.jump;

    this.pos = {
      x: opts.pos.x || 0,
      y: opts.pos.y || 0
    };

    this.vel = {
      x: opts.vel.x || 0,
      y: opts.vel.y || 0
    };

    // 1フレーム前
    this.lastPos = {
      x: this.pos.x,
      y: this.pos.y
    };

    this.target = {
      y: opts.target.y || 0
    };

    this.usePhysics = opts.usePhysics || false;
  }

  update() {
    this.currentDuration = (new Date()).getTime() - this.birthTime;

    this.FPS = 30;
    this.elapsedTime = new Date() - this.startTime;
    this.rate = this.elapsedTime / this.FPS;

    this.lastPos.x = this.pos.x;
    this.lastPos.y = this.pos.y;

    if(this.usePhysics) {
      /**
       * 落下中
       */
      this.vel.y += this.gravity;
      this.pos.y += this.vel.y;
      // slow down
      if (this.currentDuration > 600) {
        this.pos.x -= this.vel.x * 0.9;
        this.pos.y -= this.vel.y * 0.9;
      }
      if (this.currentDuration > 600 + this.duration) {
        this.alpha -= this.fade;
      }
      // 水上
      if (this.pos.y > window.innerHeight - (sea_height - 50)) {
        this.pos.y -= this.vel.y * (1.0 - 0.9 - 0.03);
      }
    } else {
      /**
       * 上昇中
       */
      const distance = (this.target.y - this.pos.y);
      this.pos.y += distance * (0.03 + this.easing);
      this.alpha = Math.min(distance * distance * 0.00005, 1);
    }
    this.pos.x += this.vel.x;

    this.startTime = new Date();

    // ほぼ透明になったらtrueを返す = 爆発準備完了
    return (this.alpha < 0.005);
  }

  // mainCanvasに色情報をもったfireworkCanvasを描画する
  render(context, fireworkCanvas) {
    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = Math.random() * this.alpha; // 各フレームごとにちかちかする

    context.fillStyle = "rgba(255,255,255,0.3)";
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + 1.5 * this.rate, this.pos.y);
    context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
    context.lineTo(this.pos.x - 1.5 * this.rate, this.pos.y);
    context.closePath();
    context.fill();

    // http://www.html5.jp/canvas/ref/method/drawImage.html
    // メインの色 big-glow
    context.drawImage(fireworkCanvas,
      this.gridX, this.gridY,
      this.firework_size, this.firework_size, // 色を選定
      x - this.firework_size/2 - 3, y - this.firework_size/2 - 3,
      this.firework_size * this.particle_scale, this.firework_size * this.particle_scale); // サイズを決める
    // きらきら small-glow
    context.globalCompositeOperation = 'source-over';
    context.drawImage(Library.smallGlow, (x - 1 * this.particle_scale), (y - 1 * this.particle_scale));

    context.restore();
  }
}
