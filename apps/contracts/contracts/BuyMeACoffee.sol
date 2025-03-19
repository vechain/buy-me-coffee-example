// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BuyMeACoffee {
    // Event to emit when a Coffee purchase is made
    event CoffeeSold(
        address indexed from,
        address indexed to,
        uint256 timestamp,
        uint256 value,
        string name,
        string message
    );

    // Coffee sale struct
    struct CoffeeSale {
        address from;
        address to;
        uint256 timestamp;
        uint256 value;
        string name;
        string message;
    }

    // Address of contract deployer
    address payable owner;

    // List of all donations received from coffee purchases
    CoffeeSale[] sales;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored sales
     */
    function getSales() public view returns (CoffeeSale[] memory) {
        return sales;
    }

    /**
     * @dev buy a coffee for owner (sends an VET tip and leaves some details)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't buy coffee for free!");

        address payable recipient = owner; // experimental
        
        // Add the sale to storage
        sales.push(CoffeeSale(
            msg.sender,
            recipient,
            block.timestamp,
            msg.value,
            _name,
            _message
        ));

        // Send the VET to the recipient
        (bool sent, ) = recipient.call{value: msg.value}("");
        require(sent, "Failed to send VET");

        emit CoffeeSold(
            msg.sender,
            owner,
            block.timestamp,
            msg.value,
            _name,
            _message
        );
    }

    /**
     * @dev send coffee to a specific address
     * @param _to address to send coffee to (in string format)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function sendCoffee(
        string memory _to,
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "can't buy coffee for free!");
        
        // Convert string address to payable address
        address payable recipient = payable(addressFromString(_to)); // experimental
        
        // Add the sale to storage
        sales.push(CoffeeSale(
            msg.sender,
            recipient,
            block.timestamp,
            msg.value,
            _name,
            _message
        ));

        // Send the VET to the recipient
        (bool sent, ) = recipient.call{value: msg.value}("");
        require(sent, "Failed to send VET");

        // Emit event
        emit CoffeeSold(
            msg.sender,
            recipient,
            block.timestamp,
            msg.value,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(owner.send(address(this).balance));
    }

    /**
     * @dev helper function to convert string to address
     */
    function addressFromString(string memory _address) private pure returns(address) {
        bytes memory tempBytes = bytes(_address);
        uint160 addr = 0;
        uint160 b1;
        uint160 b2;
        
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            addr *= 256;
            b1 = uint160(uint8(tempBytes[i]));
            b2 = uint160(uint8(tempBytes[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
            else if ((b1 >= 65) && (b1 <= 70)) b1 -= 55;
            else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
            if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
            else if ((b2 >= 65) && (b2 <= 70)) b2 -= 55;
            else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
            addr += (b1 * 16 + b2);
        }
        return address(addr);
    }
}