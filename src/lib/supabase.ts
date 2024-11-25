import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add error handling for connection issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Add connection status monitoring
supabase.channel('system')
  .on('system', { event: '*' }, (payload) => {
    console.log('Supabase system event:', payload);
  })
  .subscribe((status) => {
    console.log('Supabase connection status:', status);
  });

console.log('Supabase client initialized with URL:', supabaseUrl);