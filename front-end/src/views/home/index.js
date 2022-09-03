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
  Text
} from '@chakra-ui/react'

import ProductForm from '../../components/ProductForm'
import Loading from '../../components/loading'


const Home = () => {

  const [balance, setBalance] = useState(0);

  const { active, activate, deactivate, account, error, library } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const finalRef = useRef(null)

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
    <Center>
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



        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ProductForm walletAddress={account} />
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
          </>
          :
   /*        <Button
            background={'#67E992'}
            color={'white'}
            _hover={{

              boxShadow: 'xl',
            }}
            onClick={connect}
            disabled={isUnsupportedChain}>
            {isUnsupportedChain ? 'Red no soportada. Cambie a Rinkeby.' : 'Conectar Wallet'}
          </Button> */
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
    </Center>
  );
};

export default Home;
