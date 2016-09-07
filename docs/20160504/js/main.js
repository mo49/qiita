
// トリミングしてcanvas要素に描画して返す関数
function trimImage (imgSrc) {

    var TRIM_SIZE = 300;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = canvas.height = TRIM_SIZE;
    canvas.id = 'canvas-photo';

    var img = new Image();
    img.src = imgSrc + '?' + (new Date).getHours(); // IE対策

    // imgは読み込んだ後でないとwidth,heightが0
    img.onload = function() {
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
        console.log("img.width : " + img.width);
        console.log("img.height : " + img.height);
        ctx.drawImage(img, xOffset, yOffset, width, height);
    };
    
    return canvas;
}

// トリミングしたcanvasを追加
var imgSrc = 'http://lorempixel.com/640/340/sports/';
$('body').append( trimImage(imgSrc) );




