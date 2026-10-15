import type { EngineId } from "../content";

export type Locale = "it" | "en";

export type Problem = {
  id: string;
  problem: string;
  /** Short, dominant answer line. */
  solution: string;
  /** One supporting sentence, secondary weight. */
  detail: string;
  engine: EngineId | "tailor";
  icon: "doc" | "chat" | "moon" | "loan" | "needle";
};

const it = {
  skip: "Vai al contenuto",
  lang: { label: "Lingua", it: "Italiano", en: "English" },
  nav: {
    home: "One Tech — torna all'inizio",
    main: "Principale",
    mobile: "Menu mobile",
    links: [
      { href: "#motori", label: "Prodotti" },
      { href: "#tailor-lab", label: "Tailor Lab" },
      { href: "#metodo", label: "Come lavoriamo" },
      { href: "#contatti", label: "Contatti" },
    ],
    cta: "Parliamo del tuo progetto",
    menu: "Menu",
    close: "Chiudi",
  },
  hero: {
    hard: "Difficile?",
    answer: "Non per noi.",
    sub: "Software, AI e automazioni su misura. Online in settimane, non in mesi.",
    ctaPrimary: "Parliamo del tuo progetto",
    ctaSecondary: "Guarda come",
    hint: "Scorri: lo districhiamo noi",
    fragments: [
      "contratto_v3_DEFINITIVO_2.pdf",
      "WhatsApp · 23:47 — Mi richiama domani?",
      "47 email non lette",
      "Chi ha l'ultima versione dell'Excel?",
      "Pratica #2481: manca un documento",
      "Instagram · 12 nuovi messaggi",
      "Copiare i dati nel gestionale!!",
      "Chiamate perse (3)",
      "IBAN sbagliato, rifare tutto",
      "Riunione spostata alle 18:30",
      "Scansione_0042.jpg",
      "Ricontattare il cliente ⚠",
    ],
    bubble: { who: "Giulia · Ufficio crediti", text: "Pratiche chiuse. Oggi esco alle 17 🙌", time: "16:52" },
  },
  problems: {
    title: ["Cosa ti sembra ", "difficile", ", oggi?"],
    intro: "Cinque frasi che sentiamo ogni settimana. Trova quella che ti somiglia: dietro c'è la soluzione.",
    labelProblem: "Il problema",
    labelSolution: "La soluzione",
    hintHover: "Passa sopra per la soluzione",
    hintTouch: "Tocca per la soluzione",
    solved: "✓ Risolto",
    discover: "Scopri",
    prev: "Card precedente",
    next: "Card successiva",
    cardLabel: "Problema",
    items: [
      {
        id: "documenti",
        problem: "Copio a mano i dati da decine di documenti ogni giorno.",
        solution: "Li legge ARGO. Da solo.",
        detail: "Estrae i dati da ogni documento e li porta nel tuo gestionale. Niente più copia-incolla.",
        engine: "argo",
        icon: "doc",
      },
      {
        id: "canali",
        problem: "I clienti mi scrivono su WhatsApp, Instagram e email: perdo i messaggi.",
        solution: "Una sola chat per tutto.",
        detail: "ALL MESSAGE riunisce ogni canale in un'unica conversazione. Nessun messaggio si perde.",
        engine: "allmessage",
        icon: "chat",
      },
      {
        id: "notte",
        problem: "Le richieste arrivano anche di notte, e nessuno risponde.",
        solution: "MILO risponde. Sempre.",
        detail: "L'agente AI raccoglie i dati del cliente a qualsiasi ora e te lo passa pronto al mattino.",
        engine: "milo",
        icon: "moon",
      },
      {
        id: "prestiti",
        problem: "Le pratiche di prestito sono lente e piene di passaggi.",
        solution: "Dalla richiesta all'erogazione, in un posto.",
        detail: "KORE segue tutta la pratica per agenti e mediatori del credito. Senza fogli Excel.",
        engine: "kore",
        icon: "loan",
      },
      {
        id: "altro",
        problem: "Il mio problema non è in questa lista.",
        solution: "Allora lo costruiamo su misura.",
        detail: "Al Tailor Lab partiamo dal tuo problema e cuciamo lo strumento che ancora non esiste.",
        engine: "tailor",
        icon: "needle",
      },
    ] as Problem[],
  },
  engines: {
    title: ["Quattro motori. ", "Un ecosistema."],
    intro:
      "Ogni motore fa un lavoro, e lo fa bene. Da soli risolvono un problema; insieme coprono l'intero percorso del tuo cliente. Guardali al lavoro qui sotto.",
    demoCta: "Richiedi una demo di",
    items: {
      kore: {
        domain: "Credito",
        tagline: "Non serve nascere fintech. Basta KORE.",
        description:
          "Un ecosistema plug and play per agenti e mediatori del credito al consumo. Segue la pratica di prestito dall'inizio alla fine, senza fogli Excel né rincorse.",
      },
      argo: {
        domain: "Documenti",
        tagline: "Legge i documenti al posto tuo.",
        description:
          "Prende qualsiasi documento e ne estrae i dati che servono, già ordinati. Si collega al tuo gestionale o CRM, oppure lo usi direttamente dal browser.",
      },
      allmessage: {
        domain: "Conversazioni",
        tagline: "Quattro app. Una sola chat.",
        description:
          "WhatsApp, Instagram, Facebook ed email in un'unica conversazione. Vedi tutta la storia del cliente, ovunque sia iniziata: nessun messaggio perso per strada.",
      },
      milo: {
        domain: "AI Agent",
        tagline: "Risponde, raccoglie, accompagna.",
        description:
          "L'agente AI che parla con i tuoi clienti, raccoglie le informazioni giuste e li guida passo passo. Ogni conversazione diventa un'opportunità pronta da gestire.",
      },
    } as Record<EngineId, { domain: string; tagline: string; description: string }>,
  },
  demos: {
    kore: {
      case: "Pratica #2481 · Prestito auto",
      steps: ["Richiesta", "Documenti", "Valutazione", "Erogata"],
    },
    argo: [
      ["Nome", "Giulia Bianchi"],
      ["Codice fiscale", "BNCGLI88M41F205X"],
      ["Reddito", "€ 2.150 / mese"],
      ["IBAN", "IT60 X054 2811 1010"],
    ],
    allmessage: {
      head: "Marta R. · 1 conversazione",
      thread: [
        "Ciao! Avete disponibilità sabato?",
        "Sono Marta, vi ho scritto su Instagram 🙂",
        "Vi giro i documenti richiesti.",
        "Perfetto, a sabato!",
      ],
    },
    milo: [
      "Vorrei un prestito per la macchina.",
      "Certo! Di quanto hai bisogno, più o meno?",
      "Circa 15.000 €.",
      "Perfetto. Ho preparato la richiesta: ti richiama un consulente oggi.",
    ],
  },
  tailor: {
    title: ["Tailor made, ", "come solo il made in Italy sa fare."],
    leadA: "Nessun business è uguale a un altro. Quando lo strumento giusto non esiste ancora, ",
    leadStrong: "lo costruiamo",
    body: "Tailor Lab è il nostro laboratorio. Partiamo dal problema della tua azienda, prendiamo le misure e cuciamo il software o l'agente AI che serve, integrandolo nei processi che usi già. KORE è nato così: studiando un settore a fondo, fino a capirne ogni piega.",
    cta: "Porta il tuo problema al Tailor Lab",
    file: "cartamodello.js",
    fit: "fit: su misura",
    pattern: [
      { fn: "tailor.measure", args: 'azienda="la tua", processi=reali' },
      { fn: "pattern.cut", args: 'fit="su_misura"' },
      { fn: "agent.build", args: 'problema="il vostro"' },
      { fn: "integrate", args: "crm, gestionale, chat" },
    ],
    note: "Taglio, prova, ritocco. Finché non veste perfetto.",
  },
  method: {
    title: ["Altrove ci vogliono mesi. ", "Qui, settimane."],
    intro:
      "Il segreto non è correre: è non ripartire da zero. I nostri motori sono già collaudati, li cuciamo addosso alla tua azienda.",
    raceLabel: "Confronto: il software generalista richiede mesi, One Tech poche settimane.",
    slow: { name: "Software generalista", note: "Sei tu ad adattarti al software", bar: "Mesi" },
    fast: { name: "One Tech", note: "Il software si adatta a te", bar: "Settimane ✓" },
    step: "Passo",
    steps: [
      {
        title: "Ci racconti cosa è difficile",
        text: "Una chiamata, zero gergo tecnico. Ci spieghi come lavori oggi e dove perdi tempo: al resto pensiamo noi.",
      },
      {
        title: "Scegliamo il motore e lo cuciamo",
        text: "Partiamo da motori già pronti e li adattiamo al tuo settore, invece di ricominciare ogni volta da zero.",
      },
      {
        title: "Lo accendi. Funziona.",
        text: "Online in poche settimane, collegato agli strumenti che usi già. E noi restiamo al tuo fianco.",
      },
    ],
  },
  contact: {
    titleA: "Raccontaci cosa è ",
    titleEm: "difficile.",
    titleB: "Al resto pensiamo noi.",
    lead: "Scrivici due righe: ti risponde una persona del team, entro un giorno lavorativo.",
    whatsapp: "Preferisci WhatsApp? Scrivici in chat",
    labels: { sales: "Commerciale", partnerships: "Partnership", press: "Stampa", address: "Dove siamo" },
    footer: "Footer",
    copy: "© 2026 One Tech. Difficile? Non per noi.",
  },
  form: {
    legend: "Modulo di contatto",
    required: "obbligatorio",
    optional: "facoltativo",
    requiredNote: "I campi contrassegnati come obbligatori servono per poterti rispondere.",
    name: { label: "Nome e cognome" },
    email: { label: "Email di lavoro" },
    company: { label: "Azienda" },
    topic: {
      label: "Di cosa hai bisogno?",
      options: [
        { value: "demo", label: "Una demo di un prodotto" },
        { value: "custom", label: "Un progetto su misura" },
        { value: "partnership", label: "Una partnership" },
        { value: "other", label: "Altro" },
      ],
    },
    message: { label: "Raccontaci il problema", hint: "Anche poche righe vanno benissimo." },
    consent: {
      label: "Acconsento al trattamento dei miei dati per essere ricontattato da One Tech.",
    },
    submit: "Invia la richiesta",
    sending: "Invio in corso…",
    errors: {
      summary: (n: number) => (n === 1 ? "C'è 1 campo da sistemare:" : `Ci sono ${n} campi da sistemare:`),
      nameRequired: "Scrivi il tuo nome e cognome.",
      nameShort: "Il nome sembra troppo corto: almeno 2 caratteri.",
      emailRequired: "Scrivi la tua email, così possiamo risponderti.",
      emailInvalid: "Questa email non sembra corretta. Esempio: nome@azienda.it",
      topicRequired: "Scegli una delle opzioni.",
      messageRequired: "Scrivi qualche riga sul tuo problema.",
      messageShort: "Raccontaci qualcosa in più: almeno 10 caratteri.",
      consentRequired: "Per inviare la richiesta serve il tuo consenso.",
      network: "Non siamo riusciti a inviare il messaggio. Controlla la connessione e riprova, oppure scrivici a sales@otech.one.",
    },
    success: {
      title: "Richiesta inviata. Grazie!",
      text: (name: string) =>
        `Ciao ${name}, abbiamo ricevuto il tuo messaggio. Una persona del team ti risponde entro un giorno lavorativo.`,
      again: "Invia un'altra richiesta",
    },
  },
  youAreHere: {
    nav: "Avanzamento pagina",
    here: "Sei qui",
    next: "Avanti",
    sections: ["Cosa è difficile", "I quattro motori", "Tailor Lab", "Come lavoriamo", "Contatti"],
  },
};

export type Dict = typeof it;

const en: Dict = {
  skip: "Skip to content",
  lang: { label: "Language", it: "Italiano", en: "English" },
  nav: {
    home: "One Tech — back to top",
    main: "Main",
    mobile: "Mobile menu",
    links: [
      { href: "#motori", label: "Products" },
      { href: "#tailor-lab", label: "Tailor Lab" },
      { href: "#metodo", label: "How we work" },
      { href: "#contatti", label: "Contact" },
    ],
    cta: "Let's talk about your project",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    hard: "Difficult?",
    answer: "Not for us.",
    sub: "Tailor-made software, AI and automation. Live in weeks, not months.",
    ctaPrimary: "Let's talk about your project",
    ctaSecondary: "See how",
    hint: "Scroll: we'll untangle it",
    fragments: [
      "contract_v3_FINAL_2.pdf",
      "WhatsApp · 23:47 — Call me tomorrow?",
      "47 unread emails",
      "Who has the latest Excel?",
      "Application #2481: document missing",
      "Instagram · 12 new messages",
      "Copy the data into the system!!",
      "Missed calls (3)",
      "Wrong IBAN, redo everything",
      "Meeting moved to 6:30 pm",
      "Scan_0042.jpg",
      "Call the customer back ⚠",
    ],
    bubble: { who: "Giulia · Credit team", text: "Applications done. Leaving at 5 today 🙌", time: "16:52" },
  },
  problems: {
    title: ["What feels ", "difficult", " today?"],
    intro: "Five sentences we hear every week. Find the one that sounds like you: the solution is right behind it.",
    labelProblem: "The problem",
    labelSolution: "The solution",
    hintHover: "Hover to see the solution",
    hintTouch: "Tap to see the solution",
    solved: "✓ Solved",
    discover: "Discover",
    prev: "Previous card",
    next: "Next card",
    cardLabel: "Problem",
    items: [
      {
        id: "documenti",
        problem: "Every day I copy data from dozens of documents by hand.",
        solution: "ARGO reads them. On its own.",
        detail: "It pulls the data out of any document and puts it in your management system. No more copy-paste.",
        engine: "argo",
        icon: "doc",
      },
      {
        id: "canali",
        problem: "Customers write to me on WhatsApp, Instagram and email: messages get lost.",
        solution: "One chat for everything.",
        detail: "ALL MESSAGE brings every channel into a single conversation. Nothing slips through.",
        engine: "allmessage",
        icon: "chat",
      },
      {
        id: "notte",
        problem: "Requests come in at night too, and nobody answers.",
        solution: "MILO answers. Always.",
        detail: "The AI agent collects customer details at any hour and hands them to you, ready, in the morning.",
        engine: "milo",
        icon: "moon",
      },
      {
        id: "prestiti",
        problem: "Loan applications are slow and full of steps.",
        solution: "From request to payout, in one place.",
        detail: "KORE runs the whole application for credit agents and brokers. No spreadsheets.",
        engine: "kore",
        icon: "loan",
      },
      {
        id: "altro",
        problem: "My problem isn't on this list.",
        solution: "Then we'll build it to measure.",
        detail: "At Tailor Lab we start from your problem and tailor the tool that doesn't exist yet.",
        engine: "tailor",
        icon: "needle",
      },
    ],
  },
  engines: {
    title: ["Four engines. ", "One ecosystem."],
    intro:
      "Each engine does one job, and does it well. On their own they solve a problem; together they cover your customer's entire journey. Watch them at work below.",
    demoCta: "Request a demo of",
    items: {
      kore: {
        domain: "Credit",
        tagline: "You don't have to be a fintech. KORE is enough.",
        description:
          "A plug-and-play ecosystem for consumer-credit agents and brokers. It follows the loan application from start to finish, without spreadsheets or chasing.",
      },
      argo: {
        domain: "Documents",
        tagline: "It reads documents for you.",
        description:
          "Takes any document and extracts the data you need, already in order. It connects to your management system or CRM, or you use it straight from the browser.",
      },
      allmessage: {
        domain: "Conversations",
        tagline: "Four apps. One chat.",
        description:
          "WhatsApp, Instagram, Facebook and email in a single conversation. See the customer's whole story, wherever it started: no message lost along the way.",
      },
      milo: {
        domain: "AI Agent",
        tagline: "Answers, gathers, guides.",
        description:
          "The AI agent that talks to your customers, gathers the right information and guides them step by step. Every conversation becomes an opportunity ready to act on.",
      },
    },
  },
  demos: {
    kore: {
      case: "Application #2481 · Car loan",
      steps: ["Request", "Documents", "Review", "Paid out"],
    },
    argo: [
      ["Name", "Giulia Bianchi"],
      ["Tax code", "BNCGLI88M41F205X"],
      ["Income", "€2,150 / month"],
      ["IBAN", "IT60 X054 2811 1010"],
    ],
    allmessage: {
      head: "Marta R. · 1 conversation",
      thread: [
        "Hi! Any availability on Saturday?",
        "It's Marta, I messaged you on Instagram 🙂",
        "Sending over the documents you asked for.",
        "Perfect, see you Saturday!",
      ],
    },
    milo: [
      "I'd like a loan for a car.",
      "Sure! Roughly how much do you need?",
      "About €15,000.",
      "Great. I've prepared the request: an advisor will call you today.",
    ],
  },
  tailor: {
    title: ["Tailor made, ", "the way only made in Italy can."],
    leadA: "No two businesses are alike. When the right tool doesn't exist yet, ",
    leadStrong: "we build it",
    body: "Tailor Lab is our workshop. We start from your company's problem, take the measurements and tailor the software or AI agent you need, fitted into the processes you already use. That's how KORE was born: by studying an industry in depth, down to every fold.",
    cta: "Bring your problem to Tailor Lab",
    file: "sewing-pattern.js",
    fit: "fit: tailored",
    pattern: [
      { fn: "tailor.measure", args: 'company="yours", processes=real' },
      { fn: "pattern.cut", args: 'fit="tailored"' },
      { fn: "agent.build", args: 'problem="yours"' },
      { fn: "integrate", args: "crm, erp, chat" },
    ],
    note: "Cut, fit, adjust. Until it fits perfectly.",
  },
  method: {
    title: ["Elsewhere it takes months. ", "Here, weeks."],
    intro:
      "The secret isn't rushing: it's not starting from zero. Our engines are already proven; we tailor them to your company.",
    raceLabel: "Comparison: generic software takes months, One Tech a few weeks.",
    slow: { name: "Generic software", note: "You adapt to the software", bar: "Months" },
    fast: { name: "One Tech", note: "The software adapts to you", bar: "Weeks ✓" },
    step: "Step",
    steps: [
      {
        title: "Tell us what's difficult",
        text: "One call, zero jargon. You explain how you work today and where you lose time: we take care of the rest.",
      },
      {
        title: "We pick the engine and tailor it",
        text: "We start from ready-made engines and adapt them to your industry, instead of starting from scratch every time.",
      },
      {
        title: "Switch it on. It works.",
        text: "Live in a few weeks, connected to the tools you already use. And we stay by your side.",
      },
    ],
  },
  contact: {
    titleA: "Tell us what's ",
    titleEm: "difficult.",
    titleB: "We'll handle the rest.",
    lead: "Drop us a few lines: a real person on the team will reply within one business day.",
    whatsapp: "Prefer WhatsApp? Chat with us",
    labels: { sales: "Sales", partnerships: "Partnerships", press: "Press", address: "Find us" },
    footer: "Footer",
    copy: "© 2026 One Tech. Difficult? Not for us.",
  },
  form: {
    legend: "Contact form",
    required: "required",
    optional: "optional",
    requiredNote: "Fields marked as required let us get back to you.",
    name: { label: "Full name" },
    email: { label: "Work email" },
    company: { label: "Company" },
    topic: {
      label: "What do you need?",
      options: [
        { value: "demo", label: "A product demo" },
        { value: "custom", label: "A tailor-made project" },
        { value: "partnership", label: "A partnership" },
        { value: "other", label: "Something else" },
      ],
    },
    message: { label: "Tell us about the problem", hint: "A few lines are perfectly fine." },
    consent: {
      label: "I agree to One Tech processing my data in order to get back to me.",
    },
    submit: "Send request",
    sending: "Sending…",
    errors: {
      summary: (n: number) => (n === 1 ? "There is 1 field to fix:" : `There are ${n} fields to fix:`),
      nameRequired: "Enter your full name.",
      nameShort: "That name looks too short: at least 2 characters.",
      emailRequired: "Enter your email so we can reply.",
      emailInvalid: "This email doesn't look right. Example: name@company.com",
      topicRequired: "Choose one of the options.",
      messageRequired: "Write a few lines about your problem.",
      messageShort: "Tell us a bit more: at least 10 characters.",
      consentRequired: "We need your consent to send the request.",
      network: "We couldn't send your message. Check your connection and try again, or email sales@otech.one.",
    },
    success: {
      title: "Request sent. Thank you!",
      text: (name: string) =>
        `Hi ${name}, we've received your message. Someone on the team will reply within one business day.`,
      again: "Send another request",
    },
  },
  youAreHere: {
    nav: "Page progress",
    here: "You are here",
    next: "Next",
    sections: ["What's difficult", "The four engines", "Tailor Lab", "How we work", "Contact"],
  },
};

export const DICTIONARIES: Record<Locale, Dict> = { it, en };
