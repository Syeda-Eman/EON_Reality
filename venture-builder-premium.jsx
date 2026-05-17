import { useState, useEffect, useRef, useCallback } from "react";
import {
  Rocket, Sparkles, MessageCircle, Send, Zap, Users, Target,
  Shield, GitBranch, Globe, HardHat, GraduationCap, Bot, Check,
  ArrowRight, Layers, Code2, Cloud, Radio, CircleDot, Loader2,
  Upload, HeartPulse, ShoppingCart, Landmark, Factory,
  Leaf, Truck, FileText, CheckCircle2, Play,
  Star, DollarSign, Eye, ExternalLink, Settings, RefreshCw, Cpu,
  Database, MonitorSmartphone, Lightbulb, Store
} from "lucide-react";

const STEPS = [
  { id: "input", label: "Input" },
  { id: "guidance", label: "Guidance" },
  { id: "spec", label: "Spec" },
  { id: "build", label: "Build" },
  { id: "deploy", label: "Deploy" },
  { id: "publish", label: "Publish" },
];

const INDUSTRIES = [
  { label: "Mining & Safety", icon: HardHat },
  { label: "Healthcare", icon: HeartPulse },
  { label: "Retail", icon: ShoppingCart },
  { label: "Government", icon: Landmark },
  { label: "Manufacturing", icon: Factory },
  { label: "Agriculture", icon: Leaf },
  { label: "Logistics", icon: Truck },
  { label: "Education", icon: GraduationCap },
];

const AI_FLOW = [
  { q: "Great starting point! **Who are the primary users** of this app — field workers, office managers, or a mix?", sug: ["Field workers on-site", "Office managers & supervisors", "Mix of field and office"], key: "users" },
  { q: "What's the **single biggest pain point** they face today?", sug: ["Everything is paper-based & slow", "No real-time visibility for managers", "Compliance tracking is a nightmare"], key: "goals" },
  { q: "When this app is live, **what does success look like**?", sug: ["Instant digital reporting", "Real-time dashboards & alerts", "Automated compliance documentation"], key: null },
  { q: "Any **constraints** I should know about? Connectivity, devices, regulations?", sug: ["Must work offline in remote areas", "Needs to run on ruggedized tablets", "Requires full audit trail for regulators"], key: "constraints" },
  { q: "Walk me through the **ideal workflow** — from opening the app to task complete.", sug: ["Open → Fill form → Submit → Manager reviews", "Scan QR → Log data → Auto-alert if critical", "Dashboard → Drill down → Export report"], key: "workflow" },
];

const C = {
  bg0: "#080c14", bg1: "#0b0f19", bg2: "#0d1117", bg3: "#111827",
  bg4: "#1a2332", bg5: "#1f2b3d",
  cyan: "#00f2fe", cyanDim: "#00b4d8", teal: "#4facfe",
  green: "#34d399", purple: "#a78bfa", amber: "#fbbf24",
  t0: "#f0f4fc", t1: "#c0ccdd", t2: "#7b8ba5", t3: "#4a5568",
  b0: "rgba(0,242,254,0.06)", b1: "rgba(0,242,254,0.12)", b2: "rgba(0,242,254,0.25)",
  gradCyan: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
  gradGreen: "linear-gradient(135deg, #34d399 0%, #06b6d4 100%)",
};

const globalCSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideL{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 16px rgba(0,242,254,.15)}50%{box-shadow:0 0 32px rgba(0,242,254,.3)}}
@keyframes dots{0%,60%,100%{opacity:.25;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes checkPop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
*{margin:0;padding:0;box-sizing:border-box}
body,#root{font-family:'DM Sans',system-ui,sans-serif;background:${C.bg0};color:${C.t0};min-height:100vh}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,242,254,.12);border-radius:10px}
`;

function Btn({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: C.gradCyan, color: C.bg0, fontWeight: 600,
      border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
      display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: "'DM Sans',sans-serif",
      transition: "transform .2s, box-shadow .2s",
      ...style,
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,242,254,.3)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >{children}</button>
  );
}

function Chip({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      background: C.bg4, border: `1px solid ${C.b0}`, borderRadius: 100,
      padding: "9px 18px", fontSize: 12.5, color: C.t2, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 7,
      fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
      transition: "all .25s", ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.b0; e.currentTarget.style.color = C.t2; }}
    >{children}</button>
  );
}

function Mono({ children, style }) {
  return <span style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", ...style }}>{children}</span>;
}

/* ── STEPPER ─────────────────────────────────────── */
function Stepper({ current }) {
  const ci = STEPS.findIndex(s => s.id === current);
  return (
    <div style={{ padding: "18px 40px 14px", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: 24, left: 72, right: 72, height: 2, background: C.bg5, borderRadius: 1 }}>
        <div style={{ height: "100%", borderRadius: 1, background: C.gradCyan, width: `${(ci / (STEPS.length - 1)) * 100}%`, transition: "width .6s ease-out" }} />
      </div>
      {STEPS.map((s, i) => {
        const done = i < ci, active = i === ci;
        return (
          <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: done || active ? C.cyan : C.bg5,
              border: active ? "3px solid rgba(0,242,254,.3)" : "none",
              boxShadow: active ? "0 0 12px rgba(0,242,254,.4)" : "none",
              transition: "all .4s",
            }} />
            <Mono style={{ fontSize: 10, marginTop: 8, letterSpacing: ".04em", color: active ? C.t0 : done ? C.cyan : C.t3, fontWeight: active ? 700 : 500, textTransform: "uppercase" }}>{s.label}</Mono>
          </div>
        );
      })}
    </div>
  );
}

/* ── PHASE 1: INPUT ──────────────────────────────── */
function InputPhase({ onSubmit }) {
  const [text, setText] = useState("");
  const [selInd, setSelInd] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeUp .55s ease-out both" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,242,254,.05)", border: "1px solid rgba(0,242,254,.1)", borderRadius: 100, padding: "5px 14px", marginBottom: 20, animation: "float 4s ease-in-out infinite" }}>
        <Lightbulb size={13} color={C.cyan} />
        <Mono style={{ fontSize: 10, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase" }}>Think → Guide → Build → Publish</Mono>
      </div>

      <h1 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 700, textAlign: "center", lineHeight: 1.1, marginBottom: 8, background: `linear-gradient(135deg, ${C.t0} 30%, ${C.cyan} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Venture Builder Premium
      </h1>
      <p style={{ fontSize: 15, color: C.t2, textAlign: "center", maxWidth: 540, lineHeight: 1.6, marginBottom: 32 }}>
        A guided no-code product flow for users who are not developers. Start from an idea, a business problem, or a document.
      </p>

      <div style={{ display: "flex", gap: 16, width: "100%", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ borderRadius: 14, background: C.bg3, border: `1px solid ${C.b1}`, padding: 2 }}>
            <textarea value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && text.trim()) { e.preventDefault(); onSubmit(text.trim()); } }}
              placeholder="Describe your idea, problem, or vision in plain language..."
              rows={7}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: C.t0, fontSize: 14.5, lineHeight: 1.7, padding: "18px 20px", resize: "none", fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.t3, alignSelf: "center" }}>Examples:</span>
            <Chip onClick={() => setText("Mining safety reporting app")}><HardHat size={13} /> Mining safety reporting app</Chip>
            <Chip onClick={() => setText("Learning tool from this SOP")}><GraduationCap size={13} /> Learning tool from this SOP</Chip>
          </div>
        </div>

        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div onClick={() => setUploaded(uploaded ? null : "SOP_Document.pdf")}
            style={{ border: `2px dashed ${uploaded ? C.green : C.b1}`, borderRadius: 14, padding: "24px 20px", textAlign: "center", cursor: "pointer", background: uploaded ? "rgba(52,211,153,.1)" : C.bg3, transition: "all .25s", minHeight: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {uploaded ? (
              <><FileText size={22} color={C.green} /><span style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>{uploaded}</span><span style={{ fontSize: 11, color: C.t3 }}>Click to remove</span></>
            ) : (
              <><Upload size={22} color={C.t3} /><span style={{ fontSize: 13, color: C.t2 }}>Upload a document, SOP, or brief</span><span style={{ fontSize: 11, color: C.t3 }}>or click to simulate</span></>
            )}
          </div>

          <div style={{ background: C.bg3, borderRadius: 14, border: `1px solid ${C.b0}`, padding: 14 }}>
            <Mono style={{ fontSize: 10, color: C.t3, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Industry context</Mono>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {INDUSTRIES.map(ind => {
                const Icon = ind.icon;
                const sel = selInd === ind.label;
                return (
                  <button key={ind.label} onClick={() => setSelInd(sel ? null : ind.label)} style={{
                    background: sel ? "rgba(0,242,254,.08)" : C.bg4,
                    border: `1px solid ${sel ? C.b2 : C.b0}`,
                    borderRadius: 10, padding: "10px 4px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all .2s",
                  }}>
                    <Icon size={16} color={sel ? C.cyan : C.t3} />
                    <span style={{ fontSize: 9.5, color: sel ? C.cyan : C.t3, lineHeight: 1.2, textAlign: "center" }}>{ind.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Btn onClick={() => onSubmit(text.trim())} disabled={!text.trim()} style={{ marginTop: 24, padding: "14px 36px", fontSize: 15 }}>
        Begin Guided Creation <ArrowRight size={16} />
      </Btn>

      <p style={{ marginTop: 24, fontSize: 13, color: C.t3, textAlign: "center", maxWidth: 600 }}>
        Venture Builder helps non-technical users go from <span style={{ color: C.cyan }}>idea</span> → <span style={{ color: C.cyan }}>guided app creation</span> → <span style={{ color: C.cyan }}>published Marketplace app</span>.
      </p>
    </div>
  );
}

/* ── PHASE 2: GUIDANCE ───────────────────────────── */
function GuidancePhase({ intent, onComplete }) {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [qi, setQi] = useState(0);
  const [spec, setSpec] = useState({ users: "", goals: "", constraints: "", workflow: "" });
  const [done, setDone] = useState(false);
  const endRef = useRef(null);

  const scroll = useCallback(() => { setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" }); }, 80); }, []);

  useEffect(() => {
    setTyping(true);
    const t1 = setTimeout(() => {
      setMsgs([{ t: `I see you want to build: **"${intent}"** — exciting! Let me ask a few questions to shape a complete spec.`, u: false }]);
      setTyping(false);
      const t2 = setTimeout(() => {
        setTyping(true);
        const t3 = setTimeout(() => {
          setMsgs(p => [...p, { t: AI_FLOW[0].q, u: false }]);
          setTyping(false);
          scroll();
        }, 1100);
        return () => clearTimeout(t3);
      }, 500);
      return () => clearTimeout(t2);
    }, 1300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(scroll, [msgs, typing]);

  const send = (text) => {
    if (!text.trim() || typing) return;
    setMsgs(p => [...p, { t: text.trim(), u: true }]);
    setInp("");
    const cur = AI_FLOW[qi];
    if (cur && cur.key) setSpec(p => ({ ...p, [cur.key]: text.trim() }));
    const next = qi + 1;
    setTyping(true);
    setTimeout(() => {
      if (next < AI_FLOW.length) {
        const a = ["Great insight!", "Perfect.", "Understood!", "That helps!", "Noted!"][next % 5];
        setMsgs(p => [...p, { t: `${a} ${AI_FLOW[next].q}`, u: false }]);
        setQi(next);
      } else {
        setMsgs(p => [...p, { t: "All captured! Your **product specification** is ready. Hit the button on the left panel to continue.", u: false }]);
        setDone(true);
      }
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  const filled = Object.values(spec).filter(Boolean).length;
  const sugs = qi < AI_FLOW.length ? AI_FLOW[qi].sug : [];
  const showSugs = !typing && msgs.length >= 2 && qi < AI_FLOW.length;

  const renderMsg = (text) => text.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.cyan}">$1</strong>`);

  const specItems = [
    { label: "Users", icon: Users, val: spec.users },
    { label: "Goals", icon: Target, val: spec.goals },
    { label: "Constraints", icon: Shield, val: spec.constraints },
    { label: "Workflow", icon: GitBranch, val: spec.workflow },
  ];

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* LEFT */}
      <div style={{ width: 320, minWidth: 260, flexShrink: 0, padding: "20px 18px", borderRight: `1px solid ${C.b0}`, overflowY: "auto", background: C.bg2, animation: "slideL .5s ease-out both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Radio size={12} color={C.cyan} />
          <Mono style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: C.cyan, fontWeight: 700 }}>Live Discovery</Mono>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, color: C.green }}>Product Definition</h3>
        <p style={{ fontSize: 12, color: C.t3, marginBottom: 16, lineHeight: 1.4 }}>Variables populate as you answer questions.</p>

        <div style={{ background: "rgba(0,242,254,.04)", border: `1px solid ${C.b1}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <Mono style={{ fontSize: 9.5, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600 }}>Product Intent</Mono>
          <p style={{ fontSize: 13, color: C.t0, marginTop: 5, lineHeight: 1.5, fontWeight: 500 }}>{intent}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {specItems.map(si => {
            const Icon = si.icon;
            const disc = !!si.val;
            return (
              <div key={si.label} style={{ background: disc ? "rgba(0,242,254,.04)" : C.bg2, border: `1px solid ${disc ? "rgba(0,242,254,.18)" : C.b0}`, borderRadius: 12, padding: "12px 14px", transition: "all .4s", animation: disc ? "fadeUp .5s ease-out" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: disc ? "rgba(0,242,254,.1)" : C.bg4 }}>
                    <Icon size={14} color={disc ? C.cyan : C.t3} />
                  </div>
                  <Mono style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: disc ? C.cyan : C.t3, fontWeight: 600 }}>{si.label}</Mono>
                  {disc && <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: 6, background: C.gradCyan, display: "flex", alignItems: "center", justifyContent: "center", animation: "checkPop .3s ease-out" }}><Check size={11} color={C.bg0} strokeWidth={3} /></div>}
                </div>
                <p style={{ fontSize: 12.5, color: disc ? C.t1 : C.t3, lineHeight: 1.5, fontStyle: disc ? "normal" : "italic", minHeight: 18 }}>{si.val || "Awaiting discovery..."}</p>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>Spec Progress</span>
            <Mono style={{ fontSize: 11, color: C.cyan }}>{filled}/4</Mono>
          </div>
          <div style={{ height: 3, borderRadius: 3, background: C.bg4, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, background: C.gradCyan, width: `${(filled / 4) * 100}%`, transition: "width .6s" }} />
          </div>
        </div>

        {done && <Btn onClick={onComplete} style={{ marginTop: 20, width: "100%", justifyContent: "center" }}>Generate Spec <ArrowRight size={15} /></Btn>}
      </div>

      {/* RIGHT Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, animation: "slideR .5s ease-out both" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.b0}`, display: "flex", alignItems: "center", gap: 10, background: C.bg2 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.gradCyan, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 3s ease-in-out infinite" }}>
            <Sparkles size={16} color={C.bg0} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Venture AI Guide</div>
            <div style={{ fontSize: 10.5, color: C.cyanDim, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={7} /> Active session</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 10px" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.u ? "flex-end" : "flex-start", marginBottom: 14, animation: "fadeUp .4s ease-out both" }}>
              {!m.u && <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: "rgba(0,242,254,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={14} color={C.cyan} /></div>}
              <div style={{
                maxWidth: "76%", padding: "11px 16px",
                background: m.u ? "linear-gradient(135deg, rgba(0,242,254,.1), rgba(79,172,254,.06))" : C.bg4,
                border: `1px solid ${m.u ? "rgba(0,242,254,.18)" : C.b0}`,
                borderRadius: m.u ? "13px 13px 4px 13px" : "13px 13px 13px 4px",
                fontSize: 13.5, lineHeight: 1.6,
              }} dangerouslySetInnerHTML={{ __html: renderMsg(m.t) }} />
              {m.u && <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: C.bg4, border: `1px solid ${C.b0}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={13} color={C.t2} /></div>}
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,242,254,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Bot size={14} color={C.cyan} /></div>
              <div style={{ background: C.bg4, borderRadius: "13px 13px 13px 4px", padding: "12px 18px", display: "flex", gap: 5 }}>
                {[0, 1, 2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyanDim, animation: `dots 1.4s ease-in-out infinite`, animationDelay: `${j * .2}s` }} />)}
              </div>
            </div>
          )}
          {showSugs && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4, marginBottom: 10, paddingLeft: 38, animation: "fadeIn .4s ease-out both" }}>
              {sugs.map(s => <Chip key={s} onClick={() => send(s)} style={{ fontSize: 11.5, padding: "7px 14px" }}><Zap size={11} /> {s}</Chip>)}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.b0}`, background: C.bg2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, background: C.bg3, border: `1px solid ${C.b1}`, padding: "3px 5px 3px 16px" }}>
            <input value={inp} onChange={e => setInp(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && inp.trim()) send(inp); }}
              placeholder="Type your answer..." disabled={typing}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.t0, fontSize: 13.5, padding: "9px 0", fontFamily: "'DM Sans',sans-serif" }}
            />
            <button onClick={() => send(inp)} disabled={!inp.trim() || typing}
              style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: inp.trim() && !typing ? C.gradCyan : C.bg4, display: "flex", alignItems: "center", justifyContent: "center", cursor: inp.trim() && !typing ? "pointer" : "not-allowed", transition: "all .2s" }}>
              <Send size={14} color={inp.trim() && !typing ? C.bg0 : C.t3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PHASE 3: SPEC ───────────────────────────────── */
function SpecPhase({ intent, onNext }) {
  const [reveal, setReveal] = useState(0);
  const items = [
    { title: "Input", desc: "Capture the user's idea, problem, document, or industry context.", icon: Sparkles, color: C.cyan },
    { title: "Guidance", desc: "Help the user define what the app should do through smart questions.", icon: MessageCircle, color: C.teal },
    { title: "Spec", desc: "Translate the idea into app logic, structure, and requirements.", icon: Cpu, color: C.purple },
    { title: "Build + Deploy", desc: "Create the app in phased iterations and make it runnable.", icon: Code2, color: C.green },
    { title: "Validate + Refine", desc: "Improve quality before release. Compare behavior to spec.", icon: RefreshCw, color: C.amber },
    { title: "Marketplace", desc: "Package the result so the app can be published and sold.", icon: Store, color: C.cyan },
  ];

  useEffect(() => {
    const ts = items.map((_, i) => setTimeout(() => setReveal(i + 1), 400 + i * 350));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 48px", animation: "fadeUp .55s ease-out both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Layers size={16} color={C.cyan} />
        <Mono style={{ fontSize: 10, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>Generated Specification</Mono>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Core system architecture</h2>
      <p style={{ fontSize: 14, color: C.t2, marginBottom: 4 }}>The system takes a non-technical user from idea to published Marketplace app.</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 24 }}>End-to-end flow</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
        {items.map((it, i) => {
          const Icon = it.icon;
          const vis = i < reveal;
          return (
            <div key={it.title} style={{ background: vis ? C.bg3 : C.bg2, border: `1px solid ${vis ? C.b1 : C.b0}`, borderRadius: 14, padding: "18px 16px", opacity: vis ? 1 : 0.2, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all .5s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg4 }}>
                  <Icon size={16} color={it.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{it.title}</span>
              </div>
              <p style={{ fontSize: 13, color: C.t1, lineHeight: 1.55 }}>{it.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Btn onClick={onNext}>Start Building <ArrowRight size={15} /></Btn>
      </div>
    </div>
  );
}

/* ── PHASE 4: BUILD ──────────────────────────────── */
function BuildPhase({ onNext }) {
  const [step, setStep] = useState(0);
  const phases = [
    { title: "Phase 1 — Core App", desc: "Create a simple working version first." },
    { title: "User Review", desc: "Confirm direction, usefulness, and workflow." },
    { title: "Phase 2 — Improvements", desc: "Add features and improve the UI." },
    { title: "Phase 3 — Complete App", desc: "Refine into a more polished version." },
    { title: "Ongoing Iteration", desc: "User requests changes in plain language, system updates the app." },
  ];

  useEffect(() => {
    const t = setInterval(() => setStep(p => Math.min(p + 1, phases.length)), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 48px", animation: "fadeUp .55s ease-out both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Code2 size={16} color={C.cyan} />
        <Mono style={{ fontSize: 10, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>Controlled Build & Refinement</Mono>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Controlled build & refinement</h2>
      <p style={{ fontSize: 14, color: C.t2, marginBottom: 4 }}>Instead of overwhelming the user, the app is built in safe, guided phases.</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 24 }}>Simple build journey</h3>

      {phases.map((p, i) => {
        const vis = i < step;
        const active = vis && i === step - 1 && step < phases.length;
        const completed = vis && !active;
        return (
          <div key={p.title} style={{ display: "flex", gap: 14, opacity: vis ? 1 : 0.2, transition: "all .5s" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: completed ? C.gradGreen : active ? "rgba(0,242,254,.15)" : C.bg4, border: active ? `2px solid ${C.cyan}` : "none", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .4s" }}>
                {completed ? <Check size={12} color={C.bg0} strokeWidth={3} /> :
                  active ? <Loader2 size={12} color={C.cyan} style={{ animation: "spin 1.5s linear infinite" }} /> :
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.t3 }} />}
              </div>
              {i < phases.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: completed ? C.green : C.b0, transition: "background .4s" }} />}
            </div>
            <div style={{ paddingBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: completed ? C.green : active ? C.t0 : C.t2 }}>{p.title}</span>
              <p style={{ fontSize: 12.5, color: C.t2, marginTop: 2, lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          </div>
        );
      })}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Btn onClick={onNext}>Deploy App <ArrowRight size={15} /></Btn>
      </div>
    </div>
  );
}

/* ── PHASE 5: DEPLOY ─────────────────────────────── */
function DeployPhase({ onNext }) {
  const [n, setN] = useState(0);
  const checks = [
    { label: "Deploys consistently — no failed builds or missing services", ic: CheckCircle2 },
    { label: "Runs reliably — core workflows continue after deployment", ic: Settings },
    { label: "Demo-safe — stable for customers, partners, and leadership", ic: Eye },
    { label: "Cloud-ready — connects to Supabase, GitHub, AWS", ic: Database },
    { label: "Validation — compare app behavior to spec, trigger fixes", ic: Shield },
  ];

  useEffect(() => {
    const t = setInterval(() => setN(p => Math.min(p + 1, checks.length)), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 24px 48px", animation: "fadeUp .55s ease-out both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Cloud size={16} color={C.cyan} />
        <Mono style={{ fontSize: 10, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>Stability, Deployment & Validation</Mono>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Stability, deployment & validation</h2>
      <p style={{ fontSize: 14, color: C.t2, marginBottom: 4 }}>The user should not worry about technical quality — the system handles it.</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 24 }}>Operational priorities</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {checks.map((c, i) => {
          const ok = i < n;
          const Icon = c.ic;
          return (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: ok ? "rgba(52,211,153,.05)" : C.bg3, border: `1px solid ${ok ? "rgba(52,211,153,.18)" : C.b0}`, borderRadius: 12, transition: "all .4s", opacity: ok ? 1 : 0.3 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: ok ? C.gradGreen : C.bg4, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}>
                {ok ? <Check size={13} color={C.bg0} strokeWidth={3} style={{ animation: "checkPop .3s ease-out" }} /> : <Icon size={13} color={C.t3} />}
              </div>
              <span style={{ fontSize: 13, color: ok ? C.t0 : C.t2, fontWeight: ok ? 500 : 400, lineHeight: 1.4 }}>{c.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Btn onClick={onNext}>Publish to Marketplace <ArrowRight size={15} /></Btn>
      </div>
    </div>
  );
}

/* ── PHASE 6: PUBLISH ────────────────────────────── */
function PublishPhase({ intent }) {
  const [live, setLive] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLive(true), 1000); return () => clearTimeout(t); }, []);

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 24px 60px", textAlign: "center", animation: "fadeUp .55s ease-out both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, justifyContent: "center" }}>
        <Store size={16} color={C.cyan} />
        <Mono style={{ fontSize: 10, color: C.cyan, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>Marketplace & Monetization</Mono>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Marketplace & monetization</h2>
      <p style={{ fontSize: 14, color: C.t2, marginBottom: 4 }}>The end result is a published app on the Marketplace, not just a prototype.</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 28 }}>Published app outcome</h3>

      <div style={{ background: C.bg3, borderRadius: 18, border: `1px solid ${C.b1}`, padding: 28, maxWidth: 400, margin: "0 auto", opacity: live ? 1 : 0, transform: live ? "scale(1)" : "scale(.95)", transition: "all .6s ease-out", boxShadow: live ? "0 0 60px rgba(0,242,254,.12)" : "none" }}>
        <div style={{ width: "100%", height: 150, borderRadius: 12, marginBottom: 18, background: "linear-gradient(135deg, rgba(0,242,254,.1), rgba(79,172,254,.07), rgba(167,139,250,.05))", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.b1}` }}>
          <MonitorSmartphone size={44} color={C.cyan} style={{ opacity: .5 }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{intent}</h3>
        <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 16, textAlign: "left" }}>
          Every generated app gets a thumbnail, a clear description, and a visible price. The Marketplace is where the app is published and discovered.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} color={C.amber} fill={i <= 4 ? C.amber : "none"} />)}
            <span style={{ fontSize: 11, color: C.t2, marginLeft: 4 }}>4.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <DollarSign size={14} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>29.99</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn style={{ flex: 1, justifyContent: "center", padding: "12px 0" }}><Play size={14} /> Launch App</Btn>
          <button style={{ background: C.bg4, border: `1px solid ${C.b1}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <ExternalLink size={14} color={C.t1} />
          </button>
        </div>
      </div>

      {live && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 24, animation: "fadeIn .4s ease-out both" }}>
          {["Stripe payments active", "Marketplace listed", "Validated & stable", "Release approved"].map(t => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.18)", borderRadius: 100, padding: "6px 14px", fontSize: 11, color: C.green }}>
              <CheckCircle2 size={11} /> {t}
            </span>
          ))}
        </div>
      )}

      <p style={{ marginTop: 28, fontSize: 13, color: C.t3, lineHeight: 1.5 }}>
        Strategic result: a non-technical user can go from <span style={{ color: C.cyan }}>idea</span> → <span style={{ color: C.cyan }}>guided creation</span> → <span style={{ color: C.cyan }}>published Marketplace app</span>.
      </p>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function VentureBuilder() {
  const [phase, setPhase] = useState("input");
  const [intent, setIntent] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg0, backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(0,242,254,.04) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(79,172,254,.03) 0%, transparent 55%)" }}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />

      <div style={{ height: 3, background: C.gradCyan, width: "100%", position: "fixed", top: 0, left: 0, zIndex: 100 }} />

      <header style={{ paddingTop: 3, borderBottom: `1px solid ${C.b0}`, background: "rgba(8,12,20,.88)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", width: "100%", padding: "14px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.gradCyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Rocket size={16} color={C.bg0} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Venture Builder</span>
            <Mono style={{ fontSize: 8.5, color: C.cyan, background: "rgba(0,242,254,.08)", padding: "2px 8px", borderRadius: 4, letterSpacing: ".1em" }}>PREMIUM</Mono>
          </div>
          <Mono style={{ fontSize: 10, color: C.t3 }}>v2.4.0</Mono>
        </div>
        <Stepper current={phase} />
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {phase === "input" && <InputPhase onSubmit={(t) => { setIntent(t); setPhase("guidance"); }} />}
        {phase === "guidance" && <GuidancePhase intent={intent} onComplete={() => setPhase("spec")} />}
        {phase === "spec" && <SpecPhase intent={intent} onNext={() => setPhase("build")} />}
        {phase === "build" && <BuildPhase onNext={() => setPhase("deploy")} />}
        {phase === "deploy" && <DeployPhase onNext={() => setPhase("publish")} />}
        {phase === "publish" && <PublishPhase intent={intent} />}
      </main>

      <footer style={{ padding: "12px 24px", borderTop: `1px solid ${C.b0}`, display: "flex", justifyContent: "space-between", background: C.bg0 }}>
        <span style={{ fontSize: 11, color: C.t3 }}>Venture Builder Premium</span>
        <Mono style={{ fontSize: 11, color: C.t3 }}>{String(STEPS.findIndex(s => s.id === phase) + 1).padStart(2, "0")}</Mono>
      </footer>
    </div>
  );
}
