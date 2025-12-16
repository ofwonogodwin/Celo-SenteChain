# Testing Guide 🧪

How to test Celo SenteChain thoroughly.

## 🎯 Testing Strategy

1. **Unit Tests**: Smart contract functions
2. **Integration Tests**: Contract + Frontend
3. **Manual Tests**: User flow testing
4. **Security Tests**: Common vulnerabilities

## 📝 Smart Contract Tests

### Setup Hardhat Tests

Create `contracts/test/LendingContract.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingContract", function () {
  let lendingContract;
  let cUSD;
  let owner;
  let borrower;
  
  beforeEach(async function () {
    [owner, borrower] = await ethers.getSigners();
    
    // Deploy mock cUSD
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    cUSD = await MockERC20.deploy("Celo Dollar", "cUSD");
    
    // Deploy LendingContract
    const LendingContract = await ethers.getContractFactory("LendingContract");
    lendingContract = await LendingContract.deploy(cUSD.address);
    
    // Mint cUSD and fund contract
    await cUSD.mint(owner.address, ethers.utils.parseEther("100000"));
    await cUSD.approve(lendingContract.address, ethers.utils.parseEther("100000"));
    await lendingContract.depositFunds(ethers.utils.parseEther("10000"));
  });
  
  it("Should initialize with correct cUSD address", async function () {
    expect(await lendingContract.cUSD()).to.equal(cUSD.address);
  });
  
  it("Should allow depositing funds", async function () {
    const balance = await lendingContract.getContractBalance();
    expect(balance).to.equal(ethers.utils.parseEther("10000"));
  });
  
  it("Should calculate SenteScore correctly", async function () {
    await lendingContract.connect(borrower).recordTransaction();
    const score = await lendingContract.getSenteScore(borrower.address);
    expect(score).to.be.gt(0);
  });
  
  it("Should reject loan if score too low", async function () {
    await expect(
      lendingContract.connect(borrower).requestLoan(ethers.utils.parseEther("100"))
    ).to.be.revertedWith("Insufficient SenteScore");
  });
  
  it("Should approve loan if score sufficient", async function () {
    // Boost score
    for (let i = 0; i < 100; i++) {
      await lendingContract.connect(borrower).recordTransaction();
    }
    
    // Mint cUSD to borrower for repayment
    await cUSD.mint(borrower.address, ethers.utils.parseEther("200"));
    
    // Request loan
    await lendingContract.connect(borrower).requestLoan(ethers.utils.parseEther("100"));
    
    const loan = await lendingContract.getLoanDetails(borrower.address);
    expect(loan.active).to.be.true;
    expect(loan.amount).to.equal(ethers.utils.parseEther("100"));
  });
});
```

Run tests:
```bash
cd contracts
npx hardhat test
```

## 🔍 Manual Testing Checklist

### Pre-Testing Setup
- [ ] MetaMask installed
- [ ] Alfajores network added
- [ ] Test CELO obtained from faucet
- [ ] Test cUSD obtained from faucet
- [ ] Contract deployed to testnet
- [ ] Frontend running locally

### Test Case 1: Wallet Connection
- [ ] Click "Connect Wallet"
- [ ] MetaMask prompts for connection
- [ ] Wallet address appears in navbar
- [ ] Network switches to Celo/Alfajores

### Test Case 2: Dashboard View
- [ ] Navigate to /dashboard
- [ ] SenteScore displays (initially 0)
- [ ] Balance shows correct cUSD amount
- [ ] Credit history shows 0 loans
- [ ] No active loan message appears

### Test Case 3: Boost SenteScore
- [ ] Click "Record Activity" button
- [ ] MetaMask prompts for transaction
- [ ] Transaction confirms
- [ ] SenteScore increases
- [ ] Transaction count increases
- [ ] Repeat 60+ times to reach score ≥60

### Test Case 4: Request Loan (Insufficient Score)
- [ ] Navigate to /borrow with score <60
- [ ] Enter loan amount
- [ ] "Request Loan" button is disabled
- [ ] Warning message shows score too low

### Test Case 5: Request Loan (Sufficient Score)
- [ ] Boost score to ≥60
- [ ] Navigate to /borrow
- [ ] Enter amount: 100 cUSD
- [ ] Interest rate displays (based on score)
- [ ] Total due calculates correctly
- [ ] Click "Request Loan"
- [ ] MetaMask prompts for approval
- [ ] Transaction confirms
- [ ] cUSD balance increases by 100
- [ ] Redirects to dashboard
- [ ] Active loan displays

### Test Case 6: Repay Loan (Insufficient Balance)
- [ ] Transfer all cUSD away
- [ ] Navigate to /repay
- [ ] Loan details display correctly
- [ ] "Repay" button is disabled
- [ ] Warning shows insufficient balance

### Test Case 7: Repay Loan (Success)
- [ ] Ensure sufficient cUSD balance
- [ ] Navigate to /repay
- [ ] Verify total due amount
- [ ] Check due date
- [ ] Click "Repay Loan"
- [ ] MetaMask prompts for approval (2 txs)
- [ ] Transactions confirm
- [ ] SenteScore increases
- [ ] Redirects to dashboard
- [ ] No active loan shows
- [ ] Successful repayments count increases

### Test Case 8: Edge Cases
- [ ] Try requesting loan with active loan (should fail)
- [ ] Try amount > 1000 cUSD (should fail)
- [ ] Try amount = 0 (should fail)
- [ ] Try negative amount (UI should prevent)
- [ ] Disconnect wallet mid-flow
- [ ] Switch accounts while connected
- [ ] Switch networks while connected

## 🛡️ Security Tests

### Smart Contract Security
- [ ] Check for reentrancy vulnerabilities (uses ReentrancyGuard ✅)
- [ ] Verify owner-only functions protected (uses Ownable ✅)
- [ ] Test integer overflow/underflow (Solidity 0.8+ safe ✅)
- [ ] Check authorization on all functions
- [ ] Verify loan cannot be requested twice
- [ ] Test edge case amounts (0, max uint256)

### Frontend Security
- [ ] Check for XSS vulnerabilities
- [ ] Verify input sanitization
- [ ] Test for race conditions
- [ ] Check wallet connection security
- [ ] Verify no private keys in code
- [ ] Check environment variables protected

## 📊 Performance Tests

- [ ] Page load time <3s
- [ ] Transaction processing time acceptable
- [ ] Multiple users can use simultaneously
- [ ] Contract gas costs reasonable
- [ ] Frontend responsive on mobile

## 🐛 Bug Report Template

```markdown
**Bug Description**
[Clear description]

**Steps to Reproduce**
1. 
2. 
3. 

**Expected Behavior**
[What should happen]

**Actual Behavior**
[What actually happens]

**Environment**
- Browser:
- Network:
- Wallet:
- Contract Address:

**Screenshots**
[If applicable]
```

## ✅ Test Completion Checklist

Before deployment:
- [ ] All smart contract tests pass
- [ ] All manual test cases pass
- [ ] No security vulnerabilities found
- [ ] Performance acceptable
- [ ] Edge cases handled
- [ ] Error messages clear
- [ ] User flow intuitive

## 📈 Test Metrics

Track these metrics:
- Test coverage: aim for >80%
- Average transaction time
- Gas costs per function
- User success rate
- Error rate

---

Happy Testing! 🧪✨
