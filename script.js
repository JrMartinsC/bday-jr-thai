// ========================================
// CONFIGURAÇÕES E CONSTANTES
// ========================================

// DATA DO EVENTO (16 de Maio, 17h)
// Ajuste o ano se necessário
const EVENT_DATE = new Date(2026, 4, 16, 17, 0, 0);

// URL do seu Google Apps Script (será preenchido depois)
// Formato: https://script.google.com/macros/d/SEU_SCRIPT_ID/userweb?v=1
const GOOGLE_SCRIPT_URL = ''; // SERÁ PREENCHIDO APÓS CRIAR O GAS

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
        // Evento já aconteceu
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        const countdownSection = document.getElementById('countdownSection');
        const label = countdownSection.querySelector('.countdown-label');
        label.textContent = 'O evento está acontecendo agora! 🎉';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Atualizar countdown a cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Primeira atualização imediata

// ========================================
// ROTAÇÃO DE FRASES ENGRAÇADAS
// ========================================

function rotateQuotes() {
    const quoteContainer = document.getElementById('quoteContainer');
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

// Rotacionar frases a cada 10 segundos
setInterval(rotateQuotes, 10000);

// ========================================
// FORMULÁRIO E INTEGRAÇÃO COM SHEETS
// ========================================

const form = document.getElementById('confirmForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const newResponseBtn = document.getElementById('newResponseBtn');
const companionsInput = document.getElementById('companions');
const minusBtn = document.getElementById('minusBtn');
const plusBtn = document.getElementById('plusBtn');

// Controle de acompanhantes
minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const current = parseInt(companionsInput.value) || 0;
    if (current > 0) {
        companionsInput.value = current - 1;
    }
});

plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const current = parseInt(companionsInput.value) || 0;
    if (current < 10) {
        companionsInput.value = current + 1;
    }
});

// Envio do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Coleta dados
    const formData = {
        timestamp: new Date().toLocaleString('pt-BR'),
        name: document.getElementById('name').value.trim(),
        attending: document.querySelector('input[name="attending"]:checked').value,
        companions: parseInt(companionsInput.value) || 0,
        message: document.getElementById('message').value.trim(),
    };

    // Validação básica
    if (!formData.name) {
        alert('Por favor, preenche seu nome! 😊');
        return;
    }

    // Mostrar loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Enviar para Google Sheets
        await sendToGoogleSheets(formData);

        // Mostrar mensagem de sucesso
        showSuccessMessage(formData);

        // Resetar form
        form.reset();
        companionsInput.value = '0';
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('Houve um erro ao confirmar sua presença. Tenta novamente! 😅');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Enviar dados para Google Apps Script
async function sendToGoogleSheets(data) {
    if (!GOOGLE_SCRIPT_URL) {
        console.warn('Google Script URL não configurada. Usando localStorage como fallback.');
        // Fallback: salvar em localStorage
        saveToLocalStorage(data);
        return;
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data),
        });

        // Com no-cors não conseguimos ler a resposta, então confiamos que foi enviado
        console.log('Dados enviados para Google Sheets');
        
        // Também salvar localmente como backup
        saveToLocalStorage(data);
    } catch (error) {
        console.error('Erro ao enviar para Sheets:', error);
        // Fallback para localStorage
        saveToLocalStorage(data);
    }
}

// Fallback: Salvar em localStorage
function saveToLocalStorage(data) {
    let responses = JSON.parse(localStorage.getItem('confirmacoes') || '[]');
    responses.push(data);
    localStorage.setItem('confirmacoes', JSON.stringify(responses));
    console.log('Dados salvos em localStorage');
}

// Mostrar mensagem de sucesso
function showSuccessMessage(data) {
    const successText = document.getElementById('successText');
    const totalGuests = parseInt(data.companions) + 1;
    
    let mensaje = `Confirmado, ${data.name}! `;
    if (data.attending === 'Confirmado') {
        mensaje += totalGuests === 1 
            ? 'Te aguardamos! 😎'
            : `Você + ${data.companions} acompanhante${data.companions !== 1 ? 's' : ''}. Que show! 🎉`;
    } else if (data.attending === 'Talvez') {
        mensaje += 'Tá na dúvida, mas tá bom! Avisa depois, não deixa pra última! 😊';
    } else {
        mensaje += 'Que pena, mas tudo bem! Fica para a próxima! 💔';
    }

    successText.textContent = 'Sua presença foi anotada! O casal ficou feliz!';
    
    successMessage.classList.add('show');
    
    // Fechar após 3 segundos automaticamente
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Voltar para novo envio
newResponseBtn.addEventListener('click', () => {
    successMessage.classList.remove('show');
});

// ========================================
// CARREGAR DADOS DO LOCALSTORAGE
// ========================================

function loadAndDisplayData() {
    const responses = JSON.parse(localStorage.getItem('confirmacoes') || '[]');
    
    updateStats(responses);
    displayMessages(responses);
}

// Atualizar estatísticas
function updateStats(responses) {
    const confirmed = responses.filter(r => r.attending === 'Confirmado').length;
    const unconfirmed = responses.filter(r => r.attending === 'Não Confirmado').length;
    const maybe = responses.filter(r => r.attending === 'Talvez').length;
    const guests = responses.reduce((sum, r) => sum + (parseInt(r.companions) || 0), 0);

    document.getElementById('confirmedCount').textContent = confirmed;
    document.getElementById('unconfirmedCount').textContent = unconfirmed;
    document.getElementById('maybeCount').textContent = maybe;
    document.getElementById('guestCount').textContent = guests;
}

// Exibir mensagens
function displayMessages(responses) {
    const messagesWithText = responses.filter(r => r.message && r.message.trim());
    const container = document.getElementById('messagesContainer');

    if (messagesWithText.length === 0) {
        container.innerHTML = '<div class="no-messages"><p>Ainda ninguém deixou recado... Seja o primeiro! 😊</p></div>';
        return;
    }

    container.innerHTML = messagesWithText.map((response, index) => `
        <div class="message-card" style="animation-delay: ${index * 0.1}s">
            <div class="message-header">
                <span class="message-name">${escapeHtml(response.name)}</span>
                <span class="message-status">${response.attending}</span>
            </div>
            <p class="message-text">"${escapeHtml(response.message)}"</p>
        </div>
    `).join('');
}

// Escape HTML para segurança
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Carregar dados ao iniciar
loadAndDisplayData();

// Recarregar dados a cada 30 segundos (simulando sincronização com Sheets)
setInterval(loadAndDisplayData, 30000);

// ========================================
// COMPARTILHAMENTO
// ========================================

const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    const text = encodeURIComponent(
        `🎉 Vem conferir meu convite B-day Jr e Thai! Churrasco, pagode, família, resenha... tá na conta! 🔥\n\nConfirma tua presença aqui: ${url}`
    );

    // Tentar usar Web Share API (mobile)
    if (navigator.share) {
        navigator.share({
            title: 'Aniversário do Jr e Thai',
            text: 'Vem conferir meu convite! Churrasco, pagode, família, resenha... tá na conta! 🔥',
            url: url,
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        // Fallback: Abrir WhatsApp
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    }
});

// ========================================
// DETECÇÃO DE TEMA E DARK MODE
// ========================================

// Detectar preferência do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // O usuário prefere dark mode, mas nosso site é otimizado para light
    // Você pode adicionar suporte a dark mode aqui se desejar
}

// ========================================
// ANIMAÇÕES NA ENTRADA
// ========================================

// Animar elementos conforme entram no viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.style.animation;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Site do aniversário carregado com sucesso!');
    console.log('📱 Responsivo em todos os dispositivos');
    console.log('📊 Integração com Google Sheets configurável');
});

// ========================================
// VERIFICAR CONEXÃO E SINCRONIZAÇÃO
// ========================================

// Verificar se há dados não sincronizados
window.addEventListener('online', () => {
    console.log('Conexão restaurada! Sincronizando dados...');
    syncPendingData();
});

function syncPendingData() {
    const responses = JSON.parse(localStorage.getItem('confirmacoes') || '[]');
    if (responses.length > 0 && GOOGLE_SCRIPT_URL) {
        console.log('Sincronizando dados com Google Sheets...');
        // Aqui você pode implementar sincronização automática
    }
}

// ========================================
// SUPORTE A PWA (Progressive Web App)
// ========================================

// Registrar service worker se disponível
if ('serviceWorker' in navigator) {
    // Você pode criar um service worker para offline support
    // navigator.serviceWorker.register('sw.js');
}
