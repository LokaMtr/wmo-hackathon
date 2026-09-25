# UGC Ops: Mila / @xmilabby

Een klein team van agents dat TikTok Shop-affiliate video's met AI-creator "Mila" vindt, maakt en verbetert.

| Agent | Draaiboek | Wanneer |
|---|---|---|
| Trend-scout | `agents/trend-scout.md` | dagelijks 08:00 (routine) of op verzoek |
| Prestatie-analist | `agents/performance-analyst.md` | dagelijks na de scout, of op verzoek |
| Producer | `agents/scriptwriter.md` (UGC-scripts, hooks) en `agents/producer.md` | als Loka een idee uit het dashboard kopieert |
| Compliance-check | `agents/compliance.md` | vóór elke render en vóór elke post |
| Budgetwaker | `agents/budget.md` | bij elke run |

## Eén opslag: het dashboard
Alle gegevens staan in de database van het dashboard-artifact (zie `memory/config.json` → `dashboardUrl`).
Collecties:

- `briefings/<YYYY-MM-DD>`: dagbriefing van de scout en de analist
- `ideas/<id>`: productideeën met score, angles, hooks, script, afbeeldingen, status
- `videos/<id>`: gemaakte video's, planning, cijfers en oordeel
- `lessons/<id>`: geleerde lessen (wat werkt / wat niet); **elke agent leest deze eerst**
- `meta/state`: credits, uitgaven, commissie, laatste run

## Zelflerend
1. Elke agent leest bij start `memory/lessons.md` **en** de collectie `lessons` in het dashboard.
2. Elke fout die opnieuw gemaakt moest worden, elke hook die wel of niet werkte en elk product dat verzadigd bleek wordt een nieuwe les (in beide).
3. Lessen hebben een `area` (production, script, hooks, products, posting, compliance, budget) en `evidence` (waar het uit bleek).
4. Een les die door nieuwe data wordt tegengesproken wordt aangepast, niet gestapeld.

## Werkstroom
Scout → ideeën in dashboard → Loka selecteert → "Kopieer prompt" → plakt in Claude Code → Producer maakt video → gepland (Metricool) → analist meet → lessen.
