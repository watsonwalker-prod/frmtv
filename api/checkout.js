// POST { code, plan } where plan = 'pack:<slug>' | 'monthly' | 'yearly'. MOCK by default; Stripe TEST only with explicit opt-in.
const store = require('../lib/store'), u = require('../lib/util'), cat = require('../lib/catalog');
module.exports = async (req, res) => { u.cors(res); if (req.method==='OPTIONS') return res.end();
  let b = {}; try { b = JSON.parse((await u.body(req)) || '{}'); } catch (e) {}
  const { code, plan } = b; const c = u.cfg(); const base = u.baseUrl(req);
  const valid = plan && (cat.memberships[plan] || (plan.startsWith('pack:') && cat.packs[plan.slice(5)]));
  const p = code && await store.getPair(code); if (!p || !valid) return u.json(res, 400, { error: 'Invalid code or plan' });
  if (c.mock) return u.json(res, 200, { url: base + '/api/mock-complete?code=' + code + '&plan=' + encodeURIComponent(plan), mock: true });
  // Stripe test mode (requires approval + test price IDs). One-time packs use mode=payment, memberships mode=subscription.
  const isPack = plan.startsWith('pack:'); const priceId = isPack ? process.env['STRIPE_PRICE_PACK'] : process.env[cat.memberships[plan].priceEnv];
  if (!priceId) return u.json(res, 500, { error: 'Price not configured' });
  const f = new URLSearchParams({ mode: isPack ? 'payment' : 'subscription', 'line_items[0][price]': priceId, 'line_items[0][quantity]': '1',
    success_url: base + '/link?code=' + code + '&done=1', cancel_url: base + '/link?code=' + code, client_reference_id: code, 'metadata[code]': code, 'metadata[plan]': plan });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY, 'Content-Type': 'application/x-www-form-urlencoded' }, body: f });
  const s = await r.json(); if (!r.ok) return u.json(res, 502, { error: s.error && s.error.message }); u.json(res, 200, { url: s.url }); };
