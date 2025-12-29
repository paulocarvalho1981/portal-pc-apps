// =======================
// CONFIGURAÇÕES DO BINGO
// =======================
const ranges = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75]
};

const sorteados = new Set();

// =======================
// GERAR NÚMEROS NA TELA
// =======================
function gerarNumeros() {
  for (let letra in ranges) {
    const linha = document.getElementById("linha-" + letra);
    const [inicio, fim] = ranges[letra];

    linha.innerHTML = ""; // segurança

    for (let i = inicio; i <= fim; i++) {
      const div = document.createElement("div");
      div.className = "numero";
      div.id = "num-" + i;
      div.textContent = i;
      linha.appendChild(div);
    }
  }
}

// =======================
// SORTEIO
// =======================
function sortearNumero() {
  if (sorteados.size === 75) {
    alert("Todos os números já foram sorteados.");
    return;
  }

  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (sorteados.has(num));

  sorteados.add(num);

  const letra = obterLetra(num);

  const topoNumero = document.getElementById("numero");
  const topoLetra = document.getElementById("letra");

  topoNumero.textContent = num;
  topoLetra.textContent = letra;

  // anima topo
  topoNumero.classList.remove("animado-topo");
  topoLetra.classList.remove("animado-topo");
  void topoNumero.offsetWidth;
  void topoLetra.offsetWidth;
  topoNumero.classList.add("animado-topo");
  topoLetra.classList.add("animado-topo");

  // anima número
  const el = document.getElementById("num-" + num);
  el.classList.add("sorteado", "animado");

  setTimeout(() => {
    el.classList.remove("animado");
  }, 600);

  // voz opcional
  if (document.getElementById("vozAtiva").checked) {
    falar(letra, num);
  }
}

// =======================
// LETRA CORRESPONDENTE
// =======================
function obterLetra(num) {
  for (let l in ranges) {
    if (num >= ranges[l][0] && num <= ranges[l][1]) {
      return l;
    }
  }
}

// =======================
// VOZ
// =======================
function falar(letra, numero) {
  const msg = new SpeechSynthesisUtterance(
    `Letra ${letra}, número ${numero}`
  );
  msg.lang = "pt-BR";
  speechSynthesis.speak(msg);
}

// =======================
// INICIALIZAÇÃO SEGURA
// =======================
document.addEventListener("DOMContentLoaded", () => {

  gerarNumeros();

  document
    .getElementById("sortear")
    .addEventListener("click", sortearNumero);

});
document.getElementById("voltar").addEventListener("click", () => {
  window.location.href = "../index.html";
});
