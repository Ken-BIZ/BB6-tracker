/**
 * BB6 ⇄ Google 試算表同步（影片清單、教材總表共用同一份）
 *
 * 安裝（每份試算表各做一次）：
 * 1. 試算表 → 擴充功能 → Apps Script，把這整份貼上（取代原本的 Code.gs）並儲存。
 * 2. 左側齒輪「專案設定」→ 指令碼屬性 → 新增 BB6_TOKEN，值和 Vercel 的 SHEET_TOKEN 相同。
 * 3. 右上「部署」→ 新增部署作業 → 類型選「網頁應用程式」
 *    執行身分：我；誰可以存取：所有人 → 部署，依提示授權。
 * 4. 複製網頁應用程式網址，貼到 Vercel 環境變數：
 *    影片清單 → SHEET_VIDEO_URL，教材總表 → SHEET_MATERIAL_URL。
 *
 * 之後修改這份程式碼時：部署 → 管理部署作業 → 編輯 → 版本選「新版本」，網址不變。
 *
 * 修改紀錄寫在隱藏工作表「BB6 變更紀錄」：在試算表直接改（onEdit）和從 BB6 改（doPost）都會記。
 */

var LOG_SHEET = 'BB6 變更紀錄';
var LOG_HEAD = ['時間', '修改者', '來源', '工作表', '儲存格', '列', '欄位', '原內容', '新內容'];
var LOG_MAX_ROWS = 5000;
var SCRIPT_VERSION = 2;   // 2: reads cell links and keeps a cell's link when BB6 edits its text

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function checkToken_(token) {
  var want = PropertiesService.getScriptProperties().getProperty('BB6_TOKEN');
  if (!want || token !== want) throw new Error('unauthorized');
}

function doGet(e) {
  try {
    checkToken_(e.parameter.token);
    var action = e.parameter.action;
    if (action === 'read') return json_(readAll_());
    if (action === 'changes') return json_({ ok: true, changes: readLog_(Number(e.parameter.days) || 14) });
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    checkToken_(body.token);
    if (body.action === 'write') return json_(write_(body));
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/* ── 讀取：每個可見工作表的顯示值，加上哪些格是公式 ── */
function readAll_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets().filter(function (sh) {
    return sh.getName() !== LOG_SHEET && !sh.isSheetHidden();
  }).map(function (sh) {
    var lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
    if (!lastRow || !lastCol) return { id: sh.getSheetId(), name: sh.getName(), rows: [], formulas: [] };
    var range = sh.getRange(1, 1, lastRow, lastCol);
    var formulas = [];
    range.getFormulas().forEach(function (row, r) {
      row.forEach(function (f, c) { if (f) formulas.push([r + 1, c + 1]); });
    });
    var links = [];
    range.getRichTextValues().forEach(function (row, r) {
      row.forEach(function (rt, c) {
        var urls = linkUrls_(rt);
        if (urls.length) links.push([r + 1, c + 1, urls]);
      });
    });
    return { id: sh.getSheetId(), name: sh.getName(), rows: range.getDisplayValues(), formulas: formulas, links: links };
  });
  return { ok: true, version: SCRIPT_VERSION, title: ss.getName(), url: ss.getUrl(), timeZone: ss.getSpreadsheetTimeZone(), sheets: sheets };
}

// Every distinct link in a cell's text (a cell can link different words to different files)
function linkUrls_(rt) {
  var urls = [];
  if (!rt) return urls;
  rt.getRuns().forEach(function (run) {
    var u = run.getLinkUrl();
    if (u && urls.indexOf(u) < 0) urls.push(u);
  });
  return urls;
}

/* ── 寫入一格：先確認沒被別人改過，再寫、再記錄 ── */
function write_(b) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheets().filter(function (s) { return s.getSheetId() === Number(b.sheetId); })[0];
    if (!sh || sh.getName() === LOG_SHEET) return { ok: false, error: '找不到工作表' };
    var row = Number(b.row), col = Number(b.col);
    if (!(row >= 1 && col >= 1)) return { ok: false, error: '儲存格位置不正確' };
    var cell = sh.getRange(row, col);
    if (cell.getFormula()) return { ok: false, error: '這格是公式，請在試算表修改' };
    var current = cell.getDisplayValue();
    if (typeof b.expected === 'string' && current !== b.expected) {
      return { ok: false, conflict: true, current: current };
    }
    var value = String(b.value == null ? '' : b.value);
    if (value === current) return { ok: true, value: current, unchanged: true };
    // Keep the file link: a plain setValue would drop it
    var urls = linkUrls_(cell.getRichTextValue());
    if (urls.length > 1) return { ok: false, error: '這格有多個連結，請在試算表修改' };
    if (urls.length === 1 && value) {
      cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(value).setLinkUrl(urls[0]).build());
    } else {
      cell.setValue(value);
    }
    SpreadsheetApp.flush();
    var shown = cell.getDisplayValue();
    log_(sh, row, col, b.by || 'BB6', 'BB6', current, shown);
    return { ok: true, value: shown };
  } finally {
    lock.releaseLock();
  }
}

/* ── 直接在試算表修改時（簡易觸發器，不需要另外安裝） ── */
function onEdit(e) {
  try {
    var sh = e.range.getSheet();
    if (sh.getName() === LOG_SHEET) return;
    var who = '';
    try { who = Session.getActiveUser().getEmail(); } catch (x) {}
    var single = e.range.getNumRows() === 1 && e.range.getNumColumns() === 1;
    if (single) {
      var oldV = e.oldValue == null ? '' : String(e.oldValue);
      var newV = e.range.getDisplayValue();
      if (oldV === newV) return;
      log_(sh, e.range.getRow(), e.range.getColumn(), who || '試算表', '試算表', oldV, newV);
    } else {
      log_(sh, e.range.getRow(), e.range.getColumn(), who || '試算表', '試算表', '',
        '（一次修改 ' + e.range.getA1Notation() + '）', e.range.getA1Notation());
    }
  } catch (err) {
    // 記錄失敗不能擋住使用者的修改
  }
}

function logSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName(LOG_SHEET);
  if (!log) {
    log = ss.insertSheet(LOG_SHEET);
    log.appendRow(LOG_HEAD);
    log.setFrozenRows(1);
    log.hideSheet();
  }
  return log;
}

function headerRow_(sh) {
  var n = Math.min(5, sh.getLastRow());
  if (!n) return 1;
  var vals = sh.getRange(1, 1, n, sh.getLastColumn()).getDisplayValues();
  var best = 1, bestCount = -1;
  vals.forEach(function (row, i) {
    var count = row.filter(function (v) { return String(v).trim() !== ''; }).length;
    if (count > bestCount) { best = i + 1; bestCount = count; }
  });
  return best;
}

// Which row this is, in words: the nearest group label in column A above it, plus the next two columns
function rowLabel_(sh, row) {
  var lastCol = Math.min(3, sh.getLastColumn());
  var vals = sh.getRange(row, 1, 1, lastCol).getDisplayValues()[0];
  var group = String(vals[0] || '').trim();
  if (!group) {
    var from = Math.max(1, row - 300);
    var col = sh.getRange(from, 1, row - from + 1, 1).getDisplayValues();
    for (var i = col.length - 1; i >= 0; i--) { if (String(col[i][0]).trim()) { group = String(col[i][0]).trim(); break; } }
  }
  return [group].concat(vals.slice(1)).map(function (v) { return String(v).trim(); }).filter(Boolean).join(' ').slice(0, 120);
}

function log_(sh, row, col, who, source, oldV, newV, a1) {
  var log = logSheet_();
  var hr = headerRow_(sh);
  var header = row > hr ? String(sh.getRange(hr, col).getDisplayValue()).trim() : '';
  log.appendRow([new Date(), who, source, sh.getName(), a1 || sh.getRange(row, col).getA1Notation(),
    row > hr ? rowLabel_(sh, row) : '', header, String(oldV).slice(0, 2000), String(newV).slice(0, 2000)]);
  var extra = log.getLastRow() - 1 - LOG_MAX_ROWS;
  if (extra > 0) log.deleteRows(2, extra);
}

function readLog_(days) {
  var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET);
  if (!log || log.getLastRow() < 2) return [];
  var since = Date.now() - days * 86400000;
  var start = Math.max(2, log.getLastRow() - 999);
  var rows = log.getRange(start, 1, log.getLastRow() - start + 1, LOG_HEAD.length).getValues();
  return rows.filter(function (r) { return r[0] instanceof Date && r[0].getTime() >= since; })
    .reverse()
    .slice(0, 300)
    .map(function (r) {
      return { at: r[0].toISOString(), by: String(r[1]), source: String(r[2]), sheet: String(r[3]), cell: String(r[4]),
        row: String(r[5]), column: String(r[6]), from: String(r[7]), to: String(r[8]) };
    });
}
