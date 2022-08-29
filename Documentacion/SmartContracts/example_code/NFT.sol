// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IVESTING
{
    function NFT_claim(address _to, uint256 _tokenID) external returns (uint256 _new_amount);
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success);
}


contract CNFTFACTORY
{
    ///////////////////////////////// Rolls /////////////////////////////////////////////////////////// 
    //NftProvider= Person or company that will provide the service or product for the NFT
    //NftOwner= current owner of the NFT
    //NftEmbasador= Person who publishes the NFT. If the publisher is the provider, there is no embasador.
    //NftDeveloper= The team developing the project
    //NftDao= Investoland that will be our entry to production
    //NftCompany= The company we will be creating.
    //////////////////////////////// End of Rolls /////////////////////////////////////////////////////

    // ERC20 token contract interface
    IVESTING private i_my_token_Contract;

    // counting the NFT
    uint256 private token_id;

    ///////////////////////// NFT Information //////////////////////////////////////////////////////////
    mapping (uint256 => address) public NftProvider; // tokenId -> Address of NftProvider
    mapping (uint256 => address) public NftEmbasador; // tokenId -> Address of NftEmbasador
    mapping (uint256 => address) public NftOwner; // tokenId -> Address of NftOwner (rename of ownerOf)
    mapping (uint256 => bool) public FirstSold; // tokenId -> firstSold (identify if it is a first time selling)
    mapping (uint256 => uint256) public Price; // tokenId -> price (the actual selling price)
    mapping (uint256 => bool) public Used; // tokenId -> Used (identify if it is already used)
    mapping (uint256 => bool) public InSale; // tokenId -> InSale (are we selling it or not?)
    mapping (uint256 => uint256) public Expiration; // tokenId -> Expiration (last time to use the NFT?)
    ///////////////////////// End of NFT Information ////////////////////////////////////////////////////

    // Fixed wallets set in the constructor
    address public NftDeveloper; // our wallet
    address public NftDAO; // wallet of the DAO
    address public NftCompany; //wallet of our company
    address public NftUser; //wallet for user redistribution
    address public Marketplace; //address of marketplace
    address private Owner;

    //Tokenomics set in the constructor
    uint256 public  OwnerBenefit; //90 %
    uint256 public  ProviderBenefit; // 0.2% -> in first time selling this amount goes to companyBenefit
    uint256 public  EmbasadorBenefit; // 2%
    uint256 public  DeveloperBenefit; // 2.5%
    uint256 public  DaoBenefit; // 1%
    uint256 public  CompanyBenefit; // 2.3%
    uint256 public  UserBenefit; // 2%
    

    // Modifiers
    modifier onlyOwner()  // this is the contract owner
    {
        require(msg.sender == Owner, "You are not the owner of the smart contract");
        _;
    }
    modifier onlyNftOwner(uint256 _token_id)  // this is the owner of the NFT
    {
        require(msg.sender == NftOwner[_token_id], "You are not the owner of the NFT");
        _;
    }


    // constructor
    constructor(address _AddrContract)
    {
        // interface to talk to
        i_my_token_Contract=IVESTING(_AddrContract);

        // benefits to the wallets (tokenimics)
        OwnerBenefit=900; // 900 per 1000
        ProviderBenefit=2; // 2 per 1000
        EmbasadorBenefit=20; // 20 per 1000
        DeveloperBenefit=25; // 25 per 1000
        DaoBenefit=10; // 10 per 1000
        UserBenefit=20; // 20 per 1000
        CompanyBenefit=23; // 23 per 1000... (the rest after giving the tokens to each part)

        //fixed wallets
        NftDeveloper=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // our wallet
        NftDAO=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db; // wallet of the DAO
        NftCompany=0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB; //wallet of our company
        NftUser=0x617F2E2fD72FD9D5503197092aC168c91465E7f2; // wallets for user's giveaways
        Owner= msg.sender;//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

    }

    //functions

    function Mint(address _NftProvider, uint256 _price, uint256 _seconds_to_expire) public returns(uint256 _token_id)
    {
        _token_id= token_id;
        NftProvider[_token_id]=_NftProvider;
        NftEmbasador[_token_id]=msg.sender; // tokenId -> Address of NftEmbasador
        NftOwner[_token_id]=_NftProvider; // tokenId -> Address of NftOwner (rename of ownerOf)
        FirstSold[_token_id]=true; // tokenId -> firstSold (identify if it is a first time selling)
        Used[_token_id]=false; // tokenId -> Used (identify if it is already used)
        Price[_token_id]=_price; // tokenId -> price (the actual selling price)
        Expiration[_token_id]=block.timestamp+_seconds_to_expire;
        _token_id++;
        token_id=_token_id;
        return(_token_id);
    }

    function SetInSale(uint256 _token_id, bool _new_value) external onlyNftOwner(_token_id) returns(bool)
    {
        //Aprove permision to transfer NFT by CMARKETPLACE address
        InSale[_token_id]=_new_value;
        return(_new_value);
    }

    function setMarketplace(address _new_contract_address) public onlyOwner returns(address)
    {
        Marketplace=_new_contract_address;
        return(_new_contract_address);
    }

    function MarkUsed(uint256 _token_id) external onlyNftOwner(_token_id) returns(bool _success)
    {
        // It can only be used once
        bool __used=Used[_token_id];
        require(__used==false,"Your NFT has already been used");
        Used[_token_id]=true;

        // We release the vestings associated with this NFT
        i_my_token_Contract.NFT_claim(NftProvider[_token_id], _token_id);
        i_my_token_Contract.NFT_claim(NftEmbasador[_token_id], _token_id);
        i_my_token_Contract.NFT_claim(NftOwner[_token_id], _token_id);
        i_my_token_Contract.NFT_claim(NftDeveloper, _token_id);
        i_my_token_Contract.NFT_claim(NftDAO, _token_id);
        i_my_token_Contract.NFT_claim(NftCompany, _token_id);
        
        _success=true;
        return(_success);
    }


    function getPrice(uint256 _token_id) public view returns(uint256 _price)
    {
        _price=Price[_token_id];
        return(_price);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable
    {
        // this function is implemented in openzeppelin. Not avaisable to change it. This is only for testing purpose
        require(NftOwner[_tokenId]==_from,"This NFT is not from the person who is trying to sell it");
        NftOwner[_tokenId]=_to; // we change the ownership from _from to _to
        FirstSold[_tokenId]=false; // It is no longer the first time for this NFT
    }






}