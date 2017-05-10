<?php 
    define('UPLOAD_DIR', 'images/saved/');    
    $img = $_POST['imgBase64'];

	print $img; //for debugging..
	//for running..
	if(!$img) die("no data fetched");

    $img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.png';
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';

/*
error_reporting(E_ALL);
$target_path = "./images/saved/";
$new_img = "new_image.png";

if(file_exists($target_path)){
    $img = file_get_contents($image);
    if(strlen($img) >=1){
        file_put_contents($target_path . $new_img, $img);
    }else{
        echo 'Error fetching $image';
    }
}else{
    echo '$target_path not found';
}
*/



?>