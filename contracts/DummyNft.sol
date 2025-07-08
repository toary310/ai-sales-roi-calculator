// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DummyNft is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("Dummy NFT", "DNFT") {
        tokenCounter = 0;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        tokenCounter++;
        return tokenId;
    }
}
