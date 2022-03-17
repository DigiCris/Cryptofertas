// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    const TestUniswap = await ethers.getContractFactory("TestUniswap");
    console.log("Deploying TestUniswap...");
    const testUniswap = await upgrades.deployProxy(TestUniswap, [], {
        initializer: "initialize",
    });
    await testUniswap.deployed();
    console.log("testUniswap deployed to:", testUniswap.address);
}

main();