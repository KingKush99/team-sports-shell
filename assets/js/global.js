(function(){
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  onReady(function(){
    try{
      // Odometer
      function renderOdometer(el, value){
        if(!el) return;
        const s = String(value);
        el.innerHTML = s.split('').map(ch => `<span class="odometer-digit"><span class="odometer-value">${ch}</span></span>`).join('');
      }
      function updateOdometers(values){
        renderOdometer(document.getElementById('od-online'), values.online);
        renderOdometer(document.getElementById('od-alltime'), values.alltime);
      }
      updateOdometers({ online: 1125, alltime: 111114 });

      // Floating UI toggles
      function togglePanel(btnId, panelId){
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if(!btn || !panel) return;
        btn.addEventListener('click', ()=> {
          panel.style.display = (panel.style.display==='block') ? 'none' : 'block';
        });
      }
      togglePanel('miniSlotsBtn','miniSlotsPanel');
      togglePanel('chatbotBtn','chatbotPanel');

      // Double-click off to close
      let lastClick = 0;
      document.addEventListener('click', (e)=>{
        const now = Date.now();
        if(now - lastClick < 1000){
          document.querySelectorAll('.dropup-panel, .dropdown-panel, .modal.open').forEach(p => {
            if(!p.contains(e.target)) { p.style.display='none'; p.classList.remove('open'); }
          });
        }
        lastClick = now;
      });

      // Hamburger
      const hamBtn = document.getElementById('hamburgerBtn');
      const hamMenu = document.getElementById('hamburgerMenu');
      hamBtn && hamBtn.addEventListener('click', ()=> {
        hamMenu.style.display = (hamMenu.style.display==='block') ? 'none' : 'block';
      });

      // Slots
      const sportsIcons = ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥅','🥊','⛳','🏒','🏓','🏸','🤾','🤺'];
      const slotsGrid = document.getElementById('slotsGrid');
      const reelsSel = document.getElementById('reelsSel');
      const betSel = document.getElementById('betSel');
      const spinBtn = document.getElementById('spinBtn');
      const slotsMsg = document.getElementById('slotsMsg');
      function drawSlots(n){
        if(!slotsGrid) return;
        slotsGrid.style.gridTemplateColumns = `repeat(${n},1fr)`;
        slotsGrid.innerHTML = '';
        for(let i=0;i<n;i++){
          const c = document.createElement('div');
          c.className = 'slot-cell';
          c.textContent = sportsIcons[(Math.random()*sportsIcons.length)|0];
          slotsGrid.appendChild(c);
        }
      }
      reelsSel && reelsSel.addEventListener('change', ()=> drawSlots(parseInt(reelsSel.value,10)));
      if(reelsSel) drawSlots(parseInt(reelsSel.value,10));
      spinBtn && spinBtn.addEventListener('click', ()=>{
        const n = parseInt(reelsSel.value,10);
        const bet = parseInt(betSel.value,10);
        const result = Array.from({length:n}, ()=> sportsIcons[(Math.random()*sportsIcons.length)|0]);
        Array.from(slotsGrid.children).forEach((c,i)=> c.textContent = result[i]);
        const win = result.every(v => v === result[0]);
        slotsMsg.textContent = win ? `JACKPOT! You won ${bet*5} tokens` : `No win. -${bet} tokens`;
      });

      // Chatbot placeholder
      const chatInput = document.getElementById('chatInput');
      const chatSend = document.getElementById('chatSend');
      const chatlog = document.getElementById('chatlog');
      function addChat(from, text){
        if(!chatlog) return;
        const p = document.createElement('p');
        p.textContent = (from==='user'?'You: ':'Bot: ') + text;
        chatlog.appendChild(p);
        chatlog.scrollTop = chatlog.scrollHeight;
      }
      chatSend && chatSend.addEventListener('click', ()=>{
        const t = chatInput.value.trim();
        if(!t) return;
        addChat('user', t);
        setTimeout(()=> addChat('bot', 'This is a placeholder response.'), 400);
        chatInput.value = '';
      });

      // 32-team leaderboard
      const TEAM_NAMES = [
        'Avalanche','Badgers','Cougars','Dragons','Eagles','Falcons','Giants','Hawks',
        'Icemen','Jaguars','Kings','Lions','Mustangs','Nighthawks','Orcas','Panthers',
        'Quakes','Raptors','Sharks','Titans','United','Vikings','Wolves','Xtreme',
        'Yetis','Zephyrs','Rangers','Bulls','Comets','Pirates','Spartans','Warriors'
      ];
      const LS_KEY = 'mini_leaderboard_v1';
      function loadLB(){
        try { const s = localStorage.getItem(LS_KEY); if(s) return JSON.parse(s); } catch(e){}
        return TEAM_NAMES.map((name,i)=>({ id:i, name, pts: 0 }));
      }
      function saveLB(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(LEADERBOARD)); }catch(e){} }
      function renderLB(){
        const wrap = document.getElementById('miniLeaderboard');
        if(!wrap) return;
        const sorted = [...LEADERBOARD].sort((a,b)=> b.pts - a.pts);
        wrap.innerHTML = `<table class="table"><thead><tr><th>#</th><th>Team</th><th>Mini-Game Pts</th></tr></thead>
        <tbody>${sorted.map((r,i)=> `<tr><td>${i+1}</td><td>${r.name}</td><td>${r.pts}</td></tr>`).join('')}</tbody></table>`;
      }
      function ensureTeamSelect(){
        const sel = document.getElementById('teamSelect');
        if(!sel) return;
        if(sel.options.length===0){
          TEAM_NAMES.forEach((n,i)=>{
            const o = document.createElement('option'); o.value = i; o.textContent = n; sel.appendChild(o);
          });
        }
        const def = localStorage.getItem('player_team') || '0';
        sel.value = def;
        sel.addEventListener('change', ()=> localStorage.setItem('player_team', sel.value));
      }
      window.LEADERBOARD = loadLB();
      ensureTeamSelect();
      renderLB();
      window.__onUserScore = function(points){
        const id = parseInt(localStorage.getItem('player_team') || '0', 10);
        if(!isNaN(id) && window.LEADERBOARD[id]){
          window.LEADERBOARD[id].pts += points;
          saveLB(); renderLB();
        }
      };

      // League standings placeholder
      const standingsTable = document.getElementById('standingsTable');
      if(standingsTable){
        const rows = TEAM_NAMES.slice(0,12).map((n,i)=>({ pos:i+1, team:n, w: (15-i), l: i, pts: (15-i)*4 }));
        standingsTable.innerHTML = `<table class="table">
          <thead><tr><th>Pos</th><th>Team</th><th>W</th><th>L</th><th>Pts</th></tr></thead>
          <tbody>${rows.map(r=> `<tr><td>${r.pos}</td><td>${r.team}</td><td>${r.w}</td><td>${r.l}</td><td>${r.pts}</td></tr>`).join('')}</tbody>
        </table>`;
      }

      // Profile page wiring
      if(document.title.includes('Profile')){
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsMenu = document.getElementById('settingsMenu');
        settingsBtn && settingsBtn.addEventListener('click', ()=> {
          settingsMenu.style.display = (settingsMenu.style.display==='block') ? 'none' : 'block';
        });

        const socialLists = document.getElementById('socialLists');
        function toggleLists(){ socialLists.classList.toggle('hidden'); }
        ['followersBtn','followingBtn','friendsBtn'].forEach(id => {
          const el = document.getElementById(id);
          el && el.addEventListener('click', toggleLists);
        });

        const followersList = document.getElementById('followersList');
        const followingList = document.getElementById('followingList');
        const friendsList   = document.getElementById('friendsList');
        function li(name, pub){ return `<li><span>${name}</span><span style="position:relative"><button class="kebab">⋮</button><div class="item-dd"><button ${pub?'':'disabled'} onclick="location.href='profile.html'">View Profile</button></div></span></li>`; }
        const dummy = (p)=> Array.from({length:10}, (_,i)=> li(`@user${p}${i+1}`, Math.random()>.25)).join('');
        if(followersList) followersList.innerHTML = dummy('f');
        if(followingList) followingList.innerHTML = dummy('g');
        if(friendsList)   friendsList.innerHTML   = dummy('r');

        document.querySelectorAll('.kebab').forEach(k=> k.addEventListener('click', (e)=>{
          const dd = e.target.parentElement.querySelector('.item-dd');
          dd.style.display = (dd.style.display==='block') ? 'none' : 'block';
        }));

        const avatarModal = document.getElementById('avatarModal');
        const profileImage = document.getElementById('profileImage');
        document.querySelector('.avatar-wrap').addEventListener('click', ()=> {
          avatarModal.classList.add('open'); avatarModal.style.display='flex';
        });
        document.querySelector('.btn.close').addEventListener('click', ()=> {
          avatarModal.classList.remove('open'); avatarModal.style.display='none';
        });

        // Populate 32 avatar options
        const avatarGrid = document.getElementById('avatarGrid');
        for(let i=1;i<=32;i++){
          const b = document.createElement('button'); b.className='pick'; b.textContent=i;
          b.addEventListener('click', ()=>{
            profileImage.src = `assets/avatars/${String(i).padStart(2,'0')}.png`;
            avatarModal.classList.remove('open'); avatarModal.style.display='none';
          });
          avatarGrid.appendChild(b);
        }
      }

    }catch(err){
      console.error('global.js init error', err);
    }
  });
})();