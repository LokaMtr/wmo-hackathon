#!/usr/bin/env python3
"""Meet de textuurstatistiek van een clip op 8x8-blokken.

Drie getallen, met de band van echte telefoonbeelden ernaast:
  dead-flat %   aandeel 8x8-blokken zonder enige variatie   echt: 2-3 %
  noise floor   onderste percentiel van de blok-spreiding   echt: 0,45-0,70
  median SD     mediane spreiding per blok                  echt: 2,2-4,1

Boven de band -> te veel textuur -> hqdn3d.
Onder de band -> te glad -> noise=alls=...:allf=t+u.
Nooit allebei.

Meet NA de encode die het platform toepast, niet ervoor.
"""
import subprocess, sys
import numpy as np

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
REAL = {"flat": (2.0, 3.0), "floor": (0.45, 0.70), "sd": (2.2, 4.1)}


def probe(path, at=(0.1, 0.3, 0.5, 0.7, 0.9)):
    import re
    out = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    hms = [l for l in out.splitlines() if "Duration" in l][0].split("Duration:")[1].split(",")[0].strip()
    h, m, s = hms.split(":")
    dur = int(h) * 3600 + int(m) * 60 + float(s)

    flats, floors, sds = [], [], []
    for frac in at:
        raw = subprocess.run(
            [FF, "-v", "quiet", "-ss", f"{dur*frac:.2f}", "-i", path, "-frames:v", "1",
             "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
        n = len(raw)
        line = [l for l in out.splitlines() if "Video:" in l][0]
        m2 = re.search(r"\b(\d{2,5})x(\d{2,5})\b", line)
        W, H = int(m2.group(1)), int(m2.group(2))
        if n < W * H:
            continue
        img = np.frombuffer(raw[:W * H], dtype=np.uint8).astype(np.float32).reshape(H, W)
        bh, bw = H // 8, W // 8
        blocks = img[:bh * 8, :bw * 8].reshape(bh, 8, bw, 8).transpose(0, 2, 1, 3).reshape(-1, 64)
        sd = blocks.std(axis=1)
        flats.append(100.0 * (sd < 0.01).mean())
        floors.append(float(np.percentile(sd, 5)))
        sds.append(float(np.median(sd)))
    return float(np.mean(flats)), float(np.mean(floors)), float(np.mean(sds))


def band(v, lo, hi):
    return "in band" if lo <= v <= hi else ("TE LAAG" if v < lo else "TE HOOG")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        f, n, s = probe(p)
        print(f"\n{p}")
        print(f"  dead-flat  {f:6.2f} %   {band(f, *REAL['flat'])}   (echt 2,0-3,0)")
        print(f"  noiseflr   {n:6.2f}     {band(n, *REAL['floor'])}   (echt 0,45-0,70)")
        print(f"  median SD  {s:6.2f}     {band(s, *REAL['sd'])}   (echt 2,2-4,1)")
