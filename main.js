document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos elementos HTML ---
    const campoSenha = document.getElementById('campo-senha');
    const botaoCopiar = document.getElementById('botao-copiar');
    const botaoDiminuir = document.getElementById('botao-diminuir');
    const botaoAumentar = document.getElementById('botao-aumentar');
    const contadorCaracteres = document.getElementById('contador-caracteres');

    const checkboxMaiusculo = document.getElementById('checkbox-maiusculo');
    const checkboxMinusculo = document.getElementById('checkbox-minusculo');
    const checkboxNumero = document.getElementById('checkbox-numero');
    const checkboxSimbolo = document.getElementById('checkbox-simbolo');
    const checkboxMinimoUm = document.getElementById('checkbox-minimo-um');
    const checkboxEvitarRepeticao = document.getElementById('checkbox-evitar-repeticao');
    const checkboxExcluirSimilares = document.getElementById('checkbox-excluir-similares');
    const checkboxExcluirPersonalizado = document.getElementById('checkbox-excluir-personalizado');
    const campoCaracteresExcluidos = document.getElementById('campo-caracteres-excluidos');

    const barraForca = document.getElementById('barra-forca');
    const valorEntropia = document.getElementById('valor-entropia');
    const tempoQuebraEstimado = document.getElementById('tempo-quebra-estimado');
    const textoFeedbackForca = document.getElementById('texto-feedback-forca');

    // --- Conjuntos de Caracteres ---
    const caracteresMaiusculos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const caracteresMinusculos = 'abcdefghijklmnopqrstuvwxyz';
    const caracteresNumeros = '0123456789';
    const caracteresSimbolos = '!@#$%^&*()_+[]{}|;:,.<>?'; // Símbolos comuns
    const caracteresSimilares = 'il1oO0'; // Caracteres facilmente confundíveis

    let comprimentoSenha = parseInt(contadorCaracteres.textContent);

    // --- Funções Auxiliares ---

    // Função para obter um caractere aleatório de uma string
    function getRandomChar(charSet) {
        if (!charSet || charSet.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * charSet.length);
        return charSet[randomIndex];
    }

    // Função para calcular a entropia
    function calcularEntropia(length, charsetSize) {
        if (length === 0 || charsetSize === 0) return 0;
        return length * Math.log2(charsetSize);
    }

    // Função para estimar o tempo de quebra
    // Baseado em 1 bilhão (10^9) tentativas por segundo
    function estimarTempoQuebra(bits) {
        if (bits < 1) return 'Instantâneo';

        const attemptsPerSecond = 1e9; // 1 bilhão de tentativas por segundo
        const totalAttempts = Math.pow(2, bits);
        const seconds = totalAttempts / attemptsPerSecond;

        if (seconds < 60) {
            return `${Math.round(seconds)} segundo(s)`;
        } else if (seconds < 3600) {
            return `${Math.round(seconds / 60)} minuto(s)`;
        } else if (seconds < 86400) {
            return `${Math.round(seconds / 3600)} hora(s)`;
        } else if (seconds < 31536000) { // 365 dias
            return `${Math.round(seconds / 86400)} dia(s)`;
        } else if (seconds < 31536000000) { // 1000 anos
            return `${Math.round(seconds / 31536000)} ano(s)`;
        } else {
            return `Mais de ${Math.round(seconds / 31536000000)} milhão(ões) de anos`;
        }
    }

    // Função para atualizar a barra de força e o feedback
    function atualizarForcaSenha(entropiaBits) {
        let larguraBarra = 0;
        let corBarra = '';
        let feedbackTexto = '';
        let nivelForcaClasse = ''; // Para remover classes anteriores

        if (entropiaBits < 28) {
            larguraBarra = 20;
            corBarra = 'var(--cor-muito-fraca)';
            feedbackTexto = 'Muito fraca! Fácil de quebrar.';
            nivelForcaClasse = 'muito-fraca';
        } else if (entropiaBits < 36) {
            larguraBarra = 40;
            corBarra = 'var(--cor-fraca)';
            feedbackTexto = 'Fraca. Considere adicionar mais caracteres.';
            nivelForcaClasse = 'fraca';
        } else if (entropiaBits < 60) {
            larguraBarra = 60;
            corBarra = 'var(--cor-razoavel)';
            feedbackTexto = 'Razoável. Bom começo, mas pode melhorar.';
            nivelForcaClasse = 'razoavel';
        } else if (entropiaBits < 80) {
            larguraBarra = 80;
            corBarra = 'var(--cor-boa)';
            feedbackTexto = 'Boa! Uma senha sólida.';
            nivelForcaClasse = 'boa';
        } else if (entropiaBits < 128) {
            larguraBarra = 90;
            corBarra = 'var(--cor-forte)';
            feedbackTexto = 'Forte! Extremamente difícil de quebrar.';
            nivelForcaClasse = 'forte';
        } else {
            larguraBarra = 100;
            corBarra = 'var(--cor-muito-forte)';
            feedbackTexto = 'Excelente! Sua senha é altamente segura.';
            nivelForcaClasse = 'muito-forte';
        }

        barraForca.style.width = `${larguraBarra}%`;
        // Remove todas as classes de força antes de adicionar a nova
        barraForca.classList.remove('muito-fraca', 'fraca', 'razoavel', 'boa', 'forte', 'muito-forte');
        barraForca.classList.add(nivelForcaClasse);
        barraForca.style.backgroundColor = corBarra; // Garante a cor, mas a classe é mais consistente

        textoFeedbackForca.textContent = feedbackTexto;
        valorEntropia.textContent = `${entropiaBits.toFixed(2)} bits`;
        tempoQuebraEstimado.textContent = estimarTempoQuebra(entropiaBits);
    }

    // --- Função Principal de Geração de Senha ---
    function gerarSenha() {
        let caracteresDisponiveis = '';
        let caracteresObrigatorios = [];
        let conjuntoDeCaracteresTotal = 0; // Para cálculo da entropia

        // Constrói o conjunto de caracteres disponíveis e obrigatórios
        if (checkboxMaiusculo.checked) {
            caracteresDisponiveis += caracteresMaiusculos;
            caracteresObrigatorios.push(caracteresMaiusculos);
            conjuntoDeCaracteresTotal += caracteresMaiusculos.length;
        }
        if (checkboxMinusculo.checked) {
            caracteresDisponiveis += caracteresMinusculos;
            caracteresObrigatorios.push(caracteresMinusculos);
            conjuntoDeCaracteresTotal += caracteresMinusculos.length;
        }
        if (checkboxNumero.checked) {
            caracteresDisponiveis += caracteresNumeros;
            caracteresObrigatorios.push(caracteresNumeros);
            conjuntoDeCaracteresTotal += caracteresNumeros.length;
        }
        if (checkboxSimbolo.checked) {
            caracteresDisponiveis += caracteresSimbolos;
            caracteresObrigatorios.push(caracteresSimbolos);
            conjuntoDeCaracteresTotal += caracteresSimbolos.length;
        }

        // Aplica exclusões
        let caracteresFinaisDisponiveis = caracteresDisponiveis;
        if (checkboxExcluirSimilares.checked) {
            caracteresFinaisDisponiveis = caracteresFinaisDisponiveis
                .split('')
                .filter(char => !caracteresSimilares.includes(char))
                .join('');
        }
        if (checkboxExcluirPersonalizado.checked && campoCaracteresExcluidos.value) {
            const excluidosPersonalizados = campoCaracteresExcluidos.value;
            caracteresFinaisDisponiveis = caracteresFinaisDisponiveis
                .split('')
                .filter(char => !excluidosPersonalizados.includes(char))
                .join('');
        }

        if (caracteresFinaisDisponiveis.length === 0 || comprimentoSenha === 0) {
            campoSenha.value = '';
            atualizarForcaSenha(0);
            return;
        }

        let senhaGerada = '';
        let ultimoChar = '';
        let charsRestantes = comprimentoSenha;

        // Garante pelo menos um de cada tipo selecionado, se a opção estiver marcada
        if (checkboxMinimoUm.checked) {
            caracteresObrigatorios.forEach(charSet => {
                if (charsRestantes > 0) {
                    let charToAdd = getRandomChar(charSet);
                    // Evita repetição imediata para caracteres obrigatórios se a opção estiver ativada
                    if (checkboxEvitarRepeticao.checked && charToAdd === ultimoChar && charSet.length > 1) {
                         // Tenta pegar um diferente se possível
                        let attempts = 0;
                        while (charToAdd === ultimoChar && attempts < 10) { // Limita tentativas para evitar loop infinito
                            charToAdd = getRandomChar(charSet);
                            attempts++;
                        }
                    }
                    senhaGerada += charToAdd;
                    ultimoChar = charToAdd;
                    charsRestantes--;
                }
            });
        }

        // Preenche o restante da senha
        for (let i = 0; i < charsRestantes; i++) {
            let charToAdd = getRandomChar(caracteresFinaisDisponiveis);
            if (checkboxEvitarRepeticao.checked) {
                let attempts = 0;
                while (charToAdd === ultimoChar && caracteresFinaisDisponiveis.length > 1 && attempts < 100