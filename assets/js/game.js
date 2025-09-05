
(() => {
  const canvas = document.getElementById('rugbyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width, H = canvas.height;
  const PAD = 8, GOAL_PAD = 24, IN_GOAL = 40, MAX_P = 15;
  const PASS_CD = 550, STRIP_CD = 900, TACKLE_R = 22, RUCK_RADIUS = 28;
  const OUT_TOP = PAD, OUT_BOT = H-PAD;
  const HALF_SEC = 80, HALF_BREAK = 10;

  // Colors (no dark filter)
  const FIELD = "#0c8b3a";
  const LINE = "#fcfcfc";
  const AUX_LINE = "#cfead6";

  const weatherKinds = ["Sunny","Rainy","Snowy","Overcast","Windy"];
  const weather = { kind: weatherKinds[(Math.random()*weatherKinds.length)|0], tempC: (10+Math.random()*16)|0, windKmh: (Math.random()*10)|0, windDir: Math.random()<0.5?-1:1 };
  const weatherHud = document.getElementById('weatherHud');
  if(weatherHud) weatherHud.textContent = `${weather.kind} · ${weather.tempC}°C · Wind ${weather.windKmh}km/h ${weather.windDir>0?"→":"←"}`;

  const score = { A:0, B:0 };
  const scoreA = document.getElementById('scoreA');
  const scoreB = document.getElementById('scoreB');
  const clockEl = document.getElementById('gameClock');
  const halfEl = document.getElementById('halfLabel');
  const eventLog = document.getElementById('eventLog');
  const pauseBtn = document.getElementById('pauseBtn');
  const helpBtn = document.getElementById('helpBtn');
  const fsBtn = document.getElementById('fsBtn');
  const rulesPanel = document.getElementById('rulesPanel');
  const countdownEl = document.getElementById('countdown');

  function log(m){ if(!eventLog) return; const d=document.createElement('div'); d.textContent=m; eventLog.appendChild(d); eventLog.scrollTop=eventLog.scrollHeight; }
  function updScore(){ if(scoreA) scoreA.textContent=score.A; if(scoreB) scoreB.textContent=score.B; }
  function setClock(sec){ const m=(sec/60)|0, s=(sec%60)|0; if(clockEl) clockEl.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }

  function mkHair(){ const colors=["#6b7280","#d1d5db","#1f2937","#a855f7","#ef4444","#f59e0b","#10b981","#3b82f6"]; const styles=["buzz","short","mohawk","bun","fade","curly","bald","crew"]; return {color:colors[(Math.random()*colors.length)|0], style:styles[(Math.random()*styles.length)|0]}; }
  function createTeam(tag, baseX, faceY){
    const arr=[]; for(let i=0;i<MAX_P;i++){ const hair=mkHair(); arr.push({team:tag, number:i+1, x:baseX+(tag==="A"?-i*22:i*22), y:faceY+(i%8)*40, vx:0, vy:0, hasBall:false, tackled:false, hair, legs:0, stamina:3, role: i<8?"forward":"back"});} return arr;
  }
  const A = createTeam("A", 140, 80);
  const B = createTeam("B", W-140, 80);
  const ball = { x:A[9].x+10, y:A[9].y-6, carrier:A[9], air:false, vx:0, vy:0 };
  ball.carrier.hasBall=true; let user=A[9];

  const refs = { center:{x:W*0.5,y:H*0.5}, touchTop:{x:W*0.5,y:PAD-4}, touchBot:{x:W*0.5,y:H-PAD+4} };

  let keys=Object.create(null), mouseRight=false, gameSec=0, curHalf=1, paused=false;
  let inCountdown=true, count=3, lastPass=0, lastStrip=0, stoppage=null, kickMode=false;

  updScore(); setClock(0); if(halfEl) halfEl.textContent="1st Half";

  document.addEventListener('keydown', e=>{ if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); keys[e.key.toLowerCase()]=true; });
  document.addEventListener('keyup', e=>{ keys[e.key.toLowerCase()]=false; });
  canvas.addEventListener('contextmenu', e=>e.preventDefault());
  canvas.addEventListener('mousedown', e=>{ if(e.button===2){ mouseRight=true; tryStrip(); } });
  canvas.addEventListener('mouseup', e=>{ if(e.button===2) mouseRight=false; });
  if(pauseBtn) pauseBtn.onclick=()=>{ paused=!paused; pauseBtn.textContent=paused?"Resume ▶":"Pause ⏸"; if(!paused) startCountdown(); };
  if(helpBtn) helpBtn.onclick=()=>{ rulesPanel.style.display="block"; paused=true; };
  if(fsBtn) fsBtn.onclick=()=>{ if(canvas.requestFullscreen) canvas.requestFullscreen(); };

  function startCountdown(){ inCountdown=true; count=3; if(countdownEl){ countdownEl.style.display="grid"; countdownEl.textContent=count; } }
  function endCountdown(){ inCountdown=false; if(countdownEl) countdownEl.style.display="none"; }
  startCountdown();

  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const sgn=v=>(v<0?-1:1);

  function whistlePenalty(type, againstTeam, x,y){
    stoppage={type, side:(againstTeam==="A"?"B":"A"), x, y, timer:1.0};
    log(`Penalty: ${type} against ${againstTeam}. ${stoppage.side} ball.`);
    setTimeout(()=>{ restartTap(stoppage.side,x,y); stoppage=null; }, 1000);
  }
  function restartTap(side,x,y){ const team = side==="A"?A:B; let taker=team[9]; taker.x=x; taker.y=clamp(y,PAD+20,H-PAD-20); ball.carrier=taker; taker.hasBall=true; ball.air=false; ball.x=taker.x; ball.y=taker.y-6; }

  function tryPass(){
    const now=performance.now(); if(now-lastPass<PASS_CD || !ball.carrier) return;
    const c=ball.carrier; const mates=c.team==="A"?A:B; let best=null,score=-1;
    for(const p of mates){ if(p===c) continue; const backOK = c.team==="A" ? (p.x < c.x-5) : (p.x > c.x+5); if(!backOK) continue; const d=dist(p,c); if(d>240) continue; const s=1/d + 1 - Math.abs(p.y-c.y)/H; if(s>score){score=s; best=p;} }
    if(!best){ whistlePenalty("Forward pass", c.team, c.x, c.y); return; }
    ball.air=true; c.hasBall=false; ball.carrier=null; const dx=best.x-ball.x, dy=best.y-ball.y, L=Math.hypot(dx,dy)||1; ball.vx=(dx/L)*5.1; ball.vy=(dy/L)*5.1; lastPass=now; log(`Pass to #${best.number}`);
  }
  function tryStrip(){
    const now=performance.now(); if(now-lastStrip<STRIP_CD) return; lastStrip=now;
    if(!ball.carrier) return; const opp=ball.carrier.team==="A"?B:A;
    for(const d of opp){ if(dist(d,ball.carrier)<24){ const chance=0.2 + (keys['shift']?0.1:0); if(Math.random()<chance){ log(`Ball stripped by #${d.number} (${d.team})`); ball.carrier.hasBall=false; ball.carrier=null; ball.air=false; ball.carrier=d; d.hasBall=true; if(d.team==="B") user=A[(Math.random()*A.length)|0]; return; } } }
  }
  function tryTackle(def, atk){
    if(!atk || !def) return false;
    if(dist(def, atk) < TACKLE_R){
      if(Math.random()<0.75){
        atk.tackled=true;
        setTimeout(()=>{
          const atkTeam = atk.team==="A"?A:B; const defTeam = atk.team==="A"?B:A;
          const nearAtk = atkTeam.filter(p=>dist(p,atk)<RUCK_RADIUS).length;
          const nearDef = defTeam.filter(p=>dist(p,atk)<RUCK_RADIUS).length;
          const keep = nearAtk >= nearDef || Math.random()<0.35;
          atk.tackled=false;
          if(keep){ let n=null, dm=1e9; for(const p of atkTeam){ const d=dist(p,atk); if(d<dm){dm=d;n=p;} } ball.carrier=n; n.hasBall=true; ball.air=false; ball.x=n.x; ball.y=n.y-6; log("Ruck won (attack retains)."); }
          else { let n=null, dm=1e9; for(const p of defTeam){ const d=dist(p,atk); if(d<dm){dm=d;n=p;} } ball.carrier=n; n.hasBall=true; ball.air=false; ball.x=n.x; ball.y=n.y-6; log("Turnover at ruck!"); if(n.team==="B") user=A[(Math.random()*A.length)|0]; }
        }, 280);
        return true;
      }
    }
    return false;
  }

  function checkTouch(){
    const y = ball.carrier ? ball.carrier.y : ball.y;
    if(y <= OUT_TOP || y >= OUT_BOT){
      const against = ball.carrier ? ball.carrier.team : (ball.vx>0?"A":"B");
      log("Ball into touch — lineout.");
      const side = against==="A"?"B":"A";
      lineout(side, clamp(ball.x, PAD+60, W-PAD-60), (y<=OUT_TOP?PAD+6:H-PAD-6));
      return true;
    }
    return false;
  }
  function lineout(side, x, y){
    stoppage = {type:"lineout", side, x, y, timer:1.0};
    setTimeout(()=>{
      const team = side==="A"?A:B; const jumper = team[4];
      jumper.x = x; jumper.y = clamp(H*0.5, PAD+20, H-PAD-20);
      ball.carrier = jumper; jumper.hasBall=true; ball.air=false; ball.x=jumper.x; ball.y=jumper.y-6;
      log(`Lineout won by ${side}`); stoppage=null;
    }, 900);
  }

  function canGroundTry(){ return ball.carrier && ball.carrier.team==="A" && ball.carrier.x > (W-PAD-GOAL_PAD-IN_GOAL+5); }
  function addScore(team, kind){ if(kind==="try"){ score[team]+=5; window.__onUserScore && window.__onUserScore(5);} if(kind==="conv"){ score[team]+=2; window.__onUserScore && window.__onUserScore(2);} updScore(); }

  const kickUI = (()=>{
    const wrap = document.createElement('div'); wrap.className="kick-ui"; wrap.style.display="none";
    wrap.innerHTML=`<div class="kick-card"><h3>Conversion Kick</h3><div class="kick-rows"><div>Power</div><div class="meter"><div class="needle" style="left:0%"></div></div><div style="margin-top:8px">Direction</div><div class="dir"><div class="cursor" style="left:50%"></div></div></div><div class="kick-actions"><div class="kick-note">Click once for power, again for direction.</div><button class="btn" id="kickBtn">Kick</button></div></div>`;
    canvas.parentElement.appendChild(wrap);
    let phase=0, osc=0, p=0.5, d=0.5;
    function rightPosts(){ const x=W-PAD-GOAL_PAD, crossY=H*0.5, gap=H*0.5; return {centerX:x, gapTop:crossY-gap/2, gapBottom:crossY+gap/2}; }
    function show(){ wrap.style.display="flex"; phase=1; osc=0; }
    function update(dt){ if(phase===0) return; osc+=dt*4; const val=(Math.sin(osc)+1)/2; if(phase===1) wrap.querySelector('.needle').style.left=(val*98)+'%'; if(phase===2) wrap.querySelector('.cursor').style.left=(val*98)+'%'; }
    function shoot(){ const posts=rightPosts(); const dev=(d-0.5)*2*90 + weather.windDir*weather.windKmh*2; const targetY = ball.y + dev; const success = p>0.45 && targetY>posts.gapTop && targetY<posts.gapBottom; if(success){ addScore("A","conv"); log("Conversion GOOD."); } else { log("Conversion missed."); } wrap.style.display="none"; phase=0; kickMode=false; kickoff("B"); }
    wrap.querySelector('#kickBtn').onclick=()=>{ if(phase===1){ p=(Math.sin(osc)+1)/2; phase=2; } else if(phase===2){ d=(Math.sin(osc)+1)/2; shoot(); } };
    return { show, update };
  })();

  function rightPosts(){ const x=W-PAD-GOAL_PAD, crossY=H*0.5, gap=H*0.5; return { centerX:x, gapTop:crossY-gap/2, gapBottom:crossY+gap/2, crossY }; }

  function offenseFormation(){
    const carrier = ball.carrier && ball.carrier.team==="A" ? ball.carrier : user;
    const pods = [ [A[0],A[1],A[2]], [A[3],A[4],A[5]], [A[6],A[7]] ];
    const spacingX = 34, spacingY = 12;
    pods.forEach((pod,i)=>{ const px = carrier.x + (i+1)*30; const py = carrier.y + (i-1)*28; pod.forEach((p,j)=>{ seek(p, px - j*spacingX, py + (j-1)*spacingY, 0.006); }); });
    const ten=A[9], ic=A[11], oc=A[12], lw=A[10], rw=A[14], fb=A[8];
    seek(ten, carrier.x-26, carrier.y+4, 0.01);
    seek(ic, ten.x+22, ten.y-8, 0.008);
    seek(oc, ic.x+26, ic.y+8, 0.008);
    seek(lw, carrier.x-10, PAD+30, 0.006);
    seek(rw, carrier.x-10, H-PAD-30, 0.006);
    seek(fb, carrier.x-60, clamp(carrier.y, PAD+40, H-PAD-40), 0.006);
  }
  function defenseFormation(){
    const xBall = ball.carrier ? ball.carrier.x : ball.x;
    const nearGoal = (W-PAD-GOAL_PAD) - xBall < 120;
    let mode="flat"; if(nearGoal) mode="goal"; else if(Math.random()<0.02) mode="blitz"; else if(Math.random()<0.05) mode="drift";
    const lineX = Math.max(xBall+60, W*0.45);
    const fwd = B.slice(0,8), backs = B.slice(8); const spread = H*0.72;
    fwd.forEach((p,i)=>{ const ty=H*0.5 + (i-3.5)*18; let tx=lineX-10; if(mode==="goal") tx=Math.max(lineX-20, W-PAD-GOAL_PAD-60); seek(p, tx, ty, 0.008); });
    backs.forEach((p,i)=>{ const ty = PAD+24 + i*(spread/(backs.length-1)); let tx=lineX + (mode==="blitz"?4:0); if(mode==="drift") tx+=10; seek(p, tx, ty, 0.008); });
    const fb=B[14]; seek(fb, Math.max(lineX-20, W*0.55), H*0.5, 0.006);
  }
  function seek(p, tx, ty, k){ p.vx += (tx-p.x)*k; p.vy += (ty-p.y)*k; }

  function drawStadium(){
    const g = ctx.createLinearGradient(0, 0, 0, H*0.3); g.addColorStop(0, "#0e172a"); g.addColorStop(1, "#0b1220");
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.moveTo(PAD, PAD); ctx.lineTo(W-PAD, PAD); ctx.lineTo(W-PAD-40, PAD+60); ctx.lineTo(PAD+40, PAD+60); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(PAD+40, H-PAD-60); ctx.lineTo(W-PAD-40, H-PAD-60); ctx.lineTo(W-PAD, H-PAD); ctx.lineTo(PAD, H-PAD); ctx.closePath(); ctx.fill();
    ctx.fillStyle="#334155"; for(let i=0;i<180;i++){ const x=Math.random()*(W-160)+80; const y=Math.random()*50+PAD+6; ctx.fillRect(x,y,2,2); const y2=H-PAD-12-(Math.random()*50); ctx.fillRect(x,y2,2,2); }
  }
  function drawScoreboard3D(){
    const w=260,h=54, x=(W-w)/2, y=PAD-4;
    ctx.save(); ctx.fillStyle="#0b0b0b"; ctx.strokeStyle="#222"; ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(x, y+10); ctx.lineTo(x+14, y); ctx.lineTo(x+w-14, y); ctx.lineTo(x+w, y+10);
    ctx.lineTo(x+w, y+h); ctx.lineTo(x, y+h); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle="#e5e7eb";
    ctx.font="14px system-ui"; ctx.textAlign="center";
    ctx.fillText("Team A  " + score.A + "  -  " + score.B + "  Team B", x+w/2, y+28);
    ctx.font="12px system-ui"; ctx.fillText(document.getElementById('gameClock')?.textContent || "", x+w/2, y+44);
    ctx.restore();
  }
  function drawField(){
    ctx.fillStyle=FIELD; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=LINE; ctx.lineWidth=2; ctx.strokeRect(PAD,PAD,W-2*PAD,H-2*PAD);
    ctx.strokeStyle=AUX_LINE; ctx.lineWidth=1; for(let i=1;i<10;i++){ const x=PAD+i*((W-2*PAD)/10); ctx.beginPath(); ctx.moveTo(x,PAD); ctx.lineTo(x,H-PAD); ctx.stroke(); }
    ctx.strokeStyle=LINE; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(PAD+GOAL_PAD, PAD); ctx.lineTo(PAD+GOAL_PAD, H-PAD); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W-PAD-GOAL_PAD, PAD); ctx.lineTo(W-PAD-GOAL_PAD, H-PAD); ctx.stroke();
    drawUprights("left"); drawUprights("right");
    drawStadium(); drawScoreboard3D();
  }
  function drawUprights(side){
    const baseX = side==="left"? PAD+GOAL_PAD : W-PAD-GOAL_PAD; const crossY = H*0.5;
    ctx.fillStyle="#fff";
    ctx.fillRect(baseX-85, crossY-2, 170, 4);
    ctx.fillRect(baseX-85, PAD, 5, H-2*PAD);
    ctx.fillRect(baseX+80, PAD, 5, H-2*PAD);
  }
  function drawPlayer(p, highlight=false){
    const face="#ffdfc4", jersey=p.team==="A"?"#c81e1e":"#1e3a8a";
    const moving=Math.hypot(p.vx,p.vy)>0.15; if(moving)p.legs+=0.2; else p.legs*=0.9; const la=Math.sin(p.legs)*6, lb=Math.sin(p.legs+Math.PI)*6;
    ctx.save();
    ctx.fillStyle=jersey; ctx.strokeStyle="#0a0a0a"; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(p.x-8,p.y-18,16,20,4); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#fff"; ctx.font="10px sans-serif"; ctx.textAlign="center"; ctx.fillText(String(p.number), p.x, p.y-6);
    ctx.fillStyle=face; ctx.beginPath(); ctx.arc(p.x, p.y-26, 7, 0, Math.PI*2); ctx.fill();
    if(p.hair.style!=="bald"){ ctx.fillStyle=p.hair.color; ctx.beginPath(); ctx.arc(p.x, p.y-28, 7, Math.PI, 0); ctx.fill(); }
    ctx.strokeStyle="#0b0b0b"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(p.x-4, p.y+2); ctx.lineTo(p.x-4 - la*0.6, p.y+12); ctx.stroke(); ctx.fillStyle="#222"; ctx.fillRect(p.x-6 - la*0.6, p.y+12, 6, 3);
    ctx.beginPath(); ctx.moveTo(p.x+4, p.y+2); ctx.lineTo(p.x+4 + lb*0.6, p.y+12); ctx.stroke(); ctx.fillRect(p.x+2 + lb*0.6, p.y+12, 6, 3);
    ctx.strokeStyle="#eab308"; ctx.beginPath(); ctx.moveTo(p.x-8,p.y-12); ctx.lineTo(p.x-14,p.y-6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x+8,p.y-12); ctx.lineTo(p.x+14,p.y-6); ctx.stroke();
    if(p.hasBall) drawBall(p.x+10, p.y-10);
    if(highlight){ ctx.strokeStyle="#fbbf24"; ctx.lineWidth=2; ctx.strokeRect(p.x-10, p.y-30, 20, 36); }
    ctx.restore();
  }
  function drawBall(x,y){ ctx.save(); ctx.translate(x,y); ctx.rotate(0.4); ctx.fillStyle="#8b4513"; ctx.beginPath(); ctx.ellipse(0,0,8,5,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.stroke(); ctx.restore(); }
  function drawRefs(){ const dot=(r)=>{ ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(r.x,r.y,6,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.fillRect(r.x-3,r.y-1,6,2); }; dot(refs.center); dot(refs.touchTop); dot(refs.touchBot); }

  function kickoff(toSide){ A.concat(B).forEach(p=>{p.vx=0;p.vy=0;p.tackled=false;}); const t=(toSide==="B")?B:A; const k=t[9]; ball.carrier=k; k.hasBall=true; ball.air=false; ball.x=k.x; ball.y=k.y-6; user=A[9]; startCountdown(); }

  function update(dt){
    if(paused) return;
    if(inCountdown){ count-=dt; if(countdownEl) countdownEl.textContent=Math.ceil(count); if(count<=0) endCountdown(); else return; }
    if(kickMode || stoppage) return;

    gameSec += dt; setClock(gameSec|0);
    if(curHalf===1 && gameSec>=HALF_SEC){ curHalf=2; if(halfEl) halfEl.textContent="2nd Half"; paused=true; setTimeout(()=>{ paused=false; startCountdown(); }, HALF_BREAK*1000); }

    let ux=0,uy=0; if(keys['w'])uy-=1; if(keys['s'])uy+=1; if(keys['a'])ux-=1; if(keys['d'])ux+=1;
    const len=Math.hypot(ux,uy)||1; ux/=len; uy/=len; const max= keys['shift'] && user.stamina>0 ? 3.4 : 2.2;
    user.vx = clamp(user.vx + ux*0.5, -max, max); user.vy = clamp(user.vy + uy*0.5, -max, max);
    if(keys['p']){ tryPass(); keys['p']=false; }
    if(keys['t'] && ball.carrier && ball.carrier.team==="B"){ tryTackle(user, ball.carrier); keys['t']=false; }
    if(keys['s'] && canGroundTry()){ addScore("A","try"); keys['s']=false; log("TRY!"); kickMode=true; kickUI.show(); }

    offenseFormation(); defenseFormation();

    A.concat(B).forEach(p=>{ if(p===user && keys['shift'] && user.stamina>0) user.stamina-=dt; else user.stamina=Math.min(3,user.stamina+dt*0.6); p.x+=p.vx; p.y+=p.vy; p.vx*=0.86; p.vy*=0.86; p.x=clamp(p.x,PAD+10,W-PAD-10); p.y=clamp(p.y,PAD+10,H-PAD-10); });

    if(ball.carrier){ const def = ball.carrier.team==="A"?B:A; def.slice().sort((a,b)=>dist(a,ball.carrier)-dist(b,ball.carrier)).slice(0,2).forEach(d=>{ d.vx += (ball.carrier.x-d.x>0?0.26:-0.26); d.vy += (ball.carrier.y-d.y>0?0.26:-0.26); tryTackle(d, ball.carrier); }); }

    if(ball.air){ ball.x+=ball.vx; ball.y+=ball.vy; ball.vx*=0.99; ball.vy*=0.99; for(const p of A.concat(B)){ if(dist(p,ball)<12){ ball.air=false; ball.carrier=p; p.hasBall=true; log(`Caught by #${p.number} (${p.team})`); break; } } }
    else if(ball.carrier){ ball.x=ball.carrier.x+10; ball.y=ball.carrier.y-8; if(ball.carrier.team==="A") user=ball.carrier; }

    if(checkTouch()) return;

    if(ball.carrier){ refs.center.x += (ball.carrier.x - refs.center.x)*0.04; refs.center.y += (ball.carrier.y - refs.center.y)*0.04; refs.touchTop.x = ball.carrier.x; refs.touchBot.x = ball.carrier.x; }
  }

  function drawScoreboard3D(){
    const w=260,h=54, x=(W-w)/2, y=PAD-4;
    ctx.save(); ctx.fillStyle="#0b0b0b"; ctx.strokeStyle="#222"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x, y+10); ctx.lineTo(x+14, y); ctx.lineTo(x+w-14, y); ctx.lineTo(x+w, y+10); ctx.lineTo(x+w, y+h); ctx.lineTo(x, y+h); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#e5e7eb"; ctx.font="14px system-ui"; ctx.textAlign="center"; ctx.fillText("Team A  "+score.A+"  -  "+score.B+"  Team B", x+w/2, y+28);
    ctx.font="12px system-ui"; ctx.fillText(document.getElementById('gameClock')?.textContent || "", x+w/2, y+44); ctx.restore();
  }
  function drawField(){
    ctx.fillStyle=FIELD; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=LINE; ctx.lineWidth=2; ctx.strokeRect(PAD,PAD,W-2*PAD,H-2*PAD);
    ctx.strokeStyle=AUX_LINE; ctx.lineWidth=1; for(let i=1;i<10;i++){ const x=PAD+i*((W-2*PAD)/10); ctx.beginPath(); ctx.moveTo(x,PAD); ctx.lineTo(x,H-PAD); ctx.stroke(); }
    ctx.strokeStyle=LINE; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(PAD+GOAL_PAD, PAD); ctx.lineTo(PAD+GOAL_PAD, H-PAD); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W-PAD-GOAL_PAD, PAD); ctx.lineTo(W-PAD-GOAL_PAD, H-PAD); ctx.stroke();
    drawUprights("left"); drawUprights("right"); drawStadium(); drawScoreboard3D();
  }
  function drawUprights(side){ const baseX=side==="left"?PAD+GOAL_PAD:W-PAD-GOAL_PAD; const crossY=H*0.5; ctx.fillStyle="#fff"; ctx.fillRect(baseX-85,crossY-2,170,4); ctx.fillRect(baseX-85,PAD,5,H-2*PAD); ctx.fillRect(baseX+80,PAD,5,H-2*PAD); }
  function drawRefs(){ const dot=(r)=>{ ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(r.x,r.y,6,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.fillRect(r.x-3,r.y-1,6,2); }; dot(refs.center); dot(refs.touchTop); dot(refs.touchBot); }
  function drawPlayer(p, highlight=false){
    const face="#ffdfc4", jersey=p.team==="A"?"#c81e1e":"#1e3a8a";
    const moving=Math.hypot(p.vx,p.vy)>0.15; if(moving)p.legs+=0.2; else p.legs*=0.9; const la=Math.sin(p.legs)*6, lb=Math.sin(p.legs+Math.PI)*6;
    ctx.save(); ctx.fillStyle=jersey; ctx.strokeStyle="#0a0a0a"; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(p.x-8,p.y-18,16,20,4); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#fff"; ctx.font="10px sans-serif"; ctx.textAlign="center"; ctx.fillText(String(p.number), p.x, p.y-6);
    ctx.fillStyle=face; ctx.beginPath(); ctx.arc(p.x,p.y-26,7,0,Math.PI*2); ctx.fill();
    if(p.hair.style!=="bald"){ ctx.fillStyle=p.hair.color; ctx.beginPath(); ctx.arc(p.x,p.y-28,7,Math.PI,0); ctx.fill(); }
    ctx.strokeStyle="#0b0b0b"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(p.x-4,p.y+2); ctx.lineTo(p.x-4 - la*0.6,p.y+12); ctx.stroke(); ctx.fillStyle="#222"; ctx.fillRect(p.x-6 - la*0.6,p.y+12,6,3);
    ctx.beginPath(); ctx.moveTo(p.x+4,p.y+2); ctx.lineTo(p.x+4 + lb*0.6,p.y+12); ctx.stroke(); ctx.fillRect(p.x+2 + lb*0.6,p.y+12,6,3);
    ctx.strokeStyle="#eab308"; ctx.beginPath(); ctx.moveTo(p.x-8,p.y-12); ctx.lineTo(p.x-14,p.y-6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x+8,p.y-12); ctx.lineTo(p.x+14,p.y-6); ctx.stroke();
    if(p.hasBall) drawBall(p.x+10,p.y-10); if(highlight){ ctx.strokeStyle="#fbbf24"; ctx.lineWidth=2; ctx.strokeRect(p.x-10,p.y-30,20,36); } ctx.restore();
  }

  function render(){ drawField(); A.forEach(p=>drawPlayer(p,p===user)); B.forEach(p=>drawPlayer(p,p===user)); if(ball.air) drawBall(ball.x,ball.y); if(canGroundTry()){ ctx.fillStyle="#fff"; ctx.fillText("Press S to ground for TRY", ball.carrier.x+10, ball.carrier.y-28); } drawRefs(); }

  function loop(ts){ const dt=Math.min(0.05,(ts-(loop.last||ts))/1000); loop.last=ts; update(dt); render(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();