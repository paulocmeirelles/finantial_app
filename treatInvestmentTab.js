function treatSpreadSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var tab = sheet.getSheetByName("investment");
  var tabInvestment = sheet.getSheetByName("stocks")
  let investmentJson = mappingInvestments(tabInvestment)

  let productCol = []
  let groupCol = []
  let dateCol = []
  let grossProfitCol = []
  let grossReturnCol = []
  let positionValueCol = []
  let investmentCol = []

  if (tab) {
    var lastRow = tab.getLastRow();
    if (lastRow >= 2) {
      var data = tab.getRange(2, 1, lastRow - 1, 7).getValues();
      let product = ""
      let date = ""
      for (var i = 0; i < data.length; i++) {
        product = getProduct(data[i][1])
        date = getDate(data[i][0])
        productCol.push([product])
        groupCol.push([getGroup(data[i][1])])
        dateCol.push([date])
        grossProfitCol.push([transformBRvalueToUSValue(data[i][2])])
        grossReturnCol.push([transformBRvalueToUSValue(data[i][3])/100])
        positionValueCol.push([transformBRvalueToUSValue(data[i][4])])
        investmentCol.push([mappingInvestmentResult(investmentJson, product, date)])
      }
      var rangeDate = tab.getRange(2, 1, dateCol.length, 1);
      var rangeProducts = tab.getRange(2, 2, productCol.length, 1);
      var rangeGroup = tab.getRange(2, 6, groupCol.length, 1);
      var rangeGrossProfit = tab.getRange(2, 3, grossProfitCol.length, 1);
      var rangeGrossReturn = tab.getRange(2, 4, grossReturnCol.length, 1);
      var rangePositionValue = tab.getRange(2, 5, positionValueCol.length, 1);
      var rangeInvestment = tab.getRange(2, 7, investmentCol.length, 1);

      rangeProducts.setValues(productCol);
      rangeGroup.setValues(groupCol);
      rangeDate.setValues(dateCol);
      rangeGrossProfit.setValues(grossProfitCol);
      rangeGrossReturn.setValues(grossReturnCol);
      rangePositionValue.setValues(positionValueCol);
      rangeInvestment.setValues(investmentCol);
    }
  }
}

function mappingInvestmentResult(investmentJson, product, date){
    result = investmentJson.find(item => item.product.trim() === product && item.date === date.replace("'","").trim())
    if (result){
      var parsed = parseFloat(result.value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0
}

function mappingInvestments(tab){
  if (tab){
    let lastRow = tab.getLastRow();
    if (lastRow >= 2){
      let data = tab.getRange(2, 1, lastRow - 1, 3).getValues();
      let investmentObject = {}
      let investmentJson = []
      for (let i = 0; i < data.length; i++){
        investmentObject.product = (data[i][0]).trim()
        investmentObject.date = (data[i][1]).trim()
        investmentObject.value = data[i][2]
        investmentJson.push(investmentObject)
        investmentObject = {}
      }
      return investmentJson
    }
  }
  return
}

function transformBRvalueToUSValue(text){
    let value = text.toString().trim();
    if (value == "") {
      return 0
    }
    value = value.replace("%","").replace("'","").trim();
    if (value.indexOf(",") !== -1) {
      value = value.replace(/\./g, "").replace(",", ".");
    }
    var parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}

function getDate(text){
  let occurencies = text.match(/-/gi)?.length || 0
  if (occurencies > 1) {
    return `'${text.trim().slice(-8).toUpperCase()}`
  }
  return `'${text.trim().toUpperCase().replace("'","")}`
}

function getProduct(text) {
  var productMap = {"engie":"Brasil Energia (EGIE3)", "alianza": "ALIANZA CI (ALZR11)", "hglg":"HGLH PX CI (HGLG11)", "kinea":"KINEA CI (KNRI11)", "fii xp":"XP MALLS CI (XPML11)","blockchain":"Blockchain FX IE", "wrld": "Investo WRLD CI (WRLD11)", "sp500": "SP500 (IVVB11)", "itau": "Itaú (ITUB4)", "metas": "Cofrinho Itaú 100% CDI", "weg": "WEGE (WEGE3)" }
  const key = Object.keys(productMap)
    .find(k => text.toLowerCase().includes(k.toLowerCase()));

  return key ? productMap[key] : text;
}

function getGroup(text){
  var groupMap = {"engie":"Ações (BR)", "alianza": "Fundos Imobiliarios", "hglg":"Fundos Imobiliarios", "kinea":"Fundos Imobiliarios", "fii xp":"Fundos Imobiliarios","blockchain":"Fundo de Ações", "wrld": "Ações (WRD)", "sp500": "Ações (WRD)", "itau": "Ações (BR)", "metas": "Reserva", "weg": "Ações (BR)", "Brasil Energia (EGIE3)": "Ações (BR)", "ALIANZA CI (ALZR11)": "Fundos Imobiliarios", "HGLH PX CI (HGLG11)": "Fundos Imobiliarios", "KINEA CI (KNRI11)": "Fundos Imobiliarios", "XP MALLS CI (XPML11)": "Fundos Imobiliarios","Blockchain FX IE": "Fundo de Ações", "Investo WRLD CI (WRLD11)": "Ações (WRD)", "SP500 (IVVB11)": "Ações (WRD)", "Itaú (ITUB4)": "Ações (BR)", "Cofrinho Itaú 100% CDI": "Reserva", "WEGE (WEGE3)": "Ações (BR)"}
  const key = Object.keys(groupMap)
    .find(k => text.toLowerCase().includes(k.toLowerCase()));

  return key ? groupMap[key] : text;
}
