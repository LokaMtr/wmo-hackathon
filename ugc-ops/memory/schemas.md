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
