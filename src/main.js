import { createClient } from '@supabase/supabase-js';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const sb = url && key ? createClient(url, key) : null;
const fmt = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
const num = n => new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(Number(n||0));
const app = document.querySelector('#app');

const modules = [
 ['Executive Cockpit','⌂'],['Land Bank','▦'],['Property & Asset','◈'],['Development','◆'],['Investment','◇'],['Finance','Rp'],['Contracts & Legal','§'],['Risk & Compliance','!'],['Governance','✓'],['KPI & Alerts','◉']
];

app.innerHTML = `<div class="shell"><aside><div class="brand"><span>AD</span><div><b>ADTRANS</b><small>REALINDO · IMCS</small></div></div><nav>${modules.map(([x,i],n)=>`<button class="nav ${n===0?'active':''}" data-page="${x}"><span>${i}</span>${x}</button>`).join('')}</nav><div class="sidefoot"><b>CONTROL • GOVERN • GROW</b><br><span>Production foundation · v1.0</span></div></aside><main><header><div><div class="eyebrow">INTEGRATED MANAGEMENT CONTROL SYSTEM</div><h1 id="title">Executive Cockpit</h1></div><div class="top-actions"><span class="status"><i></i><span id="connection">${sb?'SUPABASE CONNECTED':'LOCAL MODE'}</span></span><button id="refresh" class="ghost">↻ Refresh</button></div></header><section id="content"></section></main></div>`;

const content = document.querySelector('#content');
const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function loading(){ content.innerHTML='<div class="loading"><span></span><span></span><span></span> Loading management data…</div>'; }
function empty(title,desc){return `<div class="empty"><div class="emptyicon">◇</div><h3>${title}</h3><p>${desc}</p></div>`}

async function query(table, columns='*', limit=8){
 if(!sb) return {data:[],error:null};
 return sb.from(table).select(columns).limit(limit);
}

async function dashboard(){
 loading();
 if(!sb){ renderDashboard({landArea:0,gdv:0,cost:0,risks:0,projects:0}); return; }
 try{
  const [l,p,r,c] = await Promise.all([
   query('land_assets','area_m2',1000), query('property_projects','gdv',1000),
   sb.from('project_risks').select('id').is('closed_at',null).limit(1000),
   query('project_costs','budget,actual',1000)
  ]);
  const landArea=(l.data||[]).reduce((a,x)=>a+Number(x.area_m2||0),0);
  const gdv=(p.data||[]).reduce((a,x)=>a+Number(x.gdv||0),0);
  const budget=(c.data||[]).reduce((a,x)=>a+Number(x.budget||0),0);
  const actual=(c.data||[]).reduce((a,x)=>a+Number(x.actual||0),0);
  renderDashboard({landArea,gdv,cost:budget?Math.round(actual/budget*100):0,risks:(r.data||[]).length,projects:(p.data||[]).length});
 }catch(e){ console.error(e); renderDashboard({landArea:0,gdv:0,cost:0,risks:0,projects:0,error:e.message}); }
}

function renderDashboard(m){
 content.innerHTML=`<div class="hero"><div><p class="eyebrow">ADTRANS REALINDO</p><h2>Control the portfolio.<br><em>Decide with evidence.</em></h2><p class="muted">Satu control plane untuk tanah, proyek properti, investasi, keuangan, risiko, kontrak dan tata kelola—dibangun untuk keputusan manajemen yang dapat diaudit.</p><div class="hero-actions"><button class="primary" data-page-jump="Land Bank">Open portfolio →</button><button class="secondary" data-page-jump="Risk & Compliance">Review risks</button></div></div><div class="signal"><span>CONTROL STATUS</span><strong>OPERATIONAL</strong><small>Live connection ke Supabase. Data legacy tidak dipromosikan tanpa validasi.</small><div class="signalline"><i></i><i></i><i></i><i></i><i></i></div></div></div><div class="cards"><article><span>LAND BANK</span><b>${num(m.landArea)} <small>m²</small></b><label>Controlled land area</label></article><article><span>PROJECT GDV</span><b>${fmt(m.gdv)}</b><label>Gross development value</label></article><article><span>COST EXECUTION</span><b>${m.cost}%</b><label>Actual against budget</label></article><article><span>OPEN RISKS</span><b>${num(m.risks)}</b><label>Unclosed risk register</label></article></div><div class="grid"><div class="panel"><div class="panelhead"><div><h3>Management Control Plane</h3><p>Core operating domains</p></div><span>LIVE VIEW</span></div><div class="domain-grid">${modules.slice(1).map(([n,ic])=>`<button data-page-jump="${n}"><span>${ic}</span><div><b>${n}</b><small>Open module</small></div><strong>→</strong></button>`).join('')}</div></div><div class="panel"><div class="panelhead"><div><h3>Control Principles</h3><p>Governance by design</p></div></div><ul class="principles"><li>Evidence before migration</li><li>RLS + organization isolation</li><li>Approval & audit trail</li><li>No fabricated business data</li><li>Decision-ready management view</li></ul></div></div>`;
 bindJumps();
}

const configs = {
 'Land Bank': {table:'land_assets',title:'LAND BANK',desc:'Register bidang tanah, legal status, valuation, zoning, encumbrance dan development potential.',cols:['id','area_m2','status','location','acquisition_value'],labels:['ID','Area','Status','Location','Acquisition Value']},
 'Property & Asset': {table:'properties',title:'PROPERTY & ASSET',desc:'Portfolio properti dan lifecycle aset dengan kontrol ownership, status dan nilai.',cols:['id','name','asset_type','status','value'],labels:['ID','Name','Type','Status','Value']},
 'Development': {table:'property_projects',title:'DEVELOPMENT CONTROL',desc:'Pipeline proyek, target GDV, margin, timeline dan delivery control.',cols:['code','name','status','gdv','target_margin_pct'],labels:['Code','Project','Status','GDV','Margin']},
 'Investment': {table:'investment_cases',title:'INVESTMENT',desc:'Investment case, return metrics dan decision workflow untuk capital allocation.',cols:['id','name','status','investment_amount','irr'],labels:['ID','Case','Status','Investment','IRR']},
 'Finance': {table:'financial_transactions',title:'FINANCE CONTROL',desc:'Transaction ledger, project cash movement dan reference-based financial control.',cols:['transaction_date','account_code','description','debit','credit'],labels:['Date','Account','Description','Debit','Credit']},
 'Contracts & Legal': {table:'contracts',title:'CONTRACT & LEGAL',desc:'Contract register, counterparty, value, dates dan document control.',cols:['contract_no','title','counterparty','value','status'],labels:['Contract No','Title','Counterparty','Value','Status']},
 'Risk & Compliance': {table:'project_risks',title:'RISK & COMPLIANCE',desc:'Risk register, probability, impact, mitigation dan ownership untuk early intervention.',cols:['title','level','probability','impact','due_date'],labels:['Risk','Level','Probability','Impact','Due Date']},
 'Governance': {table:'approvals',title:'GOVERNANCE',desc:'Approval matrix, segregation of duties, decisions dan audit trail.',cols:['id','status','created_at','organization_id'],labels:['ID','Status','Created','Organization']},
 'KPI & Alerts': {table:'management_alerts',title:'KPI & MANAGEMENT ALERTS',desc:'Early-warning signals dan management alerts untuk menjaga target tetap terkendali.',cols:['title','severity','status','created_at'],labels:['Alert','Severity','Status','Created']}
};

async function modulePage(name){
 const cfg=configs[name]; if(!cfg){dashboard();return;}
 loading();
 let rows=[], error=null;
 if(sb){const res=await query(cfg.table,cfg.cols.join(','),25); rows=res.data||[]; error=res.error?.message;}
 const body = rows.length ? `<div class="tablewrap"><table><thead><tr>${cfg.labels.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cfg.cols.map((c,i)=>`<td>${formatCell(c,r[c],i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : empty('No production records yet',sb?(error||'The module is ready. Records will appear after authorized data entry.'):'Connect Supabase to display production records.');
 content.innerHTML=`<div class="module-head"><div><p class="eyebrow">ADTRANS REALINDO IMCS</p><h2>${cfg.title}</h2><p class="muted">${cfg.desc}</p></div><div class="module-tools"><span class="count">${rows.length} records</span><button class="primary" id="reload-module">↻ Refresh</button></div></div><div class="module-note"><span>●</span><div><b>CONTROLLED DATA VIEW</b><small>Organization-scoped access is enforced by Supabase RLS. Legacy Akvisio data remains outside production until reconciliation is approved.</small></div></div>${body}`;
 document.querySelector('#reload-module')?.addEventListener('click',()=>modulePage(name));
}
function formatCell(c,v,i){
 if(v==null||v==='')return '<span class="dash">—</span>';
 if(['value','gdv','investment_amount','debit','credit','acquisition_value'].includes(c)) return `<strong>${fmt(v)}</strong>`;
 if(c==='area_m2')return `${num(v)} m²`;
 if(c==='target_margin_pct'||c==='irr'||c==='probability'||c==='impact')return `${v}%`;
 if(c.endsWith('_at')||c.endsWith('_date'))return new Date(v).toLocaleDateString('id-ID');
 if(c==='status'||c==='level'||c==='severity')return `<span class="pill ${String(v).toLowerCase().replace(/\s/g,'-')}">${escape(v)}</span>`;
 return escape(v);
}

function page(name){ document.querySelector('#title').textContent=name; if(name==='Executive Cockpit')dashboard(); else modulePage(name); }
function bindJumps(){document.querySelectorAll('[data-page-jump]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===b.dataset.pageJump));page(b.dataset.pageJump);});}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');page(b.dataset.page)});
document.querySelector('#refresh').onclick=()=>page(document.querySelector('.nav.active')?.dataset.page||'Executive Cockpit');
dashboard();
