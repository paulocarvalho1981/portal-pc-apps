/* ================= ELEMENTS ================= */
const massInput = document.getElementById("massInput");
const heightInput = document.getElementById("heightInput");
const materialSelect = document.getElementById("materialSelect");
const massUnit = document.getElementById("massUnit");
const heightUnit = document.getElementById("heightUnit");

const energyResult = document.getElementById("energyResult");
const riskResult = document.getElementById("riskResult");
const zoneInfo = document.getElementById("zoneInfo");

const calcBtn = document.getElementById("calcBtn");
const zones = document.querySelectorAll("#bodySvg .zone");

/* ================= CONSTANTS ================= */
const LB_TO_KG = 0.453592;
const FT_TO_M = 0.3048;
const GRAVITY = 9.81;

/* ================= STATE ================= */
let impactEnergy = null;

/* ================= INJURY MATRIX ================= */
const injuryMatrix = {
  head: [
    { limit: 40, text: "Minor head injury possible." },
    { limit: 80, text: "⚠️ Risk of skull fracture." },
    { limit: Infinity, text: "❌ Potentially fatal head injury." }
  ],
  chest: [
    { limit: 60, text: "Chest impact – moderate injury." },
    { limit: 120, text: "⚠️ Rib fractures likely." },
    { limit: Infinity, text: "❌ Severe thoracic trauma." }
  ],
  abdomen: [
    { limit: 50, text: "Abdominal injury possible." },
    { limit: 100, text: "⚠️ Internal injury risk." },
    { limit: Infinity, text: "❌ Severe internal trauma." }
  ],
  leg: [
    { limit: 80, text: "⚠️ High probability of bone fracture." },
    { limit: Infinity, text: "❌ Severe lower limb injury." }
  ]
};

/* ================= CALCULATE ================= */
calcBtn.addEventListener("click", () => {

  let mass = parseFloat(massInput.value);
  let height = parseFloat(heightInput.value);
  const materialFactor = parseFloat(materialSelect.value);

  if (isNaN(mass) || isNaN(height)) {
    energyResult.textContent = "—";
    riskResult.textContent = "Invalid input";
    return;
  }

  // ===== UNIT CONVERSION =====
  if (massUnit.value === "lb") {
    mass *= LB_TO_KG;
  }

  if (heightUnit.value === "ft") {
    height *= FT_TO_M;
  }

  // ===== ENERGY CALCULATION =====
  impactEnergy = mass * GRAVITY * height * materialFactor;

  energyResult.textContent = impactEnergy.toFixed(1);

  // ===== GLOBAL RISK LEVEL =====
  let risk = "LOW";
  riskResult.style.color = "#16a34a";

  if (impactEnergy >= 40 && impactEnergy < 80) {
    risk = "MEDIUM";
    riskResult.style.color = "#ca8a04";
  }

  if (impactEnergy >= 80) {
    risk = "HIGH / POTENTIALLY FATAL";
    riskResult.style.color = "#b91c1c";
  }

  riskResult.textContent = risk;

  // ===== RESET VISUAL STATE =====
  zones.forEach(z => z.classList.remove("low", "medium", "high"));
  zoneInfo.classList.remove("low", "medium", "high");

  zoneInfo.textContent =
    "Click on a body area to display injury risk assessment.";
});

/* ================= SVG INTERACTION ================= */
zones.forEach(zone => {
  zone.addEventListener("click", () => {

    if (impactEnergy === null) {
      zoneInfo.textContent =
        "⚠️ Please calculate impact energy first.";
      return;
    }

    const zoneName = zone.dataset.zone;
    const rules = injuryMatrix[zoneName];

    if (!rules) {
      zoneInfo.textContent =
        "No injury data available for this body area.";
      return;
    }

    // ===== CLEAR PREVIOUS STATE =====
    zones.forEach(z => z.classList.remove("low", "medium", "high"));
    zoneInfo.classList.remove("low", "medium", "high");

    // ===== FIND INJURY MESSAGE =====
    let message = "";
    for (let r of rules) {
      if (impactEnergy <= r.limit) {
        message = r.text;
        break;
      }
    }

    // ===== SEVERITY =====
    let severity = "low";
    if (impactEnergy >= 80) severity = "high";
    else if (impactEnergy >= 40) severity = "medium";

    // ===== APPLY VISUALS =====
    zone.classList.add(severity);
    zoneInfo.classList.add(severity);

    zoneInfo.textContent =
      `${zoneName.toUpperCase()} — Impact energy: ${impactEnergy.toFixed(1)} J. ${message}`;
  });
});

/* ================= REFERENCES MODAL ================= */
const refsBtn = document.getElementById("refsBtn");
const refsModal = document.getElementById("refsModal");
const closeRefs = document.getElementById("closeRefs");

refsBtn.addEventListener("click", () => {
  refsModal.classList.remove("hidden");
});

closeRefs.addEventListener("click", () => {
  refsModal.classList.add("hidden");
});

refsModal.addEventListener("click", e => {
  if (e.target === refsModal) {
    refsModal.classList.add("hidden");
  }
});
