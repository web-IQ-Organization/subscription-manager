
'use client';

import React, { useState } from 'react';

interface AddSubscriptionModalProps {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onSuccess, onClose, isOpen }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual' | 'weekly'>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (name.trim() === '' || amount === '' || nextBillingDate.trim() === '') {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount as string),
          billing_cycle: billingCycle,
          next_billing_date: nextBillingDate,
          status: 'active', // Default status for new subscriptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add subscription');
      }

      onSuccess();
      onClose();
      // Reset form
      setName('');
      setAmount('');
      setBillingCycle('monthly');
      setNextBillingDate('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Subscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Netflix"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:ring-indigo-500 focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="e.g., 15.99"
              required
            />
          </div>
          <div>
            <label htmlFor="billingCycle" className="block text-sm font-medium text-zinc-300 mb-1">
              Billing Cycle
            </label>
            <select
              id="billingCycle"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'annual' | 'weekly')}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label htmlFor="nextBillingDate" className="block text-sm font-medium text-zinc-300 mb-1">
              Next Billing Date
            </label>
            <input
              type="date"
              id="nextBillingDate"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
