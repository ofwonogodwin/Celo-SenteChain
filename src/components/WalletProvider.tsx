'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          await ensureCeloNetwork()
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const ensureCeloNetwork = async () => {
    if (!window.ethereum) return

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      // Celo Mainnet: 42220 (0xa4ec), Alfajores: 44787 (0xaef3)
      const celoMainnetChainId = '0xa4ec'
      const alfajoresChainId = '0xaef3'
      
      if (chainId !== celoMainnetChainId && chainId !== alfajoresChainId) {
        // Try to switch to Celo Mainnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: celoMainnetChainId }],
          })
        } catch (switchError: any) {
          // If network not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: celoMainnetChainId,
                chainName: 'Celo Mainnet',
                nativeCurrency: {
                  name: 'CELO',
                  symbol: 'CELO',
                  decimals: 18
                },
                rpcUrls: ['https://forno.celo.org'],
                blockExplorerUrls: ['https://explorer.celo.org/mainnet']
              }]
            })
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring Celo network:', error)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this app')
      return
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        await ensureCeloNetwork()
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      alert(error.message || 'Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0])
      setIsConnected(true)
    } else {
      disconnectWallet()
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
