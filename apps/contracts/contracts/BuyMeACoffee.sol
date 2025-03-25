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
     * @dev buy a coffee for the contract owner
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the sale to storage
        sales.push(CoffeeSale(
            msg.sender,
            owner, // Owner is the recipient
            block.timestamp,
            msg.value,
            _name,
            _message
        ));

        // Send the VET to the owner
        (bool sent, ) = owner.call{value: msg.value}("");
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
     * @param _to recipient address
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function sendCoffee(
        address payable _to,
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the sale to storage
        sales.push(CoffeeSale(
            msg.sender,
            _to,
            block.timestamp,
            msg.value,
            _name,
            _message
        ));

        // Send the VET to the recipient
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send VET");

        // Emit event
        emit CoffeeSold(
            msg.sender,
            _to,
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
}
