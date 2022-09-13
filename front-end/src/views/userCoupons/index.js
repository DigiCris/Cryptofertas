import {useState, useEffect} from "react"
import axios from "axios"
import NavbarCoupons from "../../components/navbarCoupons"
import PageNotFound from "../pageNotFound"
import Coupons from "../../components/coupon"
import {Grid, GridItem, Center} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import {useWeb3React } from "@web3-react/core";
import EmptyCouponList from "../../components/emptyCouponList"


const UserCoupons = () => {
  const {value, ownerOrCreated} = useParams() 
  const [arrayToDisplay, setArrayToDisplay] = useState([])
  const { active, account} = useWeb3React();
  
  const getArrayOfCreatorOrOwner = (ownerArray, creatorArray) => {
      if(ownerOrCreated === "owner") {
        return ownerArray
      } else if (ownerOrCreated === "created") {
        return creatorArray
      } else {
        return []
      }
  }

  const convertISOTimeToSeconds = isoTime => {
    const date = new Date(isoTime);

    const timestamp = date.getTime() / 1000;

    return timestamp
  }
  
  const getRightArray = (arrayData) => {
    if(value === "actives") {
      let result = []
      arrayData.forEach(datum => {
        if(datum.isUsed === false) {
          result.push(datum)
        }
      })
      setArrayToDisplay(result)
      return result
    } else {
      let result = []
      arrayData.forEach(datum => {
        if(datum.isUsed === true) {
          result.push(datum)
        }
      })    
      setArrayToDisplay(result)

      return result
    } 
  }

  const getTimeToExpirate = time => {
      const currentTime = new Date().getTime() / 1000

      if(time > currentTime) {
        return Math.floor(time - currentTime)
      } else {
        return 0
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

  const convertNumberToTrueAndFalse = value => {
    if(value === "1") {
      return true
    } else {
      return false
    }
  }

  const getPinatasLinks = arrayOfData => {
    let listOfLinks = arrayOfData.map(element => element.tokenUri)
    return listOfLinks
  }

  const convertArrayOfDataInValidData = async arrayOfData => {
    const listOfLinks = getPinatasLinks(arrayOfData)
    
    const fetchData = await axios.all(listOfLinks.map((link) => axios.get(link))).then( (data) =>  data);

    const listOfFetchedData = fetchData.map(datum => datum.data)

    let result = []

    for(let i = 0; i < arrayOfData.length; i++){
      let data = {
        name: listOfFetchedData[i].name,
        description: listOfFetchedData[i].description,
        oldPrice: parseInt(listOfFetchedData[i].attributes[1].value),
        newPrice: parseInt(listOfFetchedData[i].attributes[2].value),
        image: listOfFetchedData[i].image,
        inSale: convertNumberToTrueAndFalse(arrayOfData[i].forSale),
        isUsed: convertNumberToTrueAndFalse(arrayOfData[i].used),
        owner: arrayOfData[i].owner,
        expiration: convertSecondsToTimeString(getTimeToExpirate(convertISOTimeToSeconds(listOfFetchedData[i].attributes[3].value))),
        tokenId: parseInt(arrayOfData[i].tokenId)
      } 

      result.push(data)

    }

    return result
  }

  useEffect(()=> {
    const getDataOfOwner = async () => {
      const result = await axios.get(`http://cryptofertas.tk/backend/api.php?function=readOwner&param=${account}`)
      const resultData = result.data
      const validData = convertArrayOfDataInValidData(resultData)
      return validData
    }

    const getDataOfCreator = async () => {
    const result = await axios.get(`https://cryptofertas.tk/backend/api.php?function=readProvider&param=${account}`)
    const resultData = result.data
    const validData = convertArrayOfDataInValidData(resultData)
    return validData
    }

    const getAllData = async () => {
      const ownerData = await getDataOfOwner()
      const creatorData = await getDataOfCreator()
      
      const arrayOfCreatorOrOwner = getArrayOfCreatorOrOwner(ownerData, creatorData)
  
      getRightArray(arrayOfCreatorOrOwner)
    }

    getAllData()

  },[value, ownerOrCreated, account, active],[])


    if(!((ownerOrCreated === "created" || ownerOrCreated === "owner") &&  (value === "actives" || value === "used" ))){
      return (
        <PageNotFound />
      )
    }  

    if(arrayToDisplay.length === 0) {
      return(
        <>  
          <NavbarCoupons value={value}/>
          <EmptyCouponList />
        </>
      )
    } 

    return (
      
      <>
        <NavbarCoupons value={value}/>
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