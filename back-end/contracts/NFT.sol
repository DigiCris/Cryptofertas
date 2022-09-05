// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity >=0.7.0 <0.9.0;

contract CNFTFactory is ERC721, ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter public tokenAmount;
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

    mapping (address => uint256[] ) private cuponsOwner;
    mapping (uint256 => address) private nftProvider; 
    mapping (uint256 => address) private nftEmbasador;
    mapping (uint256 => address) private nftOwner; 
    mapping (uint256 => bool) private firstSold; 
    mapping (uint256 => uint256) private nftPrice; 
    mapping (uint256 => uint8) private nftCategory; 
    mapping (uint256 => bool) private isNftUsed; 
    mapping (uint256 => bool) private inSale; 
    mapping (uint256 => uint256) private nftExpiration; 
    mapping (uint8 => uint256[] ) private categoryToToken; 
    mapping (uint256 => string) private nftName;
    mapping (uint256 => string) private nftDescription;
    mapping (uint256 => string) private nftImage;
    mapping (uint256 => string) private nftProviderName;
    
    mapping (uint256 => string) public nftMetadata;

    mapping (uint256 => string) public productMetadata;
    mapping (uint256 => uint256[]) public productTokens;
    mapping (uint256 => uint256) public tokenToProduct;
    mapping(address => uint256[]) public tokensCreatedByUser; 
    mapping(address => uint256[]) public productsCreatedByUser;
    mapping(address => uint256[]) public productsOfUser;

    
    constructor() ERC721("Token", "TOK"){
        _companyName = "ENEFETON.COM";    
    }

    function mint(        
            address _NftProvider, 
            //string memory _name,
            uint8 _category,
            string memory _urlMetadata,
            uint256 _price, 
            uint256 _secondsToExpire, 
            uint256 _maxCupons
        ) public {
            uint256 _productid = productsAmount.current();
            productsAmount.increment();
            productMetadata[_productid] = _urlMetadata;
          for(uint i = 0; i < _maxCupons; i++) {
            tokenAmount.increment();
            uint256 _tokenId = tokenAmount.current();
            nftMetadata[_tokenId]=_urlMetadata;
            nftProvider[_tokenId]=_NftProvider;
            nftEmbasador[_tokenId]=msg.sender; 
            nftOwner[_tokenId]=_NftProvider;
            firstSold[_tokenId]=true; 
            isNftUsed[_tokenId]=false; 
            nftPrice[_tokenId]=_price; 
            nftExpiration[_tokenId]=block.timestamp+_secondsToExpire;
            productTokens[_productid].push(_tokenId);
            categoryToToken[_category].push(_tokenId); 
            _safeMint(_NftProvider, _tokenId);
            cuponsOwner[_NftProvider].push(_tokenId);
            tokensCreatedByUser[_NftProvider].push(_tokenId);
            tokenToProduct[_tokenId] = productsAmount.current();
        }   
 
        productsOfUser[_NftProvider].push(productsAmount.current());
        productsCreatedByUser[_NftProvider].push(productsAmount.current()); 
    }

    function getTokenAmount(uint productId) private view returns (STokenAmountData memory tokenAmountStruct) {
        uint[] memory tokenList = productTokens[productId];
        uint tokenTotal = tokenList.length;
        uint activesTokens = 0;

        for(uint i = 0; i < tokenTotal; i++) {
            if(isNftUsed[tokenList[i]] == false) {
                activesTokens++;
            }
        }

        return STokenAmountData(tokenTotal, activesTokens, tokenTotal - activesTokens);
    }

    function getTokenAmountOfBuyer(address _user,uint productId) private view returns (STokenAmountData memory tokenAmountStruct){
        uint[] memory listOfTokensOfCurrentProduct = productTokens[productId]; 
        uint amountOfTokensOfCurrentUser = 0;
        uint amountOfActiveTokensOfCurrentUser = 0;

        for(uint i = 0; i < listOfTokensOfCurrentProduct.length; i++) {
            if(nftOwner[listOfTokensOfCurrentProduct[i]] == _user) {
                if(isNftUsed[listOfTokensOfCurrentProduct[i]] == false) {
                    amountOfActiveTokensOfCurrentUser++;
                }
                amountOfTokensOfCurrentUser++;
            }
        }

        return STokenAmountData(amountOfTokensOfCurrentUser, amountOfActiveTokensOfCurrentUser, amountOfTokensOfCurrentUser - amountOfActiveTokensOfCurrentUser);

    }

    function getDataToDisplayForOwner(address _user) public view returns(SDataToDisplay[] memory result){
        uint[] memory listOfProductsOfCurrentUser = productsOfUser[_user];
        SDataToDisplay[] memory data = new SDataToDisplay[](listOfProductsOfCurrentUser.length);

        for(uint i = 0; i < listOfProductsOfCurrentUser.length; i++){
            uint timeToExpirate = getTimeToExpirationOfProduct(listOfProductsOfCurrentUser[i]);
            STokenAmountData memory tokenAmountData = getTokenAmountOfBuyer(_user, listOfProductsOfCurrentUser[i]);
            string memory productURI = getTokenURIOfProduct(listOfProductsOfCurrentUser[i]);
            uint productPrice = getProductPrice(listOfProductsOfCurrentUser[i]);
            data[i] = SDataToDisplay(timeToExpirate, tokenAmountData, productURI, productPrice);
        }

        return data;
    }    

    function getDataToDisplayForCreator(address _user) public view returns(SDataToDisplay[] memory result){
        uint256[] memory userProducts = productsCreatedByUser[_user];
       SDataToDisplay[] memory data = new SDataToDisplay[](userProducts.length);

       for(uint i = 0; i < userProducts.length; i++) {
           uint256 timeToExpirate = getTimeToExpirationOfProduct(userProducts[i]);
           STokenAmountData memory tokenAmountData = getTokenAmount(userProducts[i]);
           string memory productURI = getTokenURIOfProduct(userProducts[i]);
           uint productPrice = getProductPrice(userProducts[i]);

           data[i] = SDataToDisplay(timeToExpirate, tokenAmountData, productURI, productPrice);

       }

       return data;
    }

    function getTimeToExpirationOfProduct(uint256 productId) private view returns (uint256 result) {
        uint[] memory tokenList = productTokens[productId];
        uint256 firstToken = tokenList[0];
        uint256 expirationOfCurrentToken = nftExpiration[firstToken];
        uint256 timeToExpiration = 0;

        if(expirationOfCurrentToken > block.timestamp) {
            timeToExpiration = expirationOfCurrentToken - block.timestamp;
        }

        return timeToExpiration;

    }

    function getTokenURIOfProduct(uint productId) private view returns (string memory result) {
        uint[] memory tokenList = productTokens[productId];
        uint firstToken = tokenList[0];

        return nftMetadata[firstToken];
    }

    function checkIfNumberAlreadyIsInArray(uint[] memory arrayOfNumber, uint newNumberToArray) private pure returns(bool) {
        bool result = false;
        for(uint i = 0; i < arrayOfNumber.length; i++) {
            if(arrayOfNumber[i] == newNumberToArray){
                result = true;
                break;
            }
        }

        return result;
    }

    function useToken(uint tokenId) public {
        isNftUsed[tokenId] = true;
    }

    function getProductPrice (uint productId) private view returns (uint result) {
        uint[] memory tokenList = productTokens[productId];
        uint firstToken = tokenList[0];

        return nftPrice[firstToken];        
    }


// The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    

    function tokenURI(uint256 tokenId)
        public
        view

        override
        returns (string memory)
    {
        return nftMetadata[tokenId];
    }


}

