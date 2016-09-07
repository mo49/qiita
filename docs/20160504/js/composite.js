// var fileAry = ['img/img.png', 'img/test.jpg', 'img/frame.png']; // 読み込みたい画像のパスの配列
// 　
// var numMaterials = fileAry.length;
// var loadedCounter = 0;
// var imgAry = [];
// 　
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');

// canvas.width = canvas.height = 500;
// canvas.height = 300;

// window.onload = function() {
// 	loadImgs();
// };

// function loadImgs(){

// 	var img = new Image();

// 	img.addEventListener('load', function(){
// 		loadedCounter++;
// 		imgAry.push(img);
// 		if(numMaterials == loadedCounter){
// 			display(); // 画像をすべて読み込んだら描画
// 		} else {
// 			loadImgs();
// 		}
// 	}, false);
// 　
// 　　img.src = fileAry[imgAry.length];
// }

// // 参照が残っているとガベージコレクトされないため、
// // 明示的にImageオブジェクトを解放
// function display(){
// 	for (var i in imgAry){
// 		ctx.drawImage(imgAry[i], 0, 0, canvas.width, canvas.height);
// 		imgAry[i] = null;
// 	}
// }

// // ctx.clearRect(0,0,canvas.width, canvas.height);
// // display();

// var dataURL = canvas.toDataURL('image/png');
// console.log(dataURL);	


// /*

// canvas.width, canvas.heightでcanvasのサイズ、
// drawImage()で画像のサイズを決める。


// */



/*

canvasで画像の合成

canvas.width, canvas.heightでcanvasのサイズ、
drawImage()で画像のサイズを決める。

http://www.riaxdnp.jp/?p=1570

*/


// 読み込みたい画像のパスの配列 後ろが上にくる
var fileAry = ['img/test1.png', 'img/test2.png', 'img/test3.png'];
　
var numFiles = fileAry.length;
var loadedCounter = 0;
var imgAry = [];
　
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = canvas.height = 500;

window.onload = function() {
	loadImgs();
};

function loadImgs(){

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
		ctx.drawImage(imgAry[i], 0, 0, canvas.width, canvas.height);
		imgAry[i] = null;
	}
}



