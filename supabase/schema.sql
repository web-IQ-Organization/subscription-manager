
-- Create the users table
CREATE TABLE users (
    id uuid PRIMARY KEY,
    clerk_user_id text UNIQUE NOT NULL,
    email text,
    created_at timestamptz DEFAULT now()
);

-- Create the subscriptions table
CREATE TABLE subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    amount numeric(10,2) NOT NULL,
    billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly','annual','weekly')),
    next_billing_date date NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active','cancelled','paused')),
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for subscriptions
CREATE POLICY user_subscriptions_policy ON subscriptions FOR ALL USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid()));

-- Create the billing_events table
CREATE TABLE billing_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    billed_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on billing_events
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for billing_events
CREATE POLICY user_billing_events_policy ON billing_events FOR ALL USING (subscription_id IN (SELECT id FROM subscriptions WHERE user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid())));
