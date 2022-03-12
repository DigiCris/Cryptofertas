const { expect } = require("chai");
const { ethers } = require("hardhat");
const { daiABI, linkABI, wethABI } = require("../abis/abis.json");
const { toWei, currentTime } = require("./utils");

describe("Uniswap", () => {
    let TestUniswap, testUniswap
    let dai, link, weth
    let addressOfWhaleOfWeth
    let whaleOfWeth
    let owner, account1, account2

    addressOfWhaleOfWeth = "0x56178a0d5f301baf6cf3e1cd53d9863437345bf9"

    before(async function () {

        
        
        TestUniswap = await ethers.getContractFactory("TestUniswap");

        [owner] = await ethers.getSigners();

        await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: [addressOfWhaleOfWeth]
		});

        whaleOfWeth = await ethers.getSigner(addressOfWhaleOfWeth);    

        dai = new ethers.Contract("0x6b175474e89094c44da98b954eedeac495271d0f",daiABI);
        link = new ethers.Contract("0x514910771AF9Ca656af840dff83E8264EcF986CA",linkABI);
        weth = new ethers.Contract("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", wethABI)
        testUniswap = await TestUniswap.deploy();
  });

  it("Test Swap", async function () {
      //console.log(await weth.connect(owner).balanceOf(whaleOfWeth.address))  
      console.log(await link.connect(owner).balanceOf(owner.address)) 
      await testUniswap.connect(owner).swap(1, link.address, owner.address, currentTime(), {value: 1000000})
      console.log(await link.connect(owner).balanceOf(owner.address))  
      //console.log(await link.connect(owner).balanceOf(owner.address)) 
      //console.log(await dai.connect(owner).balanceOf(owner.address))        
  });
});