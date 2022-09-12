
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
  useToast,
  Grid,
  SimpleGrid
} from '@chakra-ui/react'
import { Link, useLocation, useHistory } from "react-router-dom";

import ProductForm from '../../components/ProductForm'
import Loading from '../../components/loading'
import CuponImage from '../../components/coupon';
import ModalUsability from "../../components/modalUsability";

import useMarketPlace from '../../hooks/useMarketPlace'
import useNFTFactory from '../../hooks/useNFTFactory'
import useERC20 from '../../hooks/useERC20'


import axios from "axios";

const Home = () => {

  const [balance, setBalance] = useState(0);

  const { active, activate, deactivate, account, error, library } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const [currentAccount, setCurrentAccount] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  const [loadingCoupons, SetLoadingCoupons] = useState(false);
  const [category, setCategory] = useState(0);

  const MarketPlace = useMarketPlace();
  const NFTFactory = useNFTFactory();
  const ERC20 = useERC20();


  const categories = ['Alimentación', 'Salud', 'Educación']
  const url = 'https://gateway.pinata.cloud/ipfs/QmQcpVXPBzJybpkffGyPvSv8amVYnrb9pdH3qe7qY1s5zH'


  const mockCoupon = {
    name: 'test1',
    image: 'https://gateway.pinata.cloud/ipfs/Qmc4sMHCxF1BEHidKw4WHJK3tZiBAubDuZFuGCEZ1tbKks',
    amount: 10,
    activeAmoun: 5,
    usedAmount: 5,
    newPrice: '2',
    oldPrice: '4',
    timeToExpirate: '1 day'
  }

  const toast = useToast()
  const showToast = (des, status) => {
    toast({
      position: 'top',
      title: 'Creando cupón',
      description: des,
      status: status,
      duration: 5000,
      isClosable: true,
    })
  }

  //const {image, name, amount, activeAmount, usedAmount, newPrice, oldPrice, timeToExpirate} = data

  const getCouponsByCategory = async (category) => {
    //const arrayTokens = await NFTFactory.methods.getTokensByCategory(category).call();
    return getDataCoupons([2], category)
  }

  const getAllActiveCoupons = async () => {
    //const numtokens = await NFTFactory.methods.tokenAmount().call();
    //const aux = new Array(Number(numtokens)).fill(1)
    const dataIPFS = await getDataCoupons()
    SetLoadingCoupons(false)
    setAllCoupons(dataIPFS)
    console.log(typeof (dataIPFS));
    return dataIPFS
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('every 5 seconds')
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDataCoupons = async () => {

    //const numtokens = 2;
    SetLoadingCoupons(true)

    const allActiveCouponsData = []
    const moskused = [true, false, false, true, false, true, false, false, true, false, true, false, true, false, false, true, false, true, false, false, true, false, true, false]
    //let tokenId;
    let tokenId;
    let apiCache;
    //let categoryes= 3
    if (category > 0) apiCache = await axios.get(`https://cryptofertas.tk/backend/api.php?function=readByCategory&param=${category}`);
    else apiCache = await axios.get(`https://cryptofertas.tk/backend/api.php?function=readForSale&param=1`);
    const apiCacheData = apiCache.data
    console.log('apiredis', apiCacheData)

    //await arrayTokens.map(async (id,index) => {
    //for (let i=0; i < arrayTokens.length; i++){
    for (let i = 0; i < apiCacheData.length; i++) {

      //if (category>0) tokenId=arrayTokens[i]
      // else  
      tokenId = apiCacheData[i].tokenId;
      //const isSale = await NFTFactory.methods.inSale(apiCacheData[i].tokenId).call();
      const isSale = apiCacheData[i].forSale
      if (isSale == '1') {
        //console.log('apiredis',apiCacheData[i].forSale)
        const tokenURI = apiCacheData[i].tokenUri;
        //const tokenURI = await NFTFactory.methods.tokenURI(tokenId).call();
        //const price = await NFTFactory.methods.getPrice(tokenId).call();
        const res = await axios.get(tokenURI);
        const response = res.data
        //console.log('tokenURI',response)
        const dataCoupon = {
          tokenId: tokenId, //Pendiente por revisar
          name: response['name'],
          image: response['image'],
          oldPrice: response['attributes'][1]['value'],
          newPrice: response['attributes'][2]['value'],
          category: categories[response['attributes'][0]['value']],
          amount: 1,
          usedAmount: 1,
          activeAmount: 1,
          timeToExpirate: response['attributes'][3]['value'],

        }
        allActiveCouponsData.push(dataCoupon)
      }

    }
    //)
    SetLoadingCoupons(false)

    return allActiveCouponsData


  }

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
    //setCategory(0)
    if (active) getAllActiveCoupons();

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

        {/* <ModalUsability></ModalUsability> */}

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
            {/* <Button
              background={'blue'}
              color={'white'}
              _hover={{

                boxShadow: 'xl',
              }}
              onClick={onTestingBuy}>
              Comprando cupón
            </Button>
            <Button
              background={'red'}
              color={'white'}
              _hover={{

                boxShadow: 'xl',
              }}
              onClick={onTestingBuy}>
              Usar cupon
            </Button> */}
            {/*             <HStack>
              <Icon w={8} h={8} color='red.500' />

              <Icon w={8} h={8} />

              <Icon w={8} h={8} />
            </HStack> */}
            {loadingCoupons ?
              <Loading />
              :
              <>
                {
                  allCoupons.length > 0 ?
                    <SimpleGrid columns={[1, 2, null, 3]} gap={10}>
                      {//new Array(14).fill().map(() => (
                        allCoupons.map((datacoupon) => (
                      console.log(datacoupon.tokenId, "este es datacoupon"),
                          <Link key={datacoupon.tokenId} to={`/productDetails/${datacoupon.tokenId}`}>
                            <CuponImage data={datacoupon} value={'actives'} />
                          </Link>
                        ))}
                    </SimpleGrid>
                    : <div>No hay cupones</div>
                }
              </>
            }</>
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
