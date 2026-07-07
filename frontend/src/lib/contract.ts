import { Contract, nativeToScVal, scValToNative, rpc, xdr, Networks } from '@stellar/stellar-sdk';
import { TransactionBuilder } from '@stellar/stellar-sdk';
import { kit } from '@/store/walletStore';

export const NETWORK_PASSPHRASE = Networks.TESTNET;

// Testnet RPC URL
export const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(RPC_URL);

// Our deployed contract ID
export const CONTRACT_ID = "CCXQAPOF4PIFVXJMCCQ3B2BC35FUEKH4V4N446DZVD7OW3SUYZP4PFLF";

export async function submitContractCall(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[]
) {
  const contract = new Contract(CONTRACT_ID);
  
  // 1. Get source account
  const sourceAccount = await server.getAccount(sourceAddress);
  
  // 2. Build the transaction
  const tx = new TransactionBuilder(sourceAccount, {
    fee: '10000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  // 3. Simulate the transaction
  const simulation = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(simulation)) {
    throw new Error('Transaction simulation failed: ' + JSON.stringify(simulation.error));
  }
  
  // 4. Assemble the transaction with simulation results
  const assembledTx = rpc.assembleTransaction(tx, simulation).build();
  
  // 5. Sign with Wallet Kit
  const signedXdr = await kit.signTransaction(assembledTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
  
  // 6. Send transaction
  const sendResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE));
  
  if (sendResponse.status === 'ERROR') {
    throw new Error('Transaction failed: ' + sendResponse.errorResult);
  }

  // 7. Wait for transaction to complete
  let txResponse = await server.getTransaction(sendResponse.hash);
  let retries = 0;
  while (txResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND && retries < 10) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    txResponse = await server.getTransaction(sendResponse.hash);
    retries++;
  }

  if (txResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
    if (txResponse.returnValue) {
      return scValToNative(txResponse.returnValue);
    }
    return true;
  }
  
  throw new Error(`Transaction ended with status: ${txResponse.status}`);
}

export async function createReceipt(
  sender: string,
  receiver: string,
  amount: string,
  memo: string,
  txHash: string
) {
  const amountStr = String(amount); // Keep it string since it's i128
  
  const args = [
    nativeToScVal(sender, { type: 'address' }),
    nativeToScVal(receiver, { type: 'address' }),
    nativeToScVal(amountStr, { type: 'i128' }),
    nativeToScVal(memo, { type: 'string' }),
    nativeToScVal(Math.floor(Date.now() / 1000), { type: 'u64' }),
    nativeToScVal(txHash, { type: 'string' }),
  ];

  return await submitContractCall(sender, 'create_receipt', args);
}

export async function listReceipts(address: string) {
  try {
    const contract = new Contract(CONTRACT_ID);
    const args = [nativeToScVal(address, { type: 'address' })];
    
    // For reads we don't need to sign or submit a transaction, we can just simulate
    const account = await server.getAccount(address);
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('list_receipts', ...args))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    
    if (rpc.Api.isSimulationSuccess(simulation)) {
      if (simulation.result && simulation.result.retval) {
        return scValToNative(simulation.result.retval);
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch receipts:", error);
    return [];
  }
}

export async function getContractEvents(startLedger?: number) {
  try {
    let effectiveStartLedger = startLedger;
    if (!effectiveStartLedger || effectiveStartLedger <= 0) {
      const latestLedger = await server.getLatestLedger();
      effectiveStartLedger = Math.max(1, latestLedger.sequence - 1000);
    }
    
     
    const request = {
      startLedger: effectiveStartLedger,
      filters: [
        {
          type: "contract" as const,
          contractIds: [CONTRACT_ID]
        }
      ],
      limit: 10,
    };
    
    const response = await server.getEvents(request);
    return response.events;
  } catch (error) {
    console.error("Failed to fetch contract events:", error);
    return [];
  }
}

export async function sendPaymentAndReceipt(
  sender: string,
  receiver: string,
  amount: string,
  memoText: string
) {
  const contract = new Contract(CONTRACT_ID);
  
  // 1. Get source account
  const sourceAccount = await server.getAccount(sender);
  
  // Create a temporary hash since we don't have the final txHash yet
  // Or we can just use a placeholder
  const tempTxHash = "bundled_tx";
  
  const args = [
    nativeToScVal(sender, { type: 'address' }),
    nativeToScVal(receiver, { type: 'address' }),
    nativeToScVal(amount, { type: 'i128' }),
    nativeToScVal(memoText, { type: 'string' }),
    nativeToScVal(Math.floor(Date.now() / 1000), { type: 'u64' }),
    nativeToScVal(tempTxHash, { type: 'string' }),
  ];

  // 2. We cannot bundle native payment and Soroban operations in the same transaction.
  // We will execute the native payment first, and if it succeeds, record the receipt.
  
  const { Operation, Asset } = await import('@stellar/stellar-sdk');
  
  // -- Transaction 1: XLM Payment --
  const paymentTxBuilder = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  paymentTxBuilder.addOperation(Operation.payment({
    destination: receiver,
    asset: Asset.native(),
    amount: amount,
  }));
  const paymentTx = paymentTxBuilder.setTimeout(30).build();
  
  // Sign and submit payment
  const signedPaymentXdr = await kit.signTransaction(paymentTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
   
  const paymentResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedPaymentXdr.signedTxXdr, NETWORK_PASSPHRASE));
  
  if (paymentResponse.status === 'ERROR') {
    throw new Error('Payment failed: ' + paymentResponse.errorResult);
  }

  // Wait for payment to be confirmed
  let txResponse = await server.getTransaction(paymentResponse.hash);
  let retries = 0;
  while (txResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND && retries < 10) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    txResponse = await server.getTransaction(paymentResponse.hash);
    retries++;
  }

  // Refresh source account sequence number after first transaction
  const updatedAccount = await server.getAccount(sender);

  // -- Transaction 2: Contract Receipt --
  const contractTxBuilder = new TransactionBuilder(updatedAccount, {
    fee: '10000',
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  contractTxBuilder.addOperation(contract.call('create_receipt', ...args));
  const contractTx = contractTxBuilder.setTimeout(30).build();

  // Simulate contract tx
  const simulation = await server.simulateTransaction(contractTx);
  if (!rpc.Api.isSimulationSuccess(simulation)) {
    throw new Error('Receipt simulation failed: ' + JSON.stringify(simulation.error));
  }
  
  // Assemble
  const assembledTx = rpc.assembleTransaction(contractTx, simulation).build();
  
  // Sign and submit contract tx
  const signedContractXdr = await kit.signTransaction(assembledTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
   
  const contractResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedContractXdr.signedTxXdr, NETWORK_PASSPHRASE));
  
  if (contractResponse.status === 'ERROR') {
    throw new Error('Receipt storage failed: ' + contractResponse.errorResult);
  }

  return paymentResponse.hash; // Return primary payment hash
}
