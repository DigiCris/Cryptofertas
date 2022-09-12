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
$GLOBALS["category"]= 254;
$GLOBALS["dirty"]= 0;
$GLOBALS["price"]= 0;
$GLOBALS["used"]= 0;
$GLOBALS["forSale"]= 0;
$GLOBALS["owner"]= 0;
$GLOBALS["provider"]= 0;
$GLOBALS["tokenUri"]= 0;
$GLOBALS["lastRefreshed"]= date('Y-m-d h-m-s', time() );

getNextTokenId();
debug("sali de getNextTokenId",'',0);


//////////////////////////////////////////////de acaaaaaaaa /////////////////////////////////////////////

refreshValues();
debug("sali de refreshValues",'',0);
//$GLOBALS["id"],$tokenId,$GLOBALS["lastRefreshed"],$GLOBALS["price"],$GLOBALS["used"],$GLOBALS["forSale"],$GLOBALS["owner"],$GLOBALS["provider"],$GLOBALS["embassador"],$GLOBALS["tokenUri"],$GLOBALS["choose"],$GLOBALS["dirty"];
$NFT->set_id($GLOBALS["tokenId"]);
$NFT->set_tokenId($GLOBALS["tokenId"]);
$NFT->set_category($GLOBALS["category"]);
$NFT->set_lastRefreshed($GLOBALS["lastRefreshed"]);
$NFT->set_price($GLOBALS["price"]);
$NFT->set_used($GLOBALS["used"]);
$NFT->set_forSale($GLOBALS["forSale"]);
$NFT->set_owner($GLOBALS["owner"]);
$NFT->set_provider($GLOBALS["provider"]);
$NFT->set_embassador($GLOBALS["embassador"]);
$NFT->set_tokenUri($GLOBALS["tokenUri"]);
$NFT->set_choose($GLOBALS["choose"]);
$NFT->set_dirty($GLOBALS["dirty"]);
debug("termine de setear los valores a update o insert",'',0);
if($GLOBALS["insert"])
{
    debug("inserto ",$GLOBALS["tokenId"],0);
    $NFT->insert();
}
else
{
    debug("Update ",$GLOBALS["tokenId"],0);
    $NFT->set_dirty(0);
    $NFT->update($GLOBALS["tokenId"]);
}

$modified=$NFT->read($GLOBALS["tokenId"]);
debug("modified in json format ",'',0);
print_r(json_encode($modified));


//if an update was done and there is no more dirty flags I don't need to refresh it and save API calls.
$modified=$NFT->read_choose();
if( ($GLOBALS["insert"]==0) && empty($modified) )
{
    debug("No need to refresh ",'',0);
}
else
{
   refresh_page(1, "index.php"); 
}

////////////////////////////////////////// hasta aca/////////////////////////////////////////////////////////
function refreshValues()
{
    debug("en refreshValues tokenId ",$GLOBALS["tokenId"],0);
    //
    $GLOBALS["provider"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftProvider(uint256)',$GLOBALS["tokenId"],"address");
    $GLOBALS["owner"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','ownerOf(uint256)',$GLOBALS["tokenId"],"address");
    $GLOBALS["tokenUri"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','tokenURI(uint256)',$GLOBALS["tokenId"],"url");
    $GLOBALS["price"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','getPrice(uint256)',$GLOBALS["tokenId"],'uint');
    $GLOBALS["used"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','used(uint256)',$GLOBALS["tokenId"],"uint");
    $GLOBALS["forSale"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','inSale(uint256)',$GLOBALS["tokenId"],"uint"); 
    $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$GLOBALS["tokenId"],"address");  
    $GLOBALS["category"]=getCategory($GLOBALS["tokenUri"]);   
}


function getNextTokenId()
{
    debug("entre a getNextTokenId",'',0);
    $NFTAUX = new NFT();
    $qry=$NFTAUX->read(0);
    debug("lei BBDD en 0 guardndolo en qry",'',0);
    if(empty($qry))
    {
        debug("entre al if porque qry estaba vacio",'',0);
        $GLOBALS["insert"]=1;
        $GLOBALS["choose"]=1;
        $GLOBALS["tokenId"]=0;
        debug("el valor de tokenId que devuelvo es ",$GLOBALS["tokenId"],0);
        debug("el valor de choose que devuelvo es ",$GLOBALS["choose"],0);
        return(0);
    }
    debug("no entre al if porque qry tenía algo ",$qry,0);
    debug("voy a buscar el tokenId mas grande",'',0);
    $NFTAUX2 = new NFT();
    $qry=$NFTAUX2->read_tokenId();
    $GLOBALS["tokenId"]=$qry['tokenId'];
    debug("busco el tokenId mas grande",$GLOBALS["tokenId"],0);
    $GLOBALS["tokenId"]++;
    debug("Le sumo 1",$GLOBALS["tokenId"],0);
    $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$GLOBALS["tokenId"],"address");
    if($GLOBALS["embassador"]=='0x0000000000000000000000000000000000000000')
    {// it doesn't exist
        debug("no existe ese tokenId en la blockchain",$GLOBALS["tokenId"],0);
        debug("embassador ",$GLOBALS["embassador"],0);
        $qry=$NFTAUX->read_choose();
        debug("read_choose en tokenId devuelve ",$qry['tokenId'],0);
        $GLOBALS["insert"]=0;
        $GLOBALS["tokenId"]=$qry['tokenId'];
        debug("el token id a leer sera ",$GLOBALS["tokenId"],0);
        $GLOBALS["choose"]= $qry['choose'];
        $GLOBALS["choose"]++;
        debug("su nuevo choose sera ",$GLOBALS["choose"],0);
    }
    else
    {// exists
        debug("Existe ese tokenId en la blockchain",'',0);
        $GLOBALS["insert"]=1;
        $qry=$NFTAUX->read($GLOBALS["tokenId"]-1);
        $GLOBALS["choose"]= $NFTAUX->get_choose();
        debug("decido insertarlo y le pongo al chose el valor de",$GLOBALS["choose"],0);
    }
    debug("el valor de tokenId que devuelvo es ",$GLOBALS["tokenId"],0);
    return;

/*    
    $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$_GET['tokenId'],"address");
    //debug("embassador",$GLOBALS["embassador"]);
    if($GLOBALS["embassador"]=='0x0000000000000000000000000000000000000000')
    {// there are no more NFTs to add so I should refresh
        $NFT->read_choose();
        $tokenId_=$NFT->get_tokenId();
        $GLOBALS["choose"]=$NFT->get_choose();
        $GLOBALS["embassador"]=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','nftEmbasador(uint256)',$tokenId_,"address");
        $GLOBALS["insert"]=0;
        //debug("entro al if. embassador",$GLOBALS["embassador"]);
    }
    else
    {// this NFT exists so if it is not in the DB I should add it if it is I should look for the choose...  i should insert
        $tokenId_=$_GET['tokenId'];
        $GLOBALS["insert"]=1;
        //debug("entro al else. embassador",$GLOBALS["embassador"]);
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