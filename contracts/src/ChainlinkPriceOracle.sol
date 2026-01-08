// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPriceOracle.sol";

/**
 * @title ChainlinkPriceOracle
 * @notice Price oracle implementation using Chainlink price feeds
 * @dev Aggregates Chainlink feeds for multi-asset valuation
 */
contract ChainlinkPriceOracle is IPriceOracle {
    
    // ============ Types ============
    
    struct PriceFeed {
        address feedAddress;    // Chainlink Aggregator address
        uint8 feedDecimals;     // Decimals of the feed (usually 8)
        uint8 tokenDecimals;    // Decimals of the token
        bool isActive;
    }
    
    // ============ State Variables ============
    
    address public owner;
    
    // Token address => Price feed config
    mapping(address => PriceFeed) public priceFeeds;
    
    // USDC is always $1.00 (stablecoin assumption)
    address public immutable usdc;
    
    // Staleness threshold (default: 1 hour)
    uint256 public stalenessThreshold = 3600;
    
    // ============ Events ============
    
    event PriceFeedSet(address indexed token, address feed, uint8 tokenDecimals);
    event PriceFeedRemoved(address indexed token);
    event StalenessThresholdUpdated(uint256 newThreshold);
    
    // ============ Errors ============
    
    error NotOwner();
    error NoPriceFeed();
    error StalePrice();
    error ZeroAddress();
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @param _usdc USDC token address
     */
    constructor(address _usdc) {
        if (_usdc == address(0)) revert ZeroAddress();
        owner = msg.sender;
        usdc = _usdc;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Set price feed for a token
     * @param token Token address
     * @param feed Chainlink Aggregator address
     * @param tokenDecimals Decimals of the token
     */
    function setPriceFeed(
        address token,
        address feed,
        uint8 tokenDecimals
    ) external onlyOwner {
        if (token == address(0) || feed == address(0)) revert ZeroAddress();
        
        // Get feed decimals from Chainlink
        uint8 feedDecimals = IChainlinkAggregator(feed).decimals();
        
        priceFeeds[token] = PriceFeed({
            feedAddress: feed,
            feedDecimals: feedDecimals,
            tokenDecimals: tokenDecimals,
            isActive: true
        });
        
        emit PriceFeedSet(token, feed, tokenDecimals);
    }
    
    /**
     * @notice Remove price feed for a token
     */
    function removePriceFeed(address token) external onlyOwner {
        delete priceFeeds[token];
        emit PriceFeedRemoved(token);
    }
    
    /**
     * @notice Update staleness threshold
     */
    function setStalenessThreshold(uint256 _threshold) external onlyOwner {
        stalenessThreshold = _threshold;
        emit StalenessThresholdUpdated(_threshold);
    }
    
    // ============ IPriceOracle Implementation ============
    
    /**
     * @inheritdoc IPriceOracle
     */
    function getPrice(address token) external view override returns (uint256 price, uint256 timestamp) {
        // USDC is always $1.00
        if (token == usdc) {
            return (1e8, block.timestamp);
        }
        
        PriceFeed memory feed = priceFeeds[token];
        if (!feed.isActive) revert NoPriceFeed();
        
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,
        ) = IChainlinkAggregator(feed.feedAddress).latestRoundData();
        
        // Check staleness
        if (block.timestamp - updatedAt > stalenessThreshold) revert StalePrice();
        
        // Return price (8 decimals standard)
        price = uint256(answer);
        timestamp = updatedAt;
    }
    
    /**
     * @inheritdoc IPriceOracle
     */
    function hasPriceFeed(address token) external view override returns (bool) {
        if (token == usdc) return true;
        return priceFeeds[token].isActive;
    }
    
    /**
     * @inheritdoc IPriceOracle
     */
    function getValueInUSD(address token, uint256 amount) external view override returns (uint256 valueUsd) {
        // USDC is 1:1
        if (token == usdc) {
            return amount;
        }
        
        PriceFeed memory feed = priceFeeds[token];
        if (!feed.isActive) revert NoPriceFeed();
        
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,
        ) = IChainlinkAggregator(feed.feedAddress).latestRoundData();
        
        if (block.timestamp - updatedAt > stalenessThreshold) revert StalePrice();
        
        // Calculate value in USD with 6 decimals (USDC standard)
        // amount * price / 10^(tokenDecimals + feedDecimals - 6)
        uint256 price = uint256(answer);
        uint256 scaleFactor = 10 ** (feed.tokenDecimals + feed.feedDecimals - 6);
        
        valueUsd = (amount * price) / scaleFactor;
    }
}

/**
 * @title IChainlinkAggregator
 * @notice Minimal interface for Chainlink price feeds
 */
interface IChainlinkAggregator {
    function decimals() external view returns (uint8);
    
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
