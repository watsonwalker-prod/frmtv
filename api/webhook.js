// Stripe webhook: checkout.session.completed -> membership active. Verifies Stripe-Signature with STRIPE_WEBHOOK_SECRET.
const crypto = require('crypto'), store = require('../lib/store'), u = require('../lib/util');
function verify(raw, header, secret){ if(!header) return false; const parts = Object.fromEntries(header.split(',').map(x=>x.split('=')));
  const exp = crypto.createHmac('sha256', secret).update(parts.t + '.' + raw).digest('hex');
  return parts.v1 && exp.length===parts.v1.length && crypto.timingSafeEqual(Buffer.from(exp), Buffer.from(parts.v1)) && Math.abs(Date.now()/1000 - +parts.t) < 300; }
module.exports = async (req, res) => { const raw = await u.body(req);
  if (!process.env.STRIPE_WEBHOOK_SECRET || !verify(raw, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)) return u.json(res, 400, { error: 'bad signature' });
  const ev = JSON.parse(raw);
  if (ev.type === 'checkout.session.completed') { const s = ev.data.object; await u.activate(store, s.client_reference_id || (s.metadata||{}).code, (s.metadata||{}).plan || 'monthly'); }
  // TODO prod: handle customer.subscription.deleted -> set member inactive (store subscription->token mapping).
  u.json(res, 200, { received: true }); };
module.exports.config = { api: { bodyParser: false } };
