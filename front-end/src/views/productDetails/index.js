import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductDescription from "../../components/productDescription";
import {
  Box,
  Flex,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useDisclosure } from "@chakra-ui/react";
import ModalMetamask from "../../components/modalMetamask";
import ModalTransaction from "../../components/modalTransaction";
import ModalUsability from "../../components/modalUsability";
import { Button, Center } from "@chakra-ui/react";

const ProductDetails = () => {
  const { tokenId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, active } = useWeb3React();

  const {
    isOpen: isTransactionOpen,
    onOpen: onTransactionOpen,
    onClose: onTransactionClose,
  } = useDisclosure();

  const {
    isOpen: isUsabilityOpen,
    onOpen: onUsabilityOpen,
    onClose: onUsabilityClose,
  } = useDisclosure();

  const metamaskValidation = () => {
    !active ? onOpen() : onTransactionOpen();
    !active ? onOpen() : onUsabilityOpen();
  };

  const getValidButton = (apiDataIsUsed, apiDataforSale, apiDataOwner) => {
    if (apiDataIsUsed == 1) {
      return "Usado";
    } else if (apiDataOwner === account.toLowerCase()) {
      return "Canjear";
    } else if (apiDataforSale == 1) {
      return "Comprar";
    } else {
      return "No disponible para venta";
    }
  };
  const [apiDataforSale, setApiDataforSale] = useState(false);
  const [apiDataIsUsed, setApiDataIsUsed] = useState(false);
  const [apiDataOwner, setApiDataOwner] = useState("");
  const [apiDataExpiration, setApiDataExpiration] = useState(0);
  const [apiDataNewPrice, setApiDataNewPrice] = useState(0);
  const [apiDataOldPrice, setApiDataOldPrice] = useState(0);
  const [apiDataName, setApiDataName] = useState("");
  const [apiDataDescription, setApiDataDescription] = useState("");
  const [apiDataImage, setApiDataImage] = useState("");

  const getRealData = async () => {
    let api = await axios.get(
      `https://cryptofertas.tk/backend/api.php?function=readTokenId&param=${tokenId}`
    );
    const apiData = api.data[0];
    const apiDataTokenURI = apiData.tokenUri;
    const dataOfToken = await axios.get(apiDataTokenURI);
    console.log(dataOfToken.data, "dataOfToken");
    console.log(apiData, "api");
    const { name, image, description } = dataOfToken.data;
    const oldPrice = dataOfToken.data.attributes[1].value;
    const newPrice = dataOfToken.data.attributes[2].value;
    setApiDataforSale(apiData.forSale);
    setApiDataIsUsed(apiData.used);
    setApiDataOwner(apiData.owner.toLowerCase());
    setApiDataExpiration(apiData.expiration);
    setApiDataOldPrice(oldPrice);
    setApiDataNewPrice(newPrice);
    setApiDataName(name);
    setApiDataDescription(description);
    setApiDataImage(image);
  };

  useEffect(() => {
    getRealData(tokenId);
  }, []);

  return (
    <>
      <Container maxW={"2xl"}>
        <SimpleGrid
          columns={{ base: 1 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 6 }}
        >
          <Flex>
            <Image
              rounded={"md"}
              alt={"product image"}
              width={"100%"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%",sm: "300px", lg: "400px" }}
              src={apiDataImage}
            />
          </Flex>
          <ProductDescription
            name={apiDataName}
            image={apiDataImage}
            newPrice={apiDataNewPrice}
            oldPrice={apiDataOldPrice}
          />
          <Box>
            <Heading
              color={"gray.600"}
              fontWeight={600}
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              lineHeight={1.8}
            >
              Descripción del producto
            </Heading>
            <Text color={"gray.500"} mb={6} fontSize={{ base: "md", md: "lg" }}>
              {" "}
              {apiDataDescription}
            </Text>
            <Heading
              color={"gray.600"}
              fontWeight={600}
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              lineHeight={1.8}
            >
              Términos y condiciones
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "md", md: "lg" }}>
              {" "}
              {apiDataDescription}
            </Text>
            <Center>
              <Button
                fontSize={{ base: "md", md: "lg" }}
                colorScheme={"green"}
                mt={10}
                w={{ base: "100%", lg: "50%" }}
                onClick={() => metamaskValidation(!isOpen)}
                disabled={apiDataIsUsed == 1}
              >
                {getValidButton(apiDataIsUsed, apiDataforSale, apiDataOwner)}
              </Button>
            </Center>
          </Box>

          <ModalMetamask
            {...{ isOpen, onClose, onTransactionOpen }}
          ></ModalMetamask>
          {active == true && apiDataforSale == 1 && (
            <>
              <ModalTransaction
                {...{
                  isTransactionOpen,
                  onTransactionClose,
                  apiDataImage,
                  apiDataName,
                  apiDataNewPrice,
                  apiDataOldPrice,
                  apiDataDescription,
                }}
              ></ModalTransaction>
            </>
          )}
          {active == true &&
            apiDataOwner === account.toLowerCase() &&
            apiDataforSale == 0 && (
              <>
                <ModalUsability
                  isOpen={isUsabilityOpen}
                  onClose={onUsabilityClose}
                  tokenId={tokenId}
                />
              </>
            )}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default ProductDetails;
