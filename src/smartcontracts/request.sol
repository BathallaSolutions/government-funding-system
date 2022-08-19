
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pine is ERC20, Ownable {
    address public owner;
    uint256 public activeRequestCounter = 0;
    uint256 public inactiveRequestCounter = 0;
    uint256 private requestCounter = 0;

    mapping(uint256 => address) public delRequestOf;
    mapping(uint256 => address) public authorOf;
    mapping(address => uint256) public requestOf;

    enum Deactivated { NO, YES }

    struct RequestStruct {
        uint256 reqId;
        uint256 amount;
        string description;
        address author;
        Deactivated deleted;
        uint256 created;
        uint256 updated;
    }

    RequestStruct[] activeRequests;
    RequestStruct[] inactiveRequest;

    event RequestAction (
        uint256 reqId,
        string actionType,
        Deactivated deleted,
        address indexed executor,
        uint256 created
    );

    modifier ownerOnly(){
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    constructor() ERC20("Pine5", "PINE5") {
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function createRequest(
        uint256 memory amount,
        string memory description
    ) external returns (bool) {
        require(bytes(amount).length > 0, "Amount cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        requestCounter++;
        authorOf[requestCounter] = msg.sender;
        requestOf[msg.sender]++;
        activeRequestCounter++;

        activeRequests.push(
            RequestStruct(
                requestCounter,
                amount,
                description,
                msg.sender,
                Deactivated.NO,
                block.timestamp,
                block.timestamp
            )
        );

        emit RequestAction (
            requestCounter,
            "REQUEST CREATED",
            Deactivated.NO,
            msg.sender,
            block.timestamp
        );

        return true;
    }

    // function updateRequest(
    //     uint256 reqId,
    //     string memory amount,
    //     string memory description
    // ) external returns (bool) {
    //     require(authorOf[reqId] == msg.sender, "Unauthorized entity");
    //     require(bytes(amount).length > 0, "amount cannot be empty");
    //     require(bytes(description).length > 0, "Description cannot be empty");

    //     for(uint i = 0; i < activeRequests.length; i++) {
    //         if(activeRequests[i].reqId == reqId) {
    //             activeRequests[i].amount = amount;
    //             activeRequests[i].description = description;
    //             activeRequests[i].updated = block.timestamp;
    //         }
    //     }

    //     emit RequestAction (
    //         reqId,
    //         "REQUEST UPDATED",
    //         Deactivated.NO,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }

    function showRequest(
        uint256 reqId
    ) external view returns (RequestStruct memory) {
        RequestStruct memory o;
        for(uint i = 0; i < activeRequests.length; i++) {
            if(activeRequests[i].reqId == reqId) {
                o = activeRequests[i];
            }
        }
        return o;
    }

    function getRequests() external view returns (RequestStruct[] memory) {
        return activeRequests;
    }

    // function getDeletedRequest() ownerOnly external view returns (RequestStruct[] memory) {
    //     return inactiveRequest;
    // }

    // function deleteRequest(uint256 reqId) external returns (bool) {
    //     require(authorOf[reqId] == msg.sender, "Unauthorized entity");

    //     for(uint i = 0; i < activeRequests.length; i++) {
    //         if(activeRequests[i].reqId == reqId) {
    //             activeRequests[i].deleted = Deactivated.YES;
    //             activeRequests[i].updated = block.timestamp;
    //             inactiveRequest.push(activeRequests[i]);
    //             delRequestOf[reqId] = authorOf[reqId];
    //             delete activeRequests[i];
    //             delete authorOf[reqId];
    //         }
    //     }

    //     requestOf[msg.sender]--;
    //     inactiveRequestCounter++;
    //     activeRequestCounter--;

    //     emit RequestAction (
    //         reqId,
    //         "Request DELETED",
    //         Deactivated.YES,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }
    
    // function restorDeletedRequest(
    //     uint256 reqId, 
    //     address author
    // ) ownerOnly external returns (bool) {
    //     require(delRequestOf[reqId] == author, "Unmatched Author");

    //     for(uint i = 0; i < inactiveRequest.length; i++) {
    //         if(inactiveRequest[i].reqId == reqId) {
    //             inactiveRequest[i].deleted = Deactivated.NO;
    //             inactiveRequest[i].updated = block.timestamp;

    //             activeRequests.push(inactiveRequest[i]);
    //             delete inactiveRequest[i];
    //             authorOf[reqId] = delRequestOf[reqId];
    //             delete delRequestOf[reqId];
    //         }
    //     }

    //     requestOf[author]++;
    //     inactiveRequestCounter--;
    //     activeRequestCounter++;

    //     emit RequestAction (
    //         reqId,
    //         "Request RESTORED",
    //         Deactivated.NO,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }
}