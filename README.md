# Celo SenteChain 💚💸🤖

A decentralized lending platform on Celo blockchain with AI-powered credit scoring.

## 🌍 What is Celo SenteChain?

Celo SenteChain helps people access loans using an AI-generated credit score instead of traditional collateral. Users connect their wallet, view their SenteScore (0-100), request loans in cUSD, and repay them transparently on the Celo blockchain.

## ✨ Features

- 🔐 MetaMask wallet connection
- 🤖 AI-based credit scoring (SenteScore)
- 💰 Borrow cUSD with fair interest rates
- 📊 Real-time loan dashboard
- ⛓️ Deployed on Celo mainnet
- 🎨 Clean, modern UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Celo mainnet RPC access

### Installation

```bash
# Install dependencies
npm install

# Install contract dependencies
cd contracts && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your keys

# Compile smart contracts
npm run compile

# Deploy to Celo testnet (Alfajores)
npm run deploy:testnet

# Deploy to Celo mainnet
npm run deploy:mainnet

# Run development server
npm run dev
```

Visit `http://localhost:3000`


## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, TypeScript
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Network**: Celo Mainnet
- **Token**: cUSD (Celo Dollar)

## 📜 Smart Contracts

### LendingContract.sol
- `requestLoan(uint256 amount)` - Request a loan
- `repayLoan()` - Repay your active loan
- `getLoanDetails(address user)` - Get loan info
- `getSenteScore(address user)` - Get credit score

**Deployed on Celo Mainnet**: `[Contract Address Here]`

## 🎯 How It Works

1. **Connect Wallet**: Use MetaMask on Celo network
2. **Check Score**: Get your SenteScore (0-100)
3. **Request Loan**: Borrow cUSD if score ≥ 60
4. **Repay**: Pay back loan + interest
5. **Improve Score**: Build credit history

## 🤖 SenteScore Algorithm

Simple, transparent scoring based on:
- Transaction count (40%)
- Account age (30%)
- Repayment history (30%)

Score ranges:
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- 0-39: Poor



### Smart Contracts (Celo Mainnet)
```bash
npm run deploy:mainnet
```


## 🔗 Links

- **Live Demo**: [Your Vercel URL]
- **Contract**: [Celo Explorer Link]
- **Documentation**: [Docs Link]

---

Made with Love By Ofwono on Celo
