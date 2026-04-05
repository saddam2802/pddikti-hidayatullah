import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024 };
}

const T = {
  navy:"#0d2137", navyM:"#163352", navyL:"#1e4472",
  accent:"#f0a500", blue:"#1a6fd4", blueL:"#e8f1fb",
  green:"#15803d", greenL:"#f0fdf4", red:"#dc2626", redL:"#fef2f2",
  orange:"#c2570a", orangeL:"#fff7ed", cyan:"#0e7490", cyanL:"#ecfeff",
  purple:"#6d28d9", teal:"#0f766e",
  border:"#dde6ef", bg:"#f4f7fb", text:"#1a2535", muted:"#64748b",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f7fb}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-thumb{background:#dde6ef;border-radius:99px}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .fade-up{animation:fadeUp 0.35s ease both}
  .card{background:#fff;border-radius:16px;border:1px solid #dde6ef;box-shadow:0 2px 16px #00000008}
  .btn{border:none;cursor:pointer;font-family:inherit;font-weight:700;border-radius:10px;transition:all 0.15s}
  .btn:active{transform:scale(0.97)}
  .btn-primary{background:#0d2137;color:#fff;padding:11px 22px;font-size:14px}
  .btn-primary:hover{background:#1e4472}
  .btn-accent{background:#f0a500;color:#0d2137;padding:10px 20px;font-size:13px}
  .btn-ghost{background:#f4f7fb;color:#1a2535;padding:9px 16px;font-size:13px}
  .btn-ghost:hover{background:#dde6ef}
  .btn-green{background:#15803d;color:#fff;padding:10px 20px;font-size:13px}
  .btn-red{background:#dc2626;color:#fff;padding:10px 20px;font-size:13px}
  .btn-outline{background:transparent;color:#0d2137;padding:9px 16px;font-size:13px;border:1.5px solid #dde6ef;cursor:pointer;font-family:inherit;font-weight:700;border-radius:10px;transition:all 0.15s}
  .btn-outline:hover{background:#f4f7fb}
  .clickable-stat{cursor:pointer;transition:all 0.15s}
  .clickable-stat:hover{transform:translateY(-3px);box-shadow:0 8px 24px #1a6fd420;border-color:#1a6fd4!important}
  .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:0.02em}
  input,select,textarea{font-family:inherit;font-size:14px;border:1.5px solid #dde6ef;border-radius:10px;outline:none;padding:10px 14px;width:100%;transition:border-color 0.15s}
  input:focus,select:focus,textarea:focus{border-color:#1a6fd4}
  label{font-size:12px;font-weight:700;color:#1a2535;display:block;margin-bottom:6px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{padding:11px 14px;text-align:left;font-weight:800;color:#1a2535;background:#f4f7fb;border-bottom:1.5px solid #dde6ef;white-space:nowrap}
  td{padding:11px 14px;border-bottom:1px solid #dde6ef;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#f8faff}
  .bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .bar-label{font-size:12px;color:#1a2535;font-weight:600;min-width:140px;max-width:140px;flex-shrink:0;word-break:break-word;line-height:1.3}
  .bar-track{flex:1;background:#f4f7fb;border-radius:99px;height:10px;overflow:hidden}
  .bar-fill{height:100%;border-radius:99px;transition:width 0.5s ease}
  .bar-val{font-size:12px;font-weight:800;color:#0d2137;min-width:40px;text-align:right;font-family:'DM Mono',monospace}
  .mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#0d2137;z-index:100;border-top:1px solid #1e4472}
  @media(max-width:639px){
    .mobile-nav{display:flex}
    .desktop-sidebar{display:none!important}
    .main-content{padding:16px 14px 80px!important}
    .page-title{font-size:17px!important}
    .stat-grid{grid-template-columns:repeat(2,1fr)!important}
    .pth-grid{grid-template-columns:1fr!important}
    .two-col{grid-template-columns:1fr!important}
    .table-wrap{overflow-x:auto}
    .hide-mobile{display:none!important}
  }
  @media(min-width:640px) and (max-width:1023px){
    .main-content{padding:20px!important}
    .stat-grid{grid-template-columns:repeat(2,1fr)!important}
    .pth-grid{grid-template-columns:repeat(2,1fr)!important}
    .two-col{grid-template-columns:1fr!important}
  }
`;

/* ── SHARED ── */
const Tag = ({ label, color=T.blue, bg }) => (
  <span className="tag" style={{ background:bg||(color+"18"), color, border:`1px solid ${color}33` }}>{label}</span>
);
const akrColor = a => {
  if (!a) return T.muted;
  if (["A","Unggul"].includes(a)) return T.green;
  if (["B","Baik Sekali"].includes(a)) return T.blue;
  return T.orange;
};
const Spin = () => (
  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
    <div style={{ width:28,height:28,border:"3px solid #dde6ef",borderTop:"3px solid #1a6fd4",borderRadius:"50%",animation:"spin 0.7s linear infinite" }} />
  </div>
);
const Alert = ({ type="info", msg }) => {
  const map = { error:[T.red,T.redL], success:[T.green,T.greenL], info:[T.blue,T.blueL], warn:[T.orange,T.orangeL] };
  const [fg,bg] = map[type]||map.info;
  return <div style={{ background:bg,border:`1.5px solid ${fg}33`,borderRadius:12,padding:"10px 16px",color:fg,fontSize:13,fontWeight:600,marginBottom:14 }}>{msg}</div>;
};
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-ghost" style={{ marginBottom:16,fontSize:13 }}>← Kembali</button>
);
const FieldRow = ({ label, children }) => (
  <div style={{ marginBottom:14 }}><label>{label}</label>{children}</div>
);
const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:16 }}>
    <h2 style={{ fontWeight:900,color:T.navy,fontSize:18 }} className="page-title">{title}</h2>
    {sub && <p style={{ color:T.muted,fontSize:13,marginTop:4 }}>{sub}</p>}
  </div>
);
const StatCard = ({ icon, value, label, color=T.navy, sub, onClick, hint }) => (
  <div className={"card fade-up"+(onClick?" clickable-stat":"")} style={{ padding:"18px 16px" }} onClick={onClick}>
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
      <div style={{flex:1}}>
        <div style={{ fontSize:22,marginBottom:6 }}>{icon}</div>
        <div style={{ fontSize:24,fontWeight:900,color,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.03em",display:"flex",alignItems:"center",flexWrap:"wrap",gap:4 }}>{value ?? 0}</div>
        <div style={{ fontSize:12,fontWeight:700,color:T.text,marginTop:4 }}>{label}</div>
        {sub && <div style={{ fontSize:11,color:T.muted,marginTop:2 }}>{sub}</div>}
      </div>
      {onClick && <div style={{ fontSize:18,color:T.muted,opacity:0.4 }}>›</div>}
    </div>
    {hint && <div style={{ fontSize:10,color:T.blue,marginTop:8,fontWeight:700 }}>🔍 {hint}</div>}
  </div>
);
const BarChart = ({ data, color=T.blue }) => {
  const max = Math.max(...data.map(d=>d.value), 1);
  return (
    <div>
      {data.map((d,i) => (
        <div key={i} className="bar-row">
          <div className="bar-label">{d.label}</div>
          <div className="bar-track"><div className="bar-fill" style={{ width:`${(d.value/max)*100}%`, background:d.color||color }} /></div>
          <div className="bar-val">{(d.value||0).toLocaleString("id-ID")}</div>
        </div>
      ))}
    </div>
  );
};

/* ── EXCEL PARSER ── */
function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type:"array" });
        const res = { identitas:{}, daftarProdi:[], prodi:{}, pth:{} };
        const ws1 = wb.Sheets["Identitas"];
        if (!ws1) return reject("Sheet 'Identitas' tidak ditemukan");
        XLSX.utils.sheet_to_json(ws1,{header:1,defval:""}).forEach(r=>{
          const v=String(r[2]||"").replace(/^\*\s*/,"").trim(); if(!v)return;
          const l=String(r[1]||"");
          if(l.includes("Nama Perguruan")) res.identitas.nama_pth=v;
          if(l.includes("Semester")) res.identitas.semester=v;
          if(l.includes("Tahun Akademik")) res.identitas.tahun_akademik=v;
        });
        if(!res.identitas.nama_pth) return reject("Nama PTH kosong");
        if(!res.identitas.semester) return reject("Semester kosong");
        if(!res.identitas.tahun_akademik) return reject("Tahun Akademik kosong");
        const ws2=wb.Sheets["Daftar Prodi"];
        if(!ws2) return reject("Sheet 'Daftar Prodi' tidak ditemukan");
        XLSX.utils.sheet_to_json(ws2,{header:1,defval:""}).forEach((r,i)=>{
          if(i<5)return;
          const nama=String(r[1]||"").trim();
          if(!nama||nama.startsWith("["))return;
          res.daftarProdi.push({nama,jenjang:String(r[2]||"").trim(),akreditasi:String(r[3]||"").trim()});
        });
        if(!res.daftarProdi.length) return reject("Daftar Prodi kosong");
        res.daftarProdi.forEach(prodi=>{
          const ws=wb.Sheets[prodi.nama]; if(!ws)return;
          const d={dosen:{},tendik:{},mahasiswa:{}};
          XLSX.utils.sheet_to_json(ws,{header:1,defval:""}).forEach(r=>{
            const v=parseInt(String(r[2]||"0").replace(/^\*\s*/,""))||0;
            const l=String(r[1]||"");
            if(l.includes("Pendidikan S2")) d.dosen.s2=v;
            if(l.includes("Pendidikan S3")) d.dosen.s3=v;
            if(l.includes("Tanpa JAD")&&l.includes("Kader")&&!l.includes("Non")) d.dosen.tanpa_jad_kader=v;
            if(l.includes("Tanpa JAD")&&l.includes("Non")) d.dosen.tanpa_jad_non_kader=v;
            if(l.includes("Asisten Ahli")&&!l.includes("Non")) d.dosen.asisten_ahli_kader=v;
            if(l.includes("Asisten Ahli")&&l.includes("Non")) d.dosen.asisten_ahli_non_kader=v;
            if(l.includes("Lektor")&&!l.includes("Kepala")&&!l.includes("Non")&&!l.includes("Asisten")) d.dosen.lektor_kader=v;
            if(l.includes("Lektor")&&!l.includes("Kepala")&&l.includes("Non")) d.dosen.lektor_non_kader=v;
            if(l.includes("Lektor Kepala")&&!l.includes("Non")) d.dosen.lektor_kepala_kader=v;
            if(l.includes("Lektor Kepala")&&l.includes("Non")) d.dosen.lektor_kepala_non_kader=v;
            if(l.includes("Guru Besar")&&!l.includes("Non")) d.dosen.guru_besar_kader=v;
            if(l.includes("Guru Besar")&&l.includes("Non")) d.dosen.guru_besar_non_kader=v;
            if(l.includes("Tendik")&&l.includes("Kader")&&!l.includes("Non")) d.tendik.kader=v;
            if(l.includes("Tendik")&&l.includes("Non")) d.tendik.non_kader=v;
            if(l.includes("Student Body")) d.mahasiswa.student_body=v;
            if(l.includes("Mahasiswa Baru")&&l.includes("Kader")&&!l.includes("Non")&&!l.includes("Total")) d.mahasiswa.baru_kader=v;
            if(l.includes("Mahasiswa Baru")&&l.includes("Non")) d.mahasiswa.baru_non_kader=v;
            if(l.includes("Total Mahasiswa Baru")) d.mahasiswa.total_baru=v;
            if(l.includes("Kader")&&l.includes("Aktif")&&!l.includes("Non")&&!l.includes("Total")) d.mahasiswa.aktif_kader=v;
            if((l.includes("Non Boarding")||l.includes("Non-Boarding")||l.includes("Aktif Non"))&&l.includes("Aktif")) d.mahasiswa.aktif_non_kader=v;
            if(l.includes("Total Mahasiswa Aktif")) d.mahasiswa.total_aktif=v;
            if(l.includes("Dalam Negeri")) d.mahasiswa.prestasi_dn=v;
            if(l.includes("Internasional")) d.mahasiswa.prestasi_int=v;
          });
          if(!d.mahasiswa.total_baru) d.mahasiswa.total_baru=(d.mahasiswa.baru_kader||0)+(d.mahasiswa.baru_non_kader||0);
          if(!d.mahasiswa.total_aktif) d.mahasiswa.total_aktif=(d.mahasiswa.aktif_kader||0)+(d.mahasiswa.aktif_non_kader||0);
          res.prodi[prodi.nama]=d;
        });
        const wsPTH=wb.Sheets["PTH"];
        if(wsPTH){
          XLSX.utils.sheet_to_json(wsPTH,{header:1,defval:""}).forEach(r=>{
            const v=String(r[2]||"").replace(/^\*\s*/,"").trim();
            const l=String(r[1]||""); const n=parseInt(v)||0; const f=parseFloat(v)||0;
            if(l.includes("Jurnal yang dikelola")) res.pth.jumlah_jurnal=n;
            if(l.includes("Akreditasi Jurnal")) res.pth.akreditasi_jurnal=v;
            if(l.includes("Sinta Score")) res.pth.sinta_score=f;
            if(l.includes("Google Scholar")&&l.includes("Artikel")) res.pth.gscholar_artikel=n;
            if(l.includes("Google Scholar")&&l.includes("Sitasi")) res.pth.gscholar_citation=n;
            if(l.includes("Scopus")&&l.includes("Artikel")) res.pth.scopus_artikel=n;
            if(l.includes("Scopus")&&l.includes("Sitasi")) res.pth.scopus_citation=n;
            if(l.includes("Hibah")&&l.includes("Pemerintah")) res.pth.hibah_pemerintah=n;
            if(l.includes("Hibah")&&l.includes("Eksternal")) res.pth.hibah_eksternal=n;
            if(l.includes("Luar Negeri")) res.pth.kerjasama_ln=n;
            if(l.includes("Dalam Negeri")&&l.includes("Kerjasama")) res.pth.kerjasama_dn=n;
            if(l.includes("Alumni")&&l.includes("Kader")&&!l.includes("Non")) res.pth.alumni_kader=n;
            if(l.includes("Alumni")&&l.includes("Non")) res.pth.alumni_non_kader=n;
            if(l.includes("Nama Ketua")) res.pth.nama_ketua_alumni=v;
            if(l.includes("Nomor HP")) res.pth.hp_ketua_alumni=v;
          });
        }
        resolve(res);
      } catch(e){reject("Gagal membaca file: "+e.message)}
    };
    reader.onerror=()=>reject("Gagal membuka file");
    reader.readAsArrayBuffer(file);
  });
}

/* ── LOGIN MODAL ── */
function LoginModal({ onLogin, onClose }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const doLogin = async () => {
    if(!email||!pass) return setErr("Email dan password wajib diisi.");
    setLoading(true); setErr("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password:pass});
    if(error){setErr("Email atau password salah.");setLoading(false);return;}
    const {data:rd}=await supabase.from("user_roles").select("*,pth(*)").eq("user_id",data.user.id).single();
    if(!rd){setErr("Akun tidak memiliki role.");setLoading(false);return;}
    onLogin({...data.user,role:rd.role,pth_id:rd.pth_id,nama:rd.nama,pth:rd.pth});
    setLoading(false);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"#00000077",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div className="card fade-up" style={{width:"100%",maxWidth:380,padding:28,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",color:T.muted}}>✕</button>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{width:48,height:48,background:T.accent,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:18,margin:"0 auto 10px"}}>PD</div>
          <h3 style={{fontWeight:900,color:T.navy,fontSize:18}}>Login Admin</h3>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>PDDIKTI Hidayatullah</p>
        </div>
        {err&&<Alert type="error" msg={err}/>}
        <FieldRow label="Email"><input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} type="email" placeholder="admin@hidayatullah.ac.id"/></FieldRow>
        <FieldRow label="Password"><input value={pass} type="password" onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></FieldRow>
        <button onClick={doLogin} disabled={loading} className="btn btn-primary" style={{width:"100%",marginTop:4}}>{loading?"Memverifikasi...":"Masuk →"}</button>
      </div>
    </div>
  );
}

/* ── FORM PROFIL PTH ── */
function FormProfilPTH({ user, onDone, onLogout }) {
  const [form,setForm]=useState({nama_sk:"",badan_penyelenggara:"",struktur:"",akreditasi:"",kota:"",provinsi:"",website:"",telp:""});
  const [saving,setSaving]=useState(false); const [err,setErr]=useState("");
  const save = async () => {
    if(!form.nama_sk||!form.kota) return setErr("Nama SK dan Kota wajib diisi.");
    setSaving(true);
    const {error}=await supabase.from("pth").update({...form,profil_lengkap:true,updated_at:new Date().toISOString()}).eq("id",user.pth_id);
    if(error){setErr("Gagal menyimpan: "+error.message+". Pastikan koneksi internet stabil dan coba lagi.");setSaving(false);return;} onDone();
  };
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      {/* Tombol logout di pojok kanan atas */}
      <div style={{position:"fixed",top:16,right:16,zIndex:100}}>
        <button onClick={onLogout} style={{background:T.navy,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontWeight:700,fontSize:12,cursor:"pointer",boxShadow:"0 2px 8px #00000033"}}>🚪 Logout</button>
      </div>
      <div className="card fade-up" style={{width:"100%",maxWidth:560,padding:32}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:52,height:52,background:T.accent,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:20,margin:"0 auto 12px"}}>🏛️</div>
          <h2 style={{fontWeight:900,color:T.navy}}>Lengkapi Profil PTH</h2>
          <p style={{color:T.muted,fontSize:13,marginTop:6}}>Isi data berikut untuk melanjutkan. Hanya dilakukan sekali.</p>
        </div>
        {err&&<Alert type="error" msg={err}/>}
        <div style={{display:"grid",gridTemplateColumns:window.innerWidth<600?"1fr":"1fr 1fr",gap:"0 16px"}}>
          {[["nama_sk","Nama SK Pendirian"],["badan_penyelenggara","Badan Penyelenggara"],["kota","Kota/Kabupaten"],["provinsi","Provinsi"],["website","Website"],["telp","No. Telepon"]].map(([k,l])=>(
            <FieldRow key={k} label={l}><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></FieldRow>
          ))}
          <FieldRow label="Struktur">
            <select value={form.struktur} onChange={e=>setForm({...form,struktur:e.target.value})}>
              <option value="">— Pilih —</option>
              {["STAI","STIT","STIE","STIS","STIKMA","IAI","Institut","Universitas"].map(o=><option key={o}>{o}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Akreditasi">
            <select value={form.akreditasi} onChange={e=>setForm({...form,akreditasi:e.target.value})}>
              <option value="">— Pilih —</option>
              {["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}
            </select>
          </FieldRow>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-green" style={{width:"100%",marginTop:8}}>{saving?"Menyimpan...":"Simpan & Lanjutkan →"}</button>
      </div>
    </div>
  );
}

/* ── ACCORDION DOSEN CARD ── */
function AccordionDosenCard({ title, items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="card" style={{ padding:20 }}>
      <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>{title}</h3>
      {items.map(({label, value, color, perPTH})=>(
        <div key={label}>
          <div onClick={()=>setOpen(open===label?null:label)}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", cursor:"pointer", borderBottom:"1px solid #dde6ef", userSelect:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0 }}/>
              <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{label}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontWeight:800, color, fontSize:15 }}>{value}</span>
              <span style={{ color:T.muted, fontSize:11, transition:"transform 0.2s", display:"inline-block", transform:open===label?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
            </div>
          </div>
          {open===label&&(
            <div className="fade-up" style={{ padding:"12px 0 6px" }}>
              <div style={{ fontSize:11, fontWeight:800, color:T.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Per PTH</div>
              <BarChart color={color} data={perPTH}/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── PUBLIC HEADER ── */
function PublicHeader({ onLoginClick }) {
  return (
    <header style={{background:T.navy,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,flexShrink:0,position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,background:T.accent,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:13,flexShrink:0}}>PD</div>
        <div>
          <div style={{fontWeight:900,color:"#fff",fontSize:14,lineHeight:1.2}}>PDDIKTI Hidayatullah</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>Pangkalan Data PTH</div>
        </div>
      </div>
      <button onClick={onLoginClick} className="btn btn-accent" style={{fontSize:12,padding:"7px 14px"}}>🔐 Login</button>
    </header>
  );
}

/* ── PUBLIC TABS ── */
function PublicTabs({ active, setActive }) {
  const tabs=[{key:"dashboard",icon:"📊",label:"Dashboard"},{key:"pth",icon:"🏛️",label:"PTH"},{key:"prodi",icon:"📚",label:"Prodi"},{key:"statistik",icon:"📈",label:"Statistik"}];
  return (
    <>
      <div style={{background:"#fff",borderBottom:"1px solid #dde6ef",display:"flex",padding:"0 20px",overflowX:"auto"}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActive(t.key)} style={{padding:"13px 18px",border:"none",background:"none",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",color:active===t.key?T.blue:T.muted,borderBottom:active===t.key?"3px solid "+T.blue:"3px solid transparent"}}>{t.icon} {t.label}</button>
        ))}
      </div>
      <div className="mobile-nav">
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActive(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 4px",border:"none",background:"none",cursor:"pointer",color:active===t.key?T.accent:"#94a3b8"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:700}}>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ── STATISTIK DRILL-DOWN ── */
function PageStatistik({ pthList, prodiList, stats, FilterBar=()=>null, GrowthBadge=()=>null, prevStats={}, initialDrill=null }) {
  const [drill, setDrill] = useState(initialDrill);
  const { isMobile } = useBreakpoint();
  const { mhs, dosen, alumni, penelitian } = stats;

  const truncName = n => n.length > 22 ? n.substring(0, 22) + "…" : n;

  /* ── Detail Alumni ── */
  if (drill === "alumni") return (
    <div className="fade-up">
      <BackBtn onClick={() => setDrill(null)} />
      <SectionTitle title="👨‍🎓 Alumni" sub="Jumlah alumni kader dan non-kader per PTH" />
      <FilterBar/>
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <StatCard icon="👨‍🎓" value={alumni.total.toLocaleString("id-ID")} label="Jumlah Total Alumni" color={T.navy} sub={<GrowthBadge cur={alumni.total} prev={prevStats.alumni}/>}/>
        <StatCard icon="🟢" value={alumni.kader.toLocaleString("id-ID")} label="Jumlah Alumni Kader" color={T.green} />
        <StatCard icon="🔵" value={alumni.non_kader.toLocaleString("id-ID")} label="Jumlah Alumni Non-Kader" color={T.blue} />
      </div>
      <div className="card" style={{ padding:20 }}>
        <h3 style={{ fontWeight:800, color:T.navy, marginBottom:14, fontSize:14 }}>Kader vs Non-Kader</h3>
        <BarChart data={[
          { label:"Alumni Kader", value:alumni.kader, color:T.green },
          { label:"Alumni Non-Kader", value:alumni.non_kader, color:T.blue },
        ]} />
      </div>
    </div>
  );

  /* ── Detail Mahasiswa ── */
  if (drill === "mahasiswa") return (
    <div className="fade-up">
      <BackBtn onClick={() => setDrill(null)} />
      <SectionTitle title="🎓 Mahasiswa" sub="Data mahasiswa seluruh PTH" />
      {/* Baris 1: Total + per PTH */}
      <FilterBar/>
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <StatCard icon="🎓" value={mhs.total_aktif.toLocaleString("id-ID")} label="Jumlah Total Mahasiswa" color={T.navy} sub={<GrowthBadge cur={mhs.total_aktif} prev={prevStats.mhs}/>}/>
        <StatCard icon="🆕" value={mhs.total_baru.toLocaleString("id-ID")} label="Total Mahasiswa Baru" color={T.cyan} />
        <StatCard icon="🟢" value={mhs.aktif_kader.toLocaleString("id-ID")} label="Kader Aktif" color={T.green} />
        <StatCard icon="🏆" value={(mhs.prestasi_dn + mhs.prestasi_int).toLocaleString("id-ID")} label="Prestasi Total" color={T.purple} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12, marginBottom:12 }}>
        {/* Jumlah Mahasiswa per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Jumlah Mahasiswa per PTH</h3>
          <BarChart color={T.blue} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: (p.prodi||[]).reduce((s,pr) => s + (pr.latest_mhs?.total_mhs_aktif||0), 0)
          }))} />
        </div>
        {/* Kader Aktif per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Jumlah Mahasiswa Kader Aktif per PTH</h3>
          <BarChart color={T.green} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: (p.prodi||[]).reduce((s,pr) => s + (pr.latest_mhs?.mhs_aktif_kader||0), 0)
          }))} />
        </div>
        {/* Mahasiswa Baru per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Jumlah Total Mahasiswa Baru per PTH</h3>
          <BarChart color={T.cyan} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: (p.prodi||[]).reduce((s,pr) => s + (pr.latest_mhs?.total_mhs_baru||0), 0)
          }))} />
        </div>
        {/* Mahasiswa Baru Kader per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Jumlah Mahasiswa Baru Kader per PTH</h3>
          <BarChart color={T.teal} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: (p.prodi||[]).reduce((s,pr) => s + (pr.latest_mhs?.mhs_baru_kader||0), 0)
          }))} />
        </div>
        {/* Prestasi Total */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Prestasi Mahasiswa Total</h3>
          <BarChart data={[
            { label:"Dalam Negeri", value:mhs.prestasi_dn, color:T.blue },
            { label:"Internasional", value:mhs.prestasi_int, color:T.purple },
          ]} />
        </div>
        {/* Prestasi per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Prestasi Mahasiswa per PTH</h3>
          <BarChart color={T.purple} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: (p.prodi||[]).reduce((s,pr) => s + (pr.latest_mhs?.prestasi_dalam_negeri||0) + (pr.latest_mhs?.prestasi_internasional||0), 0)
          }))} />
        </div>
      </div>
    </div>
  );

  /* ── Detail Dosen ── */
  if (drill === "dosen") return (
    <div className="fade-up">
      <BackBtn onClick={() => setDrill(null)} />
      <SectionTitle title="👩‍🏫 Dosen" sub="Data dosen seluruh PTH" />
      <FilterBar/>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        {/* Berdasarkan Level Kaderisasi - Accordion */}
        <AccordionDosenCard
          title="Berdasarkan Level Kaderisasi"
          items={[
            {label:"Dosen Kader", value:dosen.kader, color:T.green, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.tanpa_jad_kader||0)+(d.asisten_ahli_kader||0)+(d.lektor_kader||0)+(d.lektor_kepala_kader||0)+(d.guru_besar_kader||0)},0)}))},
            {label:"Dosen Non-Kader", value:dosen.non_kader, color:T.muted, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_non_kader||0)},0)}))},
          ]}
        />
        {/* Berdasarkan Pendidikan - Accordion */}
        <AccordionDosenCard
          title="Berdasarkan Pendidikan"
          items={[
            {label:"S3 / Doktor", value:dosen.s3, color:T.blue, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>s+(pr.latest_dosen?.dosen_s3||0),0)}))},
            {label:"S2 / Magister", value:dosen.s2, color:T.cyan, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>s+(pr.latest_dosen?.dosen_s2||0),0)}))},
          ]}
        />
        {/* Berdasarkan Jabatan Akademik - Accordion */}
        <AccordionDosenCard
          title="Berdasarkan Jabatan Akademik"
          items={[
            {label:"Guru Besar", value:dosen.guru_besar, color:"#7c3aed", perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)},0)}))},
            {label:"Lektor Kepala", value:dosen.lektor_kepala, color:T.blue, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)},0)}))},
            {label:"Lektor", value:dosen.lektor, color:T.cyan, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.lektor_kader||0)+(d.lektor_non_kader||0)},0)}))},
            {label:"Asisten Ahli", value:dosen.asisten_ahli, color:T.teal, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)},0)}))},
            {label:"Tanpa JAD", value:dosen.tanpa_jad, color:T.muted, perPTH:pthList.map(p=>({label:truncName(p.nama),value:(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)},0)}))},
          ]}
        />
      </div>
    </div>
  );

  /* ── Detail Penelitian & PkM ── */
  if (drill === "penelitian") return (
    <div className="fade-up">
      <BackBtn onClick={() => setDrill(null)} />
      <SectionTitle title="🔬 Penelitian & Pengabdian Masyarakat" sub="Data publikasi dan pengabdian seluruh PTH" />
      <FilterBar/>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12, marginBottom:12 }}>
        {/* Sinta Score per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Sinta Score PTH</h3>
          <BarChart color={T.navy} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: parseFloat(p.latest_penelitian?.sinta_score) || 0
          }))} />
        </div>
        {/* Google Scholar Artikel per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Google Score PTH (Artikel GScholar)</h3>
          <BarChart color={T.blue} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: p.latest_penelitian?.gscholar_artikel || 0
          }))} />
        </div>
        {/* Google Citation per PTH */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Google Citation PTH</h3>
          <BarChart color={T.cyan} data={pthList.map(p => ({
            label: truncName(p.nama),
            value: p.latest_penelitian?.gscholar_citation || 0
          }))} />
        </div>
        {/* Rekap tabel */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontWeight:800, color:T.navy, marginBottom:12, fontSize:14 }}>Rekap Lengkap</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>PTH</th><th>Sinta</th><th>GScholar</th><th>Sitasi</th></tr></thead>
              <tbody>
                {pthList.map(p => {
                  const r = p.latest_penelitian || {};
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight:700, fontSize:12 }}>{p.nama}</td>
                      <td style={{ fontFamily:"'DM Mono',monospace", fontWeight:800, color:T.navy }}>{r.sinta_score||0}</td>
                      <td style={{ fontFamily:"'DM Mono',monospace" }}>{r.gscholar_artikel||0}</td>
                      <td style={{ fontFamily:"'DM Mono',monospace" }}>{r.gscholar_citation||0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Halaman Utama Statistik: 4 Kartu ── */
  return (
    <div className="fade-up">
      <SectionTitle title="📈 Statistik" sub="Pilih kategori untuk melihat data detail" />
      <FilterBar/>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:16 }}>
        {[
          { key:"alumni",     icon:"👨‍🎓", label:"Alumni",                   color:T.green,  desc:"Total · Kader · Non-Kader" },
          { key:"mahasiswa",  icon:"🎓",  label:"Mahasiswa",                color:T.blue,   desc:"Aktif · Baru · Kader · Prestasi" },
          { key:"dosen",      icon:"👩‍🏫", label:"Dosen",                    color:T.teal,   desc:"Kaderisasi · Pendidikan · Jabatan" },
          { key:"penelitian", icon:"🔬",  label:"Penelitian & PkM",         color:T.purple, desc:"Sinta · GScholar · Citation" },
        ].map(item => (
          <div key={item.key} className="card clickable-stat fade-up" style={{ padding:isMobile?"20px 16px":"28px 24px", cursor:"pointer", borderColor:T.border }}
            onClick={() => setDrill(item.key)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = ""; }}>
            <div style={{ fontSize:isMobile?36:48, marginBottom:16, lineHeight:1 }}>{item.icon}</div>
            <div style={{ fontWeight:900, color:item.color, fontSize:isMobile?16:20, marginBottom:6 }}>{item.label}</div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>{item.desc}</div>
            <div style={{ marginTop:16, fontSize:12, color:item.color, fontWeight:700 }}>Lihat detail →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PUBLIC DASHBOARD ── */
function PublicDashboard() {
  const [pthRaw,setPthRaw]=useState([]); // semua data mentah semua TA
  const [prodiList,setProdiList]=useState([]);
  const [allMhs,setAllMhs]=useState([]); const [allDosen,setAllDosen]=useState([]);
  const [allPenelitian,setAllPenelitian]=useState([]); const [allKerjasama,setAllKerjasama]=useState([]);
  const [loading,setLoading]=useState(true);
  // Baca hash URL untuk deep linking (misal: /#pth, /#prodi, /#statistik-mahasiswa)
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#','');
    if(['pth','prodi','statistik','dashboard'].includes(hash)) return hash;
    if(['statistik-mahasiswa','statistik-dosen','statistik-alumni','statistik-penelitian'].includes(hash)) return 'statistik';
    return 'dashboard';
  };
  const getInitialDrill = () => {
    const hash = window.location.hash.replace('#','');
    if(hash==='statistik-mahasiswa') return 'mahasiswa';
    if(hash==='statistik-dosen') return 'dosen';
    if(hash==='statistik-alumni') return 'alumni';
    if(hash==='statistik-penelitian') return 'penelitian';
    return null;
  };

  const [activePage,setActivePage]=useState(getInitialPage());
  const [drill,setDrill]=useState(getInitialDrill());
  const [selectedPTH,setSelectedPTH]=useState(null); const [selectedProdi,setSelectedProdi]=useState(null);
  const [pthPengurus,setPthPengurus]=useState({}); // cache: pth_id → pengurus[]
  const [filterMode,setFilterMode]=useState("berjalan"); // berjalan | tahun | kumulatif
  const [filterTA,setFilterTA]=useState(""); // dipilih kalau mode=tahun
  const {isMobile}=useBreakpoint();

  // Update hash saat navigasi
  const navTo = (page) => { setActivePage(page); setSelectedPTH(null); setSelectedProdi(null); window.location.hash = page; };

  useEffect(()=>{
    const loadData = async () => {
      // Step 1: Ambil PTH, Prodi, dan cari tahun akademik terbaru dulu
      const [{data:p},{data:pr},{data:latestTA}] = await Promise.all([
        supabase.from("pth").select("*,prodi(id,nama,jenjang,akreditasi,status,pth_id)").eq("status","Aktif").order("id"),
        supabase.from("prodi").select("*,pth(nama)").eq("status","Aktif"),
        supabase.from("data_mahasiswa").select("tahun_akademik").order("tahun_akademik",{ascending:false}).limit(1),
      ]);

      const latestTAVal = latestTA?.[0]?.tahun_akademik || null;
      // Ambil juga TA sebelumnya untuk perhitungan pertumbuhan
      const {data:allTA} = await supabase.from("data_mahasiswa")
        .select("tahun_akademik").order("tahun_akademik",{ascending:false});
      const uniqueTA = [...new Set((allTA||[]).map(r=>r.tahun_akademik))];
      const prevTAVal = uniqueTA[1] || null;

      // Step 2: Fetch data — default hanya tahun terbaru + tahun sebelumnya
      // Data kumulatif di-fetch nanti kalau user pilih mode kumulatif
      const taFilter = latestTAVal
        ? [latestTAVal, prevTAVal].filter(Boolean)
        : null;

      const fetchWithFilter = (table) => {
        let q = supabase.from(table).select("*").order("tahun_akademik");
        if(taFilter) q = q.in("tahun_akademik", taFilter);
        return q;
      };

      const [{data:mhs},{data:dos},{data:pen},{data:ks}] = await Promise.all([
        fetchWithFilter("data_mahasiswa"),
        fetchWithFilter("data_dosen"),
        fetchWithFilter("data_penelitian"),
        fetchWithFilter("data_kerjasama"),
      ]);

      setPthRaw(p||[]); setProdiList(pr||[]);
      setAllMhs(mhs||[]); setAllDosen(dos||[]);
      setAllPenelitian(pen||[]); setAllKerjasama(ks||[]);
      setLoading(false);
    };
    loadData();
  },[]);

  // Fetch semua data kalau mode kumulatif dipilih
  const [fullDataLoaded, setFullDataLoaded] = useState(false);
  useEffect(()=>{
    if(filterMode==="kumulatif" && !fullDataLoaded){
      Promise.all([
        supabase.from("data_mahasiswa").select("*").order("tahun_akademik"),
        supabase.from("data_dosen").select("*").order("tahun_akademik"),
        supabase.from("data_penelitian").select("*").order("tahun_akademik"),
        supabase.from("data_kerjasama").select("*").order("tahun_akademik"),
      ]).then(([{data:mhs},{data:dos},{data:pen},{data:ks}])=>{
        setAllMhs(mhs||[]); setAllDosen(dos||[]);
        setAllPenelitian(pen||[]); setAllKerjasama(ks||[]);
        setFullDataLoaded(true);
      });
    }
  },[filterMode]);

  // Daftar tahun akademik yang tersedia
  const allTA = [...new Set([
    ...allMhs.map(r=>r.tahun_akademik),
    ...allPenelitian.map(r=>r.tahun_akademik),
  ].filter(Boolean))].sort().reverse();

  const latestTA = allTA[0] || "";
  const prevTA   = allTA[1] || "";

  // Filter data berdasarkan mode
  // Normalisasi semester string → "Ganjil" | "Genap"
  // FIX v12 Bug4: handles "ganjil", "GANJIL", "Semester Ganjil", dst
  const normSemester = (s) => {
    if(!s) return "";
    const lower = String(s).toLowerCase();
    if(lower.includes("ganjil")) return "Ganjil";
    if(lower.includes("genap"))  return "Genap";
    return s;
  };

  // FIX v12 Bug1: filterData mode berjalan hanya filter by latestTA global.
  // PTH yang belum upload TA terbaru akan return [] di sini →
  // aggMhs/aggDosen menangani fallback ke data terbaru milik prodi itu sendiri.
  const filterData = (rows) => {
    if(filterMode==="berjalan") return rows.filter(r=>r.tahun_akademik===latestTA);
    if(filterMode==="tahun")    return rows.filter(r=>r.tahun_akademik===(filterTA||latestTA));
    return rows; // kumulatif = semua
  };

  // Agregasi data per prodi/pth berdasarkan filter
  // FIX v12: mahasiswa aktif & student_body = snapshot terbaru (bukan dijumlah antar semester)
  // mahasiswa baru & prestasi = boleh dijumlah (akumulatif dalam rentang filter)
  // FIX v12 Bug1: jika PTH belum upload latestTA global → fallback ke data terbaru milik prodi ini
  // FIX v12 Bug2: setiap prodi fetch data terbaru sendiri-sendiri (tidak dipengaruhi prodi lain)
  // FIX v12 Bug4: normalisasi semester sebelum sort
  const aggMhs = (prodiId) => {
    // Ambil semua data milik prodi ini tanpa filter TA (untuk fallback Bug1)
    const allProdiRows = allMhs.filter(r=>r.prodi_id===prodiId);
    if(!allProdiRows.length) return {};

    // Helper sort: terbaru dulu — normalisasi semester dulu (Bug4)
    const sortDesc = (arr) => [...arr].sort((a,b)=>{
      if(b.tahun_akademik !== a.tahun_akademik) return b.tahun_akademik > a.tahun_akademik ? 1 : -1;
      const sa = normSemester(a.semester); const sb = normSemester(b.semester);
      if(sa==="Genap" && sb==="Ganjil") return 1;
      if(sa==="Ganjil" && sb==="Genap") return -1;
      return 0;
    });

    // Data yang sesuai filter aktif
    let rows = filterData(allMhs).filter(r=>r.prodi_id===prodiId);

    // Bug1 Fallback: jika filter mengembalikan kosong (PTH belum upload TA terbaru),
    // gunakan data terbaru yang prodi ini punya — lebih baik tampil data lama daripada 0
    if(!rows.length) rows = [sortDesc(allProdiRows)[0]];

    const sortedDesc = sortDesc(rows);
    const latest = sortedDesc[0];

    // Mahasiswa baru & prestasi: dijumlah dalam rentang filter
    const sumBaru = rows.reduce((acc,r)=>({
      total_mhs_baru:(acc.total_mhs_baru||0)+(r.total_mhs_baru||0),
      mhs_baru_kader:(acc.mhs_baru_kader||0)+(r.mhs_baru_kader||0),
      mhs_baru_non_kader:(acc.mhs_baru_non_kader||0)+(r.mhs_baru_non_kader||0),
      prestasi_dalam_negeri:(acc.prestasi_dalam_negeri||0)+(r.prestasi_dalam_negeri||0),
      prestasi_internasional:(acc.prestasi_internasional||0)+(r.prestasi_internasional||0),
    }),{});

    // Mode berjalan / per tahun: ambil dari latest
    if(filterMode !== "kumulatif") {
      return {
        total_mhs_aktif: latest.total_mhs_aktif||0,
        total_mhs_baru: latest.total_mhs_baru||0,
        mhs_aktif_kader: latest.mhs_aktif_kader||0,
        mhs_aktif_non_kader: latest.mhs_aktif_non_kader||0,
        mhs_baru_kader: latest.mhs_baru_kader||0,
        mhs_baru_non_kader: latest.mhs_baru_non_kader||0,
        student_body: latest.student_body||0,
        prestasi_dalam_negeri: latest.prestasi_dalam_negeri||0,
        prestasi_internasional: latest.prestasi_internasional||0,
        _fallback: filterData(allMhs).filter(r=>r.prodi_id===prodiId).length===0, // flag untuk UI
      };
    }

    // Mode kumulatif: aktif = snapshot terbaru dari SEMUA data prodi ini
    const latestAll = sortDesc(allProdiRows)[0];
    return {
      total_mhs_aktif: latestAll.total_mhs_aktif||0,
      mhs_aktif_kader: latestAll.mhs_aktif_kader||0,
      mhs_aktif_non_kader: latestAll.mhs_aktif_non_kader||0,
      student_body: latestAll.student_body||0,
      total_mhs_baru: sumBaru.total_mhs_baru||0,
      mhs_baru_kader: sumBaru.mhs_baru_kader||0,
      mhs_baru_non_kader: sumBaru.mhs_baru_non_kader||0,
      prestasi_dalam_negeri: sumBaru.prestasi_dalam_negeri||0,
      prestasi_internasional: sumBaru.prestasi_internasional||0,
    };
  };

  const aggDosen = (prodiId) => {
    // FIX v12 Bug1+Bug2: fallback ke data terbaru milik prodi ini jika filter kosong
    // FIX v12: dosen selalu ambil snapshot terbaru — tidak pernah dijumlah antar semester
    const allProdiRows = allDosen.filter(r=>r.prodi_id===prodiId);
    if(!allProdiRows.length) return {};

    const sortDesc = (arr) => [...arr].sort((a,b)=>{
      if(b.tahun_akademik !== a.tahun_akademik) return b.tahun_akademik > a.tahun_akademik ? 1 : -1;
      const sa = normSemester(a.semester); const sb = normSemester(b.semester);
      if(sa==="Genap" && sb==="Ganjil") return 1;
      if(sa==="Ganjil" && sb==="Genap") return -1;
      return 0;
    });

    let rows = filterData(allDosen).filter(r=>r.prodi_id===prodiId);
    // Fallback: PTH belum upload TA terbaru → pakai data terbaru yang ada
    if(!rows.length) rows = [sortDesc(allProdiRows)[0]];

    // Dosen: selalu snapshot terbaru (bukan sum) di semua mode
    return sortDesc(rows)[0];
  };

  const aggPenelitian = (pthId) => {
    // FIX v12 Bug1: fallback ke data terbaru jika PTH belum upload TA terbaru
    const allPthRows = allPenelitian.filter(r=>r.pth_id===pthId);
    if(!allPthRows.length) return {};
    const sortDesc = (arr) => [...arr].sort((a,b)=>b.tahun_akademik>a.tahun_akademik?1:-1);
    let rows = filterData(allPenelitian).filter(r=>r.pth_id===pthId);
    if(!rows.length) rows = [sortDesc(allPthRows)[0]];
    if(filterMode==="kumulatif"){
      return rows.reduce((acc,r)=>({
        sinta_score:(acc.sinta_score||0)+(parseFloat(r.sinta_score)||0),
        gscholar_artikel:(acc.gscholar_artikel||0)+(r.gscholar_artikel||0),
        gscholar_citation:(acc.gscholar_citation||0)+(r.gscholar_citation||0),
        scopus_artikel:(acc.scopus_artikel||0)+(r.scopus_artikel||0),
        scopus_citation:(acc.scopus_citation||0)+(r.scopus_citation||0),
      }),{});
    }
    return sortDesc(rows)[0]||{};
  };

  const aggKerjasama = (pthId) => {
    // FIX v12 Bug1: fallback ke data terbaru jika PTH belum upload TA terbaru
    // Alumni & kerjasama: selalu snapshot terbaru (angka kumulatif sudah dihitung di sumber data)
    const allPthRows = allKerjasama.filter(r=>r.pth_id===pthId);
    if(!allPthRows.length) return {};
    const sortDesc = (arr) => [...arr].sort((a,b)=>b.tahun_akademik>a.tahun_akademik?1:-1);
    let rows = filterData(allKerjasama).filter(r=>r.pth_id===pthId);
    if(!rows.length) rows = [sortDesc(allPthRows)[0]];
    return sortDesc(rows)[0]||{};
  };

  // Build pthList dengan data terfilter
  const pthList = pthRaw.map(pth=>({
    ...pth,
    prodi:(pth.prodi||[]).map(pr=>({
      ...pr,
      latest_mhs:aggMhs(pr.id),
      latest_dosen:aggDosen(pr.id),
    })),
    latest_penelitian:aggPenelitian(pth.id),
    latest_kerjasama:aggKerjasama(pth.id),
  }));

  // prodiList juga inject latest_mhs dan latest_dosen (untuk halaman Prodi)
  const prodiListEnriched = prodiList.map(pr=>({
    ...pr,
    latest_mhs:aggMhs(pr.id),
    latest_dosen:aggDosen(pr.id),
  }));

  // Data tahun sebelumnya untuk pertumbuhan (selalu pakai prevTA)
  const prevMhsTotal = allMhs.filter(r=>r.tahun_akademik===prevTA).reduce((s,r)=>s+(r.total_mhs_aktif||0),0);
  // FIX v12: prevDosenTotal pakai total JAD bukan hanya S2+S3
  const prevDosenTotal = allDosen.filter(r=>r.tahun_akademik===prevTA).reduce((s,r)=>s+(r.tanpa_jad_kader||0)+(r.tanpa_jad_non_kader||0)+(r.asisten_ahli_kader||0)+(r.asisten_ahli_non_kader||0)+(r.lektor_kader||0)+(r.lektor_non_kader||0)+(r.lektor_kepala_kader||0)+(r.lektor_kepala_non_kader||0)+(r.guru_besar_kader||0)+(r.guru_besar_non_kader||0),0);
  const prevAlumniTotal = allKerjasama.filter(r=>r.tahun_akademik===prevTA).reduce((s,r)=>s+(r.alumni_kader||0)+(r.alumni_non_kader||0),0);

  const growth = (cur,prev) => {
    if(!prev) return null;
    const pct = ((cur-prev)/prev*100).toFixed(1);
    return { pct, up: cur>=prev };
  };

  // Komponen badge pertumbuhan
  const GrowthBadge = ({cur,prev}) => {
    const g = growth(cur,prev);
    if(!g||filterMode!=="berjalan") return null;
    return (
      <span style={{fontSize:10,fontWeight:800,padding:"2px 6px",borderRadius:99,background:g.up?T.greenL:T.redL,color:g.up?T.green:T.red,marginLeft:6}}>
        {g.up?"▲":"▼"} {Math.abs(g.pct)}%
      </span>
    );
  };

  // Filter bar komponen
  const FilterBar = () => (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:700,color:T.muted}}>Tampilkan:</span>
      {[
        {key:"berjalan", label:`📅 Tahun Berjalan${latestTA?" ("+latestTA+")":""}`},
        {key:"tahun",    label:"📆 Per Tahun"},
        {key:"kumulatif",label:"📊 Kumulatif"},
      ].map(m=>(
        <button key={m.key} onClick={()=>setFilterMode(m.key)}
          style={{fontSize:12,padding:"6px 12px",borderRadius:99,border:`1.5px solid ${filterMode===m.key?T.blue:T.border}`,background:filterMode===m.key?T.blueL:"#fff",color:filterMode===m.key?T.blue:T.muted,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          {m.label}
        </button>
      ))}
      {filterMode==="tahun"&&(
        <select value={filterTA||latestTA} onChange={e=>setFilterTA(e.target.value)}
          style={{fontSize:12,padding:"6px 10px",borderRadius:8,border:`1.5px solid ${T.blue}`,color:T.blue,fontWeight:700,cursor:"pointer",background:T.blueL}}>
          {allTA.map(ta=><option key={ta} value={ta}>{ta}</option>)}
        </select>
      )}
      {filterMode==="berjalan"&&prevTA&&(
        <span style={{fontSize:11,color:T.muted}}>vs tahun sebelumnya ({prevTA})</span>
      )}
    </div>
  );

  // navTo sudah didefinisikan di atas dengan hash support
  const stats={
    mhs:{
      total_aktif:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_mhs?.total_mhs_aktif||0),s),0),
      total_baru:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_mhs?.total_mhs_baru||0),s),0),
      aktif_kader:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_mhs?.mhs_aktif_kader||0),s),0),
      prestasi_dn:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_mhs?.prestasi_dalam_negeri||0),s),0),
      prestasi_int:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_mhs?.prestasi_internasional||0),s),0),
    },
    dosen:{
      // FIX v12: total dosen = sum semua JAD (kader+non-kader), bukan hanya S2+S3
      total:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)},s),0),
      kader:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.tanpa_jad_kader||0)+(d.asisten_ahli_kader||0)+(d.lektor_kader||0)+(d.lektor_kepala_kader||0)+(d.guru_besar_kader||0)},s),0),
      non_kader:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_non_kader||0)},s),0),
      s2:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_dosen?.dosen_s2||0),s),0),
      s3:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>s2+(pr.latest_dosen?.dosen_s3||0),s),0),
      guru_besar:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)},s),0),
      lektor_kepala:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)},s),0),
      lektor:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.lektor_kader||0)+(d.lektor_non_kader||0)},s),0),
      asisten_ahli:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)},s),0),
      tanpa_jad:pthList.reduce((s,p)=>(p.prodi||[]).reduce((s2,pr)=>{const d=pr.latest_dosen||{};return s2+(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)},s),0),
    },
    alumni:{
      total:pthList.reduce((s,p)=>s+(p.latest_kerjasama?.alumni_kader||0)+(p.latest_kerjasama?.alumni_non_kader||0),0),
      kader:pthList.reduce((s,p)=>s+(p.latest_kerjasama?.alumni_kader||0),0),
      non_kader:pthList.reduce((s,p)=>s+(p.latest_kerjasama?.alumni_non_kader||0),0),
    },
    penelitian:{
      sinta_score:pthList.reduce((s,p)=>s+(parseFloat(p.latest_penelitian?.sinta_score)||0),0),
      gscholar_artikel:pthList.reduce((s,p)=>s+(p.latest_penelitian?.gscholar_artikel||0),0),
      scopus_artikel:pthList.reduce((s,p)=>s+(p.latest_penelitian?.scopus_artikel||0),0),
      kerjasama_dn:pthList.reduce((s,p)=>s+(p.latest_kerjasama?.kerjasama_dn||0),0),
      kerjasama_ln:pthList.reduce((s,p)=>s+(p.latest_kerjasama?.kerjasama_ln||0),0),
    },
  };

  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <PublicTabs active={activePage} setActive={navTo}/>
      <div className="main-content" style={{flex:1,overflow:"auto",padding:"20px"}}>
        {loading?<Spin/>:(<>

        {activePage==="dashboard"&&(
          <div className="fade-up">
            <div style={{background:`linear-gradient(135deg,${T.navy} 0%,${T.navyL} 100%)`,borderRadius:16,padding:isMobile?"18px 16px":"24px 28px",marginBottom:20,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,background:T.accent+"22",borderRadius:"50%"}}/>
              <h1 style={{color:"#fff",fontSize:isMobile?16:20,fontWeight:900,lineHeight:1.3,marginBottom:6}}>Pangkalan Data<br/>Perguruan Tinggi Hidayatullah</h1>
              <p style={{color:"#94a3b8",fontSize:12}}>Data resmi & transparan untuk publik</p>
            </div>
            <FilterBar/>
            <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              <StatCard icon="🏛️" value={pthList.length} label="Total PTH" color={T.navy}/>
              <StatCard icon="📚" value={prodiListEnriched.length} label="Total Prodi" color={T.cyan}/>
              <StatCard icon="🎓" value={<span>{stats.mhs.total_aktif.toLocaleString("id-ID")}<GrowthBadge cur={stats.mhs.total_aktif} prev={prevMhsTotal}/></span>} label="Mahasiswa" color={T.blue} onClick={()=>navTo("statistik")}/>
              <StatCard icon="📍" value={[...new Set(pthList.map(p=>p.provinsi).filter(Boolean))].length} label="Provinsi" color={T.purple}/>
            </div>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:"1px solid #dde6ef",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h3 style={{fontWeight:800,color:T.navy,fontSize:15}}>Daftar PTH</h3>
                <button onClick={()=>navTo("pth")} style={{background:"none",border:"none",color:T.blue,fontWeight:700,fontSize:12,cursor:"pointer"}}>Lihat semua →</button>
              </div>
              {pthList.map((p,i)=>(
                <div key={p.id} onClick={()=>{setActivePage("pth");setSelectedPTH(p);}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:i<pthList.length-1?"1px solid #dde6ef":"none",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <div style={{width:36,height:36,borderRadius:10,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:13,flexShrink:0}}>{p.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:T.text,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.nama}</div>
                    <div style={{fontSize:11,color:T.muted}}>📍 {p.kota} · {(p.prodi||[]).length} Prodi</div>
                    {p.website&&<div style={{fontSize:11,marginTop:2}}><a href={p.website.startsWith("http")?p.website:"https://"+p.website} target="_blank" rel="noreferrer" style={{color:T.blue,fontWeight:600}} onClick={e=>e.stopPropagation()}>🌐 {p.website}</a></div>}
                  </div>
                  <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage==="pth"&&(selectedPTH?(
          <div className="fade-up">
            <BackBtn onClick={()=>setSelectedPTH(null)}/>
            <div className="card" style={{padding:20,marginBottom:16}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:52,height:52,borderRadius:14,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:18,flexShrink:0}}>{selectedPTH.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                <div>
                  <h2 style={{fontWeight:900,color:T.navy,fontSize:17}}>{selectedPTH.nama}</h2>
                  <p style={{color:T.muted,fontSize:13,margin:"4px 0 6px"}}>📍 {selectedPTH.kota}, {selectedPTH.provinsi}</p>
                  {selectedPTH.website&&<p style={{fontSize:12,margin:"0 0 10px"}}><a href={selectedPTH.website.startsWith("http")?selectedPTH.website:"https://"+selectedPTH.website} target="_blank" rel="noreferrer" style={{color:T.blue,fontWeight:600}}>🌐 {selectedPTH.website}</a></p>}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    <Tag label={`Akr. ${selectedPTH.akreditasi||"-"}`} color={akrColor(selectedPTH.akreditasi)}/>
                    <Tag label={selectedPTH.status||"Aktif"} color={T.green}/>
                    {selectedPTH.struktur&&<Tag label={selectedPTH.struktur} color={T.cyan}/>}
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              <StatCard icon="🎓" value={(selectedPTH.prodi||[]).reduce((s,pr)=>s+(pr.latest_mhs?.total_mhs_aktif||0),0)} label="Mahasiswa" color={T.blue}/>
              <StatCard icon="👩‍🏫" value={(selectedPTH.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)},0)} label="Dosen" color={T.teal}/>
              <StatCard icon="📚" value={(selectedPTH.prodi||[]).length} label="Prodi" color={T.cyan}/>
              <StatCard icon="👨‍🎓" value={(selectedPTH.latest_kerjasama?.alumni_kader||0)+(selectedPTH.latest_kerjasama?.alumni_non_kader||0)} label="Alumni" color={T.green}/>
            </div>
            <h3 style={{fontWeight:800,color:T.navy,marginBottom:12,fontSize:15}}>Program Studi</h3>
            <div className="pth-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {(selectedPTH.prodi||[]).map(pr=>(
                <div key={pr.id} className="card" style={{padding:16}}>
                  <div style={{fontWeight:700,color:T.navy,fontSize:13,marginBottom:8}}>{pr.nama}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                    <Tag label={pr.jenjang||"-"} color={T.cyan}/>
                    <Tag label={`Akr. ${pr.akreditasi||"-"}`} color={akrColor(pr.akreditasi)}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div style={{background:T.bg,borderRadius:8,padding:"8px 12px"}}>
                      <div style={{fontSize:10,color:T.muted,fontWeight:700}}>Mahasiswa</div>
                      <div style={{fontWeight:900,color:T.blue,fontSize:16,fontFamily:"'DM Mono',monospace"}}>{pr.latest_mhs?.total_mhs_aktif||0}</div>
                    </div>
                    <div style={{background:T.bg,borderRadius:8,padding:"8px 12px"}}>
                      <div style={{fontSize:10,color:T.muted,fontWeight:700}}>Dosen</div>
                      <div style={{fontWeight:900,color:T.teal,fontSize:16,fontFamily:"'DM Mono',monospace"}}>{(()=>{const d=pr.latest_dosen||{};return (d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)})()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pengurus PTH */}
            {(pthPengurus[selectedPTH.id]||[]).length>0&&(
              <div style={{marginTop:16}}>
                <h3 style={{fontWeight:800,color:T.navy,marginBottom:12,fontSize:15}}>👥 Pengurus PTH</h3>
                <div className="pth-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                  {(()=>{
                    const pgList = pthPengurus[selectedPTH.id]||[];
                    const wakilList = pgList.filter(p=>p.jabatan==="wakil_ketua");
                    return [
                      ...pgList.filter(p=>p.jabatan==="ketua"),
                      ...wakilList,
                      ...pgList.filter(p=>p.jabatan==="kaprodi"),
                    ].map(p=>{
                      let jabatanLabel = "";
                      if(p.jabatan==="ketua") jabatanLabel="👑 Ketua/Rektor";
                      else if(p.jabatan==="kaprodi") jabatanLabel=`📚 Kaprodi ${p.prodi?.nama||""}`;
                      else {
                        jabatanLabel = "🏅 Wakil Ketua/Rektor";
                      }
                      return (
                        <div key={p.id} className="card" style={{padding:14}}>
                          <div style={{fontSize:10,color:T.muted,fontWeight:700,marginBottom:4}}>
                            {jabatanLabel}{p.jabatan==="wakil_ketua"&&p.bidang?` — ${p.bidang}`:""}
                          </div>
                          <div style={{fontWeight:800,color:T.navy,fontSize:13}}>{p.nama}</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        ):(
          <div className="fade-up">
            <h2 style={{fontWeight:900,color:T.navy,marginBottom:16}} className="page-title">Perguruan Tinggi</h2>
            <div className="pth-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
              {pthList.map(p=>(
                <div key={p.id} className="card" style={{padding:18,cursor:"pointer",transition:"all 0.15s"}}
                  onClick={()=>{
                  setSelectedPTH(p);
                  if(!pthPengurus[p.id]){
                    supabase.from("pengurus_pth").select("*,prodi(nama)").eq("pth_id",p.id).order("jabatan")
                      .then(({data})=>setPthPengurus(prev=>({...prev,[p.id]:data||[]})));
                  }
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.blue;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:40,height:40,borderRadius:11,background:T.navyL,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:900,fontSize:15,flexShrink:0}}>{p.nama.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                    <div style={{fontWeight:800,color:T.navy,fontSize:13,lineHeight:1.3}}>{p.nama}</div>
                  </div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:10}}>📍 {p.kota}, {p.provinsi}</div>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    {[[(p.prodi||[]).reduce((s,pr)=>s+(pr.latest_mhs?.total_mhs_aktif||0),0),"Mhs",T.blue],[(p.prodi||[]).reduce((s,pr)=>{const d=pr.latest_dosen||{};return s+(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)},0),"Dosen",T.teal],[(p.prodi||[]).length,"Prodi",T.cyan]].map(([v,l,c])=>(
                      <div key={l} style={{textAlign:"center",flex:1,background:T.bg,borderRadius:8,padding:"6px 4px"}}>
                        <div style={{fontWeight:900,color:c,fontSize:15,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                        <div style={{fontSize:10,color:T.muted,fontWeight:700}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingTop:10,borderTop:"1px solid #dde6ef"}}>
                    <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)}/>
                    {p.struktur&&<Tag label={p.struktur} color={T.cyan}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {activePage==="prodi"&&(selectedProdi?(
          <div className="fade-up">
            <BackBtn onClick={()=>setSelectedProdi(null)}/>
            <div className="card" style={{padding:20,marginBottom:12}}>
              <h2 style={{fontWeight:900,color:T.navy,marginBottom:4}}>{selectedProdi.nama}</h2>
              <p style={{color:T.muted,marginBottom:12,fontSize:13}}>🏛️ {selectedProdi.pth?.nama}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Tag label={selectedProdi.jenjang||"-"} color={T.cyan}/>
                <Tag label={`Akr. ${selectedProdi.akreditasi||"-"}`} color={akrColor(selectedProdi.akreditasi)}/>
                <Tag label={selectedProdi.status||"Aktif"} color={T.green}/>
              </div>
            </div>
            <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              <StatCard icon="🎓" value={selectedProdi.latest_mhs?.total_mhs_aktif||0} label="Mahasiswa Aktif" color={T.blue}/>
              <StatCard icon="🆕" value={selectedProdi.latest_mhs?.total_mhs_baru||0} label="Mahasiswa Baru" color={T.cyan}/>
              <StatCard icon="🟢" value={selectedProdi.latest_mhs?.mhs_aktif_kader||0} label="Kader Aktif" color={T.green}/>
              <StatCard icon="👩‍🏫" value={(()=>{const d=selectedProdi.latest_dosen||{};return (d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)})()} label="Total Dosen" color={T.teal}/>
            </div>
          </div>
        ):(
          <div className="fade-up">
            <h2 style={{fontWeight:900,color:T.navy,marginBottom:16}} className="page-title">Program Studi</h2>
            <div className="card" style={{overflow:"hidden"}}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Program Studi</th><th className="hide-mobile">PTH</th><th>Jenjang</th><th>Akreditasi</th><th>Mhs</th><th className="hide-mobile">Dosen</th></tr></thead>
                  <tbody>
                    {prodiListEnriched.map(pr=>(
                      <tr key={pr.id} onClick={()=>setSelectedProdi(pr)} style={{cursor:"pointer"}}>
                        <td><div style={{fontWeight:700,color:T.navy,fontSize:13}}>{pr.nama}</div><div style={{fontSize:11,color:T.muted}}>{pr.pth?.nama}</div></td>
                        <td className="hide-mobile" style={{color:T.muted,fontSize:12}}>{pr.pth?.nama}</td>
                        <td><Tag label={pr.jenjang||"-"} color={T.cyan}/></td>
                        <td><Tag label={pr.akreditasi||"-"} color={akrColor(pr.akreditasi)}/></td>
                        <td style={{fontWeight:800,fontFamily:"'DM Mono',monospace",color:T.blue}}>{pr.latest_mhs?.total_mhs_aktif||0}</td>
                        <td className="hide-mobile" style={{fontWeight:800,fontFamily:"'DM Mono',monospace",color:T.teal}}>{(()=>{const d=pr.latest_dosen||{};return (d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)})()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {activePage==="statistik"&&<PageStatistik pthList={pthList} prodiList={prodiListEnriched} stats={stats} FilterBar={FilterBar} GrowthBadge={GrowthBadge} prevStats={{mhs:prevMhsTotal,dosen:prevDosenTotal,alumni:prevAlumniTotal}} initialDrill={drill}/>}

        </>)}
      </div>
    </div>
  );
}

/* ── PAGE UPLOAD (Excel + Manual) ── */
function PageUpload({ user, onDone }) {
  const [mode,setMode]=useState("excel");
  const [step,setStep]=useState(1);
  const [file,setFile]=useState(null); const [parsed,setParsed]=useState(null);
  const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const [existingProdi,setExistingProdi]=useState([]);
  const [manSemester,setManSemester]=useState(""); const [manTA,setManTA]=useState("");
  const [manProdi,setManProdi]=useState([]);
  const [manPTH,setManPTH]=useState({sinta_score:"",gscholar_artikel:"",gscholar_citation:"",scopus_artikel:"",scopus_citation:"",hibah_pemerintah:"",hibah_eksternal:"",kerjasama_dn:"",kerjasama_ln:"",alumni_kader:"",alumni_non_kader:""});

  useEffect(()=>{
    supabase.from("prodi").select("*").eq("pth_id",user.pth_id).then(({data})=>setExistingProdi(data||[]));
  },[user.pth_id]);

  const downloadTemplate = () => {
    const link=document.createElement("a");
    link.href=process.env.PUBLIC_URL+"/Template_Upload_Semester_Hidayatullah.xlsx";
    link.download="Template_Upload_Semester_Hidayatullah.xlsx";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const doValidate = async () => {
    setLoading(true); setErr("");
    try {
      const data=await parseExcel(file);
      const {data:pd}=await supabase.from("pth").select("nama").eq("id",user.pth_id).single();
      if(pd&&data.identitas.nama_pth.toLowerCase()!==pd.nama.toLowerCase())
        return setErr(`Nama PTH di file "${data.identitas.nama_pth}" tidak sesuai dengan "${pd.nama}"`);
      setParsed(data); setStep(3);
    } catch(e){setErr(String(e));}
    setLoading(false);
  };

  const doSubmitExcel = async () => {
    setLoading(true); setErr("");
    try {
      const {data:up,error:ue}=await supabase.from("uploads").insert({pth_id:user.pth_id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,filename:file.name,status:"pending",uploaded_by:user.id}).select().maybeSingle();
      if(ue) throw ue.message;
      // Kalau up null karena RLS, ambil upload terbaru milik PTH ini
      let uploadId = up?.id;
      if(!uploadId){
        const {data:latest}=await supabase.from("uploads").select("id").eq("pth_id",user.pth_id).eq("status","pending").order("created_at",{ascending:false}).limit(1).maybeSingle();
        uploadId = latest?.id;
      }
      if(!uploadId) throw "Gagal mendapatkan ID upload. Coba lagi.";
      // Simpan file Excel ke Supabase Storage
      const filePath=`excel/${uploadId}_${file.name}`;
      await supabase.storage.from("uploads").upload(filePath, file, {contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",upsert:true});
      await supabase.from("uploads").update({file_path:filePath}).eq("id",uploadId);
      for(const pi of parsed.daftarProdi){
        let {data:pd}=await supabase.from("prodi").select("id").eq("pth_id",user.pth_id).eq("nama",pi.nama).single();
        if(!pd){const {data:np}=await supabase.from("prodi").insert({pth_id:user.pth_id,nama:pi.nama,jenjang:pi.jenjang,akreditasi:pi.akreditasi}).select().single();pd=np;}
        else{await supabase.from("prodi").update({jenjang:pi.jenjang,akreditasi:pi.akreditasi}).eq("id",pd.id);}
        const d=parsed.prodi[pi.nama]; if(!d) continue;
        await supabase.from("data_dosen").insert({upload_id:uploadId,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,dosen_s2:d.dosen.s2||0,dosen_s3:d.dosen.s3||0,tanpa_jad_kader:d.dosen.tanpa_jad_kader||0,tanpa_jad_non_kader:d.dosen.tanpa_jad_non_kader||0,asisten_ahli_kader:d.dosen.asisten_ahli_kader||0,asisten_ahli_non_kader:d.dosen.asisten_ahli_non_kader||0,lektor_kader:d.dosen.lektor_kader||0,lektor_non_kader:d.dosen.lektor_non_kader||0,lektor_kepala_kader:d.dosen.lektor_kepala_kader||0,lektor_kepala_non_kader:d.dosen.lektor_kepala_non_kader||0,guru_besar_kader:d.dosen.guru_besar_kader||0,guru_besar_non_kader:d.dosen.guru_besar_non_kader||0});
        await supabase.from("data_tendik").insert({upload_id:uploadId,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,tendik_kader:d.tendik.kader||0,tendik_non_kader:d.tendik.non_kader||0});
        await supabase.from("data_mahasiswa").insert({upload_id:uploadId,pth_id:user.pth_id,prodi_id:pd.id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,student_body:d.mahasiswa.student_body||0,mhs_baru_kader:d.mahasiswa.baru_kader||0,mhs_baru_non_kader:d.mahasiswa.baru_non_kader||0,total_mhs_baru:d.mahasiswa.total_baru||0,mhs_aktif_kader:d.mahasiswa.aktif_kader||0,mhs_aktif_non_kader:d.mahasiswa.aktif_non_kader||0,total_mhs_aktif:d.mahasiswa.total_aktif||0,prestasi_dalam_negeri:d.mahasiswa.prestasi_dn||0,prestasi_internasional:d.mahasiswa.prestasi_int||0});
      }
      const p=parsed.pth;
      await supabase.from("data_penelitian").insert({upload_id:uploadId,pth_id:user.pth_id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,jumlah_jurnal:p.jumlah_jurnal||0,akreditasi_jurnal:p.akreditasi_jurnal||"",sinta_score:p.sinta_score||0,gscholar_artikel:p.gscholar_artikel||0,gscholar_citation:p.gscholar_citation||0,scopus_artikel:p.scopus_artikel||0,scopus_citation:p.scopus_citation||0,hibah_pemerintah:p.hibah_pemerintah||0,hibah_eksternal:p.hibah_eksternal||0});
      await supabase.from("data_kerjasama").insert({upload_id:uploadId,pth_id:user.pth_id,semester:parsed.identitas.semester,tahun_akademik:parsed.identitas.tahun_akademik,kerjasama_ln:p.kerjasama_ln||0,kerjasama_dn:p.kerjasama_dn||0,alumni_kader:p.alumni_kader||0,alumni_non_kader:p.alumni_non_kader||0,nama_ketua_alumni:p.nama_ketua_alumni||"",hp_ketua_alumni:p.hp_ketua_alumni||""});
      setStep(4); onDone();
    } catch(e){setErr("Gagal: "+String(e));}
    setLoading(false);
  };

  const doSubmitManual = async () => {
    if(!manSemester||!manTA) return setErr("Semester dan Tahun Akademik wajib diisi.");
    setLoading(true); setErr("");
    try {
      const {data:up,error:ue}=await supabase.from("uploads").insert({pth_id:user.pth_id,semester:manSemester,tahun_akademik:manTA,filename:"Input Manual",status:"pending",uploaded_by:user.id}).select().single();
      if(ue) throw ue.message;
      for(const mp of manProdi){
        const {data:pd}=await supabase.from("prodi").select("id").eq("pth_id",user.pth_id).eq("nama",mp.nama).single();
        if(!pd) continue;
        const n=k=>parseInt(mp[k])||0;
        await supabase.from("data_mahasiswa").insert({upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:manSemester,tahun_akademik:manTA,student_body:n("student_body"),mhs_baru_kader:n("mhs_baru_kader"),mhs_baru_non_kader:n("mhs_baru_non_kader"),total_mhs_baru:n("mhs_baru_kader")+n("mhs_baru_non_kader"),mhs_aktif_kader:n("mhs_aktif_kader"),mhs_aktif_non_kader:n("mhs_aktif_non_kader"),total_mhs_aktif:n("mhs_aktif_kader")+n("mhs_aktif_non_kader"),prestasi_dalam_negeri:n("prestasi_dn"),prestasi_internasional:n("prestasi_int")});
        await supabase.from("data_dosen").insert({upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:manSemester,tahun_akademik:manTA,dosen_s2:n("dosen_s2"),dosen_s3:n("dosen_s3"),tanpa_jad_kader:n("tanpa_jad_kader"),tanpa_jad_non_kader:n("tanpa_jad_non"),asisten_ahli_kader:n("asisten_ahli_kader"),asisten_ahli_non_kader:n("asisten_ahli_non"),lektor_kader:n("lektor_kader"),lektor_non_kader:n("lektor_non"),lektor_kepala_kader:n("lk_kader"),lektor_kepala_non_kader:n("lk_non"),guru_besar_kader:n("gb_kader"),guru_besar_non_kader:n("gb_non")});
        await supabase.from("data_tendik").insert({upload_id:up.id,pth_id:user.pth_id,prodi_id:pd.id,semester:manSemester,tahun_akademik:manTA,tendik_kader:n("tendik_kader"),tendik_non_kader:n("tendik_non")});
      }
      const mn=k=>parseInt(manPTH[k])||0; const mf=k=>parseFloat(manPTH[k])||0;
      await supabase.from("data_penelitian").insert({upload_id:up.id,pth_id:user.pth_id,semester:manSemester,tahun_akademik:manTA,sinta_score:mf("sinta_score"),gscholar_artikel:mn("gscholar_artikel"),gscholar_citation:mn("gscholar_citation"),scopus_artikel:mn("scopus_artikel"),scopus_citation:mn("scopus_citation"),hibah_pemerintah:mn("hibah_pemerintah"),hibah_eksternal:mn("hibah_eksternal")});
      await supabase.from("data_kerjasama").insert({upload_id:up.id,pth_id:user.pth_id,semester:manSemester,tahun_akademik:manTA,kerjasama_dn:mn("kerjasama_dn"),kerjasama_ln:mn("kerjasama_ln"),alumni_kader:mn("alumni_kader"),alumni_non_kader:mn("alumni_non_kader")});
      setStep(4); onDone();
    } catch(e){setErr("Gagal: "+String(e));}
    setLoading(false);
  };

  const reset=()=>{setStep(1);setFile(null);setParsed(null);setErr("");};

  if(step===4) return (
    <div className="fade-up" style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <h3 style={{fontWeight:900,color:T.navy,marginBottom:8}}>Data Berhasil Dikirim!</h3>
      <p style={{color:T.muted,fontSize:13,marginBottom:24}}>Menunggu approval dari Super Admin DPP.</p>
      <button onClick={reset} className="btn btn-primary">Upload Data Lagi</button>
    </div>
  );

  return (
    <div>
      <SectionTitle title="📤 Input Data" sub="Pilih metode input data semester"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}} className="two-col">
        {[{key:"excel",icon:"📊",title:"Upload Excel",desc:"Upload file Excel sesuai template"},{key:"manual",icon:"✏️",title:"Input Manual",desc:"Isi data langsung di form"}].map(m=>(
          <div key={m.key} className="card" style={{padding:18,cursor:"pointer",borderColor:mode===m.key?T.blue:T.border,borderWidth:2}} onClick={()=>{setMode(m.key);setErr("");setStep(1);}}>
            <div style={{fontSize:28,marginBottom:8}}>{m.icon}</div>
            <div style={{fontWeight:800,color:mode===m.key?T.blue:T.navy,marginBottom:4}}>{m.title}</div>
            <div style={{fontSize:12,color:T.muted}}>{m.desc}</div>
          </div>
        ))}
      </div>

      {err&&<Alert type="error" msg={err}/>}

      {mode==="excel"&&(<>
        {/* Step indicator */}
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          {["Template","File","Preview","Selesai"].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,background:step>i+1?T.green:step===i+1?T.blue:T.bg,color:step>i+1||step===i+1?"#fff":T.muted,border:`2px solid ${step>i+1?T.green:step===i+1?T.blue:T.border}`}}>{step>i+1?"✓":i+1}</div>
                <div style={{fontSize:9,fontWeight:700,color:step===i+1?T.blue:T.muted,marginTop:4,textAlign:"center"}} className="hide-mobile">{s}</div>
              </div>
              {i<3&&<div style={{height:2,flex:0.5,background:step>i+2?T.green:T.border}}/>}
            </div>
          ))}
        </div>

        {step===1&&(
          <div className="card" style={{padding:24}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:44,marginBottom:12}}>📥</div>
              <h3 style={{fontWeight:900,color:T.navy,marginBottom:8}}>Unduh Template Excel</h3>
              <p style={{color:T.muted,fontSize:13}}>Gunakan template resmi agar format data sesuai dan tidak terjadi error.</p>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={downloadTemplate} className="btn btn-accent">⬇️ Download Template</button>
              <button onClick={()=>setStep(2)} className="btn btn-primary">Sudah punya template →</button>
            </div>
          </div>
        )}

        {step===2&&(
          <div className="card" style={{padding:24}}>
            <h3 style={{fontWeight:800,color:T.navy,marginBottom:16}}>Pilih File Excel</h3>
            <div style={{border:`2px dashed ${file?T.green:T.border}`,borderRadius:12,padding:32,textAlign:"center",marginBottom:16,cursor:"pointer",background:file?T.greenL:T.bg,transition:"all 0.2s"}}
              onClick={()=>document.getElementById("fileInput").click()}>
              <input id="fileInput" type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>{setFile(e.target.files[0]);setErr("");}}/>
              <div style={{fontSize:36,marginBottom:8}}>{file?"✅":"📂"}</div>
              <div style={{fontWeight:700,color:file?T.green:T.muted,fontSize:14}}>{file?file.name:"Klik untuk memilih file .xlsx"}</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(1)} className="btn btn-ghost">← Kembali</button>
              <button onClick={doValidate} disabled={!file||loading} className="btn btn-primary" style={{flex:1}}>{loading?"Memvalidasi...":"Validasi File →"}</button>
            </div>
          </div>
        )}

        {step===3&&parsed&&(
          <div className="card" style={{padding:24}}>
            <h3 style={{fontWeight:800,color:T.navy,marginBottom:16}}>Preview Data</h3>
            <Alert type="success" msg={`✅ File valid — ${parsed.daftarProdi.length} prodi ditemukan`}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              <div style={{background:T.bg,borderRadius:9,padding:"10px 14px"}}><div style={{fontSize:10,color:T.muted,fontWeight:700}}>Semester</div><div style={{fontWeight:800,color:T.navy}}>{parsed.identitas.semester}</div></div>
              <div style={{background:T.bg,borderRadius:9,padding:"10px 14px"}}><div style={{fontSize:10,color:T.muted,fontWeight:700}}>Tahun Akademik</div><div style={{fontWeight:800,color:T.navy}}>{parsed.identitas.tahun_akademik}</div></div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:8}}>Program Studi:</div>
              {parsed.daftarProdi.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #dde6ef"}}>
                  <span style={{fontWeight:600,fontSize:13,flex:1}}>{p.nama}</span>
                  <Tag label={p.jenjang||"-"} color={T.cyan}/>
                  <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(2)} className="btn btn-ghost">← Edit</button>
              <button onClick={doSubmitExcel} disabled={loading} className="btn btn-green" style={{flex:1}}>{loading?"Mengirim...":"Kirim ke Admin DPP ✓"}</button>
            </div>
          </div>
        )}
      </>)}

      {mode==="manual"&&(
        <div>
          <div className="card" style={{padding:24,marginBottom:16}}>
            <h3 style={{fontWeight:800,color:T.navy,marginBottom:16}}>Info Semester</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="two-col">
              <FieldRow label="Semester">
                <select value={manSemester} onChange={e=>setManSemester(e.target.value)}>
                  <option value="">— Pilih —</option>
                  <option>Ganjil</option><option>Genap</option>
                </select>
              </FieldRow>
              <FieldRow label="Tahun Akademik"><input placeholder="2024/2025" value={manTA} onChange={e=>setManTA(e.target.value)}/></FieldRow>
            </div>
          </div>

          {existingProdi.length===0?(
            <Alert type="warn" msg="Belum ada data prodi. Silakan upload Excel pertama kali untuk mendaftarkan prodi."/>
          ):existingProdi.map(pr=>{
            const idx=manProdi.findIndex(m=>m.nama===pr.nama);
            const mpData=idx>=0?manProdi[idx]:{};
            const setMpField=(k,v)=>{
              if(idx>=0){const next=[...manProdi];next[idx]={...next[idx],[k]:v};setManProdi(next);}
              else{setManProdi([...manProdi,{nama:pr.nama,[k]:v}]);}
            };
            const NF=(k,label)=>(
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,fontWeight:700,color:T.muted,display:"block",marginBottom:4}}>{label}</label>
                <input type="number" min="0" value={mpData[k]||""} onChange={e=>setMpField(k,e.target.value)}
                  style={{padding:"8px 12px",fontSize:13,width:"100%",boxSizing:"border-box",borderRadius:8,border:`1.5px solid ${T.border}`}}/>
              </div>
            );
            return (
              <div key={pr.id} className="card" style={{padding:20,marginBottom:12}}>
                <h4 style={{fontWeight:800,color:T.navy,marginBottom:14}}>{pr.nama}</h4>
                <div style={{fontSize:11,fontWeight:800,color:T.blue,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Mahasiswa</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0 12px"}} className="two-col">
                  {NF("mhs_aktif_kader","Aktif Kader")}{NF("mhs_aktif_non_kader","Aktif Non-Kader")}
                  {NF("mhs_baru_kader","Baru Kader")}{NF("mhs_baru_non_kader","Baru Non-Kader")}
                  {NF("student_body","Student Body")}{NF("prestasi_dn","Prestasi DN")}{NF("prestasi_int","Prestasi Intl")}
                </div>
                <div style={{fontSize:11,fontWeight:800,color:T.teal,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:12}}>Dosen</div>
                {/* S2 & S3 */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0 12px",marginBottom:4}}>
                  {NF("dosen_s2","S2")}{NF("dosen_s3","S3")}
                </div>
                {/* Jabatan fungsional — per baris: label jabatan, kolom Kader & Non-Kader */}
                {[
                  ["Tanpa JAD","tanpa_jad_kader","tanpa_jad_non"],
                  ["Asisten Ahli","asisten_ahli_kader","asisten_ahli_non"],
                  ["Lektor","lektor_kader","lektor_non"],
                  ["Lektor Kepala","lk_kader","lk_non"],
                  ["Guru Besar","gb_kader","gb_non"],
                ].map(([judul,kKader,kNon])=>(
                  <div key={judul} style={{marginBottom:8}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:800,marginBottom:4}}>{judul}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
                      {NF(kKader,"Kader")}{NF(kNon,"Non-Kader")}
                    </div>
                  </div>
                ))}
                <div style={{fontSize:11,fontWeight:800,color:T.orange,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:12}}>Tendik</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0 12px"}} className="two-col">
                  {NF("tendik_kader","Tendik Kader")}{NF("tendik_non","Tendik Non-Kader")}
                </div>
              </div>
            );
          })}

          <div className="card" style={{padding:20,marginBottom:16}}>
            <h4 style={{fontWeight:800,color:T.navy,marginBottom:14}}>Data Level PTH</h4>
            <div style={{fontSize:11,fontWeight:800,color:T.purple,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Penelitian</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0 12px"}} className="two-col">
              {[["sinta_score","Sinta Score"],["gscholar_artikel","GScholar Artikel"],["gscholar_citation","GScholar Sitasi"],["scopus_artikel","Scopus Artikel"],["scopus_citation","Scopus Sitasi"],["hibah_pemerintah","Hibah Pemerintah"],["hibah_eksternal","Hibah Eksternal"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:11}}>{l}</label>
                  <input type="number" min="0" step="0.1" value={manPTH[k]||""} onChange={e=>setManPTH({...manPTH,[k]:e.target.value})} style={{padding:"8px 12px",fontSize:13}}/>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:800,color:T.green,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:12}}>Kerjasama & Alumni</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0 12px"}} className="two-col">
              {[["kerjasama_dn","Kerjasama DN"],["kerjasama_ln","Kerjasama LN"],["alumni_kader","Alumni Kader"],["alumni_non_kader","Alumni Non-Kader"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:11}}>{l}</label>
                  <input type="number" min="0" value={manPTH[k]||""} onChange={e=>setManPTH({...manPTH,[k]:e.target.value})} style={{padding:"8px 12px",fontSize:13}}/>
                </div>
              ))}
            </div>
          </div>
          <button onClick={doSubmitManual} disabled={loading} className="btn btn-green" style={{width:"100%",padding:"13px"}}>{loading?"Mengirim...":"Kirim Data ke Admin DPP ✓"}</button>
        </div>
      )}
    </div>
  );
}

/* ── PAGE HISTORY ── */
function PageHistory({ uploads, loading, isSuperAdmin, user, onRefresh }) {
  const sc=s=>s==="approved"?T.green:s==="rejected"?T.red:T.orange;
  const sl=s=>s==="approved"?"Approved":s==="rejected"?"Ditolak":"Menunggu";
  const [koreksiUpload,setKoreksiUpload]=useState(null); // upload yang sedang dikoreksi
  const [koreksiData,setKoreksiData]=useState(null);     // data lengkap upload ini
  const [koreksiLoading,setKoreksiLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState({type:"",text:""});

  const bukaKoreksi = async (u) => {
    setKoreksiUpload(u); setKoreksiLoading(true); setMsg({type:"",text:""});
    const [mhs,dos,pen,ks,td] = await Promise.all([
      supabase.from("data_mahasiswa").select("*,prodi(nama)").eq("upload_id",u.id),
      supabase.from("data_dosen").select("*,prodi(nama)").eq("upload_id",u.id),
      supabase.from("data_penelitian").select("*").eq("upload_id",u.id),
      supabase.from("data_kerjasama").select("*").eq("upload_id",u.id),
      supabase.from("data_tendik").select("*,prodi(nama)").eq("upload_id",u.id),
    ]);
    setKoreksiData({
      mhs:mhs.data||[], dos:dos.data||[], pen:pen.data||[],
      ks:ks.data||[], td:td.data||[]
    });
    setKoreksiLoading(false);
  };

  const updateField = (tipe, id, field, val) => {
    setKoreksiData(prev=>({
      ...prev,
      [tipe]:prev[tipe].map(r=>r.id===id?{...r,[field]:parseFloat(val)||0}:r)
    }));
  };

  const simpanKoreksi = async () => {
    setSaving(true); setMsg({type:"",text:""});
    try {
      // Update semua data
      for(const r of koreksiData.mhs){
        await supabase.from("data_mahasiswa").update({
          student_body:r.student_body,total_mhs_aktif:r.total_mhs_aktif,
          mhs_aktif_kader:r.mhs_aktif_kader,mhs_aktif_non_kader:r.mhs_aktif_non_kader,
          total_mhs_baru:r.total_mhs_baru,mhs_baru_kader:r.mhs_baru_kader,
          mhs_baru_non_kader:r.mhs_baru_non_kader,
          prestasi_dalam_negeri:r.prestasi_dalam_negeri,prestasi_internasional:r.prestasi_internasional,
        }).eq("id",r.id);
      }
      for(const r of koreksiData.dos){
        await supabase.from("data_dosen").update({
          dosen_s2:r.dosen_s2,dosen_s3:r.dosen_s3,
          tanpa_jad_kader:r.tanpa_jad_kader,tanpa_jad_non_kader:r.tanpa_jad_non_kader,
          asisten_ahli_kader:r.asisten_ahli_kader,asisten_ahli_non_kader:r.asisten_ahli_non_kader,
          lektor_kader:r.lektor_kader,lektor_non_kader:r.lektor_non_kader,
          lektor_kepala_kader:r.lektor_kepala_kader,lektor_kepala_non_kader:r.lektor_kepala_non_kader,
          guru_besar_kader:r.guru_besar_kader,guru_besar_non_kader:r.guru_besar_non_kader,
        }).eq("id",r.id);
      }
      for(const r of koreksiData.td){
        await supabase.from("data_tendik").update({
          tendik_kader:r.tendik_kader,tendik_non_kader:r.tendik_non_kader,
        }).eq("id",r.id);
      }
      for(const r of koreksiData.pen){
        await supabase.from("data_penelitian").update({
          sinta_score:r.sinta_score,gscholar_artikel:r.gscholar_artikel,
          gscholar_citation:r.gscholar_citation,scopus_artikel:r.scopus_artikel,
          scopus_citation:r.scopus_citation,hibah_pemerintah:r.hibah_pemerintah,
          hibah_eksternal:r.hibah_eksternal,
        }).eq("id",r.id);
      }
      for(const r of koreksiData.ks){
        await supabase.from("data_kerjasama").update({
          alumni_kader:r.alumni_kader,alumni_non_kader:r.alumni_non_kader,
          kerjasama_dn:r.kerjasama_dn,kerjasama_ln:r.kerjasama_ln,
        }).eq("id",r.id);
      }
      setMsg({type:"success",text:"✅ Data berhasil dikoreksi! Halaman akan direfresh..."});
      if(onRefresh) onRefresh();
      // Reload setelah 1.5 detik biar user sempat baca notifikasi
      setTimeout(()=>window.location.reload(), 1500);
    } catch(e){
      setMsg({type:"error",text:"❌ Gagal menyimpan: "+e.message});
    }
    setSaving(false);
  };

  const KoreksiField = ({label,tipe,id,field,value}) => (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,color:T.muted,fontWeight:700,marginBottom:3}}>{label}</div>
      <input type="number" min="0" value={value||0}
        onChange={e=>updateField(tipe,id,field,e.target.value)}
        style={{width:"100%",padding:"6px 10px",borderRadius:7,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:700}}/>
    </div>
  );

  if(koreksiUpload) return (
    <div className="fade-up">
      <BackBtn onClick={()=>{setKoreksiUpload(null);setKoreksiData(null);setMsg({type:"",text:""});}}/>
      <SectionTitle title="✏️ Koreksi Data" sub={`${koreksiUpload.pth?.nama||""} • ${koreksiUpload.semester} ${koreksiUpload.tahun_akademik}`}/>
      {msg.text&&<Alert type={msg.type} msg={msg.text}/>}
      {koreksiLoading?<Spin/>:koreksiData&&(<>

        {/* Mahasiswa per Prodi */}
        {koreksiData.mhs.map(r=>(
          <div key={r.id} className="card" style={{padding:18,marginBottom:12}}>
            <h4 style={{fontWeight:800,color:T.navy,marginBottom:12}}>🎓 Mahasiswa — {r.prodi?.nama}</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              <KoreksiField label="Student Body" tipe="mhs" id={r.id} field="student_body" value={r.student_body}/>
              <KoreksiField label="Total Aktif" tipe="mhs" id={r.id} field="total_mhs_aktif" value={r.total_mhs_aktif}/>
              <KoreksiField label="Aktif Kader" tipe="mhs" id={r.id} field="mhs_aktif_kader" value={r.mhs_aktif_kader}/>
              <KoreksiField label="Aktif Non-Kader" tipe="mhs" id={r.id} field="mhs_aktif_non_kader" value={r.mhs_aktif_non_kader}/>
              <KoreksiField label="Total Baru" tipe="mhs" id={r.id} field="total_mhs_baru" value={r.total_mhs_baru}/>
              <KoreksiField label="Baru Kader" tipe="mhs" id={r.id} field="mhs_baru_kader" value={r.mhs_baru_kader}/>
              <KoreksiField label="Baru Non-Kader" tipe="mhs" id={r.id} field="mhs_baru_non_kader" value={r.mhs_baru_non_kader}/>
              <KoreksiField label="Prestasi DN" tipe="mhs" id={r.id} field="prestasi_dalam_negeri" value={r.prestasi_dalam_negeri}/>
              <KoreksiField label="Prestasi Intl" tipe="mhs" id={r.id} field="prestasi_internasional" value={r.prestasi_internasional}/>
            </div>
          </div>
        ))}

        {/* Dosen per Prodi */}
        {koreksiData.dos.map(r=>(
          <div key={r.id} className="card" style={{padding:18,marginBottom:12}}>
            <h4 style={{fontWeight:800,color:T.teal,marginBottom:12}}>👩‍🏫 Dosen — {r.prodi?.nama}</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              <KoreksiField label="Dosen S2" tipe="dos" id={r.id} field="dosen_s2" value={r.dosen_s2}/>
              <KoreksiField label="Dosen S3" tipe="dos" id={r.id} field="dosen_s3" value={r.dosen_s3}/>
              <KoreksiField label="Tanpa JAD Kader" tipe="dos" id={r.id} field="tanpa_jad_kader" value={r.tanpa_jad_kader}/>
              <KoreksiField label="Tanpa JAD Non-Kader" tipe="dos" id={r.id} field="tanpa_jad_non_kader" value={r.tanpa_jad_non_kader}/>
              <KoreksiField label="Asisten Ahli Kader" tipe="dos" id={r.id} field="asisten_ahli_kader" value={r.asisten_ahli_kader}/>
              <KoreksiField label="Asisten Ahli Non-Kader" tipe="dos" id={r.id} field="asisten_ahli_non_kader" value={r.asisten_ahli_non_kader}/>
              <KoreksiField label="Lektor Kader" tipe="dos" id={r.id} field="lektor_kader" value={r.lektor_kader}/>
              <KoreksiField label="Lektor Non-Kader" tipe="dos" id={r.id} field="lektor_non_kader" value={r.lektor_non_kader}/>
              <KoreksiField label="Lektor Kepala Kader" tipe="dos" id={r.id} field="lektor_kepala_kader" value={r.lektor_kepala_kader}/>
              <KoreksiField label="Lektor Kepala Non-Kader" tipe="dos" id={r.id} field="lektor_kepala_non_kader" value={r.lektor_kepala_non_kader}/>
              <KoreksiField label="Guru Besar Kader" tipe="dos" id={r.id} field="guru_besar_kader" value={r.guru_besar_kader}/>
              <KoreksiField label="Guru Besar Non-Kader" tipe="dos" id={r.id} field="guru_besar_non_kader" value={r.guru_besar_non_kader}/>
            </div>
          </div>
        ))}

        {/* Tendik per Prodi */}
        {koreksiData.td.length>0&&koreksiData.td.map(r=>(
          <div key={r.id} className="card" style={{padding:18,marginBottom:12}}>
            <h4 style={{fontWeight:800,color:T.purple,marginBottom:12}}>🏢 Tendik — {r.prodi?.nama}</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              <KoreksiField label="Tendik Kader" tipe="td" id={r.id} field="tendik_kader" value={r.tendik_kader}/>
              <KoreksiField label="Tendik Non-Kader" tipe="td" id={r.id} field="tendik_non_kader" value={r.tendik_non_kader}/>
            </div>
          </div>
        ))}

        {/* Penelitian level PTH */}
        {koreksiData.pen.map(r=>(
          <div key={r.id} className="card" style={{padding:18,marginBottom:12}}>
            <h4 style={{fontWeight:800,color:T.blue,marginBottom:12}}>🔬 Penelitian & PkM</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              <KoreksiField label="Sinta Score" tipe="pen" id={r.id} field="sinta_score" value={r.sinta_score}/>
              <KoreksiField label="GScholar Artikel" tipe="pen" id={r.id} field="gscholar_artikel" value={r.gscholar_artikel}/>
              <KoreksiField label="GScholar Citation" tipe="pen" id={r.id} field="gscholar_citation" value={r.gscholar_citation}/>
              <KoreksiField label="Scopus Artikel" tipe="pen" id={r.id} field="scopus_artikel" value={r.scopus_artikel}/>
              <KoreksiField label="Scopus Citation" tipe="pen" id={r.id} field="scopus_citation" value={r.scopus_citation}/>
              <KoreksiField label="Hibah Pemerintah" tipe="pen" id={r.id} field="hibah_pemerintah" value={r.hibah_pemerintah}/>
              <KoreksiField label="Hibah Eksternal" tipe="pen" id={r.id} field="hibah_eksternal" value={r.hibah_eksternal}/>
            </div>
          </div>
        ))}

        {/* Kerjasama & Alumni level PTH */}
        {koreksiData.ks.map(r=>(
          <div key={r.id} className="card" style={{padding:18,marginBottom:12}}>
            <h4 style={{fontWeight:800,color:T.green,marginBottom:12}}>🤝 Kerjasama & Alumni</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              <KoreksiField label="Alumni Kader" tipe="ks" id={r.id} field="alumni_kader" value={r.alumni_kader}/>
              <KoreksiField label="Alumni Non-Kader" tipe="ks" id={r.id} field="alumni_non_kader" value={r.alumni_non_kader}/>
              <KoreksiField label="Kerjasama DN" tipe="ks" id={r.id} field="kerjasama_dn" value={r.kerjasama_dn}/>
              <KoreksiField label="Kerjasama LN" tipe="ks" id={r.id} field="kerjasama_ln" value={r.kerjasama_ln}/>
            </div>
          </div>
        ))}

        {msg.text&&(
          <div style={{padding:"12px 16px",borderRadius:10,marginBottom:12,
            background:msg.type==="success"?"#f0fdf4":"#fef2f2",
            border:`1.5px solid ${msg.type==="success"?"#86efac":"#fca5a5"}`,
            color:msg.type==="success"?"#15803d":"#dc2626",
            fontWeight:700,fontSize:13}}>
            {msg.text}
          </div>
        )}
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={()=>{setKoreksiUpload(null);setKoreksiData(null);}} className="btn btn-ghost">Batal</button>
          <button onClick={simpanKoreksi} disabled={saving} className="btn btn-primary" style={{flex:1,opacity:saving?0.7:1}}>
            {saving?"⏳ Menyimpan data...":"💾 Simpan Koreksi"}
          </button>
        </div>
      </>)}
    </div>
  );

  return (
    <div>
      <SectionTitle title="📋 Riwayat Upload"/>
      {loading?<Spin/>:(
        <div className="card" style={{overflow:"hidden"}}>
          <div className="table-wrap">
            <table>
              <thead><tr>{isSuperAdmin&&<th>PTH</th>}<th>Semester</th><th>TA</th><th className="hide-mobile">File</th><th>Status</th><th className="hide-mobile">Tanggal</th>{!isSuperAdmin&&<th></th>}</tr></thead>
              <tbody>
                {uploads.length===0?(
                  <tr><td colSpan={7} style={{textAlign:"center",color:T.muted,padding:32}}>Belum ada data upload</td></tr>
                ):uploads.map((u,i)=>(
                  <tr key={i}>
                    {isSuperAdmin&&<td style={{fontWeight:700,color:T.navy,fontSize:12}}>{u.pth?.nama||"-"}</td>}
                    <td style={{fontWeight:700}}>{u.semester}</td>
                    <td style={{color:T.muted,fontSize:12}}>{u.tahun_akademik}</td>
                    <td className="hide-mobile" style={{color:T.muted,fontSize:11}}>{u.filename}</td>
                    <td><Tag label={sl(u.status)} color={sc(u.status)}/></td>
                    <td className="hide-mobile" style={{color:T.muted,fontSize:11}}>{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    {!isSuperAdmin&&(
                      <td>
                        {u.status==="approved"&&(
                          <button onClick={()=>bukaKoreksi(u)} className="btn-outline" style={{fontSize:11,padding:"4px 10px"}}>✏️ Koreksi</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── PAGE APPROVAL ── */
function PageApproval({ uploads, onRefresh }) {
  const [loading,setLoading]=useState(false);
  const [previewing,setPreviewing]=useState(null); // upload id yang sedang dipreview
  const [previewData,setPreviewData]=useState(null); // parsed excel data
  const [previewLoading,setPreviewLoading]=useState(false);
  const [previewErr,setPreviewErr]=useState("");

  const act=async(id,status)=>{
    setLoading(true);
    if(status==="approved"){
      const upload=uploads.find(u=>u.id===id);
      if(upload){
        const {data:oldUploads}=await supabase.from("uploads")
          .select("id")
          .eq("pth_id",upload.pth_id)
          .eq("semester",upload.semester)
          .eq("tahun_akademik",upload.tahun_akademik)
          .eq("status","approved")
          .neq("id",id);
        if(oldUploads&&oldUploads.length>0){
          const oldIds=oldUploads.map(u=>u.id);
          await supabase.from("data_dosen").delete().in("upload_id",oldIds);
          await supabase.from("data_mahasiswa").delete().in("upload_id",oldIds);
          await supabase.from("data_tendik").delete().in("upload_id",oldIds);
          await supabase.from("data_penelitian").delete().in("upload_id",oldIds);
          await supabase.from("data_kerjasama").delete().in("upload_id",oldIds);
          await supabase.from("uploads").delete().in("id",oldIds);
        }
      }
    }
    await supabase.from("uploads").update({status,reviewed_at:new Date().toISOString()}).eq("id",id);
    setPreviewing(null); setPreviewData(null);
    onRefresh(); setLoading(false);
  };

  const openPreview=async(u)=>{
    setPreviewing(u.id); setPreviewData(null); setPreviewErr(""); setPreviewLoading(true);
    try {
      if(!u.file_path) { setPreviewErr("File Excel tidak tersedia — upload ini dilakukan sebelum fitur penyimpanan file ditambahkan."); setPreviewLoading(false); return; }
      const {data,error}=await supabase.storage.from("uploads").download(u.file_path);
      if(error) throw error.message;
      const buf=await data.arrayBuffer();
      const parsed=await parseExcel(new File([buf],u.filename||"file.xlsx"));
      setPreviewData(parsed);
    } catch(e){ setPreviewErr("Gagal memuat file: "+String(e)); }
    setPreviewLoading(false);
  };

  const downloadFile=async(u)=>{
    if(!u.file_path){alert("File Excel tidak tersedia untuk upload ini.");return;}
    const {data,error}=await supabase.storage.from("uploads").download(u.file_path);
    if(error){alert("Gagal download: "+error.message);return;}
    const url=URL.createObjectURL(data);
    const a=document.createElement("a"); a.href=url; a.download=u.filename||"data.xlsx";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Jika sedang preview, tampilkan halaman preview
  if(previewing!==null){
    const u=uploads.find(x=>x.id===previewing);
    return (
      <div className="fade-up">
        <button onClick={()=>{setPreviewing(null);setPreviewData(null);setPreviewErr("");}} className="btn btn-ghost" style={{marginBottom:16}}>← Kembali ke Approval</button>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
          <div>
            <h2 style={{fontWeight:900,color:T.navy,fontSize:18}}>{u?.pth?.nama}</h2>
            <p style={{color:T.muted,fontSize:13,marginTop:4}}>Semester {u?.semester} — TA {u?.tahun_akademik} · {u?.filename}</p>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>downloadFile(u)} className="btn-outline" style={{fontSize:12,padding:"8px 14px"}}>⬇️ Download Excel</button>
            <button onClick={()=>act(u.id,"rejected")} disabled={loading} className="btn btn-red" style={{fontSize:12,padding:"8px 14px"}}>✕ Tolak</button>
            <button onClick={()=>act(u.id,"approved")} disabled={loading} className="btn btn-green" style={{fontSize:12,padding:"8px 14px"}}>✓ Setuju & Approve</button>
          </div>
        </div>

        {previewLoading&&<Spin/>}
        {previewErr&&<Alert type="error" msg={previewErr}/>}

        {previewData&&(
          <div className="fade-up">
            {/* Info Identitas */}
            <div className="card" style={{padding:18,marginBottom:12}}>
              <h3 style={{fontWeight:800,color:T.navy,marginBottom:12}}>📋 Identitas</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["PTH",previewData.identitas.nama_pth],["Semester",previewData.identitas.semester],["Tahun Akademik",previewData.identitas.tahun_akademik]].map(([l,v])=>(
                  <div key={l} style={{background:T.bg,borderRadius:9,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:700}}>{l}</div>
                    <div style={{fontWeight:800,color:T.navy,fontSize:13,marginTop:3}}>{v||"-"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabel Mahasiswa per Prodi */}
            <div className="card" style={{padding:18,marginBottom:12}}>
              <h3 style={{fontWeight:800,color:T.navy,marginBottom:12}}>🎓 Data Mahasiswa per Prodi</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Prodi</th><th>Aktif Total</th><th>Aktif Kader</th><th>Baru Total</th><th>Baru Kader</th><th>Student Body</th><th>Prestasi DN</th><th>Prestasi Intl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.daftarProdi.map((p,i)=>{
                      const d=previewData.prodi[p.nama]?.mahasiswa||{};
                      return (
                        <tr key={i}>
                          <td style={{fontWeight:700,color:T.navy,fontSize:12}}>{p.nama}<br/><span style={{fontSize:10,color:T.muted,fontWeight:400}}>{p.jenjang} · Akr. {p.akreditasi||"-"}</span></td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800}}>{d.total_aktif||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.aktif_kader||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",fontWeight:800}}>{d.total_baru||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.baru_kader||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.student_body||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.prestasi_dn||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.prestasi_int||0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel Dosen per Prodi */}
            <div className="card" style={{padding:18,marginBottom:12}}>
              <h3 style={{fontWeight:800,color:T.teal,marginBottom:12}}>👩‍🏫 Data Dosen per Prodi</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Prodi</th><th>S2</th><th>S3</th><th>Kader Total</th><th>Non-Kader Total</th><th>Guru Besar</th><th>Lektor Kepala</th><th>Lektor</th><th>Asisten Ahli</th><th>Tanpa JAD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.daftarProdi.map((p,i)=>{
                      const d=previewData.prodi[p.nama]?.dosen||{};
                      const kaderTotal=(d.tanpa_jad_kader||0)+(d.asisten_ahli_kader||0)+(d.lektor_kader||0)+(d.lektor_kepala_kader||0)+(d.guru_besar_kader||0);
                      const nonKaderTotal=(d.tanpa_jad_non_kader||0)+(d.asisten_ahli_non_kader||0)+(d.lektor_non_kader||0)+(d.lektor_kepala_non_kader||0)+(d.guru_besar_non_kader||0);
                      return (
                        <tr key={i}>
                          <td style={{fontWeight:700,color:T.navy,fontSize:12}}>{p.nama}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.s2||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{d.s3||0}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",color:T.green,fontWeight:800}}>{kaderTotal}</td>
                          <td style={{fontFamily:"'DM Mono',monospace",color:T.muted}}>{nonKaderTotal}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{(d.guru_besar_kader||0)+(d.guru_besar_non_kader||0)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{(d.lektor_kepala_kader||0)+(d.lektor_kepala_non_kader||0)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{(d.lektor_kader||0)+(d.lektor_non_kader||0)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{(d.asisten_ahli_kader||0)+(d.asisten_ahli_non_kader||0)}</td>
                          <td style={{fontFamily:"'DM Mono',monospace"}}>{(d.tanpa_jad_kader||0)+(d.tanpa_jad_non_kader||0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Penelitian & Kerjasama level PTH */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="two-col">
              <div className="card" style={{padding:18}}>
                <h3 style={{fontWeight:800,color:T.blue,marginBottom:12}}>🔬 Penelitian & PkM</h3>
                {[["Sinta Score",previewData.pth.sinta_score||0],["GScholar Artikel",previewData.pth.gscholar_artikel||0],["GScholar Sitasi",previewData.pth.gscholar_citation||0],["Scopus Artikel",previewData.pth.scopus_artikel||0],["Scopus Sitasi",previewData.pth.scopus_citation||0],["Hibah Pemerintah",previewData.pth.hibah_pemerintah||0],["Hibah Eksternal",previewData.pth.hibah_eksternal||0]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #dde6ef",fontSize:13}}>
                    <span style={{color:T.muted,fontWeight:600}}>{l}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:T.navy}}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:18}}>
                <h3 style={{fontWeight:800,color:T.green,marginBottom:12}}>🤝 Kerjasama & Alumni</h3>
                {[["Kerjasama DN",previewData.pth.kerjasama_dn||0],["Kerjasama LN",previewData.pth.kerjasama_ln||0],["Alumni Kader",previewData.pth.alumni_kader||0],["Alumni Non-Kader",previewData.pth.alumni_non_kader||0]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #dde6ef",fontSize:13}}>
                    <span style={{color:T.muted,fontWeight:600}}>{l}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:800,color:T.navy}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Approve/Reject di bawah juga */}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
              <button onClick={()=>act(u.id,"rejected")} disabled={loading} className="btn btn-red">✕ Tolak</button>
              <button onClick={()=>act(u.id,"approved")} disabled={loading} className="btn btn-green">✓ Setuju & Approve</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="✅ Approval Data" sub={`${uploads.length} data menunggu persetujuan`}/>
      {uploads.length===0?(
        <div className="card" style={{padding:40,textAlign:"center",color:T.muted}}>
          <div style={{fontSize:48,marginBottom:12}}>🎉</div>
          <div style={{fontWeight:700}}>Tidak ada data yang perlu disetujui</div>
        </div>
      ):uploads.map(u=>(
        <div key={u.id} className="card" style={{padding:18,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
            <div>
              <div style={{fontWeight:800,color:T.navy,marginBottom:4}}>{u.pth?.nama}</div>
              <div style={{fontSize:12,color:T.muted}}>Semester {u.semester} — TA {u.tahun_akademik}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>{u.filename} · {new Date(u.created_at).toLocaleDateString("id-ID")}</div>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
              <button onClick={()=>openPreview(u)} className="btn-outline" style={{fontSize:12,padding:"8px 14px"}}>🔍 Preview</button>
              <button onClick={()=>downloadFile(u)} className="btn-outline" style={{fontSize:12,padding:"8px 14px"}}>⬇️ Download</button>
              <button onClick={()=>act(u.id,"approved")} disabled={loading} className="btn btn-green" style={{fontSize:12,padding:"8px 14px"}}>✓ Setuju</button>
              <button onClick={()=>act(u.id,"rejected")} disabled={loading} className="btn btn-red" style={{fontSize:12,padding:"8px 14px"}}>✕ Tolak</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PAGE PROFIL PTH ── */
function PageProfilPTH({ user }) {
  const [pth,setPth]=useState({}); const [prodi,setProdi]=useState([]);
  const [editing,setEditing]=useState(false); const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false); const [loading,setLoading]=useState(true);
  const [showReqNama,setShowReqNama]=useState(false);
  const [reqNamaBaru,setReqNamaBaru]=useState(""); const [reqAlasan,setReqAlasan]=useState("");
  const [reqSaving,setReqSaving]=useState(false); const [reqMsg,setReqMsg]=useState({type:"",text:""});
  const [pendingReq,setPendingReq]=useState(null);
  const [pengurus,setPengurus]=useState([]);
  const [editPengurus,setEditPengurus]=useState(false);
  const [pengurusForm,setPengurusForm]=useState([]);
  const [savingPengurus,setSavingPengurus]=useState(false);
  const [pengurusMsg,setPengurusMsg]=useState({type:"",text:""});
  const [editProdi,setEditProdi]=useState(null); // prodi id yang sedang diedit
  const [prodiForm,setProdiForm]=useState({nama:"",jenjang:"",akreditasi:"",status:""});
  const [prodiMsg,setProdiMsg]=useState({type:"",text:""});
  const [savingProdi,setSavingProdi]=useState(false);
  const [confirmHapus,setConfirmHapus]=useState(null); // prodi id yang mau dihapus

  useEffect(()=>{
    Promise.all([
      supabase.from("pth").select("*").eq("id",user.pth_id).single(),
      supabase.from("prodi").select("*").eq("pth_id",user.pth_id),
      supabase.from("name_change_requests").select("*").eq("pth_id",user.pth_id).eq("status","pending").maybeSingle(),
      supabase.from("pengurus_pth").select("*,prodi(nama)").eq("pth_id",user.pth_id).order("jabatan"),
    ]).then(([{data:p},{data:pr},{data:req},{data:peng}])=>{
      setPth(p||{}); setProdi(pr||[]); setForm(p||{}); setPendingReq(req);
      setPengurus(peng||[]); setLoading(false);
    });
  },[user.pth_id]);

  const initPengurusForm = (prodiList) => {
    // Ketua
    const ketuaExist = pengurus.find(pg=>pg.jabatan==="ketua");
    const rows = [
      {jabatan:"ketua", label:"Ketua/Rektor", prodi_id:null, id:ketuaExist?.id||null, nama:ketuaExist?.nama||"", urutan:0},
    ];
    // Wakil Ketua — ambil semua, urutkan by urutan
    const wakilExist = [...pengurus.filter(pg=>pg.jabatan==="wakil_ketua")]
      .sort((a,b)=>(a.urutan||0)-(b.urutan||0));
    if(wakilExist.length===0){
      rows.push({jabatan:"wakil_ketua", label:"Wakil Ketua/Rektor", prodi_id:null, id:null, nama:"", bidang:"", urutan:1});
    } else {
      wakilExist.forEach((wk,i)=>rows.push({jabatan:"wakil_ketua", label:"Wakil Ketua/Rektor", prodi_id:null, id:wk.id, nama:wk.nama, bidang:wk.bidang||"", urutan:i+1}));
    }
    // Kaprodi per prodi
    prodiList.forEach((p,i)=>{
      const kp = pengurus.find(pg=>pg.jabatan==="kaprodi"&&pg.prodi_id===p.id);
      rows.push({jabatan:"kaprodi", label:`Kaprodi ${p.nama}`, prodi_id:p.id, id:kp?.id||null, nama:kp?.nama||"", urutan:i});
    });
    return rows;
  };

  const tambahWakil = () => {
    const jumlahWakil = pengurusForm.filter(r=>r.jabatan==="wakil_ketua").length;
    if(jumlahWakil>=10) return;
    const lastWakilIdx = pengurusForm.map(r=>r.jabatan).lastIndexOf("wakil_ketua");
    const newForm = [...pengurusForm];
    newForm.splice(lastWakilIdx+1, 0, {jabatan:"wakil_ketua", label:"Wakil Ketua/Rektor", prodi_id:null, id:null, nama:"", bidang:"", urutan:jumlahWakil+1});
    let wIdx=1;
    newForm.forEach(r=>{ if(r.jabatan==="wakil_ketua"){r.urutan=wIdx++;} });
    setPengurusForm(newForm);
  };

  const hapusWakil = (i) => {
    const newForm = pengurusForm.filter((_,idx)=>idx!==i);
    let wIdx=1;
    newForm.forEach(r=>{ if(r.jabatan==="wakil_ketua") r.label=`Wakil Ketua/Rektor ${wIdx++}`; });
    setPengurusForm(newForm);
  };

  const bukaEditPengurus = () => {
    setPengurusForm(initPengurusForm(prodi));
    setEditPengurus(true);
    setPengurusMsg({type:"",text:""});
  };

  const simpanPengurus = async () => {
    setSavingPengurus(true); setPengurusMsg({type:"",text:""});
    try {
      for(const r of pengurusForm){
        if(!r.nama.trim()) {
          if(r.id){
            const {error:delErr}=await supabase.from("pengurus_pth").delete().eq("id",r.id);
            if(delErr) throw new Error("Hapus gagal: "+delErr.message);
          }
          continue;
        }
        if(r.id){
          const {error:updErr}=await supabase.from("pengurus_pth")
            .update({nama:r.nama.trim(),urutan:r.urutan||0,bidang:(r.bidang||"").trim()||null,updated_at:new Date().toISOString()})
            .eq("id",r.id);
          if(updErr) throw new Error("Update gagal: "+updErr.message);
        } else {
          const {error:insErr}=await supabase.from("pengurus_pth")
            .insert({pth_id:parseInt(user.pth_id), jabatan:r.jabatan, nama:r.nama.trim(), prodi_id:r.prodi_id?parseInt(r.prodi_id):null, urutan:r.urutan||0, bidang:(r.bidang||'').trim()||null});
          if(insErr) throw new Error("Insert gagal: "+insErr.message);
        }
      }
      const {data:peng, error:selErr}=await supabase.from("pengurus_pth").select("*,prodi(nama)").eq("pth_id",user.pth_id).order("jabatan").order("urutan");
      if(selErr) throw new Error("Reload gagal: "+selErr.message);
      setPengurus(peng||[]);
      setPengurusMsg({type:"success",text:"✅ Data pengurus berhasil disimpan!"});
      setEditPengurus(false);
    } catch(e){
      setPengurusMsg({type:"error",text:"❌ "+e.message});
    }
    setSavingPengurus(false);
  };

  const save=async()=>{
    setSaving(true);
    await supabase.from("pth").update({...form,updated_at:new Date().toISOString()}).eq("id",user.pth_id);
    setPth(form); setSaving(false); setEditing(false);
  };

  const submitReqNama=async()=>{
    if(!reqNamaBaru.trim()) return setReqMsg({type:"error",text:"Nama baru wajib diisi."});
    setReqSaving(true); setReqMsg({type:"",text:""});
    const {error}=await supabase.from("name_change_requests").insert({
      pth_id:user.pth_id, nama_lama:pth.nama, nama_baru:reqNamaBaru.trim(),
      alasan:reqAlasan.trim(), requested_by:user.id, status:"pending"
    });
    if(error){setReqMsg({type:"error",text:error.message});setReqSaving(false);return;}
    setReqMsg({type:"success",text:"✅ Request terkirim! Menunggu persetujuan Super Admin."});
    setReqSaving(false); setShowReqNama(false); setReqNamaBaru(""); setReqAlasan("");
    // reload pending
    const {data:req}=await supabase.from("name_change_requests").select("*").eq("pth_id",user.pth_id).eq("status","pending").maybeSingle();
    setPendingReq(req);
  };
  if(loading) return <Spin/>;
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <SectionTitle title="🏛️ Profil PTH"/>
        <div style={{display:"flex",gap:8}}>
          {!pendingReq&&<button onClick={()=>setShowReqNama(!showReqNama)} className="btn-outline" style={{fontSize:12}}>🔄 Ganti Nama</button>}
          <button onClick={()=>setEditing(!editing)} className="btn-outline">{editing?"Batal":"✏️ Edit"}</button>
        </div>
      </div>

      {pendingReq&&(
        <Alert type="warn" msg={`⏳ Ada request ganti nama menunggu persetujuan: "${pendingReq.nama_lama}" → "${pendingReq.nama_baru}"`}/>
      )}
      {reqMsg.text&&<Alert type={reqMsg.type} msg={reqMsg.text}/>}

      {showReqNama&&(
        <div className="card" style={{padding:20,marginBottom:16,border:`2px solid ${T.orange}33`,background:T.orangeL}}>
          <h4 style={{fontWeight:800,color:T.orange,marginBottom:12}}>🔄 Request Perubahan Nama PTH</h4>
          <p style={{fontSize:12,color:T.muted,marginBottom:14}}>Nama saat ini: <strong>{pth.nama}</strong></p>
          <FieldRow label="Nama Baru">
            <input value={reqNamaBaru} onChange={e=>setReqNamaBaru(e.target.value)} placeholder="Masukkan nama baru PTH"/>
          </FieldRow>
          <FieldRow label="Alasan Perubahan (opsional)">
            <input value={reqAlasan} onChange={e=>setReqAlasan(e.target.value)} placeholder="Contoh: Perubahan bentuk dari STIE menjadi Universitas"/>
          </FieldRow>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowReqNama(false)} className="btn btn-ghost">Batal</button>
            <button onClick={submitReqNama} disabled={reqSaving} className="btn btn-accent" style={{color:T.navy}}>{reqSaving?"Mengirim...":"📨 Kirim Request"}</button>
          </div>
        </div>
      )}
      <div className="card" style={{padding:20,marginBottom:16}}>
        <h3 style={{fontWeight:900,color:T.navy,marginBottom:12}}>{pth.nama}</h3>
        {editing?(
          <div style={{display:"grid",gridTemplateColumns:window.innerWidth<600?"1fr":"1fr 1fr",gap:"0 16px"}} className="two-col">
            {[["nama_sk","Nama SK"],["badan_penyelenggara","Badan Penyelenggara"],["kota","Kota"],["provinsi","Provinsi"],["website","Website"],["telp","Telepon"]].map(([k,l])=>(
              <FieldRow key={k} label={l}><input value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/></FieldRow>
            ))}
            <FieldRow label="Akreditasi"><select value={form.akreditasi||""} onChange={e=>setForm({...form,akreditasi:e.target.value})}>{["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}</select></FieldRow>
            <FieldRow label="Struktur"><select value={form.struktur||""} onChange={e=>setForm({...form,struktur:e.target.value})}>{["STAI","STIT","STIE","STIS","STIKMA","IAI","Institut","Universitas"].map(o=><option key={o}>{o}</option>)}</select></FieldRow>
            <div style={{gridColumn:"1/-1"}}><button onClick={save} disabled={saving} className="btn btn-green">{saving?"Menyimpan...":"Simpan"}</button></div>
          </div>
        ):(
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["Nama SK",pth.nama_sk],["Badan Penyelenggara",pth.badan_penyelenggara],["Struktur",pth.struktur],["Akreditasi",pth.akreditasi],["Kota",pth.kota],["Provinsi",pth.provinsi],["Website",pth.website],["Telepon",pth.telp]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:9,padding:"10px 14px"}}>
                <div style={{fontSize:10,color:T.muted,fontWeight:700}}>{l}</div>
                <div style={{fontWeight:700,color:T.navy,fontSize:13,marginTop:3}}>{v||"-"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h3 style={{fontWeight:800,color:T.navy}}>Program Studi ({prodi.length})</h3>
      </div>
      {prodiMsg.text&&<Alert type={prodiMsg.type} msg={prodiMsg.text}/>}
      {confirmHapus&&(
        <div style={{background:T.redL,border:`1.5px solid ${T.red}33`,borderRadius:12,padding:"14px 18px",marginBottom:14}}>
          <div style={{fontWeight:700,color:T.red,marginBottom:10}}>⚠️ Hapus prodi "{prodi.find(p=>p.id===confirmHapus)?.nama}"? Semua data mahasiswa & dosen prodi ini ikut terhapus!</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setConfirmHapus(null)} className="btn btn-ghost" style={{fontSize:12}}>Batal</button>
            <button onClick={async()=>{
              setSavingProdi(true);
              await supabase.from("data_mahasiswa").delete().eq("prodi_id",confirmHapus);
              await supabase.from("data_dosen").delete().eq("prodi_id",confirmHapus);
              await supabase.from("data_tendik").delete().eq("prodi_id",confirmHapus);
              await supabase.from("pengurus_pth").delete().eq("prodi_id",confirmHapus);
              const {error}=await supabase.from("prodi").delete().eq("id",confirmHapus);
              if(error){setProdiMsg({type:"error",text:"Gagal hapus: "+error.message});}
              else{
                setProdi(prev=>prev.filter(p=>p.id!==confirmHapus));
                setProdiMsg({type:"success",text:"✅ Prodi berhasil dihapus."});
              }
              setConfirmHapus(null); setSavingProdi(false);
            }} disabled={savingProdi} className="btn btn-red" style={{fontSize:12}}>🗑️ Ya, Hapus</button>
          </div>
        </div>
      )}
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {prodi.length===0?(
          <div className="card" style={{padding:18,gridColumn:"1/-1",textAlign:"center",color:T.muted,fontSize:13}}>Belum ada prodi — otomatis terdaftar saat upload data pertama.</div>
        ):prodi.map(p=>(
          <div key={p.id} className="card" style={{padding:14}}>
            {editProdi===p.id?(
              <div>
                <FieldRow label="Nama Prodi"><input value={prodiForm.nama} onChange={e=>setProdiForm({...prodiForm,nama:e.target.value})}/></FieldRow>
                <FieldRow label="Jenjang">
                  <select value={prodiForm.jenjang} onChange={e=>setProdiForm({...prodiForm,jenjang:e.target.value})}>
                    <option value="">— Pilih —</option>
                    {["D3","D4","S1","S2","S3","Profesi"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </FieldRow>
                <FieldRow label="Akreditasi">
                  <select value={prodiForm.akreditasi} onChange={e=>setProdiForm({...prodiForm,akreditasi:e.target.value})}>
                    <option value="">— Pilih —</option>
                    {["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </FieldRow>
                <FieldRow label="Status">
                  <select value={prodiForm.status} onChange={e=>setProdiForm({...prodiForm,status:e.target.value})}>
                    <option value="">— Pilih —</option>
                    {["Aktif","Nonaktif"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </FieldRow>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button onClick={()=>{setEditProdi(null);setProdiMsg({type:"",text:""}); }} className="btn btn-ghost" style={{fontSize:12}}>Batal</button>
                  <button onClick={async()=>{
                    if(!prodiForm.nama.trim()) return setProdiMsg({type:"error",text:"Nama prodi wajib diisi."});
                    setSavingProdi(true);
                    const {error}=await supabase.from("prodi").update({nama:prodiForm.nama.trim(),jenjang:prodiForm.jenjang,akreditasi:prodiForm.akreditasi,status:prodiForm.status,updated_at:new Date().toISOString()}).eq("id",p.id);
                    if(error){setProdiMsg({type:"error",text:"Gagal: "+error.message});}
                    else{
                      setProdi(prev=>prev.map(x=>x.id===p.id?{...x,...prodiForm}:x));
                      setProdiMsg({type:"success",text:"✅ Prodi berhasil diperbarui."});
                      setEditProdi(null);
                    }
                    setSavingProdi(false);
                  }} disabled={savingProdi} className="btn btn-green" style={{fontSize:12}}>{savingProdi?"Menyimpan...":"💾 Simpan"}</button>
                </div>
              </div>
            ):(
              <>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontWeight:700,color:T.navy,fontSize:13}}>{p.nama}</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>{setEditProdi(p.id);setProdiForm({nama:p.nama||"",jenjang:p.jenjang||"",akreditasi:p.akreditasi||"",status:p.status||"Aktif"});setProdiMsg({type:"",text:""}); }} style={{background:"none",border:`1.5px solid ${T.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:T.navy,fontWeight:700}}>✏️</button>
                    <button onClick={()=>setConfirmHapus(p.id)} style={{background:"none",border:`1.5px solid ${T.red}44`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:T.red,fontWeight:700}}>🗑️</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Tag label={p.jenjang||"-"} color={T.cyan}/>
                  <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)}/>
                  {p.status&&p.status!=="Aktif"&&<Tag label={p.status} color={T.orange}/>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── SEKSI PENGURUS ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"20px 0 12px"}}>
        <h3 style={{fontWeight:800,color:T.navy}}>👥 Pengurus PTH</h3>
        <button onClick={editPengurus?()=>setEditPengurus(false):bukaEditPengurus} className="btn-outline" style={{fontSize:12}}>
          {editPengurus?"Batal":"✏️ Edit Pengurus"}
        </button>
      </div>
      {pengurusMsg.text&&<Alert type={pengurusMsg.type} msg={pengurusMsg.text}/>}

      {editPengurus?(
        <div className="card" style={{padding:20}}>
          {pengurusForm.map((r,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span>{r.label}</span>
                {r.jabatan==="wakil_ketua"&&pengurusForm.filter(x=>x.jabatan==="wakil_ketua").length>1&&(
                  <button onClick={()=>hapusWakil(i)} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,padding:"0 4px",lineHeight:1}}>✕</button>
                )}
              </div>
              {r.jabatan==="wakil_ketua"?(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <input value={r.bidang||""} onChange={e=>{const nf=[...pengurusForm];nf[i]={...nf[i],bidang:e.target.value};setPengurusForm(nf);}}
                    placeholder="Bidang (cth: Akademik)"
                    style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.blue}44`,fontSize:13,boxSizing:"border-box"}}/>
                  <input value={r.nama} onChange={e=>{const nf=[...pengurusForm];nf[i]={...nf[i],nama:e.target.value};setPengurusForm(nf);}}
                    placeholder="Nama"
                    style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,boxSizing:"border-box"}}/>
                </div>
              ):(
                <input value={r.nama} onChange={e=>{const nf=[...pengurusForm];nf[i]={...nf[i],nama:e.target.value};setPengurusForm(nf);}}
                  placeholder={`Nama ${r.label}`}
                  style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,boxSizing:"border-box"}}/>
              )}
              {/* Tombol tambah wakil — muncul setelah input wakil terakhir */}
              {r.jabatan==="wakil_ketua"&&i===pengurusForm.map(x=>x.jabatan).lastIndexOf("wakil_ketua")&&pengurusForm.filter(x=>x.jabatan==="wakil_ketua").length<10&&(
                <button onClick={tambahWakil} style={{marginTop:6,background:"none",border:`1.5px dashed ${T.blue}`,borderRadius:7,color:T.blue,fontSize:11,fontWeight:700,padding:"5px 12px",cursor:"pointer",width:"100%"}}>
                  + Tambah Wakil Ketua/Rektor
                </button>
              )}
            </div>
          ))}
          <button onClick={simpanPengurus} disabled={savingPengurus} className="btn btn-primary" style={{width:"100%",marginTop:4}}>
            {savingPengurus?"Menyimpan...":"💾 Simpan Pengurus"}
          </button>
        </div>
      ):(
        <div>
          {pengurus.length===0?(
            <div className="card" style={{padding:18,textAlign:"center",color:T.muted,fontSize:13}}>
              Belum ada data pengurus — klik Edit Pengurus untuk mengisi.
            </div>
          ):(
            <div className="two-col" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {(()=>{
                const wakilList = pengurus.filter(p=>p.jabatan==="wakil_ketua");
                return [
                  ...pengurus.filter(p=>p.jabatan==="ketua"),
                  ...wakilList,
                  ...pengurus.filter(p=>p.jabatan==="kaprodi"),
                ].map(p=>{
                  let jabatanLabel = "";
                  if(p.jabatan==="ketua") jabatanLabel="👑 Ketua/Rektor";
                  else if(p.jabatan==="kaprodi") jabatanLabel=`📚 Kaprodi ${p.prodi?.nama||""}`;
                  else {
                    jabatanLabel = p.bidang?`🏅 Wakil Ketua/Rektor Bid. ${p.bidang}`:"🏅 Wakil Ketua/Rektor";
                  }
                  return (
                <div key={p.id} className="card" style={{padding:14}}>
                  <div style={{fontSize:10,color:T.muted,fontWeight:700,marginBottom:4}}>
                    {jabatanLabel}{p.jabatan==="wakil_ketua"&&p.bidang?` — ${p.bidang}`:""}
                  </div>
                  <div style={{fontWeight:800,color:T.navy,fontSize:14}}>{p.nama}</div>
                </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── PAGE DATA PTH (Super Admin) ── */
function PageDataPTH({ pthList, onRefreshPTH }) {
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("list"); // list | requests
  const [requests,setRequests]=useState([]);
  const [actLoading,setActLoading]=useState(false);
  const [msg,setMsg]=useState({type:"",text:""});
  const [editProdiSA,setEditProdiSA]=useState(null);
  const [prodiFormSA,setProdiFormSA]=useState({nama:"",jenjang:"",akreditasi:"",status:""});
  const [confirmHapusSA,setConfirmHapusSA]=useState(null);
  const [savingProdiSA,setSavingProdiSA]=useState(false);
  const [prodiListSA,setProdiListSA]=useState({});

  useEffect(()=>{
    supabase.from("name_change_requests").select("*,pth(nama)").eq("status","pending").order("created_at",{ascending:false})
      .then(({data})=>setRequests(data||[]));
  },[]);

  const actReq=async(req,status)=>{
    setActLoading(true); setMsg({type:"",text:""});
    if(status==="approved"){
      // Update nama di tabel pth
      const {error}=await supabase.from("pth").update({nama:req.nama_baru,updated_at:new Date().toISOString()}).eq("id",req.pth_id);
      if(error){setMsg({type:"error",text:error.message});setActLoading(false);return;}
    }
    const {error:errReq}=await supabase.from("name_change_requests")
      .update({status, reviewed_at:new Date().toISOString()})
      .eq("id",req.id);
    if(errReq){
      setMsg({type:"error",text:"Gagal update status request: "+errReq.message});
      setActLoading(false); return;
    }
    setRequests(prev=>prev.filter(r=>r.id!==req.id));
    setMsg({type:"success",text:status==="approved"?`✅ Nama berhasil diubah menjadi "${req.nama_baru}"`:"Request ditolak."});
    if(status==="approved"&&onRefreshPTH) onRefreshPTH();
    setActLoading(false);
  };

  const p=pthList.find(x=>x.id===sel);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <SectionTitle title="🏛️ Data PTH"/>
        <div style={{display:"flex",gap:8}}>
          {[{key:"list",label:"📋 Daftar PTH"},{key:"requests",label:`🔄 Request Nama${requests.length>0?" ("+requests.length+")":""}`}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} className={tab===t.key?"btn btn-primary":"btn-outline"} style={{fontSize:12,padding:"8px 14px"}}>{t.label}</button>
          ))}
        </div>
      </div>

      {msg.text&&<Alert type={msg.type} msg={msg.text}/>}

      {tab==="requests"&&(
        <div className="fade-up">
          {requests.length===0?(
            <div className="card" style={{padding:40,textAlign:"center",color:T.muted}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <div style={{fontWeight:700}}>Tidak ada request perubahan nama</div>
            </div>
          ):requests.map(req=>(
            <div key={req.id} className="card" style={{padding:18,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                <div>
                  <div style={{fontWeight:800,color:T.navy,marginBottom:6}}>{req.pth?.nama}</div>
                  <div style={{fontSize:13,marginBottom:4}}>
                    <span style={{color:T.muted}}>Nama lama: </span>
                    <strong style={{color:T.red}}>{req.nama_lama}</strong>
                  </div>
                  <div style={{fontSize:13,marginBottom:4}}>
                    <span style={{color:T.muted}}>Nama baru: </span>
                    <strong style={{color:T.green}}>{req.nama_baru}</strong>
                  </div>
                  {req.alasan&&<div style={{fontSize:12,color:T.muted,marginTop:4}}>💬 {req.alasan}</div>}
                  <div style={{fontSize:11,color:T.muted,marginTop:6}}>{new Date(req.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>actReq(req,"approved")} disabled={actLoading} className="btn btn-green" style={{fontSize:12,padding:"8px 14px"}}>✓ Setuju</button>
                  <button onClick={()=>actReq(req,"rejected")} disabled={actLoading} className="btn btn-red" style={{fontSize:12,padding:"8px 14px"}}>✕ Tolak</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="list"&&sel&&p?(
        <div className="fade-up">
          <BackBtn onClick={()=>setSel(null)}/>
          <div className="card" style={{padding:20,marginBottom:16}}>
            <h3 style={{fontWeight:900,color:T.navy}}>{p.nama}</h3>
            <p style={{color:T.muted,marginTop:4,fontSize:13}}>{p.kota}, {p.provinsi}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
              <Tag label={`Akr. ${p.akreditasi||"-"}`} color={akrColor(p.akreditasi)}/>
              <Tag label={p.profil_lengkap?"Profil Lengkap":"Profil Belum Lengkap"} color={p.profil_lengkap?T.green:T.orange}/>
            </div>
          </div>
          <h3 style={{fontWeight:800,color:T.navy,marginBottom:12}}>Prodi ({(p.prodi||[]).length})</h3>
          {confirmHapusSA&&(
            <div style={{background:T.redL,border:`1.5px solid ${T.red}33`,borderRadius:12,padding:"14px 18px",marginBottom:14}}>
              <div style={{fontWeight:700,color:T.red,marginBottom:10}}>⚠️ Hapus prodi ini? Semua data terkait ikut terhapus!</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setConfirmHapusSA(null)} className="btn btn-ghost" style={{fontSize:12}}>Batal</button>
                <button onClick={async()=>{
                  setSavingProdiSA(true);
                  await supabase.from("data_mahasiswa").delete().eq("prodi_id",confirmHapusSA);
                  await supabase.from("data_dosen").delete().eq("prodi_id",confirmHapusSA);
                  await supabase.from("data_tendik").delete().eq("prodi_id",confirmHapusSA);
                  await supabase.from("pengurus_pth").delete().eq("prodi_id",confirmHapusSA);
                  await supabase.from("prodi").delete().eq("id",confirmHapusSA);
                  setConfirmHapusSA(null); setSavingProdiSA(false);
                  onRefreshPTH&&onRefreshPTH();
                }} disabled={savingProdiSA} className="btn btn-red" style={{fontSize:12}}>🗑️ Ya, Hapus</button>
              </div>
            </div>
          )}
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
            {(p.prodi||[]).map(pr=>(
              <div key={pr.id} className="card" style={{padding:14}}>
                {editProdiSA===pr.id?(
                  <div>
                    <FieldRow label="Nama Prodi"><input value={prodiFormSA.nama} onChange={e=>setProdiFormSA({...prodiFormSA,nama:e.target.value})}/></FieldRow>
                    <FieldRow label="Jenjang">
                      <select value={prodiFormSA.jenjang} onChange={e=>setProdiFormSA({...prodiFormSA,jenjang:e.target.value})}>
                        <option value="">— Pilih —</option>
                        {["D3","D4","S1","S2","S3","Profesi"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </FieldRow>
                    <FieldRow label="Akreditasi">
                      <select value={prodiFormSA.akreditasi} onChange={e=>setProdiFormSA({...prodiFormSA,akreditasi:e.target.value})}>
                        <option value="">— Pilih —</option>
                        {["A","B","C","Unggul","Baik Sekali","Baik","Belum Terakreditasi"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </FieldRow>
                    <FieldRow label="Status">
                      <select value={prodiFormSA.status} onChange={e=>setProdiFormSA({...prodiFormSA,status:e.target.value})}>
                        <option value="">— Pilih —</option>
                        {["Aktif","Nonaktif"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </FieldRow>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button onClick={()=>setEditProdiSA(null)} className="btn btn-ghost" style={{fontSize:12}}>Batal</button>
                      <button onClick={async()=>{
                        setSavingProdiSA(true);
                        await supabase.from("prodi").update({nama:prodiFormSA.nama.trim(),jenjang:prodiFormSA.jenjang,akreditasi:prodiFormSA.akreditasi,status:prodiFormSA.status,updated_at:new Date().toISOString()}).eq("id",pr.id);
                        setEditProdiSA(null); setSavingProdiSA(false);
                        onRefreshPTH&&onRefreshPTH();
                      }} disabled={savingProdiSA} className="btn btn-green" style={{fontSize:12}}>{savingProdiSA?"Menyimpan...":"💾 Simpan"}</button>
                    </div>
                  </div>
                ):(
                  <>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontWeight:700,color:T.navy,fontSize:13}}>{pr.nama}</div>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>{setEditProdiSA(pr.id);setProdiFormSA({nama:pr.nama||"",jenjang:pr.jenjang||"",akreditasi:pr.akreditasi||"",status:pr.status||"Aktif"});}} style={{background:"none",border:`1.5px solid ${T.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:T.navy,fontWeight:700}}>✏️</button>
                        <button onClick={()=>setConfirmHapusSA(pr.id)} style={{background:"none",border:`1.5px solid ${T.red}44`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:T.red,fontWeight:700}}>🗑️</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6}}><Tag label={pr.jenjang||"-"} color={T.cyan}/><Tag label={`Akr. ${pr.akreditasi||"-"}`} color={akrColor(pr.akreditasi)}/>{pr.status&&pr.status!=="Aktif"&&<Tag label={pr.status} color={T.orange}/>}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ):(
        <div className="two-col pth-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {pthList.map(p=>(
            <div key={p.id} className="card" style={{padding:18,cursor:"pointer"}}
              onClick={()=>setSel(p.id)}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.blue}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div style={{fontWeight:800,color:T.navy,marginBottom:6,fontSize:14}}>{p.nama}</div>
              <div style={{fontSize:12,color:T.muted,marginBottom:10}}>📍 {p.kota}, {p.provinsi}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Tag label={`${(p.prodi||[]).length} Prodi`} color={T.cyan}/>
                <Tag label={p.profil_lengkap?"Lengkap":"Belum Lengkap"} color={p.profil_lengkap?T.green:T.orange}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PAGE REKAP EXPORT (Super Admin) ── */
function PageRekap({ pthList }) {
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");

  const buildData=async()=>{
    const [{data:mhs},{data:dosen},{data:pen},{data:ks}]=await Promise.all([
      supabase.from("data_mahasiswa").select("*,pth(nama),prodi(nama)").order("created_at",{ascending:false}),
      supabase.from("data_dosen").select("*,pth(nama),prodi(nama)").order("created_at",{ascending:false}),
      supabase.from("data_penelitian").select("*,pth(nama)").order("created_at",{ascending:false}),
      supabase.from("data_kerjasama").select("*,pth(nama)").order("created_at",{ascending:false}),
    ]);
    return {mhs:mhs||[],dosen:dosen||[],pen:pen||[],ks:ks||[]};
  };

  const exportExcel=async()=>{
    setLoading(true); setMsg("");
    try {
      const {mhs,dosen,pen,ks}=await buildData();
      const wb=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
        ["PTH","Prodi","Semester","TA","Aktif Total","Aktif Kader","Aktif Non-Kader","Baru Total","Baru Kader","Student Body","Prestasi DN","Prestasi Intl"],
        ...mhs.map(r=>[r.pth?.nama||"",r.prodi?.nama||"",r.semester,r.tahun_akademik,r.total_mhs_aktif||0,r.mhs_aktif_kader||0,r.mhs_aktif_non_kader||0,r.total_mhs_baru||0,r.mhs_baru_kader||0,r.student_body||0,r.prestasi_dalam_negeri||0,r.prestasi_internasional||0])
      ]),"Mahasiswa");
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
        ["PTH","Prodi","Semester","TA","S2","S3","TJ Kader","TJ Non","AA Kader","AA Non","Lektor Kdr","Lektor Non-Kader","LK Kdr","LK Non","GB Kdr","GB Non"],
        ...dosen.map(r=>[r.pth?.nama||"",r.prodi?.nama||"",r.semester,r.tahun_akademik,r.dosen_s2||0,r.dosen_s3||0,r.tanpa_jad_kader||0,r.tanpa_jad_non_kader||0,r.asisten_ahli_kader||0,r.asisten_ahli_non_kader||0,r.lektor_kader||0,r.lektor_non_kader||0,r.lektor_kepala_kader||0,r.lektor_kepala_non_kader||0,r.guru_besar_kader||0,r.guru_besar_non_kader||0])
      ]),"Dosen");
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
        ["PTH","Semester","TA","Sinta Score","GScholar Artikel","GScholar Sitasi","Scopus Artikel","Scopus Sitasi","Hibah Pemda","Hibah Eksternal"],
        ...pen.map(r=>[r.pth?.nama||"",r.semester,r.tahun_akademik,r.sinta_score||0,r.gscholar_artikel||0,r.gscholar_citation||0,r.scopus_artikel||0,r.scopus_citation||0,r.hibah_pemerintah||0,r.hibah_eksternal||0])
      ]),"Penelitian");
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
        ["PTH","Semester","TA","Kerjasama DN","Kerjasama LN","Alumni Kader","Alumni Non-Kader"],
        ...ks.map(r=>[r.pth?.nama||"",r.semester,r.tahun_akademik,r.kerjasama_dn||0,r.kerjasama_ln||0,r.alumni_kader||0,r.alumni_non_kader||0])
      ]),"Kerjasama & Alumni");
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
        ["PTH","Kota","Provinsi","Akreditasi","Jumlah Prodi"],
        ...pthList.map(p=>[p.nama,p.kota,p.provinsi,p.akreditasi,(p.prodi||[]).length])
      ]),"Ringkasan PTH");
      XLSX.writeFile(wb,`Rekap_PDDIKTI_${new Date().toISOString().slice(0,10)}.xlsx`);
      setMsg("✅ File Excel berhasil diunduh!");
    } catch(e){setMsg("❌ Gagal: "+e.message);}
    setLoading(false);
  };

  const exportPDF=async()=>{
    setLoading(true); setMsg("");
    try {
      const {mhs,pen,ks}=await buildData();
      const pthMap={};
      pthList.forEach(p=>{pthMap[p.id]={nama:p.nama,kota:p.kota||"-",akr:p.akreditasi||"-",prodi:(p.prodi||[]).length,mhs:0,alumni:0,sinta:0};});
      mhs.forEach(r=>{if(pthMap[r.pth_id])pthMap[r.pth_id].mhs+=r.total_mhs_aktif||0;});
      pen.forEach(r=>{if(pthMap[r.pth_id])pthMap[r.pth_id].sinta+=parseFloat(r.sinta_score)||0;});
      ks.forEach(r=>{if(pthMap[r.pth_id])pthMap[r.pth_id].alumni+=(r.alumni_kader||0)+(r.alumni_non_kader||0);});
      const rows=Object.values(pthMap);
      const now=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
      const html=`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:Arial,sans-serif;margin:40px;color:#1a2535;font-size:13px}h1{font-size:20px;font-weight:900;color:#0d2137;margin-bottom:4px}h2{font-size:15px;color:#1e4472;margin-bottom:4px}.sub{color:#64748b;font-size:11px;margin-bottom:24px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th{background:#0d2137;color:#fff;padding:8px 12px;font-size:11px;text-align:left}td{padding:8px 12px;border-bottom:1px solid #dde6ef;font-size:12px}tr:nth-child(even) td{background:#f4f7fb}.footer{font-size:10px;color:#64748b;text-align:center;margin-top:32px;padding-top:12px;border-top:1px solid #dde6ef}</style></head><body>
<h1>PDDIKTI Hidayatullah</h1><h2>Rekap Data Seluruh PTH</h2><div class="sub">Dicetak: ${now}</div>
<table><thead><tr><th>No</th><th>Nama PTH</th><th>Kota</th><th>Akreditasi</th><th>Prodi</th><th>Mahasiswa</th><th>Alumni</th><th>Sinta Score</th></tr></thead><tbody>
${rows.map((r,i)=>`<tr><td>${i+1}</td><td><b>${r.nama}</b></td><td>${r.kota}</td><td>${r.akr}</td><td>${r.prodi}</td><td>${r.mhs}</td><td>${r.alumni}</td><td>${r.sinta.toFixed(1)}</td></tr>`).join("")}
<tr style="font-weight:900;background:#f0fdf4"><td colspan="4"><b>TOTAL</b></td><td><b>${rows.reduce((s,r)=>s+r.prodi,0)}</b></td><td><b>${rows.reduce((s,r)=>s+r.mhs,0)}</b></td><td><b>${rows.reduce((s,r)=>s+r.alumni,0)}</b></td><td><b>${rows.reduce((s,r)=>s+r.sinta,0).toFixed(1)}</b></td></tr>
</tbody></table>
<div class="footer">Generated dari PDDIKTI Hidayatullah · ${now}</div></body></html>`;
      const win=window.open("","_blank");
      win.document.write(html); win.document.close();
      setTimeout(()=>win.print(),600);
      setMsg("✅ Dokumen PDF siap dicetak!");
    } catch(e){setMsg("❌ Gagal: "+e.message);}
    setLoading(false);
  };

  return (
    <div>
      <SectionTitle title="📥 Unduh Rekap Data" sub="Download rekap seluruh data dari semua PTH"/>
      {msg&&<Alert type={msg.startsWith("✅")?"success":"error"} msg={msg}/>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}} className="two-col">
        <div className="card" style={{padding:28,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>📊</div>
          <h3 style={{fontWeight:900,color:T.navy,marginBottom:8}}>Export Excel</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:20,lineHeight:1.5}}>Rekap lengkap semua data: Mahasiswa, Dosen, Penelitian, Kerjasama — per PTH & prodi.</p>
          <button onClick={exportExcel} disabled={loading} className="btn btn-green" style={{width:"100%"}}>{loading?"Memproses...":"⬇️ Download Excel"}</button>
        </div>
        <div className="card" style={{padding:28,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>📄</div>
          <h3 style={{fontWeight:900,color:T.navy,marginBottom:8}}>Export PDF</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:20,lineHeight:1.5}}>Ringkasan data seluruh PTH dalam format PDF siap cetak dan laporan.</p>
          <button onClick={exportPDF} disabled={loading} className="btn btn-primary" style={{width:"100%"}}>{loading?"Memproses...":"🖨️ Print / Simpan PDF"}</button>
        </div>
      </div>
      <div className="card" style={{padding:20}}>
        <h3 style={{fontWeight:800,color:T.navy,marginBottom:16}}>Preview Ringkasan</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>PTH</th><th>Kota</th><th>Akreditasi</th><th>Prodi</th></tr></thead>
            <tbody>
              {pthList.map(p=>(
                <tr key={p.id}><td style={{fontWeight:700,color:T.navy,fontSize:13}}>{p.nama}</td><td style={{color:T.muted,fontSize:12}}>{p.kota}</td><td><Tag label={p.akreditasi||"-"} color={akrColor(p.akreditasi)}/></td><td style={{fontFamily:"'DM Mono',monospace",fontWeight:800}}>{(p.prodi||[]).length}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE USERS ── */
function PageUsers() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null); // user_id yang sedang diedit
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = () => {
    supabase.from("user_roles").select("*,pth(nama)").order("pth_id")
      .then(({ data }) => setUsers(data || []));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (u) => {
    setEditing(u.user_id);
    setForm({ nama: u.nama || "", email: u.email || "", password: "" });
    setMsg({ type: "", text: "" });
  };

  const save = async () => {
    if (!form.nama || !form.email) return setMsg({ type: "error", text: "Nama dan email wajib diisi." });
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      // Update nama di user_roles
      const { error: re } = await supabase.from("user_roles")
        .update({ nama: form.nama })
        .eq("user_id", editing);
      if (re) throw re.message;

      // Update email & password via Supabase Admin API (service role) — tidak bisa dari anon key
      // Solusi: panggil Edge Function atau gunakan SQL langsung via rpc
      // Karena kita pakai anon key, kita simpan email baru di user_roles saja sebagai referensi
      // dan update password via SQL RPC yang sudah kita buat

      // Update email di auth.users via RPC
      const { error: ee } = await supabase.rpc("admin_update_user_email", {
        target_user_id: editing,
        new_email: form.email,
      });
      if (ee) throw "Gagal update email: " + ee.message;

      // Update password jika diisi
      if (form.password) {
        const { error: pe } = await supabase.rpc("admin_update_user_password", {
          target_user_id: editing,
          new_password: form.password,
        });
        if (pe) throw "Gagal update password: " + pe.message;
      }

      setMsg({ type: "success", text: "✅ Data berhasil diperbarui!" });
      setEditing(null);
      load();
    } catch (e) {
      setMsg({ type: "error", text: String(e) });
    }
    setSaving(false);
  };

  return (
    <div>
      <SectionTitle title="👥 Kelola User" sub="Klik ✏️ untuk edit email dan password akun admin"/>
      {msg.text && <Alert type={msg.type} msg={msg.text}/>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map((u) => (
          <div key={u.user_id} className="card" style={{ padding: 18 }}>
            {editing === u.user_id ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Tag label={u.role === "superadmin" ? "Super Admin" : "Admin PTH"} color={u.role === "superadmin" ? T.accent : T.blue}/>
                  {u.pth?.nama && <span style={{ fontSize: 12, color: T.muted }}>{u.pth.nama}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="two-col">
                  <FieldRow label="Nama Tampilan">
                    <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })}/>
                  </FieldRow>
                  <FieldRow label="Email Login">
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
                  </FieldRow>
                  <FieldRow label="Password Baru (kosongkan jika tidak diganti)">
                    <input type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
                  </FieldRow>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button onClick={() => setEditing(null)} className="btn btn-ghost">Batal</button>
                  <button onClick={save} disabled={saving} className="btn btn-green">
                    {saving ? "Menyimpan..." : "💾 Simpan"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, color: T.navy, fontSize: 14 }}>{u.nama}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                    {u.pth?.nama || "— Semua PTH —"}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Tag label={u.role === "superadmin" ? "Super Admin" : "Admin PTH"} color={u.role === "superadmin" ? T.accent : T.blue}/>
                  </div>
                </div>
                <button onClick={() => openEdit(u)} className="btn-outline" style={{ fontSize: 13, flexShrink: 0 }}>
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ADMIN PANEL ── */
function AdminPanel({ user, onLogout }) {
  const [page,setPage]=useState("upload");
  const [uploads,setUploads]=useState([]); const [pthList,setPthList]=useState([]);
  const [loadingData,setLoadingData]=useState(false);
  const isSuperAdmin=user.role==="superadmin";
  const {isMobile}=useBreakpoint();

  const loadUploads=useCallback(async()=>{
    setLoadingData(true);
    let q=supabase.from("uploads").select("*,pth(nama)").order("created_at",{ascending:false});
    if(!isSuperAdmin) q=q.eq("pth_id",user.pth_id);
    const {data}=await q; setUploads(data||[]); setLoadingData(false);
  },[isSuperAdmin,user.pth_id]);

  const loadPTH=useCallback(async()=>{
    const {data}=await supabase.from("pth").select("*,prodi(*)").order("id");
    setPthList(data||[]);
  },[]);

  useEffect(()=>{loadUploads();if(isSuperAdmin)loadPTH();},[loadUploads,loadPTH,isSuperAdmin]);

  const NAV=[
    {key:"profil",icon:"🏛️",label:"Profil PTH"},
    {key:"upload",icon:"📤",label:"Input Data"},
    {key:"history",icon:"📋",label:"Riwayat"},
    ...(isSuperAdmin?[
      {key:"approval",icon:"✅",label:"Approval"},
      {key:"rekap",icon:"📥",label:"Rekap"},
      {key:"datapth",icon:"🏛️",label:"Data PTH"},
      {key:"users",icon:"👥",label:"Users"},
    ]:[

    ]),
  ];

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
      <aside className="desktop-sidebar" style={{width:200,background:T.navyM,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 12px",borderBottom:"1px solid #ffffff14"}}>
          <div style={{background:T.accent+"22",borderRadius:9,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:T.accent,fontWeight:800,letterSpacing:"0.05em"}}>LOGIN SEBAGAI</div>
            <div style={{fontWeight:800,color:"#fff",fontSize:13,marginTop:3}}>{user.nama}</div>
            <div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{isSuperAdmin?"Super Admin DPP":"Admin PTH"}</div>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 8px"}}>
          {NAV.map(n=>(
            <div key={n.key} onClick={()=>setPage(n.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,marginBottom:2,cursor:"pointer",background:page===n.key?"#ffffff1a":"transparent",borderLeft:page===n.key?"3px solid "+T.accent:"3px solid transparent"}}>
              <span style={{fontSize:15}}>{n.icon}</span>
              <span style={{fontSize:13,fontWeight:page===n.key?800:500,color:page===n.key?"#fff":"#94a3b8"}}>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{padding:"10px 12px",borderTop:"1px solid #ffffff14"}}>
          <button onClick={onLogout} style={{width:"100%",background:"#ffffff14",color:"#fff",border:"none",borderRadius:8,padding:"9px",fontWeight:700,fontSize:12,cursor:"pointer"}}>🚪 Logout</button>
        </div>
      </aside>

      <div className="mobile-nav">
        {NAV.slice(0,5).map(n=>(
          <button key={n.key} onClick={()=>setPage(n.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"8px 2px",border:"none",background:"none",cursor:"pointer",color:page===n.key?T.accent:"#94a3b8"}}>
            <span style={{fontSize:16}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:700}}>{n.label}</span>
          </button>
        ))}
      </div>

      <main className="main-content" style={{flex:1,overflow:"auto",padding:"20px"}}>
        {page==="upload"&&<PageUpload user={user} onDone={loadUploads}/>}
        {page==="history"&&<PageHistory uploads={uploads} loading={loadingData} isSuperAdmin={isSuperAdmin} user={user} onRefresh={loadUploads}/>}
        {page==="approval"&&isSuperAdmin&&<PageApproval uploads={uploads.filter(u=>u.status==="pending")} onRefresh={loadUploads}/>}
        {page==="rekap"&&isSuperAdmin&&<PageRekap pthList={pthList}/>}
        {page==="datapth"&&isSuperAdmin&&<PageDataPTH pthList={pthList} onRefreshPTH={loadPTH}/>}
        {page==="profil"&&!isSuperAdmin&&<PageProfilPTH user={user}/>}
        {page==="profil"&&isSuperAdmin&&<PageDataPTH pthList={pthList} onRefreshPTH={loadPTH}/>}
        {page==="users"&&isSuperAdmin&&<PageUsers/>}
      </main>
    </div>
  );
}

/* ── ROOT APP ── */
export default function App() {
  const [showLogin,setShowLogin]=useState(false);
  const [user,setUser]=useState(null);
  const [checking,setChecking]=useState(true); // true dulu = cek sesi dulu
  const [needProfil,setNeedProfil]=useState(false);

  // Fungsi restore user dari session Supabase
  const restoreUser = async (sessionUser) => {
    if(!sessionUser) { setChecking(false); return; }
    const {data:rd}=await supabase.from("user_roles").select("*,pth(*)").eq("user_id",sessionUser.id).single();
    if(!rd) { setChecking(false); return; }
    const u = {
      id: sessionUser.id,
      email: sessionUser.email,
      role: rd.role,
      nama: rd.nama,
      pth_id: rd.pth_id,
      pth: rd.pth,
    };
    setUser(u);
    if(u.role==="pth"){
      const {data}=await supabase.from("pth").select("profil_lengkap").eq("id",u.pth_id).single();
      // Jika query gagal (null karena RLS), anggap profil sudah lengkap agar tidak loop
      setNeedProfil(data ? !data.profil_lengkap : false);
    }
    setChecking(false);
  };

  // Cek sesi saat pertama load + dengerin perubahan auth
  useEffect(()=>{
    // Cek sesi yang sudah ada (setelah refresh)
    supabase.auth.getSession().then(({data:{session}})=>{
      restoreUser(session?.user || null);
    });
    // Dengerin perubahan login/logout
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(!session) { setUser(null); setNeedProfil(false); setChecking(false); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleLogin=async u=>{
    setShowLogin(false); setUser(u);
    if(u.role==="pth"){
      setChecking(true);
      const {data}=await supabase.from("pth").select("profil_lengkap").eq("id",u.pth_id).single();
      // Jika query gagal (null karena RLS), anggap profil sudah lengkap agar tidak loop
      setNeedProfil(data ? !data.profil_lengkap : false); setChecking(false);
    }
  };
  const handleLogout=async()=>{await supabase.auth.signOut();setUser(null);setNeedProfil(false);};

  if(checking) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Spin/></div>;
  if(user&&needProfil) return <FormProfilPTH user={user} onDone={()=>setNeedProfil(false)} onLogout={handleLogout}/>;

  return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif",background:T.bg}}>
        {showLogin&&<LoginModal onLogin={handleLogin} onClose={()=>setShowLogin(false)}/>}
        {!user?(
          <>
            <PublicHeader onLoginClick={()=>setShowLogin(true)}/>
            <PublicDashboard/>
          </>
        ):(
          <>
            <header style={{background:T.navy,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,flexShrink:0,position:"sticky",top:0,zIndex:50}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,background:T.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:T.navy,fontSize:11}}>PD</div>
                <span style={{fontWeight:900,color:"#fff",fontSize:14}}>PDDIKTI <span style={{color:"#64748b",fontSize:11,fontWeight:500}}>— Admin</span></span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"#94a3b8",fontSize:11}} className="hide-mobile">👤 {user.nama}</span>
                <button onClick={handleLogout} style={{background:"#ffffff14",color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>Logout</button>
              </div>
            </header>
            <div style={{flex:1,display:"flex",overflow:"hidden"}}>
              <AdminPanel user={user} onLogout={handleLogout}/>
            </div>
          </>
        )}
      </div>
    </>
  );
}
