import React from "react";
import { FaWallet } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import { shortenAddress } from "../utils";
import { useConnectModal, useAccountModal, useWallet } from '@vechain/vechain-kit';
import { WalletButton } from '@vechain/vechain-kit';

export function LoginButton() {
  const { connection } = useWallet();
    
  const { 
      open: openConnectModal, 
      close: closeConnectModal, 
      isOpen: isConnectModalOpen 
  } = useConnectModal();
  
   const { 
      open: openAccountModal, 
      close: closeAccountModal, 
      isOpen: isAccountModalOpen 
  } = useAccountModal();
  
  if (!connection.isConnected) {
      return (
          <button onClick={openConnectModal}> Connect </button>
      );
  }
  
  return (
      <button onClick={openAccountModal}> View Account </button>
  );
}