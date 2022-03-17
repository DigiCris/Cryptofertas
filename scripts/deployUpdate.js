// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

// Get proxy from first deployment
let PROXY

async function main() {
    const TestParaswap = await ethers.getContractFactory("TestParaswap");
    console.log("Upgrading TestUniswap...");
    await upgrades.upgradeProxy(PROXY, TestParaswap);
    console.log("TestUniswap upgraded");
}

main(); 