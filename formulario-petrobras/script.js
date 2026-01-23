document.addEventListener("DOMContentLoaded", () => {
  const selectFuncao = document.getElementById("funcao");
  const externosDiv = document.getElementById("cursosExternos");
  const internosDiv = document.getElementById("cursosInternos");

  /* ===============================
     CURSOS EXTERNOS – OBRIGATÓRIOS (TODOS)
  =============================== */
  const obrigatoriosExternos = [
    "Golden Rules (Regras de Ouro)",
    "CBSP",
    "THUET",
    "ASO – Atestado de Saúde Ocupacional",
    "NR-37 Básico",
    "NR-37 Avançado"
  ];

  /* ===============================
     CURSOS INTERNOS – BASE (TODOS)
  =============================== */
  const internosBase = [
    "Control of Work Awareness",
    "Engage eLearning",
    "IOGP Lifesaving Rules",
    "Dropped Object Prevention Awareness",
    "Permit to Work Awareness",
    "SCS Cybersecurity Basic Training"
  ];

  /* ===============================
     MATRIZ DE FUNÇÕES (SOMENTE EXTRAS)
  =============================== */
  const dados = {
    cook: {
      externos: ["Petrobras Human Factor", "NR-12", "NR-34"],
      internosExtras: [
        "Infectious Disease Outbreak Management",
        "Galley and Laundry Safety"
      ]
    },

    steward: {
      externos: ["Petrobras Human Factor", "NR-12", "NR-34"],
      internosExtras: [
        "Infectious Disease Outbreak Management",
        "Galley and Laundry Safety"
      ]
    },

    casing_hand: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    casing_supervisor: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    cementer: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    geologist: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    h2s_supervisor: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    mud_engineer: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    mud_logger: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    slickline_operator: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    blaster_painter: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    fire_watch: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: ["Firewatch Training"]
    },
rope_access: {
  externos: [
    "IRATA",
    "NR-35",
    "Carta de Anuência – NR-35"
  ],
  internosExtras: []
},

electrician: {
  externos: [
    "NR-10",
    "Carta de Anuência – NR-10"
  ],
  internosExtras: []
},


    rov_supervisor: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    rov_technician: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    subsea_tech: {
      externos: ["Petrobras Human Factor"],
      internosExtras: []
    },

    scaffolder: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    welder_fitter: {
      externos: ["Petrobras Human Factor", "NR-34"],
      internosExtras: []
    },

    training_instructor: {
      externos: ["Petrobras Human Factor"],
      internosExtras: [
        "Infectious Disease Outbreak Management"
      ]
    }
  };

  /* ===============================
     RENDERIZAÇÃO
  =============================== */
  function renderLista(container, lista) {
    container.innerHTML = "";
    lista.forEach(item => {
      const div = document.createElement("div");
      div.textContent = item;
      container.appendChild(div);
    });
  }

  selectFuncao.addEventListener("change", () => {
    const valor = selectFuncao.value;
    const dadosFuncao = dados[valor];

    if (!dadosFuncao) {
      externosDiv.innerHTML = `<p class="placeholder">Selecione uma função</p>`;
      internosDiv.innerHTML = `<p class="placeholder">Selecione uma função</p>`;
      return;
    }

    /* EXTERNOS */
    renderLista(
      externosDiv,
      [...obrigatoriosExternos, ...dadosFuncao.externos]
    );

    /* INTERNOS = BASE + EXTRAS */
    renderLista(
      internosDiv,
      [...internosBase, ...dadosFuncao.internosExtras]
    );
  });
});
