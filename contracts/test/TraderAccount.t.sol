// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TraderAccount.sol";
import "../src/RiskManager.sol";
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
 * @title MockRouter
 * @notice Mock DEX router for testing
 */
contract MockRouter {
    function swap(address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256) {
        // Simulate getting tokens (in real scenario would transfer)
        return amountIn;
    }
}

/**
 * @title TraderAccountTest
 * @notice Tests for TraderAccount contract
 */
contract TraderAccountTest is Test {
    TraderAccount public account;
    MockUSDC public usdc;
    MockRouter public router;
    RiskManager public riskManager;
    
    address public factory = address(0x1);
    address public trader = address(0x2);

    event AccountActivated(address indexed trader, uint256 capital);
    event TradeExecuted(address indexed router, bytes4 selector, bool success);
    event ProfitWithdrawn(address indexed trader, uint256 amount);
    event AccountLiquidated(address indexed liquidator, string reason);

    function setUp() public {
        usdc = new MockUSDC();
        router = new MockRouter();
        riskManager = new RiskManager();
        
        // Deploy account from factory
        vm.prank(factory);
        account = new TraderAccount(factory, address(riskManager), address(usdc));
    }

    // ============ Activation Tests ============

    function test_Activate() public {
        uint256 capital = 5000 * 10**6;
        
        vm.expectEmit(true, false, false, true);
        emit AccountActivated(trader, capital);
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        assertEq(account.trader(), trader);
        assertEq(account.initialCapital(), capital);
        assertTrue(account.isActive());
        assertFalse(account.isLiquidated());
    }

    function test_Activate_RevertsIfNotFactory() public {
        vm.expectRevert(TraderAccount.NotFactory.selector);
        account.activate(trader, 5000 * 10**6);
    }

    function test_Activate_RevertsIfAlreadyActive() public {
        vm.startPrank(factory);
        account.activate(trader, 5000 * 10**6);
        
        vm.expectRevert(TraderAccount.AlreadyActive.selector);
        account.activate(trader, 5000 * 10**6);
        vm.stopPrank();
    }

    function test_Activate_RevertsIfZeroAddress() public {
        vm.prank(factory);
        vm.expectRevert(TraderAccount.ZeroAddress.selector);
        account.activate(address(0), 5000 * 10**6);
    }

    // ============ Whitelist Tests ============

    function test_SetRouterWhitelist() public {
        vm.prank(factory);
        account.setRouterWhitelist(address(router), true);
        
        assertTrue(account.whitelistedRouters(address(router)));
    }

    function test_SetTokenWhitelist() public {
        address newToken = address(0x123);
        
        vm.prank(factory);
        account.setTokenWhitelist(newToken, true);
        
        assertTrue(account.whitelistedTokens(newToken));
    }

    // ============ Trading Tests ============

    function test_ExecuteSwap() public {
        // Setup
        vm.startPrank(factory);
        account.activate(trader, 5000 * 10**6);
        account.setRouterWhitelist(address(router), true);
        vm.stopPrank();
        
        // Fund account
        usdc.mint(address(account), 5000 * 10**6);
        
        // Execute swap
        bytes memory swapData = abi.encodeWithSelector(
            MockRouter.swap.selector,
            address(usdc),
            address(0x456),
            1000 * 10**6
        );
        
        vm.prank(trader);
        bool success = account.executeSwap(address(router), swapData);
        
        assertTrue(success);
    }

    function test_ExecuteSwap_RevertsIfNotTrader() public {
        vm.startPrank(factory);
        account.activate(trader, 5000 * 10**6);
        account.setRouterWhitelist(address(router), true);
        vm.stopPrank();
        
        bytes memory swapData = abi.encodeWithSelector(MockRouter.swap.selector, address(usdc), address(0x456), 100);
        
        vm.expectRevert(TraderAccount.NotTrader.selector);
        account.executeSwap(address(router), swapData);
    }

    function test_ExecuteSwap_RevertsIfRouterNotWhitelisted() public {
        vm.prank(factory);
        account.activate(trader, 5000 * 10**6);
        
        bytes memory swapData = abi.encodeWithSelector(MockRouter.swap.selector, address(usdc), address(0x456), 100);
        
        vm.prank(trader);
        vm.expectRevert(TraderAccount.RouterNotWhitelisted.selector);
        account.executeSwap(address(router), swapData);
    }

    function test_ExecuteSwap_RevertsIfNotActive() public {
        bytes memory swapData = abi.encodeWithSelector(MockRouter.swap.selector, address(usdc), address(0x456), 100);
        
        // When not activated, trader is address(0), so NotTrader is thrown first
        vm.prank(trader);
        vm.expectRevert(TraderAccount.NotTrader.selector);
        account.executeSwap(address(router), swapData);
    }

    // ============ Profit Withdrawal Tests ============

    function test_WithdrawProfit() public {
        uint256 capital = 5000 * 10**6;
        uint256 profit = 500 * 10**6;
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        // Simulate profit
        usdc.mint(address(account), capital + profit);
        
        uint256 balanceBefore = usdc.balanceOf(trader);
        
        vm.prank(trader);
        account.withdrawProfit(profit);
        
        uint256 balanceAfter = usdc.balanceOf(trader);
        assertEq(balanceAfter - balanceBefore, profit);
    }

    function test_WithdrawProfit_RevertsIfInsufficientProfit() public {
        uint256 capital = 5000 * 10**6;
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        // Fund with just the capital (no profit)
        usdc.mint(address(account), capital);
        
        vm.prank(trader);
        vm.expectRevert(TraderAccount.InsufficientProfit.selector);
        account.withdrawProfit(100 * 10**6);
    }

    // ============ Liquidation Tests ============

    function test_Liquidate() public {
        vm.prank(factory);
        account.activate(trader, 5000 * 10**6);
        
        usdc.mint(address(account), 4000 * 10**6);
        
        vm.expectEmit(true, false, false, true);
        emit AccountLiquidated(address(riskManager), "Max Loss Exceeded");
        
        vm.prank(address(riskManager));
        account.liquidate("Max Loss Exceeded");
        
        assertTrue(account.isLiquidated());
        assertFalse(account.isActive());
        assertEq(usdc.balanceOf(address(account)), 0);
    }

    function test_Liquidate_RevertsIfNotRiskManager() public {
        vm.prank(factory);
        account.activate(trader, 5000 * 10**6);
        
        vm.expectRevert(TraderAccount.NotRiskManager.selector);
        account.liquidate("Unauthorized");
    }

    // ============ View Function Tests ============

    function test_GetEquity() public {
        vm.prank(factory);
        account.activate(trader, 5000 * 10**6);
        
        usdc.mint(address(account), 5500 * 10**6);
        
        assertEq(account.getEquity(), 5500 * 10**6);
    }

    function test_GetPnL() public {
        uint256 capital = 5000 * 10**6;
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        // Profit scenario
        usdc.mint(address(account), 5500 * 10**6);
        assertEq(account.getPnL(), 500 * 10**6);
        
        // Simulate loss by burning
        vm.prank(address(account));
        // Can't burn, so test with initial balance only
    }

    function test_HasProfit() public {
        uint256 capital = 5000 * 10**6;
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        usdc.mint(address(account), 5500 * 10**6);
        assertTrue(account.hasProfit());
    }

    function test_GetWithdrawableProfit() public {
        uint256 capital = 5000 * 10**6;
        uint256 profit = 500 * 10**6;
        
        vm.prank(factory);
        account.activate(trader, capital);
        
        usdc.mint(address(account), capital + profit);
        assertEq(account.getWithdrawableProfit(), profit);
    }

    function test_IsAccountActive() public {
        assertFalse(account.isAccountActive());
        
        vm.prank(factory);
        account.activate(trader, 5000 * 10**6);
        
        assertTrue(account.isAccountActive());
    }
}
