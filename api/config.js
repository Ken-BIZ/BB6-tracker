module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    // Set to the company domain (hcatwn.com) to require Google sign-in; empty keeps the old name picker
    authDomain: String(process.env.AUTH_DOMAIN || '').trim().toLowerCase()
  });
};
