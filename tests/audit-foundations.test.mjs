import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsxRuntime from 'react/jsx-runtime';
import { createRequire } from 'node:module';
const nodeRequire = createRequire(import.meta.url);

function load(path, mocks = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: id => { if (id in mocks) return mocks[id]; if (id.startsWith('react')) return nodeRequire(id); throw new Error(`Unexpected import ${id}`); },
    console: { error() {} }, URL, Date, ...globals,
  });
  return exports;
}

for (const method of ['POST', 'PATCH', 'DELETE']) {
  test(`${method} booking slots denies anonymous access before reading input or accessing database`, async () => {
    let reads = 0, calls = 0;
    const api = load('app/api/booking-slots/route.ts', {
      '@/lib/admin-auth': { isAdminAuthenticated: async () => false },
      'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
    }, { fetch: async () => { calls++; throw new Error('must not fetch'); } });
    const result = await api[method]({ json: async () => { reads++; return {}; } });
    assert.equal(result.status, 401);
    assert.equal(reads, 0); assert.equal(calls, 0);
  });
}

test('authenticated slot creation rejects cross-origin requests before reading input', async () => {
  let reads = 0;
  const api = load('app/api/booking-slots/route.ts', {
    '@/lib/admin-auth': { isAdminAuthenticated: async () => true },
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
  });
  const response = await api.POST({ url: 'https://carobara.example/api/booking-slots',
    headers: new Headers({ origin: 'https://other.example' }), json: async () => { reads++; return {}; } });
  assert.equal(response.status, 403); assert.equal(reads, 0);
});

const exampleService = {
  id: 'window-graphics', title: { ar: 'تغليف الزجاج', de: 'Glasfolierung', en: 'Window graphics' },
  fields: [
    { id: 'material', type: 'radio', label: { ar: 'الخامة', de: 'Material', en: 'Material' },
      options: [{ value: 'frosted', label: { ar: 'فيلم مطفي', de: 'Milchglasfolie', en: 'Frosted film' } }] },
    { id: 'notes', type: 'text', label: { ar: 'ملاحظات', de: 'Hinweise', en: 'Notes' } },
  ],
};
const exampleItem = { id: 'old-cart-item', serviceId: 'window-graphics', serviceTitle: 'تغليف الزجاج', requestLanguage: 'ar',
  quantity: 3, data: { material: 'فيلم مطفي', notes: 'نص العميل الأصلي' },
  fields: [{ id: 'material', label: 'الخامة', value: 'فيلم مطفي' }, { id: 'notes', label: 'ملاحظات', value: 'نص العميل الأصلي' }] };

function renderCart(language, items = [exampleItem], receipt = null) {
  let clears = 0;
  const buttons = [];
  const customer = { salutation: 'mr', firstName: 'Mohammad', lastName: 'Alyoussef', fullName: 'Mohammad Alyoussef',
    email: 'test@example.com', phone: '', street: 'Teststrasse', houseNumber: '1', postalCode: '10365', city: 'Berlin' };
  const capture = factory => (type, props, ...rest) => {
    if (type === 'button' && props.onClick) buttons.push(props);
    return factory(type, props, ...rest);
  };
  const { default: Page } = load('app/cart/page.tsx', {
    react: { ...React, useState: initial => React.useState(Array.isArray(initial) ? items :
      initial && typeof initial === 'object' && 'fullName' in initial ? customer : initial) },
    'react/jsx-runtime': { ...jsxRuntime, jsx: capture(jsxRuntime.jsx), jsxs: capture(jsxRuntime.jsxs) },
    '@/components/Header': { default: () => null },
    '@/components/LegalRequestNotice': { default: () => null },
    '@/data/services': { services: [exampleService] },
    '@/lib/cart': { clearCart: () => { clears++; }, getCart: () => [], getCartPublicData: item => item.data, removeCartItem() {} },
    '@/lib/cart-presentation': load('lib/cart-presentation.ts'),
    '@/lib/request-feedback': load('lib/request-feedback.ts'),
    '@/lib/languageContext': { useLanguage: () => ({ language, dir: language === 'ar' ? 'rtl' : 'ltr' }) },
  }, { fetch: async () => new Response(receipt === null ? '' : JSON.stringify(receipt), {
    status: 200, headers: { 'content-type': 'application/json' },
  }) });
  const html = renderToStaticMarkup(React.createElement(Page));
  return { html, buttons, get clears() { return clears; } };
}

test('actual cart renders current-language labels, keeps original free text, and puts customer fields before send', () => {
  const result = renderCart('de');
  assert.match(result.html, /Glasfolierung/);
  assert.match(result.html, /Milchglasfolie/);
  assert.doesNotMatch(result.html, /تغليف الزجاج|فيلم مطفي/);
  assert.match(result.html, /نص العميل الأصلي/);
  assert.ok(result.html.indexOf('name="email"') < result.html.indexOf('Unverbindliche Anfrage senden'));
  const english = renderCart('en').html;
  assert.match(english, /Frosted film/); assert.doesNotMatch(english, /Milchglasfolie|فيلم مطفي/);
  assert.match(renderCart('ar').html, /فيلم مطفي/);
});

for (const receipt of [null, {}, { success: true }, { success: true, savedToDatabase: true, requestId: 'RRMF88-15-10-2026-12345678' }]) {
  test(`actual send handler preserves cart unless durable receipt is verified: ${JSON.stringify(receipt)}`, async () => {
    const result = renderCart('de', [exampleItem], receipt);
    await result.buttons.find(button => button.children === 'Unverbindliche Anfrage senden').onClick();
    assert.equal(result.clears, receipt?.savedToDatabase === true ? 1 : 0);
  });
}

test('authenticated slot creation validates real dates and hours then permits a valid slot', async () => {
  let calls = 0;
  const api = load('app/api/booking-slots/route.ts', {
    '@/lib/admin-auth': { isAdminAuthenticated: async () => true },
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
  }, {
    process: { env: { SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'test' } },
    fetch: async (_url, options) => { calls++; return new Response(JSON.stringify(options.method === 'POST'
      ? [{ id: 'slot', ...JSON.parse(options.body)[0] }] : []), { headers: { 'content-type': 'application/json' } }); },
  });
  const req = body => ({ url: 'https://carobara.example/api/booking-slots', headers: new Headers(), json: async () => body });
  const valid = { booking_date: '2026-11-02', start_time: '10:00', end_time: '11:00' };
  assert.equal((await api.POST(req({ ...valid, booking_date: '2026-02-30' }))).status, 400);
  assert.equal((await api.POST(req({ ...valid, start_time: '99:99' }))).status, 400);
  assert.equal(calls, 0);
  assert.equal((await api.POST(req(valid))).status, 201);
  assert.equal(calls, 2);
});

test('saved option identifiers and legacy translations follow the chosen language without guessing free text', () => {
  const { translateCartOption } = load('lib/cart-presentation.ts');
  const options = [
    { value: 'frosted', label: { ar: 'فيلم مطفي', de: 'Milchglasfolie', en: 'Frosted film' } },
    { value: 'easy-remove', label: { ar: 'سهل الإزالة، لاحقًا', de: 'Später leicht entfernbar', en: 'Easy removal later' } },
  ];
  assert.equal(translateCartOption(options, 'فيلم مطفي', 'de'), 'Milchglasfolie');
  assert.equal(translateCartOption(options, 'frosted', 'ar'), 'فيلم مطفي');
  assert.equal(translateCartOption(options, 'فيلم مطفي, سهل الإزالة، لاحقًا', 'en', true), 'Frosted film, Easy removal later');
  assert.equal(translateCartOption(options, 'my frosted storefront', 'de'), 'my frosted storefront');
});

test('a durable explicit receipt is required; HTTP success or partial JSON is insufficient', () => {
  const { hasRequestReceipt, requestErrorMessage } = load('lib/request-feedback.ts');
  for (const value of [null, {}, { success: true }, { success: true, savedToDatabase: true, requestId: '' }]) {
    assert.equal(hasRequestReceipt(value), false);
  }
  assert.equal(hasRequestReceipt({ success: true, savedToDatabase: true, requestId: 'RRMF88-15-10-2026-12345678' }), true);
  assert.match(requestErrorMessage('fetch failed', 'ar'), /بياناتك/);
  assert.doesNotMatch(requestErrorMessage('fetch failed', 'de'), /fetch failed|[\u0600-\u06ff]/);
  assert.doesNotMatch(requestErrorMessage('Supabase insert failed: private schema', 'en'), /Supabase|schema/);
});

test('cart storage failure throws, while new canonical choices and legacy carts survive reading', () => {
  const data = new Map(); let deny = false;
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => { if (deny) throw new Error('QuotaExceeded'); data.set(key, value); },
    removeItem: key => data.delete(key),
  };
  const cart = load('lib/cart.ts', {}, { localStorage: storage, window: { dispatchEvent() {} }, Event });
  const item = { serviceId: 'window-graphics', data: { material: 'فيلم مطفي' },
    fields: [{ id: 'material', label: 'الخامة', value: 'فيلم مطفي' }],
    canonicalData: { material: 'frosted' }, customFieldIds: ['customSize'], quantity: 3 };
  cart.addToCart(item);
  assert.equal(cart.getCart()[0].canonicalData.material, 'frosted');
  assert.equal(cart.getCart()[0].quantity, 3);
  assert.equal(cart.getCart()[0].customFieldIds[0], 'customSize');
  deny = true;
  assert.throws(() => cart.addToCart(item), /QuotaExceeded/);
  assert.equal(cart.getCart().length, 1);
  data.set('cart_v2', JSON.stringify([{ ...item, id: 'legacy', canonicalData: undefined }]));
  assert.equal(cart.getCart()[0].data.material, 'فيلم مطفي');
});
