<?php

include_once 'Keccak.php';
include_once 'ignore/env.php';

function call($to,$func,$params)
{
  //0x0000000000000000000000000000000000000000000000000000000000000045
  //0x00000000000000000000000006Eb67071a06E676b678F5dd3614D852C129d460
  $func = "0x".substr(Keccak256::hash($func, 256), 0, 8);
  $params=str_replace('0x', '', $params);
  $i=(64-strlen($params));
  while($i>0)
  {
    $params='0'.$params;
    $i--;
  }


  $curl = curl_init();

  curl_setopt_array($curl, [
    CURLOPT_URL => "https://eth-rinkeby.alchemyapi.io/v2/".$_POST['API_KEY_ALCHEMY'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => "{\"id\":1,\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"".$to."\",\"data\":\"".$func.$params."\"}]}",
    CURLOPT_HTTPHEADER => [
      "Accept: application/json",
      "Content-Type: application/json"
    ],
  ]);

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    return (-1);
  } else {
    return($response);
  }
}


/*
"result":"(?)"
*/



//echo urlAcondition(decodeAbiString("0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005068747470733a2f2f676174657761792e70696e6174612e636c6f75642f697066732f516d5338615576714d4c32724433776a4335344e786b6a626e7833487445574a775a567531474a3479767a63333400000000000000000000000000000000"));



function urlAcondition($url)
{
    $url=substr($url, strpos($url, "http"));
    return($url);
}

function decodeAbiString($HexaAbi)
{
    $HexaAbi=str_replace('0x', '', $HexaAbi);
    $stop=strlen($HexaAbi);
    $string='';
    for($start=0;$start<$stop;$start+=2)
    {
        $string=$string.hextostring($HexaAbi[$start].$HexaAbi[$start+1]);
    }
    return $string;
}

function hextostring($string)
{
    $replace=['','0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','.',':','/'];
    $search=['00','30','31','32','33','34','35','36','37','38','39','41','42','43','44','45','46','47','48','49','4a','4b','4c','4d','4e','4f','50','51','52','53','54','55','56','57','58','59','5a','61','62','63','64','65','66','67','68','69','6a','6b','6c','6d','6e','6f','70','71','72','73','74','75','76','77','78','79','7a','2e','3a','2f'];
    $string=str_replace($search, $replace, $string);
    return($string);
}


?>

