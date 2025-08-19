
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', data);
    
    // Get or create spreadsheet
    const spreadsheetId = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your actual sheet ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Extract customer data
    const customerData = data.customer_data;
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 8).setValues([[
        'User ID', 'Name', 'Age', 'Gender', 'Phone', 'Address', 'Registration Date', 'Timestamp'
      ]]);
    }
    
    // Add customer data to sheet - Always insert at row 2 (after header)
    const newRow = [
      customerData.user_id,
      customerData.name,
      customerData.age,
      customerData.gender,
      customerData.phone,
      customerData.address,
      customerData.registration_date,
      customerData.timestamp
    ];
    
    // Insert new row at position 2 (pushes existing data down)
    sheet.insertRowAfter(1); // Insert after row 1 (header)
    sheet.getRange(2, 1, 1, 8).setValues([newRow]); // Set data in row 2
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration stored successfully in Google Sheets',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error storing registration data',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('VegiBot Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
