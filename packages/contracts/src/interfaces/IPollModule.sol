//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FHE, euint256, inEuint8} from "@fhenixprotocol/contracts/FHE.sol";
import {Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

error InvalidPollId(uint256 tokenId, uint256 pollId);
error PollExpired();
error PollNotExpired();
error AlreadyVoted(uint256 tokenId, uint256 pollId, address user);

struct Poll {
    uint256 id;
    string content;
    uint256 deadline;
    uint8 noOfOptions;
}

interface IPollModule {
    function createPoll(uint256 tokenId, string memory content, uint256 deadline, uint8 noOfOptions) external;
    function endPoll(uint256 tokenId, uint256 pollId) external;
    function voteForPoll(uint256 tokenId, uint256 pollId, inEuint8 calldata option) external;
    function getPollResults(uint256 tokenId, uint256 pollId, Permission memory auth)
        external
        view
        returns (string[] memory);
}
