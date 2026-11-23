const QR = require('qrcode'), u = require('../lib/util');
module.exports = async (req, res) => { u.cors(res); const code = (u.query(req).code||'').replace(/[^A-Z0-9]/gi,'');
  const svg = await QR.toString(u.baseUrl(req) + '/link?code=' + code, { type: 'svg', margin: 0, color: { dark: '#1a100cff', light: '#00000000' }, errorCorrectionLevel: 'M' });
  res.setHeader('Content-Type','image/svg+xml'); res.setHeader('Cache-Control','public, max-age=3600'); res.end(svg); };
