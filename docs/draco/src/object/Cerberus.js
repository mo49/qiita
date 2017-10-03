import EventEmitter from 'events';
import PubSub from 'pubsub-js';

export default class Cerberus extends THREE.Object3D {

  static ROTATION_SPEED = 100;
  _angle = 0;

  constructor(opts={}) {
    super();

    const loader = new THREE.DRACOLoader();
    loader.load('./model/Cerberus.obj.drc', geometry => {
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);
        mesh.scale.set(10, 10, 10);
        PubSub.publish('loadend');
    })
  }

  update(time,delta) {
    // 角度をインクリメント
    this._angle += delta * Cerberus.ROTATION_SPEED;
    let radian = this._angle * Math.PI / 180;

    this.rotation.set(
        0,
        radian * 0.2,
        0,
    );
  }
}
