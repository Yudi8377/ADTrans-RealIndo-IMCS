-- Performance hardening: cover the legacy staging foreign key used for reconciliation.
-- Safe to run repeatedly.
create index if not exists idx_raw_records_batch_id
  on legacy_staging.raw_records (batch_id);
