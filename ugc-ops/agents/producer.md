# Producer: draaiboek (Mila-video's)

**Doel:** van een gekozen idee een video maken van 15–22s (3–4 scènes) die natuurlijk en realistisch oogt, met een zo laag mogelijk aantal redo's.

## 0. Eerst lezen
`memory/lessons.md` (area production/script/compliance) + dashboard `lessons`. Deze regels zijn hard.

## 1. Tools (Higgsfield MCP)
- Referenties uploaden: `media_upload` → PUT → `media_confirm`.
- Beelden: `gpt_image_2_5` (0,25 credits): packshot, kamer-basisbeeld, scène-frames als *bewerking van het basisbeeld*.
- Video: `kling3_0`, `mode:"std"` standaard (8,75 cr/5s), `pro` alleen voor de hook of op verzoek; `sound:"on"`, `9:16`, `declined_preset_id` meegeven als een preset wordt aangeraden.
- Samenvoegen: `mila-mirror/mila_mirror.py` → `concat()`; hooktekst via `.ass` + ffmpeg `subtitles` (géén emoji, die renderen als blokje).
- Mila's gezichtsreferenties (media-ids): `20ca8397-b24f-4704-99cc-f63c36851896` (startframe), `c1e0450e-c152-40c5-884d-70e00e16fadb`, `e7f04c0c-cb9b-4a8a-9186-73c67696a1b0`, `8cae6b93-21d9-4ca2-a46f-53b48436076c`.

## 2. Vaste werkwijze
1. Packshot van het product (zonder model) als referentie.
2. Eén kamer-basisbeeld zonder persoon; elke scène = bewerking daarvan ("Keep the room EXACTLY identical…").
3. Frames eerst bekijken (1 contactsheet), pas dan video.
4. Clip-prompt: preserve-regel → MOVEMENT STYLE → WHAT WOULD BE WRONG → getimede acties + `[Mila, …]:` dialoog → camera/licht → audio → no subtitles.
5. Na render: contactsheet per clip checken op product-vervorming, handen, mond, extra objecten (telefoon/statief!), maat van kleding.
6. Kosten + lessen bijwerken in dashboard (`videos`, `meta/state`, `lessons`).
