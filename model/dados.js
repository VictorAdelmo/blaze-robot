const db = require("../database/Conexao");

async function armazenarDados(bancaVermelho,bancaPreto,bancaBranco,data,resultadoRodada) {
    if (!bancaVermelho || !bancaPreto || !bancaBranco || !data || !resultadoRodada) {
      return null;
    }
    try {
      await db.connect;
      await db.query(
        "INSERT INTO blaze (banca_vermelho,banca_preto,banca_branco,data,resultado) VALUES ($1,$2,$3,$4,$5)",
        [bancaVermelho, bancaPreto, bancaBranco, data, resultadoRodada]
      );
      console.log("Inserido");
    } catch (err) {
      console.log(err);
    }
  }

  async function filtrarDataHora(dataInicio,dataFim){
    try {
      await db.connect;
      let resultado = await db.query("SELECT * FROM blaze WHERE data BETWEEN $1 AND $2",[dataInicio,dataFim]);
      resultado = JSON.stringify(resultado.rows);
      resultado = JSON.parse(resultado);

      return resultado;
    } catch (err) {
      console.log(err);
    }
  }

  async function filtrarPorMontante(valor,dataInicio,dataFim){
    try {
      await db.connect;
      let resultado = await db.query("SELECT * FROM blaze WHERE banca_vermelho > $1 OR banca_preto > $2 AND data BETWEEN $3 AND $4 ",[valor,valor,dataInicio,dataFim]);
      resultado = JSON.stringify(resultado.rows);
      resultado = JSON.parse(resultado);

      return resultado;
    } catch (err) {
      console.log(err);
    }
  }

  async function lucroDoDiaBlaze(dataInicio,dataFim){
    try {
      await db.connect;
      let prejuizoVermelho = await db.query("SELECT banca_vermelho FROM blaze WHERE resultado = Vermelho AND data BETWEEN $1 AND $2 "
      ,[dataInicio,dataFim]);

      let prejuizoPreto = await db.query("SELECT banca_preto FROM blaze WHERE resultado = Preto AND data BETWEEN $1 AND $2 "
      ,[dataInicio,dataFim]);

      let lucroVermelho = await db.query("SELECT banca_vermelho FROM blaze WHERE resultado = Preto AND data BETWEEN $1 AND $2 "
      ,[dataInicio,dataFim]);

      let lucroPreto = await db.query("SELECT banca_preto FROM blaze WHERE resultado = Vermelho AND data BETWEEN $1 AND $2 "
      ,[dataInicio,dataFim]);

      let branco = await db.query("SELECT banca_branco,banca_vermelho,_banca_preto FROM blaze WHERE resultado = Branco AND data BETWEEN $1 AND $2 "
      ,[dataInicio,dataFim]);

      let lucroBranco = somarLista(branco.rows.banca_vermelho,branco.rows.banca_preto);
      let prejuizoBranco = somarLista(null,null,branco.rows.banca_branco);
      let prejuizo = somarLista(prejuizoVermelho.rows,prejuizoPreto.rows);
      let lucro = somarLista(lucroVermelho.rows,lucroPreto.rows);
      
      let resultado = (lucro + lucroBranco) - (prejuizo +prejuizoBranco);
      console.log(resultado);
      return resultado;

    } catch (err) {
      console.log(err);
    }
  }

  function somarLista(listaVermelho,listaPreto,branco) {
    
    if(branco != null && listaVermelho == null && listaPreto == null){
      return branco.reduce((a, b) => a + b, 0);
    }
    
    let resVermelho = listaVermelho.reduce((a, b) => a + b, 0);
    let resPreto = listaPreto.reduce((a, b) => a + b, 0);

    let resultadoSoma = resVermelho + resPreto;
    return resultadoSoma;
  }


module.exports = {armazenarDados,filtrarDataHora,filtrarPorMontante,lucroDoDiaBlaze}