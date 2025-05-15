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

# Buy Me a Coffee - Development Setup

This project uses a multi-package Yarn workspace with a frontend and contracts subprojects. To ease development, you can run the project inside a Docker dev container.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- Basic familiarity with Docker commands
- Yarn (optional, if running outside Docker)

---

## Running the Project Locally (without Docker)

Install dependencies:

```bash
yarn install
```

### Run the frontend:
```bash
yarn workspace @repo/fe dev
```
Open your browser at http://localhost:3000
 
## Running the Project in a Docker Dev Container
We provide a Docker container configured for this project, with all dependencies installed and ready to go.

### Build the Docker Image
Run this from the root project directory (where the .devcontainer folder is):

```bash
docker build -f .devcontainer/Dockerfile -t buy-me-coffee-dev .
```
### Run the Container
Start the container and mount your workspace inside it:

```bash
docker run -it --rm -p 3000:3000 -v $(pwd):/workspace buy-me-coffee-dev
```
If port 3000 is busy, map it to another port on your host, e.g.:
```bash
docker run -it --rm -p 3001:3000 -v $(pwd):/workspace buy-me-coffee-dev
```

Open your browser at http://localhost:3000 (or :3001 if remapped).

### Notes
The container uses Node.js 20.x on Alpine Linux with Yarn 4.9.1 enabled via Corepack.

The workspace root has dependencies managed via Yarn workspaces (apps/*, packages/*).

Smart contract compilation should be done inside the container at runtime (via yarn workspace @repo/contracts compile) due to environment constraints.

If you add new dependencies, rebuild the container or run yarn install inside it.

For Windows users, make sure Docker Desktop is properly configured for volume mounts and networking.

Useful Commands Inside the Container
Install dependencies (if needed):

```bash
yarn install
```
### Start frontend development server:

```bash
yarn workspace @repo/fe dev
```
### Compile contracts:

```bash
yarn workspace @repo/contracts compile
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
