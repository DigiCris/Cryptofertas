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
  ModalFooter
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
        This is the Center

        <div>csldmskds</div>
        <Button onClick={onOpen}>Crear Cupón</Button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
          <ModalCloseButton />
            <ProductForm walletAddress={account}/>
            <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
            
          </ModalContent>
        </Modal>

        {active ?
          <>
            <p>Cuenta: {account}</p>
            <p>Balance: ~{balance}</p>
            <button onClick={disconnect}>Desconectar</button>
          </>
          :
          <button onClick={connect} disabled={isUnsupportedChain}>{isUnsupportedChain ? 'Red no soportada. Cambie a Rinkeby.' : 'Conectar Wallet'}</button>
        }
      </VStack>
    </Center>
  );
};

export default Home;
