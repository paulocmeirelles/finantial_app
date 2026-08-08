function searchBitCoinExchange() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = sheet.getActiveSheet();
  
  // 1. Pega o valor da célula B2
  var celDate = tab.getRange("B2").getValue();
  var stringDate = converterDateStringToDate(celDate)
  
  var exchange = null;
  var exchangeMonthBefore = null;
  var retry = 0;
  const MAX_RETRIES = 6;
  
  exchange = getBitCoinByAPI(stringDate)
  exchangeMonthBefore = getBitCoinByAPI(lastMonthFromDate(stringDate))
  
  // 2. Insere o resultado na planilha
  if (exchange !== null) {
    var celOutput = tab.getRange("C21");
    var celOutputLastMonth = tab.getRange("C22")

    // Define o valor encontrado
    celOutput.setValue(exchange);
    celOutputLastMonth.setValue(exchangeMonthBefore);
    
    // Formata a célula como moeda (R$)
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

function getBitCoinByAPI(dataInput = "2026-06-01") {
  // 1. Trata a data para garantir que o fuso horário não mude o dia
  const apiKey = process.env.API_KEY_COINGECKO;

  var splitedDate = dataInput.split("-");
  if (splitedDate.length !== 3) {
    console.error("Formato de data inválido. Use YYYY-MM-DD");
    return;
  }
  
  // Converte "YYYY-MM-DD" para o formato exigido pela API: "DD-MM-YYYY"
  var year = splitedDate[0];
  var month = splitedDate[1];
  var day = splitedDate[2];
  var dateBRFormat = `${day}-${month}-${year}`;

  // 2. Monta a URL correta da API pública do CoinGecko para o histórico do Bitcoin
  var url = `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${dateBRFormat}&localization=false&x_cg_demo_api_key=${apiKey}`;
  
  try {
    // 3. Faz a requisição
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    
    // 4. Valida se a resposta possui os dados de mercado esperados
    if (data && data.market_data && data.market_data.current_price) {
      const exchangeUsd = data.market_data.current_price.usd;      
      return exchangeUsd;
    } else {
      console.warn(`Não foram encontrados dados de preço para a data: ${dateBRFormat}`);
    }
    
  } catch (erro) {
    console.error('Falha ao obter histórico:', erro.toString());
  }
}