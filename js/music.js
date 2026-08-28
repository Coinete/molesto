// ============================================================
// 🎵 MÚSICA DE FUNDO (invisível)
// Toca automaticamente quando clicar na tela de entrada
// ============================================================

let indiceAtual = 0;
let audio = new Audio();
let iniciado = false;

// Inicializa (não toca ainda — espera o clique)
function iniciarMusica() {
  if (CONFIG_MUSICA.embaralhar) embaralharMusicas();
  
  audio.volume = CONFIG_MUSICA.volumeInicial;
  audio.loop = false;
  
  // Quando acabar uma música, vai para a próxima
  audio.addEventListener('ended', proximaMusica);
  
  // Carrega a primeira música na memória
  carregarMusica(indiceAtual);
}

function embaralharMusicas() {
  for (let i = MUSICAS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [MUSICAS[i], MUSICAS[j]] = [MUSICAS[j], MUSICAS[i]];
  }
}

function carregarMusica(indice) {
  if (indice < 0 || indice >= MUSICAS.length) return;
  indiceAtual = indice;
  audio.src = MUSICAS[indiceAtual].arquivo;
}

function tocarMusica() {
  if (iniciado) return; // Evita tocar duas vezes
  iniciado = true;
  
  audio.play().catch(() => {
    console.log("⚠️ Navegador bloqueou a música — tente clicar novamente");
  });
}

function pausarMusica() {
  audio.pause();
  iniciado = false;
}

function proximaMusica() {
  let proximo = indiceAtual + 1;
  if (proximo >= MUSICAS.length) {
    proximo = CONFIG_MUSICA.repetirTudo ? 0 : indiceAtual;
  }
  carregarMusica(proximo);
  if (iniciado) audio.play();
}

// Inicia a preparação quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarMusica);