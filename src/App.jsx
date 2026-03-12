import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

/* ── RESPONSIVE HOOK ─────────────────────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024, w };
}

/* ── DESIGN TOKENS ───────────────────────────────────────────────── */
const T = {
  navy:"#0d2137", navyM:"#163352", navyL:"#1e4472",
  accent:"#f0a500", accentL:"#fff8e7",
  blue:"#1a6fd4", blueL:"#e8f1fb",
  green:"#15803d", greenL:"#f0fdf4",
  red:"#dc2626", redL:"#fef2f2",
  orange:"#c2570a", orangeL:"#fff7ed",
  cyan:"#0e7490", cyanL:"#ecfeff",
  purple:"#6d28d9", purpleL:"#f5f3ff",
  border:"#dde6ef", bg:"#f4f7fb",
  text:"#1a2535", muted:"#64748b",
  white:"#ffffff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${T.bg}; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 99px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${T.border};
    box-shadow: 0 2px 16px #00000008;
  }
  .btn {
    border: none; cursor: pointer; font-family: inherit;
    font-weight: 700; border-radius: 10px; transition: all 0.15s;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary {
    background: ${T.navy}; color: #fff; padding: 11px 22px; font-size: 14px;
  }
  .btn-primary:hover { background: ${T.navyL}; }
  .btn-accent {
    background: ${T.accent}; color: ${T.navy}; padding: 10px 20px; font-size: 13px;
  }
  .btn-accent:hover { filter: brightness(1.05); }
  .btn-ghost {
    background: ${T.bg}; color: ${T.text}; padding: 9px 16px; font-size: 13px;
  }
  .btn-ghost:hover { background: ${T.border}; }
  .btn-green { background: ${T.green}; color: #fff; padding: 10px 20px; font-size: 13px; }
  .btn-red   { background: ${T.red};   color: #fff; padding: 10px 20px; font-size: 13px; }
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.02em;
  }
  input, select, textarea {
    font-family: inherit; font-size: 14px;
    border: 1.5px solid ${T.border}; border-radius: 10px; outline: none;
    padding: 10px 14px; width: 100%; transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${T.blue}; }
  label { font-size: 12px; font-weight: 700; color: ${T.text}; display: block; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    padding: 11px 14px; text-align: left; font-weight: 800;
    color: ${T.text}; background: ${T.bg}; border-bottom: 1.5px solid ${T.border};
    white-space: nowrap;
  }
  td { padding: 11px 14px; border-bottom: 1px solid ${T.border}; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8faff; }

  /* Mobile nav bottom bar */
  .mobile-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: ${T.navy}; z-index: 100;
    padding: 0; border-top: 1px solid ${T.navyL};
  }
  @media (max-width: 639px) {
    .mobile-nav { display: flex; }
    .desktop-sidebar { display: none !important; }
    .main-content { padding: 16px 14px 80px !important; }
    .page-title { font-size: 17px !important; }
    .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
    .pth-grid { grid-template-columns: 1fr !important; }
    .two-col { grid-template-columns: 1fr !important; }
    .table-wrap { overflow-x: auto; }
    .hide-mobile { display: none !important; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .main-content { padding: 20px !important; }
    .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
    .pth-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`;

/* ── SHARED COMPONENTS ───────────────────────────────────────────── */
const Tag = ({ label, color=T.blue, bg }) => (
  <span className="tag" style={{ background: bg||(color+"18"), color, border:`1px solid ${color}33` }}>{label}</span>
);

const akrColor = a => {
  if (!a) return T.muted;
  if (["A","Unggul"].includes(a)) return T.green;
  if (["B","Baik Sekali"].includes(a)) return T.blue;
  return T.orange;
};

const Spin = ({ size=28 }) => (
  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
    <div style={{ width:size,height:size,border:`3px solid ${T.border}`,borderTop:`3px solid ${T.blue}`,borderRadius:"50%",animation:"spin 0.7s linear infinite" }} />
  </div>
);

const Alert = ({ type="info", msg }) => {
  const map = { error:[T.red,T.redL], success:[T.green,T.greenL], info:[T.blue,T.blueL], warn:[T.orange,T.orangeL] };
  const [fg,bg] = map[type]||map.info;
  return (
    <div style={{ background:bg, border:`1.5px solid ${fg}33`, borderRadius:12, padding:"10px 16px", color:fg, fontSize:13, fontWeight:600, marginBottom:14 }}>{msg}</div>
  );
};

const BackBtn = ({ onClick, label="← Kembali" }) => (
  <button onClick={onClick} className="btn btn-ghost" style={{ marginBottom:16, fontSize:13 }}>{label}</button>
);

const FieldRow = ({ label, children }) => (
  <div style={{ marginBottom:14 }}>
    <label>{label}</label>
    {children}
  </div>
);

/* ── STAT CARD ───────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, color=T.navy, sub }) => (
  <div className="card fade-up" style={{ padding:"18px 16px" }}>
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
        <div style={{ fontSize:24, fontWeight:900, color, fontFamily:"'DM Mono', monospace", letterSpacing:"-0.03em" }}>{value}</div>
        <div style={{ fontSize:12, fontWeight:700, color:T.text, marginTop:4 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  </div>
);

/* ── EXCEL PARSER ────────────────────────────────────────────────── */
function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type:"array" });
        const result = { identitas:{}, daftarProdi:[], prodi:{}, pth:{} };

        // Identitas
        const ws1 = wb.Sheets["Identitas"];
        if (!ws1) return reject("Sheet 'Identitas' tidak ditemukan");
        XLSX.utils.sheet_to_json(ws1, { header:1, defval:"" }).forEach(r => {
          const v = String(r[2]||"").replace(/^\*\s*/,"").trim();
          if (!v) return;
          const l = String(r[1]||"");
          if (l.includes("Nama Perguruan")) result.identitas.nama_pth = v;
          if (l.includes("Semester")) result.identitas.semester = v;
          if (l.includes("Tahun Akademik")) result.identitas.tahun_akademik = v;
        });
        if (!result.identitas.nama_pth) return reject("Nama PTH kosong di sheet Identitas");
        if (!result.identitas.semester) return reject("Semester kosong di sheet Identitas");
        if (!result.identitas.tahun_akademik) return reject("Tahun Akademik kosong");

        // Daftar Prodi
        const ws2 = wb.Sheets["Daftar Prodi"];
        if (!ws2) return reject("Sheet 'Daftar Prodi' tidak ditemukan");
        XLSX.utils.sheet_to_json(ws2, { header:1, defval:"" }).forEach((r, i) => {
          if (i < 5) return;
          const nama = String(r[1]||"").trim();
          if (!nama || nama.startsWith("[")) return;
          result.daftarProdi.push({ nama, jenjang:String(r[2]||"").trim(), akreditasi:String(r[3]||"").trim() });
        });
        if (!result.daftarProdi.length) return reject("Daftar Prodi kosong");

        // Sheet per prodi
        result.daftarProdi.forEach(prodi => {
          const ws = wb.Sheets[prodi.nama];
          if (!ws) return;
          const d = { dosen:{}, tendik:{}, mahasiswa:{} };
          XLSX.utils.sheet_to_json(ws, { header:1, defval:"" }).forEach(r => {
            const v  = parseInt(String(r[2]||"0").replace(/^\*\s*/,""))||0;
            const l  = String(r[1]||"");
            if (l.includes("Pendidikan S2")) d.dosen.s2=v;
            if (l.includes("Pendidikan S3")) d.dosen.s3=v;
            if (l.includes("Tanpa JAD")&&l.includes("Kader")&&!l.includes("Non")) d.dosen.tanpa_jad_kader=v;
            if (l.includes("Tanpa JAD")&&l.includes("Non")) d.dosen.tanpa_jad_non_kader=v;
            if (l.includes("Asisten Ahli")&&!l.includes("Non")) d.dosen.asisten_ahli_kader=v;
            if (l.includes("Asisten Ahli")&&l.includes("Non")) d.dosen.asisten_ahli_non_kader=v;
            if (l.includes("Lektor")&&!l.includes("Kepala")&&!l.includes("Non")&&!l.includes("Asisten")) d.dosen.lektor_kader=v;
            if (l.includes("Lektor")&&!l.includes("Kepala")&&l.includes("Non")) d.dosen.lektor_non_kader=v;
            if (l.includes("Lektor Kepala")&&!l.includes("Non")) d.dosen.lektor_kepala_kader=v;
            if (l.includes("Lektor Kepala")&&l.includes("Non")) d.dosen.lektor_kepala_non_kader=v;
            if (l.includes("Guru Besar")&&!l.includes("Non")) d.dosen.guru_besar_kader=v;
            if (l.includes("Guru Besar")&&l.includes("Non")) d.dosen.guru_besar_non_kader=v;
            if (l.includes("Tendik")&&l.includes("Kader")&&!l.includes("Non")) d.tendik.kader=v;
            if (l.includes("Tendik")&&l.includes("Non")) d.tendik.non_kader=v;
            if (l.includes("Student Body")) d.mahasiswa.student_body=v;
            if (l.includes("Mahasiswa Baru")&&l.includes("Kader")&&!l.includes("Non")&&!l.includes("Total")) d.mahasiswa.baru_kader=v;
            if (l.includes("Mahasiswa Baru")&&l.includes("Non")) d.mahasiswa.baru_non_kader=v;
            if (l.includes("Total Mahasiswa Baru")) d.mahasiswa.total_baru=v;
            if (l.includes("Kader")&&l.includes("Aktif")&&!l.includes("Non")&&!l.includes("Total")) d.mahasiswa.aktif_kader=v;
            if (l.includes("Non Boarding")&&l.includes("Aktif")) d.mahasiswa.aktif_non_kader=v;
            if (l.includes("Total Mahasiswa Aktif")) d.mahasiswa.total_aktif=v;
            if (l.includes("Dalam Negeri")) d.mahasiswa.prestasi_dn=v;
            if (l.includes("Internasional")) d.mahasiswa.prestasi_int=v;
          });
          if (!d.mahasiswa.total_baru) d.mahasiswa.total_baru=(d.mahasiswa.baru_kader||0)+(d.mahasiswa.baru_non_kader||0);
          if (!d.mahasiswa.total_aktif) d.mahasiswa.total_aktif=(d.mahasiswa.aktif_kader||0)+(d.mahasiswa.aktif_non_kader||0);
          result.prodi[prodi.nama] = d;
        });

        // Sheet PTH
        const wsPTH = wb.Sheets["PTH"];
        if (wsPTH) {
          XLSX.utils.sheet_to_json(wsPTH, { header:1, defval:"" }).forEach(r => {
            const v  = String(r[2]||"").replace(/^\*\s*/,"").trim();
            const l  = String(r[1]||"");
            const n  = parseInt(v)||0;
            const f  = parseFloat(v)||0;
            if (l.includes("Jurnal yang dikelola")) result.pth.jumlah_jurnal=n;
            if (l.includes("Akreditasi Jurnal")) result.pth.akreditasi_jurnal=v;
            if (l.includes("Sinta Score")) result.pth.sinta_score=f;
            if (l.includes("Google Scholar")&&l.includes("Artikel")) result.pth.gscholar_artikel=n;
            if (l.includes("Google Scholar")&&l.includes("Sitasi")) result.pth.gscholar_citation=n;
            if (l.includes("Scopus")&&l.includes("Artikel")) result.pth.scopus_artikel=n;
            if (l.includes("Scopus")&&l.includes("Sitasi")) result.pth.scopus_citation=n;
            if (l.includes("Hibah")&&l.includes("Pemerintah")) result.pth.hibah_pemerintah=n;
            if (l.includes("Hibah")&&l.includes("Eksternal")) result.pth.hibah_eksternal=n;
            if (l.includes("Luar Negeri")) result.pth.kerjasama_ln=n;
            if (l.includes("Dalam Negeri")&&l.includes("Kerjasama")) result.pth.kerjasama_dn=n;
            if (l.includes("Alumni")&&l.includes("Kader")&&!l.includes("Non")) result.pth.alumni_kader=n;
            if (l.includes("Alumni")&&l.includes("Non")) result.pth.alumni_non_kader=n;
            if (l.includes("Nama Ketua")) result.pth.nama_ketua_alumni=v;
            if (l.includes("Nomor HP")) result.pth.hp_ketua_alumni=v;
          });
        }
        resolve(result);
      } catch(e) { reject("Gagal membaca file: "+e.message); }
    };
    reader.onerror = () => reject("Gagal membuka file");
    reader.readAsArrayBuffer(file);
  });
}

/* ── LOGIN MODAL ─────────────────────────────────────────────────── */
function LoginModal({ onLogin, onClose }) {
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [err,setErr]     = useState("");
  const [loading,setLoading] = useState(false);

  const doLogin = async () => {
    if (!email||!pass) return setErr("Email dan password wajib diisi.");
    setLoading(true); setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password:pass });
    if (error) { setErr("Email atau password salah."); setLoading(false); return; }
    const { data:rd } = await supabase.from("user_roles").select("*, pth(*)").eq("user_id",data.user.id).single();
    if (!rd) { setErr("Akun tidak memiliki role. Hubungi Admin DPP."); setLoading(false); return; }
    onLogin({ ...data.user, role:rd.role, pth_id:rd.pth_id, nama:rd.nama, pth:rd.pth });
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"#00000077",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div className="card fade-up" style={{ width:"100%",maxWidth:380,padding:28,position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",color:T.muted,lineHeight:1 }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:22 }}>
          <div style={{ width:48,height:48,background:T.accent,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:18,margin:"0 auto 10px" }}>PD</div>
          <h3 style={{ fontWeight:900,color:T.navy,fontSize:18 }}>Login Admin</h3>
          <p style={{ color:T.muted,fontSize:13,marginTop:4 }}>PDDIKTI Hidayatullah</p>
        </div>
        {err && <Alert type="error" msg={err} />}
        <FieldRow label="Email">
          <input value={email} onChange={e=>{ setEmail(e.target.value);setErr(""); }} type="email" placeholder="admin@hidayatullah.ac.id" />
        </FieldRow>
        <FieldRow label="Password">
          <input value={pass} type="password" onChange={e=>{ setPass(e.target.value);setErr(""); }} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
        </FieldRow>
        <button onClick={doLogin} disabled={loading} className="btn btn-primary" style={{ width:"100%",marginTop:4 }}>
          {loading ? "Memverifikasi..." : "Masuk →"}
        </button>
        <p style={{ textAlign:"center",fontSize:11,color:T.muted,marginTop:14 }}>Hanya untuk Admin DPP & Admin PTH</p>
      </div>
    </div>
  );
}

/* ── FORM PROFIL PTH ─────────────────────────────────────────────── */
function FormProfilPTH({ user, onDone }) {
  const [form,setForm] = useState({ nama_sk:"",badan_penyelenggara:"",struktur:"Sekolah Tinggi",akreditasi:"B",kota:user.pth?.kota||"",provinsi:user.pth?.provinsi||"",website:"" });
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");

  const save = async () => {
    if (!form.nama_sk||!form.badan_penyelenggara||!form.kota) return setErr("Field bertanda * wajib diisi.");
    setLoading(true);
    const { error } = await supabase.from("pth").update({ ...form,profil_lengkap:true,updated_at:new Date().toISOString() }).eq("id",user.pth_id);
    if (error) { setErr("Gagal: "+error.message); setLoading(false); return; }
    onDone();
  };

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div className="card fade-up" style={{ width:"100%",maxWidth:520,padding:28 }}>
        <div style={{ textAlign:"center",marginBottom:22 }}>
          <div style={{ fontSize:36,marginBottom:8 }}>🏛️</div>
          <h2 style={{ fontWeight:900,color:T.navy }}>Lengkapi Profil PTH</h2>
          <p style={{ color:T.muted,fontSize:13,marginTop:6 }}>Sebelum menggunakan sistem, lengkapi profil <strong>{user.pth?.nama}</strong> terlebih dahulu.</p>
        </div>
        {err && <Alert type="error" msg={err} />}
        <FieldRow label="Nama PTH berdasarkan SK *">
          <input value={form.nama_sk} onChange={e=>setForm({...form,nama_sk:e.target.value})} />
        </FieldRow>
        <FieldRow label="Nama Badan Penyelenggara berdasarkan SK *">
          <input value={form.badan_penyelenggara} onChange={e=>setForm({...form,badan_penyelenggara:e.target.value})} />
        </FieldRow>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <FieldRow label="Struktur PTH">
            <select value={form.struktur} onChange={e=>setForm({...form,struktur:e.target.value})}>
              {["Sekolah Tinggi","Institut","Universitas","Politeknik","Akademi"].map(o=><option key={o}>{o}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Akreditasi Institusi">
            <select value={form.akreditasi} onChange={e=>setForm({...form,akreditasi:e.target.value})}>
              {["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Kota *">
            <input value={form.kota} onChange={e=>setForm({...form,kota:e.target.value})} />
          </FieldRow>
          <FieldRow label="Provinsi *">
            <input value={form.provinsi} onChange={e=>setForm({...form,provinsi:e.target.value})} />
          </FieldRow>
        </div>
        <FieldRow label="Website (opsional)">
          <input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://..." />
        </FieldRow>
        <button onClick={save} disabled={loading} className="btn btn-primary" style={{ width:"100%",marginTop:6 }}>
          {loading ? "Menyimpan..." : "Simpan & Lanjutkan →"}
        </button>
      </div>
    </div>
  );
}

/* ── PUBLIC HEADER ───────────────────────────────────────────────── */
function PublicHeader({ onLoginClick }) {
  return (
    <header style={{ background:T.navy,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,flexShrink:0,position:"sticky",top:0,zIndex:50 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:34,height:34,background:T.accent,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:13,flexShrink:0 }}>PD</div>
        <div>
          <div style={{ fontWeight:900,color:"#fff",fontSize:14,lineHeight:1.2 }}>PDDIKTI Hidayatullah</div>
          <div style={{ fontSize:10,color:"#94a3b8" }}>Pangkalan Data PTH</div>
        </div>
      </div>
      <button onClick={onLoginClick} className="btn btn-accent" style={{ fontSize:12,padding:"7px 14px" }}>🔐 Login</button>
    </header>
  );
}

/* ── PUBLIC NAV TABS ─────────────────────────────────────────────── */
function PublicTabs({ active, setActive }) {
  const tabs = [
    { key:"dashboard",icon:"📊",label:"Dashboard" },
    { key:"pth",icon:"🏛️",label:"PTH" },
    { key:"prodi",icon:"📚",label:"Prodi" },
    { key:"statistik",icon:"📈",label:"Statistik" },
  ];
  return (
    <>
      {/* Desktop tabs */}
      <div style={{ background:"#fff",borderBottom:`1px solid ${T.border}`,display:"flex",padding:"0 20px",overflowX:"auto" }} className="hide-mobile-tabs">
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActive(t.key)} style={{
            padding:"13px 18px",border:"none",background:"none",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",
            color:active===t.key?T.blue:T.muted,
            borderBottom:active===t.key?`3px solid ${T.blue}`:"3px solid transparent",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActive(t.key)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            gap:3,padding:"10px 4px",border:"none",background:"none",cursor:"pointer",
            color:active===t.key?T.accent:"#94a3b8",
          }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ── PUBLIC DASHBOARD ────────────────────────────────────────────── */
function PublicDashboard() {
  const [pthList,setPthList]     = useState([]);
  const [prodiList,setProdiList] = useState([]);
  const [loading,setLoading]     = useState(true);
  const [activePage,setActivePage] = useState("dashboard");
  const [selectedPTH,setSelectedPTH]   = useState(null);
  const [selectedProdi,setSelectedProdi] = useState(null);
  const { isMobile } = useBreakpoint();

  useEffect(()=>{
    Promise.all([
      supabase.from("pth").select("*,prodi(*)").eq("status","Aktif").order("id"),
      supabase.from("prodi").select("*,pth(nama)").eq("status","Aktif"),
    ]).then(([{data:p},{data:pr}])=>{ setPthList(p||[]); setProdiList(pr||[]); setLoading(false); });
  },[]);

  const navTo = k => { setActivePage(k); setSelectedPTH(null); setSelectedProdi(null); };

  const totMhs = pthList.reduce((a,p)=>a+((p.prodi||[]).reduce((b,pr)=>b+(pr.student_body||0),0)),0);

  return (
    <div style={{ display:"flex",flexDirection:"column",flex:1,overflow:"hidden" }}>
      <PublicTabs active={activePage} setActive={navTo} />
      <div className="main-content" style={{ flex:1,overflow:"auto",padding:"20px" }}>
        {loading ? <Spin /> : (<>

          {/* ── DASHBOARD ── */}
          {activePage==="dashboard" && (
            <div className="fade-up">
              {/* Hero banner */}
              <div style={{ background:`linear-gradient(135deg,${T.navy} 0%,${T.navyL} 100%)`,borderRadius:16,padding:isMobile?"18px 16px":"24px 28px",marginBottom:20,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",right:-20,top:-20,width:120,height:120,background:T.accent+"22",borderRadius:"50%" }} />
                <div style={{ position:"absolute",right:30,bottom:-30,width:80,height:80,background:T.accent+"11",borderRadius:"50%" }} />
                <h1 style={{ color:"#fff",fontSize:isMobile?16:20,fontWeight:900,lineHeight:1.3,marginBottom:6 }}>Pangkalan Data<br/>Perguruan Tinggi Hidayatullah</h1>
                <p style={{ color:"#94a3b8",fontSize:12 }}>Data resmi & transparan untuk publik</p>
              </div>

              {/* Stat cards */}
              <div className="stat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
                <StatCard icon="🏛️" value={pthList.length} label="Total PTH" color={T.navy} />
                <StatCard icon="📚" value={prodiList.length} label="Total Prodi" color={T.cyan} />
                <StatCard icon="🎓" value={totMhs.toLocaleString("id-ID")} label="Mahasiswa" color={T.blue} />
                <StatCard icon="📍" value={[...new Set(pthList.map(p=>p.provinsi).filter(Boolean))].length} label="Provinsi" color={T.purple} />
              </div>

              {/* PTH List ringkas */}
              <div className="card" style={{ padding:0,overflow:"hidden",marginBottom:16 }}>
                <div style={{ padding:"14px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <h3 style={{ fontWeight:800,color:T.navy,fontSize:15 }}>Daftar PTH</h3>
                  <button onClick={()=>navTo("pth")} style={{ background:"none",border:"none",color:T.blue,fontWeight:700,fontSize:12,cursor:"pointer" }}>Lihat semua →</button>
                </div>
                {pthList.map((p,i)=>(
                  <div key={p.id} onClick={()=>{ setActivePage("pth"); setSelectedPTH(p); }}
                    style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:i<pthList.length-1?`1px solid ${T.border}`:"none",cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ width:36,height:36,borderRadius:10,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:13,flexShrink:0 }}>
                      {p.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontWeight:700,color:T.text,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{p.nama}</div>
                      <div style={{ fontSize:11,color:T.muted }}>📍 {p.kota} · {(p.prodi||[]).length} Prodi</div>
                    </div>
                    <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PTH ── */}
          {activePage==="pth" && (
            selectedPTH ? (
              <div className="fade-up">
                <BackBtn onClick={()=>setSelectedPTH(null)} />
                <div className="card" style={{ padding:20,marginBottom:16 }}>
                  <div style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                    <div style={{ width:52,height:52,borderRadius:14,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:18,flexShrink:0 }}>
                      {selectedPTH.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}
                    </div>
                    <div>
                      <h2 style={{ fontWeight:900,color:T.navy,fontSize:17 }}>{selectedPTH.nama}</h2>
                      <p style={{ color:T.muted,fontSize:13,margin:"4px 0 10px" }}>📍 {selectedPTH.kota}, {selectedPTH.provinsi}</p>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                        <Tag label={`Akr. ${selectedPTH.akreditasi||"-"}`} color={akrColor(selectedPTH.akreditasi)} />
                        <Tag label={selectedPTH.status||"Aktif"} color={T.green} />
                        {selectedPTH.struktur && <Tag label={selectedPTH.struktur} color={T.cyan} />}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 style={{ fontWeight:800,color:T.navy,marginBottom:12,fontSize:15 }}>Program Studi ({(selectedPTH.prodi||[]).length})</h3>
                <div className="pth-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
                  {(selectedPTH.prodi||[]).map(pr=>(
                    <div key={pr.id} className="card" style={{ padding:14 }}>
                      <div style={{ fontWeight:700,color:T.navy,fontSize:13,marginBottom:8 }}>{pr.nama}</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                        <Tag label={pr.jenjang||"-"} color={T.cyan} />
                        <Tag label={`Akr. ${pr.akreditasi||"-"}`} color={akrColor(pr.akreditasi)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="fade-up">
                <h2 style={{ fontWeight:900,color:T.navy,marginBottom:16 }} className="page-title">Perguruan Tinggi</h2>
                <div className="pth-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
                  {pthList.map(p=>(
                    <div key={p.id} className="card" style={{ padding:18,cursor:"pointer" }}
                      onClick={()=>setSelectedPTH(p)}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.blue; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                        <div style={{ width:40,height:40,borderRadius:11,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:15,flexShrink:0 }}>
                          {p.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}
                        </div>
                        <div style={{ fontWeight:800,color:T.navy,fontSize:13,lineHeight:1.3 }}>{p.nama}</div>
                      </div>
                      <div style={{ fontSize:11,color:T.muted,marginBottom:10 }}>📍 {p.kota}, {p.provinsi}</div>
                      <div style={{ display:"flex",gap:6,flexWrap:"wrap",paddingTop:10,borderTop:`1px solid ${T.border}` }}>
                        <Tag label={`${(p.prodi||[]).length} Prodi`} color={T.cyan} />
                        <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ── PRODI ── */}
          {activePage==="prodi" && (
            selectedProdi ? (
              <div className="fade-up">
                <BackBtn onClick={()=>setSelectedProdi(null)} />
                <div className="card" style={{ padding:20 }}>
                  <h2 style={{ fontWeight:900,color:T.navy,marginBottom:4 }}>{selectedProdi.nama}</h2>
                  <p style={{ color:T.muted,marginBottom:12,fontSize:13 }}>🏛️ {selectedProdi.pth?.nama}</p>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                    <Tag label={selectedProdi.jenjang||"-"} color={T.cyan} />
                    <Tag label={`Akr. ${selectedProdi.akreditasi||"-"}`} color={akrColor(selectedProdi.akreditasi)} />
                    <Tag label={selectedProdi.status||"Aktif"} color={T.green} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="fade-up">
                <h2 style={{ fontWeight:900,color:T.navy,marginBottom:16 }} className="page-title">Program Studi</h2>
                <div className="card" style={{ overflow:"hidden" }}>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Program Studi</th>
                          <th className="hide-mobile">PTH</th>
                          <th>Jenjang</th>
                          <th>Akreditasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prodiList.map(pr=>(
                          <tr key={pr.id} onClick={()=>setSelectedProdi(pr)} style={{ cursor:"pointer" }}>
                            <td>
                              <div style={{ fontWeight:700,color:T.navy,fontSize:13 }}>{pr.nama}</div>
                              <div style={{ fontSize:11,color:T.muted }} className="show-mobile-only">{pr.pth?.nama}</div>
                            </td>
                            <td className="hide-mobile" style={{ color:T.muted,fontSize:12 }}>{pr.pth?.nama}</td>
                            <td><Tag label={pr.jenjang||"-"} color={T.cyan} /></td>
                            <td><Tag label={pr.akreditasi||"-"} color={akrColor(pr.akreditasi)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── STATISTIK ── */}
          {activePage==="statistik" && (
            <div className="fade-up">
              <h2 style={{ fontWeight:900,color:T.navy,marginBottom:16 }} className="page-title">Statistik</h2>
              <div className="stat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20 }}>
                <StatCard icon="🏛️" value={pthList.length} label="Perguruan Tinggi" color={T.navy} />
                <StatCard icon="📚" value={prodiList.length} label="Program Studi" color={T.blue} />
                <StatCard icon="🎓" value={totMhs.toLocaleString("id-ID")} label="Total Mahasiswa" color={T.cyan} />
                <StatCard icon="📍" value={[...new Set(pthList.map(p=>p.provinsi).filter(Boolean))].length} label="Sebaran Provinsi" color={T.purple} />
              </div>
              <div className="card" style={{ padding:0,overflow:"hidden" }}>
                <div style={{ padding:"14px 18px",borderBottom:`1px solid ${T.border}` }}>
                  <h3 style={{ fontWeight:800,color:T.navy,fontSize:15 }}>Sebaran per PTH</h3>
                </div>
                {pthList.map((p,i)=>(
                  <div key={p.id} style={{ padding:"12px 18px",borderBottom:i<pthList.length-1?`1px solid ${T.border}`:"none" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                      <div style={{ fontWeight:700,color:T.text,fontSize:13 }}>{p.nama}</div>
                      <div style={{ fontWeight:800,color:T.blue,fontSize:13,fontFamily:"'DM Mono',monospace" }}>{(p.prodi||[]).length} prodi</div>
                    </div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                      <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)} />
                      <Tag label={p.kota||"-"} color={T.muted} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>)}
      </div>
    </div>
  );
}

/* ── ADMIN PANEL ─────────────────────────────────────────────────── */
function AdminPanel({ user, onLogout }) {
  const [page,setPage]       = useState("upload");
  const [uploads,setUploads] = useState([]);
  const [pthList,setPthList] = useState([]);
  const [loadingData,setLoadingData] = useState(false);
  const isSuperAdmin = user.role==="superadmin";
  const { isMobile } = useBreakpoint();

  const loadUploads = useCallback(async () => {
    setLoadingData(true);
    let q = supabase.from("uploads").select("*,pth(nama)").order("created_at",{ ascending:false });
    if (!isSuperAdmin) q = q.eq("pth_id",user.pth_id);
    const { data } = await q;
    setUploads(data||[]);
    setLoadingData(false);
  },[isSuperAdmin,user.pth_id]);

  const loadPTH = useCallback(async () => {
    const { data } = await supabase.from("pth").select("*,prodi(*)").order("id");
    setPthList(data||[]);
  },[]);

  useEffect(()=>{ loadUploads(); if(isSuperAdmin) loadPTH(); },[loadUploads,loadPTH,isSuperAdmin]);

  const NAV = [
    { key:"upload",  icon:"⬆️",  label:"Upload" },
    { key:"history", icon:"📋",  label:"Riwayat" },
    ...(isSuperAdmin ? [
      { key:"approval",icon:"✅",label:"Approval" },
      { key:"datapth", icon:"🏛️",label:"Data PTH" },
      { key:"users",   icon:"👥",label:"Users" },
    ] : [
      { key:"profil",  icon:"🏛️",label:"Profil PTH" },
    ]),
  ];

  return (
    <div style={{ display:"flex",flex:1,overflow:"hidden",position:"relative" }}>
      {/* Sidebar — desktop only */}
      <aside className="desktop-sidebar" style={{ width:200,background:T.navyM,display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ padding:"14px 12px",borderBottom:"1px solid #ffffff14" }}>
          <div style={{ background:T.accent+"22",borderRadius:9,padding:"10px 12px" }}>
            <div style={{ fontSize:10,color:T.accent,fontWeight:800,letterSpacing:"0.05em" }}>LOGIN SEBAGAI</div>
            <div style={{ fontWeight:800,color:"#fff",fontSize:13,marginTop:3 }}>{user.nama}</div>
            <div style={{ fontSize:10,color:"#94a3b8",marginTop:1 }}>{isSuperAdmin?"Super Admin DPP":"Admin PTH"}</div>
          </div>
        </div>
        <nav style={{ flex:1,padding:"10px 8px" }}>
          {NAV.map(n=>(
            <div key={n.key} onClick={()=>setPage(n.key)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,marginBottom:2,cursor:"pointer",
              background:page===n.key?"#ffffff1a":"transparent",
              borderLeft:page===n.key?`3px solid ${T.accent}`:"3px solid transparent",
            }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>
              <span style={{ fontSize:13,fontWeight:page===n.key?800:500,color:page===n.key?"#fff":"#94a3b8" }}>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding:"10px 12px",borderTop:"1px solid #ffffff14" }}>
          <button onClick={onLogout} style={{ width:"100%",background:"#ffffff14",color:"#fff",border:"none",borderRadius:8,padding:"9px",fontWeight:700,fontSize:12,cursor:"pointer" }}>🚪 Logout</button>
        </div>
      </aside>

      {/* Mobile bottom nav — admin */}
      <div className="mobile-nav">
        {NAV.map(n=>(
          <button key={n.key} onClick={()=>setPage(n.key)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            gap:2,padding:"8px 2px",border:"none",background:"none",cursor:"pointer",
            color:page===n.key?T.accent:"#94a3b8",
          }}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            <span style={{ fontSize:9,fontWeight:700 }}>{n.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="main-content" style={{ flex:1,overflow:"auto",padding:"20px" }}>
        {page==="upload"   && <PageUpload user={user} onDone={loadUploads} />}
        {page==="history"  && <PageHistory uploads={uploads} loading={loadingData} isSuperAdmin={isSuperAdmin} />}
        {page==="approval" && isSuperAdmin && <PageApproval uploads={uploads.filter(u=>u.status==="pending")} onRefresh={loadUploads} />}
        {page==="datapth"  && isSuperAdmin && <PageDataPTH pthList={pthList} />}
        {page==="profil"   && !isSuperAdmin && <PageProfilPTH user={user} />}
        {page==="users"    && isSuperAdmin && <PageUsers />}
      </main>
    </div>
  );
}

/* ── PAGE UPLOAD ─────────────────────────────────────────────────── */
function PageUpload({ user, onDone }) {
  const [step,setStep]     = useState(1);
  const [file,setFile]     = useState(null);
  const [parsed,setParsed] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr]       = useState("");

  const doValidate = async () => {
    setLoading(true); setErr("");
    try {
      const data = await parseExcel(file);
      const { data:pd } = await supabase.from("pth").select("nama").eq("id",user.pth_id).single();
      if (pd && data.identitas.nama_pth.toLowerCase()!==pd.nama.toLowerCase())
        return setErr(`Nama PTH di file "${data.identitas.nama_pth}" tidak sesuai dengan "${pd.nama}"`);
      setParsed(data); setStep(3);
    } catch(e) { setErr(String(e)); }
    setLoading(false);
  };

  const doSubmit = async () => {
    setLoading(true); setErr("");
    try {
      const { data:up,error:ue } = await supabase.from("uploads").insert({
        pth_id:user.pth_id, semester:parsed.identitas.semester,
        tahun_akademik:parsed.identitas.tahun_akademik,
        filename:file.name, status:"pending", uploaded_by:user.id,
      }).select().single();
      if (ue) throw ue.message;

      for (const pi of parsed.daftarProdi) {
        let { data:pd } = await supabase.from("prodi").select("id").eq("pth_id",user.pth_id).eq("nama",pi.nama).single();
        if (!pd) {
          const { data:np } = await supabase.from("prodi").insert({ pth_id:user.pth_id,nama:pi.nama,jenjang:pi.jenjang,akreditasi:pi.akreditasi }).select().single();
          pd = np;
        } else {
          await supabase.from("prodi").update({ jenjang:pi.jenjang,akreditasi:pi.akreditasi,updated_at:new Date().toISOString() }).eq("id",pd.id);
        }
        const d = parsed.prodi[pi.nama]; if (!d) continue;
        await supabase.from("data_dosen").insert({ upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,dosen_s2:d.dosen.s2||0,dosen_s3:d.dosen.s3||0,tanpa_jad_kader:d.dosen.tanpa_jad_kader||0,tanpa_jad_non_kader:d.dosen.tanpa_jad_non_kader||0,asisten_ahli_kader:d.dosen.asisten_ahli_kader||0,asisten_ahli_non_kader:d.dosen.asisten_ahli_non_kader||0,lektor_kader:d.dosen.lektor_kader||0,lektor_non_kader:d.dosen.lektor_non_kader||0,lektor_kepala_kader:d.dosen.lektor_kepala_kader||0,lektor_kepala_non_kader:d.dosen.lektor_kepala_non_kader||0,guru_besar_kader:d.dosen.guru_besar_kader||0,guru_besar_non_kader:d.dosen.guru_besar_non_kader||0 });
        await supabase.from("data_tendik").insert({ upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,tendik_kader:d.tendik.kader||0,tendik_non_kader:d.tendik.non_kader||0 });
        await supabase.from("data_mahasiswa").insert({ upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,student_body:d.mahasiswa.student_body||0,mhs_baru_kader:d.mahasiswa.baru_kader||0,mhs_baru_non_kader:d.mahasiswa.baru_non_kader||0,total_mhs_baru:d.mahasiswa.total_baru||0,mhs_aktif_kader:d.mahasiswa.aktif_kader||0,mhs_aktif_non_kader:d.mahasiswa.aktif_non_kader||0,total_mhs_aktif:d.mahasiswa.total_aktif||0,prestasi_dalam_negeri:d.mahasiswa.prestasi_dn||0,prestasi_internasional:d.mahasiswa.prestasi_int||0 });
      }
      const p = parsed.pth;
      await supabase.from("data_penelitian").insert({ upload_id:up.id,pth_id:user.pth_id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,jumlah_jurnal:p.jumlah_jurnal||0,akreditasi_jurnal:p.akreditasi_jurnal||"",sinta_score:p.sinta_score||0,gscholar_artikel:p.gscholar_artikel||0,gscholar_citation:p.gscholar_citation||0,scopus_artikel:p.scopus_artikel||0,scopus_citation:p.scopus_citation||0,hibah_pemerintah:p.hibah_pemerintah||0,hibah_eksternal:p.hibah_eksternal||0 });
      await supabase.from("data_kerjasama").insert({ upload_id:up.id,pth_id:user.pth_id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,kerjasama_ln:p.kerjasama_ln||0,kerjasama_dn:p.kerjasama_dn||0,alumni_kader:p.alumni_kader||0,alumni_non_kader:p.alumni_non_kader||0,nama_ketua_alumni:p.nama_ketua_alumni||"",hp_ketua_alumni:p.hp_ketua_alumni||"" });
      setStep(4); onDone();
    } catch(e) { setErr("Gagal: "+String(e)); }
    setLoading(false);
  };

  const reset = () => { setStep(1); setFile(null); setParsed(null); setErr(""); };

  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:4 }} className="page-title">Upload Data</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Upload file Excel per semester sesuai template</p>

      {/* Step indicator */}
      <div style={{ display:"flex",alignItems:"center",marginBottom:20 }}>
        {["Pilih File","Validasi","Preview","Selesai"].map((s,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",flex:1 }}>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",flex:1 }}>
              <div style={{ width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                background:step>i+1?T.green:step===i+1?T.navy:T.border,
                color:step>=i+1?"#fff":T.muted,fontWeight:900,fontSize:12 }}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{ fontSize:9,fontWeight:700,color:step===i+1?T.navy:T.muted,marginTop:3,textAlign:"center" }}>{s}</span>
            </div>
            {i<3 && <div style={{ height:2,flex:0.4,background:step>i+1?T.green:T.border,marginBottom:14 }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:22 }}>
        {err && <Alert type="error" msg={err} />}

        {step===1 && (
          <div>
            <h3 style={{ color:T.navy,marginBottom:16 }}>Pilih File Excel</h3>
            <label style={{ display:"block",border:`2px dashed ${T.border}`,borderRadius:14,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:file?T.greenL:T.bg }}>
              <div style={{ fontSize:32,marginBottom:8 }}>{file?"📄":"📁"}</div>
              {file ? <>
                <p style={{ fontWeight:700,color:T.green,margin:"0 0 4px" }}>{file.name}</p>
                <p style={{ color:T.muted,fontSize:12 }}>{(file.size/1024).toFixed(1)} KB</p>
              </> : <>
                <p style={{ fontWeight:700,color:T.text,margin:"0 0 4px" }}>Klik untuk pilih file Excel</p>
                <p style={{ color:T.muted,fontSize:12 }}>.xlsx · Maks 10MB</p>
              </>}
              <input type="file" accept=".xlsx,.xls" onChange={e=>{ setFile(e.target.files[0]); setErr(""); }} style={{ display:"none" }} />
            </label>
            <button onClick={()=>file&&setStep(2)} className="btn btn-primary" style={{ marginTop:14,opacity:file?1:0.5,cursor:file?"pointer":"not-allowed" }}>Lanjut →</button>
          </div>
        )}

        {step===2 && (
          <div style={{ textAlign:"center",padding:"8px 0" }}>
            {loading ? <><Spin /><p style={{ color:T.muted }}>Membaca & memvalidasi file...</p></> : <>
              <h3 style={{ color:T.navy }}>Validasi File</h3>
              <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Klik tombol untuk memvalidasi <strong>{file?.name}</strong></p>
              <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                <button onClick={()=>setStep(1)} className="btn btn-ghost">← Kembali</button>
                <button onClick={doValidate} className="btn btn-primary">Validasi File</button>
              </div>
            </>}
          </div>
        )}

        {step===3 && parsed && (
          <div>
            <h3 style={{ color:T.navy,marginBottom:12 }}>Preview Data</h3>
            <Alert type="success" msg={`✓ File valid — ${parsed.daftarProdi.length} prodi ditemukan`} />
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14 }}>
              {[["PTH",parsed.identitas.nama_pth],["Semester",parsed.identitas.semester],["Tahun Akademik",parsed.identitas.tahun_akademik]].map(([l,v])=>(
                <div key={l} style={{ background:T.blueL,borderRadius:10,padding:"10px 14px" }}>
                  <div style={{ fontSize:10,color:T.muted,fontWeight:700 }}>{l}</div>
                  <div style={{ fontWeight:800,color:T.navy,fontSize:13,marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
            <h4 style={{ color:T.navy,marginBottom:8 }}>Prodi yang akan diupload:</h4>
            {parsed.daftarProdi.map(p=>(
              <div key={p.nama} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:T.bg,borderRadius:8,marginBottom:6 }}>
                <span style={{ flex:1,fontWeight:700,color:T.text,fontSize:13 }}>{p.nama}</span>
                <Tag label={p.jenjang||"-"} color={T.cyan} />
                <span style={{ fontSize:11,color:parsed.prodi[p.nama]?T.green:T.red,fontWeight:700 }}>
                  {parsed.prodi[p.nama]?"✓ Data ada":"⚠ Sheet kosong"}
                </span>
              </div>
            ))}
            <div style={{ background:T.orangeL,border:`1px solid #fed7aa`,borderRadius:10,padding:"10px 14px",margin:"14px 0",fontSize:13,color:T.orange }}>
              ⚠️ Data masuk status <strong>Pending</strong> — menunggu approval Super Admin DPP.
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={reset} className="btn btn-ghost">← Ulang</button>
              <button onClick={doSubmit} disabled={loading} className="btn btn-green">{loading?"Mengirim...":"Kirim ke DPP →"}</button>
            </div>
          </div>
        )}

        {step===4 && (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:48,marginBottom:10 }}>✅</div>
            <h3 style={{ color:T.green }}>Berhasil Dikirim!</h3>
            <p style={{ color:T.muted,fontSize:14 }}>Data <strong>{parsed?.identitas.semester} {parsed?.identitas.tahun_akademik}</strong> sudah dikirim ke DPP.</p>
            <button onClick={reset} className="btn btn-primary" style={{ marginTop:16 }}>Upload Data Baru</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── PAGE HISTORY ────────────────────────────────────────────────── */
function PageHistory({ uploads, loading, isSuperAdmin }) {
  const statusColor = { pending:T.orange, approved:T.green, rejected:T.red };
  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:4 }} className="page-title">Riwayat Upload</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Log semua upload data semester</p>
      {loading ? <Spin /> : (
        <div className="card table-wrap" style={{ overflow:"hidden" }}>
          <table>
            <thead>
              <tr>
                {isSuperAdmin && <th>PTH</th>}
                <th>Semester</th>
                <th className="hide-mobile">Tahun</th>
                <th>Status</th>
                <th className="hide-mobile">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length===0 ? (
                <tr><td colSpan={5} style={{ textAlign:"center",color:T.muted,padding:32 }}>Belum ada riwayat upload</td></tr>
              ) : uploads.map(u=>(
                <tr key={u.id}>
                  {isSuperAdmin && <td style={{ fontWeight:700,color:T.navy,fontSize:13 }}>{u.pth?.nama}</td>}
                  <td style={{ fontSize:13 }}>{u.semester}</td>
                  <td className="hide-mobile" style={{ color:T.muted,fontSize:13 }}>{u.tahun_akademik}</td>
                  <td><Tag label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={statusColor[u.status]||T.muted} /></td>
                  <td className="hide-mobile" style={{ color:T.muted,fontSize:12 }}>{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── PAGE APPROVAL ───────────────────────────────────────────────── */
function PageApproval({ uploads, onRefresh }) {
  const [loading,setLoading] = useState({});
  const [catatan,setCatatan] = useState({});

  const doAction = async (id, action) => {
    setLoading(p=>({...p,[id]:true}));
    await supabase.from("uploads").update({ status:action,catatan_dpp:catatan[id]||"",approved_at:new Date().toISOString() }).eq("id",id);
    onRefresh();
    setLoading(p=>({...p,[id]:false}));
  };

  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:4 }} className="page-title">Approval</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Review & approve upload dari Admin PTH</p>
      {uploads.length===0 ? (
        <div className="card" style={{ padding:36,textAlign:"center" }}>
          <div style={{ fontSize:36,marginBottom:10 }}>✅</div>
          <p style={{ color:T.muted,fontWeight:700 }}>Tidak ada yang menunggu approval</p>
        </div>
      ) : uploads.map(u=>(
        <div key={u.id} className="card" style={{ padding:18,marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:800,color:T.navy }}>{u.pth?.nama}</div>
              <div style={{ color:T.muted,fontSize:12,marginTop:3 }}>{u.semester} · TA {u.tahun_akademik}</div>
              <div style={{ color:T.muted,fontSize:11,marginTop:1 }}>📄 {u.filename}</div>
            </div>
            <Tag label="Pending" color={T.orange} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label>Catatan (opsional)</label>
            <input value={catatan[u.id]||""} onChange={e=>setCatatan(p=>({...p,[u.id]:e.target.value}))} placeholder="Tulis catatan untuk Admin PTH..." />
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>doAction(u.id,"approved")} disabled={loading[u.id]} className="btn btn-green" style={{ flex:1 }}>✅ Approve</button>
            <button onClick={()=>doAction(u.id,"rejected")} disabled={loading[u.id]} className="btn btn-red"   style={{ flex:1 }}>❌ Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PAGE PROFIL PTH ─────────────────────────────────────────────── */
function PageProfilPTH({ user }) {
  const [pth,setPth]   = useState(null);
  const [prodi,setProdi] = useState([]);
  const [edit,setEdit] = useState(false);
  const [form,setForm] = useState({});
  const [saving,setSaving] = useState(false);
  const [msg,setMsg]   = useState("");

  useEffect(()=>{
    supabase.from("pth").select("*").eq("id",user.pth_id).single().then(({data})=>{ setPth(data); setForm(data||{}); });
    supabase.from("prodi").select("*").eq("pth_id",user.pth_id).then(({data})=>setProdi(data||[]));
  },[user.pth_id]);

  const save = async () => {
    setSaving(true);
    await supabase.from("pth").update({ ...form,updated_at:new Date().toISOString() }).eq("id",user.pth_id);
    setPth(form); setEdit(false); setMsg("Profil berhasil disimpan!");
    setSaving(false); setTimeout(()=>setMsg(""),3000);
  };

  if (!pth) return <Spin />;

  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:20 }} className="page-title">Profil PTH</h2>
      {msg && <Alert type="success" msg={msg} />}
      <div className="card" style={{ padding:20,marginBottom:16 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <h3 style={{ fontWeight:800,color:T.navy,fontSize:15 }}>{pth.nama}</h3>
          <button onClick={()=>setEdit(!edit)} className="btn btn-ghost">{edit?"Batal":"✏️ Edit"}</button>
        </div>
        {edit ? (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {[["Nama SK","nama_sk"],["Badan Penyelenggara","badan_penyelenggara"],["Kota","kota"],["Provinsi","provinsi"],["Website","website"]].map(([l,k])=>(
              <div key={k} style={{ gridColumn:k==="badan_penyelenggara"?"1/-1":"auto" }}>
                <FieldRow label={l}><input value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} /></FieldRow>
              </div>
            ))}
            <div>
              <FieldRow label="Akreditasi">
                <select value={form.akreditasi||""} onChange={e=>setForm({...form,akreditasi:e.target.value})}>
                  {["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}
                </select>
              </FieldRow>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <button onClick={save} disabled={saving} className="btn btn-green">{saving?"Menyimpan...":"Simpan"}</button>
            </div>
          </div>
        ) : (
          <div className="two-col" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
            {[["Nama SK",pth.nama_sk],["Badan Penyelenggara",pth.badan_penyelenggara],["Struktur",pth.struktur],["Akreditasi",pth.akreditasi],["Kota",pth.kota],["Provinsi",pth.provinsi]].map(([l,v])=>(
              <div key={l} style={{ background:T.bg,borderRadius:9,padding:"10px 14px" }}>
                <div style={{ fontSize:10,color:T.muted,fontWeight:700 }}>{l}</div>
                <div style={{ fontWeight:700,color:T.navy,fontSize:13,marginTop:3 }}>{v||"-"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h3 style={{ fontWeight:800,color:T.navy,marginBottom:12 }}>Program Studi ({prodi.length})</h3>
      <div className="two-col" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
        {prodi.length===0 ? (
          <div className="card" style={{ padding:18,gridColumn:"1/-1",textAlign:"center",color:T.muted,fontSize:13 }}>
            Belum ada prodi — otomatis terdaftar saat upload data pertama.
          </div>
        ) : prodi.map(p=>(
          <div key={p.id} className="card" style={{ padding:14 }}>
            <div style={{ fontWeight:700,color:T.navy,marginBottom:8,fontSize:13 }}>{p.nama}</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              <Tag label={p.jenjang||"-"} color={T.cyan} />
              <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAGE DATA PTH ───────────────────────────────────────────────── */
function PageDataPTH({ pthList }) {
  const [sel,setSel] = useState(null);
  const p = pthList.find(x=>x.id===sel);

  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:20 }} className="page-title">Data PTH</h2>
      {sel && p ? (
        <div className="fade-up">
          <BackBtn onClick={()=>setSel(null)} />
          <div className="card" style={{ padding:20,marginBottom:16 }}>
            <h3 style={{ fontWeight:900,color:T.navy }}>{p.nama}</h3>
            <p style={{ color:T.muted,marginTop:4,fontSize:13 }}>{p.kota}, {p.provinsi}</p>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:10 }}>
              <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)} />
              <Tag label={p.profil_lengkap?"Profil Lengkap":"Profil Belum Lengkap"} color={p.profil_lengkap?T.green:T.orange} />
            </div>
          </div>
          <h3 style={{ fontWeight:800,color:T.navy,marginBottom:12 }}>Prodi ({(p.prodi||[]).length})</h3>
          <div className="two-col" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
            {(p.prodi||[]).map(pr=>(
              <div key={pr.id} className="card" style={{ padding:14 }}>
                <div style={{ fontWeight:700,color:T.navy,fontSize:13,marginBottom:8 }}>{pr.nama}</div>
                <div style={{ display:"flex",gap:6 }}>
                  <Tag label={pr.jenjang||"-"} color={T.cyan} />
                  <Tag label={`Akr. ${pr.akreditasi||"-"}`} color={akrColor(pr.akreditasi)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="two-col pth-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
          {pthList.map(p=>(
            <div key={p.id} className="card" style={{ padding:18,cursor:"pointer" }}
              onClick={()=>setSel(p.id)}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.blue}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div style={{ fontWeight:800,color:T.navy,marginBottom:6,fontSize:14 }}>{p.nama}</div>
              <div style={{ fontSize:12,color:T.muted,marginBottom:10 }}>📍 {p.kota}, {p.provinsi}</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                <Tag label={`${(p.prodi||[]).length} Prodi`} color={T.cyan} />
                <Tag label={p.profil_lengkap?"Lengkap":"Belum Lengkap"} color={p.profil_lengkap?T.green:T.orange} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PAGE USERS ──────────────────────────────────────────────────── */
function PageUsers() {
  const [users,setUsers] = useState([]);
  useEffect(()=>{
    supabase.from("user_roles").select("*,pth(nama)").order("pth_id").then(({data})=>setUsers(data||[]));
  },[]);
  return (
    <div>
      <h2 style={{ fontWeight:900,color:T.navy,marginBottom:20 }} className="page-title">Kelola User</h2>
      <div className="card table-wrap" style={{ overflow:"hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th className="hide-mobile">PTH</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u,i)=>(
              <tr key={i}>
                <td style={{ fontWeight:700,color:T.navy,fontSize:13 }}>{u.nama}</td>
                <td><Tag label={u.role==="superadmin"?"Super Admin":"Admin PTH"} color={u.role==="superadmin"?T.accent:T.blue} /></td>
                <td className="hide-mobile" style={{ color:T.muted,fontSize:12 }}>{u.pth?.nama||"— Semua PTH —"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── ROOT APP ────────────────────────────────────────────────────── */
export default function App() {
  const [showLogin,setShowLogin] = useState(false);
  const [user,setUser]           = useState(null);
  const [checking,setChecking]   = useState(false);
  const [needProfil,setNeedProfil] = useState(false);

  const handleLogin = async u => {
    setShowLogin(false); setUser(u);
    if (u.role==="pth") {
      setChecking(true);
      const { data } = await supabase.from("pth").select("profil_lengkap").eq("id",u.pth_id).single();
      setNeedProfil(!data?.profil_lengkap);
      setChecking(false);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setNeedProfil(false); };

  if (checking) return <div style={{ height:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}><Spin /></div>;
  if (user && needProfil) return <FormProfilPTH user={user} onDone={()=>setNeedProfil(false)} />;

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex",flexDirection:"column",height:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif",background:T.bg }}>
        {showLogin && <LoginModal onLogin={handleLogin} onClose={()=>setShowLogin(false)} />}

        {!user ? (
          <>
            <PublicHeader onLoginClick={()=>setShowLogin(true)} />
            <PublicDashboard />
          </>
        ) : (
          <>
            {/* Admin header */}
            <header style={{ background:T.navy,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,flexShrink:0,position:"sticky",top:0,zIndex:50 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:30,height:30,background:T.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:11 }}>PD</div>
                <span style={{ fontWeight:900,color:"#fff",fontSize:14 }}>PDDIKTI <span style={{ color:"#64748b",fontSize:11,fontWeight:500 }}>— Admin</span></span>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ color:"#94a3b8",fontSize:11 }} className="hide-mobile">👤 {user.nama}</span>
                <button onClick={handleLogout} style={{ background:"#ffffff14",color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontWeight:700,fontSize:12,cursor:"pointer" }}>Logout</button>
              </div>
            </header>
            <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
              <AdminPanel user={user} onLogout={handleLogout} />
            </div>
          </>
        )}
      </div>
    </>
  );
}


