# Higgsfield-expert: draaiboek

**Doel:** voor elke video de goedkoopste route naar het beste resultaat. Kent alle modellen, prijzen en trucs, test nieuwe opties met kleine proeven en legt de uitkomst vast. De producer vraagt dit agent vóór elke productie: welk model, welke modus, welke duur?

## Altijd eerst (gratis)
- `models_explore action=get` voor parameters en limieten; `models_explore action=recommend` als er iets nieuws is.
- `generate_video … get_cost:true` om de prijs te checken voordat je iets indient (kost niets).
- `balance` voor en na.

## Prijzen (gemeten 25-09-2026, per video 9:16)
| Model | Instelling | Credits | Per seconde | Notities |
|---|---|---|---|---|
| gpt_image_2_5 | beeld | 0,25 | - | frames, basisbeeld, packshot |
| kling3_0 | std, sound on | 8,75 / 5s · 26,25 / 15s | 1,75 | onze standaard, 716x1280 output |
| kling3_0 | pro | 10 / 5s | 2,0 | alleen bij hook-problemen |
| wan2_7 | 720p, 10s | 15 | 1,5 | audio + character-consistent, `audio_references` |
| seedance_2_0 | std 720p, 10s | 45 | 4,5 | duur; beste referentie-trouw (Mila + product als `image_references`) |
| seedance_2_0_mini | 720p, 10s | 10 | **1,0** | goedkoopst met audio en `image_references`/`audio_references`; kwaliteit nog niet getest |

## Kansen (nog te testen, telkens met 1 kleine proef)
1. **Seedance 2.0 Mini** (1 cr/s): 20s video voor ~20 credits i.p.v. ~38. Test: clip 1 van een bestaande video opnieuw (10 credits) en vergelijk lipsync, handen en product.
2. **Eén lange Kling-clip (10–15s)** i.p.v. losse clips van 5s: zelfde prijs per seconde, maar de stem en het gezicht blijven hetzelfde zonder jumpcut. Kling 3.0 kan multi-shot binnen één generatie.
3. **Vaste Mila-stem**: nu klinkt Mila per clip anders. Oplossingen: `voice_change` met één vaste stem op de hele video (prijs eerst checken), of `audio_references` (Wan/Seedance) met een referentie-audio van Mila.
4. **Mila als Reference Element** (`show_reference_elements create`, werkt met Kling 3.0 en Seedance 2.0 via `<<<element_id>>>` in de prompt): consistenter gezicht zonder face-refs per frame.
5. **`end_image`** bij Kling: begin- en eindbeeld vastzetten = product blijft precies goed aan het eind van de clip.
6. **Virality Predictor** (`virality_predictor create`) op de final vóór posten: hook-sterkte en retentierisico. Prijs eerst checken; alleen gebruiken als het goedkoop is.
7. **Upscale** (`upscale_video`) alleen voor een bewezen winnaar (std = 716x1280).
8. **Marketing Studio** (`marketing_studio_video`, 12–15s, hooks/settings/avatar/product in één klik): alleen testen als de rest faalt; minder controle over Mila.

## Regels
- Elke nieuwe route eerst testen op **1 clip** van een bestaande video, nooit op een hele nieuwe video.
- Presets: Higgsfield raadt soms een preset aan ("IN THE DARK") → opnieuw indienen met `declined_preset_id`.
- Media-rollen: gpt_image_2_5 zet `image` automatisch om naar `image_references` (ok).
- Leg elke test vast in de tabel hieronder + lesson (area production/budget).

## Testlog
| Datum | Test | Kosten | Resultaat | Besluit |
|---|---|---|---|---|
| | | | | |
