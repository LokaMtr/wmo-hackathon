# Higgsfield-expert → opgegaan in de AI-video director

**Deze rol valt nu onder `agents/ai-video-director.md`** (model- en prijsroutering, prompts, realisme, stem, montage, compliance, experimenten). Dit bestand bevat alleen nog de snelle prijstabel en de **testlog**. Werk beide hier bij na elke test.

## Altijd eerst (gratis)
- `models_explore action=get` voor parameters en limieten; `action=recommend` bij iets nieuws.
- `generate_video/generate_image … get_cost:true` vóór elke generatie (kost niets).
- `balance` voor en na.

## Prijzen (gemeten 25-09-2026, 9:16; volledige tabel: ai-video-director.md §2)
| Model | Instelling | Credits | Per seconde | Notities |
|---|---|---|---|---|
| gpt_image_2_5 | low 1k | 0,25 | - | master, frames, packshot (medium 0,5 · high 2k 2,75) |
| seedream_v5_lite / v5_pro | de-slop | 1,0 / 2,5 | - | realisme-pass op een beeld |
| soul_2 | 2k | 0,12 | - | persona-beelden |
| **kling3_0** | **std, sound on** | 8,75 / 5s · 17,5 / 10s · 26,25 / 15s | **1,75** | **standaard voor praatclips**; `end_image` en `<<<element>>>` zonder meerprijs |
| kling3_0 | std, sound off | 12,5 / 10s | 1,25 | stille B-roll |
| kling3_0 | pro, sound on | 10 / 5s · 20 / 10s | 2,0 | alleen voor de hook, als std faalt |
| seedance_2_0_mini | 720p / 480p | 5 / 5s · 5 / 10s (480p) | 1,0 / 0,5 | **alleen B-roll zonder spraak** (stem/lipsync verloor van Kling) |
| wan2_7 | 720p / 1080p, 10s | 15 / 25 | 1,5 / 2,5 | audio_references; niet getest |
| seedance_2_0 | fast 720p / std 720p / std 1080p, 10s | 25 / 45 / 90 | 2,5 / 4,5 / 9 | te duur |
| seedance_2_5 | omni 480p / 720p / 1080p, 10s | 30 / 70 / 120 | 3 / 7 / 12 | Higgsfield-UGC-motor; te duur |
| minimax_h3 | 2K, 10s | 20 | 2,0 | niet getest |
| veo3_1_lite | 8s, audio | 12 | 1,5 | Veo-lippen zwak volgens tests |
| marketing_studio_video | 720p 15s | 75 | 5,0 | weinig controle |

## Regels
- Elke nieuwe route eerst op **1 clip** van een bestaande video.
- Preset aangeraden → opnieuw met `declined_preset_id`.
- Gpt_image_2_5 zet `image` om naar `image_references` (ok). Seedream accepteert geen job_id: eerst `media_import_url`.

## Testlog
| Datum | Test | Kosten | Resultaat | Besluit |
|---|---|---|---|---|
| 2026-09-25 | Seedance 2.0 Mini vs Kling std, clip 1 eyemask-2 (6s, zelfde startbeeld+prompt) | 6 vs 10,5 | Beeld even stabiel, handen/product ok; Loka: Kling duidelijk beter op stem en lipsync | **Kling blijft standaard**; Mini alleen voor B-roll zonder spraak |
