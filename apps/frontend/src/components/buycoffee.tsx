import React, { useState } from "react";
import { useConnex, useWallet } from "@vechain/vechain-kit";
import { 
  useSendTransaction,
} from '@vechain/vechain-kit';
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

export function BuyCoffee({refetch}) {
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

  // Split form data into separate states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(
    TransactionStatus.NotSent
  );
  const [isLoading, setIsLoading] = useState(false);


  const contractClause = Clause.callFunction(
    Address.of(config.CONTRACT_ADDRESS),
    ABIContract.ofAbi(COFFEE_CONTRACT_ABI).getFunction("buyCoffee"),
    [name, message],
    VET.of(1),
    { comment: "buy a coffee" }
  );

  const accountCheck = account || null
  const {
    sendTransaction: buyCoffee,
    isTransactionPending: isCustomPending,
    status: customStatus,
    error: customError
} = useSendTransaction({
  //@ts-ignore
    signerAccountAddress: accountCheck.address,
    onTxConfirmed: () => console.log("Custom transaction successful"),
    onTxFailedOrCancelled: () => console.log("Custom transaction failed")
});



  

  if (!account) return null;

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

    try {
      setIsLoading(true);
      onModalClose();



      // const tx = vendor.sign("tx", [
      //   {
      //     to: contractClause.to,
      //     value: contractClause.value.toString(),
      //     data: contractClause.data.toString(),
      //     comment: `${account} sent you a coffee!`,
      //   },
      // ]);



    

      await buyCoffee([{
        to: contractClause.to,
        value: contractClause.value.toString(),
        data: contractClause.data.toString(),
        comment: `${account} sent you a coffee!`,
      }])
      // setTxId(result);

      setTxStatus(TransactionStatus.Pending);
      onDrawerOpen();

      const thorClient = ThorClient.at(THOR_URL);
      // const txReceipt = await thorClient.transactions.waitForTransaction(
      //   result.txid
      // );

      // if (txReceipt?.reverted) {
      //   setTxStatus(TransactionStatus.Reverted);
      //   toast({
      //     title: "Transaction Failed",
      //     description: "The transaction was reverted.",
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // } else {
      //   setTxStatus(TransactionStatus.Success);
      //   toast({
      //     title: "Success!",
      //     description: "Thank you for the coffee! ☕",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      //   refetch(txReceipt)
      // }
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
    setMessage("");
    onModalOpen();
  };

  return (
    <div style={{ position: "relative", top: "50px", height: '300px' }}>
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