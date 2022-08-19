//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Request {
    address public ownerReq;
    uint256 public activeRequestCounter = 0;
    uint256 public inactiveRequestCounter = 0;
    uint256 private requestCounter = 0;

    mapping(uint256 => address) public authorOfReq;
    mapping(uint256 => address) public delRequestOf;
    mapping(address => uint256) public requestOf;

    enum DeactivatedReq { NO, YES }

    modifier ownerOnlyReq(){
        require(msg.sender == ownerReq, "Owner reserved only");
        _;
    }

    constructor() {
        ownerReq = msg.sender;
    }

    struct RequestStruct {
        uint256 reqId;
        address manager;
        string status;
        uint256 amount;
        string description;
        address author;
        address requestor;
        DeactivatedReq deleted;
        uint256 created;
        uint256 updated;
    }

    RequestStruct[] activeRequests;
    RequestStruct[] inactiveRequest;

    event RequestAction (
        uint256 reqId,
        string actionType,
        DeactivatedReq deleted,
        address indexed executor,
        uint256 created
    );

    function createRequest(
        string memory status,
        address manager,
        uint256 amount,
        string memory description
    ) external returns (bool) {
        require(bytes(description).length > 0, "Description cannot be empty");

        requestCounter++;
        authorOfReq[requestCounter] = manager;
        requestOf[manager]++;
        activeRequestCounter++;

        activeRequests.push(
            RequestStruct(
                requestCounter,
                manager,
                status,
                amount,
                description,
                manager,
                msg.sender,
                DeactivatedReq.NO,
                block.timestamp,
                block.timestamp
            )
        );

        emit RequestAction (
            requestCounter,
            "REQUEST CREATED",
            DeactivatedReq.NO,
            manager,
            block.timestamp
        );

        return true;
    }

    function getRequests() external view returns (RequestStruct[] memory) {
        return activeRequests;
    }

    function deleteRequest(uint256 reqId) external returns (bool) {
        require(authorOfReq[reqId] == msg.sender, "Unauthorized entity");

        for(uint i = 0; i < activeRequests.length; i++) {
            if(activeRequests[i].reqId == reqId) {
                activeRequests[i].deleted = DeactivatedReq.YES;
                activeRequests[i].updated = block.timestamp;
                inactiveRequest.push(activeRequests[i]);
                delRequestOf[reqId] = authorOfReq[reqId];
                delete activeRequests[i];
                delete authorOfReq[reqId];
            }
        }

        requestOf[msg.sender]--;
        inactiveRequestCounter++;
        activeRequestCounter--;

        emit RequestAction (
            reqId,
            "Request DELETED",
            DeactivatedReq.YES,
            msg.sender,
            block.timestamp
        );

        return true;
    }
}