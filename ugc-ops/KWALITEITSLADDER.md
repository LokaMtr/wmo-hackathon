# Kwaliteitsladder

Elke video moet één ding beter doen dan de vorige, en dat ding wordt hier opgeschreven.
Regel: **nooit twee keer dezelfde video maken met een ander product.** Per video minstens
één nieuwe techniek, en die blijft in de standaard zitten als hij werkt.

## Standaard (geldt nu voor elke video)

| Onderdeel | Regel |
|---|---|
| Hook | Situatie tussen mensen in de eerste 1,5s. Nooit een productmededeling. (L039) |
| Tekst in beeld | **Maximaal 2 momenten**: hook (0–3s) en slotvraag (laatste 2,5s). Daartussen niets. |
| Tekststijl | Wit, geen zwarte rand of kader, zachte schaduw. Zoals TikTok zelf tekst zet. |
| Lengte | Wat de clips toelaten, meestal 17–20s. Niet korter forceren. |
| Ritme | Laat `finish.py` de lengte bepalen (geen `--dur` meegeven): die knipt waar het geluid en de beweging ophouden. Zelf een lengte kiezen kapt haar middenin een zin af. |
| Geluid | Loudnorm naar −14 LUFS, anders klinkt hij zachter dan alles eromheen. |
| Einde | Directe vraag, in beeld én als eerste comment. |

## Per video: wat is er nieuw

| Video | Nieuw sinds de vorige | Werkte het |
|---|---|---|
| teddy-2 | cadeau-/relatie-POV als hook | ja — 5.519 views |
| teddy-3 | tekst van 5 blokken terug naar 2; 17s i.p.v. 20s; ongelijk snijritme | meten na 48u |
| teddy-3 v3 | telefoon-afwerking: ontruisen, handheld, belichtingssprong op elke snede, witbalans per clip, doorlopende ruimtetoon, telefoon-encode | nee — de belichtingssprong flitste |
| teddy-3 v4 | belichtingssprong vangt de snede nu op i.p.v. erbij op te tellen | flits weg, trilling nog zichtbaar |
| teddy-3 v5 | nagebootste camerabeweging eruit | trilling weg, licht/donker nog zichtbaar |
| teddy-3 v6 | alle nagebootste camera-effecten eruit (drift, sprong op de snede, witbalans) | licht/donker weg, clips nog te kort |
| teddy-3 v7 | cliplengte volgt het geluid i.p.v. een zelfbedacht ritme | afkappen weg, ruimtetoon nog hoorbaar |
| teddy-3 v8 | **ruimtetoon eruit** — bleek een lus van haar eigen stem | meten na 48u |
| teddy-4 | wisselende shotgrootte binnen één set (close-up → medium → wide) i.p.v. 4× hetzelfde kader | — |
| volgende | eerste clip 1,5s maken: cut vóór de kijker kan wegswipen | — |
| volgende | b-roll-video met losse voice-over (Mila-stem), zonder gezicht in beeld | — |

## Voice-over

Seed Audio kost **1 credit per regel** (de kostenvoorspelling zei 0,1, maar de
transactiehistorie toont 1,0 per generatie — de voorspelling klopt niet). Nog steeds goedkoop,
maar niet gratis. Vier stemkandidaten staan klaar in `mila-mirror/out/teddy3/vo/`.
Loka kiest er één en die wordt Mila's vaste stem.

Let op: alleen bruikbaar bij clips **zonder** pratende mond in beeld. De Kling-clips van
teddy-3 laten haar praten, dus daar liep een voice-over uit sync — daar blijft het
originele geluid.
