function calculateInvestmentMetrics() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Define your sheet names here
  var investmentTab = ss.getSheetByName("Investimento"); 
  var historyTab = ss.getSheetByName("Histórico Ações");
  
  if (!investmentTab || !historyTab) {
    SpreadsheetApp.getUi().alert("Error: Please verify that 'Investimentos' and 'Histórico Ações' tab names are correct.");
    return;
  }
  
  // 2. Collect initial parameters from the Investment tab
  var filterMonthText = investmentTab.getRange("B2").getValue().toString().trim().toUpperCase(); // e.g., "JUL-2026"
  
  // Explicitly cap the execution at row 14
  var lastRowInv = 14; 
  var totalRowsToProcess = lastRowInv - 4 + 1; // 11 rows total (from row 4 to 14)
  
  // Fetch Assets (Column B) and Gross Return (Column D)
  var assetData = investmentTab.getRange(4, 2, totalRowsToProcess, 1).getValues(); // Column B
  var returnData = investmentTab.getRange(4, 4, totalRowsToProcess, 1).getValues(); // Column D
  
  // 3. Fetch ALL History data at once for optimal batch processing speed
  var lastRowHist = historyTab.getLastRow();
  var histData = historyTab.getRange(1, 1, lastRowHist, 16).getValues(); // Columns A to P
  
  // --- MEMORY STEP: Replicating the VLOOKUP (O3:P13) lookup table ---
  var lookupMap = {};
  for (var row = 2; row < histData.length; row++) {
    var keyO = histData[row][14];  // Column O (index 14)
    var valueP = histData[row][15]; // Column P (index 15)
    if (keyO) {
      lookupMap[keyO.toString().trim()] = valueP.toString().trim();
    }
  }
  
  var monthsList = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  
  // Output arrays for Columns E, F, and G
  var grossBalanceResults = []; // Column E
  var colFResults = [];         // Column F
  var colGResults = [];         // Column G
  
  // 4. MAIN LOOP: Processes asset by asset from row 4 up to row 14
  for (var i = 0; i < assetData.length; i++) {
    var assetName = assetData[i][0].toString().trim();
    var grossReturn = parseFloat(returnData[i][0]) || 0;
    
    if (assetName === "") {
      grossBalanceResults.push([""]);
      colFResults.push([""]);
      colGResults.push([""]);
      continue;
    }
    
    // Executes VLOOKUP(B4, 'Histórico Ações'!$O$3:$P$13, 2, 0) equivalent
    var historicalSearchTerm = lookupMap[assetName] || assetName;
    
    var foundBalance = 0;
    var foundColGVal = 0; // Value to map into Column F
    var foundColHVal = 0; // Value to map into Column G
    var foundInPeriod = false;
    
    var dateParts = filterMonthText.split("-");
    var currentMonthText = dateParts[0];
    var currentYear = parseInt(dateParts[1], 10);
    var currentMonthIndex = monthsList.indexOf(currentMonthText);
    
    // 5. 12-MONTH BACKWARD LOOP
    for (var lookback = 0; lookback < 12; lookback++) {
      var targetIndex = currentMonthIndex - lookback;
      var targetYear = currentYear;
      
      while (targetIndex < 0) {
        targetIndex += 12;
        targetYear -= 1;
      }
      
      var targetMonthText = monthsList[targetIndex] + "-" + targetYear;
      
      var targetMonthSum = 0;
      var targetColGSum = 0;
      var targetColHSum = 0;
      var hadRecordInMonth = false;
      
      for (var h = 1; h < histData.length; h++) {
        var colF = histData[h][5].toString().trim();               // Asset Name (Col F)
        var colI = parseFloat(histData[h][8]) || 0;                // Balance (Col I)
        var colM = histData[h][12].toString().trim().toUpperCase(); // Month/Year (Col M)
        
        // Target columns for your new VLOOKUP requests
        var colGHistory = parseFloat(histData[h][6]) || 0;         // History Column G
        var colHHistory = parseFloat(histData[h][7]) || 0;         // History Column H
        
        if (colM === targetMonthText && colF === historicalSearchTerm) {
          targetMonthSum += colI;
          targetColGSum += colGHistory;
          targetColHSum += colHHistory;
          hadRecordInMonth = true; 
        }
      }
      
      if (hadRecordInMonth) {
        foundBalance = targetMonthSum;
        foundColGVal = targetColGSum;
        foundColHVal = targetColHSum;
        foundInPeriod = true;
        break; // Stop looking back once the closest logged month matches
      }
    }
    
    if (!foundInPeriod) {
      foundBalance = 0;
      foundColGVal = 0;
      foundColHVal = 0;
    }
    
    // Line calculations
    var finalGrossBalance = foundBalance + grossReturn;
    
    // Store row results
    grossBalanceResults.push([finalGrossBalance]);
    colFResults.push([foundColGVal]);
    colGResults.push([foundColHVal]);
  }
  
  // 6. Bulk write calculations back onto the sheet (Rows 4 - 14)
  
  // Write Column E (Gross Balance)
  var rangeE = investmentTab.getRange(4, 5, grossBalanceResults.length, 1);
  rangeE.setValues(grossBalanceResults);
  rangeE.setNumberFormat("$#,##0.00");
  
  // Write Column F (Data pulled from History Column G)
  var rangeF = investmentTab.getRange(4, 6, colFResults.length, 1);
  rangeF.setValues(colFResults);
  rangeF.setNumberFormat("$#,##0.00"); // Adjust format if it's not currency
  
  // Write Column G (Data pulled from History Column H)
  var rangeG = investmentTab.getRange(4, 7, colGResults.length, 1);
  rangeG.setValues(colGResults);
  rangeG.setNumberFormat("0.00%"); // Adjust format if it's not currency
  }