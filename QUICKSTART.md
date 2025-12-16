# Quick Start Guide 🚀

Get Celo SenteChain running in 10 minutes!

## 1️⃣ Install Dependencies (2 min)

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts && npm install && cd ..
```

## 2️⃣ Set Up Environment (1 min)

```bash
# Copy environment files
cp .env.example .env.local
cd contracts && cp .env.example .env && cd ..
```

Edit `contracts/.env`:
```env
PRIVATE_KEY=your_metamask_private_key
```

## 3️⃣ Compile Contracts (1 min)

```bash
cd contracts
npx hardhat compile
cd ..
```

## 4️⃣ Deploy to Testnet (2 min)

Get test tokens: https://faucet.celo.org

```bash
npm run deploy:testnet
```

**Copy the contract address!**

## 5️⃣ Update Frontend Config (1 min)

Edit `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
NEXT_PUBLIC_CELO_RPC=https://alfajores-forno.celo-testnet.org
```

## 6️⃣ Run Development Server (1 min)

```bash
npm run dev
```

Visit: http://localhost:3000

## 7️⃣ Test the App (2 min)

1. Click "Connect Wallet"
2. Switch to Alfajores network in MetaMask
3. Go to Dashboard
4. Click "Record Activity" to boost score
5. Try requesting a loan!

## ✅ Done!

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎯 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Smart Contracts
npm run compile          # Compile contracts
npm run deploy:testnet   # Deploy to Alfajores
npm run deploy:mainnet   # Deploy to Celo mainnet
```

## 🐛 Common Issues

**MetaMask not connecting?**
- Install MetaMask extension
- Add Alfajores network manually

**Contract not deployed?**
- Check you have CELO for gas
- Get from: https://faucet.celo.org

**Frontend errors?**
- Did you update NEXT_PUBLIC_CONTRACT_ADDRESS?
- Run `npm install` again

## 📚 Next Steps

1. Read [README.md](./README.md) for full documentation
2. See [DEPLOYMENT.md](./DEPLOYMENT.md) for mainnet deployment
3. Customize the UI in `src/app/`
4. Adjust smart contract in `contracts/contracts/`

---

Need help? Check the docs or open an issue!
