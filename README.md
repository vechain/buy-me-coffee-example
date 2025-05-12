# Buy Me A Coffee DApp

frontend: apps/frontend <br/>
contracts: apps/contracts

## Overview
The "Buy Me A Coffee" DApp allows users to send coffee donations to the contract owner. It is built using Solidity for the smart contract and can be deployed using Hardhat.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Creating and Writing a Contract](#creating-and-writing-a-contract)
4. [Deploying the Contract](#deploying-the-contract)
5. [How the DApp Works](#how-the-dapp-works)
6. [Functions Overview](#functions-overview)

## Prerequisites
- Node.js and npm installed
- Hardhat installed globally (`npm install -g hardhat`)
- A wallet (e.g., MetaMask) for interacting with the Ethereum network

## Installation
Clone the repository:
   ```bash
   git clone <repository-url>
   cd buy-me-a-coffee
```
## Creating and Writing a Contract

  ```bash
cd apps/contracts/contracts
```
Create a new Solidity file (e.g., MyNewContract.sol) and define your contract structure. You can use the BuyMeACoffee.sol as a reference.

## Deploying the Contract
Modify the deployment script in the scripts directory.

Run the deployment script using Hardhat:
  ```bash
npm run compile
```

To deploy to Solo node:
  ```bash
npm run deploy-solo
```

To deploy to Testnet:
  ```bash
npm run deploy-testnet
```

To deploy to Mainnet:
  ```bash
npm run deploy-mainnet
```

### How the DApp Works
The DApp allows users to purchase coffee for the owner by sending a specified amount of VET. Users can also send coffee to specific addresses with a message.

### Functions Overview
1. getSales() <br/>
**Description**: Fetches all stored coffee sales.
   - **Functionality**:
     - **Returns**: An array of `CoffeeSale` structs, each containing details about a coffee purchase.
     - **Usage**: This function is called by the frontend to display the transaction history in the [TransactionHistory](cci:1://file:///Users/andreas.frank/work/buy-me-a-coffee/apps/frontend/src/components/txhistory.tsx:48:0-168:1) component.


2. buyCoffee(string memory _name, string memory _message) <br/>
**Description**: Allows a user to buy coffee for the contract owner.
   - **Parameters**:
     - `_name`: The name of the coffee purchaser.
     - `_message`: A personalized message from the purchaser.
   - **Functionality**:
     - **Validation**: Ensures that the purchase amount is greater than zero.
     - **Storage**: Adds the sale details to the `sales` array, storing the transaction data on the blockchain.
     - **VET Transfer**: Sends the VET value to the contract owner.
     - **Event Emission**: Emits the `CoffeeSold` event to notify listeners about the purchase.

3. sendCoffee(address payable _to, string memory _name, string memory _message) <br/> 
**Description**: Sends coffee to a specified address.
   - **Parameters**:
     - `_to`: The recipient's address.
     - `_name`: The name of the coffee purchaser.
     - `_message`: A personalized message from the purchaser.
   - **Functionality**:
     - **Validation**: Checks that the purchase amount is valid.
     - **Storage**: Similar to `buyCoffee`, it records the sale details.
     - **VET Transfer**: Sends the specified amount of VET to the recipient's address.
     - **Event Emission**: Emits the `CoffeeSold` event to indicate a successful transaction.

4. withdrawTips() <br/>
**Description**: Allows the contract owner to withdraw the balance stored in the contract.
   - **Functionality**:
     - **Access Control**: Ensures that only the owner can execute this function.
     - **VET Transfer**: Transfers the entire balance from the contract to the owner's address.

## Frontend Overview
The frontend of the "Buy Me A Coffee" DApp is built using React and Vite. It provides an interactive user interface for users to buy coffee for the owner, view transaction history, and send coffee with personalized messages.

### Key Components

#### App.tsx
- **Purpose**: Serves as the main entry point for the DApp. It sets up the overall structure and layout of the application.
- **Functionality**:
  - **State Management**: Uses `useState` to manage the `refetchHistory` state, which triggers updates to the transaction history after a purchase.
  - **Component Integration**: Includes essential components like `AppHeader`, `BuyCoffee`, [TransactionHistory](cci:1://file:///Users/andreas.frank/work/buy-me-a-coffee/apps/frontend/src/components/txhistory.tsx:48:0-168:1), and `SendCoffee`, creating a cohesive user experience.
  - **User Interaction**: Provides a responsive layout that adapts to user actions, ensuring a smooth interaction with the DApp.

#### BuyCoffee.tsx
- **Purpose**: Allows users to buy coffee for the contract owner.
- **Functionality**:
  - **User Input**: Provides a modal where users can enter their name, message, and the amount of VET they wish to send.
  - **Blockchain Interaction**: Utilizes the VeChain DApp Kit to connect to the smart contract and call the `buyCoffee` function.
  - **Validation**: Ensures that the amount sent is greater than zero, preventing free donations.
  - **Event Handling**: Emits the `CoffeeSold` event upon successful purchase, which updates the transaction history.

#### TransactionHistory.tsx
- **Purpose**: Displays a list of all coffee purchases made.
- **Functionality**:
  - **Data Fetching**: Calls the `getSales` function from the smart contract to retrieve the transaction history.
  - **Table Display**: Renders the transaction history in a table format, showing details like timestamp, sender, name, message, and value.
  - **User Experience**: Implements animations for a more engaging interface when displaying transaction data.

#### SendCoffee.tsx
- **Purpose**: Enables users to send coffee to specific addresses.
- **Functionality**:
  - **Recipient Input**: Allows users to specify the recipient's address along with their name and message.
  - **Blockchain Interaction**: Calls the `sendCoffee` function from the smart contract to send the specified amount of VET to the recipient.
  - **Validation**: Similar to `BuyCoffee`, it ensures that the amount sent is valid and greater than zero.
