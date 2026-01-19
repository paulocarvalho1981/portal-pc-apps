let dados = [];

function adicionar() {
  const nome = document.getElementById("nome").value.trim();
  const cert = document.getElementById("certificado").value;

  if (!nome || !cert) {
    alert("Preencha nome e certificado");
    return;
  }

  dados.push({ nome, cert });

  document.getElementById("nome").value = "";
  document.getElementById("certificado").value = "";

  renderizar();
}

function renderizar() {
  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  dados.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.cert}</td>
      <td class="col-remover">
        <button class="btn-remover" onclick="remover(${index})">✖</button>
        </td>
    `;
    tbody.appendChild(tr);
  });
}

function remover(index){
    dados.splice(index, 1);
    renderizar();
}


function ordenar() {
  dados.sort((a, b) => a.nome.localeCompare(b.nome));
  renderizar();
}
