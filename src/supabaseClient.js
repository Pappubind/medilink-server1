import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiqroedomlwquywuibiy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcXJvZWRvbWx3cXV5d3VpYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MzMxMjgsImV4cCI6MjA1MzAwOTEyOH0.9aq_Q1QG2n_GxXRDvEoTOCnDaCfLcllxMgg2yZ5sWaE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
