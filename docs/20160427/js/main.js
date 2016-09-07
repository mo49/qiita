var W, H;
var cv = null;

function canvasSupport() {
  return ( cv && cv.getContext );
}

window.onload = function() {
  init();
};
$(window).on('load resize', function(){
  init();
});

function init() {
  W = window.innerWidth;
  H = window.innerHeight;
  cv = document.getElementById("cv");
  if( !canvasSupport() ) return;
  cv.width = W;
  cv.height = H;
  var ctx = cv.getContext("2d");
  main( ctx );
}

function main( ctx ) {

  var snows = [];
  for( var i = 0; i < 150; i++ ) {
    var sn = new snow();
    snows.push(sn);
  }

  draw();
  setInterval(draw,10);

  function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,W,H);
    for( var i = 0; i < snows.length; i++ ) {
      var grad = ctx.createRadialGradient(snows[i].x, snows[i].y, 0, snows[i].x, snows[i].y, snows[i].radius);
      grad.addColorStop(0, "#FFFFFF");
      grad.addColorStop(0.3, "#FFFFFF");
      grad.addColorStop(0.3, snows[i].rgba);
      grad.addColorStop(1.0, "#000000");
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(snows[i].x, snows[i].y, snows[i].radius, 0, Math.PI * 2 ,false);
      ctx.fill();
      snows[i].move();
    }
  }

}

function snow() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = Math.random() * 2 - 2;
  this.vy = Math.random() * 3 + 5;
  this.rgba = "rgba(255, 255, 255," + Math.random()  + ")";
  this.radius = Math.random() * 10;
}

snow.prototype.move = function() {
  this.x += this.vx;
  this.y += this.vy;

  if( this.x < -50 ) this.x = W + 50;
  if( this.x > W + 50 ) this.x = -50;
  if( this.y > H ) this.y = -50;
};

