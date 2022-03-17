// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Uniswap.sol";


contract TestParaswap is TestUniswap {
    /// @notice Swap in Paraswap
    /// @param _dataSwap data sent by the paraswap sdk 
    /// @dev  Checks error in paraswap transaction
    function simpleSwapFromPara(bytes calldata _dataSwap) external payable {
        (bool success, bytes memory result) = address(augustus).call{value: msg.value}(abi.encode(_dataSwap));
        if(!success) {
            if (result.length < 68) revert();
            assembly {
                result := add(result, 0x04)
            }
            revert(abi.decode(result, (string)));
        }
    } 
}