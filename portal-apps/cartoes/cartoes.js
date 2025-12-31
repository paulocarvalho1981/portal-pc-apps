/* ======================================================
   CONFIG PDF.JS (SEM WORKER – MAIS ESTÁVEL)
====================================================== */
pdfjsLib.GlobalWorkerOptions.workerSrc = null;

/* ======================================================
   VARIÁVEIS GLOBAIS
====================================================== */
let dadosDia1 = null;
let dadosDia2 = null;

/* ======================================================
   LEITURA DO PDF
====================================================== */
async function extrairTextoPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let texto = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    content.items.forEach(item => {
      texto += item.str + " ";
    });
  }

  return texto.toUpperCase();
}

/* ======================================================
   EXTRAÇÃO CAMA × BALEEIRA
   Aceita: 406 LB3 | 517/A LB3
====================================================== */
function extrairCamasEBaleeiras(texto) {
  const regex = /(\d{2,3}\/[A-Z]|\d{2,3})\s*(LB[1-4])/g;

  const resultado = {
    LB1: new Set(),
    LB2: new Set(),
    LB3: new Set(),
    LB4: new Set()
  };

  let match;
  while ((match = regex.exec(texto)) !== null) {
    const cama = match[1];
    const lb = match[2];
    resultado[lb].add(cama); // evita duplicados
  }

  return resultado;
}

/* ======================================================
   RENDERIZAÇÃO DOS RESULTADOS (POR DIA)
====================================================== */
function renderResultado(dados, containerId) {
  const div = document.getElementById(containerId);

  div.innerHTML = `
    ${renderLB("LB1", dados)}
    ${renderLB("LB2", dados)}
    ${renderLB("LB3", dados)}
    ${renderLB("LB4", dados)}
  `;
}

function renderLB(lb, dados) {
  const lista = Array.from(dados[lb]).sort((a, b) => {
    return parseInt(a, 10) - parseInt(b, 10);
  });

  if (!lista.length) {
    return `
      <div>
        <h4>${lb}</h4>
        <p>Sem registros</p>
        <p><strong>Total:</strong> 0 camas</p>
      </div>
    `;
  }

  return `
    <div>
      <h4>${lb}</h4>
      <ul>
        ${lista.map(c => `<li>${c}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> ${lista.length} camas</p>
    </div>
  `;
}

/* ======================================================
   PROCESSAMENTO DO PDF (DIA 1 / DIA 2)
====================================================== */
async function processarPDF(file, containerId, dia) {
  try {
    const texto = await extrairTextoPDF(file);
    const dados = extrairCamasEBaleeiras(texto);

    if (dia === 1) dadosDia1 = dados;
    if (dia === 2) dadosDia2 = dados;

    renderResultado(dados, containerId);

    if (dadosDia1 && dadosDia2) {
      renderComparacao();

document
        .getElementById("blocoDias")
        .classList.add("hidden");

    }

  } catch (err) {
    alert("Erro ao processar o PDF.");
    console.error(err);
  }
}

/* ======================================================
   COMPARAÇÃO LB × LB (REMOVE REPETIDOS)
====================================================== */
function diferencaSet(a, b) {
  return new Set([...a].filter(x => !b.has(x)));
}

function renderComparacao() {
  const div = document.getElementById("resultadoComparacao");

  div.innerHTML = `
    <h2>Diferenças (Retirar × Adicionar)</h2>
    ${renderComparacaoLB("LB1")}
    ${renderComparacaoLB("LB2")}
    ${renderComparacaoLB("LB3")}
    ${renderComparacaoLB("LB4")}
  `;
}

function renderComparacaoLB(lb) {
  const soDia1 = diferencaSet(dadosDia1[lb], dadosDia2[lb]);
  const soDia2 = diferencaSet(dadosDia2[lb], dadosDia1[lb]);

  return `
    <div class="comparacao-lb">
      <h4>${lb}</h4>

      <div class="comparacao-grid">

        <div class="comparacao-col">
          <h5>Retirar</h5>
          ${
            soDia1.size
              ? `<ul>${[...soDia1].map(c => `<li>${c}</li>`).join("")}</ul>`
              : `<p>—</p>`
          }
        </div>

        <div class="comparacao-col">
          <h5>Adicionar</h5>
          ${
            soDia2.size
              ? `<ul>${[...soDia2].map(c => `<li>${c}</li>`).join("")}</ul>`
              : `<p>—</p>`
          }
        </div>

      </div>
    </div>
  `;
}


/* ======================================================
   IMPRESSÃO
====================================================== */

function imprimirResultado() {
  const area = document.getElementById("resultadoComparacao");

  if (!area || area.innerHTML.trim() === "") {
    alert("Não há resultado para imprimir.");
    return;
  }

  const janela = window.open("", "", "width=900,height=700");

  janela.document.write(`
    <html>
      <head>
        <title>Resultado - Retirar x Adicionar</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          h2, h4 {
            margin-top: 16px;
          }

          ul {
            padding-left: 18px;
          }

          li {
            margin-bottom: 4px;
          }

          .comparacao-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .comparacao-col {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        ${area.innerHTML}
      </body>
    </html>
  `);

  janela.document.close();
  janela.focus();
  janela.print();
}


/* ======================================================
   EVENTOS – 2 PDFs (DIA 1 / DIA 2)
====================================================== */
function configurarDrop(dropId, inputId, containerId, dia) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);

  drop.addEventListener("click", () => input.click());

  drop.addEventListener("dragover", e => {
    e.preventDefault();
    drop.style.background = "#fff3e0";
  });

  drop.addEventListener("dragleave", () => {
    drop.style.background = "";
  });

  drop.addEventListener("drop", e => {
    e.preventDefault();
    drop.style.background = "";

    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Solte apenas um arquivo PDF.");
      return;
    }

    processarPDF(file, containerId, dia);
  });

  input.addEventListener("change", e => {
    if (e.target.files[0]) {
      processarPDF(e.target.files[0], containerId, dia);
    }
  });
}

/* ======================================================
   INICIALIZAÇÃO
====================================================== */
configurarDrop("dropDia1", "pdfDia1", "resultadoDia1", 1);
configurarDrop("dropDia2", "pdfDia2", "resultadoDia2", 2);
function limparResultados() {
  // limpa dados
  dadosDia1 = null;
  dadosDia2 = null;

  // limpa telas
  document.getElementById("resultadoDia1").innerHTML = "";
  document.getElementById("resultadoDia2").innerHTML = "";
  document.getElementById("resultadoComparacao").innerHTML = "";

  // mostra novamente os dias
  document.getElementById("blocoDias").classList.remove("hidden");

  // limpa inputs
  document.getElementById("pdfDia1").value = "";
  document.getElementById("pdfDia2").value = "";
}
