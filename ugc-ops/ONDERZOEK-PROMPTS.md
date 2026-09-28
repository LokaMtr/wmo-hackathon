# Wat de betere makers doen — onderzoek 28-09-2026

Let op bij het lezen: bijna alles wat over "AI UGC in 2026" geschreven wordt komt van
bedrijven die AI-videotools verkopen. Hieronder staat per punt of het uit een primaire
bron komt (ByteDance zelf, fal.ai, prijspagina's) of uit een leverancierblog. De
retentiepercentages die overal rondgaan zijn **niet verifieerbaar** — de patronen zijn
echt, de cijfers eromheen moet je niet doorvertellen.

## Seedance: ik zat er deels naast

Seedance 2.5 **bestaat wel**, sinds 31 juli 2026. Het staat alleen niet in onze
Higgsfield-catalogus; wij kunnen bij 2.0.

Maar de reden om ernaartoe te willen klopt niet. **Kling 3.0 wint van Seedance 2.5 op
camerabeweging.** In vergelijkend testwerk won Kling twee van de drie runs op vloeiende
camerabogen, en ByteDance schrijft zélf in hun paper dat de zwakke plek zit in
"the physical plausibility of complex motions". De gemelde faalvorm is morphing bij
snelle actie — precies het shot dat je voor een hook wil.

Seedance is ook het duurst: ongeveer $0,13–0,47 per seconde tegen $0,08–0,13 voor Kling.
Bij een hook die je twintig keer opnieuw genereert telt dat hard aan.

**Waar Seedance wél in wint: referenties.** 2.5 neemt tot 30 beelden, 10 video's en
10 geluidsfragmenten in één generatie. Dat is precies waar een character sheet plus een
product sheet plus een omgevingsreferentie in passen, allemaal tegelijk. Dat is de echte
reden om het ooit te gebruiken, niet de beweging.

Conclusie: **hooks op Kling, niet op Seedance.**

## Het prompt-format van fal.ai

Dit is het serieuste dat er te vinden is, en het is van fal zelf, niet van een blog:

```
FORMAT: [duur], [beeldverhouding], [één take of snedes], [tempo]

REFERENCE ROLES
@Image1 bepaalt alleen [identiteit/product/kleding]
Niet overnemen: [pose/achtergrond/licht]

STARTING STATE: [waar staat iedereen op moment nul]

TIMELINE: 0-X sec: [actie], X-Y sec: [volgende actie]

CAMERA: [pad, positie in beeld, wanneer de beweging begint]

CONTINUITY: [wat onveranderd blijft: identiteit, voorwerpen, richting, kleding]

AUDIO: [spraak, ruimtetoon, contactgeluiden]

CONSTRAINTS: [geen snedes/slow motion/herhaling/figuranten/tekst/logo's]
```

Vier dingen daaruit die direct op ons probleem slaan:

**1. STARTING STATE is een apart veld.** De meeste prompts beschrijven een scène, niet
beeld nul. Kling en Seedance beginnen dan vanzelf rustig en bouwen op — en dat is exact
het dode openingsbeeld waar wij iedereen op verliezen.

**2. Camerabeweging hangt aan een gebeurtenis, niet aan een stemming.** Letterlijk uit
de gids: *"The camera does not pan until the ball has fully left both hands."* En:
"vermijd vage woorden als dynamic; zeg waar het onderwerp in beeld staat en wat de
beweging in gang zet." Onze prompts stonden vol met "handheld phone look" en "no camera
movement of its own" — stemming, geen instructie.

**3. Eén referentie doet één ding.** Letterlijk: *"Do not make an image and a video
reference do the same job."* En er hoort een expliciete ontkenning bij: "@Image1 bepaalt
het product, neem de studioachtergrond van @Image1 níet over." Wij stuurden vier
gezichtsfoto's plus een productfoto mee zonder te zeggen wat elk ding moest doen.

**4. Bij een misser verander je één ding.** Niet de hele prompt herschrijven. Anders weet
je nooit wat het oploste.

Nog twee bruikbare dingen: bij occlusie (iemand loopt achter iets langs) moet je de hele
identiteit opnieuw uitschrijven, anders komt er iemand anders vandaan. En voor een serie
clips: **gebruik het laatste beeld van clip N als referentie voor clip N+1.**

## Hook-patronen

Zeven benoemde patronen circuleren; twee daarvan zijn puur visueel en lossen op binnen
het eerste beeld, en dat is wat wij nodig hebben omdat niemand lang genoeg blijft om iets
te horen of te lezen:

- **Mid-Action Open** — je begint middenin, de opbouw is weggeknipt.
- **Pattern Interrupt** — je breekt binnen een seconde een verwacht beeld- of geluidspatroon.

Onze **1,9 seconden is de handtekening van precies één ding**: de kijker heeft het
opbouwbeeld gezien en is weg voordat er iets gebeurde. Dat is geen bereikprobleem, geen
audioprobleem en geen bijschriftprobleem.

Wat overal terugkomt en wij fout deden: **schrap "studio lighting", "professional",
"perfect composition"** uit prompts. Die woorden leveren de gepolijste look die als
reclame leest.

## Character sheet: hoeken, niet aantallen

De bruikbaarste zin uit het hele onderzoek:

> "Drie beelden vanuit dezelfde hoek van voren geven het model één aanzicht van een
> gezicht en niets over de structuur ervan. Voren, driekwart en profiel geven het
> geometrie, en geometrie is wat een verandering van pose overleeft."

Dus: zes tot acht beelden, voren / driekwart / profiel / achter / gezicht close-up /
halve close-up, samengevoegd tot **één sheet**, niet als losse bestanden. Een set van
twaalf beelden allemaal van voren is slechter dan vier met echte hoekspreiding.

Wij stuurden vier losse gezichtsreferenties mee, vrijwel allemaal frontaal. Dat verklaart
waarom het gezicht per video verschoof.

## Eén gratis winst

TikTok kiest zelf een omslagbeeld en dat is meestal een halve beweging of een rare
gezichtsuitdrukking. Een eigen omslag instellen **verandert niets aan de distributie en
reset de views niet**, maar helpt wel op je profiel en in zoeken. Kost niks.

Belangrijk onderscheid dat de meeste artikelen door elkaar halen: de omslag telt voor
zoeken en je profielraster; het **eerste gerenderde beeld** telt in de For You-feed, waar
de video automatisch speelt en er geen omslagkeuze is. Ons probleem zit in de For
You-feed, dus het eerste beeld gaat vóór de omslag.

## Bronnen

seed.bytedance.com (paper Seedance 2.0 + aankondiging 2.5) · fal.ai/learn/devs/seedance-2-5-prompting-guide ·
kling.ai/dev/pricing · apiframe.ai · cometapi.com · seedance2-video.com · mindstudio.ai ·
curiousrefuge.com · github.com/cliprise/awesome-ai-ugc-video-prompts · lumalabs.ai ·
ugcmaker.org · greenfroglabs.com · hypenest.ai · miraflow.ai · runway.com · ud.hk · envato
