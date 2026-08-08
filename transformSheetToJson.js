function transformSheetToJson(tabName = "Configurações") {
  var nameJsonFile = tabName + ".json";
  
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = spreadSheet.getSheetByName(tabName);
  
  if (!tab) {
    Logger.log("Erro: A Aba '" + tabName + "' não foi encontrada.");
    return;
  }
  
  var data = tab.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log("Erro: A Aba está vazia ou possui apenas o cabeçalho.");
    return;
  }
  
  var header = data[0];
  var listObjects = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    
    for (var j = 0; j < header.length; j++) {
      obj[header[j]] = row[j];
    }
    listObjects.push(obj);
  }
  
  var jsonText = JSON.stringify(listObjects, null, 2);

  var idFolder = "1iDySZa0_-vxG-HCA6LVBCAxW7RpVh3o1"
  var folder = DriveApp.getFolderById(idFolder);
  var file = folder.createFile(nameJsonFile, jsonText, MimeType.PLAIN_TEXT);
  
  Logger.log("Sucesso! Arquivo criado com o ID: " + file.getId());
}

function generateJsonFiles(){
    var tabs = ["investment", "stocks", "expenses", "incoming"];
    for (var k = 0; k < tabs.length; k++) {
      transformSheetToJson(tabs[k]);
    }
}
