// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface INFTFACTORY
{
    //information
    function inSale(uint256) external returns (bool);
    function getPrice(uint256 _token_id) external view returns(uint256 _price);
    function expiration(uint256 _token_id) external view returns(uint256);

    // Wallets
    function nftProvider(uint256) external returns (address);
    function nftEmbasador(uint256) external returns (address);
    function nftOwner(uint256) external returns (address);
    function nftDeveloper() external returns (address);
    function nftDAO() external returns (address);
    function nftCompany() external returns (address);
    function nftUser() external returns (address);

    //Benefits to give away
    function ownerBenefit() external returns (uint256);
    function providerBenefit() external returns (uint256);
    function embasadorBenefit() external returns (uint256);
    function developerBenefit() external returns (uint256);
    function daoBenefit() external returns (uint256);
    function companyBenefit() external returns (uint256);
    function userBenefit() external returns (uint256);

    //functions (write)
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
}

interface IVESTING
{
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success);
}

contract CMARKETPLACE
{
    INFTFACTORY private iNFTFactoryContract;
    IVESTING private iMyTokenContract;


    // constructor
    constructor(address _ERC20, address _NFT)
    {
        // interface to talk to
        iMyTokenContract=IVESTING(_ERC20);
        iNFTFactoryContract= INFTFACTORY(_NFT);
    }

    function Buy(uint256 _token_id) public returns(bool _success)
    {
        // previously to this function the seller should have given permision to this contract to transfer the NFT in the NFT factory contract
        
        //Previously to this function the buyer should have given permision to this contract to  transfer the ERC20 token from their account in the ERC20 token contract

        // we transfer the ERC20 tokens from the buyer to the 0x0 (we burn them)

        // we transfer the NFT from the seller to the user
        address __from=iNFTFactoryContract.nftOwner(_token_id);
        address __to=msg.sender;
        iNFTFactoryContract.safeTransferFrom(__from, __to, _token_id);


        // then we mint ERC20 tokens to all the following addresses.

        // minting to owner
        __to=__from;
        uint256 __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.ownerBenefit() ) /1000;
        uint256 __tokenID=_token_id;
        uint256 __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Provider
        __to=iNFTFactoryContract.nftProvider(_token_id);
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.providerBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Embasador
        __to=iNFTFactoryContract.nftEmbasador(_token_id);
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.embasadorBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);
        
        // minting to Developer
        __to=iNFTFactoryContract.nftDeveloper();
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.developerBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to DAO
        __to=iNFTFactoryContract.nftDAO();
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.daoBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Company
        __to=iNFTFactoryContract.nftCompany();
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.companyBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to User
        __to=iNFTFactoryContract.nftUser();
        __amount=( iNFTFactoryContract.getPrice(_token_id)*iNFTFactoryContract.userBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= iNFTFactoryContract.expiration(_token_id);
        _success=iMyTokenContract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

    }

}
