-- Public campaign payment settings are Bitcoin and Solana only.
-- Remove deprecated Phantom/Ko-fi destinations from anonymous and authenticated access.

DROP VIEW IF EXISTS public.campaign_settings_public;

REVOKE SELECT (phantom_username, kofi_enabled, kofi_url, kofi_label, kofi_status)
  ON public.campaign_settings
  FROM anon, authenticated;

GRANT SELECT (campaign_id, bitcoin_address, solana_address)
  ON public.campaign_settings
  TO anon, authenticated;

CREATE VIEW public.campaign_settings_public
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  cs.campaign_id,
  cs.bitcoin_address,
  cs.solana_address
FROM public.campaign_settings cs
JOIN public.campaigns c ON c.id = cs.campaign_id
WHERE c.status IN ('active', 'paused', 'target_reached', 'expired', 'completed');

GRANT SELECT ON public.campaign_settings_public TO anon, authenticated;
