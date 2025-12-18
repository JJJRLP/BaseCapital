// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title CertificateNFT
 * @notice NFT certificates minted when traders pass evaluation stages
 * @dev Generates on-chain SVG metadata for each certificate
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // ============ Types ============

    struct Certificate {
        address trader;
        uint8 stage;           // 1=Challenge, 2=Verification, 3=Funded
        uint256 planId;
        uint256 balanceAchieved;
        uint256 issuedAt;
    }

    // ============ State Variables ============

    uint256 private _tokenIdCounter;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public traderCertificates;

    string[4] private stageNames = ["None", "Challenge", "Verification", "Funded"];
    string[4] private stageColors = ["#666", "#3B82F6", "#8B5CF6", "#10B981"];

    // ============ Events ============

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed trader,
        uint8 stage,
        uint256 balanceAchieved
    );

    // ============ Constructor ============

    constructor() ERC721("Base Capital Certificate", "BCC") Ownable(msg.sender) {}

    // ============ External Functions ============

    /**
     * @notice Mint a certificate for a trader who passed a stage
     * @param trader Address of the trader
     * @param stage Stage completed (1=Challenge, 2=Verification, 3=Funded)
     * @param planId The plan ID the trader was on
     * @param balanceAchieved Final balance when passing
     */
    function mint(
        address trader,
        uint8 stage,
        uint256 planId,
        uint256 balanceAchieved
    ) external onlyOwner returns (uint256) {
        require(stage >= 1 && stage <= 3, "Invalid stage");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        certificates[tokenId] = Certificate({
            trader: trader,
            stage: stage,
            planId: planId,
            balanceAchieved: balanceAchieved,
            issuedAt: block.timestamp
        });

        traderCertificates[trader].push(tokenId);

        _safeMint(trader, tokenId);
        _setTokenURI(tokenId, _generateTokenURI(tokenId));

        emit CertificateMinted(tokenId, trader, stage, balanceAchieved);
        
        return tokenId;
    }

    /**
     * @notice Get all certificate IDs for a trader
     * @param trader Address of the trader
     */
    function getCertificatesForTrader(address trader) external view returns (uint256[] memory) {
        return traderCertificates[trader];
    }

    /**
     * @notice Get certificate details
     * @param tokenId Token ID of the certificate
     */
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        require(tokenId > 0 && tokenId <= _tokenIdCounter, "Invalid token");
        return certificates[tokenId];
    }

    // ============ Internal Functions ============

    function _generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        Certificate memory cert = certificates[tokenId];
        
        string memory svg = _generateSVG(cert, tokenId);
        
        string memory json = string(abi.encodePacked(
            '{"name": "Base Capital Certificate #', tokenId.toString(),
            '", "description": "Official certification for passing the ', stageNames[cert.stage],
            ' stage at Base Capital.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '", "attributes": [',
            '{"trait_type": "Stage", "value": "', stageNames[cert.stage], '"},',
            '{"trait_type": "Plan ID", "value": "', cert.planId.toString(), '"},',
            '{"trait_type": "Balance Achieved", "value": "', cert.balanceAchieved.toString(), '"},',
            '{"trait_type": "Issued At", "display_type": "date", "value": ', cert.issuedAt.toString(), '}',
            ']}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function _generateSVG(Certificate memory cert, uint256 tokenId) internal view returns (string memory) {
        string memory stageColor = stageColors[cert.stage];
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">',
            '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#0052FF;stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" /></linearGradient></defs>',
            '<rect width="400" height="500" fill="url(#bg)" rx="20"/>',
            '<text x="200" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="28" font-weight="bold">BASE CAPITAL</text>',
            '<text x="200" y="90" text-anchor="middle" fill="#94A3B8" font-family="Arial" font-size="14">CERTIFICATE OF ACHIEVEMENT</text>',
            '<circle cx="200" cy="200" r="80" fill="', stageColor, '" opacity="0.3"/>',
            '<circle cx="200" cy="200" r="60" fill="', stageColor, '"/>',
            '<text x="200" y="210" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">', stageNames[cert.stage], '</text>',
            '<text x="200" y="320" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Stage Completed</text>',
            '<text x="200" y="380" text-anchor="middle" fill="#94A3B8" font-family="Arial" font-size="12">Certificate #', tokenId.toString(), '</text>',
            '<text x="200" y="450" text-anchor="middle" fill="#64748B" font-family="Arial" font-size="10">Verified on Base Blockchain</text>',
            '</svg>'
        ));
    }

    // ============ Override Functions ============

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
