import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
import { createRequire } from 'node:module';
const importModule = createRequire(import.meta.url);

function load(path, mocks = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require: id => mocks[id] ?? importModule(id),
    process: { env: {
      ADMIN_USER: 'admin', ADMIN_PASSWORD: 'password', ADMIN_SESSION_SECRET: 'test-secret',
      SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'test-key',
      RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'sender@example.com',
      ...globals.env,
    } },
    Buffer, URL, Date, Error, console: { error() {}, warn() {}, log() {} },
    ...globals,
  }, { filename: path });
  return exports;
}

test('admin cookies reject tampering, expiration and legacy sessions', async () => {
  let cookie;
  const auth = load('lib/admin-auth.ts', {
    'next/headers': { cookies: async () => ({
      set: (_name, value) => { cookie = value; }, get: () => ({ value: cookie }),
    }) },
  });
  assert.equal(await auth.isAdminAuthenticated(), false);
  await auth.createAdminSession('admin');
  assert.equal(await auth.isAdminAuthenticated(), true);
  const valid = cookie;
  cookie = valid.replace('admin', 'other');
  assert.equal(await auth.isAdminAuthenticated(), false);
  const expired = `admin.${Math.floor(Date.now() / 1000) - 1}`;
  cookie = `${expired}.${crypto.createHmac('sha256', 'test-secret').update(expired).digest('hex')}`;
  assert.equal(await auth.isAdminAuthenticated(), false);
  cookie = `admin.${crypto.createHmac('sha256', 'test-secret').update('admin').digest('hex')}`;
  assert.equal(await auth.isAdminAuthenticated(), false);
  cookie = valid;
  await auth.clearAdminSession();
  assert.equal(await auth.isAdminAuthenticated(), false);
});

function route(path, fetch, { failEmail = false, failAssets = false } = {}) {
  return load(path, {
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) } },
    resend: { Resend: class { emails = { send: async () => failEmail ? { error: { message: 'Mail unavailable' } } : { data: { id: 'email' } } }; } },
    '@/lib/documents/email-assets': { buildEmailAssets: async () => {
      if (failAssets) throw new Error('PDF unavailable');
      return { qrDataUrl: 'data:image/png;base64,cXI=', pdfBuffer: Buffer.from('pdf'), pdfFileName: 'request.pdf', agbPdfBuffer: Buffer.from('agb'), agbPdfFileName: 'agb.pdf' };
    } },
  }, { fetch });
}
const json = data => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
test('admin database access rejects an unauthenticated action before any database call', async () => {
  const page = fs.readFileSync('app/admin/requests/page.tsx', 'utf8');
  const helper = page.slice(page.indexOf('async function supabaseTableFetch'), page.indexOf('function isMissingTableError'));
  const code = ts.transpileModule(helper + '\nexports.run = supabaseTableFetch;', {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  let authenticated = false;
  let calls = 0;
  const exports = {};
  vm.runInNewContext(code, {
    exports, Error, isAdminAuthenticated: async () => authenticated,
    process: { env: { SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'test' } },
    fetch: async () => { calls++; return new Response(null, { status: 204 }); },
  });
  await assert.rejects(exports.run({ path: 'customers', method: 'DELETE' }), /Unauthorized/);
  assert.equal(calls, 0);
  authenticated = true;
  await exports.run({ path: 'customers', method: 'DELETE' });
  assert.equal(calls, 1);
});

const bookingBody = {
  fullName: 'Test Customer', email: 'customer@example.com', phone: '123', salutation: 'mr',
  selectedDate: '2026-11-02', selectedSlotId: 'slot', startTime: '10:00', endTime: '11:00',
  type: 'consultation', mode: 'at_store', privacyAccepted: true,
  street: 'Test', houseNumber: '1', postalCode: '10365', city: 'Berlin', language: 'de',
};
for (const failure of ['none', 'email', 'assets', 'insert']) {
  test(`booking ${failure} failure preserves a saved appointment or releases an unsaved slot`, async () => {
    let released = false;
    const slot = { id: 'slot', booking_date: bookingBody.selectedDate, start_time: '10:00', end_time: '11:00', status: 'available' };
    const api = route('app/api/booking/route.ts', async (url, options = {}) => {
      if (url.includes('/customers')) return json([{ id: 'customer', customer_code: 'C001' }]);
      if (url.includes('/booking_available_days')) return json([{ id: 'day', date: bookingBody.selectedDate }]);
      if (url.includes('/booking_slots')) {
        if (options.method === 'PATCH') {
          const status = JSON.parse(options.body).status;
          released ||= status === 'available';
          return json([{ ...slot, status }]);
        }
        return json([slot]);
      }
      if (url.includes('/appointments')) {
        if (failure === 'insert') return new Response('insert failed', { status: 500 });
        return json([{ id: 'appointment', ...JSON.parse(options.body)[0] }]);
      }
      throw new Error(`Unexpected URL: ${url}`);
    }, { failEmail: failure === 'email', failAssets: failure === 'assets' });
    const response = await api.POST({ json: async () => bookingBody });
    assert.equal(response.status, failure === 'insert' ? 500 : 200, JSON.stringify(response.body));
    assert.equal(released, failure === 'insert');
    if (failure !== 'insert') {
      assert.equal(response.body.success, true);
      assert.equal(response.body.appointmentId, 'appointment');
      assert.equal(response.body.notificationPending ?? false, failure !== 'none');
    }
  });
}

for (const failure of ['none', 'email', 'metadata', 'insert']) {
  test(`request ${failure} failure reports success only after durable insertion`, async () => {
    let inserts = 0;
    const api = route('app/api/submit-request/route.ts', async (_url, options = {}) => {
      if (options.method === 'POST') {
        inserts++;
        if (failure === 'insert') return new Response('insert failed', { status: 500 });
        return json([{ id: 'request' }]);
      }
      if (failure === 'metadata') return new Response('metadata failed', { status: 500 });
      return json([]);
    }, { failEmail: failure === 'email' });
    const response = await api.POST({ json: async () => ({
      fullName: 'Test Customer', email: 'customer@example.com', phone: '123',
      street: 'Test', houseNumber: '1', postalCode: '10365', city: 'Berlin', items: [],
    }) });
    assert.equal(inserts, 1);
    assert.equal(response.status, failure === 'insert' ? 500 : 200, JSON.stringify(response.body));
    assert.equal(response.body.success, failure !== 'insert');
    if (failure !== 'insert') assert.equal(response.body.savedToDatabase, true);
  });
}
