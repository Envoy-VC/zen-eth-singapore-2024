// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IHandleModule.sol";

import {ModuleBase} from "../common/ModuleBase.sol";

contract HandleModule is IHandleModule, ModuleBase {
    mapping(string namespace => mapping(string name => HandleOwner)) public _handleOwners;
    mapping(uint256 => Handle) public _handles;

    constructor(address initialOwner, address profileNFT) ModuleBase(initialOwner, profileNFT) {}

    function setHandle(address owner, uint256 tokenId, Handle calldata handle) external {
        checkHandleExists(handle.namespace, handle.localName);
        if (_profile.ownerOf(tokenId) != owner) revert NotAOwner(tokenId);
        _handleOwners[handle.namespace][handle.localName] = HandleOwner({owner: msg.sender, tokenId: tokenId});
        _handles[tokenId] = handle;
        emit HandleSet(tokenId, handle);
    }

    function getHandle(uint256 tokenId) external view returns (Handle memory) {
        return _handles[tokenId];
    }

    function checkHandleExists(string memory namespace, string memory name) public view {
        if (_handleOwners[namespace][name].owner != address(0)) {
            revert HandleAlreadyTaken(_handleOwners[namespace][name].tokenId, namespace, name);
        }
    }
}
