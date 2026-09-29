# SCRIPT-MASTER — Mila-video's die niet als AI of als reclame lezen

Stand 29-09-2026. Vervangt niets uit KWALITEITSLADDER.md; dit is het draaiboek dat je
er náást legt bij elke nieuwe video. Lessen waar het op rust: L039, L051, L063–L070,
L078, L082, L084.

**Het probleem in één zin:** 1,9 s gemiddelde kijktijd = de kijker ziet een opbouwbeeld
(vrouw zit, gaat praten) en is weg vóór er iets gebeurt (L064). Alles hieronder dient om
frame 0 al "midden in iets" te laten zijn, en om de eerste snede vóór 2,0 s te leggen.

Pijplijn: `gpt_image_2_5` startbeeld (iPhone-still, al midden in de actie) → Kling 3.0
image-to-video 5 s (of 10 s bij één doorlopende handeling) met native audio → knippen op
het 30 fps-raster → `finish.py` → loudnorm −14 LUFS. Seedance 2.5 (~6× duurder) alleen
voor body-shots die veel referenties tegelijk nodig hebben, **nooit voor hooks** (L071).

---

## 0. Framemath — onthoud dit

| | 24 fps (Kling-output, gemeten: 5,04 s = 121 frames) | 30 fps (onze export) |
|---|---|---|
| 1 frame | 41,7 ms | 33,3 ms |
| 0,1 s | 2,4 frames (niet exact) | **3 frames (exact)** |
| 0,125 s | **3 frames (exact)** | 3,75 frames |
| 0,25 s | **6 frames** | 7,5 frames |
| 0,5 s | **12 frames** | **15 frames** |
| 1,0 s | 24 frames | 30 frames |
| 5,0 s | 120 (+1) frames | 150 frames |

Regels die hieruit volgen:
- **Tijdlijn in de montage**: altijd in veelvouden van 100 ms (= exact 3 frames bij 30 fps). Geen 1,45 s; wél 1,400 of 1,500.
- **Bronpunten in een Kling-clip** mogen afronden op het 24 fps-raster (±21 ms); dat zie je niet.
- **In de prompt**: 0,1 s-stappen alleen voor 0,0–1,0 s (de hook), daarna 0,5 s-stappen. Kling volgt de *volgorde* van gebeurtenissen betrouwbaar, de *exacte* tijd niet (vuistregel uit onze eigen clips: ±0,3–0,5 s). Frame-nauwkeurigheid maak je in de montage, niet in de prompt.
- **Het beginbeeld doet de hook, niet de tijdlijn.** Wat op 0,0 s moet gebeuren staat al in het startbeeld. De tijdlijn beschrijft alleen wat daarna verandert.

---

## 1. Kling-prompttemplate

### 1a. De blokken (altijd alle negen, altijd in deze volgorde)

Structuur gebaseerd op fal.ai's gids (FORMAT / STARTING STATE / TIMELINE / CAMERA /
CONTINUITY / AUDIO / CONSTRAINTS) plus onze eigen drie faalpunten (armen, product, accent).

```
FORMAT: 5-second single continuous take, vertical 9:16, real iPhone footage filmed by
a real person, [selfie front camera | phone propped on <surface> | POV back camera held
by her own hand]. Real-time speed. No cuts, no slow motion.

STARTING STATE (0.0 s): The video begins mid-action, exactly as the start image.
[Wie waar, wat de handen doen, waar het product staat, welke beweging AL bezig is.]
There is no intro, no settling, no pause before the action continues.

ARMS/HANDS: Exactly two arms and two hands in total for Mila. [selfie:] Her RIGHT arm
holds the phone for the entire clip; it stays extended toward the lens and never moves.
Only her LEFT hand moves. No hand ever enters the frame from below or from the sides.
[neergezet:] Both hands stay visible and [anchor: on the counter / around the mug].
[POV:] Only the phone-holder's LEFT hand is visible, entering from the bottom-left.
No third hand, no extra fingers.

PRODUCT LOCK: [letterlijke beschrijving, zie 1c]. The product is a rigid object: it
never bends, folds, dents, melts, changes size, changes colour or changes shape. Its
colour stays [exacte kleur] from the first to the last frame. There is exactly one.
It stays [plek: under her left arm / on the windowsill left of the mug].

TIMELINE:
0.0-0.3 s: [wat al bezig is, gaat door]
0.3-0.6 s: [eerste verandering]
0.6-1.0 s: [tweede verandering / eerste woord]
1.0-1.5 s: ...
1.5-2.0 s: ...
(... in 0.5 s-stappen tot het einde ...)
4.3-5.0 s: [stille, rustige eindpositie — geen nieuwe actie, deadpan look / hold]

CAMERA: [wie houdt vast] [kader: medium close-up, face in upper third]. The camera
[does not move | follows only the natural sway of her extended arm]. The camera does
not [pan/zoom] until [gebeurtenis]. [Of: no camera movement at all; the phone rests
on the shelf.]

CONTINUITY: Same woman as the start image throughout: [haar: loose blonde, not
styled, flyaways], [kleding incl. lengte, L052/L066], same room, same light direction,
same clutter ([mok, oplaadkabel, handdoek]). Face softly and evenly lit, calm and
relaxed expression, eyes normally open.

AUDIO: Mila speaks in a natural American accent (casual West Coast, relaxed and
conversational, like talking to a friend on FaceTime) — not British, not RP, no
announcer voice. [Mila, calm, slightly amused]: "<regel>" (spoken 0.6-2.4 s).
Normal speaking mouth movement only, no exaggerated mouth shapes. Room sound:
[quiet apartment, faint fridge hum / rain on window]. Contact sounds: [soft thud
when the pillow lands]. No music. No other voices.

CONSTRAINTS: No cuts, no slow motion, no zoom, no text, no captions, no logos, no
watermark, no extra people, no third hand, no product duplicates, no product
deformation, no colour shift, no studio lighting, no perfect composition, no
beauty-filter skin, no wide-eyed expression, no music.
```

Heeft het Higgsfield-scherm een apart **negative prompt**-veld (Kling 3.0 i2v heeft dat),
zet de CONSTRAINTS dáár als korte zelfstandige naamwoorden:
`extra arms, third hand, extra fingers, deformed hands, morphing product, bent pillow,
colour change, duplicate bottle, text, subtitles, logo, watermark, music, studio lighting,
slow motion, cut, zoom, wide eyes, British accent`.
Regel (ook van Kling-gidsen): **als Kling door je negatives heen breekt, is je positieve
prompt te open.** Eerst STARTING STATE/ARMS/PRODUCT LOCK aanscherpen, niet meer negatives.

### 1b. Woorden die je nooit schrijft

| Niet | Waarom | Wel |
|---|---|---|
| studio lighting, professional, cinematic, perfect composition, 4K, beautiful | levert reclamelook (L084) | lamp on the left, window light, slightly uneven |
| handheld phone look | onzichtbare cameraman (L078) | her right arm holds the phone |
| dynamic, energetic | stemming, geen instructie (L068) | wat beweegt, waarheen, wanneer |
| hugs the pillow, squeezes, shakes | zacht product vervormt | pillow clamped under her left arm |
| opens the cap, sprays close-up, zips | mechanisme (L051) | bottle already uncapped / mist already in the air |
| excited, shocked, surprised | wijd opengesperde ogen (L082) | calm, subtle, relaxed, small smile |
| someone, they | model kiest zelf | Mila, the man in the grey hoodie |

### 1c. Product-locks (plak letterlijk, in élke frame- én videoprompt)

- **Kussen (Kameo)**: `a firm rectangular white memory-foam pillow; ONLY its top surface is a flat purple honeycomb grid with white inside the cells; the sides are plain white; it is rigid and never bends, folds, dents, droops or hangs; clamped flat under her left arm, never hugged.` Handdruk in de honingraat mag alleen als POV-macro met de hand al ín de cellen op 0,0 s (M1 shot 4).
- **Parfum (Khamrah)**: vul in vanaf de échte productfoto (referentie 131b59a9…): `the exact bottle from reference image: [glaskleur], [vorm], [dop]; one bottle only; glass stays [kleur] in every frame; label not readable; the cap stays on (or: the cap is already off and lies on the shelf, untouched)`. Nooit op de dop drukken in beeld, nooit spray van dichtbij. Nevel = al in de lucht in het startbeeld.
- **Herencadeau**: zelfde patroon — `rigid [materiaal], [kleur], [afmeting t.o.v. haar hand: fits in her palm]`, één exemplaar, altijd vast op één plek of in twee handen, nooit iets openmaken.
- Referentierol altijd uitschrijven (L069): `@Image1 defines ONLY the product shape and colour. Do not copy its white background or lighting.`

### 1d. Spreektiming

Basis: rustig Amerikaans praten = **2,3–2,7 woorden/s** (≈150 wpm). Kling proppen = mond
loopt uit sync en ze gaat haasten of wordt midden in een woord afgekapt.

| | 5 s-clip | 10 s-clip |
|---|---|---|
| Eerste woord | niet vóór 0,4 s (lipsync op frame 0 smeert) | idem |
| Laatste woord klaar | uiterlijk 4,3 s | uiterlijk 9,2 s |
| Spreekvenster | 0,4–4,3 s = 3,9 s | 0,4–9,2 s = 8,8 s |
| **Max. woorden** | **9** (streef 6–8) | **20** (streef 14–18) |
| Pauzes | max. 1 | 1–2 |
| Na laatste woord | ≥0,6 s stille reactie/hold (die gebruik je als L-cut of deadpan) | ≥0,8 s |

- Pauzes schrijven: komma ≈ 0,2–0,3 s; `…` ≈ 0,5–0,8 s; wil je een exacte stilte, zet de tijd erbij: `(pause 0.6 s, she looks at the pillow)`.
- Hooks die gezegd worden: **max. 5 woorden in de eerste 2 s.**
- Getallen uitschrijven ("four", niet "4"); geen merknamen laten uitspreken (die gaan mis).
- Eén regel per clip, één spreker per clip. Twee pratende gezichten = afgeraden (ONDERZOEK-CREATIEF).
- Dialoog aan een zichtbare actie binden, met de speaker-tag vlak ervoor (Kling-gids): `She sets the pillow down. [Mila, deadpan]: "Don't touch it."`
- Na generatie altijd `tools/hear.py`: klopt het aantal woorden, begint het ≥0,4 s, stopt het ≤4,3 s?

### 1e. Ingevuld voorbeeld A — pratende selfie, kussen (M3 shot 3, 5 s)

```
FORMAT: 5-second single continuous take, vertical 9:16, real iPhone front-camera
selfie filmed by Mila herself. Real-time speed. No cuts, no slow motion.

STARTING STATE (0.0 s): Exactly the start image. Mila, blonde woman mid-20s, sits
cross-legged on a man's unmade bed with a grey duvet. The purple-top pillow already
lies flat on the bed next to her left knee; her left hand is already resting flat on
its purple top. She is already looking into the lens with a small, calm smile. There
is no intro and no settling.

ARMS/HANDS: Exactly two arms and two hands. Her RIGHT arm holds the phone for the
whole clip, extended toward the lens, and never moves. Only her LEFT hand moves. No
hand enters the frame from below.

PRODUCT LOCK: a firm rectangular white memory-foam pillow; ONLY its top surface is a
flat purple honeycomb grid with white inside the cells; plain white sides; rigid, it
never bends, folds, dents or changes colour. One pillow. It stays flat on the bed
beside her left knee for the entire clip.

TIMELINE:
0.0-0.3 s: her left hand pats the purple top once, lightly.
0.3-0.6 s: hand stays on the pillow; she keeps eye contact with the lens.
0.6-1.0 s: she starts speaking.
1.0-1.5 s: still speaking, small eyebrow raise.
1.5-2.5 s: she finishes the line, left hand still on the pillow.
2.5-3.5 s: silent, deadpan look into the lens, tiny smile.
3.5-5.0 s: holds the same position; nothing new happens.

CAMERA: Mila's own extended right arm; medium close-up, her face in the upper third,
the pillow visible in the lower third. The phone only follows the natural slight sway
of her arm. No pan, no zoom.

CONTINUITY: same woman as the start image, loose unstyled blonde hair with flyaways,
oversized cream knit sweater covering her arms to the wrists, grey joggers. Same
bedroom, bedside lamp on the left plus window light on the right, softly and evenly
lit face, a charger cable and a water glass on the nightstand. Calm, relaxed expression.

AUDIO: Mila speaks in a natural American accent (casual West Coast, relaxed and
conversational) — not British. [Mila, calm, dry]: "Don't touch it." (spoken
0.7-1.6 s). Normal speaking mouth movement only. Room sound: quiet bedroom, faint
street noise. Soft pat sound at 0.1 s. No music. No other voices.

CONSTRAINTS: no cuts, no zoom, no text, no logos, no extra people, no third hand,
no pillow deformation, no colour shift, no studio lighting, no wide eyes, no music.
```

### 1f. Ingevuld voorbeeld B — neergezette camera zonder spraak, parfum (M4 shot 2, 5 s)

```
FORMAT: 5-second single take, vertical 9:16, iPhone resting on a windowsill, filmed
by nobody (static phone). Real-time. No cuts.
STARTING STATE (0.0 s): Exactly the start image: the amber bottle stands on the
windowsill where the mug was, a thin curl of warm mist is already rising behind it,
rain already running down the glass.
ARMS/HANDS: No hands and no people in frame at any time.
PRODUCT LOCK: the exact bottle from @Image1 (shape and colour only; do not copy its
background). One bottle, rigid, never changes colour, size or shape, never moves.
TIMELINE:
0.0-0.5 s: mist keeps curling upward, rain drops keep sliding.
0.5-2.0 s: one large drop runs down the glass behind the bottle.
2.0-5.0 s: same, calm; the light from outside dims very slightly.
CAMERA: no movement at all; the phone rests on the sill. Focus stays on the bottle.
CONTINUITY: same window, same grey afternoon light, same position of the bottle.
AUDIO: steady rain on glass, faint room tone. No voice. No music.
CONSTRAINTS: no hands, no people, no second bottle, no text, no logo, no zoom, no music.
```

---

## 2. Montagetemplate (timing in ms)

### 2a. Vaste regels

| Moment | Regel |
|---|---|
| **0 ms (frame 0)** | Beeld is al in beweging (bronpunt nooit 0,0 van de clip; begin 0,3–0,9 s in, waar de actie al loopt). Geluid op vol niveau vanaf frame 0: geen fade-in, nooit. Liefst een herkenbaar contactgeluid (squish, espresso-sis, "psst", klop). |
| **0–100 ms** | Hooktekst staat er vanaf frame 0 (uiterlijk frame 3 = 100 ms). Max. 7 woorden, bovenste derde maar onder de TikTok-UI-balk, wit met zachte schaduw. Zichtbaar tot 2.500–3.000 ms. |
| **Eerste snede** | Tussen **1.200 en 2.000 ms**. Nooit later. De snede ís de tweede hook. |
| Volgende snedes | Elke 1.500–3.500 ms iets nieuws (snede, shotgrootte, tekst of actie). Nooit >4.000 ms zonder verandering. Nooit twee keer hetzelfde kader na elkaar (L063). |
| Shotlengtes | Hook 1.200–2.000 · insert 600–1.000 · pratend shot 2.500–5.000 (volgt de zin, niet de klok — L049) · slotshot 1.500–3.000. |
| **J-cut** | Stem van het volgende shot 300–500 ms vóór het beeld (`tools/jcut.py`). Gebruik bij elke overgang naar een pratend shot. Beeld van B begint op bron-offset = lead, zodat de lippen synchroon blijven. |
| **L-cut** | Stem loopt 500–900 ms door over een insert (productmacro, klok, reactie). Zo knip je op 1.500 ms zonder haar zin af te breken. |
| Tekst | Max. 2 momenten: hook (0–3 s) en slotvraag (laatste 2.500 ms). Niets ertussen. Tekst die in beeld moet (sms, comment-bubbel, notitie) altijd in montage opbouwen, nooit laten genereren. |
| **Loop-einde** | Laatste 500–800 ms = het stuk van clip 1 vóór het hook-inpunt, zodat frame laatste → frame 0 doorloopt. Of: laatste zin wordt afgemaakt door de eerste. Nooit een fade-out, nooit een zwart eindbeeld. |
| Totaal | **15.000–22.000 ms.** Opbouw: opzet → escalatie → clou → nagrap (L082). |
| Geluid | Clip-audio doorlopend onder de sneden; loudnorm −14 LUFS; check op door Kling toegevoegde muziek. |

### 2b. Uitgewerkt voorbeeld — M2 "Caffeine Curfew" (Khamrah), 15.900 ms, 30 fps

Bronclips: **c1** telefoon op aanrecht, espressoapparaat voorgrond, zij kin op handen,
klok 16:03, zegt "No coffee after four. Doctor's orders… my orders." en loopt weg (5 s) ·
**c2** gouden nevel in zonnestraal, zij stapt erin (5 s) · **c3** selfie, flesje bij
sleutelbeen: "Coffee, vanilla, a bit of cinnamon. Decaf, technically." (5 s) ·
**cC** macro koffiebonen vallen voor het flesje (5 s).

| Tijdlijn (ms) | Frames @30 | Beeld (bron in s) | Geluid | Tekst |
|---|---|---|---|---|
| 0 – 1.500 | 0–44 | c1 0,80–2,30: al starend over het apparaat, klok 16:03 | c1 vanaf 0,80: espresso-sis op frame 0, "No coffee after four." (≈200–1.400) | **0–2.700: "caffeine curfew, day 3"** |
| 1.500 – 2.300 | 45–68 | **cC 0,50–1,30** (eerste snede: bonen vallen, flesje onscherp) | **L-cut**: c1 loopt door (bron 2,30–3,10): "Doctor's orders…" | hook blijft |
| 2.300 – 4.100 | 69–122 | c1 3,10–4,90: terug op haar, "…my orders.", ze loopt uit beeld | c1 (lippen synchroon: tijdlijn = bron − 0,80) | — |
| 4.100 – 7.900 | 123–236 | c2 0,60–4,40: nevel al in de lucht, zij stapt erin, ogen dicht | c2: "psst" ≈500 ms na snede, zucht | — |
| 7.500 – 7.900 | 225–236 | (beeld nog c2) | **J-cut**: c3-stem start op bron 0,30 onder c2 (c2 naar 35%) | — |
| 7.900 – 12.100 | 237–362 | c3 0,70–4,90: selfie, flesje bij sleutelbeen, deadpan na "technically." | c3 (tijdlijn = bron + 7,20) | — |
| 12.100 – 15.100 | 363–452 | cC 1,30–4,30: bonen vallen, nagrap-sfeer | cC knisper + c3-staart eronder | **13.400–15.900: "coffee or vanilla person?"** |
| 15.100 – 15.900 | 453–476 | **c1 0,00–0,80** = het stuk vlak vóór het hook-inpunt | c1 0,00–0,80 | vraag blijft |
| 15.900 → 0 | 477 → 0 | **Loop**: laatste frame (c1 0,77) sluit naadloos aan op frame 0 (c1 0,80) | | |

Controle: eerste snede 1.500 ms ✓ · langste shot 4.200 ms (c3, volgt de zin) ✓ ·
tekst 2 momenten ✓ · 15.900 ms ✓ · alle snedes op het 100 ms-raster ✓.
Coverage-variant b: open met cC 0,50–2,00 (bonen = geluid + beweging) en schuif alles 1.500 ms op.

---

## 3. Hookbibliotheek — 25 visuele hooks die als gewone content lezen

Legenda: **K** = kussen, **P** = parfum, **H** = herencadeau. ✓ = werkt, ~ = met aanpassing.
Cameraman staat er steeds bij (L078). Frame-voor-frame = 0–1.000 ms; het startbeeld is
altijd al het 0 ms-beeld, dus alle actie is "al bezig".

### A. Mid-action (je valt midden in iets)

**1. Al halverwege de worp** — K ✓ · P – · H ~
- 0 ms: kussen in de lucht boven een onopgemaakt bed, haar arm nog gestrekt (neergezet op dressoir).
- 0–400: kussen landt plat, stuitert niet, zacht "thud".
- 400–1.000: zij laat zich ernaast vallen, gezicht naast het kussen.
- Waarom: beweging + geluid op frame 0; de hersenen willen de landing zien. Kussen blijft stijf: landt plat, geen vervorming (worp alleen als het startbeeld het al vlak toont).

**2. Hand al in de honingraat (POV-macro)** — K ✓
- 0 ms: vier vingertoppen al half in de paarse cellen, "squish" hoorbaar.
- 0–500: vingers komen omhoog, cellen springen terug.
- 500–1.000: tweede duw, iets langzamer.
- Waarom: textuur-ASMR = oplosbaar raadsel in 1 s; herkenbaar als "satisfying".

**3. Al aan het wegsluipen met de buit** — K ✓ · P ✓ · H ✓
- 0 ms: zij op tenen in de gang, product onder de arm, kijkt over schouder naar de lens (telefoon op de kast).
- 0–600: nog twee stappen, stopt als ze de camera ziet.
- 600–1.000: bevriest, kleine schuldige glimlach.
- Waarom: "betrapt" = verhaal in één beeld; vraag "van wie is dat?".

**4. Midden in een zin, al geïrriteerd** — K ✓ · P ✓ · H ✓
- 0 ms: selfie, mond al open op het midden van een woord ("…and he said *pillows*"), wenkbrauw op.
- 0–700: maakt de zin af (≤4 woorden).
- 700–1.000: stilte, droge blik.
- Waarom: je mist het begin → je blijft voor de context. Tekst in beeld zet de situatie neer.

**5. Hand al bij de deurklink (tijdsprong-open)** — K ✓ · H ✓
- 0 ms: POV van hem, deur staat al open, zij in het trappenhuis met kussen onder de arm en weekendtas.
- 0–500: zij stapt zonder iets te zeggen langs de lens naar binnen.
- 500–1.000: hij (off-screen): "…I have pillows."
- Waarom: onverwachte bezoeker + onverklaard object = direct een vraag. (M3)

### B. Vaste camera / CCTV / pet cam (de beste cameraman die er is)

**6. Pet-cam, nacht, 03:12** — K ✓ · P ~ · H ~
- 0 ms: groenig nachtzicht, bed van boven-hoek (camera op kast), tijdstempel tikt, kat al óp het kussen.
- 0–500: zij draait zich om in bed, hand zoekt het kussen.
- 500–1.000: kat verroert zich niet, oor draait.
- Waarom: CCTV-korrel verbergt AI, genre belooft drama. Tijdstempel via `tools/cctv_ass.py`.

**7. Ring-deurbelcamera** — K ✓ · P ✓ · H ✓
- 0 ms: fisheye-deurbelbeeld, zij staat al vlak voor de lens met het product omhoog als bewijsstuk.
- 0–600: kijkt recht in de camera, knikt één keer.
- 600–1.000: draait het product naar de lens.
- Waarom: iedereen kent het deurbelformat; reclame gebruikt het nooit. H: "cadeau verstoppen voor hij thuiskomt".

**8. Babyfoon / pet-cam overdag, "custody battle"** — K ✓
- 0 ms: vaste camera op bank-hoogte, kat en Mila allebei al met een hand/poot op hetzelfde kussen.
- 0–500: kat trekt niet, zij trekt niet — stilstand.
- 500–1.000: kat legt zijn kop erop.
- Waarom: conflict + dier = reacties ("team kat"). Kussen ligt plat, niemand trekt eraan (vervorming).

**9. Telefoon op het aanrecht, blik óver iets heen** — P ✓ · H ~
- 0 ms: espressoapparaat scherp voorgrond, zij erachter kin op handen, klok 16:03 in beeld.
- 0–1.000: haar ogen gaan van het apparaat naar de klok en terug, sis van de machine.
- Waarom: verlangen + klok = situatie in 0,5 s gelezen. (M2)

### C. POV / relatie (situatie tussen mensen, L039)

**10. POV: je vriendin inspecteert jouw bed** — K ✓
- 0 ms: zij houdt al zijn platte grijze kussen tussen duim en wijsvinger omhoog, gezicht vol oordeel (POV hij in deuropening).
- 0–600: laat het op de grond vallen.
- 600–1.000: legt het paarse al neer.
- Tekst: "POV: she stayed over once".

**11. POV: je hebt een cadeau voor hem verstopt** — H ✓ · P ✓
- 0 ms: POV-handen (links) duwen een doosje al achter de handdoeken in de kast.
- 0–500: voetstappen off-screen.
- 500–1.000: deur sluit, hand blijft stil liggen.
- Waarom: spanning + "wat is het" → je blijft voor de onthulling. Kast dicht = geen mechanisme bedienen, alleen duwen.

**12. POV: hij ruikt iets en kijkt om** — P ✓
- 0 ms: over-de-schouder van haar op de bank, hij staat al half omgedraaid in de keuken, snuift.
- 0–700: "…are you baking?"
- 700–1.000: zij zegt niets, kleine glimlach.
- Waarom: reactie vóór oorzaak (concept "He Thought I Was Baking").

**13. POV: hij opent jouw cadeau (alleen zijn reactie)** — H ✓
- 0 ms: zijn gezicht al in reactie (wenkbrauwen op, halve grijns), cadeau buiten beeld onderaan.
- 0–600: "…wait. Is this—"
- 600–1.000: kijkt op naar de lens.
- Waarom: je ziet het effect, niet de oorzaak. Geen uitpakken in beeld (werkt niet met AI).

### D. Scherm- en tekstformats (tekst in montage, nooit gegenereerd)

**14. Sms-screenshot → harde snede naar realiteit** — K ✓ · P ✓ · H ✓
- 0 ms: iMessage-bubbel (montage) hij: "what do you want for your birthday" (geen emoji: die renderen als blokje).
- 0–700: haar antwoordbubbel verschijnt: "nothing" (typegeluid).
- 700–1.000: snede naar Mila die het product al vasthoudt.
- Waarom: iedereen kent de leugen "nothing"; H-cadeauframing (Sinterklaas/kerst).

**15. Antwoord op een comment (reply-bubbel)** — K ✓ · P ✓ · H ✓
- 0 ms: TikTok-reply-bubbel linksboven (montage): "no way that pillow stays cold" / "which one smells like coffee??"; Mila selfie al kijkend naar de bubbel.
- 0–600: kijkt van de bubbel naar de lens.
- 600–1.000: tilt product in beeld.
- Waarom: native format, suggereert gesprek, niemand leest het als advertentie. Comment moet echt of letterlijk verzonnen-als-vraag zijn (geen nep-review).

**16. Greenscreen: productpagina achter haar** — K ~ · P ✓ · H ✓
- 0 ms: screenshot productpagina/prijs als achtergrond (montage), Mila onderste helft al wijzend omhoog.
- 0–600: "this is twenty-three euros?"
- 600–1.000: draait zich naar de lens.
- Waarom: commentaar-format, feiten van de pagina (compliance). Selfie-armregel geldt; wijzende hand = linkerhand.

**17. Notes-app lijst** — K ✓ · P ✓ · H ✓
- 0 ms: iPhone-notitie (montage) "things he actually uses:" met drie doorgestreepte items.
- 0–700: vierde regel typt zich.
- 700–1.000: snede naar het product op zijn nachtkastje.
- Waarom: lijsten beloven een eindpunt → kijker blijft tot item 4.

### E. Geluid eerst (0,3 s herkenbaar geluid)

**18. Espresso-sis op zwart-naar-beeld** — P ✓
- 0 ms: close-up portafilter, sis al hoorbaar.
- 0–500: druppels.
- 500–1.000: snede naar amber flesje op dezelfde plek (match cut).
- Waarom: geluid is sneller dan beeld; match cut geeft "huh" op 1 s.

**19. Regen + dampende mok → flesje (match cut)** — P ✓
- 0 ms: vensterbank, regen, mok dampt (neergezet).
- 0–1.000: stoom krult; de match cut naar het flesje komt pas op 2.500 ms (tweede hook). (M4)

**20. Thud-test** — K ✓ · H ~
- 0 ms: kussen al vallend op een houten vloer (neergezet op vloer), plat.
- 0–300: "thud".
- 300–1.000: ligt, beweegt niet; hand (POV links) klopt erop.
- Waarom: onverwacht zwaar geluid = "wat is dat?".

### F. Lijst- en dagformats (product is item 3 van 5)

**21. "Things in my apartment that just make sense"** — K ✓ · P ✓ · H ~
- 0 ms: POV op stoel bedolven onder kleren, label "the chair" (montage), vingerknip-SFX.
- 0–800: POV-hand tikt tegen de stapel.
- 800–1.000: snede naar item 2.
- Waarom: bestaand format, lees je in 0,3 s; product leest als smaak, niet als pitch. (M1)

**22. GRWM, al halverwege** — P ✓
- 0 ms: selfie bij het raam (géén spiegel: AI verwart spiegelbeeld en persoon), haar al half opgestoken met de linkerhand, flesje staat op de vensterbank in beeld.
- 0–700: laat haar los, pakt niets.
- 700–1.000: "okay, last step."
- Waarom: GRWM is een van de meest bekeken lifestyleformats; begin halverwege.

**23. Silent rating** — K ✓ · P ✓ · H ✓
- 0 ms: selfie, product al in beeld links onder, tekst "rating things he got me /10".
- 0–1.000: zij kijkt van product naar lens, houdt vingers op (linkerhand) — geen spraak nodig.
- Waarom: geen lipsync = minder AI-risico; kijker wil het cijfer.

### G. Genre-omkering / fake-candid

**24. "Documentaire"-open** — K ✓ · P ✓
- 0 ms: vaste camera, schemerig, zij zit al op de rand van het bed en kijkt serieus naar de lens; tekst "day 11 of sleeping at his place".
- 0–1.000: zucht, kijkt naar het paarse kussen naast haar.
- Waarom: belooft drama, clou is een kussen.

**25. Fake-candid: vriendin filmt haar stiekem** — K ✓ · P ✓ · H ✓
- 0 ms: POV van vriendin vanaf de bank, Mila (niet naar de lens kijkend) ruikt al aan haar eigen pols bij het raam.
- 0–600: ruikt nog eens, ogen dicht.
- 600–1.000: merkt de camera, "…stop."
- Waarom: "betrapt op iets intiems" = geen reclame mogelijk. Tweede persoon blijft buiten beeld (alleen stem).

**Kiezen per product**
- Kussen: 1, 2, 5, 6, 8, 10, 20, 21 (sterkst: 2, 6, 10).
- Parfum: 3, 9, 12, 18, 19, 22, 25 (sterkst: 9, 18, 25).
- Herencadeau: 3, 7, 11, 13, 14, 17, 23 (sterkst: 11, 13, 14).
- Per video: maak **3 hookvarianten** die alleen in de eerste 1.500 ms verschillen (L064), zelfde body.

---

## 4. Checklists

### 4a. Pre-flight (vóór één credit uitgegeven wordt)

Script
- [ ] Hook leesbaar in 0,5 s zonder geluid en zonder tekst? (L082 #7)
- [ ] Welk hooktype (A–G) en welke 2 alternatieven?
- [ ] Frame 0 = al midden in de actie (niet: zit, kijkt, gaat praten)? (L064)
- [ ] Eerste snede gepland tussen 1.200 en 2.000 ms?
- [ ] Totaal 15–22 s met opzet → escalatie → clou → nagrap?
- [ ] Per clip ≤9 woorden (5 s) / ≤20 (10 s), eerste woord ≥0,4 s? Getallen uitgeschreven?
- [ ] Hooktekst en beeld vertellen hetzelfde verhaal? (L067)
- [ ] Geen "dupe", geen andere merken, prijs gecheckt op de productpagina.

Startbeeld (gpt_image_2_5)
- [ ] iPhone-still: rommel in beeld (kabel, mok, handdoek), licht iets ongelijk, huidtextuur, haar niet gestyled — maar gezicht zacht en egaal belicht, ontspannen (L082/L084).
- [ ] Geen "studio", "professional", "cinematic", "perfect".
- [ ] Armen tellen: precies twee; bij selfie rechterarm naar de lens.
- [ ] Product = de echte productfoto als referentie, met rolzin ("alleen vorm en kleur, niet de achtergrond"). Kleur in het startbeeld klopt met de foto.
- [ ] Kleding + lengte letterlijk in de prompt (L052).
- [ ] Geen spiegel, geen mechanisme (dop, rits, knoop, gesp) in handen.
- [ ] Startbeeld zelf bekeken op 100% vóór het naar Kling gaat.

Videoprompt
- [ ] Alle 9 blokken aanwezig: FORMAT, STARTING STATE, ARMS/HANDS, PRODUCT LOCK, TIMELINE, CAMERA, CONTINUITY, AUDIO, CONSTRAINTS.
- [ ] Cameraman benoemd: selfie / neergezet / POV (L078).
- [ ] Camerabeweging hangt aan een gebeurtenis of staat op "no movement".
- [ ] Product-lock letterlijk geplakt, ook als het product "maar" op de achtergrond staat.
- [ ] Accentregel in élke clip met spraak. "No music." erin.
- [ ] Laatste 0,7 s van de tijdlijn = rustige hold (knipruimte).
- [ ] Batch: elk item heeft `medias` met `start_image` (L060).
- [ ] Nieuwe opzet? Eerst 1 clip, checken, dan de rest. Bij een misser: één ding veranderen.

### 4b. QC na generatie (vóór montage)

Draai: `tools/qc.py strip.jpg c*.mp4` (frames om de 0,5 s + transcript) en
`tools/hear.py c*.mp4` (woordtijden). Kijk daarnaast met de hand naar deze tijdstippen:

| Tijdstip | Waar je op let |
|---|---|
| **0,00 / 0,10 / 0,20 s** | Beweegt het al op frame 0–5, of "ontwaakt" het eerst? Gezicht = startbeeld? |
| **0,5 / 1,0 / 1,5 s** | Het hookvenster: armen tellen, handen tellen (5 vingers), productvorm en -kleur. |
| **Elke 0,5 s daarna** | Armen/handen tellen; hand die van onderen binnenkomt; product buigt/deukt/smelt; tweede product verschijnt. |
| **Elk occlusiemoment** (hand langs gezicht of product) | Komt hetzelfde gezicht/product terug? Hier ontstaan de wissels. |
| **Begin en eind van elk woord** | Lippen synchroon? Tong/overdreven mond? |
| **4,3–5,0 s (of 9,2–10,0 s)** | Kling degradeert aan het eind: morph, rare blik, extra beweging. Meestal wegknippen. |
| **Kleurcheck** | Productkleur vergelijken op 0,0 / 2,5 / eind (screenshot naast elkaar). Flesje van amber naar goud/oranje = afkeur. |

Defectlijst (één = clip afgekeurd voor dat stuk; rest bruikbaar = knippen, niet opnieuw):
- [ ] Derde arm/hand, hand van onderen, verkeerd aantal vingers
- [ ] Onmogelijke cameraman (camera beweegt terwijl beide handen zichtbaar zijn zonder telefoonarm; hoek die niemand kan filmen)
- [ ] Product vervormt, verdubbelt, verandert van kleur/formaat, etiket muteert
- [ ] Ander gezicht, andere kleding, andere lengte, kamer verandert
- [ ] Ogen wijd open, ingevallen wangen, hard licht op het gezicht, overdreven expressie (L082)
- [ ] Accent niet Amerikaans; andere woorden dan het script; extra stem; muziek toegevoegd
- [ ] Eerste woord vóór 0,4 s of zin afgekapt op het eind
- [ ] Telefoon/statief/extra object aan de rand (fix: lichte crop)
- [ ] Onbedoelde tekst of logo in beeld
- [ ] Beeld is te glad/te scherp: `tools/texture_probe.py` binnen de band van echte telefoonbeelden?

Na montage
- [ ] Frame 0 van de export bekeken (dat is wat de For You-feed toont, niet de cover).
- [ ] Eerste snede ≤2.000 ms, hooktekst op frame 0–3, max. 2 tekstmomenten.
- [ ] Loop: laatste frame → frame 0 vloeiend?
- [ ] −14 LUFS, geen fade-in, geen fade-out.
- [ ] Ziet ze er in élk shot goed uit? Snap je het in 0,5 s? Is het leuk? (L082)
- [ ] Thumbnail + videoAsset + thumbAsset + firstComment in het dashboard (L083).

---

## Bronnen

- fal.ai — Kling 3.0 Prompting Guide: https://blog.fal.ai/kling-3-0-prompting-guide/ (shots labelen, speaker-tags `[Character, tone]: "line"`, dialoog aan actie binden, "Immediately" voor volgorde, i2v: beschrijf wat verandert vanaf het beeld)
- fal.ai — Seedance 2.5 prompting guide (FORMAT/STARTING STATE/…/CONSTRAINTS-structuur, camera aan gebeurtenis): fal.ai/learn/devs/seedance-2-5-prompting-guide (zie ONDERZOEK-PROMPTS.md)
- Kling — VIDEO 3.0 Omni native audio/lip sync: https://kling.ai/blog/kling-video-3-omni-native-lip-sync-audio-guide (accenten o.a. Amerikaans/Brits, naam + regel + toon bij elkaar, spreekgezicht leesbaar houden, geen muziek in referenties)
- Atlabs — Kling 3.0 prompting guide: https://www.atlabs.ai/blog/kling-3-0-prompting-guide-master-ai-video-generation (tijdcodes per shot, negatives voor handen/morphing)
- Artlist — Negative prompts for Kling, Veo, Wan: https://artlist.io/blog/negative-prompts-ai-video/ (negatives op stabiliteit; "als Kling er doorheen breekt is de positieve prompt te open")
- Higgsfield — Kling Start/End Frames & Kling 3.0 user guide: https://higgsfield.ai/blog/Kling-Start-End-Frames
- TikTok for Business — Creative best practices: https://ads.tiktok.com/help/article/creative-best-practices (hook in eerste seconden, "make TikToks not ads", lo-fi native stijl)
- CapCut — J-cuts en L-cuts: https://www.capcut.com/create/j-cuts-and-l-cuts-dialogue-edits
- Retentiecijfers uit marketingblogs (bv. "65% op 3 s = 4–7× meer impressies", opus.pro / virlo.ai) zijn **niet verifieerbaar**; gebruik het patroon, niet het getal.
- Eigen meting: Kling-output 24 fps (teddy2/c2.mp4: 5,04 s = 121 frames); eigen data L039, L064, L082, L084.
