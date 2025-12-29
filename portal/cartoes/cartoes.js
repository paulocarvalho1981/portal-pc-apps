document.querySelectorAll(".drop-zone").forEach(zone => {
  const input = zone.querySelector("input[type='file']");
  const text = zone.querySelector("span");

  // visual quando arrasta por cima
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.style.background = "#fff3e0";
  });

  zone.addEventListener("dragleave", () => {
    zone.style.background = "#fffaf0";
  });

  // quando solta o arquivo
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.style.background = "#fffaf0";

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, solte apenas arquivos PDF.");
      return;
    }

    input.files = e.dataTransfer.files;
    text.textContent = file.name;
  });

  // quando escolhe pelo clique
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      text.textContent = input.files[0].name;
    }
  });

  document.querySelectorAll(".drop-zone").forEach(zone => {
  zone.addEventListener("dragenter", () => zone.classList.add("dragover"));
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", () => zone.classList.remove("dragover"));
});


});
function configurarDrop(zoneId, inputId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    zone.classList.add("loaded");
    zone.innerHTML = `
      <img src="img/pdf.png" class="pdf-icon">
      <span>${file.name}</span>
      <input type="file" id="${inputId}" accept="application/pdf">
    `;
  });
}

configurarDrop("dropYesterday", "pdfOntem");
configurarDrop("dropToday", "pdfHoje");
const removeBtn = zone.querySelector(".remove-file");

removeBtn.addEventListener("click", e => {
  e.stopPropagation();

  input.value = "";
  zone.classList.remove("loaded");

  text.innerHTML = zone.id === "dropYesterday"
    ? "Arraste o PDF de ontem aqui<br>ou clique para escolher"
    : "Arraste o PDF de hoje aqui<br>ou clique para escolher";

  removeBtn.classList.add("hidden");
});
