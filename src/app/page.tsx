import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-celo-green to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Celo SenteChain 💚💸
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            AI-Powered Decentralized Lending on Celo
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
            Access loans using your SenteScore - no traditional collateral needed. 
            Fast, transparent, and fair.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary bg-white text-celo-green hover:bg-gray-100">
              Get Started
            </Link>
            <Link href="#how-it-works" className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-celo-green">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SenteChain?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Credit Scoring</h3>
              <p className="text-gray-600">
                Your SenteScore (0-100) is calculated from on-chain activity, 
                not credit bureaus.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
              <p className="text-gray-600">
                Connect wallet, check score, borrow cUSD - all in minutes.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Transparent & Secure</h3>
              <p className="text-gray-600">
                All transactions on Celo blockchain. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-celo-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Connect Your Wallet</h3>
                <p className="text-gray-600">Use MetaMask to connect to Celo network</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-celo-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Check Your SenteScore</h3>
                <p className="text-gray-600">AI analyzes your on-chain activity and generates a score</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-celo-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Request a Loan</h3>
                <p className="text-gray-600">Borrow up to 1000 cUSD if your score is 60+</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-celo-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Repay & Build Credit</h3>
                <p className="text-gray-600">Repay on time to improve your SenteScore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-celo-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join the future of decentralized lending on Celo
          </p>
          <Link href="/dashboard" className="btn-primary bg-white text-celo-green hover:bg-gray-100">
            Launch App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">Built with 💚 on Celo</p>
          <p className="text-sm opacity-70">Karma Gap - Proof of Ship</p>
        </div>
      </footer>
    </div>
  )
}
