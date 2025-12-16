'use client'

import { useWallet } from '@/components/WalletProvider'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getLendingContract, getCUSDContract } from '@/utils/contracts'
import { useRouter } from 'next/navigation'

export default function RepayPage() {
  const { address, isConnected } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loanDetails, setLoanDetails] = useState<any>(null)
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    if (isConnected && address) {
      loadLoanData()
    }
  }, [isConnected, address])

  const loadLoanData = async () => {
    if (!address) return
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getLendingContract(provider)
      const cUSD = getCUSDContract(provider)
      
      // Get balance
      const bal = await cUSD.balanceOf(address)
      setBalance(ethers.utils.formatEther(bal))
      
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
      }
    } catch (error) {
      console.error('Error loading loan data:', error)
    }
  }

  const handleRepay = async () => {
    if (!loanDetails) return
    
    setLoading(true)
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = getLendingContract(signer)
      const cUSD = getCUSDContract(signer)
      
      const remainingWei = ethers.utils.parseEther(loanDetails.remainingAmount)
      
      // Approve cUSD spending
      const approveTx = await cUSD.approve(contract.address, remainingWei)
      await approveTx.wait()
      
      // Repay loan
      const repayTx = await contract.repayLoan()
      await repayTx.wait()
      
      alert('Loan repaid successfully! Your SenteScore has been updated.')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error repaying loan:', error)
      alert(error.message || 'Failed to repay loan')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to repay your loan</p>
        </div>
      </div>
    )
  }

  if (!loanDetails) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">No Active Loan</h1>
          <p className="text-gray-600 mb-8">You don't have an active loan to repay</p>
          <a href="/borrow" className="btn-primary">
            Request a Loan
          </a>
        </div>
      </div>
    )
  }

  const daysUntilDue = Math.ceil((loanDetails.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0
  const hasEnoughBalance = parseFloat(balance) >= parseFloat(loanDetails.remainingAmount)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Repay Loan</h1>
          
          {/* Loan Details */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Loan Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Amount</span>
                <span className="font-semibold">{parseFloat(loanDetails.amount).toFixed(2)} cUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-semibold">{loanDetails.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Amount</span>
                <span className="font-semibold">
                  {((parseFloat(loanDetails.amount) * loanDetails.interestRate) / 100).toFixed(2)} cUSD
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total Due</span>
                <span className="font-bold text-lg text-celo-green">
                  {parseFloat(loanDetails.totalDue).toFixed(2)} cUSD
                </span>
              </div>
            </div>
          </div>

          {/* Due Date Warning */}
          <div className={`card mb-6 ${isOverdue ? 'border-2 border-red-500' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Due Date</h3>
                <p className="text-gray-600">{loanDetails.dueDate.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                {isOverdue ? (
                  <span className="text-red-600 font-bold">OVERDUE!</span>
                ) : (
                  <span className={`font-semibold ${daysUntilDue <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                    {daysUntilDue} days remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Balance Check */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">cUSD Balance</span>
                <span className="font-semibold">{parseFloat(balance).toFixed(2)} cUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Needed</span>
                <span className="font-semibold">{parseFloat(loanDetails.remainingAmount).toFixed(2)} cUSD</span>
              </div>
              {!hasEnoughBalance && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Insufficient balance. You need {(parseFloat(loanDetails.remainingAmount) - parseFloat(balance)).toFixed(2)} more cUSD.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Repay Button */}
          <div className="card">
            <button
              onClick={handleRepay}
              disabled={loading || !hasEnoughBalance}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Repay ${parseFloat(loanDetails.remainingAmount).toFixed(2)} cUSD`}
            </button>
            
            {!hasEnoughBalance && (
              <p className="text-sm text-gray-600 text-center mt-3">
                Get more cUSD from an exchange or faucet
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <a href="/dashboard" className="text-celo-green hover:underline">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
