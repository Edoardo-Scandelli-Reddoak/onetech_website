# One Tech — Difficile? Non per noi.

Proposta di nuovo sito per [ONE Tech](https://www.otech.one/): un'esperienza che parte dal caos di una giornata di lavoro e lo districa, motore dopo motore.

| Cartella | Cosa contiene |
|---|---|
| [`web/`](web) | Sito in **Next.js 16 + React 19 + TypeScript** (CSS Modules, `motion`), con API `/api/contact` |
| [`backend/`](backend) | Backoffice **Django** che riceve e mostra le richieste di contatto |

## Avvio rapido

**1. Sito** (Node 20+)

```bash
cd web
cp .env.example .env.local   # facoltativo: chiave Web3Forms per l'invio email
npm install
npm run dev                  # http://localhost:3000
```

**2. Backoffice contatti** (Python 3.9+, facoltativo)

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 127.0.0.1:8000   # http://127.0.0.1:8000
```

## Come viaggia una richiesta di contatto

1. Il browser valida i campi (stesse regole del server, in `web/src/lib/contact.ts`).
2. `POST /api/contact` (Next.js) ri-valida, salva in `web/data/contact-requests.jsonl` e inoltra a Django.
3. Django (`POST /api/contacts/`, protetto da token) salva in SQLite; il team le legge su `http://127.0.0.1:8000/`.
4. Il browser invia l'email tramite Web3Forms (il piano gratuito accetta solo invii lato client).

Senza chiave Web3Forms o senza Django il modulo funziona comunque: le richieste restano nel file JSONL.

## Cosa c'è dentro

- **Hero "Lunedì mattina"**: notifiche, file e chat intrecciati da un filo che in 3 secondi si districa da solo e barra la parola *Difficile?*.
- **Cosa ti sembra difficile?**: cinque problemi reali in card; passando sopra (o toccando) appare la soluzione. Su mobile le card sono una sotto l'altra.
- **Quattro motori** (KORE, ARGO, ALL MESSAGE, MILO) con mini-demo animate al posto delle icone.
- **Tailor Lab**, **metodo** e **contatti** con cornice neon e modulo accessibile (solo nome, email e consenso obbligatori; errori collegati ai campi, riepilogo errori con focus, conferma finale).
- **Cookie banner GDPR**: nessuno script di tracciamento prima del consenso, "Rifiuta" identico ad "Accetta", la ✕ vale come rifiuto, preferenze riapribili dal footer, scelta valida 6 mesi, revoca che cancella i cookie. Informativa su `/privacy`.
- **Widget accessibilità** (in basso a sinistra, su ogni pagina): dimensione del testo, contrasto elevato, link sottolineati, lettura facilitata, stop alle animazioni, scala di grigi. Le scelte restano salvate e vengono applicate prima del primo paint.
- **WhatsApp** sempre raggiungibile in basso a destra.
- **IT / EN** in tutto il sito, scelta ricordata tra le visite.
- **Responsive** verificato da 320 px a 1440 px; rispetto di `prefers-reduced-motion`.

## Variabili d'ambiente (`web/.env.local`)

| Variabile | A cosa serve |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | invio email delle richieste (facoltativa) |
| `CONTACTS_API_URL`, `CONTACTS_API_TOKEN` | inoltro al backoffice Django (facoltative) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics, caricato **solo** dopo il consenso (facoltativa) |
