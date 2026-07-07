# Testing Guide

StellarPay includes robust testing for both the smart contract backend and the React frontend.

## Smart Contract Tests (Rust)
The Soroban smart contract is tested using Rust's built-in `cargo test` functionality. Tests ensure that receipts are created correctly, incremented properly, and emit the expected events.

**Run the contract tests:**
```bash
cd contract
cargo test
```

## Frontend Tests
The Next.js frontend uses Jest and React Testing Library to test component rendering and global state handling.

**Run the frontend tests:**
```bash
cd frontend
npm run test
```

**Run frontend linting & type checks:**
```bash
npm run lint
npm run typecheck
```

## Continuous Integration
All tests (Rust and TypeScript) are automatically executed on every push and pull request using GitHub Actions. Check `.github/workflows/ci.yml` for the complete pipeline definition.
