-- Aggregate RPCs are server-internal. Public routes invoke them with the
-- service-role client; never expose SECURITY DEFINER execution to browser roles.
REVOKE ALL ON FUNCTION public.get_public_contribution_aggregates(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_public_petition_aggregates(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_contribution_aggregates(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_public_petition_aggregates(uuid) TO service_role;
