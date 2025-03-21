import { useEffect, useState } from "react";
import { Contract, ThorClient } from "@vechain/sdk-network";
import { THOR_URL } from "../config/constants.ts";
import { config, COFFEE_CONTRACT_ABI } from "@repo/config-contract";
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import React from "react";
import { motion } from "framer-motion";
import { shortenAddress } from "../utils/index.tsx";

interface CoffeeDonation {
  timestamp: bigint;
  from: string;
  name: string;
  message: string;
  value: bigint;
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const buttonVariants = {
  hover: { rotate: 360, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export function TransactionHistory() {
  const [history, setHistory] = useState<CoffeeDonation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const thorClient = ThorClient.at(THOR_URL);
  const contract = thorClient.contracts.load(
    config.CONTRACT_ADDRESS,
    COFFEE_CONTRACT_ABI
  );

  const getHistory = async () => {
    setIsLoading(true);
    try {
      const salesResponse = await contract.read.getSales();
      const allSales = salesResponse[0];
      setHistory([...allSales]);
    } catch (e) {
      if (e instanceof Error) {
        alert("Unable to load donation history: " + e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    getHistory();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <VStack
      spacing={6}
      mt={10}
      width="100%"
      maxW="1500px"
      mx="auto"
    //   style={{ position: "relative", top: "260px" }}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        width="100%"
      >
        <TableContainer
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
        >
          <Table variant="simple" colorScheme="gray">
            <TableCaption fontSize="lg" fontWeight="medium" color="gray.600">
              History of Coffee Donations!{" "}
              <Tooltip label="Click to refresh list!" hasArrow>
                <Button
                  as={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={getHistory}
                  isLoading={isLoading}
                  size="sm"
                  _hover={{ bg: "grey.600" }}
                >
                  <FiRefreshCw />
                </Button>
              </Tooltip>
            </TableCaption>
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.700" fontSize="sm">
                  When
                </Th>
                <Th color="gray.700" fontSize="sm">
                  From
                </Th>
                <Th color="gray.700" fontSize="sm">
                  To
                </Th>
                <Th color="gray.700" fontSize="sm">
                  Name
                </Th>
                <Th color="gray.700" fontSize="sm">
                  Message
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.length > 0
                ? history.map((coffee: any, index: number) => (
                    <Tr
                      as={motion.tr}
                      key={index}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.2s"
                    >
                      <Td>
                        {new Date(
                          Number(coffee?.timestamp) * 1000
                        ).toLocaleDateString()}
                      </Td>
                      <Td>{ coffee?.from ? shortenAddress(coffee?.from) : '-'}</Td>
                      <Td>{ coffee?.to ? shortenAddress(coffee?.to) : '-'}</Td>
                      <Td>{ coffee?.name ? coffee?.name : '-'}</Td>
                      <Td>{coffee?.message}</Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
}
