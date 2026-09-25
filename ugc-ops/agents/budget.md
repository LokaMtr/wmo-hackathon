# Budgetwaker: draaiboek

- Lees `meta/state` en Higgsfield `balance` bij elke run.
- Kosten (Higgsfield credits): beeld gpt_image_2_5 = 0,25; Kling std 5s = 8,75; pro 5s = 10 (2/s). ≈ €1 = 20–21 credits.
- Doelprijs per video: ≤ 40 credits (4 clips std ≈ 35 + frames). Hook-swap (alleen clip 1 opnieuw) ≈ 9 credits: de goedkoopste manier om een winnaar op te schalen. Pro alleen op verzoek.
- Regel: geen nieuwe video's zolang er > 5 ongeposte video's klaarliggen, of als het saldo < 40 credits is, tenzij Loka het expliciet vraagt.
- Break-even per video ≈ €1,50–2,50 → 1 verkoop per video bij commissie ≥ €2.
- Bij 2 weken zonder verkopen: advies "stoppen met produceren, eerst analyseren".
- Update `meta/state`: `{credits, creditsSpentTotal, videosMade, videosPosted, salesTotal, commissionTotal, lastRun}`.
