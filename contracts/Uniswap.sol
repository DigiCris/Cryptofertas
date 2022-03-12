// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/Uniswap.sol";

contract TestUniswap {
  IUniswapV2Router Router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

  function swap(uint amountOutMin, address _tokenOut, address to, uint deadline) public payable {
        address[] memory path = new address[](2);
        path[0] = Router.WETH();
        path[1] = _tokenOut;

        Router.swapExactETHForTokens{value: msg.value}(amountOutMin, path, to, block.timestamp);
    }

    function sendEther(address _to) public payable {
        payable(_to).transfer(msg.value);
    }
    
}