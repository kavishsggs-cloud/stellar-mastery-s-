# Deployment Guide

## 1. Smart Contract Deployment (Testnet)
To deploy the Soroban smart contract to the Stellar Testnet:

1. Ensure you have the Stellar CLI installed (`cargo install --locked stellar-cli`).
2. Build the contract:
   ```bash
   cd contract
   stellar contract build
   ```
3. Deploy the contract:
   ```bash
   stellar contract deploy \
     --wasm target/wasm32v1-none/release/contract.wasm \
     --source alice \
     --network testnet
   ```
4. Copy the output contract ID and update the `NEXT_PUBLIC_CONTRACT_ID` variable in the frontend `.env.local`.

## 2. Frontend Deployment (Vercel)
The Next.js frontend is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Connect your GitHub repository to Vercel.
3. Configure the environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015`
   - `NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org`
   - `NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org`
   - `NEXT_PUBLIC_CONTRACT_ID=<Your_Contract_Address>`
4. Deploy. Vercel will automatically build the application using `npm run build`.
