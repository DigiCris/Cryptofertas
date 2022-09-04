import ProductDescription from "../../components/productDescription";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useDisclosure } from "@chakra-ui/react";
import ModalMetamask from "../../components/modalMetamask";
import ModalTransaction from "../../components/modalTransaction";
import { Button } from "@chakra-ui/react";

const ProductDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activate, account, library, active, deactivate, error } =
    useWeb3React();

  const {
    isOpen: isTransactionOpen,
    onOpen: onTransactionOpen,
    onClose: onTransactionClose,
  } = useDisclosure();

  // const metamaskConnect = false;
  const metamaskValidation = () => {
    !active  ? onOpen() : onTransactionOpen();
  };

  return (
    <>
      <Center py={12}>
        <Box
          role={"group"}
          maxW={"330px"}
          w={"full"}
        >
          <ProductDescription />
          <Heading fontSize="sm" color={"gray.500"}>
            Product Description
          </Heading>
          <Text color={"gray.500"} mb={6}>
            {" "}
            Un delicado proceso de selección electrónica del grano garantizan
            más de un 90% de granos enteros, utilizados en infinidades de platos
            y postres,
          </Text>
          <Heading fontSize="sm" color={"gray.500"}>
            Terminos y condiciones
          </Heading>
          <Text color={"gray.500"}>
            {" "}
            Un delicado proceso de selección electrónica del grano garantizan
            más de un 90% de granos enteros, utilizados en infinidades de platos
            y postres,
          </Text>
          <Button
            colorScheme="teal"
            mt={10}
            w="100%"
            onClick={() => metamaskValidation(!isOpen)}
          >
            validar
          </Button>
        </Box>
        <ModalMetamask
          {...{ isOpen, onClose }}
        ></ModalMetamask>
        <ModalTransaction
          {...{ isTransactionOpen, onTransactionClose }}
        ></ModalTransaction>
      </Center>
    </>
  );
};

export default ProductDetails;
