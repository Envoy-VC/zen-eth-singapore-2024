//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

struct Handle {
    string localName;
    string namespace;
}

struct HandleOwner {
    address owner;
    uint256 tokenId;
}

error NotAOwner(uint256 tokenId);
error HandleAlreadyTaken(uint256 tokenId, string namespace, string name);

event HandleSet(uint256 indexed tokenId, Handle handle);

interface IHandleModule {
    function setHandle(address owner, uint256 tokenId, Handle calldata handle) external;
    function getHandle(uint256 tokenId) external view returns (Handle memory);
}
