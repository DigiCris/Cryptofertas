<?php

include_once 'call.php';

$rta=call('0xE54CB67B86335286bE90c63E6C9632846D3830a1','tokenURI(uint256)','1');
echo $rta;

echo "<br>";





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
function bcdechex($dec) {
            $last = bcmod($dec, 16);
            $remain = bcdiv(bcsub($dec, $last), 16);

            if($remain == 0) {
                return dechex($last);
            } else {
                return bcdechex($remain).dechex($last);
            }
        }

?>
