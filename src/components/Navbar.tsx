'use client'

import Link from 'next/link'
import { useWallet } from './WalletProvider'

export default function Navbar() {
  const { address, isConnected, connectWallet } = useWallet()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-celo-green">
            💚 SenteChain
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-celo-green transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-celo-green transition-colors">
              Dashboard
            </Link>
            <Link href="/borrow" className="hover:text-celo-green transition-colors">
              Borrow
            </Link>
            <Link href="/repay" className="hover:text-celo-green transition-colors">
              Repay
            </Link>
          </div>

          <div>
            {isConnected && address ? (
              <div className="bg-celo-green text-white px-4 py-2 rounded-lg font-mono text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
