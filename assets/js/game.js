(function(){
  const cvs = document.getElementById('rugbyCanvas');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;

  // clock
  const MATCH_MINS = 80, SEC_PER_MIN = 1, HALF_SECS = (MATCH_MINS/2)*SEC_PER_MIN;
  const HALFTIME_LEN = 15; // seconds
  let half = 1, elapsed = 0, halftimeTimer = 0, paused = false, lastTs = 0;

  const clockNode = document.getElementById('gameClock');
  const halfLabel = document.getElementById('halfLabel');
  const scoreA = document.getElementById('scoreA');
  const scoreB = document.getElementById('scoreB');
  const refMsg = document.getElementById('refMsg');
  const score = {A:0, B:0};
  function showRef(m){ refMsg.textContent = m; setTimeout(()=> refMsg.textContent='', 2500); }

  // pitch lines and posts
  const topPad = 40, botPad = H - 40;
  const linesX = [0.03,0.125,0.22,0.5,0.78,0.875,0.97].map(p=>p*W);

  // players
  function P(x,y,team,role,ai=true){ return {x,y,vx:0,vy:0,team,role,ai,hasBall:false,r:18,speed: ai?1.55:2.05}; }
  const roles = ['1','2','3','4','5','6','7','8','9','10','12','13','11','14','15'];
  const teamA=[], teamB=[];
  function placeTeam(team,isA){
    const baseX=isA?140:W-140, dir=isA?1:-1, centerY=(topPad+botPad)/2;
    let idx=0;
    for(let i=0;i<5;i++) team.push(P(baseX+dir*(i*45), centerY-80, isA?'A':'B', roles[idx++]));
    for(let i=0;i<5;i++) team.push(P(baseX+dir*(i*45+25), centerY-20, isA?'A':'B', roles[idx++]));
    for(let i=0;i<5;i++) team.push(P(baseX+dir*(i*45+50), centerY+40, isA?'A':'B', roles[idx++]));
  }
  placeTeam(teamA, true); placeTeam(teamB, false);
  const user = teamA[9]; user.ai=false; user.hasBall=true;
  const ball = {x:user.x,y:user.y,vx:0,vy:0,holder:user};

  const keys={}; window.addEventListener('keydown',e=> keys[e.key.toLowerCase()]=true); window.addEventListener('keyup',e=> keys[e.key.toLowerCase()]=false);

  let state='open', stateTimer=0, setPieceX=W/2, setPieceY=(topPad+botPad)/2;
  function setScrum(toTeam,x,y,reason){ state='scrum'; stateTimer=1.8; setPieceX=x; setPieceY=y; showRef((reason||'Scrum')+` — Team ${toTeam}`); formScrum(teamA,teamB,toTeam==='A'); }
  function setLineout(x,y){ state='lineout'; stateTimer=1.6; setPieceX=Math.min(Math.max(x, 100), W-100); setPieceY=(y<topPad)? topPad+20 : botPad-20; showRef('Lineout — throw in'); formLineout(teamA,teamB,setPieceX,setPieceY,y>H/2); }
  function startRuck(x,y){ state='ruck'; stateTimer=1.5; ball.holder=null; ball.x=x; ball.y=y; ball.vx=ball.vy=0; }

  function drawPitch(){
    ctx.save(); ctx.strokeStyle='white'; ctx.lineWidth=2;
    for(const x of linesX){ ctx.beginPath(); ctx.moveTo(x, topPad); ctx.lineTo(x, botPad); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(40, topPad); ctx.lineTo(W-40, topPad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, botPad); ctx.lineTo(W-40, botPad); ctx.stroke();
    drawPosts(linesX[0]); drawPosts(linesX[6]);
    ctx.restore();
  }
  function drawPosts(x){ ctx.save(); ctx.strokeStyle='white'; ctx.lineWidth=4; const y=(topPad+botPad)/2, h=100, gap=80; ctx.beginPath(); ctx.moveTo(x, y-h); ctx.lineTo(x, y+h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x-gap/2, y); ctx.lineTo(x+gap/2, y); ctx.stroke(); ctx.restore(); }

  function drawTeam(team, jersey){
    team.forEach(p=>{
      ctx.save(); ctx.translate(p.x,p.y);
      ctx.fillStyle='#0a7a2e'; ctx.fillRect(-8,8,6,12); ctx.fillRect(2,8,6,12); // legs
      ctx.fillStyle='#333'; ctx.fillRect(-9,20,8,4); ctx.fillRect(1,20,8,4); // feet
      ctx.fillStyle='#f2f2f2'; ctx.fillRect(-10,0,20,8); // shorts
      ctx.fillStyle=jersey; ctx.fillRect(-12,-18,24,20); // torso (jersey)
      ctx.fillStyle='#f5d0a0'; ctx.fillRect(-16,-14,6,14); ctx.fillRect(10,-14,6,14); // arms
      ctx.beginPath(); ctx.arc(-13,0,3,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(13,0,3,0,Math.PI*2); ctx.fill(); // hands
      ctx.beginPath(); ctx.arc(0,-28,8,0,Math.PI*2); ctx.fill(); // head
      ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(-3,-30,1.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(3,-30,1.2,0,Math.PI*2); ctx.fill(); ctx.fillRect(-3,-26,6,1); // face
      ctx.restore();
      if(p.hasBall){ ctx.strokeStyle='#fbbf24'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,24,0,Math.PI*2); ctx.stroke(); }
    });
  }

  function steer(p, tx, ty){ const ax=(tx-p.x)*0.015, ay=(ty-p.y)*0.015; p.vx=(p.vx+ax)*0.95; p.vy=(p.vy+ay)*0.95; p.x+=p.vx; p.y+=p.vy; p.y=Math.max(topPad+10, Math.min(botPad-10, p.y)); p.x=Math.max(40, Math.min(W-40, p.x)); }
  function dist(a,b){ const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); }
  function nearestFrom(pt,team){ return team.slice().sort((a,b)=> dist(pt,a)-dist(pt,b))[0]; }
  function nearestSupport(me,team){ const c=team.filter(t=>t!==me && t.x<=me.x+2); return c.sort((a,b)=> dist(me,a)-dist(me,b))[0]; }

  let passCooldown=0;
  function makePass(from,to){ from.hasBall=false; ball.holder=null; ball.x=from.x; ball.y=from.y; const dx=to.x-from.x, dy=to.y-from.y; const len=Math.hypot(dx,dy)||1; ball.vx=(dx/len)*3.4; ball.vy=(dy/len)*3.4; passCooldown=0.35; }
  function addScore(team, type){
    if(type==='try'){ (team==='A'? (score.A+=5) : (score.B+=5)); if(team==='A' && window.__onUserScore) window.__onUserScore(5); }
    scoreA.textContent=score.A; scoreB.textContent=score.B;
  }

  function formScrum(A,B,feedA){
    const pack=(team,cx,cy,dir)=>{ const packPlayers=team.slice(0,8); let idx=0;
      for(let r=0;r<3;r++){ for(let c=0;c<(r==0?3:(r==1?2:3));c++){ const px=cx + (c-1)*16*dir + (r==2?(c-1)*4*dir:0); const py=cy + r*16 + (c%2?4:-4); packPlayers[idx].x=px; packPlayers[idx].y=py; idx++; } } team[8].x=cx-40*dir; team[8].y=cy+20; };
    const cx=setPieceX, cy=setPieceY; pack(A,cx-20,cy,1); pack(B,cx+20,cy,-1);
    [...A,...B].forEach(p=>p.hasBall=false); const feeder = feedA ? A[8] : B[8]; feeder.hasBall=true; ball.holder=feeder;
  }
  function formLineout(A,B,x,y,teamAthrow){
    const makeLine=(team, baseX, dir)=>{ for(let i=0;i<6;i++){ team[i].x=baseX + dir*(i%2?24:-24); team[i].y=y - 70 + i*24; } team[1].x=baseX - dir*50; team[1].y=y - 10; team[8].x=baseX - dir*80; team[8].y=y + 20; };
    makeLine(A,x-8,1); makeLine(B,x+8,-1); [...A,...B].forEach(p=>p.hasBall=false); const thrower = teamAthrow ? A[1] : B[1]; thrower.hasBall=true; ball.holder=thrower;
  }

  function update(dt){
    if(paused) return;

    if(half===1 || half===2){
      elapsed += dt;
      const mins = Math.min(HALF_SECS, elapsed);
      const tmin = Math.floor(mins), tsec = Math.floor(60*(mins%1));
      const pad=n=> String(n).padStart(2,'0'); clockNode.textContent = `${pad(tmin)}:${pad(tsec)}`;
      if(mins>=HALF_SECS){
        if(half===1){ half='HT'; halfLabel.textContent='Halftime'; halftimeTimer=0; }
        else { half='FT'; halfLabel.textContent='Full Time'; }
      }
    } else if(half==='HT'){
      halftimeTimer += dt; if(halftimeTimer>=HALFTIME_LEN){ half=2; elapsed=0; halfLabel.textContent='2nd Half'; }
    }

    // user control
    user.vx=user.vy=0;
    if(keys['w']) user.vy=-user.speed;
    if(keys['s']) user.vy= user.speed;
    if(keys['a']) user.vx=-user.speed;
    if(keys['d']) user.vx= user.speed;

    // pass P
    if(keys['p'] && user.hasBall && !passCooldown && state==='open'){
      const mate = nearestSupport(user, teamA);
      if(mate){
        const forward = (mate.x > user.x);
        if(forward){ setScrum('B', user.x, user.y, 'Forward pass'); }
        else makePass(user, mate);
      }
    }
    if(passCooldown>0) passCooldown = Math.max(0, passCooldown - dt);

    // tackle T
    if(keys['t'] && state==='open'){
      const oppWithBall = teamB.find(p=>p.hasBall);
      if(oppWithBall && dist(user, oppWithBall) < 28){
        oppWithBall.hasBall=false; startRuck(oppWithBall.x, oppWithBall.y); showRef('Tackle — Ruck formed');
      }
    }

    // simple formations
    positionOpen(teamA, true);
    positionOpen(teamB, false);

    // set-piece timers
    if(state==='ruck'){ stateTimer -= dt; if(stateTimer<=0){ resolveRuck(); } }
    if(state==='scrum'){ stateTimer -= dt; if(stateTimer<=0){ exitScrum(); } }
    if(state==='lineout'){ stateTimer -= dt; if(stateTimer<=0){ exitLineout(); } }

    // ball physics/possession
    if(ball.holder){ ball.x=ball.holder.x + (ball.holder.team==='A'?10:-10); ball.y=ball.holder.y - 6; }
    else { ball.x+=ball.vx; ball.y+=ball.vy; ball.vx*=0.985; ball.vy*=0.985; if(Math.hypot(ball.vx,ball.vy)<0.05){ ball.vx=ball.vy=0; }
      const near=[...teamA,...teamB].find(p=> dist(p,ball)<18);
      if(near && state==='open'){ near.hasBall=true; ball.holder=near; }
      if(ball.y<topPad || ball.y>botPad){ setLineout(ball.x, ball.y); }
    }

    // scoring
    if(ball.holder){
      if(ball.holder.team==='A' && ball.holder.x > linesX[6]){ addScore('A','try'); showRef('TRY — Team A'); resetAfterScore('B'); }
      if(ball.holder.team==='B' && ball.holder.x < linesX[0]){ addScore('B','try'); showRef('TRY — Team B'); resetAfterScore('A'); }
    }
  }

  function positionOpen(team, isA){
    const dir = isA ? 1 : -1; const centerY = (topPad+botPad)/2;
    const targetX = ball.holder ? ball.holder.x - dir*60 : (isA?W*0.35:W*0.65);
    team.forEach((p,i)=>{
      let tx, ty;
      if(p.role==='9'){ tx = targetX - dir*20; ty = (ball.holder? ball.holder.y : centerY);
      } else if(p.role==='10'){ tx = targetX - dir*60; ty = centerY - 40;
      } else if(['12','13','11','14','15'].includes(p.role)){
        const order = {'12':-20,'13':20,'11':-80,'14':80,'15':120}[p.role];
        tx = targetX + dir* (40 + (isA?order:-order)); ty = centerY + (isA?order:-order)*0.5;
      } else {
        const lane = i%3; const laneOffset = (-60 + lane*60);
        tx = targetX - dir*(100 + (i%5)*15); ty = centerY + laneOffset;
      }
      if(!isA && ball.holder && Math.random()<0.02){ const mark = nearestFrom(p, teamA); tx = mark.x - 10; ty = mark.y; }
      steer(p, tx, ty);
    });
  }

  function resolveRuck(){
    const nearA = teamA.filter(p=>dist(p,ball)<60).length;
    const nearB = teamB.filter(p=>dist(p,ball)<60).length;
    const winner = (nearA===nearB) ? (Math.random()<0.5?'A':'B') : (nearA>nearB?'A':'B');
    const take = winner==='A' ? nearestFrom(ball, teamA) : nearestFrom(ball, teamB);
    take.hasBall=true; ball.holder=take; state='open'; showRef(`Ruck won — Team ${winner}`);
  }
  function drawScrumMarkers(){ ctx.save(); ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.setLineDash([6,6]); ctx.strokeRect(setPieceX-40, setPieceY-20, 80, 40); ctx.restore(); }
  function exitScrum(){ const team = (ball.holder && ball.holder.team==='A') ? teamA : teamB; const fly = team[9]; makePass(ball.holder, fly); state='open'; }
  function drawLineoutMarkers(){ ctx.save(); ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.setLineDash([4,6]); ctx.beginPath(); ctx.moveTo(setPieceX-60,setPieceY-80); ctx.lineTo(setPieceX-60,setPieceY+80); ctx.stroke(); ctx.beginPath(); ctx.moveTo(setPieceX+60,setPieceY-80); ctx.lineTo(setPieceX+60,setPieceY+80); ctx.stroke(); ctx.restore(); }
  function exitLineout(){ const team = (ball.holder && ball.holder.team==='A') ? teamA : teamB; const receiver = nearestFrom({x:setPieceX, y:setPieceY}, team); makePass(ball.holder, receiver); state='open'; }

  function resetAfterScore(defTeam){
    [...teamA, ...teamB].forEach(p=> p.hasBall=false);
    const taker = (defTeam==='A'? teamA[9] : teamB[9]);
    taker.x = W/2 - (defTeam==='A'?80:-80); taker.y = (topPad+botPad)/2;
    ball.holder = taker; taker.hasBall=true; state='open';
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    drawPitch();
    drawTeam(teamA, '#c1121f'); // red
    drawTeam(teamB, '#1ea672'); // green
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(ball.x, ball.y, 8, 6, 0.5, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle='#0f172a'; ctx.stroke();
    if(state==='scrum') drawScrumMarkers();
    if(state==='lineout') drawLineoutMarkers();
  }

  // Game loop + pause API
  function frame(ts){
    const dt = Math.min(0.05, (ts - lastTs)/1000 || 0); lastTs = ts;
    if(!paused) update(dt);
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.RUGBY = {
    pauseGame: (force)=> { paused = !!force; },
    pauseToggle: ()=> { paused = !paused; }
  };

})();