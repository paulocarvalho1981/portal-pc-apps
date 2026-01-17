// Copiar símbolo ao clicar
document.querySelectorAll(".grid span").forEach(simbolo => {
  simbolo.addEventListener("click", () => {
    const texto = simbolo.textContent;

    navigator.clipboard.writeText(texto).then(() => {
      simbolo.classList.add("copiado");

      setTimeout(() => {
        simbolo.classList.remove("copiado");
      }, 800);
    });
  });
});
