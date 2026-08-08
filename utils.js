function converterDateStringToDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return "";
  }
  var months = {
    'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
    'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
    'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
  };

  var stringStriped = dateString.trim().toLowerCase().split('-');

  if (stringStriped.length !== 2) {
    return "";
  }

  var monthText = stringStriped[0];
  var year = stringStriped[1];
  var month = months[monthText];

  if (!month || isNaN(Number(year))) {
    return "";
  }
  return `${year}-${month}-01`
}

function lastMonthFromDate(dateInput="2026-06-01"){
  let date = new Date(`${dateInput}T00:00:00`)

  date.setMonth(date.getMonth() - 1)

  // Formata para YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  console.log(`${year}-${month}-${day}`)

  return `${year}-${month}-${day}`;
}

function getLastBusinessDay(dateInput="2026-06-06") {
  let date = new Date(`${dateInput}T00:00:00`);
  let weekDay = date.getDay(); // 0 = Domingo, 6 = Sábado
  
  // Se for sábado (6), adiciona 2 dias para ir para segunda-feira
  // Se for domingo (0), adiciona 1 dia para ir para segunda-feira
  // Em dias úteis (1 a 5), adiciona 1 dia para o próximo dia útil
  if (weekDay === 6) {
    date.setDate(date.getDate() - 1);
  } else if (weekDay === 0) {
    date.setDate(date.getDate() - 2);
  }

  // Formata para YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}