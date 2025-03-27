import React, { useState, useEffect } from "react";
import { useWallet } from "@vechain/vechain-kit";
import { ThorClient } from "@vechain/sdk-network";
import { Address } from "@vechain/sdk-core";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { THOR_URL } from "../config/constants.ts";

// This component shows a user's VET (VeChain) balance
export function VetBalance() {
  // State to keep track of the balance and if it's loading
  const [balance, setBalance] = useState(0); // The VET amount
  const [isLoading, setIsLoading] = useState(false); // Shows if we're getting the balance

  // Get the user's wallet address from the useWallet hook
  const { account } = useWallet();

  // This function gets the balance from the VeChain network
  const getBalance = async () => {
    // If there's no account, don't do anything
    if (!account) return;

    setIsLoading(true); // Show loading while we get the balance

    try {
      // Connect to VeChain network
      const thorClient = ThorClient.at(THOR_URL);

      // Get the account info using the user's address
      const accountInfo = await thorClient.accounts.getAccount(
        Address.of(account.address)
      );

      const balanceInWei = BigInt(accountInfo.balance);
      const balanceInVET = Number(balanceInWei) / 10 ** 18;

      // Update the balance with the VET amount
      setBalance(balanceInVET);
    } catch (error) {
      console.log("Error getting balance:", error); // Show error in console
    }

    setIsLoading(false); // Done loading
  };

  // This runs when the component loads or account changes
  useEffect(() => {
    getBalance(); // Get the balance when the component starts
  }, []); // Only run again if account changes

  // Show loading message while getting balance
  if (isLoading) {
    return (
      <Stat mt={6}>
        <StatLabel>Your VET Balance:</StatLabel>
        <StatNumber>Loading...</StatNumber>
      </Stat>
    );
  }

  // If there's no account, show nothing
  if (!account) {
    return null;
  }

  // Show the balance when we have it
  return (
    <Stat mt={6}>
      <StatLabel>Your VET Balance:</StatLabel>
      <StatNumber>{balance.toFixed(2)} VET</StatNumber>
    </Stat>
  );
}
