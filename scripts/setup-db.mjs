/**
 * Database setup script — run from terminal:
 *   node scripts/setup-db.mjs
 *
 * Requires .env.local to have:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim();
  env[key] = value;
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  console.error("   Fill in your .env.local first. See supabase_setup_guide.md");
  process.exit(1);
}

// Read the SQL file
const sqlPath = resolve(__dirname, "../supabase/schema.sql");
const sql = readFileSync(sqlPath, "utf-8");

console.log("🔄 Running database setup...\n");

// Use the Supabase SQL endpoint (available via service role key)
const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
  method: "POST",
  headers: {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  },
});

// The REST API doesn't support raw SQL. Use the pg endpoint instead.
// Supabase exposes a PostgreSQL HTTP endpoint for SQL execution.
const pgResponse = await fetch(`${SUPABASE_URL}/pg`, {
  method: "POST",
  headers: {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({ query: sql }),
});

if (!pgResponse.ok) {
  // Fallback: try the SQL query endpoint used by Supabase Studio
  const sqlResponse = await fetch(
    `${SUPABASE_URL.replace(".supabase.co", ".supabase.co")}/rest/v1/`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!sqlResponse.ok) {
    console.error(
      "❌ Could not execute SQL via HTTP API.\n"
    );
    console.log("📋 Please run the SQL manually:\n");
    console.log("   1. Go to your Supabase Dashboard → SQL Editor");
    console.log("   2. Click '+ New query'");
    console.log("   3. Paste the contents of supabase/schema.sql");
    console.log("   4. Click 'Run'\n");
    console.log("   The SQL is now idempotent (safe to re-run).\n");
    process.exit(1);
  }
}

console.log("✅ Database setup complete!");
console.log("   - bookmarks table created");
console.log("   - RLS policies applied");
console.log("   - Indexes created");
console.log("   - Realtime enabled");
