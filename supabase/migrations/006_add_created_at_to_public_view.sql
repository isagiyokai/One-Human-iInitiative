-- Repair campaign_progress_public before migration 007 adds its story fields.
-- Migration 006 must calculate derived fields; they are not campaigns table columns.

DROP VIEW IF EXISTS campaign_progress_public;

CREATE VIEW campaign_progress_public AS
SELECT
    c.id,
    c.name,
    c.target,
    c.max_target,
    c.confirmed_amount,
    c.confirmed_count,
    c.status,
    c.start_date,
    c.end_date,
    CASE
        WHEN c.target > 0 THEN ROUND((c.confirmed_amount / c.target) * 100, 2)
        ELSE 0
    END AS percentage,
    GREATEST(c.target - c.confirmed_amount, 0) AS remaining,
    compute_campaign_status(
        c.status,
        c.start_date,
        c.end_date,
        c.confirmed_amount,
        c.target
    ) AS computed_status,
    c.created_at
FROM campaigns c
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');

GRANT SELECT ON campaign_progress_public TO anon, authenticated;

COMMENT ON VIEW campaign_progress_public IS
  'Public-safe campaign progress including created_at for deterministic ordering.';
