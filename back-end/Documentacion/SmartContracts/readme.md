---
title: Token Deployment
author: Cristian Marchese <cmarchesetdiii@gmail.com>
type: Procedure Track
status: Implementation
created: 2022-09-05
---

NOTE: Document that stablish the procedure to configure the smart contract deployment.


#### Deploy ERC20 normally
#### Deploy NFTFactory sending to the constructor the address of the ERC20 contract previously deployed
#### Deploy Marketplace giving to the constructor the addresses of the ERC20 contract and the NFTFactory previously deployed

NOTE: The address of the deploymet will be the administrator of the ERC20 token and the owner of the NFTFactory and Marketplace.

#### Using the administrator wallet set the market and NFTFactory address in the ERC20 contract
#### Using the administrator wallet give permision to the Marketplace address to mint in the ERC20 contract
#### In the NFT contract using the owner wallet set the Marketplace address and the ERC20 address


NOTE: In order to use the smart contract...

#### Mint an NFT to one address. The wallet that mint it would be de embasador, the address that receives the NFT would be the Provider.
#### Sell the NFT in the NFTfactory contract with sellNft (give the permision ...Approve)
#### With the administrator or any minter you config, mint some tokens to the buyer.
#### In ERC20 the buyer should aprove the marketplace as a spender of their erc20 tokens.
#### buy from the Marketplace the NFT token.

NOTE: The buyer should receive the NFT token and the seller and embasador the tokens but with vesting. It means they won't be able to use those tokens.

#### Once the buyer wants to use the coupon just use the function markused from NFTfactory

NOTE: This function will release the vesting to the provider, owner and emabasador and will mark the NFT as used so they can't use it twice.

#### After the vesting is released, the seller should do "claim" in the ERC20 contract in order to release their tokens.

#### Everyone happy :)


NOTE: You can find the Smart contracts in Rinkeby at the following addresses:


ERC20=0x851705F7A0E26cc03656d6d1d9E21778dd7A1D08
NFTfactory=0xE12C3155d6D30ceB076CD40bd42c65882BFa3c87
MarketPlace=0x0E995bbe4E86520E7e68C6fe14E6954842Eef503