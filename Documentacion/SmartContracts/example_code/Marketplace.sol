// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface INFTFACTORY
{
    //information
    function InSale(uint256) external returns (bool);
    function getPrice(uint256 _token_id) external view returns(uint256 _price);
    function Expiration(uint256 _token_id) external view returns(uint256);

    // Wallets
    function NftProvider(uint256) external returns (address);
    function NftEmbasador(uint256) external returns (address);
    function NftOwner(uint256) external returns (address);
    function NftDeveloper() external returns (address);
    function NftDAO() external returns (address);
    function NftCompany() external returns (address);
    function NftUser() external returns (address);

    //Benefits to give away
    function OwnerBenefit() external returns (uint256);
    function ProviderBenefit() external returns (uint256);
    function EmbasadorBenefit() external returns (uint256);
    function DeveloperBenefit() external returns (uint256);
    function DaoBenefit() external returns (uint256);
    function CompanyBenefit() external returns (uint256);
    function UserBenefit() external returns (uint256);

    //functions (write)
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
}

interface IVESTING
{
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success);
}

contract CMARKETPLACE
{
    INFTFACTORY private i_nft_factory_Contract;
    IVESTING private i_my_token_Contract;


    // constructor
    constructor(address _ERC20, address _NFT)
    {
        // interface to talk to
        i_my_token_Contract=IVESTING(_ERC20);
        i_nft_factory_Contract= INFTFACTORY(_NFT);
    }

    function Buy(uint256 _token_id) public returns(bool _success)
    {
        // previously to this function the seller should have given permision to this contract to transfer the NFT in the NFT factory contract
        
        //Previously to this function the buyer should have given permision to this contract to  transfer the ERC20 token from their account in the ERC20 token contract

        // we transfer the ERC20 tokens from the buyer to the 0x0 (we burn them)

        // we transfer the NFT from the seller to the user
        address __from=i_nft_factory_Contract.NftOwner(_token_id);
        address __to=msg.sender;
        i_nft_factory_Contract.safeTransferFrom(__from, __to, _token_id);


        // then we mint ERC20 tokens to all the following addresses.

        // minting to owner
        __to=__from;
        uint256 __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.OwnerBenefit() ) /1000;
        uint256 __tokenID=_token_id;
        uint256 __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Provider
        __to=i_nft_factory_Contract.NftProvider(_token_id);
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.ProviderBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Embasador
        __to=i_nft_factory_Contract.NftEmbasador(_token_id);
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.EmbasadorBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);
        
        // minting to Developer
        __to=i_nft_factory_Contract.NftDeveloper();
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.DeveloperBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to DAO
        __to=i_nft_factory_Contract.NftDAO();
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.DaoBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to Company
        __to=i_nft_factory_Contract.NftCompany();
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.CompanyBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

        // minting to User
        __to=i_nft_factory_Contract.NftUser();
        __amount=( i_nft_factory_Contract.getPrice(_token_id)*i_nft_factory_Contract.UserBenefit() ) /1000;
        __tokenID=_token_id;
        __vesting_time= i_nft_factory_Contract.Expiration(_token_id);
        _success=i_my_token_Contract.mintWithVesting(__to, __amount, __tokenID, __vesting_time);

    }

}
