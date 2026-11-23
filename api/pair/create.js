const store = require('../../lib/store'), u = require('../../lib/util');
module.exports = async (req, res) => { u.cors(res); if (req.method==='OPTIONS') return res.end();
  let b = {}; try { b = JSON.parse((await u.body(req)) || '{}'); } catch (e) {}
  const token = (b.token && /^[a-f0-9]{48}$/.test(b.token)) ? b.token : u.token(); const code = u.code(); const base = u.baseUrl(req);
  await store.putPair(code, token);
  u.json(res, 200, { code, token, linkUrl: base + '/link?code=' + code, qrUrl: base + '/api/qr?code=' + code, mock: u.cfg().mock }); };
