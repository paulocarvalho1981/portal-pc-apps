
  const secret = ["n", "a", "n", "a"];
  let input = [];

  window.addEventListener("keydown", e => {
    input.push(e.key.toLowerCase());
    input.splice(-secret.length - 1, input.length - secret.length);

    if (input.join("") === secret.join("")) {
      window.open(
        "https://animesonlinecc.to/anime/nanatsu-no-taizai-hd/",
        "_blank"
      );
      input = [];
    }
  });
  document.addEventListener("DOMContentLoaded", () => {

  const containerOk = document.getElementById("apps-ok");
  const containerJogos = document.getElementById("apps-jogos");

  const cards = document.querySelectorAll(".app-card");

  cards.forEach(card => {
    const tipo = card.dataset.tipo;

    if (tipo === "ok") {
      containerOk.appendChild(card);
    }

    if (tipo === "jogo") {
      containerJogos.appendChild(card);
    }
  });

});
