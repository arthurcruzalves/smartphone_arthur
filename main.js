console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// Esta linha está relacionada ao preload.js
const path = require('node:path')

// Importação dos métodos conectar e desconectar (modulo de conexão)
const {conectar, desconectar} = require('./database.js')

// Importação do Schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF} = require('jspdf')

// importação d biblioteca fs (nativa do JS) para manipulação de arquivo
const fs = require('fs')

// Janela principal
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'dark' //(dark ou light)
    win = new BrowserWindow({
        width: 800,
        height: 600,
        //autoHideMenuBar: true,
        //minimizable: false,
        resizable: false,
        //ativação do preload.js
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    })

    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

}

// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'
    // a linha abaixo obtém a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // Estabelecer uma relação hierárquica entre janelas
    if (main) {
        // Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    //carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
}

// Janela cliente
let client
function clientWindow() {
    nativeTheme.themeSource ='light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
              }
        })
    }
  client.loadFile('./src/views/cliente.html')
  client.center()
}

// Janela OS
let OS
function osWindow() {
    nativeTheme.themeSource ='light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        OS = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
  OS.loadFile('./src/views/os.html')
  OS.center()
}

// Janela smartphone
let smartphone
function smartphoneWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        smartphone = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
              }
        })
    }
    smartphone.loadFile('./src/views/smartphone.html')
    smartphone.center()
}

// Iniciar a aplicação
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//reduzir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    // se conectado for igual a true
    if (conectado) {
      // enviar uma mensagem para o renderizador trocar o ícone
      setTimeout(() => {
        event.reply('db-status', "conectado")
      }, 500)
    }
  })
  
  // IMPORTANTE! Desconectar do banco de dados quando a aplicação for encerrada
  app.on('before-quit', () => {
    desconectar()
  })

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                label: 'Smartphone',
                click: () => smartphoneWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () =>  relatorioClientes()
            },
            {
                label: 'OS abertas'
            },
            {
                label: 'OS concluídas'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

// recebimento dos pedidos do renderizador para abertura de janelas (botões)
ipcMain.on('client-window', () => {
    clientWindow()
  })

  ipcMain.on('os-window', () => {
    osWindow()
  })

  ipcMain.on('smartphone-window', () => {
  smartphoneWindow()
  })

  //===============================================================
    // == Clientes - CRUD Create
    // recebimento do objeto que contem os dados do cliente
ipcMain.on('new-client', async (event, client) => {
    // Importante! Teste de recebimento dos dados do cliente
console.log(client)
try {
    // criar uma nova de estrutura de dados usando a classe modelo.
    // Atenção! Os atributos precisam ser identificados ao modelo de dados Cliente.js e os valores são definidos pelo
    // conteúdo de objeto
    const newClient = new clientModel({
        nomeCliente: client.nameCli,
        cpfCliente: client.cpfCli,
        emailCliente: client.emailCli,
        foneCliente: client.foneCli,
        cepCliente: client.cepCli,
        logradouroCliente: client.logradouroCli,
        numeroCliente: client.numeroCli,
        complementoCliente: client.complementCli,
        bairroCliente: client.bairroCli,
        cidadeCliente: client.cidadeCli,
        ufCliente: client.ufCli
    })
    // salvar os dados do cliente no banco de dados
    await newClient.save()
    //Mensagem de confirmação
    dialog.showMessageBox({
      //Customização
      type: 'info',
      title: "Aviso",
      message: "Cliente adicionado com sucesso",
      buttons: ['OK']
    }).then((result) => {
      //ação ao precionar o botão 
      if (result.response === 0) {
        // enviar um pedido para o renderizador limpar os campos e resetar as 
        // configurações pré definidas (rótulo) preload.js
        event.reply('reset-form')
      }

    })
  } catch (error) {
    //se o codigo de erro for 11000 (cpf duflicado) enviar uma mensagem ao usuario
    if (error.code === 11000) {
      dialog.showMessageBox({
        type: 'info',
        title: "Atenção!",
        message: "CPF já está cadastrado\nVerifique se digitou corretamente",
        buttons: ['OK']
      }).then((result) => {
        if (result.response === 0) {
          // limpar a caixa do input do cpf, focar esta caixa e deixar a borda em vermelho
        }
      })
    }
    console.log(error)
  }
})
// -- Fim - Cliente - CRUD Create ===========
// ==========================================

    // ============================================================
// == Relatórios de clientes ==================================

async function relatorioClientes() {
    try {
        // Passo 1:
        const clientes = await clientModel.find().sort({nomeCliente:1})
        //teste de recebimento da listagem de cliente
        //console.log(clientes)
        //Passo 2: Formação do documento pdf
        // p - portrait | l - landscape | mm e a4 (folha)
        const doc = new jsPDF('p', 'mm', 'a4')
        // definir o tamanho da fonte (tamanho equivalente ao word)
        doc.setFontSize(16)
        // escrever um texto (título)
        doc.text("Relatório de clientes", 14, 20)//x, y (mm)
        // inserir a data atual no relatorio
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        /// variavel de apoio na formatação
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        //desenhar uma linha 
        doc.setLineWidth(0.5) // expessura da linha 
        doc.line(10, y, 200, y) // 10 (inicio) ---- 200 fim

        //Definir o caminho do arquivo temporario
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath) 
        // abrir o arquivo rio aplicativo padrão de leitura de pdf do computador
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }    
}