const { readFileSync } = require('fs');

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  calcularTotalCreditos(fatura) {
    return fatura.apresentacoes.reduce((total, apre) => {
      return total + this.calcularCredito(apre);
    }, 0);
  }
  calcularTotalFatura(fatura) {
    return fatura.apresentacoes.reduce((total, apre) => {
      return total + this.calcularTotalApresentacao(apre);
    }, 0);
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (calc.repo.getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${calc.repo.getPeca(apre).nome}`);
    }

    return total;
  }

  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (calc.repo.getPeca(apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
}

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


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    {
      style: "currency", currency: "BRL",
      minimumFractionDigits: 2
    }).format(valor / 100);
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
const faturaHtml = gerarFaturaHTML(faturas, calc);
//console.log(faturaHtml);