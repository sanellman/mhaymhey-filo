'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CW = 600;
const CH = 300;
const GY = 248;
const CHAR_W = 52;
const CHAR_H = 68;
const CHAR_X = 72;
const GRAVITY = 0.62;
const JUMP_V  = -13.2;
const OBS_W   = 28;
const OBS_GAP = 5;
const OBS_MIN_H = 40;
const OBS_MAX_H = 86;
const BIRD_W  = 36;
const BIRD_H  = 26;

const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: ((i * 137.5) % CW),
  y: ((i * 91.3)  % (GY * 0.72)),
  r: (i % 3) * 0.5 + 0.5,
  a: (i % 5) * 0.1 + 0.2,
  speed: (i % 4) * 0.06 + 0.05,
}));

const DASH_COUNT = 12;
const DASH_W = 24;
const DASH_GAP = CW / DASH_COUNT;

const MILESTONES = [
  { score: 150, label: '⚡ SPEED UP',   color: '#72C4E8' },
  { score: 300, label: '📷 FLASH!',     color: '#FFD700' },
  { score: 500, label: '🔥 DANGER',     color: '#FF6B6B' },
  { score: 700, label: '💀 INSANE',     color: '#FF4444' },
  { score: 1000, label: '💙 LEGENDARY', color: '#C084FC' },
];

type ObsKind = 'ground' | 'bird';
interface Obs { x: number; kind: ObsKind; h: number; count: number; fy: number }

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawChekiCard(ctx: CanvasRenderingContext2D, ox: number, h: number) {
  const ot = GY - h; const pad = 3; const photoH = h * 0.62;
  roundRect(ctx, ox, ot, OBS_W, h, 4); ctx.fillStyle = '#C5E4F9'; ctx.fill();
  roundRect(ctx, ox + pad, ot + pad, OBS_W - pad * 2, photoH, 2); ctx.fillStyle = '#7EC8F0'; ctx.fill();
  ctx.beginPath(); ctx.arc(ox + OBS_W / 2, ot + pad + photoH / 2, (OBS_W - pad * 2) * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = '#1A3A5C'; ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
  roundRect(ctx, ox, ot + h - h * 0.28, OBS_W, h * 0.25, 2); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
}

function drawGroundObs(ctx: CanvasRenderingContext2D, obs: Obs) {
  for (let i = 0; i < obs.count; i++) drawChekiCard(ctx, obs.x + i * (OBS_W + OBS_GAP), obs.h);
}

function drawBird(ctx: CanvasRenderingContext2D, obs: Obs, frame: number) {
  const cx = obs.x + BIRD_W / 2; const cy = obs.fy + BIRD_H / 2;
  const r = BIRD_H * 0.38;
  const pulse = 0.7 + Math.sin(frame * 0.15) * 0.3;
  const rot = (frame * 0.05) % (Math.PI * 2);
  ctx.beginPath(); ctx.arc(cx, cy, r * 2.2 * pulse, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,215,0,${0.1 * pulse})`; ctx.fill();
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
  for (let a = 0; a < 8; a++) {
    const angle = rot + (a * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (r + 2), cy + Math.sin(angle) * (r + 2));
    ctx.lineTo(cx + Math.cos(angle) * (r + 7 * pulse), cy + Math.sin(angle) * (r + 7 * pulse));
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = '#1A3A5C'; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,215,0,0.7)';
  ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center';
  ctx.fillText('JUMP', cx, obs.fy - 5); ctx.textAlign = 'left';
}

function spawnObs(score: number): Obs {
  const x = CW + 10;
  if (score >= 300) {
    const birdChance = Math.min(0.32, (score - 300) / 700 * 0.32);
    if (Math.random() < birdChance) {
      return { kind: 'bird', x, h: BIRD_H, count: 1, fy: GY - BIRD_H - 16 };
    }
  }
  let h = OBS_MIN_H + Math.random() * (OBS_MAX_H - OBS_MIN_H);
  if (score >= 150 && Math.random() < 0.3) h = OBS_MAX_H + 8 + Math.random() * 18;
  let count = 1;
  if      (score >= 400 && Math.random() < 0.22) count = 3;
  else if (score >= 200 && Math.random() < 0.38) count = 2;
  return { kind: 'ground', x, h, count, fy: GY };
}

function drawScene(
  ctx: CanvasRenderingContext2D, charY: number, img: HTMLImageElement | null,
  obsArr: Obs[], groundOffset: number, starOffset: number,
  score: number, frame: number, phase: string,
  milestoneText: string, milestoneAlpha: number, milestoneColor: string,
) {
  ctx.fillStyle = '#06172A'; ctx.fillRect(0, 0, CW, CH);
  STARS.forEach((s) => {
    const sx = ((s.x - starOffset * s.speed) % CW + CW) % CW;
    ctx.beginPath(); ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(114,196,232,${s.a})`; ctx.fill();
  });
  ctx.fillStyle = 'rgba(27,144,200,0.25)';
  for (let i = 0; i < DASH_COUNT + 1; i++) {
    const dx = ((i * DASH_GAP - groundOffset) % CW + CW) % CW;
    ctx.fillRect(dx, GY + 5, DASH_W, 2);
  }
  ctx.fillStyle = '#1B90C8'; ctx.fillRect(0, GY, CW, 2);
  const grad = ctx.createLinearGradient(0, GY + 2, 0, CH);
  grad.addColorStop(0, 'rgba(27,144,200,0.12)'); grad.addColorStop(1, 'rgba(27,144,200,0)');
  ctx.fillStyle = grad; ctx.fillRect(0, GY + 2, CW, CH - GY - 2);
  for (const o of obsArr) {
    if (o.kind === 'ground') drawGroundObs(ctx, o); else drawBird(ctx, o, frame);
  }
  if (img) {
    if (phase === 'dead') ctx.globalAlpha = 0.45;
    ctx.drawImage(img, CHAR_X, charY, CHAR_W, CHAR_H);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = '#72C4E8'; ctx.fillRect(CHAR_X, charY, CHAR_W, CHAR_H);
  }
  if (phase !== 'idle') {
    ctx.fillStyle = 'rgba(114,196,232,0.5)'; ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right'; ctx.fillText(`${score}`, CW - 14, 22); ctx.textAlign = 'left';
  }
  if (milestoneAlpha > 0) {
    ctx.save(); ctx.globalAlpha = milestoneAlpha;
    ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = milestoneColor; ctx.fillText(milestoneText, CW / 2, CH / 2 - 10);
    ctx.textAlign = 'left'; ctx.restore();
  }
}

type Phase = 'idle' | 'playing' | 'dead';
interface LBEntry { name: string; score: number }

export default function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  const phase        = useRef<Phase>('idle');
  const charY        = useRef(GY - CHAR_H);
  const velY         = useRef(0);
  const obstacles    = useRef<Obs[]>([]);
  const frameN       = useRef(0);
  const scoreR       = useRef(0);
  const speedR       = useRef(4.5);
  const nextSpawn    = useRef(85);
  const groundOffset = useRef(0);
  const starOffset   = useRef(0);
  const raf          = useRef(0);
  const bestScore    = useRef(0);
  const jumpCount    = useRef(0);
  const nextMilestone  = useRef(0);
  const milestoneText  = useRef('');
  const milestoneColor = useRef('#72C4E8');
  const milestoneUntil = useRef(0);
  const onDeathRef     = useRef<(score: number) => void>(() => {});
  const lastJumpTime   = useRef(0);
  const lastTimeRef    = useRef(0);

  const [ui, setUI] = useState<{ phase: Phase; score: number; best: number }>({
    phase: 'idle', score: 0, best: 0,
  });
  const [playerName, setPlayerName]   = useState('');
  const [nameInput, setNameInput]     = useState('');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LBEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myRank, setMyRank]           = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mm-runner-name');
    if (saved) setPlayerName(saved);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/mm.png';
    img.onload = () => { imgRef.current = img; };
  }, []);

  const fetchLeaderboard = useCallback(async (currentName?: string) => {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json() as { entries: LBEntry[] };
      setLeaderboard(data.entries ?? []);
      const name = currentName ?? playerName;
      if (name) {
        const rank = data.entries.findIndex((e) => e.name === name);
        setMyRank(rank >= 0 ? rank + 1 : null);
      }
    } catch { /* offline */ }
  }, [playerName]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  const submitScore = useCallback(async (score: number, name: string) => {
    if (score <= 0 || !name) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
      });
      await fetchLeaderboard(name);
    } catch { /* ignore */ }
    setIsSubmitting(false);
  }, [fetchLeaderboard]);

  useEffect(() => {
    onDeathRef.current = (score: number) => {
      if (score > 0 && playerName) submitScore(score, playerName);
    };
  }, [playerName, submitScore]);

  const saveName = () => {
    const n = nameInput.trim().slice(0, 20);
    if (!n) return;
    localStorage.setItem('mm-runner-name', n);
    setPlayerName(n);
    setShowNameEdit(false);
  };

  const reset = useCallback(() => {
    phase.current       = 'playing';
    charY.current       = GY - CHAR_H;
    velY.current        = JUMP_V;
    obstacles.current   = [];
    frameN.current      = 0;
    scoreR.current      = 0;
    speedR.current      = 4.5;
    nextSpawn.current   = 85;
    jumpCount.current   = 0;
    nextMilestone.current  = 0;
    milestoneText.current  = '';
    milestoneUntil.current = 0;
    lastTimeRef.current    = 0;
  }, []);

  const tick = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!canvas || !ctx || phase.current !== 'playing') return;

    const dt = lastTimeRef.current > 0
      ? Math.min((timestamp - lastTimeRef.current) * 60 / 1000, 3)
      : 1;
    lastTimeRef.current = timestamp;

    frameN.current += dt;
    scoreR.current = Math.floor(frameN.current / 5);
    speedR.current = 4.5 + scoreR.current * 0.0038;
    groundOffset.current = (groundOffset.current + speedR.current * dt) % CW;
    starOffset.current   = (starOffset.current + speedR.current * 0.3 * dt) % CW;

    velY.current  += GRAVITY * dt;
    charY.current += velY.current * dt;
    if (charY.current >= GY - CHAR_H) {
      charY.current = GY - CHAR_H; velY.current = 0; jumpCount.current = 0;
    }

    const ms = MILESTONES[nextMilestone.current];
    if (ms && scoreR.current >= ms.score) {
      milestoneText.current = ms.label; milestoneColor.current = ms.color;
      milestoneUntil.current = frameN.current + 80; nextMilestone.current++;
    }
    const mAlpha = milestoneUntil.current > frameN.current
      ? Math.min(1, (milestoneUntil.current - frameN.current) / 25) : 0;

    if (frameN.current >= nextSpawn.current) {
      obstacles.current.push(spawnObs(scoreR.current));
      const minGap = Math.max(40, 108 - Math.floor(speedR.current - 4.5) * 10);
      nextSpawn.current = frameN.current + minGap + Math.floor(Math.random() * 60);
    }

    obstacles.current = obstacles.current.filter((o) => o.x + (o.kind === 'bird' ? BIRD_W : o.count * OBS_W) > -10);
    const cl = CHAR_X + 8, cr = CHAR_X + CHAR_W - 8;
    const ct = charY.current + 8, cb = charY.current + CHAR_H - 4;
    let hit = false;

    for (const o of obstacles.current) {
      o.x -= speedR.current * dt;
      if (o.kind === 'ground') {
        const obsW = o.count * OBS_W + (o.count - 1) * OBS_GAP;
        if (cr > o.x + 3 && cl < o.x + obsW - 3 && cb > GY - o.h * 0.95) { hit = true; break; }
      } else {
        const ot = o.fy + 4, ob2 = o.fy + BIRD_H - 4;
        if (cr > o.x + 5 && cl < o.x + BIRD_W - 5 && cb > ot && ct < ob2) { hit = true; break; }
      }
    }

    drawScene(ctx, charY.current, imgRef.current, obstacles.current,
              groundOffset.current, starOffset.current, scoreR.current,
              frameN.current, 'playing', milestoneText.current, mAlpha, milestoneColor.current);

    if (hit) {
      phase.current = 'dead';
      if (scoreR.current > bestScore.current) bestScore.current = scoreR.current;
      drawScene(ctx, charY.current, imgRef.current, obstacles.current,
                groundOffset.current, starOffset.current, scoreR.current,
                frameN.current, 'dead', '', 0, '');
      setUI({ phase: 'dead', score: scoreR.current, best: bestScore.current });
      onDeathRef.current(scoreR.current);
      return;
    }

    setUI((p) => p.score === scoreR.current ? p : { phase: 'playing', score: scoreR.current, best: bestScore.current });
    raf.current = requestAnimationFrame(tick);
  }, []);

  const jump = useCallback(() => {
    const now = Date.now();
    if (now - lastJumpTime.current < 120) return;
    lastJumpTime.current = now;
    if (phase.current === 'idle' || phase.current === 'dead') {
      if (!playerName) { setShowNameEdit(true); setNameInput(''); return; }
      cancelAnimationFrame(raf.current);
      reset();
      setUI({ phase: 'playing', score: 0, best: bestScore.current });
      raf.current = requestAnimationFrame(tick);
      return;
    }
    if (jumpCount.current < 2) {
      velY.current = JUMP_V * (jumpCount.current === 0 ? 1 : 0.8);
      jumpCount.current++;
    }
  }, [reset, tick, playerName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); cancelAnimationFrame(raf.current); };
  }, [jump]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const tryDraw = () => {
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      drawScene(ctx, GY - CHAR_H, imgRef.current, [], 0, 0, 0, 0, 'idle', '', 0, '');
      if (imgRef.current) clearInterval(id);
    };
    tryDraw();
    id = setInterval(tryDraw, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-2 select-none">
      {/* Name bar */}
      <div className="flex items-center gap-2 h-8">
        {playerName ? (
          <>
            <p className="text-white/40 text-xs">เล่นเป็น:</p>
            <p className="text-[#72C4E8] font-bold text-sm">{playerName}</p>
            <button
              onClick={() => { setNameInput(playerName); setShowNameEdit(true); }}
              className="text-white/25 hover:text-white/60 text-[10px] transition underline"
            >
              แก้ไข
            </button>
          </>
        ) : (
          <button
            onClick={() => { setNameInput(''); setShowNameEdit(true); }}
            className="text-[#72C4E8] text-xs font-semibold hover:text-white transition"
          >
            + ใส่ชื่อก่อนเล่น
          </button>
        )}
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-[600px]">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="w-full rounded-2xl border border-white/15 cursor-pointer touch-none"
          onPointerDown={(e) => { e.preventDefault(); jump(); }}
        />

        {showNameEdit && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/70">
            <div className="bg-[#0A1E2E] border border-white/20 rounded-2xl p-6 w-72 space-y-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#72C4E8] mb-1">Fan Game</p>
                <p className="text-white font-black text-lg">ชื่อของคุณ</p>
                <p className="text-white/30 text-xs mt-0.5">จะแสดงใน Leaderboard</p>
              </div>
              <input
                autoFocus
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                placeholder="ชื่อ (สูงสุด 20 ตัวอักษร)"
                maxLength={20}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72C4E8]"
              />
              <div className="flex gap-2">
                {playerName && (
                  <button
                    onClick={() => setShowNameEdit(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/50 text-sm font-semibold hover:bg-white/5 transition"
                  >
                    ยกเลิก
                  </button>
                )}
                <button
                  onClick={saveName}
                  disabled={!nameInput.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B90C8] text-white font-bold text-sm hover:bg-[#0F75A8] disabled:opacity-30 transition"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )}

        {ui.phase === 'idle' && !showNameEdit && (
          <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
            <p className="text-white/40 text-sm font-semibold">
              {playerName ? 'แตะหรือกด Space เพื่อเริ่ม' : 'ใส่ชื่อก่อนเริ่มเล่น'}
            </p>
          </div>
        )}

        {ui.phase === 'dead' && !showNameEdit && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/55 gap-1 pointer-events-none">
            <p className="text-white font-black text-2xl">Game Over</p>
            <p className="text-[#72C4E8] font-bold tabular-nums text-xl mt-1">{ui.score}</p>
            {ui.best > 0 && <p className="text-white/35 text-xs">Best: {ui.best}</p>}
            {isSubmitting && <p className="text-white/30 text-xs mt-1">กำลังบันทึกคะแนน...</p>}
            <p className="text-white/35 text-xs mt-3">แตะหรือกด Space เพื่อเล่นใหม่</p>
          </div>
        )}
      </div>

      {/* Score */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Score</p>
          <p className="text-[#72C4E8] font-black text-2xl tabular-nums">{ui.score}</p>
        </div>
        {ui.best > 0 && (
          <div className="text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Best</p>
            <p className="text-white/50 font-black text-2xl tabular-nums">{ui.best}</p>
          </div>
        )}
        {myRank && (
          <div className="text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Rank</p>
            <p className="text-yellow-400/80 font-black text-2xl tabular-nums">#{myRank}</p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-[480px]">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#72C4E8]">🏆 Leaderboard</p>
            <button
              onClick={() => fetchLeaderboard()}
              className="text-white/25 hover:text-white/60 text-[10px] transition"
            >
              refresh
            </button>
          </div>
          <div className="grid grid-cols-[2rem_1fr_5rem] px-5 py-2 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/25 text-center">#</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">ชื่อ</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/25 text-right">คะแนน</span>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-center text-white/20 text-xs py-6">ยังไม่มีข้อมูล</p>
          ) : (
            <div className="divide-y divide-white/5">
              {leaderboard.slice(0, 10).map((entry, i) => {
                const isMe = entry.name === playerName;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
                return (
                  <div
                    key={`${entry.name}-${i}`}
                    className={`grid grid-cols-[2rem_1fr_5rem] items-center px-5 py-2.5 ${isMe ? 'bg-[#1B90C8]/15' : ''}`}
                  >
                    <span className="text-[11px] font-black text-center shrink-0 leading-none">
                      {medal ?? <span className="text-white/30 font-semibold text-xs">{i + 1}</span>}
                    </span>
                    <span className={`text-sm font-semibold truncate pr-2 ${isMe ? 'text-[#72C4E8]' : 'text-white/80'}`}>
                      {entry.name}
                      {isMe && <span className="text-[10px] text-[#72C4E8]/50 ml-1.5">◀ you</span>}
                    </span>
                    <span className={`text-sm font-black tabular-nums text-right ${isMe ? 'text-[#72C4E8]' : 'text-white/60'}`}>
                      {entry.score}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="text-white/15 text-xs">Space / ↑ / แตะ = กระโดด</p>
    </div>
  );
}
