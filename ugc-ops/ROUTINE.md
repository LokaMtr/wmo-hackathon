# Dagelijkse routine (08:00 Europe/Amsterdam)

Deze tekst is de opdracht van de geplande sessie. Werk in repo `LokaMtr/wmo-hackathon`, branch `claude/mila-mirror-tiktok-setup-5zp7gd`.

1. **Lezen**: `ugc-ops/README.md`, `ugc-ops/memory/lessons.md`, `ugc-ops/memory/config.json`, alle draaiboeken in `ugc-ops/agents/`. Lees in het dashboard (ArtifactData, url in config) de collecties `lessons`, `ideas`, `videos` en `meta/state`.
2. **Budgetwaker** (`agents/budget.md`): Higgsfield `balance` → `meta/state.credits`.
3. **Prestatie-analist** (`agents/performance-analyst.md`): Metricool posts + analytics ophalen, `videos` bijwerken (status posted, metrics, verdict na ≥48u), max 3 acties.
4. **Trend-scout** (`agents/trend-scout.md`): 5 nieuwe ideeën (niet dubbel met bestaande `ideas`), JSON opslaan als `scout.json`, dan
   `python3 ugc-ops/scripts/prepare_ingest.py scout.json <tmp>/ingest <datum>`,
   productfoto's uit `<tmp>/ingest/img/` uploaden met Artifact `asset: true` (url = dashboard) en de asset-ids als `imageAssets` in elk idee zetten, daarna `ArtifactData batch` met `writes.json`.
   Voeg de acties van de analist toe aan `briefing.actions`.
5. **Leren**: nieuwe lessen → `lessons` (ArtifactData) én `ugc-ops/memory/lessons.md`; tegengesproken lessen aanpassen.
6. `meta/state.lastRun` = nu. Commit + push de repo-wijzigingen (alleen `ugc-ops/`).
7. Nooit credits uitgeven of posten in deze routine; alleen onderzoeken, meten, adviseren.
