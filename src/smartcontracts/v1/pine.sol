    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.7;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    contract Pine is ERC20, Ownable {
        struct Barangays
        {
            string status; // captain | mayor
            string name;  // kenn
            string number; // 1
            string tokenAddress; // 0x1111
            string positionx;
            string positiony;
            string width;
            string height;
        }

        struct Requests
        {
            string index; 
            string status; // accepted | pending | rejected
            string amount; // 1,000,000 PINE
            string description; // for cordova to seaside bridge
        }

        mapping (address => Barangays[]) public Brgy;
        mapping (address => Requests[]) public Rqst;

        constructor() ERC20("Pine5", "PINE5") {
            _mint(msg.sender, 1000000 * 10 ** decimals());
        }

        function createBarangay(Barangays memory bar) external
        {
            Brgy[msg.sender].push(Barangays({
                status:bar.status,
                name:bar.name,
                number:bar.number,
                tokenAddress:bar.tokenAddress,
                positionx: bar.positionx,
                positiony: bar.positiony,
                width: bar.width,
                height: bar.height
            }));
        }

        function getBarangayCount() external view returns (uint256)
        {
            return Brgy[msg.sender].length;
        }

        function getBarangay(uint barangayIndex) external view returns (Barangays memory)
        {
            Barangays storage brgy = Brgy[msg.sender][barangayIndex];
            return brgy;
        }

        function updateBarangay(uint256 barangayIndex, Barangays memory bar) external 
        {
            Brgy[msg.sender][barangayIndex].status = bar.status;
            Brgy[msg.sender][barangayIndex].name = bar.name;
            Brgy[msg.sender][barangayIndex].number = bar.number;
            Brgy[msg.sender][barangayIndex].tokenAddress = bar.tokenAddress;
            Brgy[msg.sender][barangayIndex].positionx = bar.positionx;
            Brgy[msg.sender][barangayIndex].positiony = bar.positiony;
            Brgy[msg.sender][barangayIndex].width = bar.width;
            Brgy[msg.sender][barangayIndex].height = bar.height;
        }

        function deleteBarangay(uint256 barangayIndex) external
        {
            delete Brgy[msg.sender][barangayIndex];
        }

        function createRequest(Requests memory rqst) external
        {
            Rqst[rqst.index].push(Requests({
                status:rqst.status,
                amount:rqst.amount,
                description:rqst.description
            }));
        }

        function getRequestCount(uint requestIndex) external view returns (uint256)
        {
            return Rqst[requestIndex].length;
        }

        function getRequest(uint requestIndex) external view returns (Requests memory)
        {
            Requests storage rqst = Rqst[requestIndex][requestIndex];
            return rqst;
        }

        function updateRequest(uint256 requestIndex, Requests memory bar) external 
        {
            Rqst[msg.sender][requestIndex].status = bar.status;
            Rqst[msg.sender][requestIndex].amount = bar.amount;
            Rqst[msg.sender][requestIndex].description = bar.description;
        }

        function deleteRequest(uint256 index) external
        {
            delete Rqst[msg.sender][index];
        }
    }