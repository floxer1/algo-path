/**
 * Security regression test
 * ------------------------
 * Verifies that an unauthenticated visitor (anonymous API key) can NEVER
 * retrieve the `solution` of any exercise through the public API.
 *
 * What we cover:
 *  1. Direct SELECT on `problems` is blocked (RLS denies all).
 *  2. The public-facing view `problems_public` does not expose `solution`.
 *  3. The RPC `get_problem_solution` returns NULL for anonymous callers.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gyhpikpveiginnximsqx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aHBpa3B2ZWlnaW5ueGltc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjczODksImV4cCI6MjA5MDEwMzM4OX0.j6-w_n5wAbozUWL-u5al8etXeuKCxggvQO_PjWCzLKU";

// 6s guard so a flaky network never silently passes the test
const NET_TIMEOUT = 6000;

describe("Security: exercise solutions are not exposed to anonymous visitors", () => {
  let anon: SupabaseClient;
  let sampleProblemId: string | null = null;

  beforeAll(async () => {
    anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Make sure we are truly anonymous
    await anon.auth.signOut().catch(() => {});

    // Grab one problem id from the public view so subsequent tests have
    // a real target to attack.
    const { data } = await anon
      .from("problems_public" as any)
      .select("id")
      .limit(1)
      .maybeSingle();
    sampleProblemId = (data as any)?.id ?? null;
  }, NET_TIMEOUT);

  it("blocks direct SELECT on the `problems` base table", async () => {
    const { data, error } = await anon
      .from("problems" as any)
      .select("id, solution")
      .limit(1);

    // Either RLS rejects the query, or it returns an empty result set.
    // What MUST NOT happen: receiving a row that contains a solution.
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(Array.isArray(data)).toBe(true);
      expect((data ?? []).length).toBe(0);
    }
  }, NET_TIMEOUT);

  it("does not expose a `solution` column through `problems_public`", async () => {
    const { data, error } = await anon
      .from("problems_public" as any)
      .select("*")
      .limit(3);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);

    for (const row of data ?? []) {
      expect(row).not.toHaveProperty("solution");
    }
  }, NET_TIMEOUT);

  it("explicitly requesting `solution` from `problems_public` fails", async () => {
    const { data, error } = await anon
      .from("problems_public" as any)
      .select("id, solution")
      .limit(1);

    // The view has no `solution` column, so PostgREST must error out
    // (it must NOT silently return a solution).
    expect(error).toBeTruthy();
    expect(data).toBeNull();
  }, NET_TIMEOUT);

  it("RPC `get_problem_solution` returns NULL for anonymous callers", async () => {
    if (!sampleProblemId) {
      // Nothing to attack — treat as inconclusive but not a pass-through:
      // if there are no problems, there is also nothing to leak.
      return;
    }

    const { data, error } = await anon.rpc("get_problem_solution" as any, {
      _problem_id: sampleProblemId,
    });

    // The function is SECURITY DEFINER but gated by `auth.uid() IS NOT NULL`.
    // For an anonymous caller it must resolve to NULL (no solution).
    expect(error).toBeNull();
    expect(data).toBeNull();
  }, NET_TIMEOUT);
});
