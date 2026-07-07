import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';

interface WalletState {
  address: string | null;
  network: string;
  balance: string;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setNetwork: (network: string) => void;
  setBalance: (balance: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      network: Networks.TESTNET,
      balance: '0',
      isConnected: false,
      setAddress: (address) => set({ address }),
      setNetwork: (network) => set({ network }),
      setBalance: (balance) => set({ balance }),
      setIsConnected: (isConnected) => set({ isConnected }),
      disconnect: () => set({ address: null, balance: '0', isConnected: false }),
    }),
    {
      name: 'stellarpay-wallet-storage',
    }
  )
);

// We need to only initialize it on the client side since it might access window
if (typeof window !== 'undefined') {
  StellarWalletsKit.init({
    modules: [new FreighterModule()],
    network: Networks.TESTNET,
  });
}

export const kit = StellarWalletsKit;
