
'use client';

import React from 'react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'annual' | 'weekly';
  next_billing_date: string;
  status: 'active' | 'paused' | 'cancelled';
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBillingCycleText = (cycle: 'monthly' | 'annual' | 'weekly') => {
    switch (cycle) {
      case 'monthly':
        return '/mo';
      case 'annual':
        return '/yr';
      case 'weekly':
        return '/wk';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status: 'active' | 'paused' | 'cancelled') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${subscription.name}?`)) {
      try {
        const response = await fetch(`/api/subscriptions?id=${subscription.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete subscription');
        }

        onDelete(subscription.id);
      } catch (err) {
        console.error('Error deleting subscription:', err);
        alert(`Error deleting subscription: ${(err as Error).message}`);
      }
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md p-6 relative hover:bg-zinc-800 transition-colors duration-200 border border-zinc-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{subscription.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusBadgeClass(subscription.status)}`}>
          {subscription.status}
        </span>
      </div>
      <p className="text-zinc-300 text-3xl font-bold mb-2">
        {formatCurrency(subscription.amount)}<span className="text-zinc-500 text-base font-normal">{getBillingCycleText(subscription.billing_cycle)}</span>
      </p>
      <p className="text-zinc-400 text-sm mb-4">
        Next Billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
      </p>
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
      >
        Delete
      </button>
    </div>
  );
};

export default SubscriptionCard;
