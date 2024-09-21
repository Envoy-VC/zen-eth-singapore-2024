// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {euint128, FHE, ebool} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import {ModuleBase} from "../common/ModuleBase.sol";
import "../interfaces/IAuctionModule.sol";
import "../interfaces/IHandleModule.sol";

contract AuctionModule is ModuleBase, IAuctionModule, Permissioned {
    // Token ID => Next Auction ID
    mapping(uint256 tokenId => uint256 nextAuctionId) public _nextAuctionIds;
    // Token ID => Auction ID => Auction
    mapping(uint256 tokenId => mapping(uint256 auctionId => Auction)) public _auctions;

    // Token ID => Auction ID => Next Bid Count
    mapping(uint256 tokenId => mapping(uint256 auctionId => uint256 nextBidCount)) internal _nextBidCounts;
    // Token ID => Auction ID => Bid Count => Bid
    mapping(uint256 tokenId => mapping(uint256 auctionId => mapping(uint256 count => Bid))) internal _bids;

    constructor(address initialOwner, address profileNFT) ModuleBase(initialOwner, profileNFT) {}

    function createAuction(uint256 tokenId, uint256 startPrice, uint256 startTime, uint256 endTime) external {
        uint256 _nextAuctionId = ++_nextAuctionIds[tokenId];
        _nextAuctionIds[tokenId] = _nextAuctionId;

        // Check Ownership
        if (!(_profile.ownerOf(tokenId) == msg.sender)) {
            revert NotAOwner(tokenId);
        }

        _auctions[tokenId][_nextAuctionId] = Auction({
            id: _nextAuctionId,
            tokenId: tokenId,
            seller: msg.sender,
            startPrice: startPrice,
            startTime: startTime,
            endTime: endTime
        });

        emit AuctionCreated(tokenId, _nextAuctionId, startPrice, startTime, endTime);
    }

    function placeBid(uint256 tokenId, uint256 auctionId, euint128 amount, eaddress sender) external {
        // Check if Auction Exists
        _auctionExists(tokenId, auctionId);

        // we are placing the highest bid in the first slot of mapping _bids, and if there is a large bid we swap positions.
        uint256 _nextBidCount = ++_nextBidCounts[tokenId][auctionId];
        _nextBidCounts[tokenId][auctionId] = _nextBidCount;

        // Get Auction
        Auction storage auction = _auctions[tokenId][auctionId];

        // Check if Auction is still active
        if (!(auction.endTime > block.timestamp)) {
            revert AuctionExpired(tokenId, auctionId);
        }

        // Check if Bid is higher than bid at slot 1
        Bid storage highest = _bids[tokenId][auctionId][0];
        ebool isHigher = amount.gt(highest.amount);

        _bids[tokenId][auctionId][0].amount = FHE.select(isHigher, amount, highest.amount);
        _bids[tokenId][auctionId][0].user = FHE.select(isHigher, sender, highest.user);

        // This way every time someone places a bid, the highest bid is always in the first slot of the mapping.
    }

    function getWinner(uint256 tokenId, uint256 auctionId, Permission memory auth)
        external
        view
        returns (string memory, string memory)
    {
        // Check if Auction Exists
        _auctionExists(tokenId, auctionId);

        // Get Auction
        Auction storage auction = _auctions[tokenId][auctionId];

        // Check if Auction is still running, only reveal after deadline is over
        if (!(auction.endTime < block.timestamp)) {
            revert AuctionStillRunning(tokenId, auctionId);
        }

        Bid storage bid = _bids[tokenId][auctionId][0];

        return (FHE.sealoutput(bid.user, auth.publicKey), FHE.sealoutput(bid.amount, auth.publicKey));
    }

    function _auctionExists(uint256 tokenId, uint256 auctionId) internal view {
        if (!(_auctions[tokenId][auctionId].id > 0)) {
            revert AuctionDoesNotExist(tokenId, auctionId);
        }
    }
}
