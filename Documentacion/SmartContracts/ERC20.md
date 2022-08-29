---
title: Token Standard
author: Cristian Marchese <cmarchesetdiii@gmail.com>
type: Standards Track
status: Idea
created: 2022-08-26
---

NOTE: THE CODE LINES EXPRESSED HERE ARE JUST TO REPRESENT THE IDEA AND BY NO MEANS WOULD BE A WAY FOR IMPLMENTATION WITHOUT CHECKING OUT THE PROPER FUNCTIONALITY.


#### transfer OVERRIDE

Transfers `_value` amount of tokens to address `_to`, and MUST fire the `Transfer` event.
The function SHOULD `throw` if the message caller's account balance does not have enough tokens to spend WHICH ARE NOT IN VESTING 
THEY MUST NOT BE ALLOWED TO TRANSFER THE TOKENS IN VESTING=> require( balanceOf()> (_value + Vesting_quantity) )

*Note* Transfers of 0 values MUST be treated as normal transfers and fire the `Transfer` event.

``` js
function transfer(address _to, uint256 _value) public returns (bool success)
```



#### transferFrom OVERRIDE

Transfers `_value` amount of tokens from address `_from` to address `_to`, and MUST fire the `Transfer` event.

The `transferFrom` method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf.
This can be used for example to allow a contract to transfer tokens on your behalf and/or to charge fees in sub-currencies.
The function SHOULD `throw` unless the `_from` account has deliberately authorized the sender of the message via some mechanism.
ONLY OUR MULTISIGN WALLET SHOULD TRANSFER THE TOKENS THEY HAVE IN VESTING =>
	if(msg.sender!=OUR_WALLET){ require( balanceOf()> (_value + Vesting_quantity) ) }
	else{// MOVE FORWARD IN THE NORMAL WAY}

*Note* Transfers of 0 values MUST be treated as normal transfers and fire the `Transfer` event.

``` js
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```



#### approve OVERRIDE

Allows `_spender` to withdraw from your account multiple times, up to the `_value` amount. If this function is called again it overwrites the current allowance with `_value`.

**NOTE**: To prevent attack vectors like the one [described here](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/) and discussed [here](https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729),
clients SHOULD make sure to create user interfaces in such a way that they set the allowance first to `0` before setting it to another value for the same spender.
THOUGH The contract itself shouldn't enforce it, to allow backwards compatibility with contracts deployed before
THE MSG.SENDER MUST NOT BE ALLOWED TO DECREASE THE ALLOWANCE TO OUR WALLET IN ORDER TO BE LESS THAN THE VESTING THEY HAVE =>
if(vesting_quantity < allowance(msg.sender, OUR_WALLET) ) {allowance(msg.sender, OUR_WALLET)= vesting_quantity}

``` js
function approve(address _spender, uint256 _value) public returns (bool success)
```



#### struct SVESTING

**NOTE**: A struct containing the vesting amount, the timestamp when it's going to be released and the tokenId asociated with all these.

``` js
    struct SVESTING
    {
        uint256 timeStamp;
        uint256 amount;
        uint256 tokenId;
    }
```



#### vesting mapping

**NOTE**: A mapping for each address pointing to an uint256(increased in 1 by every addition of the collection to a specific wallet) that will be pointing to the struct SVESTING containing all the vesting information needed.

``` js
mapping (address => mapping (uint256 => SVESTING)) private sVesting;// address -> NFT_number_in_wallet ->sVesting
```




#### vesting mapping

**NOTE**: A mapping for each address pointing to how many NFTs do they have used to iterate each wallet with the sVesting mapping in order to get or modiefy all the vestings for each wallet. this should be increased every time we buy an NFT in all the wallets that do their part in the business.

``` js
mapping (address => uint256) NftAmount; // keeps the counting of how many NFT this wallet has
```



#### mintWithVesting

Allow us to create new tokens while we get the colateralization assets.

**NOTE**: we can get (_mint) from de openzeppelin wizard but we should modify it into this.
**parameters**
_to = the Adress that will receive the tokens
_amount = the quantity of tokens they will receive
_tokenID = The ID of the NFT associated to the tokens that we are minting
_vesting_time = How long would they not be able to use those tokens. It should be greater than the expiration date. The value should be given in seconds from the current time and should be saved in epoc timestamp in the sVesting mapping. And all the rest of the information here completed.
**returns**
_success= return true if everything went right.

``` js
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool _success)
```




#### vestingQuantity

Allow us to know the assets in vesting.

**NOTE**: This should go on the vesting mapping retrieving the values and doing the addition in order to get the total amount.
**parameters**:
_of= address from who we want to get the value.
**returns**:
_vesting_quantity= total amount of ERC20 tokens this address specified in the parameters has in vesting.

``` js
function vestingQuantity(address _of) public view returns (uint256 _vesting_quantity)
```





#### getVestingDates

Allow us to know the vesting a wallet has in a determined position of sVsting

**NOTE**: Using the sVesting mapping this should return the vestings of a specific user (For mental sake). This should retrieved the timeStamps and the quiantity for each vesting in the sVesting map of the user.
**parameters**:
_of= address from who we want to get the value.
_position= NftAmount number assigend to a determined token when writing the vesting.
**returns**:
_my_Vesting= Amount that this wallet has in vesting
_my_Timestamp= timestamp to release the vesting in epoc.
_my_token_ID= TokenID of the NFT associated with this vesting

``` js
 function getVestingDates(address _of, uint256 _position) external view returns (uint256 _my_Vesting, uint256 _my_timestamp, uint256 _my_token_ID)
```





#### getNftAmount

Allow us to know the maximum value a wallet would have to iterate in order to get or modify all the vestings from the sVesting Mapping

**NOTE**: this value we need it is contained in the NftAmount.
**parameters**:
_of= address from who we want to get the value.
**returns**:
_amount= maximum value a wallet would have to iterate, as this value will increase every time the person gets a new NFT.

``` js
    function getNftAmount(address _of) public view returns (uint256 _amount)
    {
        _amount=NftAmount[_of];
        return(_amount);
    }
 ```





#### claim

Allow users to redeem their tokens with expired timestamps.

**NOTE**: checks in the sVesting mapping if there is any expired date and if that's the case we redeem the tokens to the user (Errase that from the vesting mapping and change allowance). To iterate you should use NftAmount.

**returns**:
_divesting_quantity= It should return the value of how many tokens were released from the vesting.
``` js
    function claim() external returns (uint256 _divesting_quantity)
```





#### NFT_claim

Allow sellers and fees tokens to be claimed.

**NOTE**: This function must only accept callings from the NFT contract (onlyNftContract). Using the sVesting mapping and the information of timestamp, address and tokenID sent by the NFT factory MarkUsed() function, we should find the proper vesting for that specific NFT and change the vesting time to block.timestamp.For production we should change it to some time in the future to give some time to the user to receive the product or service before releasing the money.

**parameters**:
_to= The wallet of the person we want to release the money to. This info is inside the NFT information.
_tokenID= Id of the NFT

**returns**:
_new_amount= Amount in vesting after doing this (which should be the same than before). We should not change the value, just the timestamp, then the claim() function will be the one changing the amount.
``` js
    function NFT_claim(address _to, uint256 _tokenID) external onlyNftContract returns (uint256 _new_amount)
    {
        for(uint256 __counter=NftAmount[_to]; __counter>=0; __counter--)
        {
            if(sVesting[_to][__counter].tokenId==_tokenID)
            {
                sVesting[_to][__counter].timeStamp=0;  
            }
            else
            {
                _new_amount+=sVesting[_to][__counter].amount;
            }
            if(__counter==0)
                break;
        }
        return(_new_amount);
    }
```





---
eip: 20
title: Token Standard
author: Fabian Vogelsteller <fabian@ethereum.org>, Vitalik Buterin <vitalik.buterin@ethereum.org>
type: Standards Track
category: ERC
status: Final
created: 2015-11-19
---

## Simple Summary

A standard interface for tokens.


## Abstract

The following standard allows for the implementation of a standard API for tokens within smart contracts.
This standard provides basic functionality to transfer tokens, as well as allow tokens to be approved so they can be spent by another on-chain third party.


## Motivation

A standard interface allows any tokens on Ethereum to be re-used by other applications: from wallets to decentralized exchanges.


## Specification

## Token
### Methods

**NOTES**:
 - The following specifications use syntax from Solidity `0.4.17` (or above)
 - Callers MUST handle `false` from `returns (bool success)`.  Callers MUST NOT assume that `false` is never returned!


#### name

Returns the name of the token - e.g. `"MyToken"`.

OPTIONAL - This method can be used to improve usability,
but interfaces and other contracts MUST NOT expect these values to be present.


``` js
function name() public view returns (string)
```


#### symbol

Returns the symbol of the token. E.g. "HIX".

OPTIONAL - This method can be used to improve usability,
but interfaces and other contracts MUST NOT expect these values to be present.

``` js
function symbol() public view returns (string)
```



#### decimals

Returns the number of decimals the token uses - e.g. `8`, means to divide the token amount by `100000000` to get its user representation.

OPTIONAL - This method can be used to improve usability,
but interfaces and other contracts MUST NOT expect these values to be present.

``` js
function decimals() public view returns (uint8)
```


#### totalSupply

Returns the total token supply.

``` js
function totalSupply() public view returns (uint256)
```



#### balanceOf

Returns the account balance of another account with address `_owner`.

``` js
function balanceOf(address _owner) public view returns (uint256 balance)
```



#### transfer

Transfers `_value` amount of tokens to address `_to`, and MUST fire the `Transfer` event.
The function SHOULD `throw` if the message caller's account balance does not have enough tokens to spend.

*Note* Transfers of 0 values MUST be treated as normal transfers and fire the `Transfer` event.

``` js
function transfer(address _to, uint256 _value) public returns (bool success)
```



#### transferFrom

Transfers `_value` amount of tokens from address `_from` to address `_to`, and MUST fire the `Transfer` event.

The `transferFrom` method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf.
This can be used for example to allow a contract to transfer tokens on your behalf and/or to charge fees in sub-currencies.
The function SHOULD `throw` unless the `_from` account has deliberately authorized the sender of the message via some mechanism.

*Note* Transfers of 0 values MUST be treated as normal transfers and fire the `Transfer` event.

``` js
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```



#### approve

Allows `_spender` to withdraw from your account multiple times, up to the `_value` amount. If this function is called again it overwrites the current allowance with `_value`.

**NOTE**: To prevent attack vectors like the one [described here](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/) and discussed [here](https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729),
clients SHOULD make sure to create user interfaces in such a way that they set the allowance first to `0` before setting it to another value for the same spender.
THOUGH The contract itself shouldn't enforce it, to allow backwards compatibility with contracts deployed before

``` js
function approve(address _spender, uint256 _value) public returns (bool success)
```


#### allowance

Returns the amount which `_spender` is still allowed to withdraw from `_owner`.

``` js
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```



### Events


#### Transfer

MUST trigger when tokens are transferred, including zero value transfers.

A token contract which creates new tokens SHOULD trigger a Transfer event with the `_from` address set to `0x0` when tokens are created.

``` js
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```



#### Approval

MUST trigger on any successful call to `approve(address _spender, uint256 _value)`.

``` js
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```



## Implementation

There are already plenty of ERC20-compliant tokens deployed on the Ethereum network.
Different implementations have been written by various teams that have different trade-offs: from gas saving to improved security.

#### Example implementations are available at
- [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol)
- [ConsenSys implementation](https://github.com/ConsenSys/Tokens/blob/fdf687c69d998266a95f15216b1955a4965a0a6d/contracts/eip20/EIP20.sol)


## History

Historical links related to this standard:

- Original proposal from Vitalik Buterin: https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs/499c882f3ec123537fc2fccd57eaa29e6032fe4a
- Reddit discussion: https://www.reddit.com/r/ethereum/comments/3n8fkn/lets_talk_about_the_coin_standard/
- Original Issue #20: https://github.com/ethereum/EIPs/issues/20



## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).
