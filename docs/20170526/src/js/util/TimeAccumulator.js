
const CALL_FUNC_LIMIT_PER_FRAME = 6;

export default class TimeAccumulator {
  constructor(func, fps) {
    this._func = func;
    this._prevTime = 0;
    this._timeUnit = 1 / fps;
  }

  reset(time) {
    this._prevTime = time;
  }

  exec(time) {
    let callCount = 0;
    while(this._prevTime < time && callCount < CALL_FUNC_LIMIT_PER_FRAME) {
      this._func(this._prevTime, this._timeUnit);
      this._prevTime += this._timeUnit;
      callCount++;
    }
    if(callCount >= CALL_FUNC_LIMIT_PER_FRAME && this._prevTime < time) {
      this._func(time, time - this._prevTime);
      this._prevTime = time;
    }
  }
}
