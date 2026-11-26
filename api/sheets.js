// Proxy between BB6 and the Apps Script web apps bound to the two Google Sheets.
// The Apps Script URLs and the shared token stay on the server (Vercel env), never in the page.
//   GET  /api/sheets?src=video|material&action=read
//   GET  /api/sheets?src=video|material&action=changes&days=14
//   POST /api/sheets?src=video|material   { sheetId, row, col, value, expected, by }
//   POST /api/sheets?src=video|material   { action: 'flag', sheetId, row, col, note, auto, text, by } | { action: 'resolve', id, by }
const { companyUser } = require('./_auth');

const SOURCES = {
  video: 'SHEET_VIDEO_URL',
  material: 'SHEET_MATERIAL_URL'
};

// When Apps Script answers with an HTML page instead of JSON, say which setup step is off
function diagnose(url, r, text) {
  if (!/\/exec(\?|$)/.test(url)) return '網址要用「網頁應用程式」那個 /exec 結尾的網址（不是 /dev，也不是編輯器網址）';
  if (/accounts\.google\.com|ServiceLogin/.test(r.url + text)) return 'Apps Script 部署的「誰可以存取」要選「所有人」';
  if (/doGet|doPost/.test(text)) return 'Apps Script 找不到 doGet／doPost：程式碼要貼上、儲存，再部署「新版本」';
  if (r.status === 404) return '找不到這個 Apps Script 部署，請確認網址完整、部署沒有被封存';
  if (/authoriz|授權/i.test(text)) return 'Apps Script 還沒授權：在編輯器按一次「執行」或重新部署並允許權限';
  return '試算表沒有回傳資料（HTTP ' + r.status + '），請確認 Apps Script 已部署為網頁應用程式';
}

async function callScript(res, promise, url) {
  try {
    const r = await promise;
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch (e) {
      // Google's error page text (no secrets in it) helps tell setup problems apart
      const detail = text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      return res.status(502).json({ ok: false, error: diagnose(url, r, text), status: r.status, detail: detail });
    }
    if (data && data.error === 'unauthorized') {
      return res.status(502).json({ ok: false, error: '試算表的 BB6_TOKEN 和 Vercel 的 SHEET_TOKEN 不一致' });
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ ok: false, error: '連不上試算表，請稍後再試' });
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const envKey = SOURCES[req.query.src];
  if (!envKey) return res.status(400).json({ ok: false, error: 'unknown source' });
  const url = process.env[envKey];
  const token = process.env.SHEET_TOKEN;
  if (!url || !token) return res.status(200).json({ ok: false, setup: true });

  // With AUTH_DOMAIN set: company Google accounts can read; only BB6 members can change anything
  const who = await companyUser(req);
  if (!who.ok) return res.status(who.status).json({ ok: false, auth: true, error: who.error });
  if (req.method === 'POST' && !who.open && !who.name) {
    return res.status(403).json({ ok: false, error: '你的帳號目前只能檢視，不能修改' });
  }
  // Edits are recorded under the signed-in member, not whatever name the page sends
  const by = (b) => String(who.name || (b && b.by) || 'BB6').slice(0, 40);

  if (req.method === 'GET') {
    const action = req.query.action === 'changes' ? 'changes' : 'read';
    const days = Math.min(60, Math.max(1, Number(req.query.days) || 14));
    const q = '?action=' + action + '&days=' + days + '&token=' + encodeURIComponent(token);
    return callScript(res, fetch(url + q, { redirect: 'follow' }), url);
  }

  if (req.method === 'POST') {
    let b = req.body || {};
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    // Self test: writes a file chip on a throwaway sheet in the spreadsheet and deletes it again
    if (b.action === 'selftest') {
      return callScript(res, fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'selftest', token }), redirect: 'follow'
      }), url);
    }
    const post = (payload) => callScript(res, fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ token }, payload)), redirect: 'follow'
    }), url);
    // 待討論: mark a cell for discussion, or mark a flag as handled
    if (b.action === 'resolve') {
      return post({ action: 'resolve', id: String(b.id || '').slice(0, 40), by: by(b) });
    }
    const row = Number(b.row), col = Number(b.col), sheetId = Number(b.sheetId);
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 1 || col < 1 || !Number.isInteger(sheetId)) {
      return res.status(400).json({ ok: false, error: '儲存格位置不正確' });
    }
    if (b.action === 'flag') {
      return post({ action: 'flag', sheetId, row, col, auto: !!b.auto,
        note: String(b.note || '').slice(0, 500), text: String(b.text || '').slice(0, 2000), by: by(b) });
    }
    const payload = {
      action: 'write', token,
      sheetId, row, col,
      value: String(b.value == null ? '' : b.value).slice(0, 50000),
      expected: typeof b.expected === 'string' ? b.expected : undefined,
      by: by(b)
    };
    // Apps Script answers a POST with a redirect to the result; fetch follows it as a GET
    return callScript(res, fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }), url);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'method not allowed' });
};
