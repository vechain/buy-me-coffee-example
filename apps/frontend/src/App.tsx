import React from "react";
import { Box } from "@chakra-ui/react";
import "./App.css";
import { AppHeader } from "./components/header";
import { BuyCoffee } from "./components/buycoffee";
import { TransactionHistory } from "./components/txhistory";
import { WelcomeText } from "./components/welcomeText";
import { SendCoffee } from "./components/sendcoffee";

const App = () => {
  return (
    <Box minH="100vh" width="100%">
      <AppHeader />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxW="1200px"
        px={{ base: 4, md: 6 }}
        py={6}
        flex={1}
        mx="auto" // Center the content horizontally
      >
        <WelcomeText />
        <SendCoffee/>
        <BuyCoffee />
        <TransactionHistory />
      </Box>
    </Box>
  );
};

export default App;