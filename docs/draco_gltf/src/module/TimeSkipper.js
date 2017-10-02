// exec(time)
// で経過時間分ごとにfuncを呼び出す

export default class TimeSkipper {
  constructor(func, fps) {
    this._func = func
    this._prev_time = 0
    this._time_unit = 1 / fps
  }

  reset(time) {
    this._prev_time = time
  }

  exec(time) {
    const elapsed_time = time - this._prev_time
    if(elapsed_time > this._time_unit) {
      this._func(this._prev_time, elapsed_time)
      this._prev_time = time
    }
  }
}
