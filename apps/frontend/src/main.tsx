import React from 'react'
import {  StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { ChakraProvider } from '@chakra-ui/react';
import {THOR_URL} from "./config/constants.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ChakraProvider>
          <DAppKitProvider nodeUrl={THOR_URL} genesis={"test"} usePersistence={true}>
            <App/>
          </DAppKitProvider>
      </ChakraProvider>
  </StrictMode>,
)
