import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nfvkdqpxexfymzuwdorx.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4BG89zR_2gWWWeLqqDzALw_Atx9jAJ6';
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const ORG = 'b68a13a7-15b2-47b1-9ce2-024da729e6a4';
const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

const root = () => document.querySelector('#content');
const styles = `
.enterprise-view{display:grid;gap:18px}.enterprise-hero{padding:24px;border:1px solid var(--line,#e5e7eb);border-radius:18px;background:linear-gradient(135deg,#f7f8f6,#fff)}.enterprise-hero h2{margin:6px 0;font-size:28px}.enterprise-hero p{max-width:850px;color:#697386}.business-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.business-card{padding:18px;border:1px solid var(--line,#e5e7eb);border-radius:15px;background:#fff}.business-card .code{font:12px ui-monospace,monospace;color:#738774}.business-card h3{margin:7px 0 8px;font-size:17px}.business-card p{margin:0;color:#697386;line-height:1.5}.activity-list{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}.activity{padding:6px 9px;border-radius:999px;background:#f0f2ef;font-size:11px;color:#39424e}.enterprise-panel{padding:18px;border:1px solid var(--line,#e5e7eb);border-radius:15px;background:#fff}.enterprise-panel h3{margin:0 0 10px}.operating-chain{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.chain-node{padding:13px;border:1px solid #dfe3de;border-radius:12px;text-align:center;font-size:12px;font-weight:650;background:#fafbf9}.enterprise-note{padding:13px 15px;border-left:3px solid #b9852d;background:#fbfaf6;color:#4c5562;font-size:13px}
`;
if(!document.querySelector('#enterprise-module-style')){const s=document.createElement('style');s.id='enterprise-module-style';s.textContent=styles;document.head.appendChild(s);}

async function load(){
  const [{data: lines,error: le},{data: acts,error: ae}] = await Promise.all([
    sb.from('business_lines').select('id,code,name,description,kbli_code,kbli_title,activity_description').eq('organization_id',ORG).eq('active',true).order('kbli_code'),
    sb.from('business_line_activities').select('business_line_id,activity_code,activity_name,activity_type').eq('organization_id',ORG).eq('active',true).order('activity_name')
  ]);
  if(le) throw le;if(ae) throw ae;
  return {lines:lines||[],acts:acts||[]};
}

async function render(){
  const host=root();if(!host)return;
  host.innerHTML='<div class="enterprise-view"><div class="enterprise-hero"><div class="eyebrow">ENTERPRISE OPERATING MODEL</div><h2>ADTrans RealIndo — Multi-Business Control Plane</h2><p>Construction, engineering & installation, real estate, property management, leasing, maintenance dan business services dikelola dalam satu model enterprise tanpa mengunci sistem pada satu jenis proyek.</p></div><div id="enterprise-data"><div class="muted">Loading business lines…</div></div></div>';
  try{const {lines,acts}=await load();const by=new Map(lines.map(x=>[x.id,[]]));acts.forEach(a=>by.get(a.business_line_id)?.push(a));
    document.querySelector('#enterprise-data').innerHTML=`<div class="business-grid">${lines.map(x=>`<article class="business-card"><span class="code">KBLI ${esc(x.kbli_code||'—')}</span><h3>${esc(x.name)}</h3><p>${esc(x.description||x.activity_description||'')}</p><div class="activity-list">${(by.get(x.id)||[]).map(a=>`<span class="activity">${esc(a.activity_name)}</span>`).join('')}</div></article>`).join('')}</div><div class="enterprise-panel"><h3>Universal operating chain</h3><div class="operating-chain">${['Opportunity / Lead','Offering / Service','Contract / Project','Delivery / Operations','Billing / Finance / Tax','Asset / Customer','Compliance / Audit','AI / Executive Intelligence'].map(x=>`<div class="chain-node">${esc(x)}</div>`).join('')}</div></div><div class="enterprise-note">KBLI menjadi legal/business classification layer. Project Type, Contract Type, Service, Asset dan Operational Workflow tetap extensible agar lini usaha baru dapat ditambahkan tanpa redesign core database.</div>`;
  }catch(e){document.querySelector('#enterprise-data').innerHTML=`<div class="form-msg">Enterprise model gagal dimuat: ${esc(e.message)}</div>`;console.error('[Enterprise]',e);}
}

function injectNav(){
  const nav=document.querySelector('aside nav');if(!nav||nav.querySelector('[data-page="Enterprise Operating Model"]'))return;
  const b=document.createElement('button');b.className='nav';b.dataset.page='Enterprise Operating Model';b.innerHTML='<span>◫</span>Enterprise Model';
  b.onclick=()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');const t=document.querySelector('#page-title');if(t)t.textContent='Enterprise Operating Model';render();};
  nav.insertBefore(b,nav.children[1]||null);
}

const observer=new MutationObserver(()=>injectNav());observer.observe(document.body,{childList:true,subtree:true});injectNav();
window.addEventListener('hashchange',()=>setTimeout(injectNav,50));
