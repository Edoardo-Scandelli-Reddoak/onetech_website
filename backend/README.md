# One Tech · Backoffice contatti (Django)

Riceve le richieste del modulo contatti del sito (`../web`) e le mostra al team.

## Avvio

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

- **Dashboard contatti:** http://127.0.0.1:8000/ (login richiesto)
- **Admin Django:** http://127.0.0.1:8000/admin/

## Come arrivano i dati

`web` → `POST /api/contact` (Next.js: valida e salva in `web/data/contact-requests.jsonl`)
→ `POST /api/contacts/` (Django, header `X-Api-Token`) → SQLite.

Variabili: `CONTACTS_API_TOKEN` (default `onetech-dev-token`, uguale in `web/.env.local`),
`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`.

Per importare richieste arrivate mentre Django era spento:

```bash
.venv/bin/python manage.py import_jsonl
```
