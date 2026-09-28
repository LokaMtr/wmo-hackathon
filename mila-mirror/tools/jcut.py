#!/usr/bin/env python3
"""J-cut: het geluid van clip B begint al onder clip A.

    python3 jcut.py --lead 1.5 --under 0.35 A.mp4 B.mp4 out.mp4

Beeld: A van 0 tot `lead`, daarna B vanaf `lead` (niet vanaf 0), zodat haar lippen in B
synchroon blijven met haar stem. Het eerste stuk beeld van B wordt nooit getoond.
Geluid: B vanaf 0 over de hele lengte, met het geluid van A er zachter onder (factor
`under`) zolang A in beeld is. Zo loopt er vanaf frame 1 stem, en hoor je het contactgeluid
van de hook nog net.
"""
import argparse, subprocess

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"

ap = argparse.ArgumentParser()
ap.add_argument("--lead", type=float, default=1.5)
ap.add_argument("--under", type=float, default=0.35, help="volume van A onder de stem")
ap.add_argument("a"); ap.add_argument("b"); ap.add_argument("out")
x = ap.parse_args()
L = x.lead

fc = (
    f"[0:v]trim=0:{L},setpts=PTS-STARTPTS,fps=30,scale=1080:1920,setsar=1[va];"
    f"[1:v]trim=start={L},setpts=PTS-STARTPTS,fps=30,scale=1080:1920,setsar=1[vb];"
    f"[va][vb]concat=n=2:v=1:a=0[v];"
    f"[0:a]atrim=0:{L},asetpts=PTS-STARTPTS,volume={x.under},"
    f"afade=t=out:st={max(0, L - 0.25)}:d=0.25[aa];"
    f"[1:a]asetpts=PTS-STARTPTS[ab];"
    f"[ab][aa]amix=inputs=2:duration=first:normalize=0[a]"
)
subprocess.run([FF, "-v", "error", "-y", "-i", x.a, "-i", x.b, "-filter_complex", fc,
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16",
                "-preset", "veryfast", "-c:a", "aac", "-b:a", "192k", x.out], check=True)
print("klaar:", x.out)
