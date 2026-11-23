const crypto = require('crypto');
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
exports.code = () => Array.from(crypto.randomBytes(6), b => ALPHA[b % ALPHA.length]).join('');
exports.token = () => crypto.randomBytes(24).toString('hex');
exports.cfg = () => ({
  // MOCK MODE unless explicitly opted in with FRAIMOUS_PAYMENTS=stripe-test AND an sk_test_ key
  mock: !(process.env.FRAIMOUS_PAYMENTS === 'stripe-test' && (process.env.STRIPE_SECRET_KEY||'').startsWith('sk_test_')),
  base: process.env.PUBLIC_BASE_URL || '',
  // PLACEHOLDER prices: not real, need Stephany's approval. Set STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY (test-mode price IDs).
  plans: {
    monthly: { label: 'Monthly', display: '$X.XX / month (placeholder)', priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_PLACEHOLDER_MONTHLY' },
    yearly:  { label: 'Yearly',  display: '$XX.XX / year (placeholder)', priceId: process.env.STRIPE_PRICE_YEARLY  || 'price_PLACEHOLDER_YEARLY' }
  }
});
exports.cors = (res) => { res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS'); };
exports.json = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(obj)); };
exports.body = (req) => new Promise(r => { if (req.body !== undefined) return r(typeof req.body==='string'?req.body:JSON.stringify(req.body)); let s=''; req.on('data',c=>s+=c); req.on('end',()=>r(s)); });
exports.query = (req) => Object.fromEntries(new URL(req.url,'http://x').searchParams);
exports.baseUrl = (req) => process.env.PUBLIC_BASE_URL || ((req.headers['x-forwarded-proto'] || 'http') + '://' + (req.headers['x-forwarded-host'] || req.headers.host));
exports.activate = async (store, code, plan) => { const p = await store.getPair(code); if (!p) return false; await store.addEnt(p.token, plan); return true; };
// entitlement summary from plan list
exports.summarize = (plans) => { const all = plans.some(x => x === 'monthly' || x === 'yearly'); const packs = plans.filter(x => x.startsWith('pack:')).map(x => x.slice(5)); return { all, packs, active: all || packs.length > 0 }; };
