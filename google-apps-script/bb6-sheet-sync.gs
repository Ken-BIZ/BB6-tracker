/**
 * BB6 ⇄ Google 試算表同步（影片清單、教材總表共用同一份）
 *
 * 安裝（每份試算表各做一次）：
 * 1. 試算表 → 擴充功能 → Apps Script，把這整份貼上（取代原本的 Code.gs）並儲存。
 * 2. 左側齒輪「專案設定」→ 指令碼屬性 → 新增 BB6_TOKEN，值和 Vercel 的 SHEET_TOKEN 相同。
 * 3. 右上「部署」→ 新增部署作業 → 類型選「網頁應用程式」
 *    執行身分：我；誰可以存取：所有人 → 部署，依提示授權。
 *    另外在左側「服務」按 ＋，加入「Google Sheets API」：讀取檔案晶片（智慧型方塊）的連結需要它。
 * 4. 複製網頁應用程式網址，貼到 Vercel 環境變數：
 *    影片清單 → SHEET_VIDEO_URL，教材總表 → SHEET_MATERIAL_URL。
 *
 * 5. 從 BB6 寫入檔案晶片需要「讀取雲端硬碟」權限（drive.readonly，只能讀、不能改或刪檔案）：
 *    專案設定 → 勾選「在編輯器中顯示 appsscript.json 資訊清單檔案」，在 appsscript.json 加入 oauthScopes：
 *      "oauthScopes": [
 *        "https://www.googleapis.com/auth/spreadsheets",
 *        "https://www.googleapis.com/auth/drive.readonly",
 *        "https://www.googleapis.com/auth/userinfo.email"
 *      ],
 *    儲存後在上方函式選單選 authorizeBB6 → 執行 → 依提示授權。
 *
 * 之後修改這份程式碼時：部署 → 管理部署作業 → 編輯 → 版本選「新版本」，網址不變。
 *
 * 修改紀錄寫在隱藏工作表「BB6 變更紀錄」：在試算表直接改（onEdit）和從 BB6 改（doPost）都會記。
 */

var LOG_SHEET = 'BB6 變更紀錄';
var LOG_HEAD = ['時間', '修改者', '來源', '工作表', '儲存格', '列', '欄位', '原內容', '新內容'];
var LOG_MAX_ROWS = 5000;
var SCRIPT_VERSION = 4;   // 2: cell links, kept on edit; 3: reads file chips via the Sheets API service; 4: writes file chips
var URL_LINE = /^https?:\/\/\S+$/i;

// Run this once from the editor after changing permissions, so Google asks for them.
// Google's consent screen lets each permission be unticked; this asks again for any that are still missing.
function authorizeBB6() {
  if (ScriptApp.requireAllScopes) ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);
  var status = String(ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationStatus());
  Logger.log(status === 'NOT_REQUIRED' ? '權限都已授權完成' : '還有權限沒授權：' + status);
  return status;
}

// Run from the editor to try writing a file chip with the editor's own authorization; the result is in 執行記錄
function testChipBB6() {
  var result = selftest_();
  Logger.log(JSON.stringify(result));
  return result;
}

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
    if (body.action === 'selftest') return json_(selftest_());
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/* ── 讀取：每個可見工作表的顯示值，加上哪些格是公式 ── */
function readAll_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var api = null, apiError = '';
  try { api = apiLinks_(ss); } catch (err) { apiError = String(err && err.message || err); }
  var sheets = ss.getSheets().filter(function (sh) {
    return sh.getName() !== LOG_SHEET && !sh.isSheetHidden();
  }).map(function (sh) {
    var lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
    if (!lastRow || !lastCol) return { id: sh.getSheetId(), name: sh.getName(), rows: [], formulas: [], links: [], chips: [] };
    var range = sh.getRange(1, 1, lastRow, lastCol);
    var formulas = [];
    range.getFormulas().forEach(function (row, r) {
      row.forEach(function (f, c) { if (f) formulas.push([r + 1, c + 1]); });
    });
    var links = [], chips = [];
    var fromApi = api && api[sh.getSheetId()];
    if (fromApi) {
      fromApi.forEach(function (x) {
        links.push([x[0], x[1], x[2]]);
        if (x[3]) chips.push([x[0], x[1]]);
      });
    } else {
      range.getRichTextValues().forEach(function (row, r) {
        row.forEach(function (rt, c) {
          var urls = linkUrls_(rt);
          if (urls.length) links.push([r + 1, c + 1, urls]);
        });
      });
    }
    return { id: sh.getSheetId(), name: sh.getName(), rows: range.getDisplayValues(), formulas: formulas, links: links, chips: chips };
  });
  return { ok: true, version: SCRIPT_VERSION, chipsSupported: !!api, chipsError: apiError, title: ss.getName(), url: ss.getUrl(),
    timeZone: ss.getSpreadsheetTimeZone(), sheets: sheets };
}

// File chips (smart chips), cell hyperlinks and linked text, read through the Sheets API advanced service.
// Returns { sheetId: [[row, col, [urls], isChip]] }, or null when the service has not been added.
function apiLinks_(ss) {
  if (typeof Sheets === 'undefined') return null;
  var res = Sheets.Spreadsheets.get(ss.getId(), {
    fields: 'sheets(properties.sheetId,data(startRow,startColumn,rowData.values(hyperlink,chipRuns.chip.richLinkProperties.uri,textFormatRuns.format.link.uri)))'
  });
  var out = {};
  (res.sheets || []).forEach(function (sh) {
    var list = out[sh.properties.sheetId] = [];
    (sh.data || []).forEach(function (grid) {
      var r0 = grid.startRow || 0, c0 = grid.startColumn || 0;
      (grid.rowData || []).forEach(function (row, ri) {
        (row.values || []).forEach(function (v, ci) {
          var urls = [], chip = false;
          (v.chipRuns || []).forEach(function (run) {
            var u = run.chip && run.chip.richLinkProperties && run.chip.richLinkProperties.uri;
            if (u) { chip = true; if (urls.indexOf(u) < 0) urls.push(u); }
          });
          (v.textFormatRuns || []).forEach(function (run) {
            var u = run.format && run.format.link && run.format.link.uri;
            if (u && urls.indexOf(u) < 0) urls.push(u);
          });
          if (v.hyperlink && urls.indexOf(v.hyperlink) < 0) urls.push(v.hyperlink);
          if (urls.length) list.push([r0 + ri + 1, c0 + ci + 1, urls, chip]);
        });
      });
    });
  });
  return out;
}

// A file chip would turn into plain text if its cell were overwritten
function hasChip_(ss, sh, row, col) {
  if (typeof Sheets === 'undefined') return false;
  var a1 = "'" + sh.getName().replace(/'/g, "''") + "'!" + sh.getRange(row, col).getA1Notation();
  var res = Sheets.Spreadsheets.get(ss.getId(), { ranges: [a1], fields: 'sheets.data.rowData.values.chipRuns' });
  var v = res.sheets && res.sheets[0] && res.sheets[0].data && res.sheets[0].data[0] && res.sheets[0].data[0].rowData &&
    res.sheets[0].data[0].rowData[0] && res.sheets[0].data[0].rowData[0].values && res.sheets[0].data[0].rowData[0].values[0];
  return !!(v && v.chipRuns && v.chipRuns.length);
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

/* ── 寫入一格：先確認沒被別人改過，再寫、再記錄 ──
   內容全是網址（每行一個）時，寫成檔案晶片（智慧型方塊）；Google 不接受時，退回一般連結並回報原因。 */
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
    var value = String(b.value == null ? '' : b.value);
    var lines = value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var allUrls = lines.length > 0 && lines.every(function (l) { return URL_LINE.test(l); });
    var wasChip = hasChip_(ss, sh, row, col);
    if (wasChip && !allUrls) return { ok: false, error: '這格是檔案晶片：貼上雲端硬碟網址可以更換檔案，其他文字請在試算表修改' };
    var current = cell.getDisplayValue();
    if (typeof b.expected === 'string' && current !== b.expected) {
      return { ok: false, conflict: true, current: current };
    }
    if (value === current) return { ok: true, value: current, unchanged: true };

    var chipError = '';
    if (allUrls && typeof Sheets !== 'undefined') {
      try {
        writeChips_(ss, sh, row, col, lines);
        SpreadsheetApp.flush();
        if (hasChip_(ss, sh, row, col)) {
          var shownChip = cell.getDisplayValue();
          log_(sh, row, col, b.by || 'BB6', 'BB6', current, shownChip);
          return { ok: true, value: shownChip, chip: true, urls: lines };
        }
        chipError = 'Google 沒有把這個網址變成晶片（通常只有雲端硬碟的檔案或資料夾可以）';
      } catch (err) {
        chipError = String(err && err.message || err);
      }
    } else if (allUrls) {
      chipError = 'Apps Script 還沒加入 Google Sheets API 服務';
    }
    // Never downgrade an existing chip to plain text
    if (wasChip) return { ok: false, error: '沒能更換檔案晶片：' + chipError };

    if (allUrls && lines.length === 1) {
      cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(lines[0]).setLinkUrl(lines[0]).build());
    } else {
      // Keep the file link: a plain setValue would drop it
      var urls = linkUrls_(cell.getRichTextValue());
      if (urls.length > 1) return { ok: false, error: '這格有多個連結，請在試算表修改' };
      if (urls.length === 1 && value) {
        cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(value).setLinkUrl(urls[0]).build());
      } else {
        cell.setValue(value);
      }
    }
    SpreadsheetApp.flush();
    var shown = cell.getDisplayValue();
    log_(sh, row, col, b.by || 'BB6', 'BB6', current, shown);
    return { ok: true, value: shown, chipError: chipError || undefined, urls: allUrls ? lines : undefined };
  } finally {
    lock.releaseLock();
  }
}

// One chip per URL; the cell text holds an '@' placeholder for each chip, one per line
function writeChips_(ss, sh, row, col, urls) {
  Sheets.Spreadsheets.batchUpdate({ requests: [{ updateCells: {
    range: { sheetId: sh.getSheetId(), startRowIndex: row - 1, endRowIndex: row, startColumnIndex: col - 1, endColumnIndex: col },
    rows: [{ values: [{
      userEnteredValue: { stringValue: urls.map(function () { return '@'; }).join('\n') },
      chipRuns: urls.map(function (u, i) { return { startIndex: i * 2, chip: { richLinkProperties: { uri: u } } }; })
    }] }],
    fields: 'userEnteredValue,chipRuns'
  } }] }, ss.getId());
}

// Try writing a chip on a throwaway sheet, using a file link that already exists in this spreadsheet
function selftest_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var auth = '';
  try { auth = String(ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationStatus()); } catch (x) { auth = 'unknown: ' + x; }
  var r = selftestRun_(ss);
  r.authorization = auth;   // REQUIRED means the deployed web app still runs without the new permissions
  return r;
}
function selftestRun_(ss) {
  if (typeof Sheets === 'undefined') return { ok: false, error: 'Apps Script 還沒加入 Google Sheets API 服務' };
  var url = null, api = apiLinks_(ss);
  Object.keys(api).some(function (id) { return api[id].some(function (x) { if (x[3]) { url = x[2][0]; return true; } return false; }); });
  if (!url) return { ok: false, error: '試算表裡找不到現成的檔案晶片可以拿來測' };
  var tmp = ss.insertSheet('BB6 晶片測試（會自動刪除）');
  try {
    writeChips_(ss, tmp, 1, 1, [url]);
    SpreadsheetApp.flush();
    return { ok: true, chip: hasChip_(ss, tmp, 1, 1), shown: tmp.getRange(1, 1).getDisplayValue() };
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  } finally {
    ss.deleteSheet(tmp);
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
