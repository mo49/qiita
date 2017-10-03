import $ from 'jquery';
import SampleScene from './scene/SampleScene';
import Camera from './camera/Camera';
import TimeAccumulator from './module/TimeAccumulator';
import TimeSkipper from './module/TimeSkipper';

module.exports = class App {

  static FPS = 60;
  static DPR = window.devicePixelRatio || 1;

  constructor(step) {

    this._update = this._update.bind(this);
    this._render = this._render.bind(this);
    this._tick = this._tick.bind(this);
    this._stop = this._stop.bind(this);
    this._restart = this._restart.bind(this);
    this._resize = this._resize.bind(this);

    this._wrapper = document.getElementById('app');

    // シーン
    this._scene = new SampleScene();

    // カメラ
    this._camera = Camera.instance;

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({antialias: false});
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(1);
    this._wrapper.appendChild(this._renderer.domElement);

    // リサイズ
    this._resize();
    window.addEventListener('resize', this._resize);

    this._start();
  }

  _start() {
    // 更新と描画
    this.timeAccumulator = new TimeAccumulator(this._update,App.FPS);
    this.timeSkipper = new TimeSkipper(this._render,App.FPS);
    this._tick();
  }

  _update(time,delta) {
    this._scene.update(time,delta);
  };
  _render(time,delta) {
    this._renderer.render(this._scene, this._camera);
  };
  _tick(time) {
    const currentTime = time / 1000; // sec
    this.timeAccumulator.exec(currentTime);
    this.timeSkipper.exec(currentTime);
    this.loopId = requestAnimationFrame(this._tick);
  }
  _stop() {
    cancelAnimationFrame(this.loopId);
  }
  _restart() {
    // deltaのズレを補正
    const currentTime = performance.now() / 1000;
    this.timeAccumulator.reset(currentTime);
    this.timeSkipper.reset(currentTime);
    this._tick();
  }

  _resize() {
    let width = this._wrapper.clientWidth;
    let height = this._wrapper.clientHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(App.DPR);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }

}
