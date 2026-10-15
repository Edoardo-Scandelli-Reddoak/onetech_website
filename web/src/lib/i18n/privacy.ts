import type { Locale } from "./dictionaries";

type Section = { id: string; title: string; body: string[]; table?: { head: string[]; rows: string[][] } };

type PrivacyCopy = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  manage: string;
  back: string;
  draftNote: string;
};

export const PRIVACY: Record<Locale, PrivacyCopy> = {
  it: {
    title: "Privacy e cookie",
    updated: "Ultimo aggiornamento: 15 ottobre 2026",
    intro:
      "In breve: raccogliamo solo i dati che ci scrivi nel modulo contatti, per risponderti. Non vendiamo nulla a nessuno. I cookie facoltativi restano spenti finché non li accendi tu.",
    sections: [
      {
        id: "titolare",
        title: "Chi tratta i tuoi dati",
        body: [
          "Titolare del trattamento è One Tech Srl, Via Gustavo Fara 35, 20124 Milano. Per qualsiasi domanda sulla privacy scrivi a sales@otech.one.",
        ],
      },
      {
        id: "dati",
        title: "Quali dati raccogliamo e perché",
        body: [
          "Modulo contatti: nome, email, azienda (facoltativa), argomento e messaggio. Li usiamo solo per rispondere alla tua richiesta. Base giuridica: il tuo consenso e le misure precontrattuali richieste da te (art. 6.1 a e b GDPR).",
          "Dati di navigazione: i server registrano dati tecnici (come l'indirizzo IP) per sicurezza e funzionamento del sito. Base giuridica: legittimo interesse (art. 6.1 f GDPR).",
        ],
      },
      {
        id: "conservazione",
        title: "Per quanto li teniamo",
        body: [
          "Le richieste di contatto per il tempo necessario a gestirle e comunque non oltre 24 mesi. Le scelte sui cookie per 6 mesi, poi te lo chiediamo di nuovo.",
        ],
      },
      {
        id: "destinatari",
        title: "Chi altro li vede",
        body: [
          "Solo il team One Tech e i fornitori che ci servono per farti ricevere la risposta: il servizio di invio email del modulo (Web3Forms) e il fornitore di hosting. Nessun dato viene venduto o ceduto per marketing.",
        ],
      },
      {
        id: "cookie",
        title: "Cookie e strumenti simili",
        body: [
          "I cookie necessari funzionano sempre perché senza il sito non funziona. Quelli statistici partono solo se li accetti: prima della tua scelta nessuno script di tracciamento viene caricato.",
        ],
        table: {
          head: ["Nome", "Tipo", "A cosa serve", "Durata"],
          rows: [
            ["onetech-locale", "Necessario (archiviazione locale)", "Ricorda la lingua scelta", "Finché non lo cancelli"],
            ["onetech-consent", "Necessario (archiviazione locale)", "Ricorda le tue scelte sui cookie", "6 mesi"],
            ["_ga, _ga_*", "Statistico, Google Analytics (solo con consenso)", "Statistiche anonime di visita", "Fino a 13 mesi"],
          ],
        },
      },
      {
        id: "diritti",
        title: "I tuoi diritti",
        body: [
          "Puoi chiedere in ogni momento di vedere, correggere, cancellare o portare con te i tuoi dati, di limitarne l'uso o di opporti (artt. 15–22 GDPR), e revocare il consenso senza conseguenze. Basta una email a sales@otech.one. Se pensi che qualcosa non vada, puoi fare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).",
        ],
      },
    ],
    manage: "Cambia le preferenze cookie",
    back: "Torna alla home",
    draftNote: "Testo redatto per la prova tecnica: prima della pubblicazione va validato dal consulente privacy di One Tech.",
  },
  en: {
    title: "Privacy & cookies",
    updated: "Last updated: 15 October 2026",
    intro:
      "In short: we only collect what you write in the contact form, to reply to you. We sell nothing to anyone. Optional cookies stay off until you switch them on.",
    sections: [
      {
        id: "titolare",
        title: "Who handles your data",
        body: [
          "The data controller is One Tech Srl, Via Gustavo Fara 35, 20124 Milan, Italy. For any privacy question write to sales@otech.one.",
        ],
      },
      {
        id: "dati",
        title: "What we collect and why",
        body: [
          "Contact form: name, email, company (optional), topic and message. We use them only to reply to your request. Legal basis: your consent and pre-contractual steps you asked for (Art. 6.1 a and b GDPR).",
          "Browsing data: servers log technical data (such as your IP address) for security and to run the site. Legal basis: legitimate interest (Art. 6.1 f GDPR).",
        ],
      },
      {
        id: "conservazione",
        title: "How long we keep it",
        body: [
          "Contact requests for as long as needed to handle them, and no longer than 24 months. Cookie choices for 6 months, then we ask again.",
        ],
      },
      {
        id: "destinatari",
        title: "Who else sees it",
        body: [
          "Only the One Tech team and the providers we need to get you a reply: the form's email delivery service (Web3Forms) and our hosting provider. No data is sold or shared for marketing.",
        ],
      },
      {
        id: "cookie",
        title: "Cookies and similar tools",
        body: [
          "Necessary cookies are always on because the site doesn't work without them. Analytics cookies only start if you accept them: before you choose, no tracking script is loaded.",
        ],
        table: {
          head: ["Name", "Type", "Purpose", "Duration"],
          rows: [
            ["onetech-locale", "Necessary (local storage)", "Remembers your language", "Until you delete it"],
            ["onetech-consent", "Necessary (local storage)", "Remembers your cookie choices", "6 months"],
            ["_ga, _ga_*", "Analytics, Google Analytics (consent only)", "Anonymous visit statistics", "Up to 13 months"],
          ],
        },
      },
      {
        id: "diritti",
        title: "Your rights",
        body: [
          "At any time you can ask to access, correct, delete or port your data, restrict or object to its use (Arts. 15–22 GDPR), and withdraw consent with no consequences. Just email sales@otech.one. If you think something is wrong, you can complain to the Italian Data Protection Authority (garanteprivacy.it).",
        ],
      },
    ],
    manage: "Change cookie preferences",
    back: "Back to home",
    draftNote: "Written for the technical test: it must be validated by One Tech's privacy advisor before going live.",
  },
};
