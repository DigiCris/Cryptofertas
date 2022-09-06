/* import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useNFTFactory from '../useNFTFactory';



const categories = ['Alimentación','Salud','Educación']
const url = 'https://gateway.pinata.cloud/ipfs/QmQcpVXPBzJybpkffGyPvSv8amVYnrb9pdH3qe7qY1s5zH'

//const { image, name, amount, activeAmount, usedAmount, newPrice, oldPrice, timeToExpirate } = data

const getAllActiveCoupons = async () => {
    const NFTFactory = useNFTFactory();

    //const numtokens = await NFTFactory.methods.TokenAmount().call();
    const numtokens = 5;

    const allActiveCouponsData = []
    const moskused = [true,false,false,true,false]
    for (let i = 0; i < numtokens; i++) {
        //const isUsed = await NFTFactory.methods.isTokenUsed(i).call();
        const isUsed = moskused[i]
        if (!isUsed) {
            const tokenURI = await NFTFactory.methods.tokenURI(i).call();
            const price = await NFTFactory.methods.getPrice(i).call();
            const res = await axios.get(tokenURI);
            const response = res.data
            const dataCoupon = {
                name: response['name'],
                image: response['image'],
                oldPrice: response['attributes'][1]['value'],
                newPrice: price,
                category: categories[response['attributes'][0]['value']],
            }
            allActiveCouponsData.push(dataCoupon)
        }

    }

    return allActiveCouponsData

    const res = await axios.get(url);
    const response = res.data
    console.log('response1', response)
    console.log('response', response['attributes'][0]['value'])
    console.log('response1', {
        name: response['name'],
        image: response['image'],
        oldPrice: response['attributes'][1]['value'],
        newPrice: 'f',
        category: categories[response['attributes'][0]['value']],
    })
    

    return response

}

export {getAllActiveCoupons}; */