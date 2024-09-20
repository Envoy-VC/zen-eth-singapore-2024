//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {euint256, inEuint256} from "@fhenixprotocol/contracts/FHE.sol";
import {Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

enum PublicationType {
    Post,
    Mirror,
    Comment
}

struct Publication {
    uint256 id;
    PublicationType publicationType;
    euint256 content;
    PublicationReference parentPublicationId;
    uint256[] childTokenIds;
    uint256[] childPublicationIds;
}

struct PublicationReference {
    uint256 tokenId;
    uint256 publicationId;
}

error InvalidParentPublicationId(uint256 tokenId, uint256 publicationId);

interface IPublicationModule {
    function createPublication(
        uint256 tokenId,
        PublicationType publicationType,
        inEuint256 memory content,
        PublicationReference memory parentPublicationId,
        PublicationReference[] memory childPublicationIds
    ) external returns (uint256 publicationId);

    function getPublicationData(uint256 tokenId, uint256 publicationId, Permission memory auth)
        external
        view
        returns (string memory);
}
