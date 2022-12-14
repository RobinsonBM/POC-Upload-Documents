// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract FileContract {
    uint256 public docCounter = 0;

    struct Data {
        string hashFTP;
        uint256 id;
        string DocName;
        string DocDesc;
        address DocOwner;
        uint256 createdAt;
        string group;
        bool isCreated;
    }

    mapping(string => Data) documents;
    mapping(uint256 => Data) public forDoc;

    event Document(
        string hashFTP,
        uint256 id,
        string DocName,
        string DocDesc,
        address DocOwner,
        uint256 createdAt,
        string group,
        bool isCreated
    );

    function addDocument(
        string memory _hashFTP,
        string memory _DocName,
        string memory _DocDesc,
        string memory _group
    ) public {
        docCounter++;
        documents[_hashFTP] = Data(
            _hashFTP,
            docCounter,
            _DocName,
            _DocDesc,
            msg.sender,
            block.timestamp,
            _group,
            true
        );
        forDoc[docCounter] = Data(
            _hashFTP,
            docCounter,
            _DocName,
            _DocDesc,
            msg.sender,
            block.timestamp,
            _group,
            true
        );
        emit Document(
            _hashFTP,
            docCounter,
            _DocName,
            _DocDesc,
            msg.sender,
            block.timestamp,
            _group,
            true
        );
    }

    function getDocument(string memory _hashFTP) public {
        Data memory document = documents[_hashFTP];
        require(
            document.isCreated != false,
            "Invalid document or the document is not downloaded"
        );
        emit Document(
            document.hashFTP,
            document.id,
            document.DocName,
            document.DocDesc,
            document.DocOwner,
            document.createdAt,
            document.group,
            document.isCreated
        );
    }
}
