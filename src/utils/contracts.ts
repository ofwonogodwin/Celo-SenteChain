import { ethers } from 'ethers'

// Contract ABIs
const LENDING_CONTRACT_ABI = [
  "function depositFunds(uint256 amount) external",
  "function withdrawFunds(uint256 amount) external",
  "function updateSenteScore(address user) public",
  "function requestLoan(uint256 amount) external",
  "function repayLoan() external",
  "function calculateInterestRate(uint256 score) public pure returns (uint256)",
  "function getLoanDetails(address user) external view returns (uint256 amount, uint256 interestRate, uint256 dueDate, uint256 amountRepaid, bool active, bool defaulted, uint256 totalDue, uint256 remainingAmount)",
  "function getSenteScore(address user) external view returns (uint256)",
  "function getCreditData(address user) external view returns (uint256 senteScore, uint256 totalLoans, uint256 successfulRepayments, uint256 lastUpdateTime, uint256 transactionCount)",
  "function recordTransaction() external",
  "function getContractBalance() external view returns (uint256)"
]

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
]

// Contract addresses
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const CUSD_ADDRESS = process.env.NEXT_PUBLIC_CUSD_ADDRESS || '0x765DE816845861e75A25fCA122bb6898B8B1282a'

export function getLendingContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signerOrProvider)
}

export function getCUSDContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, signerOrProvider)
}

export { CONTRACT_ADDRESS, CUSD_ADDRESS }
