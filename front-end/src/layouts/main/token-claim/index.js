import { useState, useCallback, useEffect } from "react";
import {Flex, Button, Tag, TagLabel} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React} from "@web3-react/core";
import { connector } from "../../../config/web3";
import useERC20 from '../../../hooks/useERC20'
import { useToast } from '@chakra-ui/react';

const TokenClaim = () => {

  const [balance, setBalance] = useState(0);
  const [vestingQuantity, setVestingQuantity] = useState(0);
  const [vestingDate, setVestingDate] = useState(0);

  const { account, library, active } = useWeb3React();
  const toast = useToast();

  const erc20 = useERC20();

/*
  const getBalance = useCallback(async () => {
    setBalance(10);//(balance / 1e18).toFixed(2));                // I want to show here how much do they have to claim
  }, [account, library]);
*/

  useEffect(() => {
    if (active) balanceOf();
  }, [active], [balanceOf],[]);



  async function balanceOf()
  {
    let totalVesting= await erc20.methods.vestingQuantity(account).call();
    //await setBalance(vestq);
    totalVesting=cortar_numero(totalVesting);
    var acumulatedVesting=0;
    var toHarvest=0;
    
    for(let i=0;totalVesting>acumulatedVesting; i++) // my idea is to loop the vesting dates until I reach the total quantity and I only count the dates which are set to 0. the acumulated of that would be what I am allowed to claim
    {
      var {0:vest, 1:time}= await erc20.methods.getVestingDates(account , i).call();
      while(cortar_numero(vest)==NaN)
      {
        i++;
        var {0:vest, 1:time}= await erc20.methods.getVestingDates(account , i).call();
      }
      console.log("vest="+vest); 

      acumulatedVesting+=cortar_numero(vest);  
      acumulatedVesting+=totalVesting+0.01; // to solve problem of truncating numbers
      if(time==0)
      {
        toHarvest=toHarvest+cortar_numero(vest);
      }
      console.log("acumulatedVesting="+acumulatedVesting); 
    }
    console.log("toHarvest="+toHarvest); 
    await setBalance(toHarvest);
    //await setBalance( (balance / 1e18).toFixed(2) );
  }

function cortar_numero(numero)
{
  numero=numero.substring(0,(numero.length-16));
  return (parseFloat(numero)/100);
}


  async function claim()
  {
    erc20.methods.claim(0).send({from: account})
      .on('transactionHash', 
      function(hash)
      {
        toast({
          title: 'Transaccion hash.',
          description: hash,
          status: 'info',});
      })
      .on('receipt', 
      function(receipt)
      {
        toast({
          title: 'Transaccion done.',
          description: receipt,
          status: 'success',});
      })
      .on('error', 
      function(error, receipt)
      {
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
            <button onClick={claim} >Claim ~ {balance} OFFUSD</button>
          </TagLabel>
          
        </Tag>
      ) : (
        <div />
      )}
    </Flex>
  );
};

export default TokenClaim;
