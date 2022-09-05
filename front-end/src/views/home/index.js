
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState, useRef } from "react";
import { connector, getLibrary } from "../../config/web3";
import {
  Center,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalCloseButton,
  ModalFooter,
  Heading,
  Text,
  Icon,
  HStack,
  
} from '@chakra-ui/react'

import ProductForm from '../../components/ProductForm'
import Loading from '../../components/loading'
import ModalUsability from "../../components/modalUsability";


const Home = () => {

  const [balance, setBalance] = useState(0);

  const { active, activate, deactivate, account, error, library } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const [currentAccount, setCurrentAccount] = useState("");
  

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        /*
         * Fancy method to request access to account.
         */
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
  
        /*
         * Boom! This should print out public address once we authorize Metamask.
         */
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } 

    connectWallet()
  
  }, [])

  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");
  }, [activate]);

  const disconnect = () => {
    deactivate()
    localStorage.removeItem("previouslyConnected")
  };

  useEffect(() => {
    if (localStorage.getItem("previouslyConnected") === "true") connect();
  }, [connect]);

  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(2));
  }, [library?.eth, account])

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance])

  return (
    < Center >
    <VStack>
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
        Encuentra las mejores&nbsp;
        <Text
          as={'span'}
          background={'#67E992'}
          bgClip="text">
          ofertas&nbsp;
        </Text>
        y paga con tus cryptomonedas
      </Heading>

      <ModalUsability></ModalUsability>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ProductForm walletAddress={account} closeModal={onClose} />
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>

      {active ?
        <>
          <div>Quieres publicar una oferta?</div>
          <Button
            background={'#67E992'}
            color={'white'}
            _hover={{

              boxShadow: 'xl',
            }}
            onClick={onOpen}>
            Crear Cupón
          </Button>
          <HStack>
            <Icon  w={8} h={8} color='red.500'/>

            <Icon w={8} h={8}  />

            <Icon w={8} h={8}  />
          </HStack>
        </>
        :
        <Text
          as={'span'}
          lineHeight={1.5}
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          background={'#d1320f'}
          bgClip="text">
          Conecta tu Wallet !
        </Text>
      }
    </VStack>
    </Center >
  );
};

export default Home;
