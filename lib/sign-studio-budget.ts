// Server-only transport guard. Every attempted provider call consumes one durable
// permit; failures/timeouts are never refunded because billing may have occurred.
export class TrialBudgetError extends Error {}
export function budgetedOpenAIFetch(): typeof fetch {
  let attempted = false;
  return async (input, init) => {
    if (attempted) throw new TrialBudgetError('retry');
    attempted = true;
    const endpoint = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (endpoint !== 'https://api.openai.com/v1/responses' || init?.method !== 'POST' || typeof init.body !== 'string') throw new TrialBudgetError('transport');
    // Bound the actual SDK-generated request, including instructions and schema.
    if (new TextEncoder().encode(init.body).byteLength > 12000) throw new TrialBudgetError('size');
    const body = JSON.parse(init.body);
    if (body.model !== 'gpt-6-astra' || body.max_output_tokens !== 1200 || body.service_tier !== 'default' || body.store !== false || body.tools?.length || body.background || body.previous_response_id) throw new TrialBudgetError('configuration');
    if (process.env.VERCEL_ENV !== 'preview' || process.env.VERCEL_GIT_COMMIT_REF !== 'feature/interactive-sign-studio') throw new TrialBudgetError('environment');
    const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (base !== 'https://mmnbqvwjemyxhjzhzlcu.supabase.co' || !key) throw new TrialBudgetError('database');
    const reservation = await fetch(`${base}/rest/v1/rpc/cb_sign_trial_reserve`, {
      method: 'POST', headers: {apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json'},
      body:'{}', cache:'no-store', redirect:'error', signal:AbortSignal.timeout(10000),
    });
    if (!reservation.ok || await reservation.json() !== true) throw new TrialBudgetError('closed');
    // No redirect, retry, fallback or release of a reserved permit.
    return fetch(input, {...init, redirect:'error'});
  };
}
