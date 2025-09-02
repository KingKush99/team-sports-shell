// ------------- Helpers -------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const S = { get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)) };

// ------------- Language i18n -------------
const I18N = {
  en: {
    headline:"Pick a team, pop the puck, rule the leaderboard.",
    subhead:"A light, fast, Google-Doodle style experience.",
    card_top:"Top Notes", note1:"Mini-Sticks teams across Ontario, Québec, Manitoba, and the Northeastern U.S.",
    note2:"Play the Mini-Game and your score adds to your team’s universal leaderboard.",
    note3:"Use BALL·E, CRYPTO, or FIAT and earn coins by watching videos.",
    card_power:"Power Meter", power_desc:"The faster you pop the puck, the higher your combo multiplier climbs.",
    open_profile:"Open Profile", card_highlights:"Highlights", high_desc:"Quick clips from the community are coming soon.",
    tab_game:"Game", tab_leaderboard:"Leaderboard", start_game:"Start Game", score:"Score:", time:"Time:",
    screenshot:"Screenshot", start_rec:"Start Recording", download_rec:"Download Recording",
    buy_balle:"Buy BALL·E", buy_crypto:"Buy Crypto", buy_fiat:"Buy with Fiat", earn_video:"Earn by Watching",
    rosters_title:"Team Rosters", stats_title:"League Stats",
    me:"ME", friends:"FRIENDS", level:"LEVEL", and_buddy:"& Buddy", buddy_hist:"Buddy History", journal:"Journal", style:"Style",
    total_activity:"TOTAL ACTIVITY", km_walked:"Distance Skated", goals:"Goals Scored", rinks:"Rinks Visited", xp_total:"Total XP", start_date:"Start Date",
    menu:"Menu", light_mode:"Light Mode", light_hint:"Default is Dark Mode.",
    chatbot:"Chatbot", attach_shot:"Attach Screenshot", attach_rec:"Attach Recording", send:"Send",
    chat_hint:"Uploads are disabled. Use the Screenshot / Recording buttons from the Game tab."
  },
  fr: {
    headline:"Choisis une équipe, clique le palet et règne sur le classement.",
    subhead:"Une expérience légère et rapide façon Google Doodle.",
    card_top:"À retenir", note1:"Équipes Mini-Sticks en Ontario, Québec, Manitoba et Nord-Est américain.",
    note2:"Joue au mini-jeu et ton score s’ajoute au classement universel de ton équipe.",
    note3:"Utilise BALL·E, CRYPTO ou FIAT et gagne des pièces en regardant des vidéos.",
    card_power:"Compteur de puissance", power_desc:"Plus tu cliques vite, plus le multiplicateur grimpe.",
    open_profile:"Ouvrir le profil", card_highlights:"Moments forts", high_desc:"Clips de la communauté à venir.",
    tab_game:"Jeu", tab_leaderboard:"Classement", start_game:"Lancer la partie", score:"Score :", time:"Temps :",
    screenshot:"Capture d’écran", start_rec:"Démarrer l’enregistrement", download_rec:"Télécharger",
    buy_balle:"Acheter BALL·E", buy_crypto:"Acheter Crypto", buy_fiat:"Acheter en Fiat", earn_video:"Gagner en regardant",
    rosters_title:"Effectifs", stats_title:"Statistiques de la ligue",
    me:"MOI", friends:"AMIS", level:"NIVEAU", and_buddy:"& Copain", buddy_hist:"Historique", journal:"Journal", style:"Style",
    total_activity:"ACTIVITÉ TOTALE", km_walked:"Distance patinée", goals:"Buts marqués", rinks:"Patinoires visitées", xp_total:"XP total", start_date:"Date de début",
    menu:"Menu", light_mode:"Mode clair", light_hint:"Le mode par défaut est sombre.",
    chatbot:"Chatbot", attach_shot:"Joindre capture", attach_rec:"Joindre enregistrement", send:"Envoyer",
    chat_hint:"Les téléchargements sont désactivés. Utilisez les boutons Capture/Enregistrement dans l’onglet Jeu."
  },
  es: {
    headline:"Elige un equipo, golpea el puck y domina la tabla.",
    subhead:"Experiencia ligera y rápida al estilo Google Doodle.",
    card_top:"Notas clave", note1:"Equipos Mini-Sticks en Ontario, Quebec, Manitoba y el noreste de EE. UU.",
    note2:"Juega y tu puntaje se suma al tablero universal de tu equipo.",
    note3:"Usa BALL·E, CRYPTO o FIAT y gana monedas viendo videos.",
    card_power:"Medidor de poder", power_desc:"Cuanto más rápido haces clic, más sube el multiplicador.",
    open_profile:"Abrir perfil", card_highlights:"Destacados", high_desc:"Clips de la comunidad pronto.",
    tab_game:"Juego", tab_leaderboard:"Clasificación", start_game:"Iniciar juego", score:"Puntaje:", time:"Tiempo:",
    screenshot:"Captura", start_rec:"Grabar", download_rec:"Descargar",
    buy_balle:"Comprar BALL·E", buy_crypto:"Comprar Crypto", buy_fiat:"Comprar con Fiat", earn_video:"Ganar viendo",
    rosters_title:"Plantillas", stats_title:"Estadísticas de la liga",
    me:"YO", friends:"AMIGOS", level:"NIVEL", and_buddy:"& Compañero", buddy_hist:"Historial", journal:"Diario", style:"Estilo",
    total_activity:"ACTIVIDAD TOTAL", km_walked:"Distancia patinada", goals:"Goles", rinks:"Pistas visitadas", xp_total:"XP total", start_date:"Fecha de inicio",
    menu:"Menú", light_mode:"Modo claro", light_hint:"El modo predeterminado es oscuro.",
    chatbot:"Chatbot", attach_shot:"Adjuntar captura", attach_rec:"Adjuntar grabación", send:"Enviar",
    chat_hint:"Las subidas están deshabilitadas. Usa Captura/Grabación en la pestaña Juego."
  }
};
function setLang(lang){
  const dict = I18N[lang] || I18N.en;
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  $('#chatIn').placeholder = (lang==='fr')?'Parle ou écris…':(lang==='es')?'Habla o escribe…':'Speak or type…';
  S.set("lang", lang);
}

// ------------- Teams (32 Mini-Sticks) -------------
const TEAMS = [
  // Ontario (14)
  'Toronto Blizzards','Ottawa Rapids','Hamilton Steelhawks','Mississauga Meteors','Brampton Bears','Kitchener Cougars','London Frost','Windsor Vipers','Niagara Storm','Sudbury Huskies','Thunder Bay Thunders','Kingston Voyageurs','Barrie Northstars','Oshawa Orbiters',
  // Quebec (6)
  'Montreal Miners','Quebec City Winter Foxes','Laval Lynx','Gatineau Glaciers','Sherbrooke Sables','Saguenay Snow Owls',
  // Manitoba (2)
  'Winnipeg Whiteouts','Brandon Bison',
  // Northeastern US (10)
  'New York Empire','Brooklyn Blades','Boston Harbor Hawks','Providence Prowlers','Hartford Hurricanes','New Haven Narwhals','Albany Avalanche','Buffalo Lake Effect','Newark Night Riders','Portland Polar Bears'
];
function populateTeams(){
  $('#teamSel').innerHTML = TEAMS.map(t=>`<option value="${t}">${t}</option>`).join('');
  $('#rosterTeam').innerHTML = TEAMS.map(t=>`<option value="${t}">${t}</option>`).join('');
}

// ------------- Game -------------
const game = { running:false, score:0, time:0, puck:{x:60,y:130,r:16,vx:3.2,vy:0.8}, ctx:null, raf:null, timer:null, team:null };
function initCanvas(){ const c=$('#canvas'); game.ctx=c.getContext('2d'); c.addEventListener('click', onClick); draw() }
function startGame(){
  if (game.running) return;
  game.running=true; game.score=0; game.time=20; game.team=$('#teamSel').value;
  $('#score').textContent=0; $('#time').textContent=game.time;
  if (game.timer) clearInterval(game.timer);
  game.timer=setInterval(()=>{ game.time-=1; $('#time').textContent=game.time; if (game.time<=0) endGame() },1000);
  const loop=()=>{ if(!game.running) return; update(); draw(); game.raf=requestAnimationFrame(loop) }; loop();
}
function endGame(){
  game.running=false; cancelAnimationFrame(game.raf); clearInterval(game.timer); $('#time').textContent='0';
  const board=S.get('board',{}); const t=game.team||$('#teamSel').value; board[t]=(board[t]||0)+game.score; S.set('board',board); renderBoard();
  const xp=S.get('xp',0)+game.score; S.set('xp',xp); updateProfileXP(xp);
  alert(`Final Score: ${game.score} (${t})`);
}
function onClick(e){
  if (!game.running) return;
  const rect=e.target.getBoundingClientRect(); const x=e.clientX-rect.left, y=e.clientY-rect.top;
  const dx=x-game.puck.x, dy=y-game.puck.y;
  if (Math.hypot(dx,dy)<=game.puck.r+6){ game.score+=10; $('#score').textContent=game.score; game.puck.vx*=(1.03+Math.random()*0.02); game.puck.vy*=(1.03+Math.random()*0.02) }
}
function update(){
  const c=$('#canvas'); const p=game.puck; p.x+=p.vx; p.y+=p.vy;
  if (p.x<p.r||p.x>c.width-p.r) p.vx*=-1; if (p.y<p.r||p.y>c.height-p.r) p.vy*=-1;
  p.vy+=(Math.random()-0.5)*0.2; p.vx+=(Math.random()-0.5)*0.15; const sp=Math.hypot(p.vx,p.vy), mx=6.5; if (sp>mx){ p.vx*=mx/sp; p.vy*=mx/sp }
}
function draw(){
  const c=$('#canvas'), ctx=game.ctx; ctx.clearRect(0,0,c.width,c.height);
  const grd=ctx.createLinearGradient(0,0,0,c.height); grd.addColorStop(0,'#183050'); grd.addColorStop(1,'#0c1a2e'); ctx.fillStyle=grd; ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle='#7aa2ff'; ctx.setLineDash([8,8]); ctx.beginPath(); ctx.moveTo(c.width/2,0); ctx.lineTo(c.width/2,c.height); ctx.stroke(); ctx.setLineDash([]);
  const {x,y,r}=game.puck; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle='#111'; ctx.fill(); ctx.strokeStyle='#eee'; ctx.lineWidth=2; ctx.stroke(); ctx.lineWidth=1;
}

// ------------- Leaderboard -------------
function renderBoard(){
  const el=$('#lbPanel'); const board=S.get('board',{});
  const entries=Object.entries(board).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){ el.innerHTML='<div style="padding:12px;color:#bbb;">No scores yet. Play a game to populate the leaderboard.</div>'; return }
  const rows=entries.map(([team,score],i)=>`<tr><td>${i+1}</td><td>${team}</td><td>${score}</td></tr>`).join('');
  el.innerHTML=`<table><thead><tr><th>#</th><th>Team</th><th>Total Score</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ------------- Store & Wallet -------------
function syncWallet(){ $('#w-balle').textContent=S.get('w_balle',0); $('#w-crypto').textContent=S.get('w_crypto',0); $('#w-fiat').textContent=S.get('w_fiat',0) }
function buy(kind,amt){ const k={'balle':'w_balle','crypto':'w_crypto','fiat':'w_fiat'}[kind]; const cur=S.get(k,0)+amt; S.set(k,cur); syncWallet() }
function earnVideo(){ const btn=$('#watchAd'); const orig=btn.textContent; let t=5; btn.disabled=true; const id=setInterval(()=>{ btn.textContent=`${orig} (${t})`; t--; if(t<0){ clearInterval(id); btn.disabled=false; btn.textContent=orig; buy('balle',5) } },1000) }

// ------------- Counters (footer) -------------
function renderDigits(el,n){ el.innerHTML=''; for(const c of String(n)){ const s=document.createElement('span'); s.className='digit'; s.textContent=c; el.appendChild(s) } }
function initCounters(){ const online=Math.floor(100+Math.random()*900); const all=S.get('allTime',1111117)+Math.floor(Math.random()*20); S.set('allTime',all); renderDigits($('#onlineDigits'),online); renderDigits($('#allTimeDigits'),all) }

// ------------- Panels & FABs -------------
function panels(){
  const open = id => document.getElementById(id).style.display='flex';
  const close = id => document.getElementById(id).style.display='none';
  $('#fabProfile').addEventListener('click', ()=> open('panelProfile'));
  $('#fabMenu').addEventListener('click', ()=> open('panelMenu'));
  $('#fabSlots').addEventListener('click', ()=> open('panelSlots'));
  $('#fabChat').addEventListener('click', ()=> open('panelChat'));
  $$('.close').forEach(b=> b.addEventListener('click', ()=> close(b.dataset.close)));
}

// ------------- Slots -------------
const ICONS = ['🍒','🍋','🍇','⭐','🔔','💎','7️⃣','🍀'];
function spin(){ const rs=$('#reels').children; const rnd=()=>ICONS[Math.floor(Math.random()*ICONS.length)]; for(let i=0;i<rs.length;i++) rs[i].textContent=rnd(); const [a,b,c]=Array.from(rs).map(e=>e.textContent); $('#slotsResult').textContent=(a===b&&b===c)?'JACKPOT! +100':((a===b||b===c||a===c)?'Nice! +20':'Try again!') }

// ------------- Chatbot (no external uploads) -------------
let recognition, lastScreenshotData=null, lastRecordingBlob=null;
function speech(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return;
  recognition=new SR(); recognition.interimResults=true; recognition.continuous=false;
  $('#mic').addEventListener('mousedown', ()=>{ const mode=$('#chatLang').value; recognition.lang=(mode==='auto')?(navigator.language||'en') : (mode==='fr'?'fr-CA':mode==='es'?'es-ES':'en-US'); recognition.start() });
  $('#mic').addEventListener('mouseup', ()=> recognition.stop());
  recognition.onresult=(e)=>{ $('#chatIn').value=Array.from(e.results).map(r=>r[0].transcript).join(' ') };
}
async function sendToAssistant(text){ const lang=S.get('lang','en'); const name=S.get('name','Fan'); const pre=(lang==='fr')?'Réponse':(lang==='es')?'Respuesta':'Reply'; return `${pre}, ${name}: ${text}` }
function appendChat(sender, nodeOrText){ const row=document.createElement('div'); row.style.margin='8px 0'; if(typeof nodeOrText==='string'){ row.innerHTML=`<strong>${sender}:</strong> ${nodeOrText}` } else { const strong=document.createElement('strong'); strong.textContent=`${sender}: `; row.appendChild(strong); row.appendChild(nodeOrText) } $('#chatLog').appendChild(row); $('#chatLog').scrollTop=1e9 }
function initChat(){
  speech();
  $('#send').addEventListener('click', async ()=>{ const msg=$('#chatIn').value.trim(); if(!msg) return; appendChat('You',msg); $('#chatIn').value=''; const reply=await sendToAssistant(msg); appendChat('Assistant',reply); if(window.speechSynthesis){ const u=new SpeechSynthesisUtterance(reply); const lang=S.get('lang','en'); u.lang=(lang==='fr')?'fr-CA':(lang==='es')?'es-ES':'en-US'; window.speechSynthesis.speak(u) } });
  $('#attachShot').addEventListener('click', ()=>{ if(!lastScreenshotData){ alert('No screenshot captured yet.'); return } const img=new Image(); img.src=lastScreenshotData; img.style.maxWidth='100%'; appendChat('You (screenshot)', img) });
  $('#attachRec').addEventListener('click', ()=>{ if(!lastRecordingBlob){ alert('No recording available.'); return } const v=document.createElement('video'); v.controls=true; v.src=URL.createObjectURL(lastRecordingBlob); v.style.maxWidth='100%'; appendChat('You (recording)', v) });
}

// ------------- Screenshot / Recording (in-site only) -------------
let recorder=null, chunks=[];
function captureScreenshot(){
  const canvas=$('#canvas'); lastScreenshotData=canvas.toDataURL('image/png'); alert('Screenshot captured from the game.');
}
function startStopRecording(){
  const btn=$('#recBtn'); const link=$('#dlLink'); const canvas=$('#canvas');
  if(!recorder){
    const stream=canvas.captureStream(30);
    chunks=[]; recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});
    recorder.ondataavailable=e=>{ if(e.data.size>0) chunks.push(e.data) };
    recorder.onstop=()=>{ lastRecordingBlob=new Blob(chunks,{type:'video/webm'}); link.classList.remove('hidden'); link.href=URL.createObjectURL(lastRecordingBlob); recorder=null };
    recorder.start(); btn.textContent=I18N[S.get('lang','en')].start_rec.replace('Start','Stop');
  } else {
    recorder.stop(); btn.textContent=I18N[S.get('lang','en')].start_rec;
  }
}

// ------------- Tabs (Main + Sub) -------------
function mainTabs(){
  $$('.navbtn').forEach(btn=> btn.addEventListener('click',()=>{
    const tab=btn.dataset.tab;
    $$('.navbtn').forEach(b=> b.setAttribute('aria-selected', String(b===btn)));
    $$('.tab-view').forEach(v=> v.classList.toggle('active', v.id===`tab-${tab}`));
  }));
}
function subTabs(){
  $$('.subtab').forEach(btn=> btn.addEventListener('click',()=>{
    const st=btn.dataset.subtab; $$('.subtab').forEach(b=> b.classList.toggle('active', b===btn));
    $('#pane-game').classList.toggle('active', st==='game');
    $('#pane-leaderboard').classList.toggle('active', st==='leaderboard');
  }));
}

// ------------- Rosters & Stats -------------
function fakeNames(n){ const first=['Alex','Sam','Taylor','Jordan','Casey','Morgan','Riley','Quinn','Avery','Cameron','Drew','Evan','Hayden','Jesse']; const last=['Frost','Blaze','Stone','Bishop','Knight','Archer','Hunter','Reed','Brooks','Lane','Cruz','Parker','Ryder','Rivera']; return Array.from({length:n},()=>`${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`) }
const ROSTERS = Object.fromEntries(TEAMS.map(t=>[t,fakeNames(12)]));
function renderRoster(team){ const rows=ROSTERS[team].map((p,i)=>`<tr><td>${i+1}</td><td>${p}</td><td>${Math.floor(50+Math.random()*50)}</td></tr>`).join(''); $('#rosterTable').innerHTML=`<table class="leaderboard"><thead><tr><th>#</th><th>Player</th><th>OVR</th></tr></thead><tbody>${rows}</tbody></table>` }
function renderStats(){ const stats=TEAMS.map(t=>({team:t, w:Math.floor(Math.random()*10), l:Math.floor(Math.random()*10)})); stats.forEach(s=>s.pts=s.w*2); stats.sort((a,b)=>b.pts-a.pts); const rows=stats.map((s,i)=>`<tr><td>${i+1}</td><td>${s.team}</td><td>${s.w}</td><td>${s.l}</td><td>${s.pts}</td></tr>`).join(''); $('#statsTable').innerHTML=`<table class="leaderboard"><thead><tr><th>#</th><th>Team</th><th>W</th><th>L</th><th>PTS</th></tr></thead><tbody>${rows}</tbody></table>` }

// ------------- Profile (Pogo style) -------------
function updateProfileXP(xp){
  const level=Math.min(50, Math.floor(1+xp/1000)); const cur=xp%1000; const next=1000;
  $('#lvlNum').textContent=level; $('#xpCur').textContent=cur; $('#xpNext').textContent=next; $('#xpFill').style.width=((cur/next)*100).toFixed(1)+'%';
  $('#statXP').textContent=xp.toLocaleString();
}
function initProfile(){
  const name=S.get('name','Indigo'); $('#profName').textContent=name; $('#statStart').textContent=S.get('start','2025-01-01');
  updateProfileXP(S.get('xp',0));
  $('#openProfile').addEventListener('click', ()=> document.getElementById('panelProfile').style.display='flex');
}

// ------------- Theme toggle -------------
function initTheme(){
  const mode=S.get('theme','dark'); document.body.classList.toggle('theme-light', mode==='light'); $('#lightToggle').checked=(mode==='light');
  $('#lightToggle').addEventListener('change', ()=>{ const m= $('#lightToggle').checked ? 'light' : 'dark'; document.body.classList.toggle('theme-light', m==='light'); S.set('theme',m) });
}

// ------------- Language picker -------------
function initLang(){
  const lang=S.get('lang','en'); $('#langSel').value=lang; setLang(lang);
  $('#langSel').addEventListener('change', (e)=> setLang(e.target.value));
}

// ------------- Counters -------------
function initCountersUI(){
  function renderDigits(el,n){ el.innerHTML=''; for(const c of String(n)){ const s=document.createElement('span'); s.className='digit'; s.textContent=c; el.appendChild(s) } }
  const online=Math.floor(100+Math.random()*900); const all=S.get('allTime',1111117)+Math.floor(Math.random()*20); S.set('allTime',all);
  renderDigits($('#onlineDigits'),online); renderDigits($('#allTimeDigits'),all);
}

// ------------- Boot -------------
window.addEventListener('DOMContentLoaded', ()=>{
  populateTeams(); initCanvas(); renderBoard(); initCountersUI(); panels(); mainTabs(); subTabs(); initProfile(); initTheme(); initLang(); initChat(); renderStats();
  $('#playBtn').addEventListener('click', startGame); $('#spin').addEventListener('click', spin);
  $('#buyBalle').addEventListener('click', ()=> buy('balle', 50)); $('#buyCrypto').addEventListener('click', ()=> buy('crypto', 50)); $('#buyFiat').addEventListener('click', ()=> buy('fiat', 50)); $('#watchAd').addEventListener('click', earnVideo); syncWallet();
  $('#rosterTeam').addEventListener('change', (e)=> renderRoster(e.target.value)); renderRoster(TEAMS[0]);
  $('#shotBtn').addEventListener('click', captureScreenshot); $('#recBtn').addEventListener('click', startStopRecording);
});
