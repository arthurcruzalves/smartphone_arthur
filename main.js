console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// Esta linha está relacionada ao preload.js
const path = require('node:path')

// Importação dos métodos conectar e desconectar (modulo de conexão)
const {conectar, desconectar} = require('./database.js')

// Importação do Schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')

// Importação do Schema OS da camada model
const osModel = require('./src/models/os.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF} = require('jspdf')

// importação d biblioteca fs (nativa do JS) para manipulação de arquivo
const fs = require('fs')
const { error } = require('node:console')

// Importação do recurso 'electron-prompt' (dialog de input)
// 1º instalar o recurso: npm i electron-prompt
const prompt = require('electron-prompt')


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
            width: 1110,
            height: 820,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
              }
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
        type: 'error',
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
        // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })
        // teste de recebimento da listagem de clientes
        console.log(clientes)
        // Passo 2:Formatação do documento pdf
        // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
        const doc = new jsPDF('p', 'mm', 'a4')
        // Inserir imagem no documento pdf
        // imagePath (caminho da imagem que será inserida no pdf)
        // imageBase64 (uso da biblioteca fs par ler o arquivo no formato png)
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
        // definir o tamanho da fonte (tamanho equivalente ao word)
        doc.setFontSize(18)
        // escrever um texto (título)
        doc.text("Relatório de clientes", 14, 45)//x, y (mm)
        // inserir a data atual no relatório
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 165, 10)
        // variável de apoio na formatação
        let y = 60
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        // desenhar uma linha
        doc.setLineWidth(0.5) // expessura da linha
        doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)

        // renderizar os clientes cadastrados no banco
        y += 10 // espaçamento da linha
        // percorrer o vetor clientes(obtido do banco) usando o laço forEach (equivale ao laço for)
        clientes.forEach((c) => {
            // adicionar outra página se a folha inteira for preenchida (estratégia é saber o tamanho da folha)
            if (y > 280) {
                doc.addPage()
                y = 20 // resetar a variável y
                // redesenhar o cabeçalho
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("E-mail", 130, y)
                y += 5
                doc.setLineWidth(0.5) 
                doc.line(10, y, 200, y)
                y += 10
            }
            
            // Garantir que os dados existem antes de chamar `text`
            doc.text(c.nomeCliente || "Nome não informado", 14, y);
            doc.text(c.foneCliente || "Telefone não informado", 80, y);
            doc.text(c.emailCliente || "N/A", 130, y);
            
            y += 10 // quebra de linha
        })
        

        // Adicionar numeração automática de páginas
        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, {align: 'center'})
        }

        // Definir o caminho do arquivo temporário e nome do arquivo
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

// == Fim - relatório de clientes =============================
// ============================================================

// ============================================================
// == Ordem de Serviço - CRUD Create
// recebimento do objeto que contem os dados da ordem de serviço

ipcMain.on('new-OS', async (event, os) => {
    // Importante! Teste de recebimento dos dados da ordem de serviço
    console.log(os) 
    // Cadastrar a estrutura de dados no banco de dados MongoDB
    try{
        // criar uma nova de estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser idênticos ao modelo de dados OS.js e os valores são definidos pelo conteúdo do objeto cliente
        const newOS = new osModel({
            statusOS: os.StatusOS,
            modelocellOS: os.modelocellOS,
            tecnicoOS: os.tecnicoOS,
            diagnoticoOS: os.diagnoticoOS,
            imeiOS: os.ImeiOS,
            descricaoOS: os.servicoOS,
            valorOs: os.valorOs
        })
        // salvar os dados do os no banco de dados
        await newOS.save()

        // Mensagem de confirmação
        dialog.showMessageBox({
            // custon
            type: 'info',
            title: "Aviso",
            message: "Ordem de serviço registrada com sucesso!",
            buttons: ['OK']
          }).then((result) => {
             //ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                // pedido para o render limpar os campos e fazer um reset nas config 
              event.reply('reset-form');
            }
          });
        } catch (error) {
            // se o código de erro for 11000(cpf duplicado) enviar uma mensagem ao usuario
            if (error.code === 11000) {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção",
                    message: "CPF já cadastrado.\n",
                    buttons: ['OK']
                }).then((result) => {
                    if (result.response === 0) {
                        //Limpar a caixa de input do CPF, focar esta caixa e deixar a borda em vermelho
    
    
                    }
                })
            }
            console.log(error)
        }
    })

// == Ordem de Serviço - CRUD Create
// ============================================================

// Validação de busca (obrigatório)
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção',
        message: "Preencha o campo de busca",
        buttons: ['OK']
    })
})

// == CRUD Read =====================================================
ipcMain.on('search-name', async (event, name) => {
    //console.log("teste IPC search-name")
    //console.log(name) // teste do passo 2 (importante!)
    // Passo 3 e 4 busca dos dados do cliente no banco
    // find({nomeCliente: name}) - busca
    //
    try{
        /*const dataClient = await clientModel.find({
      nomeCliente: new RegExp(name, 'i')
    })*/
    const dataClient = await clientModel.find({
        $or: [
          { nomeCliente: new RegExp(name, 'i') },
          { cpfCliente: new RegExp(name, 'i') }
        ]
      })
        console.log(dataClient) // teste passos 3 e 4 (importante!)

        // melhoria da experiência do usuario (se o cliente não estiver cadastrado, alertar o usuario e questionar se ele quer cadastrar este novo cliente. Se não quiser cadastrar, limpar os campos, se quiser cadastra recortar o nome do cliente do campo de busca  e colar no campo nome)

        // se o vetor estiver vazio [] (cliente não cadastrado)
        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Avisos",
                message: "Cliente não cadastrado. \nDeseja cadastra esse cliente?",
                defaultId: 0, // botão 0
                buttons: ['Sim', 'Não'] // [0 ,1]
            }).then((result) => {
                if( result.response === 0) {
                    // enviar ao renderizador um pedido para setar os campos (recortar os campos)
                    event.reply('set-client')
                } else {
                    // limpar o formulario
                    event.reply('reset-form')
                }
            })
        }

        // Passo 5:
        // enviando os dados do cliente ao rendererCliente
        // OBS: IPC só trabalha com string, então é necessário converter o JSON
        // para string JSON.stringify(dataClient)
        event.reply('render-client', JSON.stringify(dataClient))

    } catch (error) {
        console.log(error)
    }

})

// == Fim CRUD Read =========================================
// ===================================================================


//===================================================================
// CRUD Delete =======================================================
ipcMain.on('delete-client', async (event, id) => {
    console.log(id) // teste do passo 2: recebimento do id
    try {
        // importante - confirmar a exclusão
        // client é o nome da variavel que responde a janela
        const {response} = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção!",
            message: "Deseja excluir esse cliente?\nEsta ação não poderá ser desfeita.",
            buttons:['Cancelar', 'Excluir'] //[0, 1]
        })
        if (response === 1) {
            //Passo 3 - Excluir o registro do cliente
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }

    } catch (error) {
        console.log(error)
    }
})



// Fim do CRUD Delete ================================================
// ==================================================================


// ============================================================
// == CRUD Update =============================================

ipcMain.on('update-client', async (event, client) => {
    console.log(client) //teste importante (recebimento dos dados do cliente)
    try {
        // criar uma nova de estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser idênticos ao modelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto cliente
        const updateClient = await clientModel.findByIdAndUpdate(
            client.idCli,
            {
                nomeCliente: client.nameCli,
                cpfCliente: client.cpfCli,
                emailCliente: client.emailCli,
                foneCliente: client.phoneCli,
                cepCliente: client.cepCli,
                logradouroCliente: client.addressCli,
                numeroCliente: client.numberCli,
                complementoCliente: client.complementCli,
                bairroCliente: client.neighborhoodCli,
                cidadeCliente: client.cityCli,
                ufCliente: client.ufCli
            },
            {
                new: true
            }
        )
        // Mensagem de confirmação
        dialog.showMessageBox({
            //customização
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
                event.reply('reset-form')
            }
        })

    } catch (error) {
        console.log(error)
    }
})

// == Fim - CRUD Update =======================================
// ============================================================

//************************************************************/
//*******************  Ordem de Serviço  *********************/
//************************************************************/


// ============================================================
// == Buscar OS ===============================================

ipcMain.on('search-os', (event) => {
    //console.log("teste: busca OS")
    prompt({
        title: 'Buscar OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then((result) => {
        if (result !== null) {
            console.log(result)
            //buscar a os no banco pesquisando pelo valor do result (número da OS)

        }
    })
})

// == Fim - Buscar OS =========================================
// ============================================================


// ============================================================
// == CRUD Create - Gerar OS ==================================


// == Fim - CRUD Create - Gerar OS ===========================
// ============================================================



// ============================================================
// == Buscar cliente para vincular na OS(busca estilo Google) = 

ipcMain.on('search-clients', async (event) => {
    try {
        // buscar no banco os clientes pelo nome em ordem alfabética
        const clients = await clientModel.find().sort({ nomeCliente: 1 })
        //console.log(clients) // teste do passo 2
        // Passo 3: Envio dos clientes para o renderizador
        // Obs: não esquecer de converter para String
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})

// == Fim - Busca Cliente (estilo Google) =====================
// ============================================================