(function(){
  const $ = id => document.getElementById(id);
  const stage = $("hqStage"), canvas = $("hqCanvas"), overlay = $("hqBubbles"), panel = $("p-hq"), card = $("hqCard");
  const CHAT_TRIGGER = "trig_01YaT9EyM6D2LA2d9e7ZHsk4";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const short = (s,n) => { s = String(s||"").replace(/\s+/g," ").trim(); return s.length>n ? s.slice(0,n-1)+"…" : s; };
  const S = () => window.__mcrState || {ideas:[],videos:[],lessons:[],meta:null};
  const fmtShort = iso => { try{ return new Date(iso).toLocaleString("nl-NL",{weekday:"short",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Amsterdam"}); }catch(e){ return ""; } };
  const hex = n => "#"+n.toString(16).padStart(6,"0");
  const mobile = () => stage.clientWidth < 760;

  const AGENTS = [
    {id:"scout", name:"Trend-scout", icon:"🔭", color:0x53E0B5, home:[-6.0,-4.4], acc:"cap", screen:"trends", role:"Zoekt elke ochtend virale producten die nog niet uitgemolken zijn, met de beste angles."},
    {id:"deal", name:"Deal-jager", icon:"💰", color:0xFFB547, home:[-3.2,-4.9], acc:"tag", screen:"deal", role:"Zoekt de hoogste commissie en gratis samples, en schrijft berichten aan sellers."},
    {id:"scriptwriter", name:"Scriptwriter", icon:"✍️", color:0xA98BFF, home:[1.2,-4.9], acc:"pencil", screen:"hook", role:"De UGC-legend: 10 hooks, beste structuur, zelfkritiek tot 8/10."},
    {id:"director", name:"AI-director", icon:"🎬", color:0xFF6B4A, home:[3.9,-3.9], acc:"beret", screen:"model", role:"Kent alle Higgsfield-modellen en trucs: kiest model, modus en prompts."},
    {id:"producer", name:"Producer", icon:"🎧", color:0x7CC4FF, home:[6.5,-1.6], acc:"headphones", screen:"render", role:"Maakt basisbeeld, frames en clips, en plakt alles tot een video met hooktekst."},
    {id:"qa", name:"QA-checker", icon:"🔍", color:0x6FE3E9, home:[6.3,1.9], acc:"monocle", screen:"qa", role:"Controleert elke clip op handen, product, mond, extra objecten en audio."},
    {id:"analist", name:"Analist", icon:"📈", color:0xFF5C7A, home:[-6.6,-0.7], acc:"glasses", screen:"stats", role:"Meet views, kijktijd en verkopen en zegt wat werkt."},
    {id:"budget", name:"Budgetwaker", icon:"🪙", color:0xC6E36A, home:[-6.0,2.9], acc:"coin", screen:"credits", role:"Bewaakt de credits en de kosten per video."},
    {id:"compliance", name:"Compliance", icon:"🛡️", color:0xD7C9DE, home:[-2.6,4.6], acc:"shield", screen:"rules", role:"Houdt AI-label, prijzen en claims in de gaten."},
    {id:"comments", name:"Comment-manager", icon:"💬", color:0xFF8FC4, home:[2.6,4.7], acc:"heart", screen:"comments", role:"Schrijft antwoorden op comments en maakt er reply-video's van."}
  ];
  const byId = Object.fromEntries(AGENTS.map(a=>[a.id,a]));

  // ---------- geluid + stem ----------
  let soundOn = false; try{ soundOn = localStorage.getItem("hq_sound")==="1"; }catch(e){}
  let actx = null;
  function beep(f=880, d=0.07, v=0.02){ if(!soundOn) return; try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(v, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime+d); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+d+0.02); }catch(e){} }
  function speak(text){ if(!soundOn || !window.speechSynthesis) return; try{ const u = new SpeechSynthesisUtterance(text); const vs = speechSynthesis.getVoices(); const nl = vs.find(v=>/^nl/i.test(v.lang)); if(nl) u.voice = nl; u.lang = nl ? nl.lang : "nl-NL"; u.rate = 1.05; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }

  // ---------- HUD ----------
  const hudState = $("hudState"), hudLog = $("hudLog"), hudFeed = $("hudFeed"), onAir = $("onAir");
  function typeText(el, text){ clearInterval(el._t); let i = 0; el._t = setInterval(()=>{ i++; el.textContent = text.slice(0,i); if(i>=text.length) clearInterval(el._t); }, 22); }
  const logLines = [];
  const who = id => id==="claude" ? ["Regie", 0xFF6B4A] : [byId[id].name, byId[id].color];
  function logLine(from, to, text){
    const t = new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Amsterdam"});
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
    if(chatMode) work.push(["Regie voert je opdracht uit", "live"]);
    const sched = vids.filter(v=>v.status==="scheduled"); if(sched.length) work.push([`${sched.length} posts ingepland`, "Metricool"]);
    const wait = vids.filter(v=>v.status==="posted" && !(v.metrics && v.metrics.views!=null)); if(wait.length) work.push([`Wacht op cijfers (${wait.length})`, "sync"]);
    vids.filter(v=>v.status==="posted").forEach(v=>done.push([`Gepost: ${v.title}`, v.metrics&&v.metrics.views!=null?`${v.metrics.views} views`:"—"]));
    done.push([`${(s.lessons||[]).length} lessen geleerd`, "geheugen"]);
    const col = (title, cls, arr) => `<section class="${cls}"><h4>${title}<span>${arr.length}</span></h4>${arr.slice(0,4).map(([a,b])=>`<div class="it"><span>${esc(short(a,36))}</span><em>${esc(b)}</em></div>`).join("") || `<div class="it none">—</div>`}</section>`;
    hudFeed.innerHTML = col("Jij bent aan zet","need",need) + col("Bezig","work",work) + col("Klaar","done",done);
  }
  function gauges(){
    const ams = new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Amsterdam"}));
    $("hudClockArc").setAttribute("stroke-dasharray", `${((ams.getHours()*60+ams.getMinutes())/1440*151).toFixed(1)} 151`);
    $("hudClockTxt").textContent = ams.toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"});
    const c = S().meta && S().meta.credits, f = c==null ? 0 : Math.max(0, Math.min(1, c/150));
    $("hudCredArc").setAttribute("stroke-dasharray", `${(f*151).toFixed(1)} 151`); $("hudCredArc").setAttribute("stroke", c!=null && c<40 ? "#FF5C7A" : "#FF6B4A");
    $("hudCredTxt").textContent = c==null ? "—" : Math.round(c);
  }

  // ---------- chat als sheet op mobiel ----------
  const chatEl = $("hqChat"), sheetBg = $("sheetBg");
  function openChat(){ chatEl.classList.add("open"); sheetBg.classList.add("open"); setTimeout(()=>{ const i = $("hqInput"); if(i && !mobile()) i.focus(); }, 300); }
  function closeChat(){ chatEl.classList.remove("open"); sheetBg.classList.remove("open"); }
  window.__openChat = () => { if(mobile()) openChat(); };
  $("hudChatBtn").onclick = openChat; $("hqChatClose").onclick = closeChat; sheetBg.onclick = closeChat;

  function fallback(msg){ $("hqLoading").hidden = true; const f = $("hqFallback"); f.hidden = false; f.textContent = msg; }
  if(!window.THREE){ fallback("3D kon niet laden in deze weergave. De regie-chat werkt wel."); initChat(); return; }
  const T = THREE;
  let renderer;
  try{ renderer = new T.WebGLRenderer({canvas, antialias:false, powerPreference:"high-performance"}); }catch(e){ fallback("3D (WebGL) wordt niet ondersteund op dit apparaat. De regie-chat werkt wel."); initChat(); return; }
  const lowEnd = (navigator.deviceMemory && navigator.deviceMemory < 4) || Math.min(screen.width, screen.height) < 500 || matchMedia("(pointer:coarse)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, lowEnd ? 1.25 : 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = lowEnd ? T.PCFShadowMap : T.PCFSoftShadowMap;

  const scene = new T.Scene();
  scene.background = new T.Color(0x0B0810);
  const cam = new T.OrthographicCamera(-10,10,10,-10,0.1,200);
  const view = {az:Math.PI/4, zoom:1, tx:0, tz:0, drift:0};
  let lastInteract = performance.now();
  function placeCam(){ const r = 30, az = view.az + view.drift; cam.position.set(view.tx + Math.sin(az)*r, 21, view.tz + Math.cos(az)*r); cam.lookAt(view.tx, 0.8, view.tz); }
  placeCam();

  // warm studiolicht
  scene.add(new T.HemisphereLight(0xFFE6D6, 0x1A1020, 0.48));
  const key = new T.DirectionalLight(0xFFD9BE, 0.8); key.position.set(9,16,8); key.castShadow = true;
  key.shadow.mapSize.set(lowEnd?1024:2048, lowEnd?1024:2048); Object.assign(key.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:1,far:50}); key.shadow.bias = -0.0008; key.shadow.normalBias = 0.02; key.shadow.radius = 4; scene.add(key);
  const fill = new T.DirectionalLight(0xA98BFF, 0.45); fill.position.set(-12,9,-4); scene.add(fill);
  const back = new T.DirectionalLight(0xFF6B4A, 0.35); back.position.set(6,7,-12); scene.add(back);

  const grad = new T.DataTexture(new Uint8Array([105,105,105, 180,180,180, 240,240,240]), 3, 1, T.RGBFormat);
  grad.minFilter = grad.magFilter = T.NearestFilter; grad.needsUpdate = true;
  const TOON = (c, o={}) => new T.MeshToonMaterial(Object.assign({color:c, gradientMap:grad}, o));
  const STD = (c=0x2A2130, r=0.7, m=0.05, o={}) => new T.MeshStandardMaterial(Object.assign({color:c, roughness:r, metalness:m}, o));
  const NEON = (c, o=1) => new T.MeshBasicMaterial({color:c, transparent:o<1, opacity:o});
  function mesh(geo, mat, x=0,y=0,z=0, parent=scene, shadow=true){ const m = new T.Mesh(geo, mat); m.position.set(x,y,z); if(shadow){ m.castShadow = true; m.receiveShadow = true; } parent.add(m); return m; }
  const box = (w,h,d,mat,x,y,z,p,sh=true) => mesh(new T.BoxGeometry(w,h,d), mat, x,y+h/2,z,p,sh);
  function canvasTex(w, h, draw){ const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); draw(g,w,h); const t = new T.CanvasTexture(c); t.anisotropy = 4; return t; }
  function glowTex(stops){ return canvasTex(128,128,(g)=>{ const rg = g.createRadialGradient(64,64,0,64,64,64); stops.forEach(([o,col])=>rg.addColorStop(o,col)); g.fillStyle = rg; g.fillRect(0,0,128,128); }); }
  const GLOW = glowTex([[0,"rgba(255,255,255,1)"],[0.35,"rgba(255,255,255,.35)"],[1,"rgba(255,255,255,0)"]]);
  const SHADOW = glowTex([[0,"rgba(0,0,0,.65)"],[0.6,"rgba(0,0,0,.22)"],[1,"rgba(0,0,0,0)"]]);
  function pool(x,z,r,color,op=0.5,parent=scene,y=0.02){ const m = new T.Mesh(new T.PlaneGeometry(r*2,r*2), new T.MeshBasicMaterial({map:GLOW, color, transparent:true, opacity:op, depthWrite:false, blending:T.AdditiveBlending})); m.rotation.x = -Math.PI/2; m.position.set(x,y,z); parent.add(m); return m; }

  // ---------- de studio ----------
  const woodTex = canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle = "#3A2A22"; g.fillRect(0,0,w,h); const pw = 64;
    for(let x=0;x<w;x+=pw){ let y = -Math.random()*300; while(y<h){ const L = 220+Math.random()*260, l = 28+Math.random()*14; g.fillStyle = `hsl(20, 28%, ${l}%)`; g.fillRect(x+1,y+1,pw-2,L-2);
      g.strokeStyle = "rgba(0,0,0,.08)"; for(let k=0;k<5;k++){ g.beginPath(); g.moveTo(x+8+Math.random()*(pw-16), y); g.bezierCurveTo(x+Math.random()*pw, y+L*0.3, x+Math.random()*pw, y+L*0.6, x+8+Math.random()*(pw-16), y+L); g.stroke(); } y += L; } } });
  woodTex.wrapS = woodTex.wrapT = T.RepeatWrapping; woodTex.repeat.set(2.2,1.7);
  const floor = box(18,0.4,14,STD(0x9C7C68,0.62,0.05,{map:woodTex}),0,-0.4,0); floor.castShadow = false;
  const brickTex = canvasTex(512,512,(g,w,h)=>{ g.fillStyle = "#2A1C22"; g.fillRect(0,0,w,h); const bw = 64, bh = 28; for(let r=0;r*bh<h;r++) for(let c=-1;c*bw<w;c++){ const x = c*bw + (r%2?bw/2:0), y = r*bh; g.fillStyle = `hsl(${8+Math.random()*10}, ${30+Math.random()*12}%, ${22+Math.random()*9}%)`; g.fillRect(x+2,y+2,bw-4,bh-4); } });
  brickTex.wrapS = brickTex.wrapT = T.RepeatWrapping; brickTex.repeat.set(3.2,1.2);
  box(0.3,5,14,STD(0xB08A84,0.9,0,{map:brickTex}),-9.15,0,0);
  box(18,5,0.3,STD(0x231A2A,0.85),0,0,-7.15);
  for(let x=-8.7;x<=8.7;x+=0.42) box(0.2,4.6,0.12,STD(Math.round(x/0.42)%3===0?0x3A2B30:0x33262C,0.6),x,0.2,-6.94);
  box(18,0.25,0.4,STD(0x1C1520,0.7),0,4.75,-6.9);
  box(18.2,0.1,0.12,NEON(0xFF6B4A,0.9),0,0,6.99,scene,false); box(0.12,0.1,14.2,NEON(0xFF6B4A,0.9),8.99,0,0,scene,false);
  // tapijten
  const rug = (r,c,x,z) => { const m = mesh(new T.CylinderGeometry(r,r,0.03,48), STD(c,0.95), x,0.015,z); m.castShadow = false; return m; };
  rug(2.3,0x5B3F78,-4.8,-4.3); rug(2.1,0x7A3B3E,-5.3,2.2); rug(2.0,0x3F5B70,4.6,4.8); rug(3.0,0x2F2438,0,0);

  // neon-bord "mila" + ON AIR
  function drawNeon(g,w,h){ g.clearRect(0,0,w,h); g.font = `400 230px Pacifico, "Brush Script MT", cursive`; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "#FF6B4A"; g.shadowBlur = 40; g.fillStyle = "#FFD2C2"; g.fillText("mila", w/2, h/2); g.shadowBlur = 16; g.fillText("mila", w/2, h/2); }
  const neonTex = canvasTex(1024,360,drawNeon);
  const neon = mesh(new T.PlaneGeometry(4.2,1.48), new T.MeshBasicMaterial({map:neonTex, transparent:true, depthWrite:false}), -1.4,3.6,-6.82, scene, false);
  pool(-1.4,-5.6,2.5,0xFF6B4A,0.25);
  const onairTex = canvasTex(256,96,(g,w,h)=>{ g.fillStyle = "#FFF"; g.fillRect(0,0,w,h); g.fillStyle = "#1E0A05"; g.font = `700 54px "DM Mono", monospace`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ON AIR", w/2, h/2+3); });
  const onairMat = new T.MeshBasicMaterial({map:onairTex, color:0x5A3036});
  box(1.35,0.52,0.14,STD(0x15101A),5.2,3.75,-6.95); mesh(new T.PlaneGeometry(1.2,0.42), onairMat, 5.2,4.01,-6.87, scene, false);

  // canvas-schermen
  function screenTex(cw, ch){ const c = document.createElement("canvas"); c.width = cw; c.height = ch; const tex = new T.CanvasTexture(c); tex.anisotropy = 4; return {c, g:c.getContext("2d"), tex}; }
  function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
  function panelBg(g, w, h, accent, title){
    g.clearRect(0,0,w,h); g.fillStyle = "#17111D"; g.fillRect(0,0,w,h);
    const rg = g.createRadialGradient(w*0.9,0,0,w*0.9,0,w*0.8); rg.addColorStop(0, accent+"33"); rg.addColorStop(1,"rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0,0,w,h);
    g.fillStyle = accent; rr(g, w*0.05, h*0.08, h*0.1, h*0.1, h*0.05); g.fill();
    g.font = `600 ${Math.round(h*0.085)}px Unbounded, Manrope, sans-serif`; g.textBaseline = "middle"; g.fillStyle = "#FBF3EA"; g.fillText(title, w*0.05 + h*0.14, h*0.13);
  }
  function textLines(g, lines, x, y, lh, color, font){ g.textBaseline = "top"; g.fillStyle = color; g.font = font; lines.forEach((l,i)=>g.fillText(l, x, y+i*lh)); }
  function wrap(g, text, maxW){ const words = String(text).split(" "), out = []; let line = ""; words.forEach(w=>{ const t = line ? line+" "+w : w; if(g.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if(line) out.push(line); return out; }

  const walls = {
    trends: Object.assign(screenTex(1024,576), {pos:[-5.9,1.5,-6.82], rot:0, w:3.8, h:2.14}),
    ops: Object.assign(screenTex(1024,576), {pos:[-8.97,1.4,-0.9], rot:Math.PI/2, w:3.8, h:2.14})
  };
  Object.values(walls).forEach(W=>{ box(W.rot?0.08:W.w+0.2, W.h+0.2, W.rot?W.w+0.2:0.08, STD(0x0E0A12,0.4,0.3), W.pos[0]+(W.rot?-0.02:0), W.pos[1]-0.1, W.pos[2]+(W.rot?0:-0.02)); const m = mesh(new T.PlaneGeometry(W.w,W.h), new T.MeshBasicMaterial({map:W.tex}), W.pos[0]+(W.rot?0.03:0), W.pos[1]+W.h/2, W.pos[2]+(W.rot?0:0.03), scene, false); m.rotation.y = W.rot; });
  function drawWalls(t){
    const s = S();
    { const W = walls.trends, g = W.g, w = 1024, h = 576; panelBg(g,w,h,"#53E0B5","Trend-radar");
      const ideas = (s.ideas||[]).filter(i=>i.status!=="rejected").sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,5);
      ideas.forEach((i,k)=>{ const y = 140+k*84; g.textBaseline = "top"; g.fillStyle = "#FBF3EA"; g.font = `600 30px Manrope, sans-serif`; g.fillText(short(i.product,32), 56, y);
        g.fillStyle = "rgba(255,236,220,.08)"; rr(g,56,y+42,720,14,7); g.fill(); g.fillStyle = "#53E0B5"; rr(g,56,y+42,Math.max(14,720*(i.score||0)/100*(0.97+0.03*Math.sin(t*2+k))),14,7); g.fill();
        g.font = `600 34px Unbounded, sans-serif`; g.fillText(String(i.score||"—"), 820, y+8); });
      if(!ideas.length) textLines(g,["Radar leeg — start de trend-scout"],56,160,40,"#B8A9BF",`500 30px Manrope`);
      W.tex.needsUpdate = true; }
    { const W = walls.ops, g = W.g, w = 1024, h = 576; panelBg(g,w,h,"#FF6B4A","Studio-budget");
      const c = s.meta && s.meta.credits, vids = s.videos||[];
      g.textBaseline = "top"; g.fillStyle = "#FBF3EA"; g.font = `600 150px Unbounded, sans-serif`; g.fillText(c==null?"—":String(Math.round(c)), 56, 130);
      g.fillStyle = "#B8A9BF"; g.font = `500 28px "DM Mono", monospace`; g.fillText("credits over", 60, 310);
      [["klaar",vids.filter(v=>v.status==="made").length,"#FFB547"],["gepland",vids.filter(v=>v.status==="scheduled").length,"#A98BFF"],["gepost",vids.filter(v=>v.status==="posted").length,"#53E0B5"]].forEach(([l,n,col],k)=>{ const x = 560+k*150, bh = Math.min(300, 30+n*26)*(0.97+0.03*Math.sin(t*3+k)); g.fillStyle = col; rr(g,x, 480-bh, 90, bh, 18); g.fill(); g.fillStyle = "#FBF3EA"; g.font = `600 34px Unbounded`; g.fillText(String(n), x+24, 480-bh-54); g.fillStyle = "#B8A9BF"; g.font = `500 22px "DM Mono"`; g.fillText(l, x, 500); });
      W.tex.needsUpdate = true; }
  }

  // ---------- bureaus + krukjes (bureau altijd aan de kant weg van de camera) ----------
  function deskFor(a){
    const [hx,hz] = a.home, L = Math.hypot(hx,hz)||1; let dx = hx/L, dz = hz/L;
    if(dx*Math.SQRT1_2 + dz*Math.SQRT1_2 > 0.25){ dx = -dx; dz = -dz; }
    const g = new T.Group(); g.position.set(hx+dx*1.05, 0, hz+dz*1.05); g.rotation.y = Math.atan2(-dx,-dz); scene.add(g);
    box(1.8,0.08,0.85,STD(0xC9A27E,0.55,0.02,{map:woodTex}),0,0.8,0,g);
    [[-0.8,-0.34],[0.8,-0.34],[-0.8,0.34],[0.8,0.34]].forEach(([x,z])=>box(0.05,0.8,0.05,STD(0x1A141E,0.4,0.6),x,0,z,g));
    box(0.95,0.6,0.05,STD(0x0E0A12,0.4,0.3),0,1.02,-0.25,g);
    const sc = screenTex(384,232); mesh(new T.PlaneGeometry(0.88,0.53), new T.MeshBasicMaterial({map:sc.tex}), 0,1.32,-0.222,g,false);
    box(0.08,0.2,0.08,STD(0x0E0A12),0,0.88,-0.25,g);
    mesh(new T.CylinderGeometry(0.06,0.055,0.12,14), TOON(a.color), 0.6,0.94,0.15,g);
    mesh(new T.SphereGeometry(0.09,12,8), NEON(0xFFE2C4), -0.66,1.18,-0.18,g,false); box(0.02,0.36,0.02,STD(0x1A141E),-0.66,0.84,-0.18,g);
    pool(0,0,0.9,0xFFC9A8,0.12,g,0.03);
    const stool = new T.Group(); stool.position.set(hx-dx*0.24, 0, hz-dz*0.24); scene.add(stool);
    mesh(new T.CylinderGeometry(0.27,0.24,0.08,20), STD(a.color,0.5), 0,0.33,0, stool);
    mesh(new T.CylinderGeometry(0.035,0.035,0.3,8), STD(0x1A141E,0.4,0.6), 0,0.15,0, stool);
    mesh(new T.CylinderGeometry(0.2,0.2,0.03,16), STD(0x1A141E,0.4,0.6), 0,0.015,0, stool);
    a.desk = g; a.sc = sc; a.facing = Math.atan2(dx,dz);
  }
  AGENTS.forEach(deskFor);
  function drawDesk(a, t){
    const s = S(), g = a.sc.g, w = 384, h = 232, col = hex(a.color);
    panelBg(g,w,h,col,a.name);
    const ideas = (s.ideas||[]).filter(i=>i.status==="new"||i.status==="selected").sort((x,y)=>(y.score||0)-(x.score||0));
    const top = ideas[0], c = s.meta && s.meta.credits, vids = s.videos||[];
    const f = `500 19px Manrope, sans-serif`, fb = `600 46px Unbounded, sans-serif`;
    g.font = f;
    const lines = {
      trends: ideas.slice(0,3).map(i=>`${i.score||"—"}  ${short(i.product,22)}`),
      deal: top ? wrap(g, `Commissie: ${short(top.commission||"onbekend",60)}`, w-40).slice(0,3) : ["Wacht op screenshots"],
      hook: top && top.concepts && top.concepts[0] ? wrap(g, `“${top.concepts[0].hook}”`, w-40).slice(0,4) : ["Nieuwe hooks…"],
      model: ["Kling 3.0 · std", "1,75 cr/s · 3×7s", "lipsync ≤ 7s"],
      qa: ["handen   ✓","product  ✓","mond     ✓","audio    ✓"],
      rules: ["AI-label  aan","prijs     check","claims    scan"],
      comments: ["reply-video's", "binnen 1 uur", "♥ antwoorden"]
    }[a.screen] || [];
    if(a.screen==="render"){ const p = (t*0.12)%1; g.fillStyle = "rgba(255,236,220,.08)"; rr(g,22,110,w-44,20,10); g.fill(); g.fillStyle = col; rr(g,22,110,Math.max(20,(w-44)*p),20,10); g.fill(); textLines(g,[`clip ${1+Math.floor(p*3)}/3 · ${Math.round(p*100)}%`],22,146,26,"#FBF3EA",f); }
    else if(a.screen==="credits"){ textLines(g,[c==null?"—":String(Math.round(c))],22,62,40,"#FBF3EA",fb); textLines(g,["credits over"],22,130,26,"#B8A9BF",f); }
    else if(a.screen==="stats"){ [["gepland",vids.filter(v=>v.status==="scheduled").length],["gepost",vids.filter(v=>v.status==="posted").length],["klaar",vids.filter(v=>v.status==="made").length]].forEach(([l,n],k)=>{ const bw = Math.min(210, 20+n*20); g.fillStyle = col; rr(g,112,72+k*44,bw*(0.95+0.05*Math.sin(t*2+k)),22,11); g.fill(); textLines(g,[l],22,74+k*44,20,"#B8A9BF",f); textLines(g,[String(n)],124+bw,74+k*44,20,"#FBF3EA",f); }); }
    else textLines(g, lines, 22, 64, 30, "#FBF3EA", f);
    a.sc.tex.needsUpdate = true;
  }

  // ---------- opnameset (achter rechts) ----------
  const set = new T.Group(); set.position.set(6.9,0,-5.9); scene.add(set);
  mesh(new T.PlaneGeometry(3.6,3.6), STD(0xF2B8A8,0.95), 0,2.1,-0.9, set);
  const curve = mesh(new T.CylinderGeometry(0.9,0.9,3.6,24,1,true,Math.PI,Math.PI/2), STD(0xF2B8A8,0.95,0,{side:T.DoubleSide}), 0,0.9,0, set); curve.rotation.z = Math.PI/2;
  mesh(new T.PlaneGeometry(3.6,1.4), STD(0xF2B8A8,0.95), 0,0.012,0.55, set).rotation.x = -Math.PI/2;
  const sofaM = TOON(0xE9DFD3);
  box(2.2,0.42,0.9,sofaM,0,0.2,0.2,set); box(2.2,0.7,0.24,sofaM,0,0.4,-0.18,set); box(0.24,0.6,0.9,sofaM,-1.1,0.2,0.2,set); box(0.24,0.6,0.9,sofaM,1.1,0.2,0.2,set);
  box(0.5,0.42,0.16,TOON(0xFF6B4A),-0.55,0.62,-0.02,set).rotation.z = 0.25; box(0.46,0.4,0.16,TOON(0xA98BFF),0.35,0.62,-0.02,set).rotation.z = -0.15;
  function softbox(x,z,rot,c){ const g = new T.Group(); g.position.set(x,0,z); g.rotation.y = rot; scene.add(g);
    [0,2.1,4.2].forEach(a=>{ const l = mesh(new T.CylinderGeometry(0.025,0.025,1.9,6), STD(0x1A141E,0.4,0.6), Math.sin(a)*0.25,0.9,Math.cos(a)*0.25,g); l.rotation.set(Math.cos(a)*0.28,0,-Math.sin(a)*0.28); });
    mesh(new T.CylinderGeometry(0.03,0.03,0.9,6), STD(0x1A141E,0.4,0.6), 0,2.2,0, g);
    const b = box(0.9,0.7,0.35,STD(0x15101A,0.6),0,2.3,0,g); b.rotation.x = -0.25;
    const f = mesh(new T.PlaneGeometry(0.8,0.6), NEON(c), 0,2.65,0.19,g,false); f.rotation.x = -0.25;
    pool(0,1.2,1.6,c,0.22,g); return f; }
  softbox(4.6,-4.9,0.5,0xFFF1E4); softbox(8.4,-3.6,-0.9,0xFFE0D2);
  const ringLight = mesh(new T.TorusGeometry(0.45,0.05,10,40), NEON(0xFFF6EE), 6.9,1.75,-3.9, scene, false);
  mesh(new T.CylinderGeometry(0.025,0.025,1.35,6), STD(0x1A141E), 6.9,0.68,-3.9);

  // plank met samples (deal-jager)
  const shelf = new T.Group(); shelf.position.set(-2.4,0,-6.75); scene.add(shelf);
  [0.9,1.7,2.5].forEach(y=>box(2.2,0.06,0.42,STD(0xC9A27E,0.55,0,{map:woodTex}),0,y,0,shelf));
  const boxCols = [0xFF6B4A,0xA98BFF,0x53E0B5,0xFFB547,0xFF8FC4,0x7CC4FF];
  [0.96,1.76,2.56].forEach((y,r)=>{ let x = -0.95, k = r; while(x<0.9){ const bw = 0.2+((k*37)%18)/100, bh = 0.2+((k*53)%35)/100; box(bw,bh,0.3,TOON(boxCols[k%boxCols.length]),x+bw/2,y,0,shelf); x += bw+0.06; k++; } });

  // community-hoek + planten
  [[3.8,6.2,0xFF8FC4],[5.3,6.3,0xA98BFF],[6.6,5.6,0x53E0B5]].forEach(([x,z,c])=>{ const b = mesh(new T.SphereGeometry(0.55,20,14), TOON(c), x,0.36,z); b.scale.set(1,0.66,1); });
  function plant(x,z,s=1){ const g = new T.Group(); g.position.set(x,0,z); g.scale.setScalar(s); scene.add(g); mesh(new T.CylinderGeometry(0.3,0.22,0.55,16), TOON(0xE6D3C2), 0,0.27,0, g); for(let i=0;i<7;i++){ const l = mesh(new T.SphereGeometry(0.28,10,8), TOON(i%2?0x3E9E6A:0x5DBE7E), Math.cos(i*1.3)*0.22, 0.75+i*0.13, Math.sin(i*1.9)*0.22, g); l.scale.set(1,1.5,1); } }
  plant(-8.3,6.2,1.2); plant(8.3,6.3,1.1); plant(-8.3,-6.3,1.2); plant(0.2,-6.3,0.9);
  const lamp = new T.PointLight(0xFFB88A, 0.9, 7, 1.8); lamp.position.set(-8.2,2.2,6.2); scene.add(lamp);

  // ---------- regietafel met live telefoon ----------
  const core = new T.Group(); scene.add(core);
  mesh(new T.CylinderGeometry(1.45,1.55,0.72,48), STD(0x221A2A,0.45,0.2), 0,0.36,0, core);
  mesh(new T.CylinderGeometry(1.5,1.5,0.06,48), STD(0xC9A27E,0.5,0,{map:woodTex}), 0,0.75,0, core);
  const tableRing = mesh(new T.TorusGeometry(1.5,0.03,8,72), NEON(0xA98BFF), 0,0.78,0, core, false); tableRing.rotation.x = Math.PI/2;
  const corePool = pool(0,0,3.2,0xA98BFF,0.35);
  const phoneTex = screenTex(360,640);
  const phone = new T.Group(); phone.position.set(0,1.95,0); core.add(phone);
  mesh(new T.BoxGeometry(0.92,1.72,0.08), STD(0x0E0A12,0.25,0.5), 0,0,0, phone);
  mesh(new T.PlaneGeometry(0.84,1.64), new T.MeshBasicMaterial({map:phoneTex.tex}), 0,0,0.045, phone, false);
  mesh(new T.PlaneGeometry(0.84,1.64), new T.MeshBasicMaterial({map:phoneTex.tex}), 0,0,-0.045, phone, false).rotation.y = Math.PI;
  mesh(new T.CylinderGeometry(0.08,0.12,0.4,12), STD(0x1A141E,0.4,0.6), 0,0.98,0, core);
  const coreLight = new T.PointLight(0xA98BFF, 1.2, 8, 1.6); coreLight.position.set(0,2.2,0); scene.add(coreLight);
  const ORB = {idle:{c:0xA98BFF, label:"studio klaar · team aan het werk"}, thinking:{c:0xFF6B4A, label:"opname bezig · team op je opdracht"}, responding:{c:0x53E0B5, label:"take binnen ✓"}};
  let orbState = "idle", orbPulse = 0;
  function drawPhone(t){
    const g = phoneTex.g, w = 360, h = 640, s = S();
    const next = (s.videos||[]).filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt)))[0];
    const bg = g.createLinearGradient(0,0,w,h); bg.addColorStop(0, hex(ORB[orbState].c)); bg.addColorStop(1,"#1A1022"); g.fillStyle = bg; g.fillRect(0,0,w,h);
    g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0,0,w,h);
    g.fillStyle = "#FBF3EA"; g.textBaseline = "top"; g.font = `500 18px "DM Mono", monospace`; g.fillText(orbState==="thinking" ? "● OPNAME" : "VOLGENDE POST", 24, 30);
    if(next){ g.font = `600 40px Unbounded, sans-serif`; g.fillText(fmtShort(next.scheduledAt), 24, 64);
      g.font = `700 30px Manrope, sans-serif`; wrap(g, next.title, w-80).slice(0,4).forEach((l,k)=>g.fillText(l, 24, 330+k*38));
      g.font = `500 18px "DM Mono", monospace`; g.fillStyle = "rgba(251,243,234,.75)"; g.fillText("🔗 "+short(next.product||"",24), 24, 500); }
    else { g.font = `600 30px Unbounded`; g.fillText("rustig", 24, 70); }
    ["♥","💬","↗"].forEach((ic,k)=>{ g.font = `600 34px Manrope`; g.fillStyle = "#FBF3EA"; g.fillText(ic, w-60, 250+k*70); });
    g.fillStyle = "rgba(255,255,255,.35)"; rr(g, 24, h-40, w-48, 6, 3); g.fill(); g.fillStyle = "#FBF3EA"; rr(g, 24, h-40, Math.max(6,(w-48)*((t*0.08)%1)), 6, 3); g.fill();
    phoneTex.tex.needsUpdate = true;
  }
  // zwevende mini-posts rond de tafel
  const cards = [];
  for(let i=0;i<5;i++){ const st = screenTex(180,320); const m = mesh(new T.PlaneGeometry(0.5,0.89), new T.MeshBasicMaterial({map:st.tex, transparent:true, side:T.DoubleSide, depthWrite:false}), 0,2,0, core, false); cards.push({m, st}); }
  function drawCards(){
    const vids = (S().videos||[]).filter(v=>v.status==="scheduled"&&v.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt))).slice(1);
    cards.forEach((c,i)=>{ const v = vids[i], g = c.st.g; g.clearRect(0,0,180,320); c.m.visible = !!v; if(!v) return;
      const col = ["#FF6B4A","#A98BFF","#53E0B5","#FFB547","#FF8FC4"][i];
      g.fillStyle = col; rr(g,4,4,172,312,26); g.fill(); g.fillStyle = "rgba(20,12,26,.55)"; rr(g,4,4,172,312,26); g.fill();
      g.fillStyle = "#FBF3EA"; g.textBaseline = "top"; g.font = `600 20px Unbounded, sans-serif`; g.fillText(fmtShort(v.scheduledAt), 16, 20);
      g.font = `700 20px Manrope, sans-serif`; wrap(g, v.title, 148).slice(0,4).forEach((l,k)=>g.fillText(l, 16, 170+k*26)); c.st.tex.needsUpdate = true; });
  }
  // opstijgende hartjes
  const heartTex = canvasTex(64,64,(g)=>{ g.font = "48px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#FFFFFF"; g.fillText("♥",32,34); });
  const hearts = []; for(let i=0;i<(lowEnd?10:18);i++){ const sp = new T.Sprite(new T.SpriteMaterial({map:heartTex, transparent:true, depthWrite:false, color:[0xFF6B8A,0xA98BFF,0xFFB39C][i%3]})); sp.scale.setScalar(0.28); core.add(sp); hearts.push({sp, a:Math.random()*6.28, r:0.6+Math.random()*0.9, sp2:0.3+Math.random()*0.5, o:Math.random()}); }
  function setOrb(st){ orbState = st; const o = ORB[st]; tableRing.material.color.set(o.c); corePool.material.color.set(o.c); coreLight.color.set(o.c); typeText(hudState, o.label); orbPulse = 1; onAir.classList.toggle("live", st==="thinking"); onairMat.color.set(st==="thinking" ? 0xFFFFFF : 0x5A3036); drawPhone(performance.now()/1000); }

  // ---------- agents ----------
  const hitboxes = [];
  AGENTS.forEach(a=>{
    const g = new T.Group(); g.position.set(a.home[0],0,a.home[1]); g.rotation.y = a.facing; scene.add(g);
    const sh = new T.Mesh(new T.PlaneGeometry(1.3,1.3), new T.MeshBasicMaterial({map:SHADOW, transparent:true, depthWrite:false})); sh.rotation.x = -Math.PI/2; sh.position.y = 0.02; g.add(sh);
    const pad = mesh(new T.RingGeometry(0.52,0.6,40), NEON(a.color,0.85), 0,0.03,0, g, false); pad.rotation.x = -Math.PI/2;
    const body = new T.Group(); g.add(body);
    const hit = new T.Mesh(new T.CylinderGeometry(0.6,0.6,2,8), new T.MeshBasicMaterial({visible:false})); hit.position.y = 1; hit.userData.agent = a.id; g.add(hit); hitboxes.push(hit);
    Object.assign(a, {g, body, pad, target:null, then:null, bob:Math.random()*6, busy:false, speed:2.2, mood:0, now:"aan het werk", wantFace:a.facing, seated:false});
  });

  let robotsReady = false;
  function play(a, name, once=false, fade=0.25){
    if(!a.actions) return; const next = a.actions[name]; if(!next) return;
    if(a.curName===name && !once) return;
    next.reset(); next.setEffectiveTimeScale(name==="Walking"?1.15:1); next.setEffectiveWeight(1);
    if(once){ next.setLoop(T.LoopOnce,1); next.clampWhenFinished = true; } else next.setLoop(T.LoopRepeat, Infinity);
    if(a.cur && a.cur!==next) a.cur.fadeOut(fade);
    next.fadeIn(fade).play(); a.cur = next; a.curName = name;
  }
  function sit(a){ a.wantFace = a.facing; a.seated = true; if(a.actions) play(a, "Sitting", true, 0.35); }
  function stand(a, cb){ if(a.seated && a.actions){ a.seated = false; play(a, "Standing", true, 0.2); setTimeout(cb, 420); } else { a.seated = false; cb(); } }
  function makeBean(a){
    const b = a.body, M = TOON(a.color);
    const tor = mesh(new T.SphereGeometry(0.42,20,16), M, 0,0.62,0, b); tor.scale.set(1,1.18,0.95);
    mesh(new T.SphereGeometry(0.36,22,16), TOON(0xF3D2B8), 0,1.32,0, b);
    a.beanFeet = [-1,1].map(s=>{ const f = mesh(new T.SphereGeometry(0.13,10,8), TOON(0x1A1F2E), s*0.17,0.08,0.05, b); f.scale.set(1,0.6,1.35); return f; });
  }
  function accessory(a, headBone, torsoBone){
    const grp = new T.Group(); headBone.add(grp); const ws = new T.Vector3(); headBone.getWorldScale(ws); grp.scale.set(1/ws.x,1/ws.y,1/ws.z);
    const put = (geo, mat, x,y,z) => mesh(geo, mat, x,y,z, grp, true);
    put(new T.CylinderGeometry(0.012,0.012,0.22,6), STD(0x2A2130), 0,0.58,0); put(new T.SphereGeometry(0.05,12,8), NEON(a.color), 0,0.71,0);
    switch(a.acc){
      case "cap": { put(new T.SphereGeometry(0.34,20,12,0,Math.PI*2,0,Math.PI/2), TOON(0x2F7A5B), 0,0.34,0).scale.set(1,0.55,1); put(new T.CylinderGeometry(0.3,0.3,0.03,20,1,false,-Math.PI/2,Math.PI), TOON(0x2F7A5B), 0,0.35,0.16); break; }
      case "beret": { const b = put(new T.SphereGeometry(0.33,20,12), TOON(0x8B1E2D), 0.05,0.46,-0.02); b.scale.set(1.2,0.3,1.2); b.rotation.z = -0.25; break; }
      case "headphones": { put(new T.TorusGeometry(0.36,0.03,8,24,Math.PI), TOON(0x1A141E), 0,0.2,0); [-0.36,0.36].forEach(x=>{ const c = put(new T.CylinderGeometry(0.11,0.11,0.09,16), TOON(0x7CC4FF), x,0.2,0); c.rotation.z = Math.PI/2; }); break; }
      case "glasses": { [-0.12,0.12].forEach(x=>put(new T.TorusGeometry(0.08,0.015,8,18), TOON(0x1A141E), x,0.26,0.31)); break; }
      case "monocle": { put(new T.TorusGeometry(0.1,0.018,8,18), TOON(0xFFB547), 0.13,0.26,0.31); break; }
      case "pencil": { const p = put(new T.CylinderGeometry(0.022,0.022,0.36,8), TOON(0xFFB547), 0.33,0.34,0.02); p.rotation.z = 0.9; break; }
      case "tag": { const t = put(new T.BoxGeometry(0.16,0.1,0.02), TOON(0xFFF1E4), 0,0.86,0); t.rotation.z = 0.3; break; }
      case "coin": { const c = put(new T.CylinderGeometry(0.1,0.1,0.025,20), NEON(0xFFC857), 0,0.9,0); c.rotation.x = Math.PI/2; a.spinner = c; break; }
      case "heart": { const sp = new T.Sprite(new T.SpriteMaterial({map:heartTex, transparent:true, color:0xFF6B8A})); sp.position.set(0,0.95,0); sp.scale.setScalar(0.3); grp.add(sp); a.floater = sp; break; }
      case "shield": { if(torsoBone){ const g2 = new T.Group(); torsoBone.add(g2); const ws2 = new T.Vector3(); torsoBone.getWorldScale(ws2); g2.scale.set(1/ws2.x,1/ws2.y,1/ws2.z); const s = mesh(new T.CylinderGeometry(0.13,0.13,0.03,6), TOON(0xFBF3EA), 0,0.1,0.26, g2); s.rotation.x = Math.PI/2; } break; }
    }
  }
  function initRobots(gltf){
    const base = gltf.scene; const bb = new T.Box3().setFromObject(base); const hgt = bb.max.y - bb.min.y || 1; const sc = 2.15/hgt;
    AGENTS.forEach(a=>{
      const m = T.SkeletonUtils ? T.SkeletonUtils.clone(base) : base.clone(true);
      m.scale.setScalar(sc);
      m.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; const mat = o.material.clone();
        if(/Main/i.test(mat.name)){ mat.color.set(a.color); mat.emissive = new T.Color(a.color); mat.emissiveIntensity = 0.04; mat.roughness = 0.35; mat.metalness = 0.1; }
        else if(/Grey/i.test(mat.name)){ mat.color.set(0xCFC3BA); mat.roughness = 0.5; mat.metalness = 0.05; }
        else if(/Black/i.test(mat.name)){ mat.color.set(0x17111D); mat.emissive = new T.Color(a.color).multiplyScalar(0.25); mat.emissiveIntensity = 1; mat.roughness = 0.2; }
        o.material = mat; } });
      a.body.add(m); a.g.updateMatrixWorld(true);
      const head = m.getObjectByName("Head_1") || m.getObjectByName("Head"), torso = m.getObjectByName("Torso_1") || m.getObjectByName("Torso");
      if(head) try{ accessory(a, head, torso); }catch(e){}
      a.headBone = head; a.look = {phase:Math.random()*100, speed:0.25+Math.random()*0.2, next:2+Math.random()*6, yaw:0, target:0};
      a.mixer = new T.AnimationMixer(m); a.actions = {};
      gltf.animations.forEach(c=>a.actions[c.name] = a.mixer.clipAction(c));
      a.mixer.addEventListener("finished", e=>{ if(e.action===a.actions.Standing || e.action===a.actions.Sitting) return; if(a.target) play(a, a.running?"Running":"Walking"); else if(a.seated) play(a,"Sitting"); else play(a,"Idle"); });
      sit(a);
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

  // ---------- pakketjes (envelopjes) ----------
  const envTex = canvasTex(64,64,(g)=>{ g.font = "46px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("✉️",32,34); });
  const packets = [];
  function packet(from, to, color, dur=0.9){
    const sp = new T.Sprite(new T.SpriteMaterial({map:envTex, transparent:true, depthWrite:false})); sp.scale.setScalar(0.42); scene.add(sp);
    const glow = new T.Sprite(new T.SpriteMaterial({map:GLOW, color, transparent:true, opacity:0.8, depthWrite:false, blending:T.AdditiveBlending})); glow.scale.setScalar(0.9); scene.add(glow);
    packets.push({sp, glow, a:from.clone(), b:to.clone(), t:0, dur}); beep(1200, 0.05, 0.015);
  }
  function updPackets(dt){
    for(let i=packets.length-1;i>=0;i--){ const p = packets[i]; p.t += dt/p.dur; const k = Math.min(1,p.t), e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
      const x = p.a.x+(p.b.x-p.a.x)*e, z = p.a.z+(p.b.z-p.a.z)*e, y = p.a.y+(p.b.y-p.a.y)*e + Math.sin(e*Math.PI)*2.2;
      p.sp.position.set(x,y,z); p.glow.position.set(x,y,z); p.sp.material.rotation = Math.sin(k*9)*0.3;
      if(p.t >= 1){ scene.remove(p.sp); scene.remove(p.glow); packets.splice(i,1); beep(660,0.06,0.015); } }
  }

  // ---------- labels + bubbels ----------
  const labels = {};
  AGENTS.forEach(a=>{ const d = document.createElement("button"); d.type = "button"; d.className = "hq-name"; d.innerHTML = `<i>${a.icon}</i>${esc(a.name)}`; d.setAttribute("aria-label", a.name); d.style.setProperty("--c", hex(a.color)); d.onclick = ()=>showCard(a); overlay.appendChild(d); labels[a.id] = d; });
  const bubbles = [];
  function say(who, text, ms=3400, kind=""){ const d = document.createElement("div"); d.className = "hq-bubble " + kind; d.textContent = text; overlay.appendChild(d); bubbles.push({who, d, until:performance.now()+ms}); }
  const v3 = new T.Vector3();
  function project(pos, dy){ v3.set(pos.x, pos.y+dy, pos.z).project(cam); return [(v3.x*0.5+0.5)*stage.clientWidth, (-v3.y*0.5+0.5)*stage.clientHeight]; }
  const corePos = new T.Vector3(0,2.2,0);
  function placeOverlay(now){
    AGENTS.forEach(a=>{ const [x,y] = project(a.g.position, -0.25); labels[a.id].style.transform = `translate(${x}px,${y}px) translate(-50%,0)`; });
    const W = stage.clientWidth;
    for(let i=bubbles.length-1;i>=0;i--){ const b = bubbles[i];
      if(now > b.until){ b.d.classList.add("out"); if(now > b.until+260){ b.d.remove(); bubbles.splice(i,1); continue; } }
      const a = byId[b.who]; const [x,y] = b.who==="claude" ? project(corePos, 1.2) : project(a.g.position, a.seated ? 2.1 : 2.35);
      const hw = (b.w || (b.w = b.d.offsetWidth))/2; const cx = Math.max(hw+8, Math.min(W-hw-8, x));
      b.d.style.transform = `translate(${cx}px,${Math.max(y, 70)}px) translate(-50%,-100%)`; }
  }

  // ---------- beweging ----------
  const angDiff = (a,b) => { let d = a-b; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; return d; };
  function walkTo(a, x, z, then, run=false){ stand(a, ()=>{ a.target = new T.Vector3(x,0,z); a.then = then||null; a.running = run; a.speed = run ? 4.0 : 2.1; play(a, run ? "Running" : "Walking"); }); }
  function goHome(a, then){ walkTo(a, a.home[0], a.home[1], ()=>{ a.busy = false; a.now = "aan het werk"; sit(a); then && then(); }); }
  function face(a, pos){ a.wantFace = Math.atan2(pos.x-a.g.position.x, pos.z-a.g.position.z); }
  function update(a, dt, t){
    if(a.mixer) a.mixer.update(dt);
    if(a.look && !a.beanFeet){ const k = a.seated && !a.target ? 1 : 0; a.body.scale.y = 1 + k*Math.sin(t*1.4 + a.look.phase)*0.008; }
    if(a.target){
      const p = a.g.position, dx = a.target.x-p.x, dz = a.target.z-p.z, d = Math.hypot(dx,dz);
      if(d < 0.06){ a.target = null; a.running = false; play(a, "Idle"); const f = a.then; a.then = null; f && f(); }
      else { const s = Math.min(d, a.speed*dt); p.x += dx/d*s; p.z += dz/d*s; a.wantFace = Math.atan2(dx,dz); }
      if(a.beanFeet){ a.bob += dt*9; a.beanFeet[0].position.z = 0.05+Math.sin(a.bob)*0.14; a.beanFeet[1].position.z = 0.05-Math.sin(a.bob)*0.14; a.body.position.y = Math.abs(Math.sin(a.bob))*0.08; }
    } else if(a.beanFeet){ a.body.position.y = a.mood>0 ? Math.abs(Math.sin(t*9))*0.3 : 0; }
    a.g.rotation.y += angDiff(a.wantFace, a.g.rotation.y)*Math.min(1, dt*8);
    if(a.spinner) a.spinner.rotation.z += dt*3;
    if(a.floater) a.floater.position.y = 0.95 + Math.sin(t*3)*0.05;
    const act = a.talking || a.target;
    a.pad.material.opacity = act ? 0.55+0.45*Math.abs(Math.sin(t*6)) : 0.7;
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
    out.push({from:"comments", to:"analist", text:"Comments? Stuur screenshots via de regie!", reply:"Zodra er views zijn"});
    return out.sort(()=>Math.random()-0.5);
  }
  let queue = [];
  const headPos = a => new T.Vector3(a.g.position.x, a.seated ? 1.35 : 1.6, a.g.position.z);
  function runBeat(){
    if(chatMode || !robotsReady) return;
    if(!queue.length) queue = beats();
    const b = queue.shift(); if(!b) return;
    const A = byId[b.from], B = byId[b.to]; if(A.busy || B.busy || A.target || B.target) return;
    A.busy = B.busy = true;
    const walked = Math.random() < 0.5;
    const talk = () => {
      A.talking = true; A.now = short(b.text,60);
      if(walked){ face(A, B.g.position); play(A, "Wave", true); }
      say(A.id, b.text, 3300); logLine(A.id, B.id, b.text);
      setTimeout(()=>{ A.talking = false; B.talking = true; if(walked){ stand(B, ()=>{ face(B, A.g.position); play(B, Math.random()<0.8 ? "Yes" : "ThumbsUp", true); }); } say(B.id, b.reply, 2300, "reply"); }, 1700);
      setTimeout(()=>{ B.talking = false; B.busy = false; if(!B.seated && !B.target) sit(B); if(walked) goHome(A); else { A.busy = false; } }, 4400);
    };
    if(walked){ A.now = "loopt naar " + B.name; const dx = A.g.position.x-B.g.position.x, dz = A.g.position.z-B.g.position.z, d = Math.hypot(dx,dz)||1; walkTo(A, B.g.position.x+dx/d*1.15, B.g.position.z+dz/d*1.15, talk); }
    else { A.now = "stuurt iets naar " + B.name; packet(headPos(A), headPos(B), A.color); setTimeout(talk, 900); }
  }
  setInterval(()=>{ if(!document.hidden && !panel.hidden) runBeat(); }, 2400);

  // ---------- interactie: slepen, knijpen, tikken ----------
  const pts = new Map(); let drag = null, pinch = null;
  canvas.addEventListener("pointerdown", e=>{ pts.set(e.pointerId, {x:e.clientX, y:e.clientY}); lastInteract = performance.now();
    if(pts.size===1) drag = {x:e.clientX, y:e.clientY, az:view.az, moved:false};
    if(pts.size===2){ const [p1,p2] = [...pts.values()]; pinch = {d:Math.hypot(p1.x-p2.x,p1.y-p2.y)||1, z:view.zoom}; drag = null; } });
  window.addEventListener("pointermove", e=>{ if(!pts.has(e.pointerId)) return; pts.set(e.pointerId, {x:e.clientX, y:e.clientY}); lastInteract = performance.now();
    if(pinch && pts.size===2){ const [p1,p2] = [...pts.values()]; view.zoom = Math.max(0.8, Math.min(2.8, pinch.z*Math.hypot(p1.x-p2.x,p1.y-p2.y)/pinch.d)); resize(); return; }
    if(!drag) return; const dx = e.clientX-drag.x, dy = e.clientY-drag.y; if(!drag.moved && Math.abs(dx)>6 && Math.abs(dx)>Math.abs(dy)) drag.moved = true; if(!drag.moved) return;
    view.az = Math.max(0.05, Math.min(Math.PI/2-0.05, drag.az - dx*0.006)); placeCam(); });
  const up = e=>{ if(drag && !drag.moved && pts.size===1) pickAt(e); pts.delete(e.pointerId); if(pts.size<2) pinch = null; if(!pts.size) drag = null; };
  window.addEventListener("pointerup", up); window.addEventListener("pointercancel", e=>{ pts.delete(e.pointerId); drag = null; pinch = null; });
  canvas.addEventListener("wheel", e=>{ e.preventDefault(); lastInteract = performance.now(); view.zoom = Math.max(0.8, Math.min(2.8, view.zoom*(e.deltaY>0?0.92:1.08))); resize(); }, {passive:false});
  const ray = new T.Raycaster(), mv = new T.Vector2();
  function pickAt(e){
    const r = canvas.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) return;
    mv.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1); ray.setFromCamera(mv, cam);
    const hit = ray.intersectObjects(hitboxes)[0];
    if(hit) showCard(byId[hit.object.userData.agent]); else if(ray.intersectObject(core, true)[0]) showCard(null); else { card.hidden = true; }
  }
  function fly(x, z, zoom){ lastInteract = performance.now(); if(window.gsap){ gsap.to(view, {tx:x, tz:z, zoom, duration:1.1, ease:"power3.inOut", onUpdate:()=>{ placeCam(); resize(); }}); } else { Object.assign(view,{tx:x,tz:z,zoom}); placeCam(); resize(); } }
  function showCard(a){
    card.hidden = false; beep(990,0.08,0.02);
    if(!a){ card.innerHTML = `<div class="hq-card-h"><span class="dot" style="background:#A98BFF"></span><b>Regietafel</b><button class="x" aria-label="Sluiten">×</button></div><p>Hier komen jouw opdrachten binnen. De telefoon toont je volgende post.</p><div class="small">Status: ${esc(ORB[orbState].label)}</div><button class="btn primary sm" data-open="1">Open de regie</button>`; fly(0,0,1.7); }
    else {
      card.innerHTML = `<div class="hq-card-h"><span class="dot" style="background:${hex(a.color)}"></span><b>${esc(a.icon+" "+a.name)}</b><button class="x" aria-label="Sluiten">×</button></div><p>${esc(a.role)}</p><div class="small">Nu: ${esc(a.now)}</div><button class="btn primary sm" data-ask="${esc(a.name)}">Opdracht voor ${esc(a.name)}</button>`;
      if(!a.target && !a.busy){ a.busy = true; stand(a, ()=>{ face(a, cam.position); play(a, "Wave", true); }); setTimeout(()=>{ a.busy = false; if(!a.target) sit(a); }, 2600); }
      say(a.id, ["Hoi! 👋","Druk druk druk","Wat kan ik doen?","Bijna klaar!","Zeg het maar"][Math.floor(Math.random()*5)], 1900);
      fly(a.g.position.x, a.g.position.z, 2.1);
    }
    card.querySelector(".x").onclick = ()=>{ card.hidden = true; fly(0,0,1); };
    const ask = card.querySelector("[data-ask]"); if(ask) ask.onclick = ()=>{ const i = $("hqInput"); i.value = "@"+ask.dataset.ask+" "; if(mobile()) openChat(); else i.focus(); };
    const op = card.querySelector("[data-open]"); if(op) op.onclick = ()=>{ if(mobile()) openChat(); else $("hqInput").focus(); };
  }
  $("hudCam").onclick = ()=>{ card.hidden = true; if(window.gsap) gsap.to(view,{az:Math.PI/4,duration:0.9,ease:"power2.inOut",onUpdate:placeCam}); else view.az = Math.PI/4; fly(0,0,1); };
  function syncSoundBtn(){ const b = $("hudSound"); b.textContent = soundOn ? "🔊" : "🔇"; b.setAttribute("aria-pressed", soundOn); b.title = soundOn ? "Stem aan" : "Stem uit"; }
  $("hudSound").onclick = ()=>{ soundOn = !soundOn; try{ localStorage.setItem("hq_sound", soundOn?"1":"0"); }catch(e){} syncSoundBtn(); if(soundOn){ beep(880,0.1,0.03); speak("Studio staat aan."); } else if(window.speechSynthesis) speechSynthesis.cancel(); };
  syncSoundBtn();
  let fxOn = true; try{ const f = localStorage.getItem("hq_fx"); if(f) fxOn = f==="1"; }catch(e){}
  $("hudFx").onclick = ()=>{ fxOn = !fxOn; try{ localStorage.setItem("hq_fx", fxOn?"1":"0"); }catch(e){} $("hudFx").setAttribute("aria-pressed", fxOn); };
  $("hudFx").setAttribute("aria-pressed", fxOn);
  $("hudFeedBtn").onclick = ()=>{ stage.classList.toggle("feed-open"); };

  // ---------- post-processing ----------
  let composer = null, bloom = null, fxaa = null, finalPass = null;
  const FinalShader = {uniforms:{tDiffuse:{value:null}, t:{value:0}},
    vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:`uniform sampler2D tDiffuse; uniform float t; varying vec2 vUv; float rnd(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233)))*43758.5453); }
      void main(){ vec2 d = vUv-.5; float r2 = dot(d,d); vec4 c = texture2D(tDiffuse, vUv); c.rgb *= vec3(1.03,.99,.97); c.rgb *= 1. - r2*0.9; c.rgb += (rnd(vUv*900.+t)-.5)*0.028; gl_FragColor = vec4(c.rgb,1.); }`};
  try{
    if(T.EffectComposer && T.UnrealBloomPass){
      composer = new T.EffectComposer(renderer);
      composer.addPass(new T.RenderPass(scene, cam));
      bloom = new T.UnrealBloomPass(new T.Vector2(512,512), 0.55, 0.55, 0.86); composer.addPass(bloom);
      if(T.FXAAShader && T.ShaderPass && !lowEnd){ fxaa = new T.ShaderPass(T.FXAAShader); composer.addPass(fxaa); }
      if(T.ShaderPass){ finalPass = new T.ShaderPass(FinalShader); composer.addPass(finalPass); }
    }
  }catch(e){ composer = null; }

  function resize(){
    const w = stage.clientWidth, h = stage.clientHeight; if(!w||!h) return;
    renderer.setSize(w, h, false);
    if(composer){ composer.setSize(w, h); const pr = renderer.getPixelRatio(); if(fxaa) fxaa.material.uniforms.resolution.value.set(1/(w*pr), 1/(h*pr)); if(lowEnd && bloom) bloom.resolution.set(w/2, h/2); }
    const aspect = w/h, wide = w > 760, base = Math.max(12.5, (aspect<0.9?15:(wide?24:22))/aspect)/view.zoom;
    const shift = wide ? (276/w)*base*aspect*0.42 : 0;
    cam.left = -base*aspect/2 + shift; cam.right = base*aspect/2 + shift; cam.top = base/2; cam.bottom = -base/2; cam.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- intro ----------
  let introDone = false;
  function intro(){ if(introDone) return; introDone = true; view.zoom = 0.7; view.az = 0.15; placeCam(); resize();
    if(window.gsap){ gsap.to(view, {zoom:1, az:Math.PI/4, duration:2.4, ease:"power3.out", onUpdate:()=>{ placeCam(); resize(); }}); } else { view.zoom = 1; view.az = Math.PI/4; placeCam(); resize(); }
    setOrb("idle"); logLine("claude", null, "Studio open. Team van 10 aan het werk."); }

  // ---------- loop ----------
  let last = performance.now(), slowT = 0;
  function loop(now){
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now-last)/1000); last = now;
    if(panel.hidden || document.hidden) return;
    if(!introDone) intro();
    const t = now/1000;
    if(now - lastInteract > 7000 && !drag){ view.drift = Math.sin(t*0.12)*0.08; placeCam(); } else if(Math.abs(view.drift)>0.001){ view.drift *= 0.95; placeCam(); }
    AGENTS.forEach(a=>update(a, dt, t));
    updPackets(dt);
    orbPulse = Math.max(0, orbPulse - dt*0.6);
    phone.rotation.y = Math.sin(t*0.5)*0.5 + (orbState==="thinking" ? t*1.5 : 0); phone.position.y = 1.95 + Math.sin(t*1.3)*0.05;
    cards.forEach((c,i)=>{ const ang = t*0.22 + i*(Math.PI*2/5); c.m.position.set(Math.cos(ang)*2.05, 2.1 + 0.2*Math.sin(t*0.8+i), Math.sin(ang)*2.05); c.m.quaternion.copy(cam.quaternion); });
    hearts.forEach(h=>{ h.o += dt*h.sp2*0.35; if(h.o>1) h.o -= 1; const ang = h.a + t*0.3; h.sp.position.set(Math.cos(ang)*h.r, 0.9 + h.o*2.6, Math.sin(ang)*h.r); h.sp.material.opacity = Math.sin(h.o*Math.PI)*(orbState==="thinking"?1:0.75); });
    corePool.material.opacity = 0.3 + 0.08*Math.sin(t*2) + orbPulse*0.25;
    coreLight.intensity = 1.1 + orbPulse*1.2 + (orbState==="thinking" ? 0.3*Math.sin(t*8) : 0);
    neon.material.opacity = 0.93 + 0.07*Math.sin(t*23)*Math.sin(t*3.1);
    ringLight.material.color.setHSL(0.07, 0.4, 0.9+0.05*Math.sin(t*2));
    if(now - slowT > 1500){ slowT = now; drawWalls(t); AGENTS.forEach(a=>drawDesk(a,t)); drawCards(); drawPhone(t); gauges(); feed(); }
    if(finalPass) finalPass.uniforms.t.value = t;
    if(composer && fxOn) composer.render(); else renderer.render(scene, cam);
    placeOverlay(now);
  }
  drawWalls(0); AGENTS.forEach(a=>drawDesk(a,0)); drawCards(); drawPhone(0); gauges(); feed();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(()=>{ drawWalls(0); AGENTS.forEach(a=>drawDesk(a,0)); drawCards(); drawPhone(0); drawNeon(neonTex.image.getContext("2d"),1024,360); neonTex.needsUpdate = true; });
  requestAnimationFrame(loop);

  // ---------- regie → team ----------
  let chatTimer = null, rallied = [];
  const ROUTE = [[/video|maak|clip|render|frame/i,["director","producer"]],[/script|hook|tekst/i,["scriptwriter"]],[/trend|product|idee|scout/i,["scout"]],[/plan|post|view|like|cijfer|analy|vandaag/i,["analist"]],[/credit|budget|geld|kost/i,["budget"]],[/comment|reactie/i,["comments"]],[/commissie|deal|sample|seller|screenshot/i,["deal"]],[/claim|regel|compliance|mag dat/i,["compliance"]],[/check|kwaliteit|qa|fout/i,["qa"]]];
  function rally(text){
    let ids = []; ROUTE.forEach(([re,a])=>{ if(re.test(text)) ids.push(...a); });
    const at = text.match(/@([\w-]+)/); if(at){ const f = AGENTS.find(a=>a.name.toLowerCase().startsWith(at[1].toLowerCase())); if(f) ids.unshift(f.id); }
    ids = [...new Set(ids.length?ids:["director","producer"])].slice(0,4);
    chatMode = true; setOrb("thinking"); say("claude","Opdracht binnen. Team, aan de slag!",2800); logLine("claude", null, "Opdracht: " + text); speak("Opdracht ontvangen.");
    ids.forEach((id,i)=>{ const a = byId[id]; a.busy = true; a.now = "bij de regietafel"; packet(corePos, headPos(a), 0xFF6B4A, 0.8);
      const ang = i/ids.length*Math.PI*2 + 0.6;
      setTimeout(()=>walkTo(a, Math.cos(ang)*2.35, Math.sin(ang)*2.35, ()=>{ face(a, corePos); a.talking = true; play(a, "Yes", true); say(a.id, ["Ik pak het op!","Aan de slag 💪","Ik help mee","Check!"][i%4], 2400); setTimeout(()=>{ a.talking = false; }, 1400); }, true), 700); });
    clearTimeout(chatTimer); chatTimer = setTimeout(()=>release(), 120000);
    return ids;
  }
  function release(){ chatMode = false; rallied.forEach(id=>goHome(byId[id])); rallied = []; if(orbState!=="idle") setOrb("idle"); }
  function celebrate(msg){
    setOrb("responding"); say("claude", short(msg.text, 130), 8000, "claude"); logLine("claude", msg.agent && byId[msg.agent] ? msg.agent : null, msg.text); speak(msg.text);
    const lead = byId[msg.agent] || byId[rallied[0]||"director"];
    if(lead){ packet(corePos, headPos(lead), 0x53E0B5, 0.8); setTimeout(()=>stand(lead, ()=>{ play(lead, "Dance"); say(lead.id,"Take binnen! ✅",2200); }), 900); setTimeout(()=>{ play(lead, "Idle"); if(!rallied.includes(lead.id)) sit(lead); }, 4300); }
    rallied.filter(id=>!lead || id!==lead.id).forEach(id=>setTimeout(()=>play(byId[id], "ThumbsUp", true), 1000));
    setTimeout(()=>{ release(); setOrb("idle"); }, 5200);
  }
  window.__hqRally = t => { rallied = rally(t); };
  window.__hqReply = m => celebrate(m);

  initChat();
/*__INITCHAT__*/
})();
