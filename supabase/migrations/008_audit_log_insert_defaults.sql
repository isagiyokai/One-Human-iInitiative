-- Keep the single-admin audit trail writable when older API handlers
-- insert action details without explicitly passing per-event identity metadata.
-- The fixed UUID denotes the configured single-admin account; the placeholder
-- IP value makes it explicit that no client IP was captured for that event.
ALTER TABLE public.admin_audit_logs
  ALTER COLUMN admin_id SET DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  ALTER COLUMN admin_email SET DEFAULT 'admin',
  ALTER COLUMN ip_hash SET DEFAULT 'not-recorded';
