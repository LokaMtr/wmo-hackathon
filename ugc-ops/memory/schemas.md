# Dashboard-schema's (db-collecties)

## ideas/<slug>-<YYYYMMDD>
```json
{
  "date": "2026-09-25",
  "product": "Hismile iD Stain Mouthwash",
  "shop": "Hismile_NL",
  "category": "oral care",
  "price": "€14,99 (€11,24 met coupon)",
  "commission": "€? of %",
  "productUrl": "https://…",
  "images": ["https://…jpg"],
  "trendStage": "opkomend | piek | uitgemolken",
  "score": 78,
  "scoreBreakdown": {"trend": 24, "commission": 12, "saturation": 14, "aiFit": 18, "season": 10},
  "why": "Waarom nu, in 2-3 zinnen",
  "signals": ["bron + wat het zegt"],
  "gap": "de angle die nog niemand doet",
  "concepts": [
    {"name": "Coffee girl", "hook": "If you drink coffee every day...", "angle": "doelgroep-callout",
     "setting": "badkamer ochtend", "scenes": ["...","...","..."], "cta": "..."}
  ],
  "risks": ["compliance/AI-risico's"],
  "status": "new | selected | in_production | done | rejected",
  "updatedAt": "ISO"
}
```

## videos/<id>
`{title, product (= productnaam voor de TikTok-productlink, max ~30 tekens, sluit aan op de woorden in de video), productInfo (echte naam, prijs, commissie), concept, file, credits, status: "made|scheduled|posted", scheduledAt, metricoolId, metrics:{views,likes,comments,shares,avgWatch}, sales, verdict: "winner|promise|flop|pending", why, createdAt}`

## lessons/<id>
`{area, rule, evidence, createdAt}`

## briefings/<YYYY-MM-DD>
`{date, headline, summary, marketNotes[], actions[], seasonal, generatedAt}`

## meta/state
`{credits, creditsSpentTotal, videosMade, videosPosted, salesTotal, commissionTotal, lastRun}`

### videos: post-kit-velden (sinds 25-09)
- `videoAsset`: asset-id van de eind-mp4 (Artifact `asset: true` upload, ≤ ~20MB; groter → opnieuw encoden met crf 21). Dashboard toont hem via `/_blob/<id>` met downloadknop.
- `tiktokTitle`, `caption`, `firstComment`: exact wat in TikTok moet (caption = dezelfde tekst als in Metricool).
- `status: "skipped"` = overgeslagen door Loka.

### chat: live stappen (sinds 26-09)
`chat/c<unix-ms>` = {role:"claude"|"user", at, text, attachments?, agent?, **status**:"working"|"done", **steps**:[{t, s:"run"|"done"|"todo", agent?}]}.
`at` altijd in UTC met Z (de chatpagina schrijft `toISOString()`); met een +02:00-offset sorteert het bericht verkeerd. Claude maakt het doc meteen aan met `status:"working"` en houdt `steps` bij tijdens het werk (hele array meesturen + `if_version`); afsluiten met `status:"done"` + `text`. Het dashboard rendert de stappen live en laat de bijbehorende robot lopen. Prompt staat in trigger `controlRoomChat`.

### meta/state: geld (sinds 27-09)
- `creditRateEur`: prijs per credit in euro (nu 0,06 — 1.000 credits = €60).
- `creditsSpentTotal` × tarief = `spendEurTotal` (kosten tot nu toe).
- `commissionTotal` (omzet) − `spendEurTotal` = netto winst, die het dashboard groen/rood toont.
- `topupsEur`: wat Loka in totaal aan credits heeft uitgegeven. Bijwerken bij elke top-up.
Bij elke nieuwe video: `videos/<id>.credits` invullen en `creditsSpentTotal` + `spendEurTotal` ophogen.


## Geldblok in meta/state — wat is wat (bijgewerkt 28-09)

| Veld | Betekenis |
|---|---|
| `topupsEur` | **Wat er echt betaald is.** Dit is de kostenpost in het dashboard. |
| `creditsSpentTotal` | Credits die op zijn. |
| `spendEurTotal` | Waarde van die verbruikte credits (`creditsSpentTotal` × `creditRateEur`). Informatief, niet de kostenpost. |
| `commissionTotal` | Wat TikTok Shop uitbetaalt. |
| `gmvTotal` | Omzet van de verkochte producten, niet onze omzet. |

Netto winst = `commissionTotal` − `topupsEur`. Verbruikte credits zijn niet de kosten:
een top-up is uitgegeven geld, ook als de credits nog op de plank liggen.
