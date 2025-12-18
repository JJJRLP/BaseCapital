// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TraderAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TraderAccountFactory
 * @notice Factory for deploying TraderAccount smart wallets
 * @dev Called by PropFirmFactory when trader reaches Funded stage
 */
contract TraderAccountFactory is Ownable {
    
    // ============ State Variables ============
    
    address public immutable riskManager;
    address public immutable usdc;
    
    // Whitelisted DEX routers to set on new accounts
    address[] public defaultRouters;
    
    // Whitelisted tokens to set on new accounts
    address[] public defaultTokens;
    
    // Deployed accounts
    mapping(address => address) public traderToAccount;
    address[] public allAccounts;

    // ============ Events ============

    event AccountCreated(address indexed account, address indexed trader);
    event RouterAdded(address indexed router);
    event RouterRemoved(address indexed router);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);

    // ============ Errors ============

    error AccountExists();
    error ZeroAddress();

    // ============ Constructor ============

    /**
     * @param _riskManager RiskManager contract address
     * @param _usdc USDC token address
     */
    constructor(
        address _riskManager,
        address _usdc
    ) Ownable(msg.sender) {
        if (_riskManager == address(0) || _usdc == address(0)) {
            revert ZeroAddress();
        }
        
        riskManager = _riskManager;
        usdc = _usdc;
        
        // Add USDC to default tokens
        defaultTokens.push(_usdc);
    }

    // ============ Admin Functions ============

    /**
     * @notice Add a router to the default whitelist
     */
    function addDefaultRouter(address router) external onlyOwner {
        defaultRouters.push(router);
        emit RouterAdded(router);
    }

    /**
     * @notice Add a token to the default whitelist
     */
    function addDefaultToken(address token) external onlyOwner {
        defaultTokens.push(token);
        emit TokenAdded(token);
    }

    // ============ Factory Functions ============

    /**
     * @notice Create a new TraderAccount for a funded trader
     * @param trader Address of the trader
     * @return account Address of the new TraderAccount
     */
    function createAccount(address trader) external returns (address account) {
        if (traderToAccount[trader] != address(0)) revert AccountExists();
        if (trader == address(0)) revert ZeroAddress();
        
        // Deploy new TraderAccount
        TraderAccount newAccount = new TraderAccount(
            msg.sender,     // Factory (PropFirmFactory) is the owner
            riskManager,
            usdc
        );
        
        account = address(newAccount);
        
        // Set default whitelists
        for (uint256 i = 0; i < defaultRouters.length; i++) {
            newAccount.setRouterWhitelist(defaultRouters[i], true);
        }
        
        for (uint256 i = 0; i < defaultTokens.length; i++) {
            newAccount.setTokenWhitelist(defaultTokens[i], true);
        }
        
        // Track
        traderToAccount[trader] = account;
        allAccounts.push(account);
        
        emit AccountCreated(account, trader);
        
        return account;
    }

    // ============ View Functions ============

    /**
     * @notice Get account for a trader
     */
    function getAccount(address trader) external view returns (address) {
        return traderToAccount[trader];
    }

    /**
     * @notice Get total number of accounts created
     */
    function getAccountCount() external view returns (uint256) {
        return allAccounts.length;
    }

    /**
     * @notice Get all accounts
     */
    function getAllAccounts() external view returns (address[] memory) {
        return allAccounts;
    }

    /**
     * @notice Get default routers
     */
    function getDefaultRouters() external view returns (address[] memory) {
        return defaultRouters;
    }

    /**
     * @notice Get default tokens
     */
    function getDefaultTokens() external view returns (address[] memory) {
        return defaultTokens;
    }
}
