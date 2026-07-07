import '@testing-library/jest-dom'
import { vi } from 'vitest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).jest = vi as any;

// Mock zustand persist
vi.mock('zustand/middleware', () => ({
  persist: (config: unknown) => config,
}))

// Mock stellar-wallets-kit
vi.mock('@creit.tech/stellar-wallets-kit', () => {
  return {
    Networks: {
      TESTNET: 'Test SDF Network ; September 2015',
      PUBLIC: 'Public Global Stellar Network ; September 2015',
    },
    StellarWalletsKit: {
      init: vi.fn(),
      authModal: vi.fn(),
      getAddress: vi.fn(),
      setWallet: vi.fn(),
      signTransaction: vi.fn(),
    }
  }
})

vi.mock('@creit.tech/stellar-wallets-kit/modules/freighter', () => {
  return {
    FREIGHTER_ID: 'freighter',
    FreighterModule: class {}
  }
})
