import React, { useState, useEffect } from "react";
import { useConnex, useWallet } from "@vechain/vechain-kit";
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
import "./buycoffee.css";
import { useSendCoffee } from "../hooks/useSendCoffee";

enum TransactionStatus {
  Pending = "pending",
  Success = "success",
  Error = "error",
}

export function SendCoffee({ refetch }) {
  // Separate states instead of single formData object
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useWallet();
  const toast = useToast();

  const { sendCoffee, isPending, status, error, txReceipt } =
    useSendCoffee(account);

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

    const contractClause = Clause.callFunction(
      Address.of(config.CONTRACT_ADDRESS),
      ABIContract.ofAbi(COFFEE_CONTRACT_ABI).getFunction("sendCoffee"),
      [address, name, message],
      VET.of(1),
      { comment: `${account} sent you a coffee!` }
    );

    try {
      setIsLoading(true);
      onModalClose();

      await sendCoffee([
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
    setAddress("");
    setMessage("");
    onModalOpen();
  };

  useEffect(() => {
    refetch(txReceipt?.meta.txID);
  }, [isPending]);

  return (
    <div>
      <Button
        onClick={handleSendCoffee}
        variant="solid"
        bg="red.500"
        color="white"
        _hover={{
          transform: "scale(1.05)",
          bg: "red.600",
          boxShadow: "0 0 10px rgba(255, 0, 0, 0.4)",
        }}
        _active={{
          transform: "scale(0.98)",
          bg: "red.700",
        }}
        transition="all 0.2s ease-in-out"
        isLoading={isLoading}
        loadingText="Brewing..."
        size="md"
        px={6}
        py={3}
        borderRadius="md"
        fontWeight="bold"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        ☕ Send a Coffee!
      </Button>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Somebody a Coffee! ☕</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text fontSize="md">Send somebody a coffee for 1 VET!</Text>
              <Text fontSize="sm">
                Leave their address and a friendly message:
              </Text>
              <Input
                id="coffee-address"
                placeholder="Receiver"
                size="md"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                isRequired
              />
              <Input
                id="coffee-name"
                placeholder="Friendly Name"
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
