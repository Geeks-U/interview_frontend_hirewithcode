import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwnbrcptplwmdfzpygjm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bmJyY3B0cGx3bWRmenB5Z2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDI3ODIsImV4cCI6MjA2MzIxODc4Mn0.ibjL6FS6gt7utfExJZhfYFfXHknCvflUz86W3C2SYzE'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)