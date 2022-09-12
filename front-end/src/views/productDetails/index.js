import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductDescription from "../../components/productDescription";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useDisclosure } from "@chakra-ui/react";
import ModalMetamask from "../../components/modalMetamask";
import ModalTransaction from "../../components/modalTransaction";
import ModalUsability from "../../components/modalUsability";
import { Button } from "@chakra-ui/react";
import useNFTGetterHandler from "../../hooks/useNFTGetterHandler";

const ProductDetails = () => {
  const nftGetterHandler = useNFTGetterHandler();
  const { tokenId } = useParams();
  const [dataOfCurrentProduct, setDataOfCurrentProduct] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activate, account, library, active, deactivate, error } =
    useWeb3React();

  // console.log(tokenId);
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

  // const metamaskConnect = false;
  const metamaskValidation = () => {
    !active ? onOpen() : onTransactionOpen();
    !active ? onOpen() : onUsabilityOpen();
    // console.log(active);
  };

  // const canBuy = dataOfCurrentProduct.inSale;

  const getValidButton = (apiDataIsUsed,apiDataforSale, apiDataOwner) => {
    // console.log(apiDataforSale, "for sale");
    // console.log(apiDataIsUsed, "is used");
    // console.log(account, "account");
    // console.log(apiDataExpiration, "expiration");
    // console.log(apiDataNewPrice, "price");

    // const { owner } = dataOfProduct;
    // console.log(apiDataOwner, "owner");
    if (apiDataIsUsed == 1) {
      // console.log("entro a usado");
      return "Usado";
    } else if (apiDataOwner === account.toLowerCase()) {
      // console.log("entro a canjeadp");
      return "Canjear";
    } else if (apiDataforSale == 1) {
      // setCanBuy(true);
      // console.log("entro a compra");
      return "Comprar";
    } else {
      // console.log("es nadie");
      return "No disponible para venta";
    }
  };

  // var apiDataforSale;
  // const [canBuy, setCanBuy ]= useState(false);
  const [apiDataforSale, setApiDataforSale] = useState(false);
  const [apiDataIsUsed, setApiDataIsUsed] = useState(false);
  const [apiDataOwner, setApiDataOwner] = useState('');
  const [apiDataExpiration, setApiDataExpiration] = useState(0);
  const [apiDataNewPrice, setApiDataNewPrice] = useState(0);
  const [apiDataOldPrice, setApiDataOldPrice] = useState(0);
  const [apiDataName, setApiDataName] = useState('');
  const [apiDataDescription, setApiDataDescription] = useState('');
  const [apiDataImage, setApiDataImage] = useState('');

  const getRealData = async () => {
    let api = await axios.get(
      `https://cryptofertas.tk/backend/api.php?function=readTokenId&param=${tokenId}`
    );
    const apiData = api.data[0];
    const apiDataTokenURI = apiData.tokenUri;
    const dataOfToken = await axios.get(apiDataTokenURI);
    console.log(dataOfToken.data, "dataOfToken");
    console.log(apiData, "api");
    const {name, image, description} = dataOfToken.data;
    const oldPrice = dataOfToken.data.attributes[1].value;
    const newPrice = dataOfToken.data.attributes[2].value;

    // apiDataforSale = apiData[0].forSale;
    // console.log(apiData, "soy apiData en getRealData");
    // setCanBuy(apiDataforSale);
    setApiDataforSale(apiData.forSale);
    // console.log(apiDataforSale, "esto es el set de apiDataForSale en el getRealData");
    setApiDataIsUsed(apiData.used);
    setApiDataOwner(apiData.owner.toLowerCase());
    setApiDataExpiration(apiData.expiration);
    setApiDataOldPrice(oldPrice);
    setApiDataNewPrice(newPrice);
    setApiDataName(name);
    setApiDataDescription(description);
    setApiDataImage(image);


    // console.log(api, "soy apiData");
    // console.log(apiDataforSale, "soy apiData for sale");
  };

  // const getFixedDataFromIpfsAndContract = (ipfs, contractData) => {
  //   let result = {
  //     description: ipfs.description,
  //     name: ipfs.name,
  //     // newPrice: ipfs.attributes[2].value,
  //     oldPrice: ipfs.attributes[1].value,
  //     image: "https://media.revistagq.com/photos/5ef353d2e3676ab95600ee3f/master/pass/donald.jpg",
  //     inSale: apiDataforSale,
  //     isUsed: apiDataIsUsed,
  //     owner: contractData.owner,
  //   };
  //   alert(result.oldPrice);
  //   return result;
  // };

  // const getDataOfToken = async (tokenId) => {
  //   const dataOfCurrentToken = await nftGetterHandler.methods
  //     .getDataOfToken(tokenId)
  //     .call()
  //     .then((result) => result);
  //   const tokenURI = await dataOfCurrentToken.tokenURI;
  //   const dataFromAxios = await axios.get(tokenURI);
  //   const fixedData = getFixedDataFromIpfsAndContract(
  //     dataFromAxios.data,
  //     dataOfCurrentToken
  //   );
  //   setDataOfCurrentProduct(fixedData);
  // };

  useEffect(() => {
    // getDataOfToken(tokenId);
    getRealData(tokenId);
    // console.log("tokenId", tokenId);
  }, []);

  // const { name, description, image, newPrice, oldPrice } = dataOfCurrentProduct;

  return (
    <>
      <Center py={12}>
        <Box
          role={"group"}
          maxW={"330px"}
          width={[
            "100%", // 0-30em
            "90%", // 30em-48em
            "80%", // 62em+
          ]}
        >
          <ProductDescription
            name={apiDataName}
            image={apiDataImage}
            newPrice={apiDataNewPrice}
            oldPrice={apiDataOldPrice}
          />
          <Heading fontSize="sm" color={"gray.500"}>
            Product Description
          </Heading>
          <Text color={"gray.500"} mb={6}>
            {" "}
            {apiDataDescription}
          </Text>
          <Heading fontSize="sm" color={"gray.500"}>
            Terminos y condiciones
          </Heading>
          <Text color={"gray.500"}> {apiDataDescription}</Text>
          <Button
            colorScheme={"green"}
            mt={10}
            w="100%"
            onClick={() => metamaskValidation(!isOpen)}
            disabled={(apiDataIsUsed == 1)}
          >
            {getValidButton(apiDataIsUsed,apiDataforSale, apiDataOwner)}
          </Button>
        </Box>
        <ModalMetamask
          {...{ isOpen, onClose, onTransactionOpen }}
        ></ModalMetamask>
        {/* {(active == true ? console.log("active entro en modal Transaction") : console.log("no entre a active != true modal Transaction"))}
        {(apiDataforSale == 1) ? console.log(apiDataforSale," forSale entro en modal Transaction") : console.log(apiDataforSale,"no entro en modal transacion por forSale")} */}
        {(active == true) && (apiDataforSale == 1) && (
          <>
          
          {/* {console.log(active, apiDataforSale, "entro en transaction")} */}
            <ModalTransaction
              {...{
                isTransactionOpen,
                onTransactionClose,
                apiDataImage,
                apiDataName,
                apiDataNewPrice,
                apiDataOldPrice,
                apiDataDescription
              }}
            ></ModalTransaction>
          </>
          // ) : (
          //   <>
          //   <ModalUsability/>
          //   </>
          // )}
        )}
        {/* {console.log ("entro a modal usability antes del comparador")}
        {(active == true ? console.log("active es true") : console.log("no entre a active != true"))}
        {(apiDataOwner === account.toLowerCase()) ? console.log("owner = account es true") : console.log("owner != account es true")}
        {(apiDataforSale == 0) ? console.log("apiDataForSale entro al if") : console.log("apiDataForSale no entro al if")}
        {console.log(active, apiDataforSale,apiDataOwner, account.toLowerCase(), "active, for Sale, owner, accountLower")} */}
        {(active == true) && (apiDataOwner === account.toLowerCase()) && (apiDataforSale == 0) && (
          <>
          {/* {console.log ("entro a modal usability")}
          {console.log(active, apiDataforSale,apiDataOwner, account.toLowerCase(), "active, for Sale, owner, accountLower")} */}
          <ModalUsability
            isOpen={isUsabilityOpen}
            onClose={onUsabilityClose}
            tokenId={tokenId}
          />
          </>
        )}
      </Center>
    </>
  );
};

export default ProductDetails;
