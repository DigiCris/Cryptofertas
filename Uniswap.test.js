const { expect } = require("chai");
const { ethers } = require("hardhat");
const { daiABI, linkABI, usdtABI } = require("../abis/abis.json");
const { toWei } = require("./utils");

describe("Uniswap", () => {
    let TestUniswap, testUniswap
    let dai, link, usdt
    let etherscanWhaleAddressWithDai, etherscanWhaleAddressWithLink, etherscanWhaleAddressWithUsdt
    let whaleOfDai, whaleOfLink, whaleOfUsdt

    etherscanWhaleAddressWithDai = "0x5d38b4e4783e34e2301a2a36c39a03c45798c4dd";
    etherscanWhaleAddressWithLink = "0x0d4f1ff895d12c34994d6b65fabbeefdc1a9fb39";  
    etherscanWhaleAddressWithUsdt = "0xad41bd1cf3fd753017ef5c0da8df31a3074ea1ea"; 

    const AMOUNT_IN = 1000000000;
    const AMOUNT_OUT_MIN = 1;

    before(async function () {
        
        TestUniswap = await ethers.getContractFactory("TestUniswap");

        [owner] = await ethers.getSigners();



        await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: [etherscanWhaleAddressWithDai]
		});

        whaleOfDai = await ethers.getSigner(etherscanWhaleAddressWithDai);

        await hre.network.provider.request({
		    method: "hardhat_impersonateAccount",
		    params: [etherscanWhaleAddressWithLink],
	    });

	    whaleOfLink = await ethers.getSigner(etherscanWhaleAddressWithLink);

        await hre.network.provider.request({
		    method: "hardhat_impersonateAccount",
		    params: [etherscanWhaleAddressWithUsdt],
	    });

        whaleOfUsdt = await ethers.getSigner(etherscanWhaleAddressWithUsdt);
    

        dai = new ethers.Contract("0x6b175474e89094c44da98b954eedeac495271d0f",daiABI);
        link = new ethers.Contract("0x514910771AF9Ca656af840dff83E8264EcF986CA",linkABI);
        usdt = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", usdtABI)
        testUniswap = await TestUniswap.deploy();
  });

  it("Test Swap", async function () {
      //Peo con USDT
      //await testUniswap.connect(owner).sendEther(whaleOfUsdt.address, {value: toWei(1)});
   //   await testUniswap.connect(owner).sendEther(testUniswap.address, {value: toWei(1000)});
      await testUniswap.connect(owner).sendEther(whaleOfDai.address, {value: toWei(10)});
      console.log(await usdt.connect(owner).balanceOf(whaleOfUsdt.address))
      await dai.connect(whaleOfDai).approve(testUniswap.address, AMOUNT_IN);
      await testUniswap.connect(whaleOfDai).swap(dai.address,link.address , AMOUNT_IN, AMOUNT_OUT_MIN, whaleOfDai.address)
      console.log(await link.connect(owner).balanceOf(whaleOfDai.address))            
  });
});