// MOCK MODE ONLY: simulates a successful payment for one pack or membership, then returns to the phone page.
const store = require('../lib/store'), u = require('../lib/util');
module.exports = async (req, res) => { if (!u.cfg().mock) return u.json(res, 404, { error: 'disabled' });
  const q = u.query(req); const ok = await u.activate(store, (q.code||'').toUpperCase(), q.plan || '');
  res.statusCode = 302; res.setHeader('Location', '/link?code=' + q.code + (ok ? '&done=1&plan=' + encodeURIComponent(q.plan) : '')); res.end(); };
