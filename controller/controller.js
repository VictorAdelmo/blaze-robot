const model = require("../model/dados");

async function analisarController(req,res){
    const {dataInicio,dataFim,montante} = req.body;
    let lista = "";

    if(!dataInicio || !dataFim){
        return res.render("inicio",{errorMsg: "Selecione a Data e Hora"});
    }

    if(!montante){
        lista = await model.filtrarDataHora(dataInicio,dataFim);
        return res.render("inicio",{dados : lista});
    }else {
        lista = await model.filtrarPorMontante(montante,dataInicio,dataFim);
        return res.render("inicio",{dados : lista});
    }

}

module.exports = {analisarController};