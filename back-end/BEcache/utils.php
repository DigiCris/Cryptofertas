<?php



function decode($value,$type)
{
	$value=trim( strtolower($value) );
	switch ($type) 
	{
	    case 'string':
	        $value=decodeAbiString($value);
	        break;
	    case 'url':
	        $value=urlAcondition( decodeAbiString($value) );
	        break;
	    case 'uint':
	        $value=bchexdec($value);
	        break;
	    case 'bool':
	        $value=bchexdec($value);
	        if(0==$value)
	        {
	        	$value=false;
	        }
	        else
	        {
	        	$value=true;
	        }
	        break;
	    case 'address':
	    	$value=bchexdec($value);
	    	$value=bcdechex($value);
	    	while( strlen($value) < 40 )
	    	{
	    		$value='0'.$value;
	    	}
	    	$value='0x'.$value;
	    	break;
	}
	return($value);
}


function get_any($string,$content)
{
    preg_match_all($string,$content, $match);
    $precio= $match[1][0];
    return $precio;
}


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




function bchexdec($hex)
{
    $dec = 0;
    $len = strlen($hex);
    for ($i = 1; $i <= $len; $i++) 
    {
        $dec = bcadd($dec, bcmul(strval(hexdec($hex[$i - 1])), bcpow('16', strval($len - $i))));
    }
    return $dec;
}
function bcdechex($dec) 
{
    $last = bcmod($dec, 16);
    $remain = bcdiv(bcsub($dec, $last), 16);

    if($remain == 0) 
    {
        return dechex($last);
    } else 
    {
        return bcdechex($remain).dechex($last);
    }
}



/*!
* \brief 	Si está en modo debuging imprime en consola $texto => $valor. Y así poder seguir los errores.
* \details 	Funcionamiento: Comprueba la constante DESARROLLO de ../constantes.php. si está en modo debuging escribe un script
*					En Javascript que imprime el texto y el valor enviado.	
* \param string $texto 	Es el string que vamos a imprimmir para identificar que es lo que estamos imprimiendo
* \param string $valor 	Es cualquier valor que quiera imprimir en consola para estudiar el comportamiento de mi programa.
* \param string $alert 	si es 1 en vez de imprimir por consola el valor lo manda por un alert.
* \return 	string <script>...</script> 	Imprime javascript en el documento para debuguear
*/
function debug($texto,$valor,$alert=0)
{
	$state=desarrollo();
	if($state==1)
	{ // si es debug entra acá
		if(is_array($valor))
		{
			$IsArray=1;
			$valor=json_encode($valor);
			$valor = preg_replace("[\n|\r|\n\r]", "", $valor);//url(\\'lib\/drophere.png\\')
			$valor=str_replace("'", '"', $valor);
		}
		else
		{
			$IsArray=0;
		}
		$valor = preg_replace("[\n|\r|\n\r]", "", $valor);//url(\\'lib\/drophere.png\\')
		$valor=str_replace("'", '"', $valor);
		echo '<script>';
		$texto=$texto.'=>'.$valor;
		if($alert==0)
		{
			if($IsArray)
			{
				echo "console.log('".$texto."');";
			}
			else
			{
				echo "console.log('".$texto."');";
				//echo 'console.log("'.$texto.'");';
			}
		}
		else
		{
			if($IsArray)
			{
				echo 'alert('.$texto.');';
			}
			else
			{
				echo 'alert("'.$texto.'");';
			}
		}
		echo '</script>';
	}
	if($state==2)
	{
		if(is_array($valor))
		{
			echo '<br>';
			echo $texto."= ";
			print_r($valor);
			echo '<br>';
		}
		else
		{
			echo '<br>';
			echo $texto."= ";
			echo $valor;
			echo '<br>';
		}
	}
}


function getCategory($url)
{
	$result=file_get_contents($url);
	$result=json_decode($result,true);
	$category=$result['attributes'][0]['value'];
	debug("categoría ",$category,0);
	return($category);
}

?>