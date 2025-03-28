import { 
    useSendTransaction,
    Wallet
  } from '@vechain/vechain-kit';

export const useSendCoffee = (account: Wallet) => {
    const {
        sendTransaction: sendCoffee,
        isTransactionPending: isPending,
        status,
        txReceipt,
        error
    } = useSendTransaction({
        signerAccountAddress: account?.address,
        onTxConfirmed: () => console.log("Send Coffee transaction successful"),
        onTxFailedOrCancelled: () => console.log("Send Coffee transaction failed")
    });

    return { sendCoffee, isPending, status, error, txReceipt };
};

