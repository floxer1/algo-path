/**
 * Security regression test — avatar bucket
 * ----------------------------------------
 * Goals:
 *  1. Avatar files MUST stay publicly readable (the app shows them on
 *     the leaderboard, duels, profile cards… for visitors and users alike).
 *  2. Anonymous (and other) users MUST NOT be able to enumerate / list
 *     the contents of the bucket — that would leak user_id values.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gyhpikpveiginnximsqx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aHBpa3B2ZWlnaW5ueGltc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjczODksImV4cCI6MjA5MDEwMzM4OX0.j6-w_n5wAbozUWL-u5al8etXeuKCxggvQO_PjWCzLKU";

const NET_TIMEOUT = 8000;

describe("Security: avatars are publicly readable but not enumerable", () => {
  let anon: SupabaseClient;

  beforeAll(async () => {
    anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await anon.auth.signOut().catch(() => {});
  });

  it("public URL builder returns a working /object/public/ URL", () => {
    const { data } = anon.storage
      .from("avatars")
      .getPublicUrl("any-user/avatar.png");

    expect(data.publicUrl).toContain("/storage/v1/object/public/avatars/");
  });

  it("anonymous .list() at the bucket root returns nothing (no enumeration)", async () => {
    const { data, error } = await anon.storage
      .from("avatars")
      .list("", { limit: 1000 });

    // Either the API errors (preferred) OR it silently returns an empty
    // array — both are acceptable. What MUST NOT happen is leaking any
    // entry that could reveal a user_id folder name.
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(Array.isArray(data)).toBe(true);
      expect((data ?? []).length).toBe(0);
    }
  }, NET_TIMEOUT);

  it("anonymous .list() inside an arbitrary user folder returns nothing", async () => {
    // A random uuid that almost certainly does not match any real folder,
    // plus a well-known shape (uuid v4 prefix) — neither should reveal data.
    const { data, error } = await anon.storage
      .from("avatars")
      .list("00000000-0000-0000-0000-000000000000", { limit: 1000 });

    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(Array.isArray(data)).toBe(true);
      expect((data ?? []).length).toBe(0);
    }
  }, NET_TIMEOUT);

  it("anonymous SELECT against storage.objects via PostgREST is blocked", async () => {
    // Belt-and-suspenders: even bypassing the storage SDK, the underlying
    // table must not be readable by anonymous users for the avatars bucket.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/objects?select=name,bucket_id&bucket_id=eq.avatars&limit=5`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Accept-Profile": "storage",
        },
      },
    );

    if (res.ok) {
      const body = (await res.json()) as unknown[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    } else {
      // 401/403/404 = blocked. 406 = `storage` schema not exposed at all
      // through PostgREST (an even stronger guarantee). All are fine.
      expect([401, 403, 404, 406]).toContain(res.status);
    }
  }, NET_TIMEOUT);

  it("a public-URL fetch returns 200 (real file) or 400/404 (missing) — never 401/403", async () => {
    // Pick a deterministic path. We don't know which avatars exist, so we
    // only assert on the auth/authorization layer: the public endpoint
    // must NEVER reject a request with 401/403, because the bucket is
    // declared public and the app relies on direct <img src="…public/…">.
    const url = `${SUPABASE_URL}/storage/v1/object/public/avatars/__nonexistent__/probe.png`;
    const res = await fetch(url, { method: "GET" });

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    // 200 (somehow exists), 400 (bad path) or 404 (not found) are all fine.
    expect([200, 400, 404]).toContain(res.status);
  }, NET_TIMEOUT);
});
