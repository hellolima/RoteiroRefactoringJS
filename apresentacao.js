var { formatarMoeda } = require("./utils.js");

function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
  
    return faturaStr;
  }
  
  function gerarFaturaHTML(fatura, calc) {
    let resultadoHtml = `<html>\n`;
    resultadoHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
    resultadoHtml += `<ul>\n`;
  
    for (let apre of fatura.apresentacoes) {
      resultadoHtml += `<li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
    }
  
    resultadoHtml += `</ul>\n`;
  
    resultadoHtml += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))} </p>\n`;
    resultadoHtml += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} </p>\n`;
  
    resultadoHtml += `</html>`;
    return resultadoHtml;
  }

module.exports = {
    gerarFaturaStr,
    gerarFaturaHTML
};
  