# UGC Ops: Mila / @xmilabby

Een klein team van agents dat TikTok Shop-affiliate video's met AI-creator "Mila" vindt, maakt en verbetert.

| Agent | Draaiboek | Wanneer |
|---|---|---|
| Trend-scout | `agents/trend-scout.md` | dagelijks 08:00 (routine) of op verzoek |
| Prestatie-analist | `agents/performance-analyst.md` | dagelijks na de scout, of op verzoek |
| Scriptwriter (UGC-legend) | `agents/scriptwriter.md` | vóór elke productie |
| AI-video director | `agents/ai-video-director.md` | vóór elke productie: model, modus, duur, kosten, prompts, realisme, stem, montage, AI-compliance (prijzen + testlog: `agents/higgsfield-expert.md`) |
| Producer | `agents/producer.md` | als Loka een idee uit het dashboard kopieert |
| QA-checker | `agents/qa-checker.md` + `scripts/qa_check.py` | na frames, na clips, na final |
| Deal-jager | `agents/deal-hunter.md` | bij elk nieuw product (screenshots van Loka) en bij winnaars |
| Comment-manager | `agents/comment-manager.md` | als Loka comments stuurt; reply-video-ideeën |
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

## HQ 3D + chat
Het dashboard opent op **HQ 3D (JARVIS)**: three.js r128 + UnrealBloom/FXAA + GSAP, holografische kern met states (stand-by / bezig / antwoord), live data op muur- en bureauschermen, missie-feed (heeft jou nodig / bezig / klaar), log, klok, credits-meter, camera-fly-ins en optionele JARVIS-stem (speechSynthesis). Ideeën uit claude-office, ai-office en openclaw-jarvis-ui (MIT/ISC), alles zelf geschreven. De agents geven echte data uit de database aan elkaar door. De chat rechts schrijft naar collectie `chat` en vuurt trigger `controlRoomChat` af in de Claude-sessie; Claude antwoordt met een doc `{role:'claude', text, at, agent}` in `chat`.

## Zelflerend
1. Elke agent leest bij start `memory/lessons.md` **en** de collectie `lessons` in het dashboard.
2. Elke fout die opnieuw gemaakt moest worden, elke hook die wel of niet werkte en elk product dat verzadigd bleek wordt een nieuwe les (in beide).
3. Lessen hebben een `area` (production, script, hooks, products, posting, compliance, budget) en `evidence` (waar het uit bleek).
4. Een les die door nieuwe data wordt tegengesproken wordt aangepast, niet gestapeld.

## Werkstroom
Scout → ideeën in dashboard → Loka selecteert → deal-jager checkt commissie → "Kopieer prompt" → scriptwriter → Higgsfield-expert kiest route → producer → QA-checker → gepland (Metricool) → comment-manager → analist meet → lessen.
