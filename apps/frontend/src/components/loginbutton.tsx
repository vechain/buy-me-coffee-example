import React from "react";
import { useWallet, useWalletModal } from "@vechain/vechain-kit";
import { FaWallet } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import { shortenAddress } from "../utils";

export function LoginButton() {
  const { open } = useWalletModal(); // this hook triggers the connection modal
  const { account } = useWallet();  // this hook is the state of the account, as soon as this account state updates, the component gets re-rendered
                                     // and the address get's rendered to the UI

  return (
    <Button
      id="veworld-button"
      size="md"
      onClick={open}
      leftIcon={<FaWallet />}
      loadingText="Connecting..."
      colorScheme="blue" 
      variant="solid"
      _hover={{ bg: "blue.600" }} 
    >
      {account ? shortenAddress(account.address) : "Connect VeWorld"}
    </Button>
  );
}