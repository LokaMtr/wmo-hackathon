#!/usr/bin/env python3
"""
Mila "The Mirror" TikTok video pipeline, via de officiele Higgsfield API.

Stappen:
  1. python mila_mirror.py frame           -> maakt startframe-varianten (GPT-kwaliteit via Marketing Studio Image)
  2. python mila_mirror.py video --frame out/frame0_1.png
                                           -> 4 clips met Kling 3.0 (met stem + lip-sync),
                                              elk volgend startframe = laatste frame van vorige clip,
                                              plakt alles aan elkaar tot out/final.mp4
  Extra:
  python mila_mirror.py estimate           -> kostenschatting, er wordt niks gegenereerd
  python mila_mirror.py video --redo 3     -> clip 3 en alles erna opnieuw (de rest blijft staan)
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

try:
    import httpx
    import higgsfield_client
except ImportError:
    sys.exit("Installeer eerst de dependencies:  pip3 install -r requirements.txt")

ROOT = Path(__file__).resolve().parent
REFS_MILA = ROOT / "refs" / "mila"
REFS_PRODUCT = ROOT / "refs" / "product"
OUT = ROOT / "out"
STATE_FILE = OUT / "state.json"

# .env naast het script inlezen (HF_KEY=id:secret). Bestaande env vars gaan voor.
_env = ROOT / ".env"
if _env.exists():
    for _line in _env.read_text().splitlines():
        _k, _, _v = _line.strip().partition("=")
        if _k and not _k.startswith("#") and _v:
            os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

IMAGE_MODEL = "marketing-studio/image"
VIDEO_MODELS = {
    "pro": "kling-video/v3.0/pro/image-to-video",
    "std": "kling-video/v3.0/std/image-to-video",
}
# Geschatte API-prijzen (sept 2026, met huidige korting). Alleen voor de schatting.
PRICE_PER_SEC = {"pro": 0.084, "std": 0.063}
# Marketing Studio Image: $0.0167 bij 2k/low; 2k/high staat niet publiek, dit is een ruime bovengrens.
PRICE_PER_IMAGE = 0.15
MAX_IMAGE_REFS = 14  # API-limiet voor referentiebeelden

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp"}

# --------------------------------------------------------------------------- #
#  PRODUCT + STYLE (woord voor woord in elke prompt, zodat alles gelijk blijft)
# --------------------------------------------------------------------------- #
PRODUCT = (
    "black seamless shapewear shorts exactly like the product reference images: "
    "extra high waist reaching just under the bust, matte fine-ribbed knit fabric, "
    "subtle contour seam lines, mid-thigh length legs, solid black, no logo"
)
STYLE = (
    "Ultra-realistic handheld iPhone footage, authentic TikTok UGC, natural overcast "
    "daylight from a window on the left, realistic skin texture, slight phone grain, "
    "real lived-in Scandinavian bedroom with an unmade bed with beige linen, clothes on a chair, "
    "a small plant, tall full-length floor mirror. No text, no subtitles, no watermark."
)
KEEP = (
    "Image 1 is the current frame of the video. Keep EVERYTHING identical to image 1: "
    "same woman, same face, same hair, same room, same furniture, same lighting, same camera "
    "angle and distance, same phone grain. The other images are references only: "
    "the woman's face references first, then the product references."
)

FRAME0_PROMPT = (
    "Ultra-realistic iPhone mirror selfie, vertical TikTok UGC style. The woman from the reference "
    "images (keep her face exactly identical) stands in front of a tall full-length floor mirror, "
    "holding an iPhone at chest height, filming her reflection. She wears a fitted black satin slip "
    "midi dress with thin straps; the satin fabric shows slight wrinkles and bunching at the hips and "
    "waist. Her body is turned three-quarters to the side, mid-turn, relaxed confident expression. "
    "Both the woman and her reflection are clearly visible. " + STYLE
)

# Elke clip: optioneel een keyframe-edit (nodig als het product in beeld komt of er iets
# verandert), daarna de Kling-clip vanaf dat frame.
CLIPS = [
    {
        "name": "clip1_reflection_freezes",
        "duration": 7,
        "keyframe": None,  # start = gekozen startframe
        "video": (
            "Handheld iPhone mirror selfie video. The woman turns side to side admiring her dress and "
            "says happily in a casual young American English voice: \"Okay, this dress is actually "
            "perfect—\". Suddenly her reflection in the mirror stops moving and stays completely frozen "
            "while the real woman keeps moving. She notices, looks at the mirror confused and says: "
            "\"...why'd you stop?\" The reflection crosses its arms, points at the fabric wrinkles on her "
            "hips and says in the same voice: \"Babe. The lines.\" " + STYLE +
            " Natural room sound, no music."
        ),
    },
    {
        "name": "clip2_hand_from_mirror",
        "duration": 4,
        "keyframe": (
            KEEP + " Change only this: the reflection's hand now reaches OUT through the mirror surface, "
            "the glass ripples like water around the wrist, and the hand holds up the " + PRODUCT +
            ". The real woman leans back in shock with wide eyes, still holding her phone."
        ),
        "video": (
            "The mirror surface ripples like water as the reflection's arm pushes the shorts further out "
            "of the mirror. The woman gasps and shouts \"WHAT—\" in a shocked young American English "
            "voice, then hesitantly grabs the shorts from the hand. The hand slides back into the mirror "
            "and the glass settles. The shorts stay exactly the same product. " + STYLE +
            " Natural room sound, no music."
        ),
    },
    {
        "name": "clip3_smooth_dress",
        "duration": 4,
        "keyframe": (
            KEEP + " Change only this: she wears the same black satin slip midi dress, but the fabric is "
            "now perfectly smooth over her hips and waist with a sleek silhouette (shapewear worn "
            "underneath, not visible). Her only hand-held item is the phone. She stands in three-quarter "
            "profile. In the mirror her reflection faces her and slow-claps with a smug smile."
        ),
        "video": (
            "She slowly turns to show the smooth silhouette of her dress. Her reflection in the mirror "
            "slow-claps. She looks into the phone camera and says dryly in a casual young American "
            "English voice: \"Okay... she was right.\" with a small smile. " + STYLE +
            " Natural room sound, no music."
        ),
    },
    {
        "name": "clip4_cta",
        "duration": 7,
        "keyframe": (
            KEEP + " Change only this: she faces the camera directly, films with the phone in one hand "
            "and with her other hand holds up the " + PRODUCT + " toward the camera. Friendly, confident "
            "expression. Her reflection behind her mirrors her normally."
        ),
        "video": (
            "Talking directly into the camera in a casual, confident young American English voice she "
            "says: \"They're seamless, they don't roll down, and you literally can't see them. Four "
            "shades.\" Then she points down at the bottom of the screen and says: \"It's in the orange "
            "cart.\" At the very end her reflection in the mirror behind her suddenly freezes and stares "
            "straight into the camera. The shorts stay exactly the same product. " + STYLE +
            " Natural room sound, no music."
        ),
    },
]


# --------------------------------------------------------------------------- #
#  helpers
# --------------------------------------------------------------------------- #
def log(msg):
    print(msg, flush=True)


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg niet gevonden. Run:  pip3 install -r requirements.txt")


def run_ffmpeg(args):
    cmd = [ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", *args]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError("ffmpeg fout:\n" + res.stderr)
    return res


def has_audio(path):
    res = subprocess.run([ffmpeg_exe(), "-hide_banner", "-i", str(path)],
                         capture_output=True, text=True)
    return "Audio:" in res.stderr


def list_images(folder):
    if not folder.exists():
        return []
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in IMG_EXT)


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"uploads": {}, "clips": {}}


def save_state(state):
    OUT.mkdir(exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def check_credentials():
    if not (os.getenv("HF_KEY") or (os.getenv("HF_API_KEY") and os.getenv("HF_API_SECRET"))):
        sys.exit(
            "Geen API-key gevonden. Zet eerst in je terminal:\n"
            '  export HF_KEY="jouw-api-key-id:jouw-api-key-secret"\n'
            "(keys maak je aan op https://console.higgsfield.ai)"
        )


def upload(state, path):
    """Upload een lokaal bestand 1 keer; hergebruik de URL daarna."""
    key = f"{Path(path).resolve()}:{Path(path).stat().st_mtime}"
    if key in state["uploads"]:
        return state["uploads"][key]
    log(f"  upload {Path(path).name} ...")
    url = higgsfield_client.upload_file(str(path))
    state["uploads"][key] = url
    save_state(state)
    return url


def run_model(model, arguments, what):
    """Submit, wacht, en geef de JSON terug. Stopt met duidelijke melding bij fouten."""
    log(f"  -> {what} ({model})")
    started = time.time()
    last = [None]

    def on_update(status):
        name = type(status).__name__
        if name != last[0]:
            last[0] = name
            log(f"     status: {name}  ({int(time.time() - started)}s)")

    for attempt in range(1, 3):
        try:
            result = higgsfield_client.subscribe(model, arguments=arguments, on_queue_update=on_update)
            break
        except higgsfield_client.HiggsfieldClientError as e:
            msg = str(e)
            if "credit" in msg.lower() or "balance" in msg.lower():
                sys.exit(f"\nTe weinig API-saldo: {msg}\nWaardeer op via https://open.higgsfield.ai/billing")
            if attempt == 2:
                sys.exit(f"\nAPI-fout bij {what}: {msg}")
            log(f"     fout ({msg}), nog 1 poging over ...")
            time.sleep(5)

    status = result.get("status")
    if status == "nsfw":
        sys.exit(f"\n{what} is geblokkeerd door de NSFW-filter. Pas de prompt of referenties aan "
                 f"(bijv. productfoto's zonder model) en run opnieuw. Mislukte requests worden niet gerekend.")
    if status != "completed":
        sys.exit(f"\n{what} mislukt (status: {status}): {result.get('error')}")
    return result


def download(url, dest):
    dest = Path(dest)
    with httpx.stream("GET", url, timeout=300, follow_redirects=True) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_bytes():
                f.write(chunk)
    return dest


def ext_from_url(url, default):
    m = re.search(r"\.(png|jpg|jpeg|webp|mp4|mov)(?:\?|$)", url, re.I)
    return "." + m.group(1).lower() if m else default


def extract_last_frame(video, dest_png):
    # -sseof pakt de laatste seconde, -update 1 overschrijft tot het echt laatste frame
    run_ffmpeg(["-sseof", "-1", "-i", str(video), "-update", "1", "-q:v", "1", str(dest_png)])
    if not Path(dest_png).exists():
        raise RuntimeError(f"Kon laatste frame niet uit {video} halen")
    return dest_png


def normalize_clip(src, dest):
    """1080x1920, 30fps, h264 + aac. Voegt stilte toe als een clip geen audio heeft."""
    vf = ("scale=1080:1920:force_original_aspect_ratio=decrease,"
          "pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30")
    if has_audio(src):
        args = ["-i", str(src), "-vf", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-af", "apad", "-c:a", "aac", "-ar", "44100", "-ac", "2",
                "-shortest", str(dest)]
    else:
        args = ["-i", str(src), "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                "-vf", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(dest)]
    run_ffmpeg(args)


def concat(clips, dest):
    norm_dir = OUT / "normalized"
    norm_dir.mkdir(exist_ok=True)
    parts = []
    for c in clips:
        n = norm_dir / (Path(c).stem + ".mp4")
        normalize_clip(c, n)
        parts.append(n)
    listfile = norm_dir / "list.txt"
    listfile.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    run_ffmpeg(["-f", "concat", "-safe", "0", "-i", str(listfile), "-c", "copy",
                "-movflags", "+faststart", str(dest)])
    return dest


def ref_urls(state):
    mila = list_images(REFS_MILA)
    product = list_images(REFS_PRODUCT)
    if not mila:
        sys.exit(f"Geen foto's van Mila gevonden in {REFS_MILA}")
    if not product:
        sys.exit(f"Geen productfoto's gevonden in {REFS_PRODUCT}")
    mila_urls = [upload(state, p) for p in mila[:6]]
    product_urls = [upload(state, p) for p in product[:6]]
    return mila_urls, product_urls


# --------------------------------------------------------------------------- #
#  commands
# --------------------------------------------------------------------------- #
def cmd_estimate(args):
    secs = sum(c["duration"] for c in CLIPS)
    keyframes = sum(1 for c in CLIPS if c["keyframe"])
    frames = args.variants
    video = secs * PRICE_PER_SEC[args.tier]
    images = (frames + keyframes) * PRICE_PER_IMAGE
    log(f"Kling 3.0 {args.tier}: {secs}s video  ≈ ${video:.2f}")
    log(f"Beelden: {frames} startframe(s) + {keyframes} keyframes ≈ ${images:.2f}")
    log(f"Totaal ≈ ${video + images:.2f}  (schatting, mislukte requests worden niet gerekend)")


def cmd_frame(args):
    check_credentials()
    OUT.mkdir(exist_ok=True)
    state = load_state()
    mila_urls, _ = ref_urls(state)
    log(f"Startframe genereren ({args.variants} variant(en)) ...")
    made = []
    for i in range(1, args.variants + 1):
        res = run_model(IMAGE_MODEL, {
            "prompt": FRAME0_PROMPT,
            "image_urls": mila_urls,
            "resolution": "2k",
            "aspect_ratio": "9:16",
            "quality": "high",
            "moderation": args.moderation,
            "enhance_prompt": False,  # anders herschrijft Marketing Studio de prompt
        }, f"startframe {i}")
        url = res["images"][0]["url"]
        dest = OUT / f"frame0_{i}{ext_from_url(url, '.png')}"
        download(url, dest)
        made.append(dest)
        log(f"     opgeslagen: {dest}")
    log("\nKlaar. Bekijk de frames in de map out/ en start de video met bijvoorbeeld:")
    log(f"  python3 mila_mirror.py video --frame {made[0].relative_to(ROOT)}")


def cmd_video(args):
    check_credentials()
    frame0 = Path(args.frame)
    if not frame0.exists():
        sys.exit(f"Startframe niet gevonden: {frame0}")
    OUT.mkdir(exist_ok=True)
    state = load_state()

    # Ander startframe of andere tier dan vorige run? Dan alles opnieuw.
    signature = f"{frame0.resolve()}:{frame0.stat().st_mtime}:{args.tier}"
    if state.get("signature") != signature:
        state["clips"] = {}
        state["signature"] = signature
    if args.redo:
        for idx in range(args.redo, len(CLIPS) + 1):
            state["clips"].pop(str(idx), None)
    save_state(state)

    mila_urls, product_urls = ref_urls(state)
    model = VIDEO_MODELS[args.tier]
    current_frame = frame0
    clip_files = []

    for idx, clip in enumerate(CLIPS, start=1):
        key = str(idx)
        done = state["clips"].get(key)
        if done and Path(done["video"]).exists() and Path(done["last_frame"]).exists():
            log(f"\n[{idx}/{len(CLIPS)}] {clip['name']}: al klaar, overslaan")
            clip_files.append(Path(done["video"]))
            current_frame = Path(done["last_frame"])
            continue

        log(f"\n[{idx}/{len(CLIPS)}] {clip['name']}")

        # 1. keyframe-edit vanaf het laatste frame van de vorige clip
        start_frame = current_frame
        if clip["keyframe"]:
            base_url = upload(state, current_frame)
            res = run_model(IMAGE_MODEL, {
                "prompt": clip["keyframe"],
                "image_urls": [base_url, *mila_urls, *product_urls][:MAX_IMAGE_REFS],
                "resolution": "2k",
                "aspect_ratio": "9:16",
                "quality": "high",
                "moderation": args.moderation,
            "enhance_prompt": False,  # anders herschrijft Marketing Studio de prompt
            }, f"keyframe clip {idx}")
            url = res["images"][0]["url"]
            start_frame = download(url, OUT / f"keyframe{idx}{ext_from_url(url, '.png')}")
            log(f"     keyframe: {start_frame}")

        # 2. Kling clip vanaf dat frame
        start_url = upload(state, start_frame)
        res = run_model(model, {
            "prompt": clip["video"],
            "image_url": start_url,
            "duration": clip["duration"],
            "sound": "on",
            "cfg_scale": 0.5,
            "multi_shots": False,
        }, f"video clip {idx} ({clip['duration']}s)")
        video_path = download(res["video"]["url"], OUT / f"{idx}_{clip['name']}.mp4")
        last_frame = extract_last_frame(video_path, OUT / f"{idx}_lastframe.png")
        log(f"     video: {video_path}")

        state["clips"][key] = {"video": str(video_path), "last_frame": str(last_frame)}
        save_state(state)
        clip_files.append(video_path)
        current_frame = last_frame

    log("\nClips aan elkaar plakken ...")
    final = concat(clip_files, OUT / "final.mp4")
    log(f"\nKLAAR: {final}")
    log("Tip: zet in TikTok het AI-label aan en voeg de tekst toe in CapCut of de TikTok-editor.")


def main():
    p = argparse.ArgumentParser(description="Mila 'The Mirror' video via Higgsfield API")
    sub = p.add_subparsers(dest="cmd", required=True)

    pe = sub.add_parser("estimate", help="kostenschatting, genereert niks")
    pe.add_argument("--tier", choices=["pro", "std"], default="pro")
    pe.add_argument("--variants", type=int, default=2)

    pf = sub.add_parser("frame", help="startframe-varianten maken")
    pf.add_argument("--variants", type=int, default=2)
    pf.add_argument("--moderation", choices=["auto", "low"], default="auto")

    pv = sub.add_parser("video", help="clips maken en samenvoegen")
    pv.add_argument("--frame", required=True, help="pad naar het gekozen startframe")
    pv.add_argument("--tier", choices=["pro", "std"], default="pro",
                    help="pro = beste kwaliteit (standaard), std = goedkoper")
    pv.add_argument("--redo", type=int, help="clip N en alles erna opnieuw genereren")
    pv.add_argument("--moderation", choices=["auto", "low"], default="auto")

    args = p.parse_args()
    {"estimate": cmd_estimate, "frame": cmd_frame, "video": cmd_video}[args.cmd](args)


if __name__ == "__main__":
    main()
