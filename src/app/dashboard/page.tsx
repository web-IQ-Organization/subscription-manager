
import SubscriptionList from '@/components/SubscriptionList';
import React from "react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'annual' | 'weekly';
  next_billing_date: string;
  status: 'active' | 'paused' | 'cancelled';
}

// Temporarily mock fetch function for development
// In a real app, this would be a server-side API call
const fetchSubscriptions = async (): Promise<Subscription[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    // { id: '1', name: 'Netflix', amount: 15.99, billing_cycle: 'monthly', next_billing_date: '2024-04-01', status: 'active' },
    // { id: '2', name: 'Spotify', amount: 9.99, billing_cycle: 'monthly', next_billing_date: '2024-04-05', status: 'active' },
    // { id: '3', name: 'Annual Software', amount: 119.99, billing_cycle: 'annual', next_billing_date: '2025-01-20', status: 'paused' },
    // { id: '4', name: 'Gym Membership', amount: 30.00, billing_cycle: 'weekly', next_billing_date: '2024-03-28', status: 'active' },
  ];
};

const DashboardPage: React.FC = async () => {
  const subscriptions = await fetchSubscriptions(); // Fetch data on the server

  const calculateMonthlySpend = (subs: Subscription[]) => {
    let total = 0;
    subs.forEach(sub => {
      switch (sub.billing_cycle) {
        case 'monthly':
          total += sub.amount;
          break;
        case 'annual':
          total += sub.amount / 12;
          break;
        case 'weekly':
          total += (sub.amount * 52) / 12;
          break;
      }
    });
    return total;
  };

  const totalMonthlySpend = calculateMonthlySpend(subscriptions);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-white">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900 shadow rounded-lg p-6 border border-zinc-700">
                <h2 className="text-lg font-medium text-zinc-300">Total Monthly Spend</h2>
                <p className="mt-1 text-4xl font-semibold text-white">${totalMonthlySpend.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 shadow rounded-lg p-6 border border-zinc-700">
                <h2 className="text-lg font-medium text-zinc-300">Total Subscriptions</h2>
                <p className="mt-1 text-4xl font-semibold text-white">{subscriptions.length}</p>
              </div>
            </div>
            <SubscriptionList initialSubscriptions={subscriptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
