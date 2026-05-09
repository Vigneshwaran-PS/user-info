/**
 * ============================================================
 * Google Apps Script — User Info Collector
 * ============================================================
 *
 * SETUP STEPS
 * -----------
 * 1. Open https://sheets.google.com and create a new Google Sheet.
 *    (You can rename it, e.g., "User Submissions".)
 *
 * 2. In that sheet, click  Extensions → Apps Script.
 *    A new Apps Script project will open.
 *
 * 3. Delete the default code in Code.gs and paste the ENTIRE
 *    contents of this file in its place. Click the Save icon.
 *
 * 4. (Optional) Click "Run" once on the function `setupHeaders` to
 *    add the header row. Approve the permissions when prompted.
 *
 * 5. Click  Deploy → New deployment.
 *      - Select type: Web app  (gear icon → Web app)
 *      - Description:  User Form Endpoint
 *      - Execute as:   Me
 *      - Who has access:  Anyone
 *    Click Deploy. Approve permissions if prompted.
 *
 * 6. Copy the "Web app URL" that's shown.
 *    Paste it into  src/config.ts  in the React project as the
 *    value of APPS_SCRIPT_URL.
 *
 * 7. Done. The React form will now append rows to this Google
 *    Sheet. Download as Excel anytime via  File → Download → .xlsx.
 *
 * NOTE
 * ----
 * If you change this script later, you must Deploy → Manage
 * deployments → Edit (pencil) → New version → Deploy.
 * ============================================================
 */

// Header row (in display order). Edit here if you add/rename columns.
const HEADERS = [
  'Submitted At (Date & Time)',
  'Salutation',
  'First Name',
  'Last Name',
  'Date of Birth (DDMMYYYY)',
  'Gender',
  'House Name',
  'Gothram',
  'Education',
  'Current Occupation',
  "Father's Name",
  'Area Pincode',
  'Mobile Number',
  'Email ID',
  'Marital Status',
];

/**
 * One-time helper: writes the header row to the active sheet.
 * Run this manually from the Apps Script editor after pasting.
 */
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#1d4ed8')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

/**
 * Receives POST submissions from the React form and appends a row.
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Ensure header row exists.
    if (sheet.getLastRow() === 0) {
      setupHeaders();
    }

    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};

    // Format submission timestamp in the spreadsheet's locale.
    const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    const submittedAt = Utilities.formatDate(
      new Date(),
      tz,
      'yyyy-MM-dd HH:mm:ss'
    );

    const row = [
      submittedAt,
      body.salutation || '',
      body.firstName || '',
      body.lastName || '',
      body.dateOfBirth || '',
      body.gender || '',
      body.houseName || '',
      body.gothram || '',
      body.education || '',
      body.occupation || '',
      body.fatherName || '',
      body.pincode || '',
      body.mobileNumber || '',
      body.email || '',
      body.maritalStatus || '',
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional GET handler for sanity-checking the deployment in a browser.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'User form endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
