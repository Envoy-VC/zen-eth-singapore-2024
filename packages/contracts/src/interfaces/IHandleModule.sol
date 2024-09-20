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

interface IHandleModule {
    function setHandle(uint256 tokenId, Handle calldata handle) external;
    function getHandle(uint256 tokenId) external view returns (Handle memory);
}
