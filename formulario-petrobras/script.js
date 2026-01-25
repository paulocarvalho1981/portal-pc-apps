document.addEventListener("DOMContentLoaded", () => {
  const selectFuncao = document.getElementById("funcao");
  const externosDiv = document.getElementById("cursosExternos");
  const internosDiv = document.getElementById("cursosInternos");

  /* ======================================================
     CURSOS EXTERNOS COMUNS (QUANDO APLICÁVEL)
     (não significa que TODOS tenham todos, é só agrupamento)
  ====================================================== */
  const externosBase = [
    "Golden Rules (Regras de Ouro)",
    "CBSP",
    "THUET",
    "ASO - Atestado de Saúde Ocupacional",
    "NR-37 Básico",
    "Transocean Integration Training",
    "Petrobras Human Factor"
  ];

  /* ======================================================
     CURSOS INTERNOS BASE (TODOS OS TERCEIROS)
  ====================================================== */
  const internosBase = [
    "Control of Work Awareness",
    "Engage eLearning",
    "IOGP Lifesaving Rules",
    "Dropped Object Prevention Awareness",
    "Permit to Work Awareness",
    "SCS Cybersecurity Basic Training"
  ];

  /* ======================================================
     MATRIZ COMPLETA DE FUNÇÕES (EXPLÍCITA)
     Tudo listado, nada automático, nada implícito
  ====================================================== */
  const dados = {

    /* ================= CATERING ================= */
    cook: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-37 – Basic Course for Food Handlers (16H)"
      ],
      internos: [
        ...internosBase,
        "Infectious Disease Outbreak Management",
        "Galley and Laundry Safety"
      ]
    },

    steward: {
      externos: [
        ...externosBase,
        "NR-12"
      ],
      internos: [
        ...internosBase,
        "Infectious Disease Outbreak Management",
        "Galley and Laundry Safety"
      ]
    },

    catering_crew: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction"
      ],
      internos: [
        ...internosBase,
        "Infectious Disease Outbreak Management",
        "Galley and Laundry Safety"
      ]
    },

    /* ================= DRILLING / SERVICES ================= */
    casing_hand: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    casing_supervisor: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    cementer: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35",
        "Online IADC WellSharp Introductory"
      ],
      internos: [
        ...internosBase
      ]
    },

    mud_engineer: {
      externos: [
        ...externosBase,
        "NR-34 – Onshore Induction",
        "NR-37 Avançado"
      ],
      internos: [
        ...internosBase
      ]
    },

    mud_logger: {
      externos: [
        ...externosBase,
        "NR-34 – Onshore Induction",
        "NR-37 Avançado"
      ],
      internos: [
        ...internosBase
      ]
    },

    geologist: {
      externos: [
        ...externosBase,
        "NR-34 – Onshore Induction",
        "NR-37 Avançado"
      ],
      internos: [
        ...internosBase
      ]
    },

    h2s_supervisor: {
      externos: [
        ...externosBase,
        "NR-34 – Onshore Induction",
        "NR-37 Avançado"
      ],
      internos: [
        ...internosBase
      ]
    },

    slickline_operator: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    /* ================= OTHER ================= */
    blaster_painter: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-33 – Espaço Confinado",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    fire_watch: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-33 – Espaço Confinado",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-34 – Firewatcher",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase,
        "Firewatch Training"
      ]
    },

    scaffolder: {
       externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-33 – Espaço Confinado",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    welder_fitter: {
       externos: [
        ...externosBase,
        "NR-12",
        "NR-34 - Onshore Induction",
        "NR-33 - Espaço Confinado",
        "NR-37 - Avançado",
        "NR-34 - Cargo Handling",
        "NR-34 - Hot Work - 20h",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    training_instructor: {
      externos: [
        ...externosBase,
        "Petrobras Human Factor",
        "NR37 - Instructor Designation"
      ],
      internos: [
        ...internosBase,
        "Infectious Disease Outbreak Management"
      ]
    },

    /* ================= SUBSEA / ROV ================= */
    rov_supervisor: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 - Onshore Induction",
        "NR-33 - Espaço Confinado",
        "NR-37 Avançado",
        "Well Control Training – Level 1",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    rov_technician: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 - Onshore Induction",
        "NR-33 - Espaço Confinado",
        "NR-37 Avançado",
        "Well Control Training – Level 1",
        "NR-35",
        "Carta de Anuência – NR-35"
      ],
      internos: [
        ...internosBase
      ]
    },

    subsea_tech: {
      externos: [
        ...externosBase,
        "NR-12",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado",
        "NR-34 – Cargo Handling",
        "NR-35",
        "Carta de Anuência – NR-35",
        "Online IADC WellSharp Introductory"
      ],
      internos: [
        ...internosBase
      ]
    },

    /* ================= HEIGHT / ELECTRICAL ================= */
    rope_access: {
      externos: [
        ...externosBase,
        "IRATA",
        "NR-35",
        "Carta de Anuência – NR-35",
        "NR-34 – Onshore Induction",
        "NR-37 Avançado"
      ],
      internos: [
        ...internosBase
      ]
    },

    electrician: {
      externos: [
        ...externosBase,
        "NR-10",
        "NR-12",
        "Carta de Anuência – NR-10"
      ],
      internos: [
        ...internosBase
      ]
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */
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

    renderLista(externosDiv, dadosFuncao.externos);
    renderLista(internosDiv, dadosFuncao.internos);
  });
});
