/**
 * Arquivos de pré carregamento e reforço de segurança na comunicação entre processos (IPC)
 */

// Importação dos recursos do framework electron
// contextBridge (segurança) ipcRenderer (comunicação)
const {contextBridge, ipcRenderer} = require('electron')

// expor (autorização a  comunicação entre processos)
contextBridge.exposeInMainWorld('api',{
    clientWindow: () => ipcRenderer.send('client-window'),
    osWindow: () => ipcRenderer.send('os-window')
})
