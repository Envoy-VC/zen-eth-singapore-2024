// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {euint128, FHE} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import {ModuleBase} from "../common/ModuleBase.sol";
import "../interfaces/IFollowModule.sol";

contract FollowModule is ModuleBase, IFollowModule, Permissioned {
    mapping(uint256 tokenId => mapping(address user => bool follows)) public _follows;
    mapping(uint256 tokenId => euint128 followers) public _totalFollowers;

    constructor(address initialOwner, address profileNFT) ModuleBase(initialOwner, profileNFT) {}

    function follow(uint256 tokenId, address user) external {
        if (doesAlreadyFollow(tokenId)) {
            revert AlreadyFollows();
        }
        _follows[tokenId][user] = true;
        _totalFollowers[tokenId] = FHE.add(_totalFollowers[tokenId], FHE.asEuint128(1));
        emit Followed(tokenId, user);
    }

    function unfollow(uint256 tokenId, address user) external {
        if (!doesAlreadyFollow(tokenId)) {
            revert NotAFollower();
        }

        _follows[tokenId][user] = false;
        _totalFollowers[tokenId] = FHE.sub(_totalFollowers[tokenId], FHE.asEuint128(1));
        emit Unfollowed(tokenId, user);
    }

    function doesAlreadyFollow(uint256 tokenId) public view returns (bool) {
        return _follows[tokenId][msg.sender];
    }

    function doesAlreadyFollow(uint256 tokenId, address user) public view returns (bool) {
        return _follows[tokenId][user];
    }

    function getFollowers(uint256 tokenId, Permission memory auth, address owner)
        external
        view
        returns (string memory)
    {
        if (!doesAlreadyFollow(tokenId, owner)) {
            revert NotAFollower();
        }
        return FHE.sealoutput(_totalFollowers[tokenId], auth.publicKey);
    }
}
