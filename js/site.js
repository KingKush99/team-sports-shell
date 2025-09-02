// Utility shortcuts
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Storage helpers
const storage = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)) }
};

// Counters
function renderDigits(el, n){
  el.innerHTML = '';
  for(const c of String(n)){
    const s = document.createElement('span');
    s.className = 'digit';
    s.textContent = c;
    el.appendChild(s);
  }
}
function initCounters(){
  const online = Math.floor(100 + Math.random()*900);
  const all = storage.get('allTime', Math.floor(1_111_117 + Math.random()*1000)) + Math.floor(Math.random()*20);
  storage.set('allTime', all);
  renderDigits($('#onlineDigits'), online);
  renderDigits($('#allTimeDigits'), all);
}

// Teams
const TEAMS = ['Anaheim Ducks','Arizona Coyotes','Boston Bruins','Buffalo Sabres','Calgary Flames','Carolina Hurricanes','Chicago Blackhawks','Colorado Avalanche','Columbus Blue Jackets','Dallas Stars','Detroit Red Wings','Edmonton Oilers','Florida Panthers','Los Angeles Kings','Minnesota Wild','Montreal Canadiens','Nashville Predators','New Jersey Devils','New York Islanders','New York Rangers','Ottawa Senators','Philadelphia Flyers','Pittsburgh Penguins','San Jose Sharks','Seattle Kraken','St. Louis Blues','Tampa Bay Lightning','Toronto Maple Leafs','Vancouver Canucks','Vegas Golden Knights','Washington Capitals','Winnipeg Jets'];
function populateTeams(){ $('#teamSel').innerHTML = TEAMS.map(t=>`<option value="${t}">${t}</option>`).join('') }

// Game
const game = {
  running:false, score:0, time:0,
  puck:{x:60,y:120,r:16,vx:3.2,vy:0.8},
  ctx:null, raf:null, timer:null, team:null
};
function initCanvas(){
  const c = $('#canvas');
  game.ctx = c.getContext('2d');
  c.addEventListener('click', onClick);
  draw();
}
function startGame(){
  if (game.running) return;
  game.running = true; game.score = 0; game.time = 20; game.team = $('#teamSel').value;
  $('#score').textContent = 0; $('#time').textContent = game.time;
  if (game.timer) clearInterval(game.timer);
  game.timer = setInterval(()=>{
    game.time -= 1; $('#time').textContent = game.time;
    if (game.time <= 0) endGame();
  },1000);
  const loop = ()=>{ if(!game.running) return; update(); draw(); game.raf = requestAnimationFrame(loop) };
  loop();
}
function endGame(){
  game.running = false; cancelAnimationFrame(game.raf); clearInterval(game.timer); $('#time').textContent = '0';
  // leaderboard: add to team total
  const board = storage.get('board', {}); const t = game.team || $('#teamSel').value;
  board[t] = (board[t] || 0) + game.score; storage.set('board', board); renderBoard();
  alert(`Final Score: ${game.score} (${t})`);
}
function onClick(e){
  if (!game.running) return;
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  const dx = x - game.puck.x, dy = y - game.puck.y;
  if (Math.hypot(dx,dy) <= game.puck.r + 6){
    game.score += 10; $('#score').textContent = game.score;
    game.puck.vx *= (1.03 + Math.random()*0.02); game.puck.vy *= (1.03 + Math.random()*0.02);
  }
}
function update(){
  const c = $('#canvas'); const p = game.puck;
  p.x += p.vx; p.y += p.vy;
  if (p.x < p.r || p.x > c.width - p.r) p.vx *= -1;
  if (p.y < p.r || p.y > c.height - p.r) p.vy *= -1;
  p.vy += (Math.random()-0.5)*0.2; p.vx += (Math.random()-0.5)*0.15;
  const speed = Math.hypot(p.vx,p.vy), max = 6.5; if (speed>max){ p.vx*=max/speed; p.vy*=max/speed }
}
function draw(){
  const c = $('#canvas'), ctx = game.ctx; ctx.clearRect(0,0,c.width,c.height);
  const grd = ctx.createLinearGradient(0,0,0,c.height); grd.addColorStop(0,'#183050'); grd.addColorStop(1,'#0c1a2e');
  ctx.fillStyle = grd; ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle = '#7aa2ff'; ctx.setLineDash([8,8]); ctx.beginPath(); ctx.moveTo(c.width/2,0); ctx.lineTo(c.width/2,c.height); ctx.stroke(); ctx.setLineDash([]);
  const {x,y,r} = game.puck; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle = '#111'; ctx.fill(); ctx.strokeStyle = '#eee'; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
}

// Leaderboard
function renderBoard(){
  const el = $('#lbPanel'); const board = storage.get('board', {});
  const entries = Object.entries(board).sort((a,b)=>b[1]-a[1]);
  if (!entries.length){ el.innerHTML = '<div style="padding:12px;color:#bbb;">No scores yet. Play a game to populate the leaderboard.</div>'; return }
  const rows = entries.map(([team,score],i)=>`<tr><td>${i+1}</td><td>${team}</td><td>${score}</td></tr>`).join('');
  el.innerHTML = `<table><thead><tr><th>#</th><th>Team</th><th>Total Score</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// FABs & Panels
function panels(){
  const open = id => document.getElementById(id).style.display='flex';
  const close = id => document.getElementById(id).style.display='none';
  $('#fabProfile').addEventListener('click', ()=> open('panelProfile'));
  $('#fabMenu').addEventListener('click', ()=> open('panelMenu'));
  $('#fabSlots').addEventListener('click', ()=> open('panelSlots'));
  $('#fabChat').addEventListener('click', ()=> open('panelChat'));
  $$('.close').forEach(b=> b.addEventListener('click', ()=> close(b.dataset.close)));
}

// Profile
function initProfile(){
  $('#name').value = storage.get('name','');
  $('#saveName').addEventListener('click', ()=>{
    storage.set('name',$('#name').value.trim()); alert('Saved!');
  });
}

// Slots
const ICONS = ['🍒','🍋','🍇','⭐','🔔','💎','7️⃣','🍀'];
function spin(){ const rs = $('#reels').children; const rnd = ()=>ICONS[Math.floor(Math.random()*ICONS.length)]; for(let i=0;i<rs.length;i++) rs[i].textContent = rnd(); const [a,b,c] = Array.from(rs).map(e=>e.textContent); $('#slotsResult').textContent = (a===b&&b===c)?'JACKPOT! +100':((a===b||b===c||a===c)?'Nice! +20':'Try again!')}

// Chat (demo)
let recognition;
function speech(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  recognition = new SR(); recognition.interimResults = true; recognition.continuous = false;
  $('#mic').addEventListener('mousedown', ()=>{ const mode = $('#chatLang').value; recognition.lang = mode==='auto' ? (navigator.language||'en-US') : mode; recognition.start(); });
  $('#mic').addEventListener('mouseup', ()=> recognition.stop());
  recognition.onresult = (e)=>{ $('#chatIn').value = Array.from(e.results).map(r=>r[0].transcript).join(' ') };
}
async function sendToAssistant(text){
  const lang = $('#chatLang').value; const name = storage.get('name','Fan');
  const prefix = (lang==='fr-CA')?'Réponse':(lang==='es-ES')?'Respuesta':(lang==='pt-PT')?'Resposta':(lang==='ru-RU')?'Ответ':(lang==='ar-SA')?'رد':(lang==='bn-BD')?'উত্তর':(lang==='zh-CN')?'回复':(lang==='nl-NL')?'Antwoord':(lang==='hi-IN')?'उत्तर':'Reply';
  return `${prefix}, ${name}: ${text}`;
}
function appendChat(sender,text){ const div=document.createElement('div'); div.style.margin='8px 0'; div.innerHTML = `<strong>${sender}:</strong> ${text}`; $('#chatLog').appendChild(div); $('#chatLog').scrollTop=1e9 }
function initChat(){
  speech();
  $('#send').addEventListener('click', async ()=>{
    const msg = $('#chatIn').value.trim(); if (!msg) return;
    appendChat('You', msg); $('#chatIn').value=''; const reply = await sendToAssistant(msg); appendChat('Assistant', reply);
    if (window.speechSynthesis){ const u = new SpeechSynthesisUtterance(reply); const mode = $('#chatLang').value; u.lang = (mode==='auto')?(navigator.language||'en-US'):mode; window.speechSynthesis.speak(u) }
  });
  $('#chatFile').addEventListener('change', (e)=>{ const f=e.target.files?.[0]; if(!f) return; appendChat('You', `Uploaded file: ${f.name} (${Math.round(f.size/1024)} KB)`) });
}

// Leaderboard toggle
function lbToggle(){
  const t = $('#lbToggle'), p = $('#lbPanel'); const sync = ()=> p.classList.toggle('active', t.checked); t.addEventListener('change', sync); sync();
}

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  initCounters(); populateTeams(); initCanvas(); renderBoard(); lbToggle(); panels(); initProfile(); initChat();
  $('#playBtn').addEventListener('click', startGame);
  $('#spin').addEventListener('click', spin);
});
