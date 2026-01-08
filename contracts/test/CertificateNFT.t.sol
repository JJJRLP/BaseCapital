// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CertificateNFT.sol";

/**
 * @title CertificateNFTTest
 * @notice Tests for CertificateNFT contract
 */
contract CertificateNFTTest is Test {
    CertificateNFT public certificate;
    
    address public owner = address(this);
    address public trader = address(0x1);

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed trader,
        uint8 stage,
        uint256 balanceAchieved
    );

    function setUp() public {
        certificate = new CertificateNFT();
    }

    // ============ Minting Tests ============

    function test_MintChallengeCertificate() public {
        vm.expectEmit(true, true, false, true);
        emit CertificateMinted(1, trader, 1, 5400 * 10**6);
        
        uint256 tokenId = certificate.mint(trader, 1, 1, 5400 * 10**6);
        
        assertEq(tokenId, 1);
        assertEq(certificate.ownerOf(1), trader);
        
        CertificateNFT.Certificate memory cert = certificate.getCertificate(1);
        assertEq(cert.trader, trader);
        assertEq(cert.stage, 1);
        assertEq(cert.planId, 1);
        assertEq(cert.balanceAchieved, 5400 * 10**6);
    }

    function test_MintVerificationCertificate() public {
        uint256 tokenId = certificate.mint(trader, 2, 2, 26250 * 10**6);
        
        assertEq(tokenId, 1);
        
        CertificateNFT.Certificate memory cert = certificate.getCertificate(1);
        assertEq(cert.stage, 2);
    }

    function test_MintFundedCertificate() public {
        uint256 tokenId = certificate.mint(trader, 3, 3, 55000 * 10**6);
        
        CertificateNFT.Certificate memory cert = certificate.getCertificate(1);
        assertEq(cert.stage, 3);
        assertEq(tokenId, 1);
    }

    function test_MintMultipleCertificates() public {
        certificate.mint(trader, 1, 1, 5400 * 10**6);
        certificate.mint(trader, 2, 1, 5625 * 10**6);
        certificate.mint(trader, 3, 1, 6000 * 10**6);
        
        uint256[] memory certs = certificate.getCertificatesForTrader(trader);
        assertEq(certs.length, 3);
        assertEq(certs[0], 1);
        assertEq(certs[1], 2);
        assertEq(certs[2], 3);
    }

    function test_MintRevertsIfInvalidStage() public {
        vm.expectRevert("Invalid stage");
        certificate.mint(trader, 0, 1, 5000 * 10**6);
        
        vm.expectRevert("Invalid stage");
        certificate.mint(trader, 4, 1, 5000 * 10**6);
    }

    function test_MintRevertsIfNotOwner() public {
        vm.prank(address(0x999));
        vm.expectRevert();
        certificate.mint(trader, 1, 1, 5000 * 10**6);
    }

    // ============ Token URI Tests ============

    function test_TokenURIContainsMetadata() public {
        certificate.mint(trader, 1, 1, 5400 * 10**6);
        
        string memory uri = certificate.tokenURI(1);
        
        // Should be base64 encoded JSON
        assertTrue(bytes(uri).length > 0);
        // Check it starts with data URI
        bytes memory uriBytes = bytes(uri);
        assertEq(uriBytes[0], "d");
        assertEq(uriBytes[1], "a");
        assertEq(uriBytes[2], "t");
        assertEq(uriBytes[3], "a");
    }

    // ============ View Tests ============

    function test_GetCertificatesForTrader() public {
        uint256[] memory empty = certificate.getCertificatesForTrader(trader);
        assertEq(empty.length, 0);
        
        certificate.mint(trader, 1, 1, 5000 * 10**6);
        
        uint256[] memory certs = certificate.getCertificatesForTrader(trader);
        assertEq(certs.length, 1);
    }

    function test_GetCertificateRevertsIfInvalidToken() public {
        vm.expectRevert("Invalid token");
        certificate.getCertificate(0);
        
        vm.expectRevert("Invalid token");
        certificate.getCertificate(999);
    }

    // ============ Interface Tests ============

    function test_SupportsERC721Interface() public view {
        // ERC721 interface ID
        assertTrue(certificate.supportsInterface(0x80ac58cd));
        // ERC721Metadata interface ID
        assertTrue(certificate.supportsInterface(0x5b5e139f));
    }
}
