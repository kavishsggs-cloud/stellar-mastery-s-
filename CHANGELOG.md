# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-08

### Added
- Multi-wallet support using `StellarWalletsKit` (Freighter, Albedo, etc.).
- Complete UI dashboard built with Next.js 14, Tailwind CSS, and `shadcn/ui`.
- Real-time Soroban Smart Contract integration for immutable payment receipts.
- Live event streaming to capture transaction confirmations directly from the ledger.
- Dark mode, loading states, and robust error handling.

### Fixed
- Fixed Soroban transaction bundling limits by separating native XLM transfers and contract invocations.
- Addressed React hydration mismatches on timestamp formatting.
- Fixed `startLedger` indexing for event streaming to use `latestLedger` dynamic resolution.

### Changed
- Improved overall UI responsiveness for mobile users.
