const { expect } = require("chai");
const { ethers, upgrades} = require("hardhat");
const { toWei, tokens } = require("./utils");
const { ParaSwap } = require('paraswap');
const networkID = 137;
const partner = "paraswap";
const apiURL = "https://apiv5.paraswap.io";

const paraSwap = new ParaSwap(networkID, apiURL, "https://polygon-mainnet.g.alchemy.com/v2/gUn9Jv_9bGzABR5gYy4WOLGR4qSJAeRA");

function getToken(symbol) {
  const token = tokens[networkID]?.find((t) => t.symbol === symbol);

  if (!token)
    throw new Error(`Token ${symbol} not available on network ${networkID}`);
  return token;
}

describe("Uniswap", () => {
    let TestUniswap, testUniswap, TestParaswap, testParaswap
    let owner, account1 ,account2          

    before(async function () {
        TestUniswap = await ethers.getContractFactory("TestUniswap");
        TestParaswap = await ethers.getContractFactory("TestParaswap");
        [owner, account1, account2] = await ethers.getSigners();
        
        testUniswap = await upgrades.deployProxy(TestUniswap, [], {
			initializer: "initialize",
		});
        await testUniswap.deployed();
        testParaswap  = await upgrades.upgradeProxy(testUniswap.address, TestParaswap);

    });

    it("Test swapFromEther", async function () {

        const WBTC = getToken("WBTC");
		const WETH = getToken("WETH");

        const WBTCContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WBTC.address);

		const WETHContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WETH.address);

        const balanceOfWBTCOfAccount1BeforeSwap = await WBTCContract.connect(account1).balanceOf(account1.address);
        const balanceOfWETHOfAccount1BeforeSwap = await WETHContract.connect(account1).balanceOf(account1.address);
		
        await testParaswap.connect(account1).swapFromEther([WBTC.address, WETH.address],[60, 40],account1.address,{ value: toWei(100) });
        
		
		const balanceOfWBTCOfAccount1AfterSwap = await WBTCContract.connect(account1).balanceOf(account1.address);
		const balanceOfWETHOfAccount1AfterSwap = await WETHContract.connect(account1).balanceOf(account1.address);

        expect(balanceOfWBTCOfAccount1BeforeSwap < balanceOfWBTCOfAccount1AfterSwap).to.be.equal(true);
        expect(balanceOfWETHOfAccount1BeforeSwap < balanceOfWETHOfAccount1AfterSwap).to.be.equal(true);
    })

    it("Test errors in swapFromEther", async function () {

        const WBTC = getToken("WBTC");
		const WETH = getToken("WETH");

		const WBTCContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WBTC.address);

		const WETHContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WETH.address);
        
        await expect(testParaswap.connect(account1).swapFromEther([WBTCContract.address, WETHContract.address],[60, 30, 10],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
			"You need an equal amount of addresses and percentages",
		);
        
        await expect(testParaswap.connect(account1).swapFromEther([WBTCContract.address, WETHContract.address],[0, 100],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
            "Each percentage has to be bigger than 0"
        );
        
        await expect(testParaswap.connect(account1).swapFromEther([WBTCContract.address, WETHContract.address],[60, 70],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
        "The sum of the percentages is not 100"
        ); 
    })

    it("Test errors from swapFromToken", async function() {
        const WBTC = getToken("WBTC");
		const WETH = getToken("WETH");

        await expect(testParaswap.connect(account1).swapFromToken(WETH.address,[WETH.address, WBTC.address],1000000,[60, 30, 10],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
			"You need an equal amount of addresses and percentages",
		);

		await expect(testParaswap.connect(account1).swapFromToken(WETH.address,[WETH.address, WBTC.address],1000000,[0, 100],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
        "Each percentage has to be bigger than 0"
        );

		await expect(testParaswap.connect(account1).swapFromToken(WETH.address,[WETH.address, WBTC.address],1000000,[70, 40],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith(
        "The sum of the percentages is not 100"
        ); 
        
    })

    it("Test swapFromToken", async function () {

        const WBTC = getToken("WBTC");
		const WETH = getToken("WETH");

		const WBTCContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WBTC.address);

		const WETHContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", WETH.address);  

        await testParaswap.connect(owner).swapFromEther([WETH.address], [100], owner.address, {value: toWei(1000)});
        await WETHContract.connect(owner).approve(testParaswap.address, toWei(1));
		const balanceOfWETHOfOwnerBeforeSwap = await WETHContract.connect(owner).balanceOf(owner.address);
        const balanceOfWBTCOfOwnerBeforeSwap = await WBTCContract.connect(owner).balanceOf(owner.address);
        await testParaswap.connect(owner).swapFromToken(WETH.address, [WBTC.address], toWei(0.01), [100], owner.address)
        const balanceOfWETHOfOwnerAfterSwap = await WETHContract.connect(owner).balanceOf(owner.address);
		const balanceOfWBTCOfOwnerAfterSwap = await WBTCContract.connect(owner).balanceOf(owner.address);

        expect(balanceOfWETHOfOwnerBeforeSwap > balanceOfWETHOfOwnerAfterSwap).to.be.equal(true);
		expect(balanceOfWBTCOfOwnerBeforeSwap < balanceOfWBTCOfOwnerAfterSwap).to.be.equal(true);
    });

    it("Test Real Paraswap Api", async function(){

        // Sometimes this works and sometimes it doesn't. The API has problems
     
        const MATIC = getToken("MATIC")
        const WETH = getToken("WETH")
        const WBTC = getToken("WBTC");

		const WBTCContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WBTC.address);

		const WETHContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",WETH.address);  


        const srcAmount = toWei(1)
        
        const priceRouteOrErrorToWeth = await paraSwap.getRate(
			MATIC.address,
			WETH.address,
			srcAmount,
			testParaswap.address,
			"SELL",
			{ partner },
			MATIC.decimals,
			WETH.decimals,
		);

        const priceRouteOrErorToWbtc = await paraSwap.getRate(
			MATIC.address,
			WBTC.address,
			srcAmount,
			testParaswap.address,
			"SELL",
			{ partner },
			MATIC.decimals,
			WBTC.decimals,
		);        
        
        const transactionRequestOrErrorToWeth = await paraSwap.buildTx(
			MATIC.address,
			WETH.address,
			srcAmount,
			"1",
			priceRouteOrErrorToWeth,
			testParaswap.address,
			partner,
			undefined,
			undefined,
			testParaswap.address,
			{ ignoreChecks: true },
		);

        const transactionRequestOrErrorToWbtc = await paraSwap.buildTx(
			MATIC.address,
			WBTC.address,
			srcAmount,
			"1",
			priceRouteOrErorToWbtc,
			testParaswap.address,
			partner,
			undefined,
			undefined,
			testParaswap.address,
			{ ignoreChecks: true },
		);

        await testParaswap.connect(account2).swapFromPara([transactionRequestOrErrorToWeth.data,transactionRequestOrErrorToWbtc.data,],[WETH.address, WBTC.address],{value: toWei(2),},);

        console.log(await WBTCContract.balanceOf(account2.address))

        expect(await WBTCContract.balanceOf(account2.address)).to.not.equal(0);
        expect(await WETHContract.balanceOf(account2.address)).to.not.equal(0);
    })
});