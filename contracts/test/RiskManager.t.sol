// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RiskManager.sol";
import "../src/TraderAccount.sol";
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
 * @title RiskManagerTest
 * @notice Tests for RiskManager contract
 */
contract RiskManagerTest is Test {
    RiskManager public riskManager;
    TraderAccount public account;
    MockUSDC public usdc;
    
    address public factory = address(this);
    address public trader = address(0x2);

    function setUp() public {
        usdc = new MockUSDC();
        riskManager = new RiskManager();
        riskManager.setFactory(factory);
        
        account = new TraderAccount(factory, address(riskManager), address(usdc));
    }

    // ============ Registration Tests ============

    function test_RegisterTrader() public {
        uint256 balance = 5000 * 10**6;
        
        riskManager.registerTrader(
            address(account),
            balance,
            RiskManager.Stage.Challenge
        );
        
        RiskManager.TraderState memory state = riskManager.getTraderState(address(account));
        assertEq(state.initialBalance, balance);
        assertEq(uint8(state.stage), uint8(RiskManager.Stage.Challenge));
        assertTrue(state.isActive);
    }

    function test_RegisterTrader_RevertsIfNotFactory() public {
        vm.prank(address(0x999));
        vm.expectRevert(RiskManager.NotFactory.selector);
        riskManager.registerTrader(address(account), 5000 * 10**6, RiskManager.Stage.Challenge);
    }

    function test_RegisterTrader_RevertsIfAlreadyRegistered() public {
        riskManager.registerTrader(address(account), 5000 * 10**6, RiskManager.Stage.Challenge);
        
        vm.expectRevert(RiskManager.AlreadyRegistered.selector);
        riskManager.registerTrader(address(account), 5000 * 10**6, RiskManager.Stage.Challenge);
    }

    // ============ Check Status Tests ============

    function test_CheckStatus_Active() public {
        uint256 balance = 5000 * 10**6;
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        RiskManager.Status status = riskManager.checkStatus(address(account));
        assertEq(uint8(status), uint8(RiskManager.Status.Active));
    }

    function test_CheckStatus_Passed() public {
        uint256 balance = 5000 * 10**6;
        uint256 profitTarget = (balance * 800) / 10000; // 8%
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance + profitTarget);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        // Fast forward 5 days
        for (uint i = 0; i < 5; i++) {
            vm.warp(block.timestamp + 1 days);
            riskManager.checkStatus(address(account));
        }
        
        RiskManager.Status status = riskManager.checkStatus(address(account));
        assertEq(uint8(status), uint8(RiskManager.Status.Passed));
    }

    function test_CheckStatus_FailedMaxLoss() public {
        uint256 balance = 5000 * 10**6;
        uint256 maxLoss = (balance * 800) / 10000; // 8%
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance - maxLoss - 1);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        RiskManager.Status status = riskManager.checkStatus(address(account));
        assertEq(uint8(status), uint8(RiskManager.Status.Failed));
    }

    // ============ Upgrade Tests ============

    function test_UpgradeTrader() public {
        uint256 balance = 5000 * 10**6;
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        riskManager.upgradeTrader(address(account));
        
        RiskManager.TraderState memory state = riskManager.getTraderState(address(account));
        assertEq(uint8(state.stage), uint8(RiskManager.Stage.Verification));
    }

    // ============ Chainlink Automation Tests ============

    function test_CheckUpkeep() public {
        uint256 balance = 5000 * 10**6;
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        (bool upkeepNeeded, bytes memory performData) = riskManager.checkUpkeep("");
        
        assertTrue(upkeepNeeded);
        address[] memory accounts = abi.decode(performData, (address[]));
        assertEq(accounts[0], address(account));
    }

    // ============ View Tests ============

    function test_GetActiveTraders() public {
        account.activate(trader, 5000 * 10**6);
        usdc.mint(address(account), 5000 * 10**6);
        riskManager.registerTrader(address(account), 5000 * 10**6, RiskManager.Stage.Challenge);
        
        assertEq(riskManager.getActiveTraderCount(), 1);
        
        address[] memory traders = riskManager.getActiveTraders();
        assertEq(traders[0], address(account));
    }

    function test_WouldFail() public {
        uint256 balance = 5000 * 10**6;
        
        account.activate(trader, balance);
        usdc.mint(address(account), 4000 * 10**6);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        (bool wouldFail, string memory reason) = riskManager.wouldFail(address(account));
        assertTrue(wouldFail);
        assertEq(reason, "Max Total Loss");
    }

    function test_WouldPass() public {
        uint256 balance = 5000 * 10**6;
        uint256 profitTarget = (balance * 800) / 10000;
        
        account.activate(trader, balance);
        usdc.mint(address(account), balance + profitTarget);
        riskManager.registerTrader(address(account), balance, RiskManager.Stage.Challenge);
        
        // Need min trading days
        for (uint i = 0; i < 5; i++) {
            vm.warp(block.timestamp + 1 days);
            riskManager.checkStatus(address(account));
        }
        
        assertTrue(riskManager.wouldPass(address(account)));
    }
}
