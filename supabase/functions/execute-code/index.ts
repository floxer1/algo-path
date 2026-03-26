import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TestCase {
  input: unknown;
  expected: unknown;
}

interface RequestBody {
  code: string;
  language: string;
  testCases: TestCase[];
  functionName: string;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(k => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

function executeJavaScript(code: string, testCases: TestCase[], functionName: string) {
  const results = [];

  for (const tc of testCases) {
    const startTime = performance.now();
    try {
      // Parse the input - test cases store input as arrays of arguments
      const args = Array.isArray(tc.input) ? tc.input : [tc.input];

      // Build the execution script with the user's code + a call
      const argsStr = args.map(a => JSON.stringify(a)).join(', ');
      const script = `
        ${code}
        const __result = ${functionName}(${argsStr});
        __result;
      `;

      // Use Function constructor for sandboxed evaluation
      // Strip dangerous globals
      const safeEval = new Function(
        'console', 'setTimeout', 'setInterval', 'fetch', 'Deno',
        `"use strict";
        ${script}`
      );

      const actual = safeEval(
        { log: () => {}, error: () => {}, warn: () => {} }, // mock console
        undefined, undefined, undefined, undefined // block dangerous APIs
      );

      const elapsed = Math.round(performance.now() - startTime);
      const passed = deepEqual(actual, tc.expected);

      results.push({
        passed,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: JSON.stringify(actual),
        time_ms: elapsed,
        error: null,
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      results.push({
        passed: false,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: null,
        time_ms: elapsed,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

// Extract the main function name from code
function detectFunctionName(code: string): string | null {
  // Match "function name(" pattern
  const fnMatch = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  if (fnMatch) return fnMatch[1];

  // Match "const/let/var name = " pattern  
  const varMatch = code.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
  if (varMatch) return varMatch[1];

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { code, language, testCases, functionName } = body;

    if (!code || !testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing code or test cases' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (language !== 'javascript') {
      return new Response(
        JSON.stringify({ 
          error: `Only JavaScript execution is supported currently. Python, Java, and C++ support coming soon.`,
          results: testCases.map(tc => ({
            passed: false,
            input: JSON.stringify(tc.input),
            expected: JSON.stringify(tc.expected),
            actual: null,
            time_ms: 0,
            error: `${language} execution not yet supported`,
          }))
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Detect or use provided function name
    const fnName = functionName || detectFunctionName(code);
    if (!fnName) {
      return new Response(
        JSON.stringify({ error: 'Could not detect function name from code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = executeJavaScript(code, testCases, fnName);
    const allPassed = results.every(r => r.passed);

    return new Response(
      JSON.stringify({ results, allPassed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
