import { useState, useEffect, useRef, useCallback } from "react";

type Tab = "home" | "explore" | "wallet" | "chat" | "profile";

/* ── Ripple hook ── */
function useRipple() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const s = Math.max(r.width, r.height) * 2;
    const sp = document.createElement("span");
    sp.className = "ripple-el";
    Object.assign(sp.style, {
      width:`${s}px`, height:`${s}px`,
      left:`${e.clientX-r.left-s/2}px`, top:`${e.clientY-r.top-s/2}px`,
    });
    el.appendChild(sp);
    sp.addEventListener("animationend", () => sp.remove());
  }, []);
  return { ref, go };
}

/* ── Data ── */
const SKILLS = [
  { id:1, u:"Priya S.",  av:"P", skill:"Python Mentoring",     cr:1, rt:4.9, rv:34, tag:"Tech",     col:"#818cf8", avail:"Weekends",    dist:"1.2 km" },
  { id:2, u:"Marco R.",  av:"M", skill:"Guitar Lessons",       cr:1, rt:4.7, rv:21, tag:"Music",    col:"#f87171", avail:"Evenings",     dist:"0.8 km" },
  { id:3, u:"Yuki T.",   av:"Y", skill:"Japanese Cooking",     cr:2, rt:5.0, rv:12, tag:"Cooking",  col:"#fb923c", avail:"Sat mornings", dist:"3.1 km" },
  { id:4, u:"Sam B.",    av:"S", skill:"Bike Repair",          cr:1, rt:4.8, rv:45, tag:"Repair",   col:"#4ade80", avail:"Anytime",      dist:"0.5 km" },
  { id:5, u:"Lena K.",   av:"L", skill:"Spanish Conversation", cr:1, rt:4.6, rv:18, tag:"Language", col:"#38bdf8", avail:"Mornings",     dist:"2.0 km" },
  { id:6, u:"David O.",  av:"D", skill:"Photography Walk",     cr:2, rt:4.9, rv:29, tag:"Art",      col:"#c084fc", avail:"Weekends",     dist:"1.8 km" },
];

const REQUESTS = [
  { id:1, u:"Alex M.",   need:"Python Interview Prep",  hrs:1, tag:"Tech",    posted:"2h ago",  urgency:"Today" },
  { id:2, u:"Fatima H.", need:"CV Review & Editing",    hrs:1, tag:"Writing", posted:"5h ago",  urgency:"This week" },
  { id:3, u:"Tom W.",    need:"Furniture Moving Help",  hrs:3, tag:"Moving",  posted:"1d ago",  urgency:"Weekend" },
];

const TXS = [
  { id:1, type:"earn",  desc:"Python session — Alex M.",    cr:+1, date:"Sep 3",  st:"verified" },
  { id:2, type:"spend", desc:"Guitar lesson — Marco R.",    cr:-1, date:"Aug 30", st:"verified" },
  { id:3, type:"earn",  desc:"CV review — Fatima H.",       cr:+1, date:"Aug 28", st:"verified" },
  { id:4, type:"earn",  desc:"Bike repair — Kenji L.",      cr:+1, date:"Aug 25", st:"verified" },
  { id:5, type:"spend", desc:"Japanese cooking — Yuki T.",  cr:-2, date:"Aug 20", st:"verified" },
  { id:6, type:"earn",  desc:"Spanish tutoring — Lena K.",  cr:+1, date:"Aug 15", st:"pending"  },
];

const MSGS = [
  { id:1, u:"Priya S.", av:"P", col:"#818cf8", pre:"Does Tuesday 3pm work for you?",        t:"10:42",    unread:2 },
  { id:2, u:"Marco R.", av:"M", col:"#f87171", pre:"Great session! See you next week.",     t:"Yesterday",unread:0 },
  { id:3, u:"Sam B.",   av:"S", col:"#4ade80", pre:"I can fix your rear derailleur too.",  t:"Mon",      unread:0 },
  { id:4, u:"Yuki T.",  av:"Y", col:"#fb923c", pre:"Bring a notebook — lots to cover!",   t:"Sun",      unread:1 },
];

const CHAT_LOG = [
  { from:"them", text:"Hey! Are you free for the Python session?" , time:"10:30" },
  { from:"me",   text:"Yes! Tuesday 3pm sounds perfect 🎯",         time:"10:38" },
  { from:"them", text:"Does Tuesday 3pm work for you?",             time:"10:42" },
];

/* ── Small atoms ── */
function Av({ l, col, sz=40 }: { l:string; col:string; sz?:number }) {
  return (
    <div style={{
      width:sz, height:sz, borderRadius:"50%", flexShrink:0,
      background:`${col}18`, border:`1.5px solid ${col}40`,
      display:"flex", alignItems:"center", justifyContent:"center",
      color:col, fontSize:sz*0.38, fontWeight:700, fontFamily:"'Outfit',sans-serif",
    }}>{l}</div>
  );
}

function Pill({ label, col }: { label:string; col?:string }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"3px 10px", borderRadius:999,
      background: col ? `${col}14` : "rgba(255,255,255,0.06)",
      border:`1px solid ${col ? col+"2e" : "rgba(255,255,255,0.09)"}`,
      color: col ?? "rgba(255,255,255,0.5)",
      fontSize:10, fontWeight:600, letterSpacing:"0.04em", whiteSpace:"nowrap",
    }}>{label}</span>
  );
}

function Stars({ r }: { r:number }) {
  return (
    <span style={{ display:"flex", alignItems:"center", gap:3 }}>
      <span style={{ color:"#fbbf24", fontSize:11 }}>{"★".repeat(Math.floor(r))}</span>
      <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{r}</span>
    </span>
  );
}

function Btn({ label, onClick, ghost, full }: { label:string; onClick?:()=>void; ghost?:boolean; full?:boolean }) {
  const { ref, go } = useRipple();
  return (
    <div
      ref={ref} className="pressable ripple-wrap"
      onClick={e => { go(e); onClick?.(); }}
      style={{
        borderRadius:14, padding:"12px 18px", textAlign:"center", cursor:"pointer",
        fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13,
        width: full ? "100%" : undefined,
        ...(ghost ? {
          border:"1.5px solid rgba(91,106,240,0.35)",
          color:"#818cf8", background:"transparent",
        } : {
          background:"linear-gradient(135deg,#5b6af0,#818cf8)",
          color:"#fff",
          boxShadow:"0 4px 20px rgba(91,106,240,0.38)",
        }),
      }}
    >{label}</div>
  );
}

/* ── Action tile (Receive / Send style) ── */
function ActionTile({ icon, label, onClick }: { icon:string; label:string; onClick?:()=>void }) {
  return (
    <div
      className="pressable"
      onClick={onClick}
      style={{
        flex:1, borderRadius:16, padding:"14px 0",
        background:"rgba(255,255,255,0.055)",
        border:"1px solid rgba(255,255,255,0.08)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:6, cursor:"pointer",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <span style={{ fontSize:20 }}>{icon}</span>
      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>
        {label}
      </span>
    </div>
  );
}

/* ── Bottom sheet ── */
function Sheet({ open, onClose, children }: { open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute", inset:0, zIndex:50 }}>
      <div className="anim-fade" onClick={onClose}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)" }} />
      <div className="anim-sheet glass-float"
        style={{ position:"absolute", bottom:0, left:0, right:0, borderRadius:"28px 28px 0 0", maxHeight:"80%", overflow:"hidden" }}>
        <div style={{ padding:"12px 0 0", display:"flex", justifyContent:"center" }}>
          <div style={{ width:40, height:4, borderRadius:999, background:"rgba(255,255,255,0.15)" }} />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── FAB ── */
function FAB({ onClick }: { onClick:()=>void }) {
  const { ref, go } = useRipple();
  return (
    <div ref={ref} className="pressable ripple-wrap anim-fab"
      onClick={e => { go(e); onClick(); }}
      style={{
        position:"absolute", bottom:88, right:18,
        width:54, height:54, borderRadius:17, cursor:"pointer", zIndex:20,
        background:"linear-gradient(135deg,#5b6af0,#818cf8)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, color:"#fff",
        boxShadow:"0 8px 28px rgba(91,106,240,0.5)",
      }}>+</div>
  );
}

/* ── Toast ── */
function Toast({ msg, visible }: { msg:string; visible:boolean }) {
  if (!visible) return null;
  return (
    <div className="anim-notif glass-float"
      style={{
        position:"absolute", top:56, left:14, right:14, zIndex:100,
        borderRadius:18, padding:"13px 18px",
        display:"flex", alignItems:"center", gap:10,
      }}>
      <div style={{
        width:28, height:28, borderRadius:10, flexShrink:0,
        background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)",
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"#4ade80", fontSize:14, fontWeight:700,
      }}>✓</div>
      <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, color:"#e8eaf6" }}>{msg}</span>
    </div>
  );
}

/* ────────────────────── HOME ────────────────────── */
function HomeTab({ onOffer }: { onOffer:()=>void }) {
  const [expanded, setExpanded] = useState<number|null>(null);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 90px" }}>
      {/* Greeting */}
      <div className="anim-up" style={{ padding:"26px 20px 0" }}>
        <p style={{ fontSize:12, color:"var(--muted-foreground)", letterSpacing:"0.08em", fontWeight:600 }}>GOOD MORNING</p>
        <h1 className="font-display" style={{ fontSize:30, fontWeight:800, color:"#e8eaf6", margin:"3px 0 0", lineHeight:1.1 }}>Alex M.</h1>
      </div>

      {/* Balance card — reference style */}
      <div className="anim-up d100" style={{ padding:"16px 20px 0" }}>
        <div className="glass-card" style={{ borderRadius:24, padding:"22px 20px", position:"relative", overflow:"hidden" }}>
          {/* Subtle orb */}
          <div style={{
            position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(91,106,240,0.18) 0%,transparent 70%)", pointerEvents:"none",
          }}/>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", letterSpacing:"0.1em", fontWeight:600 }}>BALANCE</p>
          <div style={{ display:"flex", alignItems:"baseline", gap:8, margin:"4px 0 2px" }}>
            <span className="font-display anim-scale d200" style={{ fontSize:42, fontWeight:900, color:"#fff", lineHeight:1 }}>3</span>
            <span className="font-display" style={{ fontSize:18, color:"rgba(255,255,255,0.35)", fontWeight:400 }}>credits</span>
          </div>
          <p style={{ fontSize:12, color:"rgba(74,222,128,0.8)", fontWeight:600, marginBottom:18 }}>
            +2 this week
          </p>

          {/* Trading / Staked row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[{ label:"Earned",col:"#4ade80",val:"+7h"},{label:"Spent",col:"#f87171",val:"−4h"}].map(s=>(
              <div key={s.label} style={{
                borderRadius:14, padding:"12px 14px",
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.07)",
              }}>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.38)", letterSpacing:"0.06em", marginBottom:4 }}>{s.label.toUpperCase()}</p>
                <p className="font-display" style={{ fontSize:20, fontWeight:800, color:s.col }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Action row */}
          <div style={{ display:"flex", gap:10 }}>
            <ActionTile icon="↙" label="Receive" />
            <ActionTile icon="↗" label="Send" onClick={onOffer} />
            <ActionTile icon="⇄" label="Exchange" />
          </div>
        </div>
      </div>

      {/* Help requests */}
      <div className="anim-up d150" style={{ padding:"22px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <h2 className="font-display" style={{ fontSize:17, fontWeight:700, color:"#e8eaf6" }}>Help Requests</h2>
          <span style={{ fontSize:12, color:"#818cf8", fontWeight:600, cursor:"pointer" }}>See all</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {REQUESTS.map((r,i)=>(
            <div key={r.id} className="pressable glass-card"
              style={{
                borderRadius:20, padding:"15px 16px", cursor:"pointer",
                border: expanded===r.id ? "1px solid rgba(91,106,240,0.35)" : "1px solid rgba(255,255,255,0.07)",
                background: expanded===r.id ? "rgba(91,106,240,0.08)" : "rgba(255,255,255,0.04)",
                transition:"all 0.3s var(--spring-smooth)",
                animationName:"cardIn", animationDuration:"0.45s",
                animationTimingFunction:"var(--ease-out-expo)", animationFillMode:"both",
                animationDelay:`${i*55}ms`,
              }}
              onClick={()=>setExpanded(expanded===r.id?null:r.id)}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                    <Pill label={r.tag} col="#818cf8"/>
                    <Pill label={r.urgency} col="#fb923c"/>
                  </div>
                  <p className="font-display" style={{ fontSize:15, fontWeight:700, color:"#e8eaf6" }}>{r.need}</p>
                  <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:3 }}>{r.u} · {r.posted}</p>
                </div>
                <div style={{
                  width:42, height:42, borderRadius:14, flexShrink:0, marginLeft:12,
                  background:"rgba(91,106,240,0.12)", border:"1px solid rgba(91,106,240,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:800, color:"#818cf8",
                }}>{r.hrs}h</div>
              </div>
              {expanded===r.id && (
                <div className="anim-up" style={{ marginTop:14, display:"flex", gap:8 }}>
                  <Btn label="Offer Help" onClick={onOffer}/>
                  <Btn label="Message" ghost/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Near you */}
      <div className="anim-up d200" style={{ padding:"22px 0 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 20px", marginBottom:12 }}>
          <h2 className="font-display" style={{ fontSize:17, fontWeight:700, color:"#e8eaf6" }}>Near You</h2>
          <span style={{ fontSize:12, color:"#818cf8", fontWeight:600, cursor:"pointer" }}>See all</span>
        </div>
        <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 20px 4px" }}>
          {SKILLS.slice(0,5).map((s,i)=>(
            <div key={s.id} className="pressable glass-card"
              style={{
                flexShrink:0, width:146, borderRadius:22, padding:"15px 13px",
                animationName:"cardIn", animationDuration:"0.45s",
                animationTimingFunction:"var(--ease-out-expo)", animationFillMode:"both",
                animationDelay:`${180+i*55}ms`,
              }}
            >
              <Av l={s.av} col={s.col} sz={36}/>
              <p className="font-display" style={{ fontSize:13, fontWeight:700, color:"#e8eaf6", marginTop:9, lineHeight:1.3 }}>{s.skill}</p>
              <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:2 }}>{s.u}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                <Stars r={s.rt}/>
                <div style={{
                  borderRadius:8, padding:"3px 8px",
                  background:`${s.col}18`, border:`1px solid ${s.col}35`,
                  fontSize:11, fontWeight:800, color:s.col,
                }}>{s.cr}h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── EXPLORE ────────────────────── */
function ExploreTab() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const tags = ["All","Tech","Music","Cooking","Language","Art","Repair"];
  const list = SKILLS.filter(s =>
    (f==="All"||s.tag===f) &&
    (s.skill.toLowerCase().includes(q.toLowerCase())||s.u.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 90px" }}>
      <div className="anim-up" style={{ padding:"26px 20px 0" }}>
        <h1 className="font-display" style={{ fontSize:28, fontWeight:800, color:"#e8eaf6" }}>Explore</h1>
        <p style={{ fontSize:13, color:"var(--muted-foreground)", marginTop:2 }}>Browse community skills</p>
        <div style={{ position:"relative", marginTop:14 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search skills or people..."
            style={{
              width:"100%", padding:"13px 16px 13px 44px",
              background:"rgba(255,255,255,0.055)", border:"1.5px solid rgba(255,255,255,0.08)",
              borderRadius:16, outline:"none", fontFamily:"'Inter',sans-serif",
              fontSize:13, color:"#e8eaf6", transition:"border-color 0.2s",
            }}
            onFocus={e=>(e.target.style.borderColor="rgba(91,106,240,0.5)")}
            onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.08)")}
          />
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0.4, fontSize:17 }}>🔍</span>
        </div>
      </div>

      {/* Filter row */}
      <div className="anim-fade d100" style={{ display:"flex", gap:8, overflowX:"auto", padding:"12px 20px 0" }}>
        {tags.map(t=>(
          <button key={t} className="pressable" onClick={()=>setF(t)} style={{
            flexShrink:0, borderRadius:999, padding:"8px 15px",
            background: f===t ? "linear-gradient(135deg,#5b6af0,#818cf8)" : "rgba(255,255,255,0.055)",
            border: f===t ? "none" : "1px solid rgba(255,255,255,0.07)",
            color: f===t ? "#fff" : "rgba(255,255,255,0.45)",
            fontSize:12, fontWeight:600, cursor:"pointer",
            boxShadow: f===t ? "0 4px 14px rgba(91,106,240,0.35)" : "none",
            transition:"all 0.25s var(--spring-bounce)",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"14px 20px 0", display:"flex", flexDirection:"column", gap:9 }}>
        {list.map((s,i)=>(
          <div key={s.id} className="pressable glass-card"
            style={{
              borderRadius:20, padding:"15px 16px",
              display:"flex", alignItems:"center", gap:13,
              animationName:"cardIn", animationDuration:"0.4s",
              animationTimingFunction:"var(--ease-out-expo)", animationFillMode:"both",
              animationDelay:`${i*50}ms`,
              transition:"border-color 0.2s",
            }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(91,106,240,0.25)")}
            onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)")}
          >
            <Av l={s.av} col={s.col} sz={44}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p className="font-display" style={{ fontSize:15, fontWeight:700, color:"#e8eaf6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.skill}</p>
              <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:2 }}>{s.u} · {s.dist}</p>
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <Pill label={s.tag} col={s.col}/>
                <Pill label={s.avail}/>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{
                borderRadius:10, padding:"5px 11px", marginBottom:5,
                background:`${s.col}18`, border:`1px solid ${s.col}35`,
                fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:800, color:s.col,
              }}>{s.cr}h</div>
              <Stars r={s.rt}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── WALLET ────────────────────── */
function WalletTab() {
  const [bal, setBal] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setBal(3),350); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 90px" }}>
      <div className="anim-up" style={{ padding:"26px 20px 16px" }}>
        <p style={{ fontSize:12, color:"var(--muted-foreground)", letterSpacing:"0.08em", fontWeight:600 }}>YOUR</p>
        <h1 className="font-display" style={{ fontSize:28, fontWeight:800, color:"#e8eaf6", marginTop:2 }}>Wallet</h1>
      </div>

      <div className="anim-scale d100" style={{ padding:"0 20px 20px" }}>
        <div className="glass-float" style={{ borderRadius:26, padding:"26px 22px", position:"relative", overflow:"hidden" }}>
          <div style={{
            position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(91,106,240,0.22) 0%,transparent 70%)", pointerEvents:"none",
          }}/>
          <div style={{
            position:"absolute", bottom:-40, left:30, width:140, height:140, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(74,222,128,0.12) 0%,transparent 70%)", pointerEvents:"none",
          }}/>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", letterSpacing:"0.12em", fontWeight:600 }}>CURRENT BALANCE</p>
          <div style={{ display:"flex", alignItems:"baseline", gap:10, margin:"6px 0 4px" }}>
            <span className="font-display" style={{
              fontSize:64, fontWeight:900, lineHeight:1, color:"#fff",
              transition:"all 1.4s var(--ease-out-expo)",
            }}>{bal}</span>
            <span className="font-display" style={{ fontSize:20, color:"rgba(255,255,255,0.32)", fontWeight:400 }}>credits</span>
          </div>
          <div style={{ marginBottom:22 }}>
            <div className="pbar"><div className="pfill" style={{ width:`${(bal/10)*100}%` }}/></div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:5 }}>3 of 10 monthly goal</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn label="Transfer" full/>
            <Btn label="Request" ghost full/>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="anim-up d150" style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[{v:"+7h",l:"Earned",c:"#4ade80"},{v:"−4h",l:"Spent",c:"#f87171"},{v:"12",l:"Sessions",c:"#818cf8"}].map(s=>(
            <div key={s.l} className="glass-card" style={{ borderRadius:18, padding:"14px 0", textAlign:"center" }}>
              <p className="font-display" style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</p>
              <p style={{ fontSize:10, color:"var(--muted-foreground)", letterSpacing:"0.05em", marginTop:2 }}>{s.l.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assets list — reference pattern */}
      <div className="anim-up d200" style={{ padding:"0 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <h2 className="font-display" style={{ fontSize:17, fontWeight:700, color:"#e8eaf6" }}>Transactions</h2>
          <span style={{ fontSize:12, color:"#818cf8", fontWeight:600, cursor:"pointer" }}>See all</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {TXS.map((t,i)=>(
            <div key={t.id} className="glass-card"
              style={{
                borderRadius:18, padding:"13px 16px",
                display:"flex", alignItems:"center", gap:14,
                animationName:"cardIn", animationDuration:"0.4s",
                animationTimingFunction:"var(--ease-out-expo)", animationFillMode:"both",
                animationDelay:`${180+i*45}ms`,
              }}
            >
              <div style={{
                width:40, height:40, borderRadius:14, flexShrink:0,
                background: t.type==="earn" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                border:`1px solid ${t.type==="earn" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:17, color: t.type==="earn" ? "#4ade80" : "#f87171",
              }}>{t.type==="earn"?"↑":"↓"}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:"#e8eaf6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.desc}</p>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                  <p style={{ fontSize:11, color:"var(--muted-foreground)" }}>{t.date}</p>
                  {t.st==="pending" && <Pill label="Pending" col="#fb923c"/>}
                </div>
              </div>
              <p className="font-display" style={{ fontSize:17, fontWeight:800, flexShrink:0, color: t.type==="earn"?"#4ade80":"#f87171" }}>
                {t.cr>0?`+${t.cr}`:t.cr}h
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── CHAT ────────────────────── */
function ChatTab() {
  const [open, setOpen] = useState<typeof MSGS[0]|null>(null);
  const [inp, setInp] = useState("");

  if (open) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div className="glass anim-fade"
        style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <button className="pressable" onClick={()=>setOpen(null)}
          style={{ fontSize:20, color:"#818cf8", background:"none", border:"none", cursor:"pointer", padding:4 }}>←</button>
        <Av l={open.av} col={open.col} sz={36}/>
        <div>
          <p className="font-display" style={{ fontSize:15, fontWeight:700, color:"#e8eaf6" }}>{open.u}</p>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }}/>
            <p style={{ fontSize:11, color:"#4ade80" }}>Online</p>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"18px 16px", display:"flex", flexDirection:"column", gap:11 }}>
        {CHAT_LOG.map((m,i)=>(
          <div key={i} className="anim-up"
            style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", animationDelay:`${i*70}ms` }}>
            <div style={{
              maxWidth:"75%", padding:"11px 15px", borderRadius:18,
              borderBottomRightRadius:m.from==="me"?4:18,
              borderBottomLeftRadius:m.from==="them"?4:18,
              background: m.from==="me"
                ? "linear-gradient(135deg,#5b6af0,#818cf8)"
                : "rgba(255,255,255,0.07)",
              border: m.from==="them" ? "1px solid rgba(255,255,255,0.08)" : "none",
              boxShadow: m.from==="me" ? "0 4px 16px rgba(91,106,240,0.3)" : "none",
            }}>
              <p style={{ fontSize:13, color:"#e8eaf6", lineHeight:1.5 }}>{m.text}</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:3, textAlign:"right" }}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:"10px 16px 18px", display:"flex", gap:10, alignItems:"center" }}>
        <input value={inp} onChange={e=>setInp(e.target.value)} placeholder="Type a message..."
          style={{
            flex:1, padding:"12px 16px",
            background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.09)",
            borderRadius:18, outline:"none",
            fontFamily:"'Inter',sans-serif", fontSize:13, color:"#e8eaf6",
          }}/>
        <div className="pressable" onClick={()=>setInp("")}
          style={{
            width:46, height:46, borderRadius:15, flexShrink:0,
            background:"linear-gradient(135deg,#5b6af0,#818cf8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(91,106,240,0.4)",
          }}>↑</div>
      </div>
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 90px" }}>
      <div className="anim-up" style={{ padding:"26px 20px 16px" }}>
        <h1 className="font-display" style={{ fontSize:28, fontWeight:800, color:"#e8eaf6" }}>Messages</h1>
        <p style={{ fontSize:13, color:"var(--muted-foreground)", marginTop:2 }}>
          {MSGS.filter(m=>m.unread>0).length} unread
        </p>
      </div>
      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:3 }}>
        {MSGS.map((m,i)=>(
          <div key={m.id} className="pressable"
            onClick={()=>setOpen(m)}
            style={{
              display:"flex", alignItems:"center", gap:13,
              padding:"14px 14px", borderRadius:20, cursor:"pointer",
              background: m.unread>0 ? "rgba(91,106,240,0.06)" : "transparent",
              border: m.unread>0 ? "1px solid rgba(91,106,240,0.12)" : "1px solid transparent",
              transition:"background 0.2s",
              animationName:"cardIn", animationDuration:"0.4s",
              animationTimingFunction:"var(--ease-out-expo)", animationFillMode:"both",
              animationDelay:`${i*55}ms`,
            }}
          >
            <div style={{ position:"relative" }}>
              <Av l={m.av} col={m.col} sz={46}/>
              {m.unread>0 && (
                <div style={{
                  position:"absolute", top:-2, right:-2,
                  width:18, height:18, borderRadius:"50%",
                  background:"linear-gradient(135deg,#5b6af0,#818cf8)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:700, color:"#fff",
                  border:"2px solid #191b2a",
                }}>{m.unread}</div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p className="font-display" style={{ fontSize:15, fontWeight:700, color:"#e8eaf6" }}>{m.u}</p>
              <p style={{ fontSize:12, color:"var(--muted-foreground)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.pre}</p>
            </div>
            <p style={{ fontSize:11, color:"var(--muted-foreground)", flexShrink:0 }}>{m.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── PROFILE ────────────────────── */
function ProfileTab() {
  const badges = [
    { ic:"⭐", l:"Top Helper",  c:"#fbbf24" },
    { ic:"✓",  l:"Verified",    c:"#4ade80" },
    { ic:"🎯", l:"Reliable",    c:"#818cf8" },
    { ic:"🌟", l:"Multi-Skill", c:"#fb923c" },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0 0 90px" }}>
      {/* Hero */}
      <div className="anim-fade"
        style={{ padding:"32px 20px 22px", textAlign:"center",
          background:"linear-gradient(180deg,rgba(91,106,240,0.1) 0%,transparent 100%)" }}>
        <div style={{ position:"relative", display:"inline-block" }}>
          <div style={{
            width:76, height:76, borderRadius:"50%", margin:"0 auto",
            background:"linear-gradient(135deg,#5b6af0,#818cf8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Outfit',sans-serif", fontSize:32, fontWeight:800, color:"#fff",
            boxShadow:"0 8px 28px rgba(91,106,240,0.45)",
          }}>A</div>
          <div style={{
            position:"absolute", inset:-8, borderRadius:"50%",
            border:"1px solid rgba(91,106,240,0.3)",
            animation:"pulseRing 2.2s ease-out infinite",
          }}/>
        </div>
        <h1 className="font-display" style={{ fontSize:24, fontWeight:800, color:"#e8eaf6", marginTop:12 }}>Alex M.</h1>
        <p style={{ fontSize:13, color:"var(--muted-foreground)", marginTop:4 }}>Software Engineer · London</p>
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginTop:7 }}>
          <span style={{ color:"#fbbf24", fontSize:13 }}>★★★★★</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>4.8 · 12 reviews</span>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:10 }}>
          <Pill label="Active Member" col="#4ade80"/>
          <Pill label="Since Aug 2024"/>
        </div>
      </div>

      {/* Stats */}
      <div className="anim-up d100" style={{ padding:"0 20px 18px" }}>
        <div className="glass-card" style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          borderRadius:22, overflow:"hidden",
        }}>
          {[{v:"3",l:"Credits",c:"#818cf8"},{v:"12",l:"Sessions",c:"#4ade80"},{v:"4.8",l:"Rating",c:"#fbbf24"}].map((s,i)=>(
            <div key={s.l} style={{
              padding:"18px 0", textAlign:"center",
              borderRight: i<2 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}>
              <p className="font-display" style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</p>
              <p style={{ fontSize:10, color:"var(--muted-foreground)", letterSpacing:"0.05em", marginTop:2 }}>{s.l.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="anim-up d150" style={{ padding:"0 20px 18px" }}>
        <p className="font-display" style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:10, letterSpacing:"0.06em" }}>SKILLS OFFERED</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {["Python","JavaScript","Code Review","Interview Prep"].map(s=>(
            <div key={s} className="pressable"
              style={{ borderRadius:13, padding:"9px 15px",
                background:"rgba(91,106,240,0.1)", border:"1px solid rgba(91,106,240,0.25)",
                fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, color:"#818cf8" }}>
              {s}
            </div>
          ))}
          <div style={{ borderRadius:13, padding:"9px 15px",
            border:"1.5px dashed rgba(255,255,255,0.13)",
            fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.25)", cursor:"pointer" }}>+ Add</div>
        </div>
      </div>

      {/* Badges */}
      <div className="anim-up d200" style={{ padding:"0 20px 18px" }}>
        <p className="font-display" style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:10, letterSpacing:"0.06em" }}>BADGES</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
          {badges.map((b,i)=>(
            <div key={b.l} className="glass-card"
              style={{ borderRadius:18, padding:"14px 14px",
                display:"flex", alignItems:"center", gap:10,
                animationName:"cardIn", animationDuration:"0.4s",
                animationTimingFunction:"var(--spring-bounce)", animationFillMode:"both",
                animationDelay:`${260+i*55}ms`,
              }}>
              <div style={{ width:36, height:36, borderRadius:12, flexShrink:0,
                background:`${b.c}14`, border:`1px solid ${b.c}2e`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
              }}>{b.ic}</div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"#e8eaf6" }}>{b.l}</p>
                <p style={{ fontSize:10, color:`${b.c}aa`, marginTop:2 }}>Earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="anim-up d300" style={{ padding:"0 20px" }}>
        <p className="font-display" style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:10, letterSpacing:"0.06em" }}>REVIEWS</p>
        {[
          { from:"Priya S.", col:"#818cf8", text:"Alex was super prepared and asked sharp questions. Highly recommend!" },
          { from:"Fatima H.",col:"#f87171", text:"Very thorough CV feedback. Helped me land an interview next week." },
        ].map(r=>(
          <div key={r.from} className="glass-card"
            style={{ borderRadius:20, padding:"15px 16px", marginBottom:9 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Av l={r.from[0]} col={r.col} sz={28}/>
                <p style={{ fontSize:13, fontWeight:700, color:"#e8eaf6" }}>{r.from}</p>
              </div>
              <span style={{ color:"#fbbf24", fontSize:12 }}>★★★★★</span>
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.48)", lineHeight:1.55 }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── BOTTOM NAV ────────────────────── */
const NAV_ITEMS: { id:Tab; icon:string; label:string }[] = [
  { id:"home",    icon:"⊙", label:"Overview" },
  { id:"explore", icon:"◎", label:"Explore"  },
  { id:"wallet",  icon:"◈", label:"Wallet"   },
  { id:"chat",    icon:"◻", label:"Chat"     },
  { id:"profile", icon:"◉", label:"Profile"  },
];

function BottomNav({ active, onChange }: { active:Tab; onChange:(t:Tab)=>void }) {
  return (
    <div className="glass"
      style={{
        position:"absolute", bottom:0, left:0, right:0,
        display:"flex", alignItems:"center",
        borderTop:"1px solid rgba(255,255,255,0.07)",
        paddingTop:6, paddingBottom:4, zIndex:30,
      }}>
      {NAV_ITEMS.map(it=>{
        const on = active===it.id;
        return (
          <button key={it.id} className="pressable" onClick={()=>onChange(it.id)}
            style={{
              flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:3, padding:"6px 0",
              background:"none", border:"none", cursor:"pointer",
              position:"relative",
            }}>
            {on && (
              <div style={{
                position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
                width:28, height:3, borderRadius:"0 0 4px 4px",
                background:"linear-gradient(90deg,#5b6af0,#818cf8)",
                boxShadow:"0 2px 8px rgba(91,106,240,0.6)",
              }}/>
            )}
            <span style={{
              fontSize:19, lineHeight:1,
              transition:"all 0.3s var(--spring-bounce)",
              transform: on ? "scale(1.18)" : "scale(1)",
              color: on ? "#818cf8" : "rgba(255,255,255,0.28)",
              filter: on ? "drop-shadow(0 0 5px rgba(91,106,240,0.7))" : "none",
            }}>{it.icon}</span>
            <span style={{ fontSize:9, letterSpacing:"0.04em", fontWeight:600,
              color: on ? "#818cf8" : "rgba(255,255,255,0.28)",
              transition:"color 0.25s",
            }}>{it.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────── ANDROID FRAME ────────────────────── */
function AndroidFrame({ children }: { children:React.ReactNode }) {
  return (
    <div style={{
      position:"relative",
      width:375, height:812, borderRadius:52,
      /* Warm metallic frame — matches reference copper/bronze tone */
      background:"linear-gradient(160deg,#3a2e1e 0%,#5c4a2a 30%,#2e2010 60%,#4a3820 100%)",
      boxShadow:`
        0 0 0 1.5px #6b5535,
        0 0 0 3px #231a0c,
        0 0 0 5px #5c4a2a,
        0 50px 140px rgba(0,0,0,0.85),
        0 0 100px rgba(91,106,240,0.08),
        inset 0 1px 0 rgba(255,200,100,0.15)
      `,
      overflow:"hidden", flexShrink:0,
    }}>
      {/* Screen inset */}
      <div style={{
        position:"absolute", inset:6, borderRadius:48,
        background:"#191b2a", overflow:"hidden",
      }}>
        {children}
      </div>

      {/* Side buttons */}
      <div style={{ position:"absolute", left:-3, top:155, width:3, height:38, borderRadius:"3px 0 0 3px", background:"#4a3820" }}/>
      <div style={{ position:"absolute", left:-3, top:208, width:3, height:38, borderRadius:"3px 0 0 3px", background:"#4a3820" }}/>
      <div style={{ position:"absolute", right:-3, top:185, width:3, height:58, borderRadius:"0 3px 3px 0", background:"#4a3820" }}/>
    </div>
  );
}

/* ────────────────────── ROOT ────────────────────── */
export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [prevTab, setPrevTab] = useState<Tab>("home");
  const [animKey, setAnimKey] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState({ v:false, msg:"" });

  const changeTab = (t:Tab) => {
    if (t===tab) return;
    setPrevTab(tab); setTab(t); setAnimKey(k=>k+1);
  };
  const showToast = (msg:string) => {
    setToast({v:true,msg});
    setTimeout(()=>setToast({v:false,msg:""}),2600);
  };

  return (
    /* Canvas — dark charcoal matching reference presentation */
    <div style={{
      width:"100%", height:"100%",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse at 40% 50%, #1a1c2e 0%, #10111c 50%, #0c0d16 100%)",
      overflow:"hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position:"absolute", width:600, height:600, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle,rgba(91,106,240,0.04) 0%,transparent 70%)",
      }}/>

      <AndroidFrame>
        {/* Status bar */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:44, zIndex:40,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 22px",
          background:"linear-gradient(180deg,rgba(25,27,42,0.98) 60%,transparent 100%)",
        }}>
          <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)", fontFamily:"'Outfit',sans-serif" }}>9:41</span>
          {/* Punch-hole */}
          <div style={{
            position:"absolute", left:"50%", transform:"translateX(-50%)",
            top:8, width:110, height:28, borderRadius:18,
            background:"#0c0d16",
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#14151f" }}/>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#111220",
              border:"1.5px solid rgba(255,255,255,0.04)" }}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>●●●</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>▲</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>▌▌</span>
          </div>
        </div>

        {/* Screen */}
        <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
          <div key={animKey} className="anim-up"
            style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", marginTop:44 }}>
            {tab==="home"    && <HomeTab    onOffer={()=>setSheetOpen(true)}/>}
            {tab==="explore" && <ExploreTab/>}
            {tab==="wallet"  && <WalletTab/>}
            {tab==="chat"    && <ChatTab/>}
            {tab==="profile" && <ProfileTab/>}
          </div>
          <BottomNav active={tab} onChange={changeTab}/>
        </div>

        {/* FAB */}
        {(tab==="home"||tab==="explore") && <FAB onClick={()=>setSheetOpen(true)}/>}

        {/* Toast */}
        <Toast msg={toast.msg} visible={toast.v}/>

        {/* Sheet */}
        <Sheet open={sheetOpen} onClose={()=>setSheetOpen(false)}>
          <div style={{ padding:"22px 22px 30px" }}>
            <h2 className="font-display" style={{ fontSize:21, fontWeight:800, color:"#e8eaf6", marginBottom:6 }}>Offer Your Help</h2>
            <p style={{ fontSize:13, color:"var(--muted-foreground)", marginBottom:18 }}>Choose a skill and propose a session</p>
            <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:18 }}>
              {["Python Mentoring","Code Review","Interview Prep"].map(s=>(
                <div key={s} className="pressable glass-card"
                  style={{ borderRadius:16, padding:"14px 16px",
                    display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                  <span className="font-display" style={{ fontSize:15, fontWeight:600, color:"#e8eaf6" }}>{s}</span>
                  <Pill label="1h" col="#818cf8"/>
                </div>
              ))}
            </div>
            <Btn label="Send Offer →" onClick={()=>{ setSheetOpen(false); showToast("Help offer sent!"); }} full/>
          </div>
        </Sheet>

        {/* Home bar */}
        <div style={{
          position:"absolute", bottom:6, left:"50%", transform:"translateX(-50%)",
          width:130, height:5, borderRadius:999,
          background:"rgba(255,255,255,0.22)", zIndex:50,
        }}/>
      </AndroidFrame>
    </div>
  );
}
