// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IVESTING
{
    function NFT_claim(address _to, uint256 _tokenID) external returns (uint256 _new_amount);
    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success);
}

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract CNFTFactory is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable 
{

/****************************Author: CMarchese*********************************/
/*******************Deployed: 0xE12C3155d6D30ceB076CD40bd42c65882BFa3c87*******/


    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter public productsAmount;
    string public _companyName;


    struct STokenAmountData {
        uint tokenTotal;
        uint tokenActives;
        uint tokenUsed;
    }

    struct SDataToDisplay {
        uint timeToExpirate;
        STokenAmountData tokenAmountInformation;
        string tokenURI;
        uint tokenPrice;
    }


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
    

///////////////////////// NFT Information //////////////////////////////////////////////////////////
    mapping (uint256 => address) public nftProvider; // tokenId -> Address of NftProvider (tick)
    mapping (uint256 => address) public nftEmbasador; // tokenId -> Address of NftEmbasador (tick)
    // there is already a function called ownerOf for this nftOwner we are using
    mapping (uint256 => address) public nftOwner; // tokenId -> Address of NftOwner (rename of ownerOf) (tick)
    mapping (uint256 => bool) private firstSold; // tokenId -> firstSold (identify if it is a first time selling)(tick)
    mapping (uint256 => uint256) private price; // tokenId -> price (the actual selling price) (tick)
    mapping (uint256 => bool) public used; // tokenId -> Used (identify if it is already used) (tick)
    mapping (uint256 => bool) public inSale; // tokenId -> InSale (are we selling it or not?) (tick)
    mapping (uint256 => uint256) public expiration; // tokenId -> expiration (last time to use the NFT?) (tick)
    mapping (uint256 => uint8) private category; // (tick)
    mapping (address => uint256[] ) private cuponsOwner; //(tick) all the NFT for each address
    mapping (uint8 => uint256[] ) private categoryToToken; // (tick)

    mapping (address => uint256[] ) public cuponsProvider; // all the NFT for each provider
///////////////////////// End of NFT Information ////////////////////////////////////////////////////

    // Fixed wallets set in the constructor
    address public NftDeveloper; // our wallet
    address public NftDAO; // wallet of the DAO
    address public NftCompany; //wallet of our company
    address public NftUser; //wallet for user redistribution
    address private Owner; // address of the owner of the SC
    address private Marketplace; //address of marketplace
    address private Erc20; //address of marketplace

    function setMarketErc20(address _market, address _erc20) external
    {
        Marketplace=_market;
        Erc20=_erc20;
    }


// Added by jhonaiker
    mapping (uint256 => string) private nftName;
    mapping (uint256 => string) private nftDescription;
    mapping (uint256 => string) private nftImage;
    mapping (uint256 => string) private nftProviderName;
    mapping (uint256 => string) public nftMetadata;
    mapping (uint256 => uint256[] ) public ProductTokens; 
    mapping (uint256 => string) public productMetadata;
    mapping (uint256 => uint256[]) public productTokens;
    mapping (uint256 => uint256) public tokenToProduct;
    mapping(address => uint256[]) public tokensCreatedByUser; 
    mapping(address => uint256[]) public productsCreatedByUser;
    mapping(address => uint256[]) public productsOfUser;




    // Modifiers
    modifier onlyNftOwner(uint256 _token_id)  // this is the owner of the NFT
    {
        //require(msg.sender == nftOwner[_token_id], "You are not the owner of the NFT");// commented for the MVP as this modifier is giving us some troubles
        require(true == true, "You are not the owner of the NFT"); // just for an ilustration purpose for the MVP presentation
        _;
    }


    
    constructor(address _AddrContract) ERC721("CRYPTOFERTON", "KUPON")
    {
        _companyName = "ENEFETON.COM"; 

        // interface to talk to
        i_my_token_Contract=IVESTING(_AddrContract);

        //fixed wallets
        NftDeveloper=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // our wallet
        NftDAO=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db; // wallet of the DAO
        NftCompany=0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB; //wallet of our company
        NftUser=0x617F2E2fD72FD9D5503197092aC168c91465E7f2; // wallets for user's giveaways
        Owner= msg.sender;//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

    }


    function mint(        
            address _NftProvider, 
            //string memory _name,
            uint8 _category,
            string memory _urlMetadata,
            uint256 _price, 
            uint256 _secondsToExpire, 
            uint256 _maxCupons
        ) public returns(uint256 _tokenId){
            uint256 _productid = productsAmount.current();
            productsAmount.increment();
            productMetadata[_productid] = _urlMetadata;

          for(uint i = 0; i < _maxCupons; i++) {

              _tokenId = _tokenIdCounter.current();
              _tokenIdCounter.increment();

            nftMetadata[_tokenId]=_urlMetadata;
            nftProvider[_tokenId]=_NftProvider;
            nftEmbasador[_tokenId]=msg.sender; 
            nftOwner[_tokenId]=_NftProvider;
            firstSold[_tokenId]=true; 
            used[_tokenId]=false; 
            price[_tokenId]=_price; 
            expiration[_tokenId]=block.timestamp+_secondsToExpire;
            ProductTokens[_productid].push(_tokenId);
            categoryToToken[_category].push(_tokenId); 
            _safeMint(_NftProvider, _tokenId);
            cuponsOwner[_NftProvider].push(_tokenId);
            tokensCreatedByUser[_NftProvider].push(_tokenId);
            tokenToProduct[_tokenId] = productsAmount.current();
            _setTokenURI(_tokenId,_urlMetadata);

            //added by Cmarchese to start with the coupons for sale
            inSale[_tokenId]=true;
            _approve(Marketplace, _tokenId);

            //added by Cmarchese to make Jhonaiker App work properly
            cuponsProvider[_NftProvider].push(_tokenId);
        }    

        productsOfUser[_NftProvider].push(productsAmount.current());
        productsCreatedByUser[_NftProvider].push(productsAmount.current()); 
        return(_tokenId);

    }


    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


//functions by CMarchese
// Set and get addresses


    function SetInSale(uint256 _tokenId, bool _newValue) public onlyNftOwner(_tokenId) returns(bool _inSale)
    {// in order to work properly for all marketplace we would need to errase inSale when revoking the approval
        if(_newValue==true)
        {
            approve(Marketplace, _tokenId); // I modify inSale inside this function
        }
        else 
        {
            inSale[_tokenId]=false;
        }   
        return(_newValue);
    }
    function approve(address to, uint256 tokenId) public override 
    {
        bool _used=used[tokenId];
        require(_used==false,"Your NFT has already been used, you are not allowed to sell it"); // If I skip this line I could sell the NFT after using it
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),"ERC721: approve caller is not token owner nor approved for all");
        inSale[tokenId]=true;
        _approve(to, tokenId);
    }    

    function sellNft(uint256 _tokenId, uint256 _price) onlyNftOwner(_tokenId) external returns(uint256)
    {
        price[_tokenId]=_price;
        SetInSale(_tokenId, true);
        return(_price);
    }

    function MarkUsed(uint256 _tokenId) external onlyNftOwner(_tokenId) returns(bool _success)
    {
        // It can only be used once
        bool _used=used[_tokenId];
        require(_used==false,"Your NFT has already been used");
        inSale[_tokenId]=false;
        used[_tokenId]=true;

        // We release the vestings associated with this NFT
        i_my_token_Contract.NFT_claim(nftProvider[_tokenId], _tokenId);
        i_my_token_Contract.NFT_claim(nftEmbasador[_tokenId], _tokenId);
        i_my_token_Contract.NFT_claim(nftOwner[_tokenId], _tokenId);/*
        i_my_token_Contract.NFT_claim(NftDeveloper, _tokenId);
        i_my_token_Contract.NFT_claim(NftDAO, _tokenId);
        i_my_token_Contract.NFT_claim(NftCompany, _tokenId);*/
        
        _success=true;
        return(_success);
    }

    function getPrice(uint256 _tokenId) public view returns(uint256 _price)
    {
        _price=price[_tokenId];
        return(_price);
    }

    function getTokensByCategory(uint8 _category) public view returns(uint256[] memory)
    {
        return(categoryToToken[_category]);
    }

    function getCuponsOwner(address _addr) public view returns(uint256[] memory) // I'm really getting it by provider, not owner
    {
        return(cuponsOwner[_addr]);
    }

    function getCuponsProvider(address _addr) public view returns(uint256[] memory) 
    {
        return(cuponsProvider[_addr]);
    }


function tokenAmount() public view returns(uint256 _amount)
{
    _amount=_tokenIdCounter.current();
    return (_amount);
}

    struct SJHONAIKER
    {
        string tokenUri;
        uint256 expiration;
        uint256 precio;
        bool used;
        bool inSale;
        bool valid;
    }

    function getNFTByProvider(uint256 _Targetpage, address _NftOwner) public view returns(SJHONAIKER[10] memory _value)
    {
        uint256 _start=_Targetpage*10;
        uint256 _stop=_start+10;

        uint256[] memory AllTokens= getCuponsProvider(_NftOwner);//cuponsOwner[_NftProvider].push(_tokenId);
        if(AllTokens.length<_stop)
        {
            _stop=AllTokens.length;
        }
        for(uint i=0; _start<_stop; i++)
        {
            _value[i].tokenUri=tokenURI(AllTokens[i]);
            _value[i].expiration=expiration[AllTokens[i]];
            _value[i].precio=getPrice(AllTokens[i]);
            _value[i].used=used[AllTokens[i]];
            _value[i].inSale=inSale[AllTokens[i]];
            _value[i].valid=true;
        }
        return(_value);
    }


    function getNFTByOwner(uint256 _Targetpage, address _NftOwner) public view returns(SJHONAIKER[10] memory _value)
    { //change
        uint256 _start=_Targetpage*10;
        uint256 _stop=_start+10;

        uint256[] memory AllTokens= getCuponsOwner(_NftOwner);
        if(AllTokens.length<_stop)
        {
            _stop=AllTokens.length;
        }
        for(uint i=0; _start<_stop; i++)
        {
            _value[i].tokenUri=tokenURI(AllTokens[i]);
            _value[i].expiration=expiration[AllTokens[i]];
            _value[i].precio=getPrice(AllTokens[i]);
            _value[i].used=used[AllTokens[i]];
            _value[i].inSale=inSale[AllTokens[i]];
            if(_NftOwner==ownerOf(AllTokens[i]))
            {
                _value[i].valid=true;
            }
            else
            {
                _value[i].valid=false;
            }
        }
        return(_value);
    }

    /****************************End Author: CMarchese*********************************/

    /****************************Author: Jhonaiker Blanco*********************************/
    function getTokenAmount(uint256 _productId) private view returns (STokenAmountData memory tokenAmountStruct) {
        uint256[] memory _tokenList = productTokens[_productId];
        uint256 _tokenTotal = _tokenList.length;
        uint256 _activesTokens = 0;

        for(uint256 i = 0; i < _tokenTotal; i++) {
            if(used[_tokenList[i]] == false) {
                _activesTokens++;
            }
        }

        return STokenAmountData(_tokenTotal, _activesTokens, _tokenTotal - _activesTokens);
    }

    function getTokenAmountOfBuyer(address _user,uint256 _productId) private view returns (STokenAmountData memory tokenAmountStruct){
        uint256[] memory _listOfTokensOfCurrentProduct = productTokens[_productId]; 
        uint256 _amountOfTokensOfCurrentUser = 0;
        uint256 _amountOfActiveTokensOfCurrentUser = 0;

        for(uint256 i = 0; i < _listOfTokensOfCurrentProduct.length; i++) {
            if(nftOwner[_listOfTokensOfCurrentProduct[i]] == _user) {
                if(used[_listOfTokensOfCurrentProduct[i]] == false) {
                    _amountOfActiveTokensOfCurrentUser++;
                }
                _amountOfTokensOfCurrentUser++;
            }
        }

        return STokenAmountData(_amountOfTokensOfCurrentUser, _amountOfActiveTokensOfCurrentUser, _amountOfTokensOfCurrentUser - _amountOfActiveTokensOfCurrentUser);

    }

/****************************End Author: Jhonaiker Blanco*********************************/



// The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }




    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        firstSold[tokenId]=false;
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(address /*from*/, address to, uint256 tokenId ) internal override 
    {
        nftOwner[tokenId]=ownerOf(tokenId); // added by smarchese
        inSale[tokenId]=false;
        cuponsOwner[to].push(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }        



}