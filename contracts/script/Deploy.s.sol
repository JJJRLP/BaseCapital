// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PropFirmFactory.sol";
import "../src/CertificateNFT.sol";

/**
 * @title Deploy
 * @notice Deployment script for Base Capital contracts
 * @dev Run with: forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    // Base Sepolia USDC address
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // Base Mainnet USDC address (for future use)
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PropFirmFactory with USDC address
        PropFirmFactory factory = new PropFirmFactory(USDC_BASE_SEPOLIA);
        console.log("PropFirmFactory deployed at:", address(factory));

        // Deploy CertificateNFT
        CertificateNFT certificate = new CertificateNFT();
        console.log("CertificateNFT deployed at:", address(certificate));

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Base Sepolia");
        console.log("USDC Address:", USDC_BASE_SEPOLIA);
        console.log("PropFirmFactory:", address(factory));
        console.log("CertificateNFT:", address(certificate));
    }
}

/**
 * @title DeployMainnet
 * @notice Mainnet deployment script (use with caution)
 */
contract DeployMainnet is Script {
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        PropFirmFactory factory = new PropFirmFactory(USDC_BASE_MAINNET);
        CertificateNFT certificate = new CertificateNFT();

        vm.stopBroadcast();

        console.log("\n=== MAINNET Deployment ===");
        console.log("PropFirmFactory:", address(factory));
        console.log("CertificateNFT:", address(certificate));
    }
}
