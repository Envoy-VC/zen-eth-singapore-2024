// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ebool} from "@fhenixprotocol/contracts/FHE.sol";

import {IModuleBase} from "../interfaces/IModuleBase.sol";

error NotAOwner(uint256 tokenId);

contract ModuleBase is IModuleBase, Ownable {
    IERC721 internal _profile;

    constructor(address initialOwner, address profileNFT) Ownable(initialOwner) {
        _profile = IERC721(profileNFT);
    }

    // Owner Only
    function setProfileNFT(address profileNFT) external onlyOwner {
        _profile = IERC721(profileNFT);
    }
}
