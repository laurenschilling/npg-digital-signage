<!-- PHP test script to save iamge
Must be run on server to work
- camera needs SSL if on dev server
- try https://dev.beneb.com/npg/page3.html
- ignore security exception - shared SSL cert.
- Saves image, but 0 bytes

-->

<?php 
    define('UPLOAD_DIR', 'images/saved/');    
    $img = $_POST['data'];
    $img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.png';
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';

?>