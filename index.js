const { readFileSync } = require('fs');

class ServicoCalculoFatura {
  calcularTotalCreditos(fatura, pecas) {
    return fatura.apresentacoes.reduce((total, apre) => {
      return total + this.calcularCredito(pecas, apre);
    }, 0);
  }
  calcularTotalFatura(fatura, pecas) {
    return fatura.apresentacoes.reduce((total, apre) => {
      return total + this.calcularTotalApresentacao(pecas, apre);
    }, 0);
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    switch (getPeca(pecas, apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
    }

    return total;
  }

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
}

function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura, pecas))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura, pecas)} \n`;

  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas, calc) {
  let resultadoHtml = `<html>\n`;
  resultadoHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
  resultadoHtml += `<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    resultadoHtml += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  }

  resultadoHtml += `</ul>\n`;

  resultadoHtml += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura, pecas))} </p>\n`;
  resultadoHtml += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura, pecas)} </p>\n`;

  resultadoHtml += `</html>`;
  return resultadoHtml;
}


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    {
      style: "currency", currency: "BRL",
      minimumFractionDigits: 2
    }).format(valor / 100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
const faturaHtml = gerarFaturaHTML(faturas, pecas, calc);
//console.log(faturaHtml);