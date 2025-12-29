document.querySelectorAll(".drop-zone").forEach(zone => {
  const input = zone.querySelector("input[type='file']");
  const text = zone.querySelector("span");

  // clique abre input
  zone.addEventListener("click", () => input.click());

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
      text.textContent = "Nenhum arquivo escolhido";
      zone.classList.remove("loaded");
    }
  });
});

// validação no botão comparar
document.getElementById("comparar").addEventListener("click", () => {
  const ontem = document.getElementById("pdfOntem");
  const hoje = document.getElementById("pdfHoje");

  if (!ontem.files || ontem.files.length === 0) {
    alert("Selecione o PDF de ontem");
    return;
  }

  if (!hoje.files || hoje.files.length === 0) {
    alert("Selecione o PDF de hoje");
    return;
  }

  console.log("PDF Ontem:", ontem.files[0].name);
  console.log("PDF Hoje:", hoje.files[0].name);

  // aqui entra sua lógica de comparação
});
