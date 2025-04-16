// == CRUD Create/Update ======================================

// Obter referência aos elementos
const foco = document.getElementById('inputSearchOS')
const btnUpdate = document.getElementById('btnUpdate')
const btnDelete = document.getElementById('btnDelete')

// Desativar botões de edição e exclusão inicialmente
btnUpdate.disabled = true
btnDelete.disabled = true

// Foco no campo de busca
foco.focus()

// Captura dos dados dos inputs do formulário
const frmOS = document.getElementById('frmOS')
const nameClientOS = document.getElementById('inputNameClientOS')
const cpfClientOS = document.getElementById('inputCPFClientOS')
const phoneClientOS = document.getElementById('inputPhoneClientOS')
const osStatus = document.getElementById('inputosStatusOS')
const modelcellOS = document.getElementById('inputmodelcellOS')
const ImeiOS = document.getElementById('inputIMEIOS')
const servicoOS = document.getElementById('inputservicoOS')
const tecnicoOS = document.getElementById('inputTecnicoOS')
const diagnosticoOS = document.getElementById('inputDiagnosticoOS')
const valorOS = document.getElementById('inputValorOS')
const dataOS = document.getElementById('txtDataOS')
const dataFS = document.getElementById('inputdatafinal')
const corOS = document.getElementById('inputCorOS')
const responsavelOS = document.getElementById('inputResponsavelOS')

// Evento ao enviar o formulário
frmOS.addEventListener('submit', async (event) => {
    event.preventDefault()

    console.log(
        nameClientOS.value, cpfClientOS.value, phoneClientOS.value,
        osStatus.value, modelcellOS.value, ImeiOS.value,
        servicoOS.value, tecnicoOS.value, diagnosticoOS.value,
        valorOS.value, dataOS.value, dataFS.value, corOS.value, responsavelOS.value
    )

    const os = {
        statusOS: osStatus.value,
        modelocellOS: modelcellOS.value,
        imeiOS: ImeiOS.value,
        descricaoOS: servicoOS.value,
        tecnicoOS: tecnicoOS.value,
        diagnosticoOS: diagnosticoOS.value,
        dataOS: dataOS.value,
        valorOS: valorOS.value,
        dataFS: dataFS.value,
        corOS: corOS.value,
        responsavelOS: responsavelOS.value
    }

    // Enviar ao processo principal via preload.js
    api.newOS(os)
})

// == Fim CRUD Create/Update ==================================

// == Reset Formulário ========================================

// Função que recarrega a página (reset total)
function resetForm() {
    location.reload()
}

// Receber evento do processo principal para resetar o formulário
api.resetForm(() => {
    resetForm()
})

// == Fim - reset form ========================================
