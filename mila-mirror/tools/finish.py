#!/usr/bin/env python3
"""Telefoon-afwerking voor AI-clips: maakt van losse generaties één opname.

    python3 finish.py --out final.mp4 --dur 3.0 4.6 4.4 5.04 -- c1.mp4 c2.mp4 c3.mp4 c4.mp4

Wat er gebeurt en waarom (gemeten, niet gegokt):

1. hqdn3d=6      Onze Kling-output heeft TE VEEL hoogfrequente textuur, niet te
                 weinig (gemeten: noise floor 1,0 tegen 0,45-0,70 bij echte
                 telefoonbeelden). Korrel toevoegen is dus precies de verkeerde
                 kant op. Meet met texture_probe.py voor je dit verandert.
2. shake 2 px    Gemengde sinussen, geen enkele periode. Onze clips staan op
                 0,00 px en dat bestaat niet bij een telefoon in een hand.
3. drift ±0,04   Belichting ademt, periode 3s, faseverschuiving per clip zodat
                 de clips niet in de pas lopen.
4. AE-stap       Bij elke snede springt de belichting 0,06 en zakt in 0,3s terug.
                 Een echte telefoon herstelt zijn belichting na elke scene.
                 Dit is wat vier losse clips laat lezen als één opname.
5. WB-offset     Elke clip een eigen kleurtemperatuur binnen ±150K.
6. encode        H.264 high@4.1, 4:2:0, closed GOP, BT.709, 2,5 Mbit.
                 Geen HEVC, geen AV1.

Bewust NIET: filmkorrel, chromatische aberratie, vignet, rolling shutter.
Dat is een filmlook, geen telefoonlook, en het overleeft 2,5 Mbit toch niet.
"""
import argparse, math, os, random, subprocess, sys, tempfile

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"


def run(args):
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode:
        sys.exit(f"ffmpeg faalde:\n{' '.join(args[:6])}...\n{p.stderr[-1500:]}")
    return p


def norm_clip(src, dur, wb_k, tmp, i):
    """Elke clip op 1080x1920/30fps, met een eigen witbalans-offset."""
    out = os.path.join(tmp, f"n{i}.mp4")
    vf = ("scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,"
          f"colortemperature=temperature={wb_k}:mix=0.35,format=yuv420p")
    run([FF, "-y", "-v", "error", "-i", src, "-t", f"{dur}", "-vf", vf,
         "-c:v", "libx264", "-crf", "16", "-preset", "medium",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", out])
    return out


def room_tone(clips, tmp, seconds=2.0):
    """Ruimtetoon uit het stilste stukje eigen materiaal; loopt straks dwars
    door alle snedes heen, wat vier clips als één opname laat klinken."""
    cat = os.path.join(tmp, "alla.wav")
    args = [FF, "-y", "-v", "error"]
    for c in clips:
        args += ["-i", c]
    n = len(clips)
    args += ["-filter_complex", "".join(f"[{i}:a]" for i in range(n)) + f"concat=n={n}:v=0:a=1[a]",
             "-map", "[a]", "-ar", "48000", "-ac", "2", cat]
    run(args)
    # stilste venster zoeken via astats per 0,5s
    p = run([FF, "-v", "info", "-i", cat, "-af",
             "astats=metadata=1:reset=15,ametadata=print:key=lavfi.astats.Overall.RMS_level",
             "-f", "null", "-"])
    vals = []
    for line in p.stderr.splitlines():
        if "RMS_level=" in line:
            try: vals.append(float(line.split("RMS_level=")[1]))
            except ValueError: pass
    idx = min(range(len(vals)), key=lambda i: vals[i]) if vals else 0
    start = idx * 0.5
    tone = os.path.join(tmp, "tone.wav")
    run([FF, "-y", "-v", "error", "-ss", f"{start:.2f}", "-i", cat, "-t", f"{seconds}",
         "-af", "afade=t=in:d=0.2,afade=t=out:st=%.2f:d=0.2,highpass=f=90,lowpass=f=12000" % (seconds - 0.2),
         tone])
    return tone


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--dur", nargs="+", type=float, required=True)
    ap.add_argument("--shake", type=float, default=2.0)
    ap.add_argument("--drift", type=float, default=0.04)
    ap.add_argument("--denoise", type=float, default=6.0)
    ap.add_argument("--ae-step", type=float, default=0.06)
    ap.add_argument("--bitrate", default="2.5M")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--subs", default=None, help="optioneel .ass-bestand")
    ap.add_argument("clips", nargs="+")
    a = ap.parse_args()
    if len(a.clips) != len(a.dur):
        sys.exit("aantal clips en aantal duren moeten gelijk zijn")

    rnd = random.Random(a.seed)
    tmp = tempfile.mkdtemp(prefix="finish_")

    wbs = [6500 + rnd.choice([-150, -90, 90, 150]) for _ in a.clips]
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
    steps = "".join(
        f"{'+' if i % 2 == 0 else '-'}{a.ae_step}*gte(t,{c:.2f})*exp(-(t-{c:.2f})/0.3)"
        for i, c in enumerate(cuts))
    ph = a.seed * 0.61
    bright = f"{a.drift}*sin(2*PI*t/3.0+{ph:.2f}){steps}"

    s = a.shake
    pad = int(math.ceil(s * 2)) * 2
    vf = (f"hqdn3d={a.denoise}:{a.denoise}:{a.denoise}:{a.denoise},"
          f"pad=iw+{pad}:ih+{pad}:{pad//2}:{pad//2},"
          f"crop=1080:1920:"
          f"'{pad//2}+{s}*(sin(t*1.7)+0.6*sin(t*4.3)+0.25*sin(t*9.1))':"
          f"'{pad//2}+{s}*(cos(t*1.3)+0.6*cos(t*3.1)+0.25*cos(t*7.7))',"
          f"eq=eval=frame:brightness='{bright}':contrast=1.02:saturation=0.97")
    if a.subs:
        vf += f",subtitles={a.subs}"
    vf += ",format=yuv420p"

    tone = room_tone(normed, tmp)
    total = sum(a.dur)
    # ruimtetoon vooraf op exacte lengte zetten; een oneindige -stream_loop
    # in de filtergraaf laat ffmpeg hangen
    bed = os.path.join(tmp, "bed.wav")
    run([FF, "-y", "-v", "error", "-stream_loop", "-1", "-i", tone, "-t", f"{total:.2f}",
         "-ar", "48000", "-ac", "2", bed])
    run([FF, "-y", "-v", "error", "-i", base, "-i", bed,
         "-filter_complex",
         f"[0:v]{vf}[v];"
         f"[1:a]volume=0.10[tone];"
         f"[0:a][tone]amix=inputs=2:duration=first:normalize=0,"
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
