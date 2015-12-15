<?php

error_reporting(E_ALL);
ini_set('display_errors', true);

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $encodedFile = $_POST['file'];
    $decoded = base64_decode( str_replace('data:image/png;base64,','',$encodedFile));
    $hashName = hash('md5',$decoded);
        $filename = $hashName.".jpg";
    $fullName = getcwd() ."/".$filename;
    $resFileName = $hashName."_1.jpg";

    file_put_contents($fullName, $decoded);


    chmod($fullName, 0777);

    if (!copy($fullName, $resFileName)) return false;

    $im = imagecreatefrompng($fullName);
    imagejpeg($im, $fullName, 100);

    $output = [];
    $cmd = "./sqface ".$filename." ". $resFileName;
    exec($cmd, $output);
    copy($hashName."_1.jpg", getcwd() ."/../assets/".$resFileName);
    unlink($fullName);
    unlink($resFileName);


    $coords = array();
    $coords[] = array();
    for($i = 0; $i < count($output); $i++) {
        $temp = explode(' ', $output[$i]);
        $coords[$i] = array('x1' => $temp[0], 'y1' => $temp[1],'x2' => $temp[2],'y2' => $temp[3]);
    }
    header('Content-type: application/json');
    $json = json_encode($coords);
    print $json;
    exit;
}
