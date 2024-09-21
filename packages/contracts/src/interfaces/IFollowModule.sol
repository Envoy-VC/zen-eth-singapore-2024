//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error AlreadyFollows();
error NotAFollower();

event Followed(uint256 indexed tokenId, address indexed user);

event Unfollowed(uint256 indexed tokenId, address indexed user);

interface IFollowModule {
    function follow(uint256 tokenId, address user) external;
    function unfollow(uint256 tokenId, address user) external;

    function doesAlreadyFollow(uint256 tokenId) external returns (bool);
}
