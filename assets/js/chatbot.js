/* ═══════════════════════════════════════════════════════
   BioGeo logIA — Asistente de recursos
   Árbol de decisiones para recomendación de REA
═══════════════════════════════════════════════════════ */

const RECURSOS = {
  "1eso": {
    "proyecto-cientifico": {
      "video":        [{ nombre: "Khan Academy ES — Método científico", url: "https://es.khanacademy.org", desc: "Vídeos y ejercicios sobre las fases del método científico." }],
      "simulacion":   [{ nombre: "PhET Interactive Simulations", url: "https://phet.colorado.edu/es", desc: "Simulaciones interactivas para diseñar experimentos virtuales." }],
      "interactivo":  [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje alineadas con la LOMLOE." }],
      "material":     [{ nombre: "Scientix — European Schoolnet", url: "https://www.scientix.eu", desc: "Portal europeo con proyectos de indagación científica." }],
      "portal":       [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje alineadas con la LOMLOE." }]
    },
    "geologia": {
      "video":        [{ nombre: "Khan Academy ES — Geología", url: "https://es.khanacademy.org", desc: "Vídeos sobre rocas, minerales y procesos geológicos." }],
      "simulacion":   [{ nombre: "Google Earth", url: "https://earth.google.com/web/", desc: "Herramienta SIG para estudiar geomorfología y tectónica." }],
      "interactivo":  [{ nombre: "Ambientech — Ciencias de la Tierra", url: "https://ambientech.org", desc: "Itinerarios interactivos sobre geología y medio ambiente." }],
      "material":     [{ nombre: "Prácticas Geología", url: "https://practicasgeologia.com", desc: "Repositorio de prácticas creado por profesores." }],
      "portal":       [{ nombre: "IGME — Instituto Geológico y Minero", url: "https://www.igme.es", desc: "Fuente oficial española con mapas y recursos didácticos." }]
    },
    "celula": {
      "video":        [{ nombre: "Khan Academy ES — La célula", url: "https://es.khanacademy.org", desc: "Vídeos sobre teoría celular, organelas y mitosis." }, { nombre: "Academia Play — La célula", url: "https://www.youtube.com/@AcademiaPlay", desc: "Vídeos divulgativos adaptados a secundaria." }],
      "simulacion":   [{ nombre: "PhET — División celular", url: "https://phet.colorado.edu/es/simulations/cell-division", desc: "Simulación de mitosis y meiosis paso a paso." }],
      "interactivo":  [{ nombre: "Wordwall — La célula", url: "https://wordwall.net/es/community/célula", desc: "Actividades gamificadas sobre organelas y funciones." }, { nombre: "Educaplay — La célula", url: "https://es.educaplay.com/recursos-educativos/4210290-partes_de_la_celula.html", desc: "Mapas interactivos y tests sobre la célula." }],
      "material":     [{ nombre: "Procomún INTEF — La célula", url: "https://procomun.intef.es", desc: "Secuencias didácticas completas con actividades autoevaluables." }],
      "portal":       [{ nombre: "Gobierno de Canarias — Recursos célula", url: "https://www3.gobiernodecanarias.org/medusa/ecoescuela/recursosdigitales/tag/celula/", desc: "Recopilación curada por docentes españoles." }]
    },
    "seres-vivos": {
      "video":        [{ nombre: "Khan Academy ES — Clasificación", url: "https://es.khanacademy.org", desc: "Vídeos sobre los reinos, taxonomía y grupos principales." }],
      "simulacion":   [{ nombre: "iNaturalist", url: "https://www.inaturalist.org", desc: "Identifica seres vivos del entorno con fotografías." }],
      "interactivo":  [{ nombre: "Wordwall — Seres vivos", url: "https://wordwall.net/es/community/seres-vivos", desc: "Actividades interactivas sobre clasificación de seres vivos." }, { nombre: "Educaplay — Seres vivos", url: "https://es.educaplay.com", desc: "Tests y mapas sobre los reinos de los seres vivos." }],
      "material":     [{ nombre: "Procomún INTEF — Seres vivos", url: "https://procomun.intef.es", desc: "Secuencias didácticas alineadas con la LOMLOE." }],
      "portal":       [{ nombre: "MNCN — Museo Nacional Ciencias Naturales", url: "https://www.mncn.csic.es/es/visita-el-mncn/actividades/recursos-digitales-accesibles", desc: "Recursos digitales del CSIC sobre biodiversidad." }]
    },
    "ecologia": {
      "video":        [{ nombre: "Khan Academy ES — Ecología", url: "https://es.khanacademy.org", desc: "Vídeos sobre ecosistemas y cadenas tróficas." }],
      "simulacion":   [{ nombre: "NASA Climate Kids", url: "https://climatekids.nasa.gov/es", desc: "Recursos interactivos sobre cambio climático con datos reales." }],
      "interactivo":  [{ nombre: "Ambientech — Ecosistemas", url: "https://ambientech.org", desc: "Itinerarios sobre ecosistemas, biodiversidad y sostenibilidad." }],
      "material":     [{ nombre: "WWF España — Recursos educativos", url: "https://www.wwf.es/que_hacemos/educacion", desc: "Materiales sobre biodiversidad y desarrollo sostenible." }],
      "portal":       [{ nombre: "Ambientech — Ecosistemas", url: "https://ambientech.org", desc: "Itinerarios interactivos sobre ecología y medioambiente." }]
    },
    "habitos": {
      "video":        [{ nombre: "UNICEF Educa — Salud en la escuela", url: "https://www.unicef.es/educa/biblioteca/educacion-salud-actividades-recursos", desc: "Cuadernos de actividades sobre salud y bienestar." }],
      "simulacion":   [{ nombre: "Ministerio de Sanidad — Estilos de Vida", url: "https://estilosdevidasaludable.sanidad.gob.es", desc: "Herramientas interactivas sobre alimentación y actividad física." }],
      "interactivo":  [{ nombre: "Wordwall — Hábitos saludables", url: "https://wordwall.net/es/community/habitos-saludables", desc: "Actividades sobre alimentación y salud corporal." }],
      "material":     [{ nombre: "AECC — Educación para la salud", url: "https://www.aecc.es/es/todo-sobre-cancer/prevencion/educacion", desc: "Materiales sobre prevención del tabaco y alcohol." }, { nombre: "Proyecto EDIA — Salud", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje sobre hábitos saludables." }],
      "portal":       [{ nombre: "Ministerio de Sanidad — Estilos de Vida", url: "https://estilosdevidasaludable.sanidad.gob.es", desc: "Portal oficial con recursos sobre hábitos saludables." }]
    }
  },
  "3eso": {
    "proyecto-cientifico": {
      "video":        [{ nombre: "Khan Academy ES — Método científico", url: "https://es.khanacademy.org", desc: "Vídeos y ejercicios sobre método científico avanzado." }],
      "simulacion":   [{ nombre: "PhET Interactive Simulations", url: "https://phet.colorado.edu/es", desc: "Simulaciones para diseñar y ejecutar experimentos virtuales." }],
      "interactivo":  [{ nombre: "Scientix — European Schoolnet", url: "https://www.scientix.eu", desc: "Proyectos de indagación científica para secundaria." }],
      "material":     [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Unidades didácticas alineadas con la LOMLOE." }],
      "portal":       [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje basadas en indagación." }]
    },
    "geologia": {
      "video":        [{ nombre: "Khan Academy ES — Geología", url: "https://es.khanacademy.org", desc: "Vídeos sobre tectónica de placas y geodinámica." }],
      "simulacion":   [{ nombre: "Google Earth", url: "https://earth.google.com/web/", desc: "Exploración de relieves, fallas y volcanes en 3D." }],
      "interactivo":  [{ nombre: "Ambientech — Ciencias de la Tierra", url: "https://ambientech.org", desc: "Itinerarios sobre geología y riesgos naturales." }],
      "material":     [{ nombre: "Prácticas Geología", url: "https://practicasgeologia.com", desc: "Dinámicas y prácticas para enseñar geología." }],
      "portal":       [{ nombre: "IGME — Instituto Geológico y Minero", url: "https://www.igme.es", desc: "Mapas geológicos y recursos didácticos oficiales." }]
    },
    "celula": {
      "video":        [{ nombre: "Khan Academy ES — La célula", url: "https://es.khanacademy.org", desc: "Mitosis y meiosis en profundidad, ciclo celular." }],
      "simulacion":   [{ nombre: "PhET — División celular", url: "https://phet.colorado.edu/es/simulations/cell-division", desc: "Simulación interactiva de mitosis y meiosis." }],
      "interactivo":  [{ nombre: "Wordwall — La célula", url: "https://wordwall.net/es/community/célula", desc: "Actividades gamificadas sobre división celular." }],
      "material":     [{ nombre: "Procomún INTEF — La célula", url: "https://procomun.intef.es", desc: "Secuencias didácticas con autoevaluación." }],
      "portal":       [{ nombre: "Gobierno de Canarias — Recursos célula", url: "https://www3.gobiernodecanarias.org/medusa/ecoescuela/recursosdigitales/tag/celula/", desc: "Recopilación de recursos sobre la célula." }]
    },
    "habitos": {
      "video":        [{ nombre: "UNICEF Educa — Salud", url: "https://www.unicef.es/educa/biblioteca/educacion-salud-actividades-recursos", desc: "Recursos sobre salud física y mental." }],
      "simulacion":   [{ nombre: "Ministerio de Sanidad", url: "https://estilosdevidasaludable.sanidad.gob.es", desc: "Herramientas sobre actividad física y alimentación." }],
      "interactivo":  [{ nombre: "Wordwall — Hábitos saludables", url: "https://wordwall.net/es/community/habitos-saludables", desc: "Actividades sobre salud física y mental." }],
      "material":     [{ nombre: "Proyecto EDIA — Salud", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje sobre hábitos saludables." }],
      "portal":       [{ nombre: "Escuela Madrileña de Salud", url: "https://www.comunidad.madrid/hospital/atencionprimaria/ciudadanos/recursos-educativos-digitalizados", desc: "Recursos para centros de la Comunidad de Madrid." }]
    },
    "cuerpo-humano": {
      "video":        [{ nombre: "Khan Academy ES — Cuerpo humano", url: "https://es.khanacademy.org", desc: "Vídeos sobre aparatos y sistemas del cuerpo humano." }],
      "simulacion":   [{ nombre: "BioDigital Human", url: "https://human.biodigital.com", desc: "Modelos 3D interactivos del cuerpo humano completo." }, { nombre: "Visible Body", url: "https://www.visiblebody.com/es/", desc: "Anatomía 3D interactiva con todos los sistemas." }],
      "interactivo":  [{ nombre: "Anatomía Humana 3D — UACH", url: "https://anatomiahumana3d.com", desc: "Plataforma abierta para visualizar órganos en 3D." }, { nombre: "Wordwall — Cuerpo humano", url: "https://wordwall.net/es/community/juegos-del-cuerpo-humano", desc: "Diagramas para etiquetar y cuestionarios de anatomía." }],
      "material":     [{ nombre: "Proyecto EDIA — El cuerpo humano", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje sobre anatomía y fisiología." }],
      "portal":       [{ nombre: "Gobierno de Canarias — Anatomía", url: "https://www3.gobiernodecanarias.org/medusa/ecoescuela/recursosdigitales/tag/anatomia/", desc: "Enciclopedia ilustrada sobre aparatos y sistemas." }]
    },
    "salud-enfermedad": {
      "video":        [{ nombre: "Khan Academy ES — Sistema inmunitario", url: "https://es.khanacademy.org", desc: "Vídeos sobre inmunología, vacunas y anticuerpos." }],
      "simulacion":   [{ nombre: "Xplore Health", url: "https://www.xplorehealth.eu", desc: "Laboratorios virtuales sobre vacunas e inmunología." }],
      "interactivo":  [{ nombre: "Siemens Stiftung — Sistema inmune", url: "https://crea-portaldemedios.siemens-stiftung.org/material-didactico-sobre-la-salud", desc: "Materiales sobre sistema inmune y educación sexual." }],
      "material":     [{ nombre: "ONT — Donación y trasplantes", url: "https://www.ont.es", desc: "Materiales oficiales sobre donación de órganos." }],
      "portal":       [{ nombre: "MedlinePlus en español", url: "https://medlineplus.gov/spanish/", desc: "Enciclopedia médica oficial de los NIH." }]
    }
  },
  "4eso": {
    "proyecto-cientifico": {
      "video":        [{ nombre: "Khan Academy ES — Método científico", url: "https://es.khanacademy.org", desc: "Metodología avanzada y evaluación crítica." }],
      "simulacion":   [{ nombre: "PhET Interactive Simulations", url: "https://phet.colorado.edu/es", desc: "Simulaciones para investigaciones avanzadas." }],
      "interactivo":  [{ nombre: "Scientix — European Schoolnet", url: "https://www.scientix.eu", desc: "Proyectos europeos de indagación científica." }],
      "material":     [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Situaciones de aprendizaje alineadas con LOMLOE." }],
      "portal":       [{ nombre: "Proyecto EDIA — CEDEC/INTEF", url: "https://cedec.intef.es", desc: "Unidades didácticas para 4.º ESO." }]
    },
    "geologia": {
      "video":        [{ nombre: "Khan Academy ES — Geología", url: "https://es.khanacademy.org", desc: "Historia terrestre y principios estratigráficos." }],
      "simulacion":   [{ nombre: "Google Earth", url: "https://earth.google.com/web/", desc: "Lectura de mapas geológicos y cortes en 3D." }],
      "interactivo":  [{ nombre: "Ambientech — Ciencias de la Tierra", url: "https://ambientech.org", desc: "Geodinámica interna y externa avanzada." }],
      "material":     [{ nombre: "Proyecto EDIA — Geodiversidad", url: "https://cedec.intef.es", desc: "Investigando la geodiversidad y el patrimonio geológico." }],
      "portal":       [{ nombre: "IGME — Instituto Geológico y Minero", url: "https://www.igme.es", desc: "Mapas geológicos y herramientas avanzadas." }]
    },
    "celula": {
      "video":        [{ nombre: "Khan Academy ES — La célula avanzada", url: "https://es.khanacademy.org", desc: "Meiosis avanzada y variabilidad genética." }],
      "simulacion":   [{ nombre: "PhET — División celular", url: "https://phet.colorado.edu/es/simulations/cell-division", desc: "Meiosis y relación con la herencia genética." }],
      "interactivo":  [{ nombre: "Wordwall — La célula", url: "https://wordwall.net/es/community/célula", desc: "Actividades sobre división celular avanzada." }],
      "material":     [{ nombre: "Procomún INTEF — La célula", url: "https://procomun.intef.es", desc: "Secuencias didácticas con nivel avanzado." }],
      "portal":       [{ nombre: "Gobierno de Canarias — Recursos célula", url: "https://www3.gobiernodecanarias.org/medusa/ecoescuela/recursosdigitales/tag/celula/", desc: "Recursos sobre célula para bachillerato." }]
    },
    "genetica-evolucion": {
      "video":        [{ nombre: "Khan Academy ES — Genética y evolución", url: "https://es.khanacademy.org", desc: "ADN, expresión génica, Mendel y teorías evolutivas." }],
      "simulacion":   [{ nombre: "PhET — Genética de la mosca del vinagre", url: "https://phet.colorado.edu/es/simulations/fruit-fly-genetics", desc: "Cruzamientos genéticos con Drosophila." }],
      "interactivo":  [{ nombre: "Congen.es", url: "https://www.congen.es", desc: "Recursos sobre alelos, cromosomas y herencia." }, { nombre: "HHMI BioInteractive", url: "https://www.biointeractive.org/es", desc: "Animaciones y talleres sobre genética y evolución." }],
      "material":     [{ nombre: "La RuBisCO es lo más", url: "https://www.larubiscoeslomas.com", desc: "Blog docente con materiales prácticos para el aula." }],
      "portal":       [{ nombre: "Aprende Genética — Universidad de Alcalá", url: "https://aprendegenomica.es", desc: "Plataforma española de genética interactiva." }]
    },
    "tierra-universo": {
      "video":        [{ nombre: "Khan Academy ES — Cosmología", url: "https://es.khanacademy.org", desc: "Origen del universo y formación del sistema solar." }, { nombre: "QuantumFracture", url: "https://www.youtube.com/@QuantumFracture", desc: "Divulgación científica rigurosa sobre el cosmos." }],
      "simulacion":   [{ nombre: "Stellarium", url: "https://stellarium-web.org", desc: "Planetario en tiempo real, código abierto." }],
      "interactivo":  [{ nombre: "NASA Space Place", url: "https://spaceplace.nasa.gov/sp/", desc: "Animaciones y juegos sobre el sistema solar." }],
      "material":     [{ nombre: "NASA en español", url: "https://www.nasa.gov/es/", desc: "Recursos sobre astrobiología y exploración espacial." }],
      "portal":       [{ nombre: "Astrobiology at NASA", url: "https://astrobiology.nasa.gov", desc: "Portal científico sobre el origen de la vida." }]
    }
  }
};

const BLOQUES = {
  "1eso": [
    { id: "proyecto-cientifico", label: "Proyecto científico", emoji: "🔭" },
    { id: "geologia",            label: "Geología",            emoji: "🪨" },
    { id: "celula",              label: "La célula",           emoji: "🧬" },
    { id: "seres-vivos",         label: "Seres vivos",         emoji: "🌿" },
    { id: "ecologia",            label: "Ecología y sostenibilidad", emoji: "🌍" },
    { id: "habitos",             label: "Hábitos saludables",  emoji: "🥗" }
  ],
  "3eso": [
    { id: "proyecto-cientifico", label: "Proyecto científico", emoji: "🔭" },
    { id: "geologia",            label: "Geología",            emoji: "🪨" },
    { id: "celula",              label: "La célula",           emoji: "🧬" },
    { id: "habitos",             label: "Hábitos saludables",  emoji: "🥗" },
    { id: "cuerpo-humano",       label: "Cuerpo humano",       emoji: "🫀" },
    { id: "salud-enfermedad",    label: "Salud y enfermedad",  emoji: "💉" }
  ],
  "4eso": [
    { id: "proyecto-cientifico",  label: "Proyecto científico",   emoji: "🔭" },
    { id: "geologia",             label: "Geología",              emoji: "🪨" },
    { id: "celula",               label: "La célula",             emoji: "🧬" },
    { id: "genetica-evolucion",   label: "Genética y evolución",  emoji: "🧪" },
    { id: "tierra-universo",      label: "La Tierra en el universo", emoji: "🌌" }
  ]
};

const TIPOS = [
  { id: "video",      label: "Vídeo",               emoji: "🎬" },
  { id: "simulacion", label: "Simulación",           emoji: "🔬" },
  { id: "interactivo",label: "Interactivo",          emoji: "🎮" },
  { id: "material",   label: "Material descargable", emoji: "📄" },
  { id: "portal",     label: "Portal educativo",     emoji: "🌐" }
];

const DISPOSITIVOS = [
  { id: "cualquiera", label: "Cualquier dispositivo", emoji: "💻" },
  { id: "movil",      label: "Principalmente móvil",  emoji: "📱" },
  { id: "ordenador",  label: "Ordenadores",           emoji: "🖥️" }
];

let estado = { curso: null, bloque: null, tipo: null, dispositivo: null };

function crearChatbot() {
  const css = `
    #bg-chatbot-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: #4E342E;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: transform 0.2s, background 0.2s;
      border: 2px solid #FF8F00;
    }
    #bg-chatbot-btn:hover { transform: scale(1.08); background: #3E2723; }
    #bg-chatbot-btn svg { width: 28px; height: 28px; }

    #bg-chatbot-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 340px;
      max-height: 520px;
      background: #FAFAF7;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      border: 1px solid rgba(0,0,0,0.08);
      display: none;
      flex-direction: column;
      z-index: 1000;
      overflow: hidden;
    }

    #bg-chatbot-panel.open { display: flex; }

    .bg-chat-header {
      background: #4E342E;
      padding: 1rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #FF8F00;
    }

    .bg-chat-header-info { display: flex; align-items: center; gap: 10px; }

    .bg-chat-avatar {
      width: 34px;
      height: 34px;
      background: #FF8F00;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .bg-chat-title {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: #FFF;
      letter-spacing: -0.01em;
    }

    .bg-chat-subtitle {
      font-size: 0.65rem;
      color: rgba(255,255,255,0.55);
      font-weight: 300;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .bg-chat-header-actions { display: flex; gap: 6px; }

    .bg-chat-close, .bg-chat-dismiss {
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 6px;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      font-size: 0.7rem;
      font-family: 'DM Sans', sans-serif;
      padding: 4px 8px;
      transition: background 0.2s;
    }

    .bg-chat-close:hover, .bg-chat-dismiss:hover { background: rgba(255,255,255,0.2); color: #FFF; }

    .bg-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bg-msg {
      max-width: 85%;
      padding: 0.7rem 0.9rem;
      border-radius: 12px;
      font-size: 0.82rem;
      line-height: 1.55;
      font-family: 'DM Sans', sans-serif;
    }

    .bg-msg.bot {
      background: #FFF;
      border: 1px solid rgba(0,0,0,0.08);
      color: #1C1C1A;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .bg-msg.user {
      background: #4E342E;
      color: #FFF;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .bg-chat-options {
      padding: 0.75rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .bg-opt-btn {
      background: #FFF;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      padding: 0.55rem 0.9rem;
      font-size: 0.8rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-align: left;
      color: #1C1C1A;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bg-opt-btn:hover { background: #EFEBE9; border-color: #8D6E63; color: #4E342E; }

    .bg-resultado {
      background: #FFF;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 10px;
      padding: 0.8rem;
      margin-top: 0.25rem;
    }

    .bg-resultado h4 {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 0.88rem;
      font-weight: 500;
      color: #1C1C1A;
      margin-bottom: 0.3rem;
    }

    .bg-resultado p {
      font-size: 0.75rem;
      color: #6B6B67;
      line-height: 1.5;
      margin-bottom: 0.6rem;
    }

    .bg-resultado a {
      display: inline-block;
      background: #4E342E;
      color: #FFF;
      text-decoration: none;
      font-size: 0.72rem;
      font-weight: 500;
      padding: 0.3rem 0.8rem;
      border-radius: 6px;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.2s;
    }

    .bg-resultado a:hover { background: #3E2723; }

    .bg-buscar-mas {
      background: #E8F5E9;
      border: 1px solid #4CAF50;
      border-radius: 8px;
      padding: 0.55rem 0.9rem;
      font-size: 0.8rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-align: left;
      color: #1B5E20;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin-top: 0.25rem;
    }

    .bg-buscar-mas:hover { background: #C8E6C9; }

    .bg-reiniciar {
      background: none;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      padding: 0.55rem 0.9rem;
      font-size: 0.8rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-align: left;
      color: #6B6B67;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .bg-reiniciar:hover { background: #f5f5f5; color: #1C1C1A; }

    @media (max-width: 400px) {
      #bg-chatbot-panel { width: calc(100vw - 32px); right: 16px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const btn = document.createElement('button');
  btn.id = 'bg-chatbot-btn';
  btn.setAttribute('aria-label', 'Abrir asistente de recursos');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.37 17.07L2 22L6.93 20.63C8.42 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#FF8F00"/>
    <path d="M8 11H16M8 15H13" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  const panel = document.createElement('div');
  panel.id = 'bg-chatbot-panel';
  panel.innerHTML = `
    <div class="bg-chat-header">
      <div class="bg-chat-header-info">
        <div class="bg-chat-avatar">🌍</div>
        <div>
          <div class="bg-chat-title">Asistente REA</div>
          <div class="bg-chat-subtitle">BioGeo logIA</div>
        </div>
      </div>
      <div class="bg-chat-header-actions">
        <button class="bg-chat-dismiss" onclick="bgDismiss()" title="No mostrar más">✕✕</button>
        <button class="bg-chat-close" onclick="bgToggle()" title="Cerrar">✕</button>
      </div>
    </div>
    <div class="bg-chat-messages" id="bg-messages"></div>
    <div class="bg-chat-options" id="bg-options"></div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener('click', bgToggle);

  bgInicio();
}

function bgToggle() {
  const panel = document.getElementById('bg-chatbot-panel');
  panel.classList.toggle('open');
}

function bgDismiss() {
  document.getElementById('bg-chatbot-panel').classList.remove('open');
  document.getElementById('bg-chatbot-btn').style.display = 'none';
  sessionStorage.setItem('bg-chatbot-dismissed', '1');
}

function bgMensaje(texto, tipo = 'bot') {
  const msgs = document.getElementById('bg-messages');
  const div = document.createElement('div');
  div.className = `bg-msg ${tipo}`;
  div.innerHTML = texto;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function bgOpciones(opciones) {
  const opts = document.getElementById('bg-options');
  opts.innerHTML = '';
  opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'bg-opt-btn';
    btn.innerHTML = `<span>${op.emoji || ''}</span> ${op.label}`;
    btn.onclick = op.accion;
    opts.appendChild(btn);
  });
}

function bgInicio() {
  if (sessionStorage.getItem('bg-chatbot-dismissed')) {
    document.getElementById('bg-chatbot-btn').style.display = 'none';
    return;
  }
  estado = { curso: null, bloque: null, tipo: null, dispositivo: null };
  const msgs = document.getElementById('bg-messages');
  if (msgs) msgs.innerHTML = '';
  bgMensaje('¡Hola! Soy el asistente de <strong>BioGeo logIA</strong>. Te ayudo a encontrar el recurso más adecuado para tu clase. ¿Para qué curso lo necesitas?');
  bgOpciones([
    { emoji: '1️⃣', label: '1.º ESO', accion: () => bgSeleccionarCurso('1eso') },
    { emoji: '3️⃣', label: '3.º ESO', accion: () => bgSeleccionarCurso('3eso') },
    { emoji: '4️⃣', label: '4.º ESO', accion: () => bgSeleccionarCurso('4eso') }
  ]);
}

function bgSeleccionarCurso(curso) {
  estado.curso = curso;
  const labels = { '1eso': '1.º ESO', '3eso': '3.º ESO', '4eso': '4.º ESO' };
  bgMensaje(labels[curso], 'user');
  bgMensaje('Perfecto. ¿Qué bloque temático quieres trabajar?');
  bgOpciones(BLOQUES[curso].map(b => ({
    emoji: b.emoji,
    label: b.label,
    accion: () => bgSeleccionarBloque(b.id, b.label)
  })));
}

function bgSeleccionarBloque(bloque, label) {
  estado.bloque = bloque;
  bgMensaje(label, 'user');
  bgMensaje('¿Qué tipo de recurso prefieres para tu clase?');
  bgOpciones(TIPOS.map(t => ({
    emoji: t.emoji,
    label: t.label,
    accion: () => bgSeleccionarTipo(t.id, t.label)
  })));
}

function bgSeleccionarTipo(tipo, label) {
  estado.tipo = tipo;
  bgMensaje(label, 'user');
  bgMensaje('Última pregunta: ¿qué dispositivos tienen tus alumnos en clase?');
  bgOpciones(DISPOSITIVOS.map(d => ({
    emoji: d.emoji,
    label: d.label,
    accion: () => bgMostrarResultados(d.id, d.label)
  })));
}

function bgMostrarResultados(dispositivo, label) {
  estado.dispositivo = dispositivo;
  bgMensaje(label, 'user');

  const recursos = RECURSOS[estado.curso]?.[estado.bloque]?.[estado.tipo] || [];

  if (recursos.length === 0) {
    bgMensaje('No he encontrado recursos específicos para esta combinación. Prueba con otro tipo de recurso.');
  } else {
    bgMensaje(`¡Aquí tienes ${recursos.length > 1 ? 'mis recomendaciones' : 'mi recomendación'}! 🎯`);
    const msgs = document.getElementById('bg-messages');
    recursos.forEach(r => {
      const div = document.createElement('div');
      div.className = 'bg-resultado';
      div.innerHTML = `<h4>${r.nombre}</h4><p>${r.desc}</p><a href="${r.url}" target="_blank">Acceder al recurso →</a>`;
      msgs.appendChild(div);
    });
    msgs.scrollTop = msgs.scrollHeight;
  }

  const bloqueLabel = BLOQUES[estado.curso]?.find(b => b.id === estado.bloque)?.label || estado.bloque;
  const tipoLabel = TIPOS.find(t => t.id === estado.tipo)?.label || estado.tipo;
  const query = encodeURIComponent(`${bloqueLabel} ${tipoLabel} secundaria recursos educativos abiertos`);
  const urlBusqueda = `https://www.google.com/search?q=${query}`;

  const opts = document.getElementById('bg-options');
  opts.innerHTML = '';

  const btnMas = document.createElement('button');
  btnMas.className = 'bg-buscar-mas';
  btnMas.innerHTML = '🔍 Buscar más recursos similares';
  btnMas.onclick = () => window.open(urlBusqueda, '_blank');
  opts.appendChild(btnMas);

  const btnReiniciar = document.createElement('button');
  btnReiniciar.className = 'bg-reiniciar';
  btnReiniciar.innerHTML = '↩ Hacer otra búsqueda';
  btnReiniciar.onclick = bgInicio;
  opts.appendChild(btnReiniciar);
}

document.addEventListener('DOMContentLoaded', crearChatbot);