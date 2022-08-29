require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
	networks: {
		hardhat: {
			forking: {
				url: process.env.ALCHEMY_KEY,
				blockNumber: 26089200,
			},
			chainId: 137,
		},
		rinkeby: {
			url: process.env.ALCHEMY_KEY,
			accounts: [process.env.ACCOUNT_KEY],
		},
		live: {
			url: process.env.ALCHEMY_KEY,
			accounts: [process.env.ACCOUNT_KEY],
		},
	},
	namedAccounts: {
		deployer: 0,
		feeRecipient: 1,
		user: 2,
	},
	solidity: {
		version: "0.8.7",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	mocha: {
		timeout: 240000,
	},
};