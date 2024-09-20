//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error AlreadyFollows();
error NotAFollower();

interface IFollowModule {
    function follow(uint256 tokenId, address user) external;
    function unfollow(uint256 tokenId, address user) external;

    function doesAlreadyFollow(uint256 tokenId) external returns (bool);
}
