// function doGet() {
//   // Renderiza o arquivo Index.html com meta tag responsiva
//   return HtmlService.createTemplateFromFile('indexV1.1')
//     .evaluate()
//     .setTitle('Dashboard de Investimentos')
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
// }

// function include(filename) {
//   return HtmlService.createHtmlOutputFromFile(filename).getContent();
// }

// function getDataFromInvestmentTab(){
//   var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

//   var tab = spreadSheet.getSheetByName("investment");
//   var rawData = [];
//   var dateSet = {};
  
//   if (tab) {
//     var lastRow = tab.getLastRow();
//     if (lastRow >= 2) {
//       var data = tab.getRange(2, 1, lastRow - 1, 7).getValues();
      
//       for (var i = 0; i < data.length; i++) {
//         var row = data[i];
//         var product = row[1] ? row[1].toString().trim() : "";
//         if(product === ""){
//           continue
//         }
//         var date = row[0] ? row[0].toString().trim() : "";
//         var grossProfit = parseFloat(row[2]) || 0;
//         var grossReturn = row[3];
//         var positionValue = parseFloat(row[4]) || 0;
//         var group = row[5] ? row[5].toString().trim() : "";
//         var investmentAmount = parseFloat(row[6]) || 0;

//         if (!product && !date) continue;

//         if (date) {
//           dateSet[date] = true;
//         }

//         rawData.push({
//           produto: product,
//           grupo: group,
//           saldoBruto: positionValue,
//           rendimentoBruto: grossProfit,
//           rentabilidadeBruta: grossReturn,
//           mesAno: date,
//           valorInvestido: investmentAmount
//         });
//       }
//     }
//   }

//   var mappedItems = aggregateElements(rawData)
//   var investments = Object.keys(mappedItems).map(function(key) {
//     var item = mappedItems[key];
    
//     return {
//       produto: item.produto,
//       grupo: item.grupo,
//       saldoBruto: item.saldoBruto,
//       rendimentoBruto: item.rendimentoBruto,
//       rentabilidadeBruta: item.qtd > 0 ? (item.rentabilidadeBruta / item.qtd) : 0,
//       mesAno: item.mesAno,
//       valorInvestido: item.qtd > 0 ? (item.valorInvestido / item.qtd) : 0
//     };
//   });
//   return {investments, dateSet}
// }


// function aggregateElements(listaAtivosBruta){
//   var mapaConsolidado = {};

//   for (var k = 0; k < listaAtivosBruta.length; k++) {
//     var item = listaAtivosBruta[k];
//     var chave = item.produto + "_" + item.mesAno + "_" + item.grupo;

//     if (!mapaConsolidado[chave]) {
//       mapaConsolidado[chave] = {
//         produto: item.produto,
//         grupo: item.grupo,
//         saldoBruto: item.saldoBruto,
//         rendimentoBruto: item.rendimentoBruto,
//         rentabilidadeBruta: item.rentabilidadeBruta,
//         mesAno: item.mesAno,
//         valorInvestido: item.valorInvestido,
//         qtd: 1
//       };
//     } else {
//       mapaConsolidado[chave].saldoBruto += item.saldoBruto;
//       mapaConsolidado[chave].rendimentoBruto += item.rendimentoBruto;
//       mapaConsolidado[chave].valorInvestido += item.valorInvestido;
//       mapaConsolidado[chave].rentabilidadeBruta += item.rentabilidadeBruta; // Acumula para tirar média
//       mapaConsolidado[chave].qtd += 1;
//     }
//   }

//   return mapaConsolidado
// }

// function getExpenses(){
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var abaArquivamento = ss.getSheetByName("expenses");
  
//   var gastosPorMes = {};
//   var segmentosPorMes = {}; // Para guardar o detalhamento por segmento de cada mês
  
//   if (abaArquivamento) {
//     var ultimaLinhaArquivamento = abaArquivamento.getLastRow();
//     if (ultimaLinhaArquivamento >= 2) {
//       // Lê as colunas A até E: [Gastos (0), Valor (1), Segmento (2), Mês (3), Ano (4)]
//       var dadosGastos = abaArquivamento.getRange(2, 1, ultimaLinhaArquivamento - 1, 5).getValues();
      
//       for (var j = 0; j < dadosGastos.length; j++) {
//         var valor = parseFloat(dadosGastos[j][1]) || 0;
//         var segmento = dadosGastos[j][2] ? dadosGastos[j][2].toString().trim() : "Outros";
//         var mes = dadosGastos[j][3] ? dadosGastos[j][3].toString().trim() : "";
//         var ano = dadosGastos[j][4] ? dadosGastos[j][4].toString().trim() : "";
        
//         if (mes && ano) {
//           var chaveMesAno = mes + "/" + ano;
          
//           // Agrupa o total do mês
//           if (!gastosPorMes[chaveMesAno]) {
//             gastosPorMes[chaveMesAno] = 0;
//             segmentosPorMes[chaveMesAno] = {};
//           }
//           gastosPorMes[chaveMesAno] += valor;
          
//           // Agrupa por segmento dentro do mês
//           if (!segmentosPorMes[chaveMesAno][segmento]) {
//             segmentosPorMes[chaveMesAno][segmento] = 0;
//           }
//           segmentosPorMes[chaveMesAno][segmento] += valor;
//         }
//       }
//     }
//   }

//   return { gastosPorMes: gastosPorMes, segmentosPorMes: segmentosPorMes };
// }

// function getDataToDashboard() {
//   var {investments, dateSet} = getDataFromInvestmentTab()

//   // Lista única de (Mês/Ano) ordenada
//   var listDate = Object.keys(dateSet);

//   var expenses = getExpenses()
  
//   var dateLabels = Object.keys(expenses.gastosPorMes);
//   var values = dateLabels.map(function(key) {
//     return expenses.gastosPorMes[key];
//   });
  
//   return {
//     ativos: investments,
//     opcoesMesAno: listDate,
//     evolucaoGastos: {
//       labels: dateLabels,
//       valores: values,
//       segmentos: expenses.segmentosPorMes
//     }
//   };
// }

// function buscarDadosDashboard() {
//   let {investments, dateSet} = getDataFromInvestmentTab()

//   // Lista única de (Mês/Ano) ordenada
//   var listDate = Object.keys(dateSet);

//   var expenses = getExpenses()
  
//   var dateLabels = Object.keys(expenses.gastosPorMes);
//   var values = dateLabels.map(function(key) {
//     return expenses.gastosPorMes[key];
//   });
  
//   return {
//     ativos: investments,
//     opcoesMesAno: listDate,
//     evolucaoGastos: {
//       labels: dateLabels,
//       valores: values,
//       segmentos: expenses.segmentosPorMes
//     }
//   };
// }

// function salvarExpenses(matrizGastos) {
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var aba = ss.getSheetByName("expenses");
  
//   if (!aba) {
//     aba = ss.insertSheet("expenses");
//     aba.appendRow(["Gastos", "Valor", "Segmento", "Mês", "Ano"]);
//   }

//   if (matrizGastos && matrizGastos.length > 0) {
//     var ultimaLinha = aba.getLastRow();
//     aba.getRange(ultimaLinha + 1, 1, matrizGastos.length, 5).setValues(matrizGastos);
//   }
//   return true;
// }

// /**
//  * Salva a lista de novas rendas na aba 'income'
//  * Espera matriz com colunas: [Mês, Ano, Nome, Valor]
//  */
// function salvarIncome(matrizRenda) {
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var aba = ss.getSheetByName("incoming");
  
//   if (!aba) {
//     aba = ss.insertSheet("incoming");
//     aba.appendRow(["Mês", "Ano", "Nome", "Valor"]);
//   }

//   if (matrizRenda && matrizRenda.length > 0) {
//     var ultimaLinha = aba.getLastRow();
//     aba.getRange(ultimaLinha + 1, 1, matrizRenda.length, 4).setValues(matrizRenda);
//   }
//   return true;
// }

// // Analisar essa parte
// function obterResumoRendaEGastos() {
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
  
//   var abaIncome = ss.getSheetByName("incoming");
//   var abaExpenses = ss.getSheetByName("expenses");

//   var rendaPorMes = {};
//   var gastosPorMes = {};

//   // Processa a aba INCOME (Estrutura: [Mês, Ano, Nome, Valor])
//   if (abaIncome && abaIncome.getLastRow() >= 2) {
//     var dadosIncome = abaIncome.getRange(2, 1, abaIncome.getLastRow() - 1, 4).getValues();
//     for (var i = 0; i < dadosIncome.length; i++) {
//       var mes = dadosIncome[i][0] ? dadosIncome[i][0].toString().trim().toUpperCase() : "";
//       var ano = dadosIncome[i][1] ? dadosIncome[i][1].toString().trim() : "";
//       var valor = parseFloat(dadosIncome[i][3]) || 0;

//       if (mes && ano) {
//         var chave = mes + "/" + ano;
//         rendaPorMes[chave] = (rendaPorMes[chave] || 0) + valor;
//       }
//     }
//   }

//   // Processa a aba EXPENSES (Estrutura: [Gastos, Valor, Segmento, Mês, Ano])
//   if (abaExpenses && abaExpenses.getLastRow() >= 2) {
//     var dadosExpenses = abaExpenses.getRange(2, 1, abaExpenses.getLastRow() - 1, 5).getValues();
//     for (var j = 0; j < dadosExpenses.length; j++) {
//       var valorGasto = parseFloat(dadosExpenses[j][1]) || 0;
//       var mesGasto = dadosExpenses[j][3] ? dadosExpenses[j][3].toString().trim().toUpperCase() : "";
//       var anoGasto = dadosExpenses[j][4] ? dadosExpenses[j][4].toString().trim() : "";

//       if (mesGasto && anoGasto) {
//         var chaveGasto = mesGasto.slice(0, 3).toUpperCase() + "/" + anoGasto;
//         gastosPorMes[chaveGasto] = (gastosPorMes[chaveGasto] || 0) + valorGasto;
//       }
//     }
//   }

//   return {
//     rendaPorMes: rendaPorMes,
//     gastosPorMes: gastosPorMes
//   };
// }