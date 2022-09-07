import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Center,
  extendTheme,
  useToast
} from "@chakra-ui/react";
import QR from "../QR";
import useNFTFactory from "../../hooks/useNFTFactory";

const borderRadius = {
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
};

function ModalUsability() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [usedQR, setUsedQR] = useState(false);

  const NFTFactory = useNFTFactory();

  const toast = useToast();

  const useNFT = async () => {
    NFTFactory.methods
    .MarkUsed(
      _tokenId
    )
    .send({
      from: account
    })
    .on("transactionHash", (txHash) => {
      toast({
        title: "Transacción enviada",
        description: txHash,
        status: "info"
      })
    })
    .on("receipt", () => {
      setUsedQR(true);
      toast({
        title: "Transacción confirmada.",
        description: "Cupón redimido",
        status: "success"
      })
    })
    .on("error", (error) => {
      setUsedQR(false);
      toast({
        title: "Transacción fallida",
        description: "Cupón no redimido",
        status: "error"
      })
    })
  };

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
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
                <Button isLoading={usedQR} onClick={useNFT}>Canjear cupón</Button>
              </ModalBody>
              <Center>
                <Button
                  width="287px"
                  height="35px"
                  backgroundColor="white"
                  border="1px"
                  borderRadius="xl"
                  borderColor="gray.300"
                  onClick={onClose}
                >
                  <Text color="gray" fontSize="sm">
                    Cerrar
                  </Text>
                </Button>
              </Center>
              <ModalFooter></ModalFooter>
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
                  width="287px"
                  height="35px"
                  backgroundColor="white"
                  border="1px"
                  borderRadius="xl"
                  borderColor="gray.300"
                  onClick={onClose}
                >
                  <Text color="gray" fontSize="sm">
                    Cerrar
                  </Text>
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
