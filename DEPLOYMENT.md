# 🚀 Deployment Guide - Celo SenteChain

Complete guide to deploy Celo SenteChain to production.

## 📋 Prerequisites

- Node.js 18+ installed
- MetaMask wallet with CELO tokens (for gas)
- cUSD tokens for lending pool
- Vercel account (for frontend)
- Private key from MetaMask

## 🔐 Step 1: Get Your Private Key

1. Open MetaMask
2. Click account menu → Account Details → Export Private Key
3. Enter password and copy private key
4. **Keep this secret!**

## ⚙️ Step 2: Configure Environment

### For Smart Contracts

```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env`:
```env
PRIVATE_KEY=your_private_key_here
```

### For Frontend

```bash
cp .env.example .env.local
```

Edit `.env.local` (will update after contract deployment):
```env
NEXT_PUBLIC_CELO_RPC=https://forno.celo.org
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
```

## 📦 Step 3: Install Dependencies

```bash
# Root dependencies
npm install

# Contract dependencies
cd contracts
npm install
cd ..
```

## 🔨 Step 4: Compile Contracts

```bash
cd contracts
npx hardhat compile
cd ..
```

You should see: `Compiled 1 Solidity file successfully`

## 🌐 Step 5: Deploy to Celo Network

### Option A: Deploy to Alfajores Testnet (Recommended First)

Get test tokens:
- CELO: https://faucet.celo.org
- cUSD: https://faucet.celo.org

```bash
npm run deploy:testnet
```

### Option B: Deploy to Celo Mainnet

```bash
npm run deploy:mainnet
```

**Save the contract address!** Example output:
```
✅ LendingContract deployed to: 0x1234567890123456789012345678901234567890
```

## 💰 Step 6: Fund the Lending Pool

The contract needs cUSD to lend out:

1. Go to Celo Explorer: https://explorer.celo.org/mainnet
2. Find your contract address
3. Send cUSD to contract (e.g., 10,000 cUSD)
4. Or use the `depositFunds()` function

Via code:
```bash
# In Hardhat console
npx hardhat console --network celo

const contract = await ethers.getContractAt("LendingContract", "YOUR_CONTRACT_ADDRESS")
const cUSD = await ethers.getContractAt("IERC20", "0x765DE816845861e75A25fCA122bb6898B8B1282a")
await cUSD.approve(contract.address, ethers.utils.parseEther("10000"))
await contract.depositFunds(ethers.utils.parseEther("10000"))
```

## 🌍 Step 7: Deploy Frontend to Vercel

1. **Update environment variables**

Edit `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_CELO_RPC=https://forno.celo.org
```

2. **Test locally**

```bash
npm run dev
```

Visit http://localhost:3000 and test:
- Connect wallet
- Check SenteScore
- Request loan
- Repay loan

3. **Deploy to Vercel**

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **celo-sentechain**
- Directory? **./` (press Enter)
- Override settings? **N**

4. **Configure Environment Variables on Vercel**

```bash
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
# Paste your contract address

vercel env add NEXT_PUBLIC_CUSD_ADDRESS
# Paste: 0x765DE816845861e75A25fCA122bb6898B8B1282a

vercel env add NEXT_PUBLIC_CELO_RPC
# Paste: https://forno.celo.org
```

5. **Deploy to production**

```bash
vercel --prod
```

## ✅ Step 8: Verify Deployment

1. **Contract Verification** (Optional but recommended)

Visit Celo Explorer:
- Mainnet: https://explorer.celo.org/mainnet/address/YOUR_CONTRACT_ADDRESS
- Click "Verify & Publish"
- Select: Solidity (Single file)
- Compiler: v0.8.20
- Optimization: Yes (200 runs)
- Paste contract code from `contracts/contracts/LendingContract.sol`

2. **Test Frontend**

Visit your Vercel URL and test:
- ✅ Wallet connection works
- ✅ SenteScore displays
- ✅ Can request loan
- ✅ Can repay loan

## 📊 Step 9: Monitor & Maintain

### Check Contract Balance
```bash
npx hardhat console --network celo
const contract = await ethers.getContractAt("LendingContract", "YOUR_ADDRESS")
const balance = await contract.getContractBalance()
console.log(ethers.utils.formatEther(balance), "cUSD")
```

### Withdraw Profits (Owner only)
```bash
const amount = ethers.utils.parseEther("100")
await contract.withdrawFunds(amount)
```

## 🐛 Troubleshooting

### Error: "Insufficient funds for gas"
- Add CELO to your wallet
- Get from: https://app.ubeswap.org

### Error: "Insufficient liquidity"
- Contract needs more cUSD
- Deposit funds using `depositFunds()`

### Frontend not connecting
- Check MetaMask network (should be Celo)
- Verify contract address in `.env.local`
- Clear browser cache

### Transaction fails
- Check gas price (increase if needed)
- Ensure wallet has enough CELO for gas

## 📝 Post-Deployment Checklist

- [ ] Contract deployed to Celo mainnet
- [ ] Contract funded with cUSD
- [ ] Contract address added to `.env.local`
- [ ] Frontend deployed to Vercel
- [ ] Tested wallet connection
- [ ] Tested loan request flow
- [ ] Tested repayment flow
- [ ] Contract verified on Celo Explorer
- [ ] README updated with live URLs
- [ ] Shared with Karma Gap for Proof of Ship

## 🎉 Success!

Your Celo SenteChain is now live! Share your deployment:

**Contract**: https://explorer.celo.org/mainnet/address/YOUR_ADDRESS
**Frontend**: https://your-app.vercel.app

## 📞 Support

Issues? Check:
- Hardhat docs: https://hardhat.org
- Celo docs: https://docs.celo.org
- Vercel docs: https://vercel.com/docs

---

Made with 💚 on Celo
