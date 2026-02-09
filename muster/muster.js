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

    if (!drill.active) {
     openStartDrillModal();
      return;
    }

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

function saveState() {
  const states = JSON.parse(localStorage.getItem("musterSavedStates")) || [];

  const snapshot = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    data: {
      mode,
      onboard: state.onboard,
      muster: { ...state.muster },
      abandon: { ...state.abandon },
      message: document.querySelector(".info-box")?.value || "",
      drill: structuredClone(drill)

    }
  };

  states.push(snapshot);

  // limite de segurança
  if (states.length > 20) states.shift();

  localStorage.setItem("musterSavedStates", JSON.stringify(states));

  alert("STATE SAVED");
}

function loadState() {
  const states = JSON.parse(localStorage.getItem("musterSavedStates")) || [];

  if (!states.length) {
    alert("NO SAVED STATE");
    return;
  }

  const last = states[states.length - 1];


  mode = last.data.mode;
  state.onboard = last.data.onboard;
  state.muster = { ...last.data.muster };
  state.abandon = { ...last.data.abandon };

  const infoBox = document.querySelector(".info-box");
  if (infoBox) infoBox.value = last.data.message || "";

  setMode(mode);
  render();
}
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

function openHistory() {
  renderHistory();
  historyPopup.classList.remove("hidden");
}

closeHistoryBtn.addEventListener("click", () => {
  historyPopup.classList.add("hidden");
});
function renderHistory() {
  const states = JSON.parse(localStorage.getItem("musterSavedStates")) || [];
  historyList.innerHTML = "";

  if (!states.length) {
    historyList.innerHTML = "<p>No saved states.</p>";
    return;
  }

  states.slice().reverse().forEach(stateItem => {
    const div = document.createElement("div");
    div.className = "history-item";

    const total =
      Object.values(stateItem.data[stateItem.data.mode]).reduce((a, b) => a + b, 0);

    const missing = stateItem.data.onboard - total;

    div.innerHTML = `
      <strong>${new Date(stateItem.savedAt).toLocaleString()}</strong>
      Mode: ${stateItem.data.mode.toUpperCase()}<br>
      Onboard: ${stateItem.data.onboard} | Count: ${total} | Missing: ${missing}

      <div class="history-actions">
        <button class="load">LOAD</button>
        <button class="pdf">PDF</button>
        <button class="delete">DEL</button>
      </div>
    `;
    div.querySelector(".pdf").addEventListener("click", () => {
      exportSnapshotPDF(stateItem);
    });

    div.querySelector(".load").addEventListener("click", () => {
      applyHistoryState(stateItem);
      historyPopup.classList.add("hidden");
    });

    div.querySelector(".delete").addEventListener("click", () => {
      deleteHistoryState(stateItem.id);
      renderHistory();
    });

    historyList.appendChild(div);
  });
}

function applyHistoryState(item) {
  mode = item.data.mode;
  state.onboard = item.data.onboard;
  state.muster = { ...item.data.muster };
  state.abandon = { ...item.data.abandon };

  const infoBox = document.querySelector(".info-box");
  if (infoBox) infoBox.value = item.data.message || "";

  setMode(mode);
  render();
}

function deleteHistoryState(id) {
  let states = JSON.parse(localStorage.getItem("musterSavedStates")) || [];
  states = states.filter(s => s.id !== id);
  localStorage.setItem("musterSavedStates", JSON.stringify(states));
}


function getClockTime() {
  return document.getElementById("clock")?.textContent || "";
}


function exportSnapshotPDF(item) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const data = item.data;

  const savedAt = new Date(item.savedAt).toLocaleString();
  const mode = data.mode.toUpperCase();
  const onboard = data.onboard;
  const locations = data;
  const message = data.message || "";

  const muster = data.muster;
  const abandon = data.abandon;

  let y = 14;

  /* ===== TÍTULO ===== */
  doc.setFontSize(16);
  doc.text("MUSTER CALCULATOR - DRILL SNAPSHOT", 14, y);
  y += 8;

  /* ===== INFO ===== */
  doc.setFontSize(10);
  doc.text(`Saved at: ${savedAt}`, 14, y);
  y += 5;
  doc.text(`Mode: ${mode}`, 14, y);
  y += 6;

  /* ===== DRILL INFO ===== */
if (item.data.drill?.startTime) {
  y += 4;
  doc.setFontSize(11);
  doc.text(
  `Drill Start: ${new Date(item.data.drill.startTime).toLocaleTimeString()}`,
  14,
  y
);

  y += 5;

  if (item.data.drill.endTime) {
    doc.text(
  `Drill End: ${new Date(item.data.drill.endTime).toLocaleTimeString()}`,
  14,
  y
);

    y += 5;
  }
}
if (item.data.drill?.durationSeconds != null) {
  y += 6;
  doc.setFontSize(11);
  doc.text(
    `Drill Duration: ${formatDuration(item.data.drill.durationSeconds)}`,
    14,
    y
  );
}

y += 6;
  /* ===== RESUMO ===== */
  let total = 0;
  Object.values(data[mode.toLowerCase()]).forEach(v => total += v);
  const missing = onboard - total;

  doc.setFontSize(11);
  doc.text(`Onboard: ${onboard}`, 14, y);
  y += 5;
  doc.text(`Count: ${total}`, 14, y);
  y += 5;
  doc.text(`Missing: ${missing}`, 14, y);
  y += 8;

  /* ===== TABELA ===== */
  doc.setFontSize(10);
  doc.text("Location", 14, y);
  doc.text("Muster", 90, y);
  doc.text("Time", 115, y);
  doc.text("Abandon", 145, y);
  doc.text("Time", 170, y);

  y += 4;

  doc.line(14, y, 195, y);
  y += 4;

  Object.keys(muster).forEach(name => {
    if (y > 270) {
      doc.addPage();
      y = 14;
    }

    doc.text(name, 14, y);
    doc.text(String(muster[name] || 0), 95, y);
    doc.text(item.data.drill?.edits?.muster?.[name] || "-", 115, y);
    doc.text(String(abandon[name] || 0), 150, y);
    doc.text(item.data.drill?.edits?.abandon?.[name] || "-", 170, y);

    y += 5;
  });

  /* ===== MESSAGE ===== */
  if (message) {
    y += 6;
    doc.line(14, y, 195, y);
    y += 6;
    doc.setFontSize(10);
    doc.text("Operational Message:", 14, y);
    y += 5;
    doc.text(message, 14, y, { maxWidth: 180 });
  }

  /* ===== SAVE ===== */
  const filename = `muster_${mode}_${savedAt.replace(/[^\d]/g, "")}.pdf`;
  doc.save(filename);
}



/* ======================
   DRILL + MODAL CONTROL
====================== */

function startDrill() {
  drill.active = true;
  drill.startTime = Date.now(); // timestamp real
  drill.endTime = null;

  drill.edits.muster = {};
  drill.edits.abandon = {};
  drill.timeouts = [];

  startDrillBtn.disabled = true;
  endDrillBtn.disabled = false;

  const durationBox = document.getElementById("drillDuration");
  const durationValue = durationBox.querySelector("strong");

  durationBox.classList.remove("hidden");
  durationValue.textContent = "00:00:00";

  if (drillTimerInterval) clearInterval(drillTimerInterval);

  drillTimerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor(
      (Date.now() - drill.startTime) / 1000
    );
    durationValue.textContent = formatDuration(elapsedSeconds);
  }, 1000);
}


function endDrill() {
  drill.active = false;
  drill.endTime = Date.now();

  drill.durationSeconds = Math.floor(
    (drill.endTime - drill.startTime) / 1000
  );

  if (drillTimerInterval) {
    clearInterval(drillTimerInterval);
    drillTimerInterval = null;
  }

  startDrillBtn.disabled = false;
  endDrillBtn.disabled = true;
}



const startDrillModal = document.getElementById("startDrillModal");
const modalStartBtn = startDrillModal.querySelector(".start-drill-btn");
const modalCancelBtn = startDrillModal.querySelector(".close-btn");

function openStartDrillModal() {
  startDrillModal.classList.remove("hidden");
}

function closeStartDrillModal() {
  startDrillModal.classList.add("hidden");
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


