// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// https://uniswap.org/docs/v2/smart-contracts

interface IUniswapV2Router {

  function WETH() external pure returns (address);

  function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
  external
  payable
  returns (uint[] memory amounts);
}

