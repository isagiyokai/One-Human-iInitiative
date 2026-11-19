-- Add created_at to campaign_progress_public view
-- This fixes the schema mismatch causing API 404 when ordering by created_at

DROP VIEW IF EXISTS campaign_progress_public;

CREATE VIEW campaign_progress_public AS
SELECT
  id,
  name,
  target,
  max_target,
  confirmed_amount,
  confirmed_count,
  status,
  start_date,
  end_date,
  percentage,
  remaining,
  computed_status,
  created_at
FROM campaigns
WHERE status IN ('active', 'paused', 'target_reached', 'completed');