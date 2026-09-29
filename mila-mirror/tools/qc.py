#!/usr/bin/env python3
"""Strenge clipcontrole: frames om de 0,5 s (strip per clip) + transcript met woordtijden.

    python3 qc.py uit.jpg c1.mp4 c2.mp4 ...
"""
import subprocess, sys, os, tempfile
from PIL import Image

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
out, clips = sys.argv[1], sys.argv[2:]
rows = []
with tempfile.TemporaryDirectory() as d:
    for c in clips:
        dur = float(subprocess.run([FF.replace("ffmpeg-linux", "ffmpeg-linux"), "-i", c], capture_output=True,
                                   text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[-1])
        ims = []
        t = 0.0
        while t < dur - 0.05:
            p = os.path.join(d, "f.jpg")
            subprocess.run([FF, "-v", "quiet", "-ss", f"{t:.2f}", "-i", c, "-frames:v", "1",
                            "-vf", "scale=120:-1", p, "-y"])
            ims.append(Image.open(p).copy()); t += 0.5
        w, h = ims[0].size
        r = Image.new("RGB", (w * len(ims), h))
        for i, im in enumerate(ims):
            r.paste(im, (w * i, 0))
        rows.append(r)
W = max(r.size[0] for r in rows)
g = Image.new("RGB", (W, sum(r.size[1] for r in rows)))
y = 0
for r in rows:
    g.paste(r, (0, y)); y += r.size[1]
g.save(out, quality=85)
subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), "hear.py")] + clips)
