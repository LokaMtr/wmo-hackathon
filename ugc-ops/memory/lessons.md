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
