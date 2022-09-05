// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


//deployed at= 0x0922FB4007946e3838A07483eFDe991480c982fD
contract Doloferta is ERC20, ERC20Burnable, Pausable, AccessControl 
{

    /****************************CMarchese*********************************/

    // Fixed wallets set in the constructor
    address private NftDeveloper; // our wallet
    address private NftDAO; // wallet of the DAO
    address private NftCompany; //wallet of our company
    address private NftUser; //wallet for user redistribution

    address private Marketplace; //address of marketplace
    address private NftFactory; //address of marketplace


// modifiers
    modifier onlyMarketplace() 
    {
        require(msg.sender==Marketplace,"Your are not the marketplace");
        _;
    }
    modifier onlyNftFactory() 
    {
        require(msg.sender==NftFactory,"Your are not the NFT Factory");
        _;
    }

// Set and get addresses
    function setNftUserAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
       NftUser=_which;
    } 
    function setNftCompanyAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
       NftCompany=_which;
    } 
    function setNftDAOAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
       NftDAO=_which;
    } 
    function setNftDeveloperAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
       NftDeveloper=_which;
    } 
    function setMarketplaceAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Marketplace=_which;
    }    
    function setNftFactoryAddresses(address _which) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        NftFactory=_which;
    }

    function getNftUserAddresses() external view returns(address _which)
    {
       _which=NftUser;
    } 
    function getNftCompanyAddresses() external view returns(address _which)
    {
       _which=NftCompany;
    } 
    function getNftDAOAddresses() external view returns(address _which)
    {
       _which=NftDAO;
    } 
    function getNftDeveloperAddresses() external view returns(address _which)
    {
       _which=NftDeveloper;
    } 
    function getMarketplaceAddresses() external view returns(address _which)
    {
        _which=Marketplace;
    }    
    function getNftFactoryAddresses() external view returns(address _which)
    {
        _which=NftFactory;
    }



    struct SVESTING
    {
        uint256 timeStamp;
        uint256 amount;
        uint256 tokenId;
    }
    mapping (address => mapping (uint256 => SVESTING)) private sVesting;// address -> NFT_number_in_wallet ->sVesting
    mapping (address => uint256) private NftAmount; // keeps the counting of how many NFT this wallet has

    function mintWithVesting(address _to,uint256 _amount, uint256 _tokenId, uint256 _vestingTime) external returns(bool _success)
    {
        uint256 __counter=NftAmount[_to];
        sVesting[_to][__counter].timeStamp= block.timestamp + _vestingTime;
        sVesting[_to][__counter].amount= _amount;
        sVesting[_to][__counter].tokenId= _tokenId;
        NftAmount[_to]++;
        mint(_to, _amount); // give minting permision to the smart contract that will do this inting
        _success=true;
        return(_success);
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
        set_allowances( msg.sender, NftCompany, _vesting_quantity);
        return(_vesting_quantity);
    }

    function NFT_claim(address _to, uint256 _tokenID) external onlyNftFactory()  returns (uint256 _new_amount)
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


    function approve(address spender, uint256 amount) public override returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        if( vestingQuantity(owner) < allowance(owner,NftCompany) )
        {
            set_allowances( owner, NftCompany, vestingQuantity(owner));
        }
        return true;
    }
    function transfer(address to, uint256 amount) public override returns (bool) 
    { // we can check if we can use the hooks instead
        address owner = _msgSender();
        require( balanceOf(owner) > ( amount + vestingQuantity(owner) ), "You don't have enaugh tokens available for this transaction" );
        _transfer(owner, to, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) 
    {// we can check if we can use the hooks instead
        address spender = _msgSender();

        if(msg.sender!=NftCompany)
        { 
            require( balanceOf(from) > ( amount + vestingQuantity(from) ), "You don't have enaugh tokens available for this transaction" );
             _spendAllowance(from, spender, amount);
            _transfer(from, to, amount); 
        } else
        {
            _spendAllowance(from, spender, amount);
            _transfer(from, to, amount);            
        }
        return true;
    }

    /****************************Openzeppelin*********************************/
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Doloferta", "USDO") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        //fixed wallets by CMarchese
        NftDeveloper=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; // our wallet
        NftDAO=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db; // wallet of the DAO
        NftCompany=0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB; //wallet of our company
        NftUser=0x617F2E2fD72FD9D5503197092aC168c91465E7f2; // wallets for user's giveaways
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}