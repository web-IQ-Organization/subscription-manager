import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/nextjs/app-beta/client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 py-20 md:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in-up">
            Stop Losing Money to Forgotten Subscriptions
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-10 animate-fade-in-up delay-100">
            Effortlessly manage, track, and get alerts for all your recurring payments in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                  Get Started - It's Free
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Link href="#" className="text-indigo-400 hover:text-indigo-300 font-medium py-3 px-8 rounded-full transition-colors duration-300">
                  Already a user? Sign In
                </Link>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Go to Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-900 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Smarter Subscription Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg border border-zinc-700 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Auto-detect from email</h3>
              <p className="text-zinc-400">Our intelligent system can scan your emails (with permission) to automatically find and add subscriptions.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg border border-zinc-700 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Unified dashboard</h3>
              <p className="text-zinc-400">See all your subscriptions in one clean, intuitive interface. No more guessing where your money goes.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg border border-zinc-700 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4">Renewal alerts</h3>
              <p className="text-zinc-400">Get timely notifications before your subscriptions renew, so you can decide to keep or cancel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-zinc-950 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple Pricing for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pricing Card 1: Free */}
            <div className="bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-zinc-400 text-lg mb-6">For individuals getting started</p>
              <p className="text-4xl font-extrabold mb-2">$0</p>
              <p className="text-zinc-500 mb-6">per month</p>
              <ul className="text-zinc-300 space-y-3 flex-grow">
                <li>✓ Up to 5 subscriptions</li>
                <li>✓ Basic tracking</li>
                <li>✓ Email renewal alerts</li>
              </ul>
              <button className="mt-8 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 cursor-not-allowed opacity-75">
                Current Plan
              </button>
            </div>

            {/* Pricing Card 2: Pro */}
            <div className="bg-zinc-900 p-8 rounded-xl shadow-xl border border-indigo-600 ring-2 ring-indigo-600 flex flex-col relative">
              <span className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-indigo-300 text-lg mb-6">Unlock powerful insights</p>
              <p className="text-4xl font-extrabold mb-2">$4.99</p>
              <p className="text-zinc-500 mb-6">per month</p>
              <ul className="text-zinc-300 space-y-3 flex-grow">
                <li>✓ Unlimited subscriptions</li>
                <li>✓ Advanced analytics</li>
                <li>✓ SMS & Email alerts</li>
                <li>✓ Custom categories</li>
              </ul>
              <SignUpButton mode="modal">
                <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                  Choose Pro
                </button>
              </SignUpButton>
            </div>

            {/* Pricing Card 3: B2B */}
            <div className="bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">B2B</h3>
              <p className="text-zinc-400 text-lg mb-6">For teams and enterprises</p>
              <p className="text-4xl font-extrabold mb-2">$19.99</p>
              <p className="text-zinc-500 mb-6">per month</p>
              <ul className="text-zinc-300 space-y-3 flex-grow">
                <li>✓ Team access & Dashboards</li>
                <li>✓ API access</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
              </ul>
              <button className="mt-8 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-10 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Subscription Manager. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <Link href="#" className="hover:text-white mx-2">Privacy Policy</Link>|
            <Link href="#" className="hover:text-white mx-2">Terms of Service</Link>
          </p>
        </div>
      </footer>

      <style jsx global>{`
        html, body { scroll-behavior: smooth; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
