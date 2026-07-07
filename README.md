# StellarPay

**A production-ready multi-wallet Stellar payment application.**

## Overview
StellarPay allows users to seamlessly connect their preferred Stellar wallets (Freighter, Albedo, etc.), view account balances, and send XLM. It uses Soroban smart contracts to immutably store transaction receipts and streams live events to display transaction progress and history.

## Architecture
StellarPay is built with a decoupled frontend and smart contract backend:
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, `shadcn/ui`, `StellarWalletsKit`.
- **Smart Contract:** Rust, Soroban SDK v22.

See `ARCHITECTURE.md` for a detailed breakdown.

## Features
- Connect multiple Stellar wallets (Freighter, WalletConnect, etc.).
- Persist wallet sessions securely.
- View real-time XLM balances.
- Send native XLM payments on the Stellar Testnet.
- Immutable receipt storage via Soroban Smart Contracts.
- Real-time transaction history and live event streaming.
- Fully responsive and accessible UI with dark mode support.

## Technology Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Stellar SDK (`@stellar/stellar-sdk`)
- Stellar Wallets Kit (`@creit.tech/stellar-wallets-kit`)
- Rust & Soroban SDK

## Folder Structure
```
stellar-mastery-s-/
├── contract/             # Soroban Smart Contract (Rust)
│   ├── src/              # Smart contract source code
│   └── Cargo.toml        # Rust dependencies
├── frontend/             # Next.js Web Application (TypeScript)
│   ├── src/app/          # Application routes and pages
│   ├── src/components/   # Reusable React components
│   ├── src/lib/          # Core utilities and Horizon/Soroban API logic
│   └── package.json      # Node dependencies
└── .github/workflows/    # CI/CD pipelines
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kavishsggs-cloud/stellar-mastery-s-.git
   cd stellar-mastery-s-
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Soroban dependencies (if modifying contract):**
   ```bash
   rustup target add wasm32-unknown-unknown
   cargo install --locked stellar-cli
   ```

## Running Locally

1. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
   NEXT_PUBLIC_HORIZON_URL="https://horizon-testnet.stellar.org"
   NEXT_PUBLIC_SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"
   NEXT_PUBLIC_CONTRACT_ID="CBRLVIQ5WZ3FHPEWCIP4QO4Z5L7CJ5MYOY7ADHSAW5IJULIHVFMYZHKU"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Wallet Setup
1. Install the [Freighter browser extension](https://www.freighter.app/).
2. Enable "Experimental Mode" in Freighter settings (if required for Soroban).
3. Switch Freighter to the **Testnet** network.
4. Fund your wallet using the [Stellar Laboratory Faucet](https://laboratory.stellar.org/#account-creator?network=test).

## Smart Contract & Deployment
Refer to `DEPLOYMENT.md` for full instructions on building and deploying the Soroban contract.

- **Contract Address:** `CBRLVIQ5WZ3FHPEWCIP4QO4Z5L7CJ5MYOY7ADHSAW5IJULIHVFMYZHKU`
- **Deployment Tx Hash:** `ed55383899fc53a7af78857bcfc5fb435104cb866ebe89a2e39dd7434fab62ec`
- **Invocation Tx Hash:** `60edcdfbd6ea357216361303cf9f9700a01b098e735ab3a2b770a4169b391639`

### Explorer Links
- [Deployment Transaction](https://stellar.expert/explorer/testnet/tx/ed55383899fc53a7af78857bcfc5fb435104cb866ebe89a2e39dd7434fab62ec)
- [Invocation Transaction](https://stellar.expert/explorer/testnet/tx/60edcdfbd6ea357216361303cf9f9700a01b098e735ab3a2b770a4169b391639)
- [Contract Details](https://stellar.expert/explorer/testnet/contract/CBRLVIQ5WZ3FHPEWCIP4QO4Z5L7CJ5MYOY7ADHSAW5IJULIHVFMYZHKU)

## Testing
Refer to `TESTING.md`.

## CI/CD
GitHub Actions is configured for continuous integration. Every push executes:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Known Limitations
- Supported strictly on Stellar Testnet for now.
- Dependent on third-party wallet extensions.

## Future Improvements
- Mainnet support.
- Asset-agnostic payments (e.g., USDC).
- Enhanced analytics dashboard.

## Demo Video
[Placeholder: Link to Demo Video]

## Live Demo
[Placeholder: Link to Live Deployment]

## Contributors
- Kavish

## License
MIT License
