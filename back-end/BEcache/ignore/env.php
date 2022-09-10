<?php
$_POST['API_KEY_ALCHEMY']="cSFHLV2Gx_8V_YX9htkrrn_CZCw5ZnMJ";

$_POST['DatabaseName']="tradersa_Cryptofertas";
$_POST['UserbaseName']="tradersa_cryptofertas";
$_POST['Password']="(PCub#{]P#x^;sT#m6";

$_POST["OURAPIKEY"]="1234";




//define("DESARROLLO", "DEBUG"); // DEBUG si estamos desarrollando, PRODUCCION si estamos en producción. Por defecto tomar produccion
//define("DESARROLLO", "PRODUCCION"); // DEBUG si estamos desarrollando, PRODUCCION si estamos en producción. Por defecto tomar produccion
define("DESARROLLO", "DEBUGSCREAN"); // Modo debug pero todo en php, sin javascript. y no muestra notificaciones ni errores.
define("PAGINA", "cryptofertas.tk");
function desarrollo()
{
	if(DESARROLLO=="DEBUG")
	{
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
		ini_set('display_startup_errors', 1);
		return 1;
	}
	else
	{
		if(DESARROLLO=="DEBUGSCREAN")
		{
			return 2;
		}
		else
		{
			ini_set('display_errors', 0);
			ini_set('display_startup_errors', 0);
			error_reporting(0);
			return 0;			
		}
	}
}

?>