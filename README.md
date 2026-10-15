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

- **Hero "Lunedì mattina"**: notifiche, file e post-it intrecciati da un filo che, scorrendo, si raddrizza e barra la parola *Difficile?*.
- **Cosa ti sembra difficile?**: cinque problemi reali in card che scorrono; passando sopra (o toccando) appare la soluzione.
- **Quattro motori** (KORE, ARGO, ALL MESSAGE, MILO) con mini-demo animate al posto delle icone.
- **Tailor Lab**, **metodo** e **contatti** con modulo accessibile (etichette esplicite, errori collegati ai campi, riepilogo errori con focus, conferma finale).
- **IT / EN** in tutto il sito, scelta ricordata tra le visite.
- Rispetto di `prefers-reduced-motion`: chi riduce le animazioni vede direttamente lo stato finale.
