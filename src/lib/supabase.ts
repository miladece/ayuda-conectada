import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oajiogplgtyxamzzcyxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hamlvZ3BsZ3R5eGFtenpjeXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDQ0MzcsImV4cCI6MjA0ODAyMDQzN30.yfLffoDUukVUj0Li2Sqn5kC5alC9XPY-4hZ97ijkK-w';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);