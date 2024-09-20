// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IHandleModule.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error NotAOwner(uint256 tokenId);
error HandleAlreadyTaken(uint256 tokenId, string namespace, string name);

contract HandleModule is IHandleModule, Ownable {
    mapping(string namespace => mapping(string name => HandleOwner)) public _handleOwners;
    mapping(uint256 => Handle) public _handles;

    IERC721 internal _profile;

    constructor(address initialOwner, address profileNFT) Ownable(initialOwner) {
        _profile = IERC721(profileNFT);
    }

    function setHandle(uint256 tokenId, Handle calldata handle) external {
        checkHandleExists(handle.namespace, handle.localName);
        if (_profile.ownerOf(tokenId) != msg.sender) revert NotAOwner(tokenId);
        _handleOwners[handle.namespace][handle.localName] = HandleOwner({owner: msg.sender, tokenId: tokenId});
        _handles[tokenId] = handle;
    }

    function getHandle(uint256 tokenId) external view returns (Handle memory) {
        return _handles[tokenId];
    }

    function checkHandleExists(string memory namespace, string memory name) public view {
        if (_handleOwners[namespace][name].owner != address(0)) {
            revert HandleAlreadyTaken(_handleOwners[namespace][name].tokenId, namespace, name);
        }
    }

    // Owner Only
    function setProfileNFT(address profileNFT) external onlyOwner {
        _profile = IERC721(profileNFT);
    }
}
