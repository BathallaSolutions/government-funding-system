
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Barangay {
    address public owner;
    uint256 public activeBarangayCounter = 0;
    uint256 public inactiveBarangayCounter = 0;
    uint256 private barangayCounter = 0;

    mapping(uint256 => address) public delBarangayOf;
    mapping(uint256 => address) public authorOf;
    mapping(address => uint256) public barangayOf;

    enum DeactivatedBrgy { NO, YES }

    struct BarangayStruct {
        uint256 brgyId;
        string status; // captain | mayor
        string name;  // kenn
        uint256 number; // 1
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
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    function createBarangay(
        string memory status,
        string memory name,
        uint256  number,
        uint256  positionx,
        uint256  positiony,
        uint256  width,
        uint256  height
    ) external returns (bool) {
        require(bytes(status).length > 0, "status cannot be empty");
        require(bytes(name).length > 0, "name cannot be empty");
        // require(bytes(number).length > 0, "number cannot be empty");
        // require(bytes(positionx).length > 0, "positionx cannot be empty");
        // require(bytes(positiony).length > 0, "positiony cannot be empty");
        // require(bytes(width).length > 0, "width cannot be empty");
        // require(bytes(height).length > 0, "height cannot be empty");

        barangayCounter++;
        authorOf[barangayCounter] = msg.sender;
        barangayOf[msg.sender]++;
        activeBarangayCounter++;

        activeBarangay.push(
            BarangayStruct(
                barangayCounter,
                status,
                name,
                number, 
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

    // function updateBarangay(
    //     uint256 brgyId,
    //     string memory amount,
    //     string memory description
    // ) external returns (bool) {
    //     require(authorOf[brgyId] == msg.sender, "Unauthorized entity");
    //     require(bytes(amount).length > 0, "amount cannot be empty");
    //     require(bytes(description).length > 0, "Description cannot be empty");

    //     for(uint i = 0; i < activeBarangay.length; i++) {
    //         if(activeBarangay[i].brgyId == brgyId) {
    //             activeBarangay[i].amount = amount;
    //             activeBarangay[i].description = description;
    //             activeBarangay[i].updated = block.timestamp;
    //         }
    //     }

    //     emit Barangay (
    //         brgyId,
    //         "Barangay UPDATED",
    //         DeactivatedBrgy.NO,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }

    function showBarangay(
        uint256 brgyId
    ) external view returns (BarangayStruct memory) {
        BarangayStruct memory o;
        for(uint i = 0; i < activeBarangay.length; i++) {
            if(activeBarangay[i].brgyId == brgyId) {
                o = activeBarangay[i];
            }
        }
        return o;
    }

    function getBarangay() external view returns (BarangayStruct[] memory) {
        return activeBarangay;
    }

    // function getDeletedBarangay() ownerOnly external view returns (BarangayStruct[] memory) {
    //     return inactiveBarangay;
    // }

    // function deleteBarangay(uint256 brgyId) external returns (bool) {
    //     require(authorOf[brgyId] == msg.sender, "Unauthorized entity");

    //     for(uint i = 0; i < activeBarangay.length; i++) {
    //         if(activeBarangay[i].brgyId == brgyId) {
    //             activeBarangay[i].deleted = DeactivatedBrgy.YES;
    //             activeBarangay[i].updated = block.timestamp;
    //             inactiveBarangay.push(activeBarangay[i]);
    //             delBarangayOf[brgyId] = authorOf[brgyId];
    //             delete activeBarangay[i];
    //             delete authorOf[brgyId];
    //         }
    //     }

    //     barangayOf[msg.sender]--;
    //     inactiveBarangayCounter++;
    //     activeBarangayCounter--;

    //     emit BarangayAction (
    //         brgyId,
    //         "Barangay DELETED",
    //         DeactivatedBrgy.YES,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }
    
    // function restorDeletedBarangay(
    //     uint256 brgyId, 
    //     address author
    // ) ownerOnly external returns (bool) {
    //     require(delBarangayOf[brgyId] == author, "Unmatched Author");

    //     for(uint i = 0; i < inactiveBarangay.length; i++) {
    //         if(inactiveBarangay[i].brgyId == brgyId) {
    //             inactiveBarangay[i].deleted = DeactivatedBrgy.NO;
    //             inactiveBarangay[i].updated = block.timestamp;

    //             activeBarangay.push(inactiveBarangay[i]);
    //             delete inactiveBarangay[i];
    //             authorOf[brgyId] = delBarangayOf[brgyId];
    //             delete delBarangayOf[brgyId];
    //         }
    //     }

    //     barangayOf[author]++;
    //     inactiveBarangayCounter--;
    //     activeBarangayCounter++;

    //     emit BarangayAction (
    //         brgyId,
    //         "Barangay RESTORED",
    //         DeactivatedBrgy.NO,
    //         msg.sender,
    //         block.timestamp
    //     );

    //     return true;
    // }
}