document.addEventListener("DOMContentLoaded", () => {

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

  /* ================= I18N ================= */
  let currentLang = "en";
  langPT.classList.remove("active");
  langEN.classList.add("active");

  const i18n = {
    pt: {
      calc: "Cálculo",
      reference: "Referência",
      result: "Resultado",
      invert: "inverter",
      tabs: {
        length: "Comprimento",
        pressure: "Pressão",
        density: "Densidade",
        weight: "Peso / Massa",
        volume: "Volume",
        torque: "Torque",
        area: "Área"
      }
    },
    en: {
      calc: "Calculation",
      reference: "Reference",
      result: "Result",
      invert: "invert",
      tabs: {
        length: "Length",
        pressure: "Pressure",
        density: "Density",
        weight: "Weight / Mass",
        volume: "Volume",
        torque: "Torque",
        area: "Area"
      }
    }
  };

  /* ================= UNIDADES ================= */
  const units = {
    length: {
      options: ["m", "ft", "in", "mm"],
      factors: {
        "m:ft": 3.2808, "ft:m": 0.3048,
        "in:mm": 25.4, "mm:in": 0.03937,
        "ft:in": 12, "in:ft": 0.08333,
        "m:mm": 1000, "mm:m": 0.001
      },
      reference: [
        "1 m = 3.2808 ft",
        "1 ft = 12 in",
        "1 in = 25.4 mm"
      ]
    },
    pressure: {
      options: ["psi", "bar", "kPa", "MPa"],
      factors: {
        "psi:bar": 0.06895, "bar:psi": 14.5038,
        "psi:kPa": 6.8948, "kPa:psi": 0.14504,
        "bar:MPa": 0.1, "MPa:bar": 10,
        "psi:MPa": 0.006895, "MPa:psi": 145.038
      },
      reference: [
        "1 bar = 14.5038 psi",
        "1 psi = 6.8948 kPa",
        "1 MPa = 10 bar"
      ]
    },
    density: {
      options: ["ppg", "kg/m³", "g/cm³"],
      factors: {
        "ppg:kg/m³": 119.826, "kg/m³:ppg": 0.008345,
        "g/cm³:kg/m³": 1000, "kg/m³:g/cm³": 0.001,
        "ppg:g/cm³": 0.119826, "g/cm³:ppg": 8.345
      },
      reference: [
        "1 ppg = 119.826 kg/m³",
        "1 g/cm³ = 1000 kg/m³"
      ]
    },
    weight: {
      options: ["kg", "lb", "oz", "ton"],
      factors: {
        "kg:lb": 2.2046, "lb:kg": 0.4536,
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
        "m³:bbl": 6.2898, "bbl:m³": 0.158987,
        "bbl:gal": 42, "gal:bbl": 0.02381,
        "L:gal": 0.26417, "gal:L": 3.78541,
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
    "in·lbf:ft·lbf": 0.08333
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
    "m²:ft²": 10.7639,
    "ft²:m²": 0.092903,
    "cm²:in²": 0.155,
    "in²:cm²": 6.4516
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
  // Título da unidade
  titleEl.textContent = i18n[currentLang].tabs[currentUnit];

  // Títulos fixos
  document.querySelector(".calc-box h3").textContent =
    i18n[currentLang].calc;

  document.querySelector(".ref-box h3").textContent =
    i18n[currentLang].reference;

  // Texto do resultado
  document.querySelector(".result").firstChild.textContent =
    i18n[currentLang].result + ": ";

  // 🔥 TEXTO DAS ABAS
  tabs.forEach(tab => {
    const type = tab.dataset.type;
    tab.textContent = i18n[currentLang].tabs[type];
  });
  if (invertBtn) {
  invertBtn.textContent = "⇄ " + i18n[currentLang].invert;
}

}


  function loadUnit(type) {
    currentUnit = type;
    const unit = units[type];

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    unit.options.forEach(opt => {
      fromSelect.innerHTML += `<option value="${opt}">${opt}</option>`;
      toSelect.innerHTML += `<option value="${opt}">${opt}</option>`;
    });

    refEl.innerHTML = unit.reference.map(r => `<li>${r}</li>`).join("");
    valueInput.value = "";
    resultEl.textContent = "—";

    applyLanguage();
  }

  function calcular() {
    const valor = parseFloat(valueInput.value);
    if (isNaN(valor)) {
      resultEl.textContent = "—";
      return;
    }

    const key = `${fromSelect.value}:${toSelect.value}`;
    const fator = units[currentUnit].factors[key];

    if (!fator) {
      resultEl.textContent = "—";
      return;
    }

    resultEl.textContent = (valor * fator).toFixed(4) + " " + toSelect.value;
  }

  /* ================= EVENTOS ================= */
  valueInput.addEventListener("input", calcular);
  fromSelect.addEventListener("change", calcular);
  toSelect.addEventListener("change", calcular);

  if (invertBtn) {
    invertBtn.addEventListener("click", () => {
      [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
      calcular();
    });
  }

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

  /* ================= INIT ================= */
  loadUnit("length");
});
