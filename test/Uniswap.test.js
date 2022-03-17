const { expect } = require("chai");
const { ethers, upgrades} = require("hardhat");
const { daiABI, linkABI, usdtABI } = require("../abis/abis.json");
const { toWei} = require("./utils");
const { ParaSwap } = require('paraswap');

const paraSwap = new ParaSwap();


describe("Uniswap", () => {
    let TestUniswap, testUniswap, TestParaswap, testParaswap
    let dai, link, usdt
    let owner, account1 ,addressWithEther ,accountWithEther         

    before(async function () {
        TestUniswap = await ethers.getContractFactory("TestUniswap");
        TestParaswap = await ethers.getContractFactory("TestParaswap");
        [owner, account1] = await ethers.getSigners();

        addressWithEther = "0xDA4a22Ad0D0E9aFf0846CA54225637Ada5bf7a14";
        
        await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: [addressWithEther]
		});

        accountWithEther = await ethers.getSigner(addressWithEther);    

        dai = new ethers.Contract("0x6B175474E89094C44Da98b954EedeAC495271d0F",daiABI);
        link = new ethers.Contract("0x514910771AF9Ca656af840dff83E8264EcF986CA",linkABI);
        usdt = new ethers.Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", usdtABI);
        
        testUniswap = await upgrades.deployProxy(TestUniswap, [], {
			initializer: "initialize",
		});
        await testUniswap.deployed();
        testParaswap  = await upgrades.upgradeProxy(testUniswap.address, TestParaswap);
    });

    it("Test swapFromEther", async function () {
        const balanceOfLinkOfAccount1BeforeSwap = await link.connect(account1).balanceOf(account1.address);
        const balanceOfDaiOfAccount1BeforeSwap = await dai.connect(account1).balanceOf(account1.address);
        const balanceOfUsdtOfAccount1BeforeSwap = await usdt.connect(account1).balanceOf(account1.address);
		
        await testParaswap.connect(account1).swapFromEther([link.address, dai.address, usdt.address],[60, 30, 10],account1.address,{ value: toWei(100) });
        
		const balanceOfLinkOfAccount1AfterSwap = await link.connect(account1).balanceOf(account1.address);
		const balanceOfDaiOfAccount1AfterSwap = await dai.connect(account1).balanceOf(account1.address);
		const balanceOfUsdtOfAccount1AfterSwap = await usdt.connect(account1).balanceOf(account1.address);

        expect(balanceOfLinkOfAccount1BeforeSwap < balanceOfLinkOfAccount1AfterSwap).to.be.equal(true);
        expect(balanceOfDaiOfAccount1BeforeSwap < balanceOfDaiOfAccount1AfterSwap).to.be.equal(true);
        expect(balanceOfUsdtOfAccount1BeforeSwap < balanceOfUsdtOfAccount1AfterSwap).to.be.equal(true);                                                    
    })

    it("Test errors in swapFromEther", async function () {
        
        await expect(testParaswap.connect(account1).swapFromEther([link.address, dai.address],[60, 30, 10],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith("You need an equal amount of addresses and percentages",);
        
        await expect(testParaswap.connect(account1).swapFromEther([link.address, dai.address, usdt.address],[0, 30, 10],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith("Each percentage has to be bigger than 0");
        
        await expect(testParaswap.connect(account1).swapFromEther([link.address, dai.address, usdt.address],[60, 40, 10],account1.address,{ value: toWei(100) })
        ).to.be.revertedWith("The sum of the percentages is not 100"); 
    })

    it("Test errors from swapFromToken", async function() {
        await expect(testParaswap.connect(account1).swapFromToken(usdt.address, [link.address, dai.address],1000000 ,[60, 30, 10],account1.address,{ value: toWei(100) }),
		).to.be.revertedWith("You need an equal amount of addresses and percentages");

		await expect(testParaswap.connect(account1).swapFromToken(usdt.address, [link.address, dai.address, usdt.address],1000000,[0, 30, 10],account1.address,{ value: toWei(100) },),
		).to.be.revertedWith("Each percentage has to be bigger than 0");

		await expect(testParaswap.connect(account1).swapFromToken(usdt.address,[link.address, dai.address, usdt.address],1000000,[60, 40, 10],account1.address,{ value: toWei(100) },)
		).to.be.revertedWith("The sum of the percentages is not 100"); 
        
    })

    it("Test swapFromToken", async function () {
        await testParaswap.connect(owner).swapFromEther([link.address],[100],owner.address,{ value: toWei(100) });
        link.connect(owner).approve(testParaswap.address, toWei(100))
        const balanceOfDaiOfOwnerBeforeSwap = await dai.connect(owner).balanceOf(owner.address);
		const balanceOfUsdtOfOwnerBeforeSwap = await usdt.connect(owner).balanceOf(owner.address);
        await testParaswap.connect(owner).swapFromToken(link.address, [dai.address, usdt.address], toWei(50), [50,50], owner.address)
        const balanceOfDaiOfOwnerAfterSwap = await dai.connect(owner).balanceOf(owner.address);
		const balanceOfUsdtOfOwnerAfterSwap = await usdt.connect(owner).balanceOf(owner.address);

        expect(balanceOfDaiOfOwnerBeforeSwap < balanceOfDaiOfOwnerAfterSwap).to.be.equal(true);
		expect(balanceOfUsdtOfOwnerBeforeSwap <balanceOfUsdtOfOwnerAfterSwap).to.be.equal(true);
    });

    it("Test Paraswap api", async function(){
        const srcToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // ETH
		const destToken ="0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI
		const srcAmount = "1000000000"; //The source amount multiplied by its decimals: 10 ** 18 here
		const destAmount = "1";
		const receiver = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // Useful in case of swap and transfer
		const referrer = "Jhon";

		let priceRoute = await paraSwap.getRate(srcToken,destToken,srcAmount);

		const txParams = await paraSwap.buildTx(srcToken,destToken,srcAmount,destAmount,priceRoute,addressWithEther,referrer,receiver);
        expect(txParams.data.length > 0).to.be.equal(true)
    })
});