import {useState, useEffect} from "react"
import axios from "axios"
import NavbarCoupons from "../../components/navbarCoupons"
import EmptyCouponList from "../../components/emptyCouponList"
import PageNotFound from "../pageNotFound"
import Coupons from "../../components/coupon"
import {Grid, GridItem, Center} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import Web3 from "web3/dist/web3.min"
import abi from "../../abi/abi.json"


const UserCoupons = () => {
  const {value, ownerOrCreated} = useParams() 
  const [dataListOfTokensCreated, setDataListOfTokensCreated] = useState([])
  const [dataListOfTokensOwned, setDataListOfTokensOwned] = useState([])
  const [showEmptyList, setShowEmptyList] = useState(false)

  const getArrayOfCreatorOrOwner = () => {
      if(ownerOrCreated === "owner") {
        return dataListOfTokensOwned
        
      } else if (ownerOrCreated === "created") {
        return dataListOfTokensCreated
      } else {
        return []
      }
  }
  
  const getRightArray = (arrayData) => {
    if(value === "actives") {
      let result = []
      arrayData.forEach(datum => {
        if(datum.activeAmount > 0) {
          result.push(datum)
        }
      })
      return result
    } else if (value === "used") {
      let result = []
      arrayData.forEach(datum => {
        if(datum.usedAmount > 0) {
          result.push(datum)
        }
      })    
      return result
    } else{
      return arrayData
    } 
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

  const checkIfReturnEmptyList = () => {
      const arrayToShow = getRightArray(getArrayOfCreatorOrOwner())
      if(arrayToShow.length) {
        return false
      } else {
        return true
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

  useEffect(() => {
     const getDataOfCreator = async () => {

      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
       const web3 = new Web3("https://rinkeby.infura.io/v3/da3a7118ce6842b7b0fa32d304e1382b")

       const contract = new web3.eth.Contract(abi, "0x247eF7b7f156C2c6b8e117B358c21B21473A7BB4")
       const res = await contract.methods.getDataToDisplayForCreator(accounts[0]).call((err, result) => { 
        return  result
      })

    const listOfURIs = res.map(element => element[2])

    const resultOfFetch = await axios.all(listOfURIs.map((endpoint) => axios.get(endpoint))).then(
      (data) => {return data}
    );

    const dataOfFetch = resultOfFetch.map(datum => datum.data)

    let arrayOfResults = []

    for(let i = 0; i < resultOfFetch.length; i++) {
      let resultObject = {
        image: dataOfFetch[i].image,
        name: dataOfFetch[i].name, 
        amount: parseInt(res[i].tokenAmountInformation.tokenTotal),
        activeAmount: parseInt(res[i].tokenAmountInformation.tokenActives),
        usedAmount: parseInt(res[i].tokenAmountInformation.tokenUsed),
        newPrice: parseInt(res[i].tokenPrice),
        oldPrice: dataOfFetch[i].attributes[0].value,
        timeToExpirate: convertSecondsToTimeString(parseInt(res[i].timeToExpirate))
      }
      
      arrayOfResults.push(resultObject)
    }

    console.log("1", arrayOfResults)

    setDataListOfTokensCreated(arrayOfResults)
     }

     getDataOfCreator()
  },[])

  useEffect(() => {
    const getDataOfOwner = async () => {

      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });     
      
      const web3 = new Web3(process.env.REACT_APP_PROVIDER_ADDRESS)

      const contract = new web3.eth.Contract(abi, process.env.REACT_APP_CONTRACT_ADDRESS)
      const res = await contract.methods.getDataToDisplayForOwner(accounts[0]).call((err, result) => { 
       return  result
     })

   const listOfURIs = res.map(element => element[2])

   const resultOfFetch = await axios.all(listOfURIs.map((endpoint) => axios.get(endpoint))).then(
     (data) => {return data}
   );

   const dataOfFetch = resultOfFetch.map(datum => datum.data)

   let arrayOfResults = []

   for(let i = 0; i < resultOfFetch.length; i++) {
     let resultObject = {
       image: dataOfFetch[i].image,
       name: dataOfFetch[i].name, 
       amount: parseInt(res[i].tokenAmountInformation.tokenTotal),
       activeAmount: parseInt(res[i].tokenAmountInformation.tokenActives),
       usedAmount: parseInt(res[i].tokenAmountInformation.tokenUsed),
       newPrice: parseInt(res[i].tokenPrice),
       oldPrice: dataOfFetch[i].attributes[0].value,
       timeToExpirate: convertSecondsToTimeString(parseInt(res[i].timeToExpirate))
     }
     
     arrayOfResults.push(resultObject)
   }

   console.log("2", arrayOfResults)

   setDataListOfTokensOwned(arrayOfResults)
    }

    getDataOfOwner()
  }, [])

  useEffect(()=>{
    const isEmptyListNeeded = checkIfReturnEmptyList()
    setShowEmptyList(isEmptyListNeeded)
  }, [value])

    if(!((ownerOrCreated === "created" || ownerOrCreated === "owner") &&  (value === "actives" || value === "used" || value === "all" ))){
      return (
        <PageNotFound />
      )
    }  

    if(showEmptyList) {
      return(
        <>  
          <NavbarCoupons />
          <EmptyCouponList />
        </>
      )
    }


    return (
      <>
        <NavbarCoupons />
        <Center width={"100%"}>
        <Grid templateColumns={{md: "repeat(4, 1fr)"}} width={"100%"} >
          {getRightArray(getArrayOfCreatorOrOwner()).map((data, i) => (
            <GridItem justifySelf={"center"} width={"90%"} mb={4} key={i} >
              <Coupons data={data} value={value}/>
            </GridItem>
          ))}
        </Grid>
        </Center>
      </>
    );
  };
  
  export default UserCoupons;