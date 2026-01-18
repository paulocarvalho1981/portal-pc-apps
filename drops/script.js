/* ================= ELEMENTS ================= */
const massInput = document.getElementById("massInput");
const heightInput = document.getElementById("heightInput");
const materialSelect = document.getElementById("materialSelect");

const energyResult = document.getElementById("energyResult");
const riskResult = document.getElementById("riskResult");
const zoneInfo = document.getElementById("zoneInfo");

const calcBtn = document.getElementById("calcBtn");
const zones = document.querySelectorAll("#bodySvg .zone");

/* ================= STATE ================= */
let lastEnergy = null;

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

/* ================= CALCULATION ================= */
function calculateDrops() {
  const mass = parseFloat(massInput.value);
  const height = parseFloat(heightInput.value);
  const materialFactor = parseFloat(materialSelect.value);

  if (isNaN(mass) || isNaN(height)) {
    alert("Please enter valid mass and height values.");
    return;
  }

  lastEnergy = mass * 9.81 * height * materialFactor;

  energyResult.textContent = lastEnergy.toFixed(1);

  if (lastEnergy < 40) {
    riskResult.textContent = "LOW";
    riskResult.style.color = "#16a34a";
  } else if (lastEnergy < 80) {
    riskResult.textContent = "MEDIUM";
    riskResult.style.color = "#ca8a04";
  } else {
    riskResult.textContent = "HIGH / POTENTIALLY FATAL";
    riskResult.style.color = "#b91c1c";
  }

  // reset visual state
  zones.forEach(z => z.classList.remove("low", "medium", "high"));
  zoneInfo.classList.remove("low", "medium", "high");

  zoneInfo.textContent =
    "Click on a body area to display injury risk assessment.";
}

/* ================= EVENTS ================= */
calcBtn.addEventListener("click", calculateDrops);

/* ================= SVG INTERACTION ================= */
zones.forEach(zone => {
  zone.addEventListener("click", () => {

    if (lastEnergy === null) {
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

    // clean previous highlights
    zones.forEach(z => z.classList.remove("low", "medium", "high"));
    zoneInfo.classList.remove("low", "medium", "high");

    let message = "";
    for (let r of rules) {
      if (lastEnergy <= r.limit) {
        message = r.text;
        break;
      }
    }

    // global severity classification
    let severity = "low";
    if (lastEnergy >= 80) severity = "high";
    else if (lastEnergy >= 40) severity = "medium";

    // apply visual severity
    zone.classList.add(severity);
    zoneInfo.classList.add(severity);

    zoneInfo.textContent =
      zoneName.toUpperCase() +
      " — Impact energy: " +
      lastEnergy.toFixed(1) +
      " J. " +
      message;
  });
});
