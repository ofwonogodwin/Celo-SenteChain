# Contributing to Celo SenteChain 🤝

Thanks for your interest in contributing! This guide will help you get started.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- ✨ Suggest features
- 📝 Improve documentation
- 💻 Submit code changes
- 🧪 Write tests
- 🎨 Improve UI/UX

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CeloSenteChain.git
   cd CeloSenteChain
   ```
3. **Install dependencies**
   ```bash
   npm install
   cd contracts && npm install && cd ..
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📁 Project Structure

```
CeloSenteChain/
├── contracts/           # Smart contracts
│   ├── contracts/       # Solidity files
│   ├── scripts/         # Deployment scripts
│   └── test/           # Contract tests
├── src/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   └── utils/          # Utility functions
└── public/             # Static assets
```

## 🔨 Development Workflow

### Smart Contract Changes

1. Edit contract in `contracts/contracts/`
2. Compile: `cd contracts && npx hardhat compile`
3. Write tests in `contracts/test/`
4. Run tests: `npx hardhat test`
5. Deploy to testnet: `npm run deploy:testnet`

### Frontend Changes

1. Edit files in `src/`
2. Run dev server: `npm run dev`
3. Test in browser: `http://localhost:3000`
4. Build: `npm run build`

## ✅ Code Standards

### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use Solidity 0.8.20+
- Add NatSpec comments
- Use OpenZeppelin libraries
- Include security checks

Example:
```solidity
/**
 * @dev Request a loan from the contract
 * @param amount The amount of cUSD to borrow
 */
function requestLoan(uint256 amount) external nonReentrant {
    require(amount > 0, "Amount must be greater than 0");
    // ...
}
```

### TypeScript/JavaScript
- Use TypeScript when possible
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

Example:
```typescript
/**
 * Load user's loan data from smart contract
 * @param address User's wallet address
 * @returns Promise with loan details
 */
async function loadLoanData(address: string): Promise<LoanData> {
  // ...
}
```

### React Components
- Use functional components
- Use hooks appropriately
- Keep components small
- Extract reusable logic
- Use TypeScript types

Example:
```typescript
interface LoanCardProps {
  amount: string;
  dueDate: Date;
  onRepay: () => void;
}

export function LoanCard({ amount, dueDate, onRepay }: LoanCardProps) {
  // ...
}
```

## 🧪 Testing Requirements

### Smart Contracts
All contract changes must include tests:

```javascript
describe("LendingContract", function () {
  it("Should do something", async function () {
    // Test implementation
    expect(result).to.equal(expected)
  })
})
```

### Frontend
Test user flows manually:
1. Connect wallet
2. Check score
3. Request loan
4. Repay loan

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add loan history view
fix: resolve wallet connection issue
docs: update API documentation
style: format code with prettier
test: add tests for repayment flow
refactor: simplify score calculation
```

## 🔍 Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Test thoroughly**
   - Run all tests
   - Test manually
   - Check for errors

3. **Create PR**
   - Clear title and description
   - Reference related issues
   - Add screenshots if UI changes
   - Request review

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation
   - [ ] Other
   
   ## Testing
   How did you test?
   
   ## Screenshots
   (If applicable)
   ```

## 🐛 Bug Reports

Use this template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser:
- Network:
- Wallet:
- Contract Address:

**Screenshots**
Add screenshots if helpful
```

## ✨ Feature Requests

Use this template:

```markdown
**Feature Description**
What feature do you want?

**Problem**
What problem does it solve?

**Proposed Solution**
How should it work?

**Alternatives**
Other approaches considered?

**Additional Context**
Any other info
```

## 🎨 Design Guidelines

- Follow Celo brand colors
- Use TailwindCSS utilities
- Ensure mobile responsiveness
- Keep UI clean and simple
- Maintain accessibility (a11y)

### Colors
```css
--celo-green: #35D07F
--celo-gold: #FBCC5C
--celo-dark: #2E3338
```

## 🔐 Security

- Never commit private keys
- Use `.env` for secrets
- Report security issues privately
- Follow smart contract best practices
- Use OpenZeppelin when possible

## 📚 Resources

- [Celo Docs](https://docs.celo.org)
- [Solidity Docs](https://docs.soliditylang.org)
- [Next.js Docs](https://nextjs.org/docs)
- [Ethers.js Docs](https://docs.ethers.io)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 💬 Communication

- Open issues for bugs/features
- Use discussions for questions
- Be respectful and constructive
- Help others when you can

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Celo SenteChain! 💚
