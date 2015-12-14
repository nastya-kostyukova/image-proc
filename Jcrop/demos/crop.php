<?php

error_reporting(E_ALL);
    ini_set('display_errors', true);

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
  $encodedFile = $_POST['file'];
  $decoded = base64_decode( str_replace('data:image/png;base64,','',$encodedFile));
  $filename = hash('md5',$decoded).".jpg";
  $fullName = getcwd() ."/../../assets/".$filename;

  file_put_contents($fullName,$decoded);

  $im = imagecreatefrompng($fullName);

  $to_crop_array = array('x' => intval($_POST['x']) , 'y' => intval($_POST['y']), 'width' => intval($_POST['width']), 'height'=> intval($_POST['height']));
  $thumb_im = imagecrop($im, $to_crop_array);

  imagejpeg($thumb_im, $fullName, 100);

      print 'http://'.$_SERVER['HTTP_HOST'].'/assets/'.$filename;

	exit;
}
