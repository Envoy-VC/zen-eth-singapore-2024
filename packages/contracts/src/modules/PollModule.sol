// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FHE, inEuint256, inEuint8, euint8, euint128} from "@fhenixprotocol/contracts/FHE.sol";
import {ModuleBase, NotAOwner} from "../common/ModuleBase.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import "../interfaces/IPollModule.sol";

contract PollModule is ModuleBase, IPollModule, Permissioned {
    mapping(uint256 tokenId => uint256 nextPollId) public _nextPollIds;
    mapping(uint256 tokenId => mapping(uint256 pollId => Poll)) public _polls;

    mapping(uint256 pollId => mapping(uint8 option => euint128)) internal _votes;
    mapping(uint256 tokenId => mapping(uint256 pollId => mapping(address user => bool voted))) public _voted;

    constructor(address initialOwner, address profileNFT) ModuleBase(initialOwner, profileNFT) {}

    function createPoll(uint256 tokenId, string memory content, uint256 deadline, uint8 noOfOptions) external {
        uint256 _nextPollId = ++_nextPollIds[tokenId];
        _nextPollIds[tokenId] = _nextPollId;

        // Check Ownership
        if (!(_profile.ownerOf(tokenId) == msg.sender)) {
            revert NotAOwner(tokenId);
        }

        _polls[tokenId][_nextPollId] =
            Poll({id: _nextPollId, content: content, deadline: deadline, noOfOptions: noOfOptions});

        emit PollCreated(tokenId, _nextPollId, _polls[tokenId][_nextPollId]);
    }

    function endPoll(uint256 tokenId, uint256 pollId) external {
        // Check Ownership
        if (!(_profile.ownerOf(tokenId) == msg.sender)) {
            revert NotAOwner(tokenId);
        }

        // Check if Poll Exists
        _pollExists(tokenId, pollId);

        // Get Poll
        Poll storage poll = _polls[tokenId][pollId];
        // set deadline to now
        poll.deadline = block.timestamp;

        emit PollEnded(tokenId, pollId);
    }

    function voteForPoll(uint256 tokenId, uint256 pollId, inEuint8 calldata option) external {
        // Check if Poll Exists
        _pollExists(tokenId, pollId);

        // Check if Poll is still active
        if (_polls[tokenId][pollId].deadline < block.timestamp) {
            revert PollExpired();
        }

        _voted[tokenId][pollId][msg.sender] = true;

        uint8 dOption = FHE.decrypt(FHE.asEuint8(option));

        // Get votes for option
        euint128 votes = _votes[pollId][dOption];
        euint128 newVotes = FHE.add(votes, FHE.asEuint128(1));
        _votes[pollId][dOption] = newVotes;

        emit Voted(tokenId, pollId, msg.sender);
    }

    function _pollExists(uint256 tokenId, uint256 pollId) public view {
        if (_polls[tokenId][pollId].id == 0) {
            revert InvalidPollId(tokenId, pollId);
        }
    }

    function _alreadyVoted(uint256 tokenId, uint256 pollId) public view {
        if (_voted[tokenId][pollId][msg.sender]) {
            revert AlreadyVoted(tokenId, pollId, msg.sender);
        }
    }

    function _checkPollDeadlinePassed(uint256 tokenId, uint256 pollId) public view {
        if (_polls[tokenId][pollId].deadline > block.timestamp) {
            revert PollNotExpired();
        }
    }

    function getPollResults(uint256 tokenId, uint256 pollId, Permission memory auth)
        external
        view
        returns (string[] memory)
    {
        _pollExists(tokenId, pollId);
        _checkPollDeadlinePassed(tokenId, pollId);

        // Get no of options
        uint8 noOfOptions = _polls[tokenId][pollId].noOfOptions;

        // Get votes for each option
        string[] memory results = new string[](noOfOptions);

        for (uint8 i = 0; i < noOfOptions; i++) {
            euint128 votes = _votes[pollId][i];
            results[i] = FHE.sealoutput(votes, auth.publicKey);
        }

        return results;
    }
}
