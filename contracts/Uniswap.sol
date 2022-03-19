// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./Interface/IUniswap.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

//contract swaps

contract TestUniswap is Initializable{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address augustus;
    IUniswapV2Router Router;
    address payable public owner;

    event swapWithEtherEvent(uint etherSpent, address[] _tokensOut, uint[] percentagesOfTokensOut, address to);
    event swapWithTokenEvent(address _tokenIn ,address[] _tokensOut, uint _amountIn, uint[] percentagesOfTokensOut, address to);

    /// @notice Constructor of upgradeable function
    /// @dev  Sets UniswapRouter and owner
    function initialize() external initializer {
        Router = IUniswapV2Router(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
        augustus = 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57;
        owner = payable(msg.sender);
    }

    /// @notice Swaps ether for a list of ERC20 tokens in Uniswap with a given percentage
    /// @param _tokensOut array with lists of tokens that to will get
    /// @param percentagesOfTokensOut array with the percentage of ether that we will spend in each token
    /// @param to Address that will get the tokens    
    /// @dev  Use the Uniswap interface of Uniswap to change ether for tokens with the function swapExactETHForTokens
    function swapFromEther(address[] memory _tokensOut, uint[] memory percentagesOfTokensOut, address to) public payable {
        uint sumOfPercentages = 0;

        require(_tokensOut.length == percentagesOfTokensOut.length, "You need an equal amount of addresses and percentages");

        for(uint i = 0; i < percentagesOfTokensOut.length; i++){
            require(percentagesOfTokensOut[i] > 0, "Each percentage has to be bigger than 0");
            sumOfPercentages = sumOfPercentages + percentagesOfTokensOut[i];
        }

        require(sumOfPercentages == 100, "The sum of the percentages is not 100");
        uint fee = msg.value / 1000;
        uint etherAfterFee = msg.value - fee;
        owner.transfer(fee);

        for(uint i = 0; i < percentagesOfTokensOut.length; i++){
            uint valueOfTransaction = (etherAfterFee * percentagesOfTokensOut[i]) / 100;
            address[] memory path = getPathOfEtherAndToken(_tokensOut[i]);       
            Router.swapExactETHForTokens{value: valueOfTransaction}(1, path, to, block.timestamp);
        }

        emit swapWithEtherEvent(msg.value, _tokensOut, percentagesOfTokensOut, to);
    }

    /// @notice Swaps a ERC20 token for a list of ERC20 tokens in Uniswap with a given percentage
    /// @param _tokenIn address of the token that we will swap
    /// @param _tokensOut array with lists of tokens that to will get
    /// @param _amountIn Amount of _tokenIn what we will spend
    /// @param percentagesOfTokensOut array with the percentage of ether that we will spend in each token
    /// @param to Address that will get the tokens    
    /// @dev  Use the Uniswap interface of Uniswap to change an ERC20 tokens for a list of ERC20 tokens with the function swapExactTokensForTokens
    function swapFromToken(address _tokenIn ,address[] memory _tokensOut, uint _amountIn, uint[] memory percentagesOfTokensOut, address to) public payable {
        uint sumOfPercentages = 0;

        require(_tokensOut.length == percentagesOfTokensOut.length, "You need an equal amount of addresses and percentages");

        for(uint i = 0; i < percentagesOfTokensOut.length; i++){
            require(percentagesOfTokensOut[i] > 0, "Each percentage has to be bigger than 0");
            sumOfPercentages = sumOfPercentages + percentagesOfTokensOut[i];
        }

        require(sumOfPercentages == 100, "The sum of the percentages is not 100");
        
        uint fee = _amountIn /1000;
        uint amountOfTokensAfterFee = _amountIn - fee;
        IERC20Upgradeable(_tokenIn).transferFrom(msg.sender, owner, fee);
        IERC20Upgradeable(_tokenIn).transferFrom(msg.sender, address(this), amountOfTokensAfterFee);

        IERC20Upgradeable(_tokenIn).approve(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff, amountOfTokensAfterFee);

        for(uint i = 0; i < percentagesOfTokensOut.length; i++){
            uint valueOfTransaction = (amountOfTokensAfterFee * percentagesOfTokensOut[i]) / 100;
            address[] memory path = getPathOfTokenAndToken(_tokenIn, _tokensOut[i]);       
            Router.swapExactTokensForTokens(valueOfTransaction, 1, path, to, block.timestamp);
        }

        emit swapWithTokenEvent(_tokenIn ,_tokensOut, _amountIn, percentagesOfTokensOut, to);
    }

    /// @notice Get path from ether to a token
    /// @param _tokenOut The token what will be the last element of the path
    /// @dev  Create an array of adresses with the address of Weth and the addres of a given token
    function getPathOfEtherAndToken(address _tokenOut) public view returns(address[] memory){
        address[] memory path = new address[](2);
        path[0] = Router.WETH();
        path[1] = _tokenOut;
        return path;
    }

    /// @notice Get path from ether to a token
    /// @param _tokenIn The token what will be the last element of the path
    /// @param _tokenOut The token what will be the last element of the path
    /// @dev  Create an array of adresses with the address of Weth and the addres of a given token
    function getPathOfTokenAndToken(address _tokenIn, address _tokenOut) public view returns(address[] memory) {
        address[] memory path;
        if (_tokenIn == Router.WETH() || _tokenOut == Router.WETH()) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        }   
        else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = Router.WETH();
            path[2] = _tokenOut;
        }
        return path;
    }
}