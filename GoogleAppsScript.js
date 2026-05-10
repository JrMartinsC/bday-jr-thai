// ========================================
// GOOGLE APPS SCRIPT - INTEGRAÇÃO COM SHEETS
// ========================================
// 
// INSTRUÇÕES DE CONFIGURAÇÃO:
// 1. Crie uma planilha Google (Google Sheets) com o nome "Confirmacoes_Tarim"
// 2. Vá para https://script.google.com
// 3. Crie um novo projeto
// 4. Cole este código COMPLETO (copie tudo abaixo)
// 5. Edite as 3 primeiras constantes (SHEET_ID, SHEET_NAME, WEBHOOK_URL)
// 6. Clique em "Deploy" > "New deployment" > "Type: Web app"
// 7. Execute como: "Me"
// 8. Quem tem acesso: "Anyone"
// 9. Copie a URL gerada e cole em script.js na constante GOOGLE_SCRIPT_URL
//
// ========================================

// EDITE ESTAS VARIÁVEIS COM SEUS DADOS:

// 1. ID da sua planilha Google
//    (A parte em negrito da URL: https://docs.google.com/spreadsheets/d/[AQUI]/edit)
const SHEET_ID = 'COPIE_O_ID_DA_SUA_PLANILHA_AQUI';

// 2. Nome da aba da planilha (por padrão "Respostas" ou use o nome que quiser)
const SHEET_NAME = 'Respostas';

// 3. (OPCIONAL) Se quiser usar webhook para notificações em tempo real
//    Coloque a URL do seu webhook aqui (Discord, Slack, etc)
const WEBHOOK_URL = '';

// ========================================
// CONFIGURAÇÃO DO CABEÇALHO
// ========================================

function doPost(e) {
    try {
        // Parsear dados do formulário
        const data = JSON.parse(e.postData.contents);

        // Validar dados
        if (!data.name || !data.attending) {
            return ContentService
                .createTextOutput(JSON.stringify({ success: false, error: 'Dados inválidos' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Adicionar à planilha
        addResponseToSheet(data);

        // Enviar notificação via webhook se configurado
        if (WEBHOOK_URL) {
            sendWebhookNotification(data);
        }

        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                message: 'Resposta registrada com sucesso!' 
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Erro: ' + error.toString());
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ========================================
// ADICIONAR RESPOSTA À PLANILHA
// ========================================

function addResponseToSheet(data) {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Se a aba não existe, criar
    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        // Criar cabeçalho
        sheet.appendRow([
            'Data/Hora',
            'Nome',
            'Confirmado?',
            'Acompanhantes',
            'Mensagem'
        ]);
        // Formatar cabeçalho
        const headerRange = sheet.getRange(1, 1, 1, 5);
        headerRange.setBackground('#D4522E');
        headerRange.setFontColor('#FFFFFF');
        headerRange.setFontWeight('bold');
    }

    // Adicionar dados
    sheet.appendRow([
        data.timestamp || new Date().toLocaleString('pt-BR'),
        data.name,
        data.attending,
        data.companions || 0,
        data.message || ''
    ]);

    // Auto-ajustar colunas
    sheet.autoResizeColumns(1, 5);
}

// ========================================
// ENVIAR NOTIFICAÇÃO VIA WEBHOOK
// ========================================

function sendWebhookNotification(data) {
    const payload = {
        content: `✅ Nova confirmação!
**${data.name}** confirmou presença!

- Status: ${data.attending}
- Acompanhantes: ${data.companions || 0}
- Mensagem: ${data.message || '(nenhuma)'}
- Horário: ${data.timestamp}`
    };

    const options = {
        method: 'post',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    try {
        UrlFetchApp.fetch(WEBHOOK_URL, options);
    } catch (error) {
        Logger.log('Erro ao enviar webhook: ' + error);
    }
}

// ========================================
// FUNÇÃO PARA OBTER ESTATÍSTICAS (OPCIONAL)
// ========================================

function getStats() {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) return null;

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    
    const stats = {
        total: data.length,
        confirmados: 0,
        naoConfirmados: 0,
        talvez: 0,
        acompanhantes: 0,
        mensagens: 0
    };

    data.forEach(row => {
        const status = row[2];
        if (status === 'Confirmado') stats.confirmados++;
        if (status === 'Não Confirmado') stats.naoConfirmados++;
        if (status === 'Talvez') stats.talvez++;
        stats.acompanhantes += parseInt(row[3]) || 0;
        if (row[4] && row[4].trim()) stats.mensagens++;
    });

    return stats;
}

// ========================================
// ENDPOINT PARA OBTER DADOS (OPCIONAL)
// ========================================

function doGet(e) {
    const action = e.parameter.action;

    if (action === 'stats') {
        const stats = getStats();
        return ContentService
            .createTextOutput(JSON.stringify(stats))
            .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'reset') {
        // Remover esta função ou proteger com senha se usar
        // resetSheet();
        // return ContentService
        //     .createTextOutput(JSON.stringify({ success: true, message: 'Dados apagados' }))
        //     .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Serviço operacional' }))
        .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// TESTE LOCAL (para debug)
// ========================================

function testLocalFunction() {
    const testData = {
        timestamp: new Date().toLocaleString('pt-BR'),
        name: 'Teste User',
        attending: 'Confirmado',
        companions: 2,
        message: 'Teste de mensagem!'
    };

    addResponseToSheet(testData);
    Logger.log('Teste completado! Verifique a planilha.');
}
