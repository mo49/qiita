<?php
//POSTパラメータを取得
$id = $_POST["id"];
$mode = $_POST["mode"];
$type = $_POST["type"];
$sleep = $_POST["sleep"];
$date = date("Y-m-d H-i-s");
sleep($sleep); //Timeoutテスト用
//受け取ったデータをjson形式で出力
$json = '[
	{
		"id" : "'.$id.'",
		"mode" : "'.$mode.'",
		"type" : "'.$type.'",
		"date" : "'.$date.'"
	}
]';
echo $json;

?>
