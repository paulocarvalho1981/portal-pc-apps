document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENTOS ================= */
  const valueInput = document.getElementById("lenValue");
  const fromSelect = document.getElementById("lenFrom");
  const toSelect = document.getElementById("lenTo");
  const resultEl = document.getElementById("lenResult");
  const titleEl = document.getElementById("unitTitle");
  const refEl = document.getElementById("unitReference");
  const tabs = document.querySelectorAll(".tab");
  const invertBtn = document.getElementById("invertBtn");

  const langPT = document.getElementById("langPT");
  const langEN = document.getElementById("langEN");

  const helpBtn = document.getElementById("helpBtn");
  const helpOverlay = document.getElementById("helpOverlay");
  const closeHelp = document.getElementById("closeHelp");
  const helpTitle = document.getElementById("helpTitle");
  const helpContent = document.getElementById("helpContent");

  /* ================= I18N ================= */
  let currentLang = "en";

  const i18n = {
    pt: {
      pageTitle: "Calculadora de Unidades",
      calc: "Cálculo",
      reference: "Referência",
      result: "Resultado",
      invert: "Inverter",
      tabs: {
        length: "Comprimento",
        pressure: "Pressão",
        density: "Densidade",
        weight: "Peso / Massa",
        torque: "Torque",
        area: "Área"
      },
      help: {
        title: "Como usar",
        items: [
          "Selecione a categoria de unidades no topo",
          "Digite o valor a ser convertido",
          "Escolha a unidade de origem e destino",
          "Use o botão inverter para trocar as unidades",
          "O resultado é atualizado automaticamente"
        ]
      }
    },
    en: {
      pageTitle: "Unit Converter",
      calc: "Calculation",
      reference: "Reference",
      result: "Result",
      invert: "Invert",
      tabs: {
        length: "Length",
        pressure: "Pressure",
        density: "Density",
        weight: "Weight / Mass",
        torque: "Torque",
        area: "Area"
      },
      help: {
        title: "How to use",
        items: [
          "Reveal the category of units at the top",
          "Enter the value to convert",
          "Select the origin and destination units",
          "Use the invert button to swap units",
          "The result updates automatically"
        ]
      }
    }
  };

  /* ================= UNIDADES ================= */
const units = {

  length: {
    options: ["m", "ft", "in", "mm"],
    factors: {
      "m:ft": 3.28084, "ft:m": 0.3048,
      "in:mm": 25.4, "mm:in": 0.0393701,
      "ft:in": 12, "in:ft": 0.0833333,
      "m:mm": 1000, "mm:m": 0.001
    },
    reference: [
      "1 m = 3.28084 ft",
      "1 ft = 12 in",
      "1 in = 25.4 mm"
    ]
  },

  pressure: {
    options: ["psi", "bar", "kPa", "MPa"],
    factors: {
      "psi:bar": 0.0689476, "bar:psi": 14.5038,
      "psi:kPa": 6.89476, "kPa:psi": 0.145038,
      "bar:MPa": 0.1, "MPa:bar": 10,
      "psi:MPa": 0.00689476, "MPa:psi": 145.038
    },
    reference: [
      "1 bar = 14.5038 psi",
      "1 psi = 6.89476 kPa",
      "1 MPa = 10 bar"
    ]
  },

  density: {
    options: ["ppg", "kg/m³", "g/cm³"],
    factors: {
      "ppg:kg/m³": 119.826,
      "kg/m³:ppg": 0.0083454,
      "g/cm³:kg/m³": 1000,
      "kg/m³:g/cm³": 0.001,
      "ppg:g/cm³": 0.119826,
      "g/cm³:ppg": 8.3454
    },
    reference: [
      "1 ppg = 119.826 kg/m³",
      "1 g/cm³ = 1000 kg/m³"
    ]
  },

  weight: {
    options: ["kg", "lb", "oz", "ton"],
    factors: {
      "kg:lb": 2.20462, "lb:kg": 0.453592,
      "lb:oz": 16, "oz:lb": 0.0625,
      "kg:oz": 35.274, "oz:kg": 0.0283495,
      "ton:kg": 1000, "kg:ton": 0.001
    },
    reference: [
      "1 lb = 16 oz",
      "1 oz = 28.3495 g",
      "1 ton = 1000 kg"
    ]
  },

  volume: {
    options: ["m³", "bbl", "L", "gal"],
    factors: {
      "m³:bbl": 6.28981, "bbl:m³": 0.158987,
      "bbl:gal": 42, "gal:bbl": 0.0238095,
      "L:gal": 0.264172, "gal:L": 3.78541,
      "m³:L": 1000, "L:m³": 0.001
    },
    reference: [
      "1 bbl = 0.158987 m³",
      "1 bbl = 42 gal (US)",
      "1 m³ = 1000 L"
    ]
  },

  torque: {
    options: ["Nm", "ft·lbf", "in·lbf"],
    factors: {
      "Nm:ft·lbf": 0.737562,
      "ft·lbf:Nm": 1.35582,
      "Nm:in·lbf": 8.85075,
      "in·lbf:Nm": 0.112985,
      "ft·lbf:in·lbf": 12,
      "in·lbf:ft·lbf": 0.0833333
    },
    reference: [
      "1 Nm = 0.737562 ft·lbf",
      "1 Nm = 8.85075 in·lbf",
      "1 ft·lbf = 12 in·lbf"
    ]
  },

  area: {
    options: ["m²", "ft²", "cm²", "in²"],
    factors: {
      "m²:ft²": 10.7639, "ft²:m²": 0.092903,
      "cm²:in²": 0.155, "in²:cm²": 6.4516
    },
    reference: [
      "1 m² = 10.7639 ft²",
      "1 in² = 6.4516 cm²"
    ]
  }

};

  
  let currentUnit = "length";

  /* ================= FUNÇÕES ================= */
  function applyLanguage() {
    document.getElementById("pageTitle").textContent = i18n[currentLang].pageTitle;
    document.title = i18n[currentLang].pageTitle;

    titleEl.textContent = i18n[currentLang].tabs[currentUnit];
    document.querySelector(".calc-box h3").textContent = i18n[currentLang].calc;
    document.querySelector(".ref-box h3").textContent = i18n[currentLang].reference;
    document.querySelector(".result").firstChild.textContent =
      i18n[currentLang].result + ": ";

    tabs.forEach(tab => {
      tab.textContent = i18n[currentLang].tabs[tab.dataset.type];
    });

    invertBtn.textContent = "⇄ " + i18n[currentLang].invert;
  }

  function loadUnit(type) {
    currentUnit = type;
    const unit = units[type];

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    unit.options.forEach(opt => {
      fromSelect.innerHTML += `<option>${opt}</option>`;
      toSelect.innerHTML += `<option>${opt}</option>`;
    });

    refEl.innerHTML = unit.reference.map(r => `<li>${r}</li>`).join("");
    valueInput.value = "";
    resultEl.textContent = "—";

    applyLanguage();
  }

  function calcular() {
    const v = parseFloat(valueInput.value);
    if (isNaN(v)) return resultEl.textContent = "—";

    const key = `${fromSelect.value}:${toSelect.value}`;
    const f = units[currentUnit].factors[key];
    if (!f) return resultEl.textContent = "—";

    resultEl.textContent = (v * f).toFixed(4) + " " + toSelect.value;
  }

  /* ================= EVENTOS ================= */
  valueInput.addEventListener("input", calcular);
  fromSelect.addEventListener("change", calcular);
  toSelect.addEventListener("change", calcular);

  invertBtn.addEventListener("click", () => {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    calcular();
  });

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadUnit(tab.dataset.type);
    });
  });

  langPT.addEventListener("click", () => {
    currentLang = "pt";
    applyLanguage();
  });

  langEN.addEventListener("click", () => {
    currentLang = "en";
    applyLanguage();
  });

  helpBtn.addEventListener("click", () => {
    helpTitle.textContent = i18n[currentLang].help.title;
    helpContent.innerHTML = i18n[currentLang].help.items.map(i => `<li>${i}</li>`).join("");
    helpOverlay.classList.remove("hidden");
  });

  closeHelp.addEventListener("click", () => {
    helpOverlay.classList.add("hidden");
  });

  helpOverlay.addEventListener("click", e => {
    if (e.target === helpOverlay) helpOverlay.classList.add("hidden");
  });

  /* ================= INIT ================= */
  loadUnit("length");
});
