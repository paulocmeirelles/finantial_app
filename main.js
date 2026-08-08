function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Dashboard de Investimentos')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDataFromInvestmentTab() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName("investment");
  var rawData = [];
  var dateSet = {};

  if (tab && tab.getLastRow() >= 2) {
    var data = tab.getRange(2, 1, tab.getLastRow() - 1, 7).getValues();

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      
      var rawDate = row[0] ? row[0].toString().trim().toUpperCase() : "";
      var product = row[1] ? row[1].toString().trim() : "";

      if (!product || !rawDate) continue;

      var grossProfit = parseFloat(row[2]) || 0;
      var grossReturn = parseFloat(row[3]) || 0;
      var positionValue = parseFloat(row[4]) || 0;
      var group = row[5] ? row[5].toString().trim() : "";
      var investedAmount = parseFloat(row[6]) || 0;

      var dateStr = rawDate.replace("/", "-");
      dateSet[dateStr] = true;

      rawData.push({
        product: product,
        group: group,
        positionValue: positionValue,
        grossProfit: grossProfit,
        grossReturn: grossReturn,
        date: dateStr,
        investedAmount: investedAmount
      });
    }
  }

  var mappedItems = aggregateElements(rawData);
  var investments = Object.keys(mappedItems).map(function(key) {
    var item = mappedItems[key];
    return {
      product: item.product,
      group: item.group,
      positionValue: item.positionValue,
      grossProfit: item.grossProfit,
      grossReturn: item.qty > 0 ? (item.grossReturn / item.qty) : 0,
      date: item.date,
      investedAmount: item.qty > 0 ? (item.investedAmount / item.qty) : 0
    };
  });

  return { investments: investments, dateSet: dateSet };
}


function aggregateElements(assetsList){
  var mapping = {};

  for (var k = 0; k < assetsList.length; k++) {
    var item = assetsList[k];
    var key = item.product + "_" + item.date + "_" + item.group;

    if (!mapping[key]) {
      mapping[key] = {
        product: item.product,
        group: item.group,
        positionValue: item.positionValue,
        grossProfit: item.grossProfit,
        grossReturn: item.grossReturn,
        date: item.date,
        investedAmount: item.investedAmount,
        qty: 1
      };
    } else {
      mapping[key].positionValue += item.positionValue;
      mapping[key].grossProfit += item.grossProfit;
      mapping[key].investedAmount += item.investedAmount;
      mapping[key].grossReturn += item.grossReturn; // Acumula para tirar média
      mapping[key].qty += 1;
    }
  }

  return mapping
}

function getExpenses() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName("expenses");

  var expenses = {};
  var segments = {};

  var mapMonths = {
    "JANEIRO": "JAN", "FEVEREIRO": "FEV", "MARÇO": "MAR", "MARCO": "MAR",
    "ABRIL": "ABR", "MAIO": "MAI", "JUNHO": "JUN", "JULHO": "JUL",
    "AGOSTO": "AGO", "SETEMBRO": "SET", "OUTUBRO": "OUT", "NOVEMBRO": "NOV", "DEZEMBRO": "DEZ"
  };

  if (tab && tab.getLastRow() >= 2) {
    var data = tab.getRange(2, 1, tab.getLastRow() - 1, 5).getValues();

    for (var j = 0; j < data.length; j++) {
      var value = parseFloat(data[j][1]) || 0;
      var segment = data[j][2] ? data[j][2].toString().trim() : "Outros";
      var rawMonth = data[j][3] ? data[j][3].toString().trim().toUpperCase() : "";
      var year = data[j][4] ? data[j][4].toString().trim() : "";

      if (rawMonth && year) {
        var month = mapMonths[rawMonth] || rawMonth.slice(0, 3);
        var dateKey = month + "-" + year; // Ex: MAI-2025

        if (!expenses[dateKey]) {
          expenses[dateKey] = 0;
          segments[dateKey] = {};
        }
        expenses[dateKey] += value;

        if (!segments[dateKey][segment]) {
          segments[dateKey][segment] = 0;
        }
        segments[dateKey][segment] += value;
      }
    }
  }
  return { monthlyExpenses: expenses, segmentsByMonth: segments };
}

function getDataToDashboard() {
  var {investments, dateSet} = getDataFromInvestmentTab()

  var listDate = Object.keys(dateSet);

  var expenses = getExpenses()
  
  var dateLabels = Object.keys(expenses.monthlyExpenses);
  var values = dateLabels.map(function(key) {
    return expenses.monthlyExpenses[key];
  });
  
  return {
    assets: investments,
    dates: listDate,
    expenseTrend: {
      labels: dateLabels,
      values: values,
      segments: expenses.segmentsByMonth
    }
  };
}

function saveExpenses(expenses) {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName("expenses");
  
  if (!tab) {
    tab = spreadSheet.insertSheet("expenses");
    tab.appendRow(["expense", "value", "segment", "month", "year"]);
  }

  if (expenses && expenses.length > 0) {
    var lastRow = tab.getLastRow();
    tab.getRange(lastRow + 1, 1, expenses.length, 5).setValues(expenses);
  }
  return true;
}

function saveIncome(incoming) {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName("incoming");
  
  if (!tab) {
    tab = spreadSheet.insertSheet("incoming");
    tab.appendRow(["month", "year", "name", "value"]);
  }

  if (incoming && incoming.length > 0) {
    var lastRow = tab.getLastRow();
    tab.getRange(lastRow + 1, 1, incoming.length, 4).setValues(incoming);
  }
  return true;
}

function getSummaryPortfolio() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var tabIncoming = spreadSheet.getSheetByName("incoming");
  var tabExpenses = spreadSheet.getSheetByName("expenses");

  var incomingJson = {};
  var expensesJson = {};

  if (tabIncoming && tabIncoming.getLastRow() >= 2) {
    var dataIncoming = tabIncoming.getRange(2, 1, tabIncoming.getLastRow() - 1, 4).getValues();
    for (var i = 0; i < dataIncoming.length; i++) {
      var month = dataIncoming[i][0] ? dataIncoming[i][0].toString().trim().toUpperCase() : "";
      var year = dataIncoming[i][1] ? dataIncoming[i][1].toString().trim() : "";
      var value = parseFloat(dataIncoming[i][3]) || 0;

      if (month && year) {
        var key = month + "-" + year;
        incomingJson[key] = (incomingJson[key] || 0) + value;
      }
    }
  }

  if (tabExpenses && tabExpenses.getLastRow() >= 2) {
    var dataExpenses = tabExpenses.getRange(2, 1, tabExpenses.getLastRow() - 1, 5).getValues();
    for (var j = 0; j < dataExpenses.length; j++) {
      var value = parseFloat(dataExpenses[j][1]) || 0;
      var month = dataExpenses[j][3] ? dataExpenses[j][3].toString().trim().toUpperCase() : "";
      var year = dataExpenses[j][4] ? dataExpenses[j][4].toString().trim() : "";

      if (month && year) {
        var key = month.slice(0, 3).toUpperCase() + "-" + year;
        expensesJson[key] = (expensesJson[key] || 0) + value;
      }
    }
  }

  return {
    monthlyIncome: incomingJson,
    monthlyExpenses: expensesJson
  };
}

function getCSVData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Aba '" + sheetName + "' não encontrada.");
  
  var data = sheet.getDataRange().getValues();
  return data.map(row => row.map(val => `"${val}"`).join(";")).join("\n");
}

function getXLSXDownloadURL() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return "https://docs.google.com/spreadsheets/d/" + ss.getId() + "/export?format=xlsx";
}