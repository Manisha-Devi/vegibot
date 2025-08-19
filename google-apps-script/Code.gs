
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

// Function to check if user already exists
function checkUserExists(userId) {
  try {
    const spreadsheetId = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your actual sheet ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // If sheet is empty, user doesn't exist
    if (sheet.getLastRow() <= 1) {
      return null;
    }
    
    // Get all data from sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and search for user
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) { // User ID is in column A (index 0)
        return {
          user_id: data[i][0],
          name: data[i][1],
          age: data[i][2],
          gender: data[i][3],
          phone: data[i][4],
          address: data[i][5],
          registration_date: data[i][6],
          timestamp: data[i][7]
        };
      }
    }
    
    return null; // User not found
  } catch (error) {
    console.error('Error checking user:', error);
    return null;
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const userId = e.parameter.user_id;
  
  if (action === 'check_user' && userId) {
    const userData = checkUserExists(userId);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        user_exists: userData !== null,
        user_data: userData
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput('VegiBot Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
