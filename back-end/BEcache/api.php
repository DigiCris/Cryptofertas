<?php

header('Access-Control-Allow-Origin: *');

include_once 'DB_handler.php';

if(!isset($_GET['function']))
{
	//error. You need to specify a function
	echo "You need to specify a function";
	exit();
}
if(!isset($_GET['param']))
{
	//error. You need to specify a function
	if($_GET['function']!='readAll')
	{
		echo "You need to specify a param";
		exit();		
	}
}

switch ($_GET['function']) 
{
	case 'writeDirty':
		writeDirty($_GET['param']);
		break;
	
	case 'readOwner':
		readOwner($_GET['param']);
		break;

	case 'readProvider':
		readProvider($_GET['param']);
		break;

	case 'readAll':
		readAll();
		break;

	case 'readByCategory':
		readByCategory($_GET['param']);
		break;

	default:
		func_default();
		break;
}
exit();

function writeDirty($tokenId)
{
	$NFT = new NFT();
	$NFT->set_dirty(1);
	$success=$NFT->update_dirty($tokenId);
	echo $success;
}
function readOwner($wallet)
{
	$wallet = strtolower($wallet);
	$NFT = new NFT();
	$rta=$NFT->readOwner($wallet);
	echo json_encode($rta);
}
function readProvider($wallet)
{
	$wallet = strtolower($wallet);
	$NFT = new NFT();
	$rtas=$NFT->readProvider($wallet);
	echo json_encode($rtas);
}
function func_default()
{
	echo "not a function";
}
function readAll()
{
	$NFT = new NFT();
	$rtas=$NFT->read_all();
	echo json_encode($rtas);	
}
function readByCategory($category)
{
	$NFT = new NFT();
	$rta=$NFT->readByCategory($category);
	echo json_encode($rta);
}


?>