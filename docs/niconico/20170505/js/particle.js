function particle(){

const stage = new createjs.Stage("myCanvas");
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
stage.canvas.width = WIDTH;
stage.canvas.height = HEIGHT;

// 初期設定
stage.mouseX = stage.canvas.width / 2;
stage.mouseY = stage.canvas.height / 3;

let particles = [];
let count = 0;

const SIZE = 20;
const AMOUNT = 3; // 1FPSで生成する量
const DECIMATION = 1; // パーティクルを間引く量
const MAX_LIFE = 100; // 寿命
const SCALE_LIFE_FLAG = true; // パーティクルのサイズを寿命に依存させるか
const COLOR_CHANGE_SPEED = 10.0; // 色が変わるスピード
const COMPOSITE_OPERATION = "lighter"; // http://jsdoc.hotcom-web.com/wordpress/archives/209
const FRICTION = 0.96; // 摩擦
const BIAS_X = 0.5; // 0:右に重み付け 1:左に重み付け
const BIAS_Y = 0.5; // 0:下に重み付け 1:上に重み付け
const RANGE_X = 20 || WIDTH; // x軸上の飛距離
const RANGE_Y = 20 || HEIGHT; // y軸上の飛距離
const GRAVITY = 0; // +:重力下 -:重力上
const REBOUND_FLAG = true; // 端で跳ね返りするかどうか

// パーティクル全体のアニメーション（軌道上）
const ANIMATION_FLAG = true;
const RADIUS = WIDTH/2;
const SPEED_X = 0.3;
const SPEED_Y = 0.3;
const T_FUNC_X = "cos";
const T_FUNC_Y = "sin";

/* ======================================
 * パーティクル発生
 * ====================================== */
function emitParticles() {
  for (let i = 0; i < AMOUNT; i++) {
    count += 1;
    const particle = new createjs.Shape();
    particle.graphics
            .beginFill(createjs.Graphics.getHSL(count * COLOR_CHANGE_SPEED, 50, 50))
            .drawCircle(0, 0, SIZE * Math.random() );
    if (count % DECIMATION !== 0) particle.alpha = 0;
    stage.addChild(particle);
    particle.compositeOperation = COMPOSITE_OPERATION;

    // パーティクルの発生場所
    particle.x = stage.mouseX;
    particle.y = stage.mouseY;

    // 速度
    particle.vx = RANGE_X * (Math.random() - BIAS_X);
    particle.vy = RANGE_Y * (Math.random() - BIAS_Y);

    particle.life = MAX_LIFE;

    particles.push(particle);
  }
}

/* ======================================
 * パーティクル更新
 * ====================================== */
function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];

    // 重力
    particle.vy += GRAVITY;

    // 摩擦
    particle.vx *= FRICTION;
    particle.vy *= FRICTION;

    // 速度を位置に適用
    particle.x += particle.vx;
    particle.y += particle.vy;

    // 跳ね返り処理
    if (REBOUND_FLAG) {
      // 下
      if (particle.y > stage.canvas.height) {
        particle.y = stage.canvas.height; // 行き過ぎ補正
        particle.vy *= -1; // Y軸の速度を反転
      }
      // 上
      if (particle.y < 0) {
        particle.y = 0;
        particle.vy *= -1;
      }
      // 左
      if(particle.x < 0){
        particle.x = 0;
        particle.vx *= -1;
      }
      // 右
      if (particle.x > WIDTH) {
        particle.x = WIDTH;
        particle.vx *= -1;
      }
    }

    // パーティクルのサイズを寿命に依存
    const scale = (SCALE_LIFE_FLAG) ? particle.life / MAX_LIFE : 1.0;
    particle.scaleX = particle.scaleY = scale;

    particle.life -= 1;

    // 死
    if (particle.life <= 0) {
      stage.removeChild(particle);
      particles.splice(i, 1);
    }
  }
}

/* ======================================
 * 時間処理
 * ====================================== */
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
  emitParticles();
  updateParticles();
  stage.update();

  if (ANIMATION_FLAG) {
    animateParticle({
      radius: RADIUS,
      speedX: SPEED_X, speedY: SPEED_Y,
      tFuncX: T_FUNC_X, tFuncY: T_FUNC_Y,
    });
  };
}
createjs.Ticker.timingMode = createjs.Ticker.RAF;


/* ======================================
 * 軌道上アニメーション
 * ====================================== */
function animateParticle({radius = 100, speedX = 0.1, speedY = 0.1, tFuncX, tFuncY}) {
  let radX, radY;
  radX = (count * Math.PI / 180) * speedX;
  radY = (count * Math.PI / 180) * speedY;

  let triFuncX, triFuncY;
  switch (tFuncX) {
    case "sin": triFuncX = Math.sin(radX); break;
    case "cos": triFuncX = Math.cos(radX); break;
    case "tan": triFuncX = Math.tan(radX); break;
  }
  switch (tFuncY) {
    case "sin": triFuncY = Math.sin(radY); break;
    case "cos": triFuncY = Math.cos(radY); break;
    case "tan": triFuncY = Math.tan(radY); break;
  }

  stage.mouseX = triFuncX * radius + WIDTH/2;
  stage.mouseY = triFuncY * radius + HEIGHT/2;
}

}
