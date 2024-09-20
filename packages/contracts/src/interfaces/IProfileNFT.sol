//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IProfileNFT is IERC721 {
    function doesAlreadyFollow(uint256 tokenId) external view returns (bool);
}
