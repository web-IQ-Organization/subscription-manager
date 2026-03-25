import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'annual' | 'weekly';
  next_billing_date: string;
  status: 'active' | 'cancelled' | 'paused';
  created_at: string;
}

type NewSubscription = Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'status'>;

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    // First, get the internal user ID from our 'users' table using Clerk's userId
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return new NextResponse('User not found', { status: 404 });
    }

    const internalUserId = userData.id;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', internalUserId);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in GET /api/subscriptions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    const body: NewSubscription = await req.json();
    const { name, amount, billing_cycle, next_billing_date } = body;

    if (!name || !amount || !billing_cycle || !next_billing_date) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Ensure the internal user ID exists or create it
    let internalUserId: string;
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();
    
    if (userError || !userData) { // If user not found, create them
        const { data: newUserData, error: newUserError } = await supabase
            .from('users')
            .insert({ clerk_user_id: userId, email: auth().user?.emailAddresses[0]?.emailAddress || '' })
            .select('id')
            .single();
        if (newUserError || !newUserData) {
            console.error('Error creating user:', newUserError);
            return new NextResponse('Failed to create user', { status: 500 });
        }
        internalUserId = newUserData.id;
    } else {
        internalUserId = userData.id;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: internalUserId,
        name,
        amount,
        billing_cycle,
        next_billing_date,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/subscriptions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createServiceClient();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Subscription ID is required', { status: 400 });
    }

    // First, get the internal user ID from our 'users' table using Clerk's userId
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return new NextResponse('User not found', { status: 404 });
    }

    const internalUserId = userData.id;

    // Delete the subscription, ensuring it belongs to the authenticated user
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', internalUserId); // RLS should handle this, but explicit check adds safety

    if (error) {
      console.error('Error deleting subscription:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/subscriptions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
