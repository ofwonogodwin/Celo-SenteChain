'use client'

import { useWallet } from '@/components/WalletProvider'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getLendingContract, getCUSDContract } from '@/utils/contracts'

export default function DashboardPage() {
  const { address, isConnected } = useWallet()
  const [senteScore, setSenteScore] = useState<number>(0)
  const [creditData, setCreditData] = useState<any>(null)
  const [loanDetails, setLoanDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData()
    }
  }, [isConnected, address])

  const loadDashboardData = async () => {
    if (!address) return
    setLoading(true)
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getLendingContract(provider)
      const cUSD = getCUSDContract(provider)
      
      // Get balance
      const bal = await cUSD.balanceOf(address)
      setBalance(ethers.utils.formatEther(bal))
      
      // Get SenteScore
      const score = await contract.getSenteScore(address)
      setSenteScore(score.toNumber())
      
      // Get credit data
      const credit = await contract.getCreditData(address)
      setCreditData({
        senteScore: credit.senteScore.toNumber(),
        totalLoans: credit.totalLoans.toNumber(),
        successfulRepayments: credit.successfulRepayments.toNumber(),
        transactionCount: credit.transactionCount.toNumber(),
      })
      
      // Get loan details
      const loan = await contract.getLoanDetails(address)
      if (loan.active) {
        setLoanDetails({
          amount: ethers.utils.formatEther(loan.amount),
          interestRate: loan.interestRate.toNumber() / 100,
          dueDate: new Date(loan.dueDate.toNumber() * 1000),
          totalDue: ethers.utils.formatEther(loan.totalDue),
          remainingAmount: ethers.utils.formatEther(loan.remainingAmount),
          active: loan.active,
        })
      } else {
        setLoanDetails(null)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const boostScore = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = getLendingContract(signer)
      
      const tx = await contract.recordTransaction()
      await tx.wait()
      
      alert('Transaction recorded! Score updated.')
      loadDashboardData()
    } catch (error: any) {
      console.error('Error boosting score:', error)
      alert(error.message || 'Failed to boost score')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to access the dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celo-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* SenteScore Card */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Your SenteScore</h2>
              <div className="text-center py-8">
                <div className={`text-6xl font-bold ${getScoreColor(senteScore)}`}>
                  {senteScore}
                </div>
                <div className="text-lg text-gray-600 mt-2">
                  {getScoreRating(senteScore)}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Minimum score for loans: 60
                </div>
              </div>
              <button 
                onClick={boostScore}
                className="btn-secondary w-full mt-4"
              >
                🚀 Record Activity (Boost Score)
              </button>
            </div>

            {/* Balance Card */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Account Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">cUSD Balance</p>
                  <p className="text-2xl font-bold">{parseFloat(balance).toFixed(2)} cUSD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-sm font-mono">{address?.slice(0, 10)}...{address?.slice(-8)}</p>
                </div>
              </div>
            </div>

            {/* Credit History Card */}
            {creditData && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Credit History</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Loans</span>
                    <span className="font-semibold">{creditData.totalLoans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successful Repayments</span>
                    <span className="font-semibold">{creditData.successfulRepayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Count</span>
                    <span className="font-semibold">{creditData.transactionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repayment Rate</span>
                    <span className="font-semibold">
                      {creditData.totalLoans > 0 
                        ? `${((creditData.successfulRepayments / creditData.totalLoans) * 100).toFixed(0)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Loan Card */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Active Loan</h2>
              {loanDetails ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">{parseFloat(loanDetails.amount).toFixed(2)} cUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{loanDetails.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Due</span>
                    <span className="font-semibold">{parseFloat(loanDetails.totalDue).toFixed(2)} cUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className="font-semibold">{loanDetails.dueDate.toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4">
                    <a href="/repay" className="btn-primary w-full block text-center">
                      Repay Loan
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No active loan</p>
                  <a href="/borrow" className="btn-primary inline-block">
                    Request Loan
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
