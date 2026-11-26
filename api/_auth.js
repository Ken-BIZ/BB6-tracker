// Who is calling: a signed-in Google account on the company domain, and which BB6 member it is.
// Only active when AUTH_DOMAIN is set in Vercel (e.g. hcatwn.com); without it everything stays open as before.
// Files starting with "_" in /api are helpers, not endpoints.
async function companyUser(req) {
  const domain = String(process.env.AUTH_DOMAIN || '').trim().toLowerCase();
  if (!domain) return { ok: true, open: true, name: null };
  const m = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  if (!m) return { ok: false, status: 401, error: '請先用公司 Google 帳號登入' };
  const base = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  const headers = { apikey: key, Authorization: 'Bearer ' + m[1] };
  let user;
  try {
    const r = await fetch(base + '/auth/v1/user', { headers });
    if (!r.ok) return { ok: false, status: 401, error: '登入已過期，請重新整理頁面' };
    user = await r.json();
  } catch (e) {
    return { ok: false, status: 502, error: '暫時無法確認登入，請稍後再試' };
  }
  const email = String(user.email || '').toLowerCase();
  const provider = user.app_metadata && user.app_metadata.provider;
  if (provider !== 'google' || !email.endsWith('@' + domain)) {
    return { ok: false, status: 403, error: '只限 @' + domain + ' 的 Google 帳號' };
  }
  // Member name for this email; none means the account can only view
  let name = null;
  try {
    const r = await fetch(base + '/rest/v1/bb6_members?select=name&email=eq.' + encodeURIComponent(email), { headers });
    if (r.ok) { const rows = await r.json(); if (rows[0]) name = rows[0].name; }
  } catch (e) {}
  return { ok: true, open: false, email, name };
}

module.exports = { companyUser };
