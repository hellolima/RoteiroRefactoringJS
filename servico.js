

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
      switch (this.repo.getPeca(apre).tipo) {
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
          throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).nome}`);
      }
  
      return total;
    }
  
    calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (this.repo.getPeca(apre).tipo === "comedia")
        creditos += Math.floor(apre.audiencia / 5);
      return creditos;
    }
  }

module.exports = ServicoCalculoFatura;