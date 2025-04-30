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
            document.getElementById('inputCityClient').value = dados.localidade
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

// ==========================================================
// == Manipulação da tecla Enter ============================

// Função para manipular o evento da tecla Enter
function teclaEnter(event) {
    // se a tecla Enter for pressionada
    if (event.key === "Enter") {
        event.preventDefault() // ignorar o comportamento padrão
        // associar o Enter a busca pelo cliente
        buscarCliente()
    }
}

// Função para restaurar o padrão da tecla Enter (submit)
function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}

// "Escuta do evento Tecla Enter"
frmClient.addEventListener('keydown', teclaEnter)

// == Fim - manipulação tecla Enter ==========================
// ===========================================================


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

// == CRUD Read =====================================================
function buscarCliente() {
     //console.log("Teste do botão buscar")
    // Passo 1: capturar o nome do cliente
    let name = document.getElementById('searchClient').value
    console.log(name) // teste do passo 1


    if (name == "") {
        //enviar um alerta para o usuario
        api.validateSearch()
        foco.focus()
        } else {
            api.searchName(name) // Passo 2: envio do nome ao main
            // recebimento dos dados do cliente
            api.renderClient((event, dataClient) => {
                console.log(dataClient) // teste do passo 5
            // passo 6 renderizador os dados do cliente no formulario
                // - Criar um vetor global para manipulação dos dados
                // - Criar uma constatnte para converter os dados
                // (string) para o formato JASON
                // usar o laço fotEach para percorre o vetor e setar os campos 
                // (caixas de texto) do formulario
                const dadosClientes =  JSON.parse(dataClient)
                // atribuir ao vetor os dados do cliente
                arrayClient = dadosClientes
                // extrair os dados do cliente
                arrayClient.forEach((c) =>{
                    nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    emailClient.value = c.emailCliente,
                    phoneClient.value = c.cepCliente,
                    cepClient.value = c.cepCliente,
                    addressClient.value = c.logradouroCliente,
                    numberClient.value = c.numeroCliente,
                    complementClient.value = c.complementoCliente,
                    bairroClient.value = c.bairroCliente,
                    cityClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente
                    // bloqueio do botão adicionar
                    btnCreate.disabled = true
                    // desbloqueio dos botões editar e excluir
                    btnDelete.disabled = false
                    btnUpdate.disabled = false

                })
            })
        }


}


// setar o cliente não cadastrado (recortar do campo de busca e colar no campo nome)
api.setClient((args) => {
    // criar uma vaiave para armazenar o valor digitado no campo de busca (nome, cpf)
    let campoBusca = document.getElementById('searchClient').value
    // foco no campo de nome do cliente
    nameClient.focus()
    // remover o valor digitado no campo de busca
    foco.value = ""
    // preencher o campo do nome cliente
    nameClient.value = campoBusca
})

// == Fim CRUD Read =========================================
// ===================================================================


// ===================================================================
// == Reset form =====================================================
function resetForm() {
    // Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// Recebimento do pedido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})

// == Fim - reset form ===============================================
// ===================================================================

// === Função para aplicar máscara no CPF ===
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Adicionar eventos para CPF
cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); // Máscara ao digitar
cpfClient.addEventListener("blur", validarCPF); // Validação ao perder o foco


// == CRUD Creat/Update ==================================

//===================================================================
// CRUD Delete =======================================================
function excluirCliente(){
    console.log(id)
    api.deleteClient(id.value)
}

// Fim do CRUD Delete ================================================
// ==================================================================