/**
 * Processo de renderização
 * Tela principal
 */

console.log("Processo de rendereização")

function cliente() {
    //console.log("teste do botão cliente")
    // uso da api(autorização no preload.js)
    api.clientWindow()
}

function os() {
    //console.log("teste do botão os")
     // uso da api(autorização no preload.js)
     api.osWindow()
}

function smartphone() {
     //console.log("teste do botão smartphone")
     // uso da api(autorização no preload.js)
    api.smartphoneWindow()
}

// troca do icone do banco de dados (usando a api do preload.js)
api.dbStatus((event, message) => {
    // teste do recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)