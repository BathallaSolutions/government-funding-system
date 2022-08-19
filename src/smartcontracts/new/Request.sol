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
        uint256 amount;
        string description;
        address author;
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
        uint256 amount,
        string memory description
    ) external returns (bool) {
        require(bytes(description).length > 0, "Description cannot be empty");

        requestCounter++;
        authorOfReq[requestCounter] = msg.sender;
        requestOf[msg.sender]++;
        activeRequestCounter++;

        activeRequests.push(
            RequestStruct(
                requestCounter,
                amount,
                description,
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
            msg.sender,
            block.timestamp
        );

        return true;
    }

    function updateRequest(
        uint256 reqId,
        uint256 amount,
        string memory description
    ) external returns (bool) {
        require(authorOfReq[reqId] == msg.sender, "Unauthorized entity");
        // require(bytes(amount).length > 0, "amount cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        for(uint i = 0; i < activeRequests.length; i++) {
            if(activeRequests[i].reqId == reqId) {
                activeRequests[i].amount = amount;
                activeRequests[i].description = description;
                activeRequests[i].updated = block.timestamp;
            }
        }

        emit RequestAction (
            reqId,
            "REQUEST UPDATED",
            DeactivatedReq.YES,
            msg.sender,
            block.timestamp
        );

        return true;
    }

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

    // function getDeletedRequest() ownerOnlyReq external view returns (RequestStruct[] memory) {
    //     return inactiveRequest;
    // }

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
    
    // function restorDeletedRequest(
    //     uint256 reqId, 
    //     address author
    // ) ownerOnlyReq external returns (bool) {
    //     require(delRequestOf[reqId] == author, "Unmatched Author");

    //     for(uint i = 0; i < inactiveRequest.length; i++) {
    //         if(inactiveRequest[i].reqId == reqId) {
    //             inactiveRequest[i].deleted = DeactivatedReq.NO;
    //             inactiveRequest[i].updated = block.timestamp;

    //             activeRequests.push(inactiveRequest[i]);
    //             delete inactiveRequest[i];
    //             authorOfReq[reqId] = delRequestOf[reqId];
    //             delete delRequestOf[reqId];
    //         }
    //     }

    //     requestOf[author]++;
    //     inactiveRequestCounter--;
    //     activeRequestCounter++;

    //     emit RequestAction (
    //         reqId,
    //         "Request RESTORED",
    //         DeactivatedReq.NO,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }

}