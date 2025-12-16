'use client'

import { useWallet } from '@/components/WalletProvider'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getLendingContract } from '@/utils/contracts'
import { useRouter } from 'next/navigation'

export default function BorrowPage() {
  const { address, isConnected } = useWallet()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [senteScore, setSenteScore] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [hasActiveLoan, setHasActiveLoan] = useState(false)
  const [interestRate, setInterestRate] = useState(0)

  useEffect(() => {
    if (isConnected && address) {
      loadBorrowData()
    }
  }, [isConnected, address])

  const loadBorrowData = async () => {
    if (!address) return
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getLendingContract(provider)
      
      // Get score
      const score = await contract.getSenteScore(address)
      setSenteScore(score.toNumber())
      
      // Calculate interest rate
      const rate = await contract.calculateInterestRate(score)
      setInterestRate(rate.toNumber() / 100)
      
      // Check for active loan
      const loan = await contract.getLoanDetails(address)
      setHasActiveLoan(loan.active)
    } catch (error) {
      console.error('Error loading borrow data:', error)
    }
  }

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > 1000) {
      alert('Maximum loan amount is 1000 cUSD')
      return
    }

    if (senteScore < 60) {
      alert('Your SenteScore is too low. Minimum score required is 60.')
      return
    }

    setLoading(true)
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = getLendingContract(signer)
      
      const amountWei = ethers.utils.parseEther(amount)
      
      const tx = await contract.requestLoan(amountWei)
      await tx.wait()
      
      alert('Loan approved! cUSD has been sent to your wallet.')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error requesting loan:', error)
      alert(error.message || 'Failed to request loan')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalDue = () => {
    if (!amount || parseFloat(amount) <= 0) return 0
    const principal = parseFloat(amount)
    const interest = (principal * interestRate) / 100
    return principal + interest
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to request a loan</p>
        </div>
      </div>
    )
  }

  if (hasActiveLoan) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Active Loan Exists</h1>
          <p className="text-gray-600 mb-8">You already have an active loan. Please repay it before requesting a new one.</p>
          <a href="/repay" className="btn-primary">
            Go to Repay
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Request a Loan</h1>
          
          {/* Score Check */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Eligibility Check</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your SenteScore</span>
                <span className={`text-2xl font-bold ${senteScore >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {senteScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Minimum Required</span>
                <span className="font-semibold">60</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your Interest Rate</span>
                <span className="font-semibold">{interestRate}%</span>
              </div>
              {senteScore < 60 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-800 text-sm">
                    ⚠️ Your SenteScore is too low. Boost your score by recording transactions on the dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Loan Request Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <form onSubmit={handleBorrow}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (cUSD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (max 1000)"
                  max="1000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celo-green focus:border-transparent"
                  disabled={senteScore < 60}
                />
                <p className="text-sm text-gray-500 mt-1">Maximum: 1000 cUSD</p>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3">Loan Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal</span>
                      <span className="font-semibold">{parseFloat(amount).toFixed(2)} cUSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest ({interestRate}%)</span>
                      <span className="font-semibold">
                        {((parseFloat(amount) * interestRate) / 100).toFixed(2)} cUSD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Duration</span>
                      <span className="font-semibold">30 days</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Total to Repay</span>
                      <span className="font-bold text-celo-green">
                        {calculateTotalDue().toFixed(2)} cUSD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || senteScore < 60 || !amount || parseFloat(amount) <= 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Request Loan'}
              </button>
            </form>
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
