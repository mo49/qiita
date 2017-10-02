import { Fireworks } from '../lib/Fireworks';

const FIREWORK_SIZE = 8; // 用意した画像のサイズ
const COLOR_STEPS = 360;  // 色の種類

// Go
window.onload = function() {

  Fireworks.initialize({
    firework_size: FIREWORK_SIZE,
    color_steps: COLOR_STEPS,
  });
  Fireworks.createFirework({
    name: "きふしたひとのなまえ",
    color: FIREWORK_SIZE * 1, // HSL 1 ~ 359
    // shape: 'circle',
    // pos: { x:window.innerWidth/2, y:0 }, // x:発射地点
    // target: { y:window.innerHeight/2 }, // y:爆発地点の高さ
    // vel: { x:0, y:0 }, // x:風の影響
    // particle_scale: 1,
    // gradation_color: 1, // グラデーション
    // random_color: 1, // ランダム
    // lifespan: 2500,
    // time_difference: 1000, // 各パーティクルが消えていくタイミングのずれ
  });
};

window.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 49: shidare(0.2); break;
    case 50: shidare(0.3,1,0); break;
    case 51: shidare(0.4,0,1); break;
    case 52: underwater(0.5); break;
    case 53: underwater(0.6,1,0); break;
    case 54: underwater(0.7,0,1); break;
    case 55: star(0.2,0,0,8,7); break;
    case 56: star(0.5,0,0,10,8); break;
    case 57: star(0.8,0,0,12,9); break;
    default:
  }
})

function shidare(
  posX,isGradation=0,isRandom=0
){
Fireworks.createFirework({
  name: "しだれ",
  shape: 'shidare',
  color: FIREWORK_SIZE * 100,
  particle_scale: 1,
  pos: { x:window.innerWidth*posX},
  gradation_color: isGradation,
  random_color: isRandom,
});
}

function underwater(
  posX,isGradation=0,isRandom=0
){
Fireworks.createFirework({
  name: "すいちゅう",
  shape: 'underwater',
  color: FIREWORK_SIZE * 200,
  particle_scale: 1,
  target: { y:window.innerHeight - (sea_height - 10) },
  pos: { x:window.innerWidth*posX },
  gradation_color: isGradation,
  random_color: isRandom,
});
}

function star(
  posX,isGradation=0,isRandom=0,
  points=10,jump=3
){
Fireworks.createFirework({
  name: "すたー",
  shape: 'star',
  color: FIREWORK_SIZE * 300,
  particle_scale: 1,
  pos: { x:window.innerWidth*posX },
  gradation_color: isGradation,
  random_color: isRandom,
  points: points,
  jump: jump,
});
}
