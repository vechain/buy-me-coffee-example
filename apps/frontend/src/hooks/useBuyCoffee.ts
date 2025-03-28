import { 
    useSendTransaction,
    Wallet
  } from '@vechain/vechain-kit';

export const useBuyCoffee = (account: Wallet) => {
    const {
        sendTransaction: buyCoffee,
        isTransactionPending: isPending,
        status,
        txReceipt,
        error
    } = useSendTransaction({
        signerAccountAddress: account?.address,
        onTxConfirmed: () => console.log("Buy Coffee transaction successful"),
        onTxFailedOrCancelled: () => console.log("Buy Coffee transaction failed")
    });

    return { buyCoffee, isPending, status, error, txReceipt };
};

