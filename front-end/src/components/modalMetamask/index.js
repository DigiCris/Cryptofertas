import { useState, useCallback, useEffect } from "react";
import {
    Center,
    Text,
    Image,
    VStack
  } from '@chakra-ui/react';
  import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
  import Loading from '../../components/loading';
import { connector } from '../../config/web3'
  import { Button } from '@chakra-ui/react';
  const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';
  
  
  const ModalMetamask = (props) => {
    const {isOpen, onClose, onTransactionOpen} = props;
    const { activate, account, library, active, deactivate, error } =
    useWeb3React();

    const isUnsupportedChain = error instanceof UnsupportedChainIdError;

    function connectWallet() {
      const { ethereum } = window;
      if (!ethereum)return alert('Install metamask');
      connect();
      onClose();
      onTransactionOpen();
    }

    const connect = useCallback(() => {
      activate(connector);
      localStorage.setItem("previouslyConnected", "true");
    }, [activate]);
  
    useEffect(() => {
      if (localStorage.getItem("previouslyConnected") === "true") connect();
    }, [connect]);

    return (
        <>
        <Center py={12}>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <Center py={12}>
        <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={IMAGE}
          />
          </Center>
          <ModalCloseButton />
          <ModalBody>
          <Text color={'gray.500'} align="center"> Primero debe conectar su billetera para firmar mensajes y enviar transacciones a la red Ethereum</Text>
          </ModalBody>

          <ModalFooter>
            <VStack  w={'full'}>
            <Button colorScheme={"green"} mr={3}  onClick={() => connectWallet()}  disabled={isUnsupportedChain}  w="100%" >
            {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
            </Button>
            <Button variant='outline'  w="100%" onClick={onClose}>Cancelar</Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
        </>
    )
}
export default ModalMetamask;