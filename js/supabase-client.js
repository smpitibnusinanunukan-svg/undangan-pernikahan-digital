// ─── SUPABASE INITIALIZATION ────────────────────────────────
// Jangan hapus file ini, karena file ini adalah jembatan
// penghubung antara Antarmuka (HTML) dengan Database Anda.

const SUPABASE_URL = 'https://iieulfpcrvjsfdpmitdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZXVsZnBjcnZqc2ZkcG1pdGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjA5NjUsImV4cCI6MjA5MTU5Njk2NX0.m0Z8Fd6kHFyKOYrtwxK7G77EQSzbojo7IXSD65-hkj0';

// Initialize the client if the library is loaded via CDN
let supabase;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase Client Connected');
} else {
  console.error('❌ Supabase library missing. Ensure CDN script is loaded before this file.');
}
