'use strict';

(function(){

var cv = document.getElementById("cv");
var ctx = cv.getContext("2d");

setCanvasSize();
function setCanvasSize() {
  cv.style.width = window.innerWidth + 'px';
  cv.style.height = window.innerHeight + 'px';
  cv.width = window.innerWidth * window.devicePixelRatio;
  cv.height = window.innerHeight * window.devicePixelRatio;
}
$(window).on('resize load', function(){
  setCanvasSize();
});

// スワイプによるスクロールを禁止させる
document.body.addEventListener('touchstart', function(event) {
  event.preventDefault();
});

// canvasが使用可能か判定
if( cv && cv.getContext ) {
  canvasInit();
}

function canvasInit(){

  var instances = [];
  var count = 0;

  for( var i = 1; i <= 100; i++ ){
    instances.push( new Circle() );
  }

  function draw(){
    // 背景
    var p;
    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, cv.width, cv.height );

    // 円
    for ( var i = 0; i < instances.length; i++) {
      p = instances[i];
      ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ', 1)';
      ctx.beginPath();
      ctx.arc( p.x, p.y, p.size, 0, Math.PI * 2, false );     
      if (count > 1500) {
        ctx.arc( p.x, p.y, p.size*3, 0, Math.PI * 2, false );     
        if(count > 2000){ count = 0; }
      }
      count++;
      ctx.fill();
      p.move();
    }
  }
  setInterval(draw, 50);

}

})();