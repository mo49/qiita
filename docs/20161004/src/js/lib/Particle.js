import { uv, uf, camera, affine } from './ParticleSetting';
import { PARTICLE_DATA } from './ParticleData';


class Vertex3d {
  constructor(param) {
    this.affineIn = {};
    this.affineOut = {};
    this.affineIn.vertex = param.vertex;
    this.affineIn.size = param.size;
    this.affineIn.rotate = param.rotate;
    this.affineIn.position = param.position;
  }

  vertexUpdate() {
    this.affineOut = affine.process(
      this.affineIn.vertex,
      this.affineIn.size,
      this.affineIn.rotate,
      this.affineIn.position,
      camera.display
    );
  }
}


export default class Particle {
  constructor(opts = {}) {
    this.velo = 0.2;
    this.limitT = 360;
    this.diff = 70;
    // this.firstPos = 100;
    this.particleNum = isNaN(opts.particleNum) ? 10 : opts.particleNum;
    this.particleSize = isNaN(opts.particleSize) ? 4 : opts.particleSize;
    this.cubeboxSize = isNaN(opts.cubeboxSize) ? 25 : opts.cubeboxSize;
    this.limitDistance = isNaN(opts.limitDistance) ? 500 : opts.limitDistance;
    this.cubeRotateSpeedX = isNaN(opts.cubeRotateSpeedX) ? 0.01 : opts.cubeRotateSpeedX;
    this.cubeRotateSpeedY = isNaN(opts.cubeRotateSpeedY) ? 0.03 : opts.cubeRotateSpeedY;
    this.cubeRotateSpeedZ = isNaN(opts.cubeRotateSpeedZ) ? 0.05 : opts.cubeRotateSpeedZ;

    this.init();
  }

  init() {
    this.canvas = document.getElementById("canvas");

    this.canvas.width = uv.ww;
    this.canvas.height = uv.wh;

    this.ctx = canvas.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.particleColor = "rgba(66, 133, 244, 1)";
    this.ctx.strokeStyle = "rgba(66, 133, 244, 0.8)";

    this.vertex = [];
    this.dist = [];
    this.times = [];

    for(let i = 0, len = this.particleNum; i<len; i++) {
      this.vertex[i] = new Vertex3d({
        vertex   : { x: uf.randomPos(), y: uf.randomPos(), z: uf.randomPos() },
        size     : { x: 0, y: 0, z: 0 },
        rotate   : { x: 20, y: -20, z: 0 },
        position : {
          x: this.diff*Math.sin(360*Math.random()*Math.PI/180),
          y: this.diff*Math.sin(360*Math.random()*Math.PI/180),
          z: this.diff*Math.sin(360*Math.random()*Math.PI/180)
        }
      });
      this.times[i] = {
        x: 360*Math.random(),
        y: 360*Math.random(),
        z: 360*Math.random()
      };
    }

    this.cubeRotate = {
      x: 0,
      y: 0,
      z: 0
    };

    this.cubeSize = {
      x: uv.ww/100 * this.cubeboxSize,
      y: uv.wh/100 * this.cubeboxSize,
      z: uv.ww/100 * this.cubeboxSize
    };
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    camera.update();

    this.cubeRotate.x += this.cubeRotateSpeedX;
    this.cubeRotate.y += this.cubeRotateSpeedY;
    this.cubeRotate.z += this.cubeRotateSpeedZ;

    for(let i=0; i<this.vertex.length; i++) {

      const particleColor = ( PARTICLE_DATA[i] ) ? PARTICLE_DATA[i].color : this.particleColor;
      const particleSize = ( PARTICLE_DATA[i] ) ? PARTICLE_DATA[i].size : this.particleSize;

      for(let val in this.times[i]) {
        if(this.times[i].hasOwnProperty(val)) {
          this.times[i][val] += this.velo;
          if(this.times[i][val] > this.limitT) this.times[i][val] = 0;
        }
      }

      this.vertex[i].affineIn.position = {
        x: this.diff*Math.cos(this.times[i].x*Math.PI/180),
        y: this.diff*Math.sin(this.times[i].y*Math.PI/180),
        z: this.diff*Math.sin(this.times[i].z*Math.PI/180)
      };

      this.vertex[i].affineIn.rotate = this.cubeRotate;
      this.vertex[i].affineIn.size = this.cubeSize;
      this.vertex[i].vertexUpdate();
      this.ctx.save();
      this.ctx.fillStyle = particleColor;
      this.ctx.beginPath();
      this.ctx.arc(this.vertex[i].affineOut.x, this.vertex[i].affineOut.y, this.vertex[i].affineOut.p * particleSize, 0, Math.PI*2, false);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
      this.dist[i] = { x: this.vertex[i].affineOut.x, y: this.vertex[i].affineOut.y, z: this.vertex[i].affineOut.z };
    }

    for(let s=0; s<this.dist.length; s++) {
      for(let k=0; k<this.dist.length; k++) {
        if(s===k) continue;

        const currentDistance = uf.calcDistance(this.dist[s], this.dist[k]);

        if(currentDistance < this.limitDistance) {
          this.ctx.save();
          this.ctx.beginPath();
          const alpha = (this.limitDistance - currentDistance) / this.limitDistance;
          this.ctx.strokeStyle = "rgba(20, 180, 255, " + alpha + ")";
          this.ctx.moveTo(this.dist[s].x, this.dist[s].y);
          this.ctx.lineTo(this.dist[k].x, this.dist[k].y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  };

  render() {
    const loop = () => {
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  };

  start() {
    this.render();
  };

  stop() {

  }

}
