
var Circle = function(){
  // デフォルトで呼び出されるメソッドを定義
  return this.set();
};

Circle.prototype.set = function(){
  var radian = Math.random() * (Math.PI * 360);
  this.x = cv.width * Math.random(); 
  this.y = cv.height * Math.random(); 
  this.to_x = Math.cos( radian );
  this.to_y = Math.tan( radian );
  this.speed = Math.random() * 3 + 2;
  this.size = Math.random() * 8 + 3;
  // this.color(); // 初回だけならこちらで設定
};

Circle.prototype.move = function(){
  this.x += this.to_x * this.speed;
  this.y += this.to_y * this.speed;
  this.out_square_in();
  this.color();
};

// 画面からはみ出したとき戻す
Circle.prototype.out_square_in = function(){
  if( this.x + this.size < 0 ) this.x = cv.width;
  if( cv.width < this.x ) this.x = 0 - this.size;
  if( this.y + this.size < 0 ) this.y = cv.height;
  if( cv.height < this.y ) this.y = 0 - this.size;
};

Circle.prototype.color = function(){
  this.r = Math.floor(Math.random()*255);
  this.g = Math.floor(Math.random()*255);
  this.b = Math.floor(Math.random()*255);
};