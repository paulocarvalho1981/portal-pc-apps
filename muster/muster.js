document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     ESTADO GLOBAL
  ====================== */
  let mode = "muster"; // muster | abandon
  let selectedLocation = null;
  let inputBuffer = "";

  const state = {
    onboard: 160,
    muster: {},
    abandon: {}
  };

  /* ======================
     RELÓGIO
  ====================== */
  function atualizarRelogio() {
    const agora = new Date();
    const h = String(agora.getHours()).padStart(2, "0");
    const m = String(agora.getMinutes()).padStart(2, "0");
    const s = String(agora.getSeconds()).padStart(2, "0");
    const clock = document.getElementById("clock");
    if (clock) clock.textContent = `${h}:${m}:${s}`;
  }
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);

  /* ======================
     INICIALIZA LOCATIONS
  ====================== */
  document.querySelectorAll(".location-item").forEach(item => {
    const name = item.querySelector(".loc-name").textContent.trim();
    state.muster[name] = 0;
    state.abandon[name] = 0;
  });

  /* ======================
     BOTÕES DE MODO
  ====================== */
  const btnMuster = document.getElementById("btnMuster");
  const btnAbandon = document.getElementById("btnAbandon");

  function setMode(newMode) {
    mode = newMode;
    btnMuster.classList.toggle("active", mode === "muster");
    btnAbandon.classList.toggle("active", mode === "abandon");

const btnAddLocation = document.getElementById("btnAddLocation");
const btnRemoveLocation = document.getElementById("btnRemoveLocation");
if (btnAddLocation) {
  btnAddLocation.addEventListener("click", () => {
    console.log("ADD CLICK");
  });
}

if (btnRemoveLocation) {
  btnRemoveLocation.addEventListener("click", () => {
    console.log("REMOVE CLICK");
  });
}



    selectedLocation = null;
    inputBuffer = "";

    document.querySelectorAll(".location-item")
      .forEach(i => i.classList.remove("selected"));

    render();
  }

  btnMuster.addEventListener("click", () => setMode("muster"));
  btnAbandon.addEventListener("click", () => setMode("abandon"));

  /* ======================
     SELEÇÃO DE LOCATION
  ====================== */
  document.querySelectorAll(".location-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".location-item")
        .forEach(i => i.classList.remove("selected"));

      item.classList.add("selected");
      selectedLocation = item;
      inputBuffer = "";
    });
  });

  /* ======================
     TECLADO NUMÉRICO
  ====================== */
  document.querySelectorAll(".keypad button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!selectedLocation) return;

      const val = btn.textContent.trim();
      const name = selectedLocation.querySelector(".loc-name").textContent.trim();

      if (/^\d$/.test(val)) {
        inputBuffer += val;
        state[mode][name] = parseInt(inputBuffer, 10);
      }

      if (val === "UNDO" || val === "DEL") {
        inputBuffer = "";
        state[mode][name] = 0;
      }

      render();
    });
  });

  /* ======================
     RENDERIZA VALORES
  ====================== */
  function render() {
    let total = 0;

    document.querySelectorAll(".location-item").forEach(item => {
      const name = item.querySelector(".loc-name").textContent.trim();

      const musterSpan = item.querySelector(".loc-muster");
      const abandonSpan = item.querySelector(".loc-abandon");

      musterSpan.textContent = state.muster[name] || 0;
      abandonSpan.textContent = state.abandon[name] || 0;

      if (mode === "muster") {
        total += state.muster[name] || 0;
      } else {
        total += state.abandon[name] || 0;
      }
    });

    document.querySelector(".count span").textContent = total;
    document.querySelector(".onboard span").textContent = state.onboard;

    const missing = state.onboard - total;
    document.querySelector(".missing span").textContent = missing;
  
console.log("missing =", missing);
console.log("missing element =", document.querySelector(".missing"));


    const missingCard = document.querySelector(".missing");

    if (missing === 0) {
    missingCard.classList.add("ok");
}   else {
    missingCard.classList.remove("ok");
}

  }

  /* ======================
     TIME OUT (VISUAL)
  ====================== */
  const timeoutBtn = document.querySelector(".timeout");
  if (timeoutBtn) {
    timeoutBtn.addEventListener("click", () => {
      timeoutBtn.classList.toggle("timeout-active");
    });
  }

  /* ======================
     INIT
  ====================== */
  setMode("muster");



/* ======================
   POPUP ONBOARD
====================== */
let onboardTimer = null;

const onboardCard = document.querySelector(".status.onboard");
const popup = document.querySelector(".onboard-popup");

const popupInput = document.getElementById("onboardInput");
const popupConfirm = document.getElementById("confirmOnboard");
const popupCancel = document.getElementById("cancelOnboard");

// clique longo abre popup
onboardCard.addEventListener("mousedown", startOB);
onboardCard.addEventListener("touchstart", startOB);

onboardCard.addEventListener("mouseup", cancelOB);
onboardCard.addEventListener("mouseleave", cancelOB);
onboardCard.addEventListener("touchend", cancelOB);

function startOB() {
  onboardTimer = setTimeout(() => {
    popup.classList.remove("hidden");
    popupInput.value = state.onboard;
    popupInput.focus();
  }, 2000);
}

function cancelOB() {
  clearTimeout(onboardTimer);
}

// CONFIRMAR
popupConfirm.addEventListener("click", () => {
  const val = parseInt(popupInput.value, 10);

  if (!isNaN(val)) {
    state.onboard = val;
    render(); // ✅ CORRETO
  }

  popup.classList.add("hidden");
});

// CANCELAR
popupCancel.addEventListener("click", () => {
  popup.classList.add("hidden");
});

});
