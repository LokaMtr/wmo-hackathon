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

---

## Vastgelegde referenties (28-09-2026)

| Sheet | Higgsfield media_id | Wat erop staat |
|---|---|---|
| **Mila** | `1bc969bd-2ac1-47d4-bc55-8b0ba8abe6f1` | 4x ten voeten uit (voor, driekwart, profiel, achter) + 3x gezicht (voor, driekwart, profiel). Vrijwel geen make-up, sproeten, zichtbare huidtextuur. |
| **Kameo kussen** | `591066c9-fe2b-48e9-bf36-6522dce1229a` | voor, zijprofiel, bovenaanzicht, driekwart, macro honingraat |
| **Khamrah parfum** | `131b59a9-48d8-4fb7-b140-fbebee425749` | flesje voor, driekwart, zij, macro dop en glas, flesje naast doos |

De oude vier losse gezichtsreferenties (`20ca8397…`, `c1e0450e…`, `e7f04c0c…`,
`8cae6b93…`) worden niet meer gebruikt. Ze waren vrijwel allemaal frontaal (L070).

Eerste poging aan de Mila-sheet kreeg een volledig Instagram-gezicht (contouring,
wimpers, aangezette lippen) ondanks "natural minimal makeup" in de prompt. Opgelost door
make-up niet te beschrijven maar uit te sluiten: "essentially bare-faced, no contour, no
false lashes, no lip liner, girl-next-door, not a model". Een positieve omschrijving laat
het model ruimte; een lijst van wat níet mag, niet.

## Rolverdeling in elke prompt (L069)

```
@Image1 (Mila-sheet) bepaalt alleen: gezicht, haar, huid, lichaamsbouw.
  Niet overnemen: de witte achtergrond, de pose, het tanktopje en de joggingbroek.
@Image2 (product-sheet) bepaalt alleen: vorm, kleur, materiaal en verhoudingen van het product.
  Niet overnemen: de witte studioachtergrond, de rangschikking in panelen.
```

Kleding wordt per video apart in de prompt beschreven, volledig van hoofd tot voeten
(L052). De sheet draagt bewust neutrale kleding zodat die niet meelekt.
