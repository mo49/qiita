<?php
//POSTパラメータを取得
$sleep = $_POST["sleep"];
sleep($sleep); //Timeoutテスト用

$jsonp = '
jsonp_data(
  [
    {
      "src":"img/img1.JPG",
      "alt":"サモトラケのニケ"
    },
    {
      "src":"img/img2.JPG",
      "alt":"入り口ピラミッド"
    },
    {
      "src":"img/img3.JPG",
      "alt":"ナポレオン戴冠式"
    }
  ]
);
';

echo $jsonp;

?>
