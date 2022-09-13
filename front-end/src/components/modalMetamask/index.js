import { useState, useCallback, useEffect } from "react";
import {
    Center,
    Text,
    Image,
    VStack,
    Heading,
    ModalHeader,
    Flex
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png';
  
  
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
        
        <ModalHeader>
        <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
        <Flex  flex={1}
          flexDirection="column"
          align="center">
        <Heading m='4' as='h3'color={'red.400'} size='lg' align="center">
        Debes conectar tu wallet!</Heading>
        <Image
            rounded={'lg'}
            height={200}
            width={220}
            objectFit={'cover'}
            src={IMAGE}
          />
          <Text color={'gray.500'} align="center"> Para comenzar debe conectar su billetera para firmar mensajes y enviar transacciones a la red Ethereum</Text>
          </Flex>
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