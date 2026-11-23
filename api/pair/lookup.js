const store = require('../../lib/store'), u = require('../../lib/util'), cat = require('../../lib/catalog');
module.exports = async (req, res) => { u.cors(res); res.setHeader('Cache-Control','no-store'); const code = (u.query(req).code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const p = code.length === 6 ? await store.getPair(code) : null;
  if (!p) return u.json(res, 404, { ok: false });
  const ent = u.summarize(await store.listEnt(p.token));
  u.json(res, 200, { ok: true, mock: u.cfg().mock, owned: ent, packs: cat.packs, memberships: Object.fromEntries(Object.entries(cat.memberships).map(([k,v])=>[k,{label:v.label,display:v.display}])) }); };
