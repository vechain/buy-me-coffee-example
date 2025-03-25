import React, { useState } from "react";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
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
  useDisclosure
} from "@chakra-ui/react";
import coffeeLogo from "../assets/buy-coffee.png";
import { COFFEE_CONTRACT_ABI, config } from "@repo/config-contract";
import { THOR_URL } from "../config/constants";
import { VetBalance } from "./vetbalance";
import "./buycoffee.css";

enum TransactionStatus {
  NotSent = "NOT_SENT",
  Pending = "PENDING",
  Success = "SUCCESS",
  Reverted = "REVERTED",
}

export function SendCoffee({refetch}) {
  const { account } = useWallet();
  const { vendor } = useConnex();
  const toast = useToast();

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

  // Separate states instead of single formData object
  const [name, setName] = useState("")
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(
    TransactionStatus.NotSent
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!account) return null;

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
      setIsLoading(true);
      onModalClose();

      const contractClause = Clause.callFunction(
        Address.of(config.CONTRACT_ADDRESS),
        ABIContract.ofAbi(COFFEE_CONTRACT_ABI).getFunction("sendCoffee"),
        [address, name, message],
        VET.of(1),
        { comment: `${account} sent you a coffee!` }
      );

      const tx = vendor.sign("tx", [
        {
          to: contractClause.to,
          value: contractClause.value.toString(),
          data: contractClause.data.toString(),
          comment: `${account} sent you a coffee!`,
        },
      ]);

      const result = await tx.request();
      setTxId(result?.txid);
      setTxStatus(TransactionStatus.Pending);
      onDrawerOpen();

      const thorClient = ThorClient.at(THOR_URL);
      const txReceipt = await thorClient.transactions.waitForTransaction(
        result.txid
      );

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
        refetch(txReceipt)
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCoffee = () => {
    setTxId(null);
    setTxStatus(TransactionStatus.NotSent);
    setName("");
    setAddress("");
    setMessage("");
    onModalOpen();
  };

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
            {txStatus === TransactionStatus.Pending && (
              <Text>Transaction is pending...</Text>
            )}
            {txStatus === TransactionStatus.Success && (
              <Text>Transaction succeeded! ✅</Text>
            )}
            {txStatus === TransactionStatus.Reverted && (
              <Text>Transaction reverted! ❌</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}