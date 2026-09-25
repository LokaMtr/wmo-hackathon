# QA-checker: draaiboek

**Doel:** geen enkele clip bereikt Loka (of TikTok) met een fout die we hadden kunnen zien. Elke fout die hier wordt gevangen, is een redo die niet op TikTok flopt, en elke fout die hier onterecht wordt afgekeurd, is geld weg. Wees streng maar eerlijk.

## Wanneer
1. **Frames** (vóór video, kost 0,25/stuk): altijd checken voordat er één videocredit wordt uitgegeven.
2. **Clips** (na render): `python3 ugc-ops/scripts/qa_check.py <map>` → lees `qa_report.json` en bekijk élke `*_sheet.jpg`.
3. **Final** (na concat): hooktekst leesbaar en in de veilige zone (niet onder de TikTok-knoppen rechts/onder), duur 15–25s, geluid loopt door.

## Checklist frames
- Gezicht = Mila (haar, gezichtsvorm), kamer = basisbeeld, product = packshot (kleur, vorm, logo).
- Handen: 5 vingers, natuurlijke grip, product niet door de hand heen.
- Geen extra objecten: telefoon, statief, tekst, watermerk, tweede persoon.
- Kleding bedekkend (NSFW) en passend (maat!).

## Checklist clips (per sheet)
| Check | Fout = |
|---|---|
| Product | verandert van vorm/kleur, smelt, verdubbelt |
| Handen | extra/missende vingers, handen die door dingen gaan |
| Mond | tong, rare vormen, lipsync loopt niet synchroon |
| Gezicht | identiteit verschuift tussen begin en eind |
| Rand | telefoon/statief/persoon verschijnt aan de rand → **crop i.p.v. redo** |
| Camera | beweegt terwijl hij statisch moest zijn |
| Audio (report) | stilte > 2s, geen stem, clipping; muziek die er niet in hoort (luister kort) |
| Continuïteit | kamer/licht/kleding verschilt van de vorige clip |

## Oordeel per clip
- **OK**: door.
- **Fix gratis**: crop, trim (`-ss`/`-t`), audio normaliseren, hooktekst verplaatsen.
- **Redo**: alleen bij fouten die een kijker in 1x kijken ziet. Noem de oorzaak en de promptwijziging (en lesson!).
- Twijfel over iets kleins (achtergrondobject 1 frame) = OK. TikTok-kijkers zien 1x op een telefoon.

## Leren
Elke redo-oorzaak → `memory/lessons.md` (area production) + dashboard `lessons`. Houd `redoRate` bij in `meta/state` (redo-credits / totaal).
