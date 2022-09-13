import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Center,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import { useWeb3React } from "@web3-react/core";
import QR from "../QR";
import useNFTFactory from "../../hooks/useNFTFactory";

function ModalUsability(props) {
  const { isOpen, onClose, tokenId } = props;
  const { active, activate, deactivate, account, error, library } =
    useWeb3React();
  const [usedQR, setUsedQR] = useState(false);

  const NFTFactory = useNFTFactory();

  const toast = useToast();

  const canjearNFT = async (tokenid) => {
    NFTFactory.methods
      .MarkUsed(tokenid)
      .send({
        from: account,
        gas: 3000000,
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", async () => {
        setUsedQR(true);
        const res = await axios.get(
          `https://cryptofertas.tk/backend/api.php?function=writeDirty&param=${tokenid}`
        );
        //const resdata = res.data
        //console.log('resdirty',resdata,tokenid)
        toast({
          title: "Transacción confirmada.",
          description: "Cupón redimido",
          status: "success",
        });
      })
      .on("error", (error) => {
        setUsedQR(false);
        toast({
          title: "Transacción fallida",
          description: "Cupón no redimido",
          status: "error",
        });
      });
  };

  return (
    <>
      <Center>{/* <Button onClick={onOpen}>{titleButton}</Button> */}</Center>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          {!usedQR ? (
            <>
              <ModalHeader mt="8" as="h3" size="lg" align="center">
                Canjear cupón
              </ModalHeader>
              <Center>
                <Text color="gray.500" align="center">
                  Muestra este código en el sitio
                </Text>
              </Center>
              <ModalCloseButton />
              <ModalBody>
                <QR></QR>
              </ModalBody>
              
              <ModalFooter>
              <VStack  w={'full'}>
                <Button 
                isLoading={usedQR} 
                colorScheme={"green"}
                mt={10}
                w="100%"
                onClick={() => canjearNFT(tokenId)}>
                  Canjear cupón
                </Button>
                <Button
                 variant='outline'  w="100%"
                  onClick={onClose}
                >
                    Cerrar
                </Button>
                </VStack>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader mt="8" as="h3" size="lg" align="center">
                ¡Listo!
              </ModalHeader>
              <Center>
                <Text color="gray.500" align="center">
                  Tu cupón ha sido cambiado exitosamente
                </Text>
              </Center>
              <ModalCloseButton />
              <ModalBody>
                {/* <img src="../../assets/check.png"/> */}
                <img src="https://bit.ly/dan-abramov" />
              </ModalBody>
              <Center>
                <Button
                  variant='outline'  w="100%"
                  onClick={onClose}
                >
                    Cerrar
                </Button>
              </Center>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default ModalUsability;
