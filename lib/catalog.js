// Packs mirror app/data.js collections. PRICES ARE PLACEHOLDER PROPOSALS (mock mode only).
module.exports = {
  packs: {
    'sporting-life':   { label: 'Sporting Life Pack',    display: '$29 one-time (placeholder)' },
    'apres-ski-season':{ label: 'Après-Ski Season Pack', display: '$29 one-time (placeholder)' },
    'wild-hearts':     { label: 'Wild Hearts Pack',      display: '$29 one-time (placeholder)' },
    'high-altitude':   { label: 'High Altitude Pack',    display: '$29 one-time (placeholder)' }
  },
  memberships: {
    monthly: { label: 'Full Collection, Monthly', display: '$X.XX / month (placeholder)', priceEnv: 'STRIPE_PRICE_MONTHLY' },
    yearly:  { label: 'Full Collection, Yearly',  display: '$XX.XX / year (placeholder)', priceEnv: 'STRIPE_PRICE_YEARLY' }
  }
};
