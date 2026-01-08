// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PropFirmFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Simple mock USDC for testing
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/**
 * @title PropFirmFactoryTest
 * @notice Tests for PropFirmFactory contract
 */
contract PropFirmFactoryTest is Test {
    PropFirmFactory public factory;
    MockUSDC public usdc;
    
    address public owner = address(this);
    address public trader1 = address(0x1);
    address public trader2 = address(0x2);

    event ChallengeStarted(address indexed trader, uint256 indexed planId, uint256 timestamp);
    event TraderUpgraded(address indexed trader, PropFirmFactory.Stage previousStage, PropFirmFactory.Stage newStage);
    event TraderFailed(address indexed trader, PropFirmFactory.Stage stage, string reason);

    function setUp() public {
        usdc = new MockUSDC();
        factory = new PropFirmFactory(address(usdc));
        
        // Give traders USDC
        usdc.mint(trader1, 1000 * 10**6);
        usdc.mint(trader2, 1000 * 10**6);
    }

    // ============ Plan Tests ============

    function test_DefaultPlansCreated() public view {
        PropFirmFactory.Plan memory starterPlan = factory.getPlan(1);
        assertEq(starterPlan.name, "Starter");
        assertEq(starterPlan.feeAmount, 49_990000);
        assertEq(starterPlan.virtualCapital, 5000);
        assertTrue(starterPlan.active);

        PropFirmFactory.Plan memory proPlan = factory.getPlan(2);
        assertEq(proPlan.name, "Pro");
        assertEq(proPlan.feeAmount, 99_990000);

        PropFirmFactory.Plan memory elitePlan = factory.getPlan(3);
        assertEq(elitePlan.name, "Elite");
        assertEq(elitePlan.feeAmount, 149_990000);
    }

    function test_CreateNewPlan() public {
        factory.createPlan("Enterprise", 499_990000, 100000);
        
        PropFirmFactory.Plan memory plan = factory.getPlan(4);
        assertEq(plan.name, "Enterprise");
        assertEq(plan.feeAmount, 499_990000);
        assertEq(plan.virtualCapital, 100000);
    }

    function test_SetPlanActive() public {
        factory.setPlanActive(1, false);
        PropFirmFactory.Plan memory plan = factory.getPlan(1);
        assertFalse(plan.active);
    }

    // ============ Challenge Tests ============

    function test_StartChallenge() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        
        vm.expectEmit(true, true, false, true);
        emit ChallengeStarted(trader1, 1, block.timestamp);
        
        factory.startChallenge(1);
        vm.stopPrank();

        PropFirmFactory.Trader memory trader = factory.getTrader(trader1);
        assertEq(trader.wallet, trader1);
        assertEq(trader.planId, 1);
        assertEq(uint8(trader.stage), uint8(PropFirmFactory.Stage.Challenge));
        assertTrue(trader.active);
        
        assertEq(factory.totalTraders(), 1);
        assertEq(factory.totalFeesCollected(), 49_990000);
    }

    function test_StartChallenge_RevertsIfInvalidPlan() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 100 * 10**6);
        
        vm.expectRevert(PropFirmFactory.InvalidPlan.selector);
        factory.startChallenge(99);
        vm.stopPrank();
    }

    function test_StartChallenge_RevertsIfAlreadyActive() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 100 * 10**6);
        factory.startChallenge(1);
        
        vm.expectRevert(PropFirmFactory.TraderAlreadyActive.selector);
        factory.startChallenge(1);
        vm.stopPrank();
    }

    // ============ Upgrade Tests ============

    function test_UpgradeTrader() public {
        // Setup: start challenge
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();

        // Upgrade to Verification
        vm.expectEmit(true, false, false, true);
        emit TraderUpgraded(trader1, PropFirmFactory.Stage.Challenge, PropFirmFactory.Stage.Verification);
        
        factory.upgradeTrader(trader1);
        
        PropFirmFactory.Trader memory trader = factory.getTrader(trader1);
        assertEq(uint8(trader.stage), uint8(PropFirmFactory.Stage.Verification));

        // Upgrade to Funded
        factory.upgradeTrader(trader1);
        trader = factory.getTrader(trader1);
        assertEq(uint8(trader.stage), uint8(PropFirmFactory.Stage.Funded));
    }

    function test_UpgradeTrader_RevertsIfNotOwner() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        
        vm.expectRevert();
        factory.upgradeTrader(trader1);
        vm.stopPrank();
    }

    function test_UpgradeTrader_RevertsIfAlreadyFunded() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();

        factory.upgradeTrader(trader1);
        factory.upgradeTrader(trader1);
        
        vm.expectRevert(PropFirmFactory.AlreadyFunded.selector);
        factory.upgradeTrader(trader1);
    }

    // ============ Fail Tests ============

    function test_FailTrader() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();

        vm.expectEmit(true, false, false, true);
        emit TraderFailed(trader1, PropFirmFactory.Stage.Challenge, "Max Daily Loss Exceeded");
        
        factory.failTrader(trader1, "Max Daily Loss Exceeded");
        
        PropFirmFactory.Trader memory trader = factory.getTrader(trader1);
        assertFalse(trader.active);
    }

    // ============ Restart Tests ============

    function test_RestartChallenge() public {
        // Give trader1 more USDC for the restart with higher plan
        usdc.mint(trader1, 200 * 10**6);
        
        // Start and fail
        vm.startPrank(trader1);
        usdc.approve(address(factory), 200 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();
        
        factory.failTrader(trader1, "Failed");
        
        // Restart with Pro plan ($99.99)
        vm.startPrank(trader1);
        factory.restartChallenge(2);
        vm.stopPrank();
        
        PropFirmFactory.Trader memory trader = factory.getTrader(trader1);
        assertEq(trader.planId, 2);
        assertTrue(trader.active);
        assertEq(uint8(trader.stage), uint8(PropFirmFactory.Stage.Challenge));
    }

    // ============ Fee Withdrawal Tests ============

    function test_WithdrawFees() public {
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();

        address receiver = address(0x999);
        uint256 balanceBefore = usdc.balanceOf(receiver);
        
        factory.withdrawFees(receiver);
        
        uint256 balanceAfter = usdc.balanceOf(receiver);
        assertEq(balanceAfter - balanceBefore, 49_990000);
    }

    // ============ View Function Tests ============

    function test_IsActiveTrader() public {
        assertFalse(factory.isActiveTrader(trader1));
        
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();
        
        assertTrue(factory.isActiveTrader(trader1));
    }

    function test_GetTraderStage() public {
        assertEq(uint8(factory.getTraderStage(trader1)), uint8(PropFirmFactory.Stage.None));
        
        vm.startPrank(trader1);
        usdc.approve(address(factory), 50 * 10**6);
        factory.startChallenge(1);
        vm.stopPrank();
        
        assertEq(uint8(factory.getTraderStage(trader1)), uint8(PropFirmFactory.Stage.Challenge));
    }
}
