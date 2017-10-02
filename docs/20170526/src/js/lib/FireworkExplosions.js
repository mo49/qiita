import { Fireworks } from './Fireworks';

// 花火の種類
export const FireworkExplosions = {

  // 引数fireworkは上がった火種

  /**
   * Explodes in a roughly circular fashion
   */
  circle: function(firework) {

    console.log("firework",firework);

    const colorFunc = setColorFunc(firework);

    const total_count = 120;
    var count = total_count;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      // velocityの min=0 にすると中心から広がる
      // 真ん中に空洞を開けたい場合は min>0 にする
      var randomVelocity = 1 + Math.random() * 2; // 爆破スピード
      var particleAngle = count * angle;

      Fireworks.createParticle({
        pos: firework.pos,
        target: null,
        vel: {
          x: Math.cos(particleAngle) * randomVelocity * 1,
          y: Math.sin(particleAngle) * randomVelocity
        },
        color: (colorFunc) ? colorFunc(total_count,count) : firework.color,
        usePhysics: true,
        name: firework.name || '',
        particle_scale: firework.particle_scale || 1,
        fade: firework.fade,
        gravity: firework.gravity,
        lifespan: firework.lifespan,
        time_difference: firework.time_difference,
      });
    }
  },

  /**
   * Explodes in a star shape
   */
  star: function(firework,points,jump) {

    const colorFunc = setColorFunc(firework);

    // set up how many points the firework
    // should have as well as the velocity
    // of the exploded particles etc
    var points          = points || 6 + Math.round(Math.random() * 15); // 6 -21
    var jump            = jump || 3 + Math.round(Math.random() * 7); // 7 - 10
    var subdivisions    = 10;
    var radius          = 80;
    var randomVelocity  = -(Math.random() * 2 - 4); // 1 - 3

    var start           = 0;
    var end             = 0;
    var circle          = Math.PI * 2;
    var adjustment      = Math.random() * circle;

    console.log("points,jump",points,jump);

    do {

      // work out the start, end
      // and change values
      start = end;
      end = (end + jump) % points;

      var sAngle = (start / points) * circle - adjustment;
      var eAngle = ((start + jump) / points) * circle - adjustment;

      var startPos = {
        x: firework.pos.x + Math.cos(sAngle) * radius,
        y: firework.pos.y + Math.sin(sAngle) * radius
      };

      var endPos = {
        x: firework.pos.x + Math.cos(eAngle) * radius,
        y: firework.pos.y + Math.sin(eAngle) * radius
      };

      var diffPos = {
        x: endPos.x - startPos.x,
        y: endPos.y - startPos.y,
        a: eAngle - sAngle
      };

      // now linearly interpolate across
      // the subdivisions to get to a final
      // set of particles
      for(var s = 0; s < subdivisions; s++) {

        var sub = s / subdivisions;
        var subAngle = sAngle + (sub * diffPos.a);

        Fireworks.createParticle({
          pos: {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          target: null,
          vel: {
            x: Math.cos(subAngle) * randomVelocity,
            y: Math.sin(subAngle) * randomVelocity
          },
          color: (colorFunc) ? colorFunc(subdivisions,s) : firework.color,
          usePhysics: true,
          name: firework.name || '',
          particle_scale: firework.particle_scale || 1,
          fade: firework.fade,
          gravity: firework.gravity,
          lifespan: firework.lifespan,
          time_difference: firework.time_difference,
        });
      }

    // loop until we're back at the start
    } while(end !== 0);

  },

  /**
   * Explodes in a shidare shape
   */
  shidare: function(firework) {

    const colorFunc = setColorFunc(firework);

    const total_count = 200;
    var count = total_count;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      // velocityの min=0 にすると中心から広がる
      var randomVelocity = 0.1 + Math.random() * 3;
      var particleAngle = count * angle;

      Fireworks.createParticle({
        pos: firework.pos,
        target: null,
        vel: {
          x: Math.cos(particleAngle) * randomVelocity * 0.95,
          y: Math.sin(particleAngle) * randomVelocity * 1.1
        },
        color: (colorFunc) ? colorFunc(total_count,count) : firework.color,
        usePhysics: true,
        name: firework.name || '',
        particle_scale: firework.particle_scale || 1,
        fade: 0.01,
        gravity: 0.04,
        lifespan: 3000,
        time_difference: 1000,
      });
    }
  },

  /**
   * Explodes in a underwater fireworks shape
   */
  underwater: function(firework) {

    const colorFunc = setColorFunc(firework);

    const total_count = 200;
    var count = total_count;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      // velocityの min=0 にすると中心から広がる
      var randomVelocity = 0.1 + Math.random() * 4;
      var particleAngle = count * angle;

      Fireworks.createParticle({
        pos: firework.pos,
        target: null,
        vel: {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },
        color: (colorFunc) ? colorFunc(total_count,count) : firework.color,
        usePhysics: true,
        name: firework.name || '',
        particle_scale: firework.particle_scale || 1,
        fade: 0.01,
        gravity: 0.03,
        lifespan: 2000,
        time_difference: 800,
      });
    }
  }

};

function shuffleColor() {
  return firework_size * Math.floor(Math.random() * 360)
}
function gradationColor(num_particle,count) {
  return firework_size * count * Math.round(360 / num_particle)
}
function setColorFunc(firework) {
  let colorFunc = null;
  if (firework.random_color) {colorFunc = shuffleColor};
  if (firework.gradation_color) {colorFunc = gradationColor};
  return colorFunc;
}
