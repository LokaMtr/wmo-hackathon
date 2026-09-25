  function initChat(){
    const log = document.getElementById("hqLog"), form = document.getElementById("hqForm"), input = document.getElementById("hqInput"), st = document.getElementById("hqStatus");
    const fileIn = document.getElementById("hqFile"), tray = document.getElementById("hqTray"), chatBox = document.querySelector(".hq-chat");
    const DASH = "https://claude.ai/artifact/VquzgADXaj6cfjJmBkvDKE";
    const OK = ["image/png","image/jpeg","image/gif","image/webp","video/mp4","video/webm","application/pdf","text/plain","text/markdown","text/csv","application/json"];
    const BY_EXT = {md:"text/markdown", txt:"text/plain", csv:"text/csv", json:"application/json", pdf:"application/pdf", mp4:"video/mp4", webm:"video/webm", png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg", webp:"image/webp", gif:"image/gif"};
    let db = null, msgs = [], seen = new Set(), first = true, pending = [];
    const blobUrl = id => "/_blob/" + id;
    function attHtml(list){
      if(!list || !list.length) return "";
      return `<div class="att">${list.map(a=> a.type && a.type.startsWith("image/")
        ? `<a href="${esc(blobUrl(a.id))}" target="_blank" rel="noopener"><img src="${esc(blobUrl(a.id))}" alt="${esc(a.name)}" loading="lazy"></a>`
        : `<a class="file" href="${esc(blobUrl(a.id))}" target="_blank" rel="noopener">📄 ${esc(a.name)}</a>`).join("")}</div>`;
    }
    function render(){
      if(!msgs.length){ log.innerHTML = `<div class="hq-empty">Stuur het team een opdracht. Plak of sleep foto's, screenshots of PDF's erbij. Het gaat rechtstreeks naar Claude, en het antwoord komt hier terug.</div>`; return; }
      log.innerHTML = msgs.map(m=>`<div class="msg ${m.role==="claude"?"c":"u"}"><div class="who">${m.role==="claude"?"Claude":"Jij"} · ${esc(fmtShort(m.at))}</div>${m.text?`<div>${esc(m.text)}</div>`:""}${attHtml(m.attachments)}</div>`).join("");
      log.scrollTop = log.scrollHeight;
    }
    function renderTray(){
      tray.hidden = !pending.length;
      tray.innerHTML = pending.map((p,i)=>`<div class="chip">${p.preview?`<img src="${p.preview}" alt="">`:`<span class="ic">📄</span>`}<span class="nm">${esc(short(p.name,22))}</span><button type="button" data-rm="${i}" aria-label="Verwijder">×</button></div>`).join("");
      tray.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{ const x = pending.splice(+b.dataset.rm,1)[0]; if(x&&x.preview) URL.revokeObjectURL(x.preview); renderTray(); });
    }
    async function toJpeg(file){
      const bmp = await createImageBitmap(file);
      const max = 2400, sc = Math.min(1, max/Math.max(bmp.width,bmp.height));
      const c = document.createElement("canvas"); c.width = Math.round(bmp.width*sc); c.height = Math.round(bmp.height*sc);
      c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
      return await new Promise(r=>c.toBlob(r,"image/jpeg",0.9));
    }
    async function addFiles(files){
      for(const f of files){
        let type = f.type || BY_EXT[(f.name.split(".").pop()||"").toLowerCase()] || "";
        let blob = f, name = f.name || ("plak-" + Date.now() + ".png");
        try{
          if(type.startsWith("image/") && (!OK.includes(type) || f.size > 6e6)){ blob = await toJpeg(f); type = "image/jpeg"; name = name.replace(/\.\w+$/,"") + ".jpg"; }
        }catch(e){ st.textContent = `${name}: dit fotoformaat kan de browser niet lezen. Exporteer als JPG of PNG.`; continue; }
        if(!OK.includes(type)){ st.textContent = `${name}: dit type wordt niet ondersteund (wel: foto's, PDF, mp4, txt/md/csv/json). Zet Word-bestanden om naar PDF.`; continue; }
        if(blob.size > 20e6){ st.textContent = `${name} is groter dan 20 MB.`; continue; }
        pending.push({blob, type, name, preview: type.startsWith("image/") ? URL.createObjectURL(blob) : null});
      }
      renderTray();
    }
    render();
    window.__hqSendText = t => { input.value = t; form.requestSubmit(); };
    document.querySelectorAll("#hqQuick [data-q]").forEach(b=>b.addEventListener("click", ()=>{ input.value = b.dataset.q; form.requestSubmit(); }));
    (async()=>{
      db = await (window.claude && window.claude.use ? window.claude.use("db") : null);
      if(!db){ st.textContent = "Chat werkt alleen als je het dashboard in claude.ai opent."; return; }
      db.collection("chat").orderBy("at","desc").limit(40).onSnapshot(s=>{
        msgs = s.docs.map(d=>({...d.data(), _id:d.id})).reverse(); render();
        msgs.forEach(m=>{ if(!seen.has(m._id)){ seen.add(m._id); if(!first && m.role==="claude" && window.__hqReply){ window.__hqReply(m); st.textContent = "Claude heeft geantwoord."; } } });
        first = false;
      }, ()=>{});
    })();
    document.getElementById("hqAttach").addEventListener("click", ()=>fileIn.click());
    fileIn.addEventListener("change", ()=>{ addFiles([...fileIn.files]); fileIn.value = ""; });
    input.addEventListener("paste", e=>{ const fs = [...(e.clipboardData && e.clipboardData.files || [])]; if(fs.length){ e.preventDefault(); addFiles(fs); } });
    ["dragenter","dragover"].forEach(ev=>chatBox.addEventListener(ev, e=>{ e.preventDefault(); chatBox.classList.add("drop"); }));
    ["dragleave","drop"].forEach(ev=>chatBox.addEventListener(ev, e=>{ e.preventDefault(); if(ev==="drop" || !chatBox.contains(e.relatedTarget)) chatBox.classList.remove("drop"); }));
    chatBox.addEventListener("drop", e=>{ const fs = [...(e.dataTransfer && e.dataTransfer.files || [])]; if(fs.length) addFiles(fs); });
    input.addEventListener("keydown", e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener("submit", async e=>{
      e.preventDefault(); const text = input.value.trim(); if(!text && !pending.length) return;
      const btn = form.querySelector("button[type=submit]"); btn.disabled = true; st.textContent = pending.length ? `Bijlagen uploaden (0/${pending.length})…` : "Versturen…";
      try{
        const attachments = [];
        if(pending.length){
          const assets = await (window.claude && window.claude.use ? window.claude.use("assets") : null);
          if(!assets) throw {code:"no_assets"};
          for(let i=0;i<pending.length;i++){
            const p = pending[i]; const r = await assets.upload(p.blob, {type:p.type});
            attachments.push({id:r.id, name:p.name, type:r.contentType||p.type}); st.textContent = `Bijlagen uploaden (${i+1}/${pending.length})…`;
          }
        }
        if(db){ const id = "u"+Date.now(); await db.doc("chat/"+id).set({role:"user", text, at:new Date().toISOString(), attachments}); }
        let msg = text || "(zie bijlagen)";
        if(attachments.length) msg += `\n\nBijlagen (${attachments.length}), opgeslagen in dashboard ${DASH}. Lees ze met Artifact action=read, url=${DASH}, path=<asset-id>:\n` + attachments.map(a=>`- ${a.name} (${a.type}): ${a.id}`).join("\n");
        const mcp = await (window.claude && window.claude.use ? window.claude.use("mcp") : null);
        if(!mcp) throw {code:"unavailable"};
        await mcp.callTool("Claude Code Remote","fire_trigger",{trigger_id:CHAT_TRIGGER, text:msg});
        input.value = ""; pending.forEach(p=>p.preview&&URL.revokeObjectURL(p.preview)); pending = []; renderTray();
        st.textContent = "Verstuurd. Claude is ermee bezig, het antwoord verschijnt hier.";
        if(window.__hqRally) window.__hqRally(text || "bijlage");
      }catch(err){
        const c = err && err.code;
        st.textContent = c==="server_not_connected"||c==="needs_reauth" ? "Verbind ‘Claude Code Remote’ in claude.ai en probeer opnieuw." :
                         c==="not_granted"||c==="consent_required" ? "Toestemming geweigerd; sta de koppeling toe om te chatten." :
                         c==="no_assets" ? "Bijlagen uploaden kan alleen als eigenaar in claude.ai." :
                         c==="too_large" ? "Een bijlage is te groot (max 20 MB)." :
                         c==="unsupported_type" ? "Dit bestandstype wordt niet ondersteund." :
                         c==="quota_or_state" ? "Opslag van het dashboard is vol." :
                         c==="unavailable" ? "Chat werkt alleen in claude.ai." : "Versturen mislukt. Probeer het nog eens.";
      } finally { btn.disabled = false; }
    });
  }
