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

## L051 — Geen mechanismen in beeld
Clip 3 van teddy-3: haar vingers hangen de hele clip op dezelfde hoogte aan de rits, maar
je hoort wel een ritsgeluid, en halverwege verschijnt er een madeliefje aan de
ritssluiting dat er daarvoor niet was. Loka zag het meteen.

Dit is de categorie die CHI 2025 "functioneel" noemt: dingen die zo niet kunnen werken.
21% van wat mensen benoemen, en het lastigst zelf te zien omdat je het pas merkt als je
erop let. Een rits, knoop, gesp, dop of slot laten bedienen is dus uit den boze.

Vervangen door: handen in de mouwen, armen om zichzelf heen. Geen mechanisme, niks dat kan
verschijnen. Kling pro (10 credits) i.p.v. std voor de betere lipsync.

## L052 — Kledingcontinuïteit expliciet in élk frameprompt
In teddy-3 houdt ze in clip 2 een lange romper omhoog (benen tot de grond) maar draagt ze
in clip 3 en 4 een korte met blote benen. Hetzelfde product, twee modellen. Zet lengte en
model letterlijk in elk frameprompt, niet alleen in het eerste.

## L053 — Metricool ververst ongeveer een keer per dag
Acht uurlijkse syncs op 27-09 gaven acht keer exact dezelfde vier rijen. Metricool loopt
structureel meer dan 24 uur achter op de TikTok-app; vaker dan eens per paar uur pollen
levert alleen ruis. Ritme teruggezet naar elke 4 uur (07:47 / 11:47 / 15:47 / 19:47 / 23:47).

Voor actuele cijfers is de TikTok-app van Loka de bron, niet Metricool.

## L054 — Views en reacties komen niet uit dezelfde hoek
Stand 27-09: teddy-2 heeft 5.528 views en 1 reactie. hismile-2 (444) en shapewear-b (312)
hebben er allebei 2. Wat die twee gemeen hebben en teddy-2 niet: een directe vraag in de
caption zelf, niet alleen in de eerste comment.

De hook bepaalt of iemand kijkt, de vraag bepaalt of iemand typt. Zet dus allebei in élke
video: een situatie-hook in beeld én een vraag in de caption.

## L055 — Vraag toegevoegd aan alle ingeplande captions (28-09)
shapewear-a, sniffit-1, eyemask-1 en beamer-1 hadden alle vier geen vraag in de caption.
Toegevoegd zonder iets opnieuw te renderen, dus gratis. Vanaf nu hoort de vraag bij het
post-kit en niet bij de nabewerking: schrijven doe je hem tegelijk met de hook.

## L056 — teddy-3 haalde 257 views ondanks alle regels
teddy-3 deed alles goed volgens onze eigen standaard: relatie-hook, situatie tussen mensen,
vraag in de caption, bewezen product, volledige afwerking. Na 20 uur 257 views. teddy-2 zat
op dat moment boven de 2.000.

Dat betekent dat de hook-theorie is opgebouwd op één uitschieter. Negen video's: één op
5.538 en acht tussen 66 en 769. Het accountgemiddelde zonder teddy-2 is 303.

Niet wegpoetsen: onze verklaring voor teddy-2 kan achteraf-redenering zijn geweest. Wat
overeind blijft is alleen dat eyemask-2 (66) meetbaar slechter is dan de rest, niet dat we
weten hoe je een video van 5.000 maakt.

## L057 — Eerste verkoop (28-09): €29 GMV, €2,90 commissie
Negen video's, 8.045 views totaal, één verkoop. Conversie op views: 0,012%.

Wat dit verandert aan de analyse van L056: views zijn niet het enige dat telt. Een video met
257 views kan net zo goed de verkoop hebben gedaan als die met 5.538. Zolang TikTok Shop
niet per video toont welke video converteerde, kunnen we dat niet uit elkaar trekken —
maar de aanname "meer views = meer omzet" is niet bewezen op dit account.

Stand: omzet €2,90, kosten €39,96, netto −€37,06. Terugverdienpunt bij deze marge
(10% commissie op €29) ligt op ongeveer 14 verkopen.

## L058 — Alleen de teddy romper verkoopt
TikTok Shop 20-26 sep: teddy romper €29,62 / 1 stuk. Sniffit, mokken, Hismile, parfum en
de jurk allemaal €0. Zeven video's over vijf andere producten hebben nul opgeleverd.

De verkoop viel vóór 27-09, dus hij komt van teddy-1 of teddy-2, niet van teddy-3.

Consequentie voor de planning: niet spreiden over producten maar stapelen op het enige dat
converteert. Een product dat niet verkoopt na twee video's krijgt geen derde.

## L059 — Kosten zijn wat er betaald is, niet wat er verbruikt is
Ik rapporteerde €39,96 aan kosten (verbruikte credits) terwijl Loka €60 had betaald voor de
top-up. Dat geld is uitgegeven of de credits nou op zijn of niet. Loka corrigeerde dit.

Netto winst in het dashboard = commissie − top-ups. De verbruikte credits staan er nog wel
bij als tweede regel, want dat zegt iets over het tempo, maar het is niet de kostenpost.

Stand 28-09: €2,90 binnen, €60 betaald, netto −€57,10. Terugverdienpunt bij €2,90 per
verkoop: 21 verkopen.

## L060 — Nooit een videobatch zonder medias
Op 28-09 vier Kling-clips ingestuurd zonder `medias` met het startframe. Zonder referentie
genereert Kling uit de tekst alleen: een andere vrouw, andere kamer, andere kleding.
Onbruikbaar, niet te annuleren, 40 credits weg.

**Regel: een `generate_video`- of `generate_video_batch`-call zonder `medias` gaat niet weg.**
Lees de call terug vóór het versturen en controleer dat elk item een `start_image` heeft.

Bij een nieuwe opzet (nieuw model, nieuwe modus, nieuwe referentie): eerst één clip
insturen en een frame controleren, dan pas de rest. Dat had dit op 10 credits gehouden in
plaats van 40.

## L061 — Clips hergebruiken: wat wel en niet kan
Gemeten over 52 clips in de bak: er is er geen één echt stil. In vrijwel elke clip zegt ze
een zin over dát product. Dus:

- **Binnen één product: ja.** 20 teddy-clips over vier sets. Andere volgorde, andere
  hooktekst, andere caption = een andere video voor 0 credits. `tools/remix.py` doet dat.
- **Tussen producten: nee.** Een beamer-clip in een teddy-video klopt niet met wat je hoort.
  Muten kan niet: haar mond beweegt dan zonder geluid.
- **Meer posten per dag hiermee: nee.** TikTok weegt "unoriginal content" mee en dat is
  precies hetzelfde beeldmateriaal opnieuw posten. Een account met 400k volgers is daarop
  gedemonetiseerd. Gebruik remix om GOEDKOPER te maken wat we toch zouden posten, niet om
  MEER te posten van hetzelfde.

## L062 — De foto-posts doen 10 tot 50x onze video's
Uit de TikTok-grid van 28-09: de drie oudste posts zijn foto-posts en staan op **50.100,
29.200 en 18.300 views**. Elke video die wij daarna maakten zit tussen 0 en 5.544.

Die foto's zijn van vóór onze campagne. Maar het is hetzelfde account en hetzelfde gezicht,
en ze halen tien tot vijftig keer zoveel bereik.

Op 25-09 schrapten we slideshows omdat je er geen product aan kunt koppelen. Dat klopte,
maar we wisten toen niet dat ze zó veel beter liepen. **Bereik en verkoop zijn twee
verschillende problemen en we hebben ze door elkaar gehaald.**

Wat de foto-posts gemeen hebben: een tekst met een spanningsboog ("My dad taking a pic of
me vs...", "The picture I wanted him to save", "A man needs 2 things in life..."), geen
product, geen verkooppraatje. Puur een situatie waar je het einde van wilt zien.

## L063 — Vier keer hetzelfde kader is geen video
teddy-4: negen frames lang exact hetzelfde shot. teddy-2 (5.544) heeft product-hero,
medium, wijd met de hele kamer, en close-up. Shotplan schrijven vóór de prompts.

## L064 — Kijktijd is 1,9s, ongeacht views of hook
teddy-2 (5.544 views) en teddy-3 (358 views) hebben allebei exact 1,9 seconden gemiddelde
kijktijd, 0,6-1,0% uitgekeken, en bij allebei stopt de massa op 0:01. Vijftien keer verschil
in bereik, identieke kijktijd.

Het ligt dus niet aan de hook-tekst, het product of de montage. Het ligt aan het format:
elke video opent met een vrouw die medium shot op een bed zit en gaat praten. Dat is het
beeld waar de duim overheen gaat.

Consequentie: geen nieuwe video's in deze vorm maken tot het openingsshot getest is.
Drie varianten van dezelfde video die alleen in de eerste seconde verschillen.

## L065 — Alleen producten die je in één frame ziet, verkopen
Vijf producten, negen video's, één verkoop. Het enige dat verkocht is ook het enige dat je
zonder uitleg herkent. Mondwater, inhalator, oogmasker en shapewear moeten alle vier
uitgelegd worden en verkochten alle vier nul.

Dat hangt samen met L064: een product dat je moet uitleggen heeft geen eerste beeld.
Criteria staan in agents/scout.md.

## L066 — Kledingcontinuïteit hoort ook in de vídeoprompt, niet alleen in het frame
Bij de B-opening stond de volledige lengte wel in de frameprompt maar niet in de
videoprompt ("worn by a blonde woman"). Kling trok terug naar een hoodie met blote
benen: ander kledingstuk, ander model. Tweede poging mét "full-length legs down to her
ankles, not a hoodie" gaf het juiste kledingstuk maar een ander gezicht en de reveal
kwam pas op 4,2s.

Twee dingen: L052 geldt voor élke prompt in de keten, en een reveal die van een
camerabeweging moet komen kun je beter door een snede laten doen. De eerste 2 seconden
macro plus een harde snede geeft dezelfde reveal, kost niets en gaat niet mis.
Prijs van de les: 15 credits.

## L067 — Tekst moet bij de beelden passen, niet alleen bij het product
Eerste versie van de A/B/C-test had als hook "day 4 in the same thing" terwijl de body
laat zien hoe het pakket binnenkomt en ze het aantrekt. Hook en beeld vertelden een
ander verhaal. Bij hergebruikte clips (remix) eerst kijken wat de body vertélt, dan pas
de hook schrijven.

## L068 — Onze prompts beschreven een sfeer, geen beginbeeld
Uit fal.ai's promptgids: STARTING STATE hoort een apart veld te zijn, en camerabeweging
hoort aan een gebeurtenis te hangen ("de camera pant niet tot de bal beide handen heeft
verlaten"), niet aan een stemming. Onze prompts stonden vol met "handheld phone look" en
"no camera movement of its own": dat is sfeer, daar doet het model niets mee.

Modellen bouwen vanzelf rustig op als je beeld nul niet vastlegt. Dat is letterlijk het
dode openingsbeeld waar we iedereen op verliezen.

## L069 — Eén referentie, één taak, plus een expliciete ontkenning
"Do not make an image and a video reference do the same job." Bij elke referentie hoort
te staan wat hij bepaalt en wat er níet van overgenomen mag worden. Wij stuurden vier
gezichtsfoto's en een productfoto mee zonder rolverdeling; het model mocht zelf kiezen.

## L070 — Hoekspreiding verslaat aantal referenties
Vier beelden met voren, driekwart, profiel en achter zijn beter dan twaalf frontale
beelden: hoeken geven het model geometrie, en geometrie overleeft een verandering van
pose. Onze vier referenties waren vrijwel allemaal frontaal, wat verklaart waarom het
gezicht per video verschoof.

## L071 — Kling wint van Seedance op camerabeweging
Seedance 2.5 bestaat sinds 31-07-2026 maar staat niet in onze catalogus, en het is
hoe dan ook niet wat we ervoor zochten: Kling 3.0 won twee van drie vergelijkende runs
op vloeiende camerabogen, ByteDance noemt in hun eigen paper "physical plausibility of
complex motions" als zwakte, en de gemelde faalvorm is morphing bij snelle actie.
Seedance is bovendien het duurst per seconde.

Waar Seedance wel in wint is referentievolume: 30 beelden, 10 video's, 10 geluiden in
één generatie. Dat is een reden voor de body van een video, nooit voor de hook.

## L072 — De teddy romper kon rekenkundig nooit uit
€29,62 bij 10% is €2,90 per verkoop. Bij een videokost van 25 tot 45 credits moest elke
video een verkoop opleveren om quitte te draaien. Dat is geen contentprobleem.

Drempel vanaf nu: minstens €8 per verkoop. Per categorie betekent dat wonen €40+,
parfum €32+, sieraden €40+, kleding €53+. Elektronica valt af.

Nog te verifiëren en het verschuift alles met 21%: rekent TikTok Shop EU de commissie
over de prijs met of zonder btw.

## L073 — TikTok Shop NL is vijftien weken oud
Gelanceerd 15 juni 2026. Er bestaat dus geen betrouwbare NL-bestsellerdata; wie die
aanbiedt extrapoleert uit DE/FR/ES/IT. Belangrijker: de verzadiging in NL is daardoor
laag, en dat is het enige structurele voordeel dat dit account heeft. Het verdwijnt
ergens in Q1 2027.

## L074 — Er ligt een harde publicatiedeadline
Dit is het eerste Sinterklaas- en kerstseizoen met TikTok Shop live in NL. Nederlandse
webshopomzet ligt in de vijf weken voor pakjesavond ~29% boven normaal. Content die je
1 tot 20 oktober publiceert is wat rankt in het venster 1 november tot 5 december.

We hebben dus vier weken om signaal op te bouwen voordat het geld er is.

## L075 — Commissie gaat over de prijs inclusief btw
Geverifieerd op acht producten uit de marktplaats: het uitgekeerde bedrag is steeds exact
het commissiepercentage van de wéérgegeven prijs, niet van het bedrag zonder btw.
Kameo €49,98 -> €10,00 (20%), Khamrah €23,49 -> €4,70 (20%), Alua €31,96 -> €4,00
(12,5%), Landot €42,99 -> €4,30 (10%), NutriBrain €29,90 -> €8,97 (30%).

De opslag van 21% die ik als voorzorg had ingebouwd kan er dus af. Drempel is simpel:
prijs x percentage op wat er staat, minstens €8.

## L076 — Het percentage verschilt per verkoper, van 10% tot 30%
Op dezelfde marktplaats en in dezelfde prijsklasse loopt de commissie van 10% (Landot
stijlborstel) tot 30% (NutriBrain collageen). Het percentage is dus geen eigenschap van
de categorie maar een keuze van de verkoper.

Zoekvolgorde vanaf nu: eerst filteren op commissiepercentage hoog naar laag, dán pas de
halvesecondetoets. Andersom bekijk je honderd producten die toch niet uitkunnen.

## L077 — Geld en zichtbaarheid zijn twee aparte toetsen, en beide zijn hard
NutriBrain collageen haalt €8,97 per verkoop en is daarmee financieel het beste wat we
gezien hebben na het Kameo kussen. Maar het is een potje capsules: het resultaat is pas
na weken zichtbaar, het vraagt uitleg, en supplementen kennen claimbeperkingen onder
EU-regels terwijl de Consumentenbond actief TikTok Shop-producten test op misleidende
claims.

Dat is exact de vorm die bij ons twee keer nul verkocht (mondwater, inhalator). Een
product dat de ene toets haalt en de andere niet, valt af. Niet onderhandelen.

## L078 — Elk shot moet een cameraman hebben die kan bestaan
kameo-1, shots 3 en 4 (eerste versie): een close-up op matrashoogte recht voor haar
gezicht, en een shot recht van bovenaf terwijl ze met beide armen naast zich op bed ligt.
Niemand kan dat gefilmd hebben. Loka zag het meteen ("wie houdt de camera vast?"), ook
zonder te kunnen benoemen wat er mis was. Dat is precies hoe AI herkend wordt: niet aan
één fout pixel maar aan een situatie die niet kan.

Per shot moet één van deze drie waar zijn, en het beeld moet laten zien welke:
- **selfie**: telefoon in haar eigen hand, arm zichtbaar richting de lens
- **neergezet**: telefoon staat ergens stil (voeteneind, plank), vaste hoogte, geen beweging
- **POV**: haar eigen handen in beeld, camera op ooghoogte

Een shot van bovenaf mag alleen als selfie (arm omhoog) of met iets waar de telefoon aan
hangt. "Handheld" in een prompt zonder te zeggen wiens hand, is een onzichtbare cameraman.

## L079 — Kernkeuzes van het account verander je niet zelf
kameo-1 werd in het Nederlands gemaakt (stem, tekst, bijschrift) terwijl het account
altijd Engels is geweest. Mijn reden was dat de kopers in de NL-shop zitten, maar taal,
persona en niche zijn keuzes van Loka, geen productiedetail. Eén bijzin in een
opleverbericht is geen vraag stellen. Kostte 30 credits om over te doen.

Taal van het account: **Engels**, met een lichte Europese tongval. Bijschriften Engels.

Voortaan: wil ik iets aan taal, persona, niche of postfrequentie veranderen, dan vraag ik
het vooraf met mijn argument erbij, en maak ik niets totdat hij ja zegt.

## L080 — Metricool updateScheduledPost: stuur geen twitterData/instagramData mee
`getScheduledPosts` geeft `twitterData` en `instagramData` terug, maar als je die bij een
update terugstuurt terwijl alleen TikTok in `providers` staat, weigert de API met
"networkData contains data for network 'twitter' not listed in providers". Alleen
`tiktokData` meesturen. `uuid` hoort als losse parameter naast `id` en `blogId`, en
`timezone` niet op topniveau. Het id verandert na een update (kameo-1: 383680580 →
383823470), de uuid blijft.

## L081 — Mila mag geen ervaring claimen
Een AI-persona die zegt dat ze iets gebruikt, meemaakte of dat anderen het kochten, geeft een
verzonnen getuigenis (FTC Endorsement Guides; EU-richtlijn oneerlijke handelspraktijken,
Annex I). Het AI-label maakt het niet waar. Alle teddy-video's deden dit ("i've worn it
once"), en kameo-1 ook ("I don't flip it at night anymore", "my boyfriend just ordered one").

Wel: zichtbare fictie (sketch, POV, pet-cam, metafoor) en feiten van de productpagina.

**Besluit Loka 28-09:** hij kent het risico en kiest ervoor om het te nemen. Ervaringszinnen
zijn toegestaan. Niet meer aankaarten.

## L082 — Continuïteit checken is niet genoeg; kijk of ze er goed uitziet
bakery-1 en whatis-1 (29-09) werden afgekeurd. bakery: in het laatste shot sperde ze haar
ogen wijd open en viel hard warm lamplicht op haar gezicht, waardoor ze ingevallen oogde
("crack junk"). whatis: "je ziet niet wat het is" las als vaag, niet als nieuwsgierig.
Beide waren 8–10 s, korter dan de eigen ladder (15–20 s).

Ik had alleen gecontroleerd op fouten (één flesje, zelfde trui, geen bolletjes), niet op
de vraag die de kijker stelt: ziet ze er goed uit, snap ik het meteen, is het leuk.
Drie vaste vragen erbij in de checklist (6, 7, 8). Emotie in prompts: "calm, subtle,
relaxed", nooit laten raden; gezichtslicht altijd egaal met vullicht.

## L083 — Elke video in het dashboard krijgt videoAsset én thumbAsset
Sinds de nieuwe start (28-09) zette ik videos-docs aan zonder de mp4 en een thumbnail als
artifact-asset te uploaden. Gevolg: geen thumbnails in de lijst en geen video in de post-kit,
waardoor Loka niets kon posten vanuit het dashboard. Vaste stap bij elke video (ook remixes):
thumbnail 540x960 van het hookmoment, mp4 + jpg uploaden met Artifact `asset: true`,
ids in `videoAsset` en `thumbAsset`, plus `firstComment`.
