function importDataFromAPI() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    sheet.getDataRange().offset(1, 0, sheet.getMaxRows() - 1).clearContent();
  
    // Replace the URL with your API endpoint
    var url = '';
    
    // Make a GET request to the API and parse the response
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Loop through each element of the data array and add it to the sheet
    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].search_time);
      row.push(data[i].keyword);
      row.push(data[i].user_id);
      row.push(data[i].user_roles.join(', '));
      sheet.appendRow(row);
    }
  }
  
  
  
  function getMostSearchedKeywords() {
    var sheetName = "Sheet1"; // Replace with the name of your sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    var keywordFrequencies = {};
    for (var i = 1; i < data.length; i++) { // Skip header row
      var keyword = data[i][1];
      if (keyword in keywordFrequencies) {
        keywordFrequencies[keyword]++;
      } else {
        keywordFrequencies[keyword] = 1;
      }
    }
    
    var sortedKeywords = Object.keys(keywordFrequencies).sort(function(a, b) {
      return keywordFrequencies[b] - keywordFrequencies[a];
    });
    
    var newSheetName = "Keyword Frequencies";
    var newSheet = ss.getSheetByName(newSheetName);
    if (!newSheet) {
      newSheet = ss.insertSheet(newSheetName);
      newSheet.appendRow(["Keyword", "Search Volume"]);
    }
    
    newSheet.getRange("A2:B").clearContent();
    var rows = [];
    for (var i = 0; i < sortedKeywords.length; i++) {
      var row = [];
      row.push(sortedKeywords[i]);
      row.push(keywordFrequencies[sortedKeywords[i]]);
      rows.push(row);
    }
    newSheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }
  
  
  function dailyUpdate() {
    importDataFromAPI();
    getMostSearchedKeywords();
  }
  
