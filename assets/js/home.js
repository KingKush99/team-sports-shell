/* Standings (stub – replace with real data/fetch) */
const standingsData = [
  { team: 'Blues', pts: 102 },
  { team: 'Irish', pts: 99 },
  { team: 'Reds',  pts: 94 },
];
const standingsTable = document.getElementById('standingsTable');
if (standingsTable){
  standingsTable.innerHTML = `
    <table class="table">
      <thead><tr><th>Team</th><th>Points</th></tr></thead>
      <tbody>${standingsData.map(r=>`<tr><td>${r.team}</td><td>${r.pts}</td></tr>`).join('')}</tbody>
    </table>
  `;
}

/* Minimal odometer renderer */
function renderOdometer(el, value){
  const s = String(value);
  el.innerHTML = s.split('').map(ch => `<span class="odometer-digit"><span class="odometer-value">${ch}</span></span>`).join('');
}
const odEls = {
  online:  document.getElementById('od-online'),
  alltime: document.getElementById('od-alltime'),
  matches: document.getElementById('od-matches'),
  scores:  document.getElementById('od-scores'),
  users:   document.getElementById('od-users'),
};
function updateOdometers(values){
  if(odEls.online)  renderOdometer(odEls.online,  values.online);
  if(odEls.alltime) renderOdometer(odEls.alltime, values.alltime);
  if(odEls.matches) renderOdometer(odEls.matches, values.matches);
  if(odEls.scores)  renderOdometer(odEls.scores,  values.scores);
  if(odEls.users)   renderOdometer(odEls.users,   values.users);
}
updateOdometers({ online: 123, alltime: 987654, matches: 4321, scores: 87654, users: 12045 });

/* Tabs + pause behavior */
const tabs = document.querySelectorAll('.tab-btn');
const bodies = document.querySelectorAll('.tab-body');
const pauseBtn = document.getElementById('pauseBtn');

function setActiveTab(id){
  tabs.forEach(b=>b.classList.toggle('active', b.dataset.tab===id));
  bodies.forEach(el=>el.classList.toggle('active', el.id===id));
  if(id !== 'minigameTab' && window.RUGBY){ window.RUGBY.pauseGame(true); } // auto-pause when leaving game
}
tabs.forEach(btn=> btn && btn.addEventListener('click', ()=> setActiveTab(btn.dataset.tab)));
pauseBtn && pauseBtn.addEventListener('click', ()=> window.RUGBY && window.RUGBY.pauseToggle());

/* Footer language dropdown (only language control) */
const langSel = document.getElementById('langSelect');
function setLanguage(code){
  console.log('Language set to', code);
}
langSel && langSel.addEventListener('change', e => setLanguage(e.target.value));
