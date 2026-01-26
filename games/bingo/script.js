let ultimos = [];


const letras = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 }
};

let numerosDisponiveis = [];
let sorteados = [];

// inicializa números
function inicializar() {
  numerosDisponiveis = [];
  sorteados = [];

  Object.keys(letras).forEach(letra => {
    for (let i = letras[letra].min; i <= letras[letra].max; i++) {
      numerosDisponiveis.push({ letra, numero: i });
    }
  });

  criarPainel();
  document.getElementById("numero").textContent = "00";
  document.getElementById("letra").textContent = "P";
}

// cria números na tela (1–15 por linha)
function criarPainel() {
  Object.keys(letras).forEach(letra => {
    const linha = document.getElementById(`linha-${letra}`);
    linha.innerHTML = "";

    for (let i = letras[letra].min; i <= letras[letra].max; i++) {
      const div = document.createElement("div");
      div.className = "numero";
      div.textContent = i;
      div.dataset.numero = i;
      linha.appendChild(div);
    }
  });
}

// sorteio
function sortear() 
{

  
  if (!numerosDisponiveis.length) {
    alert("Todos os números já foram sorteados");
    return;

    
  }

  const index = Math.floor(Math.random() * numerosDisponiveis.length);
  const sorteado = numerosDisponiveis.splice(index, 1)[0];
  sorteados.push(sorteado);

  const { letra, numero } = sorteado;

  // topo
  const topoNumero = document.getElementById("numero");
  const topoLetra = document.getElementById("letra");

  topoNumero.textContent = numero;
  topoLetra.textContent = letra;

  topoNumero.classList.add("animado-topo");
  topoLetra.classList.add("animado-topo");

  setTimeout(() => {
    topoNumero.classList.remove("animado-topo");
    topoLetra.classList.remove("animado-topo");
  }, 600);

  // guarda os ultimos numeros
  
ultimos.unshift(numero);
if (ultimos.length > 3) ultimos.pop();

const minis = document.querySelectorAll(".bola-mini");
minis.forEach((b, i) => {
  b.textContent = ultimos[i] || "–";
});


  // marca no painel
  document.querySelectorAll(".numero").forEach(el => {
    if (parseInt(el.textContent) === numero) {
      el.classList.add("sorteado", "animado");
      setTimeout(() => el.classList.remove("animado"), 600);
    }
  });
}

// botões
document.getElementById("sortear").addEventListener("click", sortear);

document.getElementById("reiniciar").addEventListener("click", inicializar);

document.getElementById("voltar").addEventListener("click", () => {
  window.location.href = "../index.html";
});

// start
inicializar();
