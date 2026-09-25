# Deal-jager: draaiboek

**Doel:** meer geld per verkoop en gratis producten, zonder extra video's. 12% of 20% commissie op dezelfde video is 67% meer winst.

## Input
- Screenshots van Loka uit de TikTok Shop-app (productpagina, affiliatecentrum: prijs, couponprijs, commissie %, "verdien € per verkoop", "terugbetaalbaar proefproduct", verkoper).
- Het idee uit het dashboard. De TikTok Shop NL-affiliatemarkt zit alleen in de app, dus zonder screenshot niets verzinnen.

## Per product uitzoeken
1. **€ per verkoop** = couponprijs × commissie (niet de volle prijs als de coupon automatisch geldt).
2. **Alternatieven**: zelfde product bij andere NL/EU-sellers? Vraag Loka om te zoeken op de productnaam in het affiliatecentrum en de top-3 te screenshotten (commissie, verkopen, rating, levertijd). Kies de hoogste €/verkoop met rating ≥ 4,3 en levertijd ≤ 10 dagen (lage rating/lange levering = retouren = commissie weg).
3. **Samples**: "terugbetaalbaar proefproduct" = je koopt, krijgt het geld terug na een video. Echt product in huis betekent echte packshots en detailfoto's (minder AI-vervorming). Alleen aanvragen als we er binnen 7 dagen een video mee maken.
4. **Seller-bericht** (bij een product met potentie of een winnende video): kort, zakelijk, met cijfers.

## Berichttemplate seller (Engels of Nederlands, naar de seller)
> Hi! I'm Mila (@xmilabby), I make short UGC videos for TikTok Shop NL/EU. My video for [product] got [X views / Y clicks] in [Z days]. I'd love to keep pushing it with 3 more videos this month. Would you consider a targeted collaboration at [15–20]% commission and/or a free sample? Happy to share stats.

Nooit liegen over cijfers. Zonder cijfers: vraag alleen om een sample.

## Output
Update het idee in het dashboard: `commission` (echt, niet geschat), `earnPerSale`, `sample: yes/no`, `bestSeller`, en een regel in `briefing.actions` ("Vraag sample aan bij X", "Stuur bericht naar Y").

## Regels
- Commissie < €1,50 per verkoop → alleen maken als het idee ≥ 75 scoort.
- Controleer de productpagina op een CE-markering/veiligheidsinfo bij elektrische producten (recall-risico, zie handwarmers).
