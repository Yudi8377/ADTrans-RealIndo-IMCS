import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL || 'https://nfvkdqpxexfymzuwdorx.supabase.co';
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4BG89zR_2gWWWeLqqDzALw_Atx9jAJ6';
const sb = createClient(URL, KEY);
const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#039;' }[c]));
const roleLabels = { SUPER_ADMIN:'Super Administrator', DIRECTOR:'Director', COMMISSIONER:'Commissioner', EXECUTIVE:'Executive', DEPARTMENT_HEAD:'Department Head', MANAGER:'Manager', STAFF:'Staff', AUDITOR:'Auditor' };
let ctx = { profile:null, departments:[], permissions:[], users:[], userDepartments:[], userPermissions:[], matrix:[] };
let installed = false;

const style = document.createElement('style');
style.textContent = `
.admin-panel{display:grid;gap:18px}.admin-tabs{display:flex;gap:8px;flex-wrap:wrap}.admin-tabs button{border:1px solid rgba(255,255,255,.12);background:#11151a;color:#d7dbe0;padding:10px 14px;border-radius:10px;cursor:pointer}.admin-tabs button.active{border-color:#c7a96b;color:#fff}.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.admin-card{background:#0f1318;border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:18px;overflow:auto}.admin-card h3{margin:0 0 5px}.admin-card p{margin:0 0 14px;color:#8f98a3}.admin-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}.admin-form label{display:grid;gap:6px;color:#aeb5be;font-size:12px}.admin-form .full{grid-column:1/-1}.admin-form input,.admin-form select{width:100%;box-sizing:border-box;background:#090c10;color:#f4f5f6;border:1px solid #2a3038;border-radius:8px;padding:10px}.checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;max-height:230px;overflow:auto;padding:8px;background:#090c10;border:1px solid #242a31;border-radius:8px}.checklist label{display:flex;gap:7px;align-items:center;font-size:12px;color:#c7cbd1}.admin-table{width:100%;border-collapse:collapse;font-size:12px}.admin-table th,.admin-table td{padding:9px;border-bottom:1px solid rgba(255,255,255,.07);text-align:left;white-space:nowrap}.admin-table th{color:#8f98a3}.admin-table input[type=checkbox]{accent-color:#c7a96b}.risk-critical{color:#ff8e8e}.admin-actions{display:flex;gap:8px;flex-wrap:wrap}.admin-actions button{cursor:pointer}.admin-msg{min-height:18px;color:#c7a96b}.matrix-wrap{overflow:auto}.matrix-wrap table{min-width:100%}.matrix-wrap th:first-child{position:sticky;left:0;background:#0f1318;z-index:2}.matrix-wrap td:first-child{position:sticky;left:0;background:#0f1318}.admin-note{padding:12px 14px;border-left:2px solid #c7a96b;background:rgba(199,169,107,.06);color:#b8bec6;font-size:12px}
@media(max-width:900px){.admin-grid,.admin-form{grid-template-columns:1fr}.checklist{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

async function init(){
  if(installed) return;
  installed = true;
  const {data:{user}} = await sb.auth.getUser();
  if(!user) return;
  const p = await sb.from('profiles').select('id,organization_id,full_name,employee_no,job_title,role,active').eq('id',user.id).maybeSingle();
  if(p.error || !p.data || p.data.role !== 'SUPER_ADMIN') return;
  ctx.profile = p.data;
  await loadRefs();
  installNav();
}

async function loadRefs(){
  const [d,p,u,ud,up] = await Promise.all([
    sb.from('departments').select('id,code,name,active').eq('organization_id',ctx.profile.organization_id).eq('active',true).order('name'),
    sb.from('permission_catalog').select('id,code,name,resource,action,risk_level,active').order('resource').order('code'),
    sb.from('profiles').select('id,organization_id,full_name,employee_no,job_title,role,active').eq('organization_id',ctx.profile.organization_id).order('full_name'),
    sb.from('user_departments').select('user_id,department_id,is_primary'),
    sb.from('user_permissions').select('user_id,permission_id,allowed,expires_at')
  ]);
  [d,p,u,ud,up].forEach(x => { if(x.error) throw x.error; });
  ctx.departments=d.data||[]; ctx.permissions=p.data||[]; ctx.users=u.data||[]; ctx.userDepartments=ud.data||[]; ctx.userPermissions=up.data||[];
}

function installNav(){
  const observer = new MutationObserver(() => {
    const nav=document.querySelector('.shell aside nav');
    if(!nav || nav.querySelector('[data-admin-users]')) return;
    const b=document.createElement('button');
    b.className='nav'; b.dataset.adminUsers='1'; b.innerHTML='<span>♙</span>User & Permissions';
    b.onclick=()=>renderAdmin('users'); nav.appendChild(b);
  });
  observer.observe(document.body,{childList:true,subtree:true});
}
function content(){ return document.querySelector('#content'); }

function renderAdmin(tab='users'){
  const c=content(); if(!c) return;
  const usersActive=tab==='users'?'active':''; const matrixActive=tab==='matrix'?'active':'';
  c.innerHTML='<div class="module-head"><div><p class="eyebrow">IDENTITY • RBAC • ABAC</p><h2>USER & PERMISSION ADMINISTRATION</h2><p class="muted">Kelola user, departemen, role, permission default departemen, dan override permission per user.</p></div></div><div class="admin-panel"><div class="admin-tabs"><button data-at="users" class="'+usersActive+'">Users</button><button data-at="matrix" class="'+matrixActive+'">Department Permission Matrix</button></div><div id="admin-body"></div></div>';
  c.querySelectorAll('[data-at]').forEach(b=>b.onclick=()=>renderAdmin(b.dataset.at));
  if(tab==='users') renderUsers(); else renderMatrix();
}

function renderUsers(){
  const b=document.querySelector('#admin-body'); if(!b) return;
  const rows=ctx.users.map(u=>{
    const deps=ctx.userDepartments.filter(x=>x.user_id===u.id).map(x=>ctx.departments.find(d=>d.id===x.department_id)?.name).filter(Boolean).join(', ')||'—';
    return '<tr><td><b>'+esc(u.full_name||'—')+'</b><br><span class="muted">'+esc(u.employee_no||'')+'</span></td><td>'+esc(u.job_title||'—')+'</td><td>'+esc(roleLabels[u.role]||u.role)+'</td><td>'+esc(deps)+'</td><td>'+ (u.active?'ACTIVE':'INACTIVE') +'</td><td><button class="ghost" data-edit-user="'+esc(u.id)+'">Edit</button></td></tr>';
  }).join('');
  b.innerHTML='<div class="admin-grid"><div class="admin-card"><h3>Directory</h3><p>'+ctx.users.length+' user(s) dalam organisasi.</p><div class="admin-actions"><button class="primary" id="new-user">＋ New User</button></div><br><table class="admin-table"><thead><tr><th>User</th><th>Title</th><th>Role</th><th>Department</th><th>Status</th><th></th></tr></thead><tbody>'+(rows||'<tr><td colspan="6">Belum ada user.</td></tr>')+'</tbody></table></div><div class="admin-card"><h3>Permission model</h3><p>Role adalah baseline; department memberikan permission default; user permission menjadi override spesifik.</p><div class="admin-note">High/critical permission harus diberikan secara eksplisit. Permission frontend hanya untuk UX; enforcement akhir tetap pada database/RLS dan server-side gateway.</div><br><b>Available roles</b><ul>'+Object.entries(roleLabels).map(([k,v])=>'<li>'+esc(k)+' — '+esc(v)+'</li>').join('')+'</ul></div></div>';
  const newBtn=document.querySelector('#new-user'); if(newBtn) newBtn.onclick=()=>openUser();
  document.querySelectorAll('[data-edit-user]').forEach(x=>x.onclick=()=>openUser(ctx.users.find(u=>u.id===x.dataset.editUser)));
}

function checkList(name,items,selected,render){
  return '<div class="checklist">'+items.map(x=>'<label><input type="checkbox" name="'+name+'" value="'+esc(x.id)+'" '+(selected.includes(x.id)?'checked':'')+'>'+render(x)+'</label>').join('')+'</div>';
}

function openUser(user=null){
  const existing=!!user;
  const deps=ctx.userDepartments.filter(x=>x.user_id===user?.id).map(x=>x.department_id);
  const perms=ctx.userPermissions.filter(x=>x.user_id===user?.id&&x.allowed).map(x=>x.permission_id);
  const depHtml=checkList('department_ids',ctx.departments,deps,d=>esc(d.name));
  const permHtml=checkList('permission_ids',ctx.permissions,perms,p=>esc(p.name)+' <span class="'+(p.risk_level==='critical'?'risk-critical':'')+'">['+esc(p.risk_level)+']</span>');
  const roleHtml=Object.entries(roleLabels).map(([k,v])=>'<option value="'+k+'" '+((user?.role||'STAFF')===k?'selected':'')+'>'+esc(v)+'</option>').join('');
  const passwordHtml=existing?'<label>Password baru (opsional)<input name="password" type="password" minlength="8" placeholder="Kosongkan jika tidak diubah"></label>':'<label>Email<input name="email" type="email" required></label><label>Password<input name="password" type="password" minlength="8" required placeholder="Minimal 8 karakter"></label>';
  const ov=document.createElement('div'); ov.className='modal-backdrop';
  ov.innerHTML='<div class="modal"><div class="modal-head"><div><p class="eyebrow">'+(existing?'USER ADMINISTRATION':'NEW USER')+'</p><h3>'+(existing?'Edit User':'Create User')+'</h3></div><button class="close">×</button></div><form id="user-form" class="admin-form"><label>Full name<input name="full_name" required value="'+esc(user?.full_name)+'"></label><label>Employee No.<input name="employee_no" value="'+esc(user?.employee_no)+'"></label><label>Job title<input name="job_title" value="'+esc(user?.job_title)+'"></label><label>Role<select name="role">'+roleHtml+'</select></label>'+passwordHtml+'<label class="full">Departments — user dapat memiliki lebih dari satu department'+depHtml+'</label><label class="full">Direct user permissions — hanya override yang benar-benar diperlukan'+permHtml+'</label><label class="full"><input type="checkbox" name="active" '+(user?.active!==false?'checked':'')+'> Active</label><div class="modal-actions full"><button type="button" class="secondary close">Cancel</button><button class="primary" type="submit">'+(existing?'Save User':'Create User')+'</button></div><div id="admin-msg" class="admin-msg full"></div></form></div>';
  document.body.appendChild(ov);
  ov.querySelectorAll('.close').forEach(x=>x.onclick=()=>ov.remove());
  ov.querySelector('#user-form').onsubmit=async e=>{
    e.preventDefault(); const f=new FormData(e.currentTarget); const department_ids=f.getAll('department_ids'); const permission_ids=f.getAll('permission_ids');
    const payload={action:existing?'update':'create',user_id:user?.id,email:f.get('email'),password:f.get('password'),full_name:f.get('full_name'),employee_no:f.get('employee_no'),job_title:f.get('job_title'),role:f.get('role'),active:f.get('active')==='on',department_ids,permission_ids};
    const msg=ov.querySelector('#admin-msg'); msg.textContent='Saving…';
    try{ const {data,error}=await sb.functions.invoke('imcs-user-admin',{body:payload}); if(error) throw error; if(data?.error) throw new Error(data.error); ov.remove(); await loadRefs(); renderUsers(); }
    catch(err){ msg.textContent=err.message||'Operation failed'; }
  };
}

async function renderMatrix(){
  const b=document.querySelector('#admin-body'); if(!b) return;
  const heads=ctx.permissions.map(p=>'<th title="'+esc(p.name)+'">'+esc(p.code)+'</th>').join('');
  const rows=ctx.departments.map(d=>'<tr><td><b>'+esc(d.name)+'</b></td>'+ctx.permissions.map(p=>'<td><input type="checkbox" data-matrix="'+d.id+'|'+p.id+'"></td>').join('')+'</tr>').join('');
  b.innerHTML='<div class="admin-card"><h3>Department Permission Matrix</h3><p>Centang permission yang menjadi default bagi seluruh user pada department tersebut.</p><div class="matrix-wrap"><table class="admin-table"><thead><tr><th>Department</th>'+heads+'</tr></thead><tbody>'+rows+'</tbody></table></div><div class="admin-actions"><button class="primary" id="save-matrix">Save Matrix</button><span id="matrix-msg" class="admin-msg"></span></div></div>';
  const {data,error}=await sb.from('department_permissions').select('department_id,permission_id,allowed');
  if(error){b.querySelector('#matrix-msg').textContent=error.message;return;}
  ctx.matrix=data||[];
  ctx.matrix.forEach(x=>{const q=b.querySelector('[data-matrix="'+x.department_id+'|'+x.permission_id+'"]');if(q)q.checked=x.allowed;});
  b.querySelector('#save-matrix').onclick=async()=>{
    const msg=b.querySelector('#matrix-msg');msg.textContent='Saving…';
    try{
      for(const d of ctx.departments){for(const p of ctx.permissions){const el=b.querySelector('[data-matrix="'+d.id+'|'+p.id+'"]');const current=ctx.matrix.find(x=>x.department_id===d.id&&x.permission_id===p.id);if(!el)continue;if(el.checked){const r=await sb.from('department_permissions').upsert({department_id:d.id,permission_id:p.id,allowed:true});if(r.error)throw r.error;}else if(current){const r=await sb.from('department_permissions').delete().eq('department_id',d.id).eq('permission_id',p.id);if(r.error)throw r.error;}}}
      msg.textContent='Matrix saved.'; const r=await sb.from('department_permissions').select('department_id,permission_id,allowed'); if(!r.error)ctx.matrix=r.data||[];
    }catch(e){msg.textContent=e.message||'Operation failed';}
  };
}

init().catch(()=>{});
export { renderAdmin };
