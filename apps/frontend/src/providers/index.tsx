import React from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit'

export function VeChainKitProviderWrapper({ children }: any) {
    return (
         <VeChainKitProvider
            feeDelegation={{
                delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/441',
                // set to false if you want to delegate ONLY social login transactions
                delegateAllTransactions: true 
            }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
            ]}
            dappKit={{
                 allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                 walletConnectOptions: {
                    projectId:
                        // Get this on https://cloud.reown.com/sign-in
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'Buy me a Coffee Dapp',
                        description:
                            'This is the description of your app visible in VeWorld upon connection request.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: ["https://path-to-logo.png"],
                    },
                },
            }}
            darkMode={true}
            language="en"
            network={{
                type: 'main',
            }}
        >
            {children}
        </VeChainKitProvider>
    );
}
