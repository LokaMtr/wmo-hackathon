(function(){
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const state = {briefings:[], ideas:[], videos:[], lessons:[], meta:null, sel:new Set(), briefDate:null, canWrite:true, lessonArea:"all", lessonQ:""};
  window.__mcrState = state;
  const STATUS_NL = {new:"nieuw",selected:"gekozen",in_production:"in productie",done:"klaar",rejected:"afgewezen",made:"klaar",scheduled:"gepland",posted:"gepost",winner:"winnaar",promise:"belofte",flop:"flop",pending:"afwachten",opkomend:"opkomend",piek:"piek",uitgemolken:"uitgemolken"};
  const AREA_NL = {production:"Productie",script:"Script",hooks:"Hooks",products:"Producten",posting:"Posten",compliance:"Compliance",budget:"Budget"};
  const AREA_C = {production:"#7CC4FF",script:"#A98BFF",hooks:"#FF5C7A",products:"#53E0B5",posting:"#FF6B4A",compliance:"#B8A9BF",budget:"#FFB547"};
  const TZ = "Europe/Amsterdam";

  // ---------- achtergrond: zachte studiolichten ----------
  (function bg(){
    const c = $("#bgfx"), g = c.getContext("2d"); let w, h;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blobs = [{x:.12,y:.08,r:.55,c:"255,107,74",a:.16,s:.7},{x:.88,y:.18,r:.5,c:"169,139,255",a:.16,s:.5},{x:.5,y:.95,r:.6,c:"255,92,122",a:.08,s:.4},{x:.7,y:.6,r:.35,c:"83,224,181",a:.05,s:.9}];
    function size(){ const dpr = Math.min(devicePixelRatio||1, 1.5); w = innerWidth; h = innerHeight; c.width = w*dpr; c.height = h*dpr; g.setTransform(dpr,0,0,dpr,0,0); }
    size(); addEventListener("resize", size);
    function draw(t){
      g.clearRect(0,0,w,h);
      blobs.forEach((b,i)=>{ const x = (b.x + Math.sin(t/9000*b.s+i)*.04)*w, y = (b.y + Math.cos(t/11000*b.s+i)*.04)*h, r = b.r*Math.max(w,h);
        const rg = g.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,`rgba(${b.c},${b.a})`); rg.addColorStop(1,`rgba(${b.c},0)`); g.fillStyle = rg; g.fillRect(0,0,w,h); });
      g.fillStyle = "rgba(255,236,220,.045)"; for(let y=14;y<h;y+=28) for(let x=14;x<w;x+=28) g.fillRect(x,y,1.2,1.2);
      if(!reduce && !document.hidden) setTimeout(()=>requestAnimationFrame(draw), 60);
    }
    requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", ()=>{ if(!document.hidden && !reduce) requestAnimationFrame(draw); });
  })();

  // ---------- tabs met glijdende indicator ----------
  const ink = $("nav.tabs .ink");
  function moveInk(){ const b = document.querySelector('nav.tabs button[aria-selected="true"]'); if(!b) return; ink.style.left = b.offsetLeft+"px"; ink.style.width = b.offsetWidth+"px"; }
  function showTab(t){
    document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab===t ? "true":"false"));
    ["hq","briefing","ideas","videos","lessons"].forEach(p => { const el = document.getElementById("p-"+p); if(el) el.hidden = p!==t; });
    moveInk();
  }
  window.__showTab = showTab;
  document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => { showTab(b.dataset.tab); try{ localStorage.setItem("mcr_tab3", b.dataset.tab); }catch(e){} }));
  try{ const t = localStorage.getItem("mcr_tab3"); if(t) showTab(t); }catch(e){}
  addEventListener("resize", moveInk); (document.fonts ? document.fonts.ready : Promise.resolve()).then(moveInk); setTimeout(moveInk, 60);

  function img(src, cls=""){
    if(!src) return "";
    const u = /^[0-9a-f]{32}$/.test(src) ? "/_blob/"+src : src;
    return `<img class="${cls}" src="${esc(u)}" alt="" loading="lazy" onerror="this.remove()">`;
  }
  function pill(s){ return `<span class="pill ${esc(s)}">${esc(STATUS_NL[s]||s)}</span>`; }
  function fmtDate(iso){ if(!iso) return "—"; try{ return new Date(iso).toLocaleString("nl-NL",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:TZ}); }catch(e){ return iso; } }
  function countUp(el, to, fmt = v=>Math.round(v)){
    const from = Number(el.dataset.v||0); el.dataset.v = to; if(from===to){ el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 700;
    (function step(n){ const k = Math.min(1,(n-t0)/d), e = 1-Math.pow(1-k,3); el.textContent = fmt(from+(to-from)*e); if(k<1) requestAnimationFrame(step); })(t0);
  }

  // ---------- KPI's ----------
  function renderStats(){
    const m = state.meta || {}, v = state.videos;
    const c = m.credits;
    if(c!=null){ countUp($("#sCredits"), Number(c)); $("#kCredRing").setAttribute("stroke-dasharray", `${Math.min(95, c/150*95).toFixed(1)} 95`); $("#kCredRing").setAttribute("stroke", c<40?"#FF5C7A":"#FF6B4A"); $("#sCreditsFoot").textContent = c<40 ? "bijna op · top-up nodig" : "Higgsfield-saldo"; }
    const newIdeas = state.ideas.filter(i=>i.status==="new");
    countUp($("#sIdeas"), newIdeas.length);
    const best = Math.max(0, ...newIdeas.map(i=>Number(i.score)||0)); $("#sIdeasBar").style.width = best+"%"; $("#sIdeasTop").textContent = best ? best : "—";
    const sched = v.filter(x=>x.status==="scheduled"), posted = v.filter(x=>x.status==="posted");
    countUp($("#sSched"), sched.length);
    const next = sched.filter(x=>x.scheduledAt).sort((a,b)=>String(a.scheduledAt).localeCompare(String(b.scheduledAt)))[0];
    $("#sSchedFoot").textContent = next ? "volgende " + fmtDate(next.scheduledAt) : "posts in de wachtrij";
    $("#chipNext").textContent = next ? "▶ volgende post " + new Date(next.scheduledAt).toLocaleString("nl-NL",{weekday:"short",hour:"2-digit",minute:"2-digit",timeZone:TZ}) : "geen posts gepland";
    countUp($("#sPosted"), posted.length); $("#sPostedBar").style.width = (v.length ? posted.length/v.length*100 : 0)+"%"; $("#sPostedFoot").textContent = `van ${v.length} video's`;
    countUp($("#sComm"), Number(m.commissionTotal||0), x=>"€"+x.toFixed(2).replace(".",","));
    $("#sCommFoot").textContent = m.salesTotal ? `${m.salesTotal} verkopen` : "nog geen verkopen";
    $("#lastRun").textContent = m.lastRun ? "RUN " + new Date(m.lastRun).toLocaleString("nl-NL",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:TZ}).toUpperCase() : "NOG GEEN RUN";
    $("#cIdeas").textContent = state.ideas.filter(i=>["new","selected"].includes(i.status)).length;
    $("#cVideos").textContent = v.length;
    $("#cLessons").textContent = state.lessons.length;
    moveInk();
  }

  // ---------- briefing ----------
  function renderBriefing(){
    const el = $("#p-briefing");
    const list = [...state.briefings].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    if(!list.length){ el.innerHTML = `<div class="empty">Nog geen briefing. De trend-scout schrijft er elke ochtend om 08:00 één.</div>`; return; }
    const cur = list.find(b=>b.date===state.briefDate) || list[0];
    const top = state.ideas.filter(i=>i.date===cur.date).sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,6);
    el.innerHTML = `
      <div class="archive" style="margin-bottom:12px">${list.slice(0,14).map(b=>`<button class="chipbtn" data-d="${esc(b.date)}" aria-pressed="${b.date===cur.date}">${esc(b.date)}</button>`).join("")}</div>
      <div class="brief-wrap">
        <article class="brief glass corner">
          <div class="kicker"><span class="label">Briefing · ${esc(cur.date)}</span><span class="bar"></span><span class="label">${cur.generatedAt?esc(fmtDate(cur.generatedAt)):""}</span></div>
          <div class="headline">${esc(cur.headline||"")}</div>
          <p>${esc(cur.summary||"")}</p>
          ${cur.seasonal?`<div><span class="pill piek">seizoen</span> <span class="muted" style="font-size:14px">${esc(cur.seasonal)}</span></div>`:""}
        </article>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${cur.actions&&cur.actions.length?`<div class="moves glass"><span class="label">Beste moves vandaag</span>${cur.actions.map((a,k)=>`<div class="move"><b>${k+1}</b><span>${esc(a)}</span></div>`).join("")}</div>`:""}
          ${cur.marketNotes&&cur.marketNotes.length?`<div class="market glass"><span class="label">Markt</span><ul>${cur.marketNotes.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></div>`:""}
        </div>
      </div>
      ${top.length?`<div class="section-h" style="margin:18px 0 12px"><h2>Top-ideeën</h2><span class="bar"></span></div><div class="grid">${top.map(ideaCard).join("")}</div>`:""}`;
    el.querySelectorAll(".chipbtn").forEach(b=>b.addEventListener("click",()=>{ state.briefDate = b.dataset.d; renderBriefing(); }));
    bindIdeaControls(el);
  }

  // ---------- ideeën ----------
  function ring(score){
    const s = Math.max(0,Math.min(100,Number(score)||0)), col = s>=75?"#53E0B5":s>=60?"#FFB547":"#FF6B4A";
    return `<div class="scorering" title="score"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/><circle cx="26" cy="26" r="22" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(s/100*138).toFixed(1)} 138" /></svg><b>${esc(score??"–")}</b></div>`;
  }
  function ideaCard(i){
    const imgs = (i.imageAssets&&i.imageAssets.length?i.imageAssets:i.images||[]).slice(0,3);
    const sb = i.scoreBreakdown||{};
    const max = {trend:25, commission:15, saturation:20, aiFit:20, season:10};
    const bars = [["trend","trend"],["commission","comm"],["saturation","verz"],["aiFit","AI"],["season","seiz"]].map(([k,l])=>`<div class="sbar">${l}<i style="--w:${Math.min(100,(Number(sb[k])||0)/max[k]*100)}%"></i></div>`).join("");
    return `<article class="idea glass ${state.sel.has(i._id)?"sel":""}" data-id="${esc(i._id)}">
      <div class="hero">${imgs.length?img(imgs[0]):`<div class="noimg">GEEN BEELD</div>`}${imgs.length>1?`<div class="thumbs">${imgs.slice(1).map(x=>img(x)).join("")}</div>`:""}${ring(i.score)}${i.trendStage?`<span class="stage">${pill(i.trendStage)}</span>`:""}</div>
      <div class="body">
        <div><h3>${esc(i.product)}</h3><div class="muted" style="font-size:12.5px;margin-top:3px">${esc(i.shop||"")}${i.category?" · "+esc(i.category):""}</div></div>
        <div class="facts">${i.price?`<div class="fact"><span>Prijs</span><b title="${esc(i.price)}">${esc(i.price)}</b></div>`:""}${i.commission?`<div class="fact"><span>Commissie</span><b title="${esc(i.commission)}">${esc(i.commission)}</b></div>`:""}</div>
        <div class="sbars">${bars}</div>
        <p class="why">${esc(i.why||"")}</p>
        ${i.gap?`<p class="why" style="-webkit-line-clamp:2"><b style="color:var(--co)">Gat:</b> ${esc(i.gap)}</p>`:""}
        ${(i.concepts||[]).length?`<details><summary>${i.concepts.length} concept${i.concepts.length>1?"en":""}</summary>${i.concepts.map(c=>`<div class="concept"><b>${esc(c.name)}</b><span><span class="label">Hook</span> ${esc(c.hook)}</span>${c.setting?`<span class="muted">${esc(c.setting)} · ${esc(c.angle||"")}</span>`:""}${(c.scenes||[]).length?`<ol>${c.scenes.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`:""}${c.cta?`<span><span class="label">CTA</span> ${esc(c.cta)}</span>`:""}</div>`).join("")}</details>`:""}
        ${(i.risks||[]).length?`<details><summary>Risico's</summary><ul style="margin:6px 0 0;padding-left:18px;font-size:13.5px">${i.risks.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></details>`:""}
        ${i.productUrl?`<a href="${esc(i.productUrl)}" target="_blank" rel="noopener" style="font:600 13px var(--body)">Productpagina ↗</a>`:""}
      </div>
      <footer>
        <button type="button" class="selbtn"><span class="box"></span>${state.sel.has(i._id)?"Gekozen":"Selecteer"}</button>
        <select class="stsel" aria-label="Status" ${state.canWrite?"":"disabled"}>
          ${["new","selected","in_production","done","rejected"].map(s=>`<option value="${s}" ${i.status===s?"selected":""}>${STATUS_NL[s]}</option>`).join("")}
        </select>
      </footer>
    </article>`;
  }
  function renderIdeas(){
    const f = $("#fStatus").value, srt = $("#fSort").value, q = $("#fSearch").value.trim().toLowerCase();
    let list = state.ideas.filter(i => f==="all" ? true : f==="open" ? ["new","selected"].includes(i.status||"new") : (i.status||"new")===f);
    if(q) list = list.filter(i => (i.product+" "+(i.category||"")+" "+(i.shop||"")).toLowerCase().includes(q));
    list.sort(srt==="score" ? (a,b)=>(b.score||0)-(a.score||0) : (a,b)=>String(b.date).localeCompare(String(a.date)));
    const g = $("#ideaGrid");
    g.innerHTML = list.length ? list.map(ideaCard).join("") : `<div class="empty">Geen ideeën met dit filter.</div>`;
    bindIdeaControls(g);
  }
  function bindIdeaControls(root){
    root.querySelectorAll(".idea").forEach(card=>{
      const id = card.dataset.id;
      card.querySelector(".selbtn").addEventListener("click", ()=>{ state.sel.has(id)?state.sel.delete(id):state.sel.add(id); renderSel(); document.querySelectorAll(`.idea[data-id="${CSS.escape(id)}"]`).forEach(c=>{ c.classList.toggle("sel", state.sel.has(id)); c.querySelector(".selbtn").lastChild.textContent = state.sel.has(id)?"Gekozen":"Selecteer"; }); });
      card.querySelector(".stsel").addEventListener("change", async e=>{
        const v = e.target.value;
        try{ await db.doc("ideas/"+id).update({status:v, updatedAt:new Date().toISOString()}); toast("Status: "+STATUS_NL[v]); }
        catch(err){ state.canWrite = false; toast("Opslaan lukt niet met jouw rechten"); }
      });
    });
  }
  function renderSel(){ $("#selbar").hidden = state.sel.size===0; $("#selCount").textContent = state.sel.size; }
  $("#clearSel").addEventListener("click",()=>{ state.sel.clear(); renderSel(); renderIdeas(); renderBriefing(); });

  function buildPrompt(){
    const picked = state.ideas.filter(i=>state.sel.has(i._id));
    const lines = [];
    lines.push(`Maak een Mila-video voor ${picked.length===1?"dit product":"deze "+picked.length+" producten"} (1 video per product), uit de Mila Control Room.`);
    lines.push(`Volg ugc-ops/agents/scriptwriter.md, ai-video-director.md, producer.md en qa-checker.md, en lees eerst ugc-ops/memory/lessons.md + de lessons in het dashboard.`);
    lines.push(`Na afloop: video's toevoegen aan dashboard-collectie videos (product = TikTok-productnaam), idee-status op "done", nieuwe lessen opslaan, inplannen in Metricool.`);
    picked.forEach((i,n)=>{
      lines.push(""); lines.push(`=== ${n+1}. ${i.product} (idea id: ${i._id}) ===`);
      if(i.shop) lines.push(`Shop: ${i.shop}`); if(i.category) lines.push(`Categorie: ${i.category}`);
      if(i.price) lines.push(`Prijs: ${i.price}`); if(i.commission) lines.push(`Commissie: ${i.commission}`);
      if(i.productUrl) lines.push(`Productpagina: ${i.productUrl}`);
      lines.push(`Trendfase: ${i.trendStage||"?"} · Score: ${i.score??"?"}`);
      if(i.why) lines.push(`Waarom nu: ${i.why}`); if(i.gap) lines.push(`Gat in de markt: ${i.gap}`);
      (i.signals||[]).forEach(s=>lines.push(`Signaal: ${s}`));
      (i.concepts||[]).forEach((c,k)=>{ lines.push(`Concept ${k+1}: ${c.name} [${c.angle||""}] setting: ${c.setting||""}`); lines.push(`  Hook: ${c.hook}`); (c.scenes||[]).forEach((s,j)=>lines.push(`  Scène ${j+1}: ${s}`)); if(c.cta) lines.push(`  CTA: ${c.cta}`); });
      (i.risks||[]).forEach(r=>lines.push(`Risico: ${r}`));
      if((i.images||[]).length) lines.push(`Productfoto's: ${i.images.join(" ")}`);
      if((i.imageAssets||[]).length) lines.push(`Dashboard-asset-ids van de foto's: ${i.imageAssets.join(" ")}`);
    });
    return lines.join("\n");
  }
  async function markSelected(){ if(!state.canWrite || !db) return; for(const id of state.sel){ const i = state.ideas.find(x=>x._id===id); if(i && i.status==="new"){ try{ await db.doc("ideas/"+id).update({status:"selected",updatedAt:new Date().toISOString()}); }catch(e){} } } }
  $("#copyBtn").addEventListener("click", async ()=>{
    const text = buildPrompt();
    try{ await navigator.clipboard.writeText(text); toast("Prompt gekopieerd"); }
    catch(e){ const ta = document.createElement("textarea"); ta.className = "fallback"; ta.value = text; ta.setAttribute("aria-label","Prompt"); $("#p-ideas").prepend(ta); showTab("ideas"); ta.focus(); ta.select(); toast("Kopiëren geblokkeerd: tekst is geselecteerd"); }
    markSelected();
  });
  $("#sendSelBtn").addEventListener("click", ()=>{
    const text = buildPrompt(); showTab("hq"); try{ localStorage.setItem("mcr_tab3","hq"); }catch(e){}
    if(window.__hqSendText){ if(window.__openChat) window.__openChat(); window.__hqSendText(text); markSelected(); state.sel.clear(); renderSel(); renderIdeas(); }
    else toast("Chat niet beschikbaar in deze weergave");
  });

  // ---------- planning ----------
  function dayKey(iso){ return new Date(iso).toLocaleDateString("en-CA",{timeZone:TZ}); }
  function renderVideos(){
    const el = $("#p-videos"), v = state.videos;
    if(!v.length){ el.innerHTML = `<div class="empty">Nog geen video's.</div>`; return; }
    const todayK = dayKey(new Date().toISOString()), tomK = dayKey(new Date(Date.now()+864e5).toISOString());
    const groups = {};
    v.forEach(x=>{ const k = x.status==="posted" && x.postedAt ? dayKey(x.postedAt) : x.scheduledAt ? dayKey(x.scheduledAt) : "zz"; (groups[k] = groups[k]||[]).push(x); });
    const keys = Object.keys(groups).sort();
    const card = x => {
      const when = x.status==="posted" && x.postedAt ? x.postedAt : x.scheduledAt;
      const tm = when ? new Date(when).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit",timeZone:TZ}) : "—";
      const m = x.metrics||{};
      return `<article class="vcard glass ${esc(x.status||"made")}">
        <div class="vphone"><small>${esc((STATUS_NL[x.status]||x.status||"").toUpperCase())}</small><span>${esc(tm)}</span></div>
        <div style="min-width:0">
          <div class="vtitle">${esc(x.title)}</div>
          <div class="vsub">${esc(x.concept||"")}</div>
          <div class="vrow">${x.product?`<button class="copyname" data-name="${esc(x.product)}" title="Tik om de productnaam voor TikTok te kopiëren">${esc(x.product)}</button>`:""}${x.verdict&&x.verdict!=="pending"?pill(x.verdict):""}</div>
        </div>
        <div class="vmeta"><div><b>${esc(m.views!=null?m.views:"—")}</b><span>views</span></div><div><b>${esc(m.likes!=null?m.likes:"—")}</b><span>likes</span></div><div><b>${esc(x.credits??"—")}</b><span>credits</span></div></div>
      </article>`;
    };
    const s = v.filter(x=>x.status==="scheduled").length, p = v.filter(x=>x.status==="posted").length, mde = v.filter(x=>x.status==="made").length;
    el.innerHTML = `<div class="plan-sum" style="margin-bottom:16px"><span class="chip">📅 ${s} gepland</span><span class="chip">✅ ${p} gepost</span><span class="chip">⏳ ${mde} wacht op planning</span><span class="chip">🪙 ${v.reduce((a,x)=>a+(Number(x.credits)||0),0)} credits besteed</span></div>
      <div class="timeline">${keys.map(k=>{
        const label = k==="zz" ? "Niet gepland" : k===todayK ? "Vandaag" : k===tomK ? "Morgen" : new Date(k+"T12:00:00").toLocaleDateString("nl-NL",{weekday:"long"});
        const sub = k==="zz" ? "" : new Date(k+"T12:00:00").toLocaleDateString("nl-NL",{day:"numeric",month:"long"});
        return `<div class="day ${k===todayK?"today":""}"><div class="day-h"><b>${esc(label)}</b><span>${esc(sub)}</span></div><div class="slots">${groups[k].sort((a,b)=>String(a.scheduledAt||a.postedAt).localeCompare(String(b.scheduledAt||b.postedAt))).map(card).join("")}</div></div>`;
      }).join("")}</div>`;
    el.querySelectorAll(".copyname").forEach(b=>b.addEventListener("click", async ()=>{
      try{ await navigator.clipboard.writeText(b.dataset.name); toast("Productnaam gekopieerd, plak hem in TikTok"); }
      catch(e){ const r = document.createRange(); r.selectNodeContents(b); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast("Geselecteerd, kopieer handmatig"); }
    }));
  }

  // ---------- geheugen ----------
  function renderLessons(){
    const el = $("#p-lessons");
    if(!state.lessons.length){ el.innerHTML = `<div class="empty">Nog geen lessen.</div>`; return; }
    const areas = ["all", ...Object.keys(AREA_NL).filter(a=>state.lessons.some(l=>l.area===a))];
    const q = state.lessonQ.toLowerCase();
    const list = state.lessons.filter(l=>(state.lessonArea==="all"||l.area===state.lessonArea) && (!q || (l.rule+" "+(l.evidence||"")).toLowerCase().includes(q))).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
    el.innerHTML = `<div class="lessons-top" style="margin-bottom:14px">${areas.map(a=>`<button class="chipbtn" data-a="${a}" aria-pressed="${state.lessonArea===a}">${a==="all"?"Alles":esc(AREA_NL[a]||a)} · ${a==="all"?state.lessons.length:state.lessons.filter(l=>l.area===a).length}</button>`).join("")}<input id="lq" class="toolbar" type="search" placeholder="Zoek in geheugen…" value="${esc(state.lessonQ)}" style="flex:1;min-width:180px;font:500 14px var(--body);color:var(--ink);background:var(--card);border:1px solid var(--line2);border-radius:99px;padding:10px 16px;min-height:42px"></div>
      <div class="lessons">${list.map(l=>`<article class="lcard glass" style="--lc:${AREA_C[l.area]||"#2EE6FF"}"><span class="area">${esc(AREA_NL[l.area]||l.area)}</span><p>${esc(l.rule)}</p>${l.evidence?`<div class="ev">${esc(l.evidence)}</div>`:""}</article>`).join("") || `<div class="empty">Niets gevonden.</div>`}</div>`;
    el.querySelectorAll("[data-a]").forEach(b=>b.addEventListener("click",()=>{ state.lessonArea = b.dataset.a; renderLessons(); }));
    const lq = el.querySelector("#lq"); lq.addEventListener("input", ()=>{ state.lessonQ = lq.value; const pos = lq.selectionStart; renderLessons(); const n = $("#lq"); n.focus(); n.setSelectionRange(pos,pos); });
  }

  let toastT;
  function toast(msg){ let t = document.querySelector(".toast"); if(!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); document.body.appendChild(t); } t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(()=>{ t.hidden = true; }, 2600); }
  window.__toast = toast;

  ["#fStatus","#fSort"].forEach(s=>$(s).addEventListener("change",renderIdeas));
  $("#fSearch").addEventListener("input",renderIdeas);

  function renderAll(){ renderStats(); renderBriefing(); renderIdeas(); renderVideos(); renderLessons(); }
  renderAll();

  const SCOUT_TRIGGER = "trig_01Qm25KzfNSSrR8tuWLoHiiv";
  $("#scoutBtn").addEventListener("click", async (e)=>{
    const b = e.currentTarget; b.disabled = true; b.textContent = "Bezig…";
    try{
      const mcp = await window.claude?.use?.("mcp"); if(!mcp) throw {code:"unavailable"};
      await mcp.callTool("Claude Code Remote","fire_trigger",{trigger_id:SCOUT_TRIGGER});
      b.textContent = "🔭 Scout draait"; toast("Trend-scout gestart, ideeën verschijnen vanzelf");
    }catch(err){
      b.disabled = false; b.textContent = "🔭 Trend-scout";
      const c = err && err.code;
      toast(c==="server_not_connected"||c==="needs_reauth" ? "Verbind Claude Code Remote in claude.ai" : c==="not_granted"||c==="consent_required" ? "Toestemming geweigerd" : c==="unavailable" ? "Knop werkt alleen in claude.ai" : "Starten mislukt");
    }
  });

  let db = null;
  (async ()=>{
    db = await window.claude?.use?.("db");
    if(!db){ $("#offline").hidden = false; return; }
    const sub = (col, key) => db.collection(col).onSnapshot(s=>{ state[key] = s.docs.map(d=>({...d.data(), _id:d.id})); renderAll(); }, ()=>{});
    sub("briefings","briefings"); sub("ideas","ideas"); sub("videos","videos"); sub("lessons","lessons");
    db.doc("meta/state").onSnapshot(s=>{ state.meta = s.exists ? s.data() : null; renderStats(); }, ()=>{});
    try{ const user = await window.claude.use("user"); const w = user && user.can ? await user.can("data.write") : null; if(w===false) state.canWrite = false; }catch(e){}
  })();
})();
