// Storage abstraction.
// - Serverless (Vercel): Vercel Blob when BLOB_READ_WRITE_TOKEN is set. Writes are immutable (new keys only) and
//   reads use list(), which is consistent across instances (no CDN staleness).
// - Local: JSON file (.data/store.json).
const fs = require('fs'), path = require('path');
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const FILE = process.env.STORE_FILE || path.join(__dirname, '..', '.data', 'store.json');
const rd = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { return { pairs: {}, ents: {} }; } };
const wr = (d) => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); };
const blob = useBlob ? require('@vercel/blob') : null;
const enc = (s) => encodeURIComponent(s).replace(/%/g, '_');
module.exports = {
  async putPair(code, token) {
    if (blob) return blob.put('pair/' + code + '/' + token + '.json', '{}', { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
    const d = rd(); d.pairs[code] = { token, created: Date.now() }; wr(d);
  },
  async getPair(code) { // -> {token} | null
    if (blob) { const r = await blob.list({ prefix: 'pair/' + code + '/', limit: 1 }); const b = r.blobs[0]; return b ? { token: b.pathname.split('/')[2].replace('.json', '') } : null; }
    const p = rd().pairs[code]; return p && Date.now() - p.created < 3600e3 ? p : null;
  },
  async addEnt(token, plan) {
    if (blob) return blob.put('ent/' + token + '/' + enc(plan) + '-' + Date.now() + '.json', '{}', { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
    const d = rd(); (d.ents[token] = d.ents[token] || []).push(plan); wr(d);
  },
  async listEnt(token) { // -> ['pack:wild-hearts','monthly',...]
    if (blob) { const r = await blob.list({ prefix: 'ent/' + token + '/' }); return r.blobs.map(b => decodeURIComponent(b.pathname.split('/')[2].replace(/-\d+\.json$/, '').replace(/_/g, '%'))); }
    return rd().ents[token] || [];
  }
};
