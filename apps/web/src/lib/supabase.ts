import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alqirwjbzzejpebmlpmy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODM3NzcsImV4cCI6MjA2Nzk1OTc3N30.GgyDZAH9eKPvlMlwjzzhdPANJQbjxSLWEFmsCovIFbA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)