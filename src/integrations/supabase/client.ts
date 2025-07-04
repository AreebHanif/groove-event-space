// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mayspxistsfkoosebnmx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXNweGlzdHNma29vc2Vibm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjUwMDIsImV4cCI6MjA2Njg0MTAwMn0.BTAuSWBKMiMu7isyRgc_Nd51wPhvKd-hGNlYeJl4lZk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});