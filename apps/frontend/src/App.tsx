import React, {useState} from "react";
import { Box } from "@chakra-ui/react";
import { AppHeader } from "./components/header";
import { BuyCoffee } from "./components/buycoffee";
import { TransactionHistory } from "./components/txhistory";
import { WelcomeText } from "./components/welcomeText";
import { SendCoffee } from "./components/sendcoffee";
import "./App.css";

const App = () => {
  const [refetchHistory, setRefetchHistory] = useState(null) //this state is triggered once the transaction went through 
                                                             // so we can update the list

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
        <SendCoffee refetch={setRefetchHistory}/>
        <BuyCoffee refetch={setRefetchHistory}/>
        <TransactionHistory fetch={refetchHistory}/>
      </Box>
    </Box>
  );
};

export default App;