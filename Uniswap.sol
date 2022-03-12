// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/Uniswap.sol";

contract TestUniswap {
  IUniswapV2Router Router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

  function swap(
    address _tokenIn,
    address _tokenOut,
    uint _amountIn,
    uint _amountOutMin,
    address _to
  ) external {
    IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
    IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);

    address[] memory path;
    if (_tokenIn == WETH || _tokenOut == WETH) {
      path = new address[](2);
      path[0] = _tokenIn;
      path[1] = _tokenOut;
    } else {
      path = new address[](3);
      path[0] = _tokenIn;
      path[1] = WETH;
      path[2] = _tokenOut;
    }

    Router.swapExactTokensForTokens(
      _amountIn,
      _amountOutMin,
      path,
      _to,
      block.timestamp
    );
  }

  function swapEth(uint amountOutMin, address _tokenOut, address to, uint deadline) public {
  
  }
    
}