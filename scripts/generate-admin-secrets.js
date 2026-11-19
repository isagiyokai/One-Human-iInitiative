#!/usr/bin/env node
/**
 * Generate the admin password hash and a new session secret.
 *
 * Usage:
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/generate-admin-secrets.js
 *
 * The plaintext password is read from the environment and is never printed.
 * Do not pass it as a command-line argument or commit it to the repository.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generate() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD in your local environment first.');
  }

  if (password.length < 14) {
    throw new Error('Choose a new, unique admin password with at least 14 characters.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const sessionSecret = crypto.randomBytes(48).toString('base64');

  console.log('Add these values to the Vercel Production and Preview environments:');
  console.log(`ADMIN_USERNAME=${username}`);
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
  console.log('ADMIN_SESSION_MAX_AGE=604800');
}

generate().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
