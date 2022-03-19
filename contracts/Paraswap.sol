// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Uniswap.sol";
import "hardhat/console.sol";

contract TestParaswap is TestUniswap {

    /// @notice Swaps in Paraswap using a low level call
    /// @param datas array of data from the paraswap sdk
    /// @param tokens Address of tokens that the user will get   
    /// @dev  Use a low level call to swap tokens from paraswap
    function swapFromPara(bytes[] calldata datas, address[] calldata tokens) public payable {
        require(datas.length == tokens.length, "datas and tokens must have the same size");

        for(uint i = 0; i < datas.length; i++){
        
            (bool success, bytes memory returnData) = augustus.call{value: msg.value / tokens.length}(datas[i]);

            if(!success) {
                if(returnData.length < 68) revert();
                assembly {
                    returnData := add(returnData, 0x04)
                }
                revert(abi.decode(returnData, (string)));
            }

        uint received = abi.decode(returnData, (uint));
        assert(received > 0);

			console.log("Tokens received", received);
			console.log("Balance", IERC20Upgradeable(tokens[i]).balanceOf(address(this)));

			uint256 fee = (received) / 1000;
			console.log("Fees", fee);

			// Charge fees

			if (fee > 0) {
				IERC20Upgradeable(tokens[i]).transfer(owner, fee);    
			}
			// Send back tokens to user
			IERC20Upgradeable(tokens[i]).transfer(msg.sender, received - fee);       

        }
    } 
}