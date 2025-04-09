/**
 * Modelo de dados para construção de coleções ("tabelas")
 */

// Importação dos recursos do framework mongoose 
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção OS
const osSchema = new Schema({
    statusOS: {
        type: String
    },
    modelocellOS: {
        type: String
    },
    tecnicoOS: {
        type: String
    },
    responsavelOS: {
        type: String
    },
    corOS: {
        type: String
    },
    diagnosticoOS: {
        type: String
    },      
    imeiOS: {
        type: String,
        unique: true
    },
    descricaoOS: {
        type: String
    },
    dataOS: {
        type: String
    },
    dataFS: {
        type: String
    },
    valorOS: {
        type: Number
    }
}, { versionKey: false }) // não versionar os dados armazenados 

// exportar para o main o moulo de dados
//OBS: Clientes será o nome da coleção "tabelas"

module.exports = model('os', osSchema)