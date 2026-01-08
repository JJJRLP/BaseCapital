// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Treasury.sol";
import "../src/TraderAccount.sol";
import "../src/RiskManager.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {}
    function decimals() public pure override returns (uint8) { return 6; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

/**
 * @title TreasuryTest
 * @notice Tests for Treasury contract
 */
contract TreasuryTest is Test {
    Treasury public treasury;
    TraderAccount public account;
    RiskManager public riskManager;
    MockUSDC public usdc;
    
    address public factory = address(this);
    address public trader = address(0x2);

    function setUp() public {
        usdc = new MockUSDC();
        treasury = new Treasury(address(usdc));
        riskManager = new RiskManager();
        
        treasury.setFactory(factory);
        treasury.setRiskManager(address(riskManager));
        
        account = new TraderAccount(factory, address(riskManager), address(usdc));
        account.activate(trader, 5000 * 10**6);
        
        // Fund treasury
        usdc.mint(address(treasury), 100_000 * 10**6);
    }

    // ============ Config Tests ============

    function test_DefaultPlanCapital() public view {
        assertEq(treasury.getCapitalForPlan(1), 5_000_000000);
        assertEq(treasury.getCapitalForPlan(2), 25_000_000000);
        assertEq(treasury.getCapitalForPlan(3), 50_000_000000);
    }

    function test_SetProfitShare() public {
        treasury.setProfitShare(9000, 1000); // 90/10 split
        
        assertEq(treasury.traderShareBps(), 9000);
        assertEq(treasury.protocolShareBps(), 1000);
    }

    function test_SetProfitShare_RevertsIfInvalid() public {
        vm.expectRevert(Treasury.InvalidShares.selector);
        treasury.setProfitShare(9000, 2000); // Doesn't add to 100%
    }

    function test_SetPlanCapital() public {
        treasury.setPlanCapital(4, 100_000_000000);
        assertEq(treasury.getCapitalForPlan(4), 100_000_000000);
    }

    // ============ Seed Account Tests ============

    function test_SeedAccount() public {
        uint256 treasuryBalanceBefore = usdc.balanceOf(address(treasury));
        
        treasury.seedAccount(address(account), 1);
        
        Treasury.Allocation memory alloc = treasury.getAllocation(address(account));
        assertEq(alloc.principal, 5_000_000000);
        assertTrue(alloc.isActive);
        
        assertEq(usdc.balanceOf(address(account)), 5_000_000000);
        assertEq(usdc.balanceOf(address(treasury)), treasuryBalanceBefore - 5_000_000000);
    }

    function test_SeedAccount_RevertsIfNotFactory() public {
        vm.prank(address(0x999));
        vm.expectRevert(Treasury.NotFactory.selector);
        treasury.seedAccount(address(account), 1);
    }

    function test_SeedAccount_RevertsIfAlreadyAllocated() public {
        treasury.seedAccount(address(account), 1);
        
        vm.expectRevert(Treasury.AllocationExists.selector);
        treasury.seedAccount(address(account), 1);
    }

    function test_SeedAccount_RevertsIfInsufficientBalance() public {
        // Create treasury with less funds
        Treasury poorTreasury = new Treasury(address(usdc));
        poorTreasury.setFactory(factory);
        usdc.mint(address(poorTreasury), 1000 * 10**6); // Only $1000
        
        vm.expectRevert(Treasury.InsufficientBalance.selector);
        poorTreasury.seedAccount(address(account), 1); // Needs $5000
    }

    // ============ View Tests ============

    function test_CanFund() public {
        assertTrue(treasury.canFund(1)); // $5K - yes
        assertTrue(treasury.canFund(2)); // $25K - yes
        
        // Create poor treasury
        Treasury poorTreasury = new Treasury(address(usdc));
        usdc.mint(address(poorTreasury), 10_000 * 10**6);
        
        assertTrue(poorTreasury.canFund(1));
        assertFalse(poorTreasury.canFund(2)); // Needs $25K but only has $10K
    }

    function test_GetStats() public {
        treasury.seedAccount(address(account), 1);
        
        (uint256 balance, uint256 allocated, uint256 recovered, uint256 profitsPaid) = treasury.getStats();
        
        assertEq(allocated, 5_000_000000);
        assertEq(recovered, 0);
        assertEq(profitsPaid, 0);
        assertGt(balance, 0);
    }

    function test_GetAvailableBalance() public {
        uint256 initialBalance = usdc.balanceOf(address(treasury));
        assertEq(treasury.getAvailableBalance(), initialBalance);
        
        treasury.seedAccount(address(account), 1);
        assertEq(treasury.getAvailableBalance(), initialBalance - 5_000_000000);
    }

    // ============ Withdrawal Tests ============

    function test_WithdrawProtocolFunds() public {
        address receiver = address(0x999);
        uint256 amount = 10_000 * 10**6;
        
        treasury.withdrawProtocolFunds(receiver, amount);
        
        assertEq(usdc.balanceOf(receiver), amount);
    }

    function test_WithdrawProtocolFunds_RevertsIfInsufficientBalance() public {
        address receiver = address(0x999);
        uint256 available = treasury.getAvailableBalance();
        
        vm.expectRevert(Treasury.InsufficientBalance.selector);
        treasury.withdrawProtocolFunds(receiver, available + 1);
    }

    function test_EmergencyWithdraw() public {
        address receiver = address(0x999);
        uint256 balance = usdc.balanceOf(address(treasury));
        
        treasury.emergencyWithdraw(receiver);
        
        assertEq(usdc.balanceOf(receiver), balance);
        assertEq(usdc.balanceOf(address(treasury)), 0);
    }
}
