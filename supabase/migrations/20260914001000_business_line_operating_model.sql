create table if not exists public.business_lines (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 code text not null, name text not null, description text, kbli_code text, kbli_title text, activity_description text,
 active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique (organization_id, code), unique (organization_id, kbli_code)
);
create table if not exists public.business_line_activities (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 business_line_id uuid not null references public.business_lines(id) on delete cascade, activity_code text not null, activity_name text not null,
 activity_type text not null default 'CORE' check (activity_type in ('CORE','SUPPORT','PROJECT','SERVICE','ASSET','INVESTMENT')),
 active boolean not null default true, created_at timestamptz not null default now(), unique (organization_id,business_line_id,activity_code)
);
create table if not exists public.business_line_project_scopes (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 business_line_id uuid not null references public.business_lines(id) on delete cascade, project_id uuid not null references public.property_projects(id) on delete cascade,
 role_in_project text, active boolean not null default true, created_at timestamptz not null default now(), unique (business_line_id,project_id)
);
create table if not exists public.business_line_service_catalog (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 business_line_id uuid not null references public.business_lines(id) on delete cascade, service_code text not null, service_name text not null,
 service_category text, description text, active boolean not null default true, created_at timestamptz not null default now(), unique (organization_id,service_code)
);
create index if not exists idx_business_lines_org_active on public.business_lines(organization_id,active);
create index if not exists idx_business_line_activities_org on public.business_line_activities(organization_id,business_line_id);
create index if not exists idx_business_line_project_scopes_org on public.business_line_project_scopes(organization_id,project_id);
create index if not exists idx_business_line_service_catalog_org on public.business_line_service_catalog(organization_id,business_line_id);
alter table public.business_lines enable row level security;
alter table public.business_line_activities enable row level security;
alter table public.business_line_project_scopes enable row level security;
alter table public.business_line_service_catalog enable row level security;
create policy business_lines_select on public.business_lines for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy business_lines_manage on public.business_lines for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
create policy business_line_activities_select on public.business_line_activities for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy business_line_activities_manage on public.business_line_activities for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
create policy business_line_project_scopes_select on public.business_line_project_scopes for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy business_line_project_scopes_manage on public.business_line_project_scopes for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
create policy business_line_service_catalog_select on public.business_line_service_catalog for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy business_line_service_catalog_manage on public.business_line_service_catalog for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
insert into public.business_lines (organization_id,code,name,description,kbli_code,kbli_title,activity_description)
select 'b68a13a7-15b2-47b1-9ce2-024da729e6a4',v.code,v.name,v.description,v.kbli_code,v.kbli_title,v.activity_description from (values
('BL-41011','Konstruksi Gedung Tempat Tinggal','Pembangunan, perubahan dan renovasi gedung tempat tinggal, termasuk pengembangan untuk dijual.','41011','KONSTRUKSI GEDUNG TEMPAT TINGGAL','Pembangunan gedung tempat tinggal seperti rumah, apartemen dan kondominium, termasuk perubahan dan renovasi.'),
('BL-43211','Instalasi Listrik','Instalasi dan pemeliharaan listrik bangunan dan pekerjaan sipil terkait.','43211','INSTALASI LISTRIK','Pemasangan dan pemeliharaan instalasi listrik tegangan rendah pada bangunan dan instalasi listrik bangunan sipil.'),
('BL-43221','Instalasi Saluran Air (Plambing)','Instalasi, pemeliharaan dan perbaikan air bersih, air limbah dan drainase.','43221','INSTALASI SALURAN AIR (PLAMBING)','Instalasi air bersih, air limbah dan saluran drainase pada bangunan serta pemeliharaan dan perbaikannya.'),
('BL-43222','Instalasi Pemanas dan Geotermal','Instalasi dan pemeliharaan sistem pemanas dan geotermal.','43222','INSTALASI PEMANAS DAN GEOTERMAL','Pemasangan dan pemeliharaan instalasi pemanas dan geotermal pada bangunan.'),
('BL-68110','Real Estat yang Dimiliki Sendiri atau Disewa','Akuisisi, penjualan, persewaan, pengoperasian dan pengembangan aset real estat serta kawasan.','68110','REAL ESTAT YANG DIMILIKI SENDIRI ATAU DISEWA','Pembelian, penjualan, persewaan dan pengoperasian real estat, termasuk bangunan, tanah, kawasan tempat tinggal dan pengembangan gedung untuk dioperasikan sendiri.'),
('BL-68200','Real Estat atas Dasar Balas Jasa (Fee) atau Kontrak','Jasa agen, makelar, pengelolaan dan penaksiran real estat berdasarkan fee atau kontrak.','68200','REAL ESTAT ATAS DASAR BALAS JASA (FEE) ATAU KONTRAK','Penyediaan real estat atas dasar fee atau kontrak, termasuk agen/makelar, perantara, pengelolaan dan penaksiran real estat.')
) v(code,name,description,kbli_code,kbli_title,activity_description)
where not exists (select 1 from public.business_lines b where b.organization_id='b68a13a7-15b2-47b1-9ce2-024da729e6a4' and b.kbli_code=v.kbli_code);
insert into public.business_line_activities (organization_id,business_line_id,activity_code,activity_name,activity_type)
select b.organization_id,b.id,x.activity_code,x.activity_name,x.activity_type from public.business_lines b join (values
('41011','RESIDENTIAL_CONSTRUCTION','Konstruksi rumah, apartemen dan kondominium','CORE'),('41011','RENOVATION','Perubahan dan renovasi gedung tempat tinggal','SERVICE'),
('43211','ELECTRICAL_INSTALLATION','Instalasi listrik bangunan','SERVICE'),('43211','CIVIL_ELECTRICAL','Instalasi listrik bangunan sipil','PROJECT'),
('43221','PLUMBING','Instalasi air bersih, air limbah dan drainase','SERVICE'),('43221','PLUMBING_MAINTENANCE','Pemeliharaan dan perbaikan plambing','SERVICE'),
('43222','HEATING_GEOTHERMAL','Instalasi pemanas dan geotermal','SERVICE'),('68110','REAL_ESTATE_SALES','Penjualan tanah dan properti','CORE'),
('68110','REAL_ESTATE_LEASING','Persewaan dan pengoperasian real estat','CORE'),('68110','AREA_OPERATION','Pengoperasian kawasan tempat tinggal','ASSET'),
('68200','BROKERAGE','Agen, makelar dan perantara real estat','SERVICE'),('68200','PROPERTY_MANAGEMENT_FEE','Pengelolaan real estat atas dasar fee/kontrak','SERVICE'),
('68200','VALUATION','Jasa penaksiran real estat','SERVICE')
) x(kbli_code,activity_code,activity_name,activity_type) on x.kbli_code=b.kbli_code
where b.organization_id='b68a13a7-15b2-47b1-9ce2-024da729e6a4' and not exists (select 1 from public.business_line_activities a where a.organization_id=b.organization_id and a.business_line_id=b.id and a.activity_code=x.activity_code);
