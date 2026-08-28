// ============================================================
// LANYARD — Discord Rich Presence
// ============================================================

// 👇 COLOQUE SEU ID DO DISCORD AQUI
const SEU_DISCORD_ID = "1528303769392124075";

const iconesStatus = {
  online:  "assets/icons/status/online.png",
  idle:    "assets/icons/status/inactive.png",
  dnd:     "assets/icons/status/busy.png",
  offline: "assets/icons/status/offline.png"
};

function atualizarTela(dados) {
  const spotify = dados.spotify;
  const atividades = dados.activities;
  const usuario = dados.discord_user;

  // 1. Ícone de status
  const iconeStatus = document.getElementById("discord-status-icon");
  if (iconeStatus) iconeStatus.src = iconesStatus[dados.discord_status] || iconesStatus.offline;

  // 2. ✅ NOME REAL DA CONTA
  const nomeUsuario = document.getElementById("discord-username");
  if (nomeUsuario) {
    nomeUsuario.textContent = usuario.username;
  }

  // ✅ 3. LÓGICA CORRIGIDA: JOGO > MÚSICA
  const textoAtividade = document.getElementById("discord-activity");
  if (textoAtividade) {
    let texto = "";

    // FILTRA: ignora Spotify nas atividades (para não duplicar)
    const atividadesReais = atividades ? atividades.filter(a => a.type !== 2) : [];

    // 1º PRIORIDADE: Jogo / Atividade real
    if (atividadesReais.length > 0) {
      const tipo = ["Jogando", "Transmitindo", "", "Assistindo", "", "Competindo"];
      const atv = atividadesReais[0];
      const nomeTipo = tipo[atv.type] || "";
      texto = `${nomeTipo} ${atv.name}`.trim();
    }
    // 2º PRIORIDADE: Se não estiver jogando, mostra música
    else if (spotify) {
      texto = `Ouvindo: ${spotify.song} — ${spotify.artist}`;
    }
    // Sem nada: mostra status simples
    else {
      const nomes = { online: "Online", idle: "Ausente", dnd: "Não perturbe", offline: "Offline" };
      texto = nomes[dados.discord_status] || dados.discord_status;
    }

    textoAtividade.textContent = texto;
  }

  // 4. Foto do perfil
  const fotoDiscord = document.getElementById("discord-avatar");
  if (fotoDiscord && usuario.avatar) {
    fotoDiscord.src = `https://cdn.discordapp.com/avatars/${usuario.id}/${usuario.avatar}.png`;
  }

  // 5. Widget do Spotify (sempre aparece se estiver ouvindo)
  atualizarSpotify(spotify);
}

let widgetJaFoiCriado = false;

function atualizarSpotify(spotify) {
  let widget = document.getElementById("spotify-widget");

  if (!widget && !widgetJaFoiCriado) {
    widgetJaFoiCriado = true;
    widget = document.createElement("div");
    widget.id = "spotify-widget";
    widget.style.cssText = "margin-top:12px;padding:10px;background:rgba(30,215,96,.08);border:1px solid rgba(30,215,96,.15);border-radius:10px;display:none;";
    widget.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <img id="spotify-capa" style="width:44px;height:44px;border-radius:6px">
        <div style="flex:1;min-width:0">
          <div id="spotify-musica" style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
          <div id="spotify-artista" style="font-size:10px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
      </div>`;
    const local = document.getElementById("discord-presence");
    if (local) local.parentNode.insertBefore(widget, local.nextSibling);
  }

  widget = document.getElementById("spotify-widget");
  if (!widget) return;

  if (spotify) {
    widget.style.display = "block";
    document.getElementById("spotify-capa").src = spotify.album_art_url;
    document.getElementById("spotify-musica").textContent = spotify.song;
    document.getElementById("spotify-artista").textContent = spotify.artist;
  } else {
    widget.style.display = "none";
  }
}

function tentarConectar() {
  fetch(`https://api.lanyard.rest/v1/users/${SEU_DISCORD_ID}`)
    .then(resposta => resposta.json())
    .then(dados => {
      if (dados.success) {
        atualizarTela(dados.data);
      }
    })
    .catch(erro => console.error("❌ Erro:", erro));
}

window.onload = () => {
  if (SEU_DISCORD_ID === "COLOQUE_SEU_ID_AQUI") {
    alert("⚠️ COLOQUE SEU ID NO CÓDIGO!");
    return;
  }
  tentarConectar();
  setInterval(tentarConectar, 30000);
};