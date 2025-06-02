const { model, Schema } = require('mongoose')

const osSchema = new Schema({
    dataEntrada: {
        type: Date,
        default: Date.now
    },
    idCliente: {
        type: String,        
    },
    statusOS: {
        type: String
    },
    celular: {
        type: String
    },
    serie: {
        type: String        
    },
    problema: {
        type: String  
    },
    tecnico: {
        type: String  
    },
    diagnostico: {
        type: String  
    },
    pecas: {
        type: String 
    },
    valor: {
        type: String 
    },
}, {versionKey: false}) //não versionar os dados armazenados

// exportar para o main o modelo de dados
// OBS: OS 
module.exports = model('OS', osSchema)