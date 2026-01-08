// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PropFirmFactory.sol";
import "../src/CertificateNFT.sol";
import "../src/RiskManager.sol";
import "../src/Treasury.sol";
import "../src/TraderAccountFactory.sol";

/**
 * @title Deploy
 * @notice Full deployment script for Base Capital contracts
 * @dev Run with: forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    // Base Sepolia addresses
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // Base Mainnet addresses
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    // DEX Routers - Base Mainnet
    address constant AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address constant UNISWAP_V3_ROUTER = 0x2626664c2603336E57B271c5C0b26F421741e481;
    
    // DEX Routers - Base Sepolia (testnet equivalents)
    address constant UNISWAP_V3_ROUTER_SEPOLIA = 0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // ============ Phase 1: Core Contracts ============
        
        // Deploy PropFirmFactory (fee collection, trader registration)
        PropFirmFactory factory = new PropFirmFactory(USDC_BASE_SEPOLIA);
        console.log("PropFirmFactory deployed at:", address(factory));

        // Deploy CertificateNFT (achievement NFTs)
        CertificateNFT certificate = new CertificateNFT();
        console.log("CertificateNFT deployed at:", address(certificate));

        // ============ Phase 3: On-Chain Trading Contracts ============
        
        // Deploy RiskManager (drawdown enforcement with Chainlink Automation)
        RiskManager riskManager = new RiskManager();
        console.log("RiskManager deployed at:", address(riskManager));

        // Deploy Treasury (capital pool and profit splits)
        Treasury treasury = new Treasury(USDC_BASE_SEPOLIA);
        console.log("Treasury deployed at:", address(treasury));

        // Deploy TraderAccountFactory (smart wallet deployment)
        TraderAccountFactory accountFactory = new TraderAccountFactory(
            address(riskManager),
            USDC_BASE_SEPOLIA
        );
        console.log("TraderAccountFactory deployed at:", address(accountFactory));

        // ============ Configure Cross-References ============
        
        // RiskManager needs to know the factory
        riskManager.setFactory(address(accountFactory));
        console.log("RiskManager: factory set to TraderAccountFactory");

        // Treasury needs references
        treasury.setFactory(address(accountFactory));
        treasury.setRiskManager(address(riskManager));
        console.log("Treasury: factory and riskManager configured");

        // ============ Configure DEX Routers ============
        
        // Add Uniswap V3 Router for Sepolia
        accountFactory.addDefaultRouter(UNISWAP_V3_ROUTER_SEPOLIA);
        console.log("TraderAccountFactory: Uniswap V3 router added");

        vm.stopBroadcast();

        // ============ Deployment Summary ============
        console.log("\n========================================");
        console.log("=== BASE CAPITAL DEPLOYMENT SUMMARY ===");
        console.log("========================================");
        console.log("Network: Base Sepolia");
        console.log("USDC Address:", USDC_BASE_SEPOLIA);
        console.log("");
        console.log("--- Phase 1: Core Contracts ---");
        console.log("PropFirmFactory:", address(factory));
        console.log("CertificateNFT:", address(certificate));
        console.log("");
        console.log("--- Phase 3: On-Chain Trading ---");
        console.log("RiskManager:", address(riskManager));
        console.log("Treasury:", address(treasury));
        console.log("TraderAccountFactory:", address(accountFactory));
        console.log("");
        console.log("--- DEX Routers Whitelisted ---");
        console.log("Uniswap V3 (Sepolia):", UNISWAP_V3_ROUTER_SEPOLIA);
        console.log("========================================");
    }
}

/**
 * @title DeployMainnet
 * @notice Mainnet deployment script (use with caution)
 * @dev Run with: forge script script/Deploy.s.sol:DeployMainnet --rpc-url base_mainnet --broadcast --verify
 */
contract DeployMainnet is Script {
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address constant UNISWAP_V3_ROUTER = 0x2626664c2603336E57B271c5C0b26F421741e481;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Phase 1
        PropFirmFactory factory = new PropFirmFactory(USDC_BASE_MAINNET);
        CertificateNFT certificate = new CertificateNFT();

        // Phase 3
        RiskManager riskManager = new RiskManager();
        Treasury treasury = new Treasury(USDC_BASE_MAINNET);
        TraderAccountFactory accountFactory = new TraderAccountFactory(
            address(riskManager),
            USDC_BASE_MAINNET
        );

        // Configure
        riskManager.setFactory(address(accountFactory));
        treasury.setFactory(address(accountFactory));
        treasury.setRiskManager(address(riskManager));

        // Add mainnet DEX routers
        accountFactory.addDefaultRouter(AERODROME_ROUTER);
        accountFactory.addDefaultRouter(UNISWAP_V3_ROUTER);

        vm.stopBroadcast();

        console.log("\n========================================");
        console.log("=== MAINNET DEPLOYMENT ===");
        console.log("========================================");
        console.log("PropFirmFactory:", address(factory));
        console.log("CertificateNFT:", address(certificate));
        console.log("RiskManager:", address(riskManager));
        console.log("Treasury:", address(treasury));
        console.log("TraderAccountFactory:", address(accountFactory));
        console.log("");
        console.log("DEX Routers: Aerodrome, Uniswap V3");
        console.log("========================================");
    }
}
