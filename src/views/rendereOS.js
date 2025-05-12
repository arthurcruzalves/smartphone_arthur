// == CRUD Create/Update ======================================


// a constante foco obtem o elemento html (input) identificado como 'searchOS'
const foco = document.getElementById('inputSearchOS')

document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões
    btnUpdate.disabled = true
    btnDelete.disabled = true

    // Foco na busca do cliente
    foco.focus()
})


//captura dos dados dos inputs do formulário (Passo 1: Fluxo)
let frmOS = document.getElementById('frmOS')
let nameClientOS = document.getElementById('inputNameClientOS')
let cpfClientOS = document.getElementById('inputCPFClientOS')
let phoneClientOS = document.getElementById('inputPhoneClientOS')
let osStatus = document.getElementById('inputosStatusOS')
let modelcellOS = document.getElementById('inputmodelcellOS')
let ImeiOS = document.getElementById('inputIMEIOS')
let servicoOS = document.getElementById('inputservicoOS')
let tecnicoOS = document.getElementById('inputTecnicoOS')
let diagnosticoOS = document.getElementById('inputDiagnosticoOS')
let dataOS = document.getElementById('txtDataOS')
let valorOS = document.getElementById('inputValorOS')



//Evento associado ao botão submit (uso das validações do html)
frmOS.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formuláro - passo 1 do fluxo)
    console.log(nameClientOS.value, cpfClientOS.value, phoneClientOS.value, osStatus.value, modelcellOS.value, ImeiOS.value, servicoOS.value, tecnicoOS.value, diagnosticoOS.value, dataOS.value, valorOS.value)
    //Criar um objeto para armazenar os dados da OS antes de enviar ao main
   const OS = {
        nameCliOS: nameClientOS.value,
        cpfCliOS: cpfClientOS.value,
        phoneCliOS: phoneClientOS.value,
        osStatus: osStatus.value,
        modelOS: modelcellOS.value,
        ImeiOS: ImeiOS.value,
        servicoOS: servicoOS.value,
        tecnicoOS: tecnicoOS.value,
        diagnosticoOS: diagnosticoOS.value,
        dataOS: dataOS.value,
        valorOS: valorOS.value
   }
    // Enviar ao main o objeto os - (Passo 2: fluxo)
    // uso do preload.js
    api.newOS(OS)
    
})

// == Fim CRUD Create/Update ==================================
// ============================================================

// ==================================================
// == Busca avançada - estilo Google ================

// capturar os id referente ao campo do nome
const input = document.getElementById('inputSearchOS')
// capturar o id do ul da lista de sugestões de clientes
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser preenchidos
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')

// vetor usado na manipulação (filtragem) dos dados
let arrayClients = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minúsculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    //console.log(search) // teste de apoio a lógica
    // Passo 2: Enviar ao main um pedido de busca de clientes pelo nome (via preload - api )
    api.searchClient()

    // Recebimento dos clientes do banco de dados (passo 3)
    api.listClients((event, clients) => {
        // console.log(clients) // teste do passo 3
        // converter para JSON os dados dos clientes recebidos
        const dataClients = JSON.parse(clients)
        // armazenar no vetor os dados dos clientes
        arrayClients = dataClients
        // Passo 4: Filtrar os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real
        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10) //máximo 10 resultados
        //console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um ítem da lista <li>
        results.forEach(c => {
            // criar o elemento li
            const item = document.createElement('li')
            // adicionar classes bootstrap a cada li criado
            item.classList.add('list-group-item', 'list-group-item-action')
            // exibir o nome do cliente
            item.textContent = c.nomeCliente

            // adicionar os li s criados a lista ul
            suggestionList.appendChild(item)

            // adicionar um evento de clique no item da lista para preencher os campos do formulário
            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                // limpar o input e recolher a lista
                input.value = ""
                suggestionList.innerHTML = ""
            })
        })
    })
})

// Ocultar a lista ao clicar fora
document.addEventListener('click', (event) => {
    // ocultar a lista se ela existir e estiver ativa
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})

// == Fim - busca avançada ==========================
// ==================================================



// ==================================================
// == Buscar OS =====================================

function findOS() {
    //console.log("teste do botão Buscar OS")
    api.searchOS()
}

//=====Reset form==================
function resetForm() {
    //Limpar os campos e resetar o formulario com as configurações pré definidas.
    location.reload()
}
// Recebimento do pedido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})


