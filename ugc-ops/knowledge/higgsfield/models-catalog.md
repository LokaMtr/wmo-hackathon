# Higgsfield model catalog (models_explore list, 25-09-2026)

Automatisch gegenereerd uit `models_explore action=list`. Prijzen: zie `agents/ai-video-director.md` §2.


## video

### `cinematic_studio_3_0` — Cinema Studio Video 3.0 (Higgsfield)

Most advanced cinema-grade model

- durations: {'min': 4, 'max': 15}
- media roles: image, start_image, end_image
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `resolution` (string): ['480p', '720p', '1080p', '4k'], default 720p — Output resolution (higher = more credits)
- param `genre` (string): ['auto', 'action', 'horror', 'comedy', 'noir', 'drama', 'epic'], default auto — Cinematic genre hint
- param `generate_audio` (bool), default False — Generate audio for the video.
- tags: cinematic, premium, advanced, sota, film, best-quality

### `cinematic_studio_video` — Cinema Studio Video (Higgsfield)

Solid cinematic, dramatic compositions

- durations: [5, 10]
- media roles: image, start_image, end_image
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- param `slow_motion` (bool), default False — Enable slow motion effect
- param `sound` (bool), default True — Enable sound generation
- tags: cinematic, dramatic, compositions, sound, slow-motion

### `cinematic_studio_video_v2` — Cinema Studio Video (Higgsfield)

Refined cinematic camera and color, genre control

- durations: {'min': 3, 'max': 12}
- media roles: image, start_image, end_image
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- param `genre` (string): ['auto', 'action', 'horror', 'comedy', 'western', 'suspense', 'intimate', 'spectacle'], default auto — Video genre/style
- param `mode` (string): ['pro', 'std'], default std — Quality mode: pro or standard
- param `sound` (string): ['on', 'off'], default on — Generate audio. Use 'off' for a silent video.
- param `speedramp` (string): ['auto', 'custom', 'linear', 'slowmo', 'speedup', 'impact'], default auto — Speed-ramp time effect (slowmo, speedup, etc.).
- param `multi_shots` (bool), default False — Split the video into multiple shots driven by multi_prompt.
- param `multi_shot_mode` (string): ['auto', 'custom'], default custom — 'auto' lets the model plan shots; 'custom' uses the given multi_prompt.
- param `cfg_scale` (number): 0–1, default 0.5 — Prompt adherence strength (0-1).
- param `preset_id` (string) — Existing legacy preset ID. Do not pass get_presets catalog IDs here.
- tags: cinematic, camera, color, genre, refined

### `marketing_studio_video` — Marketing Studio (Higgsfield)

One-click product ads, TikTok/Reels ready

- durations: {'min': 12, 'max': 15}
- media roles: image, start_image, end_image
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Video resolution
- param `generate_audio` (bool), default True — Generate audio for the video
- param `mode` (string)
- param `folder_id` (string) — Marketing project / folder id
- param `width` (number) — Optional explicit output width
- param `height` (number) — Optional explicit output height
- param `avatar_ids` (string_array): None–1
- param `product_ids` (string_array)
- param `assets` (string_array) — Optional backend asset ids
- param `hook_id` (string)
- param `setting_id` (string)
- param `ad_reference_id` (string)
- tags: marketing, ugc, ads, tiktok, reels, product, social-media

### `higgsfield_preset` — Higgsfield Preset (Higgsfield)

Legacy image-to-video generation for an existing preset ID or accepted preset recommendation. Browse new Viral presets with get_presets and execute them with execute_preset

- media roles: image
- aspect ratios: 16:9, 9:16, 1:1
- param `preset_id` (string) — Existing legacy preset ID from a prior selection or recommendation. Do not pass get_presets catalog IDs here.
- tags: preset, image-to-video, viral, template

### `flux_3_video` — FLUX 3 Video (Black Forest Labs)

Text-to-video, multi-frame image-to-video, and video continuation with synchronized audio

- media roles: start_image, end_image, image_references, video_references
- aspect ratios: auto, 21:9, 2:1, 16:9, 4:3, 1:1, 3:4, 9:16
- param `duration` (number): 5–20, default 5 — Duration in whole seconds (5-20).
- param `resolution` (string): ['720p', '1080p'], default 720p — Output resolution: 720p or 1080p.
- param `generate_audio` (bool), default True — Generate synchronized speech, effects, and ambience.
- tags: text-to-video, image-to-video, video-continuation, audio, start-frame, end-frame, storyboard, 1080p

### `flux_3_video_edit` — FLUX 3 Video Edit (Black Forest Labs)

Edit a video with a text prompt. Uses the first 15 seconds at most; costs 1 credit per second of the processed clip.

- media roles: video_references
- param `folder_id` (string) — Optional folder to place the generated output in.
- tags: video-to-video, video-editing

### `grok_video_v15` — Grok Video 1.5 (xAI)

Multimodal video generation from text, a start image, or image and audio references

- media roles: start_image, image_references, audio_references
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution.
- param `duration` (number): 2–15, default 5 — Duration in seconds (2-15).
- tags: audio, cinematic, text-to-video, image-to-video, reference, audio-reference, start-frame, physics, camera-motion, preview

### `video_background_remover` — Video Background Remover ()

- media roles: video_references

### `sync_so` — Sync Lipsync 3 ()

- media roles: input_video, input_audio
- param `sync_mode` (string): ['bounce', 'loop', 'cut_off', 'silence', 'remap'], default bounce
- param `folder_id` (string) — Optional folder to place the generated output in.

### `minimax_hailuo` — Minimax Hailuo (Hailuo)

Natural physics, facial emotion, multiple variants

- media roles: start_image, end_image
- param `variant` (string): ['minimax', 'minimax-fast', 'minimax-2.3', 'minimax-2.3-fast'], default minimax-2.3 — Minimax Hailuo model variant.
- param `duration` (number): [6, 10], default 6 — Duration in seconds.
- param `resolution` (string): ['512', '768', '1080'], default 768 — Output resolution. '512' is incompatible with end_image, and is not supported by the 'minimax-2.3' / 'minimax-2.3-fast' variants.
- tags: physics, emotion, facial, realistic, 1080p, natural

### `minimax_h3` — MiniMax H3 (MiniMax)

Multimodal video generation with keyframes or image/video/audio references

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `duration` (number): 4–15, default 5 — Duration in seconds (4-15).
- param `resolution` (string): ['2K'], default 2K — Output resolution.
- param `batch_size` (number): 1–4, default 1 — Number of videos to generate (1-4).
- param `folder_id` (string) — Optional folder to place the generated video in.
- tags: text-to-video, image-to-video, reference, audio-reference, video-reference, start-frame, end-frame, 2k

### `minimax_h3_max` — MiniMax H3 Max (MiniMax)

Fast text-to-video, keyframe, and multimodal-reference video generation

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `duration` (number): 5–15, default 5 — Duration in seconds (5-15).
- param `resolution` (string): ['480p', '768p'], default 768p — Output resolution.
- param `batch_size` (number): 1–4, default 1 — Number of videos to generate (1-4).
- param `folder_id` (string) — Optional folder to place the generated video in.
- tags: text-to-video, image-to-video, reference, video-reference, audio-reference, start-frame, end-frame, fast

### `wan2_6` — Wan 2.6 Video (Wan)

Open-weight, stylized, experimental creative

- media roles: image_references, video_references, audio_references
- aspect ratios: 16:9, 9:16, 1:1
- param `quality` (string): ['720p', '1080p'], default 720p — Output resolution / quality.
- param `duration` (number): [5, 10, 15], default 5 — Duration in seconds.
- tags: stylized, experimental, creative, open-weight, artistic

### `seedance1_5` — Seedance 1.5 Pro (Bytedance)

Reliable motion, improved quality

- media roles: start_image, end_image
- aspect ratios: auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9
- param `duration` (number): [4, 8, 12], default 4 — Duration of the output video in seconds.
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution of the video.
- param `generate_audio` (bool), default True — Generate native audio for the video. Set false for a silent video.
- tags: reliable, motion, quality, versatile

### `seedance_2_0` — Seedance 2.0 (Bytedance)

Reference-driven video with image/video/audio reference inputs, consistent identity, multi-SKU; optional generate_audio for native audio

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9
- param `duration` (number): 4–15, default 5 — Duration in seconds (4-15).
- param `resolution` (string): ['480p', '720p', '1080p', '4k'], default 720p — Output resolution. 4k/1080p require mode='std'; mode='fast' supports 480p/720p only.
- param `mode` (string): ['std', 'fast'], default std — 'std' = higher quality, supports 480p/720p/1080p/4k; 'fast' = cheaper/faster, supports 480p/720p only.
- param `bitrate_mode` (string): ['standard', 'high'], default standard — 'standard' = normal output bitrate; 'high' = higher bitrate output.
- param `genre` (string): ['auto', 'action', 'horror', 'comedy', 'noir', 'drama', 'epic'], default auto — Cinematic genre hint.
- param `generate_audio` (bool), default True — Generate native audio for the video. Set false for a silent video. Independent of audio_references.
- tags: reference, identity, consistent, product, multi-sku, e-commerce, audio, audio-reference, video-reference, start-frame, end-frame, 4k, high-resolution, unlim

### `seedance_2_0_mini` — Seedance 2.0 Mini (Bytedance)

Fast budget Seedance 2.0 variant with image/video/audio reference inputs and native audio

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9
- param `duration` (number): 4–15, default 5 — Duration in seconds (4-15).
- param `resolution` (string): ['480p', '720p'], default 720p — Output resolution (mini supports 480p/720p only).
- param `bitrate_mode` (string): ['standard', 'high'], default standard — 'standard' = normal output bitrate; 'high' = higher bitrate output.
- param `genre` (string): ['auto', 'action', 'horror', 'comedy', 'noir', 'drama', 'epic'], default auto — Cinematic genre hint.
- param `generate_audio` (bool), default True — Generate native audio for the video. Set false for a silent video. Independent of audio_references.
- tags: fast, budget, reference, identity, consistent, audio, audio-reference, video-reference, start-frame, end-frame, unlim

### `seedance_2_5` — Seedance 2.5 (Bytedance)

Seedance 2.5 text-to-video, multimodal omni-reference generation, video edit, and video extension

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `mode` (string): ['t2v', 'omni_reference', 'video_edit', 'video_extension'], default t2v
- param `duration` (number): 4–30, default 5 — Duration in seconds (4-30).
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- param `generate_audio` (bool), default True — Generate audio for the output video.
- param `bitrate_mode` (string): ['standard', 'high'], default standard — 'standard' = normal output bitrate; 'high' = higher bitrate output.
- param `extension_mode` (string): ['backward', 'forward'] — Extension direction; required for mode 'video_extension' and not allowed otherwise.
- tags: text-to-video, reference, identity, audio-reference, video-reference, video-edit, video-extension, 480p, 720p, 1080p

### `ad_multiplier` — Ad Multiplier (Higgsfield)

Ad Multiplier video generation powered by Seedance 2.5

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `mode` (string): ['t2v', 'omni_reference', 'video_edit', 'video_extension'], default t2v
- param `duration` (number): 4–30, default 5 — Duration in seconds (4-30).
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- param `generate_audio` (bool), default True — Generate audio for the output video.
- param `bitrate_mode` (string): ['standard', 'high'], default standard — 'standard' = normal output bitrate; 'high' = higher bitrate output.
- param `extension_mode` (string): ['backward', 'forward'] — Extension direction; required for mode 'video_extension' and not allowed otherwise.
- tags: text-to-video, reference, identity, audio-reference, video-reference, video-edit, video-extension, 480p, 720p, 1080p

### `topaz_video` — Topaz ()

- media roles: video_references
- aspect ratios: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16
- param `resolution` (string): ['1080p', '2160p'], default 1080p — Target output resolution.
- param `enhancement` (string) — Enhancement settings (omit to use Topaz defaults).
- param `frame_interpolation` (string) — Frame interpolation (omit to disable).

### `bytedance_video_upscale` — Bytedance Video Upscale ()

- media roles: video_references
- param `fps` (number): 24–60, default 24 — Output frame rate in frames per second (24-60).
- param `resolution` (string): ['1080p', '2k', '4k'], default 2k — Target output resolution.
- param `preset` (string): ['common', 'aigc', 'short_series', 'ugc', 'old_film'], default common — Content-type preset that tunes the upscaler for the source material.
- param `model_version` (string): ['standard', 'pro'], default standard — Upscaler model tier: 'standard' or higher-quality 'pro'.

### `video_upscale` — Video Upscale ()

- media roles: input_video
- param `duration` (number): 0–None — Duration of the source video in seconds. Optional; derived from the video metadata when omitted.
- param `folder_id` (string) — Optional folder to place the generated output in.

### `video_deflicker` — Video Deflicker ()

- media roles: input_video
- param `duration` (number): 0–None — Optional duration of the output video in seconds.
- param `folder_id` (string) — Optional folder to place the generated output in.

### `clipify` — Clipify (Higgsfield)

Turn one YouTube video into ready-to-share clips with subtitles

- param `urls` (string_array) — YouTube video URLs. Provide exactly one URL; submit one Clipify job per source video.
- param `clips_num` (number): 1–20, default 10 — How many clips to create.
- param `clip_aspect` (string): ['9:16', '1:1', '16:9'], default 9:16 — Clip aspect ratio.
- param `subtitle_highlight_hex` (string), default #FFE84D — Subtitle highlight color as #RRGGBB.
- param `subtitle_position` (string): ['bottom', 'center', 'top'], default bottom — Subtitle vertical position.
- param `subtitle_font` (string): ['notosans', 'notoserif', 'notosansdisplay', 'ibmplexsans', 'mplusrounded1c', 'bebasneue', 'archivoblack', 'unbounded', 'inter', 'montserrat', 'bangers', 'permanentmarker', 'playfairdisplay', 'caveat'], default notosans — Subtitle font.
- param `subtitle_case` (string): ['upper', 'lower', 'as-is'], default as-is — Subtitle text case.
- param `track_face_crop` (bool), default True — Track faces when cropping clips.
- param `max_height` (number): 144–2160, default 1080 — Maximum source processing height.
- param `segment_seconds` (number): 2–60, default 10 — Segment duration in seconds.
- tags: youtube, clips, shorts, reels, subtitles, personal-clipper

### `kling2_6` — Kling 2.6 Video (Kling)

Cinematic motion, advanced physics

- media roles: start_image
- aspect ratios: 16:9, 9:16, 1:1
- param `duration` (number): [5, 10], default 5 — Video duration in seconds.
- param `sound` (bool), default True — Generate the video with native audio.
- tags: cinematic, motion, physics, advanced, audio

### `kling3_0` — Kling v3.0 (Kling)

Multi-shot, audio sync, motion transfer

- media roles: start_image, end_image
- aspect ratios: 16:9, 9:16, 1:1
- param `duration` (number): 3–15, default 5 — Duration in seconds (3-15).
- param `mode` (string): ['std', 'pro', '4k'], default std — Generation mode: 'std' (standard), 'pro' (higher quality), or '4k' (4K resolution).
- param `sound` (string): ['on', 'off'], default on — Generate audio. Use 'off' for silent video and lower credits.
- tags: multi-shot, audio, motion-transfer, cinematic, advanced, unlim

### `kling3_0_turbo` — Kling 3.0 Turbo (Kling)

Fast text-to-video and single start-frame animation

- media roles: start_image
- aspect ratios: 16:9, 9:16, 1:1
- param `resolution` (string): ['720p', '1080p'], default 720p — Output resolution.
- param `duration` (number): 3–15, default 5 — Duration in seconds (3-15).
- tags: fast, turbo, text-to-video, image-to-video, start-frame, budget, kling

### `kling_video_edit` — Kling 3.0 Omni Edit (Kling)

Edit a source video with text instructions and optional reference images

- media roles: video_references, image_references
- param `mode` (string): ['std', 'pro', '4k'], default pro — Output quality: Standard, Pro, or 4K.
- tags: video-edit, reference, 4k

### `happy_horse_video` — Happy Horse Video (Happy Horse)

Text-to-video and single start-frame animation

- media roles: start_image
- aspect ratios: 16:9, 9:16, 1:1, 4:3, 3:4
- param `resolution` (string): ['720p', '1080p'], default 720p — Output resolution.
- param `duration` (number): 3–15, default 5 — Duration in seconds (3-15).
- tags: text-to-video, image-to-video, start-frame, happy-horse

### `hf_mult_motion_control` — Genjutsu (Higgsfield)

Transfer motion from a reference video to subjects in reference images

- media roles: image_references, video_references
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- tags: motion-control, image-to-video, video-reference, 480p, 720p, 1080p

### `hf_mult_replace_object` — Genjutsu (Higgsfield)

Replace objects in a source video using reference images

- media roles: image_references, video_references
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- tags: video-edit, object-replacement, reference, 480p, 720p, 1080p

### `grok_video` — Grok Video (xAI)

Text and image-to-video, audio support

- media roles: start_image
- aspect ratios: 16:9, 9:16, 1:1
- param `duration` (number): 1–15, default 5 — Duration in seconds (1-15).
- tags: audio, versatile, text-to-video, image-to-video

### `gemini_omni` — Gemini Omni Flash (Google)

Reference-driven video with native audio and image/video reference inputs

- media roles: image_references, video_references
- aspect ratios: 16:9, 9:16
- param `duration` (number): 4–10, default 8 — Duration in seconds (4-10).
- param `resolution` (string): ['720p'], default 720p — Output resolution.
- tags: audio, reference, image-to-video, video-to-video, text-to-video, high-resolution, unlim

### `gemini_omni_flash_1_1` — Gemini Omni Flash 1.1 (Google)

Gemini Omni Flash 1.1 text-to-video, keyframe animation, multimodal reference generation, and video editing with native audio

- media roles: start_image, end_image, image_references, video_references
- aspect ratios: 16:9, 9:16
- param `mode` (string): ['text-to-video', 'image-to-video', 'reference-to-video', 'edit'] — Generation mode.
- param `duration` (number): 3–10, default 8 — Output duration in seconds (3-10). Ignored in edit mode, which uses the source video duration capped at 30 seconds.
- param `resolution` (string): ['360p', '720p', '1080p', '4k'], default 720p — Output resolution: 360p, 720p, 1080p, or 4K.
- tags: audio, text-to-video, image-to-video, reference, video-edit, 360p, 720p, 1080p, 4k

### `wan2_7` — Wan 2.7 (Wan)

Synchronized audio, character-consistent video

- media roles: start_image, end_image, audio_references
- aspect ratios: 16:9, 9:16, 1:1, 4:3, 3:4
- param `duration` (number): 2–15, default 5 — Duration in seconds (2-15).
- param `resolution` (string): ['720p', '1080p'], default 720p — Output resolution.
- tags: audio, character, consistent, sync, sound, unlim

### `wan3_0` — Wan 3.0 (Wan)

Wan 3.0 text-to-video, first/last frame video, and multimodal reference-to-video with native audio

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 16:9, 9:16, 1:1, 4:3, 3:4
- param `duration` (number): -1–30, default 5 — Duration in seconds (2-30), or -1 to let the model choose the length from the prompt and media. Smart duration is billed as 10 seconds.
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- param `generate_audio` (bool), default True — Generate a native audio track for the output video.
- param `enable_thinking` (bool), default False — Let the model reason about the prompt before generating (slower, better prompt adherence).
- tags: text-to-video, reference, identity, audio-reference, video-reference, first-last-frame, sound, thinking, 480p, 720p, 1080p

### `wan3_0_prime` — Wan 3.0 Prime (Wan)

Wan 3.0 Prime text-to-video, first/last frame video, and multimodal reference-to-video with native audio

- media roles: start_image, end_image, image_references, video_references, audio_references
- aspect ratios: auto, 16:9, 9:16, 1:1, 4:3, 3:4
- param `duration` (number): -1–30, default 5 — Duration in seconds (2-30), or -1 to let the model choose the length from the prompt and media. Smart duration is billed as 10 seconds.
- param `resolution` (string): ['480p', '720p', '1080p'], default 720p — Output resolution: 480p, 720p, or 1080p.
- param `generate_audio` (bool), default True — Generate a native audio track for the output video.
- param `enable_thinking` (bool), default False — Let the model reason about the prompt before generating (slower, better prompt adherence).
- tags: text-to-video, reference, identity, audio-reference, video-reference, first-last-frame, sound, thinking, 480p, 720p, 1080p, prime

### `veo3` — Google Veo 3 (Google)

Reliable cinematic, broad creative range

- media roles: start_image
- aspect ratios: 16:9, 9:16
- param `variant` (string): ['veo-3-preview', 'veo-3-fast'], default veo-3-fast — Veo 3 variant: 'veo-3-preview' = best quality; 'veo-3-fast' = faster generation.
- tags: cinematic, reliable, creative, audio, image-to-video

### `veo3_1` — Google Veo 3.1 (Google)

Ultra-realistic, top-tier cinematic quality

- media roles: start_image
- aspect ratios: 16:9, 9:16
- param `duration` (number): [4, 6, 8], default 8 — Duration of the output video in seconds.
- param `quality` (string): ['basic', 'high', 'ultra'], default basic — Output quality tier.
- param `variant` (string): ['veo-3-1-preview', 'veo-3-1-fast'], default veo-3-1-fast — Veo 3.1 variant: 'veo-3-1-preview' = best quality, 'veo-3-1-fast' = faster generation.
- tags: ultra-realistic, cinematic, top-tier, quality, audio

### `veo3_1_lite` — Google Veo 3.1 Lite (Google)

Fast, affordable, budget batch clips

- media roles: start_image, end_image
- aspect ratios: 16:9, 9:16, auto
- param `duration` (number): [4, 6, 8], default 8 — Duration of the output video in seconds.
- param `generate_audio` (bool), default False — Generate native audio for the video.
- tags: fast, budget, affordable, batch, lite

### `sam_3_video` — Remove Background ()

- media roles: video_references
- param `apply_mask` (bool), default True — Apply the segmentation mask to the output video.
- param `frames_count` (number): 1–None — Number of frames to process. Defaults to the full clip when omitted.


## image

### `soul_2` — Higgsfield Soul 2.0 (Higgsfield)

Realistic UGC, fashion editorial and character generation

- media roles: image
- aspect ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3
- param `quality` (string): ['1.5k', '2k'], default 2k — Output quality tier shown as 1.5k or 2k
- param `soul_id` (string) — Soul-ID for personalized generation. Get one from soul_list.
- tags: ugc, fashion, editorial, realistic, character, character-generation, soul, portrait, v2, unlim

### `soul_cinematic` — Soul Cinema (Higgsfield)

Cinema-grade stills and concept art

- media roles: image
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9
- param `quality` (string): ['1.5k', '2k'], default 2k — Output quality tier shown as 1.5k or 2k
- param `soul_id` (string) — Soul Cinema Character ID for personalized cinematic generation.
- tags: cinematic, dramatic, concept-art, lighting, soul, film

### `gpt_image_2` — GPT Image 2 (OpenAI)

Next-gen GPT Image model with 1k/2k/4k resolution and low/medium/high quality tiers

- media roles: image
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 21:9, 9:16, 3:2, 2:3
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution
- param `quality` (string): ['low', 'medium', 'high'], default low — Image quality
- tags: text-rendering, editing, typography, photorealistic, 4k, high-resolution, unlim

### `cinematic_studio_2_5` — Cinema Studio Image 2.5 (Higgsfield)

Cinematic stills, up to 4K resolution

- media roles: image
- aspect ratios: 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 16:9, 9:16, 21:9
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution
- tags: cinematic, 4k, high-resolution, dramatic, film

### `marketing_studio_image` — Marketing Studio Image (Higgsfield)

One-click product image ads for social campaigns

- media roles: image
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution
- tags: marketing, ads, product, social-media, creative

### `ms_image` — DTC Ads (Higgsfield)

DTC ad image generation with brand-kit-aware prompts, avatars, products, and curated ad formats

- media roles: image
- aspect ratios: 1:1, 3:2, 2:3, 16:9, 9:16, 4:3, 3:4, 21:9, 27:16, 16:27, 9:8, 8:9, 4:9, 9:4, auto
- param `style_id` (string)
- param `brand_kit_id` (string)
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution.
- param `quality` (string): ['low', 'medium', 'high'], default low — Output quality. Affects cost.
- param `batch_size` (number): 1–20, default 1 — Number of images generated per job (1-20). Cost scales linearly. Distinct from `count`, which controls how many jobs are submitted in parallel.
- param `product_ids` (string_array): None–4 — Up to 4 Marketing Studio product ids. List products via `show_marketing_studio` with `type='product'`. Server pre-resolves their media inputs and runs IP check before queueing.
- param `folder_id` (string) — Optional folder placement.
- tags: marketing, ads, product, brand-kit, ad-format, avatar, dtc

### `image_auto` — Auto (Higgsfield)

Auto-selects the best image model based on prompt intent

- media roles: image
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- tags: auto, smart, routing, editing, generation

### `autosprite` — AutoSprite Animation (Higgsfield)

Animate a character image into a game-ready sprite sheet PNG with optional atlas and audio metadata

- media roles: image
- param `kind` (string): ['idle', 'walk', 'run', 'attack', 'jump', 'custom', 'iso_idle_up', 'iso_idle_northeast', 'iso_idle_right', 'iso_idle_southeast', 'iso_idle_down', 'iso_walk_up', 'iso_walk_northeast', 'iso_walk_right', 'iso_walk_southeast', 'iso_walk_down', 'iso_run_up', 'iso_run_northeast', 'iso_run_right', 'iso_run_southeast', 'iso_run_down', 'iso_jump_up', 'iso_jump_northeast', 'iso_jump_right', 'iso_jump_southeast', 'iso_jump_down'], default idle — Animation preset. Use 'custom' with prompt and name for a custom animation.
- param `name` (string) — Custom animation name. Required only when kind is 'custom'.
- param `video_tier` (string): ['turbo', 'pro', 'max'], default turbo — Generation quality/cost tier. 'turbo' is fastest and cheapest; 'max' is highest cost.
- param `frame_count` (number): 2–64, default 25 — Number of frames in the sprite sheet.
- param `frame_size` (number): 32–512, default 256 — Frame width/height in pixels.
- param `remove_bg` (string): ['default', 'ultra'], default default — Background removal mode.
- param `with_sound` (bool), default False — Generate sound effects when available. Adds cost.
- param `is_humanoid` (bool), default True — Whether the source character is humanoid.
- tags: sprite, spritesheet, animation, game, character, pixel, atlas, image-to-animation

### `soul_cast` — Soul Cast (Higgsfield)

Consistent cinematic character identity

- aspect ratios: 16:9
- param `budget` (number), default 50 — Generation budget (10-500)
- tags: character, identity, consistent, cinematic, persona

### `soul_location` — Soul Location (Higgsfield)

Environment and location generation

- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9, 9:21
- tags: environment, location, background, scene, landscape

### `soul_v2` — Higgsfield Soul 2.0 (Higgsfield)

Realistic UGC, fashion editorial and character generation

- media roles: image
- aspect ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3
- param `quality` (string): ['1.5k', '2k'], default 2k — Output quality tier shown as 1.5k or 2k
- param `soul_id` (string) — Soul-ID for personalized generation. Get one from soul_list.
- tags: ugc, fashion, editorial, realistic, character, character-generation, soul, portrait, v2, unlim

### `z_image` — Z Image (Tongyi-MAI)

Super fast, stylized text-to-image

- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- tags: fast, budget, stylized, quick

### `nano_banana` — Nano Banana (Google)

Realistic images, budget-friendly

- media roles: image_references
- aspect ratios: 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- tags: budget, realistic, affordable, text-to-image, image-to-image, unlim

### `nano_banana_pro` — Nano Banana Pro (Google)

Ultimate quality, text and diagrams

- media roles: image_references
- aspect ratios: 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- param `resolution` (string): ['1k', '2k', '4k'], default 2k — Output resolution.
- tags: quality, text-rendering, diagrams, photorealistic, versatile, 4k, text-to-image, image-to-image, unlim

### `nano_banana_2_shots` — Nano Banana Pro ()

- media roles: image_references
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9

### `nano_banana_2` — Nano Banana 2 (Google)

Fast, next-gen high-quality images

- media roles: image_references, mask
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution.
- param `is_inpaint` (bool), default False — Whether to restrict the edit to the supplied mask.
- tags: fast, high-quality, photorealistic, versatile, 4k, text-to-image, image-to-image, unlim

### `nano_banana_2_lite` — Nano Banana 2 Lite (Google)

Lite next-gen high-quality images

- media roles: image_references, mask
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- param `resolution` (string): ['1k'], default 1k — Output resolution.
- param `thinking` (string): ['MINIMAL', 'HIGH'], default HIGH — Depth of internal reasoning before generation.
- param `is_inpaint` (bool), default False — Whether to restrict the edit to the supplied mask.
- tags: fast, high-quality, photorealistic, versatile, text-to-image, image-to-image

### `seedream_v4_5` — Seedream 4.5 (Bytedance)

4K output, precise control, transformations

- media roles: image_references
- aspect ratios: 1:1, 4:3, 16:9, 3:2, 21:9, 3:4, 9:16, 2:3
- param `quality` (string): ['basic', 'high'], default basic — Output quality tier. 'basic' renders up to 4K; 'high' renders up to ~6K.
- tags: 4k, high-resolution, precise, transformations, editing, control, unlim

### `flux_2` — FLUX.2 (Black Forest Labs)

Multiple model variants (pro, flex, max), precise prompt adherence

- media roles: image_references
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- param `resolution` (string): ['1k', '2k'], default 1k — Output resolution.
- param `variant` (string): ['pro', 'flex', 'max'], default pro — FLUX.2 model variant.
- tags: precise, prompt-adherence, creative, versatile, pro, quality, unlim

### `flux_2_pro_outpaint` — FLUX.2 Pro Outpaint (Black Forest Labs)

Expands an image beyond its borders with FLUX.2 [pro]: per-side pixel expansion painted as a coherent, seamless scene extension. Negative values crop that side instead; an all-crop request is served locally for free without the model.

- media roles: image_references
- param `expand_top` (number): -8192–2048, default 0 — Pixels to expand at the top of the image; a negative value crops the top by that many pixels instead.
- param `expand_bottom` (number): -8192–2048, default 0 — Pixels to expand at the bottom of the image; a negative value crops the bottom by that many pixels instead.
- param `expand_left` (number): -8192–2048, default 0 — Pixels to expand on the left of the image; a negative value crops the left by that many pixels instead.
- param `expand_right` (number): -8192–2048, default 0 — Pixels to expand on the right of the image; a negative value crops the right by that many pixels instead.
- param `folder_id` (string) — Optional folder placement for the generated image.
- tags: outpaint, image-edit, photorealism, quality

### `flux_kontext` — Flux Kontext (Black Forest Labs)

Context-aware editing and style transfer

- media roles: image_references
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16
- tags: editing, style-transfer, context-aware, typography, remix

### `kling_omni_image` — Kling O1 Image (Kling)

Versatile photorealistic generation

- media roles: image_references
- aspect ratios: 1:1, auto, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9
- param `resolution` (string): ['1k', '2k'], default 1k — Output resolution.
- tags: photorealistic, versatile, wide-aspect-ratio, realistic, unlim

### `openai_hazel` — OpenAI Hazel (OpenAI)

Powerful editing, best text rendering

- media roles: image_references
- aspect ratios: 1:1, 3:2, 2:3, auto
- param `quality` (string): ['low', 'medium', 'high'], default medium — Rendering quality / detail level.
- tags: text-rendering, editing, typography, logos, diagram, infographic

### `gpt_image_2_5` — GPT Image 2.5 (OpenAI)

GPT Image 2.5 generation and editing with Flare and Sunburst variants

- media roles: image_references
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, 27:16, 16:27, 9:8, 8:9, 4:5, 5:4
- param `variant` (string): ['flare', 'sunburst'], default flare — Model variant.
- param `quality` (string): ['low', 'medium', 'high', 'xhigh', 'max'], default low — Rendering quality.
- param `resolution` (string): ['1k', '2k', '4k'], default 1k — Output resolution.
- param `background` (string): ['auto', 'opaque', 'transparent'] — Background handling. Omit to keep the model default.
- tags: image-generation, editing, reference-images, 4k, text-rendering

### `seedream_v5_lite` — Seedream 5.0 Lite (Bytedance)

Visual reasoning, instruction-based editing

- media roles: image_references
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16, 21:9
- param `quality` (string): ['basic', 'high'], default basic — Output quality tier.
- tags: editing, instruction, reasoning, versatile, smart, unlim

### `seedream_5_0_flash` — Seedream 5.0 Flash (Bytedance)

Fast image generation and instruction-based editing, up to 2K

- media roles: image_references
- aspect ratios: auto, 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9
- param `resolution` (string): ['1k', '1.5k', '2k'], default 2k — Output resolution tier.
- param `width` (number): 1–None — Optional width stored in generation metadata; not sent to the provider.
- param `height` (number): 1–None — Optional height stored in generation metadata; not sent to the provider.
- tags: editing, instruction, flash, 2k

### `seedream_v5_pro` — Seedream 5.0 Pro (Bytedance)

Pro-tier visual reasoning, instruction-based editing, up to 2K

- media roles: image_references
- aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9
- param `resolution` (string): ['1k', '1.5k', '2k'], default 2k — Output resolution tier.
- param `width` (number): 1–None — Optional output width stored with the generation.
- param `height` (number): 1–None — Optional output height stored with the generation.
- param `remove_bg` (bool), default False — Remove the background from the generated image.
- param `is_inpaint` (bool), default False — Treat the request as an inpaint/edit of the reference image(s) instead of a fresh generation.
- tags: editing, instruction, reasoning, pro, 2k, unlim

### `grok_image` — Grok Image (xAI)

Expressive, high-contrast generation and editing

- media roles: image_references
- aspect ratios: 1:1, auto, 1:2, 2:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16
- param `resolution` (string): ['1k', '2k'], default 1k — Output resolution.
- param `mode` (string): ['std', 'quality'], default std — Generation mode: standard or higher-fidelity quality.
- tags: expressive, high-contrast, editing, creative, bold

### `grok_image_2_0` — Grok Image 2.0 (xAI)

Next-generation image creation and editing from xAI

- media roles: image_references
- aspect ratios: 1:1, auto, 1:2, 2:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16
- param `resolution` (string): ['1k', '2k'], default 1k — Output resolution.
- param `quality` (string): ['low', 'medium'], default medium — Generation quality level.
- tags: expressive, high-contrast, editing, creative, bold

### `recraft_v4_1` — Recraft V4.1 (Recraft)

V4.1 image generation with selectable model_type for standard exploration, vector logos/icons, utility product shots/mockups, and utility_vector brand assets

- aspect ratios: 1:1, 3:4, 4:3, 4:5, 5:4, 3:2, 2:3, 16:9, 9:16
- param `resolution` (string): ['1k', '2k'], default 1k — Output resolution: 1k for everyday work, 2k for larger assets.
- param `model_type` (string): ['standard', 'vector', 'utility', 'utility_vector'], default standard
- param `colors` (string_array) — Optional color palette, up to 10 colors. Each color must be #RRGGBB: six hex digits with leading # and no alpha channel.
- param `background_color` (string) — Optional #RRGGBB background color with no alpha channel, or null. Use for controlled flat backgrounds, brand swatches, product mockups, icons, and vector-style work.
- tags: photorealistic, illustration, typography, logos, icons, vector, utility, product, mockups, brand, palette, text-to-image

### `image_background_remover` — Image Background Remover ()

- media roles: image_references

### `outpaint` — Outpaint ()

- media roles: image_references
- aspect ratios: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- param `folder_id` (string) — Optional folder placement for the generated image.

### `topaz_image` — Topaz ()

- media roles: image_references
- param `output_width` (number): 1–None — Target output width in pixels.
- param `output_height` (number): 1–None — Target output height in pixels.
- param `face_enhancement` (bool), default False — Enable dedicated face enhancement.
- param `face_enhancement_creativity` (number): 0–1, default 0 — Face enhancement creativity (0-1). Applies when face_enhancement is enabled.
- param `face_enhancement_strength` (number): 0–1, default 0 — Face enhancement strength (0-1). Applies when face_enhancement is enabled.
- param `variant` (string): ['Standard V2', 'Low Resolution V2', 'CGI', 'High Fidelity V2', 'Text Refine'], default Standard V2 — Topaz enhancement model.
- param `sharpen` (number): 0–1, default 0 — Sharpening amount (0-1).
- param `denoise` (number): 0–1, default 0 — Denoising amount (0-1).
- param `folder_id` (string) — Destination folder id.

### `topaz_image_generative` — Topaz ()

- media roles: image_references
- param `output_width` (number): 1–None — Target output width in pixels.
- param `output_height` (number): 1–None — Target output height in pixels.
- param `variant` (string): ['Standard MAX', 'Redefine', 'Recovery', 'Recovery V2'], default Redefine — Topaz generative upscale model variant.
- param `autoprompt` (bool), default True — Automatically generate a guiding prompt from the image.
- param `creativity` (number): 1–6, default 1 — Creativity level (1-6); higher adds more detail.
- param `texture` (number): 1–5, default 1 — Texture strength (1-5).
- param `sharpen` (number): 0–1, default 0 — Sharpening amount (0-1).
- param `denoise` (number): 0–1, default 0 — Denoising amount (0-1).
- param `face_enhancement` (bool), default False — Enable face enhancement.
- param `face_enhancement_creativity` (number): 0–1, default 0 — Face enhancement creativity (0-1).
- param `face_enhancement_strength` (number): 0–1, default 0 — Face enhancement strength (0-1).

### `bytedance_image_upscale` — Bytedance Image Upscale ()

- media roles: image_references
- param `resolution` (string): ['2k', '4k'], default 4k — Target upscale resolution.
- param `remove_bg` (bool), default False — Remove the background from the upscaled image.
