// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LendingContract
 * @dev Decentralized lending contract for Celo SenteChain
 * Users can request loans based on their SenteScore
 */
contract LendingContract is Ownable, ReentrancyGuard {
    
    IERC20 public cUSD;
    
    // Loan structure
    struct Loan {
        uint256 amount;
        uint256 interestRate; // in basis points (e.g., 500 = 5%)
        uint256 dueDate;
        uint256 amountRepaid;
        bool active;
        bool defaulted;
    }
    
    // User credit data
    struct CreditData {
        uint256 senteScore; // 0-100
        uint256 totalLoans;
        uint256 successfulRepayments;
        uint256 lastUpdateTime;
        uint256 transactionCount;
    }
    
    // Mappings
    mapping(address => Loan) public loans;
    mapping(address => CreditData) public creditData;
    
    // Constants
    uint256 public constant MIN_SENTE_SCORE = 60;
    uint256 public constant LOAN_DURATION = 30 days;
    uint256 public constant BASE_INTEREST_RATE = 500; // 5%
    uint256 public constant MAX_LOAN_AMOUNT = 1000 * 10**18; // 1000 cUSD
    
    // Events
    event LoanRequested(address indexed borrower, uint256 amount, uint256 dueDate);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event SenteScoreUpdated(address indexed user, uint256 newScore);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _cUSDAddress) Ownable(msg.sender) {
        cUSD = IERC20(_cUSDAddress);
    }
    
    /**
     * @dev Deposit funds into the contract (for lending pool)
     */
    function depositFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }
    
    /**
     * @dev Owner can withdraw funds
     */
    function withdrawFunds(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= cUSD.balanceOf(address(this)), "Insufficient balance");
        require(cUSD.transfer(owner(), amount), "Transfer failed");
        emit FundsWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Update user's SenteScore based on activity
     */
    function updateSenteScore(address user) public {
        CreditData storage data = creditData[user];
        
        // Simple scoring algorithm
        uint256 score = 0;
        
        // Transaction count contributes up to 40 points
        if (data.transactionCount >= 100) {
            score += 40;
        } else {
            score += (data.transactionCount * 40) / 100;
        }
        
        // Account age contributes up to 30 points
        uint256 accountAge = block.timestamp - data.lastUpdateTime;
        if (accountAge >= 180 days) {
            score += 30;
        } else {
            score += (accountAge * 30) / 180 days;
        }
        
        // Repayment history contributes up to 30 points
        if (data.totalLoans > 0) {
            score += (data.successfulRepayments * 30) / data.totalLoans;
        }
        
        // Cap at 100
        if (score > 100) score = 100;
        
        data.senteScore = score;
        data.lastUpdateTime = block.timestamp;
        
        emit SenteScoreUpdated(user, score);
    }
    
    /**
     * @dev Request a loan
     */
    function requestLoan(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= MAX_LOAN_AMOUNT, "Amount exceeds maximum");
        require(!loans[msg.sender].active, "You already have an active loan");
        
        // Update and check SenteScore
        updateSenteScore(msg.sender);
        require(creditData[msg.sender].senteScore >= MIN_SENTE_SCORE, "Insufficient SenteScore");
        
        // Check contract has enough balance
        require(cUSD.balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        // Calculate interest rate based on score (better score = lower rate)
        uint256 interestRate = calculateInterestRate(creditData[msg.sender].senteScore);
        
        // Create loan
        loans[msg.sender] = Loan({
            amount: amount,
            interestRate: interestRate,
            dueDate: block.timestamp + LOAN_DURATION,
            amountRepaid: 0,
            active: true,
            defaulted: false
        });
        
        // Update credit data
        creditData[msg.sender].totalLoans++;
        creditData[msg.sender].transactionCount++;
        
        // Transfer loan amount to borrower
        require(cUSD.transfer(msg.sender, amount), "Transfer failed");
        
        emit LoanRequested(msg.sender, amount, loans[msg.sender].dueDate);
    }
    
    /**
     * @dev Repay loan
     */
    function repayLoan() external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan");
        require(!loan.defaulted, "Loan is defaulted");
        
        // Calculate total amount due (principal + interest)
        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        uint256 totalDue = loan.amount + interest;
        uint256 remainingAmount = totalDue - loan.amountRepaid;
        
        require(remainingAmount > 0, "Loan already fully repaid");
        
        // Transfer repayment
        require(cUSD.transferFrom(msg.sender, address(this), remainingAmount), "Transfer failed");
        
        // Update loan
        loan.amountRepaid = totalDue;
        loan.active = false;
        
        // Update credit data
        creditData[msg.sender].successfulRepayments++;
        creditData[msg.sender].transactionCount++;
        
        // Update SenteScore
        updateSenteScore(msg.sender);
        
        emit LoanRepaid(msg.sender, remainingAmount);
    }
    
    /**
     * @dev Calculate interest rate based on SenteScore
     * Better score = lower interest rate
     */
    function calculateInterestRate(uint256 score) public pure returns (uint256) {
        if (score >= 90) return 300; // 3%
        if (score >= 80) return 400; // 4%
        if (score >= 70) return 500; // 5%
        if (score >= 60) return 600; // 6%
        return 700; // 7% (default)
    }
    
    /**
     * @dev Get loan details for a user
     */
    function getLoanDetails(address user) external view returns (
        uint256 amount,
        uint256 interestRate,
        uint256 dueDate,
        uint256 amountRepaid,
        bool active,
        bool defaulted,
        uint256 totalDue,
        uint256 remainingAmount
    ) {
        Loan memory loan = loans[user];
        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        uint256 _totalDue = loan.amount + interest;
        uint256 _remainingAmount = loan.active ? _totalDue - loan.amountRepaid : 0;
        
        return (
            loan.amount,
            loan.interestRate,
            loan.dueDate,
            loan.amountRepaid,
            loan.active,
            loan.defaulted,
            _totalDue,
            _remainingAmount
        );
    }
    
    /**
     * @dev Get SenteScore for a user
     */
    function getSenteScore(address user) external view returns (uint256) {
        return creditData[user].senteScore;
    }
    
    /**
     * @dev Get credit data for a user
     */
    function getCreditData(address user) external view returns (
        uint256 senteScore,
        uint256 totalLoans,
        uint256 successfulRepayments,
        uint256 lastUpdateTime,
        uint256 transactionCount
    ) {
        CreditData memory data = creditData[user];
        return (
            data.senteScore,
            data.totalLoans,
            data.successfulRepayments,
            data.lastUpdateTime,
            data.transactionCount
        );
    }
    
    /**
     * @dev Increment transaction count (can be called to boost score)
     */
    function recordTransaction() external {
        creditData[msg.sender].transactionCount++;
        if (creditData[msg.sender].lastUpdateTime == 0) {
            creditData[msg.sender].lastUpdateTime = block.timestamp;
        }
        updateSenteScore(msg.sender);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }
}
