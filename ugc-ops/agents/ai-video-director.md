# AI-video director: draaiboek (Mila / @xmilabby)

> Eén agent voor alles tussen script en final: model- en prijsroutering (vervangt de oude Higgsfield-expert), frames, clips, realisme, stem, montage en de AI-compliance. Laatste update: 25-09-2026. Prijzen gemeten met gratis `get_cost:true`-preflights; saldo op dat moment 37,44 credits.

Kennisbank (ruwe Higgsfield-bronnen, Engels): `knowledge/higgsfield/`
- `ugc-review-video__SKILL.md` + `ugc-clip.md`, `ugc-board.md`, `ugc-character.md`, `ugc-review-video__monologue-craft.md`, `__product-intake.md`, `__subtitles.md`
- `ugc-try-on-video__*`, `ugc-product-video__*`, `ugc-unboxing-video__*`, `ugc-tutorial-video__*`, `character-sheet__SKILL.md`
- `models-catalog.md`: alle 41 video- en 35 beeldmodellen met parameters en media-rollen

---

## 1. Rol en wanneer inzetten

**Rol:** van een goedgekeurd script (scriptwriter, score ≥ 8) naar een realistische, compliant 9:16-video van 15–25s voor zo min mogelijk credits. De director beslist over model, modus, duur, aantal clips, prompts, de de-slop-pass, de audio-lijm en de montage, en houdt de testlog bij.

**Inzetten:**
1. Vóór elke productie: route plus kostenraming (`get_cost` per clip, `balance`). Kost niets.
2. Bij het schrijven van frame- en clip-prompts (templates in §4).
3. Na de render, samen met `qa-checker.md`: redo of gratis fix?
4. Bij elk nieuw model of elke nieuwe truc: max. 1 kleine proef (§9), resultaat in de testlog (`higgsfield-expert.md`) en in `memory/lessons.md`.

**Harde regels**
- Nooit iets betaalds indienen zonder `get_cost:true`-preflight en een check tegen het saldo.
- Een nieuwe route test je op **1 clip** van een bestaande video, nooit op een hele nieuwe video.
- `use_unlim` alleen als Loka daar expliciet om vraagt.
- Timeout bij indienen: niet automatisch opnieuw indienen, eerst de job-status checken.

---

## 2. Model-keuzematrix en prijzen

### 2a. Keuze per shottype

| Shottype | Eerste keus | Alternatief | Niet gebruiken voor |
|---|---|---|---|
| **Mila praat in de camera** (hook, uitleg, CTA) | `kling3_0` std, `sound:"on"`, start_image | `kling3_0` pro, alleen voor de hook als std faalt | Seedance Mini, want stem en lipsync verliezen (test 25-09) |
| **B-roll zonder spraak** (product op tafel, handen, sfeer) | `seedance_2_0_mini` 480p/720p (0,5–1 cr/s) | `kling3_0` std `sound:"off"` (1,25 cr/s) | pratende shots |
| **Product moet exact blijven** (logo, vorm) | `kling3_0` met `start_image` + `end_image` (geen meerprijs) | `seedance_2_0` std met product als `image_references` (4,5 cr/s) | zachte stoffen die bewegen |
| **Frames / kamer / packshot** | `gpt_image_2_5` (0,25 low-1k) | `nano_banana_pro` (2), `gpt_image_2` high (3,5) | - |
| **De-slop (huid/iPhone-look)** | `seedream_v5_lite` (1,0) | `seedream_v5_pro` (2,5) | - |
| **Nieuwe persona / character sheet** | `soul_2` (0,12!) | character-sheet-workflow | - |
| **Lipsync repareren** | `sync_so` (Sync Lipsync 3, video + audio) | - | prijs niet te preflighten via de tool; eerst vragen |
| **Stem vervangen** | `voice_change` (preset of eigen voice-element) | - | prijs onbekend (geen `get_cost`) |

### 2b. Prijstabel video (9:16, gemeten 25-09-2026)

| Model | Instelling | Gemeten | **cr/s** | Audio | Media-rollen | Voor | Tegen |
|---|---|---|---|---|---|---|---|
| **kling3_0** | std, sound on | 5s 8,75 · 10s 17,5 · 15s 26,25 | **1,75** | native, lipsync | start_image, end_image | beste stem en lipsync in onze test; 3–15s; `end_image` en `<<<element>>>` zonder meerprijs | geen audio-referentie, dus stem wisselt per clip; volgens tests loopt de lipsync na ~8s uit de pas; voegt soms muziek toe |
| kling3_0 | std, sound off | 10s 12,5 | 1,25 | - | idem | goedkope stille B-roll met Kling-kwaliteit | geluid in post nodig |
| kling3_0 | pro, sound on | 5s 10 · 10s 20 | 2,0 | native | idem | iets scherper | +14%, zelden de moeite |
| kling3_0 | 4k | 5s 30 | 6,0 | native | idem | - | te duur |
| kling3_0_turbo | 720p | 10s 15 | 1,5 | ? | start_image | snel | geen `sound`-parameter; lipsync niet getest |
| **seedance_2_0_mini** | 720p | 5s 5 · 15s 15 | **1,0** | native | start/end_image, image/video/audio_references | goedkoopst met referenties | stem en lipsync duidelijk slechter dan Kling (test 25-09) |
| seedance_2_0_mini | 480p | 10s 5 | **0,5** | native | idem | spotgoedkope B-roll | 480p (upscale van TikTok valt op) |
| seedance_2_0 | fast 720p | 10s 25 | 2,5 | native | idem | referentie-trouw (Mila + product) | duur voor wat het is |
| seedance_2_0 | std 720p / 1080p | 10s 45 / 90 | 4,5 / 9,0 | native | idem | beste multi-referentie | te duur |
| seedance_2_5 | omni_reference 480p / 720p / 1080p | 10s 30 / 70 / 120 · 15s 1080p 180 | 3 / 7 / 12 | native | idem + video_edit/extension, 4–30s | Higgsfields eigen UGC-motor (8 harde cuts per clip) | 4–7× zo duur als Kling |
| wan2_7 | 720p / 1080p | 10s 15 / 25 | 1,5 / 2,5 | native | start/end_image, **audio_references** | vaste stem via audio-referentie mogelijk | lipsync niet getest |
| wan3_0 / wan3_0_prime | 720p | 10s 17,5 / 30 | 1,75 / 3,0 | native | + image/video/audio_references, tot 30s | referenties + audio | niet getest |
| minimax_h3 | 2K | 10s 20 | 2,0 | via audio_references | start/end, image/video/audio refs | 2K, keyframes | geen native spraak-flag |
| minimax_h3_max | 768p | 10s 25 | 2,5 | idem | idem | snel | - |
| flux_3_video | 720p / 1080p | 10s 55 / 90 | 5,5 / 9,0 | native | start/end, image/video refs, 5–20s | video-continuation | duur |
| grok_video_v15 | 720p | 10s 45 | 4,5 | + audio_references | start_image, image/audio refs | - | duur |
| grok_video | - | 10s 15 | 1,5 | ja | start_image | goedkoop | kwaliteit onbekend |
| gemini_omni_flash_1_1 | i2v 720p | 8s 24 | 3,0 | native | start/end, refs | - | max 10s |
| veo3_1_lite | 8s, audio | 8s 12 | 1,5 | native | start/end_image | goedkoop | Veo-lippen "niet menselijk" volgens lipsync-tests; 4/6/8s |
| veo3_1 | fast basic | 8s 32 | 4,0 | native | start_image | - | duur |
| happy_horse_video | 720p | 10s 25 | 2,5 | ? | start_image | - | onbekend |
| cinematic_studio_3_0 | 720p audio | 10s 50 | 5,0 | optioneel | start/end_image | cinematisch | geen UGC-look |
| marketing_studio_video | 720p | 15s 75 | 5,0 | native | avatar + product ids | 1 klik, hooks/settings | weinig controle over Mila, duur |
| flux_3_video_edit | - | - | 1,0 | - | video_references | tekstuele edit van een bestaande clip (max 15s) | - |
| sync_so | lipsync | n.v.t. | ? | input_audio | input_video, input_audio | lipsync achteraf herstellen | preflight faalt via de tool |

### 2c. Prijstabel beeld

| Model | Instelling | Credits | Gebruik |
|---|---|---|---|
| **gpt_image_2_5** | low 1k (standaard) | **0,25** | master, frames, packshot; zet `image` automatisch om naar `image_references` |
| gpt_image_2_5 | medium 1k / high 2k | 0,5 / 2,75 | alleen voor een hero-frame |
| gpt_image_2 | low 1k / high 1k / high 2k 21:9 | 0,5 / 3,5 / 6,5 | storyboard-sheet van Higgsfield |
| soul_2 | 2k | 0,12 | persona-beelden, realistische UGC-portretten; `soul_id` na training |
| seedream_v5_lite | basic | 1,0 | de-slop-pass (goedkoop) |
| seedream_v5_pro | 2k | 2,5 | de-slop-pass (Higgsfield-standaard) |
| nano_banana_pro | 2k | 2,0 | edits met veel referenties, tekst |

### 2d. Rekenregels
- Kling std met geluid: **credits = 1,75 × seconden**. Een video van 20s kost aan clips altijd ~35, of je nu 4×5 of 2×10 doet. Besparen doe je dus alleen met **minder redo's, minder frames en stille B-roll**.
- `end_image`, een `<<<element_id>>>` in de prompt en een langere prompt kosten niets extra (gemeten).
- De std-output is 716x1280. Upscale (`upscale_video`) alleen voor een bewezen winnaar.

---

## 3. De beste pijplijn voor Mila

### 3a. Vergelijking

| | **Onze pijplijn (nu)** | **Higgsfield `ugc-review-video`** |
|---|---|---|
| Persona | 4 face-refs + Mila-element | `soul_2`-persona (0,12) |
| Beelden | `gpt_image_2_5` master zonder persoon → frames als edit (0,25/st) | 8-slot storyboard 21:9 `gpt_image_2` high 2k (6,5) + verplichte de-slop `seedream_v5_pro` (2,5) per board |
| Video | `kling3_0` std i2v, 5–6s-clips, native audio | `seedance_2_5` omni_reference 1080p, 15s-clips met 8 interne harde cuts, native audio |
| Montage | ffmpeg concat + .ass-hook | ffmpeg concat (stream copy) + optionele captions uit een woord-transcript |
| **Kosten per 20s** | **~38** (4 clips + 5 beelden) | 2 boards (13) + 2 de-slops (5) + 15s+5s clips 1080p (180+60) = **~258**; op 720p ~158 |
| Sterk | goedkoop, stem en lipsync goed, kamer/product-continuïteit | veel cuts = hoog tempo; strakke QA- en prompt-regels; de-slop |
| Zwak | stem wisselt per clip; 4 naden; ~40% redo-credits | 4–7× duurder; Seedance-familie verloor bij ons op stem/lipsync; truth gate verbiedt onze ik-scripts |

### 3b. Aanbeveling: onze pijplijn houden, aangevuld met de Higgsfield-regels ("Kling-3")

1. **Packshot** (0,25) en **kamer-master zonder persoon** (0,25), beide `gpt_image_2_5`.
2. **Optioneel: de-slop op de master** met `seedream_v5_lite` (1,0). De frames erven de realistische huid, het licht en de sensorruis. (Test: §9 #4.)
3. **3 frames** in plaats van 4: edit van de master + 4 face-refs + packshot (0,75).
4. **3 Kling std-clips van 6–7s** (6+7+7 = 20s → 35 credits), elk met **≤ 7s spraak** om onder de "second-8 wall" van de lipsync te blijven. Minder naden en minder stemwissels dan 4×5s.
5. **Gratis audio-lijm** (§6): elke clip loudnorm, dezelfde EQ en één doorlopende room-tone-laag. Hierdoor klinken de clips als één opname.
6. **Montage**: concat, 1 punch-in (clip 2 of 3), hooktekst in de veilige zone en optioneel captions uit een woord-transcript (§4f).
7. **Frozen-frame QA** (Higgsfield-lijst + `qa-checker.md`) vóór montage.

**Kosten per 20s:** 0,25 + 0,25 + (1,0) + 0,75 + 35 = **~36,3 credits** zonder redo's (35,3 zonder de-slop). Reken met 1 redo-clip (~12) als buffer, dus ~48 worst case.
**Budgetvariant** (product-demo leent zich voor een stille beat): 2 Kling-praatclips van 7s (24,5) + 1 stille B-roll van 6s met `seedance_2_0_mini` 720p (6) of `kling3_0` sound off (7,5) + ambience in post = **~32 credits**.

**Wat we van Higgsfield overnemen (gratis):** de first-word-regel, de verboden AI-zinnen, de woorddichtheid, de 0,1s-hookwet (frame 1 is al in beweging, eerste woord binnen 0,4s), één product per beeld, de hand-allocatie per actie, de Product Angle Lock, de schaal in cm t.o.v. de hand, "no phone visible", één gesloten-mond-moment per clip, de quality suffix en frozen-frame QA met mid-word-frames.
**Wat we níét overnemen:** Seedance 2.5 als praatmotor (te duur, en lipsync verloor), 21:9-boards (6,5 per board) en `soul_2` voor Mila (bestaat al als element).

---

## 4. Prompt-templates (copy-paste)

Vaste IDs: Mila-element `81fe01b2-93c3-40d4-8b0a-045c4d2ccfc1` (let op: de omschrijving zegt "21", de persona is mid-20; pas de omschrijving aan bij de volgende edit). Face-refs: zie `producer.md`. Preset-weigering: `declined_preset_id: "24bae836-2c4a-48e0-89b6-49fcc0b21612"`.

### 4a. Kamer-master (`gpt_image_2_5`, 9:16, 0,25)
```
Vertical 9:16 iPhone photo of an empty lived-in [ROOM, e.g. small Amsterdam apartment bedroom], no people.
[FIXED LAYOUT: bed left against the wall, white nightstand on the RIGHT with a ceramic lamp, window with sheer curtain behind, light wood floor].
Soft overcast daylight from the window camera-left, one motivated light source, neutral white balance (no golden hour, no orange cast).
Everyday clutter: a folded hoodie, a water glass, a charging cable. Slightly imperfect framing, deep focus, faint sensor noise, mild phone-wide lens (23mm look), mild HDR flattening.
No text, no logos, no brand names, no mirror, no reflective surfaces showing a person, no phone, no tripod.
```

### 4b. Scène-frame als edit van de master (`gpt_image_2_5`, medias: master + 4 face-refs + packshot)
```
Edit of image 1: keep the room EXACTLY identical — same furniture, layout, light direction, colors and camera position. Do not move or add objects.
Add Mila (the same woman as in images 2–5): mid-20s, long platinum blonde hair [exact hairstyle], light blue eyes, natural makeup, wearing [OUTFIT, covered — e.g. oversized grey hoodie], framed from mid-chest up, [POSE: sitting on the bed edge, facing camera, holding the product with BOTH hands at chest height].
The product is image 6, EXACTLY: [canonical product_description: shape, material, color, label side facing camera, ~X cm tall, palm-sized]. Exactly one product in frame; [FIXED POSITION: on the right nightstand / in her hands].
Her expression is mid-speech, relaxed, one eyebrow slightly raised. Hands: five fingers each, natural grip, fingers wrapped around the product, not through it.
Realism: true-to-life pore-level skin with fine vellus hair, a few faint freckles, slightly uneven makeup, flyaway hairs, natural fabric wrinkles, matte skin (no glossy shine), faint sensor noise, flat authentic iPhone front-camera photo, deep focus.
Avoid: waxy/airbrushed skin, beauty filter, bokeh, cinematic grade, HDR glow, extra fingers, second person, mirror, phone, tripod, text, watermark.
```

### 4c. De-slop-pass (1 beeld, `seedream_v5_lite` 1,0 of `seedream_v5_pro` 2,5; medias: `image_references` = geïmporteerde URL, geen job_id)
```
KEEP EXACTLY the framing, composition, camera distance, pose, room, subject and product of this vertical photo — no reframe, no zoom, no crop, no change to the scene, to the woman's face / hair / body, or to the product design and label. CHANGE ONLY micro-realism: true-to-life pore-level skin with natural texture and fine vellus hair, real material detail, even natural daylight with gentle highlight roll-off and faint true sensor noise, a flat authentic iPhone photo, deep focus. PRESERVE the face's exact shape / width / proportions 1:1 — do NOT squeeze, narrow, slim or stretch the face. AVOID AI-slop: waxy plastic skin, airbrushed poreless skin, beauty-filter smoothing, over-saturation, HDR glow / bloom / halos, oversharpening, teal-orange grade, shallow depth of field, bokeh, cinematic / DSLR look. No added text, no watermark.
```
(Bij moderatieblokkade: 1× opnieuw met de andere Seedream, daarna het ruwe beeld gebruiken.)

### 4d. Kling 3.0-clip (std, sound on, 9:16, start_image = frame; optioneel end_image)
```
Keep the person, room, outfit and product EXACTLY as in the start image. <<<81fe01b2-93c3-40d4-8b0a-045c4d2ccfc1>>> is Mila.
MOVEMENT STYLE: small, slow, natural movements only. Hands stay anchored [on the product / in her lap / on the nightstand].
WHAT WOULD BE WRONG: the product changing shape, color or size; a second product; extra fingers; tongue visible; exaggerated mouth shapes; a phone or tripod in frame; a mirror; music; subtitles.
0.0s: already mid-motion — she [tilts the product toward the lens / leans in], and starts speaking immediately.
[Mila, dry and casual, a slightly amused tone, American English]: "[max ~16 words for 6–7s]"
[3.5s: one action, e.g. she turns the product 20 degrees so the front label faces the camera, both hands.]
[Mila, lower and flatter, a small smirk]: "[second sentence]"
Last 0.5s: lips close, a small half-smile, she holds still.
Camera: handheld selfie at arm's length, slight natural micro-shake, subject slightly off-center, phone-wide 23mm look, deep focus. Soft overcast window light camera-left, neutral white balance.
Audio: her voice only, close to the phone microphone, natural room tone, faint room reverb. No music, no sound effects, no subtitles, no on-screen text.
Normal speaking mouth movement only, no tongue, no exaggerated mouth shapes. Facial features clear and undistorted, consistent clothing. No beauty filter, no bokeh, no cinematic grade, no slow motion, no extra hands, no deformed hands.
```
Regels: 1 actie per clip, max 2 zinnen, speaker-label vóór elke zin (Kling-gids), elke zin aan een actie gekoppeld, een lijn met een getal schrijf je in cijfers uit zoals uitgesproken ("twenty-one euros"). Clip 2 en later: geen begroeting, ze gaat midden in de gedachte verder.

### 4e. Seedance-varianten

**B-roll zonder spraak (`seedance_2_0_mini`, 480p/720p, start_image = frame):**
```
Total: 5s / 1 shot / 9:16. Keep the room, hands and product EXACTLY as in @image1. Exactly one product.
0–5s: static locked-off phone camera on the nightstand, close-up: [one slow action — a hand slides the product 5 cm toward the lens and lets go; the LED turns on]. The product holds still after the action.
Soft overcast daylight, deep focus, faint sensor noise, iPhone look.
Audio: quiet room tone and one soft [click / fabric rustle] at 2s. NO MUSIC, no voice, no subtitles, no text, no 3D, no cartoon.
```
**Referentie-variant, pratend (alleen als experiment; `seedance_2_5` omni_reference, structuur uit `ugc-clip.md`):**
```
Style & Mood: UGC iPhone aesthetic, soft overcast window light, SELFIE front-facing camera, intimate handheld feel, social media vertical format.
Narrative Summary: [1 sentence], performed by a natural, engaged creator — genuine reactions, lively but human.
Dynamic Description:
Cut 1 (0-2s) — MEDIUM CLOSE-UP SELFIE: [already mid-motion action], left hand holds the phone off-frame, right hand [..], [2 micro-behaviors]. Hard cut to.
Cut 2 (2-4s) — TIGHT CLOSE-UP STATIC: [..]. Hard cut to.
... (1 beat per cut, a different framing per cut)
Static Description: [room from the frame, one light source, neutral white balance].
Audio: She speaks to camera, iPhone microphone audio with natural room tone: "[monologue verbatim]"
Facial features clear and undistorted, consistent clothing throughout. Shot on iPhone, natural lighting, slight natural handheld micro-shake. No on-screen text, no subtitles, no captions, no watermarks, no real brand logos, no cinematic grade, no film grain, no bokeh, no lens flare, no slow motion, no beauty filter, no third arm, no extra hands, no duplicated limbs, no deformed hands.
```
Media: `image_references` = [frame, Mila-face, packshot]. In de prompt: "@image1 owns the room and pose, @image2 owns identity, @image3 owns the product".

### 4f. Montage (ffmpeg, lokaal of `mila_mirror.py`)
```bash
# 1) per clip: loudnorm + zelfde EQ + 20ms fades tegen klikjes (de echte duur via ffprobe)
ffmpeg -i c1.mp4 -af "highpass=f=90,lowpass=f=12000,loudnorm=I=-14:TP=-1.5:LRA=7,afade=t=in:d=0.02,afade=t=out:st=$(echo "$D-0.02"|bc):d=0.02" -c:v copy c1n.mp4
# 2) punch-in op 1 clip (statisch 8%, verbergt de naad als jumpcut)
ffmpeg -i c2n.mp4 -vf "scale=iw*1.08:-2,crop=iw/1.08:ih/1.08,scale=1080:1920,setsar=1" -c:a copy c2p.mp4
#    punch-in binnen een clip (3,0–4,5s):
ffmpeg -i c2n.mp4 -vf "scale=1080:1920,zoompan=z='if(between(in_time,3,4.5),1.10,1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30" -c:a copy c2z.mp4
# 3) concat (alle clips hebben dezelfde resolutie/fps nodig, anders eerst scale=1080:1920,fps=30)
ffmpeg -f concat -safe 0 -i clips.txt -c:v libx264 -crf 18 -c:a aac -b:a 192k -t $TOTAL cat.mp4
# 4) doorlopende room tone (-24 dB onder de stem, gecombineerd -t op de echte duur; nooit apad+-shortest)
ffmpeg -i cat.mp4 -f lavfi -i "anoisesrc=color=brown:amplitude=0.004" -filter_complex "[1:a]lowpass=f=900,volume=0.5[rt];[0:a][rt]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -t $TOTAL final.mp4
# 5) hook (.ass): alleen tekst, geen emoji, bovenin tussen 108px en ~400px van boven
ffmpeg -i final.mp4 -vf "subtitles=hook.ass" -c:a copy final_hook.mp4
```
TikTok-veilige zone (1080x1920): 108px boven, 320px onder (**450px bij TikTok Shop-productkaart**), 60px links, 120px rechts. Captions: 1–2 woorden, CAPS, wit met zwarte rand, getimed uit een woord-transcript (whisper met word_timestamps), nooit uit geplande beats (zie `ugc-review-video__subtitles.md`).

---

## 5. Realisme-checklist

**Beeld (frames)**
- [ ] Huid: poriën, vellushaar, 1–2 sproetjes of moedervlekjes, make-up iets ongelijk, mat (geen glans), geen beauty filter.
- [ ] Haar: losse haartjes (flyaways), geen perfect gelakte golf.
- [ ] Licht: één gemotiveerde bron (raam), neutrale witbalans, geen golden hour of teal-orange grade.
- [ ] Camera: iPhone-front/phone-wide 23mm, deep focus (achtergrond scherp, **geen bokeh**), lichte sensorruis, mild HDR-plat.
- [ ] Kader: iets off-center, niet perfect symmetrisch; medium close-up (minder pixels voor fouten, meer voor textuur).
- [ ] Ruimte: bewoond (kabel, glas, hoodie), niet showroom-schoon; dezelfde master in elke scène.
- [ ] Product: exact het packshot, label naar de camera, schaal in cm t.o.v. de hand, "exactly one".
- [ ] Geen spiegel, geen telefoon, geen statief, geen tekst op props, geen tweede persoon.

**Beweging (clips)**
- [ ] Frame 1 is al in beweging; eerste woord binnen 0,4s.
- [ ] Selfie: lichte micro-shake. Statisch (twee handen aan het product): "locked-off, zero camera movement".
- [ ] Max 1 actie en 1 staatverandering per clip; handen verankerd; "small, slow, natural movements".
- [ ] Geen loops ("again", "back and forth", "keeps").
- [ ] Minstens één gesloten-mond-moment (einde van de clip).

**Geluid**
- [ ] Alleen haar stem, dicht bij de mic, room tone aanwezig (stilte = grootste nep-signaal).
- [ ] Geen muziek (Kling voegt die soms toe: luister!), geen SFX die je niet vroeg.
- [ ] Stem ~-14 LUFS, ambience ~12 dB eronder.

**Tekst en tempo**
- [ ] ≤ 2,5 woorden/s (≤ 10s: 12–20 woorden), geen "okay so/wait/hey guys" als eerste woord.
- [ ] Verboden: obsessed, game changer, literally, holy grail, changed my life, hits different, trust me, 10/10, elevate/seamless/effortless, "I was skeptical but".
- [ ] Emotie zit in de woorden (1 CAPS-woord, één gebroken zin op de piek), niet in "dramatische pauzes".

---

## 6. Stem- en karakterconsistentie

**Gezicht (sterk → zwak)**
1. **Frames als edit van één master + 4 face-refs** (werkt nu). Houd de face-refs gelijk, in dezelfde volgorde.
2. **Mila Reference Element** `<<<81fe01b2-…>>>` in de Kling-prompt, bovenop het startframe (geen meerprijs; test §9 #3). Elements werken met Kling 3.0, Seedance 2.0, GPT Image 2, Nano Banana, Seedream 5 lite. Niet met Soul.
3. **Soul ID** (`show_characters train`, 5–20+ foto's, ~5–10 min): alleen voor `soul_2`-beelden (0,12/stuk). Interessant voor goedkope persona-content en nieuwe face-refs, niet voor Kling.
4. Beschrijf Mila in elke prompt **letterlijk hetzelfde** (haar, ogen, outfit). De geschreven tekst is het continuïteitscontract.
5. Adult-structuur: "defined jawline, mature adult proportions, no babyface" (character-sheet-principe 3).

**Stem (Kling heeft geen audio-referentie)**
1. **Minder clips, minder stemwissels**: 3×6–7s in plaats van 4×5s.
2. **Vaste stembeschrijving** in elke clip, woord voor woord gelijk: `[Mila, warm mid-pitch female voice, dry casual American delivery, slightly raspy, relaxed pace]`.
3. **Gratis audio-lijm** (§4f): dezelfde EQ, loudnorm en één room-tone-bed over de hele video. Dit verbergt timbreverschillen tussen clips grotendeels.
4. **`voice_change`** op de final met één vaste stem (preset, bv. Ainsley, Brielle, Isla, Maeve of Juno, of een eigen voice-element via `create_voice`). Behoudt de timing en dus de lipsync. De prijs is niet te preflighten: eerst op 1 clip testen en kosten aflezen via `transactions`.
5. Niet doen: Mila via Seedance/Wan `audio_references` laten praten om de stem vast te zetten. Die modellen verloren op lipsync (Mini-test). Alleen herzien als een nieuw model aantoonbaar beter is.
6. Lipsync kapot maar het beeld goed? "Duur model: repareren, goedkoop model: opnieuw." `sync_so` met de video + schone audio (prijs eerst vragen).

---

## 7. Veelgemaakte fouten en fixes

| Fout | Oorzaak | Fix (bron) |
|---|---|---|
| Spiegelbeeld of dubbelganger klopt niet | AI verwart spiegel en persoon | nooit spiegel-/dubbelgangerconcepten; geen reflecties (lessons, Higgsfield) |
| Kamer verandert per clip | elke scène los gegenereerd | één master zonder persoon, scènes als edit ("Keep the room EXACTLY identical") (lessons) |
| Product verspringt | positie niet vastgelegd | vaste positie ("rechts op het nachtkastje") in élke prompt (lessons) |
| Product vervormt / "lap stof" | productfoto met model of screenshot | schone packshot op wit (crop uit screenshot werkt); `end_image` om het eindbeeld vast te zetten (lessons, §9) |
| Zacht product smelt | hangt aan één hand, schudt | twee handen strak, of stil laten liggen; vorm vóór en ná tonen, niet tijdens (lessons) |
| Kleding kindermaat of jumpsuit | maat niet benoemd | "FULL ADULT SIZE, as long as her own body" + lengte (lessons) |
| Tong/mond raar | mond-acties beschreven | nooit eten, drinken, likken; "normal speaking mouth movement only, no tongue" (lessons) |
| Stijve of zwevende handen | geen anker | handen verankeren + "small, slow, natural"; hand-allocatie per actie, max 2 handrollen (lessons, Higgsfield) |
| Twee producten in beeld | model vermenigvuldigt | "exactly one product, single product instance" (Higgsfield) |
| Telefoon of statief aan de rand | selfie-context | "no phone visible"; crop i.p.v. redo (lessons, Higgsfield) |
| Muziek eronder | Kling-default | "No music" + luisteren; zo nodig opnieuw of stem isoleren (lessons) |
| Lipsync loopt uit de pas na ~8s | Kling "second-8 wall" | max ~7s spraak per clip, laatste seconde stil (maxfusion-test) |
| Stem klinkt per clip anders | geen audio-referentie in Kling | minder clips, vaste stembeschrijving, audio-lijm, `voice_change` (§6) |
| Plastic/AI-huid | default-render | realisme-blok in de frame-prompt + de-slop-pass (Higgsfield) |
| Loops (spuit 3×) | "again", "back and forth" | verboden actiewoorden; 1 staatverandering per clip (Higgsfield) |
| Preset i.p.v. generatie | Higgsfield raadt een preset aan | opnieuw met `declined_preset_id` (lessons) |
| NSFW-blokkade | satijn, hemdjes, "bed" + ref | bedekkende outfit (hoodie/sweater), hoger kader; blokkade kost niets (lessons) |
| Emoji als blokje in hook | libass rendert geen kleur-emoji | alleen tekst (lessons, Higgsfield) |
| Concat loopt eindeloos | `apad` + `-shortest` | `-t` op de echte duur (lessons) |
| Tekst/ondertitels ingebakken | model maakt karaoke-subs | "no subtitles, no on-screen text"; 1× opnieuw, anders croppen (Higgsfield) |
| Merk-/Disney-content | IP | eigen stijl; geen echte logo's van anderen (lessons) |
| Te vlak script | geen probleem/re-hook/CTA | scriptwriter-flow, score ≥ 8 (lessons) |
| 40% van de credits naar redo's | te snel naar video | frames eerst beoordelen (contactsheet), std i.p.v. pro, 3 clips (lessons) |
| Verkeerde prijs in script | coupon vs normaal | altijd tegen de productpagina checken (lessons) |
| AI-"bewijs" van resultaat | vieze wastafel, voor/na | nooit; echt shot of weglaten (lessons, TikTok Shop) |

---

## 8. Compliance: AI-label en de truth gate

**Wat TikTok zelf eist**
- **AIGC-label verplicht** voor realistische AI-beelden, -stemmen en -mensen: toggle "AI-generated content" bij posten (`isAigc: true`). TikTok leest ook C2PA en watermerken en labelt automatisch; niet-gelabelde AI-content kan verwijderd worden, met oplopende straffen (waarschuwing → verwijdering → schorsing → ban).
- **TikTok Shop** (AI-Generated Content Restrictions): geen overdreven of valse claims, geen AI-effecten die het product beter, sneller of groter laten lijken dan het is, geen afwijking in maat, kleur, inhoud of prestaties, geen AI-"digital humans"/experts die de werking van gezondheidsproducten onderschrijven, geen gelijkenis of stem van derden. Disclosure verplicht bij "synthetic faces, voices, digital humans". Straffen: minder bereik, verlies van shopping-functies, Creator Health Rating-punten, ban.
- **Livestreams**: geen AI-stemmen (niet relevant zolang we geen live doen).
- Sommige merken verbieden AI-content in hun affiliateprogramma en houden dan commissie in (bv. SharkNinja). **Check per product het seller/affiliate-beleid.**

**EU**
- **AI Act art. 50** (vanaf 2 aug 2026): wie een deepfake/synthetische persoon inzet, moet dat bij de eerste blootstelling duidelijk maken. Het TikTok-label + "AI creator" in de bio + een korte vermelding in de caption dekken dit.
- **UCPD Annex I (zwarte lijst)**: punt 22 verbiedt je voordoen als consument terwijl je handelt (affiliate = handelaar); punt 23b/23c verbieden reviews presenteren als afkomstig van echte gebruikers of nep-reviews laten maken. Punt 11: betaalde promotie moet herkenbaar zijn. Affiliate-video's = reclame: commercial-content-toggle aan + "#ad"/"commissie".

**De Higgsfield truth gate** (in alle UGC-workflows): een gegenereerde creator is **host/demonstrator, nooit klant**. Geen verzonnen aankoop, bezit, gebruik, resultaten, voor/na, reviews, social proof, relaties of ervaringen. Claims alleen letterlijk uit een `approved_claims`-lijst; zonder lijst alleen **waarneembare** mechaniek, materialen, verpakking en bediening.

**Risico in onze huidige scripts (ROOD):** Mila spreekt in de ik-vorm alsof ze het product gebruikt ("This one plugs into my laptop", "Level three feels like a warm towel", "My boyfriend called this a scam", "Here's why I stopped"). Dat is precies een **synthetische testimonial**: het schendt de Higgsfield truth gate, wordt door TikTok Shop-gidsen als overtreding genoemd, ook mét label, en raakt UCPD 22/23b. `compliance.md` staat dit nu toe ("fictie met AI-label"). **Dat moet worden aangescherpt.**

**Veilige herformulering (host-framing):**
| Nu (risico) | Beter (demonstrator) |
|---|---|
| "Those go cold in ten minutes. This one plugs into my laptop." | "The one-euro ones are single-use. This one has a USB plug — watch." |
| "Level three feels like a warm towel." | "Three heat levels. This is level three." (alleen als het op de pagina staat) |
| "My boyfriend called this a scam. Guess who stole it." | POV-/sketch-vorm met fictie-signaal: "POV: your boyfriend calls it a scam" + geen "echte" claim |
| "I've been using it for weeks" | nooit |

**Checklist vóór posten:** AIGC-toggle aan · commercial content aan · "AI creator" in de bio · geen ik-ervaring of resultaat · claims = productpagina · geen AI-bewijs van het effect · prijs exact · geen gezondheids- of medische werking · merkbeleid AI-content gecheckt.

---

## 9. Experimenten-backlog (≤ 10 credits, gerangschikt)

Prioriteit volgens Loka: eerst wat de **Kling-kosten of redo's verlaagt** of de **stem consistent maakt**. Goedkopere praatmodellen staan onderaan.

| # | Test | Kosten | Hypothese | Meten | Besluitregel |
|---|---|---|---|---|---|
| 1 | **Audio-lijm** (§4f: EQ + loudnorm + room-tone-bed) op een bestaande final | **0** | Stemwissels tussen clips vallen voor een kijker grotendeels weg | A/B blind luisteren door Loka | beter → standaard in de montage |
| 2 | **3×7s i.p.v. 4×5s** in de volgende echte productie | **0 extra** (zelfde cr/s) | Minder naden, minder stemwissels, 1 frame minder; lipsync blijft ok onder 8s | lipsync op mid-word-frames rond 6–7s; redo-rate | ok → nieuwe standaard |
| 3 | **Mila-element `<<<…>>>` in de Kling-prompt** + startframe, 5s | 8,75 | Minder gezichtsdrift aan het eind van de clip | frame 1 vs het laatste frame vs face-ref | beter → altijd meegeven (gratis) |
| 4 | **De-slop van de master** met `seedream_v5_lite` → 1 frame als edit | 1,25 | Realistischere huid en licht in alle frames voor 1 credit per video | contactsheet vs het oude frame | beter → vast in de pijplijn |
| 5 | **`end_image` = zelfde frame** (Kling, 5s) bij een lastig product | 8,75 | Product blijft vorm houden; de clip eindigt schoon (loop-ready) | product-vervorming op laatste 1s | minder redo's → gebruiken bij rigide producten |
| 6 | **Stille B-roll-beat**: `seedance_2_0_mini` 480p 5s (≈2,5) vs `kling3_0` sound off 5s (6,25) | 2,5–6,25 | Een stille demo-beat maakt 20s ~3–5 credits goedkoper zonder kwaliteitsverlies | handen/product; ziet 480p er na TikTok-compressie ok uit? | ok → budgetvariant |
| 7 | **Hook-swap**: alleen clip 1 opnieuw met een reserve-hook (5s) | 8,75 | Een goedkopere manier om een winnaar te multipliceren dan een nieuwe video | 3s-rate na posten | winnaar → 2 swaps per winnende video |
| 8 | **Lege eerste 0,3s eraf / punch-in op clip 2** (montage) | 0 | Hogere 3s-rate en minder zichtbare naden | retentiecurve (analist) | beter → standaard |
| 9 | **`voice_change`** met een vaste preset (bv. Isla) op 1 clip | ? (geen preflight) | Eén vaste Mila-stem zonder lipsync-verlies | prijs via `transactions`; A/B | alleen als ≤ 10 en beter dan #1 |
| 10 | **Kling pro voor de hook** (5s) | 10 | Scherper gezicht in de eerste 2s → hogere 3s-rate | vergelijking std/pro op dezelfde frame | ≤ merkbaar → std houden |
| 11 | `wan2_7` 720p 5s praatclip met `audio_references` (Mila-stem) | ~7,5 | Vaste stem via referentie; lipsync mogelijk slechter | lipsync vs Kling | laag: na de Mini-uitkomst weinig kans |
| 12 | `veo3_1_lite` 6s met audio | ~9 | Goedkope praatclip | lipsync (tests: "lippen niet menselijk") | laag |
| 13 | `seedance_2_5` 480p 5s omni_reference (8 cuts) | ~15, **> 10: pas na akkoord** | Hoog tempo uit één clip | lipsync, tempo | laag |

Elke test: 1 clip, dezelfde frame en dezelfde prompt als de referentie, resultaat in de testlog (`higgsfield-expert.md`) en in `memory/lessons.md`.

---

## 10. Bronnen

**Higgsfield (MCP, 25-09-2026):** workflows `ugc-review-video` v1.1, `ugc-try-on-video`, `ugc-product-video`, `ugc-unboxing-video`, `ugc-tutorial-video`, `character-sheet` (zie `knowledge/higgsfield/`); `models_explore list/recommend/get`; `get_cost`-preflights; `list_voices`; `show_reference_elements list`.

**Prompting en modellen**
- Kling 3.0 prompting (fal): https://blog.fal.ai/kling-3-0-prompting-guide
- Kling 3.0 native audio/lipsync: https://kling.ai/blog/kling-video-3-omni-native-lip-sync-audio-guide
- Kling 3.0 gids: https://kling.ai/quickstart/klingai-video-3-model-user-guide · https://morphic.com/resources/how-to/kling-3.0-guide
- Seedance prompting (Higgsfield): https://higgsfield.ai/blog/seedance-prompting-guide · https://www.kapwing.com/resources/how-to-prompt-seedance-2-5-a-guide-for-ai-video-creators/
- Lipsync-vergelijking ("second-8 wall", "cheap model regenerate, expensive model repair"): https://maxfusion.ai/blog/ai-video-models-lip-sync-2026
- Higgsfield lipsync-tips: https://higgsfield.ai/blog/make-ai-lipsync-videos
- Soul ID / consistentie: https://higgsfield.ai/blog/sould-id-best-character-consistency · https://higgsfield.ai/blog/how-to-create-ai-influencer

**Realisme, handen, audio, montage**
- Realistische AI-UGC: https://www.atlabs.ai/blog/create-realistic-ai-ugc-videos-complete-guide · https://digitalsynopsis.com/tools/ai-videos-look-fake-how-to-fix/
- Handen/gezichten: https://higgsfield.ai/blog/ai-video-hands-faces · product niet laten vervormen: https://domoai.app/blog/ai-product-videos-without-warping-the-product · https://primores.org/wiki/marketing/ai-product-video-fidelity/
- Room tone en mixniveaus: https://elements.envato.com/learn/how-to-improve-ai-video-audio · https://www.descript.com/blog/article/match-room-tone
- Pattern interrupts/zoom: https://edicionvideopro.com/en/editing-for-platforms-video-marketing/pattern-interrupts-tiktok-retention-guide/
- TikTok-veilige zones: https://kreatli.com/guides/tiktok-safe-zone · https://tikadsuite.com/blog/tiktok-ad-safe-zones/
- ffmpeg zoom/crop: https://creatomate.com/blog/how-to-zoom-images-and-videos-using-ffmpeg

**Compliance**
- TikTok Shop, AI-Generated Content Restrictions and Requirements: https://seller-us.tiktok.com/university/essay?knowledge_id=491489038501663&lang=en
- TikTok AI-transparantie/C2PA: https://newsroom.tiktok.com/en-us/partnering-with-our-industry-to-advance-ai-transparency-and-literacy
- TikTok Integrity & Authenticity: https://www.tiktok.com/community-guidelines/en/integrity-authenticity · AIGC-label: https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label
- Overzicht AI-avatars/testimonials op TikTok Shop: https://polici.net/guides/ai-content-tiktok-shop
- AI-stemmen in Shop-livestreams: https://www.pymnts.com/commerce/ecommerce/2026/tiktok-shop-bans-ai-voices-from-livestreams/
- Merken die AI-affiliatecontent weigeren: https://www.affiversemedia.com/tiktok-shop-ai-generated-videos-affiliate-trust/
- EU AI Act art. 50: https://artificialintelligenceact.eu/article/50/ · Code of Practice: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
- UCPD (Annex I, zwarte lijst): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32005L0029 · influencers in EU-recht: https://www.europarl.europa.eu/RegData/etudes/BRIE/2025/779254/EPRS_BRI(2025)779254_EN.pdf
