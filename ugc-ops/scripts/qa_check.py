#!/usr/bin/env python3
"""QA-check voor gegenereerde clips (gratis, lokaal met ffmpeg).

Gebruik: python3 qa_check.py <map> [clip1.mp4 clip2.mp4 ...]
Zonder clipnamen: alle c*.mp4 in de map.

Maakt per clip een contactsheet (<clip>_sheet.jpg, 8 beelden) en qa_report.json met:
duur, resolutie, fps, luidheid, stille stukken (geen stem?), bevroren beeld, zwarte beelden.
De visuele checks (handen, product, mond, extra objecten) doet de QA-agent op de sheets.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FF = "ffmpeg"


def run(args):
    return subprocess.run([FF, "-hide_banner", *args], capture_output=True, text=True).stderr


def probe(clip):
    err = run(["-i", str(clip)])
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    dur = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3]) if dur else 0
    res = re.search(r"Video:.*?(\d{3,4})x(\d{3,4})", err)
    fps = re.search(r"([\d.]+) fps", err)
    return {
        "duration": round(dur, 2),
        "resolution": f"{res[1]}x{res[2]}" if res else None,
        "fps": float(fps[1]) if fps else None,
        "has_audio": "Audio:" in err,
    }


def audio_checks(clip):
    err = run(["-i", str(clip), "-af", "volumedetect,silencedetect=n=-40dB:d=1.2", "-f", "null", "-"])
    mean = re.search(r"mean_volume: ([-\d.]+) dB", err)
    peak = re.search(r"max_volume: ([-\d.]+) dB", err)
    silences = [float(x) for x in re.findall(r"silence_duration: ([\d.]+)", err)]
    return {
        "mean_db": float(mean[1]) if mean else None,
        "peak_db": float(peak[1]) if peak else None,
        "silences_over_1_2s": silences,
    }


def video_checks(clip):
    err = run(["-i", str(clip), "-vf", "freezedetect=n=0.003:d=1.5,blackdetect=d=0.3", "-an", "-f", "null", "-"])
    return {
        "freezes": len(re.findall(r"freeze_start", err)),
        "black_segments": len(re.findall(r"black_start", err)),
    }


def sheet(clip, dur):
    out = clip.with_name(clip.stem + "_sheet.jpg")
    rate = max(8 / max(dur, 1), 0.5)
    run(["-y", "-loglevel", "error", "-i", str(clip), "-vf", f"fps={rate:.3f},scale=200:-1,tile=8x1", "-frames:v", "1", str(out)])
    return out.name


def verdict(p, a, v):
    issues = []
    if not p["has_audio"]:
        issues.append("geen audio")
    if a["mean_db"] is not None and a["mean_db"] < -35:
        issues.append("audio erg zacht (stem ontbreekt?)")
    if a["peak_db"] is not None and a["peak_db"] > -0.5:
        issues.append("audio clipt")
    if any(s > 2.0 for s in a["silences_over_1_2s"]):
        issues.append("stilte > 2s (tekst niet uitgesproken?)")
    if v["freezes"]:
        issues.append("bevroren beeld")
    if v["black_segments"]:
        issues.append("zwart beeld")
    return issues


def main():
    folder = Path(sys.argv[1])
    clips = [folder / c for c in sys.argv[2:]] or sorted(folder.glob("c[0-9]*.mp4"))
    report = {}
    for clip in clips:
        p = probe(clip)
        a = audio_checks(clip)
        v = video_checks(clip)
        report[clip.name] = {**p, **a, **v, "sheet": sheet(clip, p["duration"]), "auto_issues": verdict(p, a, v)}
    (folder / "qa_report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))
    for name, r in report.items():
        print(f"{name}: {r['duration']}s {r['resolution']} | {', '.join(r['auto_issues']) or 'auto-checks OK'} | sheet: {r['sheet']}")


if __name__ == "__main__":
    main()
