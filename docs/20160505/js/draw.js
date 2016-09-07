var old_x = 0;
var old_y = 0;
var x;
var y;
var txy = 15; //iPadなどは+15すると良いかも
var globalCompositeOperation  = 'source-over'; //合成処理の変更
var selectColor = '#000';
var selectSize = 1;
var selectEmoji = '';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

window.onload = function() {
	canvas.height = canvas.width = 300;
	canvas.addEventListener("touchstart", touchStart, false);
	canvas.addEventListener("touchmove", touchMove, false);
	canvas.addEventListener("orientationchange", canvasDelete, true);
}

function touchStart(e) {
	old_x = e.touches[0].pageX;
	old_y = e.touches[0].pageY;
}

function touchMove(e) {
	e.preventDefault();

	x = e.touches[0].pageX;
	y = e.touches[0].pageY;

	drawLine(old_x, old_y, x, y);
	old_x = x;
	old_y = y;
}

function drawLine(x1, y1, x2, y2) {
    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.strokeStyle = selectColor;
	ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = selectSize;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.fillStyle = selectColor;
    ctx.font = "20px sans";
    ctx.fillText(selectEmoji, x2-30, y2);
	ctx.closePath();
	ctx.stroke();
}

// 左に傾けると消去
function canvasDelete(e) {
	if (window.orientation >= 90) { // 左に90度 右なら-90度
		var alert = confirm("消去しますか？");
		if (alert == false) {return;}
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

// 色の変更
$('#btn-color').on('change', function(){
	selectColor = $(this).val();
});

// 消しゴム
var flag_eraser = true;
$("#btn-eraser").on('click', function(){
	if ( flag_eraser ) {
		globalCompositeOperation = 'destination-out';
		flag_eraser = false;
	} else {
		globalCompositeOperation = 'source-over';
		flag_eraser = true; 
	}
});

// サイズの変更
$('.btn-size').on('touchstart', function(){
	selectSize = $(this).data('size');
});

// 絵文字の変更
$('.btn-emoji').on('touchstart', function(){
	selectEmoji = $(this).data('emoji');
});



// http://www.html5.jp/canvas/ref/property/globalCompositeOperation.html



