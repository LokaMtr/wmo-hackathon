#!/usr/bin/env python3
"""Contactblad + geluidsenvelop van clips, om ze te controleren zonder ze af te spelen.

    python3 contact.py uit.jpg c1.mp4 c2.mp4 ...

Per clip een rij beelden op vaste tijdstippen, en in de terminal een envelop van het
geluid (# = luid, + = zacht, . = stil) per 0,1 s.
"""
import subprocess, sys, tempfile, os

import numpy as np
from PIL import Image

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
TS = [0.0, 0.5, 1.0, 1.5, 2.5, 3.5, 4.5]

out, clips = sys.argv[1], sys.argv[2:]
rows = []
with tempfile.TemporaryDirectory() as d:
    for c in clips:
        ims = []
        for t in TS:
            p = os.path.join(d, "f.jpg")
            subprocess.run([FF, "-v", "quiet", "-ss", str(t), "-i", c, "-frames:v", "1",
                            "-vf", "scale=170:-1", p, "-y"])
            ims.append(Image.open(p).copy())
        w, h = ims[0].size
        r = Image.new("RGB", (w * len(ims), h))
        for i, im in enumerate(ims):
            r.paste(im, (w * i, 0))
        rows.append(r)

        raw = subprocess.run([FF, "-v", "quiet", "-i", c, "-f", "s16le", "-ac", "1",
                              "-ar", "16000", "-"], capture_output=True).stdout
        x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        hop = 1600
        env = [float(np.sqrt((x[i * hop:(i + 1) * hop] ** 2).mean() + 1e-12))
               for i in range(len(x) // hop)]
        m = max(env) if env else 1
        print(f"{os.path.basename(c):12s}",
              "".join("#" if e > m * .35 else ("+" if e > m * .12 else ".") for e in env))

W = max(r.size[0] for r in rows)
g = Image.new("RGB", (W, sum(r.size[1] for r in rows)))
y = 0
for r in rows:
    g.paste(r, (0, y)); y += r.size[1]
g.save(out, quality=86)
print("klaar:", out)
