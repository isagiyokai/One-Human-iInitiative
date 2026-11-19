-- Public-safe view execution, narrowly scoped RPC aggregates, and fixed function search paths.
-- The two aggregate views are replaced with SECURITY DEFINER functions that return
-- only grouped totals, never individual contribution/vote records.

DROP VIEW IF EXISTS public.contribution_aggregates_public;
DROP VIEW IF EXISTS public.petition_aggregates_public;

-- Views over public fields run with the caller's privileges and RLS policies.
ALTER VIEW public.campaign_progress SET (security_invoker = true);
ALTER VIEW public.expense_summary SET (security_invoker = true);
ALTER VIEW public.campaign_progress_public SET (security_invoker = true);
ALTER VIEW public.campaign_settings_public SET (security_invoker = true);
ALTER VIEW public.expense_summary_public SET (security_invoker = true);
ALTER VIEW public.campaign_updates_public SET (security_invoker = true);
ALTER VIEW public.expenses_published_public SET (security_invoker = true);

-- These legacy helper views are not part of the public API.
REVOKE ALL ON public.campaign_progress FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.expense_summary FROM PUBLIC, anon, authenticated;

-- Allow reads only for fields intentionally included in public views.
GRANT SELECT (
  id, name, description, target, max_target, confirmed_amount, confirmed_count,
  status, start_date, end_date, hero_title, hero_tagline, public_content,
  story_title, story_content, privacy_title, privacy_content, process_title,
  process_content, custom_blocks, created_at
) ON public.campaigns TO anon, authenticated;

GRANT SELECT (
  campaign_id, bitcoin_address, solana_address, phantom_username,
  kofi_enabled, kofi_url, kofi_label, kofi_status
) ON public.campaign_settings TO anon, authenticated;

GRANT SELECT (
  id, campaign_id, title, content, image_url, status, published_at
) ON public.campaign_updates TO anon, authenticated;

GRANT SELECT (
  id, campaign_id, category, description, amount, currency,
  status, published_at, evidence_url
) ON public.expenses TO anon, authenticated;

-- A caller may read only published updates belonging to a publicly visible campaign.
DROP POLICY IF EXISTS "Public can view updates via view only" ON public.campaign_updates;
CREATE POLICY "Public can view published updates"
  ON public.campaign_updates
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_updates.campaign_id
        AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
    )
  );

-- A caller may read only published expenses belonging to a publicly visible campaign.
DROP POLICY IF EXISTS "Public can view published expenses via view only" ON public.expenses;
CREATE POLICY "Public can view published expenses"
  ON public.expenses
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = expenses.campaign_id
        AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
    )
  );

-- SECURITY INVOKER views execute helper functions using the caller's permissions.
GRANT EXECUTE ON FUNCTION public.compute_campaign_status(varchar, timestamptz, timestamptz, numeric, integer)
  TO anon, authenticated;

-- Contribution aggregate RPC: public sees currency-level totals, not individual records.
CREATE OR REPLACE FUNCTION public.get_public_contribution_aggregates(p_campaign_id uuid)
RETURNS TABLE (
  campaign_id uuid,
  currency varchar,
  contribution_count bigint,
  total_amount numeric,
  total_usd_value numeric,
  first_contribution_at timestamptz,
  last_contribution_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT
    c.campaign_id,
    c.currency,
    COUNT(*)::bigint,
    SUM(c.amount),
    SUM(c.usd_value),
    MIN(c.created_at),
    MAX(c.created_at)
  FROM public.contributions c
  JOIN public.campaigns camp ON camp.id = c.campaign_id
  WHERE c.campaign_id = p_campaign_id
    AND c.status = 'confirmed'
    AND camp.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
  GROUP BY c.campaign_id, c.currency
  ORDER BY c.currency;
$$;

REVOKE ALL ON FUNCTION public.get_public_contribution_aggregates(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_contribution_aggregates(uuid) TO anon, authenticated;

-- Petition aggregate RPC: no private admin_notes or individual token/vote rows are returned.
CREATE OR REPLACE FUNCTION public.get_public_petition_aggregates(p_campaign_id uuid)
RETURNS TABLE (
  id uuid,
  campaign_id uuid,
  requested_target integer,
  reason text,
  status varchar,
  token_count integer,
  required_tokens integer,
  voting_starts_at timestamptz,
  voting_ends_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz,
  yes_votes bigint,
  no_votes bigint,
  total_votes bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT
    p.id,
    p.campaign_id,
    p.requested_target,
    p.reason,
    p.status,
    p.token_count,
    p.required_tokens,
    p.voting_starts_at,
    p.voting_ends_at,
    p.decided_at,
    p.created_at,
    COUNT(v.id) FILTER (WHERE v.choice = 'yes')::bigint,
    COUNT(v.id) FILTER (WHERE v.choice = 'no')::bigint,
    COUNT(v.id)::bigint
  FROM public.petitions p
  JOIN public.campaigns c ON c.id = p.campaign_id
  LEFT JOIN public.votes v ON v.petition_id = p.id
  WHERE p.campaign_id = p_campaign_id
    AND c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed')
    AND p.status IN ('collecting', 'voting', 'approved', 'rejected')
  GROUP BY p.id, p.campaign_id, p.requested_target, p.reason, p.status,
    p.token_count, p.required_tokens, p.voting_starts_at, p.voting_ends_at,
    p.decided_at, p.created_at
  ORDER BY p.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_public_petition_aggregates(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_petition_aggregates(uuid) TO anon, authenticated;

-- Remove mutable search_path warnings from existing trigger/helper functions.
ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.compute_campaign_status(varchar, timestamptz, timestamptz, numeric, integer) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.update_campaign_on_contribution_confirmation() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.check_petition_threshold() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.get_petition_vote_counts(uuid) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.expire_campaigns() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.token_has_voted(uuid, varchar) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.increment_petition_token_count(uuid) SET search_path = pg_catalog, public, pg_temp;
