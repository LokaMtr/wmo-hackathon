# Architectuur — WMO AI Prototype

## Componentendiagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        PRESENTATIE LAAG                            │
│  ┌──────────────────────┐      ┌──────────────────────────────┐    │
│  │  Burger Portaal      │      │  Reviewer Dashboard          │    │
│  │  (curl / Postman /   │      │  (GET /review/queue)         │    │
│  │   optionele React)   │      │                              │    │
│  └──────────┬───────────┘      └───────────┬──────────────────┘    │
│             │ HTTPS                         │ HTTPS                │
└─────────────┼─────────────────────────────-┼──────────────────────┘
              │                              │
              ▼                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                   ORCHESTRATIE LAAG                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                         n8n                                  │  │
│  │  - Webhook trigger                                           │  │
│  │  - HTTP requests naar FastAPI                                │  │
│  │  - IF-conditions voor routing                                │  │
│  │  - Port: 5678                                                │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────────┘
                          │ HTTP (intern network)
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│                     SERVICE LAAG                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI (Python)                          │  │
│  │                                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐     │  │
│  │  │ /intake  │ │ /policy  │ │ /ai/     │ │ /fairness/   │     │  │
│  │  │          │ │          │ │  propose │ │   check      │     │  │
│  │  └──────────┘ └──────────┘ └─────┬────┘ └──────────────┘     │  │
│  │                                   │                          │  │
│  │  ┌──────────┐ ┌──────────┐        │                          │  │
│  │  │ /audit/  │ │ /review/ │        │                          │  │
│  │  │  log     │ │  queue   │        │                          │  │
│  │  └────┬─────┘ └────┬─────┘        │                          │  │
│  │       │            │              │                          │  │
│  │  Port: 8000        │              │                          │  │
│  └───────┼────────────┼──────────────┼──────────────────────────┘  │
└──────────┼────────────┼──────────────┼─────────────────────────────┘
           │            │              │
           ▼            ▼              ▼
┌──────────────────────────┐  ┌────────────────────────────────────┐
│    DATA LAAG             │  │    EXTERNE AI                      │
│  ┌────────────────────┐  │  │  ┌──────────────────────────────┐  │
│  │    PostgreSQL      │  │  │  │  Claude API (of stub)        │  │
│  │    audit_log       │  │  │  │  - Alleen pseudo-data        │  │
│  │    review_queue    │  │  │  │  - Prompt charter regels     │  │
│  │    Port: 5432      │  │  │  └──────────────────────────────┘  │
│  └────────────────────┘  │  └────────────────────────────────────┘
└──────────────────────────┘
```

## Data flow

1. **Burger** → Webhook (n8n) met volledige aanvraag (met PII)
2. **n8n** → FastAPI `/intake` → valideert + pseudonimiseert (PII verdwijnt hier)
3. **n8n** → FastAPI `/policy/{voorziening}` → beleidsregels ophalen
4. **n8n** → FastAPI `/ai/propose` → AI-voorstel (alleen pseudo-data)
5. **FastAPI** → LLM (Claude of stub) → voorstel + onderbouwing + risico
6. **n8n** → FastAPI `/fairness/check` → controle op verboden termen
7. **n8n** → Routing IF node:
   - Als OK én laag risico → auto besluit + burgerbericht
   - Anders → review queue
8. **n8n** → FastAPI `/audit/log` → vastleggen in Postgres
9. **Burger** ← response via webhook

## Security & Privacy design

| Maatregel                    | Waar                                 |
|------------------------------|--------------------------------------|
| Pseudonimisatie (hash+salt)  | `/intake` endpoint                   |
| Leeftijdsgroep ipv DOB       | `/intake` endpoint                   |
| PII niet in audit log        | Alleen token wordt opgeslagen        |
| AI krijgt geen PII           | `/ai/propose` accepteert alleen pseudo-data |
| Fairness check               | `/fairness/check` endpoint           |
| Audit logging                | Postgres `audit_log` tabel           |
| Toegang n8n                  | Basic auth (demo); in prod: OIDC/SSO |
| Toegang DB                   | Alleen via API, niet direct          |

## Containers & ports

| Container     | Image               | Ports exposed   | Netwerk |
|---------------|---------------------|-----------------|---------|
| wmo_api       | custom (python:3.11)| 8000            | default |
| wmo_n8n       | n8nio/n8n           | 5678            | default |
| wmo_postgres  | postgres:15         | 5432            | default |

Containers communiceren intern via Docker service names (`api`, `postgres`).

## Tekenen voor presentatie

Gebruik **draw.io** of **Excalidraw** voor een mooier diagram:
1. Ga naar https://app.diagrams.net of https://excalidraw.com
2. Maak 3 lagen met rechthoeken (Presentatie, Orchestratie, Services, Data)
3. Teken pijlen voor de data flow
4. Export als PNG voor de presentatie
