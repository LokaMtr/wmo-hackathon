#!/usr/bin/env python3
"""Telefoon-afwerking voor AI-clips: maakt van losse generaties één opname.

    python3 finish.py --out final.mp4 --dur 3.0 4.6 4.4 5.04 -- c1.mp4 c2.mp4 c3.mp4 c4.mp4

Wat er gebeurt en waarom (gemeten, niet gegokt):

1. hqdn3d=6      Onze Kling-output heeft TE VEEL hoogfrequente textuur, niet te
                 weinig (gemeten: noise floor 1,0 tegen 0,45-0,70 bij echte
                 telefoonbeelden). Korrel toevoegen is dus precies de verkeerde
                 kant op. Meet met texture_probe.py voor je dit verandert.
2. shake         UIT (Loka, 27-09): nagebootste camerabeweging trilt zichtbaar en
                 leest als een filter, niet als een hand. Ons materiaal staat op
                 0,00 px en dat is meetbaar niet echt, maar zichtbaar mis is erger
                 dan meetbaar mis. Aan te zetten met --shake/--tremor als er ooit
                 echt telefoonmateriaal is om op te kalibreren.
3. drift ±0,04   Belichting ademt, periode 3s, faseverschuiving per clip zodat
                 de clips niet in de pas lopen.
4. AE-stap       Bij elke snede springt de belichting 0,06 en zakt in 0,3s terug.
                 Een echte telefoon herstelt zijn belichting na elke scene.
                 Dit is wat vier losse clips laat lezen als één opname.
5. WB-offset     Elke clip een eigen kleurtemperatuur binnen ±150K.
7. encode        H.264 high@4.1, 4:2:0, closed GOP, BT.709, 2,5 Mbit.
                 Geen HEVC, geen AV1.

Bewust NIET: filmkorrel, chromatische aberratie, vignet, rolling shutter.
Dat is een filmlook, geen telefoonlook, en het overleeft 2,5 Mbit toch niet.
"""
import argparse, math, os, random, subprocess, sys, tempfile

import numpy as np

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"


import time as _t


def run(args):
    _s = _t.time()
    p = subprocess.run(args, capture_output=True, text=True)
    print(f"  [{_t.time()-_s:5.1f}s] {args[args.index(chr(45)+chr(121))+1 if False else 0].split(chr(47))[-1]} ... {args[-1].split(chr(47))[-1]}", flush=True)
    if p.returncode:
        sys.exit(f"ffmpeg faalde:\n{' '.join(args[:6])}...\n{p.stderr[-1500:]}")
    return p


def norm_clip(src, dur, wb_k, tmp, i):
    """Elke clip op 1080x1920/30fps, met een eigen witbalans-offset."""
    out = os.path.join(tmp, f"n{i}.mp4")
    vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30"
    if abs(wb_k - 6500) > 1:
        vf += f",colortemperature=temperature={wb_k:.0f}:mix=0.35"
    vf += ",format=yuv420p"
    run([FF, "-y", "-v", "error", "-i", src, "-t", f"{dur}", "-vf", vf,
         "-c:v", "libx264", "-crf", "15", "-preset", "veryfast",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", out])
    return out


def natural_end(path, tail=0.45, sr=16000, hop=1600):
    """Waar loopt een clip vanzelf uit: einde van het geluid plus wat lucht.

    Zelf een lengte kiezen knipt haar middenin een zin af - dat voel je meteen,
    ook als je niet kunt benoemen wat er mis is. Meet het, verzin het niet.
    """
    raw = subprocess.run([FF, "-v", "quiet", "-i", path, "-f", "s16le",
                          "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    dur = len(x) / sr
    n = len(x) // hop
    if n < 3:
        return dur
    env = np.array([float(np.sqrt((x[i*hop:(i+1)*hop] ** 2).mean() + 1e-12)) for i in range(n)])
    loud = np.where(env > env.max() * 0.18)[0]
    end = (loud.max() + 1) * (hop / sr) + tail if len(loud) else 0.0

    # ook het gebaar laten uitlopen: soms praat ze niet meer maar beweegt ze nog
    w, h = 120, 213
    raw = subprocess.run([FF, "-v", "quiet", "-i", path, "-vf", f"scale={w}:{h}",
                          "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8).astype(np.float32)
    F = a[:len(a) // (w * h) * (w * h)].reshape(-1, h, w)
    if len(F) > 2:
        d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))
        busy = np.where(d > d.max() * 0.30)[0]
        if len(busy):
            end = max(end, (busy.max() + 1) / 30.0 + 0.25)
    return min(dur, end) if end else dur


def mean_luma(path):
    """Gemiddelde helderheid van een clip, om de belichtingssprong op te kunnen vangen."""
    raw = subprocess.run(
        [FF, "-v", "quiet", "-i", path, "-vf", "scale=96:170", "-frames:v", "60",
         "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    if not raw:
        return 128.0
    return float(np.frombuffer(raw, dtype=np.uint8).mean())


def room_tone(clips, tmp, seconds=2.0):
    """Ruimtetoon uit het stilste stuk eigen materiaal; die loopt straks dwars
    door alle snedes heen, wat vier clips als een opname laat klinken."""
    cat = os.path.join(tmp, "alla.wav")
    args = [FF, "-y", "-v", "error"]
    for c in clips:
        args += ["-i", c]
    n = len(clips)
    args += ["-filter_complex", "".join(f"[{i}:a]" for i in range(n)) + f"concat=n={n}:v=0:a=1[a]",
             "-map", "[a]", "-ar", "48000", "-ac", "1", "-f", "s16le", cat]
    run(args)

    x = np.fromfile(cat, dtype=np.int16).astype(np.float32) / 32768.0
    sr, win = 48000, int(48000 * seconds)
    if len(x) < win + sr:
        return None
    # energie per 0,1s, dan het stilste aaneengesloten venster zoeken
    hop = sr // 10
    e = np.array([float(np.sqrt((x[i:i + hop] ** 2).mean() + 1e-12))
                  for i in range(0, len(x) - hop, hop)])
    k = max(1, win // hop)
    csum = np.concatenate([[0.0], np.cumsum(e)])
    windows = (csum[k:] - csum[:-k]) / k
    start = float(np.argmin(windows)) * hop / sr

    # Controleren of dit echt ruimtetoon is. In Kling-clips is nooit echte stilte:
    # het stilste stuk bevat vaak nog stem, en die ga je horen als je hem loopt.
    seg = x[int(start * sr):int(start * sr) + win]
    rms = float(np.sqrt((seg ** 2).mean() + 1e-12))
    S = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    tonal = float(S.max() / (S.mean() + 1e-9))     # smalle piek = toon, dus stem
    if rms > 0.008 or float(np.abs(seg).max()) > 0.12 or tonal > 400:
        return None                                 # geen bruikbare ruimtetoon

    tone = os.path.join(tmp, "tone.wav")
    run([FF, "-y", "-v", "error", "-f", "s16le", "-ar", "48000", "-ac", "1",
         "-ss", f"{start:.2f}", "-i", cat, "-t", f"{seconds}",
         "-af", f"afade=t=in:d=0.2,afade=t=out:st={seconds-0.2:.2f}:d=0.2,"
                "highpass=f=90,lowpass=f=12000",
         "-ac", "2", tone])
    return tone if os.path.getsize(tone) > 5000 else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--dur", nargs="+", type=float,
                    help="lengte per clip; weglaten = automatisch op het einde van het geluid")
    ap.add_argument("--shake", type=float, default=0.0)
    ap.add_argument("--tremor", type=float, default=0.0)
    ap.add_argument("--drift", type=float, default=0.0)
    ap.add_argument("--denoise", type=float, default=3.2)
    ap.add_argument("--ae-step", type=float, default=0.0)
    ap.add_argument("--bitrate", default="2.5M")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--wb", type=float, default=0.0, help="witbalansspreiding in K; 0 = uit")
    ap.add_argument("--roomtone", action="store_true",
                    help="ruimtetoon onder de snedes leggen; standaard uit")
    ap.add_argument("--subs", default=None, help="optioneel .ass-bestand")
    ap.add_argument("clips", nargs="+")
    a = ap.parse_args()
    if a.dur is None:
        a.dur = [round(natural_end(c), 2) for c in a.clips]
        print("lengtes automatisch bepaald: " + ", ".join(f"{d:.2f}s" for d in a.dur), flush=True)
    if len(a.clips) != len(a.dur):
        sys.exit("aantal clips en aantal duren moeten gelijk zijn")

    rnd = random.Random(a.seed)
    tmp = tempfile.mkdtemp(prefix="finish_")

    wbs = [6500 + (rnd.uniform(-a.wb, a.wb) if a.wb else 0.0) for _ in a.clips]
    normed = [norm_clip(c, d, k, tmp, i) for i, (c, d, k) in enumerate(zip(a.clips, a.dur, wbs))]

    lst = os.path.join(tmp, "list.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in normed))
    base = os.path.join(tmp, "base.mp4")
    run([FF, "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", base])

    # belichtingssprong op elke snede, met verval van 0,3s
    cuts, t = [], 0.0
    for d in a.dur[:-1]:
        t += d
        cuts.append(t)
    # Een echte telefoon staat na een snede nog even op de belichting van het VORIGE
    # shot en regelt dan bij. De stap loopt dus naar de sprong toe, niet ervan af:
    # is het nieuwe shot lichter, dan begint hij donkerder en trekt hij bij.
    # Blind een sprong optellen geeft een flits (gemeten: 44 niveaus in een frame).
    lumas = [mean_luma(p) for p in normed]
    steps = ""
    for i, c in enumerate(cuts):
        delta = (lumas[i] - lumas[i + 1]) / 255.0      # + als het nieuwe shot donkerder is
        amp = max(-a.ae_step, min(a.ae_step, delta * 0.55))
        steps += f"{amp:+.4f}*gte(t,{c:.2f})*exp(-(t-{c:.2f})/0.35)"
    ph = a.seed * 0.61
    bright = f"{a.drift}*sin(2*PI*t/3.0+{ph:.2f}){steps}"

    s_amp = a.shake
    tr = a.tremor
    pad = int(math.ceil((a.shake * 1.6 + a.tremor * 1.6) * 2)) * 2
    vf = f"hqdn3d={a.denoise}:{a.denoise}:{a.denoise}:{a.denoise}"
    if s_amp or tr:
        # pad zodat de bewegende crop geen zwarte randen trekt
        vf += (f",pad=iw+{pad}:ih+{pad}:{pad//2}:{pad//2},"
               f"crop=1080:1920:"
               f"'{pad//2}+{s_amp}*(sin(t*1.7)+0.6*sin(t*4.3))+{tr}*(sin(t*39.6)+0.6*sin(t*57.2+1.1))':"
               f"'{pad//2}+{s_amp}*(cos(t*1.3)+0.6*cos(t*3.1))+{tr}*(cos(t*44.9+0.7)+0.6*cos(t*66.0))'")
    if a.drift or a.ae_step:
        vf += f",eq=eval=frame:brightness='{bright}':contrast=1.02:saturation=0.97"
    if a.subs:
        vf += f",subtitles={a.subs}"
    vf += ",format=yuv420p"

    tone = room_tone(normed, tmp) if a.roomtone else None
    total = sum(a.dur)
    # ruimtetoon vooraf op exacte lengte zetten; een oneindige -stream_loop
    # in de filtergraaf laat ffmpeg hangen
    if tone:
        bed = os.path.join(tmp, "bed.wav")
        run([FF, "-y", "-v", "error", "-stream_loop", "-1", "-i", tone, "-t", f"{total:.2f}",
             "-ar", "48000", "-ac", "2", bed])
        ain = ["-i", bed]
        afilter = (f"[1:a]volume=0.10[tone];"
                   f"[0:a][tone]amix=inputs=2:duration=first:normalize=0,")
    else:
        ain, afilter = [], "[0:a]"
    run([FF, "-y", "-v", "error", "-i", base] + ain + [
         "-filter_complex",
         f"[0:v]{vf}[v];" + afilter +
         f"highpass=f=90,lowpass=f=13000,loudnorm=I=-14:TP=-1.5:LRA=11[a]",
         "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "veryfast", "-profile:v", "high", "-level", "4.1",
         "-b:v", a.bitrate, "-maxrate", "2.875M", "-bufsize", "5M",
         "-g", "48", "-x264-params", "open-gop=0",
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
         "-movflags", "+faststart", "-c:a", "aac", "-b:a", "128k", a.out])
    print(f"klaar: {a.out}  ({total:.2f}s, {len(a.clips)} clips, wb {wbs})")


if __name__ == "__main__":
    main()
