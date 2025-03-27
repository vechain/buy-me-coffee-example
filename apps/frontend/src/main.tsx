import React from 'react'
import {  StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react';
import {THOR_URL} from "./config/constants.ts";
import { VeChainKitProviderWrapper } from './providers/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ChakraProvider>
        <VeChainKitProviderWrapper>
            <App/>
          </VeChainKitProviderWrapper>
      </ChakraProvider>
  </StrictMode>,
)
