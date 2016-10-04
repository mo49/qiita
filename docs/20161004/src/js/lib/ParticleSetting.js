export const uv = { // util variable
  ww : window.innerWidth,
  wh : window.innerHeight
}
export const uf = { // util function
  dtr : (d) => d*Math.PI/180, // degree to radian
  randomPos : () => Math.sin( Math.floor(Math.random()*360) * Math.PI/180 ),
  calcDistance : (p1, p2, p3) => Math.sqrt( Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2) + Math.pow(p2.z-p1.z,2) )
}


export const camera = {
  self: {
    x: 0,
    y: 0,
    z: uv.ww*2
  },
  target: {
    x: 0,
    y: 0,
    z: 0
  },
  distance: {
    x: 0,
    y: 0,
    z: 0
  },
  angle: {
    cosPhi   : 0,
    sinPhi   : 0,
    cosTheta : 0,
    sinTheta : 0
  },
  zoom: 1,
  display: {
    x: uv.ww/2,
    y: uv.wh/2,
    z: 0
  },
  update: () => {
    const cd = camera.distance;
    const ct = camera.target;
    cd.x = ct.x - camera.self.x;
    cd.y = ct.y - camera.self.y;
    cd.z = ct.z - camera.self.z;
    camera.angle.cosPhi = -cd.z / Math.sqrt(cd.x*cd.x + cd.z*cd.z);
    camera.angle.sinPhi = cd.x / Math.sqrt(cd.x*cd.x + cd.z*cd.z);
    camera.angle.cosTheta = Math.sqrt(cd.x*cd.x + cd.z*cd.z) / Math.sqrt(cd.x*cd.x + cd.y*cd.y + cd.z*cd.z);
    camera.angle.sinTheta = -cd.y / Math.sqrt(cd.x*cd.x + cd.y*cd.y + cd.z*cd.z);
  }
};

export const affine = {
  world: {
    size: (p, size) => {
      return {
        x: p.x*size.x,
        y: p.y*size.y,
        z: p.z*size.z
      };
    },
    rotate: {
      x: (p, rotate) => {
        return {
          x: p.x,
          y: p.y*Math.cos(uf.dtr(rotate.x)) - p.z*Math.sin(uf.dtr(rotate.x)),
          z: p.y*Math.sin(uf.dtr(rotate.x)) + p.z*Math.cos(uf.dtr(rotate.x))
        };
      },
      y: (p, rotate) => {
        return {
          x: p.x*Math.cos(uf.dtr(rotate.y)) + p.z*Math.sin(uf.dtr(rotate.y)),
          y: p.y,
          z: -p.x*Math.sin(uf.dtr(rotate.y)) + p.z*Math.cos(uf.dtr(rotate.y))
        };
      },
      z: (p, rotate) => {
        return {
          x: p.x*Math.cos(uf.dtr(rotate.z)) - p.y*Math.sin(uf.dtr(rotate.z)),
          y: p.x*Math.sin(uf.dtr(rotate.z)) + p.y*Math.cos(uf.dtr(rotate.z)),
          z: p.z
        };
      }
    },
    position: (p, position) => {
      return {
        x: p.x + position.x,
        y: p.y + position.y,
        z: p.z + position.z
      };
    }
  },
  view: {
    phi: (p) => {
      return {
        x: p.x*camera.angle.cosPhi + p.z*camera.angle.sinPhi,
        y: p.y,
        z: p.x*-camera.angle.sinPhi + p.z*camera.angle.cosPhi
      };
    },
    theta: (p) => {
      return {
        x: p.x,
        y: p.y*camera.angle.cosTheta - p.z*camera.angle.sinTheta,
        z: p.y*camera.angle.sinTheta + p.z*camera.angle.cosTheta
      };
    },
    viewReset: (p) => {
      return {
        x: p.x - camera.self.x,
        y: p.y - camera.self.y,
        z: p.z - camera.self.z
      };
    }
  },
  perspective: (p) => {
    return {
      x: p.x * camera.distance.z/p.z * camera.zoom,
      y: p.y * camera.distance.z/p.z * camera.zoom,
      z: p.z * camera.zoom,
      p: camera.distance.z/p.z
    };
  },
  display: (p, display) => {
    return {
      x: p.x + display.x,
      y: -p.y + display.y,
      z: p.z + display.z,
      p: p.p
    };
  },
  process: (model, size, rotate, position, display) => {
    const aw = affine.world;
    const av = affine.view;
    var ret = aw.size(model, size);
    ret = aw.rotate.x(ret, rotate);
    ret = aw.rotate.y(ret, rotate);
    ret = aw.rotate.z(ret, rotate);
    ret = aw.position(ret, position);
    ret = av.phi(ret);
    ret = av.theta(ret);
    ret = av.viewReset(ret);
    ret = affine.perspective(ret);
    ret = affine.display(ret, display);
    return ret;
  }
};
