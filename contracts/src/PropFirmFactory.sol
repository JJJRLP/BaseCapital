// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PropFirmFactory
 * @notice Manages trader registration, fee collection, and stage progression for Base Capital
 * @dev Handles USDC payments for challenge fees and tracks trader stages (Challenge -> Verification -> Funded)
 */
contract PropFirmFactory is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Types ============

    struct Plan {
        uint256 id;
        string name;
        uint256 feeAmount;        // In USDC (6 decimals)
        uint256 virtualCapital;   // Virtual trading capital amount
        bool active;
    }

    struct Trader {
        address wallet;
        uint256 planId;
        Stage stage;
        uint256 startTime;
        uint256 stageStartTime;   // When current stage started
        bool active;
    }

    enum Stage {
        None,           // 0: Not registered
        Challenge,      // 1: Challenge phase
        Verification,   // 2: Verification phase  
        Funded          // 3: Funded trader
    }

    // ============ State Variables ============

    IERC20 public immutable usdc;
    
    mapping(uint256 => Plan) public plans;
    mapping(address => Trader) public traders;
    
    uint256 public totalPlans;
    uint256 public totalTraders;
    uint256 public totalFeesCollected;

    // ============ Events ============

    event PlanCreated(uint256 indexed planId, string name, uint256 feeAmount, uint256 virtualCapital);
    event PlanUpdated(uint256 indexed planId, bool active);
    event ChallengeStarted(address indexed trader, uint256 indexed planId, uint256 timestamp);
    event TraderUpgraded(address indexed trader, Stage previousStage, Stage newStage);
    event TraderFailed(address indexed trader, Stage stage, string reason);
    event FeesWithdrawn(address indexed to, uint256 amount);

    // ============ Errors ============

    error InvalidPlan();
    error TraderAlreadyActive();
    error TraderNotActive();
    error AlreadyFunded();
    error InsufficientAllowance();
    error ZeroAddress();

    // ============ Constructor ============

    /**
     * @param _usdc Address of the USDC token contract
     * @dev Initializes with 3 default plans: Starter, Pro, Elite
     */
    constructor(address _usdc) Ownable(msg.sender) {
        if (_usdc == address(0)) revert ZeroAddress();
        usdc = IERC20(_usdc);
        
        // Initialize default plans (amounts in USDC with 6 decimals)
        _createPlan("Starter", 49_990000, 5000);     // $49.99 -> $5K virtual
        _createPlan("Pro", 99_990000, 25000);        // $99.99 -> $25K virtual
        _createPlan("Elite", 149_990000, 50000);     // $149.99 -> $50K virtual
    }

    // ============ External Functions ============

    /**
     * @notice Start a challenge by paying the fee and registering as a trader
     * @param planId The ID of the plan to enroll in (1, 2, or 3)
     */
    function startChallenge(uint256 planId) external nonReentrant {
        Plan storage plan = plans[planId];
        if (!plan.active) revert InvalidPlan();
        
        Trader storage trader = traders[msg.sender];
        if (trader.active) revert TraderAlreadyActive();

        // Transfer fee from trader to this contract
        usdc.safeTransferFrom(msg.sender, address(this), plan.feeAmount);
        
        // Register trader
        traders[msg.sender] = Trader({
            wallet: msg.sender,
            planId: planId,
            stage: Stage.Challenge,
            startTime: block.timestamp,
            stageStartTime: block.timestamp,
            active: true
        });

        totalTraders++;
        totalFeesCollected += plan.feeAmount;

        emit ChallengeStarted(msg.sender, planId, block.timestamp);
    }

    /**
     * @notice Upgrade a trader to the next stage (admin only)
     * @param traderAddress Address of the trader to upgrade
     * @dev Only owner can call this after verifying off-chain trading performance
     */
    function upgradeTrader(address traderAddress) external onlyOwner {
        Trader storage trader = traders[traderAddress];
        if (!trader.active) revert TraderNotActive();
        if (trader.stage == Stage.Funded) revert AlreadyFunded();

        Stage previousStage = trader.stage;
        trader.stage = Stage(uint8(trader.stage) + 1);
        trader.stageStartTime = block.timestamp;

        emit TraderUpgraded(traderAddress, previousStage, trader.stage);
    }

    /**
     * @notice Mark a trader as failed (admin only)
     * @param traderAddress Address of the trader who failed
     * @param reason Reason for failure (e.g., "Max Daily Loss Exceeded")
     */
    function failTrader(address traderAddress, string calldata reason) external onlyOwner {
        Trader storage trader = traders[traderAddress];
        if (!trader.active) revert TraderNotActive();

        Stage failedStage = trader.stage;
        trader.active = false;

        emit TraderFailed(traderAddress, failedStage, reason);
    }

    /**
     * @notice Allow a failed trader to restart their challenge (requires new payment)
     * @param planId The plan ID to restart with
     */
    function restartChallenge(uint256 planId) external nonReentrant {
        Trader storage trader = traders[msg.sender];
        
        // Must have a previous attempt that is no longer active
        require(trader.wallet == msg.sender && !trader.active, "Cannot restart");
        
        Plan storage plan = plans[planId];
        if (!plan.active) revert InvalidPlan();

        // Collect new fee
        usdc.safeTransferFrom(msg.sender, address(this), plan.feeAmount);

        // Reset trader
        trader.planId = planId;
        trader.stage = Stage.Challenge;
        trader.startTime = block.timestamp;
        trader.stageStartTime = block.timestamp;
        trader.active = true;

        totalFeesCollected += plan.feeAmount;

        emit ChallengeStarted(msg.sender, planId, block.timestamp);
    }

    // ============ Admin Functions ============

    /**
     * @notice Create a new plan
     * @param name Plan name
     * @param feeAmount Fee in USDC (6 decimals)
     * @param virtualCapital Virtual capital amount
     */
    function createPlan(
        string calldata name,
        uint256 feeAmount,
        uint256 virtualCapital
    ) external onlyOwner {
        _createPlan(name, feeAmount, virtualCapital);
    }

    /**
     * @notice Update plan active status
     * @param planId Plan ID to update
     * @param active New active status
     */
    function setPlanActive(uint256 planId, bool active) external onlyOwner {
        if (planId == 0 || planId > totalPlans) revert InvalidPlan();
        plans[planId].active = active;
        emit PlanUpdated(planId, active);
    }

    /**
     * @notice Withdraw collected fees to a specified address
     * @param to Address to send fees to
     */
    function withdrawFees(address to) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        uint256 balance = usdc.balanceOf(address(this));
        usdc.safeTransfer(to, balance);
        emit FeesWithdrawn(to, balance);
    }

    // ============ View Functions ============

    /**
     * @notice Get trader information
     * @param traderAddress Address of the trader
     * @return Trader struct with all details
     */
    function getTrader(address traderAddress) external view returns (Trader memory) {
        return traders[traderAddress];
    }

    /**
     * @notice Get plan information
     * @param planId ID of the plan
     * @return Plan struct with all details
     */
    function getPlan(uint256 planId) external view returns (Plan memory) {
        return plans[planId];
    }

    /**
     * @notice Check if an address is an active trader
     * @param traderAddress Address to check
     */
    function isActiveTrader(address traderAddress) external view returns (bool) {
        return traders[traderAddress].active;
    }

    /**
     * @notice Get the current stage of a trader
     * @param traderAddress Address of the trader
     */
    function getTraderStage(address traderAddress) external view returns (Stage) {
        return traders[traderAddress].stage;
    }

    // ============ Internal Functions ============

    function _createPlan(
        string memory name,
        uint256 feeAmount,
        uint256 virtualCapital
    ) internal {
        totalPlans++;
        plans[totalPlans] = Plan({
            id: totalPlans,
            name: name,
            feeAmount: feeAmount,
            virtualCapital: virtualCapital,
            active: true
        });
        emit PlanCreated(totalPlans, name, feeAmount, virtualCapital);
    }
}
