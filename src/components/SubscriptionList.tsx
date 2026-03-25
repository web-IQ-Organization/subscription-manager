
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AddSubscriptionModal from './AddSubscriptionModal';
import SubscriptionCard from './SubscriptionCard';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'annual' | 'weekly';
  next_billing_date: string;
  status: 'active' | 'paused' | 'cancelled';
}

interface SubscriptionListProps {
  initialSubscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ initialSubscriptions }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data: Subscription[] = await response.json();
      setSubscriptions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSubscriptions(initialSubscriptions);
  }, [initialSubscriptions]);

  const handleSubscriptionAdded = () => {
    fetchSubscriptions();
  };

  const handleSubscriptionDeleted = () => {
    fetchSubscriptions();
  };

  if (loading) return <div className="text-center text-zinc-400">Loading subscriptions...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Subscription
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-400 text-xl mb-4">No subscriptions yet. Add your first one!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center p-4 border border-transparent text-xl font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onDelete={handleSubscriptionDeleted}
              />
            ))}
          </div>
        )}

        <AddSubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSubscriptionAdded}
        />
      </div>
    </div>
  );
};

export default SubscriptionList;
