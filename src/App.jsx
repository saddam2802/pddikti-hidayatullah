import { useState, useMemo } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────
const C = {
  navy:"#0f2d4a", navyL:"#1a3f63", accent:"#e8a020",
  blue:"#1560a8", blueL:"#e8f1fb", border:"#dde6f0",
  text:"#1a2535", muted:"#6b7f96", bg:"#f3f6fa",
  green:"#16a34a", red:"#dc2626", orange:"#d97706", cyan:"#0891b2",
  purple:"#7c3aed"
};
const akrColor = a => a==="A"?C.green:a==="B"?C.blue:C.orange;
const card = { background:"#fff", borderRadius:14, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px #00000009" };

// ─── USERS DUMMY ─────────────────────────────────────────────────────
const USERS = [
  { id:0, username:"admin",         password:"admin123",   role:"superadmin", nama:"Admin DPP",        pthId:null },
  { id:1, username:"stail",         password:"stail123",   role:"pth",        nama:"Admin STAIL Surabaya",    pthId:1 },
  { id:2, username:"stis",          password:"stis123",    role:"pth",        nama:"Admin STIS Balikpapan",   pthId:2 },
  { id:3, username:"stie",          password:"stie123",    role:"pth",        nama:"Admin STIE Depok",        pthId:3 },
  { id:4, username:"stitmumtaz",    password:"mumtaz123",  role:"pth",        nama:"Admin STIT Mumtaz Batam", pthId:4 },
  { id:5, username:"iaih",          password:"iaih123",    role:"pth",        nama:"Admin IAIH Batam",        pthId:5 },
  { id:6, username:"stikma",        password:"stikma123",  role:"pth",        nama:"Admin STIKMA Malang",     pthId:6 },
  { id:7, username:"staialbayan",   password:"albayan123", role:"pth",        nama:"Admin STAI Al Bayan",     pthId:7 },
  { id:8, username:"stitsamarinda", password:"samarinda123",role:"pth",       nama:"Admin STIT Samarinda",    pthId:8 },
];

// ─── DATA ───────────────────────────────────────────────────────────
const TAHUN_LIST = ["2024/2025","2023/2024","2022/2023","2021/2022"];

const PTH_BASE = [
  { id:1, nama:"STAIL Surabaya",    status:"Aktif",     akr:"B", mhs:1240, dosen:78,  kota:"Surabaya",   prov:"Jawa Timur" },
  { id:2, nama:"STIS Balikpapan",   status:"Aktif",     akr:"C", mhs:860,  dosen:54,  kota:"Balikpapan", prov:"Kaltim" },
  { id:3, nama:"STIE Depok",        status:"Aktif",     akr:"B", mhs:2100, dosen:112, kota:"Depok",      prov:"Jawa Barat" },
  { id:4, nama:"STIT Mumtaz Batam", status:"Aktif",     akr:"C", mhs:430,  dosen:32,  kota:"Batam",      prov:"Kepri" },
  { id:5, nama:"IAIH Batam",        status:"Aktif",     akr:"B", mhs:760,  dosen:48,  kota:"Batam",      prov:"Kepri" },
  { id:6, nama:"STIKMA Malang",     status:"Aktif",     akr:"A", mhs:3200, dosen:185, kota:"Malang",     prov:"Jawa Timur" },
  { id:7, nama:"STAI Al Bayan",     status:"Non-Aktif", akr:"C", mhs:210,  dosen:18,  kota:"Jakarta",    prov:"DKI Jakarta" },
  { id:8, nama:"STIT Samarinda",    status:"Aktif",     akr:"B", mhs:940,  dosen:61,  kota:"Samarinda",  prov:"Kaltim" },
];

const PRODI = [
  { id:1,  pthId:1, nama:"Pendidikan Agama Islam",          jenjang:"S1", akr:"B", mhs:620, dosen:38 },
  { id:2,  pthId:1, nama:"Manajemen Pendidikan Islam",      jenjang:"S2", akr:"B", mhs:320, dosen:22 },
  { id:3,  pthId:1, nama:"Perbankan Syariah",               jenjang:"S1", akr:"C", mhs:300, dosen:18 },
  { id:4,  pthId:2, nama:"Ilmu Statistika",                 jenjang:"D4", akr:"C", mhs:460, dosen:28 },
  { id:5,  pthId:2, nama:"Komputasi Statistik",             jenjang:"D3", akr:"C", mhs:400, dosen:26 },
  { id:6,  pthId:3, nama:"Manajemen",                       jenjang:"S1", akr:"B", mhs:1100,dosen:60 },
  { id:7,  pthId:3, nama:"Akuntansi",                       jenjang:"S1", akr:"B", mhs:1000,dosen:52 },
  { id:8,  pthId:4, nama:"Pendidikan Islam Anak Usia Dini", jenjang:"S1", akr:"C", mhs:250, dosen:18 },
  { id:9,  pthId:5, nama:"Hukum Keluarga Islam",            jenjang:"S1", akr:"B", mhs:400, dosen:26 },
  { id:10, pthId:5, nama:"Ekonomi Syariah",                 jenjang:"S1", akr:"B", mhs:360, dosen:22 },
  { id:11, pthId:6, nama:"Teknik Informatika",              jenjang:"S1", akr:"A", mhs:1600,dosen:92 },
  { id:12, pthId:6, nama:"Sistem Informasi",                jenjang:"S1", akr:"A", mhs:1200,dosen:75 },
  { id:13, pthId:6, nama:"Teknik Komputer",                 jenjang:"D3", akr:"B", mhs:400, dosen:18 },
  { id:14, pthId:7, nama:"Pendidikan Agama Islam",          jenjang:"S1", akr:"C", mhs:210, dosen:18 },
  { id:15, pthId:8, nama:"Pendidikan Islam",                jenjang:"S1", akr:"B", mhs:500, dosen:32 },
  { id:16, pthId:8, nama:"Manajemen Pendidikan Islam",      jenjang:"S2", akr:"B", mhs:280, dosen:20 },
  { id:17, pthId:8, nama:"Tadris Matematika",               jenjang:"S1", akr:"C", mhs:160, dosen:9  },
];

const genData = (p, ta) => {
  const idx = TAHUN_LIST.indexOf(ta);
  const f = 1 - idx * 0.08;
  const j = () => 0.95 + Math.random()*0.1;
  return {
    ...p, ta,
    mhs:           Math.round(p.mhs*f*j()),
    dosen:         Math.round(p.dosen*f*j()),
    alumni:        Math.round(p.mhs*f*1.85*j()),
    alumniKader:   Math.round(p.mhs*f*1.1*j()),
    mhsKader:      Math.round(p.mhs*f*0.6*j()),
    mhsBaru:       Math.round(p.mhs*f*0.22*j()),
    mhsBaruKader:  Math.round(p.mhs*f*0.13*j()),
    prestasi:      Math.max(3,Math.round((Math.random()*20+5)*f)),
    sinta:         Math.max(1,+(( Math.random()*3+1.5)*f).toFixed(2)),
    googleScore:   Math.max(10,Math.round((Math.random()*60+20)*f)),
    googleCitation:Math.max(20,Math.round((Math.random()*400+50)*f)),
    dosenKader:    { junior:Math.round(p.dosen*f*0.3), madya:Math.round(p.dosen*f*0.45), senior:Math.round(p.dosen*f*0.25) },
    dosenPendidikan:{ s2:Math.round(p.dosen*f*0.55), s3:Math.round(p.dosen*f*0.35), prof:Math.round(p.dosen*f*0.1) },
    dosenJabatan:  { asisten:Math.round(p.dosen*f*0.2), lektor:Math.round(p.dosen*f*0.4), lektorKepala:Math.round(p.dosen*f*0.3), guru:Math.round(p.dosen*f*0.1) },
  };
};

const ALL_DATA = {};
TAHUN_LIST.forEach(ta => { ALL_DATA[ta] = PTH_BASE.map(p => genData(p, ta)); });

// ─── SHARED UI ───────────────────────────────────────────────────────
const Badge = ({ label, color }) => (
  <span style={{ background:color+"18", color, border:`1px solid ${color}33`, borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{label}</span>
);
const Bar = ({ value, max, color=C.blue }) => (
  <div style={{ background:C.blueL, borderRadius:99, height:7, marginTop:4 }}>
    <div style={{ background:color, borderRadius:99, height:7, width:`${Math.min((value/Math.max(max,1))*100,100)}%`, transition:"width 0.6s" }} />
  </div>
);
const TrendChip = ({ current, prev }) => {
  if (!prev||prev===0) return null;
  const pct = (((current-prev)/prev)*100).toFixed(1);
  const up = current>=prev;
  return <span style={{ background:up?"#f0fdf4":"#fef2f2", color:up?C.green:C.red, border:`1px solid ${up?"#bbf7d0":"#fecaca"}`, borderRadius:6, padding:"1px 7px", fontSize:10, fontWeight:800, marginLeft:6 }}>{up?"▲":"▼"} {Math.abs(pct)}%</span>;
};
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background:"none", border:"none", color:C.blue, fontWeight:700, cursor:"pointer", fontSize:13, marginBottom:16, padding:0 }}>← Kembali</button>
);
const FilterBar = ({ mode, setMode, tahun, setTahun }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
    <div style={{ display:"flex", background:C.blueL, borderRadius:10, padding:3, gap:2 }}>
      {[["single","Per TA"],["kumulatif","Kumulatif"],["perbandingan","Perbandingan"]].map(([k,l])=>(
        <button key={k} onClick={()=>setMode(k)} style={{ padding:"6px 14px", borderRadius:7, border:"none", fontWeight:700, fontSize:12, cursor:"pointer", background:mode===k?C.navy:"transparent", color:mode===k?"#fff":C.muted }}>
          {l}
        </button>
      ))}
    </div>
    {mode!=="perbandingan" && (
      <select value={tahun} onChange={e=>setTahun(e.target.value)}
        style={{ padding:"7px 12px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", fontWeight:600 }}>
        {TAHUN_LIST.map(t=><option key={t} value={t}>TA {t}</option>)}
      </select>
    )}
    {mode==="perbandingan" && <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>TA {TAHUN_LIST[0]} vs TA {TAHUN_LIST[1]}</span>}
  </div>
);

// ─── LOGIN MODAL ─────────────────────────────────────────────────────
function LoginModal({ onLogin, onClose }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const doLogin = () => {
    const user = USERS.find(x => x.username===u && x.password===p);
    if (user) { onLogin(user); }
    else setErr("Username atau password salah.");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000066", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ ...card, padding:36, width:360, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.muted }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:52, height:52, background:C.accent, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:C.navy, fontSize:20, margin:"0 auto 12px" }}>PD</div>
          <h3 style={{ margin:0, color:C.navy, fontWeight:900 }}>Login Admin</h3>
          <p style={{ color:C.muted, fontSize:13, margin:"6px 0 0" }}>PDDIKTI Hidayatullah</p>
        </div>
        {err && <div style={{ background:"#fef2f2", border:`1px solid #fecaca`, borderRadius:8, padding:"10px 14px", color:C.red, fontSize:13, marginBottom:16 }}>{err}</div>}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:6 }}>Username</label>
          <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} placeholder="Masukkan username"
            style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:6 }}>Password</label>
          <input value={p} type="password" onChange={e=>{setP(e.target.value);setErr("");}} placeholder="Masukkan password"
            onKeyDown={e=>e.key==="Enter"&&doLogin()}
            style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <button onClick={doLogin} style={{ width:"100%", background:C.navy, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:800, fontSize:14, cursor:"pointer" }}>
          Masuk →
        </button>
        <p style={{ textAlign:"center", fontSize:11, color:C.muted, marginTop:16, marginBottom:0 }}>
          Hanya untuk Admin DPP & Admin PTH
        </p>
      </div>
    </div>
  );
}

// ─── PUBLIC HEADER ────────────────────────────────────────────────────
function PublicHeader({ onLoginClick }) {
  return (
    <div style={{ background:C.navy, padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, flexShrink:0, boxShadow:"0 2px 12px #00000022" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, background:C.accent, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:C.navy, fontSize:13 }}>PD</div>
        <div>
          <div style={{ fontWeight:900, color:"#fff", fontSize:15, lineHeight:1.1 }}>PDDIKTI Hidayatullah</div>
          <div style={{ fontSize:10, color:"#94a3b8" }}>pddikti-hidayatullah.ac.id</div>
        </div>
      </div>
      {/* Nav */}
      <div style={{ display:"flex", gap:4 }}>
        {["Dashboard","Program Studi","Perguruan Tinggi","Statistik"].map(l=>(
          <button key={l} style={{ background:"none", border:"none", color:"#cbd5e1", fontWeight:600, fontSize:13, cursor:"pointer", padding:"6px 12px", borderRadius:7 }}
            onMouseEnter={e=>e.currentTarget.style.color="#fff"}
            onMouseLeave={e=>e.currentTarget.style.color="#cbd5e1"}>
            {l}
          </button>
        ))}
      </div>
      <button onClick={onLoginClick} style={{ background:C.accent, color:C.navy, border:"none", borderRadius:9, padding:"8px 20px", fontWeight:800, fontSize:13, cursor:"pointer" }}>
        🔐 Login Admin
      </button>
    </div>
  );
}

// ─── PUBLIC DASHBOARD ─────────────────────────────────────────────────
function PublicDashboard() {
  const [mode, setMode]   = useState("single");
  const [tahun, setTahun] = useState(TAHUN_LIST[0]);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedPTH, setSelectedPTH] = useState(null);
  const [selectedProdi, setSelectedProdi] = useState(null);
  const [statSub, setStatSub] = useState(null);
  const [searchPTH, setSearchPTH] = useState("");
  const [searchProdi, setSearchProdi] = useState("");

  const getData = useMemo(()=>{
    if (mode==="single") return ALL_DATA[tahun];
    if (mode==="kumulatif") return PTH_BASE.map(p=>{
      const rows = TAHUN_LIST.map(ta=>ALL_DATA[ta].find(d=>d.id===p.id));
      return { ...rows[0], alumni:rows.reduce((a,r)=>a+r.alumni,0), alumniKader:rows.reduce((a,r)=>a+r.alumniKader,0), mhsBaru:rows.reduce((a,r)=>a+r.mhsBaru,0), prestasi:rows.reduce((a,r)=>a+r.prestasi,0) };
    });
    return ALL_DATA[TAHUN_LIST[0]];
  },[mode,tahun]);

  const prevData = ALL_DATA[TAHUN_LIST[1]];
  const curData  = ALL_DATA[TAHUN_LIST[0]];
  const totMhs   = getData.reduce((a,p)=>a+p.mhs,0);
  const totDosen = getData.reduce((a,p)=>a+p.dosen,0);
  const totAlumni= getData.reduce((a,p)=>a+(p.alumni||0),0);

  // ── NAV TABS ──
  const tabs = [
    { key:"dashboard",  label:"📊 Dashboard" },
    { key:"pth",        label:"🏛️ Perguruan Tinggi" },
    { key:"prodi",      label:"📚 Program Studi" },
    { key:"statistik",  label:"📈 Statistik" },
  ];

  const navTab = (key) => { setActivePage(key); setSelectedPTH(null); setSelectedProdi(null); setStatSub(null); };

  // ── INNER: DASHBOARD ──
  const renderDashboard = () => (
    <div>
      <FilterBar mode={mode} setMode={setMode} tahun={tahun} setTahun={setTahun} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[
          { icon:"🏛️", v:PTH_BASE.length, l:"Total PTH",      c:C.navy,   prev:null },
          { icon:"🎓", v:totMhs.toLocaleString(), l:"Total Mahasiswa", c:C.blue, prev:prevData.reduce((a,p)=>a+p.mhs,0), cur:totMhs },
          { icon:"👨‍🏫", v:totDosen.toLocaleString(),l:"Total Dosen",   c:C.purple,prev:prevData.reduce((a,p)=>a+p.dosen,0),cur:totDosen },
          { icon:"🎗️", v:totAlumni.toLocaleString(),l:"Total Alumni",  c:C.green, prev:prevData.reduce((a,p)=>a+p.alumni,0),cur:totAlumni },
        ].map((s,i)=>(
          <div key={i} style={{ ...card, padding:"18px 20px" }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
            <div style={{ display:"flex", alignItems:"baseline", flexWrap:"wrap" }}>
              <span style={{ fontSize:24, fontWeight:900, color:s.c }}>{s.v}</span>
              {mode==="perbandingan"&&s.prev&&<TrendChip current={s.cur} prev={s.prev} />}
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:3 }}>{s.l}</div>
            {mode==="perbandingan"&&s.prev&&<div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Tahun lalu: {s.prev.toLocaleString()}</div>}
            {mode==="kumulatif"&&s.prev&&<div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Akumulasi {TAHUN_LIST.length} tahun</div>}
          </div>
        ))}
      </div>

      {mode==="perbandingan" && (
        <div style={{ ...card, padding:22, marginBottom:18, overflow:"auto" }}>
          <h4 style={{ margin:"0 0 14px", color:C.navy, fontWeight:800 }}>Perbandingan TA {TAHUN_LIST[0]} vs TA {TAHUN_LIST[1]}</h4>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.bg }}>
                {["PTH","Mhs","","Dosen","","Alumni","","Mhs Baru",""].map((h,i)=>(
                  <th key={i} style={{ padding:"9px 10px", textAlign:"left", fontWeight:800, color:C.text, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {curData.map((p,i)=>{
                const prev=prevData.find(d=>d.id===p.id);
                return (
                  <tr key={p.id} style={{ background:i%2===0?"#fff":"#fafcff" }}>
                    <td style={{ padding:"9px 10px", fontWeight:700, color:C.navy, borderBottom:`1px solid ${C.border}` }}>{p.nama}</td>
                    <td style={{ padding:"9px 10px", fontWeight:700, color:C.blue, borderBottom:`1px solid ${C.border}` }}>{p.mhs.toLocaleString()}</td>
                    <td style={{ padding:"9px 10px", borderBottom:`1px solid ${C.border}` }}><TrendChip current={p.mhs} prev={prev?.mhs} /></td>
                    <td style={{ padding:"9px 10px", fontWeight:700, color:C.purple, borderBottom:`1px solid ${C.border}` }}>{p.dosen}</td>
                    <td style={{ padding:"9px 10px", borderBottom:`1px solid ${C.border}` }}><TrendChip current={p.dosen} prev={prev?.dosen} /></td>
                    <td style={{ padding:"9px 10px", fontWeight:700, color:C.green, borderBottom:`1px solid ${C.border}` }}>{p.alumni?.toLocaleString()}</td>
                    <td style={{ padding:"9px 10px", borderBottom:`1px solid ${C.border}` }}><TrendChip current={p.alumni} prev={prev?.alumni} /></td>
                    <td style={{ padding:"9px 10px", fontWeight:700, color:C.cyan, borderBottom:`1px solid ${C.border}` }}>{p.mhsBaru?.toLocaleString()}</td>
                    <td style={{ padding:"9px 10px", borderBottom:`1px solid ${C.border}` }}><TrendChip current={p.mhsBaru} prev={prev?.mhsBaru} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:"0 0 14px", color:C.navy, fontWeight:800 }}>PTH Terbesar — Mahasiswa</h4>
          {[...getData].sort((a,b)=>b.mhs-a.mhs).slice(0,5).map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:11 }}>
              <span style={{ fontWeight:900, color:C.muted, width:18, fontSize:12 }}>#{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:C.text, fontSize:12 }}>{p.nama}</div>
                <Bar value={p.mhs} max={getData.reduce((a,x)=>Math.max(a,x.mhs),0)} />
              </div>
              <span style={{ fontWeight:900, color:C.blue, fontSize:13 }}>{p.mhs.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:"0 0 14px", color:C.navy, fontWeight:800 }}>Tren Mahasiswa 4 Tahun</h4>
          {PTH_BASE.slice(0,5).map(p=>{
            const vals=TAHUN_LIST.map(ta=>ALL_DATA[ta].find(d=>d.id===p.id)?.mhs||0);
            const maxV=Math.max(...vals);
            return (
              <div key={p.id} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:3 }}>{p.nama}</div>
                <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:26 }}>
                  {vals.map((v,i)=>(
                    <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                      <div style={{ width:"100%", borderRadius:"3px 3px 0 0", height:`${Math.max(4,(v/maxV)*22)}px`, background:i===0?C.blue:i===1?"#93c5fd":"#dde6f0" }} />
                      <span style={{ fontSize:8, color:C.muted, marginTop:1 }}>{TAHUN_LIST[i].split("/")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── INNER: PTH ──
  const renderPTH = () => {
    if (selectedPTH) {
      const p=ALL_DATA[tahun].find(d=>d.id===selectedPTH.id)||selectedPTH;
      const prev=prevData.find(d=>d.id===selectedPTH.id);
      const prodi=PRODI.filter(pr=>pr.pthId===selectedPTH.id);
      return (
        <div>
          <BackBtn onClick={()=>setSelectedPTH(null)} />
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Tahun Akademik:</span>
            <select value={tahun} onChange={e=>setTahun(e.target.value)} style={{ padding:"6px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none" }}>
              {TAHUN_LIST.map(t=><option key={t} value={t}>TA {t}</option>)}
            </select>
          </div>
          <div style={{ ...card, padding:24, marginBottom:16 }}>
            <h2 style={{ margin:0, color:C.navy, fontSize:19, fontWeight:900 }}>{p.nama}</h2>
            <p style={{ color:C.muted, margin:"5px 0 12px", fontSize:13 }}>📍 {p.kota}, {p.prov}</p>
            <div style={{ display:"flex", gap:8 }}><Badge label={`Akreditasi ${p.akr}`} color={akrColor(p.akr)} /><Badge label={p.status} color={p.status==="Aktif"?C.green:C.red} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:18 }}>
            {[
              { icon:"🔵", v:p.status,  l:"Status PTH",         c:p.status==="Aktif"?C.green:C.red },
              { icon:"🏅", v:`Akr. ${p.akr}`, l:"Akreditasi",  c:akrColor(p.akr) },
              { icon:"🎓", v:p.mhs?.toLocaleString(), l:"Mahasiswa", c:C.blue, prev:prev?.mhs, cur:p.mhs },
              { icon:"👨‍🏫", v:p.dosen, l:"Dosen",              c:C.purple, prev:prev?.dosen, cur:p.dosen },
              { icon:"📚", v:prodi.length, l:"Prodi",           c:C.cyan },
            ].map((s,i)=>(
              <div key={i} style={{ ...card, padding:"14px 16px" }}>
                <div style={{ fontSize:20, marginBottom:5 }}>{s.icon}</div>
                <div style={{ display:"flex", alignItems:"baseline", flexWrap:"wrap" }}>
                  <span style={{ fontSize:18, fontWeight:900, color:s.c }}>{s.v}</span>
                  {s.prev&&<TrendChip current={s.cur} prev={s.prev} />}
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:C.text, marginTop:3 }}>{s.l}</div>
                {s.prev&&<div style={{ fontSize:10, color:C.muted, marginTop:1 }}>Tahun lalu: {s.prev?.toLocaleString()}</div>}
              </div>
            ))}
          </div>
          <h3 style={{ color:C.navy, fontWeight:800, marginBottom:12 }}>Prodi yang Diselenggarakan</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
            {prodi.map(pr=>(
              <div key={pr.id} style={{ ...card, padding:16 }}>
                <div style={{ fontWeight:700, color:C.navy, marginBottom:8 }}>{pr.nama}</div>
                <div style={{ display:"flex", gap:8 }}><Badge label={pr.jenjang} color={C.cyan} /><Badge label={`Akr. ${pr.akr}`} color={akrColor(pr.akr)} /></div>
                <div style={{ marginTop:8, fontSize:12, color:C.muted }}>🎓 {pr.mhs} mhs · 👨‍🏫 {pr.dosen} dosen</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    const filtered=ALL_DATA[tahun].filter(p=>p.nama.toLowerCase().includes(searchPTH.toLowerCase())||p.kota.toLowerCase().includes(searchPTH.toLowerCase()));
    return (
      <div>
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <input value={searchPTH} onChange={e=>setSearchPTH(e.target.value)} placeholder="🔍 Cari PTH atau kota..."
            style={{ flex:1, padding:"9px 14px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none" }} />
          <select value={tahun} onChange={e=>setTahun(e.target.value)} style={{ padding:"9px 12px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", fontWeight:600 }}>
            {TAHUN_LIST.map(t=><option key={t} value={t}>TA {t}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
          {filtered.map(p=>{
            const prev=prevData.find(d=>d.id===p.id);
            const prodi=PRODI.filter(pr=>pr.pthId===p.id);
            return (
              <div key={p.id} onClick={()=>setSelectedPTH(p)} style={{ ...card, padding:20, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontWeight:800, color:C.navy, fontSize:14, flex:1, paddingRight:10 }}>{p.nama}</div>
                  <Badge label={`Akr. ${p.akr}`} color={akrColor(p.akr)} />
                </div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>📍 {p.kota}, {p.prov}</div>
                <div style={{ display:"flex", gap:14, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                  {[
                    {v:p.status, l:"Status", c:p.status==="Aktif"?C.green:C.red},
                    {v:p.mhs?.toLocaleString(), l:"Mahasiswa", c:C.blue, pv:prev?.mhs, cur:p.mhs},
                    {v:p.dosen, l:"Dosen", c:C.purple, pv:prev?.dosen, cur:p.dosen},
                    {v:prodi.length, l:"Prodi", c:C.cyan},
                  ].map(({v,l,c,pv,cur})=>(
                    <div key={l}>
                      <div style={{ fontWeight:900, color:c, fontSize:15 }}>{v}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{l}</div>
                      {pv&&<TrendChip current={cur} prev={pv} />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── INNER: PRODI ──
  const renderProdi = () => {
    if (selectedProdi) {
      const pth=PTH_BASE.find(p=>p.id===selectedProdi.pthId);
      return (
        <div>
          <BackBtn onClick={()=>setSelectedProdi(null)} />
          <div style={{ ...card, padding:24 }}>
            <h2 style={{ margin:0, color:C.navy, fontSize:19, fontWeight:900 }}>{selectedProdi.nama}</h2>
            <p style={{ color:C.muted, margin:"5px 0 16px", fontSize:13 }}>{selectedProdi.jenjang}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                {icon:"🏛️",v:pth?.nama,l:"PTH Penyedia",c:C.navy},
                {icon:"🏅",v:`Akreditasi ${selectedProdi.akr}`,l:"Akreditasi Prodi",c:akrColor(selectedProdi.akr)},
                {icon:"🎓",v:selectedProdi.mhs.toLocaleString(),l:"Jumlah Mahasiswa Prodi",c:C.blue},
                {icon:"👨‍🏫",v:selectedProdi.dosen,l:"Jumlah Dosen Prodi",c:C.purple},
              ].map((s,i)=>(
                <div key={i} style={{ ...card, padding:"14px 16px" }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:17, fontWeight:900, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    const filtered=PRODI.filter(pr=>{
      const pth=PTH_BASE.find(p=>p.id===pr.pthId);
      return pr.nama.toLowerCase().includes(searchProdi.toLowerCase())||pth?.nama.toLowerCase().includes(searchProdi.toLowerCase());
    });
    return (
      <div>
        <input value={searchProdi} onChange={e=>setSearchProdi(e.target.value)} placeholder="🔍 Cari program studi atau institusi..."
          style={{ width:"100%", padding:"9px 14px", borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, marginBottom:16, boxSizing:"border-box", outline:"none" }} />
        <div style={{ ...card, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:C.bg }}>
                {["Program Studi","PTH Penyedia","Jenjang","Akreditasi","Mahasiswa","Dosen"].map(h=>(
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontWeight:800, color:C.text, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((pr,i)=>{
                const pth=PTH_BASE.find(p=>p.id===pr.pthId);
                return (
                  <tr key={pr.id} onClick={()=>setSelectedProdi(pr)} style={{ cursor:"pointer", background:i%2===0?"#fff":"#fafcff" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.blueL}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fafcff"}>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:C.navy, borderBottom:`1px solid ${C.border}` }}>{pr.nama}</td>
                    <td style={{ padding:"10px 14px", color:C.muted, borderBottom:`1px solid ${C.border}` }}>{pth?.nama}</td>
                    <td style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}` }}><Badge label={pr.jenjang} color={C.cyan} /></td>
                    <td style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}` }}><Badge label={pr.akr} color={akrColor(pr.akr)} /></td>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:C.blue, borderBottom:`1px solid ${C.border}` }}>{pr.mhs.toLocaleString()}</td>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:C.purple, borderBottom:`1px solid ${C.border}` }}>{pr.dosen}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── INNER: STATISTIK ──
  const renderStatistik = () => {
    const menus=[
      {key:"alumni",icon:"🎓",label:"Alumni",color:C.green},
      {key:"mahasiswa",icon:"👨‍🎓",label:"Mahasiswa",color:C.blue},
      {key:"dosen",icon:"👨‍🏫",label:"Dosen",color:C.purple},
      {key:"litabmas",icon:"🔬",label:"Penelitian & Pengabdian",color:C.orange},
    ];
    if (!statSub) return (
      <div>
        <FilterBar mode={mode} setMode={setMode} tahun={tahun} setTahun={setTahun} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 }}>
          {menus.map(m=>(
            <div key={m.key} onClick={()=>setStatSub(m.key)} style={{ ...card, padding:28, cursor:"pointer", transition:"all 0.2s", borderLeft:`5px solid ${m.color}`, display:"flex", alignItems:"center", gap:18 }}
              onMouseEnter={e=>{e.currentTarget.style.background=m.color+"0d";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.transform="none";}}>
              <div style={{ fontSize:40 }}>{m.icon}</div>
              <div>
                <div style={{ fontWeight:900, fontSize:17, color:C.navy }}>{m.label}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Klik untuk lihat detail →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const totAlumni=getData.reduce((a,p)=>a+(p.alumni||0),0);
    const totKader=getData.reduce((a,p)=>a+(p.alumniKader||0),0);

    return (
      <div>
        <BackBtn onClick={()=>setStatSub(null)} />
        <FilterBar mode={mode} setMode={setMode} tahun={tahun} setTahun={setTahun} />

        {statSub==="alumni" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
              {[
                {icon:"🎓",v:totAlumni,l:"Jumlah Total Alumni",c:C.green,prev:prevData.reduce((a,p)=>a+p.alumni,0)},
                {icon:"🟢",v:totKader,l:"Jumlah Alumni Kader",c:C.blue,prev:prevData.reduce((a,p)=>a+p.alumniKader,0)},
                {icon:"⚪",v:totAlumni-totKader,l:"Jumlah Alumni Non Kader",c:C.muted,prev:null},
              ].map((s,i)=>(
                <div key={i} style={{ ...card, padding:"18px 20px" }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ display:"flex", alignItems:"baseline", flexWrap:"wrap" }}>
                    <span style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v.toLocaleString()}</span>
                    {mode==="perbandingan"&&s.prev&&<TrendChip current={s.v} prev={s.prev} />}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ ...card, padding:22 }}>
              <h4 style={{ margin:"0 0 16px", color:C.navy, fontWeight:800 }}>Alumni per PTH</h4>
              {getData.map(p=>{
                const prev=prevData.find(d=>d.id===p.id);
                return (
                  <div key={p.id} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                      <span style={{ fontWeight:700, color:C.text }}>{p.nama}</span>
                      <span>
                        <span style={{ color:C.green, fontWeight:700 }}>{p.alumni?.toLocaleString()}</span>
                        {mode==="perbandingan"&&<TrendChip current={p.alumni} prev={prev?.alumni} />}
                        <span style={{ color:C.muted, marginLeft:8 }}>Kader: {p.alumniKader?.toLocaleString()}</span>
                        <span style={{ color:C.muted, marginLeft:8 }}>Non-Kader: {((p.alumni||0)-(p.alumniKader||0)).toLocaleString()}</span>
                      </span>
                    </div>
                    <div style={{ display:"flex", gap:2, height:8, borderRadius:99, overflow:"hidden" }}>
                      <div style={{ background:C.blue, width:`${((p.alumniKader||0)/Math.max(p.alumni,1))*100}%` }} />
                      <div style={{ background:"#cbd5e1", flex:1 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {statSub==="mahasiswa" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
              {[
                {icon:"🎓",v:getData.reduce((a,p)=>a+p.mhs,0),l:"Total Mahasiswa",c:C.blue},
                {icon:"🟢",v:getData.reduce((a,p)=>a+(p.mhsKader||0),0),l:"Mahasiswa Kader Aktif",c:C.green},
                {icon:"🆕",v:getData.reduce((a,p)=>a+(p.mhsBaru||0),0),l:"Total Mahasiswa Baru",c:C.cyan},
                {icon:"⭐",v:getData.reduce((a,p)=>a+(p.prestasi||0),0),l:"Prestasi Total",c:C.orange},
              ].map((s,i)=>(
                <div key={i} style={{ ...card, padding:"16px 18px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v.toLocaleString()}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ ...card, padding:20 }}>
              <h4 style={{ margin:"0 0 14px", color:C.navy, fontWeight:800 }}>Mahasiswa per PTH</h4>
              {[...getData].sort((a,b)=>b.mhs-a.mhs).map(p=>{
                const prev=prevData.find(d=>d.id===p.id);
                return (
                  <div key={p.id} style={{ marginBottom:11 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                      <span style={{ fontWeight:700, color:C.text }}>{p.nama}</span>
                      <span style={{ fontWeight:900, color:C.blue }}>{p.mhs.toLocaleString()}{mode==="perbandingan"&&<TrendChip current={p.mhs} prev={prev?.mhs} />}</span>
                    </div>
                    <Bar value={p.mhs} max={getData.reduce((a,x)=>Math.max(a,x.mhs),0)} color={C.blue} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {statSub==="dosen" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:16 }}>
              {[
                {title:"Level Kaderisasi",keys:[["junior","Junior",C.blue],["madya","Madya",C.purple],["senior","Senior",C.green]],field:"dosenKader"},
                {title:"Pendidikan",keys:[["s2","S2",C.blue],["s3","S3",C.purple],["prof","Prof",C.orange]],field:"dosenPendidikan"},
                {title:"Jabatan Akademik",keys:[["asisten","Asisten",C.cyan],["lektor","Lektor",C.blue],["lektorKepala","L.Kepala",C.orange],["guru","Guru Besar",C.red]],field:"dosenJabatan"},
              ].map(section=>(
                <div key={section.title} style={{ ...card, padding:18 }}>
                  <h4 style={{ margin:"0 0 12px", color:C.navy, fontWeight:800, fontSize:13 }}>Berdasarkan {section.title}</h4>
                  {getData.map(p=>(
                    <div key={p.id} style={{ marginBottom:10 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:3 }}>{p.nama}</div>
                      <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                        {section.keys.map(([k,l,c])=>(
                          <span key={k} style={{ background:c+"18", color:c, border:`1px solid ${c}33`, borderRadius:5, padding:"2px 6px", fontSize:10, fontWeight:700 }}>{l}: {p[section.field]?.[k]||0}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {statSub==="litabmas" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[
              {title:"📊 Sinta Score",field:"sinta",max:5,color:C.orange,fmt:v=>v?.toFixed(2)},
              {title:"🌐 Google Score",field:"googleScore",max:100,color:C.blue,fmt:v=>v},
              {title:"📖 Google Citation",field:"googleCitation",max:600,color:C.cyan,fmt:v=>v},
            ].map(s=>(
              <div key={s.title} style={{ ...card, padding:20 }}>
                <h4 style={{ margin:"0 0 14px", color:C.navy, fontWeight:800, fontSize:13 }}>{s.title} per PTH</h4>
                {[...getData].sort((a,b)=>b[s.field]-a[s.field]).map(p=>{
                  const prev=prevData.find(d=>d.id===p.id);
                  return (
                    <div key={p.id} style={{ marginBottom:11 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                        <span style={{ fontWeight:600, color:C.text }}>{p.nama}</span>
                        <span style={{ fontWeight:900, color:s.color }}>{s.fmt(p[s.field])}{mode==="perbandingan"&&<TrendChip current={p[s.field]} prev={prev?.[s.field]} />}</span>
                      </div>
                      <Bar value={p[s.field]||0} max={s.max} color={s.color} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const pageTitles = { dashboard:"📊 Dashboard", pth:"🏛️ Perguruan Tinggi", prodi:"📚 Program Studi", statistik:"📈 Statistik" };

  return (
    <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Tab bar */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", gap:0 }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>navTab(t.key)} style={{
            padding:"14px 20px", border:"none", background:"none", fontWeight:700, fontSize:13, cursor:"pointer",
            color:activePage===t.key?C.blue:C.muted,
            borderBottom:activePage===t.key?`3px solid ${C.blue}`:"3px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>
      {/* Content */}
      <div style={{ flex:1, overflow:"auto", padding:28 }}>
        <div style={{ marginBottom:20 }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:C.navy, margin:0 }}>{pageTitles[activePage]}</h2>
          <p style={{ color:C.muted, marginTop:4, fontSize:13 }}>Data resmi Perguruan Tinggi Hidayatullah</p>
        </div>
        {activePage==="dashboard"  && renderDashboard()}
        {activePage==="pth"        && renderPTH()}
        {activePage==="prodi"      && renderProdi()}
        {activePage==="statistik"  && renderStatistik()}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────
function AdminPanel({ user, onLogout }) {
  const [page, setPage] = useState("upload");
  const [step, setStep] = useState(1);
  const [pthId, setPthId] = useState(user.pthId ? String(user.pthId) : "");
  const [periode, setPeriode] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const PERIODE = TAHUN_LIST.flatMap(t=>[`${t} Ganjil`,`${t} Genap`]);
  const isSuperAdmin = user.role==="superadmin";
  const availablePTH = isSuperAdmin ? PTH_BASE : PTH_BASE.filter(p=>p.id===user.pthId);

  const doValidate = () => {
    setLoading(true);
    setTimeout(()=>{ const ok=Math.random()>0.3; setResult(ok?"valid":"invalid"); setLoading(false); setStep(ok?4:3); },2000);
  };
  const reset = () => { setStep(1); if(!user.pthId) setPthId(""); setPeriode(""); setFile(null); setResult(null); };

  const NAV_ADMIN = [
    { key:"upload", icon:"⬆️", label:"Upload Data" },
    ...(isSuperAdmin ? [
      { key:"users",   icon:"👥", label:"Kelola User" },
      { key:"history", icon:"📋", label:"Riwayat Upload" },
    ] : [
      { key:"history", icon:"📋", label:"Riwayat Upload" },
    ]),
  ];

  return (
    <div style={{ display:"flex", height:"100%", flex:1, overflow:"hidden" }}>
      {/* Admin Sidebar */}
      <div style={{ width:210, background:C.navyL, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"16px 14px", borderBottom:"1px solid #ffffff14" }}>
          <div style={{ background:C.accent+"22", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:11, color:C.accent, fontWeight:700 }}>LOGIN SEBAGAI</div>
            <div style={{ fontWeight:800, color:"#fff", fontSize:13, marginTop:2 }}>{user.nama}</div>
            <div style={{ fontSize:10, color:"#94a3b8", marginTop:1 }}>{isSuperAdmin?"Super Admin":"Admin PTH"}</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 10px" }}>
          {NAV_ADMIN.map(n=>(
            <div key={n.key} onClick={()=>setPage(n.key)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:9, marginBottom:2, cursor:"pointer",
              background:page===n.key?"#ffffff18":"transparent",
              borderLeft:page===n.key?`3px solid ${C.accent}`:"3px solid transparent"
            }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>
              <span style={{ fontSize:13, fontWeight:page===n.key?800:500, color:page===n.key?"#fff":"#94a3b8" }}>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding:"12px 14px", borderTop:"1px solid #ffffff14" }}>
          <button onClick={onLogout} style={{ width:"100%", background:"#ffffff14", color:"#fff", border:"none", borderRadius:8, padding:"9px", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Admin Content */}
      <div style={{ flex:1, overflow:"auto", padding:24, background:C.bg }}>

        {/* ── UPLOAD ── */}
        {page==="upload" && (
          <div>
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:19, fontWeight:900, color:C.navy, margin:0 }}>Upload Data</h2>
              <p style={{ color:C.muted, marginTop:4, fontSize:13 }}>Upload dokumen Excel sesuai format yang ditentukan</p>
            </div>
            {/* Steps */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
              {["Pilih PTH & Periode","Upload Dokumen","Validasi","Selesai"].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:step>i+1?C.green:step===i+1?C.navy:C.border, color:step>=i+1?"#fff":C.muted, fontWeight:900, fontSize:12 }}>
                      {step>i+1?"✓":i+1}
                    </div>
                    <span style={{ fontSize:10, color:step===i+1?C.navy:C.muted, marginTop:4, fontWeight:step===i+1?700:400, textAlign:"center" }}>{s}</span>
                  </div>
                  {i<3&&<div style={{ height:2, flex:0.3, background:step>i+1?C.green:C.border, marginBottom:14 }} />}
                </div>
              ))}
            </div>
            <div style={{ ...card, padding:28 }}>
              {step===1 && (
                <div>
                  <h3 style={{ marginTop:0, color:C.navy, fontWeight:900 }}>Pilih PTH & Periode</h3>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:6 }}>Perguruan Tinggi</label>
                    <select value={pthId} onChange={e=>setPthId(e.target.value)} disabled={!!user.pthId}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", background:user.pthId?"#f8fafc":"#fff" }}>
                      <option value="">-- Pilih PTH --</option>
                      {availablePTH.map(p=><option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                    {user.pthId && <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>⚠️ Anda hanya dapat upload data untuk PTH Anda sendiri</div>}
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:6 }}>Periode Akademik</label>
                    <select value={periode} onChange={e=>setPeriode(e.target.value)} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none" }}>
                      <option value="">-- Pilih Periode --</option>
                      {PERIODE.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <button onClick={()=>pthId&&periode&&setStep(2)} style={{ background:pthId&&periode?C.navy:"#e2e8f0", color:pthId&&periode?"#fff":C.muted, border:"none", borderRadius:9, padding:"10px 26px", fontWeight:800, cursor:pthId&&periode?"pointer":"not-allowed" }}>
                    Lanjut →
                  </button>
                </div>
              )}
              {step===2 && (
                <div>
                  <h3 style={{ marginTop:0, color:C.navy, fontWeight:900 }}>Upload Dokumen Excel</h3>
                  <p style={{ color:C.muted, fontSize:13, marginBottom:16 }}>
                    Download template: <a href="https://docs.google.com/spreadsheets/d/1EJ_wCIx0-KV-qAKcgp8Df5ghXnlgIlOTacNFQtucBI" target="_blank" rel="noreferrer" style={{ color:C.blue, fontWeight:700 }}>Klik di sini →</a>
                  </p>
                  <label style={{ display:"block", border:`2px dashed ${C.border}`, borderRadius:12, padding:"40px 24px", textAlign:"center", cursor:"pointer", background:file?"#f0fdf4":C.bg }}>
                    <div style={{ fontSize:32, marginBottom:10 }}>{file?"📄":"📁"}</div>
                    {file?<><p style={{ fontWeight:700, color:C.green, margin:0 }}>{file.name}</p><p style={{ color:C.muted, fontSize:12 }}>{(file.size/1024).toFixed(1)} KB</p></>
                      :<><p style={{ fontWeight:600, color:C.text, margin:0 }}>Klik untuk upload</p><p style={{ color:C.muted, fontSize:12 }}>.xlsx / .xls · Maks 10MB</p></>}
                    <input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files[0])} style={{ display:"none" }} />
                  </label>
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button onClick={()=>setStep(1)} style={{ background:C.bg, color:C.text, border:"none", borderRadius:9, padding:"10px 18px", fontWeight:700, cursor:"pointer" }}>← Kembali</button>
                    <button onClick={doValidate} disabled={!file} style={{ background:file?C.navy:"#e2e8f0", color:file?"#fff":C.muted, border:"none", borderRadius:9, padding:"10px 24px", fontWeight:800, cursor:file?"pointer":"not-allowed" }}>Validasi →</button>
                  </div>
                </div>
              )}
              {step===3 && (
                <div style={{ textAlign:"center", padding:"24px 0" }}>
                  {loading?<><div style={{ fontSize:40, marginBottom:12 }}>⏳</div><h3 style={{ color:C.navy }}>Memvalidasi...</h3></>
                  :<><div style={{ fontSize:40, marginBottom:12 }}>❌</div>
                    <h3 style={{ color:C.red }}>Data Tidak Valid</h3>
                    <div style={{ background:"#fef2f2", border:`1px solid #fecaca`, borderRadius:10, padding:14, textAlign:"left", marginBottom:20, fontSize:13 }}>
                      <p style={{ margin:"3px 0", color:C.red }}>• Kolom "NIM" kosong pada baris 12, 15, 23</p>
                      <p style={{ margin:"3px 0", color:C.red }}>• Format tanggal tidak sesuai baris 8</p>
                    </div>
                    <button onClick={()=>{setFile(null);setStep(2);}} style={{ background:C.red, color:"#fff", border:"none", borderRadius:9, padding:"10px 22px", fontWeight:800, cursor:"pointer" }}>Revisi & Upload Ulang</button>
                  </>}
                </div>
              )}
              {step===4 && (
                <div style={{ textAlign:"center", padding:"24px 0" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <h3 style={{ color:C.green, fontSize:18 }}>Berhasil Diunggah!</h3>
                  <p style={{ color:C.muted }}>Data <strong>{availablePTH.find(p=>p.id==pthId)?.nama}</strong> periode <strong>{periode}</strong> tersimpan.</p>
                  <button onClick={reset} style={{ background:C.navy, color:"#fff", border:"none", borderRadius:9, padding:"10px 22px", fontWeight:800, cursor:"pointer", marginTop:8 }}>Upload Data Baru</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── KELOLA USER (superadmin only) ── */}
        {page==="users" && isSuperAdmin && (
          <div>
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:19, fontWeight:900, color:C.navy, margin:0 }}>Kelola User</h2>
              <p style={{ color:C.muted, marginTop:4, fontSize:13 }}>Daftar akun admin seluruh PTH</p>
            </div>
            <div style={{ ...card, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:C.bg }}>
                    {["Nama","Username","Role","PTH","Aksi"].map(h=>(
                      <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontWeight:800, color:C.text, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u,i)=>(
                    <tr key={u.id} style={{ background:i%2===0?"#fff":"#fafcff" }}>
                      <td style={{ padding:"11px 16px", fontWeight:700, color:C.navy, borderBottom:`1px solid ${C.border}` }}>{u.nama}</td>
                      <td style={{ padding:"11px 16px", color:C.muted, borderBottom:`1px solid ${C.border}` }}>{u.username}</td>
                      <td style={{ padding:"11px 16px", borderBottom:`1px solid ${C.border}` }}>
                        <Badge label={u.role==="superadmin"?"Super Admin":"Admin PTH"} color={u.role==="superadmin"?C.orange:C.blue} />
                      </td>
                      <td style={{ padding:"11px 16px", color:C.muted, borderBottom:`1px solid ${C.border}` }}>
                        {u.pthId ? PTH_BASE.find(p=>p.id===u.pthId)?.nama : "— Semua PTH —"}
                      </td>
                      <td style={{ padding:"11px 16px", borderBottom:`1px solid ${C.border}` }}>
                        <button style={{ background:C.blueL, color:C.blue, border:"none", borderRadius:6, padding:"4px 12px", fontWeight:700, fontSize:12, cursor:"pointer" }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RIWAYAT ── */}
        {page==="history" && (
          <div>
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:19, fontWeight:900, color:C.navy, margin:0 }}>Riwayat Upload</h2>
              <p style={{ color:C.muted, marginTop:4, fontSize:13 }}>Log upload data {!isSuperAdmin && `— ${user.nama}`}</p>
            </div>
            <div style={{ ...card, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:C.bg }}>
                    {["PTH","Periode","Waktu Upload","Status","File"].map(h=>(
                      <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontWeight:800, color:C.text, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(isSuperAdmin ? PTH_BASE : PTH_BASE.filter(p=>p.id===user.pthId)).flatMap((p,pi)=>
                    ["2024/2025 Ganjil","2023/2024 Genap","2023/2024 Ganjil"].slice(0,isSuperAdmin?2:3).map((per,i)=>({
                      pth:p.nama, periode:per,
                      waktu:`${12-i} Mar 2025, ${9+i}:${i*15||"00"}`,
                      status: i===0?"Berhasil":i===1?"Berhasil":"Gagal",
                      file:`data_${p.nama.split(" ")[0].toLowerCase()}_${per.replace(/[/ ]/g,"_")}.xlsx`
                    }))
                  ).map((r,i)=>(
                    <tr key={i} style={{ background:i%2===0?"#fff":"#fafcff" }}>
                      <td style={{ padding:"10px 16px", fontWeight:700, color:C.navy, borderBottom:`1px solid ${C.border}` }}>{r.pth}</td>
                      <td style={{ padding:"10px 16px", color:C.muted, borderBottom:`1px solid ${C.border}` }}>{r.periode}</td>
                      <td style={{ padding:"10px 16px", color:C.muted, borderBottom:`1px solid ${C.border}` }}>{r.waktu}</td>
                      <td style={{ padding:"10px 16px", borderBottom:`1px solid ${C.border}` }}>
                        <Badge label={r.status} color={r.status==="Berhasil"?C.green:C.red} />
                      </td>
                      <td style={{ padding:"10px 16px", color:C.blue, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{r.file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────
export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user,      setUser]      = useState(null);

  const handleLogin  = (u) => { setUser(u); setShowLogin(false); };
  const handleLogout = ()  => setUser(null);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif", background:C.bg }}>
      {showLogin && <LoginModal onLogin={handleLogin} onClose={()=>setShowLogin(false)} />}

      {!user ? (
        // ── MODE PUBLIK ──
        <>
          <PublicHeader onLoginClick={()=>setShowLogin(true)} />
          {/* Banner */}
          <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navyL} 100%)`, padding:"28px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <h1 style={{ margin:0, color:"#fff", fontSize:22, fontWeight:900 }}>Pangkalan Data Perguruan Tinggi</h1>
              <p style={{ color:"#94a3b8", margin:"6px 0 0", fontSize:13 }}>Hidayatullah · Data resmi & transparan untuk publik</p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ background:"#ffffff14", borderRadius:10, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontWeight:900, color:C.accent, fontSize:20 }}>{PTH_BASE.length}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>PTH</div>
              </div>
              <div style={{ background:"#ffffff14", borderRadius:10, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontWeight:900, color:C.accent, fontSize:20 }}>{PTH_BASE.reduce((a,p)=>a+p.mhs,0).toLocaleString()}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Mahasiswa</div>
              </div>
              <div style={{ background:"#ffffff14", borderRadius:10, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontWeight:900, color:C.accent, fontSize:20 }}>{PRODI.length}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Program Studi</div>
              </div>
            </div>
          </div>
          <PublicDashboard />
        </>
      ) : (
        // ── MODE ADMIN ──
        <>
          <div style={{ background:C.navy, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:52, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, background:C.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:C.navy, fontSize:12 }}>PD</div>
              <div>
                <span style={{ fontWeight:900, color:"#fff", fontSize:14 }}>PDDIKTI Hidayatullah</span>
                <span style={{ color:"#64748b", fontSize:11, marginLeft:10 }}>— Panel Admin</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color:"#94a3b8", fontSize:12 }}>👤 {user.nama}</span>
              <button onClick={handleLogout} style={{ background:"#ffffff14", color:"#fff", border:"none", borderRadius:7, padding:"6px 14px", fontWeight:700, fontSize:12, cursor:"pointer" }}>Logout</button>
            </div>
          </div>
          <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
            <AdminPanel user={user} onLogout={handleLogout} />
          </div>
        </>
      )}
    </div>
  );
}
