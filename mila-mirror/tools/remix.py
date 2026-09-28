#!/usr/bin/env python3
"""Maak een nieuwe video uit clips die er al liggen. Kost geen credits.

    python3 remix.py --out nieuw.mp4 \
        --hook "she wore it to the shop" --vraag "would you?" \
        -- teddy2/c3.mp4 teddy/c2.mp4 teddy4/c2.mp4 teddy3/c4.mp4

Wat het wel kan:
  Clips van HETZELFDE product opnieuw combineren in een andere volgorde, met een
  andere hooktekst en een andere caption. Dat is een andere video, gratis.

Wat het niet kan:
  Clips van verschillende producten mengen. In bijna elke clip zegt ze een zin over
  dat ene product; een beamer-clip in een teddy-video klopt niet met wat je hoort.
  Gemeten over 52 clips: geen enkele is echt stil.

Waar je op moet letten:
  TikTok weegt "unoriginal content" mee. Hetzelfde beeldmateriaal opnieuw posten is
  precies waar die regel op mikt. Gebruik dit dus om GOEDKOPER te maken wat je toch
  zou posten, niet om MEER te posten van hetzelfde.
"""
import argparse, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
FINISH = os.path.join(HERE, "finish.py")


def hms(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x - h * 3600 - m * 60
    return f"{h}:{m:02d}:{s:05.2f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--hook", required=True, help="tekst in beeld, eerste 3 seconden")
    ap.add_argument("--vraag", required=True, help="tekst in beeld, laatste 2,6 seconden")
    ap.add_argument("--denoise", type=float, default=4.5)
    ap.add_argument("clips", nargs="+")
    a = ap.parse_args()

    prods = {c.split(os.sep)[0].rstrip("0123456789") for c in a.clips}
    if len(prods) > 1:
        print(f"LET OP: clips uit verschillende producten ({', '.join(sorted(prods))}). "
              "Wat ze zegt klopt dan niet meer met wat je ziet.", file=sys.stderr)

    sys.path.insert(0, HERE)
    import importlib.util
    spec = importlib.util.spec_from_file_location("finish", FINISH)
    fin = importlib.util.module_from_spec(spec); spec.loader.exec_module(fin)
    total = sum(fin.natural_end(c) for c in a.clips)

    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,DejaVu Sans,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&HB4000000,1,0,0,0,100,100,0,0,1,0,3,8,110,110,300,1
Style: Q,DejaVu Sans,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&HB4000000,1,0,0,0,100,100,0,0,1,0,3,2,110,110,340,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    fd, ass = tempfile.mkstemp(suffix=".ass"); os.close(fd)
    with open(ass, "w") as f:
        f.write(head)
        f.write("Dialogue: 0,0:00:00.10,0:00:03.40,Hook,,0,0,0,,"
                + "{\\fad(120,200)}" + a.hook.replace("|", "\\N") + "\n")
        f.write(f"Dialogue: 0,{hms(max(0,total-2.6))},{hms(total)},Q,,0,0,0,,"
                + "{\\fad(150,0)}" + a.vraag + "\n")

    cmd = [sys.executable, FINISH, "--out", a.out, "--denoise", str(a.denoise),
           "--subs", ass, "--"] + a.clips
    subprocess.run(cmd, check=True)
    os.unlink(ass)
    print(f"klaar: {a.out} ({total:.2f}s uit {len(a.clips)} bestaande clips, 0 credits)")


if __name__ == "__main__":
    main()
