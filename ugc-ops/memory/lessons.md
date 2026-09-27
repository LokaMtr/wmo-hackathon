# Lessen (gespiegeld in dashboard-collectie `lessons`)

Formaat: `[area] regel (evidence)`. Pas aan als nieuwe data het tegenspreekt.

## production
- [production] Nooit spiegel-/dubbelganger-/trucage-concepten; AI verwart spiegelbeeld en persoon. (Mirror-concept, clip 1 mislukte 2×)
- [production] Eén kamer-basisbeeld zonder persoon maken; elke scène is een bewerking daarvan. Anders verandert de kamer per clip. (beamer v1 vs v2)
- [production] Vaste positie van het product in de ruimte beschrijven ("links op het nachtkastje") en in élke scène herhalen. (beamer v1: sterrenhemel/andere film in clip 3)
- [production] Eerst een schone packshot (product zonder model) genereren en als referentie gebruiken; productfoto's met model of screenshots geven vervorming. (shapewear clip 2 werd een 'lap stof')
- [production] Zachte producten nooit aan één hand laten hangen of laten schudden/wiebelen: ze vervormen. Met twee handen strak vasthouden, of product stil laten staan. (variant B clip 2 en 4, 2× opnieuw)
- [production] Kleding aan hanger: expliciet 'FULL ADULT SIZE, zo groot als haar eigen lichaam' + lengte benoemen; anders wordt het kindermaat of een lange jumpsuit. (teddy scène 3, teddy2 clip 1)
- [production] Nooit mond-/tongacties beschrijven (tong over tanden, likken, drinken, eten). Standaard: "Normal speaking mouth movement only, no tongue, no exaggerated mouth shapes". (hismile clip 3)
- [production] Handen verankeren (op aanrecht, om een object, in schoot) en 'MOVEMENT STYLE: small, slow, natural movements only' → realistischer. (hismile v2)
- [production] Contactsheet checken op extra objecten aan de randen (telefoon op statief verscheen in beeld); fix met lichte crop i.p.v. opnieuw genereren. (teddy2 clip 1)
- [production] Kling voegt soms muziek toe ondanks prompt; audio checken. (skills)
- [production] Emoji in .ass-hooktekst renderen als blokje; alleen tekst gebruiken. (hismile hook)
- [production] ffmpeg concat: `apad` + `-shortest` loopt eindeloos; `-t` op echte duur gebruiken (gefixt in mila_mirror.py).
- [production] Higgsfield raadt soms een preset aan i.p.v. te genereren → opnieuw indienen met `declined_preset_id`.

- [production] Seedance 2.0 Mini (1 cr/s) vs Kling 3.0 std (1,75 cr/s), zelfde frame+prompt: Kling duidelijk beter (stem/lipsync) volgens Loka. Kling blijft standaard voor pratende clips. (test 25-09, 6 credits)

## compliance
- [compliance] NSFW-filter blokkeert: satijnen jurken, hemdjes/tanktops, korte rompers met staande poses, "bed" + referentiebeeld. Oplossing: bedekkender outfit (sweater/hoodie), hoger inkaderen. Blokkades kosten niets.
- [compliance] Geen echte Disney/merk-content; eigen tekenfilm in klassieke stijl werkt net zo goed. (beamer)
- [compliance] AI-beeld dat het productresultaat 'bewijst' (vieze wastafel) = misleidend; liever echt shot of weglaten. (hismile v1)
- [compliance] Geen medische claims (Sniffit: geen 'verstopte neus').

## script
- [script] Beste stijl (door Loka gekozen): droge humor, concreet detail, zachte aanrader i.p.v. pitch; eindigen met korte grappige CTA ("Go be a bear", "Boys... take notes"). (teddy, beamer v2)
- [script] Sceptisch→overtuigd: noem het concrete bezwaar ("gaat eruit zien als een zaklamp") i.p.v. het uitgekauwde "I was skeptical but". (beamer v2)
- [script] Spreektempo max ~2,5–3 woorden/seconde; elke zin gekoppeld aan een zichtbare actie.
- [script] Prijs altijd checken tegen de productpagina (coupon vs normaal). (beamer v2: '€40' klopte niet)

- [script] Scripts via agents/scriptwriter.md: teardown → 10 hooks scoren → structuur → 4-clip beat-sheet → zelfkritiek ≥8/10. Loka: scripts moesten 'veel beter'. (eyemask-1 was te vlak: geen probleem, geen re-hook, geen CTA)

## hooks
- [hooks] Sterk volgens Loka: sit-test hook, reactie-hooks (snuif), mini-sketch met omslag (3pm), plafond-POV, cadeau-POV. Nog niet gemeten; analist moet bevestigen.

## products
- [products] Goed AI-maakbaar: wearables (romper), gadgets met zichtbaar effect (beamer), potjes/flessen om vast te houden. Moeilijk: vormveranderende stof in handen, vloeistof in de mond.

- [products] EU-bestsellers op TikTok Shop zijn goedkoop (€5–25); producten van €30–45 alleen met cadeau-framing (Sinterklaas/kerst). (scout 25-09, FastMoss april)
- [products] bol.com en amazon.nl blokkeren scrapen (kleinere NL-webshops zoals petit-jolie.nl en koreanbeauty.eu wél): commissie altijd via screenshots van Loka checken. (scout 25-09)

## posting
- [posting] Metricool beste tijden Amsterdam: ~10:00 en ~18:00 (wo/do het sterkst).
- [posting] Oranje winkelwagentje kan via GEEN API; alleen in de TikTok-app. Metricool 'melding'-modus downloadt enkel de video. Beter: TikTok-drafts via Higgsfield (koppeling nog maken).
- [posting] Metricool-analytics van TikTok lopen >24u achter; metrics pas bij de volgende run invullen, lege rijen ≠ 0 views.
- [posting] Planning in Metricool is leidend. Meldt Loka een extra/overgeslagen post: video op posted zetten en de rest van de planning opschuiven.

## budget
- [budget] Oogmasker: 1 basisbeeld + 3 frames + 3 std-clips (6+5+5s) = 29 credits, geen redo's. Productfoto uit screenshot croppen (alleen product op wit) werkt als packshot.
- [budget] ~40% van de credits ging naar redo's. Frames eerst beoordelen, std i.p.v. pro, 3 clips i.p.v. 4 → ~30 credits/video.
- [products] Productfoto's van webshops kunnen EXIF/GPS bevatten: metadata strippen vóór upload. (L033)
- [hooks] Teddy-1 na 10u: 202 views, 12 likes, 0 comments. Humor-hook = likes, geen gesprek: zet een vraag in caption/eerste comment. Voorlopig. (L034)
- [posting] TikTok: aan foto-posts/slideshows kun je geen product koppelen. Slideshows zijn daarom gestopt; alleen video's. (L036)
- [products] Scoor producten ook op "past dit in een aesthetic scene zonder uitleg?" — niet alleen op AI-maakbaarheid. Voordoen-producten (mondwater, inhaler) passen niet bij dit account; dragen/staan-producten wel. (L037)
- [products] Bekijk productfoto's echt vóór je een idee opschrijft; een lelijke plastic packshot verraadt dat het product niet in een aesthetic scene past. (L038)
- [hooks] Eigen cijfers 26-09: teddy-2 (cadeau-POV, "i said ONE time that i'm always cold") 4.006 views in 18u vs eyemask-2 (vergelijk-review) 54 views in 26u, zelfde dag. Schrijf hooks vanuit een situatie tussen mensen, niet vanuit het product. (L039)
- [posting] Ritme is 3 posts per dag: 10:00, 16:00, 21:00. Kies per slot een video die bij het dagdeel past. (L040)
- [hooks] Zet in de laatste 2 seconden een directe vraag in beeld; de enige post met comments is de enige met een vraag. (L041)

## L042 — Tekst over de hele video is een AI-tell
Vijf tekstblokken achter elkaar leest als een ondertiteling van een advertentie, niet als
iemand die iets vertelt. Nieuwe standaard: hooktekst in de eerste 3s en de slotvraag in de
laatste 2,5s, daartussen niets. Wit, geen rand, geen kader.

## L043 — Ongelijke cliplengtes
4× exact 5s geeft een metronoomritme dat je voelt. Snij naar 3,0 / 4,6 / 4,4 / 5,0 en de
video voelt gemonteerd in plaats van geplakt. Kost niets en maakt hem ook korter.

## L044 — Voice-over kost 0,1 credit maar alleen bij stille beelden
Seed Audio TTS is praktisch gratis. Maar Kling-clips met sound-on laten Mila praten, dus
een losse voice-over loopt uit sync met haar mond. Voice-over is voor b-roll: handen,
product, kamer — geen gezicht.

## L045 — get_cost is niet de echte prijs
De kostenvoorspelling van Higgsfield gaf 0,1 credit voor een Seed Audio-regel; de
transactiehistorie laat 1,0 per generatie zien. Reken kosten na met `transactions`,
niet met `get_cost`, voordat je een bedrag doorgeeft.

## L046 — Een belichtingssprong moet de snede opvangen, niet erbij optellen
Een echte telefoon staat na een snede nog even op de belichting van het vorige shot en
regelt dan bij. Ik telde er blind een sprong bovenop, met wisselend teken, en dat gaf een
flits: 44 helderheidsniveaus in een frame, terwijl het zonder afwerking 29 was. Meet de
gemiddelde helderheid per clip en laat de stap naar het verschil toe lopen, dempend over
0,35s. Resultaat 17,7 — zachter dan zonder afwerking.

Controleer dit altijd: de grootste sprong tussen twee opeenvolgende frames mag na de
afwerking niet hoger zijn dan ervoor.

## L047 — Nagebootste camerabeweging: niet doen
Meetbaar klopte het (0,00 px is geen telefoon, 0,34 px wel), maar zichtbaar trilde het.
Loka zag het meteen. Een kijker ziet geen statistiek, die ziet trilling. Zichtbaar mis is
erger dan meetbaar mis. De schakelaar blijft in finish.py staan (--shake/--tremor) maar
staat standaard op 0, en gaat pas aan als er echt telefoonmateriaal is om op te kalibreren
in plaats van op een geschatte band.

## L048 — Nabootsen van camera-gedrag werkt niet zonder referentie
Twee rondes achter elkaar zag Loka het effect dat ik had toegevoegd: eerst de trilling,
daarna de belichting die op en neer ging. Beide waren gebaseerd op een gekalibreerde band
uit onderzoek, niet op echt materiaal van ons eigen soort beeld. Zonder eigen referentie is
elk nagebootst camera-effect een gok die zichtbaar wordt.

Alles wat de kijker kan ZIEN gebeuren is nu uit. Wat blijft is wat alleen te merken is:
ontruisen, ruimtetoon, encode. Standaardwaarden in finish.py: shake 0, tremor 0, drift 0,
ae-step 0, wb 0.

Regel: voeg geen effect toe dat je niet op echt materiaal hebt kunnen kalibreren.

## L049 — Cliplengte volgt het geluid, niet een bedacht ritme
Ik knipte op 3,0 / 4,6 / 4,4 om een ongelijk ritme te krijgen. Gemeten: haar stem liep in
c1 tot 3,3s, in c2 tot 4,7s en in c3 tot 4,9s. Ik kapte haar dus in drie van de vier clips
middenin een zin af. Loka voelde dat meteen, zonder te kunnen benoemen wat er mis was.

`finish.py` bepaalt de lengte nu zelf uit de geluidsenveloppe plus de beweging (voor als
ze niet meer praat maar nog wel gebaart). Geef `--dur` niet mee. Voor teddy-3 werd dat
4,25 / 5,04 / 5,04 / 4,55.

Het ritme moet uit de inhoud komen, niet uit een getal dat ik mooi vond.

## L050 — Er is geen ruimtetoon in Kling-clips
Ik zocht het stilste stuk uit het eigen materiaal en loopte dat als ruimtetoon onder de
video. Gemeten bleek dat fragment een piek op 205 Hz te hebben, haar grondtoon: het stilste
stuk was nog steeds stem. Die lus liep negen keer onder de video en was hoorbaar.

Kling-clips met sound-on hebben nergens echte stilte. Ruimtetoon staat nu uit
(`--roomtone` om hem aan te zetten) en er zit een controle op die weigert als het fragment
niet stil en toonloos is (RMS boven 0,008, piek boven 0,12 of een te smalle spectrale piek).

Echte ruimtetoon moet van buiten komen: 30 seconden stilte opgenomen in een echte kamer.
