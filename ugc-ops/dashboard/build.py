#!/usr/bin/env python3
"""Bouwt index.html uit src/ (één bestand voor het claude.ai-artifact).
Robot: Quaternius RobotExpressive (CC0), ingebakken als base64 omdat .glb geen artifact-bestandstype is."""
from pathlib import Path
d = Path(__file__).parent / "src"
fonts = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Pacifico&display=swap"
three = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/"
libs = ['<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'] + \
       [f'<script src="{three}{f}"></script>' for f in ["shaders/CopyShader.js","shaders/LuminosityHighPassShader.js","shaders/FXAAShader.js","postprocessing/EffectComposer.js","postprocessing/RenderPass.js","postprocessing/ShaderPass.js","postprocessing/UnrealBloomPass.js","loaders/GLTFLoader.js","utils/SkeletonUtils.js"]] + \
       ['<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>']
hq = (d/"hq.js").read_text().replace("/*__INITCHAT__*/", (d/"initchat.js").read_text())
out = "\n".join([
  "<title>Mila Studio</title>",
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  f'<link rel="stylesheet" href="{fonts}">',
  "<style>", (d/"style.css").read_text(), "</style>",
  (d/"body.html").read_text(),
  "<script>", (d/"app.js").read_text(), "</script>",
  *libs,
  '<script type="application/octet-stream" id="robotData">' + __import__("base64").b64encode((d.parent/"assets"/"robot.glb").read_bytes()).decode() + "</script>",
  "<script>", hq, "</script>", ""])
(Path(__file__).parent/"index.html").write_text(out)
print("index.html", len(out))
