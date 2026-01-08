// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPriceOracle
 * @notice Interface for price oracle integration
 * @dev Supports Chainlink, Pyth, or custom price feeds
 */
interface IPriceOracle {
    /**
     * @notice Get the latest price for a token in USD
     * @param token Address of the token
     * @return price Price in USD with 8 decimals
     * @return timestamp Last update timestamp
     */
    function getPrice(address token) external view returns (uint256 price, uint256 timestamp);
    
    /**
     * @notice Check if price feed is available for a token
     * @param token Address of the token
     * @return True if price feed exists
     */
    function hasPriceFeed(address token) external view returns (bool);
    
    /**
     * @notice Get the value of token amount in USD
     * @param token Address of the token
     * @param amount Amount of tokens (in token decimals)
     * @return valueUsd Value in USD with 6 decimals (USDC standard)
     */
    function getValueInUSD(address token, uint256 amount) external view returns (uint256 valueUsd);
}
