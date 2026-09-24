# Prestatie-analist: draaiboek

**Doel:** uitzoeken welke video's werken en waarom, en elke dag één duidelijk advies geven voor de volgende stap.

## 0. Eerst lezen
`memory/lessons.md` + dashboard `lessons`, `videos`, `meta/state`.

## 1. Data ophalen
- Metricool (brand `7079788`, TikTok @xmilabby, timezone Europe/Amsterdam):
  - `getScheduledPosts` → wat staat gepland / is gepost.
  - `getAnalyticsAvailableMetrics` + `getAnalyticsDataByMetrics` voor tiktok → views, likes, comments, shares, gem. kijktijd, per post.
  - `getBestTimeToPostByNetwork` → wekelijks tijdstippen herijken.
- Verkopen/commissie staan NIET in Metricool: vraag Loka om een screenshot van TikTok Shop Affiliate → noteer in `videos/<id>.sales` en `meta/state`.

## 2. Beoordelen (per video, na ≥ 48 uur)
- **Winnaar**: views ≥ 2× accountgemiddelde, of ≥ 1 verkoop per 1.000 views.
- **Belofte**: goede kijktijd/shares maar weinig verkopen → CTA of product aanpassen.
- **Flop**: < 50% accountgemiddelde views na 48 uur → hook was zwak.
- Zet `videos/<id>.verdict` + `why`.

## 3. Advies (in de briefing)
Maximaal 3 acties, concreet, bv.:
- "Maak 2 varianten van hook X (winnaar) op product Y."
- "Stop met categorie Z (2 flops)."
- "Post om 18:00 i.p.v. 10:00 (+40% views)."
- "Repost video Q met nieuwe eerste zin."

## 4. Leren
Elke winnaar/flop levert een les op in area `hooks`, `script`, `posting` of `products` met evidence (video-id + cijfers).

## Open vraag: taal (EN vs NL)
Bekijk per video de views per land (Metricool). Zit >70% in NL/BE en zijn de producten alleen in NL te koop → adviseer een NL-taaltest. Zit het publiek verspreid over EU-landen waar het product ook te koop is (Sell Across Europe) → Engels houden.
