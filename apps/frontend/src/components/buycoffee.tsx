import React, { useState, useEffect } from "react";
import { useConnex, useWallet } from "@vechain/vechain-kit";
import { useSendTransaction } from "@vechain/vechain-kit";
import { ABIContract, Address, Clause, VET } from "@vechain/sdk-core";
import { ThorClient } from "@vechain/sdk-network";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Input,
  Text,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import coffeeLogo from "../assets/buy-coffee.png";
import { COFFEE_CONTRACT_ABI, config } from "@repo/config-contract";
import { THOR_URL } from "../config/constants";
import { VetBalance } from "./vetbalance";
import { useBuyCoffee } from "../hooks/useBuyCoffee";
import "./buycoffee.css";

enum TransactionStatus {
  Pending = "pending",
  Success = "success",
  Error = "error",
}

export function BuyCoffee({ refetch }) {
  // Split form data into separate states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useWallet();
  const toast = useToast();

  const { buyCoffee, isPending, status, error, txReceipt } =
    useBuyCoffee(account);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  // Handle form submissions
  const onSendCoffee = async () => {
    if (!name.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and a message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const contractClause = Clause.callFunction(
      Address.of(config.CONTRACT_ADDRESS),
      ABIContract.ofAbi(COFFEE_CONTRACT_ABI).getFunction("buyCoffee"),
      [name, message],
      VET.of(1),
      { comment: "buy a coffee" }
    );

    try {
      setIsLoading(true);
      onModalClose();

      await buyCoffee([
        {
          to: contractClause.to,
          value: contractClause.value.toString(),
          data: contractClause.data.toString(),
          comment: `${account} sent you a coffee!`,
        },
      ]);
    } catch (error) {
      console.error("Error sending coffee:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending the coffee.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      if (txReceipt) {
        setTxId(txReceipt?.meta.txID);
        const thorClient = ThorClient.at(THOR_URL);

        // Wait for confirmation
        const txReceiptStatus =
          await thorClient.transactions.waitForTransaction(
            txReceipt?.meta.txID
          );

        if (txReceiptStatus?.reverted) {
          toast({
            title: "Transaction Failed",
            description: "The transaction was reverted.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success!",
            description: "Thank you for the coffee! ☕",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Open the drawer only after success
          onDrawerOpen();
          refetch(txReceipt?.meta.txID);
        }
      }
    }
  };

  const handleSendCoffee = () => {
    setTxId(null);
    setName("");
    setMessage("");
    onModalOpen();
  };

  useEffect(() => {
    refetch(txReceipt?.meta.txID);
  }, [isPending]);

  return (
    <div style={{ position: "relative", top: "50px", height: "300px" }}>
      <Button
        onClick={handleSendCoffee}
        variant="unstyled"
        _hover={{ transform: "scale(1.05)" }}
        transition="transform 0.2s"
      >
        <img src={coffeeLogo} className="coffee" alt="Coffee logo" />
      </Button>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy Me a Coffee! ☕</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text fontSize="md">Buy me a coffee for 1 VET!</Text>
              <Text fontSize="sm">Leave your name and a friendly message:</Text>
              <Input
                id="coffee-name"
                placeholder="Your name"
                size="md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />
              <Input
                id="coffee-message"
                placeholder="Friendly message"
                size="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isRequired
              />
              <VetBalance />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={onSendCoffee}
              isLoading={isLoading}
              loadingText="Sending..."
            >
              Send Coffee
            </Button>
            <Button colorScheme="blue" onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isDrawerOpen} placement="bottom" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Coffee Status</DrawerHeader>
          <DrawerBody>
            {txId && <Text>Transaction ID: {txId}</Text>}
            {status === TransactionStatus.Pending && (
              <Text>Transaction is pending...</Text>
            )}
            {status === TransactionStatus.Success && (
              <Text>Transaction succeeded! ✅</Text>
            )}
            {status === TransactionStatus.Error && (
              <Text>Transaction reverted! ❌</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
