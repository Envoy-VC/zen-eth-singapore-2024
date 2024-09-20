// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IProfileNFT} from "../interfaces/IProfileNFT.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IModuleBase} from "../interfaces/IModuleBase.sol";

error NotAOwner(uint256 tokenId);

contract ModuleBase is IModuleBase, Ownable {
    IProfileNFT internal _profile;

    constructor(address initialOwner, address profileNFT) Ownable(initialOwner) {
        _profile = IProfileNFT(profileNFT);
    }

    // Owner Only
    function setProfileNFT(address profileNFT) external onlyOwner {
        _profile = IProfileNFT(profileNFT);
    }
}
