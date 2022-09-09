import {useState, useEffect} from "react"
import axios from "axios"
import NavbarCoupons from "../../components/navbarCoupons"
import PageNotFound from "../pageNotFound"
import Coupons from "../../components/coupon"
import {Grid, GridItem, Center} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import Web3 from "web3/dist/web3.min"
import {useWeb3React } from "@web3-react/core";
import useNFTGetterHandler from "../../hooks/useNFTGetterHandler"

const UserCoupons = () => {
  const {value, ownerOrCreated} = useParams() 
  const [dataListOfTokensCreated, setDataListOfTokensCreated] = useState([])
  const [dataListOfTokensOwned, setDataListOfTokensOwned] = useState([])
  const [arrayToDisplay, setArrayToDisplay] = useState([])
  const { active, account} = useWeb3React();
  const [firstContractCall, setFirstContractCall] = useState(false)
  const nftGetterHandler = useNFTGetterHandler()
  
  const getArrayOfCreatorOrOwner = () => {
      if(ownerOrCreated === "owner") {
        return dataListOfTokensOwned
      } else if (ownerOrCreated === "created") {
        return dataListOfTokensCreated
      } else {
        return []
      }
  }

  const getTokenURIList = arrayOfData => {
    const arrayOfTokenURIs = arrayOfData.map(datum => datum.tokenURI)

    return arrayOfTokenURIs
  }
  
  const getRightArray = (arrayData) => {
    if(value === "actives") {
      let result = []
      arrayData.forEach(datum => {
        if(datum.isUsed === false) {
          result.push(datum)
        }
      })
      return result
    } else {
      let result = []
      arrayData.forEach(datum => {
        if(datum.isUsed === true) {
          result.push(datum)
        }
      })    
      return result
    } 
  }

  const getTimeToExpirate = time => {
      const currentTime = new Date().getTime() / 1000

      if(time > currentTime) {
        return time - currentTime
      } else {
        return 0
      }

  }

  const makeDataEasyToHandle = (datumFromContract, datumFromIpfs) => {
    const {data} = datumFromIpfs
    const {attributes} = data
    const {isUsed, timeToExpirate, price, tokenId} = datumFromContract
    const {name, image} = data
    const oldPrice = attributes[1].value

    let newData = {
      name,
      image,
      timeToExpiration: convertSecondsToTimeString(getTimeToExpirate(timeToExpirate)),
      oldPrice,
      newPrice: price,
      isUsed,
      tokenId
    }

    return newData
  }

  const convertArrayOfDataOfContractAndDataOfIPSFInDataSimpleToManage = (arrayDataOfContract, arrayDataOfIpfs) => {
    let result = []  
    for(let i = 0; i < arrayDataOfContract.length; i++){
      const currentData = makeDataEasyToHandle(arrayDataOfContract[i], arrayDataOfIpfs[i])
      result.push(currentData)
    }

    return result
  }

  const convertSecondsToTimeString = timeInSeconds => {
    let days = 0
    let hours = 0
    let minutes = 0
    let seconds = 0

    days = Math.floor(timeInSeconds / 86400)
    timeInSeconds =  timeInSeconds - (days * 86400)

    hours = Math.floor(timeInSeconds / 3600)
    timeInSeconds = timeInSeconds - (hours * 3600)

    minutes = Math.floor(timeInSeconds / 60)
    timeInSeconds = timeInSeconds - (minutes * 60)

    seconds = timeInSeconds

    if( days > 0) {                 
        
        return `${days}d ${hours}h`

    } else if(hours > 0){ 

      return `${hours}h ${minutes}m`

    } else if(minutes > 0){

      return `${minutes}m ${seconds}s`

    } else if (seconds > 0){

      return `${seconds}s`
          
    } else {
      return `Expired`
    }
    
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

        console.log("Account: ", accounts[0], " connected")
  
      } catch (error) {
        console.log(error);
      }
    } 

    connectWallet()
  
  }, [])

  useEffect(()=> {
    setFirstContractCall(true)
  },[])

  useEffect(() => {
    const getDataOfOwner = async () => {
      
      const tokensOwnedByUser = await nftGetterHandler.methods.getDataOfNftsOwnedByUser(account).call()
      
      const tokenURIList = getTokenURIList(tokensOwnedByUser)
      const listOfData = await axios.all(tokenURIList.map((tokenURI) => axios.get(tokenURI))).then((data) =>  data);
      const arrayOfFixedData = convertArrayOfDataOfContractAndDataOfIPSFInDataSimpleToManage(tokensOwnedByUser, listOfData)
      setDataListOfTokensOwned(arrayOfFixedData)
     }
  
     const getDataOfCreator = async () => {
  
      const tokensOfCreator = await nftGetterHandler.methods.getDataOfNftsWithUserAsProvider(account).call()
      const tokenURIList = getTokenURIList(tokensOfCreator)
  
     const listOfData = await axios.all(tokenURIList.map((tokenURI) => axios.get(tokenURI))).then((data) =>  data);
  
     const arrayOfFixedData = convertArrayOfDataOfContractAndDataOfIPSFInDataSimpleToManage(tokensOfCreator, listOfData)
     setDataListOfTokensCreated(arrayOfFixedData)
    }   

     getDataOfCreator()
     getDataOfOwner()
  },[account, active, firstContractCall])


  useEffect(()=> {
    const arrayToDisplay = getRightArray(getArrayOfCreatorOrOwner())
    setArrayToDisplay(arrayToDisplay)
  },[value, ownerOrCreated] )



    if(!((ownerOrCreated === "created" || ownerOrCreated === "owner") &&  (value === "actives" || value === "used" ))){
      return (
        <PageNotFound />
      )
    }  

console.log(arrayToDisplay)
    return (
      
      <>
        <NavbarCoupons />
        <Center width={"100%"}>
        <Grid templateColumns={{lg: "repeat(4, 1fr)",md: "repeat(3, 1fr)"}} width={"100%"} >
          {arrayToDisplay.map((data, i) => (
            <GridItem justifySelf={"center"} width={"90%"} mb={4} key={i} >
              <Coupons data={data}/>
            </GridItem>
          ))}
        </Grid>
        </Center>
      </>
    );
  };
  
  export default UserCoupons;