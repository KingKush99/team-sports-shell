// ===== Global State =====
let TOKENS = parseInt(localStorage.getItem('TOKENS')||'0',10);
const THEME_COST = 200;

// ===== i18n =====
const I18N = {
  en: {
    title: "Mini‑Sticks Hub v5 — Team Sports Shell",
    live:"🟢 Live", home:"Home", news:"News", video:"Video", scores:"Scores", schedule:"Schedule", stats:"Stats",
    players:"Players", fantasy:"Fantasy", teams:"Teams", rosters:"Rosters", shop:"Shop", tickets:"Tickets",
    live_scores:"Live Scores", live_center:"Union Live Center", live_desc:"Real‑time ticker + featured matches.",
    welcome:"Welcome to Mini‑Sticks Hub v5", home_desc:"All new features added on top of v4 base.",
    team_a_color:"Team A Color", team_b_color:"Team B Color", start_match:"Start Match", rugby_hint:"Tap/click to kick the ball toward cursor.",
    profile_page:"Profile Page", competition:"Competition", home_team:"Home", score:"Score", away_team:"Away",
    date:"Date", match:"Match", venue:"Venue", time:"Time", player:"Player", gp:"GP", pts:"PTS", tries:"Tries",
    fantasy_desc:"Build your squad, earn points weekly from real matches. Captain gets 2×.",
    rosters_desc:"Select a team to view today’s roster.", jersey:"Home Jersey — $79", scarf:"Scarf — $25", add:"Add",
    next_match:"Next match: Irish vs Blues — Sep 10 • 14:00 — Lansdowne",
    online_now:"ONLINE NOW", all_time:"ALL TIME VISITORS",
    accessibility:"ACCESSIBILITY", access_opts:"Accessibility Options", suggestions:"Suggestions",
    company:"COMPANY", competitions:"COMPETITIONS", legal:"LEGAL", support:"SUPPORT", social_media:"SOCIAL MEDIA",
    tos:"Terms of Service", privacy:"Privacy Policy", rg:"Responsible Gaming", aml:"AML Policy", fairplay:"Fair Play", credits:"Credits",
    tournaments:"Tournaments", registration:"Registration", prizes:"Prizes", potm:"Player of the Month", hof:"Wall of Fame", awards:"Awards & Achievements",
    contact:"Contact Us", help:"Help Center", faqs:"FAQs",
    // Chat/Slots/Menu
    assistant:"Assistant", language:"Language", attach:"Attach", send:"Send", tokens:"Tokens",
    buy_crypto:"₿ Buy with Crypto (+500)", buy_fiat:"💳 Buy with Fiat (+100)", watch_earn:"▶ Watch Video → Earn (+50)",
    transfer_gems:"🔁 Convert Tokens → Gems", toggle_mode:"🌗 Light/Dark Mode", themes:"🎨 Themes", theme_hint:"First 3 are free. Others cost",
    mini_slots:"Mini Slots", bet:"Bet:", reels:"Reels:", spin:"Spin",
    // Profile page
    me:"Me", friends:"Friends", back:"← Back", level:"LEVEL", quests:"Quests", toggle_notifs:"Toggle Level‑Up Notifications",
    total_activity:"Total Activity", distance:"Distance Walked", caught:"Pokemon Caught", stops:"PokéStops Visited", total_xp:"Total XP", start_date:"Start Date",
    dont_show:"Do not show again"
  },
  fr: {
    title:"Mini‑Sticks Hub v5 — Coquille Sportive",
    live:"🟢 Direct", home:"Accueil", news:"Actu", video:"Vidéo", scores:"Scores", schedule:"Calendrier", stats:"Stats",
    players:"Joueurs", fantasy:"Fantasy", teams:"Équipes", rosters:"Compos", shop:"Boutique", tickets:"Billets",
    live_scores:"Scores en direct", live_center:"Centre en direct", live_desc:"Ticker temps réel + matchs en vedette.",
    welcome:"Bienvenue sur Mini‑Sticks Hub v5", home_desc:"Nouvelles fonctionnalités au‑dessus de la v4.",
    team_a_color:"Couleur Équipe A", team_b_color:"Couleur Équipe B", start_match:"Lancer le match", rugby_hint:"Cliquez pour tirer vers le curseur.",
    profile_page:"Page Profil", competition:"Compétition", home_team:"Domicile", score:"Score", away_team:"Exter.", date:"Date",
    match:"Match", venue:"Stade", time:"Heure", player:"Joueur", gp:"MJ", pts:"PTS", tries:"Essais",
    fantasy_desc:"Construisez votre équipe et marquez chaque semaine. Capitaine = ×2.",
    rosters_desc:"Choisissez une équipe pour voir la compo du jour.", jersey:"Maillot domicile — 79 $", scarf:"Écharpe — 25 $", add:"Ajouter",
    next_match:"Prochain match : Irish vs Blues — 10 sept • 14:00 — Lansdowne",
    online_now:"EN LIGNE", all_time:"VISITEURS TOTAUX",
    accessibility:"ACCESSIBILITÉ", access_opts:"Options d’accessibilité", suggestions:"Suggestions",
    company:"ENTREPRISE", competitions:"COMPÉTITIONS", legal:"LÉGAL", support:"SUPPORT", social_media:"RÉSEAUX SOCIAUX",
    tos:"Conditions d’utilisation", privacy:"Politique de confidentialité", rg:"Jeu responsable", aml:"Politique LBA", fairplay:"Fair‑Play", credits:"Crédits",
    tournaments:"Tournois", registration:"Inscription", prizes:"Prix", potm:"Joueur du mois", hof:"Mur de la renommée", awards:"Prix & Distinctions",
    contact:"Contact", help:"Aide", faqs:"FAQ",
    assistant:"Assistant", language:"Langue", attach:"Joindre", send:"Envoyer", tokens:"Jetons",
    buy_crypto:"₿ Acheter en crypto (+500)", buy_fiat:"💳 Acheter par carte (+100)", watch_earn:"▶ Regarder → Gagner (+50)",
    transfer_gems:"🔁 Convertir Jetons → Gemmes", toggle_mode:"🌗 Mode clair/sombre", themes:"🎨 Thèmes", theme_hint:"Les 3 premiers sont gratuits. Les autres coûtent",
    mini_slots:"Mini‑machines", bet:"Mise :", reels:"Rouleaux :", spin:"Lancer",
    me:"Moi", friends:"Amis", back:"← Retour", level:"NIVEAU", quests:"Quêtes", toggle_notifs:"Activer/Désactiver notifications de niveau",
    total_activity:"Activité totale", distance:"Distance parcourue", caught:"Pokémon attrapés", stops:"PokéStops visités", total_xp:"XP total", start_date:"Date de début",
    dont_show:"Ne plus afficher"
  },
  es: {
    title:"Mini‑Sticks Hub v5 — Cascarón Deportivo",
    live:"🟢 En vivo", home:"Inicio", news:"Noticias", video:"Video", scores:"Marcadores", schedule:"Calendario", stats:"Estadísticas",
    players:"Jugadores", fantasy:"Fantasy", teams:"Equipos", rosters:"Alineaciones", shop:"Tienda", tickets:"Boletos",
    live_scores:"Marcadores en vivo", live_center:"Centro en vivo", live_desc:"Ticker en tiempo real + partidos destacados.",
    welcome:"Bienvenido a Mini‑Sticks Hub v5", home_desc:"Nuevas funciones sobre la base v4.",
    team_a_color:"Color Equipo A", team_b_color:"Color Equipo B", start_match:"Iniciar partido", rugby_hint:"Toca para patear hacia el cursor.",
    profile_page:"Página de Perfil", competition:"Competición", home_team:"Local", score:"Marcador", away_team:"Visita", date:"Fecha",
    match:"Partido", venue:"Sede", time:"Hora", player:"Jugador", gp:"PJ", pts:"PTS", tries:"Tries",
    fantasy_desc:"Arma tu plantel y suma puntos semanales. Capitán x2.",
    rosters_desc:"Elige un equipo para ver la alineación.", jersey:"Camiseta local — $79", scarf:"Bufanda — $25", add:"Añadir",
    next_match:"Próximo: Irish vs Blues — 10 Sep • 14:00 — Lansdowne",
    online_now:"EN LÍNEA", all_time:"VISITAS TOTALES",
    accessibility:"ACCESIBILIDAD", access_opts:"Opciones de accesibilidad", suggestions:"Sugerencias",
    company:"COMPAÑÍA", competitions:"COMPETENCIAS", legal:"LEGAL", support:"SOPORTE", social_media:"REDES SOCIALES",
    tos:"Términos de servicio", privacy:"Política de privacidad", rg:"Juego responsable", aml:"Política AML", fairplay:"Juego limpio", credits:"Créditos",
    tournaments:"Torneos", registration:"Registro", prizes:"Premios", potm:"Jugador del mes", hof:"Muro de la fama", awards:"Premios y logros",
    contact:"Contacto", help:"Centro de ayuda", faqs:"FAQs",
    assistant:"Asistente", language:"Idioma", attach:"Adjuntar", send:"Enviar", tokens:"Tokens",
    buy_crypto:"₿ Comprar con cripto (+500)", buy_fiat:"💳 Comprar con fiat (+100)", watch_earn:"▶ Ver video → Ganar (+50)",
    transfer_gems:"🔁 Convertir Tokens → Gemas", toggle_mode:"🌗 Modo claro/oscuro", themes:"🎨 Temas", theme_hint:"Los 3 primeros son gratis. Los demás cuestan",
    mini_slots:"Mini tragamonedas", bet:"Apuesta:", reels:"Tambores:", spin:"Girar",
    me:"Yo", friends:"Amigos", back:"← Atrás", level:"NIVEL", quests:"Misiones", toggle_notifs:"Activar/Desactivar notificaciones de nivel",
    total_activity:"Actividad total", distance:"Distancia recorrida", caught:"Pokémon atrapados", stops:"PokéParadas visitadas", total_xp:"XP total", start_date:"Fecha de inicio",
    dont_show:"No mostrar de nuevo"
  },
  pt: {
    title:"Mini‑Sticks Hub v5 — Casca Esportiva",
    live:"🟢 Ao vivo", home:"Início", news:"Notícias", video:"Vídeo", scores:"Placar", schedule:"Agenda", stats:"Estatísticas",
    players:"Jogadores", fantasy:"Fantasy", teams:"Times", rosters:"Elencos", shop:"Loja", tickets:"Ingressos",
    live_scores:"Placar ao vivo", live_center:"Centro ao vivo", live_desc:"Ticker em tempo real + partidas em destaque.",
    welcome:"Bem‑vindo ao Mini‑Sticks Hub v5", home_desc:"Novos recursos sobre a base v4.",
    team_a_color:"Cor do Time A", team_b_color:"Cor do Time B", start_match:"Iniciar partida", rugby_hint:"Toque para chutar em direção ao cursor.",
    profile_page:"Página de Perfil", competition:"Competição", home_team:"Mandante", score:"Placar", away_team:"Visitante", date:"Data",
    match:"Partida", venue:"Estádio", time:"Hora", player:"Jogador", gp:"J", pts:"PTS", tries:"Tries",
    fantasy_desc:"Monte seu time e ganhe pontos semanais. Capitão x2.",
    rosters_desc:"Escolha um time para ver o elenco.", jersey:"Camisa — $79", scarf:"Cachecol — $25", add:"Adicionar",
    next_match:"Próximo: Irish vs Blues — 10 Set • 14:00 — Lansdowne",
    online_now:"ONLINE AGORA", all_time:"VISITAS TOTAIS",
    accessibility:"ACESSIBILIDADE", access_opts:"Opções de acessibilidade", suggestions:"Sugestões",
    company:"EMPRESA", competitions:"COMPETIÇÕES", legal:"LEGAL", support:"SUPORTE", social_media:"MÍDIAS SOCIAIS",
    tos:"Termos de serviço", privacy:"Política de privacidade", rg:"Jogo responsável", aml:"Política AML", fairplay:"Jogo limpo", credits:"Créditos",
    tournaments:"Torneios", registration:"Registro", prizes:"Prêmios", potm:"Jogador do mês", hof:"Muro da fama", awards:"Prêmios e conquistas",
    contact:"Contato", help:"Central de ajuda", faqs:"Perguntas frequentes",
    assistant:"Assistente", language:"Idioma", attach:"Anexar", send:"Enviar", tokens:"Tokens",
    buy_crypto:"₿ Comprar com cripto (+500)", buy_fiat:"💳 Comprar com fiat (+100)", watch_earn:"▶ Assistir vídeo → Ganhar (+50)",
    transfer_gems:"🔁 Converter Tokens → Gemas", toggle_mode:"🌗 Modo claro/escuro", themes:"🎨 Temas", theme_hint:"Os 3 primeiros são grátis. Os outros custam",
    mini_slots:"Mini caça‑níqueis", bet:"Aposta:", reels:"Carretéis:", spin:"Girar",
    me:"Eu", friends:"Amigos", back:"← Voltar", level:"NÍVEL", quests:"Missões", toggle_notifs:"Ativar/Desativar notificações de nível",
    total_activity:"Atividade total", distance:"Distância percorrida", caught:"Pokémon capturados", stops:"PokéParadas visitadas", total_xp:"XP total", start_date:"Data de início",
    dont_show:"Não mostrar novamente"
  }
};

function setLang(lang){
  localStorage.setItem('LANG', lang);
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(dict[k]) el.textContent = dict[k];
  });
  document.title = dict.title;
}

function initLangControls(){
  const select = document.getElementById('siteLang') || document.getElementById('localeSel');
  const pageSel = document.getElementById('localeSel');
  const stored = localStorage.getItem('LANG') || 'en';
  if(select) select.value = stored;
  if(pageSel) pageSel.value = stored;
  setLang(stored);
  if(select) select.addEventListener('change', e=>{ setLang(e.target.value); if(pageSel) pageSel.value = e.target.value; });
  if(pageSel) pageSel.addEventListener('change', e=>{ setLang(e.target.value); if(select) select.value = e.target.value; });
}

// ===== Tabs =====
const panels = document.querySelectorAll('.panel');
const tabs = document.querySelectorAll('.tab');
tabs.forEach(btn => btn?.addEventListener('click', () => {
  tabs.forEach(t=>t.setAttribute('aria-selected','false'));
  btn.setAttribute('aria-selected','true');
  panels.forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}));

// ===== Live ticker demo =====
const ticker = document.getElementById('ticker');
if(ticker){
  const feed = [
    {comp:'Sr Men', home:'Irish', hs:14, as:12, away:'Blues', min:62},
    {comp:'Sr Women', home:'Wolves', hs:7, as:10, away:'Panthers', min:55},
    {comp:'Juniors', home:'Osprey U18', hs:21, as:21, away:'Panthers U18', min:48},
  ];
  let ti = 0; function rotateTicker(){
    const g = feed[ti % feed.length];
    ticker.textContent = `${g.comp}: ${g.home} ${g.hs}–${g.as} ${g.away} (${g.min}')`;
    ti++; if(ti>999) ti=0;
  }
  rotateTicker(); setInterval(rotateTicker, 3500);
}

// Fake live cards auto-increment minute/score
function simScore(idH, idA, idM){
  const h=document.getElementById(idH), a=document.getElementById(idA), m=document.getElementById(idM);
  if(!h||!a||!m) return;
  setInterval(()=>{ 
    let mm = parseInt(m.textContent)||0; if(mm<80) m.textContent = (mm+1)+"'";
    if(Math.random()<0.06){ (Math.random()<0.5 ? h : a).textContent = (parseInt((Math.random()<0.5?h:a).textContent)||0)+3; }
  }, 1500);
}
simScore('l1h','l1a','l1m'); simScore('l2h','l2a','l2m');

// ===== Menu & Tokens & Themes =====
const menuFab = document.getElementById('menuFab');
const menu = document.getElementById('dropdownMenu');
const tokenCount = document.getElementById('tokenCount');
function renderTokens(){ if(tokenCount) tokenCount.textContent = String(TOKENS); }
renderTokens();
menuFab?.addEventListener('click', () => {
  const open = menu.classList.toggle('hidden') === false;
  menuFab.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e)=>{
  if(menu && !menu.contains(e.target) && e.target!==menuFab) menu.classList.add('hidden');
});

menu?.addEventListener('click', (e)=>{
  if(!e.target.matches('button[data-action]')) return;
  const act = e.target.dataset.action;
  if(act==='watch-earn'){ TOKENS+=50; alert('+50 tokens'); }
  if(act==='buy-crypto'){ TOKENS+=500; alert('+500 tokens'); }
  if(act==='buy-fiat'){ TOKENS+=100; alert('+100 tokens'); }
  if(act==='transfer-gems'){ alert('Converted 100 tokens → 1 gem (demo)'); TOKENS = Math.max(0, TOKENS-100); }
  if(act==='toggle-mode'){ const html = document.documentElement; html.dataset.theme = (html.dataset.theme==='light'?'dark':'light'); }
  if(act==='themes'){ openThemes(); return; }
  localStorage.setItem('TOKENS', String(TOKENS)); renderTokens();
});

// Themes Picker
const themesModal = document.getElementById('themesModal');
const themesGrid = document.getElementById('themesGrid');
function openThemes(){
  if(!themesModal) return;
  themesModal.classList.remove('hidden');
  themesGrid.innerHTML='';
  for(let i=1;i<=10;i++){
    const item = document.createElement('button');
    item.className='theme-item';
    item.textContent = 'Theme '+i+(i<=3?' (free)':' (200)');
    item.style.margin='.25rem';
    item.style.padding='.6rem .8rem';
    item.style.border='1px solid var(--border)';
    item.style.borderRadius='10px';
    item.style.background='var(--card)';
    item.dataset.theme = 'theme-'+i;
    themesGrid.appendChild(item);
  }
}
themesModal?.addEventListener('click', (e)=>{
  if(e.target.matches('[data-close]')) themesModal.classList.add('hidden');
  if(e.target.matches('.theme-item')){
    const t = e.target.dataset.theme;
    const idx = parseInt(t.split('-')[1],10);
    if(idx>3 && TOKENS<THEME_COST){ alert('Not enough tokens. Need 200.'); return; }
    if(idx>3) { TOKENS-=THEME_COST; localStorage.setItem('TOKENS', String(TOKENS)); renderTokens(); }
    document.body.className = document.body.className.replace(/theme-\d+/,'').trim();
    document.body.classList.add(t);
  }
});

// ===== Slots (vertical) with lever =====
const slotsFab = document.getElementById('slotsFab');
const slotsModal = document.getElementById('slotsModal');
const spinBtn = document.getElementById('spinBtn');
const reelsSel = document.getElementById('reels');
const reelWrap = document.getElementById('reelWrap');
const result = document.getElementById('slotsResult');
const lever = document.getElementById('lever');
const SYMBOLS = ['🥅','🏒','🏆','⭐','🔥','❄️'];

function buildReels(n=3){
  reelWrap.innerHTML='';
  for(let i=0;i<n;i++){
    const reel = document.createElement('div'); reel.className='reel';
    const col = document.createElement('div'); col.className='col';
    // 10 cells + last repeats first to make loop feel natural
    for(let k=0;k<11;k++){
      const cell = document.createElement('div'); cell.className='cell';
      cell.textContent = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
      col.appendChild(cell);
    }
    reel.appendChild(col);
    reelWrap.appendChild(reel);
  }
}
if(reelWrap) buildReels();

reelsSel?.addEventListener('change', ()=>buildReels(parseInt(reelsSel.value)));

function spinVertical(){
  const cols = [...document.querySelectorAll('.reel .col')];
  cols.forEach((c, idx)=>{
    c.classList.remove('spin'); void c.offsetWidth; // reflow to restart animation
    c.style.transform='translateY(0)';
    setTimeout(()=>{
      c.classList.add('spin');
    }, 20*idx); // slight stagger
  });
  // Decide result after animation
  setTimeout(()=>{
    const win = Math.random() < 0.2;
    result.textContent = win ? 'Jackpot! All match.' : 'Spin complete.';
  }, 1300);
}

spinBtn?.addEventListener('click', spinVertical);

if(lever){
  let startY = null; let pulled = false;
  lever.addEventListener('pointerdown', (e)=>{ startY = e.clientY; lever.classList.add('pull'); });
  window.addEventListener('pointerup', ()=>{
    if(startY!==null && !pulled){ pulled = true; spinVertical(); setTimeout(()=>{ lever.classList.remove('pull'); pulled=false; }, 500); }
    startY = null;
  });
}

slotsFab?.addEventListener('click', ()=>{
  const hidden = slotsModal.classList.toggle('hidden');
  slotsFab.setAttribute('aria-expanded', String(!hidden));
});
slotsModal?.addEventListener('click', (e)=>{ if(e.target.matches('[data-close]')) slotsModal.classList.add('hidden'); });

// ===== Chatbot (improved) =====
const chatFab = document.getElementById('chatFab');
const chatModal = document.getElementById('chatModal');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

function addMsg(text, who='bot'){
  const wrap=document.createElement('div'); wrap.className='msg-wrap';
  const msg=document.createElement('div'); msg.className='msg '+(who==='me'?'me':'bot'); msg.textContent=text;
  wrap.appendChild(msg); chatLog.appendChild(wrap); chatLog.scrollTop = chatLog.scrollHeight;
}
if(chatLog) addMsg('Hi! How can I help?');

sendBtn?.addEventListener('click', ()=>{
  if(!chatInput.value.trim()) return;
  addMsg(chatInput.value.trim(),'me');
  setTimeout(()=> addMsg('You said: '+chatInput.value.trim()), 250);
  chatInput.value='';
});

chatFab?.addEventListener('click', ()=>{
  const hidden = chatModal.classList.toggle('hidden');
  chatFab.setAttribute('aria-expanded', String(!hidden));
});
chatModal?.addEventListener('click', (e)=>{ if(e.target.matches('[data-close]')) chatModal.classList.add('hidden'); });

// ===== Rugby mini‑game (15 v 15) =====
const rugbyCanvas = document.getElementById('rugby');
if(rugbyCanvas){
  const ctx = rugbyCanvas.getContext('2d');
  const W = rugbyCanvas.width, H = rugbyCanvas.height;
  let playersA=[], playersB=[], ball, running=false, scoreA=0, scoreB=0;
  const colorA = document.getElementById('colorA');
  const colorB = document.getElementById('colorB');
  const scoreEl = document.getElementById('rugbyScore');

  function resetTeams(){
    playersA = []; playersB = [];
    for(let i=0;i<15;i++){ playersA.push({x:80+Math.random()*120, y:40+i*(H-80)/14, vx:0, vy:0}); }
    for(let i=0;i<15;i++){ playersB.push({x:W-80-Math.random()*120, y:40+i*(H-80)/14, vx:0, vy:0}); }
    ball = {x:W/2, y:H/2, vx:0, vy:0, holder:null};
  }

  function drawField(){
    ctx.fillStyle='#094d2b'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2;
    ctx.strokeRect(40,20,W-80,H-40); // boundary
    ctx.beginPath(); ctx.moveTo(W/2,20); ctx.lineTo(W/2,H-20); ctx.stroke(); // halfway
    // goal lines
    ctx.fillStyle='#ffffff'; ctx.fillRect(20,20,4,H-40); ctx.fillRect(W-24,20,4,H-40);
  }
  function drawPlayers(){
    ctx.fillStyle=colorA.value; playersA.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill(); });
    ctx.fillStyle=colorB.value; playersB.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill(); });
  }
  function drawBall(){
    ctx.fillStyle='#f5d76e'; ctx.beginPath(); ctx.ellipse(ball.x, ball.y, 6,4, 0.5, 0, Math.PI*2); ctx.fill();
  }

  function step(){
    if(!running) return;
    // simple AI: move each player slightly toward ball
    const all = playersA.concat(playersB);
    all.forEach(p=>{
      const dx = ball.x - p.x, dy = ball.y - p.y;
      const dist = Math.hypot(dx,dy)||1;
      p.vx += (dx/dist)*0.05; p.vy += (dy/dist)*0.05;
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      p.x = Math.max(40, Math.min(W-40, p.x));
      p.y = Math.max(20, Math.min(H-20, p.y));
      if(Math.hypot(p.x-ball.x,p.y-ball.y)<10) { ball.holder = p; }
    });

    // ball follows holder or moves
    if(ball.holder){
      ball.x = ball.holder.x + 8; ball.y = ball.holder.y;
      ball.vx = ball.vy = 0;
    }else{
      ball.x += ball.vx; ball.y += ball.vy;
      ball.vx *= 0.99; ball.vy *= 0.99;
    }

    // scoring (cross goal line)
    if(ball.x < 22){ scoreA++; resetTeams(); updateScore(); }
    if(ball.x > W-22){ scoreB++; resetTeams(); updateScore(); }

    // draw
    drawField(); drawPlayers(); drawBall();
    requestAnimationFrame(step);
  }

  function updateScore(){ scoreEl.textContent = scoreA+' : '+scoreB; }

  document.getElementById('rugbyStart')?.addEventListener('click', ()=>{
    resetTeams(); running=true; updateScore(); step();
  });

  rugbyCanvas.addEventListener('pointerdown', (e)=>{
    // kick toward cursor
    const rect = rugbyCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    ball.holder = null;
    const dx = mx - ball.x, dy = my - ball.y;
    const d = Math.hypot(dx,dy)||1;
    ball.vx = (dx/d)*4; ball.vy = (dy/d)*4;
  });
}

// ===== Footer counters =====
const online = document.getElementById('onlineNow');
const allTime = document.getElementById('allTime');
if(online && allTime){
  setInterval(()=>{
    const n = online.textContent.replace(/\s/g,''); 
    const m = (parseInt(n)||1125) + (Math.random()<0.5?0:1);
    online.textContent = String(m).split('').join(' ');
    const a = allTime.textContent.replace(/\s/g,'');
    allTime.textContent = String((parseInt(a)||111114)+1).split('').join(' ');
  }, 4000);
}

// ===== Profile Leveling & Toasts =====
(function(){
  const levelNum = document.getElementById('levelNum');
  if(!levelNum) return; // not on profile page
  let level = parseInt(localStorage.getItem('LVL')||'0',10);
  let xp = parseInt(localStorage.getItem('XP')||'0',10);
  let notifs = localStorage.getItem('NOTIFS')!=='off';
  const totalXP = document.getElementById('totalXP');
  const xpFill = document.getElementById('xpFill');
  const xpLabel = document.getElementById('xpLabel');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const dontShow = document.getElementById('dontShow');

  function requiredFor(next){
    // Level 0 -> 1 : +1000; Level 1 -> 2 : +2000; ... (+1000*next)
    return 1000*next;
  }
  function totalFor(L){
    // total XP to reach level L
    let t=0; for(let i=1;i<=L;i++) t+= requiredFor(i);
    return t;
  }
  function updateUI(){
    levelNum.textContent = String(level);
    totalXP.textContent = String(xp);
    const curBase = totalFor(level);
    const nextBase = totalFor(level+1);
    const progress = Math.max(0, Math.min(1, (xp - curBase)/(nextBase - curBase || 1)));
    xpFill.style.width = (progress*100)+'%';
    xpLabel.textContent = `${Math.max(0,xp-curBase)} / ${nextBase - curBase}`;
  }
  function maybeLevelUp(){
    while(xp >= totalFor(level+1)){
      level++;
      localStorage.setItem('LVL', String(level));
      if(notifs){
        toastText.textContent = `Level up! You are now level ${level}.`;
        toast.classList.remove('hidden');
        setTimeout(()=> toast.classList.add('hidden'), 2000);
      }
    }
  }

  function addXP(n){ xp+=n; localStorage.setItem('XP', String(xp)); maybeLevelUp(); updateUI(); }

  document.getElementById('gain100xp')?.addEventListener('click', ()=>addXP(100));
  document.getElementById('gain500xp')?.addEventListener('click', ()=>addXP(500));
  document.getElementById('toggleNotifs')?.addEventListener('click', ()=>{
    notifs = !notifs; localStorage.setItem('NOTIFS', notifs?'on':'off');
  });
  dontShow?.addEventListener('change', ()=>{
    if(dontShow.checked){ notifs=false; localStorage.setItem('NOTIFS','off'); }
  });

  updateUI();
})();

// ===== Init language on load =====
initLangControls();
