
export default class TimeSkipper {
  constructor(func, fps) {
    this._func = func;
    this._prevTime = 0;
    this._timeUnit = 1 / fps;
  }

  reset(time) {
    this._prevTime = time;
  }

  exec(time) {
    const elapsedTime = time - this._prevTime;
    if(elapsedTime > this._timeUnit) {
      this._func(this._prevTime, elapsedTime);
      this._prevTime = time;
    }
  }
}
