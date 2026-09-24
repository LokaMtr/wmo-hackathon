#!/usr/bin/env python3
"""Zet een scout-resultaat (JSON: {"briefing": {...}, "ideas": [...]}) klaar voor het dashboard.

Gebruik: python3 prepare_ingest.py <scout.json> <outdir> [YYYY-MM-DD]

Maakt:
  <outdir>/briefing.json            -> collection "briefings", doc_id = datum
  <outdir>/idea_<id>.json           -> collection "ideas", doc_id = <id>
  <outdir>/img/<id>_<n>.<ext>       -> gedownloade productfoto's (uploaden als artifact-asset,
                                       daarna asset-ids in idea.imageAssets zetten)
  <outdir>/writes.json              -> lijst voor ArtifactData "batch"
"""
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40] or "idee"


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    date = sys.argv[3] if len(sys.argv) > 3 else datetime.now().strftime("%Y-%m-%d")
    data = json.loads(src.read_text())
    out.mkdir(parents=True, exist_ok=True)
    (out / "img").mkdir(exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    writes = []

    b = dict(data.get("briefing", {}))
    b.update({"date": date, "generatedAt": now})
    (out / "briefing.json").write_text(json.dumps(b, ensure_ascii=False))
    writes.append({"op": "set", "collection": "briefings", "doc_id": date, "file_path": str((out / "briefing.json").resolve())})

    for idea in data.get("ideas", []):
        iid = f"{slug(idea.get('product', 'idee'))}-{date.replace('-', '')}"
        idea = dict(idea)
        idea.update({"date": date, "status": idea.get("status", "new"), "updatedAt": now})
        saved = []
        for n, url in enumerate(idea.get("images", [])[:3]):
            ext = (re.search(r"\.(jpe?g|png|webp)(?:\?|$)", url, re.I) or [None, "jpg"])[1].lower()
            dest = out / "img" / f"{iid}_{n}.{ext}"
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=20) as r:
                    body = r.read()
                if len(body) > 2000:
                    dest.write_bytes(body)
                    saved.append(str(dest.resolve()))
            except Exception as e:  # geblokkeerd of dood: link blijft wel in de prompt staan
                print(f"  foto niet gedownload ({iid} #{n}): {e}", file=sys.stderr)
        idea["_localImages"] = saved
        p = out / f"idea_{iid}.json"
        p.write_text(json.dumps({k: v for k, v in idea.items() if k != "_localImages"}, ensure_ascii=False))
        writes.append({"op": "set", "collection": "ideas", "doc_id": iid, "file_path": str(p.resolve())})
        print(f"{iid}: {len(saved)} foto('s) lokaal -> upload als asset en zet imageAssets")

    (out / "writes.json").write_text(json.dumps(writes, indent=1))
    print(f"{len(writes)} writes klaar in {out/'writes.json'}")


if __name__ == "__main__":
    main()
