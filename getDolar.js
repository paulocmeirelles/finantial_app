function searchDolarExchange() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = sheet.getActiveSheet();
  
  // 1. Pega o valor da célula B2
  var celDate = tab.getRange("B2").getValue();
  var stringDate = converterDateStringToDate(celDate)
  
  var exchange = null;
  var exchangeMonthBefore = null;
  var retry = 0;
  const MAX_RETRIES = 6;
  
  exchange = getExchange(stringDate)
  exchangeMonthBefore = getExchange(lastMonthFromDate(stringDate))
  
  // 2. Insere o resultado na planilha
  if (exchange !== null) {
    var celOutput = tab.getRange("C19");
    var celOutputLastMonth = tab.getRange("C20")

    // Define o valor encontrado
    celOutput.setValue(exchange);
    celOutputLastMonth.setValue(exchangeMonthBefore);
    
    // Formata a célula C3 como moeda (R$)
    celOutput.setNumberFormat("$ ###0.00");
    celOutputLastMonth.setNumberFormat("$ ###0.00");
    
    // Se o código retrocedeu dias por ser fim de semana, avisa o usuário na barra de status
    if (retry > 0) {
      SpreadsheetApp.getActiveSpreadsheet().toast("Cotação obtida do dia útil anterior disponível (" + getLastBusinessDay(stringDate) + ").", "Aviso");
    } else {
      SpreadsheetApp.getActiveSpreadsheet().toast("Cotação atualizada com sucesso!", "Sucesso");
    }
  } else {
    SpreadsheetApp.getUi().alert("Não foi possível encontrar uma cotação para esta data ou dias anteriores.");
  }
}

function getExchange(dateInput, coin="USD"){
  var exchange = null;
  var retry = 0;
  const MAX_RETRIES = 6;
  
  while (exchange === null && retry < MAX_RETRIES) {
    // Formata a data no padrão exigido pela API: 'MM-DD-AAAA'
    var url = `https://brasilapi.com.br/api/cambio/v1/cotacao/${coin}/${dateInput}`
    try {
      var response = UrlFetchApp.fetch(url);
      var data = JSON.parse(response.getContentText());
      
      // Verifica se a API retornou algum valor para o dia consultado
      if (data.cotacoes && data.cotacoes.length > 0) {
        exchange = data.cotacoes[data.cotacoes.length-1].cotacao_venda; // Pega o valor de venda
      } else {
        retry++;
      }
    } catch (error) {
      SpreadsheetApp.getUi().alert("Erro ao conectar com a API: " + error.toString());
      return;
    }
  }
  return exchange
}
