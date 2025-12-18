// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TraderAccount.sol";

/**
 * @title RiskManager
 * @notice Monitors trader accounts and enforces PropFirm rules on-chain
 * @dev Implements Chainlink Automation compatible interface for keeper integration
 */
contract RiskManager is Ownable, ReentrancyGuard {

    // ============ Types ============

    enum Stage {
        None,           // 0: Not registered
        Challenge,      // 1: Challenge phase
        Verification,   // 2: Verification phase
        Funded          // 3: Funded trader
    }

    enum Status {
        Active,         // Trading normally
        Passed,         // Met profit target
        Failed          // Violated rules
    }

    struct TraderState {
        address accountContract;    // TraderAccount address
        uint256 initialBalance;     // Starting capital
        uint256 dailyStartingEquity;// Equity at start of day (for daily loss)
        uint256 lastDayReset;       // Timestamp of last daily reset
        Stage stage;                // Current stage
        uint8 tradingDays;          // Number of unique trading days
        bool isActive;              // Is currently being monitored
    }

    struct StageRules {
        uint256 profitTargetBps;    // Profit target in basis points (800 = 8%)
        uint256 maxDailyLossBps;    // Max daily loss in basis points (500 = 5%)
        uint256 maxTotalLossBps;    // Max total loss in basis points (800 = 8%)
        uint8 minTradingDays;       // Minimum trading days required
    }

    // ============ State Variables ============

    mapping(address => TraderState) public traderStates;
    address[] public activeTraders;
    mapping(address => uint256) public traderIndex; // For efficient removal
    
    // Rules per stage
    mapping(Stage => StageRules) public stageRules;
    
    // PropFirmFactory reference
    address public factory;

    // ============ Events ============

    event TraderRegistered(address indexed account, address indexed trader, Stage stage);
    event TraderStatusChecked(address indexed account, Status status, uint256 equity);
    event TraderLiquidated(address indexed account, string reason);
    event TraderUpgraded(address indexed account, Stage from, Stage to);
    event DailyReset(address indexed account, uint256 newDailyEquity);
    event RulesUpdated(Stage stage, uint256 profitTarget, uint256 dailyLoss, uint256 totalLoss);

    // ============ Errors ============

    error NotFactory();
    error TraderNotActive();
    error AlreadyRegistered();
    error InvalidStage();
    error ZeroAddress();

    // ============ Modifiers ============

    modifier onlyFactory() {
        if (msg.sender != factory) revert NotFactory();
        _;
    }

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {
        // Initialize default rules matching prop-firm-logic.ts
        
        // Challenge: 8% profit, 5% daily loss, 8% total loss, 5 days
        stageRules[Stage.Challenge] = StageRules({
            profitTargetBps: 800,
            maxDailyLossBps: 500,
            maxTotalLossBps: 800,
            minTradingDays: 5
        });
        
        // Verification: 5% profit, 5% daily loss, 8% total loss, 5 days
        stageRules[Stage.Verification] = StageRules({
            profitTargetBps: 500,
            maxDailyLossBps: 500,
            maxTotalLossBps: 800,
            minTradingDays: 5
        });
        
        // Funded: No profit target, 5% daily loss, 8% total loss, 0 days
        stageRules[Stage.Funded] = StageRules({
            profitTargetBps: 0,
            maxDailyLossBps: 500,
            maxTotalLossBps: 800,
            minTradingDays: 0
        });
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
     * @notice Update rules for a stage
     */
    function updateRules(
        Stage stage,
        uint256 profitTargetBps,
        uint256 maxDailyLossBps,
        uint256 maxTotalLossBps,
        uint8 minTradingDays
    ) external onlyOwner {
        if (stage == Stage.None) revert InvalidStage();
        
        stageRules[stage] = StageRules({
            profitTargetBps: profitTargetBps,
            maxDailyLossBps: maxDailyLossBps,
            maxTotalLossBps: maxTotalLossBps,
            minTradingDays: minTradingDays
        });
        
        emit RulesUpdated(stage, profitTargetBps, maxDailyLossBps, maxTotalLossBps);
    }

    // ============ Factory Functions ============

    /**
     * @notice Register a new trader account for monitoring
     * @param account TraderAccount contract address
     * @param initialBalance Starting capital
     * @param stage Initial stage (usually Challenge)
     */
    function registerTrader(
        address account,
        uint256 initialBalance,
        Stage stage
    ) external onlyFactory {
        if (traderStates[account].isActive) revert AlreadyRegistered();
        if (stage == Stage.None) revert InvalidStage();
        
        traderStates[account] = TraderState({
            accountContract: account,
            initialBalance: initialBalance,
            dailyStartingEquity: initialBalance,
            lastDayReset: _getCurrentDayStart(),
            stage: stage,
            tradingDays: 0,
            isActive: true
        });
        
        // Add to active traders list
        traderIndex[account] = activeTraders.length;
        activeTraders.push(account);
        
        emit TraderRegistered(account, TraderAccount(account).getTrader(), stage);
    }

    /**
     * @notice Upgrade trader to next stage
     */
    function upgradeTrader(address account) external onlyFactory {
        TraderState storage state = traderStates[account];
        if (!state.isActive) revert TraderNotActive();
        
        Stage oldStage = state.stage;
        
        if (oldStage == Stage.Challenge) {
            state.stage = Stage.Verification;
        } else if (oldStage == Stage.Verification) {
            state.stage = Stage.Funded;
        }
        
        // Reset for new stage
        uint256 currentEquity = TraderAccount(account).getEquity();
        state.initialBalance = currentEquity;
        state.dailyStartingEquity = currentEquity;
        state.tradingDays = 0;
        state.lastDayReset = _getCurrentDayStart();
        
        emit TraderUpgraded(account, oldStage, state.stage);
    }

    // ============ Core Functions ============

    /**
     * @notice Check status of a trader account and enforce rules
     * @param account TraderAccount address to check
     * @return status Current status after check
     */
    function checkStatus(address account) public nonReentrant returns (Status status) {
        TraderState storage state = traderStates[account];
        if (!state.isActive) revert TraderNotActive();
        
        TraderAccount traderAccount = TraderAccount(account);
        uint256 currentEquity = traderAccount.getEquity();
        StageRules memory rules = stageRules[state.stage];
        
        // Check if new day - reset daily equity
        uint256 currentDayStart = _getCurrentDayStart();
        if (currentDayStart > state.lastDayReset) {
            state.dailyStartingEquity = currentEquity;
            state.lastDayReset = currentDayStart;
            state.tradingDays++;
            
            emit DailyReset(account, currentEquity);
        }
        
        // 1. Check Max Total Loss
        uint256 maxTotalLoss = (state.initialBalance * rules.maxTotalLossBps) / 10000;
        if (currentEquity <= state.initialBalance - maxTotalLoss) {
            _liquidateTrader(account, "Max Total Loss Exceeded");
            return Status.Failed;
        }
        
        // 2. Check Max Daily Loss
        uint256 maxDailyLoss = (state.dailyStartingEquity * rules.maxDailyLossBps) / 10000;
        if (currentEquity <= state.dailyStartingEquity - maxDailyLoss) {
            _liquidateTrader(account, "Max Daily Loss Exceeded");
            return Status.Failed;
        }
        
        // 3. Check Profit Target (not for Funded stage)
        if (state.stage != Stage.Funded && rules.profitTargetBps > 0) {
            uint256 profitTarget = (state.initialBalance * rules.profitTargetBps) / 10000;
            
            if (currentEquity >= state.initialBalance + profitTarget) {
                // Check minimum trading days
                if (state.tradingDays >= rules.minTradingDays) {
                    emit TraderStatusChecked(account, Status.Passed, currentEquity);
                    return Status.Passed;
                }
            }
        }
        
        emit TraderStatusChecked(account, Status.Active, currentEquity);
        return Status.Active;
    }

    /**
     * @notice Batch check multiple traders
     */
    function batchCheckStatus(address[] calldata accounts) external {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (traderStates[accounts[i]].isActive) {
                checkStatus(accounts[i]);
            }
        }
    }

    // ============ Chainlink Automation Functions ============

    /**
     * @notice Chainlink Automation: Check if upkeep is needed
     * @dev Returns true if any trader needs a status check
     */
    function checkUpkeep(bytes calldata) 
        external 
        view 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        // Find traders that need checking (simplified - check all active)
        address[] memory toCheck = new address[](activeTraders.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < activeTraders.length; i++) {
            address account = activeTraders[i];
            if (traderStates[account].isActive) {
                toCheck[count] = account;
                count++;
            }
        }
        
        if (count > 0) {
            // Resize array
            address[] memory result = new address[](count);
            for (uint256 i = 0; i < count; i++) {
                result[i] = toCheck[i];
            }
            return (true, abi.encode(result));
        }
        
        return (false, "");
    }

    /**
     * @notice Chainlink Automation: Perform upkeep
     * @dev Called by Chainlink to check trader statuses
     */
    function performUpkeep(bytes calldata performData) external {
        address[] memory accounts = abi.decode(performData, (address[]));
        
        for (uint256 i = 0; i < accounts.length; i++) {
            if (traderStates[accounts[i]].isActive) {
                checkStatus(accounts[i]);
            }
        }
    }

    // ============ Internal Functions ============

    function _liquidateTrader(address account, string memory reason) internal {
        TraderState storage state = traderStates[account];
        state.isActive = false;
        
        // Remove from active traders list
        uint256 index = traderIndex[account];
        uint256 lastIndex = activeTraders.length - 1;
        
        if (index != lastIndex) {
            address lastTrader = activeTraders[lastIndex];
            activeTraders[index] = lastTrader;
            traderIndex[lastTrader] = index;
        }
        activeTraders.pop();
        delete traderIndex[account];
        
        // Call liquidate on TraderAccount
        TraderAccount(account).liquidate(reason);
        
        emit TraderLiquidated(account, reason);
    }

    function _getCurrentDayStart() internal view returns (uint256) {
        // Returns timestamp of 00:00:00 UTC for current day
        return (block.timestamp / 1 days) * 1 days;
    }

    // ============ View Functions ============

    /**
     * @notice Get trader state
     */
    function getTraderState(address account) external view returns (TraderState memory) {
        return traderStates[account];
    }

    /**
     * @notice Get number of active traders
     */
    function getActiveTraderCount() external view returns (uint256) {
        return activeTraders.length;
    }

    /**
     * @notice Get all active trader accounts
     */
    function getActiveTraders() external view returns (address[] memory) {
        return activeTraders;
    }

    /**
     * @notice Check if trader would fail with current equity
     */
    function wouldFail(address account) external view returns (bool, string memory) {
        TraderState memory state = traderStates[account];
        if (!state.isActive) return (false, "Not active");
        
        uint256 currentEquity = TraderAccount(account).getEquity();
        StageRules memory rules = stageRules[state.stage];
        
        uint256 maxTotalLoss = (state.initialBalance * rules.maxTotalLossBps) / 10000;
        if (currentEquity <= state.initialBalance - maxTotalLoss) {
            return (true, "Max Total Loss");
        }
        
        uint256 maxDailyLoss = (state.dailyStartingEquity * rules.maxDailyLossBps) / 10000;
        if (currentEquity <= state.dailyStartingEquity - maxDailyLoss) {
            return (true, "Max Daily Loss");
        }
        
        return (false, "");
    }

    /**
     * @notice Check if trader would pass with current equity
     */
    function wouldPass(address account) external view returns (bool) {
        TraderState memory state = traderStates[account];
        if (!state.isActive) return false;
        if (state.stage == Stage.Funded) return false;
        
        uint256 currentEquity = TraderAccount(account).getEquity();
        StageRules memory rules = stageRules[state.stage];
        
        uint256 profitTarget = (state.initialBalance * rules.profitTargetBps) / 10000;
        
        return currentEquity >= state.initialBalance + profitTarget 
            && state.tradingDays >= rules.minTradingDays;
    }
}
