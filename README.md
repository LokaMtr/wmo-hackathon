# WMO Hackathon — Ethisch verantwoorde AI voor WMO-aanvragen

End-to-end prototype voor gemeenten: ontvangt WMO-aanvragen, pseudonimiseert data, genereert een AI-voorstel, checkt op fairness en stuurt complexe zaken naar een menselijke beoordelaar.

## Architectuur

```
┌─────────┐   webhook    ┌──────┐    HTTP   ┌────────────┐    SQL    ┌──────────┐
│ Burger/ │─────────────▶│ n8n  │──────────▶│  FastAPI   │──────────▶│ Postgres │
│ Portaal │              │      │           │  (Python)  │           │  Audit   │
└─────────┘              └──────┘           └────────────┘           └──────────┘
                            │                     │
                            │                     ├─▶ LLM (stub of Claude)
                            │                     │
                            │                     └─▶ Fairness check
                            │
                            └──▶ Review queue / burger bericht
```

## Snelle start

**Vereisten:** Docker + Docker Compose geïnstalleerd.

```bash
# 1. Clone/download project
cd wmo-hackathon

# 2. Start alles
docker compose up -d

# 3. Wacht ~30 sec op DB init, check of alles draait
docker compose ps

# 4. Test de API
curl http://localhost:8000/health

# 5. Run de 4 testcases
bash test_cases.sh
```

## Services

| Service   | URL                          | Credentials      |
|-----------|------------------------------|------------------|
| FastAPI   | http://localhost:8000        | -                |
| API Docs  | http://localhost:8000/docs   | -                |
| n8n       | http://localhost:5678        | admin / admin    |
| Postgres  | localhost:5432               | wmo_user / wmo_pass |

## Endpoints (FastAPI)

| Method | Path                  | Doel                                  |
|--------|-----------------------|---------------------------------------|
| GET    | `/health`             | Health check                          |
| POST   | `/intake`             | Valideer + pseudonimiseer aanvraag    |
| GET    | `/policy/{voorziening}` | Beleidsregels ophalen              |
| POST   | `/ai/propose`         | AI-voorstel genereren                 |
| POST   | `/fairness/check`     | Check op verboden termen              |
| POST   | `/audit/log`          | Log beslissing in audit DB            |
| GET    | `/audit`              | Bekijk audit log                      |
| GET    | `/review/queue`       | Reviewer dashboard                    |
| POST   | `/process`            | End-to-end (doet alle stappen)        |

Zie interactieve docs op http://localhost:8000/docs

## n8n workflow

1. Open http://localhost:5678 (login: admin/admin)
2. Import workflow: menu → Import from File → selecteer `n8n/wmo_workflow.json`
3. Activeer de workflow (toggle rechtsboven)
4. Webhook URL: `http://localhost:5678/webhook/wmo-intake`

## Testcases (verplicht voor demo)

**Testcase 1 — Laag risico, automatisch burgerbericht:**
```bash
curl -X POST http://localhost:8000/process -H "Content-Type: application/json" -d @testcases/case1_laag_risico.json
```

**Testcase 2 — Hoog risico, mens-in-de-loop:**
```bash
curl -X POST http://localhost:8000/process -H "Content-Type: application/json" -d @testcases/case2_hoog_risico.json
```

**Testcase 3 — Fairness flag:**
```bash
curl -X POST http://localhost:8000/process -H "Content-Type: application/json" -d @testcases/case3_fairness.json
```

**Testcase 4 — Validatie faalt (geen toestemming):**
```bash
curl -X POST http://localhost:8000/process -H "Content-Type: application/json" -d @testcases/case4_validatie.json
```

Of run alles in één keer:
```bash
bash test_cases.sh
```

## Audit bekijken

```bash
# Via API
curl http://localhost:8000/audit | jq

# Via Postgres CLI
docker exec -it wmo_postgres psql -U wmo_user -d wmo_audit
# dan: SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;
```

## Echte LLM gebruiken (optioneel)

Standaard draait de AI in stub-mode (deterministische antwoorden voor demo).
Om de echte Claude API te gebruiken:

1. Edit `docker-compose.yml`:
```yaml
api:
  environment:
    LLM_MODE: anthropic
    ANTHROPIC_API_KEY: sk-ant-...  # jouw key
```

2. Herstart: `docker compose restart api`

## Documentatie

- `docs/PROMPT_CHARTER.md` — Regels voor de AI
- `docs/BPMN.md` — Procesdiagram
- `docs/ARCHITECTURE.md` — Architectuurdiagram
- `docs/DEMO_SCRIPT.md` — Script voor de 10-min demo

## Projectstructuur

```
wmo-hackathon/
├── docker-compose.yml      # Alle services
├── README.md               # Dit bestand
├── test_cases.sh           # Run alle 4 testcases
├── api/                    # FastAPI backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py            # Alle endpoints
├── db/
│   └── init.sql           # Postgres schema + views
├── n8n/
│   └── wmo_workflow.json  # n8n workflow (as code)
├── testcases/             # JSON inputs voor demo
│   ├── case1_laag_risico.json
│   ├── case2_hoog_risico.json
│   ├── case3_fairness.json
│   └── case4_validatie.json
└── docs/
    ├── PROMPT_CHARTER.md
    ├── BPMN.md
    ├── ARCHITECTURE.md
    └── DEMO_SCRIPT.md
```

## Troubleshooting

**API start niet:** `docker compose logs api`

**DB connectie faalt:** wacht 30 sec na start, healthcheck moet eerst groen zijn

**n8n kan API niet bereiken:** gebruik service naam `api` in plaats van `localhost` in n8n HTTP Request nodes, dus `http://api:8000/...`

**Port al in gebruik:** pas poorten aan in `docker-compose.yml`
