function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Dashboard de Investimentos")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getJsonData(fileName) {
  try {
    if (typeof DriveApp !== "undefined") {
      var folders = DriveApp.getFoldersByName("data");
      while (folders.hasNext()) {
        var folder = folders.next();
        var files = folder.getFilesByName(fileName + ".json");
        if (files.hasNext()) {
          var file = files.next();
          return JSON.parse(file.getBlob().getDataAsString());
        }
      }
    } else if (typeof require !== "undefined") {
      var fs = require("fs");
      var path = require("path");
      var filePath = path.join(__dirname, "data", fileName + ".json");
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
    }
  } catch (e) {
    console.error("Error reading " + fileName, e);
  }
  return [];
}

function getExpensesRecords() {
  var data = getJsonData("expenses");
  return Array.isArray(data) ? data : [];
}

function getIncomingRecords() {
  var data = getJsonData("incoming");
  return Array.isArray(data) ? data : [];
}

function saveExpensesData(expenses) {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName("expenses");

  if (!tab) {
    tab = spreadSheet.insertSheet("expenses");
  }

  tab.clearContents();
  tab.appendRow(["expense", "value", "segment", "month", "year"]);

  if (expenses && expenses.length > 0) {
    var values = expenses.map(function (item) {
      return [
        item.expense || item.description || "",
        parseFloat(item.value) || 0,
        item.segment || "Outros",
        item.month || "",
        item.year || "",
      ];
    });
    tab.getRange(2, 1, values.length, 5).setValues(values);
  }

  return true;
}

function getDataFromInvestmentTab() {
  var rawData = [];
  var dateSet = {};
  var data = getJsonData("investment");

  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      var rawDate = item.date ? item.date.toString().trim().toUpperCase() : "";
      var product = item.product ? item.product.toString().trim() : "";

      if (!product || !rawDate) continue;

      var grossProfit =
        parseFloat(item.gross_profit) || parseFloat(item.grossProfit) || 0;
      var grossReturn =
        parseFloat(item.gross_return) || parseFloat(item.grossReturn) || 0;
      var positionValue =
        parseFloat(item.position_value) || parseFloat(item.positionValue) || 0;
      var group = item.group ? item.group.toString().trim() : "";
      var investedAmount =
        parseFloat(item.invested_amount) ||
        parseFloat(item.investedAmount) ||
        0;

      var dateStr = rawDate.replace("/", "-");
      dateSet[dateStr] = true;

      rawData.push({
        product: product,
        group: group,
        positionValue: positionValue,
        grossProfit: grossProfit,
        grossReturn: grossReturn,
        date: dateStr,
        investedAmount: investedAmount,
      });
    }
  }

  var mappedItems = aggregateElements(rawData);
  var investments = Object.keys(mappedItems).map(function (key) {
    var item = mappedItems[key];
    return {
      product: item.product,
      group: item.group,
      positionValue: item.positionValue,
      grossProfit: item.grossProfit,
      grossReturn: item.qty > 0 ? item.grossReturn / item.qty : 0,
      date: item.date,
      investedAmount: item.qty > 0 ? item.investedAmount / item.qty : 0,
    };
  });

  return { investments: investments, dateSet: dateSet };
}

function aggregateElements(assetsList) {
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
        qty: 1,
      };
    } else {
      mapping[key].positionValue += item.positionValue;
      mapping[key].grossProfit += item.grossProfit;
      mapping[key].investedAmount += item.investedAmount;
      mapping[key].grossReturn += item.grossReturn; // Acumula para tirar média
      mapping[key].qty += 1;
    }
  }

  return mapping;
}

function getExpenses() {
  var expenses = {};
  var segments = {};

  var mapMonths = {
    JANEIRO: "JAN",
    FEVEREIRO: "FEV",
    MARÇO: "MAR",
    MARCO: "MAR",
    ABRIL: "ABR",
    MAIO: "MAI",
    JUNHO: "JUN",
    JULHO: "JUL",
    AGOSTO: "AGO",
    SETEMBRO: "SET",
    OUTUBRO: "OUT",
    NOVEMBRO: "NOV",
    DEZEMBRO: "DEZ",
  };

  var data = getJsonData("expenses");

  if (data && data.length > 0) {
    for (var j = 0; j < data.length; j++) {
      var item = data[j];
      var value = parseFloat(item.value) || 0;
      var segment = item.segment ? item.segment.toString().trim() : "Outros";
      var rawMonth = item.month
        ? item.month.toString().trim().toUpperCase()
        : "";
      var year = item.year ? item.year.toString().trim() : "";

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
  var { investments, dateSet } = getDataFromInvestmentTab();

  var listDate = Object.keys(dateSet);

  var expenses = getExpenses();

  var dateLabels = Object.keys(expenses.monthlyExpenses);
  var values = dateLabels.map(function (key) {
    return expenses.monthlyExpenses[key];
  });

  return {
    assets: investments,
    dates: listDate,
    expenseTrend: {
      labels: dateLabels,
      values: values,
      segments: expenses.segmentsByMonth,
    },
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
  var incomingJson = {};
  var expensesJson = {};

  var dataIncoming = getJsonData("incoming");
  var dataExpenses = getJsonData("expenses");

  if (dataIncoming && dataIncoming.length > 0) {
    for (var i = 0; i < dataIncoming.length; i++) {
      var item = dataIncoming[i];
      var month = item.month ? item.month.toString().trim().toUpperCase() : "";
      var year = item.year ? item.year.toString().trim() : "";
      var value = parseFloat(item.value) || 0;

      if (month && year) {
        var key = month + "-" + year;
        incomingJson[key] = (incomingJson[key] || 0) + value;
      }
    }
  }

  if (dataExpenses && dataExpenses.length > 0) {
    for (var j = 0; j < dataExpenses.length; j++) {
      var itemExp = dataExpenses[j];
      var value = parseFloat(itemExp.value) || 0;
      var month = itemExp.month
        ? itemExp.month.toString().trim().toUpperCase()
        : "";
      var year = itemExp.year ? itemExp.year.toString().trim() : "";

      if (month && year) {
        var key = month.slice(0, 3).toUpperCase() + "-" + year;
        expensesJson[key] = (expensesJson[key] || 0) + value;
      }
    }
  }

  return {
    monthlyIncome: incomingJson,
    monthlyExpenses: expensesJson,
  };
}

function getCSVData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Aba '" + sheetName + "' não encontrada.");

  var data = sheet.getDataRange().getValues();
  return data.map((row) => row.map((val) => `"${val}"`).join(";")).join("\n");
}

function getXLSXDownloadURL() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return (
    "https://docs.google.com/spreadsheets/d/" +
    ss.getId() +
    "/export?format=xlsx"
  );
}
