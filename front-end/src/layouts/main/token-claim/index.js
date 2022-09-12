import { useState, useCallback, useEffect } from "react";
import {Flex, Button, Tag, TagLabel} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React} from "@web3-react/core";
import { connector } from "../../../config/web3";
import useERC20 from '../../../hooks/useERC20'
import { useToast } from '@chakra-ui/react';

const TokenClaim = () => {

  const [balance2, setbalance2] = useState(0);
  const [vestingQuantity, setVestingQuantity] = useState(0);
  const [vestingDate, setVestingDate] = useState(0);

  const { account, library, active } = useWeb3React();
  const toast = useToast();

  const erc20 = useERC20();

/*
  const getbalance2 = useCallback(async () => {
    setbalance2(10);//(balance2 / 1e18).toFixed(2));                // I want to show here how much do they have to claim
  }, [account, library]);
*/

  useEffect(() => {
    if (active) balance2Of();
  }, [active], [balance2Of],[]);



  async function balance2Of()
  {
    
    let totalVesting= await erc20.methods.vestingQuantity(account).call();
    //await setbalance2(vestq);
    //alert("totalVesting before="+totalVesting);
    totalVesting=Acondicionar_numero(totalVesting);
    //alert("totalVesting after="+totalVesting);
    var acumulatedVesting=0;
    var toHarvest=0;

    for(let i=0;totalVesting>acumulatedVesting; i++) // my idea is to loop the vesting dates until I reach the total quantity and I only count the dates which are set to 0. the acumulated of that would be what I am allowed to claim
    {
      var {0:vest, 1:time}= await erc20.methods.getVestingDates(account , i).call();
      //alert("vest before="+vest);
      vest=Acondicionar_numero(vest);
      //alert("vest after="+vest);

      //alert("acumulatedVesting before= "+acumulatedVesting);
      acumulatedVesting=parseFloat( parseFloat(acumulatedVesting)+parseFloat(vest) );  
      //alert("acumulatedVesting after add= "+acumulatedVesting);
      acumulatedVesting=parseFloat( parseFloat(acumulatedVesting)+parseFloat(0.01) ); // to solve problem of truncating numbers
      //alert("acumulatedVesting + 0.1 ="+acumulatedVesting);
      
      if(time==0)
      {
        toHarvest=parseFloat( parseFloat(toHarvest)+parseFloat(vest) );
      }
    }
    //toHarvest=10.32;
    console.log("toHarvest="+toHarvest); 
    setbalance2(toHarvest);
    //await setbalance2( (balance2 / 1e18).toFixed(2) );
  
  }


function lookFor(numero,character)
{
  for(let i=0; i<=numero.length; i++)
    {
        if(numero[i]==character)
        {
            return(true);
        }
    }
    return(false);
}

function Acondicionar_numero(numero)
{ // don't send an integer number already treated or it would take it as a non treated string. isNaN was not working to make the distinction
  //alert("entre a cortar numero");
  numero=numero.toString();
  //alert("stringed= "+numero);

  // here all the numers are string
  if(lookFor(numero,'.'))
  {
    numero=parseFloat(numero).toFixed(2);
    return( parseFloat(numero) );
  }
  else
  {
   //alert("I didnot find .');
  }
  numero = numero.replace('.', '');
  numero = numero.replace(',', '');
  //alert("si tenia . o , se lo saco y queda= "+numero);
  // if the string had a . or a , for decimal numbers I errase them
  while(numero.length<20)
  {
    numero='0'+numero;
  }
  //alert("al menos tendrá 20 digitos= "+numero);
  // here all the numbers are strings with at least 20 numbers
  numero=numero.substring(0,(numero.length-16)); // I take out the last 16 numbers so I would leave only 2 decimal digits

  //alert("lo recorto y le dejo solo 2 digitos decimales= "+numero);

  numero=parseFloat(numero)/100;  // I change it into a numerb again and divide it by 100 to get the decimal digits in a proper way

  //alert("lo divido y lo transformo en un numero= "+numero);

  return(parseFloat(numero));
}


  async function claim()
  {
    await erc20.methods.claim().send({from: account})
      .on('transactionHash', 
      function(hash)
      {
        console.log('Transaction hash');
        toast({
          title: 'Transaccion hash.',
          description: hash,
          status: 'info',});
      })
      .on('receipt', 
      function(receipt)
      {
        console.log(receipt);
        toast({
          title: 'Your tokens have been claimed. Enjoy!!!.',
          description: 'receipt',
          status: 'success',});
      })
      .on('error', 
      function(error, receipt)
      {
        console.log('Transaction failed');
        toast({
          title: 'transaction failed.',
          description: error.message,
          status: 'error',});
      })
  }



  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <button onClick={claim} >Claim ~ {balance2} OFFUSD</button>
          </TagLabel>
          
        </Tag>
      ) : (
        <div />
      )}
    </Flex>
  );
};

export default TokenClaim;
