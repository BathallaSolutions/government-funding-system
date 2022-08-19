// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Barangay.sol";
import "./Request.sol";

contract Pine is ERC20, Ownable, Barangay, Request {
    constructor() ERC20("Pine1", "PINE1") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}