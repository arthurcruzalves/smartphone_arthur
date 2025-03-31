// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento")
    //armazenar o cep digitado na variavel
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service par abter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.cidade
            document.getElementById('inputUFClient').value = dados.uf
        })
        .catch(error => console.log(error))
}


// capturar o foco na busca pelo nome do cliente
// a constante foco obtem o elemento html (input) identificado como 'searchClient'
const foco = document.getElementById('searchClient')

// Iniciar a janela de cliente alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    foco.focus()
})

// captura dos dados dos inputs do formulario (Passo 1: Fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let phoneClient = document.getElementById('inputTelefoneClient')
let cepClient = document.getElementById('inputCEPClient')
let addressClient = document.getElementById('inputAddressClient')
let numberClient = document.getElementById('inputNumeroClient')
let complementClient = document.getElementById('inputComplementClient')
let bairroClient = document.getElementById('inputNeighborhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')

// ===================================================================
// == CRUD Create/Update =============================================

// Evento associado ao botão submit (uso das validações do html)
frmClient.addEventListener('submit', async (event) => {
    // evitar o comportamento padrão do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(nameClient.value,cpfClient.value,emailClient.value,phoneClient.value, cepClient.value, addressClient.value, numberClient.value, complementClient.value,bairroClient.value, cityClient.value, ufClient.value)
    //console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value,complementClient.value, bairroClient.value, cityClient.value, ufClient.value)
    //Criar um objeto para armazenar os dados do cliente antes de enviar ao main 
    
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        phoneCli: phoneClient.value,
        cepCli: cepClient.value,
        addressCli: addressClient.value,
        numberCli: numberClient.value,
        complementCli: complementClient.value,
        bairroCli: bairroClient.value,
        cityCli: cityClient.value,
        ufCli: ufClient.value
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // uso do preload.js
    api.newClient(client) 
    
})

// == Fim CRUD Create/Update =========================================
// ===================================================================