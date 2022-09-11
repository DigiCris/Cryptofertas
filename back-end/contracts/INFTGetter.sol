// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface INFTGetter {

    function tokenURI(uint _id) external view returns (string memory);

    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);

    function balanceOf(address _owner) external view returns(uint256 balance);

    function getCuponsProvider(address _user) external view returns(uint256[] memory);

    function getPrice(uint256 _tokenId) external view returns(uint256);

    function expiration(uint _tokenId) external view returns(uint256);

    function used(uint _tokenId) external view returns(bool);

}