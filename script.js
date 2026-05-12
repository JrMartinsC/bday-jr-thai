// ========================================
// CONFIGURAÇÕES E CONSTANTES
// ========================================

// DATA DO EVENTO (16 de Maio, 17h)
const EVENT_DATE = new Date(2026, 4, 16, 17, 0, 0);

// URL do seu Google Apps Script (POST - receber dados)
const GOOGLE_SCRIPT_POST_URL = 'https://script.google.com/macros/s/AKfycbys_sinD2SXvqETt1LmrZz-p_nos_6UeK-MRCHziAyJTSklQybaceAAY70IysfL1I0vNA/exec';

// URL do seu Google Apps Script (GET - buscar dados)
const GOOGLE_SCRIPT_GET_URL = 'https://script.google.com/macros/s/AKfycbyxK-B8Dli7ByDkTCpMbz5LMN7iSg8m7EPcf8YRZYVYrJsXJlqdlYFeQNYA108EEYnnmQ/exec';

// Frases engraçadas para rotacionar
const FUNNY_QUOTES = [
    '🎊 Você não vai ficar fora dessa né?! 🎊',
    '🔥 Cervejinha gelada! 🔥',
    '🍖 Churrasco tá chegando! 🍖',
    '🎵 Prepara o pulmão pra cantar pagode! 🎵',
    '👥 Venha curtir com a gente 👥',
    '🌅 Pôr do sol garantido nesse dia! 🌅',
    '🎶 Vai ter resenha de primeira! 🎶',
    '⭐ Essa festa vai ficar na história! ⭐',
    '🍹 Faça seus drinks preferidos! 🍹',
    '🎉 Confirmou? Agora é oficial! 🎉',
];

// ========================================
// COUNTDOWN TIMER
// ========================================

function updateCountdown() {
    const now = new Date().getTime();
    const eventTime = EVENT_DATE.getTime();
    const distance = eventTime - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        const countdownSection = document.getElementById('countdownSection');
        if (countdownSection) {
            const label = countdownSection.querySelector('.countdown-label');
            if (label) label.textContent = 'O evento está acontecendo agora! 🎉';
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ========================================
// ROTAÇÃO DE FRASES ENGRAÇADAS
// ========================================

function rotateQuotes() {
    const quoteContainer = document.getElementById('quoteContainer');
    if (!quoteContainer) return;
    
    const currentIndex = Math.floor(Math.random() * FUNNY_QUOTES.length);
    
    quoteContainer.style.animation = 'none';
    setTimeout(() => {
        quoteContainer.textContent = '';
        const p = document.createElement('p');
        p.className = 'quote';
        p.textContent = FUNNY_QUOTES[currentIndex];
        quoteContainer.appendChild(p);
        quoteContainer.style.animation = 'fadeIn 1s ease-in-out';
    }, 300);
}

setInterval(rotateQuotes, 10000);

// ========================================
// FORMULÁRIO E INTEGRAÇÃO COM SHEETS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const newResponseBtn = document.getElementById('newResponseBtn');
    const companionsInput = document.getElementById('companions');
    const minusBtn = document.getElementById('minusBtn');
    const plusBtn = document.getElementById('plusBtn');

    // Controle de acompanhantes
    if (minusBtn && companionsInput) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = parseInt(companionsInput.value) || 0;
            if (current > 0) {
                companionsInput.value = current - 1;
            }
        });
    }

    if (plusBtn && companionsInput) {
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = parseInt(companionsInput.value) || 0;
            if (current < 10) {
                companionsInput.value = current + 1;
            }
        });
    }

    // Envio do formulário
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');
            const attendingInput = document.querySelector('input[name="attending"]:checked');

            const radioGroup = form.querySelector('.radio-group');

            const existingError = form.querySelector('.radio-error-msg');
            if (existingError) existingError.remove();
            if (radioGroup) radioGroup.classList.remove('radio-error');
            
            if (!attendingInput) {
                if (radioGroup) {
                    radioGroup.classList.add('radio-error');
            
                    const errorMsg = document.createElement('p');
                    errorMsg.className = 'radio-error-msg';
                    errorMsg.innerHTML = '👆 Clica em uma das opções acima antes de confirmar!';
                    radioGroup.insertAdjacentElement('afterend', errorMsg);
            
                    radioGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
                    setTimeout(() => {
                        radioGroup.classList.remove('radio-error');
                        errorMsg.remove();
                    }, 5000);
                }
                return;
            }
            
            if (!nameInput || !nameInput.value.trim()) {
                alert('Por favor, preenche seu nome! 😊');
                return;
            }

            // Coleta dados
            const formData = {
                timestamp: new Date().toLocaleString('pt-BR'),
                name: nameInput.value.trim(),
                attending: attendingInput.value,
                companions: companionsInput ? parseInt(companionsInput.value) || 0 : 0,
                message: messageInput ? messageInput.value.trim() : '',
            };

            // Validação básica
            if (!formData.name) {
                alert('Por favor, preenche seu nome! 😊');
                return;
            }

            // Mostrar loading
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            try {
                // Enviar para Google Sheets
                await sendToGoogleSheets(formData);

                // Mostrar mensagem de sucesso
                showSuccessMessage(formData, successMessage);

                // Resetar form
                form.reset();
                if (companionsInput) companionsInput.value = '0';

                // Recarregar dados após 2 segundos
                setTimeout(() => {
                    loadAndDisplayData();
                }, 2000);

            } catch (error) {
                console.error('Erro ao enviar:', error);
                alert('Houve um erro ao confirmar sua presença. Tenta novamente! 😅');
            } finally {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Voltar para novo envio
    if (newResponseBtn && successMessage) {
        newResponseBtn.addEventListener('click', () => {
            successMessage.classList.remove('show');
        });
    }

    // Carregar dados iniciais
    loadAndDisplayData();
    
    // Atualizar dados a cada 5 segundos
    setInterval(loadAndDisplayData, 5000);
});

// ========================================
// GOOGLE SHEETS INTEGRATION
// ========================================

async function sendToGoogleSheets(data) {
    console.log('Enviando dados...', data);
    
    if (!GOOGLE_SCRIPT_POST_URL) {
        console.warn('Google Script URL não configurada.');
        return;
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_POST_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('Dados enviados para Google Sheets');
    } catch (error) {
        console.error('Erro ao enviar para Sheets:', error);
    }
}

function showSuccessMessage(data, successMessage) {
    if (!successMessage) return;
    
    const successText = document.getElementById('successText');
    
    if (successText) {
        successText.textContent = 'Sua presença foi anotada! O casal ficou feliz!';
    }
    
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 10000);
}

// ========================================
// BUSCAR DADOS DA PLANILHA
// ========================================

async function loadAndDisplayData() {
    try {
        // Buscar dados da planilha
        const response = await fetch(GOOGLE_SCRIPT_GET_URL + '?action=getData');
        const result = await response.json();

        console.log('Dados carregados:', result);

        if (result.success && result.data) {
            updateStats(result.data);
            displayMessages(result.data);
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// ========================================
// ATUALIZAR ESTATÍSTICAS
// ========================================

function updateStats(responses) {
    const confirmed = responses.filter(r => r.attending === 'Confirmado').length;
    const unconfirmed = responses.filter(r => r.attending === 'Não Confirmado').length;
    const maybe = responses.filter(r => r.attending === 'Talvez').length;

    const confirmedEl = document.getElementById('confirmedCount');
    const unconfirmedEl = document.getElementById('unconfirmedCount');
    const maybeEl = document.getElementById('maybeCount');

    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (unconfirmedEl) unconfirmedEl.textContent = unconfirmed;
    if (maybeEl) maybeEl.textContent = maybe;

    console.log(`Stats: Confirmados=${confirmed}, Não Confirmados=${unconfirmed}, Talvez=${maybe}`);
}

// ========================================
// EXIBIR MENSAGENS (RECADINHOS)
// ========================================

function displayMessages(responses) {
    const messagesWithText = responses.filter(r => r.message && String(r.message).trim());
    const container = document.getElementById('messagesContainer');

    if (!container) return;

    if (messagesWithText.length === 0) {
        container.innerHTML = '<div class="no-messages"><p>Ainda ninguém deixou recado... Seja o primeiro! 😊</p></div>';
        return;
    }

    container.innerHTML = messagesWithText.map((response, index) => `
        <div class="message-card" style="animation-delay: ${index * 0.1}s">
            <div class="message-header">
                <span class="message-name">${escapeHtml(String(response.name))}</span>
                <span class="message-status">${escapeHtml(String(response.attending))}</span>
            </div>
            <p class="message-text">"${escapeHtml(String(response.message))}"</p>
        </div>
    `).join('');

    console.log(`${messagesWithText.length} mensagens exibidas`);
}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Site do aniversário carregado com sucesso!');
    console.log('📱 Responsivo em todos os dispositivos');
    console.log('📊 Buscando dados da planilha...');
});

// ========================================
// VERIFICAR CONEXÃO
// ========================================

window.addEventListener('online', () => {
    console.log('Conexão restaurada! Sincronizando dados...');
    loadAndDisplayData();
});
