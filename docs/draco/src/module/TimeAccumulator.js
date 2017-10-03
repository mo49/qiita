// exec(time)
// で経過時間分だけfuncを呼び出すクラス
// 遅い端末でも問題なくプレイできるように
// updateにこいつをかませる

const LIMIT_FUNC_CALL_PER_EXEC = 6 // 1回のexecで6回以上は呼ばない

export default class TimeAccumulator {
  constructor(func, fps) {
    this._func = func
    this._prev_time = 0
    this._time_unit = 1 / fps
  }

  reset(time) {
    this._prev_time = time
  }

  exec(time) {
    let call_count = 0
    while(this._prev_time < time && call_count < LIMIT_FUNC_CALL_PER_EXEC) {
      this._func(this._prev_time, this._time_unit)
      this._prev_time += this._time_unit
      call_count += 1
    }

    if(call_count >= LIMIT_FUNC_CALL_PER_EXEC && this._prev_time < time) {
      // LIMITの回数だけ実行しても追いつかないときは全て飛ばす
      // キング・クリムゾン
      this._func(time, time - this._prev_time)
      this._prev_time = time
    }
  }
}
