document.addEventListener("DOMContentLoaded", () => {

  const saveBtn = document.querySelector(".state-btn.save");
  const loadBtn = document.querySelector(".state-btn.load");
  const startDrillBtn = document.querySelector(".drill-btn.start");
  const endDrillBtn = document.querySelector(".drill-btn.end");

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
  const drill = {
  active: false,
  startTime: null,
  endTime: null,
  edits: {
    muster: {},
    abandon: {}
  },
  timeouts: []
};
let drillTimerInterval = null;



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
  function getClockTime() {
  return document.getElementById("clock")?.textContent || "";
}


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

  selectedLocation = null;
  inputBuffer = "";

  document.querySelectorAll(".location-item")
    .forEach(i => i.classList.remove("selected"));

  /* >>> ADICIONA AQUI <<< */
  document.querySelectorAll(".location-item").forEach(item => {
    item.classList.toggle("mode-muster", mode === "muster");
    item.classList.toggle("mode-abandon", mode === "abandon");
  });
  /* >>> ATÉ AQUI <<< */

btnMuster.addEventListener("click", () => setMode("muster"));
btnAbandon.addEventListener("click", () => setMode("abandon"));


  render();
}



  /* ======================
     SELEÇÃO DE LOCATION
  ====================== */
document.querySelectorAll(".edit-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation(); // não selecionar a location

    const nameSpan = icon.closest(".loc-name");
    const originalText = nameSpan.childNodes[0].textContent.trim();

    // evita abrir duas edições
    if (nameSpan.classList.contains("editing")) return;

    nameSpan.classList.add("editing");

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.style.fontSize = "inherit";
    input.style.width = "70%";

    // limpa texto atual
    nameSpan.childNodes[0].textContent = "";
    nameSpan.insertBefore(input, icon);

    input.focus();
    input.select();

    function finalize(save) {
      const newName = save && input.value.trim()
        ? input.value.trim()
        : originalText;

      input.remove();
      nameSpan.childNodes[0].textContent = newName + " ";
      nameSpan.classList.remove("editing");
    }

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") finalize(true);
      if (ev.key === "Escape") finalize(false);
    });

    input.addEventListener("blur", () => finalize(true));
  });
});



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

      if (drill.active) {
        drill.edits[mode][name] = getClockTime();
      }
    }

    if (val === "UNDO" || val === "DEL") {
      inputBuffer = "";
      state[mode][name] = 0;

      if (drill.active) {
        drill.edits[mode][name] = getClockTime();
      }
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
   TIME OUT (LOG + VISUAL)
====================== */
const timeoutBtn = document.querySelector(".timeout");

if (timeoutBtn) {
  timeoutBtn.addEventListener("click", () => {
    const now = getClockTime();

    timeoutBtn.classList.toggle("timeout-active");

    if (drill.active) {
      drill.timeouts.push({
        time: now,
        type: timeoutBtn.classList.contains("timeout-active")
          ? "start"
          : "end"
      });
    }
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

function openOnboardPopup() {
  popup.classList.remove("hidden");
  popupInput.value = state.onboard;
  popupInput.focus();
}


function startOB() {
  onboardTimer = setTimeout(() => {
    openOnboardPopup();
  }, 2000);
}


function cancelOB() {
  clearTimeout(onboardTimer);
}

const onboardEditBtn = document.querySelector(".onboard-edit-btn");

if (onboardEditBtn) {
  onboardEditBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita conflito com clique longo
    openOnboardPopup();
  });
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




if (saveBtn) {
  saveBtn.addEventListener("click", saveState);
}

if (loadBtn) {
 // loadBtn.addEventListener("click", loadState);
}
const historyPopup = document.querySelector(".history-popup");
const historyList = document.querySelector(".history-list");
const closeHistoryBtn = document.getElementById("closeHistory");
// ⚠️ ATENÇÃO:
// loadBtn está sendo usado DUAS VEZES:
// 1) para loadState()
// 2) para openHistory()
// Isso causa conflito de comportamento

loadBtn.addEventListener("click", openHistory);



closeHistoryBtn.addEventListener("click", () => {
  historyPopup.classList.add("hidden");
});







function getClockTime() {
  return document.getElementById("clock")?.textContent || "";
}




modalStartBtn.addEventListener("click", () => {
  startDrill();
  closeStartDrillModal();
});

modalCancelBtn.addEventListener("click", closeStartDrillModal);

startDrillBtn.addEventListener("click", startDrill);
endDrillBtn.addEventListener("click", endDrill);


function formatDuration(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}


});

