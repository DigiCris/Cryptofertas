<?php

include_once 'call.php';
include_once 'DB_handler.php';
include_once 'ignore/env.php';
include_once 'utils.php';
desarrollo();

$NFT = new NFT();



$GLOBALS["insert"]=1; // if 1 then insert else update
$GLOBALS["embassador"]='0x0000000000000000000000000000000000000000';
$GLOBALS["tokenId"]=0;

$GLOBALS["id"]= 0;
$GLOBALS["dirty"]= 0;
$GLOBALS["price"]= 0;
$GLOBALS["used"]= 0;
$GLOBALS["forSale"]= 0;
$GLOBALS["owner"]= 0;
$GLOBALS["provider"]= 0;
$GLOBALS["tokenUri"]= 0;
$GLOBALS["lastRefreshed"]= date('Y-m-d h-m-s', time() );

//echo $GLOBALS["lastRefreshed"];
//exit();

getNextTokenId();
echo "<br>sali de getNextTokenId";
//exit();

//////////////////////////////////////////////de acaaaaaaaa /////////////////////////////////////////////

refreshValues();
echo "<br>sali de refreshValues";
//$GLOBALS["id"],$tokenId,$GLOBALS["lastRefreshed"],$GLOBALS["price"],$GLOBALS["used"],$GLOBALS["forSale"],$GLOBALS["owner"],$GLOBALS["provider"],$GLOBALS["embassador"],$GLOBALS["tokenUri"],$GLOBALS["choose"],$GLOBALS["dirty"];
$NFT->set_id($GLOBALS["tokenId"]);
$NFT->set_tokenId($GLOBALS["tokenId"]);
$NFT->set_lastRefreshed($GLOBALS["lastRefreshed"]);
$NFT->set_price($GLOBALS["price"]);
$NFT->set_used($GLOBALS["used"]);
$NFT->set_forSale($GLOBALS["forSale"]);
$NFT->set_owner($GLOBALS["owner"]);
$NFT->set_provider($GLOBALS["provider"]);
$NFT->set_embassador($GLOBALS["embassador"]);
$NFT->set_tokenUri($GLOBALS["tokenUri"]);
$NFT->set_choose($GLOBALS["choose"]+1);
$NFT->set_dirty($GLOBALS["dirty"]);
echo "<br>termine de setear los valores a update o insert";
if($GLOBALS["insert"])
{
    echo "<br>inserto".$GLOBALS["tokenId"];
    $NFT->insert();
}
else
{
    echo "<br>Update".$GLOBALS["tokenId"];
    $NFT->update();
}
echo "<br>";echo "<br>";echo "<br>";
$modified=$NFT->read($GLOBALS["tokenId"]);
print_r( json_encode($modified) );
//refresh_page(5, "index.php?tokenId=".$_GET['tokenId']);

////////////////////////////////////////// hasta aca/////////////////////////////////////////////////////////
function refreshValues()
{
    echo "tokenId=".$GLOBALS["tokenId"];
    echo "<br><br>";
    $GLOBALS["provider"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftProvider(uint256)',$GLOBALS["tokenId"],"address");
    $GLOBALS["owner"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','ownerOf(uint256)',$GLOBALS["tokenId"],"address");
    $GLOBALS["tokenUri"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','tokenURI(uint256)',$GLOBALS["tokenId"],"url");
    $GLOBALS["price"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','getPrice(uint256)',$GLOBALS["tokenId"],'uint');
    $GLOBALS["used"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','used(uint256)',$GLOBALS["tokenId"],"uint");
    $GLOBALS["forSale"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','inSale(uint256)',$GLOBALS["tokenId"],"uint");    
}


function getNextTokenId()
{
    echo "<br>entre a getNextTokenId";
    $NFTAUX = new NFT();
    $qry=$NFTAUX->read(0);
    echo "<br>lei BBDD en 0 guardndolo en qry";
    if(empty($qry))
    {
        echo "<br>entre al if porque qry estaba vacio";
        $GLOBALS["insert"]=1;
        $GLOBALS["choose"]=1;
        $GLOBALS["tokenId"]=0;
        echo "<br>el valor de tokenId que devuelvo es: ".$GLOBALS["tokenId"];
        echo "<br>el valor de choose que devuelvo es: ".$GLOBALS["choose"];
        return(0);
    }
    echo "<br>no entre al if porque qry tenía algo=><br>";
    print_r($qry);
    echo "<br><br>voy a buscar el tokenId mas grande";
    $NFTAUX2 = new NFT();
    $qry=$NFTAUX2->read_tokenId();
    echo "<br>busco el tokenId mas grande +1<br>";
    $GLOBALS["tokenId"]=( $NFTAUX2->get_tokenId() );
    echo "sin + 1 es=".$GLOBALS["tokenId"]."<br>";
    $GLOBALS["tokenId"]++;
    echo "con + 1 es=".$GLOBALS["tokenId"]."<br>";
    $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$GLOBALS["tokenId"],"address");
    if($GLOBALS["embassador"]=='0x0000000000000000000000000000000000000000')
    {// no existe
        echo "no existe ese tokenId en la blockchain<br>";
        $NFTAUX->read_choose();
        $GLOBALS["insert"]=0;
        $GLOBALS["tokenId"]= $NFTAUX->get_tokenId();
        $GLOBALS["choose"]= $NFTAUX->get_choose();
        $GLOBALS["choose"]++;
    }
    else
    {// existe
        echo "existe ese tokenId en la blockchain<br>";
        $GLOBALS["insert"]=1;
        $qry=$NFTAUX->read($GLOBALS["tokenId"]-1);
        $GLOBALS["choose"]= $NFTAUX->get_choose();
        echo "decido insertarlo y le pongo al chose el valor de: ".$GLOBALS["choose"]."<br>";
    }
    echo "el valor de tokenId que devuelvo es: ".$GLOBALS["tokenId"];
    return;

/*    
    $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$_GET['tokenId'],"address");
    debug("embassador",$GLOBALS["embassador"]);
    if($GLOBALS["embassador"]=='0x0000000000000000000000000000000000000000')
    {// there are no more NFTs to add so I should refresh
        $NFT->read_choose();
        $tokenId_=$NFT->get_tokenId();
        $GLOBALS["choose"]=$NFT->get_choose();
        $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$tokenId_,"address");
        $GLOBALS["insert"]=0;
        debug("entro al if. embassador",$GLOBALS["embassador"]);
    }
    else
    {// this NFT exists so if it is not in the DB I should add it if it is I should look for the choose...  i should insert
        $tokenId_=$_GET['tokenId'];
        $GLOBALS["insert"]=1;
        debug("entro al else. embassador",$GLOBALS["embassador"]);
    }
    $_GET['tokenId']=$tokenId_+1; //$_GET['tokenId'] will be the next value to send
    return($tokenId_);
*/
}



/*!
* \brief    Redirecciona a una cierta página pasado un cierto tiempo usando html.
* \details  Funcionamiento:  usa <META HTTP-EQUIV="REFRESH" CONTENT="'.$time.';URL='.$url.'">.
* \param $time  int que contiene el tiempo dentro del cual se producirá la redirección.
* \param $url   Dirección a la cual se redireccionará una vez alcanzado el tiempo especificado en $time.
* \return   No devuelve nada pero hace un echo en el html para producir la redirección.
*/
function refresh_page($time, $url)
{
        echo '<META HTTP-EQUIV="REFRESH" CONTENT="'.$time.';URL='.$url.'">';
}
/*----------------------------END refresh_page($time, $url) ----------------------------------*/



?>