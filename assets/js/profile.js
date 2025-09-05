// Demo social lists & search
const sampleUsers = Array.from({length:20}, (_,i)=>`@user${i+1}`);
const followers = sampleUsers.slice(0,10);
const following = sampleUsers.slice(5,15);
const friends   = sampleUsers.slice(10,20);

const followersList = document.getElementById('followersList');
const followingList = document.getElementById('followingList');
const friendsList   = document.getElementById('friendsList');
const socialSearch  = document.getElementById('socialSearch');

function renderList(el, arr, q=''){
  if(!el) return;
  const t = (q||'').toLowerCase();
  el.innerHTML = arr.filter(u=>u.toLowerCase().includes(t)).map(u=>`<li>${u}</li>`).join('');
}
function renderAll(q=''){
  renderList(followersList, followers, q);
  renderList(followingList, following, q);
  renderList(friendsList,   friends,   q);
  document.getElementById('countFollowers').textContent = followers.length;
  document.getElementById('countFollowing').textContent = following.length;
  document.getElementById('countFriends').textContent   = friends.length;
}
renderAll();
socialSearch && socialSearch.addEventListener('input', e=> renderAll(e.target.value));

// Toggle lists display when any counter pressed
['followersBtn','followingBtn','friendsBtn'].forEach(id=>{
  const b = document.getElementById(id);
  b && b.addEventListener('click', ()=>{
    const wrap = document.getElementById('socialLists');
    wrap.classList.toggle('hidden');
  });
});

// Settings gear top-right
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
settingsBtn && settingsBtn.addEventListener('click', ()=>{
  settingsMenu.style.display = (settingsMenu.style.display==='block' ? 'none' : 'block');
});

// Avatar picker (32 options) - generated placeholders
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
changeAvatarBtn && changeAvatarBtn.addEventListener('click', ()=>{
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(8,1fr);gap:8px;max-width:720px';
  for(let i=1;i<=32;i++){
    const b=document.createElement('button');
    b.style.cssText='width:80px;height:80px;border-radius:50%;border:2px solid #1f2a44;background:#0b1020;color:#e2e8f0;cursor:pointer';
    b.textContent = i;
    b.addEventListener('click', ()=>{
      // swap avatar to a themed placeholder
      const p = document.getElementById('profileImage');
      const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256;
      const x=canvas.getContext('2d');
      x.fillStyle = `hsl(${(i*40)%360} 50% 40%)`; x.beginPath(); x.arc(128,128,120,0,Math.PI*2); x.fill();
      x.fillStyle = '#fff'; x.font='bold 120px system-ui, sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText(String(i),128,140);
      p.src = canvas.toDataURL('image/png');
      modal.remove();
    });
    grid.appendChild(b);
  }
  const modal = document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:60;padding:20px';
  const panel=document.createElement('div');
  panel.style.cssText='background:#0b1020;border:1px solid #1f2a44;border-radius:12px;padding:16px';
  const close=document.createElement('button'); close.textContent='Close'; close.className='btn'; close.style.marginBottom='10px';
  close.onclick=()=>modal.remove();
  panel.appendChild(close); panel.appendChild(grid); modal.appendChild(panel); document.body.appendChild(modal);
});

// Themes shop (10 themes; 1-3 free; 4..10 cost 100,200,400,800,1600,3200,6400)
const themeCosts = [0,0,0,100,200,400,800,1600,3200,6400];
const themesGrid = document.getElementById('themesGrid');
const tokenBalNode = document.getElementById('tokenBal');
let tokenBal = parseInt(localStorage.getItem('tokens')||'500',10);
let ownedThemes = JSON.parse(localStorage.getItem('ownedThemes')||'[0,1,2]'); // free themes 1..3 owned by default
let currentTheme = parseInt(localStorage.getItem('currentTheme')||'0',10);

function renderThemes(){
  tokenBalNode.textContent = tokenBal;
  themesGrid.innerHTML = '';
  for(let i=0;i<10;i++){
    const card = document.createElement('div');
    card.className='theme-card';
    const owned = ownedThemes.includes(i);
    card.innerHTML = `<div><strong>Theme ${i+1}</strong></div>
      <div class="price">${themeCosts[i] ? themeCosts[i] + ' tokens' : 'Free'}</div>
      <div>${owned?'<span class="owned">Owned</span>':''}</div>
      <button class="btn" data-i="${i}">${owned?(currentTheme===i?'Selected':'Select'):'Buy'}</button>`;
    themesGrid.appendChild(card);
  }
}
themesGrid && themesGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-i]'); if(!btn) return;
  const i = parseInt(btn.dataset.i,10);
  const cost = themeCosts[i];
  const owned = ownedThemes.includes(i);
  if(owned){
    currentTheme = i;
    localStorage.setItem('currentTheme', String(i));
    applyTheme(i);
    renderThemes();
    return;
  }
  if(tokenBal >= cost){
    tokenBal -= cost; ownedThemes.push(i);
    localStorage.setItem('tokens', String(tokenBal));
    localStorage.setItem('ownedThemes', JSON.stringify(ownedThemes));
    renderThemes();
  } else {
    alert('Not enough tokens.');
  }
});
function applyTheme(i){
  document.documentElement.style.setProperty('--accent', `hsl(${(i*36)%360} 80% 50%)`);
}
renderThemes(); applyTheme(currentTheme);
