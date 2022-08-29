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
    mapping (address => uint256) NftAmount; // keeps the counting of how many NFT this wallet has

    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenID, uint256 _vesting_time) external returns(bool success)
    {
        uint256 __counter=NftAmount[_to];
        sVesting[_to][__counter].timeStamp= block.timestamp + _vesting_time;
        sVesting[_to][__counter].amount= _amount;
        sVesting[_to][__counter].tokenId= _tokenID;
        NftAmount[_to]++;
        success=true;
        return(success);
    }

    function vestingQuantity(address _of) public view returns (uint256 _vesting_quantity)
    {
        for(uint256 __counter=NftAmount[_of]; __counter>=0; __counter--)
        {
            _vesting_quantity+=sVesting[_of][__counter].amount;
            if(__counter==0)
                break;
        }
        return(_vesting_quantity);
    }

    function getVestingDates(address _of, uint256 _position) external view returns (uint256 _myVesting, uint256 _myTiemstamp)
    {
        _myVesting=sVesting[_of][_position].amount;
        _myTiemstamp=sVesting[_of][_position].timeStamp;
        return(_myVesting, _myTiemstamp);
    }

    function getNftAmount(address _of) public view returns (uint256 _amount)
    {
        _amount=NftAmount[_of];
        return(_amount);
    }

    function claim(uint256 _tokenID) external returns (uint256 _vesting_quantity)
    {
        for(uint256 __counter=NftAmount[msg.sender]; __counter>=0; __counter--)
        {
            if(sVesting[msg.sender][__counter].tokenId==_tokenID)
            {
                if(sVesting[msg.sender][__counter].timeStamp<block.timestamp)
                {
                    sVesting[msg.sender][__counter].amount=0;
                }                
            }
            _vesting_quantity+=sVesting[msg.sender][__counter].amount;
            if(__counter==0)
                break;
        }
        return(_vesting_quantity);
    }

    function NFT_claim(address _to, uint256 _tokenID) external returns (uint256 _new_amount)
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

}