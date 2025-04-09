# Start guide to develop a Dapp

frontend: apps/frontend <br/>
contracts: apps/contracts

## Overview
By the end of this Doc, you'll be able to develop a complete Dapp that's able to Connect to a Wallet, Write Data to the Blockchain and Read Data from the Blockchain.

**We made this tutorial in such a way that you can either start from the Frontend (Chapter 1) or the Smart Contract (Chapter 6).**

## Table of Contents
1. [Frontend - How React works](#how-react-works)
2. [Frontend - Connect your React app to a web3 Wallet](#connect-your-react-app-to-a-web3-wallet)
3. [Frontend - Connect to a Blockchain Node](#connect-to-a-blockchain-node)
4. [Frontend - Write Data to the Blockchain](#write-data-to-the-blockchain)
5. [Frontend - Read Data from the Blockchain](#read-data-from-the-blockchain)
6. [Smart Contracts - How a Smart Contract Works](#how-a-smart-contract-works)
7. [Smart Contracts - How to Write a Smart Contract](#how-to-write-a-smart-contract)
8. [Smart Contracts - How and Where to Deploy a Smart Contract](#how-and-where-to-deploy-a-smart-contract)
9. [Smart Contracts - How to link a Smart Contract with a Dapp](#how-to-link-a-smart-contract-with-a-dapp)


## How React works

### 1. What is React?
React is a **JavaScript library** for building **user interfaces**. In a DApp, React helps manage **UI components** efficiently while interacting with the blockchain.

### 2. React State in a DApp
State in React refers to **data that changes over time**. In a DApp, state often includes:

- **User wallet connection** (e.g., VeWorld)
- **Blockchain data** (e.g., smart contract state, user balance)
- **Transaction status** (pending, confirmed, failed)

### 3. How React State Works in a DApp
1. **Initialize state** with `useState` or `useReducer`.
2. **Manages State** React has its own built-in reconciliation algorithm and listens for state changes. Each time a state is updated via its hooks (e.g., useState, useReducer), React schedules a re-render, updating the component with the new state.
3. **Fetch blockchain data** (e.g., `dapp-kit` or `vechain-kit`).
4. **Update state** based on blockchain events or user actions.
5. **Render UI** dynamically based on state changes.

 

## Connect your React app to a web3 Wallet

### 1. Introduction
React can interact with **Web3 wallets** like **VeWorld** to connect users to the **VeChain** blockchain. This allows them to sign transactions, view balances, and interact with smart contracts.

### 2. Prerequisites
- Install `dapp-kit` or `vechain-kit` to interact with the blockchain.
- Ensure **VeWorld Wallet** is installed in the browser.
- Use **VeChain's Thor API** for interaction.

### 3. Connecting React to VeWorld Wallet

#### **Example: Using `dapp-kit`**
```jsx
import React from "react";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";

export function ConnectWalletButton() {
  const { open } = useWalletModal(); 
  const { account, signer } = useWallet();  

  return (
    <button onClick={open}>
          {account || "Connect VeWorld"}
    </button>
  );
}
```

### 4. Explanation

#### Imports VeChain DApp Kit Hooks:
- **`useWallet()`** → Gets the connected wallet account.
- **`useWalletModal()`** → Opens the wallet connection modal.

#### Defines a Button:
- **Displays** `"Connect VeWorld"` if no account is connected.
- **Shows** the connected wallet address when an account is connected.
- **Calls** `open()` to launch the **VeWorld wallet modal** when clicked.

 

## Connect to a Blockchain Node

### 1. Introduction
React can interact with **VeWorld nodes** to connect users to the **VeChain** blockchain. This allows them to fetch data, interact with smart contracts, and read transaction history.

### 2. Prerequisites
- Install `@vechain/sdk-network` to interact with the blockchain.
- Use **VeChain's Thor API** to communicate with a **VeWorld node**.
- Ensure you have the **smart contract address** and **ABI**.

### 3. Connecting React to a VeWorld Node

#### **Example: Using `ThorClient`**
```jsx
import { ThorClient } from "@vechain/sdk-network";

const THOR_URL = "https://mainnet.vechain.org"; 
const CONTRACT_ADDRESS = '0xbf0f3f5b273693bd6552567631d2615ffd5f4b35'
 const COFFEE_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, ...
 ]

  const thorClient = ThorClient.at(THOR_URL);

  const contract = thorClient.contracts.load(
    CONTRACT_ADDRESS,
    COFFEE_CONTRACT_ABI
  );
  ```
### 4. Explanation

#### 📌 Imports VeChain SDK:
- **`ThorClient.at(THOR_URL)`** → Connects to a **VeWorld node**.
- **`contracts.load(CONTRACT_ADDRESS, ABI)`** → Loads the smart contract that we will build in Chapter [Smart Contracts - How and Where to Deploy a Smart Contract](#creating-and-writing-a-contract)

 

## Write Data to the Blockchain

### 1. Introduction
This function allows users to **send a "coffee"** (a small token payment) to another wallet on the **VeChain blockchain**. It interacts with a **smart contract** and ensures that transactions are processed securely.

### 2. Prerequisites
- Install **VeChain SDK** (`@vechain/sdk-network`) to interact with the blockchain.
- Ensure the **VeWorld Wallet** is connected and authorized.
- Use **VeChain's Thor API** to broadcast transactions.


### 3. Sending a Coffee Transaction

#### **Example: Sending Coffee with VeChain**
```jsx
import { ThorClient } from "@vechain/sdk-network";

const THOR_URL = "https://mainnet.vechain.org"; 
const CONTRACT_ADDRESS = '0xbf0f3f5b273693bd6552567631d2615ffd5f4b35'
 const COFFEE_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, ...
 ]

const onSendCoffee = async () => {

    if (!address.trim() || !message.trim() || !name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter recipient address and a message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

  try {
    // Prepare the smart contract function call
    const contractClause = Clause.callFunction(
      Address.of(CONTRACT_ADDRESS),
      ABIContract.ofAbi(COFFEE_CONTRACT_ABI).getFunction("sendCoffee"),
      [address, name, message],
      VET.of(1),
    );

    // Sign and send the transaction
    const tx = () =>
      signer?.sendTransaction({
          clauses: [
              {
                  to: contractClause.to,
                  value: contractClause.value.toString(),
                  data: contractClause.data.toString(),

              },
            ],
          comment: `${account} sent you a coffee!`,
      });

      
    const result = await tx();

    // Wait for transaction confirmation
    const thorClient = ThorClient.at(THOR_URL);
    const txReceipt = await thorClient.transactions.waitForTransaction(result);

    if (txReceipt?.reverted) {
      setTxStatus(TransactionStatus.Reverted);
      toast({
        title: "Transaction Failed",
        description: "The transaction was reverted.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setTxStatus(TransactionStatus.Success);
      toast({
        title: "Success!",
        description: "Thank you, the coffee was sent! ☕",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  } catch (error) {
    console.error("Error sending coffee:", error);
    setTxStatus(TransactionStatus.Reverted);
    toast({
      title: "Error",
      description: "An error occurred while sending the coffee.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } 
};
```

### 4. Explanation

#### **Validates User Input:**
- Ensures **recipient address**, **name**, and **message** are provided before proceeding.
- Displays a **warning notification** if any information is missing.

#### **Prepares the Smart Contract Call:**
- Uses `Clause.callFunction()` to **encode** the `sendCoffee` function call.
- Sends **1 VET** along with the transaction.

#### **Signs and Sends the Transaction:**
- Uses `vendor.sign("tx", [...])` to **digitally sign** the transaction.
- Calls `tx.request()` to **send the transaction** to the VeChain blockchain.

#### **Waits for Transaction Confirmation:**
- Uses `thorClient.transactions.waitForTransaction(txid)` to **monitor the transaction**.
- If the transaction is **reverted**, an **error message** is displayed.
- If the transaction is **successful**, a **confirmation toast** appears.

### 5. Summary
✅ **Validates inputs** before sending a transaction.  
✅ **Encodes and signs** a smart contract call on VeChain.  
✅ **Waits for transaction confirmation** and handles status updates.  
✅ **Provides user feedback** through toasts and UI updates.  

Now, your DApp allows users to **send a "coffee" transaction** on the VeChain blockchain! 🚀

## Read Data from the Blockchain

### 1. Introduction
This function allows users to **fetch the transaction history** (e.g., coffee donations) from the **VeChain blockchain**. It interacts with a **smart contract** to retrieve all past donations and displays them in the UI.

### 2. Prerequisites
- Install **VeChain SDK** (`@vechain/sdk-network`) to interact with the blockchain.
- Ensure the **VeWorld Wallet** is connected.
- Use **VeChain's Thor API** to interact with the smart contract.

### 3. Fetching the Transaction History

#### **General Workflow**
```jsx
import { ThorClient } from "@vechain/sdk-network";

const THOR_URL = "https://mainnet.vechain.org"; 
const CONTRACT_ADDRESS = '0xbf0f3f5b273693bd6552567631d2615ffd5f4b35'
 const COFFEE_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, ...
 ]

const [history, setHistory] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const thorClient = ThorClient.at(THOR_URL);
const contract = thorClient.contracts.load(
  config.CONTRACT_ADDRESS,
  COFFEE_CONTRACT_ABI
);

const getHistory = async () => {
  setIsLoading(true);
  try {
    const salesResponse = await contract.read.getSales(); // Fetch sales data from contract
    const allSales = salesResponse[0]; // Extract sales data
    setHistory([...allSales]); // Update history state
  } catch (e) {
    if (e instanceof Error) {
      alert("Unable to load donation history: " + e.message); // Error handling
    }
  } finally {
    setIsLoading(false); // Stop loading indicator
  }
};

// Fetch history on component mount 
useEffect(() => {
  getHistory();
}, []); 
```

### 4. Explanation

#### **State Management:**
- **`history`** → Holds the list of previous transactions (coffee donations).
- **`isLoading`** → Tracks whether data is being fetched, controlling the loading UI.

#### **Connects to the VeChain Node:**
- Uses `ThorClient.at(THOR_URL)` to connect to the **VeChain blockchain**.
- Loads the **smart contract** with the provided **address** and **ABI**.

#### **Fetches Transaction History:**
- Calls the `getSales()` function on the contract to **fetch transaction data**.
- **Updates the state** with the fetched transaction history.
- **Displays a loading indicator** while data is being fetched.

#### **Handles Errors:**
- Catches any errors that occur during the fetch and **displays an alert** with the error message.

#### **Fetches History on Component Mount:**
- Uses `useEffect()` to trigger fetching when the component **mounts**.

### 5. Summary
✅ **Fetches transaction history** from the VeChain blockchain.  
✅ **Updates the UI** with the list of previous donations.  
✅ **Handles loading and error states** to provide feedback to users.  

Now, your DApp allows users to **view the transaction history** of coffee donations on the VeChain blockchain! 🚀

 
## How a Smart Contract Works

### 1. Introduction
A **smart contract** on **VeChain** is a self-executing contract where the terms of the agreement are written directly into code. It runs on the **VeChainThor blockchain** and allows for automated, trustless transactions without intermediaries.

### 2. Key Components
- **VeChainThor Blockchain**: The platform on which smart contracts are deployed.
- **Smart Contract Code**: Written in **Solidity**, it contains the logic of the contract.
- **VTHO**: The native cryptocurrency used to pay for gas and computation on the VeChain network.
- **VET**: The native cryptocurrency on the VeChain network.

### 3. How It Works
- **Deployment**: The smart contract is **deployed** on the VeChainThor blockchain. Once deployed, the contract is immutable and can’t be changed.
- **Interaction**: Users and other contracts can **interact** with the deployed contract by calling its functions and passing parameters (e.g., sending tokens, updating state).
- **Execution**: When a user interacts with the smart contract (e.g., sends a transaction), the contract executes its predefined logic automatically.
- **Consensus**: Transactions that involve the smart contract are validated and recorded by the VeChainThor nodes through a **proof-of-authority (PoA)** consensus mechanism.

### 4. Example Use Cases
- **Token Transfers**: Automating the transfer of tokens (e.g., coffee donation in DApps).
- **Supply Chain Management**: Tracking products and assets along the supply chain.
- **Decentralized Applications (DApps)**: Enabling decentralized applications to run securely without relying on central authorities.


### 5. Summary
- **Smart contracts** are **self-executing code** that operates on the VeChainThor blockchain.
- They allow for **trustless transactions**, **automation**, and **decentralized applications**.
- Interactions with the contract are **automated** and validated by the VeChain network's consensus mechanism.

By using smart contracts on VeChain, developers can build secure, transparent, and decentralized applications. 🚀

## How to Write a Smart Contract

### 1. Introduction
A smart contract on **VeChain** is a self-executing contract where the terms of the agreement are written directly into the code. Here's a breakdown of key sections of a **BuyMeACoffee** contract.

### 2. Example Contract Snippets

#### **Event Declaration:**
An event is emitted whenever a coffee purchase is made. This allows for easy tracking of transactions.

```solidity
event CoffeeSold(
    address indexed from,
    address indexed to,
    uint256 timestamp,
    uint256 value,
    string name,
    string message
);
```
**CoffeeSold:** Event triggered when a coffee is bought.
**from:** Address of the purchaser.
**to:** Address of the recipient (owner).
**value:** Amount of VET paid.
**name:** Name of the coffee buyer.
**message:** A personalized message from the buyer.

#### **Function to Buy Coffee:**
```solidity
function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "can't buy coffee for free!");

    // Emit the event to signal that coffee was bought
    emit CoffeeSold(msg.sender, owner, block.timestamp, msg.value, _name, _message);

    // Transfer the VET to the owner
    (bool sent, ) = owner.call{value: msg.value}("");
    require(sent, "Failed to send VET");
}
```
**msg.value:** The amount of VET being sent with the transaction.
**emit CoffeeSold:** Triggers the CoffeeSold event.
**owner.call{value: msg.value}(""):** Sends the VET to the owner.


#### **Function to Fetch Sales History:**
```solidity
function getSales() public view returns (CoffeeSale[] memory) {
    return sales;
}
```
**getSales:** Fetches the list of all sales (coffee donations) stored in the contract.

### 3. Summary
- Smart contracts on VeChain enable automated transactions and event-based interactions.
- Events track significant actions (like buying coffee).
- Functions handle transactions, such as sending VET and storing purchase details.

## How and Where to Deploy a Smart Contract

### 1. Introduction
Deploying a smart contract on the **VeChainThor blockchain** involves compiling your contract, configuring the deployment scripts, and running the deployment process using tools like **Hardhat**. Hardhat is a development framework that makes it easier to work with Ethereum-compatible blockchains like VeChain.

### 2. Prerequisites
Before deploying a smart contract to VeChain, make sure you have:
- **Hardhat** installed and configured for VeChain.
- A VeChain account with VET (VeChain's cryptocurrency) for gas fees.
- The contract code ready to be deployed.
- Network configuration for **VeChain Solo** or **VeChain Testnet**.

### 3. Deployment Steps

1. **Compile the Smart Contract:**
   The `compile` script compiles your smart contract using Hardhat:
   ```json
   "compile": "npx hardhat compile"
   ```
2. **Deploying to VeChain Network:**

#### Solo - private/local blockchain node for testing
Use the `deploy-solo` script to deploy your smart contract to a local VeChain Solo network (ideal for local development and testing):

```json
"deploy-solo": "npx hardhat run scripts/deploy.ts --network vechain_solo"
```
To start the Solo Network you need to have [Docker](https://www.docker.com/) installed and running.

**Also for Solo development:**
When on browser, open your desired Wallet go to Settings -> Network -> Add Custom Network and add the Network:
Name: Solo
URL: http://localhost:<port> - the port is the port defined in docker for the contracts canister (docker default port: 8669)

#### Testnet - Testnet for Vechain
Use the `deploy-solo` script to deploy your smart contract to a local VeChain Solo network (ideal for local development and testing):

```json
"deploy-testnet": "npx hardhat run scripts/deploy.ts --network vechain_testnet",
```

**Important:**
In order to be able to deplot to Testnet, you'll need to pay gas fees (VTHO) for the deployment, you can get them here: [VTHO Faucet](https://faucet.vecha.in/)


## Contract Address and ABI in VeChain

#### 1. **Contract Address**
- The **contract address** is a unique identifier for a deployed smart contract on the blockchain. It acts like an address where the contract resides.
- When you deploy a smart contract to the **VeChain** blockchain (or any other blockchain), the contract gets assigned an address.
- This address is used by other applications (like your DApp) to interact with the contract, call functions, or send transactions.

#### 2. **ABI (Application Binary Interface)**
- The **ABI** is a JSON object that defines how the smart contract's functions can be called and what data it expects.
- It acts as a bridge between the smart contract and the DApp (or any other external application). 
- It describes the functions, inputs, outputs, and event logs of the contract.
- Without the ABI, you can't interact with the contract because it explains how data is structured and how to send transactions to the contract.

---

## How to link a Smart Contract with a Dapp

1. **Deploy the Smart Contract:**
   - First, deploy the smart contract to the **VeChain** blockchain. You’ll get a **contract address** and an **ABI**.
   
2. **Import the ABI into Your DApp:**
   - In your DApp, you’ll need to include the **ABI** and **contract address**. This allows your DApp to understand the smart contract's methods and interact with it.

```jsx
const CONTRACT_ADDRESS = '0xbf0f3f5b273693bd6552567631d2615ffd5f4b35'

 const COFFEE_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }, ...
 ]
 ```

3. **Connect the DApp to VeChain:**
- Use a **Web3 provider** (like **VeChain's Web3 SDK** or **dapp-kit**) to connect your DApp to the VeChain blockchain.
- This allows your DApp to **send transactions**, **call contract functions**, and **listen for events** from the contract.

4. **Interact with the Smart Contract:**
- Using the **contract address** and **ABI**, you can call functions defined in the smart contract, like:
  - **Transferring tokens**
  - **Fetching data**
  - **Interacting with other smart contract methods**
