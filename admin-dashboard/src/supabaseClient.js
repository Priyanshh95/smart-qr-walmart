// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrxdqlahemddhlrvjrzu.supabase.co'; // your project URL

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeGRxbGFoZW1kZGhscnZqcnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTQyMjEsImV4cCI6MjA2Nzk3MDIyMX0.TmFmDvonewBRaXFIQulcnmdnG79err-XotKYs4-walQ';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
