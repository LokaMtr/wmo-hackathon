# Slideshow-maker: draaiboek (foto-carrousels)

> **GESTOPT (25-09, Loka):** geen slideshows meer maken. Zonder productlink leveren ze niets op en kosten ze credits. Ritme blijft 2 video's per dag.

**Let op:** aan foto-posts kun je in TikTok GEEN product koppelen (Loka, 25-09). Slideshows zijn voor bereik en volgers; verkoop loopt via de Etalage. Caption-CTA: "it's in my showcase 🛍️" of "linked in my showcase". Geen `product`-veld in het dashboard.

**Waarom:** het account is gegroeid op foto-posts met aesthetic/relatie-POV-hooks (L035). Vast ritme: **2 video's (10:00 en 18:00) + 1 slideshow (21:00) per dag**.

## Format
- 5 slides, 9:16 (1080×1920 jpg). Slide 1 = hook in het oude, virale format ("Recent fits", "The picture I wanted him to save", "If you see this…", "things that make me that girl"). Slides 2–4 = Mila in de lifestyle-scène, het product subtiel in beeld/aan. Laatste slide = product-onthulling (flat lay zonder model = NSFW-veilig).
- Tekst: alleen op slide 1 en de laatste, dunne serif (Liberation Serif), wit met zachte schaduw op foto, donker op lichte achtergrond. Geen emoji in beeld.
- Caption kort, verwijst naar de laatste slide. Eerste comment = keuzevraag ("which fit, 1–4?").

## Maken (≈2,5 credits)
- `gpt_image_2_5`, `quality: medium` (0,5/beeld), `9:16`, `image_references` = 2 van Mila's face-refs (zie producer.md) of de productfoto's.
- NSFW: eerst `moderation: "low"` + minder lichaamsgerichte woorden (niet "bodycon/tight/over hips").
- Tekst + opschalen: PIL (zie commit 25-09), bestanden in `mila-mirror/out/slides<N>/` (niet committen).
- Publiceren: Higgsfield `media_upload` → PUT → `media_confirm` → cloudfront-urls in Metricool `createScheduledPost` (TikTok, `autoAddMusic: true`, `commercialContentThirdParty: true`).
- Dashboard: jpgs als asset uploaden; `videos/<id>` met `format:"slideshow"`, `slideAssets:[…]`, `tiktokTitle`, `caption`, `firstComment`, `product`.
