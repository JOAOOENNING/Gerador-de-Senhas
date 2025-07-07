// --- Elementos HTML ---
const campoSenha = document.getElementById('campo-senha');
const contadorCaracteres = document.getElementById('contador-caracteres');
const botaoDiminuir = document.getElementById('botao-diminuir');
const botaoAumentar = document.getElementById('botao-aumentar');
const botaoCopiar = document.getElementById('botao-copiar');

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

// --- Conjuntos de Caracteres ---
const caracteres = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
};

const caracteresSimilares = 'il1oO0'; // Caracteres que podem ser confundidos

// --- Variáveis de Estado ---
let comprimentoSenha = 12; // Valor inicial

// --- Funções ---

/**
 * Atualiza o contador de caracteres na interface.
 */
function atualizarContadorCaracteres() {
    contadorCaracteres.textContent = comprimentoSenha;
    gerarSenha(); // Gera nova senha sempre que o comprimento muda
}

/**
 * Gera uma senha com base nas opções selecionadas.
 */
function gerarSenha() {
    let caracteresDisponiveis = '';
    let senhaGerada = '';
    let poolDeCaracteres = ''; // Pool total de caracteres para cálculo de entropia

    // Adiciona caracteres com base nas checkboxes
    if (checkboxMaiusculo.checked) {
        caracteresDisponiveis += caracteres.maiusculas;
        poolDeCaracteres += caracteres.maiusculas;
    }
    if (checkboxMinusculo.checked) {
        caracteresDisponiveis += caracteres.minusculas;
        poolDeCaracteres += caracteres.minusculas;
    }
    if (checkboxNumero.checked) {
        caracteresDisponiveis += caracteres.numeros;
        poolDeCaracteres += caracteres.numeros;
    }
    if (checkboxSimbolo.checked) {
        caracteresDisponiveis += caracteres.simbolos;
        poolDeCaracteres += caracteres.simbolos;
    }

    // --- Aplicar Opções Avançadas ---

    // Excluir caracteres similares
    if (checkboxExcluirSimilares.checked) {
        for (const char of caracteresSimilares) {
            caracteresDisponiveis = caracteresDisponiveis.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            poolDeCaracteres = poolDeCaracteres.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        }
    }

    // Excluir caracteres personalizados
    if (checkboxExcluirPersonalizado.checked && campoCaracteresExcluidos.value) {
        const excluidos = campoCaracteresExcluidos.value;
        for (const char of excluidos) {
            caracteresDisponiveis = caracteresDisponiveis.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            poolDe