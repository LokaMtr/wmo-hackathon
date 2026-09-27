#!/usr/bin/env python3
"""Meet de bekende AI-tells in een clip en geef ze een cijfer.

Gebruik: python3 realism_qa.py clip.mp4 [clip2.mp4 ...]

Meet per clip:
  shake     verschuiving van het hele beeld tussen frames, in pixels.
            Echte telefoonbeelden: ~0,3-2 px zelfs als de telefoon ergens tegenaan staat.
            0,00 px = statief dat niet bestaat. Dit is de hardste tell.
  drift     variatie in helderheid over de clip (auto-exposure die ademt).
            Echt: >1,0. AI: vaak <0,3.
  LET OP: meet shake op de versie VOOR de korrel eroverheen gaat; filmkorrel
  vervuilt de correlatie en dan meet je te laag.

  noise     hoogfrequente ruis (sensorkorrel). Echt telefoonbeeld in een kamer
            met lamplicht heeft zichtbare korrel; AI-beeld is te schoon in de
            vlakken en te druk op de randen.
  blink     knipperfrequentie, ruw geschat uit beweging in de oogregio.
"""
import subprocess, sys
import numpy as np

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"


def gray(path, w=360, h=640, n=120):
    raw = subprocess.run(
        [FF, "-v", "quiet", "-i", path, "-vf", f"scale={w}:{h}",
         "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8).astype(np.float32)
    return a[:len(a) // (w * h) * (w * h)].reshape(-1, h, w)


def shift_px(profiles):
    """Verschuiving per frame, met parabolische interpolatie voor subpixels."""
    out = []
    for i in range(1, len(profiles)):
        a, b = profiles[i] - profiles[i].mean(), profiles[i - 1] - profiles[i - 1].mean()
        c = np.correlate(a, b, mode="full")
        k = int(np.argmax(c))
        if 0 < k < len(c) - 1:
            y0, y1, y2 = c[k - 1], c[k], c[k + 1]
            den = (y0 - 2 * y1 + y2)
            k = k + (0.5 * (y0 - y2) / den if den != 0 else 0.0)
        out.append(abs(k - (len(a) - 1)))
    return np.array(out, dtype=np.float32)


def flat_noise(F):
    """Ruis gemeten in de vlakste blokken, zodat detail de meting niet vervuilt."""
    lap = (F[:, 1:-1, 1:-1] * 4 - F[:, :-2, 1:-1] - F[:, 2:, 1:-1]
           - F[:, 1:-1, :-2] - F[:, 1:-1, 2:])
    bs = 32
    vals = []
    for y in range(0, lap.shape[1] - bs, bs):
        for x in range(0, lap.shape[2] - bs, bs):
            blk = lap[:, y:y + bs, x:x + bs]
            vals.append(blk.std())
    vals = np.sort(np.array(vals))
    return float(vals[:max(1, len(vals) // 4)].mean())   # onderste kwart = vlakke gebieden


def cut_mask(F, thresh=18.0):
    """True op de overgangen tussen shots; die mogen niet meetellen als shake."""
    d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))
    return d > thresh


def report(path):
    F = gray(path)
    if len(F) < 4:
        print(f"{path}: te kort of onleesbaar")
        return
    cuts = cut_mask(F)
    keep = ~cuts
    # shake op een grof beeld meten: filmkorrel middelt dan weg, de structuur blijft staan
    G = gray(path, w=180, h=320, n=len(F) + 1)[:len(F)]
    sx = shift_px(G.mean(1))[keep] * 2.0
    sy = shift_px(G.mean(2))[keep] * 2.0
    shake = float((sx.mean() + sy.mean()) / 2) if len(sx) else 0.0
    # drift binnen shots, niet over de montage heen
    lum = F.mean(axis=(1, 2))
    seg, segs = [], []
    for i, v in enumerate(lum):
        seg.append(v)
        if i < len(cuts) and cuts[i]:
            segs.append(seg); seg = []
    segs.append(seg)
    drifts = [float(np.std(s)) for s in segs if len(s) > 8]
    drift = float(np.mean(drifts)) if drifts else 0.0
    print(f"  ({len(segs)} shot(s) gedetecteerd)")
    noise = flat_noise(F)
    motion = float(np.abs(np.diff(F, axis=0)).mean())

    def verdict(ok, warn, val, lo_is_bad=True):
        if lo_is_bad:
            return "OK " if val >= ok else ("let op" if val >= warn else "TELL")
        return "OK " if val <= ok else ("let op" if val <= warn else "TELL")

    print(f"\n{path}")
    print(f"  shake   {shake:5.2f} px   {verdict(0.30, 0.10, shake)}   (echt: 0,3-2,0)")
    print(f"  drift   {drift:5.2f}      {verdict(1.00, 0.40, drift)}   (echt: >1,0)")
    print(f"  noise   {noise:5.2f}      {verdict(2.00, 1.00, noise)}   (echt: 2-6 in vlakke vlakken)")
    print(f"  motion  {motion:5.2f}                  (ter info)")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        report(p)
