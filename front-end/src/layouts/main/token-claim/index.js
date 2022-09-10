import { useState, useCallback, useEffect } from "react";
import {Flex, Button, Tag, TagLabel, Badge,TagCloseButton} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useWeb3React} from "@web3-react/core";
import { connector } from "../../../config/web3";


const TokenClaim = () => {
  const [balance, setBalance] = useState(0);
  const { activate, account, library, active, deactivate, error } = useWeb3React();



  const getBalance = useCallback(async () => {
    setBalance(10);//(balance / 1e18).toFixed(2));                // I want to show here how much do they have to claim
  }, [account, library]);

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  const claim = () => {
    alert("claim");                                             // Here is where I have to do the claiming
  };

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
