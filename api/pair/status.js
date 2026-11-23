const store = require('../../lib/store'), u = require('../../lib/util');
module.exports = async (req, res) => { u.cors(res); res.setHeader('Cache-Control','no-store'); const q = u.query(req);
  if (!/^[a-f0-9]{48}$/.test(q.token || '')) return u.json(res, 400, { error: 'token' });
  u.json(res, 200, u.summarize(await store.listEnt(q.token))); };
