// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {FHE, euint256, inEuint256} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

// Modules
import {HandleModule} from "./modules/HandleModule.sol";
import {FollowModule} from "./modules/FollowModule.sol";
import {PublicationModule} from "./modules/PublicationModule.sol";
import {PollModule} from "./modules/PollModule.sol";

// Interfaces
import "./interfaces/IFollowModule.sol";
import "./interfaces/IHandleModule.sol";
import "./interfaces/IProfileNFT.sol";

contract ProfileNFT is Permissioned, ERC721, IProfileNFT {
    using Strings for uint256;

    mapping(uint256 tokenId => euint256) private _privateData;
    uint256 public _nextTokenId;

    // Modules
    HandleModule public _handleModule;
    FollowModule public _followModule;
    PublicationModule public _publicationModule;
    PollModule public _pollModule;

    constructor(
        string memory name,
        string memory symbol,
        address handleModule,
        address followModule,
        address publicationModule,
        address pollModule
    ) ERC721(name, symbol) {
        _handleModule = HandleModule(handleModule);
        _followModule = FollowModule(followModule);
        _publicationModule = PublicationModule(publicationModule);
        _pollModule = PollModule(pollModule);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    function register(address to, Handle memory handle, inEuint256 calldata privateData) external {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        super._mint(to, tokenId);
        _privateData[tokenId] = FHE.asEuint256(privateData);
        _handleModule.setHandle(msg.sender, tokenId, handle);
    }

    // Only Followers and owner can Get Private Data
    function tokenPrivateData(uint256 tokenId, Permission memory auth) external view returns (string memory) {
        if (ownerOf(tokenId) == msg.sender) {
            return FHE.sealoutput(_privateData[tokenId], auth.publicKey);
        }

        if (!doesAlreadyFollow(tokenId)) {
            revert NotAFollower();
        }
        return FHE.sealoutput(_privateData[tokenId], auth.publicKey);
    }

    function doesAlreadyFollow(uint256 tokenId) public view returns (bool) {
        return _followModule.doesAlreadyFollow(tokenId);
    }

    function doesAlreadyFollow(uint256 tokenId, address user) public view returns (bool) {
        return _followModule.doesAlreadyFollow(tokenId, user);
    }
}
