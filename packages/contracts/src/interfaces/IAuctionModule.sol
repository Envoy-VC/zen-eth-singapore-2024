//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {euint128, eaddress, inEuint128, inEaddress} from "@fhenixprotocol/contracts/FHE.sol";
import {Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

struct Auction {
    uint256 id;
    uint256 tokenId;
    address seller;
    string content;
    uint256 startPrice;
    uint256 startTime;
    uint256 endTime;
}

struct Bid {
    eaddress user;
    euint128 amount;
}

error AuctionDoesNotExist(uint256 tokenId, uint256 auctionId);
error AuctionExpired(uint256 tokenId, uint256 auctionId);
error AuctionStillRunning(uint256 tokenId, uint256 auctionId);

event AuctionCreated(
    uint256 tokenId, uint256 auctionId, string content, uint256 startPrice, uint256 startTime, uint256 endTime
);

interface IAuctionModule {
    function createAuction(
        uint256 tokenId,
        string memory content,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime
    ) external;
    function placeBid(uint256 tokenId, uint256 auctionId, inEuint128 memory amount, inEaddress memory sender)
        external;

    function getWinner(uint256 tokenId, uint256 auctionId, Permission memory auth)
        external
        view
        returns (string memory, string memory);
}
