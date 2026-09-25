(function(){
  const $ = id => document.getElementById(id);
  const stage = $("hqStage"), canvas = $("hqCanvas"), overlay = $("hqBubbles"), panel = $("p-hq"), card = $("hqCard");
  const CHAT_TRIGGER = "trig_01YaT9EyM6D2LA2d9e7ZHsk4";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const short = (s,n) => { s = String(s||"").replace(/\s+/g," ").trim(); return s.length>n ? s.slice(0,n-1)+"…" : s; };
  const S = () => window.__mcrState || {ideas:[],videos:[],lessons:[],meta:null};
  const fmtShort = iso => { try{ return new Date(iso).toLocaleString("nl-NL",{weekday:"short",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Amsterdam"}); }catch(e){ return ""; } };
  const hex = n => "#"+n.toString(16).padStart(6,"0");

  const AGENTS = [
    {id:"scout", name:"Trend-scout", icon:"🔭", color:0x2FE08A, home:[-6.0,-4.3], screen:"trends", role:"Zoekt elke ochtend virale producten die nog niet uitgemolken zijn, met de beste angles."},
    {id:"deal", name:"Deal-jager", icon:"💰", color:0xFFC53D, home:[-3.3,-4.9], screen:"deal", role:"Zoekt de hoogste commissie en gratis samples, en schrijft berichten aan sellers."},
    {id:"scriptwriter", name:"Scriptwriter", icon:"✍️", color:0xB57CFF, home:[1.4,-4.9], screen:"hook", role:"De UGC-legend: 10 hooks, beste structuur, zelfkritiek tot 8/10."},
    {id:"director", name:"AI-director", icon:"🎬", color:0xFF6A2E, home:[4.3,-4.2], screen:"model", role:"Kent alle Higgsfield-modellen en trucs: kiest model, modus en prompts."},
    {id:"producer", name:"Producer", icon:"🎧", color:0x4C8DFF, home:[6.6,-1.9], screen:"render", role:"Maakt basisbeeld, frames en clips, en plakt alles tot een video met hooktekst."},
    {id:"qa", name:"QA-checker", icon:"🔍", color:0x2EE6FF, home:[6.8,1.5], screen:"qa", role:"Controleert elke clip op handen, product, mond, extra objecten en audio."},
    {id:"analist", name:"Analist", icon:"📈", color:0xFF5A5A, home:[-6.8,-0.8], screen:"stats", role:"Meet views, kijktijd en verkopen en zegt wat werkt."},
    {id:"budget", name:"Budgetwaker", icon:"🪙", color:0x8BE04A, home:[-6.2,2.7], screen:"credits", role:"Bewaakt de credits en de kosten per video."},
    {id:"compliance", name:"Compliance", icon:"🛡️", color:0xA7B4CC, home:[-3.4,5.0], screen:"rules", role:"Houdt AI-label, prijzen en claims in de gaten."},
    {id:"comments", name:"Comment-manager", icon:"💬", color:0xFF5FB0, home:[3.7,5.0], screen:"comments", role:"Schrijft antwoorden op comments en maakt er reply-video's van."}
  ];
  const byId = Object.fromEntries(AGENTS.map(a=>[a.id,a]));

  // ---------- geluid + stem ----------
  let soundOn = false; try{ soundOn = localStorage.getItem("hq_sound")==="1"; }catch(e){}
  let actx = null;
  function beep(f=880, d=0.07, v=0.025){ if(!soundOn) return; try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(v, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime+d); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+d+0.02); }catch(e){} }
  function speak(text){ if(!soundOn || !window.speechSynthesis) return; try{ const u = new SpeechSynthesisUtterance(text); const vs = speechSynthesis.getVoices(); const nl = vs.find(v=>/^nl/i.test(v.lang)); if(nl) u.voice = nl; u.lang = nl ? nl.lang : "nl-NL"; u.rate = 1.03; u.pitch = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }

  // ---------- HUD ----------
  const hudState = $("hudState"), hudLog = $("hudLog"), hudFeed = $("hudFeed");
  function scramble(el, text){
    const chars = "▚▞▛▜ABCDEFGHJKLMNPRSTUVWXYZ0123456789#%&"; let i = 0; const n = text.length;
    clearInterval(el._sc); el._sc = setInterval(()=>{ i += Math.max(1, n/12); el.textContent = text.split("").map((c,k)=> k < i || c===" " ? c : chars[Math.floor(Math.random()*chars.length)]).join(""); if(i >= n){ clearInterval(el._sc); el.textContent = text; } }, 30);
  }
  const logLines = [];
  const who = id => id==="claude" ? ["JARVIS", 0xFF6A2E] : [byId[id].name.toUpperCase(), byId[id].color];
  function logLine(from, to, text){
    const t = new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"Europe/Amsterdam"});
    const [fn,fc] = who(from); const tt = to ? who(to) : null;
    logLines.unshift(`<div><span class="t">${t}</span> <b style="color:${hex(fc)}">${esc(fn)}</b>${tt?` → <b style="color:${hex(tt[1])}">${esc(tt[0])}</b>`:""} <span>${esc(short(text,72))}</span></div>`);
    logLines.length = Math.min(logLines.length, 6); hudLog.innerHTML = logLines.join("");
  }
  let chatMode = false;
  function feed(){
    const s = S(), now = Date.now(), vids = s.videos||[], need = [], work = [], done = [];
    vids.filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt))).forEach(v=>{ const t = new Date(v.scheduledAt).getTime(); if(t-now < 16*3600e3 && t > now-2*3600e3) need.push([`Productlink: ${v.product||v.title}`, fmtShort(v.scheduledAt)]); });
    vids.filter(v=>v.status==="made").forEach(v=>need.push([`Inplannen: ${v.title}`, "klaar"]));
    const c = s.meta && s.meta.credits; if(c!=null && c<40) need.push(["Credits bijkopen", `${Math.round(c)} over`]);
    const ni = (s.ideas||[]).filter(i=>i.status==="new").length; if(ni) need.push([`${ni} ideeën om te kiezen`, "Ideeën"]);
    if(chatMode) work.push(["JARVIS voert je opdracht uit", "live"]);
    const sched = vids.filter(v=>v.status==="scheduled"); if(sched.length) work.push([`${sched.length} posts ingepland`, "Metricool"]);
    const wait = vids.filter(v=>v.status==="posted" && !(v.metrics && v.metrics.views!=null)); if(wait.length) work.push([`Wacht op cijfers (${wait.length})`, "sync"]);
    vids.filter(v=>v.status==="posted").forEach(v=>done.push([`Gepost: ${v.title}`, v.metrics&&v.metrics.views!=null?`${v.metrics.views} views`:"—"]));
    done.push([`${(s.lessons||[]).length} lessen in geheugen`, "leert"]);
    const col = (title, cls, arr) => `<section class="${cls}"><h4>${title}<span>${arr.length}</span></h4>${arr.slice(0,4).map(([a,b])=>`<div class="it"><span>${esc(short(a,38))}</span><em>${esc(b)}</em></div>`).join("") || `<div class="it none">—</div>`}</section>`;
    hudFeed.innerHTML = col("HEEFT JOU NODIG","need",need) + col("BEZIG","work",work) + col("KLAAR","done",done);
  }
  function gauges(){
    const ams = new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Amsterdam"}));
    $("hudClockArc").setAttribute("stroke-dasharray", `${((ams.getHours()*60+ams.getMinutes())/1440*163).toFixed(1)} 163`);
    $("hudClockTxt").textContent = ams.toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"});
    const c = S().meta && S().meta.credits, f = c==null ? 0 : Math.max(0, Math.min(1, c/150));
    $("hudCredArc").setAttribute("stroke-dasharray", `${(f*163).toFixed(1)} 163`); $("hudCredArc").setAttribute("stroke", c!=null && c<40 ? "#FF5A5A" : "#2EE6FF");
    $("hudCredTxt").textContent = c==null ? "—" : Math.round(c);
  }

  function fallback(msg){ $("hqLoading").hidden = true; const f = $("hqFallback"); f.hidden = false; f.textContent = msg; }
  if(!window.THREE){ fallback("3D kon niet laden in deze weergave. De chat werkt wel."); initChat(); return; }
  const T = THREE;
  let renderer;
  try{ renderer = new T.WebGLRenderer({canvas, antialias:false, powerPreference:"high-performance"}); }catch(e){ fallback("3D (WebGL) wordt niet ondersteund op dit apparaat. De chat werkt wel."); initChat(); return; }
  const lowEnd = (navigator.deviceMemory && navigator.deviceMemory < 4) || Math.min(screen.width, screen.height) < 500;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, lowEnd ? 1.5 : 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;

  const scene = new T.Scene();
  scene.background = new T.Color(0x02050B);
  const cam = new T.OrthographicCamera(-10,10,10,-10,0.1,200);
  const view = {az:Math.PI/4, zoom:1, tx:0, tz:0, drift:0};
  let lastInteract = performance.now();
  function placeCam(){ const r = 30, az = view.az + view.drift; cam.position.set(view.tx + Math.sin(az)*r, 22, view.tz + Math.cos(az)*r); cam.lookAt(view.tx, 0.6, view.tz); }
  placeCam();

  scene.add(new T.HemisphereLight(0xA8D4FF, 0x0A0F1C, 0.45));
  const key = new T.DirectionalLight(0xFFE2C8, 0.75); key.position.set(8,16,10); key.castShadow = true;
  key.shadow.mapSize.set(lowEnd?1024:2048, lowEnd?1024:2048); Object.assign(key.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:1,far:50}); key.shadow.bias = -0.0008; key.shadow.normalBias = 0.02; scene.add(key);
  const rim = new T.DirectionalLight(0x2EE6FF, 0.6); rim.position.set(-12,8,-6); scene.add(rim);
  const rim2 = new T.DirectionalLight(0xFF6A2E, 0.5); rim2.position.set(10,6,-10); scene.add(rim2);

  const grad = new T.DataTexture(new Uint8Array([90,90,90, 170,170,170, 235,235,235]), 3, 1, T.RGBFormat);
  grad.minFilter = grad.magFilter = T.NearestFilter; grad.needsUpdate = true;
  const TOON = (c, o={}) => new T.MeshToonMaterial(Object.assign({color:c, gradientMap:grad}, o));
  const DARK = (c=0x121828, r=0.45, m=0.4) => new T.MeshStandardMaterial({color:c, roughness:r, metalness:m});
  const NEON = (c, o=1) => new T.MeshBasicMaterial({color:c, transparent:o<1, opacity:o, toneMapped:false});
  function mesh(geo, mat, x=0,y=0,z=0, parent=scene, shadow=true){ const m = new T.Mesh(geo, mat); m.position.set(x,y,z); if(shadow){ m.castShadow = true; m.receiveShadow = true; } parent.add(m); return m; }
  const box = (w,h,d,mat,x,y,z,p,sh=true) => mesh(new T.BoxGeometry(w,h,d), mat, x,y+h/2,z,p,sh);
  function glowTex(stops){ const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const rg = g.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col])=>rg.addColorStop(o,col)); g.fillStyle = rg; g.fillRect(0,0,128,128); const t = new T.CanvasTexture(c); return t; }
  const GLOW = glowTex([[0,"rgba(255,255,255,1)"],[0.35,"rgba(255,255,255,.35)"],[1,"rgba(255,255,255,0)"]]);
  const SHADOW = glowTex([[0,"rgba(0,0,0,.7)"],[0.6,"rgba(0,0,0,.25)"],[1,"rgba(0,0,0,0)"]]);
  function pool(x,z,r,color,op=0.5,parent=scene,y=0.02){ const m = new T.Mesh(new T.PlaneGeometry(r*2,r*2), new T.MeshBasicMaterial({map:GLOW, color, transparent:true, opacity:op, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false})); m.rotation.x = -Math.PI/2; m.position.set(x,y,z); parent.add(m); return m; }

  // ---------- kamer ----------
  const floor = box(18,0.4,14,DARK(0x0A1222,0.5,0.45),0,-0.4,0); floor.castShadow = false;
  const gridPts = []; for(let x=-9;x<=9;x+=1){ gridPts.push(x,0.012,-7, x,0.012,7); } for(let z=-7;z<=7;z+=1){ gridPts.push(-9,0.012,z, 9,0.012,z); }
  const gridGeo = new T.BufferGeometry(); gridGeo.setAttribute("position", new T.Float32BufferAttribute(gridPts,3));
  const gridMat = new T.LineBasicMaterial({color:0x2A6FA8, transparent:true, opacity:0.4, toneMapped:false}); scene.add(new T.LineSegments(gridGeo, gridMat));
  box(18.2,0.06,0.08,NEON(0x2EE6FF),0,0.0,7.0,scene,false); box(0.08,0.06,14.2,NEON(0x2EE6FF),9.0,0.0,0,scene,false);
  box(18,5,0.3,DARK(0x0B1222,0.6,0.3),0,0,-7.15); box(0.3,5,14,DARK(0x0D1426,0.6,0.3),-9.15,0,0);
  [0.3,4.85].forEach(y=>{ box(18,0.05,0.05,NEON(y<1?0xFF6A2E:0x2EE6FF),0,y,-6.98,scene,false); box(0.05,0.05,14,NEON(y<1?0xFF6A2E:0x2EE6FF),-8.98,y,0,scene,false); });
  for(let x=-8;x<=8;x+=4){ box(0.04,4.5,0.04,NEON(0x1D4E7A),x,0.3,-6.97,scene,false); }
  for(let z=-6;z<=6;z+=4){ box(0.04,4.5,0.04,NEON(0x1D4E7A),-8.97,0.3,z,scene,false); }
  // half-hoge glazen scheidingen met neon-rand
  function glassWall(x1,z1,x2,z2,c){ const L = Math.hypot(x2-x1,z2-z1), g = new T.Group(); g.position.set((x1+x2)/2,0,(z1+z2)/2); g.rotation.y = -Math.atan2(z2-z1,x2-x1); scene.add(g);
    mesh(new T.BoxGeometry(L,1.1,0.05), new T.MeshStandardMaterial({color:0x88DDFF, transparent:true, opacity:0.08, roughness:0.1, metalness:0.2, depthWrite:false}), 0,0.55,0, g, false);
    box(L,0.035,0.07,NEON(c),0,1.1,0,g,false); }
  glassWall(-9,-2.2,-5.2,-2.2,0x2FE08A); glassWall(9,-0.3,5.4,-0.3,0x4C8DFF); glassWall(-9,1.2,-5.4,1.2,0xFF5A5A);
  // plafondspots
  [[-5,-4.5,0x2FE08A],[4.5,-3.8,0xFF6A2E],[-5.5,3.4,0xFFC53D],[5.2,4.8,0xFF5FB0],[0,0,0x2EE6FF]].forEach(([x,z,c],i)=>{
    const cone = mesh(new T.ConeGeometry(i===4?2.2:1.8,7,32,1,true), new T.MeshBasicMaterial({color:c, transparent:true, opacity:0.035, side:T.DoubleSide, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false}), x,3.5,z, scene, false);
    pool(x,z,i===4?3.4:2.6,c,0.16); });

  // ---------- canvas-schermen ----------
  function screenTex(cw, ch){ const c = document.createElement("canvas"); c.width = cw; c.height = ch; const tex = new T.CanvasTexture(c); tex.anisotropy = 4; return {c, g:c.getContext("2d"), tex}; }
  function panelBg(g, w, h, accent, title){
    g.clearRect(0,0,w,h); const bg = g.createLinearGradient(0,0,0,h); bg.addColorStop(0,"rgba(6,16,36,.97)"); bg.addColorStop(1,"rgba(2,8,20,.97)"); g.fillStyle = bg; g.fillRect(0,0,w,h);
    g.strokeStyle = "rgba(46,230,255,.08)"; g.lineWidth = 1; for(let y=0;y<h;y+=4){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); }
    g.strokeStyle = accent; g.lineWidth = Math.max(2, w/220); g.strokeRect(g.lineWidth, g.lineWidth, w-g.lineWidth*2, h-g.lineWidth*2);
    g.fillStyle = accent; const s = w/36; [[0,0],[w-s,0],[0,h-s],[w-s,h-s]].forEach(([x,y])=>g.fillRect(x,y,s,s));
    g.font = `700 ${Math.round(h*0.11)}px Rajdhani, "JetBrains Mono", monospace`; g.textBaseline = "top";
    g.shadowColor = accent; g.shadowBlur = 14; g.fillText(title, w*0.05, h*0.07); g.shadowBlur = 0;
  }
  function textLines(g, lines, x, y, lh, color, font){ g.fillStyle = color; g.font = font; lines.forEach((l,i)=>g.fillText(l, x, y+i*lh)); }
  function wrap(g, text, maxW){ const words = String(text).split(" "), out = []; let line = ""; words.forEach(w=>{ const t = line ? line+" "+w : w; if(g.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if(line) out.push(line); return out; }

  const walls = {
    trends: Object.assign(screenTex(1024,560), {pos:[-4.9,1.55,-6.95], rot:0, w:4.6, h:2.5}),
    mission: Object.assign(screenTex(1024,560), {pos:[2.4,1.55,-6.95], rot:0, w:4.6, h:2.5}),
    ops: Object.assign(screenTex(1024,560), {pos:[-8.95,1.55,-0.5], rot:Math.PI/2, w:4.6, h:2.5})
  };
  Object.values(walls).forEach(W=>{ const m = mesh(new T.PlaneGeometry(W.w,W.h), new T.MeshBasicMaterial({map:W.tex, toneMapped:false}), W.pos[0], W.pos[1]+W.h/2, W.pos[2], scene, false); m.rotation.y = W.rot; W.mesh = m;
    const p = pool(W.pos[0] + (W.rot?0.9:0), W.pos[2] + (W.rot?0:0.9), 1.9, 0x2EE6FF, 0.2); });
  function drawWalls(t){
    const s = S();
    { const W = walls.trends, g = W.g, w = 1024, h = 560; panelBg(g,w,h,"#2FE08A","TREND-RADAR");
      const ideas = (s.ideas||[]).filter(i=>i.status!=="rejected").sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,5);
      ideas.forEach((i,k)=>{ const y = 130+k*80; g.fillStyle = "#CFE9FF"; g.font = `600 30px "IBM Plex Sans", sans-serif`; g.fillText(short(i.product,34), 50, y);
        g.fillStyle = "rgba(47,224,138,0.18)"; g.fillRect(50, y+40, 740, 14); g.fillStyle = "#2FE08A"; g.fillRect(50, y+40, 740*(i.score||0)/100*(0.96+0.04*Math.sin(t*2+k)), 14);
        g.font = `700 34px Rajdhani, monospace`; g.fillText(String(i.score||"—"), 830, y+10); });
      if(!ideas.length) textLines(g,["Radar leeg — start de trend-scout"],50,150,40,"#8FB3D9",`500 30px "IBM Plex Sans"`);
      W.tex.needsUpdate = true; }
    { const W = walls.mission, g = W.g, w = 1024, h = 560; panelBg(g,w,h,"#FF6A2E","MISSIE · POSTS");
      const vids = (s.videos||[]).filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt))).slice(0,6);
      vids.forEach((v,k)=>{ const y = 125+k*68; g.fillStyle = k===0 ? "#FF6A2E" : "#8FB3D9"; g.font = `700 28px Rajdhani, monospace`; g.fillText(fmtShort(v.scheduledAt).toUpperCase(), 50, y);
        g.fillStyle = "#EAF4FF"; g.font = `500 28px "IBM Plex Sans", sans-serif`; g.fillText(short(v.title,34), 300, y); });
      if(!vids.length) textLines(g,["Geen posts ingepland"],50,150,40,"#8FB3D9",`500 30px "IBM Plex Sans"`);
      W.tex.needsUpdate = true; }
    { const W = walls.ops, g = W.g, w = 1024, h = 560; panelBg(g,w,h,"#2EE6FF","OPS · BUDGET");
      const c = s.meta && s.meta.credits, vids = s.videos||[];
      g.fillStyle = "#EAF4FF"; g.font = `700 150px Rajdhani, monospace`; g.shadowColor = "#2EE6FF"; g.shadowBlur = 24; g.fillText(c==null?"—":String(Math.round(c)), 50, 120); g.shadowBlur = 0;
      g.fillStyle = "#8FB3D9"; g.font = `600 28px Rajdhani, monospace`; g.fillText("CREDITS", 55, 280);
      [["KLAAR",vids.filter(v=>v.status==="made").length,"#FFC53D"],["GEPLAND",vids.filter(v=>v.status==="scheduled").length,"#4C8DFF"],["GEPOST",vids.filter(v=>v.status==="posted").length,"#2FE08A"]].forEach(([l,n,col],k)=>{ const x = 520+k*160, bh = Math.min(300, 30+n*24); g.fillStyle = col; g.fillRect(x, 470-bh, 90, bh*(0.97+0.03*Math.sin(t*3+k))); g.fillStyle = "#EAF4FF"; g.font = `700 34px Rajdhani`; g.fillText(String(n), x+30, 470-bh-44); g.fillStyle = "#8FB3D9"; g.font = `600 22px Rajdhani`; g.fillText(l, x, 490); });
      W.tex.needsUpdate = true; }
  }

  // ---------- bureaus ----------
  function deskFor(a){
    const [hx,hz] = a.home, L = Math.hypot(hx,hz)||1, dx = hx/L, dz = hz/L;
    const g = new T.Group(); g.position.set(hx+dx*1.2, 0, hz+dz*1.2); g.rotation.y = Math.atan2(-dx,-dz); scene.add(g);
    box(1.9,0.08,0.95,DARK(0x1A2238,0.3,0.6),0,0.82,0,g);
    box(1.9,0.03,0.03,NEON(a.color),0,0.9,0.47,g,false);
    box(0.12,0.82,0.8,DARK(0x0B0F1A),-0.85,0,0,g); box(0.12,0.82,0.8,DARK(0x0B0F1A),0.85,0,0,g);
    box(1.05,0.66,0.05,DARK(0x05080F),0,1.02,-0.28,g);
    const sc = screenTex(384,232); mesh(new T.PlaneGeometry(0.96,0.58), new T.MeshBasicMaterial({map:sc.tex, toneMapped:false}), 0,1.35,-0.25,g,false);
    box(0.52,0.02,0.18,DARK(0x222A40),0,0.9,0.1,g);
    pool(0,0,1.1,a.color,0.22,g,0.03);
    a.desk = g; a.sc = sc; a.facing = Math.atan2(dx,dz);
  }
  AGENTS.forEach(deskFor);
  function drawDesk(a, t){
    const s = S(), g = a.sc.g, w = 384, h = 232, col = hex(a.color);
    panelBg(g,w,h,col,a.name.toUpperCase());
    const ideas = (s.ideas||[]).filter(i=>i.status==="new"||i.status==="selected").sort((x,y)=>(y.score||0)-(x.score||0));
    const top = ideas[0], c = s.meta && s.meta.credits, vids = s.videos||[];
    const f = `500 19px "IBM Plex Sans", sans-serif`, fb = `700 48px Rajdhani, monospace`;
    const lines = {
      trends: ideas.slice(0,3).map(i=>`${i.score||"—"}  ${short(i.product,22)}`),
      deal: top ? wrap(g, `Commissie: ${short(top.commission||"onbekend",60)}`, w-40).slice(0,3) : ["Wacht op screenshots"],
      hook: top && top.concepts && top.concepts[0] ? wrap(g, `“${top.concepts[0].hook}”`, w-40).slice(0,4) : ["Nieuwe hooks…"],
      model: ["KLING 3.0 · STD", "1,75 cr/s · 3×7s", "lipsync ≤ 7s"],
      qa: ["handen   ✓","product  ✓","mond     ✓","audio    ✓"],
      rules: ["AI-label  AAN","prijs     check","claims    scan"],
      comments: ["reply-video's", "binnen 1 uur", "antwoorden"]
    }[a.screen] || [];
    g.font = f;
    if(a.screen==="render"){ const p = (t*0.12)%1; g.fillStyle = "rgba(76,141,255,.2)"; g.fillRect(20,110,w-40,22); g.fillStyle = col; g.fillRect(20,110,(w-40)*p,22); textLines(g,[`clip ${1+Math.floor(p*3)}/3 · ${Math.round(p*100)}%`],20,150,26,"#EAF4FF",f); }
    else if(a.screen==="credits"){ textLines(g,[c==null?"—":String(Math.round(c))],20,66,40,"#EAF4FF",fb); textLines(g,["credits over"],20,132,26,"#8FB3D9",f); }
    else if(a.screen==="stats"){ [["gepland",vids.filter(v=>v.status==="scheduled").length],["gepost",vids.filter(v=>v.status==="posted").length],["klaar",vids.filter(v=>v.status==="made").length]].forEach(([l,n],k)=>{ const bw = Math.min(230, 20+n*20); g.fillStyle = col; g.fillRect(110,72+k*44,bw*(0.95+0.05*Math.sin(t*2+k)),24); textLines(g,[l],20,74+k*44,20,"#8FB3D9",f); textLines(g,[String(n)],120+bw,74+k*44,20,"#EAF4FF",f); }); }
    else textLines(g, lines, 20, 66, 30, "#EAF4FF", f);
    a.sc.tex.needsUpdate = true;
  }

  // ---------- decor ----------
  const holo = new T.Group(); holo.position.set(-7.9,1.8,-5.9); scene.add(holo);
  mesh(new T.IcosahedronGeometry(0.62,2), new T.MeshBasicMaterial({color:0x2FE08A, wireframe:true, transparent:true, opacity:0.7, toneMapped:false}), 0,0,0, holo, false);
  mesh(new T.CylinderGeometry(0.35,0.5,0.9,16), DARK(), -7.9,0,-5.9); mesh(new T.CylinderGeometry(0.36,0.36,0.03,24), NEON(0x2FE08A), -7.9,0.91,-5.9, scene, false); pool(-7.9,-5.9,1.2,0x2FE08A,0.4);
  // serverracks met knipperende leds
  const ledTex = screenTex(128,256); const racks = [];
  for(let i=0;i<3;i++){ const x = -8.5, z = 4.2+i*0.9; box(0.7,2.4,0.8,DARK(0x070B14,0.5,0.6),x,0,z); const f = mesh(new T.PlaneGeometry(0.6,2.2), new T.MeshBasicMaterial({map:ledTex.tex, transparent:true, toneMapped:false}), x+0.36,1.2,z,scene,false); f.rotation.y = Math.PI/2; racks.push(f); }
  function drawLeds(t){ const g = ledTex.g; g.clearRect(0,0,128,256); for(let r=0;r<22;r++) for(let c=0;c<6;c++){ const on = Math.sin(t*3+r*1.7+c*2.3+Math.sin(r*c))>0.2; g.fillStyle = on ? (c%3===0?"#2EE6FF":c%3===1?"#2FE08A":"#FF6A2E") : "rgba(46,230,255,.08)"; g.fillRect(14+c*18, 10+r*11, 8, 4); } ledTex.tex.needsUpdate = true; }
  const sofa = new T.Group(); sofa.position.set(7.0,0,-6.35); scene.add(sofa);
  const sofaM = TOON(0x8F8C88);
  box(2.6,0.5,1.0,sofaM,0,0.22,0,sofa); box(2.6,0.85,0.28,sofaM,0,0.45,-0.4,sofa); box(0.28,0.7,1.0,sofaM,-1.3,0.22,0,sofa); box(0.28,0.7,1.0,sofaM,1.3,0.22,0,sofa);
  box(0.55,0.45,0.18,TOON(0xE0A614),-0.6,0.72,-0.2,sofa); box(1.4,0.1,0.85,TOON(0xDCCDB8),0.4,0.72,0.1,sofa);
  const ringLight = mesh(new T.TorusGeometry(0.5,0.05,10,40), NEON(0xFFF3E0), 5.6,2.0,-4.9, scene, false); ringLight.rotation.y = -0.5;
  mesh(new T.CylinderGeometry(0.03,0.03,1.5,6), DARK(), 5.6,0.75,-4.9); pool(6.8,-5.6,2.2,0xFFD9B0,0.25);
  const phone = new T.Group(); phone.position.set(7.4,0,5.1); phone.rotation.y = -0.8; scene.add(phone);
  box(1.1,2.0,0.1,DARK(0x05070D),0,0.3,0,phone);
  mesh(new T.PlaneGeometry(0.98,1.86), NEON(0xFE2C55), 0,1.3,0.055,phone,false); pool(7.4,5.1,1.6,0xFE2C55,0.35);
  const hearts = []; for(let i=0;i<5;i++) hearts.push(mesh(new T.SphereGeometry(0.08,8,6), NEON(0xFFFFFF), (i-2)*0.18, 0.9, 0.08, phone, false));
  [[5.4,5.8,0xFF5FB0],[6.5,6.2,0x2EE6FF]].forEach(([x,z,c])=>{ const b = mesh(new T.SphereGeometry(0.55,18,12), TOON(c), x,0.38,z); b.scale.set(1,0.7,1); });
  function plant(x,z){ mesh(new T.CylinderGeometry(0.3,0.24,0.55,14), DARK(0x1A2236), x,0.27,z); for(let i=0;i<5;i++){ const l = mesh(new T.SphereGeometry(0.3,10,8), TOON(i%2?0x1F9D5A:0x2FE08A), x+Math.cos(i*1.3)*0.2, 0.8+i*0.12, z+Math.sin(i*1.9)*0.2); l.scale.set(1,1.4,1); } }
  plant(8.4,-6.4); plant(-1.2,6.3);

  // ---------- JARVIS-kern met holotafel ----------
  const core = new T.Group(); scene.add(core);
  mesh(new T.CylinderGeometry(1.35,1.5,0.7,48), DARK(0x0B1222,0.3,0.7), 0,0.35,0, core);
  mesh(new T.TorusGeometry(1.36,0.035,8,64), NEON(0x2EE6FF), 0,0.71,0, core, false).rotation.x = Math.PI/2;
  mesh(new T.TorusGeometry(1.0,0.02,8,64), NEON(0xFF6A2E,0.8), 0,0.72,0, core, false).rotation.x = Math.PI/2;
  pool(0,0,3.2,0x2EE6FF,0.45);
  const beam = mesh(new T.CylinderGeometry(0.85,1.2,3.4,48,1,true), new T.MeshBasicMaterial({color:0x2EE6FF, transparent:true, opacity:0.06, side:T.DoubleSide, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false}), 0,2.4,0, core, false);
  const orbU = {c:{value:new T.Color(0x2EE6FF)}, t:{value:0}, glow:{value:1}};
  const orbMat = new T.ShaderMaterial({uniforms:orbU, transparent:true, depthWrite:false, toneMapped:false,
    vertexShader:`varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:`uniform vec3 c; uniform float t; uniform float glow; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.-abs(vN.z), 2.0); float band = smoothstep(.93,1.,sin(vP.y*24.-t*4.)); float hexg = smoothstep(.95,1.,sin(vP.x*30.+t)*sin(vP.z*30.)); vec3 col = c*(0.16 + f*1.8*glow) + c*band*.6 + c*hexg*.3; gl_FragColor = vec4(col, .3 + f*.7); }`});
  const CY = 2.35;
  const orb = mesh(new T.SphereGeometry(0.72,48,32), orbMat, 0,CY,0, core, false);
  const coreBall = mesh(new T.SphereGeometry(0.24,24,16), NEON(0xDFFBFF), 0,CY,0, core, false);
  const rings = [0,1,2].map(i=>{ const r = mesh(new T.TorusGeometry(1.0+i*0.18,0.018,6,80), NEON(i===1?0xFF6A2E:0x2EE6FF,0.9), 0,CY,0, core, false); r.rotation.set(Math.PI/2+i*0.5, i*0.8, 0); return r; });
  const pN = lowEnd ? 260 : 520, pPos = new Float32Array(pN*3), pSeed = [];
  for(let i=0;i<pN;i++) pSeed.push([1.2+Math.random()*1.2, Math.random()*Math.PI*2, (Math.random()-0.5)*2, 0.2+Math.random()*0.8]);
  const pGeo = new T.BufferGeometry(); pGeo.setAttribute("position", new T.BufferAttribute(pPos,3));
  const pMat = new T.PointsMaterial({color:0x2EE6FF, size:2.2, sizeAttenuation:false, transparent:true, opacity:0.9, depthWrite:false, blending:T.AdditiveBlending, toneMapped:false});
  const parts = new T.Points(pGeo, pMat); parts.position.y = CY; core.add(parts);
  // zwevende post-kaarten rond de kern
  const cards = [];
  for(let i=0;i<5;i++){ const st = screenTex(256,140); const m = mesh(new T.PlaneGeometry(1.1,0.6), new T.MeshBasicMaterial({map:st.tex, transparent:true, side:T.DoubleSide, toneMapped:false, depthWrite:false}), 0,CY,0, core, false); cards.push({m, st}); }
  function drawCards(){
    const vids = (S().videos||[]).filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt)));
    cards.forEach((c,i)=>{ const v = vids[i], g = c.st.g; g.clearRect(0,0,256,140); c.m.visible = !!v; if(!v) return;
      g.fillStyle = "rgba(4,14,34,.82)"; g.fillRect(0,0,256,140); g.strokeStyle = i===0?"#FF6A2E":"#2EE6FF"; g.lineWidth = 3; g.strokeRect(2,2,252,136);
      g.fillStyle = i===0?"#FF6A2E":"#2EE6FF"; g.font = `700 30px Rajdhani, monospace`; g.textBaseline = "top"; g.fillText(fmtShort(v.scheduledAt).toUpperCase(), 14, 12);
      g.fillStyle = "#EAF4FF"; g.font = `600 20px "IBM Plex Sans", sans-serif`; wrap(g, v.title, 228).slice(0,2).forEach((l,k)=>g.fillText(l, 14, 58+k*26)); c.st.tex.needsUpdate = true; });
  }
  const dN = lowEnd ? 140 : 300, dPos = new Float32Array(dN*3); for(let i=0;i<dN;i++){ dPos[i*3] = (Math.random()-0.5)*18; dPos[i*3+1] = Math.random()*5; dPos[i*3+2] = (Math.random()-0.5)*14; }
  const dust = new T.Points(new T.BufferGeometry().setAttribute("position", new T.BufferAttribute(dPos,3)), new T.PointsMaterial({color:0x6FD8FF, size:1.5, sizeAttenuation:false, transparent:true, opacity:0.4, depthWrite:false, toneMapped:false}));
  scene.add(dust);
  const coreLight = new T.PointLight(0x2EE6FF, 1.4, 9, 1.6); coreLight.position.set(0,CY,0); scene.add(coreLight);
  const ORB = {idle:{c:0x2EE6FF, spin:0.5, label:"STAND-BY · SYSTEMEN ONLINE"}, thinking:{c:0xFF6A2E, spin:3.2, label:"BEZIG · TEAM AAN HET WERK"}, responding:{c:0xFFF1C9, spin:1.4, label:"ANTWOORD ONTVANGEN"}};
  let orbState = "idle", orbPulse = 0;
  function setOrb(st){ orbState = st; const o = ORB[st]; orbU.c.value.set(o.c); pMat.color.set(o.c); coreLight.color.set(o.c); rings[0].material.color.set(o.c); rings[2].material.color.set(o.c); beam.material.color.set(o.c); scramble(hudState, o.label); orbPulse = 1; }

  // ---------- agents ----------
  const hitboxes = [];
  AGENTS.forEach(a=>{
    const g = new T.Group(); g.position.set(a.home[0],0,a.home[1]); g.rotation.y = a.facing; scene.add(g);
    const sh = new T.Mesh(new T.PlaneGeometry(1.4,1.4), new T.MeshBasicMaterial({map:SHADOW, transparent:true, depthWrite:false})); sh.rotation.x = -Math.PI/2; sh.position.y = 0.015; g.add(sh);
    const pad = mesh(new T.RingGeometry(0.5,0.6,40), NEON(a.color,0.9), 0,0.025,0, g, false); pad.rotation.x = -Math.PI/2;
    const padGlow = pool(0,0,0.9,a.color,0.35,g,0.02);
    const body = new T.Group(); g.add(body);
    const hit = new T.Mesh(new T.CylinderGeometry(0.6,0.6,2,8), new T.MeshBasicMaterial({visible:false})); hit.position.y = 1; hit.userData.agent = a.id; g.add(hit); hitboxes.push(hit);
    Object.assign(a, {g, body, pad, padGlow, target:null, then:null, bob:Math.random()*6, busy:false, speed:2.2, mood:0, now:"aan het werk", wantFace:a.facing});
  });

  // robots laden (CC0 Quaternius RobotExpressive, meegepubliceerd als robot.glb)
  let robotsReady = false;
  function play(a, name, once=false, fade=0.25){
    if(!a.actions) return; const next = a.actions[name]; if(!next) return;
    if(a.curName===name && !once) return;
    next.reset(); next.setEffectiveTimeScale(name==="Walking"?1.15:1); next.setEffectiveWeight(1);
    if(once){ next.setLoop(T.LoopOnce,1); next.clampWhenFinished = true; } else next.setLoop(T.LoopRepeat, Infinity);
    if(a.cur && a.cur!==next) a.cur.fadeOut(fade);
    next.fadeIn(fade).play(); a.cur = next; a.curName = name;
  }
  function makeBean(a){
    const b = a.body, M = TOON(a.color);
    const tor = mesh(new T.SphereGeometry(0.42,20,16), M, 0,0.62,0, b); tor.scale.set(1,1.18,0.95);
    const head = mesh(new T.SphereGeometry(0.36,22,16), TOON(0xF3D2B8), 0,1.32,0, b);
    [-0.13,0.13].forEach(x=>mesh(new T.SphereGeometry(0.055,10,8), TOON(0x15161A), x,1.36,0.32, b,false));
    a.beanFeet = [-1,1].map(s=>{ const f = mesh(new T.SphereGeometry(0.13,10,8), TOON(0x1A1F2E), s*0.17,0.08,0.05, b); f.scale.set(1,0.6,1.35); return f; });
  }
  function initRobots(gltf){
    const base = gltf.scene; const bb = new T.Box3().setFromObject(base); const hgt = bb.max.y - bb.min.y || 1; const sc = 1.95/hgt;
    AGENTS.forEach(a=>{
      const m = T.SkeletonUtils ? T.SkeletonUtils.clone(base) : base.clone(true);
      m.scale.setScalar(sc);
      m.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; const mat = o.material.clone(); if(/Main/i.test(mat.name)){ mat.color.set(a.color); mat.emissive = new T.Color(a.color); mat.emissiveIntensity = 0.06; mat.roughness = 0.4; mat.metalness = 0.15; } else if(/Black/i.test(mat.name)){ mat.emissive = new T.Color(0x0A2A3A); mat.emissiveIntensity = 0.6; } o.material = mat; } });
      a.body.add(m); a.mixer = new T.AnimationMixer(m); a.actions = {};
      gltf.animations.forEach(c=>a.actions[c.name] = a.mixer.clipAction(c));
      a.mixer.addEventListener("finished", ()=>{ play(a, a.target ? (a.running?"Running":"Walking") : "Idle"); });
      play(a, "Idle", false, 0); if(a.actions.Idle) a.actions.Idle.time = Math.random()*3;
    });
    robotsReady = true;
  }
  function useBeans(){ if(robotsReady) return; AGENTS.forEach(makeBean); robotsReady = true; }
  (function loadRobots(){
    const done = ()=>{ $("hqLoading").hidden = true; };
    if(!T.GLTFLoader){ useBeans(); done(); return; }
    const to = setTimeout(()=>{ useBeans(); done(); }, 12000);
    const ok = gltf=>{ clearTimeout(to); if(!robotsReady){ try{ initRobots(gltf); }catch(e){ useBeans(); } } done(); };
    const fail = ()=>{ clearTimeout(to); useBeans(); done(); };
    setTimeout(()=>{ try{
      const el = document.getElementById("robotData"); if(!el) throw 0;
      const bin = atob(el.textContent.trim()), buf = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) buf[i] = bin.charCodeAt(i);
      new T.GLTFLoader().parse(buf.buffer, "", ok, fail);
    }catch(e){ fail(); } }, 30);
  })();

  // ---------- pakketjes ----------
  const packets = [];
  function packet(from, to, color, dur=0.9){
    const m = mesh(new T.SphereGeometry(0.11,12,8), NEON(color), 0,0,0, scene, false);
    const glow = pool(0,0,0.5,color,0.9,scene); glow.rotation.x = 0; glow.lookAt(cam.position);
    packets.push({m, glow, a:from.clone(), b:to.clone(), t:0, dur}); beep(1200, 0.05, 0.02);
  }
  function updPackets(dt){
    for(let i=packets.length-1;i>=0;i--){ const p = packets[i]; p.t += dt/p.dur; const k = Math.min(1,p.t);
      const x = p.a.x+(p.b.x-p.a.x)*k, z = p.a.z+(p.b.z-p.a.z)*k, y = p.a.y+(p.b.y-p.a.y)*k + Math.sin(k*Math.PI)*2.4;
      p.m.position.set(x,y,z); p.glow.position.set(x,y,z); p.glow.quaternion.copy(cam.quaternion);
      if(p.t >= 1){ scene.remove(p.m); scene.remove(p.glow); packets.splice(i,1); beep(660,0.06,0.02); } }
  }

  // ---------- labels + bubbels ----------
  const labels = {};
  AGENTS.forEach(a=>{ const d = document.createElement("div"); d.className = "hq-name"; d.textContent = a.icon + " " + a.name; d.style.setProperty("--c", hex(a.color)); overlay.appendChild(d); labels[a.id] = d; });
  const bubbles = [];
  function say(who, text, ms=3400, kind=""){ const d = document.createElement("div"); d.className = "hq-bubble " + kind; d.textContent = text; overlay.appendChild(d); bubbles.push({who, d, until:performance.now()+ms}); }
  const v3 = new T.Vector3();
  function project(pos, dy){ v3.set(pos.x, pos.y+dy, pos.z).project(cam); return [(v3.x*0.5+0.5)*stage.clientWidth, (-v3.y*0.5+0.5)*stage.clientHeight]; }
  const corePos = new T.Vector3(0,CY,0);
  function placeOverlay(now){
    AGENTS.forEach(a=>{ const [x,y] = project(a.g.position, -0.3); labels[a.id].style.transform = `translate(${x}px,${y}px) translate(-50%,0)`; });
    const W = stage.clientWidth;
    for(let i=bubbles.length-1;i>=0;i--){ const b = bubbles[i];
      if(now > b.until){ b.d.classList.add("out"); if(now > b.until+260){ b.d.remove(); bubbles.splice(i,1); continue; } }
      const [x,y] = b.who==="claude" ? project(corePos, 1.4) : project(byId[b.who].g.position, 2.1);
      const hw = (b.w || (b.w = b.d.offsetWidth))/2; const cx = Math.max(hw+8, Math.min(W-hw-8, x));
      b.d.style.transform = `translate(${cx}px,${Math.max(y, 64)}px) translate(-50%,-100%)`; }
  }

  // ---------- beweging ----------
  const angDiff = (a,b) => { let d = a-b; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; return d; };
  function walkTo(a, x, z, then, run=false){ a.target = new T.Vector3(x,0,z); a.then = then||null; a.running = run; a.speed = run ? 4.2 : 2.2; play(a, run ? "Running" : "Walking"); }
  function goHome(a, then){ walkTo(a, a.home[0], a.home[1], ()=>{ a.busy = false; a.now = "aan het werk"; a.wantFace = a.facing; then && then(); }); }
  function face(a, pos){ a.wantFace = Math.atan2(pos.x-a.g.position.x, pos.z-a.g.position.z); }
  function update(a, dt, t){
    if(a.mixer) a.mixer.update(dt);
    if(a.target){
      const p = a.g.position, dx = a.target.x-p.x, dz = a.target.z-p.z, d = Math.hypot(dx,dz);
      if(d < 0.06){ a.target = null; a.running = false; play(a, "Idle"); const f = a.then; a.then = null; f && f(); }
      else { const s = Math.min(d, a.speed*dt); p.x += dx/d*s; p.z += dz/d*s; a.wantFace = Math.atan2(dx,dz); }
      if(a.beanFeet){ a.bob += dt*9; a.beanFeet[0].position.z = 0.05+Math.sin(a.bob)*0.14; a.beanFeet[1].position.z = 0.05-Math.sin(a.bob)*0.14; a.body.position.y = Math.abs(Math.sin(a.bob))*0.08; }
    } else if(a.beanFeet){ a.body.position.y = a.mood>0 ? Math.abs(Math.sin(t*9))*0.3 : 0; }
    a.g.rotation.y += angDiff(a.wantFace, a.g.rotation.y)*Math.min(1, dt*8);
    const act = a.talking || a.target;
    a.pad.material.opacity = act ? 0.6+0.4*Math.abs(Math.sin(t*6)) : 0.8;
    a.padGlow.material.opacity = act ? 0.5 : 0.3;
    if(a.mood>0) a.mood -= dt;
  }

  // ---------- verhaallijnen uit echte data ----------
  function beats(){
    const s = S(), out = [];
    const ideas = (s.ideas||[]).filter(i=>i.status==="new"||i.status==="selected").sort((a,b)=>(b.score||0)-(a.score||0));
    const top = ideas[Math.floor(Math.random()*Math.min(3,ideas.length))];
    const vids = s.videos||[];
    const next = vids.filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt)))[0];
    const credits = s.meta && s.meta.credits, posted = vids.filter(v=>v.status==="posted");
    const L = area => (s.lessons||[]).filter(l=>l.area===area);
    const pick = arr => arr[Math.floor(Math.random()*arr.length)];
    if(top) out.push({from:"scout", to:"scriptwriter", text:`Nieuw idee: ${short(top.product,34)} · ${top.score}`, reply:"Ik schrijf 10 hooks ✍️"});
    if(top && top.commission) out.push({from:"deal", to:"scout", text:`Commissie: ${short(top.commission,34)}`, reply:"Vraag Loka om een screenshot"});
    const hook = top && top.concepts && top.concepts[0] && top.concepts[0].hook;
    out.push({from:"scriptwriter", to:"director", text: hook ? `Hook: “${short(hook,46)}”` : "Script klaar, score 8/10", reply:"Kling std, 3×7s 🎬"});
    out.push({from:"director", to:"producer", text:"Eerst basisbeeld, dan frames", reply:"Komt eraan!"});
    out.push({from:"producer", to:"qa", text:"Clips gerenderd", reply:"Handen ✓ product ✓ mond ✓"});
    if(credits!=null) out.push({from:"budget", to:"producer", text:`Nog ${Math.round(credits)} credits`, reply: credits<40 ? "Eerst top-up dan 😬" : "Genoeg voor een video"});
    if(next) out.push({from:"analist", to:"comments", text:`Volgende post: ${short(next.title,24)} · ${fmtShort(next.scheduledAt)}`, reply:"Ik sta klaar voor de comments 💬"});
    out.push({from:"analist", to:"scout", text: posted.length ? `${posted.length} gepost, cijfers volgen` : "Nog geen cijfers binnen", reply:"Noted 📈"});
    if(L("compliance").length) out.push({from:"compliance", to:"scriptwriter", text:short(pick(L("compliance")).rule,64), reply:"Begrepen ✔"});
    if(L("production").length) out.push({from:"qa", to:"director", text:short(pick(L("production")).rule,64), reply:"Staat in de lessen 📚"});
    if(L("script").length) out.push({from:"director", to:"scriptwriter", text:short(pick(L("script")).rule,64), reply:"Yes chef"});
    out.push({from:"comments", to:"analist", text:"Comments? Stuur screenshots in de chat!", reply:"Zodra er views zijn"});
    return out.sort(()=>Math.random()-0.5);
  }
  let queue = [];
  const headPos = a => new T.Vector3(a.g.position.x, 1.5, a.g.position.z);
  function runBeat(){
    if(chatMode || !robotsReady) return;
    if(!queue.length) queue = beats();
    const b = queue.shift(); if(!b) return;
    const A = byId[b.from], B = byId[b.to]; if(A.busy || B.busy) return;
    A.busy = B.busy = true;
    const walked = Math.random() < 0.55;
    const talk = () => {
      face(A, B.g.position); face(B, A.g.position); A.talking = true; A.now = short(b.text,60);
      play(A, walked ? "Wave" : "ThumbsUp", true);
      say(A.id, b.text, 3300); logLine(A.id, B.id, b.text);
      setTimeout(()=>{ A.talking = false; B.talking = true; play(B, Math.random()<0.8 ? "Yes" : "ThumbsUp", true); say(B.id, b.reply, 2300, "reply"); }, 1700);
      setTimeout(()=>{ B.talking = false; B.busy = false; B.wantFace = B.facing; if(walked) goHome(A); else { A.busy = false; A.wantFace = A.facing; } }, 4300);
    };
    if(walked){ A.now = "loopt naar " + B.name; const dx = A.g.position.x-B.g.position.x, dz = A.g.position.z-B.g.position.z, d = Math.hypot(dx,dz)||1; walkTo(A, B.g.position.x+dx/d*1.15, B.g.position.z+dz/d*1.15, talk); }
    else { A.now = "stuurt data naar " + B.name; packet(headPos(A), headPos(B), A.color); setTimeout(talk, 900); }
  }
  setInterval(()=>{ if(!document.hidden && !panel.hidden) runBeat(); }, 2300);

  // ---------- interactie ----------
  let drag = null;
  canvas.addEventListener("pointerdown", e=>{ drag = {x:e.clientX, az:view.az, moved:false}; lastInteract = performance.now(); });
  window.addEventListener("pointermove", e=>{ if(!drag) return; const dx = e.clientX-drag.x; if(Math.abs(dx)>4) drag.moved = true; view.az = Math.max(0.05, Math.min(Math.PI/2-0.05, drag.az - dx*0.006)); lastInteract = performance.now(); placeCam(); });
  window.addEventListener("pointerup", e=>{ if(drag && !drag.moved) pickAt(e); drag = null; });
  canvas.addEventListener("wheel", e=>{ e.preventDefault(); lastInteract = performance.now(); view.zoom = Math.max(0.8, Math.min(2.8, view.zoom*(e.deltaY>0?0.92:1.08))); resize(); }, {passive:false});
  const ray = new T.Raycaster(), mv = new T.Vector2();
  function pickAt(e){
    const r = canvas.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) return;
    mv.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1); ray.setFromCamera(mv, cam);
    const hit = ray.intersectObjects(hitboxes)[0];
    if(hit) showCard(byId[hit.object.userData.agent]); else if(ray.intersectObject(orb)[0]) showCard(null); else { card.hidden = true; }
  }
  function fly(x, z, zoom){ lastInteract = performance.now(); if(window.gsap){ gsap.to(view, {tx:x, tz:z, zoom, duration:1.1, ease:"power3.inOut", onUpdate:()=>{ placeCam(); resize(); }}); } else { Object.assign(view,{tx:x,tz:z,zoom}); placeCam(); resize(); } }
  function showCard(a){
    card.hidden = false; beep(990,0.08,0.03);
    if(!a){ card.innerHTML = `<div class="hq-card-h"><span class="dot" style="background:#2EE6FF;box-shadow:0 0 10px #2EE6FF"></span><b>JARVIS</b><button class="x" aria-label="Sluiten">×</button></div><p>De kern. Krijgt jouw opdrachten uit de chat en zet het team aan het werk.</p><div class="small">Status: ${esc(ORB[orbState].label)}</div>`; fly(0,0,1.7); }
    else {
      card.innerHTML = `<div class="hq-card-h"><span class="dot" style="background:${hex(a.color)};box-shadow:0 0 10px ${hex(a.color)}"></span><b>${esc(a.icon+" "+a.name)}</b><button class="x" aria-label="Sluiten">×</button></div><p>${esc(a.role)}</p><div class="small">Nu: ${esc(a.now)}</div><button class="btn primary sm" data-ask="${esc(a.name)}">Opdracht voor ${esc(a.name)}</button>`;
      a.mood = 1.2; if(!a.target){ face(a, cam.position); play(a, "Wave", true); setTimeout(()=>{ if(!a.busy) a.wantFace = a.facing; }, 2200); }
      say(a.id, ["Tot uw dienst 👋","Druk druk druk","Wat kan ik doen?","Bijna klaar!","Zeg het maar, baas"][Math.floor(Math.random()*5)], 1900);
      fly(a.g.position.x, a.g.position.z, 2.1);
    }
    card.querySelector(".x").onclick = ()=>{ card.hidden = true; fly(0,0,1); };
    const ask = card.querySelector("[data-ask]"); if(ask) ask.onclick = ()=>{ const i = $("hqInput"); i.value = "@"+ask.dataset.ask+" "; i.focus(); };
  }
  $("hudCam").onclick = ()=>{ card.hidden = true; if(window.gsap) gsap.to(view,{az:Math.PI/4,duration:0.9,ease:"power2.inOut",onUpdate:placeCam}); else view.az = Math.PI/4; fly(0,0,1); };
  function syncSoundBtn(){ const b = $("hudSound"); b.textContent = soundOn ? "🔊" : "🔇"; b.setAttribute("aria-pressed", soundOn); b.title = soundOn ? "JARVIS-stem aan" : "JARVIS-stem uit"; }
  $("hudSound").onclick = ()=>{ soundOn = !soundOn; try{ localStorage.setItem("hq_sound", soundOn?"1":"0"); }catch(e){} syncSoundBtn(); if(soundOn){ beep(880,0.1,0.04); speak("JARVIS online. Tot uw dienst."); } else if(window.speechSynthesis) speechSynthesis.cancel(); };
  syncSoundBtn();
  let fxOn = !lowEnd; try{ const f = localStorage.getItem("hq_fx"); if(f) fxOn = f==="1"; }catch(e){}
  $("hudFx").onclick = ()=>{ fxOn = !fxOn; try{ localStorage.setItem("hq_fx", fxOn?"1":"0"); }catch(e){} $("hudFx").setAttribute("aria-pressed", fxOn); };
  $("hudFx").setAttribute("aria-pressed", fxOn);
  $("hudFeedBtn").onclick = ()=>{ stage.classList.toggle("feed-open"); };

  // ---------- post-processing ----------
  let composer = null, bloom = null, fxaa = null, finalPass = null;
  const FinalShader = {uniforms:{tDiffuse:{value:null}, t:{value:0}, amount:{value:0.0016}},
    vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:`uniform sampler2D tDiffuse; uniform float t; uniform float amount; varying vec2 vUv; float rnd(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233)))*43758.5453); }
      void main(){ vec2 d = vUv-.5; float r2 = dot(d,d); vec2 off = d*amount*(1.+r2*6.); vec4 c; c.r = texture2D(tDiffuse, vUv+off).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv-off).b; c.a = 1.;
      c.rgb *= 1. - r2*0.85; c.rgb += (rnd(vUv*1000.+t)-.5)*0.03; gl_FragColor = c; }`};
  try{
    if(T.EffectComposer && T.UnrealBloomPass){
      composer = new T.EffectComposer(renderer);
      composer.addPass(new T.RenderPass(scene, cam));
      bloom = new T.UnrealBloomPass(new T.Vector2(512,512), 0.9, 0.6, 0.82); composer.addPass(bloom);
      if(T.FXAAShader && T.ShaderPass){ fxaa = new T.ShaderPass(T.FXAAShader); composer.addPass(fxaa); }
      if(T.ShaderPass){ finalPass = new T.ShaderPass(FinalShader); composer.addPass(finalPass); }
    }
  }catch(e){ composer = null; }

  function resize(){
    const w = stage.clientWidth, h = stage.clientHeight; if(!w||!h) return;
    renderer.setSize(w, h, false);
    if(composer){ composer.setSize(w, h); const pr = renderer.getPixelRatio(); if(fxaa) fxaa.material.uniforms.resolution.value.set(1/(w*pr), 1/(h*pr)); if(lowEnd && bloom) bloom.resolution.set(w/2, h/2); }
    const aspect = w/h, wide = w > 760, base = Math.max(14.5, (aspect<0.9?16:(wide?27.5:24.5))/aspect)/view.zoom;
    const shift = wide ? (270/w)*base*aspect*0.42 : 0;
    cam.left = -base*aspect/2 + shift; cam.right = base*aspect/2 + shift; cam.top = base/2; cam.bottom = -base/2; cam.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- intro ----------
  let introDone = false;
  function intro(){ if(introDone) return; introDone = true; view.zoom = 0.62; view.az = 0.12; placeCam(); resize();
    if(window.gsap){ gsap.to(view, {zoom:1, az:Math.PI/4, duration:2.6, ease:"power3.out", onUpdate:()=>{ placeCam(); resize(); }}); } else { view.zoom = 1; view.az = Math.PI/4; placeCam(); resize(); }
    setOrb("idle"); logLine("claude", null, "Systemen online. Team van 10 agents actief."); }

  // ---------- loop ----------
  let last = performance.now(), slowT = 0, ledT = 0;
  function loop(now){
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now-last)/1000); last = now;
    if(panel.hidden || document.hidden) return;
    if(!introDone) intro();
    const t = now/1000;
    if(now - lastInteract > 7000 && !drag){ view.drift = Math.sin(t*0.12)*0.09; placeCam(); } else if(Math.abs(view.drift)>0.001){ view.drift *= 0.95; placeCam(); }
    AGENTS.forEach(a=>update(a, dt, t));
    updPackets(dt);
    const o = ORB[orbState]; orbPulse = Math.max(0, orbPulse - dt*0.6);
    orbU.t.value = t; orbU.glow.value = 1 + orbPulse*0.8 + (orbState==="thinking" ? 0.3*Math.sin(t*9) : 0);
    orb.scale.setScalar(1 + Math.sin(t*2)*0.025 + orbPulse*0.12);
    coreBall.scale.setScalar(1 + 0.15*Math.sin(t*(orbState==="thinking"?10:3)));
    rings.forEach((r,i)=>{ r.rotation.z += dt*o.spin*(i%2?-1:1)*(0.7+i*0.25); r.rotation.x += dt*0.1*(i-1); });
    for(let i=0;i<pN;i++){ const [r,a,y,sp] = pSeed[i]; const ang = a + t*sp*o.spin*0.4; pPos[i*3] = Math.cos(ang)*r; pPos[i*3+1] = y + Math.sin(t*sp+i)*0.08; pPos[i*3+2] = Math.sin(ang)*r; }
    pGeo.attributes.position.needsUpdate = true;
    cards.forEach((c,i)=>{ const ang = t*0.25 + i*(Math.PI*2/5); c.m.position.set(Math.cos(ang)*2.25, CY + 0.25*Math.sin(t*0.8+i), Math.sin(ang)*2.25); c.m.quaternion.copy(cam.quaternion); });
    beam.material.opacity = 0.05 + 0.03*Math.sin(t*3) + orbPulse*0.08;
    holo.rotation.y += dt*0.5; holo.rotation.x = Math.sin(t*0.4)*0.2; dust.rotation.y += dt*0.01;
    hearts.forEach((h,i)=>{ h.position.y = 0.9 + ((t*0.5+i*0.2)%1)*1.4; });
    ringLight.material.color.setHSL(0.08, 0.3, 0.85+0.1*Math.sin(t*2));
    if(now - ledT > 180){ ledT = now; drawLeds(t); }
    if(now - slowT > 1500){ slowT = now; drawWalls(t); AGENTS.forEach(a=>drawDesk(a,t)); drawCards(); gauges(); feed(); }
    if(finalPass) finalPass.uniforms.t.value = t;
    if(composer && fxOn) composer.render(); else renderer.render(scene, cam);
    placeOverlay(now);
  }
  drawWalls(0); AGENTS.forEach(a=>drawDesk(a,0)); drawCards(); drawLeds(0); gauges(); feed();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(()=>{ drawWalls(0); AGENTS.forEach(a=>drawDesk(a,0)); drawCards(); });
  requestAnimationFrame(loop);

  // ---------- chat → JARVIS ----------
  let chatTimer = null, rallied = [];
  const ROUTE = [[/video|maak|clip|render|frame/i,["director","producer"]],[/script|hook|tekst/i,["scriptwriter"]],[/trend|product|idee|scout/i,["scout"]],[/plan|post|view|like|cijfer|analy|vandaag/i,["analist"]],[/credit|budget|geld|kost/i,["budget"]],[/comment|reactie/i,["comments"]],[/commissie|deal|sample|seller|screenshot/i,["deal"]],[/claim|regel|compliance|mag dat/i,["compliance"]],[/check|kwaliteit|qa|fout/i,["qa"]]];
  function rally(text){
    let ids = []; ROUTE.forEach(([re,a])=>{ if(re.test(text)) ids.push(...a); });
    const at = text.match(/@([\w-]+)/); if(at){ const f = AGENTS.find(a=>a.name.toLowerCase().startsWith(at[1].toLowerCase())); if(f) ids.unshift(f.id); }
    ids = [...new Set(ids.length?ids:["director","producer"])].slice(0,4);
    chatMode = true; setOrb("thinking"); say("claude","Opdracht ontvangen. Team, aan de slag.",2800); logLine("claude", null, "Opdracht ontvangen: " + text); speak("Opdracht ontvangen.");
    ids.forEach((id,i)=>{ const a = byId[id]; a.busy = true; a.now = "bij JARVIS"; packet(corePos, headPos(a), 0xFF6A2E, 0.8);
      const ang = i/ids.length*Math.PI*2 + 0.6;
      setTimeout(()=>{ play(a, "Jump", true); setTimeout(()=>walkTo(a, Math.cos(ang)*2.3, Math.sin(ang)*2.3, ()=>{ face(a, corePos); a.talking = true; play(a, "Yes", true); say(a.id, ["Ik pak het op!","Aan de slag 💪","Ik help mee","Check!"][i%4], 2400); setTimeout(()=>{ a.talking = false; }, 1400); }, true), 500); }, 700); });
    clearTimeout(chatTimer); chatTimer = setTimeout(()=>release(), 120000);
    return ids;
  }
  function release(){ chatMode = false; rallied.forEach(id=>goHome(byId[id])); rallied = []; if(orbState!=="idle") setOrb("idle"); }
  function celebrate(msg){
    setOrb("responding"); say("claude", short(msg.text, 130), 8000, "claude"); logLine("claude", msg.agent && byId[msg.agent] ? msg.agent : null, msg.text); speak(msg.text);
    const lead = byId[msg.agent] || byId[rallied[0]||"director"];
    if(lead){ packet(corePos, headPos(lead), 0xFFF1C9, 0.8); setTimeout(()=>{ play(lead, "Dance"); say(lead.id,"Klaar! ✅",2200); }, 900); setTimeout(()=>play(lead, "Idle"), 4200); }
    rallied.filter(id=>!lead || id!==lead.id).forEach(id=>setTimeout(()=>play(byId[id], "ThumbsUp", true), 1000));
    setTimeout(()=>{ release(); setOrb("idle"); }, 5200);
  }
  window.__hqRally = t => { rallied = rally(t); };
  window.__hqReply = m => celebrate(m);

  initChat();
/*__INITCHAT__*/
})();
