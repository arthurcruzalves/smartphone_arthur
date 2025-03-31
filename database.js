/**
 * Modulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// importação do mongoose
const mongoose = require('mongoose')

// configuração do acesso ao banco de dados
// ip/link - autenticação
// Obs: Atlas(obter via compass)
// Para criar um banco de dados personalizado basta escolher um nome no final da String da url (exdbclientes)
const url = 'mongodb+srv://admin:123Senac@projetonode.xf4ib.mongodb.net/dbsmartphone'

// criar uma varivel de apoio para validação
let conectado = false

// método para conectar o banco de dados
// async executar a função de forma assincroma
const conectar = async () => {
    // validação (se não estiver conectado, conectar)
    if (!conectado) {
        // conectar com o banco de dados
        // try catch - tratamento de excepções
        try {
            await mongoose.connect(url) // conectar
            conectado = true // setar a variavel
            console.log("MongoDB conectado")
            return true // para o main identificar a conexão estabelecida com sucesso
        } catch (error) {
            // se o codigo de erro
            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
            return false
        }
    }
}



// método para conectar o banco de dados
const desconectar = async () => {
    // validação (se não estiver conectado, conectar)
    if (conectado) {
        // desconectar com o banco de dados
        try {
            await mongoose.disconnect(url) // desconectar
            conectado = false // setar a variavel
            console.log("MongoDB desconectado")
            return true // para identificar que o banco de dados desconectado com sucesso
        } catch (error) {
            console.log(error)
        }
    }
}

// exportar para o main os metodos conectar e desconectar
module.exports = { conectar, desconectar }