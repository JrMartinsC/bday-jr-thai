# ✅ CHECKLIST DE TESTES

## 🧪 Testes Obrigatórios Antes de Publicar

### 1. TESTES FUNCIONAIS

#### Desktop (Chrome/Firefox/Safari)
- [ ] Contador regressivo funciona e atualiza
- [ ] Formulário carrega corretamente
- [ ] Pode digitar nos campos
- [ ] Acompanhantes +/- funcionam
- [ ] Botão envio funciona
- [ ] Mensagem de sucesso aparece
- [ ] Página não tem erros de console (F12)

#### Mobile (2 aparelhos diferentes)
- [ ] Site carrega sem bug
- [ ] Texto legível sem zoom
- [ ] Botões tem tamanho adequado (toque)
- [ ] Formulário scrolls normalmente
- [ ] Funciona em portrait e landscape
- [ ] Imagens carregam corretamente

#### Tablet
- [ ] Layout se adapta bem
- [ ] Não há overflow horizontal
- [ ] Elementos não ficam muito pequenos

---

### 2. TESTES DE DESEMPENHO

Ferramentas:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/
- WebPageTest: https://www.webpagetest.org/

Métricas esperadas:
- [ ] Carregamento: < 3 segundos
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

---

### 3. TESTES DE VALIDAÇÃO HTML/CSS

No VS Code:
1. Instale: "HTML Validator" extension
2. Verifique erros em `index.html`

Online:
- HTML: https://validator.w3.org/
- CSS: https://jigsaw.w3.org/css-validator/

Esperado:
- [ ] 0 erros de HTML
- [ ] 0 erros críticos de CSS
- [ ] Avisos são OK (deprecated ou não suportado)

---

### 4. TESTES DE RESPONSIVIDADE

Chrome DevTools (F12 > Toggle Device Toolbar):
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 414px (iPhone 12 Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1920px (Desktop)

Nenhum elemento deve:
- Ficar cortado
- Ultrapassar a tela
- Ficar ilegível
- Ter botões muito pequenos

---

### 5. TESTES DE NAVEGADOR

Compatibilidade:
- [ ] Chrome (versão atual)
- [ ] Firefox (versão atual)
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)

---

### 6. TESTES DE ACESSIBILIDADE

Chrome DevTools > Lighthouse:
1. Clique em "Lighthouse"
2. Selecione "Accessibility"
3. Rode o teste
4. Score esperado: > 90

Verificações manuais:
- [ ] Pode navegar com TAB
- [ ] Botões têm labels descritivos
- [ ] Contraste de cores é suficiente
- [ ] Texto não é muito pequeno
- [ ] Formulário tem `<label>` associados

---

### 7. TESTES DE SEGURANÇA

Verificações:
- [ ] Não há senhas no código
- [ ] Não há chaves de API expostas
- [ ] URLs externas são HTTPS
- [ ] No console: nenhum erro de CORS
- [ ] Inputs sanitizados (contra XSS)

Ferramentas:
- OWASP ZAP: https://www.zaproxy.org/
- Snyk: https://snyk.io/

---

### 8. TESTES DE FORMULÁRIO

#### Validação
- [ ] Campo nome: requer preenchimento
- [ ] Presença: deve selecionar uma opção
- [ ] Acompanhantes: só números
- [ ] Mensagem: opcional (não requer)
- [ ] Envio: mostra loading
- [ ] Sucesso: mostra modal com confete

#### Edge cases
- [ ] Tentar enviar vazio (deve bloquear)
- [ ] Tentar enviar com só espaços (nome inválido)
- [ ] Tentar enviar 2x rápido (debounce funciona?)
- [ ] Mudar companions e voltar (tá certo?)
- [ ] Escrever mensagem muito longa (comportamento ok?)

---

### 9. TESTES DE GOOGLE SHEETS

#### Setup
- [ ] Google Sheets criada
- [ ] Google Apps Script criado
- [ ] URL copiada corretamente
- [ ] Cole no script.js
- [ ] Deploy feito com sucesso

#### Funcionamento
- [ ] Preenche formulário completamente
- [ ] Clica envio
- [ ] Aguarda 5-10 segundos
- [ ] Abre Google Sheets
- [ ] Dados aparecem na aba
- [ ] Pode ver nome, status, acompanhantes, mensagem

#### Fallback
- [ ] Se desconectar internet: localStorage salva
- [ ] Dados volta quando internet volta

---

### 10. TESTES DE COMPARTILHAMENTO

#### WhatsApp
- [ ] Botão "Compartilhar" aparece
- [ ] Clica e abre WhatsApp (ou copia link)
- [ ] Link funciona quando enviado
- [ ] Alguém clica no link e funciona

#### Redes Sociais
- [ ] Link funciona no Instagram bio
- [ ] Link funciona no Twitter
- [ ] Link funciona no Telegram
- [ ] Pré-visualização mostra titulo/descrição legal

#### Copy
- [ ] Mensagem é clara
- [ ] Tem link do evento
- [ ] Tem data e hora
- [ ] Emojis aparecem certo

---

### 11. TESTES DE DADOS (localStorage)

Abrir Console (F12 > Console):
```javascript
// Ver todos os dados salvos
JSON.parse(localStorage.getItem('confirmacoes'))

// Adicionar teste manualmente
localStorage.setItem('confirmacoes', JSON.stringify([
    {
        timestamp: new Date().toLocaleString('pt-BR'),
        name: 'Teste User',
        attending: 'Confirmado',
        companions: 2,
        message: 'Teste'
    }
]));
```

Verificar:
- [ ] Dados salvam em localStorage
- [ ] Dados persistem após refresh
- [ ] Estátisticas atualizam automaticamente
- [ ] Mensagens aparecem na seção correta
- [ ] Contador de presença tá certo

---

### 12. TESTES DE COUNTDOWN

Verificações:
- [ ] Countdown começa com tempo correto
- [ ] Atualiza a cada segundo
- [ ] Tem dia:hora:minuto:segundo
- [ ] Números vão para zero (não negativo)
- [ ] Quando chega no dia, muda mensagem

Para testar antecipadamente:
Edite `script.js`:
```javascript
// Mudar data para 5 minutos atrás
const EVENT_DATE = new Date(Date.now() - 5 * 60 * 1000);
```

---

## 🚀 CHECKLIST PRÉ-DEPLOY

- [ ] Todos os testes acima passaram
- [ ] GitHub repository criado
- [ ] Arquivos fazem push corretamente
- [ ] Vercel/Netlify conectado
- [ ] Deploy automático funciona
- [ ] URL pública funciona
- [ ] Testei a URL com 2 pessoas
- [ ] Ninguém encontrou bugs
- [ ] Google Sheets sincroniza online
- [ ] Pronto pra compartilhar!

---

## 📊 TESTES DE STRESS

Se espera MUITAS respostas (100+):

### Simulação
1. Abra o Console (F12)
2. Cole isto:
```javascript
// Simular 100 confirmações
for (let i = 0; i < 100; i++) {
    const data = {
        timestamp: new Date().toLocaleString('pt-BR'),
        name: `Pessoa ${i + 1}`,
        attending: ['Confirmado', 'Não Confirmado', 'Talvez'][Math.floor(Math.random() * 3)],
        companions: Math.floor(Math.random() * 5),
        message: i % 3 === 0 ? `Mensagem pessoa ${i}` : ''
    };
    let responses = JSON.parse(localStorage.getItem('confirmacoes') || '[]');
    responses.push(data);
    localStorage.setItem('confirmacoes', JSON.stringify(responses));
}
location.reload();
```

Verificar:
- [ ] Site ainda carrega rápido
- [ ] Não congela
- [ ] Estatísticas atualizam
- [ ] Mensagens scrollam corretamente
- [ ] Google Sheets não trava

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### "Contador começa no dia errado"
```javascript
// Procure em script.js a linha:
const EVENT_DATE = new Date(2025, 4, 16, 17, 0, 0);
// Mês: 0=Jan, 1=Fev, ... 4=Maio
// Certifique-se que está correto
```

### "Google Sheets não recebe dados"
1. Verifique console (F12 > Network)
2. Procure por "script.google.com"
3. Se tiver erro CORS: esperado (no-cors)
4. Dados devem estar em localStorage como fallback

### "Botão não funciona em mobile"
1. Limpe cache (Ctrl+Shift+Del)
2. Teste em navegador privado
3. Teste em outro navegador

### "Estilos não carregam"
1. Verifique path do CSS: deve estar no mesmo nível
2. Se no GitHub, verifique branch (deve ser `main`)
3. Aguarde rebuild do Vercel/Netlify (2-3 min)

### "Site tá lento"
1. Comprima imagens (se adicionar)
2. Remova animations que não usa
3. Use Google PageSpeed Insights

---

## ✨ TESTES FINAL

### Simulação Real de Usuário

1. **Você não conhece o site**
   - Peça para amigo testar
   - Ele consegue encontrar tudo?
   - Entende o que fazer?

2. **Teste em rede lenta**
   - Chrome DevTools > Network > Slow 3G
   - Site ainda carrega?
   - Countdown funciona?

3. **Teste em modo offline**
   - DevTools > Offline
   - Formulário tá no localStorage?
   - Dados persistem?

4. **Teste de sensibilidade**
   - Toque muito rápido em botões
   - Tente enviar 2x
   - Tenta clicar durante loading
   - Comportamento esperado?

---

## 📝 TEMPLATE DE BUG REPORT

Se encontrar bug, documente assim:

```
TÍTULO: [Breve descrição do problema]

SEVERIDADE: 🔴 Crítico / 🟡 Médio / 🟢 Baixo

AMBIENTE:
- Navegador: Chrome 120.0
- Dispositivo: iPhone 13
- Sistema: iOS 17.2

PASSOS PARA REPRODUZIR:
1. Acessa o site
2. Preenche nome
3. Clica acompanhantes +
4. Vê o problema

RESULTADO ESPERADO:
Número deveria aumentar

RESULTADO ATUAL:
Número não muda

PRINTS:
[Se possível, inclua print]

CONSOLE LOG:
[F12 > Console, copie qualquer erro]
```

---

## 🎊 SUCESSO!

Se todos os testes passaram, você tá pronto! 🚀

**Última checagem:**
- [ ] URL do site funciona
- [ ] WhatsApp compartilhamento funciona
- [ ] Pessoas conseguem preencher formulário
- [ ] Dados chegam no Google Sheets
- [ ] Estatísticas atualizam
- [ ] Site é bonito em mobile

**Então é isso! Boa festa! 🎉**
