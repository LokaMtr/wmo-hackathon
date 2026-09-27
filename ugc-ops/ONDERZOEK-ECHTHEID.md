# Hoe krijgen we video's die niet van echt te onderscheiden zijn

Onderzoek 27-09-2026. Twee sporen: wat AI-video technisch verraadt, en wat een
TikTok-video laat lezen als "iemand filmde dit met z'n telefoon". Plus metingen
op ons eigen materiaal.

Notatie: **[gemeten]** = onderzoek of eigen meting · **[praktijk]** = ervaring van
makers, niet getest · **[fabel]** = overal herhaald, nergens onderbouwd.

---

## Deel 1 — Wat we op ons eigen materiaal gemeten hebben

### Camerabeweging: 0,00 px
Elke clip die we ooit gemaakt hebben staat muurvast. Een telefoon in een hand
doet dat nooit, ook niet als hij ergens tegenaan staat. Dit is de hardste tell
in onze output en de goedkoopste om op te lossen.

### Textuur: we hebben te véél korrel, niet te weinig
Dit is het belangrijkste dat uit dit onderzoek kwam, want het is het
tegenovergestelde van wat iedereen adviseert.

| | dead-flat blokken | noise floor | mediane blok-SD |
|---|---|---|---|
| echte telefoonbeelden | 2,0–3,0 % | 0,45–0,70 | 2,2–4,1 |
| onze Kling-clips | **0,15–0,73 %** | **0,72–1,04** | **4,3–6,4** |
| onze clips + `hqdn3d=6` @2,5 Mbit | 0,78 % | **0,51** | **3,46** |

Onze beelden zijn te *druk*, niet te schoon. "Filmkorrel eroverheen" — het
standaardadvies op elk blog — duwt ons verder van echt af. We moeten
**ontruisen**. En filmkorrel op 2,5 Mbit overleeft de encode van TikTok toch
niet: gemeten scheelt het 1–3 % ten opzichte van niets doen, terwijl het de
bitrate 50–120 % opjaagt. **[gemeten, eigen meting + kalibratiedata]**

Meet altijd eerst met `tools/texture_probe.py`. De richting verschilt per model.

### Gezichtsgrootte: al goed
TikTok's eigen data: gezicht onder 20 % van het beeld geeft +31 % consideration.
Wij zitten op 0,3–11 %. Hier valt niets te winnen, dus daar besteden we geen
tijd aan. **[gemeten]**

---

## Deel 2 — Wat mensen als eerste zien

Beste bron: CHI 2025, 749.828 waarnemingen van 50.444 deelnemers over
AI-beelden van mensen. Wat mensen benoemen als ze "nep" zeggen:

| Categorie | % van de opmerkingen | Hoe snel gezien |
|---|---|---|
| **Anatomie** — handen, vingers, tanden, oren | **61 %** | het snelst |
| **Stijl** — plastic huid, te vlak licht, "AI-glans" | 30 % | gemiddeld |
| **Functie** — dingen die zo niet kunnen werken | 21 % | het traagst |
| Natuurkunde — schaduw, spiegeling, stofval | 15 % | |

**Handen zijn nummer één, en onze persona houdt altijd een product vast.** Dat is
precies de risicozone: een greep die niet kan, een product dat in de vingers
zakt. Daar zit onze grootste winst. **[gemeten]**

Mensen halen 66,4 % goed op clips van 5 seconden, 72 % bij 1 seconde kijken,
82 % bij 20 seconden. Kijktijd is zelf een risico: hoe langer het gezicht in
beeld is, hoe meer kans dat iemand gaat zoeken. En oogmetingen laten zien dat
zodra iemand *argwaan* heeft, hij gaat scannen tot hij iets vindt. **De eerste
seconde bepaalt of iemand in inspectiemodus gaat.** **[gemeten]**

### Wat we dus doen
- Handen: één hand, deels buiten beeld, of in beweging. Geen take waarin vijf
  vingers én de productrand tegelijk scherp en stil zijn.
- Nooit echte producttekst scherp in beeld — upscalers verzinnen letters.
- Geen brede lach die seconden blijft staan (tanden worden één witte balk).
- Licht: één richting met afval, niet gelijkmatig.

### Wat we bewust NIET doen
| Standaardadvies | Waarom niet |
|---|---|
| Filmkorrel eroverheen | Verkeerde richting én overleeft 2,5 Mbit niet **[gemeten]** |
| Chromatische aberratie | 30× sterker dan een echte telefoonlens, en die corrigeert het zelf |
| Vignet | Zegt "filter". Een gerichte lichtafval zegt "één raam" |
| Rolling shutter nabootsen | iPhone leest uit in ~5 ms, onzichtbaar zonder snelle pan |
| Knipperfrequentie regelen | In 5 seconden verwacht je 0,7–1 knippering. Geen tell. **[fabel]** |

---

## Deel 3 — Vier clips laten lezen als één opname

Dit is waar het meeste te winnen valt en het kost niets.

| Wat | Waarde |
|---|---|
| handheld-beweging | 2 px, som van sinussen (1,7 / 4,3 / 9,1 Hz), geen vaste periode |
| belichtingsdrift | ±0,04, periode 3 s, fase per clip verschoven |
| **belichtingssprong op elke snede** | 0,06, verval 0,3 s |
| witbalans per clip | ±150 K |
| ruimtetoon | doorlopende bed onder alle snedes, −50…−60 dB |
| encode | H.264 high@4.1, 4:2:0, closed GOP `-g 48`, BT.709, 2,5 Mbit |

De belichtingssprong op de snede is het belangrijkste item: een echte telefoon
stelt zijn belichting opnieuw in na elke scene. Vier clips met exact dezelfde
belichting en witbalans is een sterke tell die gratis te verhelpen is. Hetzelfde
geldt voor de ruimtetoon: geluid dat dóór de snede loopt doet meer dan welke
beeldingreep ook. Alles staat in `tools/finish.py`. **[gemeten/praktijk]**

---

## Deel 4 — Onze eigen tools die we niet gebruikten

| | nu | beter | kosten |
|---|---|---|---|
| Kling-modus | `std` + geluid aan | **`pro` + geluid uit** | 8,75 → **7,5 credits** |
| stem | Kling's eigen stem ("robotachtig", lipsync loopt weg na 7–10 s) | eigen TTS + **Sync Lipsync 3** | 0,1 credit per regel |
| beweging | uit het niets gegenereerd | **Genjutsu motion transfer** vanaf echte video | nog te prijzen |

`pro` zonder geluid is dus **goedkoper én beter** dan wat we nu draaien. We
betaalden meer voor minder.

---

## Deel 5 — Wat het onderzoek zegt over de strategie

Hier wordt het ongemakkelijk, want de data spreekt de opdracht deels tegen.

**Elk verifieerbaar succesvol AI-account wint op karakter, niet op echtheid.**
Granny Spills: 400K volgers in weken, met een personage dat dingen zegt die een
mens niet durft. Lil Miquela doet alle "gewone meid"-signalen precies goed en
het werkt niet, omdat mensen de productie eronder voelen. De accounts die
proberen door te gaan voor echt zijn de accounts die het niet redden. **[gemeten
voor Granny Spills; kwalitatief voor Miquela]**

**Vriendelijk-enthousiast is precies het register dat reacties onderdrukt.**
Gemeten op 25.292 video's: vreugde −9,3 % reacties per view, verdriet −5,1 %,
herkenbaarheid +8,0 %, en iets waar je het oneens mee kunt zijn +20,6 %. En in
een aparte studie: bij AI-content is de reactiesentiment *neutraal* — het
probleem van AI-content is niet haat, het is onverschilligheid. Dat is exact
ons probleem: 5.519 views, 1 reactie. **[gemeten]**

**Onze views zijn niet raar.** Over 2 miljoen video's: views per post −23 % op
jaarbasis, kleine accounts het hardst geraakt. Engagement 3,85 %. Shares groeien
het snelst (+13 %), reacties het langzaamst (+3 %). 60–350 views is de bodem van
2026, geen shadowban. **Stuur op shares, niet op likes.** **[gemeten]**

**Het grootste platformrisico is niet het AI-label maar de "unoriginal
content"-regel.** Granny Spills is met 400K volgers gedemonetiseerd omdat het
sjabloonherhaling is. Drie video's per dag uit één pijplijn met hetzelfde
4-clip-stramien is precies waar die regel op mikt. **Varieer de structuur, niet
alleen het script.** **[gemeten, TIME]**

---

## Deel 6 — Het AI-label blijft aan

Eén advies uit het onderzoek volgen we niet: C2PA-metadata weghalen om het
label te ontlopen.

- **EU AI Act artikel 50** geldt sinds 2 augustus 2026. Wie AI-video van een
  realistisch ogend persoon publiceert moet dat kenbaar maken, uiterlijk bij het
  eerste contact. Boetes tot €15 mln of 3 % van de wereldwijde omzet.
- **Reclamecode Social Media & Influencer Marketing**, gewijzigd per 1 juli 2026,
  benoemt virtuele influencers expliciet en rekent affiliate-commissie als een
  relevante relatie die je moet melden. Handhaving via de ACM.
- TikTok leest C2PA sinds mei 2024 en zet er sinds november 2025 een onzichtbaar
  watermerk bij dat re-uploads overleeft. Het weghalen werkt niet en het is in
  strijd met hun beleid.

Wat het kost is eerlijk: er is één gedocumenteerd mechanisme waarlangs het label
bereik kost, namelijk de "Manage Topics"-schuif waarmee kijkers AI-content kunnen
wegdraaien. Eén meting (Sprout Social Q1 2026) noemt 1,9 % engagement voor
gelabelde tegen 3,4 % voor ongelabelde content; dat is een correlatie zonder
controle. TikTok zelf zegt dat het label op zichzelf de distributie niet beperkt.
Niemand heeft dit netjes getest.

Wij staan aan: `isAigc` en `commercialContentThirdParty` staan op elke post.

---

## Wat dit concreet verandert

1. `tools/finish.py` over elke video: ontruisen, handheld, belichtingssprong op
   de snede, ruimtetoon, telefoon-encode.
2. Kling **pro met geluid uit** + eigen stem + lipsync. Goedkoper en beter.
3. Handen, producttekst en tanden uit de risicozone componeren.
4. Toon omlaag: minder vriendelijk-enthousiast, meer iets waar je het oneens
   mee kunt zijn. Reacties komen van wrijving, niet van gezelligheid.
5. **Reply-to-comment** als vast format — bewijst een geschiedenis, lokt
   reacties uit, en een gesprek vergeeft mindere beelden.
6. Structuur variëren, niet alleen het script.
7. Sturen op shares.
