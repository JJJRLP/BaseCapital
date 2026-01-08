// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IPriceOracle.sol";

/**
 * @title TraderAccount
 * @notice Smart wallet for PropFirm traders - allows DEX trading with firm capital
 * @dev Traders can execute swaps on whitelisted DEXs but cannot withdraw principal
 */
contract TraderAccount is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    address public immutable factory;           // PropFirmFactory that created this
    address public immutable riskManager;       // RiskManager that monitors this
    address public trader;                      // Trader who controls this account
    
    uint256 public initialCapital;              // Starting capital (cannot be withdrawn)
    uint256 public capitalAllocatedAt;          // When capital was seeded
    bool public isActive;                       // Whether account is active
    bool public isLiquidated;                   // Whether account was liquidated
    
    IERC20 public immutable usdc;               // Base asset for accounting
    
    // Whitelisted DEX routers
    mapping(address => bool) public whitelistedRouters;
    
    // Whitelisted tokens (can hold/trade these)
    mapping(address => bool) public whitelistedTokens;
    
    // Track held tokens for equity calculation
    address[] public heldTokens;
    
    // Price oracle for multi-asset valuation
    IPriceOracle public priceOracle;

    // ============ Events ============

    event AccountActivated(address indexed trader, uint256 capital);
    event TradeExecuted(address indexed router, bytes4 selector, bool success);
    event AccountLiquidated(address indexed liquidator, string reason);
    event ProfitWithdrawn(address indexed trader, uint256 amount);
    event TokenWhitelisted(address indexed token, bool status);
    event RouterWhitelisted(address indexed router, bool status);
    event PriceOracleUpdated(address indexed oracle);

    // ============ Errors ============

    error NotFactory();
    error NotTrader();
    error NotRiskManager();
    error NotActive();
    error AlreadyActive();
    error AlreadyLiquidated();
    error RouterNotWhitelisted();
    error InsufficientProfit();
    error ZeroAddress();

    // ============ Modifiers ============

    modifier onlyFactory() {
        if (msg.sender != factory) revert NotFactory();
        _;
    }

    modifier onlyTrader() {
        if (msg.sender != trader) revert NotTrader();
        _;
    }

    modifier onlyRiskManager() {
        if (msg.sender != riskManager) revert NotRiskManager();
        _;
    }

    modifier whenActive() {
        if (!isActive) revert NotActive();
        if (isLiquidated) revert AlreadyLiquidated();
        _;
    }

    // ============ Constructor ============

    /**
     * @param _factory PropFirmFactory address
     * @param _riskManager RiskManager address
     * @param _usdc USDC token address
     */
    constructor(
        address _factory,
        address _riskManager,
        address _usdc
    ) {
        if (_factory == address(0) || _riskManager == address(0) || _usdc == address(0)) {
            revert ZeroAddress();
        }
        
        factory = _factory;
        riskManager = _riskManager;
        usdc = IERC20(_usdc);
        
        // USDC is always whitelisted
        whitelistedTokens[_usdc] = true;
    }

    // ============ Factory Functions ============

    /**
     * @notice Activate account with trader and seed capital
     * @param _trader Trader address who controls this account
     * @param _capital Initial capital amount
     */
    function activate(address _trader, uint256 _capital) external onlyFactory {
        if (isActive) revert AlreadyActive();
        if (_trader == address(0)) revert ZeroAddress();
        
        trader = _trader;
        initialCapital = _capital;
        capitalAllocatedAt = block.timestamp;
        isActive = true;
        
        emit AccountActivated(_trader, _capital);
    }

    /**
     * @notice Add whitelisted router (DEX)
     * @param _router Router address
     * @param _status Whitelist status
     */
    function setRouterWhitelist(address _router, bool _status) external onlyFactory {
        whitelistedRouters[_router] = _status;
        emit RouterWhitelisted(_router, _status);
    }

    /**
     * @notice Add whitelisted token
     * @param _token Token address
     * @param _status Whitelist status
     */
    function setTokenWhitelist(address _token, bool _status) external onlyFactory {
        whitelistedTokens[_token] = _status;
        
        // Track non-USDC tokens for equity calculation
        if (_status && _token != address(usdc)) {
            // Add to heldTokens if not already present
            bool found = false;
            for (uint256 i = 0; i < heldTokens.length; i++) {
                if (heldTokens[i] == _token) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                heldTokens.push(_token);
            }
        }
        
        emit TokenWhitelisted(_token, _status);
    }

    /**
     * @notice Set the price oracle for multi-asset valuation
     * @param _oracle IPriceOracle contract address
     */
    function setPriceOracle(address _oracle) external onlyFactory {
        priceOracle = IPriceOracle(_oracle);
        emit PriceOracleUpdated(_oracle);
    }

    // ============ Trader Functions ============

    /**
     * @notice Execute a swap on a whitelisted DEX
     * @param router Address of the DEX router
     * @param swapData Encoded swap function call
     * @return success Whether the swap succeeded
     */
    function executeSwap(
        address router,
        bytes calldata swapData
    ) external onlyTrader whenActive nonReentrant returns (bool success) {
        if (!whitelistedRouters[router]) revert RouterNotWhitelisted();
        
        // Execute the swap
        (success, ) = router.call(swapData);
        
        // Extract function selector for logging
        bytes4 selector;
        if (swapData.length >= 4) {
            selector = bytes4(swapData[:4]);
        }
        
        emit TradeExecuted(router, selector, success);
        
        return success;
    }

    /**
     * @notice Approve token spending for a whitelisted router
     * @param token Token to approve
     * @param router Router to approve for
     * @param amount Approval amount
     */
    function approveRouter(
        address token,
        address router,
        uint256 amount
    ) external onlyTrader whenActive {
        if (!whitelistedRouters[router]) revert RouterNotWhitelisted();
        if (!whitelistedTokens[token]) revert RouterNotWhitelisted(); // Reusing error
        
        IERC20(token).forceApprove(router, amount);
    }

    /**
     * @notice Withdraw profits (amount above initial capital)
     * @param amount Amount to withdraw
     */
    function withdrawProfit(uint256 amount) external onlyTrader whenActive nonReentrant {
        uint256 currentEquity = getEquity();
        uint256 availableProfit = currentEquity > initialCapital 
            ? currentEquity - initialCapital 
            : 0;
        
        if (amount > availableProfit) revert InsufficientProfit();
        
        usdc.safeTransfer(trader, amount);
        
        emit ProfitWithdrawn(trader, amount);
    }

    // ============ RiskManager Functions ============

    /**
     * @notice Liquidate this account (called by RiskManager on rule violation)
     * @param reason Reason for liquidation
     */
    function liquidate(string calldata reason) external onlyRiskManager {
        isLiquidated = true;
        isActive = false;
        
        // Transfer remaining balance back to factory (treasury)
        uint256 balance = usdc.balanceOf(address(this));
        if (balance > 0) {
            usdc.safeTransfer(factory, balance);
        }
        
        // Also transfer any other whitelisted tokens back
        // This is handled by Treasury.recoverCapital() in production
        
        emit AccountLiquidated(msg.sender, reason);
    }

    // ============ View Functions ============

    /**
     * @notice Get current equity (total value of all holdings in USDC terms)
     * @dev Uses price oracle for multi-asset valuation if available
     */
    function getEquity() public view returns (uint256) {
        // Start with USDC balance
        uint256 totalValue = usdc.balanceOf(address(this));
        
        // If no price oracle, return USDC only
        if (address(priceOracle) == address(0)) {
            return totalValue;
        }
        
        // Add value of other held tokens
        for (uint256 i = 0; i < heldTokens.length; i++) {
            address token = heldTokens[i];
            uint256 balance = IERC20(token).balanceOf(address(this));
            
            if (balance > 0 && priceOracle.hasPriceFeed(token)) {
                try priceOracle.getValueInUSD(token, balance) returns (uint256 value) {
                    totalValue += value;
                } catch {
                    // If oracle fails, skip this token (conservative approach)
                }
            }
        }
        
        return totalValue;
    }

    /**
     * @notice Get current profit/loss
     */
    function getPnL() external view returns (int256) {
        uint256 equity = getEquity();
        return int256(equity) - int256(initialCapital);
    }

    /**
     * @notice Check if account has available profit
     */
    function hasProfit() external view returns (bool) {
        return getEquity() > initialCapital;
    }

    /**
     * @notice Get profit amount available for withdrawal
     */
    function getWithdrawableProfit() external view returns (uint256) {
        uint256 equity = getEquity();
        return equity > initialCapital ? equity - initialCapital : 0;
    }

    /**
     * @notice Get the trader address
     */
    function getTrader() external view returns (address) {
        return trader;
    }

    /**
     * @notice Check if account is active and not liquidated
     */
    function isAccountActive() external view returns (bool) {
        return isActive && !isLiquidated;
    }
}
