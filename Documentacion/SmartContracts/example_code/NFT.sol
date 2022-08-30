// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IVESTING
{
    function nftClaim(address _to, uint256 _tokenID) external returns (uint256 _new_amount);
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success);
}


contract CNFTFACTORY
{
    ///////////////////////////////// Rolls /////////////////////////////////////////////////////////// 
    //nftProvider= Person or company that will provide the service or product for the NFT
    //nftOwner= current owner of the NFT
    //nftEmbasador= Person who publishes the NFT. If the publisher is the provider, there is no embasador.
    //nftDeveloper= The team developing the project
    //NftDao= Investoland that will be our entry to production
    //nftCompany= The company we will be creating.
    //////////////////////////////// End of Rolls /////////////////////////////////////////////////////

    // ERC20 token contract interface
    IVESTING private iMyTokenContract;

    // counting the NFT
    uint256 private tokenId;

    ///////////////////////// NFT Information //////////////////////////////////////////////////////////
    mapping (uint256 => address) public nftProvider; // tokenId -> Address of nftProvider
    mapping (uint256 => address) public nftEmbasador; // tokenId -> Address of nftEmbasador
    mapping (uint256 => address) public nftOwner; // tokenId -> Address of nftOwner (rename of ownerOf)
    mapping (uint256 => bool) public firstSold; // tokenId -> firstSold (identify if it is a first time selling)
    mapping (uint256 => uint256) public price; // tokenId -> price (the actual selling price)
    mapping (uint256 => uint256) public category; // tokenId -> price (the actual selling price)
    mapping (uint256 => bool) public used; // tokenId -> used (identify if it is already used)
    mapping (uint256 => bool) public inSale; // tokenId -> inSale (are we selling it or not?)
    mapping (uint256 => uint256) public expiration; // tokenId -> expiration (last time to use the NFT?)

    mapping (uint8 => uint256[] ) public categoryToToken; // category -> array of tokenId 
    mapping (address => uint256[] ) public cuponsOwner; // address -> all the tokens a wallet has. 
    ///////////////////////// End of NFT Information ////////////////////////////////////////////////////

    // Fixed wallets set in the constructor
    address public nftDeveloper; // our wallet
    address public nftDAO; // wallet of the DAO
    address public nftCompany; //wallet of our company
    address public nftUser; //wallet for user redistribution
    address public marketplace; //address of marketplace
    address private owner;

    //Tokenomics set in the constructor
    uint256 public  ownerBenefit; //90 %
    uint256 public  providerBenefit; // 0.2% -> in first time selling this amount goes to companyBenefit
    uint256 public  embasadorBenefit; // 2%
    uint256 public  developerBenefit; // 2.5%
    uint256 public  daoBenefit; // 1%
    uint256 public  companyBenefit; // 2.3%
    uint256 public  userBenefit; // 2%
    

    // Modifiers
    modifier onlyOwner()  // this is the contract owner
    {
        require(msg.sender == owner, "You are not the owner of the smart contract");
        _;
    }
    modifier onlyNftOwner(uint256 _tokenId)  // this is the owner of the NFT
    {
        require(msg.sender == nftOwner[_tokenId], "You are not the owner of the NFT");
        _;
    }


    // constructor
    constructor(address _AddrContract)
    {
        // interface to talk to
        iMyTokenContract=IVESTING(_AddrContract);

        // benefits to the wallets (tokenimics)
        ownerBenefit=900; // 900 per 1000
        providerBenefit=2; // 2 per 1000
        embasadorBenefit=20; // 20 per 1000
        developerBenefit=25; // 25 per 1000
        daoBenefit=10; // 10 per 1000
        userBenefit=20; // 20 per 1000
        companyBenefit=23; // 23 per 1000... (the rest after giving the tokens to each part)

        //fixed wallets
        nftDeveloper=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // our wallet
        nftDAO=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db; // wallet of the DAO
        nftCompany=0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB; //wallet of our company
        nftUser=0x617F2E2fD72FD9D5503197092aC168c91465E7f2; // wallets for user's giveaways
        owner= msg.sender;//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

    }

    //functions

    function Mint(
        address _NftProvider, 
        string memory _name,
        uint8 _category,
        string memory _product,
        string memory _description,
        uint256 _price, 
        uint256 _secondsToExpire, 
        uint256 _maxCupons
        ) public returns(uint256 _tokenId)
    {
        _tokenId= tokenId;
        nftProvider[_tokenId]=_NftProvider;
        nftEmbasador[_tokenId]=msg.sender; // tokenId -> Address of nftEmbasador
        nftOwner[_tokenId]=_NftProvider; // tokenId -> Address of nftOwner (rename of ownerOf)
        firstSold[_tokenId]=true; // tokenId -> firstSold (identify if it is a first time selling)
        used[_tokenId]=false; // tokenId -> used (identify if it is already used)
        price[_tokenId]=_price; // tokenId -> price (the actual selling price)
        expiration[_tokenId]=block.timestamp+_secondsToExpire;
        categoryToToken[_category].push(_tokenId); //Adding NFT to Array of categories
        _tokenId++;
        tokenId=_tokenId;
        return(_tokenId);
    }

    function SetInSale(uint256 _tokenId, bool _newValue) external onlyNftOwner(_tokenId) returns(bool)
    {
        //Aprove permision to transfer NFT by CMARKETPLACE address
        inSale[_tokenId]=_newValue;
        return(_newValue);
    }

    function setMarketplace(address _newContractAddress) public onlyOwner returns(address)
    {
        marketplace=_newContractAddress;
        return(_newContractAddress);
    }

    function MarkUsed(uint256 _tokenId) external onlyNftOwner(_tokenId) returns(bool _success)
    {
        // It can only be used once
        bool __used=used[_tokenId];
        require(__used==false,"Your NFT has already been used");
        used[_tokenId]=true;

        // We release the vestings associated with this NFT
        iMyTokenContract.nftClaim(nftProvider[_tokenId], _tokenId);
        iMyTokenContract.nftClaim(nftEmbasador[_tokenId], _tokenId);
        iMyTokenContract.nftClaim(nftOwner[_tokenId], _tokenId);
        iMyTokenContract.nftClaim(nftDeveloper, _tokenId);
        iMyTokenContract.nftClaim(nftDAO, _tokenId);
        iMyTokenContract.nftClaim(nftCompany, _tokenId);
        
        _success=true;
        return(_success);
    }


    function getPrice(uint256 _tokenId) public view returns(uint256 _price)
    {
        _price=price[_tokenId];
        return(_price);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable
    {
        // this function is implemented in openzeppelin. Not avaisable to change it. This is only for testing purpose
        require(nftOwner[_tokenId]==_from,"This NFT is not from the person who is trying to sell it");
        nftOwner[_tokenId]=_to; // we change the ownership from _from to _to
        firstSold[_tokenId]=false; // It is no longer the first time for this NFT
    }






}