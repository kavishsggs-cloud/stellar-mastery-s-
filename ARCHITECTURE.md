# StellarPay Architecture

StellarPay is a modern fintech payment application built on the Stellar network. The architecture is split into a frontend web application and a Soroban smart contract.

## 1. Frontend Web Application
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `shadcn/ui`, Framer Motion
- **State Management:** Zustand (for global wallet state and balances)
- **Stellar Integration:** `StellarWalletsKit` (for Freighter, Albedo, etc.), `@stellar/stellar-sdk`

### Folder Structure
- `src/app`: Next.js App Router pages (`/`, `/send`, `/history`, `/contract`).
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks (`useStellar`, `useSoroban`).
- `src/lib`: Core utility functions, Horizon API calls, Soroban interactions.
- `src/store`: Zustand stores.

## 2. Soroban Smart Contract
- **Language:** Rust (Soroban SDK v22)
- **Features:**
  - `create_receipt`: Stores a receipt for a transaction and emits a `Created` event.
  - `list_receipts`: Retrieves a user's transaction history.
  - `get_receipt`: Fetches a single receipt by ID.

### Workflow
1. User connects wallet (via WalletKit).
2. User initiates a payment.
3. The frontend submits a native XLM `Payment` operation to the Stellar Testnet.
4. Upon success, the frontend automatically submits a Soroban `invokeHostFunction` to call `create_receipt` and store the transaction metadata immutably on the ledger.
5. The frontend polls Soroban events (`getEvents`) to stream real-time updates and display the receipt history.
