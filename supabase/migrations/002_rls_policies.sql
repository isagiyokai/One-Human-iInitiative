-- One Human Initiative - baseline database access model.
-- All public interaction is mediated by narrowly scoped views and server APIs.
-- The service role is used only by authenticated server-side API routes.

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE repayment_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_participation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access campaigns" ON campaigns
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access campaign_settings" ON campaign_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access contributions" ON contributions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access repayment_contacts" ON repayment_contacts
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access expenses" ON expenses
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access petitions" ON petitions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access votes" ON votes
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access browser_tokens" ON browser_participation_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access updates" ON campaign_updates
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access audit_logs" ON admin_audit_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
