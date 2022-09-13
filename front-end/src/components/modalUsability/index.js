import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Circle,
  Button,
  Text,
  Center,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { CheckIcon } from '@chakra-ui/icons'
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
          {usedQR ? (
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
              <Center>
              <Circle  w={36} h={36} bg={"#38a169"} color='white'>
              <CheckIcon w={24} h={24} />
              </Circle>
              </Center>
              </ModalBody>
              <ModalFooter>
              <VStack  w={'full'}>
              <Button variant='outline'  w="100%" onClick={onClose}>Cerrar</Button>
              </VStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default ModalUsability;
