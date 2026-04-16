# Demo Script — 10 minuten

## Voor de demo klaarzetten (5 min van tevoren)

```bash
# Start alles
docker compose up -d

# Check health
curl http://localhost:8000/health

# Open 3 browser tabs:
# Tab 1: http://localhost:8000/docs (FastAPI Swagger)
# Tab 2: http://localhost:5678 (n8n - login admin/admin)
# Tab 3: Terminal voor curl commando's
```

## Demo Flow (10 minuten)

### 0. Intro (30 sec)
"We hebben een prototype gebouwd dat WMO-aanvragen verwerkt met AI-ondersteuning, privacy-by-design en mens-in-de-loop bij complexe zaken. Ik laat eerst de architectuur zien, dan 4 testcases."

### 1. Architectuur (1 min)
Open `docs/ARCHITECTURE.md` of het getekende diagram.
"Drie lagen: n8n voor orchestratie, FastAPI voor logica, Postgres voor audit. AI krijgt nooit PII, alleen een pseudotoken en leeftijdsgroep."

### 2. n8n workflow tonen (1 min)
Open http://localhost:5678 → de workflow.
"Hier zie je het proces: webhook → intake → beleid → AI → fairness → routing naar auto of review."

### 3. Testcase 1: Laag risico (1.5 min)
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d @testcases/case1_laag_risico.json | jq
```
"Neutrale aanvraag, ernst laag, één probleem. Je ziet: automatisch voorstel, burgerbericht met transparantie over AI-gebruik."

### 4. Testcase 2: Hoog risico → mens-in-de-loop (1.5 min)
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d @testcases/case2_hoog_risico.json | jq
```
"Meervoudige problematiek, ernst hoog, woningaanpassing. Systeem stuurt automatisch naar review queue — een mens neemt de beslissing."

### 5. Testcase 3: Fairness flag (1.5 min)
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d @testcases/case3_fairness.json | jq
```
"Toelichting bevat verboden term 'moslim'. Fairness check flagt dit, aanvraag gaat naar review. Je ziet de flags in de response."

### 6. Testcase 4: Validatie faalt (1 min)
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d @testcases/case4_validatie.json | jq
```
"Burger heeft geen toestemming gegeven voor AI. Systeem weigert AI-verwerking en geeft duidelijke foutmelding."

### 7. Audit log tonen (1 min)
```bash
curl http://localhost:8000/audit?limit=10 | jq
```
Of rechtstreeks in Postgres:
```bash
docker exec -it wmo_postgres psql -U wmo_user -d wmo_audit -c "SELECT id, token, voorziening, risico, besluit FROM audit_log ORDER BY created_at DESC LIMIT 5;"
```
"Alle beslissingen zijn vastgelegd met pseudotoken, flags en besluit. Geen PII opgeslagen."

### 8. Review dashboard (30 sec)
```bash
curl http://localhost:8000/review/queue | jq
```
"Dit is wat een menselijke beoordelaar ziet — alle aanvragen die review vereisen."

### 9. Prompt charter (30 sec)
Open `docs/PROMPT_CHARTER.md`.
"We hebben vastgelegd wat de AI wel en niet mag. Belangrijkste: AI beslist nooit, krijgt geen PII, mag geen beschermde kenmerken benoemen."

### 10. Afsluiting (30 sec)
"Samenvattend: privacy by design via pseudonimisatie, fairness door automatische check, mens-in-de-loop bij hoog risico of flags, alles volledig herleidbaar via audit log. Vragen?"

## Backup als demo faalt

**Als docker niet werkt:**
- Start alleen de API lokaal: `cd api && uvicorn main:app --reload`
- Gebruik SQLite ipv Postgres (pas DATABASE_URL aan)

**Als n8n faalt:**
- Laat alleen de FastAPI `/process` endpoint zien — die doet alles in één call

**Als internet weg is:**
- LLM_MODE=stub werkt zonder internet

## Vragen die je kan verwachten

**"Waarom n8n en niet gewoon Python?"**
→ Low-code workflow-orkestratie is sneller aan te passen door niet-developers (beleid/bestuur). Makkelijk te visualiseren voor stakeholders.

**"Hoe schaalbaar is dit?"**
→ FastAPI schaalt horizontaal via bijvoorbeeld Kubernetes. n8n heeft een enterprise queue mode. Postgres kan read-replicas.

**"Wat als de AI een fout maakt?"**
→ Daarom is er altijd een mens in de loop bij alles wat afwijkt van standaard. Audit log maakt elke beslissing herleidbaar.

**"Is dit AVG-proof?"**
→ Pseudonimisatie + dataminimalisatie + recht op inzage via audit + recht op menselijke beoordeling = ja. Wel nog DPIA nodig voor productie.

**"Waarom deze fairness-aanpak?"**
→ Simpele woordenlijst is explainable en controleerbaar. Voor productie kun je dit uitbreiden met ML-based bias detection, maar dat introduceert weer nieuwe bias-risico's.
