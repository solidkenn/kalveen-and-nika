/**
 * Kalveen & Nika — RSVP Google Sheets backend
 *
 * Setup:
 * 1. Create a new Google Sheet (Extensions → Apps Script opens from the sheet).
 * 2. Paste this file into the Apps Script editor.
 * 3. Run setupSheet once (authorize when prompted).
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into RSVP_SCRIPT_URL in index.html
 */

var SHEET_NAME = 'RSVP';

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Attending',
      'Seats Reserved',
      'Other Guest Names',
      'Message'
    ]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function getRsvpSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var sheet = getRsvpSheet_();
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.attending || '',
      data.seats || data.guests || '',
      data.otherGuests || '',
      data.message || ''
    ]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, message: 'RSVP endpoint is running. Use POST to submit.' });
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
