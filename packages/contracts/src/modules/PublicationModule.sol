// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FHE, inEuint256} from "@fhenixprotocol/contracts/FHE.sol";
import {ModuleBase, NotAOwner} from "../common/ModuleBase.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

import "../interfaces/IPublicationModule.sol";
import "../interfaces/IFollowModule.sol";

contract PublicationModule is ModuleBase, IPublicationModule, Permissioned {
    mapping(uint256 tokenId => uint256 nextPublicationId) public _nextPublicationIds;
    mapping(uint256 tokenId => mapping(uint256 publicationId => Publication)) public _publications;

    constructor(address initialOwner, address profileNFT) ModuleBase(initialOwner, profileNFT) {}

    function createPublication(
        uint256 tokenId,
        PublicationType publicationType,
        inEuint256 memory content,
        PublicationReference memory parentPublicationId,
        PublicationReference[] memory childPublicationReferences
    ) external returns (uint256) {
        uint256 _nextPublicationId = ++_nextPublicationIds[tokenId];
        _nextPublicationIds[tokenId] = _nextPublicationId;

        // Check Ownership
        if (!(_profile.ownerOf(tokenId) == msg.sender)) {
            revert NotAOwner(tokenId);
        }

        // Check if Parent Publication Exists
        _publicationExists(parentPublicationId.tokenId, parentPublicationId.publicationId);

        uint256[] memory childPublicationIds = new uint256[](childPublicationReferences.length);
        uint256[] memory childTokenIds = new uint256[](childPublicationReferences.length);

        for (uint256 i = 0; i < childPublicationIds.length; i++) {
            // Check if Child Publication Exists
            _publicationExists(childPublicationReferences[i].tokenId, childPublicationReferences[i].publicationId);
            childPublicationIds[i] = childPublicationReferences[i].publicationId;
            childTokenIds[i] = childPublicationReferences[i].tokenId;
        }

        _publications[tokenId][_nextPublicationId] = Publication({
            id: _nextPublicationId,
            publicationType: publicationType,
            content: FHE.asEuint256(content),
            parentPublicationId: parentPublicationId,
            childPublicationIds: childPublicationIds,
            childTokenIds: childTokenIds
        });

        emit PublicationCreated(tokenId, _nextPublicationId, _publications[tokenId][_nextPublicationId].content);

        return _nextPublicationId;
    }

    function _publicationExists(uint256 tokenId, uint256 publicationId) internal view {
        if (publicationId != 0) {
            if (_publications[tokenId][publicationId].id == 0) {
                revert InvalidParentPublicationId(tokenId, publicationId);
            }
        }
    }

    function getPublicationData(uint256 tokenId, uint256 publicationId, Permission memory auth)
        external
        view
        returns (string memory)
    {
        if (_profile.ownerOf(tokenId) == msg.sender) {
            return FHE.sealoutput(_publications[tokenId][publicationId].content, auth.publicKey);
        }
        if (!_profile.doesAlreadyFollow(tokenId, msg.sender)) {
            revert NotAFollower();
        }
        return FHE.sealoutput(_publications[tokenId][publicationId].content, auth.publicKey);
    }
}
