import { useState, useCallback, useEffect } from "react";
import {
  Flex,
  Button,
  Show,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { connector } from "../../../config/web3";
import useTruncatedAddress from "../../../hooks/useTruncatedAddress";

const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const { activate, account, library, active, deactivate, error } =
    useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");
  }, [activate]);

  useEffect(() => {
    if (localStorage.getItem("previouslyConnected") === "true") connect();
  }, [connect]);

  const getBalance = useCallback(async () => {
    const balance = await library.eth.getBalance(account);
    setBalance((balance / 1e18).toFixed(2));
  }, [account, library]);

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem("previouslyConnected");
  };

  const truncatedAddress = useTruncatedAddress(account);

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <Show above='md'>
          <TagLabel >
            {/* <Link to={`/punks?address=${account}`}>{truncatedAddress}</Link> */}
            {truncatedAddress}
          </TagLabel>
          </Show>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
