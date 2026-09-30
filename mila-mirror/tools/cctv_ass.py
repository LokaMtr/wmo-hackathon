#!/usr/bin/env python3
"""Ondertiteling voor pet-cam/beveiligingscamera-shots: een tijdstempel die per seconde
doortikt, plus gewone tekstmomenten.

    python3 cctv_ass.py out.ass --seg 0 5.0 22:47:13 --seg 5.0 10.0 23:12:40 \
        --text 0.1 2.8 "pet cam" --q 11.3 13.7 "team cat or team Mila?"

Elke --seg is een stuk camerabeeld: start, eind (in de video) en de kloktijd waarop het
begint. Tussen twee segmenten mag de klok springen: dat ís de tijdsprong. Selfie-shots
krijgen geen segment en dus geen stempel.
"""
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("out")
ap.add_argument("--seg", nargs=3, action="append", default=[], metavar=("START", "END", "CLOCK"))
ap.add_argument("--text", nargs=3, action="append", default=[], metavar=("START", "END", "TEXT"))
ap.add_argument("--q", nargs=3, action="append", default=[], metavar=("START", "END", "TEXT"))
ap.add_argument("--label", default="CAM 1")
a = ap.parse_args()


def ts(s):
    return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"


head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cam,DejaVu Sans Mono,40,&H00F0F0F0,&H00F0F0F0,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,2,0,7,70,70,120,1
Style: Hook,TikTok Sans Bold,66,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,1.5,0,1,7,0,8,90,90,230,1
Style: Q,TikTok Sans Bold,58,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,1.5,0,1,7,0,2,90,90,330,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for start, end, clock in a.seg:
    s0, s1 = float(start), float(end)
    h, m, sec = (int(x) for x in clock.split(":"))
    base = h * 3600 + m * 60 + sec
    t, k = s0, 0
    while t < s1 - 1e-6:
        nxt = min(s0 + k + 1, s1)
        c = base + k
        stamp = f"{c // 3600 % 24:02d}:{c % 3600 // 60:02d}:{c % 60:02d}"
        ev.append(f"Dialogue: 0,{ts(t)},{ts(nxt)},Cam,,0,0,0,,{a.label}   {stamp}")
        t, k = nxt, k + 1
for start, end, text in a.text:
    ev.append(f"Dialogue: 1,{ts(float(start))},{ts(float(end))},Hook,,0,0,0,,{text}")
for start, end, text in a.q:
    ev.append(f"Dialogue: 1,{ts(float(start))},{ts(float(end))},Q,,0,0,0,,{text}")
open(a.out, "w").write(head + "\n".join(ev) + "\n")
print("klaar:", a.out, len(ev), "regels")
