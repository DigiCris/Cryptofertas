// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract CVESTING
{
    struct SVESTING
    {
        uint256 timeStamp;
        uint256 amount;
        uint256 tokenId;
    }
    mapping (address => mapping (uint256 => SVESTING)) private sVesting;// address -> NFT_number_in_wallet ->sVesting
    mapping (address => uint256) nftAmount; // keeps the counting of how many NFT this wallet has

    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vestingTime) external returns(bool success)
    {
        uint256 __counter=nftAmount[_to];
        sVesting[_to][__counter].timeStamp= block.timestamp + _vestingTime;
        sVesting[_to][__counter].amount= _amount;
        sVesting[_to][__counter].tokenId= _tokenID;
        nftAmount[_to]++;
        success=true;
        return(success);
    }

    function vestingQuantity(address _of) public view returns (uint256 _vestingQuantity)
    {
        for(uint256 __counter=nftAmount[_of]; __counter>=0; __counter--)
        {
            _vestingQuantity+=sVesting[_of][__counter].amount;
            if(__counter==0)
                break;
        }
        return(_vestingQuantity);
    }

    function getVestingDates(address _of, uint256 _position) external view returns (uint256 _myVesting, uint256 _myTiemstamp)
    {
        _myVesting=sVesting[_of][_position].amount;
        _myTiemstamp=sVesting[_of][_position].timeStamp;
        return(_myVesting, _myTiemstamp);
    }

    function getNftAmount(address _of) public view returns (uint256 _amount)
    {
        _amount=nftAmount[_of];
        return(_amount);
    }

    function claim(uint256 _tokenID) external returns (uint256 _vestingQuantity)
    {
        for(uint256 __counter=nftAmount[msg.sender]; __counter>=0; __counter--)
        {
            if(sVesting[msg.sender][__counter].tokenId==_tokenID)
            {
                if(sVesting[msg.sender][__counter].timeStamp<block.timestamp)
                {
                    sVesting[msg.sender][__counter].amount=0;
                }                
            }
            _vestingQuantity+=sVesting[msg.sender][__counter].amount;
            if(__counter==0)
                break;
        }
        return(_vestingQuantity);
    }

    function nftClaim(address _to, uint256 _tokenID) external returns (uint256 _newAmount)
    {
        for(uint256 __counter=nftAmount[_to]; __counter>=0; __counter--)
        {
            if(sVesting[_to][__counter].tokenId==_tokenID)
            {
                sVesting[_to][__counter].timeStamp=0;  
            }
            else
            {
                _newAmount+=sVesting[_to][__counter].amount;
            }
            if(__counter==0)
                break;
        }
        return(_newAmount);
    }

}