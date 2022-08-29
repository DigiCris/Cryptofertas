// scripts/deploy_upgradeable_box.js
const { ethers } = require("hardhat");

async function main() {
    const ERC20 = await ethers.getContractFactory("ERC20.sol");
    const NFT = await ethers.getContractFactory("NFT.sol");
    const Marketplace = await ethers.getContractFactory("Marketplace.sol")
    
    const erc20 = await ERC20.deploy([])
    await erc20.deployed()

    const nft = await NFT.deploy([erc20.address])
    await nft.deployed()

    const marketplace = await Marketplace.deploy([erc20.address, nft.address])
    await marketplace.deployed()

    console.log("ERC20 deployed to: ", erc20.address)
    console.log("NFT deployed to: ", nft.address)
    console.log("marketplace deployed to: ", marketplace.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });