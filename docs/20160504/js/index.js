// 読み込みたい画像のパスの配列 後ろが上にくる
var fileAry = ['img/test1.jpg', 'img/frame.png', 'img/font.gif'];
　
var numFiles = fileAry.length;
var loadedCounter = 0;
var imgAry = [];
　
var canvas = document.getElementById('canvas-result');
var ctx = canvas.getContext('2d');

canvas.width = canvas.height = 300;

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
        var imgSrc = imgAry[i].src;
        // canvasの一部分に描画
        if (imgSrc.match(/font/)) {
            ctx.drawImage(imgAry[i], 20, canvas.height-100, 640/4, 300/4);
            continue;
        }
        // canvasの全面に描画
        ctx.drawImage(imgAry[i], 0, 0, canvas.width, canvas.height);
        imgAry[i] = null;
    }
}