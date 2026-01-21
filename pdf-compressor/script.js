const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const compressBtn = document.getElementById("compressBtn");
const progress = document.getElementById("progress");
const downloadBtn = document.getElementById("downloadBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const sizeOriginalEl = document.getElementById("sizeOriginal");
const sizeFinalEl = document.getElementById("sizeFinal");
const sizeReductionEl = document.getElementById("sizeReduction");

let selectedFile = null;

/* ======================
   CLIQUE PARA SELECIONAR
====================== */
dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

/* ======================
   DRAG & DROP
====================== */
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.style.borderColor = "#3b82f6";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#bbb";
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.style.borderColor = "#bbb";

  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

/* ======================
   PROCESSAR PDF
====================== */
function handleFile(file) {
  if (file.type !== "application/pdf") {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  }

  selectedFile = file;

  const sizeMB = (file.size / 1024 / 1024).toFixed(2);
  const originalMB = file.size / 1024 / 1024;
sizeOriginalEl.textContent = `${originalMB.toFixed(2)} MB`;
sizeFinalEl.textContent = "–";
sizeReductionEl.textContent = "–";

  fileInfo.textContent = `📄 ${file.name} — ${sizeMB} MB`;

  compressBtn.disabled = false;
  downloadBtn.classList.add("hidden");
}

/* ======================
   BOTÃO COMPACTAR (placeholder)
====================== */
compressBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  progress.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "Iniciando...";

  const quality = document.querySelector(
    'input[name="quality"]:checked'
  ).value;

  const settings = {
    high:   { scale: 1.2, jpeg: 0.5 },
    medium: { scale: 1.6, jpeg: 0.7 },
    low:    { scale: 2.0, jpeg: 0.9 }
  }[quality];

  const pdfData = await selectedFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  const { jsPDF } = window.jspdf;
  const outPdf = new jsPDF();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const percent = Math.round((pageNum - 1) / pdf.numPages * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Página ${pageNum} de ${pdf.numPages} (${percent}%)`;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: settings.scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    const imgData = canvas.toDataURL("image/jpeg", settings.jpeg);

    const pdfWidth = outPdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    if (pageNum > 1) outPdf.addPage();
    outPdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  }

  progressFill.style.width = "100%";
  progressText.textContent = "Finalizando...";

  const blob = outPdf.output("blob");
  const url = URL.createObjectURL(blob);
  const finalMB = blob.size / 1024 / 1024;
const originalMB = selectedFile.size / 1024 / 1024;

const reduction = Math.round(
  ((originalMB - finalMB) / originalMB) * 100
);

sizeFinalEl.textContent = `${finalMB.toFixed(2)} MB`;
sizeReductionEl.textContent = `${reduction}%`;

  downloadBtn.href = url;
  downloadBtn.download = selectedFile.name.replace(
    ".pdf",
    "_compactado.pdf"
  );

  setTimeout(() => {
    progress.classList.add("hidden");
    downloadBtn.classList.remove("hidden");
  }, 400);
});


// botão voltar
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  window.location.href = "../index.html"; 
  // ajuste o caminho conforme sua estrutura
});

const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModalBtn");

if (infoBtn && infoModal && closeModalBtn) {
  infoBtn.addEventListener("click", () => {
    infoModal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    infoModal.classList.add("hidden");
  });

  infoModal.addEventListener("click", e => {
    if (e.target === infoModal) {
      infoModal.classList.add("hidden");
    }
  });
}

