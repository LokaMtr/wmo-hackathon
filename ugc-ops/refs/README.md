# Referentiesheets

Tot nu toe begon elke video bij nul: nieuwe frameprompt, nieuw gezicht, nieuwe kamer,
en elke keer de kans dat er iets afwijkt. Twee vaste sheets halen dat weg.

## 1. Character sheet — Mila

Eén beeld met links Mila staand ten voeten uit en rechts een close-up van haar gezicht,
op een witte achtergrond. Dat beeld wordt daarna de referentie bij élke frameprompt, in
plaats van de vier losse gezichtsreferenties die we nu meesturen.

Wat erin vastligt en nooit meer per prompt beschreven hoeft te worden:
gezichtsvorm, kaaklijn, jukbeenderen, neus, lippen, oogkleur en -vorm, wenkbrauwen,
haarkleur en -lengte en -val, huidtextuur, lichaamsbouw, lengte.

Eisen die uit onze eigen fouten komen:
- **Zichtbare huidtextuur**, poriën, lichte asymmetrie. Geen gladgestreken filterhuid.
  Dat is wat mensen als eerste als AI herkennen (ONDERZOEK-ECHTHEID.md).
- **Gedempte lichtvlekjes in de ogen.** Te grote glans in de iris is een AI-tell.
- **Volwassen gezichtsstructuur**, geen babyface. Modellen drijven daar vanzelf heen.
- Origineel personage, geen gelijkenis met een bestaand persoon.

## 2. Product sheet — per product

Per product één beeld met het product van voren, van opzij, plat neergelegd en een
macro-detail van het materiaal, op dezelfde witte achtergrond.

Waarom dit nodig is: bij teddy-B trok Kling terug naar een hoodie met blote benen in
plaats van de romper, en bij de tweede poging zaten er ineens knopen op waar een rits
hoorde (L066). Met een product sheet als referentie heeft het model geen ruimte meer om
het kledingstuk zelf te verzinnen.

Wat er letterlijk bij hoort, per product: de vorm (eendelig, tweedelig, los), de lengte
van mouwen en pijpen, de sluiting, het materiaal, de kleur met ondertoon.

## Hoe ze gebruikt worden

Elke frameprompt krijgt vanaf nu twee referenties mee: de character sheet en de product
sheet. De prompt beschrijft dan alleen nog de **situatie** — waar ze is, wat ze doet,
welk shot het is — en niet meer wie ze is of hoe het product eruitziet.

Dat scheelt ook prompt-ruimte, en die ruimte gaat naar de beweging in het shot. Dat is
precies waar het tot nu toe misging.
