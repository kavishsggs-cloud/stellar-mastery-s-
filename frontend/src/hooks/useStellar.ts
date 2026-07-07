"use client";

import { useCallback, useState } from 'react';
import { Horizon } from '@stellar/stellar-sdk';
import { kit, useWalletStore } from '@/store/walletStore';
import { toast } from 'sonner';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export const useStellar = () => {
  const { address, setAddress, setBalance, setIsConnected, disconnect } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalance = useCallback(async (publicKey: string) => {
    try {
      const account = await server.loadAccount(publicKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
      if (nativeBalance) {
        setBalance(nativeBalance.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to fetch balance');
    }
  }, [setBalance]);

  const connectWallet = useCallback(async () => {
    // Note: Assuming there is some UI component handling this or we just update the store
    // A clean transition would use `transition-all duration-300 ease-in-out`
    // handled inside the components themselves.
    try {
      setIsConnecting(true);
      
      // Open the authentication modal
      const { address: userAddress } = await kit.authModal();
      setAddress(userAddress);
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
      fetchBalance(userAddress);
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance, setAddress, setIsConnected]);

  const refreshBalance = useCallback(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address, fetchBalance]);

  return {
    connectWallet,
    fetchBalance,
    refreshBalance,
    isConnecting,
    address,
    disconnect
  };
};
