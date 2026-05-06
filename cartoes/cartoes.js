/* =========================
   PDF.js WORKER
========================= */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DRAG & DROP / UPLOAD
  ========================= */
  document.querySelectorAll(".drop-zone").forEach(zone => {
    const input = zone.querySelector("input[type='file']");
    const text = zone.querySelector("span");

    // clique abre input
    zone.addEventListener("click", e => {
      if (e.target.tagName !== "INPUT") {
        input.click();
      }
    });

    input.addEventListener("click", e => {
      e.stopPropagation();
    });

    // drag over
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("dragover");
    });

    // drop
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("dragover");

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Por favor, selecione apenas arquivos PDF.");
        return;
      }

      input.files = e.dataTransfer.files;
      text.textContent = file.name;
      zone.classList.add("loaded");
    });

    // seleção por clique
    input.addEventListener("change", () => {
      if (input.files.length > 0) {
        text.textContent = input.files[0].name;
        zone.classList.add("loaded");
      } else {
        text.textContent =
          zone.dataset.placeholder || "Nenhum arquivo escolhido";
        zone.classList.remove("loaded");
      }
    });
  });

  /* =========================
     LEITURA DO PDF
  ========================= */
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

    return texto;
  }

  /* =========================
     EXTRAÇÃO NÚMERO + BALEEIRA
  ========================= */
  function extrairNumerosEBaleeiras(texto) {
    const tokens = texto.split(/\s+/);
    const resultados = [];

    const regexNumero = /^\d{3}(\/[A-Z])?$/; // ex: 413 ou 413/A
    const regexLB = /^LB[1-4]$/;             // LB1 a LB4

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!regexNumero.test(token)) continue;

      // procura LB logo após (janela curta)
      for (let j = i + 1; j <= i + 5 && j < tokens.length; j++) {
        if (regexLB.test(tokens[j])) {
          resultados.push({
            numero: token,
            lb: tokens[j]
          });
          break;
        }
      }
    }

    return resultados;
  }

  /* =========================
     BOTÃO COMPARAR (DEBUG)
  ========================= */
  const btnComparar = document.getElementById("comparar");

  if (btnComparar) {
    btnComparar.addEventListener("click", async () => {
      const ontemInput = document.getElementById("pdfOntem");
      const hojeInput = document.getElementById("pdfHoje");

      if (!ontemInput.files.length) {
        alert("Selecione o PDF de ontem");
        return;
      }

      if (!hojeInput.files.length) {
        alert("Selecione o PDF de hoje");
        return;
      }

      const ontemFile = ontemInput.files[0];
      const hojeFile = hojeInput.files[0];

      // leitura APENAS do PDF de ontem (estado atual do projeto)
      const textoOntem = await extrairTextoPDF(ontemFile);
      const dadosOntem = extrairNumerosEBaleeiras(textoOntem);

      // DEBUG NA TELA
      const resultadoDiv = document.getElementById("resultado");
      resultadoDiv.innerHTML = `
        <h3>PDF de Ontem</h3>
        <ul>
          ${dadosOntem
            .map(d => `<li>${d.numero} → ${d.lb}</li>`)
            .join("")}
        </ul>
      `;

      console.log("PDF Ontem:", dadosOntem);
    });
  }

  /* =========================
     POPUP INFORMATIVO
  ========================= */
  const infoBtn = document.getElementById("infoBtn");
  const infoOverlay = document.getElementById("infoOverlay");
  const closeInfo = document.getElementById("closeInfo");

  if (infoBtn && infoOverlay) {
    infoBtn.addEventListener("click", () => {
      infoOverlay.classList.remove("hidden");
    });

    infoOverlay.addEventListener("click", e => {
      if (e.target === infoOverlay) {
        infoOverlay.classList.add("hidden");
      }
    });
  }

  if (closeInfo && infoOverlay) {
    closeInfo.addEventListener("click", () => {
      infoOverlay.classList.add("hidden");
    });
  }

});