# API Documentation 📚

Complete reference for Celo SenteChain smart contract functions.

## Contract Address

**Celo Mainnet**: `[Your Contract Address]`
**Alfajores Testnet**: `[Your Contract Address]`

**cUSD Token**:
- Mainnet: `0x765DE816845861e75A25fCA122bb6898B8B1282a`
- Alfajores: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`

---

## Public Functions

### 1. `depositFunds(uint256 amount)`

Deposit cUSD into the lending pool.

**Parameters**:
- `amount`: Amount of cUSD to deposit (in wei)

**Requirements**:
- Must approve cUSD spending first
- Amount > 0

**Example**:
```javascript
const amount = ethers.utils.parseEther("1000")
await cUSD.approve(lendingContract.address, amount)
await lendingContract.depositFunds(amount)
```

---

### 2. `requestLoan(uint256 amount)`

Request a loan in cUSD.

**Parameters**:
- `amount`: Loan amount in wei (max 1000 cUSD)

**Requirements**:
- SenteScore ≥ 60
- No active loan
- Amount ≤ 1000 cUSD
- Contract has sufficient balance

**Returns**: Creates active loan

**Events**: `LoanRequested(borrower, amount, dueDate)`

**Example**:
```javascript
const amount = ethers.utils.parseEther("100")
await lendingContract.requestLoan(amount)
```

---

### 3. `repayLoan()`

Repay your active loan.

**Requirements**:
- Active loan exists
- Sufficient cUSD balance
- Must approve cUSD spending

**Events**: `LoanRepaid(borrower, amount)`

**Example**:
```javascript
const loan = await lendingContract.getLoanDetails(userAddress)
await cUSD.approve(lendingContract.address, loan.remainingAmount)
await lendingContract.repayLoan()
```

---

### 4. `recordTransaction()`

Record a transaction to boost SenteScore.

**Requirements**: None

**Events**: `SenteScoreUpdated(user, newScore)`

**Example**:
```javascript
await lendingContract.recordTransaction()
```

---

### 5. `updateSenteScore(address user)`

Update SenteScore for a user.

**Parameters**:
- `user`: Address to update

**Public**: Anyone can call

**Events**: `SenteScoreUpdated(user, newScore)`

**Example**:
```javascript
await lendingContract.updateSenteScore(userAddress)
```

---

## View Functions (Read-Only)

### 6. `getSenteScore(address user) → uint256`

Get current SenteScore for a user.

**Returns**: Score (0-100)

**Example**:
```javascript
const score = await lendingContract.getSenteScore(userAddress)
console.log(score.toNumber()) // e.g., 75
```

---

### 7. `getCreditData(address user) → tuple`

Get complete credit data for a user.

**Returns**:
```solidity
(
  uint256 senteScore,
  uint256 totalLoans,
  uint256 successfulRepayments,
  uint256 lastUpdateTime,
  uint256 transactionCount
)
```

**Example**:
```javascript
const data = await lendingContract.getCreditData(userAddress)
console.log({
  score: data.senteScore.toNumber(),
  totalLoans: data.totalLoans.toNumber(),
  repayments: data.successfulRepayments.toNumber(),
  txCount: data.transactionCount.toNumber()
})
```

---

### 8. `getLoanDetails(address user) → tuple`

Get loan details for a user.

**Returns**:
```solidity
(
  uint256 amount,
  uint256 interestRate,
  uint256 dueDate,
  uint256 amountRepaid,
  bool active,
  bool defaulted,
  uint256 totalDue,
  uint256 remainingAmount
)
```

**Example**:
```javascript
const loan = await lendingContract.getLoanDetails(userAddress)
if (loan.active) {
  console.log({
    amount: ethers.utils.formatEther(loan.amount),
    rate: loan.interestRate.toNumber() / 100 + '%',
    due: new Date(loan.dueDate.toNumber() * 1000),
    remaining: ethers.utils.formatEther(loan.remainingAmount)
  })
}
```

---

### 9. `calculateInterestRate(uint256 score) → uint256`

Calculate interest rate based on SenteScore.

**Parameters**:
- `score`: SenteScore (0-100)

**Returns**: Interest rate in basis points

**Rate Table**:
- 90-100: 3% (300 basis points)
- 80-89: 4% (400)
- 70-79: 5% (500)
- 60-69: 6% (600)
- <60: 7% (700)

**Example**:
```javascript
const rate = await lendingContract.calculateInterestRate(75)
console.log(rate.toNumber() / 100 + '%') // "5%"
```

---

### 10. `getContractBalance() → uint256`

Get cUSD balance in the contract.

**Returns**: Balance in wei

**Example**:
```javascript
const balance = await lendingContract.getContractBalance()
console.log(ethers.utils.formatEther(balance), 'cUSD')
```

---

## Owner-Only Functions

### 11. `withdrawFunds(uint256 amount)`

Withdraw cUSD from contract (owner only).

**Parameters**:
- `amount`: Amount to withdraw in wei

**Requirements**:
- Only owner can call
- Contract has sufficient balance

**Events**: `FundsWithdrawn(owner, amount)`

**Example**:
```javascript
const amount = ethers.utils.parseEther("100")
await lendingContract.withdrawFunds(amount)
```

---

## Events

### `LoanRequested`
```solidity
event LoanRequested(address indexed borrower, uint256 amount, uint256 dueDate)
```

### `LoanRepaid`
```solidity
event LoanRepaid(address indexed borrower, uint256 amount)
```

### `SenteScoreUpdated`
```solidity
event SenteScoreUpdated(address indexed user, uint256 newScore)
```

### `FundsDeposited`
```solidity
event FundsDeposited(address indexed depositor, uint256 amount)
```

### `FundsWithdrawn`
```solidity
event FundsWithdrawn(address indexed owner, uint256 amount)
```

---

## Constants

```solidity
MIN_SENTE_SCORE = 60          // Minimum score to borrow
LOAN_DURATION = 30 days       // Loan term
BASE_INTEREST_RATE = 500      // 5% base rate
MAX_LOAN_AMOUNT = 1000 ether  // Max 1000 cUSD
```

---

## Error Messages

| Error | Meaning |
|-------|---------|
| "Amount must be greater than 0" | Loan/deposit amount is 0 |
| "Amount exceeds maximum" | Loan > 1000 cUSD |
| "You already have an active loan" | Cannot borrow twice |
| "Insufficient SenteScore" | Score < 60 |
| "Insufficient liquidity" | Contract out of funds |
| "Transfer failed" | cUSD transfer error |
| "No active loan" | Cannot repay without loan |
| "Insufficient balance" | Not enough cUSD in contract |

---

## SenteScore Algorithm

Score = Transaction Points + Age Points + Repayment Points

**Transaction Points (0-40)**:
- 100+ transactions: 40 points
- Pro-rated: `(count * 40) / 100`

**Account Age Points (0-30)**:
- 180+ days: 30 points
- Pro-rated: `(days * 30) / 180`

**Repayment Points (0-30)**:
- Based on repayment rate
- Formula: `(successful / total) * 30`

**Final Score**: Capped at 100

---

## Integration Examples

### React Hook
```typescript
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export function useLoanData(address: string) {
  const [loan, setLoan] = useState(null)
  
  useEffect(() => {
    async function load() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const data = await contract.getLoanDetails(address)
      setLoan(data)
    }
    load()
  }, [address])
  
  return loan
}
```

### Node.js Script
```javascript
const { ethers } = require('ethers')

async function checkScore(address) {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://forno.celo.org'
  )
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
  const score = await contract.getSenteScore(address)
  return score.toNumber()
}
```

---

## Rate Limiting & Best Practices

- **Gas Optimization**: Batch reads when possible
- **Event Listening**: Subscribe to events for real-time updates
- **Error Handling**: Always wrap calls in try-catch
- **Approval**: Check allowance before requesting approval
- **Score Updates**: Call `recordTransaction()` periodically to boost score

---

## Support

Questions? Check:
- [README.md](./README.md)
- [Celo Docs](https://docs.celo.org)
- [Ethers.js Docs](https://docs.ethers.io)

---

Built with 💚 on Celo
