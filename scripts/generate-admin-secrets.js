#!/usr/bin/env node
/**
 * Generate admin password hash and session secret
 * Run with: node scripts/generate-admin-secrets.js
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const PASSWORD = 'Punalex10k$'; // The user's specified password
const USERNAME = 'PunahumanGG';

async function generate() {
  console.log('=== One Human Initiative Admin Secrets Generator ===\n');

  // Generate password hash
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(PASSWORD, saltRounds);

  console.log('Admin Username:', USERNAME);
  console.log('Admin Password:', PASSWORD);
  console.log('\n--- Add to .env.local ---\n');
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);

  // Generate session secret (32 bytes = 256 bits)
  const sessionSecret = crypto.randomBytes(32).toString('base64');
  console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);

  console.log('\n--- Verification ---\n');
  const isValid = await bcrypt.compare(PASSWORD, passwordHash);
  console.log('Password hash verification:', isValid ? 'PASS' : 'FAIL');

  console.log('\n=== Instructions ===');
  console.log('1. Copy the ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET to your .env.local');
  console.log('2. Never commit .env.local to git');
  console.log('3. In production, set these as environment variables in Vercel/Supabase dashboard');
  console.log('\nNote: The username "PunahumanGG" is hardcoded in src/lib/admin-auth.ts');
}

// Run if executed directly
if (require.main === module) {
  generate().catch(console.error);
}

module.exports = { generate };