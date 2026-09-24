# Trend-scout: draaiboek

**Doel:** elke dag 5 producten vinden die NU opkomen in TikTok Shop (NL/EU eerst, VS als vooruitblik), vóór ze uitgemolken zijn, en per product de angle die het best verkoopt, plus 2–3 kant-en-klare concepten voor Mila.

## 0. Eerst lezen
- `ugc-ops/memory/lessons.md` + dashboard-collectie `lessons` (area: products, hooks, script).
- Dashboard-collectie `ideas` (niet opnieuw voorstellen wat al bestaat of `rejected` is, tenzij er nieuw bewijs is).
- Dashboard-collectie `videos` + `meta/state` (wat verkoopt al, hoeveel budget).

## 1. Bronnen (gratis)
Gebruik WebSearch (let op: resultaten zijn VS-gericht, zoek daarom expliciet op NL/EU-termen) en WebFetch waar niet geblokkeerd.
- Zoektermen, elke run variëren: `"tiktok shop" viral <categorie> <maand jaar>`, `"tiktokmademebuyit" <categorie>`, `trending tiktok shop products this week`, `tiktok shop best sellers netherlands`, `"viral op tiktok" <product>`, Google Trends-achtige vragen.
- Categorieën roteren: beauty/skincare, oral care, haar, loungewear/shapewear, home/gadgets, keuken, wellness, tech-accessoires, cadeaus (seizoen!), huisdier.
- Seizoen/kalender meenemen: herfst → cozy, Sinterklaas 5 dec, Black Friday, kerst, Valentijn, zomer.
- Nieuwsartikelen/blogs over "viral TikTok product" zijn vroege signalen; retail-lijstjes zijn late signalen.

## 2. Trendfase bepalen
- **opkomend**: eerste virale video's < 2–3 weken, weinig creators, nog nauwelijks in lijstjes → instappen.
- **piek**: overal in lijstjes, veel creators → alleen met een nieuwe angle.
- **uitgemolken**: dupes, kortingen, "ik ben het zat"-video's → overslaan.

## 3. Score (0–100)
`score = trend (0–30) + commissie/prijs (0–20) + verzadiging omgekeerd (0–20) + AI-maakbaarheid (0–20) + seizoen (0–10)`
- AI-maakbaarheid laag bij: product dat van vorm verandert in handen, vloeistof/eten in de mond, claims die alleen met echt resultaat te bewijzen zijn, merken met auteursrecht (Disney e.d.).
- Hoog bij: product dat je vasthoudt of neerzet, wearables die je gewoon aan hebt, gadgets met zichtbaar effect (licht/projectie).

## 4. Angles vinden
Per product: welke 3 hooks gebruiken de best lopende video's, en welke angle ontbreekt nog (het gat)? Denk aan: doelgroep-callout ("if you drink coffee every day…"), sceptisch→overtuigd met concreet bezwaar, POV/cadeau, mini-sketch met omslag, test/demo, "things I stopped doing".

## 5. Output
Schrijf naar het dashboard (ArtifactData, zie `memory/config.json`):
- `briefings/<datum>`: `{date, headline, summary (3–5 zinnen), marketNotes[], seasonal, generatedAt}`
- per product `ideas/<slug>-<datum>` met het schema uit `memory/schemas.md`.
- Voeg product-afbeeldingen toe als publieke URL's (van de winkel/fabrikant), minimaal 1.
- Zet `status: "new"`.

## 6. Leren
Nieuwe inzichten (bv. "categorie X verzadigd", "bron Y gaf vroege signalen") → les in `lessons` + `memory/lessons.md`.
