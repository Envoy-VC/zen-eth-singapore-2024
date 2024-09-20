// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {FHE, euint256, inEuint256} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import {IFHERC721} from "@fhenixprotocol/contracts/experimental/token/FHERC721/IFHERC721.sol";

// Modules
import {IHandleModule, Handle} from "./interfaces/IHandleModule.sol";

contract ProfileNFT is Permissioned, ERC721 {
    using Strings for uint256;

    mapping(uint256 tokenId => euint256) private _privateData;
    uint256 public _nextTokenId;

    // Modules
    IHandleModule internal _handleModule;
    // TODO: Follow Module
    // TODO: Publication Module
    // TODO: Meet Module
    // TODO: WorldCoin Module
    // TODO: Confidential Poll Module

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    function register(address to, Handle memory handle, inEuint256 calldata privateData) internal {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        super._mint(to, tokenId);
        _privateData[tokenId] = FHE.asEuint256(privateData);
        _handleModule.setHandle(tokenId, handle);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
        return interfaceId == type(IFHERC721).interfaceId || super.supportsInterface(interfaceId);
    }
}
