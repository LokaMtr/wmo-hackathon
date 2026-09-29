#!/usr/bin/env python3
"""Wat wordt er gezegd, en wanneer? Transcript met woordtijden per clip.

    python3 hear.py c1.mp4 c2.mp4 ...

Vereist `pip install faster-whisper` (model base.en wordt de eerste keer gedownload).
"""
import sys

from faster_whisper import WhisperModel

m = WhisperModel("base.en", device="cpu", compute_type="int8")
for c in sys.argv[1:]:
    segs, _ = m.transcribe(c, word_timestamps=True, vad_filter=False)
    words = [w for s in segs for w in s.words]
    print(f"{c}:", " ".join(f"{w.word.strip()}[{w.start:.1f}-{w.end:.1f}]" for w in words) or "(stil)")
