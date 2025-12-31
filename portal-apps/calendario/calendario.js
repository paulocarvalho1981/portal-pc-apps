const calendario = document.getElementById("calendario");
let dataInicial = null;

function gerarCalendario() {
  calendario.innerHTML = "";

  const escala = parseInt(document.getElementById("escala").value);
  const meses = parseInt(document.getElementById("meses").value);

  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  for (let m = 0; m < meses; m++) {
    const dataMes = new Date(inicio.getFullYear(), inicio.getMonth() + m, 1);
    criarMes(dataMes, escala);
  }

  pintarCiclo();
}

function criarMes(dataMes, escala) {
  const mesDiv = document.createElement("div");
  mesDiv.className = "mes";

  const titulo = document.createElement("h2");
  titulo.textContent = dataMes.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });

  const grid = document.createElement("div");
  grid.className = "grid";

// CABEÇALHO DOS DIAS DA SEMANA
const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

diasSemana.forEach(d => {
  const header = document.createElement("div");
  header.className = "dia semana";
  header.textContent = d;
  grid.appendChild(header);
});


  const primeiroDia = new Date(dataMes.getFullYear(), dataMes.getMonth(), 1).getDay();
  const totalDias = new Date(dataMes.getFullYear(), dataMes.getMonth() + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.className = "dia vazio";
    grid.appendChild(vazio);
  }

  for (let d = 1; d <= totalDias; d++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.textContent = d;

    const dataAtual = new Date(dataMes.getFullYear(), dataMes.getMonth(), d);

    dia.addEventListener("click", () => {
      dataInicial = dataAtual;
      gerarCalendario();
    });

    dia.dataset.data = dataAtual.toISOString();
    grid.appendChild(dia);
  }

  mesDiv.appendChild(titulo);
  mesDiv.appendChild(grid);
  calendario.appendChild(mesDiv);
}

function pintarCiclo() {
  if (!dataInicial) return;

  const escala = parseInt(document.getElementById("escala").value);
  const ciclo = escala * 2;
  const dias = document.querySelectorAll(".dia[data-data]");

  dias.forEach(dia => {
    const data = new Date(dia.dataset.data);
    const diff = Math.floor((data - dataInicial) / (1000 * 60 * 60 * 24));

    // limpa classes
    dia.classList.remove("verde", "amarelo", "vermelho");

    if (diff < 0) return;

    const pos = diff % ciclo;

    if (pos === 0) {
      // Embarque
      dia.classList.add("verde");
    } 
    else if (pos > 0 && pos < escala) {
      // Trabalhando
      dia.classList.add("amarelo");
    } 
    else if (pos === escala) {
      // Desembarque (primeiro dia de folga)
      dia.classList.add("vermelho");
    }
    // restante é folga (branco)
  });
}




function limpar() {
  dataInicial = null;
  gerarCalendario();
}

document.getElementById("escala").addEventListener("change", gerarCalendario);
document.getElementById("meses").addEventListener("change", gerarCalendario);

gerarCalendario();
