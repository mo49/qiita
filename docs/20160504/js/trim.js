/* ======================================
 * File API
 * ====================================== */

function previewFile() {
	var preview = document.querySelector('#user-photo');
	var file    = document.querySelector('input[type=file]').files[0];
	var reader  = new FileReader();

	reader.onloadend = function () {
		$('#canvas-trim').remove(); // 2度クリックされた場合
		preview.src = reader.result;
		imgGen();
	};

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}


/* ======================================
 * トリミング
 * ====================================== */

var TRIM_SIZE = 300;

function imgGen(){
	var img = document.getElementById("user-photo");
	$('body').append( trimImage(img) );
}

function trimImage (img) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = canvas.height = TRIM_SIZE;
    canvas.id = 'canvas-trim';

    console.log(img.width);

    // 横長か縦長かで場合分けして描画位置を調整
    var width, height, xOffset, yOffset;
    if (img.width > img.height) {
        height = TRIM_SIZE;
        width = img.width * (TRIM_SIZE / img.height);
        xOffset = -(width - TRIM_SIZE) / 2;
        yOffset = 0;
    } else {
        width = TRIM_SIZE;
        height = img.height * (TRIM_SIZE / img.width);
        yOffset = -(height - TRIM_SIZE) / 2;
        xOffset = 0;
    }

	ctx.drawImage(img, xOffset, yOffset, width, height);
    
    return canvas;
}


/* ======================================
 * 合成
 * ====================================== */

var loadedCounter = 0;
var imgAry = [];
　
var canvasResult = document.getElementById('canvas-result');
var ctx = canvasResult.getContext('2d');

canvasResult.width = canvasResult.height = TRIM_SIZE;

$('#btn-genLogo').on('click', function(){
	loadImgs();
});

function loadImgs(){

	var trimImg = document.getElementById("canvas-trim").toDataURL();
	var fileAry = [trimImg, 'img/frame.png'];
	var numFiles = fileAry.length;

	var img = new Image();

	img.addEventListener('load', function(){
		loadedCounter++;
		imgAry.push(img);
		if(numFiles == loadedCounter){
			display(); // 画像をすべて読み込んだら描画
		} else {
			loadImgs();
		}
	}, false);
　
　　img.src = fileAry[imgAry.length];
}

// 参照が残っているとガベージコレクトされないため、
// 明示的にImageオブジェクトを解放
function display(){
	for (var i in imgAry){
		ctx.drawImage(imgAry[i], 0, 0, canvasResult.width, canvasResult.height);
		imgAry[i] = null;
	}
}



