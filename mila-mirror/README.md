# Mila – "The Mirror" (Higgsfield API)

## Eenmalig instellen (Mac)

1. **API-key maken** op https://console.higgsfield.ai en saldo toevoegen via https://open.higgsfield.ai/billing.
   Let op: de API heeft eigen saldo, los van je higgsfield.ai-account.
2. Open Terminal in deze map en run:
   ```
   pip3 install -r requirements.txt
   export HF_KEY="jouw-api-key-id:jouw-api-key-secret"
   ```
3. Zet de foto's klaar:
   - `refs/mila/` : 2 à 3 scherpe foto's van Mila (gezicht frontaal + liefst 1 volledige foto)
   - `refs/product/` : de productfoto's van de shorts (originelen, geen screenshots als het kan)

## Gebruik

```
python3 mila_mirror.py estimate                       # kosten checken, genereert niks
python3 mila_mirror.py frame                          # 2 startframes in out/
python3 mila_mirror.py video --frame out/frame0_1.png # alle clips + out/final.mp4
```

- Eén clip slecht? `python3 mila_mirror.py video --frame out/frame0_1.png --redo 3` maakt clip 3 en alles erna opnieuw. Clips die goed zijn blijven staan.
- Goedkoper testen: voeg `--tier std` toe (standaard is `pro`, beste kwaliteit).
- NSFW-blokkade door de productfoto's met model? Probeer `--moderation low` of gebruik productfoto's zonder model.
- `export HF_KEY=...` geldt per Terminal-venster. Nieuw venster = opnieuw zetten.

## Hoe het werkt

1. Startframe via Marketing Studio Image (hoge kwaliteit, 9:16, 2K) met Mila's foto's als referentie.
2. Clip 1 met Kling 3.0 image-to-video, met stem en lip-sync.
3. Laatste frame van elke clip wordt het startpunt van de volgende. Waar het product in beeld komt, wordt dat frame eerst bewerkt met Mila en de productfoto's als referentie, zodat het product overal hetzelfde blijft.
4. Alles wordt samengevoegd tot `out/final.mp4` (1080x1920, 30fps).

Tekst op scherm en het AI-label zet je er zelf bij in CapCut of TikTok.
