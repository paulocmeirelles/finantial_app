function archiving() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Defina os nomes corretos das suas abas aqui
  var tab = sheet.getActiveSheet(); 
  var outputTab = sheet.getSheetByName("expenses");
  
  if (!outputTab || !tab) {
    SpreadsheetApp.getUi().alert("Erro: Verifique se os nomes das abas estão corretos.");
    return;
  }
  
  var lastRow = tab.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("Não há dados para processar.");
    return;
  }
  
  // --- ETAPA 1: ARQUIVAMENTO ---
  // Pega os dados originais (com as parcelas cheias do mês atual) e joga no histórico
  var inputRange = tab.getRange(2, 1, lastRow - 1, 5);
  var inputData = inputRange.getValues(); 
  
  var outputLastRow = outputTab.getLastRow();
  var insertRow = outputLastRow + 1;
  
  var rangeDestiny = outputTab.getRange(insertRow, 1, inputData.length, 5);
  rangeDestiny.setValues(inputData);
  
  // --- ETAPA 2: FILTRO, SUBTRAÇÃO E LIMPEZA ---
  var fixedItems = ["gasolina", "conta apple", "spotify", "academia", "amazonprime"]; 
  
  // Expressão regular para capturar o "x" e o número da parcela (ex: "x5")
  var regexParcel = /\bx(\d+)/i; 
  
  var staiedData = [];
  
  // Percorre os dados linha por linha
  for (var i = 0; i < inputData.length; i++) {
    var row = inputData[i];
    var item = row[0].toString().trim(); 
    var lowerCaseName = item.toLowerCase();
    
    // Regra 1: É item fixo?
    var fixed = fixedItems.indexOf(lowerCaseName) !== -1;
    
    // Regra 2: É parcela?
    var matchParcel = item.match(regexParcel);
    
    if (fixed) {
      // Se for fixo, mantém a linha exatamente como está
      staiedData.push(row);
    } else if (matchParcel) {
      // Se for parcela, extrai o número atual (ex: "5" de "x5")
      var numberParcel = parseInt(matchParcel[1], 10);
      var newNumberParcel = numberParcel - 1;
      
      // Validação: Se após subtrair for maior que 0, atualiza e mantém
      if (newNumberParcel > 0) {
        // Substitui o "x5" por "x4", por exemplo, mantendo o resto do nome do texto
        var newNameItem = item.replace(regexParcel, "x" + newNumberParcel);
        
        // Atualiza o nome apenas na matriz que vai voltar para a aba principal
        row[0] = newNameItem; 
        staiedData.push(row);
      }
      // Se novoNumeroParcela for 0, o script simplesmente IGNORA a linha, deletando-a do próximo mês
    }
  }
  
  // Limpa todo o conteúdo antigo abaixo do cabeçalho na AbaAtual
  inputRange.clearContent();
  
  // Se restaram itens (fixos ou parcelas remanescentes), reescreve na planilha
  if (staiedData.length > 0) {
    var newRange = tab.getRange(2, 1, staiedData.length, 5);
    newRange.setValues(staiedData);
  }
}

function archivePaidExpenses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var archiveTab = ss.getSheetByName("expenses");
  
  if (!archiveTab || !currentTab) {
    SpreadsheetApp.getUi().alert("Error: Please verify your tab names.");
    return;
  }
  
  var startRow = 9;
  var startColumn = 1; // Column A
  var totalColumns = 6; // Reads Columns A, B, C, D, E, F
  
  // 1. Get all values from row 9 to the very bottom of the sheet
  var fullRange = currentTab.getRange(startRow, startColumn, currentTab.getLastRow() - startRow + 1, totalColumns);
  var fullData = fullRange.getValues();
  
  // 2. Dynamically determine the true endRow by ignoring "Total" or blank rows
  var cleanedData = [];
  for (var r = 0; r < fullData.length; r++) {
    var firstCellText = fullData[r][0].toString().trim().toLowerCase();
    
    // Stop processing if we hit the "Total" row or an empty row
    if (firstCellText === "total" || firstCellText === "") {
      break; 
    }
    cleanedData.push(fullData[r]);
  }
  
  var archivedCounter = 0;
  
  // 3. Loop row by row through our true data block
  for (var i = 0; i < cleanedData.length; i++) {
    var rowData = cleanedData[i];
    
    // Column F is index 5 (A=0, B=1, C=2, D=3, E=4, F=5)
    var status = rowData[5].toString().trim().toLowerCase();
    
    if (status === "pago") {
      // Extract columns A through E only (Indices 0 to 4) - Dropping the status column (F)
      var cleanedRowData = [rowData[0], rowData[1], rowData[2], rowData[3], rowData[4]];
      
      // Find the next available bottom row on the archive tab
      var nextArchiveRow = archiveTab.getLastRow() + 1;
      
      // Paste into 'Arquivamento 2026' starting at Column A (1) through E (5 columns wide)
      archiveTab.getRange(nextArchiveRow, 1, 1, 5).setValues([cleanedRowData]);
      
      // Update the status on the CURRENT active sheet to "arquivado"
      var exactRowOnSheet = startRow + i;
      currentTab.getRange(exactRowOnSheet, startColumn + 5).setValue("arquivado");
      
      archivedCounter++;
    }
  }
  
  if (archivedCounter > 0) {
    ss.toast(`Successfully archived ${archivedCounter} items into Columns A:E of 'Arquivamento 2026'!`, "Success");
  } else {
    ss.toast("No items with status 'pago' were found to archive.", "Info");
  }
}