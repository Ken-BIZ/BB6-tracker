// Proxy between BB6 and the Apps Script web apps bound to the two Google Sheets.
// The Apps Script URLs and the shared token stay on the server (Vercel env), never in the page.
//   GET  /api/sheets?src=video|material&action=read
//   GET  /api/sheets?src=video|material&action=changes&days=14
//   POST /api/sheets?src=video|material   { sheetId, row, col, value, expected, by }
const SOURCES = {
  video: 'SHEET_VIDEO_URL',
  material: 'SHEET_MATERIAL_URL'
};

async function callScript(res, promise) {
  try {
    const r = await promise;
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch (e) {
      return res.status(502).json({ ok: false, error: '試算表沒有回傳資料，請確認 Apps Script 已部署為「所有人」可存取' });
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

  if (req.method === 'GET') {
    const action = req.query.action === 'changes' ? 'changes' : 'read';
    const days = Math.min(60, Math.max(1, Number(req.query.days) || 14));
    const q = '?action=' + action + '&days=' + days + '&token=' + encodeURIComponent(token);
    return callScript(res, fetch(url + q, { redirect: 'follow' }));
  }

  if (req.method === 'POST') {
    let b = req.body || {};
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    const row = Number(b.row), col = Number(b.col), sheetId = Number(b.sheetId);
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 1 || col < 1 || !Number.isInteger(sheetId)) {
      return res.status(400).json({ ok: false, error: '儲存格位置不正確' });
    }
    const payload = {
      action: 'write', token,
      sheetId, row, col,
      value: String(b.value == null ? '' : b.value).slice(0, 50000),
      expected: typeof b.expected === 'string' ? b.expected : undefined,
      by: String(b.by || 'BB6').slice(0, 40)
    };
    // Apps Script answers a POST with a redirect to the result; fetch follows it as a GET
    return callScript(res, fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }));
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'method not allowed' });
};
