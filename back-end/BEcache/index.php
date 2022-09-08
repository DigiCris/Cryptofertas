<?php

include_once 'call.php';


for($tokenId=0;$tokenId<2;$tokenId++) // arround 20 seconds
{

    echo $tokenId;

    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftProvider(uint256)',$tokenId,"address");
    echo ('Provider: '.$rta);
    echo "<br>";
/*
    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','ownerOf(uint256)',$tokenId,"address");
    echo ('Owner: '.$rta);
    echo "<br>";
    
    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','tokenURI(uint256)',$tokenId,"url");
    echo ('tokenUri: '.$rta);
    echo "<br>";

    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','getPrice(uint256)',$tokenId,'uint');
    echo ('price: '.$rta);
    echo "<br>";

    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','used(uint256)',$tokenId,"uint");
    echo ('used: '.$rta);
    echo "<br>";

    $rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','inSale(uint256)',$tokenId,"uint");
    echo ('forSale: '.$rta);
    echo "<br>";
    */

    echo "<br>";
}


?>
