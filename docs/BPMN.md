# BPMN — WMO Aanvraag Proces

## Proces: Verwerking WMO-aanvraag met AI-ondersteuning

```
[START: Aanvraag binnen via webhook]
        │
        ▼
╔═══════════════════════╗
║ 1. Validatie          ║   ── Task: API / Script
║ - Verplichte velden?  ║
║ - Toestemming AI?     ║
╚═══════════════════════╝
        │
        ▼
     ◇ Geldig?
    /         \
   NEE         JA
    │           │
    ▼           ▼
[Weigering]  ╔═══════════════════════╗
[burger-     ║ 2. Dataminimalisatie  ║
 bericht]    ║ - PII verwijderen     ║
    │        ║ - Naam/adres/DOB weg  ║
    ▼        ╚═══════════════════════╝
  [EINDE]             │
                      ▼
               ╔═══════════════════════╗
               ║ 3. Pseudonimisatie    ║
               ║ citizenId → token     ║
               ║ geboortedatum →       ║
               ║   leeftijdsgroep      ║
               ╚═══════════════════════╝
                      │
                      ▼
               ╔═══════════════════════╗
               ║ 4. Beleidsregels      ║
               ║ Ophalen per voorz.    ║
               ╚═══════════════════════╝
                      │
                      ▼
               ╔═══════════════════════╗
               ║ 5. AI Voorstel        ║
               ║ (pseudo-data + beleid)║
               ║ → voorstel            ║
               ║ → onderbouwing        ║
               ║ → risico-inschatting  ║
               ╚═══════════════════════╝
                      │
                      ▼
               ╔═══════════════════════╗
               ║ 6. Fairness Check     ║
               ║ - Verboden termen?    ║
               ║ - Onderbouwing OK?    ║
               ╚═══════════════════════╝
                      │
                      ▼
               ◇ Fairness OK
                 EN risico ≠ hoog
                 EN ernst ≠ hoog
                 EN problematiek < 3?
                /                   \
              JA                    NEE
               │                     │
               ▼                     ▼
        ╔════════════════╗   ╔═════════════════╗
        ║ 8a. Burger-    ║   ║ 7. Mens-in-     ║
        ║ bericht (auto) ║   ║    de-loop      ║
        ║ + transparantie║   ║ Review queue    ║
        ╚════════════════╝   ╚═════════════════╝
               │                     │
               ▼                     ▼
        ╔════════════════╗   ╔═════════════════╗
        ║ 9a. Audit log  ║   ║ 9b. Audit log   ║
        ║ besluit=auto   ║   ║ besluit=review  ║
        ╚════════════════╝   ╚═════════════════╝
               │                     │
               └──────────┬──────────┘
                          ▼
                       [EINDE]
```

## Swimlanes

**Swimlane 1 — Burger/Portaal**
- Dient aanvraag in
- Ontvangt bericht

**Swimlane 2 — n8n Workflow (Orchestratie)**
- Routeert tussen services
- Maakt beslissingen over routing

**Swimlane 3 — FastAPI Services**
- Intake/validatie
- Pseudonimisatie
- Beleidsregels
- AI-call
- Fairness check
- Audit logging

**Swimlane 4 — AI Service (stub/LLM)**
- Genereert voorstel op basis van gepseudonimiseerde data

**Swimlane 5 — Gemeente medewerker**
- Reviewt aanvragen in de review-queue
- Neemt definitieve beslissingen

## Events

- **Start event**: POST webhook ontvangen
- **Tussenstates**: logs bij elke stap
- **Error events**: validatie gefaald → audit log + foutmelding
- **Eind events**: auto besluit OF review gepland

## Data objects

- `WMOAanvraag` (met PII, alleen in stap 1-2)
- `PseudonimiseerdeAanvraag` (zonder PII, in stap 3-9)
- `BeleidsRegel`
- `AIVoorstel`
- `FairnessResult`
- `AuditEntry`

## Tekenen in draw.io

Deze tekstuele weergave kun je in draw.io omzetten naar een echte BPMN:
1. Open https://app.diagrams.net
2. Kies BPMN template
3. Gebruik de bovenstaande structuur als leidraad
4. Export als PNG/SVG voor de presentatie
