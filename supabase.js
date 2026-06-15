const SUPABASE_URL = "https://nvwogbdhxkeipprykfvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52d29nYmRoeGtlaXBwcnlrZnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTc3ODksImV4cCI6MjA5NDA3Mzc4OX0.A7i0Or4ZZID3Bs3fJ_60kiSrzt7TmiIszWjZC6e-KGY";

let supabaseClient = null;

if (window.supabase?.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase client library did not load. Check the CDN script before supabase.js.");
}
