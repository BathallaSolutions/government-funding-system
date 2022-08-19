//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Barangay {
    address public ownerBr;
    uint256 public activeBarangayCounter = 0;
    uint256 public inactiveBarangayCounter = 0;
    uint256 private barangayCounter = 0;

    mapping(uint256 => address) public delBarangayOf;
    mapping(uint256 => address) public authorOfBrgy;
    mapping(address => uint256) public barangayOf;

    enum DeactivatedBrgy { NO, YES }
    enum Deactivated { NO, YES }

    struct BarangayStruct {
        uint256 brgyId;
        string status; // captain | mayor
        string name;  // kenn
        uint256 number; // 1
        string tokenaddress;
        uint256 positionx;
        uint256 positiony;
        uint256 width;
        uint256 height;
        address author;
        DeactivatedBrgy deleted;
        uint256 created;
        uint256 updated;
    }

    BarangayStruct[] activeBarangay;
    BarangayStruct[] inactiveBarangay;

    event BarangayAction (
        uint256 brgyId,
        string actionType,
        DeactivatedBrgy deleted,
        address indexed executor,
        uint256 created
    );

    modifier ownerOnly(){
        require(msg.sender == ownerBr, "Owner reserved only");
        _;
    }

    constructor() {
        ownerBr = msg.sender;
    }

    function createBarangay(
        string memory status,
        string memory name,
        uint256  number,
        string  memory tokenaddress,
        uint256  positionx,
        uint256  positiony,
        uint256  width,
        uint256  height
    ) external returns (bool) {
        require(bytes(status).length > 0, "status cannot be empty");
        require(bytes(name).length > 0, "name cannot be empty");

        barangayCounter++;
        authorOfBrgy[barangayCounter] = msg.sender;
        barangayOf[msg.sender]++;
        activeBarangayCounter++;

        activeBarangay.push(
            BarangayStruct(
                barangayCounter,
                status,
                name,
                number, 
                tokenaddress, 
                positionx,
                positiony,
                width,
                height,
                msg.sender,
                DeactivatedBrgy.NO,
                block.timestamp,
                block.timestamp
            )
        );

        emit BarangayAction (
            barangayCounter,
            "Barangay CREATED",
            DeactivatedBrgy.NO,
            msg.sender,
            block.timestamp
        );

        return true;
    }

    function getBarangay() external view returns (BarangayStruct[] memory) {
        return activeBarangay;
    }
}