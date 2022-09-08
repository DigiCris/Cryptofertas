<?php

include_once 'Keccak.php';
include_once 'ignore/env.php';
include_once 'utils.php';

function call($to,$func,$params,$returningType)
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

  if ($err) 
  {
    return (-1);
  } else 
  {
    $string='!"result":"(.*?)"}!';
    $response=get_any($string,$response);
    $response=decode($response,$returningType);
    return($response);
  }
}




?>

