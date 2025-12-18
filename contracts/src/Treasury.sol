// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TraderAccount.sol";

/**
 * @title Treasury
 * @notice Manages capital for funded traders and handles profit splits
 * @dev Holds USDC capital pool, seeds trader accounts, and processes payouts
 */
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Types ============

    struct Allocation {
        uint256 principal;          // Amount allocated to trader
        uint256 allocatedAt;        // Timestamp of allocation
        bool isActive;              // Whether allocation is active
    }

    // ============ State Variables ============

    IERC20 public immutable usdc;
    address public factory;             // PropFirmFactory
    address public riskManager;         // RiskManager contract
    
    // Profit split configuration (in basis points, 10000 = 100%)
    uint256 public traderShareBps = 8000;   // 80% to trader
    uint256 public protocolShareBps = 2000; // 20% to protocol
    
    // Capital allocations per trader account
    mapping(address => Allocation) public allocations;
    
    // Plan capital amounts (matching PropFirmFactory plans)
    mapping(uint256 => uint256) public planCapital;
    
    // Totals
    uint256 public totalAllocated;
    uint256 public totalProfitsPaid;
    uint256 public totalRecovered;

    // ============ Events ============

    event CapitalSeeded(address indexed account, uint256 amount);
    event ProfitWithdrawn(address indexed trader, uint256 traderAmount, uint256 protocolAmount);
    event CapitalRecovered(address indexed account, uint256 amount);
    event ProfitShareUpdated(uint256 traderShare, uint256 protocolShare);
    event PlanCapitalUpdated(uint256 planId, uint256 capital);

    // ============ Errors ============

    error NotFactory();
    error NotRiskManager();
    error AllocationExists();
    error NoAllocation();
    error InsufficientBalance();
    error InvalidShares();
    error ZeroAddress();
    error TransferFailed();

    // ============ Modifiers ============

    modifier onlyFactory() {
        if (msg.sender != factory) revert NotFactory();
        _;
    }

    modifier onlyRiskManager() {
        if (msg.sender != riskManager) revert NotRiskManager();
        _;
    }

    // ============ Constructor ============

    /**
     * @param _usdc USDC token address
     */
    constructor(address _usdc) Ownable(msg.sender) {
        if (_usdc == address(0)) revert ZeroAddress();
        usdc = IERC20(_usdc);
        
        // Initialize default plan capital amounts (in USDC, 6 decimals)
        planCapital[1] = 5_000_000000;    // $5,000 for Starter
        planCapital[2] = 25_000_000000;   // $25,000 for Professional
        planCapital[3] = 50_000_000000;   // $50,000 for Executive
    }

    // ============ Admin Functions ============

    /**
     * @notice Set the factory address
     */
    function setFactory(address _factory) external onlyOwner {
        if (_factory == address(0)) revert ZeroAddress();
        factory = _factory;
    }

    /**
     * @notice Set the risk manager address
     */
    function setRiskManager(address _riskManager) external onlyOwner {
        if (_riskManager == address(0)) revert ZeroAddress();
        riskManager = _riskManager;
    }

    /**
     * @notice Update profit share percentages
     * @param _traderShareBps Trader share in basis points (e.g., 8000 = 80%)
     * @param _protocolShareBps Protocol share in basis points
     */
    function setProfitShare(uint256 _traderShareBps, uint256 _protocolShareBps) external onlyOwner {
        if (_traderShareBps + _protocolShareBps != 10000) revert InvalidShares();
        
        traderShareBps = _traderShareBps;
        protocolShareBps = _protocolShareBps;
        
        emit ProfitShareUpdated(_traderShareBps, _protocolShareBps);
    }

    /**
     * @notice Update capital amount for a plan
     */
    function setPlanCapital(uint256 planId, uint256 capital) external onlyOwner {
        planCapital[planId] = capital;
        emit PlanCapitalUpdated(planId, capital);
    }

    /**
     * @notice Withdraw protocol profits to a specified address
     */
    function withdrawProtocolFunds(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        
        uint256 available = getAvailableBalance();
        if (amount > available) revert InsufficientBalance();
        
        usdc.safeTransfer(to, amount);
    }

    /**
     * @notice Emergency withdraw all funds (DANGEROUS - owner only)
     */
    function emergencyWithdraw(address to) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        usdc.safeTransfer(to, usdc.balanceOf(address(this)));
    }

    // ============ Factory Functions ============

    /**
     * @notice Seed a trader account with capital for their plan
     * @param account TraderAccount contract address
     * @param planId Plan ID to determine capital amount
     */
    function seedAccount(address account, uint256 planId) external onlyFactory nonReentrant {
        if (allocations[account].isActive) revert AllocationExists();
        
        uint256 capital = planCapital[planId];
        if (capital == 0) revert InsufficientBalance();
        
        uint256 balance = usdc.balanceOf(address(this));
        if (balance < capital) revert InsufficientBalance();
        
        // Record allocation
        allocations[account] = Allocation({
            principal: capital,
            allocatedAt: block.timestamp,
            isActive: true
        });
        
        totalAllocated += capital;
        
        // Transfer capital to trader account
        usdc.safeTransfer(account, capital);
        
        emit CapitalSeeded(account, capital);
    }

    // ============ RiskManager Functions ============

    /**
     * @notice Recover capital from a liquidated account
     * @param account TraderAccount that was liquidated
     */
    function recoverCapital(address account) external onlyRiskManager nonReentrant {
        Allocation storage alloc = allocations[account];
        if (!alloc.isActive) revert NoAllocation();
        
        // Funds should already have been transferred back to factory/treasury
        // during TraderAccount.liquidate()
        
        uint256 recovered = usdc.balanceOf(address(this)) - getAvailableBalance();
        
        alloc.isActive = false;
        totalRecovered += alloc.principal;
        
        emit CapitalRecovered(account, recovered);
    }

    // ============ Trader Functions ============

    /**
     * @notice Process profit withdrawal with split
     * @param account TraderAccount contract address
     * @param profitAmount Total profit amount to withdraw
     * @dev Called by TraderAccount when trader requests profit
     */
    function processProfitWithdrawal(
        address account,
        uint256 profitAmount
    ) external nonReentrant returns (uint256 traderAmount) {
        Allocation storage alloc = allocations[account];
        if (!alloc.isActive) revert NoAllocation();
        
        TraderAccount traderAccount = TraderAccount(account);
        address trader = traderAccount.getTrader();
        
        // Only trader can request
        require(msg.sender == trader, "Not trader");
        
        // Calculate splits
        traderAmount = (profitAmount * traderShareBps) / 10000;
        uint256 protocolAmount = profitAmount - traderAmount;
        
        // Trader receives their share directly from their account
        // Protocol share comes back to treasury
        // This flow happens through TraderAccount.withdrawProfit()
        
        totalProfitsPaid += profitAmount;
        
        emit ProfitWithdrawn(trader, traderAmount, protocolAmount);
        
        return traderAmount;
    }

    // ============ View Functions ============

    /**
     * @notice Get available balance (not allocated)
     */
    function getAvailableBalance() public view returns (uint256) {
        uint256 balance = usdc.balanceOf(address(this));
        // Note: totalAllocated represents funds already sent to accounts
        return balance;
    }

    /**
     * @notice Get total treasury value
     */
    function getTotalValue() external view returns (uint256) {
        return usdc.balanceOf(address(this)) + totalAllocated - totalRecovered;
    }

    /**
     * @notice Get allocation for an account
     */
    function getAllocation(address account) external view returns (Allocation memory) {
        return allocations[account];
    }

    /**
     * @notice Check if treasury can fund a new allocation
     */
    function canFund(uint256 planId) external view returns (bool) {
        uint256 capital = planCapital[planId];
        return usdc.balanceOf(address(this)) >= capital;
    }

    /**
     * @notice Get capital amount for a plan
     */
    function getCapitalForPlan(uint256 planId) external view returns (uint256) {
        return planCapital[planId];
    }

    /**
     * @notice Get treasury statistics
     */
    function getStats() external view returns (
        uint256 balance,
        uint256 allocated,
        uint256 recovered,
        uint256 profitsPaid
    ) {
        return (
            usdc.balanceOf(address(this)),
            totalAllocated,
            totalRecovered,
            totalProfitsPaid
        );
    }
}
