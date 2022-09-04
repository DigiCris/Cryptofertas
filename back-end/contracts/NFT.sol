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
    mapping (uint256 => uint256[] ) public ProductTokens; 
    
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
            productsAmount.increment();
            uint256 _productid = productsAmount.current();
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
            ProductTokens[_productid].push(_tokenId);
            categoryToToken[_category].push(_tokenId); 
            _safeMint(_NftProvider, _tokenId);
            _setTokenURI(_tokenId,_urlMetadata);
            cuponsOwner[_NftProvider].push(_tokenId);
        }    

    }


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

        



}