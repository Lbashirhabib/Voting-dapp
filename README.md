Voting DApp

A decentralized application that allows users to connect their Ethereum wallet and vote on proposals using a smart contract deployed on the Sepolia testnet.

Features

- Connect to MetaMask wallet
- View account address and ETH balance
- Vote for either Proposal 1 or Proposal 2
- Transaction status updates

Technologies Used

- ethers.js (v6) for blockchain interactions
- MetaMask for wallet connection
- Sepolia Ethereum testnet

Setup Instructions

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the application: `npx vite`
4. Open `http://localhost:3000` in your browser

How to Use

1. Click "Connect Wallet" to connect your MetaMask wallet
2. Ensure you're connected to the Sepolia test network
3. If you need test ETH, request some from a Sepolia faucet
4. Click either "Vote for Proposal 1" or "Vote for Proposal 2" to cast your vote
5. Confirm the transaction in MetaMask
6. View the transaction status on screen

Smart Contract Details

- Contract Address: `0x35cd167FA931C6c5f07AbB2621846FC35054ba06`
- Network: Sepolia Testnet
- Function: `vote(uint256 proposal)` where `1` = Proposal 1 and `2` = Proposal 2

4. The app will use INFURA for:
- Reading blockchain data
- Fallback provider functionality

## INFURA Setup

1. Create an account at [infura.io](https://infura.io)
2. Create a new project and get your API key
3. Create a `.env` file in the project root:

Important Notes

- This DApp uses ethers.js v6 which has breaking changes from v5
- Always pass numbers (not strings) to the vote function